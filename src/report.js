// 代码审查结果的格式：面板让审查会话在回复末尾给出一个 worktree-review 代码块，
// 这里负责把它从文字里认出来、校验、归一。纯函数，宿主和面板共用。

export const FENCE = 'worktree-review'
export const LEVELS = {
  info: ['说明', 'info'],
  warn: ['建议', 'warn'],
  fix: ['必须处理', 'danger'],
}
// 模型可能用别的词写严重程度：归到三档里。
const LEVEL_WORDS = {
  fix: [
    'fix',
    'danger',
    'error',
    'blocker',
    'must',
    'critical',
    'bug',
    'required',
    '严重',
    '错误',
    '必须',
    '缺陷',
  ],
  warn: [
    'warn',
    'warning',
    'question',
    'suggestion',
    'nit',
    'advice',
    'minor',
    '疑问',
    '建议',
    '提醒',
  ],
}
const MAX_NOTES = 400

const clip = (value, max) => {
  const text = typeof value === 'string' ? value : String(value ?? '')
  return text.trim().slice(0, max)
}
const levelOf = (value) => {
  const word = String(value ?? '').toLowerCase()
  for (const [level, words] of Object.entries(LEVEL_WORDS))
    if (words.some((w) => word.includes(w))) return level
  return 'info'
}
const positive = (value) => {
  const n = Number(value)
  return Number.isSafeInteger(n) && n > 0 ? n : null
}

// 把一段文字里所有代码块的内容取出来。
export function fences(text) {
  const out = []
  const re = /```[ \t]*([^\n`]*)[^\n]*\n([\s\S]*?)```/g
  for (const match of String(text ?? '').matchAll(re))
    out.push({ lang: match[1].trim().toLowerCase(), body: match[2] })
  return out
}

// 宽松一点的 JSON：模型偶尔会多写一个逗号，或把引号写成全角。
function loose(text) {
  const tryParse = (t) => {
    try {
      return JSON.parse(t)
    } catch {
      return null
    }
  }
  const direct = tryParse(text)
  if (direct) return direct
  return tryParse(
    text
      .replace(/“/g, '"')
      .replace(/”/g, '"')
      .replace(/，\s*([}\]])/g, (_, close) => close)
      .replace(/,\s*([}\]])/g, '$1'),
  )
}

function normalizeNote(raw) {
  if (!raw || typeof raw !== 'object') return null
  const file = clip(raw.file ?? raw.path, 400)
  if (!file) return null
  const side = ['old', 'new'].includes(raw.side) ? raw.side : 'new'
  return {
    file: file.replace(/\\/g, '/').replace(/^\.\//, ''),
    side,
    hunk: positive(raw.hunk),
    line: positive(raw.line),
    quote: clip(raw.quote, 120),
    level: levelOf(raw.level ?? raw.severity ?? raw.kind),
    title: clip(raw.title ?? raw.summary, 200),
    body: clip(raw.body ?? raw.detail ?? raw.description ?? raw.reason, 1600),
  }
}

// 从一段回复文字里取出审查结果。认 info 字符串是 worktree-review 的代码块，
// 没有就退而找内容像审查结果的 json 代码块；都取最后一个（模型可能先给草稿再给正式的）。
export function parseReport(text) {
  const blocks = fences(text)
  const ranked = [
    ...blocks.filter((b) => b.lang === FENCE).reverse(),
    ...blocks.filter((b) => b.lang !== FENCE).reverse(),
  ]
  for (const block of ranked) {
    const data = loose(block.body)
    if (
      !data ||
      typeof data !== 'object' ||
      !Array.isArray(data.notes ?? data.items ?? data.comments)
    )
      continue
    const notes = (data.notes ?? data.items ?? data.comments)
      .map(normalizeNote)
      .filter(Boolean)
      .slice(0, MAX_NOTES)
    const counts = countNotes(notes)
    return {
      ok: true,
      report: {
        // 结论没写或写得不对，就按批注里最重的一档算。
        verdict: ['pass', 'warn', 'fail'].includes(data.verdict)
          ? data.verdict
          : counts.fix
            ? 'fail'
            : counts.warn
              ? 'warn'
              : 'pass',
        summary: clip(data.summary ?? data.overall, 800),
        stamp: typeof data.stamp === 'string' ? clip(data.stamp, 40) : null,
        notes,
      },
    }
  }
  return { ok: false, reason: '回复里没有可读取的审查结果' }
}

export function countNotes(notes) {
  const counts = { info: 0, warn: 0, fix: 0 }
  for (const note of notes) counts[note.level] += 1
  return counts
}

// 审查结果里要动手的结论：必须处理和建议。「说明」只是解释改动做了什么，面板不再展示、不再计数——
// 早先的审查结果里有它，照样读得出，只是不显示。现在的提示词也不要求它了。
export const issuesOf = (notes) =>
  (notes ?? []).filter((note) => note.level === 'fix' || note.level === 'warn')
export function shrinkReport(report) {
  if (!report) return report
  const notes = issuesOf(report.notes)
  // 没有可去掉的，原样返回（同一个对象，界面不必重画）。
  if (notes.length === report.notes.length) return report
  // 去掉说明之后一条要处理的都不剩：按「审查通过」说。
  return { ...report, notes, verdict: notes.length ? report.verdict : 'pass' }
}

export const VERDICTS = {
  pass: ['审查通过', 'ok'],
  warn: ['有修改建议', 'warn'],
  fail: ['有需要处理的问题', 'danger'],
}
