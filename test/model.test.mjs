import test from 'node:test'
import assert from 'node:assert/strict'
import {
  FILE_FILTERS,
  FILTERS,
  arrange,
  branchLabel,
  compareTrees,
  defaultScope,
  fileBadge,
  fileFilters,
  groupFiles,
  isQuiet,
  markText,
  markTone,
  match,
  relTime,
  repoSummary,
  reviewGone,
  rowMarks,
  scopeFiles,
  scopeOptions,
  scopeTotal,
  signal,
  ticketOf,
  treeName,
} from '../client/model.js'
import { readStatus } from '../src/git.js'

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

test('行首的状态点：只有有事可做时才有颜色，干净、落后、失效的行不画', () => {
  const dirty = tree({ status: status({ total: 3 }) })
  const ahead = tree({ status: status({ ahead: 2 }) })
  const behind = tree({ status: status({ behind: 4 }) })
  assert.equal(markTone(dirty), 'warn')
  assert.equal(markTone(ahead), 'accent')
  assert.equal(markTone(tree({ status: status({ conflicts: 1 }) })), 'danger')
  assert.equal(markTone(tree({ operations: ['合并中'] })), 'danger')
  assert.equal(markTone(tree({ error: 'x' })), 'danger')
  // 这些行不画点：空心圆看上去像没选中的单选按钮
  assert.equal(markTone(tree({ status: status() })), null)
  assert.equal(markTone(behind), null)
  assert.equal(markTone(tree({ prunable: true })), null)
  assert.equal(markTone(tree({})), null)
  // 颜色始终跟状态文字一致
  for (const t of [dirty, ahead, behind])
    assert.equal(markTone(t) ?? 'muted', signal(t).tone)
})

