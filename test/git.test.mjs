import test from 'node:test'
import { execFileSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { realpathSync } from 'node:fs'
import { mkdtemp, realpath, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  changedSince,
  filePatch,
  git,
  inspectTree,
  outgoing,
  prunePlan,
  pruneStale,
  readCommits,
  readNumstat,
  readRaw,
  readStatus,
  readWorktrees,
  upstreamCommit,
} from '../src/git.js'

// 每条记录以「NUL NUL」结尾。
const worktrees =
  [
    'worktree /repo/main\0HEAD abc123\0branch refs/heads/master',
    'worktree /repo/wt\0HEAD def456\0branch refs/heads/feat/x\0locked reason with spaces',
    'worktree /tmp/gone\0HEAD 789abc\0detached\0prunable gitdir file points to non-existent location',
    'worktree /repo/bare\0bare\0HEAD abc123',
  ].join('\0\0') + '\0\0'

test('解析 git worktree list --porcelain -z', () => {
  const rows = readWorktrees(worktrees)
  assert.equal(rows.length, 4)
  assert.deepEqual(
    rows.map((r) => [
      r.path,
      r.branch,
      r.main,
      r.detached,
      r.locked,
      r.prunable,
      r.bare,
    ]),
    [
      ['/repo/main', 'master', true, false, false, false, false],
      ['/repo/wt', 'feat/x', false, false, true, false, false],
      ['/tmp/gone', undefined, false, true, false, true, false],
      ['/repo/bare', undefined, false, false, false, false, true],
    ],
  )
  assert.equal(rows[1].lockedReason, 'reason with spaces')
  assert.equal(
    rows[2].prunableReason,
    'gitdir file points to non-existent location',
  )
})

const status = [
  '# branch.oid 21a6204861',
  '# branch.head dev/x',
  '# branch.upstream origin/dev/x',
  '# branch.ab +2 -3',
  `1 MM N... 100644 100644 100644 78981922613b 53732f84271 a.txt`,
  `1 .M N... 100644 100644 100644 617807982 617807982 dir/b c.txt`,
  // 改名条目比普通条目多一列相似度（R100）；-z 下新路径与原路径之间用 NUL 分隔。
  `2 R. N... 100644 100644 100644 f2ad6c76 f2ad6c76 R100 renamed.txt\0old.txt`,
  `? new file.txt`,
  // 未合并条目有三个阶段各自的模式和哈希。
  `u UU N... 100644 100644 100644 100644 abc def 123 conflicted.txt`,
  '',
].join('\0')

test('解析 git status --porcelain=v2 -z：计数、重命名来源、冲突', () => {
  const changed = []
  const s = readStatus(status, changed)
  assert.deepEqual(
    [
      s.staged,
      s.unstaged,
      s.untracked,
      s.conflicts,
      s.total,
      s.ahead,
      s.behind,
      s.upstream,
      s.branch,
      s.head,
    ],
    [2, 2, 1, 1, 5, 2, 3, 'origin/dev/x', 'dev/x', '21a6204861'],
  )
  assert.equal(changed.length, 5)
  assert.deepEqual(
    s.files.map((f) => [f.path, f.xy, f.from, f.conflict, f.id?.length]),
    [
      ['a.txt', 'MM', undefined, false, 32],
      ['dir/b c.txt', '.M', undefined, false, 32],
      ['renamed.txt', 'R.', 'old.txt', false, 32],
      ['new file.txt', '??', undefined, false, 32],
      ['conflicted.txt', 'UU', undefined, true, 32],
    ],
  )
})

test('文件清单最多留 2000 项，但总数照常统计', () => {
  const many = [
    '# branch.oid 1',
    ...Array.from(
      { length: 2300 },
      (_, i) => `1 .M N... 100644 100644 100644 a b f${i}.txt`,
    ),
    '',
  ].join('\0')
  const s = readStatus(many)
  assert.equal(s.total, 2300)
  assert.equal(s.files.length, 2000)
  assert.equal(s.unstaged, 2300)
})

test('尚未有首个提交时 HEAD 为空', () => {
  const s = readStatus('# branch.oid (initial)\0# branch.head main\0')
  assert.equal(s.head, null)
  assert.equal(s.branch, 'main')
  assert.equal(s.total, 0)
})

test('解析 git diff --numstat -z：普通、重命名、二进制', () => {
  // 样例取自真实输出：新增、删除、路径用制表符分隔，记录之间用 NUL；
  // 重命名在空路径之后依次给出原路径、新路径。
  const stats = readNumstat(
    ['12\t3\ta.txt', '-\t-\tlogo.png', '4\t0\t', 'old.js', 'new.js', ''].join(
      '\0',
    ),
  )
  assert.deepEqual(
    [...stats],
    [
      ['a.txt', { add: 12, del: 3 }],
      ['logo.png', { add: null, del: null }],
      ['new.js', { add: 4, del: 0 }],
    ],
  )
  assert.equal(readNumstat('').size, 0)
})

test('清理失效登记：预览只列目录已消失的，锁定的与在用的不动', async (t) => {
  // 在临时仓库里真跑一遍：这是面板唯一的 Git 写操作。
  const dir = await mkdtemp(path.join(tmpdir(), 'worktree-desk-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const main = path.join(dir, 'main')
  const who = ['-c', 'user.name=t', '-c', 'user.email=t@example.com']
  const listed = async () =>
    readWorktrees(await git(main, 'worktree', 'list', '--porcelain', '-z')).map(
      (row) => path.basename(row.path),
    )
  await git(dir, 'init', '-q', '-b', 'main', 'main')
  await writeFile(path.join(main, 'a.txt'), 'a\n')
  await git(main, 'add', 'a.txt')
  await git(main, ...who, 'commit', '-q', '-m', 'init')
  for (const name of ['gone', 'locked', 'kept'])
    await git(
      main,
      'worktree',
      'add',
      '-q',
      '--detach',
      path.join(dir, name),
      'HEAD',
    )
  await git(main, 'worktree', 'lock', path.join(dir, 'locked'))
  await rm(path.join(dir, 'gone'), { recursive: true, force: true })
  await rm(path.join(dir, 'locked'), { recursive: true, force: true })

  const reason = 'gitdir file points to non-existent location'
  assert.deepEqual(await prunePlan(main), [{ name: 'gone', reason }])
  // 报告走的是 stderr，只读 stdout 的封装会一直得到「没有可清理的」。
  assert.deepEqual(await pruneStale(main), [
    `Removing worktrees/gone: ${reason}`,
  ])
  assert.deepEqual(await listed(), ['main', 'kept', 'locked'])
  assert.deepEqual(await prunePlan(main), [])
  assert.ok(await stat(path.join(dir, 'kept', 'a.txt')))
})

test('解析 git diff --raw -z --numstat：状态、重命名、工作区版本没有对象名', () => {
  // 样例取自真实输出：前半是每个文件的原始记录（重命名的原路径跟在后面），后半是同样顺序的增删行数。
  const text = [
    ':000000 100644 0000000000000000 8ba3a16384aacc37 A',
    'add.txt',
    ':100644 000000 286c5f5776916d7d 0000000000000000 D',
    'del.txt',
    ':100644 100644 1a9cc2b7fbfa8349 0000000000000000 M',
    'mod.txt',
    ':100644 100644 b77b4eb1d946f923 b77b4eb1d946f923 R100',
    'old.txt',
    'new.txt',
    '1\t0\tadd.txt',
    '0\t1\tdel.txt',
    '2\t0\tmod.txt',
    '0\t0\t',
    'old.txt',
    'new.txt',
    '',
  ].join('\0')
  const { files, stats } = readRaw(text)
  assert.deepEqual(
    files.map((f) => [f.path, f.from, f.st, f.blob]),
    [
      ['add.txt', undefined, 'A', '8ba3a16384aacc37'],
      ['del.txt', undefined, 'D', null],
      // 工作目录里的内容还没进索引：新对象是全零，记成没有。
      ['mod.txt', undefined, 'M', null],
      ['new.txt', 'old.txt', 'R', 'b77b4eb1d946f923'],
    ],
  )
  assert.deepEqual(
    [...stats],
    [
      ['add.txt', { add: 1, del: 0 }],
      ['del.txt', { add: 0, del: 1 }],
      ['mod.txt', { add: 2, del: 0 }],
      ['new.txt', { add: 0, del: 0 }],
    ],
  )
  assert.deepEqual(readRaw(''), { files: [], stats: new Map() })
})

test('解析提交清单：每条后面跟一个记录结束符，标题里的换行换成空格', () => {
  const a = 'a'.repeat(40),
    b = 'b'.repeat(64)
  const commits = readCommits(
    `${a}\x1f1700000000\x1ffix: 修一个\n换行的问题\x1e${b}\x1f1700000001\x1ffeat: 新功能\x1e`,
  )
  assert.deepEqual(
    commits.map((c) => [c.sha, c.time, c.title]),
    [
      [a, 1700000000000, 'fix: 修一个 换行的问题'],
      [b, 1700000001000, 'feat: 新功能'],
    ],
  )
  // 不是提交号的记录不收
  assert.deepEqual(readCommits('not-a-sha\x1f1\x1fx\x1e'), [])
  assert.deepEqual(readCommits(''), [])
})

test('未推送的改动：和上游比的文件清单、提交、差异；上游不可靠就不给', async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), 'worktree-desk-'))
  t.after(() => rm(dir, { recursive: true, force: true }))
  const who = ['-c', 'user.name=t', '-c', 'user.email=t@example.com']
  const main = path.join(dir, 'main'),
    wt = path.join(dir, 'wt'),
    remote = path.join(dir, 'remote.git')
  const save = async (cwd, message) => {
    await git(cwd, 'add', '-A')
    await git(cwd, ...who, 'commit', '-q', '-m', message)
  }
  await git(dir, 'init', '-q', '-b', 'main', 'main')
  await writeFile(path.join(main, 'keep.txt'), 'a\nb\n')
  await writeFile(path.join(main, 'mod.txt'), 'one\ntwo\n')
  await writeFile(path.join(main, 'old.txt'), 'x\n')
  await save(main, 'base')
  await git(dir, 'init', '-q', '--bare', '--initial-branch=main', remote)
  await git(main, 'remote', 'add', 'origin', remote)
  // 面板自己的 git() 禁了一切传输协议（只读）：推送到本机的裸仓库要用普通的 git。
  execFileSync('git', ['-C', main, 'push', '-q', '-u', 'origin', 'main'], {
    env: { ...process.env, GIT_ALLOW_PROTOCOL: 'file' },
    stdio: 'ignore',
  })
  await git(main, 'worktree', 'add', '-q', '-b', 'feat/x', wt, 'main')
  await git(wt, 'branch', '--set-upstream-to=origin/main', 'feat/x')
  const common = await realpath(path.join(main, '.git'))
  const tree = readWorktrees(
    await git(wt, 'worktree', 'list', '--porcelain', '-z'),
  ).find((row) => row.path === realpathSync(wt))
  // 还没有未推送的提交：没有这个范围
  assert.equal((await inspectTree(tree, common)).status.outgoing, undefined)
  assert.equal((await outgoing(wt, [], 'origin/main')).total, 0)

  // 两个提交：改一个、加一个、改名；再在工作目录里改 mod.txt、放一个未跟踪的文件
  await writeFile(path.join(wt, 'mod.txt'), 'one\ntwo\nthree\n')
  await save(wt, 'second')
  await git(wt, 'mv', 'old.txt', 'new.txt')
  await writeFile(path.join(wt, 'add.txt'), 'n\n')
  await save(wt, 'third')
  await writeFile(path.join(wt, 'mod.txt'), 'one\ntwo\nthree\nfour\n')
  await writeFile(path.join(wt, 'untracked.txt'), 'u\n')

  const status = (await inspectTree(tree, common)).status
  assert.equal(status.ahead, 2)
  assert.equal(status.outgoing.ref, 'origin/main')
  assert.equal(status.outgoing.total, 4)
  assert.deepEqual(
    status.outgoing.commits.map((c) => c.title),
    ['third', 'second'],
  )
  assert.deepEqual(
    status.outgoing.files.map((f) => [
      f.st ?? f.xy,
      f.path,
      f.from ?? null,
      !!f.dirty,
    ]),
    [
      ['A', 'add.txt', null, false],
      // 提交之后工作目录里又改了
      ['M', 'mod.txt', null, true],
      ['R', 'new.txt', 'old.txt', false],
      ['??', 'untracked.txt', null, false],
    ],
  )
  // 每个文件都带着此刻的修改时间和大小
  assert.ok(status.outgoing.files.every((f) => f.mtime > 0 && f.size > 0))

  for (const file of status.outgoing.files) {
    const patch = await filePatch(
      tree,
      common,
      file.id,
      file.xy === '??' ? 'new' : 'outgoing',
    )
    assert.ok(patch.text, `${file.path} 应该有差异`)
    if (file.st) assert.match(patch.text, /^diff --git a\//)
  }
  const rename = status.outgoing.files.find((f) => f.st === 'R')
  assert.match(
    (await filePatch(tree, common, rename.id, 'outgoing')).text,
    /rename from old\.txt\nrename to new\.txt/,
  )
  // 同一个文件按「未暂存」那一层去要：它不在那个清单里，不给读
  assert.equal(
    (await filePatch(tree, common, rename.id, 'work')).note,
    '文件状态已变化，请刷新工作树。',
  )
  // 直接问和哪个提交比
  assert.equal(
    await upstreamCommit(wt, 'origin/main'),
    await git(wt, 'rev-parse', 'origin/main').then((s) => s.trim()),
  )
  // 上游的名字不像分支名、或者根本不是这个仓库的：不拿去拼版本表达式
  assert.equal(await upstreamCommit(wt, 'origin/x --output=x'), null)
  assert.equal(await upstreamCommit(wt, '../../etc'), null)
  assert.equal(await upstreamCommit(wt, 'origin/nope'), null)
  assert.deepEqual(await changedSince(wt, [], 'not-a-sha'), [])
  assert.equal(await outgoing(wt, [], 'origin/nope'), null)
})
