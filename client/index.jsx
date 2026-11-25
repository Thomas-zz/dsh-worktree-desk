import React from 'react'
import { Desk } from './desk.jsx'
import { Icon } from './icons.jsx'
import { menuActions, menuKind } from './hub.js'
import { request } from './api.js'

const panelId = 'worktree-desk'

// 可选的宿主能力。齐了才接线；缺了面板照常浏览，只是少对应的操作。
function createServices() {
  const listeners = new Set()
  const state = { dsh: null, nativeChanges: null, notify: null }
  return {
    state,
    set(patch) {
      Object.assign(state, patch)
      listeners.forEach((fn) => fn())
    },
    subscribe(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
}

// 原生「本地变更」挂在会话的右栏上，而全局面板打开时右栏不挂载。
// 所以先切到该目录的会话，等右栏出现，再打开资源。它读取的是那棵工作树，不是会话原来所在的目录。
function nativeOpener(scope) {
  const { sidebarRight, sidebarRightTabs, layout, uiSession, uiWorkspace } =
    scope
  return async ({ repository, tree, file, signal }) => {
    const session = () => uiSession.adapter.current.getSnapshot()?.key
    const panel = () => layout.panelInfo.getSnapshot().activePanelId
    const selected = session()
    // 宿主没有启用变更插件时右栏没有这个标签页。
    if (!sidebarRightTabs.get?.('forge-changes')) return false
    const match = await request(
      'native-session',
      { id: repository, tree, current: selected || '' },
      signal,
    )
    const target = match.sessionId
    if (
      !target ||
      signal.aborted ||
      panel() !== panelId ||
      session() !== selected
    )
      return false
    if (target === selected) layout.selectPanel(null)
    else uiWorkspace.openSession(target)
    for (let attempt = 0; attempt < 50; attempt++) {
      if (panel() !== null || session() !== target) return false
      if (sidebarRight.mounted.getSnapshot() === target) {
        try {
          sidebarRight.openResource(
            `dsh-resource://forge-changes/${encodeURIComponent(target)}/local`,
            {
              kind: 'forge-changes',
              destination: 'sidebar',
              ...(file && { params: { path: file.path } }),
            },
          )
          return true
        } catch (error) {
          if (!String(error?.message).includes('no session surface is mounted'))
            break
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 40))
    }
    // 没能打开右栏：回到面板，别把用户留在一个不相关的会话里。
    if (panel() === null && session() === target) layout.selectPanel(panelId)
    return false
  }
}

export const inject = ['slots']
export function apply(ctx) {
  const services = createServices()

  ctx.inject(['workspaces', 'uiWorkspace'], (scope) => {
    services.set({
      dsh: {
        openSession: (id) => scope.uiWorkspace.openSession(id),
        // 把目录登记为工作区。幂等，等同用户手动「添加工作区」。
        createWorkspace: async (path) =>
          (await scope.workspaces.create({ path })).workspaceId,
        openWorkspace: (id) => scope.uiWorkspace.openWorkspace(id),
      },
    })
    scope.effect(() => () => services.set({ dsh: null }))
  })
  ctx.inject(
    ['sidebarRight', 'sidebarRightTabs', 'layout', 'uiSession', 'uiWorkspace'],
    (scope) => {
      services.set({ nativeChanges: nativeOpener(scope) })
      scope.effect(() => () => services.set({ nativeChanges: null }))
    },
  )
  ctx.inject(['contextMenus'], (scope) => {
    services.set({
      notify: (text, success) => scope.contextMenus.notify(text, success),
    })
    scope.effect(() =>
      scope.contextMenus.register({
        id: 'worktree-desk.tree',
        target: menuKind,
        order: 100,
        resolve: (value) => menuActions(value),
      }),
    )
  })

  ctx.slots.inject('main', () =>
    ctx.slots.register({ name: 'main', key: panelId }, (props) => (
      <Desk
        services={services}
        useContextMenu={props.useContextMenu}
        renderFactorySlot={props.renderFactorySlot}
      />
    )),
  )
  ctx.slots.inject('sidebar.panellist', () =>
    ctx.slots.register(
      {
        name: 'sidebar.panellist',
        id: panelId,
        order: 6,
        label: () => '工作树',
      },
      (props) => <Icon size={props.size} />,
    ),
  )
}
