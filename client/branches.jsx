import React, { useMemo, useState } from 'react'
import { Icon } from './icons.jsx'
import { fullTime, match, relTime } from './model.js'

// 本地分支清单。只读：未检出不等于可以删除。
const FILTERS = {
  all: ['全部', () => true],
  unchecked: ['未检出', (_b, checked) => !checked],
  unpushed: ['有未推送', (b) => b.ahead > 0],
  merged: ['已并入', (b) => b.merged],
}

const upText = (b) => {
  if (!b.upstream) return '未设上游'
  if (b.gone) return '上游引用已不存在'
  return (
    [b.ahead && `↑${b.ahead}`, b.behind && `↓${b.behind}`]
      .filter(Boolean)
      .join(' ') || '与上游同步'
  )
}
// 落后需要动手（更新分支），未推送提示有工作没交；两者都没有就不着色。
const upTone = (b) =>
  b.behind > 0 ? 'warn' : b.ahead > 0 ? 'accent' : b.gone ? 'stale' : 'muted'

export function Branches({ repo, now, showTree, retry }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [limit, setLimit] = useState(80)
  const rows = repo.data?.branches
  const mergedInto = repo.data?.mergedInto?.replace(/^origin\//, '')
  // 同一分支只能检出在一棵工作树里，裸仓库除外。
  const checked = useMemo(() => {
    const map = new Set()
    for (const tree of repo.data?.trees ?? [])
      if (tree.branch && !tree.bare) map.add(tree.branch)
    return map
  }, [repo.data])
  if (!rows)
    return (
      <div className="wt-branchlist">
        <p className="wt-inlineerror" role="alert">
          <Icon name="warning" size={14} />
          本地分支读取失败。
          <button className="wt-linkbtn" onClick={() => retry(repo.id)}>
            重试
          </button>
        </p>
      </div>
    )
  const needle = query.trim()
  const hit = rows.filter(
    (b) =>
      match(needle, b.name, b.head, b.upstream) &&
      FILTERS[filter][1](b, checked.has(b.name)),
  )
  const counts = Object.fromEntries(
    Object.keys(FILTERS).map((key) => [
      key,
      rows.filter((b) => FILTERS[key][1](b, checked.has(b.name))).length,
    ]),
  )
  return (
    <div className="wt-branchlist">
      <div className="wt-branchbar">
        <label className="wt-minisearch wt-branchsearch">
          <Icon name="search" size={13} />
          <input
            aria-label="筛选本地分支"
            placeholder="筛选分支、上游或提交"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setLimit(80)
            }}
          />
          {query && (
            <button
              className="wt-iconbtn"
              aria-label="清除"
              onClick={() => setQuery('')}
            >
              <Icon name="close" size={12} />
            </button>
          )}
        </label>
        <div className="wt-seg wt-seg-sm" role="tablist">
          {Object.entries(FILTERS).map(([key, [label]]) => (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              onClick={() => {
                setFilter(key)
                setLimit(80)
              }}
            >
              {label}
              <b>{counts[key]}</b>
            </button>
          ))}
        </div>
      </div>
      {!hit.length ? (
        <p className="wt-emptyline">没有匹配的本地分支。</p>
      ) : (
        <ul className="wt-branches">
          {hit.slice(0, limit).map((b) => {
            const trees = (repo.data.trees ?? []).filter(
              (t) => t.branch === b.name && !t.bare,
            )
            return (
              <li className="wt-branch" key={b.name}>
                <div className="wt-branchtop">
                  <span className="wt-bname" title={b.name}>
                    {b.name}
                  </span>
                  {b.merged && (
                    <small
                      className="wt-tag"
                      title={`已完整并入 ${mergedInto}（按本地记录）`}
                    >
                      已并入
                    </small>
                  )}
                  <span className="wt-spacer" />
                  {trees.length ? (
                    trees.map((t) => (
                      <button
                        key={t.path}
                        className="wt-linkbtn"
                        title={t.path}
                        onClick={() => showTree(t.path)}
                      >
                        {t.main ? '主目录' : '查看工作树'}
                        <Icon name="external" size={12} />
                      </button>
                    ))
                  ) : (
                    <small className="wt-tag is-muted">未检出</small>
                  )}
                </div>
                <p className="wt-branchsub">
                  <span
                    className="wt-bup"
                    data-tone={upTone(b)}
                    title={
                      b.upstream
                        ? `跟踪上游 ${b.upstream}（按本地记录，不联网更新）`
                        : '没有设置跟踪上游；不代表没有推送'
                    }
                  >
                    {upText(b)}
                    {b.upstream && <em>{b.upstream}</em>}
                  </span>
                  <code title={b.head}>{b.head}</code>
                  <time title={fullTime(b.time)}>{relTime(b.time, now)}</time>
                  <span title={b.subject}>{b.subject}</span>
                </p>
              </li>
            )
          })}
        </ul>
      )}
      {hit.length > limit && (
        <button className="wt-more" onClick={() => setLimit(limit + 80)}>
          继续显示（还有 {hit.length - limit} 个）
        </button>
      )}
      <p className="wt-dtext">
        「已并入」按本地记录判断，相对 <code>{mergedInto ?? '主分支'}</code>
        ；未检出不等于可以删除。
      </p>
    </div>
  )
}
