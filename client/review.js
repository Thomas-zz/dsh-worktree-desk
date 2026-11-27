// 代码审查：发给审查会话的提示词、审查对象的指纹、批注在差异里的定位。纯函数，可在 node 下直接测试。
import { pairRows } from './diff.js'
import { fileBadge, fullTime } from './model.js'

export const MARKER = 'worktree-desk-review'
// 提示词里最多列这么多文件，免得改动很多时提示词过长（模型自己会再看 git status）。
const LIST_LIMIT = 80

const fingerprint = (text) => {
  let hash = 5381
  for (let i = 0; i < text.length; i++)
    hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0
  return (hash >>> 0).toString(16).padStart(8, '0')
}

// 审查对象的指纹：文件清单和每个文件的增删行数。审查之后改动又变了，指纹就对不上。
// 未提交的范围一直用原来的算法（之前留下的审查记录要对得上）；未推送的范围另算，带上比较基准，
// 以及提交之后又改过的文件的修改时间。
export function stampOf(tree, scope = 'uncommitted') {
  if (scope !== 'outgoing') {
    const files = tree?.status?.files ?? []
    const text =
      files
        .map(
          (file) =>
            `${file.xy}\u0000${file.path}\u0000${file.from ?? ''}\u0000${file.add ?? ''}\u0000${file.del ?? ''}\u0000${file.lines ?? ''}`,
        )
        .sort()
        .join('\n') + `\n#${tree?.status?.total ?? 0}`
    return fingerprint(text)
  }
  const out = tree?.status?.outgoing
  if (!out) return ''
  const text =
    (out.files ?? [])
      .map(
        (file) =>
          `${file.st ?? file.xy}\u0000${file.path}\u0000${file.from ?? ''}\u0000${file.add ?? ''}\u0000${file.del ?? ''}\u0000${file.lines ?? ''}\u0000${file.mtime ?? ''}`,
      )
      .sort()
      .join('\n') + `\n${out.base}\n#${out.total}`
  return 'o' + fingerprint(text)
}

const code = (text) => '`' + text + '`'
const SCOPE_TEXT = {
  uncommitted: '尚未提交的改动',
  outgoing: '还没推到远端的改动（未推送的提交，加上还没提交的）',
}

// 基本提示词：审什么、重点找什么。仓库可以按自己的情况换掉这一段（见 reviewPrompt 的 base），
// 范围、做法、只读约束和输出格式由面板固定给出，不跟着换。
export function defaultBase(scope = 'uncommitted') {
  const what =
    scope === 'outgoing'
      ? '请对这个工作树里还没推到远端的改动做一次代码审查：未推送的提交，加上还没提交的改动。'
      : '请对这个工作树里尚未提交的改动做一次代码审查。'
  return `${what}
只列要动手的结论：必须处理的问题，和建议。重点找逻辑错误、边界情况、错误处理、安全隐患、性能问题、测试缺口，以及和改动意图不符的地方。
不确定的写成疑问，不要猜；和这次改动无关的旧问题不写。`
}

