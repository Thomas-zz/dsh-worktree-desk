import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePatch, pairRows, tokenRanges } from '../client/diff.js'

const patch = [
  'diff --git a/src/a.js b/src/a.js',
  'index 315d53e..5dd33cc 100644',
  '--- a/src/a.js',
  '+++ b/src/a.js',
  '@@ -59,7 +59,12 @@ final class Foo {',
  ' context line',
  '-removed one',
  '-removed two',
  '+added one',
  ' trailing context',
  '+no newline at end',
  '\\ No newline at end of file',
  '@@ -80,1 +85,2 @@ next() {',
  ' only',
  '+extra',
  '',
].join('\n')

test('解析 hunk 头与行号', () => {
  const result = parsePatch(patch)
  assert.equal(result.from, 'a/src/a.js')
  assert.equal(result.to, 'b/src/a.js')
  assert.equal(result.binary, false)
  assert.equal(result.additions, 3)
  assert.equal(result.deletions, 2)
  const [first, second] = result.hunks
  assert.deepEqual(
    [
      first.oldStart,
      first.oldCount,
      first.newStart,
      first.newCount,
      first.heading,
    ],
    [59, 7, 59, 12, 'final class Foo {'],
  )
  assert.deepEqual(
    first.lines.map((l) => [l.kind, l.text, l.oldNo, l.newNo]),
    [
      ['ctx', 'context line', 59, 59],
      ['del', 'removed one', 60, null],
      ['del', 'removed two', 61, null],
      ['add', 'added one', null, 60],
      ['ctx', 'trailing context', 62, 61],
      ['add', 'no newline at end', null, 62],
    ],
  )
  // 「无结尾换行」修饰的是上一行。
  assert.equal(first.lines.at(-1).noNewline, true)
  assert.equal(first.lines.at(-2).noNewline, false)
  assert.deepEqual(
    second.lines.map((l) => [l.kind, l.text, l.oldNo, l.newNo]),
    [
      ['ctx', 'only', 80, 85],
      ['add', 'extra', null, 86],
    ],
  )
})

test('新文件预览没有 hunk 头也能解析', () => {
  const result = parsePatch('+hello\n+world\n')
  assert.equal(result.hunks.length, 1)
  assert.deepEqual(
    result.hunks[0].lines.map((l) => [l.kind, l.text, l.newNo]),
    [
      ['add', 'hello', 1],
      ['add', 'world', 2],
    ],
  )
  assert.equal(result.additions, 2)
})

test('空正文与二进制', () => {
  assert.deepEqual(parsePatch('').hunks, [])
  assert.equal(parsePatch('空文件（0 字节）。').hunks.length, 0)
  const binary = parsePatch(
    'diff --git a/logo.png b/logo.png\nindex 111..222 100644\nBinary files a/logo.png and b/logo.png differ\n',
  )
  assert.equal(binary.binary, true)
  assert.equal(binary.hunks.length, 0)
})

test('合并冲突时的组合差异按第一个父提交解析', () => {
  // 组合差异每个父提交占一列：第一列即相对第一个父提交的增删，之后直接接正文。
  const combined = [
    'diff --cc src/conflicted.js',
    'index 111,222..333',
    '@@@ -10,4 -10,4 +10,5 @@@ function run() {',
    '  shared',
    '- from first parent',
    '++merged line',
    ' +only in second parent',
    '@@@ -20,1 -21,1 +21,1 @@@',
  ].join('\n')
  const result = parsePatch(combined)
  assert.equal(result.hunks.length, 2)
  assert.deepEqual(
    result.hunks[0].lines.map((l) => [l.kind, l.text, l.oldNo, l.newNo]),
    [
      ['ctx', 'shared', 10, 10],
      ['del', 'from first parent', 11, null],
      ['add', 'merged line', null, 11],
      ['ctx', 'only in second parent', 12, 12],
    ],
  )
  assert.equal(result.hunks[0].heading, 'function run() {')
})

test('多文件补丁只取第一个文件', () => {
  const result = parsePatch(
    '@@ -1,1 +1,1 @@\n-a\n+b\ndiff --git a/two b/two\nindex 1..2 100644\n--- a/two\n+++ b/two\n@@ -1,1 +1,1 @@\n-c\n+d\n',
  )
  assert.equal(result.hunks.length, 1)
  assert.deepEqual(
    result.hunks[0].lines.map((l) => l.text),
    ['a', 'b'],
  )
})

test('并排配对：改动成对、多余的删除在左、添加在右', () => {
  const hunk = parsePatch(
    '@@ -1,6 +1,6 @@\n keep\n-del a\n-del b\n+add a\n same\n+add x\n',
  ).hunks[0]
  const rows = pairRows(hunk)
  assert.deepEqual(
    rows.map((r) => [r.kind, r.left?.text ?? null, r.right?.text ?? null]),
    [
      ['ctx', 'keep', 'keep'],
      ['change', 'del a', 'add a'],
      ['del', 'del b', null],
      ['ctx', 'same', 'same'],
      ['add', null, 'add x'],
    ],
  )
})

test('行内高亮只标出变化的记号', () => {
  const [a, b] = tokenRanges(
    '    if (needsSourceRow row : rows) {',
    '    for (InventorySourceRow row : rows) {',
  )
  const cut = (text, ranges) => ranges.map(([s, e]) => text.slice(s, e))
  // 标识符按整词比较：needsSourceRow → InventorySourceRow 整词高亮。
  assert.deepEqual(cut('    if (needsSourceRow row : rows) {', a), [
    'if',
    'needsSourceRow',
  ])
  assert.deepEqual(cut('    for (InventorySourceRow row : rows) {', b), [
    'for',
    'InventorySourceRow',
  ])
})

test('行内高亮：整行替换与纯插入', () => {
  const cut = (text, ranges) => ranges.map(([s, e]) => text.slice(s, e))
  const [a, b] = tokenRanges('return old();', 'return brandNew(value);')
  assert.deepEqual(cut('return old();', a), ['old'])
  assert.deepEqual(cut('return brandNew(value);', b), ['brandNew', 'value'])
  const [c, d] = tokenRanges('same prefix', 'same prefix and more')
  assert.deepEqual(c, [])
  assert.deepEqual(cut('same prefix and more', d), ['and more'])
})

test('行内高亮：相同内容没有高亮，超长行不崩溃', () => {
  assert.deepEqual(tokenRanges('identical line', 'identical line'), [[], []])
  const long = 'x'.repeat(5000)
  const [a, b] = tokenRanges(long + 'a', long + 'b')
  assert.equal(a.length, 1)
  assert.equal(b.length, 1)
})
