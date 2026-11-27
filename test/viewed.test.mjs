import test from 'node:test'
import assert from 'node:assert/strict'
import {
  decode,
  digestOf,
  progressOf,
  slotOf,
  viewed,
  viewedStateOf,
} from '../client/viewed.js'

const file = (path, extra = {}) => ({
  path,
  add: 1,
  del: 0,
  mtime: 10,
  size: 20,
  ...extra,
})
// 假的 localStorage：模块是在用到时才去找它，换一个假的就等于换了一块存储。
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
  viewed.clear()
})

test('指纹：这份改动没变就不变；路径、增删行数、修改时间、大小任何一个变了就变', () => {
  const a = file('src/a.js')
  assert.equal(digestOf(a), digestOf(file('src/a.js')))
  for (const changed of [
    file('src/b.js'),
    file('src/a.js', { add: 2 }),
    file('src/a.js', { del: 1 }),
    file('src/a.js', { mtime: 11 }),
    file('src/a.js', { size: 21 }),
  ])
    assert.notEqual(digestOf(changed), digestOf(a))
  assert.match(digestOf(a), /^[0-9a-f]{16}$/)
  // 新文件按行数算
  assert.equal(
    digestOf({ path: 'n.js', xy: '??', lines: 3, mtime: 1, size: 5 }),
    digestOf({ path: 'n.js', lines: 3, mtime: 1, size: 5 }),
  )
})

test('指纹在「未提交」和「未推送」两个范围里通用：提交之后改动没变，标记跟得过去', () => {
  const before = file('src/a.js', { xy: '.M', add: 4, del: 1 })
  // 提交了，工作目录里没再动：和上游比的清单里是同一份改动。
  const after = file('src/a.js', { st: 'M', add: 4, del: 1 })
  assert.equal(digestOf(after), digestOf(before))
  // 这个文件在更早的提交里就改过：和上游比是更大的一份改动，认得出还有没看过的。
  const earlier = file('src/a.js', { st: 'M', add: 9, del: 1 })
  assert.notEqual(digestOf(earlier), digestOf(before))
})

test('路径在留存里只是摘要：不出现文件名，和指纹不是一回事', () => {
  assert.match(slotOf('docs/盘点说明.md'), /^[0-9a-f]{16}$/)
  assert.notEqual(slotOf('src/a.js'), digestOf(file('src/a.js')))
  assert.notEqual(slotOf('src/a.js'), slotOf('src/b.js'))
})

test('按标记算状态：没标过、标过且没再改、标过但后来又改了', () => {
  const a = file('src/a.js')
  const marks = { [slotOf(a.path)]: digestOf(a) }
  assert.equal(viewedStateOf(marks, a, digestOf(a)), 'viewed')
  assert.equal(
    viewedStateOf(
      marks,
      file('src/a.js'),
      digestOf(file('src/a.js', { add: 2 })),
    ),
    'changed',
  )
  assert.equal(viewedStateOf(marks, file('src/b.js'), 'x'), 'unviewed')
  assert.equal(viewedStateOf({}, a, digestOf(a)), 'unviewed')
})

test('进度：审阅后又改了的不算已审阅', () => {
  const a = file('a.js'),
    b = file('b.js'),
    c = file('c.js')
  const marks = {
    [slotOf('a.js')]: digestOf(a),
    [slotOf('b.js')]: digestOf(file('b.js', { add: 9 })),
  }
  assert.deepEqual(progressOf([a, b, c], marks), {
    total: 3,
    viewed: 1,
    changed: 1,
  })
  assert.deepEqual(progressOf([], marks), { total: 0, viewed: 0, changed: 0 })
})

