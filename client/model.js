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

// 行首的状态点：只在「有事可做」时才画，颜色和第二行的状态文字一致（黄＝有改动，蓝＝有未推送，红＝冲突或操作进行中）。
// 干净、落后、失效、无状态的行不画：空心圆看上去像没选中的单选按钮，反而让人以为那里能点。
export const markTone = (t) => {
  const { tone } = signal(t)
  return tone === 'muted' || tone === 'clean' ? null : tone
}

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
  // 做过 AI 审查的工作树。哪棵树审查过是面板自己记的（不在工作树的数据里），要从 ctx 里问。
  reviewed: ['审查过', (t, ctx) => !!ctx?.reviewed?.(ctx.repo, t)],
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
// 分支名斜杠前面的那段只是分类（feat/、codex/）：返回 [分类, 其余]，没有斜杠时分类为 null。
// 清单里把分类调淡，视线落在后面真正区分它的那段上。
export function branchLabel(name) {
  const text = String(name ?? '')
  const at = text.indexOf('/')
  return at < 1 ? [null, text] : [text.slice(0, at + 1), text.slice(at + 1)]
}

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
  // 更早的只写日期，和「11/20 10:34」一致：今年的不写年份（完整时间在悬停提示里），去年及更早才写。
  return date.getFullYear() === new Date(now).getFullYear()
    ? day
    : date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      })
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
// 根节点自己不并进去：改动都在同一个目录下时，那个目录要有自己的一行，里面的文件才和别处一样
// 缩进一层、只写文件名；不然它们会被提到顶格、带着完整的路径，和子目录里的文件对不齐。
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
    if (name && !node.files.length && node.dirs.size === 1) {
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
      // 冲突的文件在 Git 里单算一类（「未合并」），不算进已暂存 / 未暂存，和宿主统计个数时的口径一致。
      detail: '合并冲突，尚未解决',
      staged: false,
      unstaged: false,
      tone: 'danger',
    }
  if (file.xy === '??')
    return {
      code: '?',
      text: '未跟踪',
      detail: '新文件，尚未加入 Git',
      staged: false,
      unstaged: false,
      tone: 'untracked',
    }
  // 「未推送」的范围里（和上游比）已经提交的文件；提交之后工作目录里可能又改过。
  if (file.st) {
    const rename = file.from ? `（原 ${file.from}）` : ''
    return {
      code: file.st,
      text: file.dirty ? '已提交，又有改动' : `${action(file.st)}，已提交`,
      detail: file.dirty
        ? `${action(file.st)}${rename}，已提交；之后工作目录里又有改动，都还没推送`
        : `${action(file.st)}${rename}，已提交，还没推送`,
      staged: false,
      unstaged: false,
      outgoing: true,
      tone: 'commit',
    }
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
    unstaged,
    tone: staged ? 'staged' : 'unstaged',
  }
}

// 文件改动区的筛选。判定口径和宿主统计「已暂存 / 未暂存 / 未跟踪」个数时一致：
// 标签上写着几个，筛出来就得是几个。
export const FILE_FILTERS = {
  all: ['全部', () => true],
  unstaged: ['未暂存', (file) => fileBadge(file).unstaged],
  staged: ['已暂存', (file) => fileBadge(file).staged],
  untracked: ['未跟踪', (file) => file.xy === '??'],
}
// 「未推送」的范围里没有暂存区这一说：分成已经提交的、提交之后又改的、还没进 Git 的。
const OUTGOING_FILTERS = {
  all: ['全部', () => true],
  committed: ['已提交', (file) => !!file.st && !file.dirty],
  touched: ['又有改动', (file) => !!file.dirty],
  untracked: ['未跟踪', (file) => file.xy === '??'],
}
export const fileFilters = (scope) =>
  scope === 'outgoing' ? OUTGOING_FILTERS : FILE_FILTERS

