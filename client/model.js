// 工作树的状态分类、筛选、排序与文件分组。纯函数，不依赖 React，可在 node 下直接测试。

// 互斥的主状态。rank 越小越需要关注；同一 rank 内再按会话活跃度和最近改动排。
// 失效登记排在干净之后：它们不需要处理工作，只在清理时才看。
export function signal(t) {
  const s = t.status
  if (t.prunable)
    return { key: 'stale', rank: 8, tone: 'muted', label: '登记失效' }
  if (s?.conflicts)
    return {
      key: 'conflict',
      rank: 0,
      tone: 'danger',
      label: `${s.conflicts} 个冲突`,
    }
  if (t.operations?.length)
    return {
      key: 'operation',
      rank: 1,
      tone: 'danger',
      label: t.operations.join(' · '),
    }
  if (t.error)
    return {
      key: 'error',
      rank: 2,
      tone: 'danger',
      label: t.limited ? '未检查文件' : '读取失败',
    }
  if (s?.total)
    return { key: 'dirty', rank: 3, tone: 'warn', label: `${s.total} 项改动` }
  if (s?.ahead > 0)
    return {
      key: 'ahead',
      rank: 4,
      tone: 'accent',
      label: `${s.ahead} 个提交未推送`,
    }
  if (s?.behind > 0)
    return {
      key: 'behind',
      rank: 5,
      tone: 'muted',
      label: `落后 ${s.behind} 个提交`,
    }
  if (!s) return { key: 'unknown', rank: 6, tone: 'muted', label: '无文件状态' }
  return { key: 'clean', rank: 7, tone: 'clean', label: '干净' }
}

export const TOOLS = ['Codex', 'ZCode', 'DSH']
export const toolLabel = (name) => (name === 'ZCode' ? 'ZCode' : name)

// 未归档会话的最近更新时间；没有则为 0。
export function sessionActivity(t) {
  let latest = 0
  for (const s of t.sessions ?? [])
    if (!s.archived && s.time > latest) latest = s.time
  return latest
}

export function compareTrees(a, b, byAttention = true) {
  if (byAttention) {
    const rank = signal(a).rank - signal(b).rank
    if (rank) return rank
    const activity = sessionActivity(b) - sessionActivity(a)
    if (activity) return activity
  }
  return (
    (b.lastChange?.time ?? -Infinity) - (a.lastChange?.time ?? -Infinity) ||
    a.path.localeCompare(b.path)
  )
}

export const FILTERS = {
  all: ['全部', () => true],
  dirty: ['有改动', (t) => t.status?.total > 0],
  unpushed: ['有未推送', (t) => t.status?.ahead > 0],
  behind: ['落后上游', (t) => t.status?.behind > 0],
  trouble: ['异常', (t) => signal(t).rank <= 2],
  stale: ['失效登记', (t) => !!t.prunable],
}

// 近期有会话在动：DSH 采样时运行中，或任一会话在 withinMs 内更新过（不含已归档）。
export const recentSession = (t, now, withinMs = 30 * 60 * 1000) =>
  (t.sessions ?? []).some(
    (s) => !s.archived && (s.running || s.time > now - withinMs),
  )

// 仓库层面的关注摘要：给侧栏和分组头用。
export function repoSummary(trees) {
  const counts = { dirty: 0, unpushed: 0, behind: 0, trouble: 0, stale: 0 }
  for (const t of trees) {
    if (FILTERS.dirty[1](t)) counts.dirty++
    if (FILTERS.unpushed[1](t)) counts.unpushed++
    if (FILTERS.behind[1](t)) counts.behind++
    if (FILTERS.trouble[1](t)) counts.trouble++
    if (FILTERS.stale[1](t)) counts.stale++
  }
  return counts
}

export function countFilter(trees, key) {
  const test = FILTERS[key]?.[1]
  if (!test) return trees.length
  let n = 0
  for (const t of trees) if (test(t)) n++
  return n
}

// 名称：分离 HEAD 用短哈希，取不到提交也给出可读的占位。
export function treeName(t) {
  if (t.bare) return '裸仓库'
  if (t.branch) return t.branch
  return t.head?.slice(0, 8) || '分支未知'
}
export const isDetached = (t) => !t.branch && !!t.head && !t.bare

export function relTime(time, now = Date.now()) {
  if (!Number.isFinite(time)) return '时间未知'
  const diff = now - time
  const date = new Date(time)
  const clock = date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  if (diff < 60 * 1000) return '刚刚'
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 12 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} 小时前`
  const day = date.toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
  })
  if (diff < 7 * 24 * 60 * 60 * 1000) return `${day} ${clock}`
  return `${date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric' })}`
}

export function fullTime(time) {
  return Number.isFinite(time)
    ? new Date(time).toLocaleString('zh-CN', { hour12: false })
    : '时间未知'
}

export const lower = (s) => (s || '').toLocaleLowerCase()
// 多个空白分隔的关键词须全部命中，任一字段命中即可。
export function match(needle, ...fields) {
  const words = lower(needle).trim().split(/\s+/).filter(Boolean)
  if (!words.length) return true
  const hay = lower(fields.filter(Boolean).join('\n'))
  return words.every((word) => hay.includes(word))
}

export const homeTilde = (p, home) =>
  home && p === home
    ? '~'
    : p.startsWith(home + '/')
      ? '~/' + p.slice(home.length + 1)
      : p

