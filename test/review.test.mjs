import test from 'node:test'
import assert from 'node:assert/strict'
import { parsePatch } from '../client/diff.js'
import {
  anchorNote,
  copyText,
  MARKER,
  placeNotes,
  reviewPrompt,
  stampOf,
} from '../client/review.js'
import { defaultBase } from '../client/review.js'
import { issuesOf, parseReport, shrinkReport } from '../src/report.js'
import {
  isReviewStart,
  MARKER as HOST_MARKER,
  readReview,
  readTail,
} from '../src/review.js'

const patch = parsePatch(
  [
    'diff --git a/src/a.js b/src/a.js',
    'index 111..222 100644',
    '--- a/src/a.js',
    '+++ b/src/a.js',
    '@@ -10,4 +10,5 @@ first {',
    ' const keep = 1',
    '-const old = read(path)',
    '+const rows = readAll(path)',
    '+const text = load(rows)',
    ' return text',
    '@@ -40,3 +41,4 @@ second {',
    ' ctx',
    '+return JSON.parse(text)',
    '-return null',
    '+done()',
    '',
  ].join('\n'),
)

const tree = {
  branch: 'feat/x',
  head: '08d1b36094abcdef',
  status: {
    total: 3,
    files: [
      { path: 'src/a.ts', xy: 'M ', add: 12, del: 3 },
      { path: 'docs/new.md', xy: '??', lines: 7 },
      { path: 'renamed.js', xy: 'R.', from: 'old.js', add: 2, del: 0 },
    ],
  },
}

test('指纹：同一份改动稳定，文件、行数或总数变了就变', () => {
  const stamp = stampOf(tree)
  assert.match(stamp, /^[0-9a-f]{8}$/)
  assert.equal(stampOf(structuredClone(tree)), stamp)
  assert.notEqual(
    stampOf({ ...tree, status: { ...tree.status, total: 4 } }),
    stamp,
  )
  const edited = structuredClone(tree)
  edited.status.files[0].add = 13
  assert.notEqual(stampOf(edited), stamp)
  assert.equal(stampOf(null), stampOf({}))
})

