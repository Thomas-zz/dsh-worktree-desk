import React, { useEffect, useMemo, useState } from 'react'
import { request } from './api.js'
import { parsePatch, pairRows, tokenRanges } from './diff.js'
import { Icon } from './icons.jsx'
import { prefs } from './hub.js'

// 一个文件可以查看的「层」：新文件只有正文，冲突只有工作区，其余分已暂存 / 未暂存。
export function layers(file) {
  if (file.xy === '??') return [['new', '新文件']]
  if (file.conflict) return [['work', '冲突']]
  const choices = []
  if (file.xy[0] !== '.') choices.push(['index', '已暂存'])
  if (file.xy[1] !== '.') choices.push(['work', '未暂存'])
  return choices
}

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

function Unified({ hunk }) {
  const rows = usePairs(hunk)
  return (
    <div className="wt-hunkbody">
      {rows.flatMap((row, index) => {
        if (row.kind === 'ctx')
          return [
            <div className="wt-line" data-kind="ctx" key={index}>
              <span className="wt-ln">{row.left.oldNo ?? ''}</span>
              <span className="wt-ln">{row.left.newNo ?? ''}</span>
              <span className="wt-sign"> </span>
              <Code text={row.left.text} ranges={[]} />
            </div>,
          ]
        const out = []
        if (row.left)
          out.push(
            <div className="wt-line" data-kind="del" key={`${index}-`}>
              <span className="wt-ln">{row.left.oldNo ?? ''}</span>
              <span className="wt-ln" />
              <span className="wt-sign">-</span>
              <Code text={row.left.text} ranges={row.ranges[0]} />
            </div>,
          )
        if (row.right)
          out.push(
            <div className="wt-line" data-kind="add" key={`${index}+`}>
              <span className="wt-ln" />
              <span className="wt-ln">{row.right.newNo ?? ''}</span>
              <span className="wt-sign">+</span>
              <Code text={row.right.text} ranges={row.ranges[1]} />
            </div>,
          )
        return out
      })}
    </div>
  )
}

function Half({ line, ranges }) {
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
      <Code text={line.text} ranges={ranges} />
    </div>
  )
}

function Split({ hunk }) {
  const rows = usePairs(hunk)
  return (
    <div className="wt-hunkbody is-split">
      {rows.map((row, index) => (
        <div className="wt-srow" key={index} data-kind={row.kind}>
          <Half line={row.left} ranges={row.ranges[0]} />
          <Half line={row.right} ranges={row.ranges[1]} />
        </div>
      ))}
    </div>
  )
}

const range = (start, count) => (count === 1 ? `${start}` : `${start},${count}`)

// 块头和正文用同一套栏位：上下对照时两个行号栏并排，并排时各自贴着左右两栏。
function HunkHead({ hunk, split }) {
  const old = `-${range(hunk.oldStart, hunk.oldCount)}`,
    neo = `+${range(hunk.newStart, hunk.newCount)}`
  return (
    <div className={'wt-hunkhead' + (split ? ' is-split' : '')}>
      {split ? (
        <>
          <span className="wt-ln" />
          <span className="wt-sign" />
          <span className="wt-hunklabel">
            <code>{old}</code>
            {hunk.heading && <span className="wt-hunkctx">{hunk.heading}</span>}
          </span>
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
          <span className="wt-hunklabel">
            <code>
              @@ {old} {neo} @@
            </code>
            {hunk.heading && <span className="wt-hunkctx">{hunk.heading}</span>}
          </span>
        </>
      )}
    </div>
  )
}

export function DiffBody({ text, split }) {
  const hunks = useMemo(() => parsePatch(text).hunks, [text])
  return (
    <div className={'wt-diff' + (split ? ' is-split' : '')}>
      {hunks.map((hunk, index) => (
        <div className="wt-hunk" key={index}>
          <HunkHead hunk={hunk} split={split} />
          {split ? <Split hunk={hunk} /> : <Unified hunk={hunk} />}
        </div>
      ))}
    </div>
  )
}

// 就地差异：读取一个文件某一层的补丁并渲染。
// wide 表示面板够宽，可以左右并排；title 是粘性头部里的标题行；native 能把完整差异交给 DSH 右栏。
export function DiffView({ file, repository, tree, wide, title, native }) {
  const choices = useMemo(() => layers(file), [file])
  const [layer, setLayer] = useState(choices.at(-1)[0])
  const [split, setSplit] = useState(() => wide && prefs.get('split', false))
  const [wrap, setWrap] = useState(() => prefs.get('wrap', !wide))
  const [result, setResult] = useState(null)

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
  return (
    <section className="wt-diffbox" aria-label="文件差异">
      <div className="wt-diffsticky">
        {title}
        <div className="wt-difftools">
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
          <small className="wt-diffnote">
            {layer === 'index'
              ? 'HEAD → 暂存区'
              : layer === 'work'
                ? file.conflict
                  ? '合并中的工作文件'
                  : '暂存区 → 工作目录'
                : '工作目录中的新文件'}
          </small>
          <span className="wt-spacer" />
          {file.xy !== '??' && (
            <span
              className="wt-fstat"
              title={file.add != null ? '相对 HEAD 的增删行数' : undefined}
            >
              <i>+{file.add ?? patch?.additions ?? '—'}</i>
              <i>−{file.del ?? patch?.deletions ?? '—'}</i>
            </span>
          )}
          <button
            className="wt-iconbtn"
            title={
              wide
                ? split
                  ? '切换为上下对照'
                  : '切换为左右并排'
                : '面板不够宽，无法左右并排'
            }
            aria-label={split ? '切换为上下对照' : '切换为左右并排'}
            aria-pressed={split}
            disabled={!wide}
            onClick={() => {
              // 并排后每栏只剩一半宽；长行不换行会把右栏挤出屏幕，所以切到并排时顺带换行。
              if (!split && !wrap) {
                setWrap(true)
                prefs.set('wrap', true)
              }
              setSplit(!split)
              prefs.set('split', !split)
            }}
          >
            <Icon name={split ? 'rows' : 'columns'} size={15} />
          </button>
          <button
            className="wt-iconbtn"
            title={wrap ? '取消自动换行' : '长行自动换行'}
            aria-label={wrap ? '取消自动换行' : '长行自动换行'}
            aria-pressed={wrap}
            onClick={() => {
              setWrap(!wrap)
              prefs.set('wrap', !wrap)
            }}
          >
            <Icon name="wrap" size={15} />
          </button>
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
        <div className="wt-diffscroll" data-wrap={wrap}>
          <DiffBody text={loaded.text} split={split} />
        </div>
      )}
      {loaded?.truncated && (
        <p className="wt-emptyline">
          差异较长，只显示了开头部分。
          {native && (
            <button className="wt-linkbtn" onClick={() => native(file)}>
              到 DSH 右栏看完整差异
              <Icon name="external" size={12} />
            </button>
          )}
        </p>
      )}
    </section>
  )
}
