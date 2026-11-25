import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  git,
  prunePlan,
  pruneStale,
  readNumstat,
  readStatus,
  readWorktrees,
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

test('文件清单最多留 100 项，但总数照常统计', () => {
  const many = [
    '# branch.oid 1',
    ...Array.from(
      { length: 130 },
      (_, i) => `1 .M N... 100644 100644 100644 a b f${i}.txt`,
    ),
    '',
  ].join('\0')
  const s = readStatus(many)
  assert.equal(s.total, 130)
  assert.equal(s.files.length, 100)
  assert.equal(s.unstaged, 130)
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