test('审查请求：带标记和指纹，列全文件，写明只读', () => {
  const stamp = stampOf(tree)
  const prompt = reviewPrompt(tree, stamp)
  assert.ok(prompt.includes(MARKER))
  // 标记在最后一行：会话标题取自开头。
  assert.ok(
    !prompt.startsWith(MARKER) && prompt.trimEnd().endsWith(`${MARKER}）`),
  )
  assert.ok(prompt.includes(stamp))
  assert.ok(prompt.includes('src/a.ts  +12 −3'))
  assert.ok(prompt.includes('docs/new.md  +7'))
  assert.ok(prompt.includes('renamed.js（原 old.js）'))
  assert.ok(prompt.includes('worktree-review'))
  assert.match(prompt, /只读审查[\s\S]*不要修改/)
  assert.ok(!prompt.includes('只列出前'))
  // 文件很多时只列前一部分，并说明总数。
  const many = {
    ...tree,
    status: {
      total: 95,
      files: Array.from({ length: 90 }, (_, i) => ({
        path: `f${i}.ts`,
        xy: ' M',
      })),
    },
  }
  const long = reviewPrompt(many, stamp)
  assert.equal(long.match(/^- \[/gm).length, 80)
  assert.ok(long.includes('共 95 个文件'))
})

test('批注定位：先按原文片段找，再按行号找，最后落到那一块里最近的一行', () => {
  const where = anchorNote(
    { file: 'src/a.js', hunk: 1, side: 'new', line: 99, quote: 'JSON.parse' },
    patch,
  )
  // 片段在第二块：行号不准也不影响。
  assert.deepEqual(
    [where.hunk, where.row, where.side, where.exact],
    [1, 1, 'right', true],
  )
  // 没有片段：行号对得上就对上。
  assert.deepEqual(
    (() => {
      const w = anchorNote({ file: 'src/a.js', side: 'new', line: 12 }, patch)
      return [w.hunk, w.row, w.side, w.exact]
    })(),
    [0, 2, 'right', true],
  )
  // 旧文件那一侧的行号（被删的行）。
  assert.deepEqual(
    (() => {
      const w = anchorNote({ file: 'src/a.js', side: 'old', line: 11 }, patch)
      return [
        w.hunk,
        w.row,
        w.side,
        patch.hunks[0].lines[1].text === 'const old = read(path)' &&
          w.row === 1,
      ]
    })(),
    [0, 1, 'left', true],
  )
  // 行号不在差异里：挂到点名的那一块里行号最近的一行。
  const near = anchorNote(
    { file: 'src/a.js', hunk: 2, side: 'new', line: 38 },
    patch,
  )
  assert.deepEqual([near.hunk, near.exact], [1, false])
  // 什么线索都没有：挂在块头。
  assert.deepEqual(anchorNote({ file: 'src/a.js', hunk: 2 }, patch), {
    hunk: 1,
    row: null,
    side: 'right',
    exact: false,
  })
  // 块号超出了范围：退到第一块。
  assert.equal(anchorNote({ file: 'src/a.js', hunk: 9 }, patch).hunk, 0)
  assert.deepEqual(anchorNote({ file: 'x' }, null), {
    hunk: null,
    row: null,
    side: 'right',
  })
})

test('一批批注按块、按行归好；差异里放不下的单列', () => {
  const notes = [
    {
      file: 'src/a.js',
      hunk: 1,
      side: 'new',
      line: 12,
      level: 'info',
      title: 'a',
    },
    {
      file: 'src/a.js',
      hunk: 1,
      side: 'new',
      line: 12,
      level: 'fix',
      title: 'b',
    },
    { file: 'src/a.js', hunk: 2, level: 'warn', title: '整块' },
  ]
  const { byHunk, loose, placed } = placeNotes(notes, patch)
  assert.equal(placed.length, 3)
  assert.deepEqual(loose, [])
  assert.equal(byHunk.get(0).get(2).length, 2)
  assert.deepEqual(
    byHunk
      .get(1)
      .get(-1)
      .map((n) => n.note.title),
    ['整块'],
  )
  assert.equal(placeNotes(notes, null).loose.length, 3)
})

test('读审查结果：认 worktree-review 代码块，把严重程度归成三档，丢掉不完整的条目', () => {
  const text = [
    '总评：整体没问题。',
    '```json',
    '{"notes": [{"file": "x.js"}], "verdict": "pass"}',
    '```',
    '```worktree-review',
    [
      '{',
      '  "verdict": "needs-work",',
      '  "summary": "有一处必须改。",',
      '  "stamp": "020421f2",',
      '  "notes": [',
      '    {"file": "./src/a.js", "hunk": "2", "side": "NEW", "line": 12.5, "quote": "return", "severity": "blocker", "title": " t ", "body": "b"},',
      '    {"file": "src/b.js", "level": "suggestion", "title": "建议", "hunk": 0},',
      '    {"path": "src/c.js", "kind": "说明"},',
      '    {"file": "", "title": "没有文件名"},',
      '    {"file": "src/d.js", "line": "abc", "side": "left"},',
      '    "garbage",',
      '  ],',
      '}',
    ].join('\n'),
    '```',
  ].join('\n')
  const { ok, report } = parseReport(text)
  assert.equal(ok, true)
  assert.equal(report.verdict, 'fail')
  assert.equal(report.summary, '有一处必须改。')
  assert.equal(report.stamp, '020421f2')
  assert.deepEqual(
    report.notes.map((n) => [n.file, n.hunk, n.side, n.line, n.level, n.title]),
    [
      // 块号写成字符串也认；行号 12.5 不是整数、NEW 不在可选值里，各按默认处理。
      ['src/a.js', 2, 'new', null, 'fix', 't'],
      ['src/b.js', null, 'new', null, 'warn', '建议'],
      ['src/c.js', null, 'new', null, 'info', ''],
      ['src/d.js', null, 'new', null, 'info', ''],
    ],
  )
  assert.equal(parseReport('没有结果，只有一句话。').ok, false)
  assert.equal(parseReport('```json\n{"foo": 1}\n```').ok, false)
  assert.equal(
    parseReport('```json\n{"summary": "x", "notes": []}\n```').report.verdict,
    'pass',
  )
  // 末尾多一个逗号、引号写成全角，也尽量读出来。
  assert.equal(
    parseReport(
      '```worktree-review\n{"verdict": "warn", “notes": [{"file": "a.js", "title": "x"},],}\n```',
    ).report.notes.length,
    1,
  )
})

// 会话记录的样子：每条是 { type: 'event', event: { type, data } }。
const user = (text) => ({
  type: 'event',
  event: {
    type: 'user/message',
    data: { role: 'user', content: [{ type: 'text', text }] },
  },
})
const assistant = (text) => ({
  type: 'event',
  event: {
    type: 'assistant/message',
    data: {
      message: {
        role: 'assistant',
        content: [
          { type: 'reasoning', text: '想' },
          { type: 'text', text },
        ],
      },
    },
  },
})
const start = { type: 'event', event: { type: 'turn/start', data: {} } }
const end = { type: 'event', event: { type: 'turn/end', data: {} } }

test('认出审查会话：用户发出的消息里带着审查标记；宿主插进来的上下文不算', () => {
  const mine = (text) => ({
    type: 'event',
    event: {
      type: 'user/message',
      data: {
        role: 'user',
        source: { kind: 'user' },
        content: [{ type: 'text', text }],
      },
    },
  })
  const injected = (text) => ({
    type: 'event',
    event: {
      type: 'user/message',
      data: {
        role: 'user',
        source: { kind: 'runtime-context' },
        content: [{ type: 'text', text }],
      },
    },
  })
  assert.equal(isReviewStart([mine('你好'), mine(`请审查（${MARKER}）`)]), true)
  // 宿主在提示词前面插了一段运行环境说明。
  assert.equal(
    isReviewStart([
      start,
      injected('<system-reminder>当前会话</system-reminder>'),
      mine(`请审查（${MARKER}）`),
    ]),
    true,
  )
  // 只是上下文里提到了标记，用户自己没发过。
  assert.equal(
    isReviewStart([injected(`别处的说明里出现了 ${MARKER}`), mine('你好')]),
    false,
  )
  assert.equal(isReviewStart([user('你好')]), false)
  assert.equal(isReviewStart([]), false)
  assert.equal(isReviewStart(null), false)
})

const good =
  '看完了。\n```worktree-review\n{"verdict": "pass", "notes": [{"file": "a.js", "title": "ok"}]}\n```'
test('从最后一页取结果：取最近一份能读的回复', () => {
  assert.equal(
    readTail([start, assistant('我先看看。'), assistant(good), end]).report
      .verdict,
    'pass',
  )
  // 模型在给出结果后又补了一句没有代码块的说明：仍然取得到前面那份。
  assert.equal(
    readTail([assistant(good), assistant('以上就是全部结论。')]).ok,
    true,
  )
  assert.equal(readTail([start, assistant('我先看看。')]).ok, false)
  assert.equal(readTail([]).ok, false)
})

test('一轮是怎么结束的：出错、被取消，都带回原因给面板显示', () => {
  const ended = (reason) => ({
    type: 'event',
    event: { type: 'turn/end', data: { turn: 1, reason } },
  })
  const failed = readTail([
    start,
    assistant('我先看看。'),
    ended({ kind: 'error', error: { message: 'llm: no API key' } }),
  ])
  assert.equal(failed.ok, false)
  assert.equal(failed.problem, 'llm: no API key')
  assert.equal(
    readTail([start, ended({ kind: 'cancelled' })]).problem,
    '审查被取消了',
  )
  assert.equal(readTail([start, ended({ kind: 'completed' })]).problem, null)
  // 之前失败过、后来成功：按最后的结果算。
  const ok = readTail([
    ended({ kind: 'error', error: { message: 'x' } }),
    start,
    assistant(good),
    ended({ kind: 'completed' }),
  ])
  assert.equal(ok.ok, true)
  assert.equal(ok.problem, null)
})

// 按宿主真实的分页规则截一页（见宿主 dsh-api-session-controller 的 paginate）：从切点往前数，
// 最多给 maxMessages（不传是 50）条 user/message、assistant/message，中间的其它事件照带。
// 之前这里不管条数都整份返回，长会话里「读会话头读不到第一条消息」的问题就这样漏了过去。
function pageOf(records, request = {}) {
  const type = (record) => (record.event ?? record).type
  const budget = request.maxMessages ?? 50
  const end = Math.min(
    (request.throughSeq ?? records.length - 1) + 1,
    records.length,
  )
  let count = 0,
    cut = 0
  for (let i = end - 1; i >= 0; i--) {
    if (!['user/message', 'assistant/message'].includes(type(records[i])))
      continue
    if (++count >= budget) {
      cut = i
      break
    }
  }
  return {
    records: records.slice(cut, end),
    hasMore: cut > 0,
    cursor: records.length - 1,
  }
}

// 假的宿主会话控制器：只回应 state 和 events（按上面的规则分页），记下被问过什么。
function fakeHost({ records, running = false, cursor = 1000 }) {
  const calls = []
  return {
    calls,
    async state({ sessionId }) {
      calls.push(['state', sessionId])
      return { running }
    },
    async events(request, signal) {
      calls.push([
        'events',
        request.address.sessionId,
        request.maxMessages ?? null,
        request.throughSeq ?? null,
      ])
      // 和真实宿主一样：没有取消信号的读取直接失败（之前这里不检查，漏掉了「读会话头忘了传信号」）。
      if (!(signal instanceof AbortSignal))
        throw new TypeError('events: signal is required')
      // cursor 用来模拟「日志比手里这份记录长」：这时不按手里的记录分页，整份返回，由调用方决定怎么读。
      return cursor > records.length
        ? { records, hasMore: false, cursor }
        : pageOf(records, request)
    },
  }
}
const goodTail = [
  start,
  user('别的'),
  {
    type: 'event',
    event: {
      type: 'assistant/message',
      data: {
        message: {
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: '```worktree-review\n{"verdict": "pass", "notes": [{"file": "a.js", "title": "ok"}]}\n```',
            },
          ],
        },
      },
    },
  },
  end,
]

