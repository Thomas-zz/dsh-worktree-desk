// 统一差异（unified diff）与合并冲突的组合差异解析、并排配对、行内词级高亮。
// 纯函数，不依赖 React，可在 node 下直接测试。

const HUNK = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)$/
const COMBINED =
  /^@@@ -(\d+)(?:,(\d+))? (?:-\d+(?:,\d+)? )+\+(\d+)(?:,(\d+))? @@@(.*)$/

function openHunk(result, match) {
  const hunk = {
    oldStart: Number(match[1]),
    oldCount: match[2] === undefined ? 1 : Number(match[2]),
    newStart: Number(match[3]),
    newCount: match[4] === undefined ? 1 : Number(match[4]),
    heading: match[5].trim(),
    lines: [],
  }
  result.hunks.push(hunk)
  return hunk
}

const SYNTHETIC = ['', '0', undefined, '1', undefined, '']

export function parsePatch(text) {
  const lines = String(text ?? '').split('\n')
  if (lines.at(-1) === '') lines.pop()
  const result = {
    from: null,
    to: null,
    oldMode: null,
    newMode: null,
    binary: false,
    hunks: [],
    additions: 0,
    deletions: 0,
  }
  let hunk = null,
    pending = null,
    old = 0,
    neo = 0,
    combined = false
  for (const raw of lines) {
    if (!hunk) {
      const next = COMBINED.exec(raw) || HUNK.exec(raw)
      if (next) {
        combined = next[0].startsWith('@@@')
        hunk = openHunk(result, next)
        old = hunk.oldStart
        neo = hunk.newStart
        pending = null
        continue
      }
      if (raw.startsWith('--- ')) {
        result.from = raw.slice(4).split('\t')[0]
        continue
      }
      if (raw.startsWith('+++ ')) {
        result.to = raw.slice(4).split('\t')[0]
        continue
      }
      if (raw.startsWith('old mode ')) {
        result.oldMode = raw.slice(9).trim()
        continue
      }
      if (raw.startsWith('new mode ')) {
        result.newMode = raw.slice(9).trim()
        continue
      }
      if (/^(Binary files |GIT binary patch)/.test(raw)) {
        result.binary = true
        continue
      }
      if (!/^[ +-]/.test(raw)) continue
      // 新文件预览没有 hunk 头，正文直接以 + 开头。
      hunk = openHunk(result, SYNTHETIC)
      combined = false
      old = 0
      neo = 1
      pending = null
    }
    if (raw.startsWith('diff --git ')) {
      // 只展示请求的那个文件；之后是别的文件的段落。
      break
    }
    const mark = raw[0]
    if (mark === '@') {
      const next = COMBINED.exec(raw) || HUNK.exec(raw)
      if (next) {
        combined = next[0].startsWith('@@@')
        hunk = openHunk(result, next)
        old = hunk.oldStart
        neo = hunk.newStart
        pending = null
        continue
      }
    }
    if (mark === '\\') {
      // 「\ No newline at end of file」修饰的是上一行。
      if (pending) pending.noNewline = true
      continue
    }
    // 组合差异每个父提交占一列；第一列即「相对第一个父提交」的增删。
    const flag = combined ? raw[0] : mark
    const kind = flag === '+' ? 'add' : flag === '-' ? 'del' : 'ctx'
    const line = {
      kind,
      text: raw.slice(combined ? 2 : 1),
      oldNo: null,
      newNo: null,
      noNewline: false,
    }
    if (kind !== 'add') line.oldNo = old++
    if (kind !== 'del') line.newNo = neo++
    if (kind === 'add') result.additions++
    else if (kind === 'del') result.deletions++
    hunk.lines.push(line)
    pending = line
  }
  return result
}

