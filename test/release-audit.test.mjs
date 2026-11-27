import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync, symlinkSync } from 'node:fs'
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { RULES, parseDeny } from '../scripts/release-scan.mjs'
import {
  auditCommits,
  auditPush,
  auditRevision,
  auditTagObject,
  auditTree,
  installPushHook,
  loadRules,
} from '../scripts/release-audit.mjs'

// 提交脱敏审查：文件内容、路径、提交信息、身份、附注标签，以及 pre-push 钩子的安装与拦截。
// 敏感样式一律用 s() 拼接，否则这个测试文件自己会被审查拦下。
const SCRIPTS = fileURLToPath(new URL('../scripts/', import.meta.url))
const NORELAY = '123456789+someone@users.noreply.github.com'
const ZERO = '0'.repeat(40)
const rules = [...RULES, ...parseDeny('internal-foo')]
const s = (...parts) => parts.join('')
// 隔离用户的全局 git 配置：提交身份只来自仓库级配置，也不受全局 hooksPath 影响。
const ENV = {
  ...process.env,
  GIT_CONFIG_GLOBAL: '/dev/null',
  GIT_CONFIG_NOSYSTEM: '1',
}
const PRIVATE_PATH = s('vault /', 'Users/somebody/secret\n')
const PRIVATE_DENY = s('本机私有名单「internal-', 'foo」')

function git(cwd, args) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: ENV,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
}
const cleanup = (t, dir) =>
  t.after(() => rm(dir, { recursive: true, force: true }))

async function scratch(t) {
  const dir = await mkdtemp(join(tmpdir(), 'worktree-desk-audit-repo-'))
  cleanup(t, dir)
  git(dir, ['init', '-q', '-b', 'main'])
  git(dir, ['config', 'user.name', 'someone'])
  git(dir, ['config', 'user.email', NORELAY])
  return dir
}
async function bare(t) {
  const dir = await mkdtemp(join(tmpdir(), 'worktree-desk-audit-remote-'))
  cleanup(t, dir)
  git(dir, ['init', '-q', '--bare'])
  return dir
}
function commit(dir, file, body, message, identity = {}) {
  if (file) {
    mkdirSync(dirname(join(dir, file)), { recursive: true })
    writeFileSync(join(dir, file), body)
    git(dir, ['add', '-A'])
  }
  const overrides = Object.entries(identity).flatMap(([key, value]) => [
    '-c',
    `user.${key}=${value}`,
  ])
  git(dir, [...overrides, 'commit', '-q', '--allow-empty', '-m', message])
  return git(dir, ['rev-parse', 'HEAD'])
}
const subjects = (result) => result.commits.map((entry) => entry.subject)

// 审查工具的一份副本，放在临时目录里，名单也放在那里：读哪份名单只由测试决定，不看本机的。
// deny 为 null 表示那里没有名单。
async function toolRoot(t, deny = 'internal-foo') {
  const root = await mkdtemp(join(tmpdir(), 'worktree-desk-audit-tool-'))
  cleanup(t, root)
  await mkdir(join(root, 'scripts'))
  for (const name of ['release-audit.mjs', 'release-scan.mjs'])
    await cp(join(SCRIPTS, name), join(root, 'scripts', name))
  if (deny !== null) {
    await mkdir(join(root, '.local'))
    await writeFile(join(root, '.local', 'release-deny.txt'), `${deny}\n`)
  }
  return { root, tool: join(root, 'scripts', 'release-audit.mjs') }
}
const run = (tool, args, input, cwd = tmpdir()) =>
  spawnSync(process.execPath, [tool, ...args], {
    cwd,
    encoding: 'utf8',
    input,
    env: ENV,
  })
const push = (dir, remote) =>
  spawnSync('git', ['push', '-q', remote, 'main'], {
    cwd: dir,
    encoding: 'utf8',
    env: ENV,
  })