test('readReview：先读最后一页就认得出审查会话，不用再读会话头；认过一次就记住', async () => {
  const host = fakeHost({
    records: [user(`请审查（${HOST_MARKER}）`), ...goodTail],
  })
  const remembered = new Map()
  const result = await readReview(host, 'session-abc', remembered)
  assert.equal(result.known, true)
  assert.equal(result.running, false)
  assert.equal(result.report.verdict, 'pass')
  assert.equal(result.failed, false)
  // 只读了最后一页。
  assert.deepEqual(
    host.calls.map((c) => c[0]),
    ['state', 'events'],
  )
  await readReview(host, 'session-abc', remembered)
  // 第二次不再需要判断，也还是只读一页（每轮都重新取结果）。
  assert.equal(host.calls.filter((c) => c[0] === 'events').length, 2)
})

test('readReview：标记不在最后一页时去读会话头；不是审查会话就明说', async () => {
  // 长会话：最后一页里没有带标记的那条消息。
  const host = fakeHost({ records: goodTail })
  // 第二次 events 调用（throughSeq）返回会话头。
  let turn = 0
  host.events = async (request) => {
    host.calls.push([
      'events',
      request.address.sessionId,
      request.maxMessages ?? null,
      request.throughSeq ?? null,
    ])
    // 第一次（最后一页）里没有带标记的消息；第二次（会话头）里才有。
    return ++turn === 1
      ? { records: goodTail, hasMore: true, cursor: 1000 }
      : {
          records: [user(`请审查（${HOST_MARKER}）`)],
          hasMore: true,
          cursor: 12,
        }
  }
  const result = await readReview(host, 'session-abc', new Map())
  assert.equal(result.known, true)
  assert.equal(host.calls[2][0], 'events')
  assert.equal(host.calls[2][3], 400, '会话头最多读到第 400 个事件')

  // 不是审查会话：最后一页和会话头里都没有标记。
  const other = fakeHost({ records: [user('你好'), ...goodTail], cursor: 12 })
  other.events = async (request) => {
    other.calls.push([
      'events',
      request.address.sessionId,
      request.maxMessages ?? null,
      request.throughSeq ?? null,
    ])
    return { records: [user('你好')], hasMore: false, cursor: 12 }
  }
  const plain = await readReview(other, 'session-xyz', new Map())
  assert.deepEqual(plain, { known: false })
  assert.equal(other.calls[2][3], 12, '日志比 400 短时只读到日志末尾')
})

