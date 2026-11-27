import { createHash } from 'node:crypto'
import { constants } from 'node:fs'
import { devNull } from 'node:os'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { access, realpath, stat, readdir, open, lstat } from 'node:fs/promises'
import path from 'node:path'

const exec = promisify(execFile)
// 差异正文的读取上限：按字符数和行数各截一刀，超出的部分只告知「已截断」。
const previewBytes = 1024 * 1024
const previewLines = 4000
// 未跟踪的新文件没有 diff 可取，只能读原文：只读小文件。
const untrackedBytes = 128 * 1024
// 清单里最多列这么多文件。再多时（比如整个依赖目录被改动）只统计个数：
// 面板不至于被几千行拖住，缓存也存得下。
const FILE_LIMIT = 2000
// 「未推送」的范围里最多列这么多条提交（新的在前）。
const OUTGOING_COMMITS = 30
// No inherited repository overrides, interactive prompts, fsmonitor hooks, index
// refresh writes, or implicit network fetches for a partial clone.
const env = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')),
)
Object.assign(env, {
  GIT_OPTIONAL_LOCKS: '0',
  GIT_ALLOW_PROTOCOL: '',
  GIT_TERMINAL_PROMPT: '0',
  GIT_NO_LAZY_FETCH: '1',
  LC_ALL: 'C',
})

async function run(cwd, args) {
  return exec(
    'git',
    [
      '--no-optional-locks',
      '-c',
      'core.fsmonitor=false',
      '-c',
      `core.hooksPath=${devNull}`,
      '-c',
      'submodule.recurse=false',
      '-c',
      'core.untrackedCache=false',
      '-C',
      cwd,
      ...args,
    ],
    {
      env,
      encoding: 'utf8',
      timeout: 12000,
      maxBuffer: 8 * 1024 * 1024,
      windowsHide: true,
    },
  )
}

export async function git(cwd, ...args) {
  return (await run(cwd, args)).stdout
}

// 个别命令（如 worktree prune 的报告）只写 stderr：两个流合起来再筛。
async function report(cwd, args) {
  const { stdout, stderr } = await run(cwd, args)
  return [stdout, stderr].filter(Boolean).join('\n')
}

export async function mapLimited(values, fn, limit = 5) {
  const results = []
  let next = 0
  async function work() {
    while (next < values.length) {
      const index = next++
      results[index] = await fn(values[index])
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, values.length) }, work),
  )
  return results
}

// Do not walk into a replacement directory or up from a missing session cwd.
export async function checkoutOf(directory) {
  if (!path.isAbsolute(directory)) return null
  try {
    let here = await realpath(directory)
    if (!(await stat(here)).isDirectory()) return null
    while (here !== path.dirname(here)) {
      try {
        await access(path.join(here, '.git'))
        return here
      } catch {
        /* try parent */
      }
      if (here.endsWith('.git')) {
        try {
          await access(path.join(here, 'HEAD'))
          return here
        } catch {
          /* not bare */
        }
      }
      here = path.dirname(here)
    }
  } catch {
    /* moved or inaccessible */
  }
  return null
}

