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
    if (status.files.length < 100) {
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

// Git has no last-edit timestamp for a checkout. Inspect only paths from status,
// including those beyond the UI's 100-file limit; do not walk clean/ignored files.
async function lastChange(root, paths, commit) {
  let latest = commit ? { time: commit.time, source: 'HEAD 提交' } : null
  const parents = new Map()
  await mapLimited(
    paths,
    async (relative) => {
      const file = path.join(root, relative)
      let time,
        source = '改动文件'
      try {
        time = (await lstat(file)).mtimeMs
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

export async function inspectTree(tree, commonDir) {
  if (tree.bare || tree.prunable) return tree
  try {
    const admin = await checkedAdmin(tree, commonDir)
    if (!admin) return { ...tree, error: '路径已不再指向登记的工作树' }
    // Operation markers are per checkout, not in the shared Git directory.
    const entries = new Set(await readdir(admin))
    const operations = []
    if (entries.has('rebase-merge')) operations.push('变基中')
    if (entries.has('rebase-apply')) operations.push('变基或应用补丁中')
    if (entries.has('MERGE_HEAD')) operations.push('合并中')
    if (entries.has('CHERRY_PICK_HEAD')) operations.push('拣选中')
    if (entries.has('REVERT_HEAD')) operations.push('还原提交中')
    if (entries.has('BISECT_START')) operations.push('二分查找中')
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
    return {
      ...tree,
      branch: status.branch,
      head: status.head,
      detached: !status.branch && !!status.head,
      status,
      commit,
      lastChange: await lastChange(tree.path, changedPaths, commit),
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

// 清理失效登记是面板唯一的 Git 写操作，只在用户确认后由独立路由调用。
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
  const file = status.files.find((f) => f.id === fileId)
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
    layer === 'index' &&
    !file.conflict &&
    file.xy !== '??' &&
    file.xy[0] !== '.'
  const working =
    layer === 'work' &&
    file.xy !== '??' &&
    (file.conflict || file.xy[1] !== '.')
  if (!staged && !working) return { note: '这一层没有可查看的改动。' }
  const paths = [file.path]
  if (file.from && 'RC'.includes(file.xy[staged ? 0 : 1])) paths.push(file.from)
  try {
    const patch = await git(
      tree.path,
      ...filters,
      '--literal-pathspecs',
      'diff',
      ...(staged ? ['--cached'] : []),
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