// 面板让 DSH 新开一个会话、发出的审查请求。结果要落成一个 worktree-review 代码块（见 src/report.js）。
// scope 是审查哪个范围的改动（见 model.js 的 SCOPES）：未提交的，或者和上游比的（未推送的提交 + 还没提交的）。
// base 是这个仓库自己配的基本提示词；没有（或是空白）就用默认的。
export function reviewPrompt(tree, stamp, scope = 'uncommitted', base = null) {
  const status = tree?.status
  const out = scope === 'outgoing' ? status?.outgoing : null
  const files = (out ? out.files : status?.files) ?? []
  const total = out ? out.total : (status?.total ?? 0)
  const list = files.slice(0, LIST_LIMIT).map((file) => {
    const badge = fileBadge(file)
    const stat =
      file.xy === '??'
        ? file.lines != null
          ? `  +${file.lines}`
          : ''
        : file.add != null
          ? `  +${file.add} −${file.del}`
          : ''
    return `- [${badge.text}] ${file.path}${file.from ? `（原 ${file.from}）` : ''}${stat}`
  })
  const more =
    total > files.length
      ? `\n（共 ${total} 个文件，上面只列出前 ${files.length} 个，其余请用 ${code(out ? `git diff --name-only ${out.base}` : 'git status --short')} 查看）`
      : ''
  const baseSha = out?.base ?? ''
  const diff = out ? `git diff ${baseSha}` : 'git diff HEAD'
  const range = out
    ? `- 比较基准是上游 ${code(out.ref)}（提交 ${baseSha}），有 ${status?.ahead ?? 0} 个提交还没推送。
- 和基准相比共改了 ${total} 个文件：已经提交的和还没提交的（已暂存、未暂存、未跟踪）都算。`
    : `- 未提交的改动共 ${total} 个文件：已暂存、未暂存、未跟踪的新文件都算。`
  // 示例用具体的内容：写成「二选一」这种占位的话，模型容易照抄。
  const example = {
    verdict: 'warn',
    summary: '整体思路清楚；导入失败的情况需要处理，另有一处可以简化。',
    stamp,
    notes: [
      {
        file: 'src/import.ts',
        hunk: 2,
        side: 'new',
        line: 40,
        quote: 'return JSON.parse(text)',
        level: 'fix',
        title: '没有处理解析失败',
        body: 'text 不是合法 JSON 时会直接抛出，调用方拿不到任何提示。建议捕获后返回明确的错误。',
      },
      {
        file: 'src/import.ts',
        hunk: 2,
        side: 'old',
        line: 31,
        quote: 'const text = await read(path)',
        level: 'warn',
        title: '旧实现里的读取没有释放',
        body: '这一行被删掉了，但新实现同样没有关闭文件句柄，确认是否需要 finally。',
      },
    ],
  }
  const lead =
    typeof base === 'string' && base.trim() ? base.trim() : defaultBase(scope)
  return `${lead}

## 范围
- 分支：${tree.branch || '（分离 HEAD）'}（HEAD ${(tree.head || '').slice(0, 10)}）
${range}
${list.join('\n')}${more}

## 做法
1. 用 ${code('git status --short')} 和 ${code(`${diff} --`)} 看全改动；未跟踪的新文件在 diff 里没有，要直接读文件。需要时读上下文。
2. 逐个文件、逐个改动块地看。${code(diff)} 里每个 @@ 块是一个改动块，在同一个文件里按从上到下的顺序从 1 开始编号。

## 约束
这是一次只读审查：不要修改、格式化或提交任何文件，不要切换分支，不要执行会改动仓库或文件的命令。

## 输出
先用几句话给出总体结论。然后在回复的最末尾给出一个代码块，语言标记写 ${code('worktree-review')}，内容是严格的 JSON（不带注释，不带多余的逗号）。结构如下（内容是示例，换成你的实际结论）：

\`\`\`json
${JSON.stringify(example, null, 2)}
\`\`\`

要求：
- notes 只列有问题的改动，按文件、按行号从上到下排列；没有问题就给空数组 ${code('[]')}。
- warn 是建议或疑问，fix 是必须处理的问题。
- verdict：没有问题是 pass，只有建议或疑问是 warn，有必须处理的问题是 fail。
- line 是这一行在改动之后那个文件里的行号；quote 原样复制这一行里的一段文字（不要改写、不要省略中间），用来对齐。被删除的行 side 填 old、line 填改动之前的行号。
- stamp 原样填：${stamp}
- 全部用中文，title 和 body 写给改代码的人看，直接说结论。

（由工作树面板发起的代码审查：${MARKER}）`
}

const lineNo = {
  left: (line) => line.oldNo,
  right: (line) => line.newNo,
}

// 一条批注落到差异里的哪一块、哪一行、哪一侧。
// 模型给的行号未必准，所以先按 quote 找，再按行号找，再落到那一块里行号最近的一行，最后挂在块头上。
export function anchorNote(note, patch) {
  const hunks = patch?.hunks ?? []
  if (!hunks.length)
    return {
      hunk: null,
      row: null,
      side: note.side === 'old' ? 'left' : 'right',
    }
  // 先看批注点名的那一块，找不到再看别的块。
  const named = note.hunk >= 1 && note.hunk <= hunks.length ? note.hunk - 1 : -1
  const order = [
    ...[named].filter((h) => h >= 0),
    ...hunks.map((_, h) => h).filter((h) => h !== named),
  ]
  const rows = hunks.map((hunk) => pairRows(hunk))
  const sides = note.side === 'old' ? ['left', 'right'] : ['right', 'left']
  const result = (hunk, row, side) => ({
    hunk,
    row,
    side,
    exact: true,
  })
  if (note.quote) {
    let best = null
    for (const hunk of order)
      rows[hunk].forEach((row, index) => {
        for (const side of sides) {
          const line = row[side]
          if (!line?.text.includes(note.quote)) continue
          const gap = note.line ? Math.abs(lineNo[side](line) - note.line) : 0
          if (!best || gap < best.gap) best = { hunk, row: index, side, gap }
        }
      })
    if (best) return result(best.hunk, best.row, best.side)
  }
  if (note.line) {
    for (const side of sides)
      for (const hunk of order) {
        const index = rows[hunk].findIndex(
          (row) => lineNo[side](row[side] ?? {}) === note.line,
        )
        if (index >= 0) return result(hunk, index, side)
      }
    // 这一行不在差异里：挂到点名的那一块里行号最近的一行上，让人看得出大致位置。
    for (const side of sides) {
      let best = null
      for (const hunk of order)
        rows[hunk].forEach((row, index) => {
          const number = lineNo[side](row[side] ?? {})
          if (!number) return
          const gap = Math.abs(number - note.line)
          if (!best || gap < best.gap) best = { hunk, row: index, side, gap }
        })
      if (best) return { ...best, exact: false }
    }
  }
  return { hunk: order[0], row: null, side: sides[0], exact: false }
}