export function readWorktrees(text) {
  return text
    .split('\0\0')
    .filter(Boolean)
    .map((block, index) => {
      const row = {
        main: index === 0,
        locked: false,
        prunable: false,
        bare: false,
        detached: false,
      }
      for (const field of block.split('\0')) {
        const space = field.indexOf(' ')
        const key = space < 0 ? field : field.slice(0, space)
        const value = space < 0 ? '' : field.slice(space + 1)
        if (key === 'worktree') row.path = value
        if (key === 'HEAD') row.head = value
        if (key === 'branch') row.branch = value.replace(/^refs\/heads\//, '')
        if (['detached', 'locked', 'prunable', 'bare'].includes(key))
          row[key] = true
        if (value && ['locked', 'prunable'].includes(key))
          row[`${key}Reason`] = value
      }
      return row
    })
}

export function readStatus(text, changedPaths) {
  const status = {
    staged: 0,
    unstaged: 0,
    untracked: 0,
    conflicts: 0,
    total: 0,
    files: [],
    ahead: null,
    behind: null,
    upstream: null,
  }
  const records = text.split('\0')
  for (let i = 0; i < records.length; i++) {
    const line = records[i]
    if (!line) continue
    if (line.startsWith('# ')) {
      const [, key, ...words] = line.split(' ')
      const value = words.join(' ')
      if (key === 'branch.oid')
        status.head = value === '(initial)' ? null : value
      if (key === 'branch.head')
        status.branch = value === '(detached)' ? null : value
      if (key === 'branch.upstream') status.upstream = value
      if (key === 'branch.ab') {
        status.ahead = Number(words[0])
        status.behind = -Number(words[1])
      }
      continue
    }
    const kind = line[0]
    if (!['1', '2', 'u', '?'].includes(kind)) continue
    const xy = kind === '?' ? '??' : line.slice(2, 4)
    const fieldCount = { 1: 8, 2: 9, u: 10, '?': 1 }[kind]
    let offset = 0
    for (let field = 0; field < fieldCount; field++)
      offset = line.indexOf(' ', offset) + 1
    const file = { path: line.slice(offset), xy, conflict: kind === 'u' }
    if (kind === '2') file.from = records[++i]
    if (kind === 'u') status.conflicts++
    else if (kind === '?') status.untracked++
    else {
      if (xy[0] !== '.') status.staged++
      if (xy[1] !== '.') status.unstaged++
    }
    changedPaths?.push(file.path)
    status.total++
    if (status.files.length < FILE_LIMIT) {
      file.id = createHash('sha256')
        .update(JSON.stringify([file.path, file.from, xy]))
        .digest('hex')
        .slice(0, 32)
      status.files.push(file)
    }
  }
  return status
}

// Git status may invoke a configured clean/process driver. Never run a repository's
// external program just to display a dashboard. Refuse an inexact file snapshot
// if tracked files depend on it; repository/branch/session metadata remains usable.
async function safeFilters(cwd) {
  let names
  try {
    names = await git(
      cwd,
      'config',
      '--null',
      '--name-only',
      '--get-regexp',
      '^filter\\..*\\.(clean|process)$',
    )
  } catch (e) {
    if (e.code === 1) return []
    throw e
  }
  const drivers = [
    ...new Set(
      names
        .split('\0')
        .filter(Boolean)
        .map((key) => key.slice(7, key.lastIndexOf('.'))),
    ),
  ]
  if (drivers.some((name) => !/^[\w.-]+$/.test(name))) return null
  const options = drivers.flatMap((name) => [
    '-c',
    `filter.${name}.process=`,
    '-c',
    `filter.${name}.clean=`,
    '-c',
    `filter.${name}.required=false`,
  ])
  const filtered = await git(
    cwd,
    ...options,
    'ls-files',
    '-z',
    '--',
    ...drivers.map((n) => `:(attr:filter=${n})`),
  )
  return filtered ? null : options
}

// Never accept a checkout that moved, was replaced, or belongs to another repo.
export async function checkedAdmin(tree, commonDir) {
  if (tree.bare || tree.prunable) return null
  const [physical, root, common, admin] = await Promise.all([
    realpath(tree.path),
    checkoutOf(tree.path),
    git(tree.path, 'rev-parse', '--path-format=absolute', '--git-common-dir'),
    git(tree.path, 'rev-parse', '--absolute-git-dir'),
  ])
  return root === physical &&
    (await realpath(common.replace(/\n$/, ''))) === commonDir
    ? admin.replace(/\n$/, '')
    : null
}

async function fileStatus(cwd, filters, changedPaths) {
  return readStatus(
    await git(
      cwd,
      ...filters,
      'status',
      '--porcelain=v2',
      '-z',
      '--branch',
      '--ahead-behind',
      '--untracked-files=all',
      '--ignore-submodules=dirty',
      '--renames',
    ),
    changedPaths,
  )
}

async function creationRecord(cwd, name) {
  if (!name) return null
  // Use the oldest *surviving* entry only if it actually records creation. In
  // particular, the oldest remaining commit after reflog expiry is not a base.
  const log = await git(
    cwd,
    'reflog',
    'show',
    '--no-notes',
    '--format=%H%x00%gs',
    `refs/heads/${name}`,
  ).catch(() => '')
  const lines = log.trimEnd().split('\n')
  // A copied branch inherits another branch's reflog; its own copy event wins.
  for (const line of lines) {
    const [sha, message] = line.split('\0')
    const copy =
      /^Branch: copied refs\/heads\/(.+) to refs\/heads\/(.+)$/i.exec(
        message || '',
      )
    if (copy) return { sha, ref: copy[1], kind: 'copy' }
  }
  const [sha, message = ''] = lines.at(-1).split('\0')
  const created = /^branch: Created from (.+)$/i.exec(message)
  if (created) return { sha, ref: created[1], kind: 'create' }
  if (message.startsWith('commit (initial):')) return { sha, kind: 'initial' }
  return null
}

// 一个文件此刻的修改时间和大小（不是普通文件、读不到时是 null）。
async function fileMeta(root, relative) {
  const info = await lstat(path.join(root, relative)).catch(() => null)
  return info?.isFile()
    ? { mtime: Math.round(info.mtimeMs), size: info.size }
    : null
}

// Git has no last-edit timestamp for a checkout. Inspect only paths from status,
// including those beyond the UI's file-list limit; do not walk clean/ignored files.
// stats 传进来时，顺手记下每个改动文件此刻的修改时间和大小：面板的「已审阅」靠它们认出文件后来又改过。
async function lastChange(root, paths, commit, stats) {
  let latest = commit ? { time: commit.time, source: 'HEAD 提交' } : null
  const parents = new Map()
  await mapLimited(
    paths,
    async (relative) => {
      const file = path.join(root, relative)
      let time,
        source = '改动文件'
      try {
        const info = await lstat(file)
        time = info.mtimeMs
        if (stats && info.isFile())
          stats.set(relative, {
            mtime: Math.round(time),
            size: info.size,
          })
      } catch (e) {
        if (e.code !== 'ENOENT' && e.code !== 'ENOTDIR') return
        // Git doesn't record deletion time. The closest surviving directory gives
        // an estimate, not a timestamp of the deleted file itself.
        source = '删除路径的父目录（估算）'
        let dir = path.dirname(file)
        while (dir === root || dir.startsWith(root + path.sep)) {
          if (!parents.has(dir))
            parents.set(
              dir,
              lstat(dir).then(
                (s) => s.mtimeMs,
                () => null,
              ),
            )
          time = await parents.get(dir)
          if (time != null || dir === root) break
          dir = path.dirname(dir)
        }
      }
      if (time != null && (!latest || time > latest.time))
        latest = { time, source }
    },
    12,
  )
  return latest
}

// 每个文件相对 HEAD 的增删行数，清单上显示「+12 −3」。二进制、子模块记为 null。
// -z 格式：新增⇥删除⇥路径␀；重命名是 新增⇥删除⇥␀原路径␀新路径␀。
export function readNumstat(text) {
  const stats = new Map()
  const records = text.split('\0')
  const put = (path, add, del) => {
    if (path)
      stats.set(path, {
        add: add === '-' ? null : Number(add),
        del: del === '-' ? null : Number(del),
      })
  }
  for (let i = 0; i < records.length; i++) {
    const match = /^(\d+|-)\t(\d+|-)\t(.*)$/s.exec(records[i])
    if (!match) continue
    const [, add, del, path] = match
    if (path) put(path, add, del)
    else {
      put(records[i + 2], add, del)
      i += 2
    }
  }
  return stats
}

async function numstat(cwd, filters) {
  return readNumstat(
    await git(
      cwd,
      ...filters,
      '--literal-pathspecs',
      'diff',
      '--numstat',
      '-z',
      '--no-color',
      '--no-ext-diff',
      '--no-textconv',
      '--no-relative',
      '--no-notes',
      '--ignore-submodules=dirty',
      '--find-renames',
      'HEAD',
      '--',
    ).catch(() => ''),
  )
}

// 未跟踪文件没有 diff：小文件直接数行，更大的留给差异页按字节上限说明。
async function untrackedLines(root, relative) {
  try {
    const full = path.join(root, relative)
    // 与差异预览同一口径：不跟随符号链接，不读设备或非常规文件。
    const info = await lstat(full)
    if (!info.isFile() || info.size > untrackedBytes) return null
    if ((await realpath(path.dirname(full))) !== path.dirname(full)) return null
    const fd = await open(
      full,
      constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK,
    )
    try {
      const buffer = Buffer.alloc(info.size)
      const { bytesRead } = await fd.read(buffer, 0, buffer.length, 0)
      if (bytesRead !== info.size || buffer.includes(0)) return null
      const content = buffer.subarray(0, bytesRead).toString('utf8')
      return content
        ? content.split('\n').length - (content.endsWith('\n') ? 1 : 0)
        : 0
    } finally {
      await fd.close()
    }
  } catch {
    return null
  }
}

// Operation markers are per checkout, not in the shared Git directory.
export async function inProgress(admin) {
  const entries = new Set(await readdir(admin))
  const operations = []
  if (entries.has('rebase-merge')) operations.push('变基中')
  if (entries.has('rebase-apply')) operations.push('变基或应用补丁中')
  if (entries.has('MERGE_HEAD')) operations.push('合并中')
  if (entries.has('CHERRY_PICK_HEAD')) operations.push('拣选中')
  if (entries.has('REVERT_HEAD')) operations.push('还原提交中')
  if (entries.has('BISECT_START')) operations.push('二分查找中')
  return operations
}

export async function inspectTree(tree, commonDir) {
  if (tree.bare || tree.prunable) return tree
  try {
    const admin = await checkedAdmin(tree, commonDir)
    if (!admin) return { ...tree, error: '路径已不再指向登记的工作树' }
    const operations = await inProgress(admin)
    const filters = await safeFilters(tree.path)
    if (!filters)
      // 分支、目录和会话信息仍然可用，只是文件状态读不到；不当成读取失败。
      return {
        ...tree,
        operations,
        limited: '已跳过文件检查：跟踪文件依赖外部 Git 过滤器',
      }
    const hasSubmodules = await access(
      path.join(tree.path, '.gitmodules'),
    ).then(
      () => true,
      () => false,
    )
    const changedPaths = []
    const status = await fileStatus(tree.path, filters, changedPaths)
    // Use the status snapshot for HEAD as well: a branch can change after listing.
    let commit = null
    if (status.head) {
      const result = await git(
        tree.path,
        'show',
        '-s',
        '--no-show-signature',
        '--format=%ct%x00%s',
        status.head,
      ).catch(() => '')
      if (result) {
        const [time, title] = result.trimEnd().split('\0')
        commit = { time: Number(time) * 1000, title }
      }
    }
    const stats = status.total ? await numstat(tree.path, filters) : new Map()
    await mapLimited(
      status.files.filter((f) => f.xy === '??'),
      async (file) => {
        file.lines = await untrackedLines(tree.path, file.path)
      },
      8,
    )
    for (const file of status.files) {
      const entry = stats.get(file.path)
      if (entry) Object.assign(file, entry)
    }
    const touched = new Map()
    const last = await lastChange(tree.path, changedPaths, commit, touched)
    const work = new Map()
    for (const file of status.files) {
      const meta = touched.get(file.path)
      if (meta) Object.assign(file, meta)
      work.set(file.path, file)
    }
    // 有未推送的提交：再读一份和上游比的改动（未推送的提交，加上还没提交的）。读不到就不给这个范围。
    if (status.ahead > 0 && status.upstream) {
      status.outgoing = await outgoing(
        tree.path,
        filters,
        status.upstream,
        status.files.filter((f) => f.xy === '??'),
      ).catch(() => null)
      // 和上游比的清单里，工作目录里已经没有改动的文件也读一下修改时间和大小：面板的「已审阅」靠它们认文件。
      // 提交之后工作目录里又改过的文件带上同样的量，并标出来。
      for (const file of status.outgoing?.files ?? []) {
        const own = work.get(file.path)
        if (own && own !== file) {
          file.dirty = true
          const meta = touched.get(file.path)
          if (meta) Object.assign(file, meta)
        } else if (!own)
          Object.assign(
            file,
            (await fileMeta(tree.path, file.path).catch(() => null)) ?? {},
          )
      }
    }
    return {
      ...tree,
      branch: status.branch,
      head: status.head,
      detached: !status.branch && !!status.head,
      status,
      commit,
      lastChange: last,
      origin: await creationRecord(tree.path, status.branch),
      operations,
      hasSubmodules,
    }
  } catch (err) {
    const error = err.killed
      ? '读取超时'
      : err.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER'
        ? 'Git 输出超过读取上限'
        : '目录不可访问或 Git 状态读取失败'
    return { ...tree, error }
  }
}

// ---- 未推送的改动：和上游比 ----
// 上游的名字来自 Git 自己的输出（branch.upstream）。拼进版本表达式之前再挡一道会被当成写法的字符。
const refName = (name) =>
  typeof name === 'string' &&
  name.length > 0 &&
  name.length <= 250 &&
  !/^[-.]/.test(name) &&
  !/[\s\x00-\x1f\x7f~^:[\]?*\\]|\.\.|\/\.|@\{/.test(name)
const isSha = (value) =>
  typeof value === 'string' && /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/.test(value)

// 上游此刻在本地的记录（完整的提交号）。远端分支已经删了、或者读不到时是 null。
export async function upstreamCommit(cwd, upstream) {
  if (!refName(upstream)) return null
  const base = (
    await git(
      cwd,
      'rev-parse',
      '--verify',
      '--quiet',
      `refs/remotes/${upstream}^{commit}`,
    ).catch(() => '')
  ).trim()
  return isSha(base) ? base : null
}

// 解析 git diff --raw -z --numstat 的输出。前半是每个文件的原始记录：
//   :模式 模式 原对象 新对象 状态␀路径␀（重命名、复制在路径后面跟着原路径），
// 后半是同样顺序的增删行数。stats 是解析好的增删行数（按新路径取）。
export function readRaw(text) {
  const records = String(text ?? '').split('\0')
  const files = []
  let i = 0
  for (; records[i]?.[0] === ':'; i++) {
    const [, , , dst, status = ''] = records[i].split(' ')
    const st = status[0]
    const first = records[++i]
    const copied = st === 'R' || st === 'C'
    // 工作目录里的内容还没进索引时，Git 给的新对象是全零：没有可用的对象名。
    files.push({
      path: copied ? records[++i] : first,
      from: copied ? first : undefined,
      st,
      blob: /^0+$/.test(dst) ? null : dst,
    })
  }
  return { files, stats: readNumstat(records.slice(i).join('\0')) }
}

// 和 base（一个完整的提交号）相比，工作目录里哪些跟踪文件变了：新内容的对象名、增删行数。
export async function changedSince(cwd, filters, base) {
  if (!isSha(base)) return []
  const text = await git(
    cwd,
    ...filters,
    '--literal-pathspecs',
    'diff',
    '--raw',
    '-z',
    '--numstat',
    '--no-color',
    '--no-ext-diff',
    '--no-textconv',
    '--no-relative',
    '--no-notes',
    '--submodule=short',
    '--ignore-submodules=dirty',
    '--find-renames',
    '--abbrev=16',
    base,
    '--',
  )
  const { files, stats } = readRaw(text)
  return files.slice(0, FILE_LIMIT).map((file) => {
    const entry = stats.get(file.path)
    if (entry) Object.assign(file, entry)
    file.id = createHash('sha256')
      .update(JSON.stringify([file.path, file.from, 'outgoing', file.st]))
      .digest('hex')
      .slice(0, 32)
    return file
  })
}

// git log --format=%H%x1f%ct%x1f%s%x1e 的输出：提交号、提交时间、标题。
export function readCommits(text) {
  return String(text ?? '')
    .split('\x1e')
    .map((record) => record.trim().split('\x1f'))
    .filter(([id]) => isSha(id))
    .map(([id, time, ...title]) => ({
      sha: id,
      time: Number(time) * 1000,
      title: title.join('\x1f').replace(/[\x00-\x1f\x7f]/g, ' '),
    }))
}

// 未推送的改动：和上游比的文件清单（加上未跟踪的新文件）和未推送的提交。没有可用的上游时是 null。
export async function outgoing(cwd, filters, upstream, untracked = []) {
  const base = await upstreamCommit(cwd, upstream)
  if (!base) return null
  const [files, log] = await Promise.all([
    changedSince(cwd, filters, base),
    git(
      cwd,
      'log',
      `--max-count=${OUTGOING_COMMITS + 1}`,
      '--no-show-signature',
      // tformat：每条提交后面都跟一个记录结束符（format 是在提交之间换行）。
      '--pretty=tformat:%H%x1f%ct%x1f%s%x1e',
      `${base}..HEAD`,
    ).catch(() => ''),
  ])
  const listed = readCommits(log)
  const commits = listed.slice(0, OUTGOING_COMMITS)
  const all = [...files, ...untracked]
  return {
    base,
    ref: upstream,
    commits,
    // 提交多到列不完。
    more: listed.length > commits.length,
    files: all,
    total: all.length,
  }
}

export async function localBranches(common, mergedInto) {
  // Git ref names cannot contain a newline or NUL. %(subject) is single-line.
  const format =
    '%(refname:lstrip=2)%00%(objectname:short)%00%(committerdate:unix)%00%(upstream:short)%00%(upstream:track,nobracket)%00%(subject)'
  const text = await git(
    common,
    'for-each-ref',
    '--sort=-committerdate',
    `--format=${format}`,
    'refs/heads',
  )
  // 哪些分支已经完整并入主检出的当前分支。没有可参照的分支、或读不到，就不标，不推测。
  const merged = new Set(
    mergedInto
      ? (
          await git(
            common,
            'for-each-ref',
            '--format=%(refname:lstrip=2)',
            `--merged=${mergedInto}`,
            'refs/heads',
          ).catch(() => '')
        )
          .split('\n')
          .filter(Boolean)
      : [],
  )
  return text
    .trimEnd()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [name, head, timestamp, upstream, track, subject] = line.split('\0')
      const ahead = Number(/ahead (\d+)/.exec(track)?.[1] || 0)
      const behind = Number(/behind (\d+)/.exec(track)?.[1] || 0)
      return {
        name,
        head,
        time: Number(timestamp) * 1000,
        upstream,
        gone: track === 'gone',
        ahead,
        behind,
        subject,
        merged: name !== mergedInto && merged.has(name),
      }
    })
}

