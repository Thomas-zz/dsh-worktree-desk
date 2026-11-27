import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { realpath, stat } from 'node:fs/promises'
import {
  checkedAdmin,
  filePatch,
  git,
  prunePlan,
  pruneStale,
  syncPlan,
  syncResult,
  syncRun,
} from './git.js'
import { readReview } from './review.js'
import { PROMPT_MAX, promptFile, readPrompt, writePrompt } from './prompts.js'
import { details, inventory, listTrees, pathKey, summary } from './inventory.js'

export const inject = ['connection', 'workspaceRegistry', 'sessionController']

// 这一份宿主代码提供的能力。面板的前端一构建就生效，宿主代码要重启 DSH 才换；
// 两边版本不一致的那段时间，面板据此不显示宿主还做不到的操作，而不是点了报错。
const FEATURES = ['sync', 'review', 'prompt']

// 同一份发现快照内，仓库详情在短时间内复用：面板在「全部仓库」与单个仓库之间切换时不必重读。
const DETAIL_TTL = 15000
// expose 为真时把这句话原样交给面板显示；其余只返回通用提示，不泄露内部细节。
const fail = (message, status, expose = false) => {
  throw Object.assign(Error(message), { status, expose })
}

export function apply(ctx, config = {}) {
  let snapshot, discovery
  const pending = new Map()
  const cache = new Map()
  let cachedFor = null
  // 正在执行获取 / 拉取 / 推送的工作树：同一个目录不能同时跑两个。
  const syncing = new Set()
  // 哪些会话是面板发起的代码审查：看一次会话头就够了。
  const reviewSessions = new Map()
  async function current(refresh) {
    if (
      !discovery &&
      (!snapshot || refresh || Date.now() - snapshot.time > 60000)
    ) {
      discovery = inventory(ctx, config)
        .then((result) => (snapshot = result))
        .finally(() => {
          discovery = null
        })
    }
    return discovery ?? snapshot
  }
  // The host authenticates these exact routes and rejects non-owner peers. No
  // browser-supplied path or Git arguments are accepted, even from the owner.
  function register(name, read, method = 'GET', action) {
    ctx.connection.fetch.register({
      path: `/api/worktree-desk/${name}`,
      methods: [method],
      requestBody: 'buffered',
      async fetch(request) {
        try {
          // 写操作和外部导航只响应面板自己发出的带标记请求。
          if (action && request.headers.get('X-Worktree-Action') !== action)
            fail('unsupported action', 403)
          const query = new URL(request.url).searchParams
          const result = await read(query, request)
          return Response.json(result, {
            headers: { 'Cache-Control': 'no-store' },
          })
        } catch (error) {
          ctx.logger?.warn?.(
            `worktree-desk: ${name} (${error.status || error.code || 500})`,
          )
          return Response.json(
            {
              error:
                error.status === 404
                  ? '目标已不在当前清单中，请刷新'
                  : error.expose
                    ? error.message
                    : name === 'open-session'
                      ? '无法打开会话，可复制 ID 后在原工具中定位。'
                      : 'Git 或宿主数据读取失败，请刷新重试',
            },
            {
              status: error.status || 500,
              headers: { 'Cache-Control': 'no-store' },
            },
          )
        }
      },
    })
  }
  register('catalog', async (query) => ({
    ...summary(await current(query.get('refresh') === '1')),
    features: FEATURES,
  }))
  register('repository', async (query) => {
    const state = await current(false)
    if (cachedFor !== state.time) {
      cache.clear()
      cachedFor = state.time
    }
    const repo = state.repos.find((r) => r.id === query.get('id'))
    if (!repo) fail('unknown repository', 404)
    const key = repo.id
    // 刚拉取或推送过：不用这份缓存，重读。
    if (query.get('fresh') === '1') cache.delete(key)
    const read = () => {
      if (!pending.has(key))
        pending.set(
          key,
          details(repo, state)
            .then((data) => {
              const value = {
                ...data,
                codexNavigation: process.platform === 'darwin',
              }
              cache.set(key, { value, at: Date.now() })
              return value
            })
            .finally(() => pending.delete(key)),
        )
      return pending.get(key)
    }
    const hit = cache.get(key)
    const value =
      hit && Date.now() - hit.at < DETAIL_TTL ? hit.value : await read()
    // 这个仓库有没有自己的审查提示词。文件小、又可能被直接改：每次都看一眼，不进上面的缓存。
    return {
      ...value,
      reviewPrompt: !!(await readPrompt(repo.common).catch(() => '')),
    }
  })
  async function target(query) {
    const state = await current(false)
    const repo = state.repos.find((r) => r.id === query.get('id'))
    const tree =
      repo &&
      (await listTrees(repo.common)).find(
        (t) => pathKey(t.path) === query.get('tree'),
      )
    if (!tree) fail('unknown checkout', 404)
    return { state, repo, tree }
  }
  register('patch', async (query) => {
    const { repo, tree } = await target(query)
    return filePatch(tree, repo.common, query.get('file'), query.get('layer'))
  })
  // 这个未归档的 DSH 会话的工作目录是不是 root：每次都重新核对，不按发现清单时的记录放行。
  // 工作目录优先取会话自己的投影（会话里换过目录的话以它为准）。会话跑完之后宿主列表里不一定还带着投影，
  // 这时用会话头里记的目录——面板发起审查时就是按这个目录建的会话。
  async function sessionAt(root, sessionId) {
    const archived = new Set(ctx.workspaceRegistry.archivedSessionIds ?? [])
    const { items } = await ctx.sessionController.list(
      {},
      AbortSignal.timeout(10000),
    )
    const session = items.find(
      (s) => s.sessionId === sessionId && !archived.has(s.sessionId),
    )
    const directory =
      session?.projections?.values?.workingDirectory || session?.cwd
    if (!directory) return false
    const actual = await git(directory, 'rev-parse', '--show-toplevel')
      .then((result) => realpath(result.replace(/\n$/, '')))
      .catch(() => null)
    return actual === root
  }

  // 获取 / 拉取 / 推送分两步：先出计划给用户看（GET），确认后执行（POST）。
  // 执行时带上确认时看到的计划指纹；期间本地记录变了就拒绝，让面板重新出计划。
  register('sync-plan', async (query) => {
    const { tree, repo } = await target(query)
    return syncPlan(tree, repo.common)
  })
  register(
    'sync',
    async (query) => {
      const { tree, repo } = await target(query)
      if (syncing.has(tree.path))
        fail('这个工作树正在执行另一个操作，请等它结束', 409, true)
      syncing.add(tree.path)
      try {
        const op = query.get('op')
        const value = syncResult(
          op,
          await syncRun(tree, repo.common, op, query.get('expect')),
        )
        if (value.ok) cache.delete(repo.id)
        return value
      } finally {
        syncing.delete(tree.path)
      }
    },
    'POST',
    'sync',
  )

  // 这个仓库自己配的审查提示词（见 prompts.js）。没配过是空串。
  register('review-prompt', async (query) => {
    const state = await current(false)
    const repo = state.repos.find((r) => r.id === query.get('id'))
    if (!repo) fail('unknown repository', 404)
    return {
      prompt: await readPrompt(repo.common),
      file: promptFile(repo.common),
      max: PROMPT_MAX,
    }
  })
  // 存这个仓库的审查提示词。正文是 { prompt }：空串就是删掉（回到默认的）。
  register(
    'set-review-prompt',
    async (query, request) => {
      const state = await current(false)
      const repo = state.repos.find((r) => r.id === query.get('id'))
      if (!repo) fail('unknown repository', 404)
      const body = await request.json().catch(() => null)
      if (!body || typeof body.prompt !== 'string')
        fail('请求的内容不对', 400, true)
      const prompt = await writePrompt(repo.common, body.prompt)
      return { prompt, file: promptFile(repo.common), max: PROMPT_MAX }
    },
    'POST',
    'prompt',
  )

  // 面板发起的代码审查：结果在审查会话的最后一条回复里。会话必须属于这棵工作树。
  register('review', async (query) => {
    const { tree, repo } = await target(query)
    const id = query.get('session')
    // 会话编号格式不对、或者这个会话的工作目录不是这棵树：告诉面板「找不到」，不让它去读别的会话。
    if (
      // 会话编号是不透明的字符串（现在是 session- 加一串十六进制），这里只挡明显不是编号的；真伪由 sessionAt 核对。
      !/^[\w-]{6,96}$/.test(id) ||
      !(await checkedAdmin(tree, repo.common).catch(() => null)) ||
      !(await sessionAt(await realpath(tree.path), id))
    )
      return { known: true, missing: true }
    try {
      return await readReview(ctx.sessionController, id, reviewSessions)
    } catch (error) {
      // 会话记录本身读不了（被占用、格式要迁移）：说成「没读成」，不要说成「找不到会话」。
      const code = error?.code ?? error?.name
      return code === 'session/not-found'
        ? { known: true, missing: true }
        : { known: true, problem: '审查会话的记录暂时读不了，稍后再试' }
    }
  })

  // 清理失效登记分两步：先预览（GET），用户确认后再执行（POST）。
  // 执行时带上确认时看到的条数；期间登记发生变化就拒绝，让面板重新确认。
  async function pruneSite(repo) {
    const seed = (await stat(repo.root).catch(() => null))?.isDirectory()
    // 主检出目录已经不在时，直接对公共 Git 目录执行。
    return seed ? [repo.root] : [repo.common, '--git-dir=.']
  }
  register('prune-plan', async (query) => {
    const state = await current(false)
    const repo = state.repos.find((r) => r.id === query.get('id'))
    if (!repo) fail('unknown repository', 404)
    const entries = await prunePlan(...(await pruneSite(repo)))
    // 锁定的登记即使目录没了 Git 也不清，对话框里不列。
    const trees = (await listTrees(repo.common)).filter(
      (t) => t.prunable && !t.locked,
    )
    return { entries, trees }
  })
  register(
    'prune',
    async (query) => {
      const state = await current(false)
      const repo = state.repos.find((r) => r.id === query.get('id'))
      if (!repo) fail('unknown repository', 404)
      const site = await pruneSite(repo)
      const entries = await prunePlan(...site)
      if (Number(query.get('expect')) !== entries.length)
        fail('待清理的登记已经变化，请重新确认', 409, true)
      if (!entries.length) return { removed: [] }
      return { removed: await pruneStale(...site) }
    },
    'POST',
    'prune',
  )

  // Only open an address minted from a known local session/checkout.
  register(
    'open-session',
    async (query) => {
      if (process.platform !== 'darwin') fail('unsupported navigation', 403)
      const { tree, state } = await target(query)
      const id = query.get('session')
      const rows = state.sessionsByRoot.get(await realpath(tree.path))
      if (query.get('source') === 'ZCode') {
        const session = rows?.get(`ZCode:${id}`)
        if (!session) fail('unknown session', 404)
        // ZCode's supported URI opens a workspace, not a specific desktop task.
        const workspace =
          session.workspace &&
          (await stat(session.workspace).catch(() => null))?.isDirectory()
        const url = new URL('zcode://workspace/open')
        if (workspace) url.searchParams.set('path', session.workspace)
        await promisify(execFile)(
          '/usr/bin/open',
          workspace ? [url.href] : ['-a', 'ZCode'],
          { timeout: 5000 },
        )
        return { dispatched: true, workspace: !!workspace }
      }
      if (
        (query.has('source') && query.get('source') !== 'Codex') ||
        !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id) ||
        !rows?.has(`Codex:${id}`)
      )
        fail('unknown session', 404)
      await promisify(execFile)('/usr/bin/open', [`codex://threads/${id}`], {
        timeout: 5000,
      })
      return { dispatched: true }
    },
    'POST',
    'navigate',
  )

  // 宿主自带的「在应用中打开」不可用时的兜底：只认固定的两个目标，路径取自清单里登记的工作树。
  register(
    'open-folder',
    async (query) => {
      if (process.platform !== 'darwin') fail('unsupported platform', 403)
      const { tree } = await target(query)
      const root = await realpath(tree.path).catch(() => null)
      if (!root) fail('unknown checkout', 404)
      const destination = query.get('target')
      const args =
        destination === 'terminal'
          ? ['-a', 'Terminal', root]
          : destination === 'finder'
            ? ['-R', root]
            : fail('unknown target', 400)
      await promisify(execFile)('/usr/bin/open', args, { timeout: 5000 })
      return { dispatched: true }
    },
    'POST',
    'open',
  )
}