// 把一批批注安到某个文件的差异上：按块、按行归好，供差异视图逐行取用。
export function placeNotes(notes, patch) {
  const byHunk = new Map()
  const at = (hunk) => {
    if (!byHunk.has(hunk)) byHunk.set(hunk, new Map())
    return byHunk.get(hunk)
  }
  // i 是这条批注在这一批里的序号，界面用它记住展开状态、滚动定位。
  const placed = (notes ?? []).map((note, i) => {
    const where = patch
      ? anchorNote(note, patch)
      : { hunk: null, row: null, side: 'right' }
    return { note, i, ...where }
  })
  for (const item of placed) {
    if (item.hunk === null) continue
    if (item.row === null) {
      const map = at(item.hunk)
      if (!map.has(-1)) map.set(-1, [])
      map.get(-1).push(item)
    } else {
      const map = at(item.hunk)
      if (!map.has(item.row)) map.set(item.row, [])
      map.get(item.row).push(item)
    }
  }
  // 这个文件的差异里放不下的批注（文件名对不上，或者差异已经变了）。
  const loose = placed.filter((item) => item.hunk === null)
  return { placed, byHunk, loose }
}

// 批注落在哪一侧的那一行：给「跳到下一条批注」和差异行上的标记用。
export const noteRows = (placed) =>
  placed
    .filter((item) => item.row !== null)
    .map((item) => ({ ...item, index: item.hunk * 1e6 + item.row }))
    .sort((a, b) => a.index - b.index)

const plain = (path) =>
  String(path ?? '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
// 审查结果里的文件名和清单里的对齐：先按完整路径，对不上再按「文件名唯一」认（模型偶尔只写文件名）。
export function groupNotes(notes, files) {
  const byFile = new Map()
  const known = (files ?? []).map((file) => [file, plain(file.path)])
  const loose = []
  for (const note of notes ?? []) {
    const name = plain(note.file)
    let hit = known.find(([, path]) => path === name)
    if (!hit) {
      const same = known.filter(
        ([, path]) => path.slice(path.lastIndexOf('/') + 1) === name,
      )
      if (same.length === 1) hit = same[0]
    }
    if (!hit) {
      loose.push(note)
      continue
    }
    if (!byFile.has(hit[0].id)) byFile.set(hit[0].id, [])
    byFile.get(hit[0].id).push({ ...note, file: hit[1] })
  }
  return { byFile, loose }
}

// 「复制结论」复制出去的文字：这个范围里还要处理的结论，写成可以直接发给 AI 的一段话。
// skip 是标成已审阅的文件的路径：那些看过了，不复制。notes 是审查结果里的结论（groupNotes 归好路径的，
// 加上对不上文件的）。返回 { text, count, skipped }，没有可复制的时 text 是空串。
export function copyText(notes, options = {}) {
  const { skip, branch, head, scope = 'uncommitted', ref, at } = options
  const kept = []
  let skipped = 0
  for (const note of notes ?? [])
    if (skip?.has(note.file)) skipped += 1
    else kept.push(note)
  if (!kept.length) return { text: '', count: 0, skipped }
  const LEVEL_TEXT = { fix: '必须处理', warn: '建议' }
  // 先必须处理、后建议；同一种里保持审查结果原来的先后（按文件、按行号）。
  const ordered = ['fix', 'warn'].flatMap((level) =>
    kept
      .map((note, index) => ({ note, index }))
      .filter(({ note }) => note.level === level),
  )
  const lines = [
    '请处理下面的代码审查结论：逐条判断，该改的就改，不认同的说明理由。',
    '',
    `- 分支：${branch || '（分离 HEAD）'}${head ? `（审查时的提交 ${head.slice(0, 10)}）` : ''}`,
    `- 范围：${SCOPE_TEXT[scope]}${ref ? `，和上游 ${ref} 比` : ''}`,
    `- 审查时间：${fullTime(at)}`,
  ]
  let level = null
  ordered.forEach(({ note }, i) => {
    if (note.level !== level) {
      level = note.level
      const count = kept.filter((item) => item.level === level).length
      lines.push('', `## ${LEVEL_TEXT[level]}（${count}）`)
    }
    const old = note.side === 'old' ? '旧' : ''
    const place = note.line
      ? ` · ${old}第 ${note.line} 行`
      : note.hunk
        ? ` · 第 ${note.hunk} 块`
        : ''
    lines.push('', `### ${i + 1}. ${note.file}${place}`)
    lines.push(note.title || LEVEL_TEXT[level])
    if (note.body && note.body !== note.title) lines.push('', note.body)
  })
  if (skipped)
    lines.push(
      '',
      `（另有 ${skipped} 条结论所在的文件你已经审阅过，没有列进来。）`,
    )
  return { text: lines.join('\n') + '\n', count: kept.length, skipped }
}
