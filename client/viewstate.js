// 面板「看到哪儿了」：筛选、选中、折叠、清单滚到的位置，以及每棵工作树里停在哪个页签、
// 文件区怎么筛的、差异滚到了哪个文件。切到别的面板再回来、或者重启之后，接着上次的地方看，
// 不用每次从头找。记在本机（localStorage）。
// decode / decodeList / decodeTree 是纯函数，不依赖浏览器，可在 node 下直接测试。

const KEY = 'worktree-desk.view'
const VERSION = 1
// 最多记这么多棵工作树的详情；最久没看的先丢。
const MAX_TREES = 24
const MAX_ITEMS = 400
const MAX_TEXT = 200
// 写盘前先等一等：搜索词是一个字一个字输进来的，滚动更是不停。
const DELAY = 300

const ID = /^[0-9a-f]{32}$/
const isTreeKey = (key) =>
  typeof key === 'string' && /^[0-9a-f]{32}:[0-9a-f]{32}$/.test(key)
const isFileId = (id) => typeof id === 'string' && ID.test(id)
const text = (value, max = 80) =>
  typeof value === 'string' ? value.slice(0, max) : ''
const items = (value, max = 300) => {
  if (!Array.isArray(value)) return []
  return [
    ...new Set(
      value
        .filter((item) => typeof item === 'string')
        .map((item) => item.slice(0, max)),
    ),
  ].slice(0, MAX_ITEMS)
}
const count = (value) =>
  Number.isFinite(value) && value >= 0 && value <= 1e7 ? Math.round(value) : 0
const choice = (value, allowed) => (allowed.includes(value) ? value : '')
// 最近一次改动的时间：排序「最近看过的」用的，只要是数就行，不设上限。
const atOf = (entry) => (Number.isFinite(entry?.at) ? entry.at : 0)

// 清单这一边的状态。
export function decodeList(raw) {
  const saved = raw && typeof raw === 'object' ? raw : {}
  const { selected } = saved
  return {
    // 'all' 或某个仓库的编号。
    scope:
      saved.scope === 'all' || ID.test(saved.scope ?? '') ? saved.scope : 'all',
    query: text(saved.query, MAX_TEXT),
    // 条件和工具的名字对不对，由面板按它认得的清单再核一遍。
    filter: text(saved.filter, 20),
    tool: text(saved.tool, 20),
    stack: saved.stack === 1 ? 1 : 0,
    selected:
      ID.test(selected?.repo ?? '') &&
      typeof selected?.path === 'string' &&
      selected.path.length > 0 &&
      selected.path.length <= 4096
        ? { repo: selected.repo, path: selected.path }
        : null,
    collapsed: items(saved.collapsed, 80),
    staleOpen: items(saved.staleOpen, 80),
    quietOpen: saved.quietOpen === true,
    // 只看一个仓库时，清单末尾的「本地分支」展没展开。
    branchesOpen: saved.branchesOpen === true,
    top: count(saved.top),
  }
}

// 文件区（某个范围）这一边的状态：怎么筛的、哪些展开着、差异停在哪。没记过的项是空值，由组件按默认规则定。
export function decodeArea(raw) {
  const saved = raw && typeof raw === 'object' ? raw : {}
  const dirs = saved.dirs && typeof saved.dirs === 'object' ? saved.dirs : null
  const { anchor } = saved
  return {
    filter: text(saved.filter, 20),
    query: text(saved.query, MAX_TEXT),
    how: choice(saved.how, ['auto', 'all', 'custom']),
    open: items(saved.open, 80).filter(isFileId),
    dirs: dirs
      ? { all: dirs.all === true, on: items(dirs.on), off: items(dirs.off) }
      : null,
    // 差异区停在哪：露出在顶上的那个文件，和它离顶多远。
    anchor:
      isFileId(anchor?.file) &&
      Number.isFinite(anchor?.offset) &&
      Math.abs(anchor.offset) <= 1e6
        ? { file: anchor.file, offset: anchor.offset }
        : null,
  }
}

// 一棵工作树的详情：停在哪个页签，以及两个范围的文件区各是什么样。
export function decodeTree(raw) {
  const saved = raw && typeof raw === 'object' ? raw : {}
  const scopes =
    saved.scopes && typeof saved.scopes === 'object' ? saved.scopes : {}
  return {
    tab: choice(saved.tab, ['uncommitted', 'outgoing', 'sessions', 'review']),
    scopes: {
      uncommitted: decodeArea(scopes.uncommitted),
      outgoing: decodeArea(scopes.outgoing),
    },
  }
}

export function decode(text) {
  let saved
  try {
    saved = JSON.parse(text ?? '')
  } catch {
    return null
  }
  if (saved?.v !== VERSION || typeof saved !== 'object') return null
  const trees = {}
  for (const [key, value] of Object.entries(saved.trees ?? {}))
    if (isTreeKey(key)) trees[key] = { ...decodeTree(value), at: atOf(value) }
  return { list: decodeList(saved.list), trees }
}

export function encode(view) {
  return JSON.stringify({ v: VERSION, ...view })
}

let memory = null // 上次读到的、以及之后每次改动
let timer = 0
// 每次改动的时间只增不减：同一毫秒里连着改两次，「最近看过的」也分得出先后（详情只留最近的一些）。
let lastAt = 0
const tick = () => (lastAt = Math.max(Date.now(), lastAt + 1))
let listening = false

const empty = () => ({ list: decodeList({}), trees: {} })
const flush = () => {
  clearTimeout(timer)
  timer = 0
  if (!memory) return
  try {
    localStorage.setItem(KEY, encode(memory))
  } catch {
    /* 存不了就下次用默认值 */
  }
}
const later = () => {
  clearTimeout(timer)
  timer = setTimeout(flush, DELAY)
}
const read = () => {
  if (memory) return memory
  let saved = null
  try {
    saved = decode(localStorage.getItem(KEY))
  } catch {
    /* 没有 localStorage、隐私模式、存储被禁用：只在内存里留 */
  }
  memory = saved ?? empty()
  if (!listening) {
    listening = true
    // 关页面时定时器可能还没到点：补存一次。
    if (typeof addEventListener === 'function')
      addEventListener('pagehide', flush)
  }
  return memory
}

export const viewState = {
  load() {
    return read()
  },
  // 某棵工作树的详情状态（没记过时各项都是空值）。
  tree(key) {
    return decodeTree(isTreeKey(key) ? read().trees[key] : null)
  },
  // 改了清单这一边的某些项。
  saveList(patch) {
    const all = read()
    all.list = decodeList({ ...all.list, ...patch })
    later()
  },
  // 改了某棵工作树详情的某些项：tab 是停在哪个页签；scopes 是 { 范围: 文件区改了什么 }。
  saveTree(key, patch) {
    if (!isTreeKey(key)) return
    const all = read()
    const old = all.trees[key]
    const scopes = { ...old?.scopes }
    for (const name of ['uncommitted', 'outgoing'])
      if (patch.scopes?.[name])
        scopes[name] = decodeArea({
          ...old?.scopes?.[name],
          ...patch.scopes[name],
        })
    const trees = {
      ...all.trees,
      [key]: {
        ...decodeTree({ tab: patch.tab ?? old?.tab, scopes }),
        at: tick(),
      },
    }
    // 只留最近看过的几棵。
    all.trees = Object.fromEntries(
      Object.entries(trees)
        .sort((a, b) => atOf(b[1]) - atOf(a[1]))
        .slice(0, MAX_TREES),
    )
    later()
  },
  clear() {
    clearTimeout(timer)
    timer = 0
    memory = empty()
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* 同上 */
    }
  },
}