// 清理失效登记和下面的「与远端同步」是面板仅有的 Git 写操作，都只在用户确认后由独立路由调用。
// `git worktree prune` 只移除目录已经不存在的登记，锁定的不动，不删任何文件。
// prefix 用于主检出目录已经不在时改对公共 Git 目录执行（传 '--git-dir=.'）。
export async function prunePlan(cwd, ...prefix) {
  // 读不到就让它抛出去：路由据此报错，而不是把「读取失败」当成「没有可清理的」。
  const text = await report(cwd, [
    ...prefix,
    'worktree',
    'prune',
    '--dry-run',
    '--verbose',
  ])
  return text
    .split('\n')
    .map((line) => /^Removing (.+?): (.*)$/.exec(line))
    .filter(Boolean)
    .map(([, name, reason]) => ({
      name: name.replace(/^worktrees\//, ''),
      reason,
    }))
}
export async function pruneStale(cwd, ...prefix) {
  const text = await report(cwd, [...prefix, 'worktree', 'prune', '--verbose'])
  return text.split('\n').filter((line) => line.startsWith('Removing '))
}

// ---- 与远端同步：获取、拉取、推送 ----
// 面板里会联网的 Git 操作只有这三个，都是用户看过计划、确认之后才执行的。
// 读操作的环境禁用了全部传输协议；这里只放开 https、ssh 和本地路径，保留仓库自己的钩子
// （推送前的检查钩子必须照常跑），其余和读操作一样：不继承 Git 的环境变量、不弹交互提示。
const netEnv = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')),
)
Object.assign(netEnv, {
  GIT_TERMINAL_PROMPT: '0',
  GIT_OPTIONAL_LOCKS: '0',
  GIT_ALLOW_PROTOCOL: 'https:ssh:file',
  LC_ALL: 'C',
})
const NET_TIMEOUT = 180000

