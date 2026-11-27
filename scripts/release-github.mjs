// 建 GitHub Release 并上传资产：已登录的 gh 优先；不行就用 git 自己的 GitHub 凭据直接调 API；都不行就留给手动。
// 凭据只留在进程内存里：不进命令行参数、不写文件、不打印。
import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'

const API = 'https://api.github.com'
const UPLOADS = 'https://uploads.github.com'
const HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

// 装了而且已登录才算可用：只装没登录的话，每条 gh 命令都会失败。
export const ghReady = () =>
  spawnSync('gh', ['--version']).status === 0 &&
  spawnSync('gh', ['auth', 'status', '--hostname', 'github.com'], {
    stdio: 'ignore',
  }).status === 0

/** git 的凭据助手里 github.com 的 HTTPS 凭据；取不到返回 null。 */
export function githubToken() {
  const result = spawnSync('git', ['credential', 'fill'], {
    input: 'protocol=https\nhost=github.com\n\n',
    encoding: 'utf8',
    env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
  })
  if (result.status !== 0) return null
  return /^password=(.+)$/m.exec(result.stdout)?.[1]?.trim() || null
}

async function request(
  token,
  method,
  url,
  { json, file, missing = false } = {},
) {
  const type = file
    ? file.endsWith('.tgz')
      ? 'application/gzip'
      : 'text/plain'
    : json
      ? 'application/json'
      : undefined
  const response = await fetch(url, {
    method,
    headers: {
      ...HEADERS,
      Authorization: `Bearer ${token}`,
      ...(type ? { 'Content-Type': type } : {}),
    },
    body: file ? await readFile(file) : json ? JSON.stringify(json) : undefined,
    signal: AbortSignal.timeout(120_000),
  })
  const data = await response.json().catch(() => null)
  if (response.status === 404 && missing) return null
  // 报错只带路径、状态码和 GitHub 的说明，不带请求头。
  if (!response.ok)
    throw new Error(
      `${method} ${new URL(url).pathname} 返回 ${response.status}${data?.message ? `：${data.message}` : ''}`,
    )
  return data
}

/**
 * 在 slug（owner/repo）上建名为 tag 的 Release（已存在就复用），补齐缺少的资产，返回 Release 页面地址。
 * api / uploads 只给测试换成本地假服务器用；不要改成从环境变量读，否则凭据可能被引到别的主机。
 */
export async function publishRelease({
  slug,
  tag,
  notes,
  assets,
  token = githubToken(),
  api = API,
  uploads = UPLOADS,
}) {
  if (!token) throw new Error('没有可用的 GitHub 凭据')
  if (!/^[\w.-]+\/[\w.-]+$/.test(slug))
    throw new Error(`仓库标识不合法：${slug}`)
  const [owner] = slug.split('/')
  const user = await request(token, 'GET', `${api}/user`, {
    missing: true,
  })
  if (user?.login?.toLowerCase() !== owner.toLowerCase())
    throw new Error(
      `GitHub 凭据属于 ${user?.login ?? '未知账号'}，不是 ${slug} 的所有者`,
    )
  let release = await request(
    token,
    'GET',
    `${api}/repos/${slug}/releases/tags/${tag}`,
    { missing: true },
  )
  if (!release)
    release = await request(token, 'POST', `${api}/repos/${slug}/releases`, {
      json: {
        tag_name: tag,
        target_commitish: 'main',
        name: tag,
        body: notes || tag,
        draft: false,
        prerelease: false,
      },
    })
  for (const file of assets) {
    const name = basename(file)
    if (
      release.assets?.some(
        (asset) => asset.name === name && asset.state === 'uploaded',
      )
    )
      continue
    await request(
      token,
      'POST',
      `${uploads}/repos/${slug}/releases/${release.id}/assets?name=${encodeURIComponent(name)}`,
      { file },
    )
  }
  return release.html_url
}

const releaseExists = (tag, slug, cwd) =>
  spawnSync('gh', ['release', 'view', tag, '--repo', slug], { cwd }).status ===
  0

/**
 * 发布脚本的最后一步，返回实际走了哪条路：gh、api 或 manual。
 * run 是发布脚本里执行外部命令的函数（失败会抛错）；ready、exists 和 publish 留给测试替换。
 */
export async function createRelease({
  slug,
  tag,
  notes,
  assets,
  cwd,
  run,
  ready = ghReady(),
  exists = releaseExists,
  publish = publishRelease,
}) {
  const page = `https://github.com/${slug}/releases/tag/${tag}`
  if (!slug) {
    console.log(
      `\n代码与标签已推送。公开仓的远端不是 GitHub，请手动建 Release 并上传：\n  ${assets.join('\n  ')}`,
    )
    return 'manual'
  }
  if (ready) {
    try {
      run(
        'gh',
        exists(tag, slug, cwd)
          ? ['release', 'upload', tag, ...assets, '--repo', slug]
          : [
              'release',
              'create',
              tag,
              ...assets,
              '--repo',
              slug,
              '--title',
              tag,
              '--notes',
              notes,
            ],
        cwd,
        { show: true },
      )
      console.log(`\n已发布：${page}`)
      return 'gh'
    } catch (error) {
      console.error(
        `\ngh 没有建成 Release（${error.message}），改用 git 的 GitHub 凭据调 API`,
      )
    }
  }
  try {
    const url = await publish({ slug, tag, notes, assets })
    console.log(`\n已发布：${url || page}`)
    return 'api'
  } catch (error) {
    console.error(
      `\nRelease 没有自动建成（${error.message}）。代码与标签已推送，请手动建 Release 并上传：`,
    )
    console.error(
      `  ${assets.join('\n  ')}\n  https://github.com/${slug}/releases/new?tag=${tag}`,
    )
    return 'manual'
  }
}