test('readReview：长会话里审查请求远在会话开头，读会话头时要一次读到它', async () => {
  // 真实的审查会话：第一条是审查请求，之后是上百个事件（模型反复看文件），最后一页里早就没了标记。
  const step = (i) => [
    { type: 'event', event: { type: 'tool/call', data: { name: 'read', i } } },
    assistant(`看第 ${i} 个文件`),
    { type: 'event', event: { type: 'tool/result', data: { i } } },
  ]
  const records = [
    start,
    user(`请审查（${HOST_MARKER}）`),
    ...Array.from({ length: 200 }, (_, i) => step(i)).flat(),
    ...goodTail,
  ]
  const host = fakeHost({ records, cursor: records.length - 1 })
  const result = await readReview(host, 'session-long', new Map())
  assert.equal(result.known, true, '要认得出这是审查会话')
  assert.equal(result.report.verdict, 'pass')
  const head = host.calls[2]
  assert.equal(head[0], 'events')
  assert.equal(head[3], 400, '会话头最多读到第 400 个事件')
  assert.equal(host.calls[1][2], 16, '最后一页只要最后 16 条消息')
  assert.equal(head[2], 400, '条数上限和事件数一样多，这一页才从会话开头算起')
  // 对照：按默认的 50 条读，读到的是切点之前的最后 50 条消息，里面没有标记。
  assert.equal(
    isReviewStart(pageOf(records, { throughSeq: 400 }).records),
    false,
  )
})

