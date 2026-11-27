// 面板（React）与宿主服务之间的桥。面板每次渲染后把最新的数据和回调写进 latest，
// 右键菜单的 resolve 在菜单被打开的那一刻读取它——菜单项拿到的只是可序列化的 { repo, path }。

import { scopeFiles } from './model.js'

export const menuKind = 'worktree-desk/tree'
export const latest = { current: null }

const PREFS = 'worktree-desk.prefs'
// 界面偏好（排序、差异视图方式）记在本机；隐私模式或 Web 下写不进去也不影响使用。
export const prefs = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(PREFS) ?? '{}')[key] ?? fallback
    } catch {
      return fallback
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(
        PREFS,
        JSON.stringify({
          ...JSON.parse(localStorage.getItem(PREFS) ?? '{}'),
          [key]: value,
        }),
      )
    } catch {
      /* 存不了就每次用默认值 */
    }
  },
}

// 宿主报告的应用 id → 中文名。按用途分组，终端排最前：在某个目录里开工最常用。
const GROUPS = [
  ['iterm', 'warp', 'ghostty', 'kitty', 'terminal', 'windowsterminal'],
  [
    'vscode',
    'vscodeinsiders',
    'cursor',
    'windsurf',
    'zed',
    'xcode',
    'intellij',
  ],
  ['sourcetree', 'fork', 'github', 'tower', 'gitkraken'],
  ['finder', 'explorer', 'filemanager'],
]
// 每组用一个图标：终端、编辑器、Git 客户端、文件管理器。
const GROUP_ICONS = ['terminal', 'code', 'branch', 'folder']
const NAMES = {
  iterm: 'iTerm',
  warp: 'Warp',
  ghostty: 'Ghostty',
  kitty: 'kitty',
  terminal: '终端',
  windowsterminal: '终端',
  vscode: 'VS Code',
  vscodeinsiders: 'VS Code Insiders',
  cursor: 'Cursor',
  windsurf: 'Windsurf',
  zed: 'Zed',
  xcode: 'Xcode',
  intellij: 'IntelliJ IDEA',
  sourcetree: 'Sourcetree',
  fork: 'Fork',
  github: 'GitHub Desktop',
  tower: 'Tower',
  gitkraken: 'GitKraken',
  finder: '访达',
  explorer: '资源管理器',
  filemanager: '文件管理器',
}
const REVEALS = new Set(['finder', 'explorer', 'filemanager'])

// 宿主的「在应用中打开」不可用时，插件自己只能保证这两样。
const FALLBACK = [
  {
    app: 'finder',
    target: 'finder',
    group: 3,
    label: '在访达中显示',
    icon: 'folder',
    fallback: true,
  },
  {
    app: 'terminal',
    target: 'terminal',
    group: 0,
    label: '在终端中打开',
    icon: 'terminal',
    fallback: true,
  },
]

// 按组的顺序列出本机装了的应用。group 供操作栏「每组只留一个」时去重。
export function openTargets(apps) {
  if (!apps?.length) return FALLBACK
  return GROUPS.flatMap((group, index) =>
    group
      .filter((app) => apps.includes(app))
      .map((app) => {
        const name = NAMES[app] ?? app
        return {
          app,
          group: index,
          icon: GROUP_ICONS[index],
          label: REVEALS.has(app) ? `在 ${name} 中显示` : `在 ${name} 中打开`,
        }
      }),
  )
}

// 某棵工作树当前能做的事。数据或回调还没就绪时返回空，菜单按钮随之不可用。
export function menuActions(value) {
  const { lookup, apps, act } = latest.current ?? {}
  const tree = lookup?.(value.repo, value.path)
  if (!tree || !act) return []
  const usable = !tree.prunable && !tree.error
  const live = (source) =>
    tree.sessions.find((s) => s.source === source && !s.archived)
  const dsh = tree.sessions.filter((s) => s.source === 'DSH' && !s.archived)
  const codex = live('Codex'),
    zcode = live('ZCode')
  const items = []
  if (usable && act.dsh) {
    if (dsh.length)
      items.push({
        id: 'dsh:open',
        label: '打开 DSH 会话',
        run: () => act.openDsh(tree),
      })
    items.push({
      id: 'dsh:new',
      label: dsh.length ? '新开一个 DSH 会话' : '在 DSH 新开会话',
      run: () => act.newDsh(tree),
    })
    if (scopeFiles(tree, 'uncommitted')?.length && act.review)
      items.push({
        id: 'dsh:review',
        label: 'AI 审查未提交的改动',
        run: () => act.review(value.repo, tree, 'uncommitted'),
      })
    if (scopeFiles(tree, 'outgoing')?.length && act.review)
      items.push({
        id: 'dsh:review-outgoing',
        label: 'AI 审查未推送的改动',
        run: () => act.review(value.repo, tree, 'outgoing'),
      })
    // 这个仓库自己配的审查提示词（只换「审什么、重点找什么」）。
    if (act.editPrompt)
      items.push({
        id: 'dsh:review-prompt',
        label: latest.current.prompted?.(value.repo)
          ? '本仓库的审查提示词（已自定义）…'
          : '本仓库的审查提示词…',
        run: () => act.editPrompt(value.repo),
      })
  }
  if (codex)
    items.push({
      id: 'codex:open',
      label: '在 Codex 中打开',
      run: () => act.openTool(tree, codex, value.repo),
    })
  if (zcode)
    items.push({
      id: 'zcode:open',
      label: '在 ZCode 中打开',
      run: () => act.openTool(tree, zcode, value.repo),
    })
  if (usable)
    for (const target of apps)
      items.push({
        id: `open:${target.app}`,
        label: target.label,
        separatorBefore: items.length === 0,
        run: () => act.openApp(value.repo, tree, target),
      })
  items.push({
    id: 'copy:path',
    label: '复制路径',
    separatorBefore: items.length > 0,
    run: () => act.copy(tree.path, '已复制路径'),
  })
  if (tree.branch)
    items.push({
      id: 'copy:branch',
      label: '复制分支名',
      run: () => act.copy(tree.branch, '已复制分支名'),
    })
  if (tree.prunable)
    items.push({
      id: 'prune',
      label: '清理本仓库的失效登记',
      danger: true,
      separatorBefore: true,
      run: () => act.requestPrune(value.repo),
    })
  return items
}