test('干净的提交通过；文件内容、文件路径、提交信息、作者和提交者身份各自被拦', async (t) => {
  const dir = await scratch(t)
  const clean = commit(dir, 'README.md', 'hello\n', 'init')
  assert.deepEqual(auditCommits(dir, [clean], { rules }).findings, [])

  const content = commit(dir, 'notes.md', PRIVATE_PATH, 'add notes')
  assert.deepEqual(
    auditCommits(dir, [content], { rules }).findings.map(
      (f) => `${f.where} ${f.kind} ${f.location}:${f.line} ${f.rule}`,
    ),
    [`${content.slice(0, 7)} 文件内容 notes.md:1 个人家目录路径`],
  )

  const path = commit(dir, 'docs/internal-foo-plan.md', 'fine\n', 'add plan')
  assert.deepEqual(
    auditCommits(dir, [path], { rules })
      .findings.filter((f) => f.kind === '文件路径')
      .map((f) => f.location),
    ['docs/internal-foo-plan.md'],
  )

  const message = commit(dir, null, '', s('sync ', 'internal-foo', ' notes'))
  assert.deepEqual(
    auditCommits(dir, [message], { rules })
      .findings.filter((f) => f.kind === '提交信息')
      .map((f) => `${f.location}:${f.line} ${f.rule}`),
    [`提交信息:1 ${PRIVATE_DENY}`],
  )

  const identity = commit(dir, null, '', 'oops', {
    name: s('internal-', 'foo'),
    email: s('somebody', '@mail.example.org.cn'),
  })
  assert.deepEqual(
    auditCommits(dir, [identity], { rules })
      .findings.filter((f) => /邮箱|名字/.test(f.kind))
      .map((f) => `${f.kind} ${f.rule}`),
    [
      '作者邮箱 不是 GitHub noreply 地址',
      `作者名字 ${PRIVATE_DENY}`,
      '提交者邮箱 不是 GitHub noreply 地址',
      `提交者名字 ${PRIVATE_DENY}`,
    ],
  )

  // 二进制文件不按文本审查；符号链接的目标路径算文本。
  writeFileSync(join(dir, 'icon.bin'), Buffer.from([0x89, 0x50, 0x00, 0x2f]))
  symlinkSync(s('/', 'Users/somebody/vault'), join(dir, 'link'))
  git(dir, ['add', '-A'])
  const linked = commit(dir, null, '', 'binary and link')
  assert.deepEqual(
    auditCommits(dir, [linked], { rules })
      .findings.filter((f) => /^(icon\.bin|link)$/.test(f.location))
      .map((f) => `${f.location} ${f.rule}`),
    ['link 个人家目录路径'],
  )
})

test('范围与 exclude：只审查还没发布的提交', async (t) => {
  const dir = await scratch(t)
  const first = commit(dir, 'a.md', 'a\n', 'first')
  commit(dir, 'b.md', 'b\n', 'second')
  assert.deepEqual(subjects(auditCommits(dir, ['HEAD'], { rules })), [
    'second',
    'first',
  ])
  assert.deepEqual(
    subjects(auditCommits(dir, ['HEAD'], { exclude: [first], rules })),
    ['second'],
  )
  assert.deepEqual(subjects(auditCommits(dir, [`${first}..HEAD`], { rules })), [
    'second',
  ])
  assert.deepEqual(auditCommits(dir, [], { rules }), {
    commits: [],
    findings: [],
  })
})

test('auditTree 只看一个提交的文件；auditRevision 只看这一个提交，不牵连祖先', async (t) => {
  const dir = await scratch(t)
  commit(dir, 'old.md', PRIVATE_PATH, 'dirty ancestor')
  git(dir, ['rm', '-q', 'old.md'])
  const clean = commit(dir, 'README.md', 'hello\n', 'clean')
  assert.deepEqual(auditTree(dir, clean, rules), [])
  assert.deepEqual(auditRevision(dir, clean, rules).findings, [])
  assert.equal(
    auditCommits(dir, [clean], { rules }).commits.length,
    2,
    'walking the history still reaches the ancestor',
  )

  const message = commit(dir, null, '', s('sync ', 'internal-foo'))
  assert.deepEqual(
    auditRevision(dir, message, rules).findings.map(
      (f) => `${f.where} ${f.kind}`,
    ),
    [`${message.slice(0, 7)} 提交信息`],
  )
  assert.deepEqual(
    auditTree(dir, message, rules),
    [],
    'the files are clean even though the message is not',
  )
})