test('仓库下拉的选项：没有关键词时「全部仓库」排第一；有关键词时只列匹配的', () => {
  const repos = [
    {
      id: 'a',
      name: 'shop-frontend',
      path: '/code/shop-fe',
      groups: ['shop'],
      count: 3,
    },
    {
      id: 'b',
      name: 'shop-backend',
      path: '/code/shop-be',
      groups: ['shop'],
      count: 2,
    },
    { id: 'c', name: 'blog-api', path: '/code/blog', groups: [], count: 9 },
  ]
  assert.deepEqual(scopeOptions(repos, ''), [
    { id: 'all', name: '全部仓库' },
    { id: 'a', name: 'shop-frontend', path: '/code/shop-fe', count: 3 },
    { id: 'b', name: 'shop-backend', path: '/code/shop-be', count: 2 },
    { id: 'c', name: 'blog-api', path: '/code/blog', count: 9 },
  ])
  // 名称、路径、所属项目都能搜到；大小写不敏感
  assert.deepEqual(
    scopeOptions(repos, 'SHOP').map((o) => o.id),
    ['a', 'b'],
  )
  assert.deepEqual(
    scopeOptions(repos, 'blog').map((o) => o.id),
    ['c'],
  )
  assert.deepEqual(
    scopeOptions(repos, 'frontend be'),
    [],
    '多个关键词须同时命中',
  )
  assert.deepEqual(
    scopeOptions(repos, 'shop front').map((o) => o.id),
    ['a'],
  )
  assert.deepEqual(scopeOptions(repos, 'zzz'), [])
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

test('分支名拆成分类和其余：只认第一段斜杠路径', () => {
  assert.deepEqual(branchLabel('feat/DEMO-20431-demo'), [
    'feat/',
    'DEMO-20431-demo',
  ])
  assert.deepEqual(branchLabel('codex/a/b'), ['codex/', 'a/b'])
  assert.deepEqual(branchLabel('main'), [null, 'main'])
  // 开头就是斜杠的不算分类；取不到名称时按空字符串处理。
  assert.deepEqual(branchLabel('/x'), [null, '/x'])
  assert.deepEqual(branchLabel(undefined), [null, ''])
})

test('相对时间', () => {
  const now = new Date(2026, 10, 24, 15, 30).getTime()
  assert.equal(relTime(now - 20 * 1000, now), '刚刚')
  assert.equal(relTime(now - 5 * 60 * 1000, now), '5 分钟前')
  assert.equal(relTime(now - 3 * 3600 * 1000, now), '3 小时前')
  assert.equal(relTime(now - 20 * 3600 * 1000, now), '11/23 19:30')
  // 超过一周：只写日期。今年的省略年份，去年及更早才写年份。
  assert.equal(relTime(now - 9 * 24 * 3600 * 1000, now), '11/15')
  assert.equal(relTime(new Date(2025, 11, 30).getTime(), now), '2025/12/30')
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

test('文件归并：改动都在同一个目录下时，这个目录保留自己的一行', () => {
  const files = [
    'docs/stock-count/verify.sql',
    'docs/stock-count/authorized.sql',
    'docs/盘点说明.md',
  ].map((path) => ({ xy: '.M', path }))
  const tree = groupFiles(files)
  // 顶层没有被提到顶格的文件：都在 docs/ 这一行下面，缩进一层、只写文件名。
  assert.equal(tree.files.length, 0)
  assert.deepEqual(
    tree.dirs.map((d) => [d.name, d.count, d.files.length]),
    [['docs/', 3, 1]],
  )
  assert.equal(tree.dirs[0].files[0].path, 'docs/盘点说明.md')
  assert.deepEqual(
    tree.dirs[0].dirs.map((d) => [d.name, d.files.length]),
    [['stock-count/', 2]],
  )
})

test('文件徽标：已暂存、未暂存、两者都有', () => {
  assert.deepEqual(fileBadge({ xy: 'M.', path: 'a' }), {
    code: 'M',
    text: '已暂存',
    detail: '修改，已暂存',
    staged: true,
    unstaged: false,
    tone: 'staged',
  })
  const unstaged = fileBadge({ xy: '.M' })
  assert.equal(unstaged.detail, '修改，未暂存')
  assert.deepEqual([unstaged.staged, unstaged.unstaged], [false, true])
  const both = fileBadge({ xy: 'AM' })
  assert.equal(both.code, 'AM')
  assert.equal(both.text, '已暂存，又有改动')
  assert.deepEqual([both.staged, both.unstaged], [true, true])
  assert.equal(fileBadge({ xy: '??' }).unstaged, false)
  // 冲突的文件两个筛选里都不出现（Git 把它单算一类），只出现在「全部」里。
  const conflict = fileBadge({ xy: 'UU', conflict: true })
  assert.deepEqual([conflict.staged, conflict.unstaged], [false, false])
  assert.equal(
    fileBadge({ xy: 'R.', from: 'old.js' }).detail,
    '重命名（原 old.js），已暂存',
  )
  assert.equal(fileBadge({ xy: '??' }).code, '?')
  assert.equal(fileBadge({ xy: 'UU', conflict: true }).text, '冲突')
})

test('文件筛选：标签上写几个，筛出来就是几个（和宿主统计的口径一致）', () => {
  // 曾经的毛病：「未暂存」的判定读了一个不存在的字段，标签写着 12、筛出来是空的。
  const text = [
    '# branch.oid 1',
    '# branch.head dev/x',
    '1 M. N... 100644 100644 100644 a b staged.txt',
    '1 .M N... 100644 100644 100644 a b unstaged.txt',
    '1 MM N... 100644 100644 100644 a b both.txt',
    '1 A. N... 100644 100644 100644 0000000 a added.txt',
    '2 R. N... 100644 100644 100644 a b R100 renamed.txt\0old.txt',
    '? new.txt',
    'u UU N... 100644 100644 100644 100644 abc def 123 conflicted.txt',
    '',
  ].join('\0')
  const s = readStatus(text)
  const names = (key) =>
    s.files.filter(FILE_FILTERS[key][1]).map((file) => file.path)
  assert.deepEqual(names('unstaged'), ['unstaged.txt', 'both.txt'])
  assert.deepEqual(names('staged'), [
    'staged.txt',
    'both.txt',
    'added.txt',
    'renamed.txt',
  ])
  assert.deepEqual(names('untracked'), ['new.txt'])
  assert.equal(names('all').length, s.files.length)
  for (const key of ['unstaged', 'staged', 'untracked'])
    assert.equal(names(key).length, s[key], key)
})

test('行尾的标记：只列要动手的事，顺序固定', () => {
  const dirty = {
    ...status({ total: 12, staged: 2, unstaged: 8, untracked: 2 }),
    ahead: 2,
    behind: 0,
    upstream: 'origin/dev/x',
  }
  assert.deepEqual(rowMarks(tree({ status: dirty })), [
    { key: 'ahead', count: 2 },
    { key: 'dirty', count: 12 },
  ])
  assert.deepEqual(
    rowMarks(tree({ status: status({ behind: 3, upstream: 'origin/main' }) })),
    [{ key: 'behind', count: 3 }],
  )
  assert.deepEqual(rowMarks(tree({ status: status() })), [])
  // 冲突、做到一半的操作比改动数更要紧：只列它。
  assert.deepEqual(
    rowMarks(tree({ status: { ...dirty, conflicts: 1, total: 1 } })),
    [{ key: 'ahead', count: 2 }, { key: 'trouble' }],
  )
  assert.deepEqual(rowMarks(tree({ operations: ['合并中'] })), [
    { key: 'trouble' },
  ])
  assert.deepEqual(
    rowMarks(tree({ prunable: true, prunableReason: 'not a valid directory' })),
    [{ key: 'stale' }],
  )
  assert.deepEqual(rowMarks(tree({})), [{ key: 'unknown' }])
  assert.equal(
    markText(tree({ status: dirty }), 'dirty'),
    '12 项改动：已暂存 2 · 未暂存 8 · 未跟踪 2',
  )
  assert.match(markText(tree({ status: dirty }), 'ahead'), /^2 个提交未推送/)
  assert.equal(markText(tree({ operations: ['合并中'] }), 'trouble'), '合并中')
  assert.equal(
    markText(
      tree({ prunable: true, prunableReason: 'not a valid directory' }),
      'stale',
    ),
    '登记的路径不是一个目录',
  )
})

test('从分支名取工单号：前缀式优先，日期不算，取不到返回 null', () => {
  assert.deepEqual(ticketOf('feat/DEMO-20431-export-csv'), {
    key: 'DEMO-20431',
    color: '#7c8db5', // 20431 % 8 = 7
  })
  // 同一个需求两种写法颜色一致，显示的键不同。
  assert.equal(
    ticketOf('feat/20431-export-csv').color,
    ticketOf('feat/DEMO-20431-x').color,
  )
  assert.equal(ticketOf('codex/7001-rule-demo').key, '7001')
  assert.equal(ticketOf('integrate/7001-release-20261105').key, '7001')
  assert.equal(ticketOf('feat/7013-settings-cleanup').key, '7013')
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

test('和上游比的文件：徽标写明已提交，提交之后又改过的另算', () => {
  assert.deepEqual(fileBadge({ st: 'M', path: 'src/a.js' }), {
    code: 'M',
    text: '修改，已提交',
    detail: '修改，已提交，还没推送',
    staged: false,
    unstaged: false,
    outgoing: true,
    tone: 'commit',
  })
  const again = fileBadge({
    st: 'R',
    path: 'src/new.js',
    from: 'src/old.js',
    dirty: true,
  })
  assert.equal(again.code, 'R')
  assert.equal(again.text, '已提交，又有改动')
  assert.match(again.detail, /原 src\/old\.js/)
  assert.match(again.detail, /又有改动/)
})

test('未推送的范围里文件分三类：已提交、提交之后又改的、未跟踪；未提交的还是原来三类', () => {
  assert.equal(fileFilters('uncommitted'), FILE_FILTERS)
  const { committed, touched, untracked } = fileFilters('outgoing')
  assert.ok(committed[1]({ st: 'M' }))
  assert.ok(!committed[1]({ st: 'M', dirty: true }))
  assert.ok(!committed[1]({ xy: '??' }))
  assert.ok(touched[1]({ st: 'A', dirty: true }))
  assert.ok(!touched[1]({ st: 'A' }))
  assert.ok(untracked[1]({ xy: '??' }))
  assert.ok(!untracked[1]({ st: 'A' }))
  assert.equal(Object.keys(fileFilters('outgoing')).length, 4)
})

test('两个范围：先看没提交的，都提交了再看没推送的；没有未推送的提交就没有这个范围', () => {
  const dirty = tree({ status: status({ total: 2 }) })
  const clean = tree({
    status: status({
      total: 0,
      outgoing: { total: 3, files: [{ path: 'a' }] },
    }),
  })
  const nothing = tree({ status: status({}) })
  assert.equal(defaultScope(dirty), 'uncommitted')
  assert.equal(defaultScope(clean), 'outgoing')
  assert.equal(defaultScope(nothing), 'uncommitted')
  assert.equal(defaultScope(tree({})), 'uncommitted')
  assert.equal(scopeFiles(clean, 'outgoing').length, 1)
  assert.equal(scopeTotal(clean, 'outgoing'), 3)
  assert.equal(scopeFiles(dirty, 'outgoing'), null)
  assert.equal(scopeTotal(dirty, 'outgoing'), 0)
})

test('「审查过」：哪棵树做过 AI 审查要从面板那里问；没人可问就不算', () => {
  assert.equal(FILTERS.reviewed[0], '审查过')
  assert.equal(FILTERS.reviewed[1]({}), false)
  assert.equal(FILTERS.reviewed[1]({}, { reviewed: () => false }), false)
  assert.equal(
    FILTERS.reviewed[1](
      { id: 't' },
      {
        repo: { id: 'r' },
        reviewed: (repo, t) => repo.id === 'r' && t.id === 't',
      },
    ),
    true,
  )
  // 不带上下的统计（仓库摘要、侧栏）不把它算进去
  assert.deepEqual(repoSummary([tree({ status: status({ total: 1 }) })]), {
    dirty: 1,
    unpushed: 0,
    behind: 0,
    trouble: 0,
    stale: 0,
  })
})

test('审查过的改动还在不在：没提交的都提交了、没推送的都推送了，就是不在了；状态读不到不下结论', () => {
  // 审的是未提交的改动：工作区干净了就不在了
  assert.equal(reviewGone({ status: { total: 0 } }), true)
  assert.equal(reviewGone({ status: { total: 2 } }), false)
  // 审的是未推送的改动：和上游比的清单没有了（推送完了）就不在了
  assert.equal(reviewGone({ status: { total: 0 } }, 'outgoing'), true)
  assert.equal(
    reviewGone({ status: { total: 1, outgoing: { files: [] } } }, 'outgoing'),
    false,
  )
  // 没提交的都提交了、但还没推送：审未提交的那次不在了，审未推送的那次还在
  assert.equal(reviewGone({ status: { total: 0, outgoing: {} } }), true)
  // 状态没读到、或者读失败：说不准
  assert.equal(reviewGone({}), false)
  assert.equal(reviewGone(null), false)
  assert.equal(reviewGone({ error: '读取失败', status: { total: 0 } }), false)
})