// 把文件按目录归并；只有单个子目录的链合成一段，深包路径不再刷屏。
export function groupFiles(files) {
  const root = { files: [], dirs: new Map() }
  for (const file of files) {
    const parts = file.path.split('/')
    let node = root
    for (const part of parts.slice(0, -1)) {
      if (!node.dirs.has(part))
        node.dirs.set(part, { files: [], dirs: new Map() })
      node = node.dirs.get(part)
    }
    node.files.push(file)
  }
  const byPath = (a, b) => a.path.localeCompare(b.path)
  function compact(node, name) {
    if (!node.files.length && node.dirs.size === 1) {
      const [part, child] = [...node.dirs][0]
      return compact(child, name + part + '/')
    }
    const dirs = [...node.dirs]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([part, child]) => compact(child, part + '/'))
    const own = [...node.files].sort(byPath)
    const count = own.length + dirs.reduce((sum, d) => sum + d.count, 0)
    return { name, dirs, files: own, count }
  }
  const top = compact(root, '')
  return { dirs: top.dirs, files: top.files, count: top.count }
}

// 文件行的紧凑标记：字母徽标 + 短说明（行内）+ 完整说明（悬停）。已暂存为实心、未暂存为空心。
const ACTION = {
  A: '新增',
  M: '修改',
  D: '删除',
  R: '重命名',
  C: '复制',
  T: '类型变化',
}
const action = (code) => ACTION[code] || code
export function fileBadge(file) {
  if (file.conflict)
    return {
      code: 'U',
      text: '冲突',
      detail: '合并冲突，尚未解决',
      staged: false,
      tone: 'danger',
    }
  if (file.xy === '??')
    return {
      code: '?',
      text: '未跟踪',
      detail: '新文件，尚未加入 Git',
      staged: false,
      tone: 'untracked',
    }
  const [index, worktree] = file.xy
  const staged = index !== '.'
  const unstaged = worktree !== '.'
  const rename = file.from ? `（原 ${file.from}）` : ''
  let text, detail
  if (staged && unstaged) {
    text = '已暂存，又有改动'
    detail = `${action(index)}已暂存${rename}；之后又${action(worktree)}，未暂存`
  } else if (staged) {
    text = '已暂存'
    detail = `${action(index)}${rename}，已暂存`
  } else {
    text = action(worktree) + rename
    detail = `${action(worktree)}${rename}，未暂存`
  }
  return {
    code: staged && unstaged ? index + worktree : staged ? index : worktree,
    text,
    detail,
    staged,
    tone: staged ? 'staged' : 'unstaged',
  }
}

// 分支名里的工单号：同一需求在多个仓库的工作树据此同色，也能一键筛出来。
// 优先认「前缀-数字」（DEMO-10431），否则取第一段 4–6 位数字（7001）；日期那样的 8 位数不算。
const PALETTE = [
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#0d9488',
  '#0891b2',
  '#7c8db5',
]
export function ticketOf(name) {
  const text = String(name ?? '')
  const prefixed = /(?<![A-Za-z])([A-Za-z]{1,10})-(\d{2,7})(?!\d)/.exec(text)
  const number = prefixed
    ? prefixed[2]
    : /(?<!\d)(\d{4,6})(?!\d)/.exec(text)?.[1]
  if (!number) return null
  const digits = Number(number)
  return {
    key: prefixed ? `${prefixed[1].toUpperCase()}-${number}` : number,
    color: PALETTE[digits % PALETTE.length],
  }
}

// Git 对「为什么可清理」的说明是英文短语，这里换成用户看得懂的说法。
const STALE_REASONS = [
  [
    'gitdir file points to non-existent location',
    '工作树的 .git 文件指向的 Git 目录已不存在',
  ],
  ['.git points to non-existent location', '.git 指向的 Git 目录已不存在'],
  ['gitdir file does not exist', '工作树目录里没有 .git 文件'],
  ['not a valid directory', '登记的路径不是一个目录'],
  ['unable to read gitdir file', '读不到工作树的 .git 文件'],
  ['.git is not a file', '.git 不是文件'],
]
export function staleReason(tree) {
  const reason = tree.prunableReason || ''
  return STALE_REASONS.find(([text]) => reason.includes(text))?.[1] ?? reason
}

// 「安静」指只有一棵主检出、没有改动、也没有未归档会话的仓库：全部视图里默认折叠它们。
export function isQuiet(trees) {
  return (
    trees?.length === 1 &&
    trees[0].main &&
    !trees[0].prunable &&
    !trees[0].error &&
    !trees[0].operations?.length &&
    signal(trees[0]).key === 'clean' &&
    !trees[0].tools?.length
  )
}

// 给每个仓库的匹配结果排出展示顺序。
// attention：最需要关注的排前（冲突、改动、未推送……），其余按最近改动；recent：纯按最近改动。
export function arrange(entries, sort) {
  const rank = (entry) => Math.min(...entry.live.map((t) => signal(t).rank), 99)
  const recent = (entry) =>
    Math.max(...entry.live.map((t) => t.lastChange?.time ?? 0), 0)
  return [...entries].sort(
    (a, b) =>
      (sort === 'attention' ? rank(a) - rank(b) : 0) ||
      recent(b) - recent(a) ||
      a.repo.name.localeCompare(b.repo.name),
  )
}
