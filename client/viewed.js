// 「已审阅」：看差异的人自己读过了哪些文件。只做统计，不挡任何操作。
// 记在本机（localStorage），按工作树分开；存的是每个文件被标记时那份改动的指纹（见 digestOf）。
// 之后文件又改了，指纹对不上，这个文件就显示成「有新改动」，不再算作已审阅。
// 指纹在「未提交」和「未推送」两个范围里是同一种算法（见 model.js 的 SCOPES）：提交之后改动没变，标记就跟过去；
// 提交之前这个文件还有别的改动，指纹就对不上，认得出还有没看过的。
// decode / digestOf / progressOf 是纯函数，不依赖浏览器，可在 node 下直接测试。

const KEY = 'worktree-desk.viewed'
// 最多记这么多棵工作树；超出的丢掉最久没动过的。
const MAX_TREES = 200
const NONE = {}
const SEED = 0x9e3779b9

const hash = (text, seed = 0x811c9dc5) => {
  let value = seed
  for (let i = 0; i < text.length; i++) {
    value ^= text.charCodeAt(i)
    value = Math.imul(value, 0x01000193)
  }
  return (value >>> 0).toString(16).padStart(8, '0')
}
const pair = (text) => hash(text) + hash(text, SEED)

// 文件路径在留存里的位置：只存路径的摘要，留存里不出现文件名。
export const slotOf = (path) => pair(path)

// 一个文件此刻这份改动的指纹：路径、增删行数（新文件是行数），以及能认出内容的量——
// 工作目录里这个文件的修改时间和大小（宿主读状态时一并读的）。存下来的就是它，改了就对不上。
export function digestOf(file) {
  return pair(
    [
      file.path,
      file.from ?? '',
      file.add ?? file.lines ?? '',
      file.del ?? '',
      file.mtime ?? '',
      file.size ?? '',
    ].join('\u0000'),
  )
}

// 文件按标记算的状态：viewed 审阅过、之后没再改；changed 审阅过、之后又改了；unviewed 没审阅过。
export function viewedStateOf(marks, file, digest) {
  const marked = marks[slotOf(file.path)]
  return marked === undefined
    ? 'unviewed'
    : marked === digest
      ? 'viewed'
      : 'changed'
}

// 一份文件清单的进度。changed 的文件（审阅后又改了）不算已审阅。
export function progressOf(files, marks) {
  const out = { total: files.length, viewed: 0, changed: 0 }
  for (const file of files) {
    const state = viewedStateOf(marks, file, digestOf(file))
    if (state !== 'unviewed') out[state] += 1
  }
  return out
}

// 留存的内容：{ 工作树: { at, files: { 路径摘要: 指纹 } } }。内容不对的那一项丢掉；整份读不懂就当没有。
export function decode(text) {
  let saved
  try {
    saved = JSON.parse(text ?? '')
  } catch {
    return {}
  }
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {}
  const trees = {}
  for (const [tree, entry] of Object.entries(saved)) {
    if (!tree || !entry || typeof entry !== 'object') continue
    const files = {}
    for (const [slot, digest] of Object.entries(entry.files ?? {}))
      if (typeof slot === 'string' && typeof digest === 'string')
        files[slot] = digest
    if (Object.keys(files).length)
      trees[tree] = { at: Number.isFinite(entry.at) ? entry.at : 0, files }
  }
  return trees
}

// 读留存：null 表示读不了（没有 localStorage、隐私模式、被禁用）。
const load = () => {
  try {
    return decode(localStorage.getItem(KEY))
  } catch {
    return null
  }
}

let trees = null // 读出来的全部标记；没动过就一直用同一个对象
let version = 0
// 每次写入的时间只增不减：同一毫秒里连着写两次，「最近动过的」也分得出先后（留存里只留最近的一些）。
let lastAt = 0
const tick = () => (lastAt = Math.max(Date.now(), lastAt + 1))
const listeners = new Set()
const changed = () => {
  version += 1
  listeners.forEach((fn) => fn())
}
// 记下某一棵树的标记（files 为空就是清掉这棵树的）。写之前重新读一遍：别的面板实例可能写过。
const write = (tree, files) => {
  const all = load()
  if (!all) return false
  if (Object.keys(files).length) all[tree] = { at: tick(), files }
  else delete all[tree]
  const kept = Object.fromEntries(
    Object.entries(all)
      .sort((a, b) => b[1].at - a[1].at)
      .slice(0, MAX_TREES),
  )
  try {
    localStorage.setItem(KEY, JSON.stringify(kept))
  } catch {
    return false
  }
  trees = kept
  changed()
  return true
}
const cached = new WeakMap()

export const viewed = {
  // 标记变过几次：组件靠它知道该重新取。
  get version() {
    return version
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  // 这棵树有没有记着标记。
  has(tree) {
    trees ??= load()
    return !!(trees && trees[tree])
  },
  // 这棵树记着的标记：{ 路径摘要: 指纹 }。内容没变时是同一个对象。
  marksOf(tree) {
    trees ??= load()
    return trees?.[tree]?.files ?? NONE
  },
  // 一份文件清单的进度。files 是同一份清单时直接用上次算的。
  progress(tree, files) {
    const marks = viewed.marksOf(tree)
    const hit = cached.get(files)
    if (hit && hit.marks === marks) return hit.value
    const value = progressOf(files, marks)
    cached.set(files, { marks, value })
    return value
  },
  // 标记（或取消标记）一个文件。list 是眼下全部的文件，不在里面的路径顺手清掉。
  mark(tree, list, path, value) {
    const file = list.find((item) => item.path === path)
    if (!file) return false
    const present = new Set(list.map((item) => slotOf(item.path)))
    const target = slotOf(path)
    const files = {}
    for (const [slot, digest] of Object.entries(viewed.marksOf(tree)))
      if (slot !== target && present.has(slot)) files[slot] = digest
    if (value) files[target] = digestOf(file)
    return write(tree, files)
  },
  // 把一份清单里的文件全部标记（或全部取消）。
  markAll(tree, list, value) {
    const files = {}
    if (value)
      for (const file of list) files[slotOf(file.path)] = digestOf(file)
    return write(tree, files)
  },
  clear() {
    trees = null
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* 读不了也就没有可清的 */
    }
    changed()
  },
}