// 跑一条联网的 Git 命令。失败不抛：Git 的说明（被拒绝、没有权限、不能快进）要原样给用户看。
async function net(cwd, args, env = netEnv) {
  try {
    const { stdout, stderr } = await exec('git', ['-C', cwd, ...args], {
      env,
      encoding: 'utf8',
      timeout: NET_TIMEOUT,
      maxBuffer: 4 * 1024 * 1024,
      windowsHide: true,
    })
    return { ok: true, output: [stdout, stderr].filter(Boolean).join('\n') }
  } catch (e) {
    // 被超时杀掉时没有可用的输出。
    if (e.killed || e.signal) return { ok: false, output: '', timeout: true }
    if (typeof e.stdout === 'string' || typeof e.stderr === 'string')
      return {
        ok: false,
        output: [e.stdout, e.stderr].filter(Boolean).join('\n'),
      }
    throw e
  }
}

const declined = (reason) => ({ ok: false, reason })
// 操作名 → [界面上叫什么, 做什么]。顺序就是按钮的顺序。
export const SYNC_ACTIONS = {
  fetch: [
    '获取',
    '取回远端的最新记录。只更新远端分支的本地副本，不动你的文件和分支',
  ],
  pull: ['拉取', '取回远端更新，并把当前分支快进到远端。不能快进时什么都不改'],
  push: ['推送', '把当前分支的提交推到远端的同名分支。不强推'],
}

