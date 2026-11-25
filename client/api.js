// 面板与宿主之间的请求：插件自己的只读路由、带标记的写操作，以及宿主自带的「在应用中打开」。
const base = (path) => new URL(path, document.baseURI)

async function json(response, fallback) {
  if (!response.ok)
    throw Error(
      (await response.json().catch(() => ({}))).error ||
        fallback(response.status),
    )
  return response.json()
}

// action 为真时走 POST 并带上操作标记；宿主只认带标记的写请求。
export async function request(name, params, signal, action) {
  const url = base(`api/worktree-desk/${name}`)
  url.search = new URLSearchParams(params).toString()
  return json(
    await fetch(url, {
      signal,
      cache: 'no-store',
      ...(action
        ? { method: 'POST', headers: { 'X-Worktree-Action': action } }
        : {}),
    }),
    (status) => `读取失败（${status}）`,
  )
}

// 宿主「在应用中打开」的内部路由：列出本机可用的应用、按应用打开目录。
// 不是面向插件的公开接口，所以在不可用（旧版本、路由调整）时安静地退回空列表。
export async function hostApps(signal) {
  const response = await fetch(base('open-in-app/apps'), {
    signal,
    cache: 'no-store',
  }).catch(() => null)
  if (!response?.ok) return []
  return (await response.json().catch(() => ({}))).apps ?? []
}

export async function hostOpen(app, path) {
  const response = await fetch(base('open-in-app/open'), {
    method: 'POST',
    cache: 'no-store',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ app, path }),
  }).catch(() => null)
  return !!response?.ok
}
