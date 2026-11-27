import test from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { git, syncPlan, syncResult, syncRun } from '../src/git.js'

// 搭建用的 Git（克隆、推送）走普通环境：插件自己的 git() 为了安全禁掉了本地路径传输。
const setupEnv = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_')),
)
setupEnv.GIT_ALLOW_PROTOCOL = 'file'
const plain = (cwd, ...args) =>
  promisify(execFile)('git', ['-C', cwd, ...args], {
    env: setupEnv,
    encoding: 'utf8',
  }).then((r) => r.stdout)

// 获取、拉取、推送只在临时仓库里真跑：一个裸仓库当远端，两份检出当两个人。
// 姓名和邮箱都是虚构的。
const who = ['-c', 'user.name=t', '-c', 'user.email=t@example.com']
const commit = async (cwd, file, text, message) => {
  await writeFile(path.join(cwd, file), text)
  await git(cwd, 'add', file)
  await git(cwd, ...who, 'commit', '-q', '-m', message)
}
const head = async (cwd) => (await git(cwd, 'rev-parse', 'HEAD')).trim()
async function site(t) {
  const dir = await mkdtemp(path.join(tmpdir(), 'worktree-desk-sync-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const origin = path.join(dir, 'origin.git')
  const alice = path.join(dir, 'alice')
  const bob = path.join(dir, 'bob')
  await git(dir, 'init', '-q', '--bare', '-b', 'main', origin)
  await plain(dir, 'clone', '-q', origin, alice)
  await writeFile(path.join(alice, 'a.txt'), 'one\n')
  await git(alice, 'add', 'a.txt')
  await git(alice, ...who, 'commit', '-q', '-m', 'init')
  await plain(alice, 'push', '-q', '-u', 'origin', 'main')
  await plain(dir, 'clone', '-q', origin, bob)
  const tree = (pathOf) => ({ path: pathOf, main: true, bare: false, prunable: false })
  // 插件核对的是真实路径（macOS 的临时目录本身是一条链接）。
  const common = async (pathOf) => realpath(path.join(pathOf, '.git'))
  return { dir, origin, alice, bob, tree, common }
}

test('没有上游的分支：推送计划替用户选唯一的远端，推完设为上游', async (t) => {
  const { alice, bob, tree, common } = await site(t)
  await git(alice, 'switch', '-q', '-c', 'feat/x')
  await writeFile(path.join(alice, 'b.txt'), 'b\n')
  await git(alice, 'add', 'b.txt')
  await git(alice, ...who, 'commit', '-q', '-m', 'add b')
  let plan = await syncPlan(tree(alice), await common(alice))
  assert.equal(plan.branch, 'feat/x')
  assert.equal(plan.upstream, '')
  assert.equal(plan.ahead, null)
  assert.deepEqual(plan.push, {
    ok: true,
    remote: 'origin',
    branch: 'feat/x',
    create: true,
  })
  assert.equal(plan.pull.ok, false)
  assert.match(plan.pull.reason, /没有设置上游/)
  assert.deepEqual(plan.fetch, { ok: true, remote: 'origin' })

  const result = syncResult(
    'push',
    await syncRun(tree(alice), await common(alice), 'push', plan.stamp),
  )
  assert.equal(result.ok, true)
  assert.match(result.head, /已在远端创建分支/)
  assert.equal(
    (await git(alice, 'rev-parse', '--abbrev-ref', '@{upstream}')).trim(),
    'origin/feat/x',
  )
  assert.equal(
    await head(alice),
    (await plain(bob, 'ls-remote', 'origin', 'refs/heads/feat/x')).split(/\s/)[0],
  )

  plan = await syncPlan(tree(alice), await common(alice))
  assert.equal(plan.ahead, 0)
  assert.equal(plan.push.ok, false)
  assert.match(plan.push.reason, /没有未推送的提交/)
  // 上游是 origin/feat/x：远端名只到第一个斜杠，不能把分支名里的斜杠当成远端名的结尾。
  assert.equal(plan.upstream, 'origin/feat/x')
  assert.equal(plan.remote, 'origin')
  assert.deepEqual(plan.fetch, { ok: true, remote: 'origin' })
  assert.equal(
    syncResult('fetch', await syncRun(tree(alice), await common(alice), 'fetch', plan.stamp)).ok,
    true,
  )
})

test('拉取：先获取才看得到落后，快进后 HEAD 与远端一致', async (t) => {
  const { alice, bob, tree, common } = await site(t)
  await commit(bob, 'a.txt', 'two\n', 'bob moves on')
  await plain(bob, 'push', '-q', 'origin', 'main')
  let plan = await syncPlan(tree(alice), await common(alice))
  // 本地记录还是旧的：计划如实说「没有落后的」。
  assert.equal(plan.behind, 0)
  assert.equal(plan.pull.ok, true)
  assert.equal(
    syncResult('fetch', await syncRun(tree(alice), await common(alice), 'fetch', plan.stamp)).ok,
    true,
  )
  // 获取之后记录变了：原来那份计划作废，拉取要按新的记录重新出计划。
  await assert.rejects(
    syncRun(tree(alice), await common(alice), 'pull', plan.stamp),
    /重新确认/,
  )
  plan = await syncPlan(tree(alice), await common(alice))
  assert.equal(plan.behind, 1)
  assert.equal(plan.ahead, 0)
  const result = syncResult(
    'pull',
    await syncRun(tree(alice), await common(alice), 'pull', plan.stamp),
  )
  assert.equal(result.ok, true)
  assert.match(result.head, /已快进/)
  assert.equal(await head(alice), (await git(alice, 'rev-parse', 'origin/main')).trim())
  const again = syncResult(
    'pull',
    await syncRun(
      tree(alice),
      await common(alice),
      'pull',
      (await syncPlan(tree(alice), await common(alice))).stamp,
    ),
  )
  assert.match(again.head, /已是最新/)
})

test('分叉：拉取被提前拦下，推送被远端拒绝，什么都不改', async (t) => {
  const { alice, bob, tree, common } = await site(t)
  await commit(alice, 'a.txt', 'alice\n', 'alice')
  await commit(bob, 'a.txt', 'bob\n', 'bob')
  await plain(bob, 'push', '-q', 'origin', 'main')
  // 先获取，本地的远端记录才反映远端的新提交。
  await syncRun(
    tree(alice),
    await common(alice),
    'fetch',
    (await syncPlan(tree(alice), await common(alice))).stamp,
  )
  const plan = await syncPlan(tree(alice), await common(alice))
  assert.equal(plan.ahead, 1)
  assert.equal(plan.behind, 1)
  assert.equal(plan.pull.ok, false)
  assert.match(plan.pull.reason, /不能快进/)
  // 计划被拦下的操作，绕过界面直接调用也不执行。
  await assert.rejects(
    syncRun(tree(alice), await common(alice), 'pull', plan.stamp),
    /不能快进/,
  )
  const before = await head(alice)
  const result = syncResult(
    'push',
    await syncRun(tree(alice), await common(alice), 'push', plan.stamp),
  )
  assert.equal(result.ok, false)
  assert.match(result.head, /推送被拒绝/)
  assert.match(result.output, /non-fast-forward|fetch first/)
  assert.equal(await head(alice), before)
})

test('未提交的改动挡住拉取：文件保持原样，提示先提交或暂存', async (t) => {
  const { alice, bob, tree, common } = await site(t)
  await commit(bob, 'a.txt', 'two\n', 'bob moves on')
  await plain(bob, 'push', '-q', 'origin', 'main')
  await writeFile(path.join(alice, 'a.txt'), 'local edit\n')
  const plan = await syncPlan(tree(alice), await common(alice))
  assert.equal(plan.dirty, 1)
  const result = syncResult(
    'pull',
    await syncRun(tree(alice), await common(alice), 'pull', plan.stamp),
  )
  assert.equal(result.ok, false)
  assert.match(result.head, /未提交的改动/)
})

test('确认之后状态变了就拒绝执行；分离 HEAD 和没有远端时没有可做的操作', async (t) => {
  const { alice, bob, tree, common } = await site(t)
  const plan = await syncPlan(tree(alice), await common(alice))
  await commit(alice, 'a.txt', 'alice\n', 'alice')
  await assert.rejects(
    syncRun(tree(alice), await common(alice), 'fetch', plan.stamp),
    /重新确认/,
  )
  await git(alice, 'switch', '-q', '--detach', 'HEAD')
  const detached = await syncPlan(tree(alice), await common(alice))
  assert.match(detached.push.reason, /分离 HEAD/)
  assert.equal(detached.pull.ok, false)
  // 两个远端、又没有上游：不替用户猜推到哪一个。
  await git(alice, 'switch', '-q', 'main')
  await git(alice, 'remote', 'add', 'upstream', bob)
  await git(alice, ...who, 'commit', '-q', '--allow-empty', '-m', 'empty')
  const many = await syncPlan(tree(alice), await common(alice))
  assert.equal(many.remote, 'origin')
  assert.equal(many.push.ok, true)
  await git(alice, 'branch', '--unset-upstream')
  const unsure = await syncPlan(tree(alice), await common(alice))
  assert.equal(unsure.push.ok, false)
  assert.match(unsure.push.reason, /多个远端/)
  assert.match(unsure.pull.reason, /没有设置上游/)
  await assert.rejects(syncRun(tree(alice), await common(alice), 'rebase', 'x'), /unknown action/)
})

test('Git 的输出归成一句话：身份、服务端拒绝、超时', () => {
  const said = (action, output) => syncResult(action, { ok: false, output }).head
  assert.match(
    said(
      'push',
      "remote: HTTP Basic: Access denied\nfatal: Authentication failed for 'https://example.com/x.git/'",
    ),
    /拒绝了身份/,
  )
  assert.match(
    said('push', "To github.com:x/y.git\n ! [remote rejected] main -> main (protected branch hook declined)"),
    /远端拒绝了这次推送/,
  )
  assert.match(syncResult('fetch', { ok: false, timeout: true }).head, /超过 3 分钟/)
  assert.equal(syncResult('fetch', { ok: true, output: '' }).head, '已获取，远端没有新内容')
  assert.equal(syncResult('fetch', { ok: true, timeout: true }).ok, false)
})