test('readReview：还在跑、跑失败、读不到，各是什么样', async () => {
  const running = await readReview(
    fakeHost({
      records: [user(`请审查（${HOST_MARKER}）`), start],
      running: true,
    }),
    's',
    new Map(),
  )
  assert.equal(running.running, true)
  assert.equal(running.report, null)
  assert.equal(running.failed, false)
  const failed = await readReview(
    fakeHost({
      records: [
        user(`请审查（${HOST_MARKER}）`),
        start,
        {
          type: 'event',
          event: {
            type: 'turn/end',
            data: { reason: { kind: 'error', error: { message: '没有模型' } } },
          },
        },
      ],
    }),
    's',
    new Map(),
  )
  assert.equal(failed.failed, true)
  assert.equal(failed.problem, '没有模型')
  const broken = {
    state: async () => {
      throw new Error('gone')
    },
    events: async () => {
      throw new Error('gone')
    },
  }
  await assert.rejects(readReview(broken, 's', new Map()), /gone/)
})

test('未推送的范围：指纹带上比较基准，和未提交的互不相同；提示词写明基准和命令', () => {
  const base = 'b'.repeat(40)
  const tree = {
    branch: 'feat/x',
    head: 'a1b2c3d4e5',
    status: {
      total: 1,
      ahead: 2,
      files: [{ xy: '.M', path: 'src/a.js', add: 1, del: 2 }],
      outgoing: {
        base,
        ref: 'origin/feat/x',
        total: 2,
        commits: [{ sha: 'c'.repeat(40), time: 1, title: 'second' }],
        files: [
          { st: 'M', path: 'src/a.js', add: 3, del: 2, dirty: true, mtime: 5 },
          { xy: '??', path: 'src/b.js', lines: 3, mtime: 6, size: 9 },
        ],
      },
    },
  }
  const stamp = stampOf(tree, 'outgoing')
  assert.match(stamp, /^o[0-9a-f]{8}$/)
  assert.equal(stampOf(tree), stampOf(tree, 'uncommitted'))
  assert.notEqual(stamp, stampOf(tree))
  // 推送之后又来了新提交（基准变了），或者文件又改了：指纹就变
  const moved = structuredClone(tree)
  moved.status.outgoing.base = 'd'.repeat(40)
  assert.notEqual(stampOf(moved, 'outgoing'), stamp)
  const edited = structuredClone(tree)
  edited.status.outgoing.files[0].mtime = 6
  assert.notEqual(stampOf(edited, 'outgoing'), stamp)
  // 只动了未提交的清单、和上游比的清单没变：这个范围的指纹不变
  const onlyUncommitted = structuredClone(tree)
  onlyUncommitted.status.files[0].add = 9
  assert.equal(stampOf(onlyUncommitted, 'outgoing'), stamp)
  assert.equal(stampOf({ status: {} }, 'outgoing'), '')

  const prompt = reviewPrompt(tree, stamp, 'outgoing')
  assert.ok(prompt.includes(MARKER))
  assert.ok(prompt.includes(`git diff ${base} --`))
  assert.match(prompt, /比较基准是上游 `origin\/feat\/x`（提交 b+）/)
  assert.match(prompt, /有 2 个提交还没推送/)
  assert.match(prompt, /共改了 2 个文件/)
  assert.ok(prompt.includes('[已提交，又有改动] src/a.js  +3 −2'))
  assert.ok(prompt.includes('[未跟踪] src/b.js  +3'))
  // 不说范围，审的还是未提交的
  assert.match(reviewPrompt(tree, stamp), /尚未提交的改动/)
  assert.ok(!reviewPrompt(tree, stamp).includes('比较基准'))
})

