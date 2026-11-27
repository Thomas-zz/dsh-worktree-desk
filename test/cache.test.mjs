import test from 'node:test'
import assert from 'node:assert/strict'
import { decode, encode, keepKnown } from '../client/cache.js'

const repo = (id) => ({ id, path: `/r/${id}`, name: id, trees: [] })
const catalog = { time: 1000, home: '/h', repos: [repo('a'), repo('b')] }
const detail = (id, trees = [{ path: `/r/${id}`, sessions: [] }]) => ({
  id,
  time: 2000,
  trees,
})

test('存了再读回来：只留读取成功的仓库，读取中、读取失败的不存', () => {
  const details = new Map([
    ['a', { state: 'ready', data: detail('a') }],
    ['b', { state: 'loading' }],
    ['c', { state: 'error', error: 'x' }],
  ])
  const back = decode(encode(catalog, details))
  assert.deepEqual(back.catalog, catalog)
  assert.deepEqual([...back.details.keys()], ['a'])
  // 存的时候还在显示上次的失败提示：读回来只是一份正常的数据，提示不跟着走。
  const warned = decode(
    encode(catalog, new Map([['a', { state: 'ready', data: detail('a'), error: 'x' }]])),
  )
  assert.deepEqual(warned.details.get('a'), { state: 'ready', data: detail('a') })
})

test('版本对不上、内容残缺：当作没有缓存', () => {
  const good = JSON.parse(encode(catalog, new Map([['a', { state: 'ready', data: detail('a') }]])))
  assert.equal(decode('not json'), null)
  assert.equal(decode('null'), null)
  assert.equal(decode(JSON.stringify({ ...good, v: 99 })), null)
  // 清单残缺
  assert.equal(decode(JSON.stringify({ ...good, catalog: { time: 1 } })), null)
  assert.equal(
    decode(JSON.stringify({ ...good, catalog: { time: 1, repos: [{ id: 'a' }] } })),
    null,
  )
  assert.equal(
    decode(JSON.stringify({ ...good, catalog: { time: 'x', repos: [] } })),
    null,
  )
})

test('某几个仓库的详情残缺：只丢掉它们，其余照常恢复', () => {
  const good = JSON.parse(encode(catalog, new Map([['a', { state: 'ready', data: detail('a') }]])))
  const mixed = {
    ...good,
    repos: [
      ['a', { id: 'a', time: 1, trees: [{ path: '/r/a' }] }], // 会话列表缺失
      ['b', { id: 'b', time: 1, trees: 'nope' }],
      ['c', detail('c')], // 清单里已经没有 c
      ['junk'],
      { id: 'b' },
    ],
  }
  const back = decode(JSON.stringify(mixed))
  // a 的会话列表缺了：整条不恢复，宁可重读。
  assert.deepEqual([...back.details.keys()], [])
})

test('清单里有完整详情的仓库才恢复', () => {
  const text = encode(
    catalog,
    new Map([
      ['a', { state: 'ready', data: detail('a') }],
      ['b', { state: 'ready', data: detail('b') }],
    ]),
  )
  const back = decode(text)
  assert.deepEqual([...back.details.keys()], ['a', 'b'])
  assert.equal(back.details.get('b').state, 'ready')
})

test('新清单到了：还在的仓库保留旧数据并标记读取中，已经不在的丢掉', () => {
  const old = new Map([
    ['a', { state: 'ready', data: detail('a') }],
    ['b', { state: 'error', error: 'x' }],
    ['gone', { state: 'ready', data: detail('gone') }],
  ])
  const next = keepKnown(old, { repos: [repo('a'), repo('new')] })
  assert.deepEqual([...next.keys()], ['a'])
  assert.deepEqual(next.get('a'), { state: 'loading', data: detail('a') })
  // 不动原来那份
  assert.equal(old.size, 3)
})

test('清单里宿主声明的能力原样留着；旧版留存的结果没有这一项，也照样能用', () => {
  const back = decode(encode({ ...catalog, features: ['sync', 'review'] }, new Map()))
  assert.deepEqual(back.catalog.features, ['sync', 'review'])
  // 升级前留下来的结果：没有 features，面板据此先不显示这两项操作，等新清单到了再说。
  const older = decode(encode(catalog, new Map()))
  assert.equal(older.catalog.features, undefined)
  assert.equal(older.catalog.time, catalog.time)
})