test('pre-push 输入：删除和不相关的引用不审查；远端上已有的提交不重复审查', async (t) => {
  const dir = await scratch(t)
  const first = commit(dir, 'a.md', 'a\n', 'first')
  const second = commit(dir, 'b.md', 'b\n', 'second')
  const line = (remoteSha = ZERO) =>
    `refs/heads/main ${second} refs/heads/main ${remoteSha}\n`
  // 这次推送里对方现有的值，和 ls-remote 取到的远端引用，才算已发布。
  assert.deepEqual(subjects(auditPush(dir, 'origin', line(first), rules)), [
    'second',
  ])
  assert.deepEqual(
    subjects(auditPush(dir, 'origin', line(), rules, { remoteRefs: [first] })),
    ['second'],
  )
  assert.deepEqual(subjects(auditPush(dir, '/tmp/remote.git', line(), rules)), [
    'second',
    'first',
  ])
  assert.deepEqual(
    auditPush(
      dir,
      'origin',
      `refs/heads/gone ${ZERO} refs/heads/gone ${first}\n`,
      rules,
    ).commits,
    [],
  )
  assert.deepEqual(
    auditPush(
      dir,
      'origin',
      `refs/notes/commits ${second} refs/notes/commits ${ZERO}\n`,
      rules,
    ).commits,
    [],
  )
  // 本地缓存的远端分支可能过期（远端被删过、分支被删过），不能当作已发布。
  git(dir, ['remote', 'add', 'origin', '/tmp/remote.git'])
  git(dir, ['update-ref', 'refs/remotes/origin/main', second])
  assert.deepEqual(subjects(auditPush(dir, 'origin', line(), rules)), [
    'second',
    'first',
  ])
})

test('命令行：--repo 指向要审查的仓库；问不到远端时推送审查不放行', async (t) => {
  const { tool } = await toolRoot(t)
  const dir = await scratch(t)
  commit(dir, 'a.md', 'a\n', 'first')
  const audit = run(tool, ['--repo', dir, 'HEAD'])
  assert.equal(audit.status, 0, audit.stderr)
  assert.match(audit.stdout, /脱敏审查：1 个提交，0 处命中/)

  const missing = run(tool, [
    '--push',
    '--repo',
    dir,
    '--remote',
    join(tmpdir(), 'worktree-desk-audit-no-such-repo.git'),
  ])
  assert.notEqual(missing.status, 0)
  assert.match(missing.stderr, /脱敏审查没能完成/)
})

test('附注标签：标签信息和打标签的人也审查；轻量标签没有标签对象', async (t) => {
  const dir = await scratch(t)
  const head = commit(dir, 'a.md', 'a\n', 'first')
  git(dir, [
    '-c',
    s('user.name=internal-', 'foo'),
    '-c',
    s('user.email=somebody', '@mail.example.org.cn'),
    'tag',
    '-a',
    'v1',
    '-m',
    s('release ', 'internal-foo'),
  ])
  git(dir, ['tag', 'light'])
  assert.deepEqual(
    auditTagObject(dir, 'v1', rules).map((f) => `${f.kind} ${f.rule}`),
    [
      '打标签的人邮箱 不是 GitHub noreply 地址',
      `打标签的人名字 ${PRIVATE_DENY}`,
      `标签信息 ${PRIVATE_DENY}`,
    ],
  )
  assert.deepEqual(auditTagObject(dir, 'light', rules), [])
  const tagged = git(dir, ['rev-parse', 'v1'])
  const result = auditPush(
    dir,
    'origin',
    `refs/tags/v1 ${tagged} refs/tags/v1 ${ZERO}\n`,
    rules,
  )
  assert.deepEqual(
    result.commits.map((entry) => entry.sha),
    [head.slice(0, 7)],
  )
  assert.equal(result.findings.length, 3)
})

test('pre-push 钩子：干净的推送照常上去，带个人内容的推送被拦下', async (t) => {
  const { tool } = await toolRoot(t)
  const dir = await scratch(t)
  const remote = await bare(t)
  const installed = await installPushHook({ cwd: dir, tool })
  assert.equal(installed.changed, true)
  assert.equal((await stat(installed.path)).mode & 0o777, 0o755)
  assert.match(await readFile(installed.path, 'utf8'), /--push --remote "\$1"/)
  assert.equal((await installPushHook({ cwd: dir, tool })).changed, false)

  const clean = commit(dir, 'README.md', 'hello\n', 'init')
  const allowed = push(dir, remote)
  assert.equal(allowed.status, 0, allowed.stderr)
  assert.equal(git(remote, ['rev-parse', 'main']), clean)

  commit(dir, 'notes.md', PRIVATE_PATH, 'oops')
  const blocked = push(dir, remote)
  assert.notEqual(blocked.status, 0)
  assert.match(
    `${blocked.stdout}${blocked.stderr}`,
    /脱敏审查：1 个提交，1 处命中/,
  )
  assert.match(
    `${blocked.stdout}${blocked.stderr}`,
    /notes\.md:1\s+\[个人家目录路径\]/,
  )
  assert.match(`${blocked.stdout}${blocked.stderr}`, /推送已阻止/)
  assert.equal(git(remote, ['rev-parse', 'main']), clean)
})

