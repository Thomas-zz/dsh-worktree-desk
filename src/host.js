import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { realpath, stat } from 'node:fs/promises'
import { checkedAdmin, filePatch, git, prunePlan, pruneStale } from './git.js'
import { details, inventory, listTrees, pathKey, summary } from './inventory.js'

export const inject = ['connection', 'workspaceRegistry', 'sessionController']

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
  register('catalog', async (query) =>
    summary(await current(query.get('refresh') === '1')),
  )
  register('repository', async (query) => {
    const state = await current(false)
    if (cachedFor !== state.time) {
      cache.clear()
      cachedFor = state.time
    }
    const repo = state.repos.find((r) => r.id === query.get('id'))
    if (!repo) fail('unknown repository', 404)
    const key = repo.id
    const hit = cache.get(key)
    if (hit && Date.now() - hit.at < DETAIL_TTL) return hit.value
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
  // Forge reads the workingDirectory projection for this session, not the
  // immutable initial cwd. Recheck it on click, not just at catalog time.
  register('native-session', async (query) => {
    const { tree, repo, state } = await target(query)
    if (!(await checkedAdmin(tree, repo.common).catch(() => null)))
      return { sessionId: null }
    const root = await realpath(tree.path)
    const known = state.sessionsByRoot.get(root)
    const preferred = query.get('current')
    const archived = new Set(ctx.workspaceRegistry.archivedSessionIds ?? [])
    const { items } = await ctx.sessionController.list(
      {},
      AbortSignal.timeout(10000),
    )
    const candidates = items.filter(
      (s) =>
        !archived.has(s.sessionId) &&
        (s.sessionId === preferred || known?.has(`DSH:${s.sessionId}`)),
    )
    candidates.sort(
      (a, b) =>
        Number(b.sessionId === preferred) - Number(a.sessionId === preferred) ||
        b.updatedAt - a.updatedAt,
    )
    for (const candidate of candidates) {
      const directory = candidate.projections?.values?.workingDirectory
      if (!directory) continue
      const actual = await git(directory, 'rev-parse', '--show-toplevel')
        .then((result) => realpath(result.replace(/\n$/, '')))
        .catch(() => null)
      if (actual === root) return { sessionId: candidate.sessionId }
    }
    return { sessionId: null }
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
