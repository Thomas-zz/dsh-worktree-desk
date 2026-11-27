import test from 'node:test'
import assert from 'node:assert/strict'
import {
  decode,
  decodeArea,
  decodeList,
  decodeTree,
  encode,
  viewState,
} from '../client/viewstate.js'

const ID = 'a'.repeat(32)
const TREE = `${ID}:${'b'.repeat(32)}`
const storage = () => {
  const map = new Map()
  globalThis.localStorage = {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  }
  return map
}
test.beforeEach(() => {
  storage()
  viewState.clear()
})

test('清单这一边：没记过的项是默认值；写坏了的不采信', () => {
  assert.deepEqual(decodeList(null), {
    scope: 'all',
    query: '',
    filter: '',
    tool: '',
    stack: 0,
    selected: null,
    collapsed: [],
    staleOpen: [],
    quietOpen: false,
    branchesOpen: false,
    top: 0,
  })
  const saved = decodeList({
    scope: ID,
    branchesOpen: true,
    query: 'x'.repeat(300),
    filter: 'unpushed',
    tool: 'ZCode',
    stack: 1,
    selected: { repo: ID, path: '/r/main' },
    collapsed: ['x', 'x', 7, 'y'],
    staleOpen: 'nope',
    quietOpen: true,
    top: 48.6,
  })
  assert.equal(saved.scope, ID)
  // 早先的留存里有「工作树 / 本地分支」页签那一项：页签没有了，这一项不再采信。
  assert.equal(decodeList({ view: 'branches' }).branchesOpen, false)
  assert.equal(saved.branchesOpen, true)
  assert.equal(decodeList({ branchesOpen: 'yes' }).branchesOpen, false)
  assert.equal(saved.query.length, 200)
  assert.deepEqual(saved.collapsed, ['x', 'y'])
  assert.deepEqual(saved.staleOpen, [])
  assert.equal(saved.quietOpen, true)
  assert.equal(saved.stack, 1)
  assert.equal(saved.top, 49)
  assert.deepEqual(saved.selected, { repo: ID, path: '/r/main' })
})

test('清单这一边：仓库只能是「全部」或者一个编号，选中的树要长得像', () => {
  assert.equal(decodeList({ scope: '../../etc' }).scope, 'all')
  assert.equal(decodeList({ scope: '' }).scope, 'all')
  assert.equal(decodeList({ stack: 3 }).stack, 0)
  assert.equal(
    decodeList({ selected: { repo: 'x', path: '/r' } }).selected,
    null,
  )
  assert.equal(decodeList({ selected: { repo: ID } }).selected, null)
  assert.equal(decodeList({ top: -5 }).top, 0)
  assert.equal(decodeList({ top: 'abc' }).top, 0)
})

test('详情这一边：页签、文件区的筛选和名单都只认认得的值', () => {
  const empty = decodeTree(null)
  assert.equal(empty.tab, '')
  assert.equal(empty.scopes.uncommitted.how, '')
  assert.equal(empty.scopes.outgoing.open.length, 0)
  const area = decodeArea({
    filter: 'unstaged',
    query: 'q',
    how: 'custom',
    open: [ID, 'not-an-id', 3, ID],
    dirs: { all: false, on: ['src/'], off: ['docs/'] },
    anchor: { file: ID, offset: 36 },
  })
  assert.equal(area.filter, 'unstaged')
  assert.equal(area.how, 'custom')
  assert.deepEqual(area.open, [ID])
  assert.deepEqual(area.dirs, { all: false, on: ['src/'], off: ['docs/'] })
  assert.deepEqual(area.anchor, { file: ID, offset: 36 })
  // 没记过目录是 null（由组件按文件数定），不是「全收起」
  assert.equal(decodeArea({}).dirs, null)
  assert.equal(decodeArea({ how: 'nonsense' }).how, '')
  assert.equal(decodeArea({ anchor: { file: '../x', offset: 1 } }).anchor, null)
  assert.equal(decodeArea({ anchor: { file: ID, offset: 1e9 } }).anchor, null)
  assert.equal(decodeTree({ tab: 'files' }).tab, '')
  assert.equal(decodeTree({ tab: 'outgoing' }).tab, 'outgoing')
})

test('整份留存：版本对不上、读不懂就当没有；读回来和存进去的一样', () => {
  assert.equal(decode('not json'), null)
  assert.equal(decode(JSON.stringify({ v: 99, list: {}, trees: {} })), null)
  const view = {
    list: decodeList({ query: 'abc', scope: 'all' }),
    trees: {
      [TREE]: { ...decodeTree({ tab: 'sessions' }), at: 7 },
      'bad key': {},
    },
  }
  const back = decode(encode(view))
  assert.deepEqual(back.list, view.list)
  assert.deepEqual(Object.keys(back.trees), [TREE])
  assert.equal(back.trees[TREE].tab, 'sessions')
  assert.equal(back.trees[TREE].at, 7)
})

test('存与取：改哪项记哪项，没动的保留', async () => {
  assert.equal(viewState.load().list.scope, 'all')
  viewState.saveList({ query: 'abc' })
  viewState.saveList({ filter: 'unpushed', collapsed: ['r'] })
  viewState.saveList({ branchesOpen: true })
  assert.deepEqual(viewState.load().list, {
    ...decodeList({}),
    query: 'abc',
    filter: 'unpushed',
    collapsed: ['r'],
    branchesOpen: true,
  })
  viewState.saveTree(TREE, { tab: 'outgoing' })
  viewState.saveTree(TREE, {
    scopes: { outgoing: { filter: 'committed', query: 'src' } },
  })
  // 页签不被文件区的改动冲掉；另一个范围没动就是空的
  assert.equal(viewState.tree(TREE).tab, 'outgoing')
  assert.equal(viewState.tree(TREE).scopes.outgoing.query, 'src')
  assert.equal(viewState.tree(TREE).scopes.uncommitted.query, '')
  // 第二次只改筛选，搜索词保留
  viewState.saveTree(TREE, { scopes: { outgoing: { filter: 'all' } } })
  assert.equal(viewState.tree(TREE).scopes.outgoing.query, 'src')
  // 落盘了（等过了防抖）
  await new Promise((resolve) => setTimeout(resolve, 400))
  assert.equal(
    decode(localStorage.getItem('worktree-desk.view')).list.query,
    'abc',
  )
  viewState.clear()
  assert.equal(viewState.tree(TREE).tab, '')
  assert.equal(viewState.load().list.query, '')
})

test('详情只留最近看过的 24 棵工作树', () => {
  for (let i = 0; i < 25; i++) {
    viewState.saveTree(`${ID}:${i.toString(16).padStart(32, '0')}`, {
      tab: 'review',
    })
    assert.ok(
      viewState.tree(`${ID}:${i.toString(16).padStart(32, '0')}`).tab ===
        'review',
    )
  }
  assert.equal(viewState.tree(`${ID}:${'0'.repeat(32)}`).tab, '')
  assert.equal(Object.keys(viewState.load().trees).length, 24)
  // 编号长得不对的不收
  viewState.saveTree('../../x', { tab: 'review' })
  assert.equal(viewState.tree('../../x').tab, '')
})

test('没有 localStorage：只在内存里留，不报错', () => {
  delete globalThis.localStorage
  viewState.clear()
  viewState.saveList({ query: 'abc' })
  assert.equal(viewState.load().list.query, 'abc')
})
