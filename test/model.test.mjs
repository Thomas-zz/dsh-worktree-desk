import test from 'node:test'
import assert from 'node:assert/strict'
import {
  arrange,
  compareTrees,
  fileBadge,
  groupFiles,
  isQuiet,
  match,
  relTime,
  repoSummary,
  signal,
  ticketOf,
  treeName,
} from '../client/model.js'

const tree = (extra) => ({ path: '/x', sessions: [], ...extra })
const status = (extra) => ({
  total: 0,
  staged: 0,
  unstaged: 0,
  untracked: 0,
  conflicts: 0,
  ...extra,
})

test('主状态互斥，按严重程度取第一个命中的', () => {
  assert.equal(signal(tree({ prunable: true, error: 'x' })).key, 'stale')
  assert.equal(
    signal(
      tree({
        status: status({ conflicts: 2, total: 5 }),
        operations: ['合并中'],
      }),
    ).key,
    'conflict',
  )
  assert.equal(
    signal(tree({ status: status(), operations: ['变基中'] })).key,
    'operation',
  )
  assert.equal(signal(tree({ error: '读取超时' })).key, 'error')
  assert.equal(signal(tree({ error: 'x', limited: true })).label, '未检查文件')
  assert.equal(
    signal(tree({ status: status({ total: 3, ahead: 2 }) })).key,
    'dirty',
  )
  assert.equal(signal(tree({ status: status({ ahead: 2 }) })).key, 'ahead')
  assert.equal(signal(tree({ status: status({ behind: 4 }) })).key, 'behind')
  assert.equal(signal(tree({ status: status() })).key, 'clean')
  assert.equal(signal(tree({ bare: true })).key, 'unknown')
  assert.deepEqual(
    [
      signal(tree({ status: status({ total: 3 }) })).label,
      signal(tree({ status: status({ ahead: 2 }) })).label,
    ],
    ['3 项改动', '2 个提交未推送'],
  )
})

test('排序：先关注程度，再会话活跃度，再最近改动；可改为纯按最近改动', () => {
  const now = 1e12
  const clean = tree({
    path: 'c',
    status: status(),
    lastChange: { time: now - 1000 },
  })
  const dirtyOld = tree({
    path: 'd',
    status: status({ total: 1 }),
    lastChange: { time: now - 9e10 },
  })
  const dirtyLive = tree({
    path: 'l',
    status: status({ total: 2 }),
    lastChange: { time: now - 9e10 },
    sessions: [{ time: now - 5000 }],
  })
  const stale = tree({ path: 's', prunable: true, lastChange: { time: now } })
  const list = [stale, clean, dirtyOld, dirtyLive]
  assert.deepEqual(
    [...list].sort((a, b) => compareTrees(a, b)).map((t) => t.path),
    ['l', 'd', 'c', 's'],
  )
  assert.deepEqual(
    [...list].sort((a, b) => compareTrees(a, b, false)).map((t) => t.path),
    ['s', 'c', 'd', 'l'],
  )
})

test('仓库摘要各项计数', () => {
  const counts = repoSummary([
    tree({ status: status({ total: 1, ahead: 1 }) }),
    tree({ status: status({ behind: 1 }) }),
    tree({ prunable: true }),
    tree({ status: status({ conflicts: 1, total: 2 }) }),
    tree({ status: status() }),
  ])
  assert.deepEqual(counts, {
    dirty: 2,
    unpushed: 1,
    behind: 1,
    trouble: 1,
    stale: 1,
  })
})

test('分离 HEAD 用短哈希作名称', () => {
  assert.equal(treeName(tree({ branch: 'main' })), 'main')
  assert.equal(
    treeName(tree({ detached: true, head: 'd695f94fabc' })),
    'd695f94f',
  )
  assert.equal(treeName(tree({ detached: true })), '分支未知')
  assert.equal(treeName(tree({ bare: true })), '裸仓库')
})

test('相对时间', () => {
  const now = new Date(2026, 10, 24, 15, 30).getTime()
  assert.equal(relTime(now - 20 * 1000, now), '刚刚')
  assert.equal(relTime(now - 5 * 60 * 1000, now), '5 分钟前')
  assert.equal(relTime(now - 3 * 3600 * 1000, now), '3 小时前')
  assert.equal(relTime(now - 20 * 3600 * 1000, now), '11/23 19:30')
  assert.equal(relTime('bad', now), '时间未知')
})

