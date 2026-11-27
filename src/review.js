// 读取一次代码审查的结果：面板发起审查时，会在一个 DSH 会话里发出带标记的审查请求；
// 这里从会话记录里认出它、取回最后给出的结构化结果。
import { parseReport } from './report.js'

export const MARKER = 'worktree-desk-review'
// 结果一定在回复的末尾；只读最后这几条消息就够了。
const TAIL_MESSAGES = 16
// 审查请求是会话的第一条用户消息；它前面只有请求头和系统消息。会话开头读到这么多事件还找不到标记，就不是审查会话。
const HEAD_EVENTS = 400

const blocks = (message) =>
  Array.isArray(message?.content) ? message.content : []
export function textOf(message) {
  return blocks(message)
    .filter((part) => part?.type === 'text' && typeof part.text === 'string')
    .map((part) => part.text)
    .join('\n')
}

// 一页记录里有没有带着审查标记的用户消息。
// 用户自己发出的话 source.kind 是 user；宿主插进来的上下文（运行环境、技能目录、时间）不是，也不算。
export function isReviewStart(records) {
  return (records ?? []).some((record) => {
    const event = record?.event ?? record
    if (event?.type !== 'user/message') return false
    // 没写来源的也当作用户发的话。
    const kind = event.data?.source?.kind
    if (kind && !kind.startsWith('user')) return false
    return textOf(event.data).includes(MARKER)
  })
}

// 从最后一页记录里取审查结果：从最后一条回复往前找，取最近的一份；另外记下这一轮是怎么结束的。
export function readTail(records) {
  const texts = []
  let problem = null
  for (const record of records ?? []) {
    const event = record?.event ?? record
    if (event?.type === 'assistant/message') {
      const message = textOf(event.data?.message)
      if (message) texts.push(message)
    } else if (event?.type === 'turn/end') {
      const reason = event.data?.reason
      if (reason?.kind === 'error')
        problem = String(reason.error?.message ?? '模型调用出错').slice(0, 200)
      else if (reason?.kind === 'cancelled') problem = '审查被取消了'
      else problem = null
    }
  }
  for (const text of texts.reverse()) {
    const parsed = parseReport(text)
    if (parsed.ok) return { ...parsed, problem }
  }
  return { ok: false, reason: '回复里没有可读取的审查结果', problem }
}

// 路由用：核对会话确实属于这棵工作树，再读结果。
//   controller: 宿主的 ctx.sessionController
//   sessionId: 面板登记的审查会话
export async function readReview(controller, sessionId, remembered) {
  const address = { kind: 'session', sessionId }
  const signal = () => AbortSignal.timeout(10000)
  const [state, tail] = await Promise.all([
    controller.state({ sessionId }, signal()).catch(() => null),
    controller.events({ address, maxMessages: TAIL_MESSAGES }, signal()),
  ])
  const running = !!state?.running
  // 审查会话的认定只看一次：会话头不会变。会话头读不了就分不清是不是审查会话——
  // 那就让错误往上抛，按「暂时读不了」处理，不把「不是」记下来（记下了就再也没有机会重读）。
  let known = remembered.get(sessionId)
  if (known === undefined) {
    known = isReviewStart(tail.records)
    if (!known && tail.cursor > 0) {
      const head = await controller.events(
        {
          address,
          throughSeq: Math.min(HEAD_EVENTS, tail.cursor),
          // 宿主按消息数截页：默认只给切点之前的最后 50 条消息。审查会话动辄几百个事件，
          // 那一页够不到会话开头，标记永远读不到——条数上限要放到和事件数一样多，这一页才从会话开头算起。
          maxMessages: HEAD_EVENTS,
        },
        signal(),
      )
      known = isReviewStart(head.records)
    }
    remembered.set(sessionId, known)
  }
  if (!known) return { known: false }
  const result = readTail(tail.records)
  return {
    known: true,
    running,
    report: result.ok ? result.report : null,
    // 一轮结束后仍没有结果：审查没有完成，或没有按要求给出结果。problem 是结束的原因（出错、被取消）。
    failed: !running && !result.ok,
    problem: result.problem ?? null,
    cursor: tail.cursor,
  }
}