// ---- 「文件改动」的两个范围 ----
// 未提交：工作目录和 HEAD 比（已暂存、未暂存、未跟踪）。
// 未推送：上游和现在比——未推送的提交，加上还没提交的改动。只有设了上游、又有未推送的提交时才有。
export const SCOPES = { uncommitted: '未提交', outgoing: '未推送' }
export const FILE_TABS = ['uncommitted', 'outgoing']
// 某个范围里的文件清单；这个范围眼下没有（没读到状态、或者没有未推送的提交）时是 null。
export const scopeFiles = (tree, scope) =>
  scope === 'outgoing'
    ? (tree.status?.outgoing?.files ?? null)
    : (tree.status?.files ?? null)
export const scopeTotal = (tree, scope) =>
  scope === 'outgoing'
    ? (tree.status?.outgoing?.total ?? 0)
    : (tree.status?.total ?? 0)
// 一次审查审过的改动还在不在：没提交的都提交了（或者挪走了），没推送的都推送了，就是不在了——
// 结论没有可看的了，面板据此把这次审查的记录清掉。状态没读到、或者读失败时不下结论。
export const reviewGone = (tree, scope = 'uncommitted') => {
  const s = tree?.status
  if (!s || tree.error) return false
  return scope === 'outgoing' ? !s.outgoing : !(s.total > 0)
}
// 没说看哪个范围时：先看还没提交的，都提交了再看还没推送的。
export const defaultScope = (tree) =>
  scopeTotal(tree, 'uncommitted') > 0
    ? 'uncommitted'
    : scopeTotal(tree, 'outgoing') > 0
      ? 'outgoing'
      : 'uncommitted'

// 清单行尾的紧凑状态：只列要动手的事，顺序固定（未推送、落后、改动）。
// 有冲突或做到一半的操作时只列那一个，它比改动数更要紧。
export function rowMarks(t) {
  if (t.prunable) return [{ key: 'stale' }]
  const s = t.status
  const marks = []
  if (s?.ahead > 0) marks.push({ key: 'ahead', count: s.ahead })
  if (s?.behind > 0) marks.push({ key: 'behind', count: s.behind })
  const { key, rank } = signal(t)
  if (key === 'dirty') marks.push({ key: 'dirty', count: s.total })
  else if (rank <= 2) marks.push({ key: 'trouble' })
  else if (key === 'unknown') marks.push({ key: 'unknown' })
  return marks
}

// 行尾每个标记的悬停说明。
export function markText(t, key) {
  const s = t.status
  if (key === 'stale')
    return staleReason(t) || 'Git 仍保留该工作树登记，但目录已不存在'
  if (key === 'dirty')
    return `${s.total} 项改动：已暂存 ${s.staged} · 未暂存 ${s.unstaged} · 未跟踪 ${s.untracked}`
  if (key === 'ahead')
    return `${s.ahead} 个提交未推送（跟踪 ${s.upstream}，按本地记录，不联网更新）`
  if (key === 'behind')
    return `落后上游 ${s.behind} 个提交（跟踪 ${s.upstream}，按本地记录，不联网更新）`
  return signal(t).label
}

// 分支名里的工单号：同一需求在多个仓库的工作树据此同色，也能一键筛出来。
// 优先认「前缀-数字」（DEMO-20431），否则取第一段 4–6 位数字（7001）；日期那样的 8 位数不算。
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

// 仓库下拉的选项。没有关键词时「全部仓库」排第一项，选它等于清除；
// 有关键词时只列匹配的仓库（名称、路径、所属项目），不再放「全部仓库」。
export function scopeOptions(repos, needle, all = '全部仓库') {
  const option = ({ id, name, path, count }) => ({ id, name, path, count })
  if (!lower(needle).trim())
    return [{ id: 'all', name: all }, ...repos.map(option)]
  return repos
    .filter((repo) =>
      match(needle, repo.name, repo.path, ...(repo.groups ?? [])),
    )
    .map(option)
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
