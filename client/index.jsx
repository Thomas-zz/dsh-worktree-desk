import React from 'react'
import { Desk } from './desk.jsx'
import { Icon } from './icons.jsx'
import { menuActions, menuKind } from './hub.js'

const panelId = 'worktree-desk'
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// 可选的宿主能力。齐了才接线；缺了面板照常浏览，只是少对应的操作。
function createServices() {
  const listeners = new Set()
  const state = { dsh: null, notify: null }
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

export const inject = ['slots']
export function apply(ctx) {
  const services = createServices()

  // DSH 会话：在某个目录新开会话、打开已有会话。面板用它「在 DSH 新开会话」和发起 AI 审查。
  ctx.inject(['workspaces', 'uiWorkspace', 'sessions'], (scope) => {
    services.set({
      dsh: {
        openSession: (id) => scope.uiWorkspace.openSession(id),
        // 把目录登记为工作区。幂等，等同用户手动「添加工作区」。
        createWorkspace: async (path) =>
          (await scope.workspaces.create({ path })).workspaceId,
        openWorkspace: (id) => scope.uiWorkspace.openWorkspace(id),
        // 在这个工作区里备好一个空白会话（已经有空白的就复用），不切换界面。
        connect: (workspaceId) =>
          scope.uiWorkspace.connectWorkspace(workspaceId),
        // 往会话里发一条消息。刚切过去的会话要等界面把它的上下文建好才能发。
        send: async (sessionId, text) => {
          for (let attempt = 0; attempt < 100; attempt++) {
            const conversation = scope.sessions
              .scope(sessionId)
              ?.get('conversation')
            if (conversation) return conversation.send(text)
            await wait(50)
          }
          throw Error('会话还没有准备好')
        },
      },
    })
    scope.effect(() => () => services.set({ dsh: null }))
  })
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