test('默认提示词只要「必须处理」和「建议」，不再要逐块的说明', () => {
  const prompt = reviewPrompt(tree, stampOf(tree))
  assert.match(prompt, /只列有问题的改动/)
  assert.match(prompt, /没有问题就给空数组/)
  // 以前要求「每个改动块至少一条，说明它做了什么」：不要再出现
  assert.ok(!prompt.includes('每个改动块至少一条'))
  assert.ok(!prompt.includes('说明它做了什么'))
  assert.ok(!/"level": "info"/.test(prompt))
  assert.match(defaultBase(), /尚未提交的改动/)
  assert.match(defaultBase('outgoing'), /还没推到远端的改动/)
  // 两个范围各自的那句只在自己的默认提示词里
  assert.ok(!defaultBase().includes('未推送的提交'))
})

test('基本提示词可以按仓库换掉：换的只是开头那一段，范围、做法、只读约束和输出格式照旧', () => {
  const stamp = stampOf(tree)
  const mine = '这是账目服务。重点看金额精度和写入的幂等。'
  const prompt = reviewPrompt(tree, stamp, 'uncommitted', mine)
  assert.ok(prompt.startsWith(`${mine}\n\n## 范围`))
  for (const part of [
    '- 分支：feat/x（HEAD 08d1b36094）',
    'src/a.ts  +12 −3',
    'git diff HEAD --',
    '每个 @@ 块是一个改动块',
    '只读审查',
    'worktree-review',
    stamp,
    MARKER,
  ])
    assert.ok(prompt.includes(part), part)
  // 默认的那几句不在了
  assert.ok(!prompt.includes('重点找逻辑错误'))
  // 空白当作没配：用默认的
  assert.ok(
    reviewPrompt(tree, stamp, 'uncommitted', ' \n ').includes(defaultBase()),
  )
  assert.ok(
    reviewPrompt(tree, stamp, 'uncommitted', null).includes(defaultBase()),
  )
})

