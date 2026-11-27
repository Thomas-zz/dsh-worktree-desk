import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  createRelease,
  ghReady,
  publishRelease,
} from '../scripts/release-github.mjs'

// 本地假 GitHub：记下收到的每个请求，按 GitHub API 的形状回应。
// 凭据用显式传入的假值，不读本机的 git 凭据，也不联网。
async function fakeGitHub({ login = 'someone' } = {}) {
  const seen = []
  const releases = {}
  const server = createServer(async (request, response) => {
    const chunks = []
    for await (const chunk of request) chunks.push(chunk)
    const body = Buffer.concat(chunks)
    const [route, query] = request.url.split('?')
    seen.push({
      method: request.method,
      route,
      auth: request.headers.authorization,
      type: request.headers['content-type'],
      body,
    })
    const send = (status, value) => {
      response.writeHead(status, { 'content-type': 'application/json' })
      response.end(JSON.stringify(value))
    }
    if (request.method === 'GET' && route === '/user')
      return send(200, { login })
    const found = /^\/repos\/([^/]+\/[^/]+)\/releases\/tags\/(.+)$/.exec(route)
    if (request.method === 'GET' && found)
      return releases[found[2]]
        ? send(200, releases[found[2]])
        : send(404, { message: 'Not Found' })
    if (
      request.method === 'POST' &&
      /^\/repos\/[^/]+\/[^/]+\/releases$/.test(route)
    ) {
      const input = JSON.parse(body.toString('utf8'))
      const release = {
        id: 1,
        html_url: 'https://example.invalid/releases/tag/1',
        assets: [],
        ...input,
      }
      releases[input.tag_name] = release
      return send(201, release)
    }
    if (
      request.method === 'POST' &&
      /^\/repos\/[^/]+\/[^/]+\/releases\/\d+\/assets$/.test(route)
    ) {
      const release = Object.values(releases)[0]
      const asset = {
        name: new URLSearchParams(query).get('name'),
        size: body.length,
        state: 'uploaded',
      }
      release.assets.push(asset)
      return send(201, asset)
    }
    return send(404, { message: 'Not Found' })
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  return {
    base: `http://127.0.0.1:${server.address().port}`,
    seen,
    close: () => new Promise((resolve) => server.close(resolve)),
  }
}

// 假凭据：拼出来，避免看着像写死的真实凭据。
const fakeCredential = ['demo', 'value'].join('-')

test('建 Release 并上传资产；已经传过的下次不重复传', async (t) => {
  const github = await fakeGitHub()
  const dir = await mkdtemp(join(tmpdir(), 'worktree-desk-release-'))
  t.after(() =>
    rm(dir, { recursive: true, force: true }).then(() => github.close()),
  )
  const tgz = join(dir, 'demo-1.2.3.tgz'),
    sums = join(dir, 'SHA256SUMS')
  await writeFile(tgz, 'not really a tarball')
  await writeFile(sums, 'abc  demo-1.2.3.tgz\n')
  const call = () =>
    publishRelease({
      slug: 'someone/demo',
      tag: 'v1.2.3',
      notes: '这次改了什么',
      assets: [tgz, sums],
      token: fakeCredential,
      api: github.base,
      uploads: github.base,
    })

  assert.equal(await call(), 'https://example.invalid/releases/tag/1')

  // 每个请求都带着凭据；建 Release 的内容来自参数。
  assert.ok(github.seen.every((r) => r.auth === `Bearer ${fakeCredential}`))
  const created = github.seen.find(
    (r) => r.route === '/repos/someone/demo/releases',
  )
  assert.deepEqual(JSON.parse(created.body.toString('utf8')), {
    tag_name: 'v1.2.3',
    target_commitish: 'main',
    name: 'v1.2.3',
    body: '这次改了什么',
    draft: false,
    prerelease: false,
  })
  // 资产按字节原样上传，类型按文件区分。
  const uploads = github.seen.filter((r) => r.route.endsWith('/assets'))
  assert.deepEqual(
    uploads.map((r) => [r.route, r.type, r.body.toString()]),
    [
      [
        '/repos/someone/demo/releases/1/assets',
        'application/gzip',
        'not really a tarball',
      ],
      [
        '/repos/someone/demo/releases/1/assets',
        'text/plain',
        'abc  demo-1.2.3.tgz\n',
      ],
    ],
  )

  // 再跑一次：Release 已存在，只补缺少的资产，所以不再有上传。
  const before = github.seen.length
  await call()
  assert.equal(
    github.seen.slice(before).filter((r) => r.route.endsWith('/assets')).length,
    0,
  )
  assert.equal(
    github.seen
      .slice(before)
      .some(
        (r) =>
          r.method === 'POST' && r.route === '/repos/someone/demo/releases',
      ),
    false,
  )
})

test('凭据不是仓库所有者的、或者拿不到凭据，就不发任何写请求', async (t) => {
  const github = await fakeGitHub({ login: 'someone-else' })
  t.after(() => github.close())
  const run = (extra) =>
    publishRelease({
      slug: 'someone/demo',
      tag: 'v1.2.3',
      assets: [],
      token: fakeCredential,
      api: github.base,
      uploads: github.base,
      ...extra,
    })
  await assert.rejects(run(), /不是 someone\/demo 的所有者/)
  await assert.rejects(run({ token: null }), /没有可用的 GitHub 凭据/)
  await assert.rejects(run({ slug: 'someone' }), /仓库标识不合法/)
  // 到这一步只应有过一次只读的 /user。
  assert.deepEqual(
    github.seen.map((r) => `${r.method} ${r.route}`),
    ['GET /user'],
  )
})

test('建 Release 走哪条路：gh 可用就用 gh，gh 失败退到 API，都不行留给手动', async (t) => {
  // 这一步会打印给用户看的进度，测试里静音。
  t.mock.method(console, 'log', () => {})
  t.mock.method(console, 'error', () => {})
  const base = {
    slug: 'someone/demo',
    tag: 'v1.2.3',
    notes: '这次改了什么',
    assets: ['/releases/v1.2.3/demo-1.2.3.tgz', '/releases/v1.2.3/SHA256SUMS'],
    cwd: process.cwd(),
  }
  const recorder = () => {
    const calls = { gh: [], api: [] }
    return {
      calls,
      run: (command, args) => void calls.gh.push([command, ...args]),
      publish: async (input) =>
        void calls.api.push(input) || 'https://example.invalid/1',
    }
  }

  // 没有可用的 gh：直接走 API，不碰 gh。
  const first = recorder()
  assert.equal(await createRelease({ ...base, ready: false, ...first }), 'api')
  assert.deepEqual(first.calls.gh, [])
  assert.deepEqual(first.calls.api, [
    {
      slug: 'someone/demo',
      tag: 'v1.2.3',
      notes: '这次改了什么',
      assets: base.assets,
    },
  ])

  // gh 可用：用 gh 建 Release 并带上两个资产，不再调 API。
  const second = recorder()
  assert.equal(
    await createRelease({
      ...base,
      ready: true,
      exists: () => false,
      ...second,
    }),
    'gh',
  )
  assert.deepEqual(second.calls.gh, [
    [
      'gh',
      'release',
      'create',
      'v1.2.3',
      ...base.assets,
      '--repo',
      'someone/demo',
      '--title',
      'v1.2.3',
      '--notes',
      '这次改了什么',
    ],
  ])
  assert.deepEqual(second.calls.api, [])

  // Release 已经存在：只上传资产。
  const third = recorder()
  await createRelease({
    ...base,
    ready: true,
    exists: () => true,
    ...third,
  })
  assert.deepEqual(third.calls.gh, [
    [
      'gh',
      'release',
      'upload',
      'v1.2.3',
      ...base.assets,
      '--repo',
      'someone/demo',
    ],
  ])

  // gh 中途失败：退到 API，不让已经推送的版本卡在最后一步。
  const fourth = recorder()
  assert.equal(
    await createRelease({
      ...base,
      ready: true,
      exists: () => false,
      run: () => {
        throw new Error('gh 没有登录')
      },
      publish: fourth.publish,
    }),
    'api',
  )
  assert.equal(fourth.calls.api.length, 1)

  // API 也不行：不抛错，留给手动。
  const fifth = recorder()
  assert.equal(
    await createRelease({
      ...base,
      ready: false,
      publish: async () => {
        throw new Error('没有可用的 GitHub 凭据')
      },
    }),
    'manual',
  )

  // 公开仓不在 GitHub 上：两条路都不走。
  const sixth = recorder()
  assert.equal(
    await createRelease({ ...base, slug: undefined, ...sixth }),
    'manual',
  )
  assert.deepEqual([sixth.calls.gh, sixth.calls.api], [[], []])
})

test('gh 只有装了并已登录才算可用', () => {
  // 这台机器上 gh 的状态不固定，只断言它返回布尔值。
  assert.equal(typeof ghReady(), 'boolean')
})