// 这棵工作树现在能不能拉取、推送，做的话会发生什么。只看本地记录，不联网。
// stamp 是这份计划的指纹：用户确认到执行之间本地记录变了，就拒绝执行，让他重新看一遍。
export async function syncPlan(tree, common) {
  const plan = {
    branch: null,
    upstream: null,
    remote: null,
    ahead: null,
    behind: null,
    dirty: 0,
    operations: [],
    push: null,
    pull: null,
    fetch: null,
    stamp: '',
  }
  const stop = (why) => ({
    ...plan,
    push: declined(why),
    pull: declined(why),
    fetch: declined(why),
    stamp: 'blocked',
  })
  if (tree.bare || tree.prunable) return stop('裸仓库或目录已不存在，不能同步')
  if (!(await checkedAdmin(tree, common).catch(() => null)))
    return stop('路径已不再指向登记的工作树')
  const cwd = tree.path
  const read = (...args) => git(cwd, ...args).catch(() => '')
  plan.branch = (
    await read('symbolic-ref', '--quiet', '--short', 'HEAD')
  ).trim()
  if (!plan.branch) return stop('当前停在某次提交上（分离 HEAD），不在分支上')
  const admin = await git(cwd, 'rev-parse', '--absolute-git-dir').catch(
    () => '',
  )
  plan.operations = admin
    ? await inProgress(admin.replace(/\n$/, '')).catch(() => [])
    : []
  const tracked = await read(
    'status',
    '--porcelain',
    '--untracked-files=no',
    '--ignore-submodules=dirty',
  )
  plan.dirty = tracked.split('\n').filter(Boolean).length
  plan.upstream = (
    await read(
      'rev-parse',
      '--abbrev-ref',
      '--symbolic-full-name',
      '@{upstream}',
    )
  ).trim()
  const remotes = (await read('remote')).trim().split('\n').filter(Boolean)
  // 配置里记着上游，但远端分支的本地引用已经没有了（远端分支被删）：ahead / behind 读不出来。
  const exists = async (ref) =>
    git(cwd, 'rev-parse', '--verify', '--quiet', ref)
      .then(() => true)
      .catch(() => false)
  const gone =
    !!plan.upstream && !(await exists(`refs/remotes/${plan.upstream}`))
  if (plan.upstream && !gone) {
    // 左边是只在上游里的提交（落后），右边是只在本地分支里的（未推送）。
    const counts = (
      await git(
        cwd,
        'rev-list',
        '--left-right',
        '--count',
        `${plan.upstream}...HEAD`,
      ).catch(() => '')
    ).trim()
    if (counts) {
      const [behind, ahead] = counts.split(/\s+/)
      plan.behind = Number(behind)
      plan.ahead = Number(ahead)
    }
  }
  // 上游写成「远端/分支」，分支名里也可能有斜杠（origin/feat/x）：远端名只到第一个斜杠。
  plan.remote = plan.upstream
    ? plan.upstream.slice(0, plan.upstream.indexOf('/'))
    : remotes.length === 1
      ? remotes[0]
      : null
  const busy = plan.operations.length
    ? `有操作还没做完（${plan.operations.join('、')}），先处理完再同步`
    : ''
  // 推送：固定推到远端的同名分支。没有上游时，远端只有一个才替用户选，否则让他先指定。
  if (busy) plan.push = declined(busy)
  else if (plan.ahead === 0) plan.push = declined('没有未推送的提交')
  else {
    const remote = plan.remote
    if (!remote)
      plan.push = declined(
        remotes.length
          ? '这个仓库有多个远端，分支又没有上游：请先在终端里用 git push -u 指定'
          : '这个仓库没有配置远端',
      )
    else
      plan.push = {
        ok: true,
        remote,
        branch: plan.branch,
        // 远端还没有这个分支的本地记录：这次推上去就建出来，顺带设为上游。
        create: !plan.upstream || gone,
      }
  }
  // 拉取：只做快进。本地和远端各有新提交时 Git 会拒绝，这里提前说清楚。
  if (busy) plan.pull = declined(busy)
  else if (!plan.upstream)
    plan.pull = declined('这个分支没有设置上游，不能拉取')
  else if (gone) plan.pull = declined(`上游 ${plan.upstream} 在远端已不存在`)
  else if (plan.ahead > 0 && plan.behind > 0)
    plan.pull = declined(
      '本地和远端各有对方没有的提交，不能快进：请在终端里合并或变基',
    )
  else plan.pull = { ok: true, behind: plan.behind }
  plan.fetch = plan.remote
    ? { ok: true, remote: plan.remote }
    : declined('这个仓库没有配置远端')
  plan.stamp = [plan.branch, plan.upstream, plan.ahead, plan.behind].join('|')
  return plan
}