// 连续的删除/添加行按顺序配成「改动行」，多出来的删除在左、多出来的添加在右。
export function pairRows(hunk) {
  const rows = []
  const block = []
  const flush = () => {
    const dels = block.filter((l) => l.kind === 'del')
    const adds = block.filter((l) => l.kind === 'add')
    const pairs = Math.min(dels.length, adds.length)
    for (let i = 0; i < pairs; i++)
      rows.push({ kind: 'change', left: dels[i], right: adds[i] })
    for (let i = pairs; i < dels.length; i++)
      rows.push({ kind: 'del', left: dels[i], right: null })
    for (let i = pairs; i < adds.length; i++)
      rows.push({ kind: 'add', left: null, right: adds[i] })
    block.length = 0
  }
  for (const line of hunk.lines) {
    if (line.kind === 'ctx') {
      flush()
      rows.push({ kind: 'ctx', left: line, right: line })
    } else block.push(line)
  }
  flush()
  return rows
}

const TOKEN = /\s+|[\w\u0080-\uffff]+|[^\s\w\u0080-\uffff]/gu
const MAX_CELLS = 160000

function tokenize(text) {
  const spans = []
  for (const m of text.matchAll(TOKEN))
    spans.push([m.index, m.index + m[0].length])
  return spans
}

// 标出两边「不属于公共部分」的字符区间，供行内高亮使用。返回 [[a 的区间], [b 的区间]]。
export function tokenRanges(before, after) {
  const a = tokenize(before),
    b = tokenize(after)
  const ta = a.map(([s, e]) => before.slice(s, e)),
    tb = b.map(([s, e]) => after.slice(s, e))
  let head = 0
  while (head < ta.length && head < tb.length && ta[head] === tb[head]) head++
  let tailA = ta.length,
    tailB = tb.length
  while (tailA > head && tailB > head && ta[tailA - 1] === tb[tailB - 1]) {
    tailA--
    tailB--
  }
  const markA = new Uint8Array(ta.length),
    markB = new Uint8Array(tb.length)
  const n = tailA - head,
    m = tailB - head
  if (n && m && n * m > MAX_CELLS) {
    markA.fill(1, head, tailA)
    markB.fill(1, head, tailB)
  } else if (n && m) {
    // dp[i][j]：ta[head+i..] 与 tb[head+j..] 的最长公共长度。
    const dp = new Uint16Array((n + 1) * (m + 1))
    const at = (i, j) => i * (m + 1) + j
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        dp[at(i, j)] =
          ta[head + i] === tb[head + j]
            ? dp[at(i + 1, j + 1)] + 1
            : Math.max(dp[at(i + 1, j)], dp[at(i, j + 1)])
    let i = 0,
      j = 0
    while (i < n && j < m)
      if (ta[head + i] === tb[head + j]) (i++, j++)
      else if (dp[at(i + 1, j)] >= dp[at(i, j + 1)]) markA[head + i++] = 1
      else markB[head + j++] = 1
    while (i < n) markA[head + i++] = 1
    while (j < m) markB[head + j++] = 1
  } else {
    for (let i = head; i < tailA; i++) markA[i] = 1
    for (let j = head; j < tailB; j++) markB[j] = 1
  }
  return [merge(markA, a, before), merge(markB, b, after)]
}

// 相邻的高亮记号并成一段；两段之间只隔空白时也并起来，断开处更符合直觉。
function merge(marks, spans, text) {
  const merged = []
  for (let i = 0; i < spans.length; i++) {
    if (marks[i] !== 1) continue
    const [start, end] = spans[i]
    const last = merged.at(-1)
    const joins =
      !!last &&
      (last[1] === start ||
        /^\s+$/.test(text.slice(start, end)) ||
        /^\s+$/.test(text.slice(last[1], start)))
    if (joins) merged[merged.length - 1] = [last[0], end]
    else merged.push([start, end])
  }
  // 段首、段尾的空白没有视觉意义，不纳入高亮。
  return merged.flatMap(([start, end]) => {
    const lead = /^\s*/.exec(text.slice(start, end))[0].length
    const tail = /\s*$/.exec(text.slice(start, end))[0].length
    return start + lead < end - tail ? [[start + lead, end - tail]] : []
  })
}
