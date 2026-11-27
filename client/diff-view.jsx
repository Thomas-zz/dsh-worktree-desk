import React, { useEffect, useMemo, useState } from 'react'
import { request } from './api.js'
import { parsePatch, pairRows, tokenRanges } from './diff.js'
import { placeNotes, noteRows } from './review.js'
import { LEVELS } from '../src/report.js'
import { Icon } from './icons.jsx'
import { useWidth } from './bits.jsx'

// 没有批注的文件占位用：每次渲染都新建一个空数组的话，依赖它的记忆和副作用会跟着一遍遍重算。
const EMPTY = []

// 一个文件可以查看的「层」：新文件只有正文，冲突只有工作区，其余分已暂存 / 未暂存。
export function layers(file) {
  // 「未推送」的范围里已经提交的文件：上游和现在的工作目录比，只有一层。
  if (file.st) return [['outgoing', '未推送']]
  if (file.xy === '??') return [['new', '新文件']]
  if (file.conflict) return [['work', '冲突']]
  const choices = []
  if (file.xy[0] !== '.') choices.push(['index', '已暂存'])
  if (file.xy[1] !== '.') choices.push(['work', '未暂存'])
  return choices
}

// 只有一层可看时，标题里那个标签说明的是什么（悬停看）。
const LAYER_NOTE = {
  new: '新文件：还没加进 Git，看的是工作目录里的内容',
  work: '未暂存：比较暂存区和工作目录',
  index: '已暂存：比较 HEAD 和暂存区',
  outgoing:
    '未推送：比较上游和现在的工作目录（未推送的提交，加上还没提交的改动）',
}

// 批注足够宽时贴在代码右侧；再窄就收成行尾的标记，点开看。
const MARGIN_AT = 880
const MARGIN_SPLIT_AT = 1160
const RANK = { fix: 2, warn: 1, info: 0 }
const worst = (list) =>
  list.reduce(
    (top, item) => (RANK[item.note.level] > RANK[top] ? item.note.level : top),
    'info',
  )

// 把一段文字按高亮区间切成片段：区间之外普通显示，之内是行内改动。
function segments(text, ranges) {
  const parts = []
  let at = 0
  for (const [start, end] of ranges) {
    if (start > at) parts.push({ text: text.slice(at, start), mark: false })
    parts.push({ text: text.slice(start, end), mark: true })
    at = end
  }
  if (at < text.length) parts.push({ text: text.slice(at), mark: false })
  return parts
}