// 执行用户确认过的计划。expect 是确认时看到的指纹，对不上就拒绝。
// 让路由按「把这句话原样给用户看」的方式报错。
const refuse = (message) => {
  throw Object.assign(Error(message), { status: 409, expose: true })
}

export async function syncRun(tree, common, action, expect, env) {
  if (!SYNC_ACTIONS[action])
    throw Object.assign(Error('unknown action'), { status: 400 })
  const name = action
  const plan = await syncPlan(tree, common)
  if (plan.stamp !== expect) refuse('状态和确认时不一样了，请重新确认')
  if (!plan[name]?.ok) refuse(plan[name]?.reason || '这项操作现在不能执行')
  const cwd = tree.path
  if (name === 'fetch')
    return net(
      cwd,
      ['fetch', '--no-recurse-submodules', plan.fetch.remote],
      env,
    )
  // --no-rebase：不管用户配置里 pull 是合并还是变基，这里只做快进。
  if (name === 'pull')
    return net(cwd, ['pull', '--ff-only', '--no-rebase', '--no-edit'], env)
  const { remote, branch, create } = plan.push
  return net(
    cwd,
    [
      'push',
      ...(create ? ['--set-upstream'] : []),
      remote,
      `HEAD:refs/heads/${branch}`,
    ],
    env,
  )
}