test('读留存：读不懂、内容不对的丢掉，不给面板坏数据', () => {
  assert.deepEqual(decode('not json'), {})
  assert.deepEqual(decode('null'), {})
  assert.deepEqual(decode('[1, 2]'), {})
  assert.deepEqual(
    decode(
      JSON.stringify({
        good: { at: 5, files: { abc: 'def' } },
        empty: { at: 5, files: {} },
        bad: { at: 'x', files: { abc: 7 } },
        nogit: null,
        '': { files: { a: 'b' } },
      }),
    ),
    { good: { at: 5, files: { abc: 'def' } } },
  )
})

test('标记：标一个、取消、全标、全清；不在清单里的路径顺手清掉', () => {
  const a = file('a.js'),
    b = file('b.js')
  assert.equal(viewed.has('t'), false)
  assert.equal(viewed.mark('t', [a, b], 'a.js', true), true)
  assert.equal(viewed.has('t'), true)
  assert.deepEqual(viewed.marksOf('t'), { [slotOf('a.js')]: digestOf(a) })
  assert.equal(viewed.progress('t', [a, b]).viewed, 1)
  // 再标一个
  viewed.mark('t', [a, b], 'b.js', true)
  assert.equal(viewed.progress('t', [a, b]).viewed, 2)
  // 取消
  viewed.mark('t', [a, b], 'a.js', false)
  assert.deepEqual(viewed.marksOf('t'), { [slotOf('b.js')]: digestOf(b) })
  // 清单里已经没有 b.js 了（提交、删掉）：再标别的文件时把它清掉
  viewed.mark('t', [a], 'a.js', true)
  assert.deepEqual(viewed.marksOf('t'), { [slotOf('a.js')]: digestOf(a) })
  // 清单里没有的文件标不了
  assert.equal(viewed.mark('t', [a], 'zz.js', true), false)
  // 全标、全清
  assert.equal(viewed.markAll('t', [a, b], true), true)
  assert.equal(viewed.progress('t', [a, b]).viewed, 2)
  assert.equal(viewed.markAll('t', [a, b], false), true)
  assert.equal(viewed.has('t'), false)
  assert.deepEqual(viewed.marksOf('t'), {})
})

test('标记有增减时通知订阅的人；同一份清单的进度不重算', () => {
  let hits = 0
  const off = viewed.subscribe(() => (hits += 1))
  const a = file('a.js')
  const version = viewed.version
  viewed.mark('t', [a], 'a.js', true)
  assert.equal(hits, 1)
  assert.notEqual(viewed.version, version)
  const list = [a]
  const first = viewed.progress('t', list)
  assert.equal(viewed.progress('t', list), first)
  // 换了一份清单就得重算
  assert.notEqual(viewed.progress('t', [file('b.js')]), first)
  // 清掉之后订阅的人也知道
  viewed.clear()
  assert.equal(hits, 2)
  off()
  viewed.mark('t', [a], 'a.js', true)
  assert.equal(hits, 2)
})

test('只留最近动过的 200 棵工作树', () => {
  const a = file('a.js')
  for (let i = 0; i < 201; i++) viewed.mark(`t${i}`, [a], 'a.js', true)
  assert.equal(viewed.has('t0'), false)
  assert.equal(viewed.has('t1'), true)
  assert.equal(viewed.has('t200'), true)
  assert.equal(
    Object.keys(decode(localStorage.getItem('worktree-desk.viewed'))).length,
    200,
  )
})

test('留存里不出现文件名', () => {
  viewed.mark(
    't',
    [file('docs/private-notes.md')],
    'docs/private-notes.md',
    true,
  )
  const text = localStorage.getItem('worktree-desk.viewed')
  assert.ok(!text.includes('private-notes'))
})

test('没有 localStorage（隐私模式、被禁用）：什么都没记，也不报错', () => {
  delete globalThis.localStorage
  assert.equal(viewed.has('t'), false)
  assert.equal(viewed.mark('t', [file('a.js')], 'a.js', true), false)
  assert.equal(viewed.markAll('t', [file('a.js')], true), false)
  assert.deepEqual(viewed.marksOf('t'), {})
  assert.doesNotThrow(() => viewed.clear())
})
