// 「上次读到的结果」：面板每次打开都先原样画它，再在后台重新读一遍、读完一个换一个。
// encode / decode / keepKnown 是纯函数，不依赖浏览器，可在 node 下直接测试。

const VERSION = 1
// localStorage 一般只给 5M 字符左右；超过就不落盘，只在内存里留一份。
const LIMIT = 4_000_000

const isRepo = (repo) =>
  typeof repo?.id === 'string' &&
  typeof repo?.path === 'string' &&
  typeof repo?.name === 'string' &&
  Array.isArray(repo?.trees) &&
  repo?.trees.every((t) => typeof t?.path === 'string')
const isDetail = (data) =>
  typeof data?.time === 'number' &&
  Array.isArray(data?.trees) &&
  data.trees.every(
    (t) => typeof t?.path === 'string' && Array.isArray(t?.sessions),
  )

// 只存读取成功的仓库。读取中、读取失败的条目不存：下次打开反正会重新读。
export function encode(catalog, details) {
  const repos = []
  for (const [id, entry] of details)
    if (entry.data) repos.push([id, entry.data])
  const text = JSON.stringify({ v: VERSION, catalog, repos })
  return text.length > LIMIT ? null : text
}

// 版本对不上、内容残缺、清单里已经没有的仓库：宁可当作没有缓存，也不要画到一半崩掉。
export function decode(text) {
  let saved
  try {
    saved = JSON.parse(text)
  } catch {
    return null
  }
  const catalog = saved?.v === VERSION ? saved.catalog : null
  if (
    !catalog ||
    typeof catalog.time !== 'number' ||
    !Array.isArray(catalog.repos) ||
    !catalog.repos.every(isRepo)
  )
    return null
  const known = new Set(catalog.repos.map((repo) => repo.id))
  const details = new Map()
  for (const pair of Array.isArray(saved.repos) ? saved.repos : []) {
    const [id, data] = Array.isArray(pair) ? pair : []
    if (known.has(id) && isDetail(data))
      details.set(id, { state: 'ready', data })
  }
  return { catalog, details }
}

// 新清单到了：里面已经没有的仓库丢掉，其余的保留上次的数据，等新数据到了逐个换掉。
export function keepKnown(old, catalog) {
  const next = new Map()
  for (const repo of catalog.repos) {
    const data = old.get(repo.id)?.data
    if (data) next.set(repo.id, { state: 'loading', data })
  }
  return next
}

const KEY = 'worktree-desk.cache'
// 同一个页面里面板关了再开：直接用内存里这份，不用再解析一遍。
let memory = null
// 宿主最近一次声明的能力（见 src/host.js 的 FEATURES）：升级后的第一份清单到达之前，本机留存的结果里还没有它。
let features = null

export const cache = {
  // 宿主声明的能力；null 表示还不知道。
  get features() {
    return features
  },
  set features(list) {
    features = list
  },
  load() {
    if (memory) return memory
    let text = null
    try {
      text = localStorage.getItem(KEY)
    } catch {
      /* 隐私模式、存储被禁用：只在内存里留 */
    }
    memory = text ? decode(text) : null
    return memory
  },
  save(snapshot) {
    memory = snapshot
    const text = encode(snapshot.catalog, snapshot.details)
    if (!text) return
    try {
      localStorage.setItem(KEY, text)
    } catch {
      /* 存不下就算了，下次多等一会儿 */
    }
  },
  clear() {
    memory = null
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* 同上 */
    }
  },
}