// 把 Git 的输出归成一句话。输出原文保留，和这句话一起给用户看。
export function syncResult(action, { ok, output = '', timeout }) {
  const text = String(output)
  const has = (re) => re.test(text)
  let head
  if (timeout) head = '超过 3 分钟没有完成，已停止等待（Git 可能还在后台运行）'
  else if (ok)
    head =
      action === 'fetch'
        ? has(/->/)
          ? '已取回远端的新记录'
          : '已获取，远端没有新内容'
        : action === 'pull'
          ? has(/Already up to date/)
            ? '已是最新，没有可快进的提交'
            : '已快进到远端最新'
          : has(/\[new branch\]/)
            ? '已在远端创建分支并推送'
            : '已推送'
  else if (has(/Not possible to fast-forward/))
    head = '本地和远端分叉了，没有快进：请在终端里合并或变基'
  else if (has(/would be overwritten by/))
    head = '未提交的改动和远端更新冲突：先提交或暂存（stash）这些文件'
  else if (has(/fetch first|non-fast-forward/))
    head =
      action === 'push'
        ? '远端有本地没有的提交，推送被拒绝：先拉取，再推送'
        : '本地和远端分叉了，没有快进'
  else if (
    has(
      /Permission to .* denied|Authentication failed|could not read Username|Permission denied \(publickey\)|invalid credentials|HTTP 40[13]/,
    )
  )
    head = '远端拒绝了身份：请确认登录状态或密钥（可以先在终端里推一次试试）'
  else if (has(/protected branch|pre-receive hook declined|remote rejected/))
    head = '远端拒绝了这次推送：受保护的分支，或服务端检查没有通过'
  else if (action === 'push' && has(/hook|rejected|failed to push/))
    head = '推送没有完成：被仓库的钩子或远端拒绝'
  else head = '没有完成，下面是 Git 的输出'
  return {
    ok: !!ok && !timeout,
    head,
    output: text.replace(/\s+$/, '').slice(-2400),
  }
}

