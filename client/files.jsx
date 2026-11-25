import React, { useMemo, useState } from 'react'
import { Icon } from './icons.jsx'
import { fileBadge, groupFiles, match } from './model.js'

// 文件改动清单：按目录归并，点文件就地看差异。
// inline 为真时差异展开在文件行下方（宽屏）；否则只通知上层，由上层整页显示（窄屏）。
const FILE_FILTERS = {
  all: '全部',
  unstaged: '未暂存',
  staged: '已暂存',
  untracked: '未跟踪',
}
const test = {
  unstaged: (badge) => badge.unstaged,
  staged: (badge) => badge.staged,
  untracked: (_badge, file) => file.xy === '??',
}
const base = (p) => p.slice(p.lastIndexOf('/') + 1)

function sum(node) {
  let add = 0,
    del = 0,
    known = false
  for (const file of node.files)
    if (file.add != null) {
      add += file.add
      del += file.del
      known = true
    }
  for (const child of node.dirs) {
    const totals = sum(child)
    add += totals.add
    del += totals.del
    known ||= totals.known
  }
  return { add, del, known }
}

function Stats({ file }) {
  if (file.xy === '??')
    return (
      <span className="wt-fstat">
        {file.lines != null ? <i>+{file.lines}</i> : <i>新文件</i>}
      </span>
    )
  if (file.add == null) return <span className="wt-fstat" />
  return (
    <span className="wt-fstat">
      <i>+{file.add}</i>
      <i>−{file.del}</i>
    </span>
  )
}

function Node({
  node,
  prefix,
  depth,
  badges,
  isOpen,
  toggle,
  open,
  onOpen,
  inline,
  renderDiff,
}) {
  const fileRow = (file) => {
    const badge = badges.get(file.path)
    const active = open?.id === file.id
    // 宽屏就地展开时，差异自己的标题行（可粘住）顶替这一行，不再重复一遍路径。
    if (active && inline)
      return (
        <div
          className="wt-filewrap"
          key={file.path}
          style={{ '--depth': depth }}
        >
          {renderDiff(file, badge)}
        </div>
      )
    return (
      <div className="wt-filewrap" key={file.path} style={{ '--depth': depth }}>
        <button
          className="wt-file"
          aria-expanded={false}
          title={`${file.path} · ${badge.detail}`}
          onClick={() => onOpen(file)}
        >
          <span className="wt-badge" data-tone={badge.tone}>
            {badge.code}
          </span>
          <span className="wt-fname">
            {depth ? base(file.path) : file.path}
            {file.from && <small> ← {base(file.from)}</small>}
          </span>
          <span className="wt-fchange">{badge.text}</span>
          <Stats file={file} />
          <Icon
            name="chevron"
            size={12}
            className={'wt-file-chevron' + (inline ? '' : ' is-away')}
          />
        </button>
      </div>
    )
  }
  return (
    <>
      {node.dirs.map((dir) => {
        const key = prefix + dir.name
        const expanded = isOpen(key)
        const totals = sum(dir)
        return (
          <div className="wt-dirwrap" key={key}>
            <button
              className="wt-dir"
              style={{ '--depth': depth }}
              aria-expanded={expanded}
              onClick={() => toggle(key)}
            >
              <Icon
                name="chevron"
                size={12}
                className={expanded ? 'is-open' : ''}
              />
              <span className="wt-dirname">{dir.name}</span>
              <span className="wt-dircount">{dir.count}</span>
              {totals.known && (
                <span className="wt-fstat">
                  <i>+{totals.add}</i>
                  <i>−{totals.del}</i>
                </span>
              )}
            </button>
            {expanded && (
              <Node
                node={dir}
                prefix={key}
                depth={depth + 1}
                badges={badges}
                isOpen={isOpen}
                toggle={toggle}
                open={open}
                onOpen={onOpen}
                inline={inline}
                renderDiff={renderDiff}
              />
            )}
          </div>
        )
      })}
      {node.files.map(fileRow)}
    </>
  )
}

export function FileList({ tree, open, onOpen, inline, renderDiff }) {
  const s = tree.status
  const badges = useMemo(
    () => new Map(s.files.map((file) => [file.path, fileBadge(file)])),
    [s],
  )
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  // 改动不多时默认全部展开：一眼看到改了什么；文件很多时先收起，保持可扫。
  const [dirs, setDirs] = useState(() => ({
    all: s.files.length <= 40,
    off: new Set(),
    on: new Set(),
  }))
  const files = s.files.filter((file) => {
    const badge = badges.get(file.path)
    if (test[filter] && !test[filter](badge, file)) return false
    return match(query, file.path, file.from)
  })
  const root = useMemo(() => groupFiles(files), [files])
  // 筛选或搜索时命中项散在各个目录里，目录跟着展开，否则会「筛出了结果却看不见」。
  const searching = filter !== 'all' || query.trim() !== ''
  const isOpen = (key) =>
    dirs.off.has(key) ? false : dirs.on.has(key) ? true : searching || dirs.all
  const toggle = (key) =>
    setDirs((state) => {
      const on = new Set(state.on),
        off = new Set(state.off)
      if (isOpen(key)) {
        on.delete(key)
        off.add(key)
      } else {
        off.delete(key)
        on.add(key)
      }
      return { ...state, on, off }
    })
  const counts = {
    unstaged: s.unstaged,
    staged: s.staged,
    untracked: s.untracked,
  }
  return (
    <div className="wt-filelist">
      <div className="wt-filebar">
        <div className="wt-seg wt-seg-sm" role="tablist">
          {Object.entries(FILE_FILTERS).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              onClick={() => setFilter(key)}
            >
              {label}
              {key !== 'all' && counts[key] > 0 && <b>{counts[key]}</b>}
            </button>
          ))}
        </div>
        <label className="wt-minisearch">
          <Icon name="search" size={13} />
          <input
            aria-label="筛选文件"
            placeholder="筛选文件"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        {root.dirs.length > 0 && !searching && (
          <button
            className="wt-linkbtn"
            onClick={() =>
              setDirs((state) => ({
                ...state,
                all: !state.all,
                on: new Set(),
                off: new Set(),
              }))
            }
          >
            {dirs.all ? '全部收起' : '全部展开'}
          </button>
        )}
      </div>
      {files.length ? (
        <div className="wt-files">
          <Node
            node={root}
            prefix=""
            depth={0}
            badges={badges}
            isOpen={isOpen}
            toggle={toggle}
            open={open}
            onOpen={onOpen}
            inline={inline}
            renderDiff={renderDiff}
          />
        </div>
      ) : (
        <p className="wt-emptyline">没有符合筛选条件的文件。</p>
      )}
      {s.total > s.files.length && (
        <p className="wt-emptyline">
          只列出前 {s.files.length} 项，共 {s.total} 项。
        </p>
      )}
    </div>
  )
}
