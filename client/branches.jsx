import React, { useMemo, useState } from 'react'
import { Icon } from './icons.jsx'
import { fullTime, match, relTime } from './model.js'

// 清单末尾的「本地分支」那一段：只在看单个仓库时出现，默认收着，点开是这个仓库的全部分支。
// 上面几行工作树各检出了一个分支；这里的分支，检出了的后面有「查看工作树」，其余标着「未检出」。
// 搜索框里的词对这里也生效（所以搜分支名找得到没检出的分支）。只读：未检出不等于可以删除。
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

export function Branches({ repo, now, query, open, toggle, showTree, retry }) {
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
      <section className="wt-branchfold" data-open="" aria-label="本地分支">
        <header className="wt-grouphead wt-branchhead">
          <span className="wt-group-toggle" />
          <span className="wt-groupname">本地分支</span>
        </header>
        <p className="wt-inlineerror" role="alert">
          <Icon name="warning" size={14} />
          本地分支读取失败。
          <button className="wt-linkbtn" onClick={() => retry(repo.id)}>
            重试
          </button>
        </p>
      </section>
    )
  const needle = query.trim()
  const isChecked = (b) => checked.has(b.name)
  const hit = rows.filter(
    (b) =>
      match(needle, b.name, b.head, b.upstream, b.subject) &&
      FILTERS[filter][1](b, isChecked(b)),
  )
  const counts = Object.fromEntries(
    Object.keys(FILTERS).map((key) => [
      key,
      rows.filter((b) => FILTERS[key][1](b, isChecked(b))).length,
    ]),
  )
  // 没检出的分支：上面没有哪棵工作树在用它。
  const loose = counts.unchecked
  return (
    <section
      className="wt-branchfold"
      data-open={open || undefined}
      aria-label="本地分支"
    >
      <header className="wt-grouphead wt-branchhead">
        <button
          className="wt-group-toggle"
          aria-expanded={open}
          aria-label={
            open ? '收起本地分支' : `展开本地分支（${rows.length} 个）`
          }
          onClick={toggle}
        >
          <Icon name="chevron" size={12} className={open ? 'is-open' : ''} />
        </button>
        {/* 总数跟着名字走：清单窄的时候「N 个分支」那一格会让位，名字不会。 */}
        <span className="wt-groupname">
          本地分支 <b>{rows.length}</b>
        </span>
        {/* 一眼看出和上面工作树的关系：几个检出了、几个没有。 */}
        <span className="wt-groupsummary wt-branchsum">
          <span className="wt-count">
            <b>{rows.length - loose}</b>已检出
          </span>
          <span className="wt-count">
            <b>{loose}</b>未检出
          </span>
          {counts.unpushed > 0 && (
            <span className="wt-count" data-tone="accent">
              <b>{counts.unpushed}</b>未推送
            </span>
          )}
          {counts.merged > 0 && (
            <span className="wt-count wt-branchmerged">
              <b>{counts.merged}</b>已并入
            </span>
          )}
        </span>
      </header>
      {open && (
        <div className="wt-branchlist">
          <div className="wt-branchbar">
            <div
              className="wt-seg wt-seg-sm"
              role="tablist"
              aria-label="看哪一类本地分支"
            >
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
          <p className="wt-dtext wt-branchnote">
            {loose
              ? `上面的工作树各检出了一个分支；另外 ${loose} 个分支没有检出到任何目录，要看它的改动得先检出。`
              : '这里的分支都检出在上面几棵工作树里。'}
          </p>
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
                      <time title={fullTime(b.time)}>
                        {relTime(b.time, now)}
                      </time>
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
      )}
    </section>
  )
}