test('「复制结论」：只复制还没审阅的文件里的；先必须处理、后建议；是能直接发给 AI 的一段话', () => {
  const notes = [
    {
      file: 'src/a.js',
      level: 'warn',
      line: 8,
      side: 'new',
      title: '建议一',
      body: '正文一',
    },
    {
      file: 'src/b.js',
      level: 'fix',
      line: 40,
      side: 'new',
      title: '必须一',
      body: '',
    },
    {
      file: 'src/c.js',
      level: 'fix',
      line: 3,
      side: 'old',
      title: '必须二',
      body: '正文二',
    },
    { file: 'src/d.js', level: 'warn', line: 5, title: '建议二', body: '' },
  ]
  const all = copyText(notes, {
    branch: 'feat/x',
    head: 'a1b2c3d4e5f6',
    scope: 'uncommitted',
    at: Date.UTC(2026, 10, 27, 2, 5),
  })
  assert.equal(all.count, 4)
  assert.equal(all.skipped, 0)
  // 顺序：必须处理在前；同一种里保持审查结果原来的先后
  assert.deepEqual(
    [...all.text.matchAll(/^### \d+\. (\S+)/gm)].map((m) => m[1]),
    ['src/b.js', 'src/c.js', 'src/a.js', 'src/d.js'],
  )
  assert.match(all.text, /^请处理下面的代码审查结论[^\n]*\n/)
  assert.ok(all.text.includes('- 分支：feat/x（审查时的提交 a1b2c3d4e5）'))
  assert.ok(all.text.includes('- 范围：尚未提交的改动'))
  assert.ok(all.text.includes('- 审查时间：'))
  assert.ok(all.text.includes('## 必须处理（2）'))
  assert.ok(all.text.includes('## 建议（2）'))
  assert.ok(all.text.includes('### 2. src/c.js · 旧第 3 行\n必须二\n\n正文二'))
  // 和标题相同的正文不重复写
  assert.ok(!all.text.includes('建议一\n\n建议一'))
  // 审的是未推送的改动时带上上游
  const out = copyText(notes.slice(0, 1), {
    scope: 'outgoing',
    ref: 'origin/main',
  })
  assert.ok(out.text.includes('，和上游 origin/main 比'))
  // 标成已审阅的文件不复制
  const some = copyText(notes, { skip: new Set(['src/b.js', 'src/a.js']) })
  assert.equal(some.count, 2)
  assert.equal(some.skipped, 2)
  assert.ok(!some.text.includes('src/b.js') && !some.text.includes('src/a.js'))
  assert.ok(some.text.includes('另有 2 条结论所在的文件你已经审阅过'))
  // 没有可复制的
  assert.deepEqual(
    copyText(notes, { skip: new Set(notes.map((n) => n.file)) }),
    {
      text: '',
      count: 0,
      skipped: 4,
    },
  )
  assert.equal(copyText([]).text, '')
  assert.equal(copyText(undefined).count, 0)
})

test('审查结果里的「说明」不再显示：只留必须处理和建议；一条不剩按「审查通过」', () => {
  const block = (data) =>
    `\`\`\`worktree-review\n${JSON.stringify(data)}\n\`\`\``
  const parsed = parseReport(
    block({
      verdict: 'warn',
      summary: 's',
      notes: [
        { file: 'a.js', level: 'info', title: '说明一' },
        { file: 'b.js', level: 'fix', title: '必须一' },
        { file: 'c.js', level: 'warn', title: '建议一' },
        { file: 'd.js', level: '说明', title: '说明二' },
      ],
    }),
  )
  // 宿主照样读得出「说明」（早先的审查结果里有）
  assert.equal(parsed.report.notes.length, 4)
  const report = shrinkReport(parsed.report)
  assert.deepEqual(
    report.notes.map((n) => n.title),
    ['必须一', '建议一'],
  )
  assert.equal(report.verdict, 'warn')
  // 没有「说明」可去掉：还是同一个对象，界面不必重画
  assert.equal(shrinkReport(report), report)
  assert.equal(shrinkReport(null), null)
  assert.deepEqual(issuesOf(report.notes), report.notes)
  // 只剩说明的：按通过说
  const onlyInfo = parseReport(
    block({
      verdict: 'warn',
      summary: 's',
      notes: [{ file: 'a.js', level: 'info' }],
    }),
  ).report
  assert.deepEqual(shrinkReport(onlyInfo), {
    ...onlyInfo,
    notes: [],
    verdict: 'pass',
  })
  assert.deepEqual(issuesOf(null), [])
})