function Code({ text, ranges }) {
  return (
    <span className="wt-code">
      {segments(text, ranges).map((part, index) =>
        part.mark ? (
          <mark key={index}>{part.text}</mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </span>
  )
}

// 配对的增删行做行内词级比较；单独的增删行没有对照，整行着色即可。
function usePairs(hunk) {
  return useMemo(
    () =>
      pairRows(hunk).map((row) => ({
        ...row,
        ranges:
          row.left && row.right
            ? tokenRanges(row.left.text, row.right.text)
            : [[], []],
      })),
    [hunk],
  )
}

// 一条批注卡片：严重程度、结论，展开后是说明。
function NoteCard({ item }) {
  const { note } = item
  const [open, setOpen] = useState(true)
  const [label] = LEVELS[note.level]
  const body = note.body && note.body !== note.title ? note.body : ''
  return (
    <div
      className="wt-note"
      data-level={note.level}
      data-open={open ? '' : undefined}
      id={`wt-note-${item.i}`}
    >
      <button
        type="button"
        className="wt-notehead"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <i className="wt-notedot" title={label} />
        <span className="wt-notetitle">{note.title || label}</span>
        {note.level !== 'info' && <small className="wt-notetag">{label}</small>}
        {body && (
          <Icon
            name="chevron"
            size={12}
            className={'wt-notechevron' + (open ? ' is-open' : '')}
          />
        )}
      </button>
      {open && body && <p className="wt-notebody">{body}</p>}
    </div>
  )
}

// 行尾的批注标记（窄的时候用）：点开在这一行下面看。
function NoteMark({ list, open, onToggle }) {
  return (
    <button
      type="button"
      className="wt-notemark"
      data-level={worst(list)}
      aria-expanded={open}
      aria-label={`查看这一行的 ${list.length} 条批注`}
      title={`这一行有 ${list.length} 条批注`}
      onClick={(event) => {
        event.stopPropagation()
        onToggle(!open)
      }}
    >
      <Icon name="comment" size={13} />
      {list.length > 1 && <b>{list.length}</b>}
    </button>
  )
}

// 代码那一格：有批注的文件才多包一层，好把标记放在行尾。
function CodeCell({ text, ranges, mark }) {
  if (!mark) return <Code text={text} ranges={ranges} />
  return (
    <span className="wt-codecell">
      <Code text={text} ranges={ranges} />
      {mark}
    </span>
  )
}

const pick = (list, side, other) => {
  if (!list?.length) return null
  const own = list.filter((item) => item.side === side)
  // 这一行没有另一侧可放时，另一侧的批注（定位时退让过来的）也挂在它上面。
  return own.length ? own : other ? list : null
}

// 上下对照：批注在 margin 模式下占最右边一栏，否则收成行尾标记。
function Unified({ hunk, notes, margin, shown, toggle, flash }) {
  const rows = usePairs(hunk)
  const card = (item) => <NoteCard item={item} key={item.i} />
  const head = notes?.get(-1)
  const line = (key, kind, oldNo, newNo, sign, text, ranges, own) => {
    if (!own?.length)
      return [
        <div className="wt-line" data-kind={kind} key={key}>
          <span className="wt-ln">{oldNo ?? ''}</span>
          <span className="wt-ln">{newNo ?? ''}</span>
          <span className="wt-sign">{sign}</span>
          <Code text={text} ranges={ranges} />
        </div>,
      ]
    const level = worst(own)
    const ids = own.map((item) => item.i)
    const open = ids.some((i) => shown.has(i))
    return [
      <div
        className="wt-line"
        data-kind={kind}
        data-note={level}
        data-note-ids={ids.join(' ')}
        data-flash={ids.includes(flash) || undefined}
        key={key}
      >
        <span className="wt-ln">{oldNo ?? ''}</span>
        <span className="wt-ln">{newNo ?? ''}</span>
        <span className="wt-sign">{sign}</span>
        <CodeCell
          text={text}
          ranges={ranges}
          mark={
            margin ? undefined : (
              <NoteMark
                list={own}
                open={open}
                onToggle={(next) => toggle(ids, next)}
              />
            )
          }
        />
        {margin && <span className="wt-notecell">{own.map(card)}</span>}
      </div>,
      ...(!margin && open
        ? [
            <div className="wt-noterow" data-level={level} key={`${key}-notes`}>
              {own.map(card)}
            </div>,
          ]
        : []),
    ]
  }
  return (
    <div className="wt-hunkbody">
      {head?.length > 0 && (
        <div className="wt-noterow" data-level={worst(head)}>
          {head.map(card)}
        </div>
      )}
      {rows.flatMap((row, index) => {
        const own = notes?.get(index)
        if (row.kind === 'ctx')
          return line(
            index,
            'ctx',
            row.left.oldNo,
            row.left.newNo,
            ' ',
            row.left.text,
            [],
            own,
          )
        const out = []
        if (row.left)
          out.push(
            ...line(
              `${index}-`,
              'del',
              row.left.oldNo,
              null,
              '-',
              row.left.text,
              row.ranges[0],
              pick(own, 'left', !row.right),
            ),
          )
        if (row.right)
          out.push(
            ...line(
              `${index}+`,
              'add',
              null,
              row.right.newNo,
              '+',
              row.right.text,
              row.ranges[1],
              pick(own, 'right', !row.left),
            ),
          )
        return out
      })}
    </div>
  )
}

function Half({ line, ranges, mark }) {
  if (!line)
    return (
      <div className="wt-half is-empty">
        <span className="wt-ln" />
        <span className="wt-sign" />
        <span className="wt-code" />
      </div>
    )
  return (
    <div className="wt-half" data-kind={line.kind}>
      <span className="wt-ln">{line.oldNo ?? ''}</span>
      <span className="wt-sign">
        {line.kind === 'add' ? '+' : line.kind === 'del' ? '-' : ''}
      </span>
      <CodeCell text={line.text} ranges={ranges} mark={mark} />
    </div>
  )
}

// 左右并排：左栏是旧文件、右栏是新文件，批注跟着各自那一侧。
function Split({ hunk, notes, margin, shown, toggle }) {
  const rows = usePairs(hunk)
  const card = (item) => <NoteCard item={item} key={item.i} />
  const head = notes?.get(-1)
  return (
    <div className="wt-hunkbody is-split">
      {head?.length > 0 && (
        <div className="wt-noterow is-span" data-level={worst(head)}>
          {head.map(card)}
        </div>
      )}
      {rows.flatMap((row, index) => {
        const own = notes?.get(index)
        if (!own?.length)
          return [
            <div className="wt-srow" key={index} data-kind={row.kind}>
              <Half line={row.left} ranges={row.ranges[0]} />
              <Half line={row.right} ranges={row.ranges[1]} />
            </div>,
          ]
        const left = pick(own, 'left', !row.right),
          right = pick(own, 'right', !row.left)
        const shownList = (list) => !!list?.some((item) => shown.has(item.i))
        const toggleList = (list, next) =>
          list?.length &&
          toggle(
            list.map((item) => item.i),
            next,
          )
        const ids = own.map((item) => item.i)
        return [
          <div
            className="wt-srow"
            key={index}
            data-kind={row.kind}
            data-note={worst(own)}
          >
            <Half
              line={row.left}
              ranges={row.ranges[0]}
              mark={
                margin || !left ? undefined : (
                  <NoteMark
                    list={left}
                    open={shownList(left)}
                    onToggle={(next) => toggleList(left, next)}
                  />
                )
              }
            />
            <Half
              line={row.right}
              ranges={row.ranges[1]}
              mark={
                margin || !right ? undefined : (
                  <NoteMark
                    list={right}
                    open={shownList(right)}
                    onToggle={(next) => toggleList(right, next)}
                  />
                )
              }
            />
            {margin && <span className="wt-notecell">{own.map(card)}</span>}
          </div>,
          ...(!margin && ids.some((i) => shown.has(i))
            ? [
                <div
                  className="wt-noterow is-span"
                  data-level={worst(own)}
                  key={`${index}-notes`}
                >
                  {own.map(card)}
                </div>,
              ]
            : []),
        ]
      })}
    </div>
  )
}

const range = (start, count) => (count === 1 ? `${start}` : `${start},${count}`)

// 块头和正文用同一套栏位：上下对照时两个行号栏并排，并排时各自贴着左右两栏。
function HunkHead({ hunk, split, numbered, index }) {
  const old = `-${range(hunk.oldStart, hunk.oldCount)}`,
    neo = `+${range(hunk.newStart, hunk.newCount)}`
  const label = (
    <>
      {numbered && <b className="wt-hunkno">{index + 1}</b>}
      <code>
        @@ {old} {neo} @@
      </code>
      {hunk.heading && <span className="wt-hunkctx">{hunk.heading}</span>}
    </>
  )
  return (
    <div className={'wt-hunkhead' + (split ? ' is-split' : '')}>
      {split ? (
        <>
          <span className="wt-ln" />
          <span className="wt-sign" />
          <span className="wt-hunklabel">{label}</span>
          <span className="wt-ln" />
          <span className="wt-sign" />
          <span className="wt-hunklabel">
            <code>{neo}</code>
          </span>
        </>
      ) : (
        <>
          <span className="wt-ln" />
          <span className="wt-ln" />
          <span className="wt-sign" />
          <span className="wt-hunklabel">{label}</span>
        </>
      )}
    </div>
  )
}

function DiffBody({ text, split, byHunk, margin, shown, toggle, flash }) {
  const hunks = useMemo(() => parsePatch(text).hunks, [text])
  return (
    <div className={'wt-diff' + (split ? ' is-split' : '')}>
      {hunks.map((hunk, index) => (
        <div className="wt-hunk" key={index}>
          <HunkHead
            hunk={hunk}
            split={split}
            numbered={!!byHunk}
            index={index}
          />
          {split ? (
            <Split
              hunk={hunk}
              notes={byHunk?.get(index)}
              margin={margin}
              shown={shown}
              toggle={toggle}
            />
          ) : (
            <Unified
              hunk={hunk}
              notes={byHunk?.get(index)}
              margin={margin}
              shown={shown}
              toggle={toggle}
              flash={flash}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// 就地差异：读取一个文件某一层的补丁并渲染。
// split / wrap 是整个文件区的显示方式（左右并排、长行换行），由上层统一定；title 是粘性头部里的标题行；
// notes 是代码审查落在这个文件上的批注。
export function DiffView({
  file,
  repository,
  tree,
  split,
  wrap,
  title,
  notes,
  // 标题行最右边的小控件：这个文件的「已审阅」。
  tools,
}) {
  const choices = useMemo(() => layers(file), [file])
  const [layer, setLayer] = useState(choices.at(-1)[0])
  const [result, setResult] = useState(null)
  const [boxRef, boxWidth] = useWidth()
  const list = notes ?? EMPTY

  useEffect(() => {
    const ctl = new AbortController()
    setResult(null)
    request('patch', { id: repository, tree, file: file.id, layer }, ctl.signal)
      .then((value) => {
        if (!ctl.signal.aborted) setResult({ layer, ...value })
      })
      .catch((error) => {
        if (!ctl.signal.aborted) setResult({ layer, note: error.message })
      })
    return () => ctl.abort()
  }, [file.id, repository, tree, layer])

  const loaded = result?.layer === layer ? result : null
  const patch = useMemo(
    () => (loaded?.text ? parsePatch(loaded.text) : null),
    [loaded],
  )
  const add = file.add ?? patch?.additions,
    del = file.del ?? patch?.deletions

  // 批注安到差异的块和行上。
  const { byHunk, loose, placed } = useMemo(
    () => placeNotes(list, patch),
    [list, patch],
  )
  const margin =
    placed.length > 0 && boxWidth >= (split ? MARGIN_SPLIT_AT : MARGIN_AT)
  // 窄的时候批注卡片排在代码行下面：默认全部展开——结论是来看的，不是点开才有的。
  // 不想看的点行尾的标记收起来。宽的时候批注在右边一栏，没有收起一说。
  const [shown, setShown] = useState(() => new Set())
  useEffect(() => {
    // 要展开的批注没变就沿用原来那份，不多画一轮。
    setShown((old) => {
      const next = new Set(placed.map((item) => item.i))
      return next.size === old.size && [...next].every((i) => old.has(i))
        ? old
        : next
    })
  }, [placed])
  const toggle = (ids, next) =>
    setShown((old) => {
      const nextSet = new Set(old)
      for (const id of ids) next ? nextSet.add(id) : nextSet.delete(id)
      return nextSet
    })

  // 在批注之间跳：按差异里的先后顺序。
  const order = useMemo(() => noteRows(placed), [placed])
  const [cursor, setCursor] = useState(-1)
  const [flash, setFlash] = useState(-1)
  const jump = (step) => {
    if (!order.length) return
    const at = (cursor + step + order.length) % order.length
    const item = order[at]
    setCursor(at)
    // 窄的时候先把这个文件的批注都展开，再滚过去。
    if (!margin) toggle([item.i], true)
    setFlash(item.i)
    setTimeout(() => setFlash(-1), 1400)
    requestAnimationFrame(() =>
      boxRef.current
        ?.querySelector(`[data-note-ids~="${item.i}"]`)
        // 直接跳过去（不做平滑滚动）：批注可能隔着几千行，平滑滚过去要好几秒。
        ?.scrollIntoView({ block: 'center' }),
    )
  }

  return (
    <section
      className="wt-diffbox"
      aria-label="文件差异"
      data-margin={margin ? '' : undefined}
      ref={boxRef}
    >
      <div className="wt-diffsticky">
        {title}
        <div className="wt-difftools">
          {/* 这个文件有两层可看（暂存之后又改过）才给切换；只有一层时写明看的是哪一层。 */}
          {choices.length > 1 ? (
            <div className="wt-seg wt-seg-sm" role="tablist">
              {choices.map(([value, label]) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={layer === value}
                  onClick={() => setLayer(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <small className="wt-difflayer" title={LAYER_NOTE[choices[0][0]]}>
              {choices[0][1]}
            </small>
          )}
          <span className="wt-spacer" />
          {order.length > 0 && (
            <span
              className="wt-notejump"
              role="group"
              aria-label="在批注之间跳转"
            >
              <button
                type="button"
                className="wt-iconbtn"
                title="上一条批注"
                aria-label="上一条批注"
                onClick={() => jump(-1)}
              >
                <Icon name="left" size={14} />
              </button>
              <span>
                批注{' '}
                <b>
                  {cursor < 0 ? order.length : `${cursor + 1}/${order.length}`}
                </b>
              </span>
              <button
                type="button"
                className="wt-iconbtn"
                title="下一条批注"
                aria-label="下一条批注"
                onClick={() => jump(1)}
              >
                <Icon name="right" size={14} />
              </button>
            </span>
          )}
          {file.xy !== '??' && (
            <span
              className="wt-fstat"
              title={
                file.add != null
                  ? file.st
                    ? '相对上游的增删行数'
                    : '相对 HEAD 的增删行数'
                  : undefined
              }
            >
              <i>+{file.add ?? patch?.additions ?? '—'}</i>
              <i>−{file.del ?? patch?.deletions ?? '—'}</i>
            </span>
          )}
          {tools}
        </div>
      </div>
      {!loaded || loaded.note ? (
        <p className="wt-emptyline" role="status">
          {loaded?.note || '正在读取差异…'}
        </p>
      ) : patch?.binary ? (
        <p className="wt-emptyline">二进制文件，没有可显示的文本差异。</p>
      ) : !patch?.hunks.length ? (
        <p className="wt-emptyline">这个文件没有内容差异。</p>
      ) : (
        <div
          className="wt-diffscroll"
          data-wrap={wrap || margin ? 'true' : undefined}
        >
          <DiffBody
            text={loaded.text}
            split={split}
            byHunk={placed.length ? byHunk : null}
            margin={margin}
            shown={shown}
            toggle={toggle}
            flash={flash}
          />
        </div>
      )}
      {loose.length > 0 && (
        <div className="wt-noterow is-loose" data-level="warn">
          {loose.map((item) => (
            <NoteCard item={item} key={item.i} />
          ))}
        </div>
      )}
      {loaded?.truncated && (
        <p className="wt-emptyline">差异较长，只显示了开头部分。</p>
      )}
    </section>
  )
}