test('钩子安装：不覆盖别的钩子；给了 onlyRemote 时，只有远端地址匹配才审查', async (t) => {
  const { tool } = await toolRoot(t)
  const dir = await scratch(t)
  const remote = await bare(t)
  const matchingRoot = await mkdtemp(
    join(tmpdir(), 'worktree-desk-audit-named-'),
  )
  cleanup(t, matchingRoot)
  const matching = join(matchingRoot, 'github.com', 'someone', 'else')
  mkdirSync(matching, { recursive: true })
  git(matching, ['init', '-q', '--bare'])

  const hook = join(dir, '.git', 'hooks', 'pre-push')
  mkdirSync(dirname(hook), { recursive: true })
  writeFileSync(hook, '#!/bin/sh\necho custom\n')
  await assert.rejects(
    installPushHook({ cwd: dir, tool }),
    /别的 pre-push 钩子/,
  )
  assert.equal(await readFile(hook, 'utf8'), '#!/bin/sh\necho custom\n')

  await rm(hook)
  await installPushHook({
    cwd: dir,
    tool,
    onlyRemote: 'github.com[:/]someone/else',
  })
  commit(dir, 'notes.md', PRIVATE_PATH, 'oops')
  const elsewhere = push(dir, remote)
  assert.equal(elsewhere.status, 0, elsewhere.stderr)
  const blocked = push(dir, matching)
  assert.notEqual(blocked.status, 0)
  assert.match(`${blocked.stdout}${blocked.stderr}`, /推送已阻止/)
})

test('私有名单：钩子要求它在，没有就不放行；手动审查没有名单时只剩通用规则', async (t) => {
  const none = await toolRoot(t, null)
  const dir = await scratch(t)
  const remote = await bare(t)
  commit(dir, 'README.md', 'hello\n', 'init')

  await assert.rejects(
    loadRules(none.root, { required: true }),
    /找不到私有名单/,
  )
  // 只有注释和空行的名单等于没有。
  const blank = await toolRoot(t)
  await writeFile(
    join(blank.root, '.local', 'release-deny.txt'),
    '# 还没写\n\n',
  )
  await assert.rejects(
    loadRules(blank.root, { required: true }),
    /找不到私有名单/,
  )
  const some = await toolRoot(t)
  assert.equal(
    (await loadRules(some.root, { required: true })).length,
    RULES.length + 1,
  )

  // 不是钩子那一次：没有名单也照常审，只是只有通用规则。
  const manual = run(none.tool, ['--repo', dir, 'HEAD'])
  assert.equal(manual.status, 0, manual.stderr)

  await installPushHook({ cwd: dir, tool: none.tool })
  const blocked = push(dir, remote)
  assert.notEqual(blocked.status, 0)
  assert.match(`${blocked.stdout}${blocked.stderr}`, /找不到私有名单/)
  assert.equal(
    spawnSync('git', ['rev-parse', '-q', '--verify', 'main'], {
      cwd: remote,
      encoding: 'utf8',
      env: ENV,
    }).status !== 0,
    true,
    '远端上什么都没上去',
  )
})

test('经软链接路径运行审查工具也要真的审：入口判断按真实路径比', async (t) => {
  const { root, tool } = await toolRoot(t)
  const dir = await scratch(t)
  commit(dir, 'notes.md', PRIVATE_PATH, 'oops')
  // 命令行里写的是链接路径，工具看到的自己是真实路径。
  const holder = await mkdtemp(join(tmpdir(), 'worktree-desk-audit-link-'))
  cleanup(t, holder)
  const linked = join(holder, 'tool')
  // holder 连同里面那个链接一起清掉（rm 不跟进链接，toolRoot 还在）。
  await symlink(root, linked)

  const viaLink = run(join(linked, 'scripts', 'release-audit.mjs'), [
    '--repo',
    dir,
    'HEAD',
  ])
  assert.equal(viaLink.status, 1, `${viaLink.stdout}${viaLink.stderr}`)
  assert.match(viaLink.stdout, /脱敏审查：1 个提交，1 处命中/)
  assert.equal(run(tool, ['--repo', dir, 'HEAD']).status, 1)
})
