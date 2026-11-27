import test from 'node:test'
import assert from 'node:assert/strict'
import { latest, menuActions, openTargets } from '../client/hub.js'

// 右键菜单的条目是按可序列化的 { repo, path } 现查的：这里把面板留下的那份状态直接摆上去。
const tree = {
  path: '/r/main',
  branch: 'main',
  sessions: [],
  status: { total: 1, files: [{ path: 'src/a.js', xy: 'M ' }] },
}
const act = { dsh: {}, review() {}, editPrompt() {} }
const labels = (value) => menuActions(value).map((item) => item.label)

test('右键菜单：有「本仓库的审查提示词」，配过的写明已自定义；宿主还是旧版时没有这一项', () => {
  latest.current = {
    lookup: () => tree,
    apps: [],
    act,
    prompted: () => false,
  }
  assert.ok(
    labels({ repo: 'r', path: '/r/main' }).includes('本仓库的审查提示词…'),
  )
  latest.current.prompted = () => true
  assert.ok(
    labels({ repo: 'r', path: '/r/main' }).includes(
      '本仓库的审查提示词（已自定义）…',
    ),
  )
  // 宿主没有这项能力：入口不出现（点了也只会报错）
  latest.current = {
    lookup: () => tree,
    apps: [],
    act: { ...act, editPrompt: null },
    prompted: () => true,
  }
  assert.ok(
    !menuActions({ repo: 'r', path: '/r/main' }).some(
      (item) => item.id === 'dsh:review-prompt',
    ),
  )
  // 没读到这棵树、或者面板还没接上：什么都不能做
  latest.current = { lookup: () => undefined, apps: [], act }
  assert.deepEqual(menuActions({ repo: 'r', path: '/r/gone' }), [])
})

test('「在应用中打开」：按用途分组排好（终端、编辑器、Git 客户端），宿主给不了时至少还有访达和终端', () => {
  assert.deepEqual(
    openTargets(['zed', 'vscode', 'iterm', 'warp', 'fork']).map((t) => t.app),
    ['iterm', 'warp', 'vscode', 'zed', 'fork'],
  )
  assert.deepEqual(
    openTargets([]).map((t) => t.target),
    ['finder', 'terminal'],
  )
})