test('搜索：多个关键词须全部命中，大小写不敏感', () => {
  assert.equal(match('', 'anything'), true)
  assert.equal(match('CORE  rule', 'demo-core', 'codex/7001-rule-demo'), true)
  assert.equal(match('zzz', 'demo-core'), false)
  assert.equal(match('  ', ''), true)
})

test('文件按目录归并，单链目录合成一段', () => {
  const files = [
    { path: 'web-app/src/main/java/com/a/One.java' },
    { path: 'web-app/src/main/java/com/a/Two.java' },
    { path: 'web-app/src/test/java/T.java' },
    { path: 'docs/readme.md' },
  ].map((f) => ({ xy: '.M', ...f }))
  const tree = groupFiles(files)
  assert.equal(tree.count, 4)
  assert.deepEqual(
    tree.dirs.map((d) => [d.name, d.count]),
    [
      ['docs/', 1],
      ['web-app/src/', 3],
    ],
  )
  const app = tree.dirs[1]
  assert.equal(app.files.length, 0)
  assert.deepEqual(
    app.dirs.map((d) => [d.name, d.count, d.files.length]),
    [
      ['main/java/com/a/', 2, 2],
      ['test/java/', 1, 1],
    ],
  )
})

test('文件徽标：已暂存、未暂存、两者都有', () => {
  assert.deepEqual(fileBadge({ xy: 'M.', path: 'a' }), {
    code: 'M',
    text: '已暂存',
    detail: '修改，已暂存',
    staged: true,
    tone: 'staged',
  })
  assert.equal(fileBadge({ xy: '.M' }).detail, '修改，未暂存')
  const both = fileBadge({ xy: 'AM' })
  assert.equal(both.code, 'AM')
  assert.equal(both.text, '已暂存，又有改动')
  assert.equal(both.staged, true)
  assert.equal(
    fileBadge({ xy: 'R.', from: 'old.js' }).detail,
    '重命名（原 old.js），已暂存',
  )
  assert.equal(fileBadge({ xy: '??' }).code, '?')
  assert.equal(fileBadge({ xy: 'UU', conflict: true }).text, '冲突')
})

test('从分支名取工单号：前缀式优先，日期不算，取不到返回 null', () => {
  assert.deepEqual(ticketOf('feat/DEMO-10431-export-csv'), {
    key: 'DEMO-10431',
    color: '#7c8db5', // 10431 % 8 = 7
  })
  // 同一个需求两种写法颜色一致，显示的键不同。
  assert.equal(
    ticketOf('feat/10431-export-csv').color,
    ticketOf('feat/DEMO-10431-x').color,
  )
  assert.equal(ticketOf('codex/7001-rule-demo').key, '7001')
  assert.equal(ticketOf('integrate/7001-release-20261105').key, '7001')
  assert.equal(ticketOf('feat/9013-settings-cleanup').key, '9013')
  assert.equal(ticketOf('main'), null)
  assert.equal(ticketOf('fix/refactor-config-20261106'), null)
  assert.equal(ticketOf('codex/parser-13-48-49').key, 'PARSER-13')
})

test('安静的仓库：只有主检出、干净、没有会话', () => {
  const clean = { path: '/r', main: true, status: status(), tools: [] }
  assert.equal(isQuiet([clean]), true)
  assert.equal(isQuiet([{ ...clean, main: false }]), false)
  assert.equal(isQuiet([clean, clean]), false)
  assert.equal(isQuiet([{ ...clean, status: status({ total: 1 }) }]), false)
  assert.equal(isQuiet([{ ...clean, tools: ['Codex'] }]), false)
  assert.equal(isQuiet([{ ...clean, prunable: true }]), false)
})

test('编排：关注优先时改动排在干净前；按最近改动时只看时间', () => {
  const t = (path, extra, time) => ({
    path,
    sessions: [],
    lastChange: { time },
    ...extra,
  })
  const entries = [
    { repo: { name: 'c' }, live: [t('c', { status: status() }, 900)] },
    {
      repo: { name: 'd' },
      live: [t('d', { status: status({ total: 1 }) }, 100)],
    },
    { repo: { name: 'e' }, live: [] },
  ]
  assert.deepEqual(
    arrange(entries, 'attention').map((e) => e.repo.name),
    ['d', 'c', 'e'],
  )
  assert.deepEqual(
    arrange(entries, 'recent').map((e) => e.repo.name),
    ['c', 'd', 'e'],
  )
})