// Only expose a bounded patch for a file still reported by Git. The caller supplies
// opaque IDs, never a path or a revision. A refreshed index may invalidate a click.
function clipped(text) {
  const lines = text.slice(0, previewBytes).split('\n')
  if (lines.at(-1) === '') lines.pop()
  return {
    text: lines.slice(0, previewLines).join('\n'),
    truncated: text.length > previewBytes || lines.length > previewLines,
  }
}

async function untrackedPreview(root, relative) {
  const full = path.join(root, relative)
  // Do not follow links, read devices or enter an untracked nested repository.
  if ((await realpath(path.dirname(full))) !== path.dirname(full))
    return { note: '路径包含符号链接，不读取内容。' }
  const info = await lstat(full)
  if (!info.isFile()) return { note: '不是普通文件，不读取内容。' }
  const fd = await open(
    full,
    constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK,
  )
  try {
    const opened = await fd.stat()
    if (
      !opened.isFile() ||
      opened.dev !== info.dev ||
      opened.ino !== info.ino ||
      (await realpath(full)) !== full
    )
      return { note: '文件已变化，请刷新。' }
    if (opened.size > untrackedBytes)
      return { note: '新文件超过 128 KiB，不读取内容。' }
    const buffer = Buffer.alloc(opened.size + 1)
    const { bytesRead } = await fd.read(buffer, 0, buffer.length, 0)
    if (bytesRead !== opened.size) return { note: '文件已变化，请刷新。' }
    const bytes = buffer.subarray(0, bytesRead)
    let text
    try {
      text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    } catch {
      return { note: '非 UTF-8 文本，不展示内容。' }
    }
    if (text.includes('\0')) return { note: '二进制文件，不展示内容。' }
    if (!text) return { note: '空文件（0 字节）。' }
    return clipped(
      text
        .replace(/\n$/, '')
        .split('\n')
        .map((line) => '+' + line)
        .join('\n'),
    )
  } finally {
    await fd.close()
  }
}

export async function filePatch(tree, common, fileId, layer) {
  if (!(await checkedAdmin(tree, common)))
    return { note: '工作树已变化，请刷新。' }
  const filters = await safeFilters(tree.path)
  if (!filters) return { note: '此工作树依赖外部 Git 过滤器，不读取差异。' }
  const status = await fileStatus(tree.path, filters)
  // 「未推送」的范围：文件得还在和上游比的清单里。比较基准是上游现在的提交，这里重新读，不收面板传来的版本号。
  const base =
    layer === 'outgoing' && status.upstream && status.ahead > 0
      ? await upstreamCommit(tree.path, status.upstream)
      : null
  const file = base
    ? (await changedSince(tree.path, filters, base)).find(
        (f) => f.id === fileId,
      )
    : status.files.find((f) => f.id === fileId)
  if (!file) return { note: '文件状态已变化，请刷新工作树。' }
  if (
    [file.path, file.from]
      .filter(Boolean)
      .some((p) => path.isAbsolute(p) || p.split('/').includes('..'))
  )
    return { note: '无效的工作树相对路径。' }
  if (file.xy === '??' && layer === 'new')
    return untrackedPreview(await realpath(tree.path), file.path)
  const staged =
    !base &&
    layer === 'index' &&
    !file.conflict &&
    file.xy !== '??' &&
    file.xy[0] !== '.'
  const working =
    !base &&
    layer === 'work' &&
    file.xy !== '??' &&
    (file.conflict || file.xy[1] !== '.')
  if (!base && !staged && !working) return { note: '这一层没有可查看的改动。' }
  const paths = [file.path]
  // 重命名（和上游比的清单里原路径直接带着）要把原路径一起带上，差异里才看得出改名。
  if (file.from && (base || 'RC'.includes(file.xy[staged ? 0 : 1])))
    paths.push(file.from)
  try {
    const patch = await git(
      tree.path,
      ...filters,
      '--literal-pathspecs',
      'diff',
      ...(staged ? ['--cached'] : base ? [base] : []),
      '--no-color',
      '--no-ext-diff',
      '--no-textconv',
      '--no-relative',
      '--no-notes',
      '--submodule=short',
      '--ignore-submodules=dirty',
      '--find-renames',
      '--patch',
      '--',
      ...paths,
    )
    if (!patch) return { note: '没有可显示的差异，文件可能已变化。' }
    return clipped(patch)
  } catch (e) {
    if (e.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER')
      return { note: '差异超过 Git 输出上限，未展示。' }
    throw e
  }
}
