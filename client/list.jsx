import React from 'react'
import { Icon } from './icons.jsx'
import { Tail } from './bits.jsx'
import { menuKind } from './hub.js'
import {
  fullTime,
  relTime,
  repoSummary,
  signal,
  staleReason,
  ticketOf,
  treeName,
} from './model.js'

const SHORT = { Codex: 'C', ZCode: 'Z', DSH: 'D' }
const LIVE_WINDOW = 30 * 60 * 1000

const upLabel = (t) => {
  const s = t.status
  if (!s || t.detached) return '—'
  if (!s.upstream) return '未设上游'
  if (s.ahead === null) return '无法比较'
  return (
    [s.ahead && `↑${s.ahead}`, s.behind && `↓${s.behind}`]
      .filter(Boolean)
      .join(' ') || '已同步'
  )
}
// 未推送才是需要动手的事；未设上游很常见，不着色。
const upTone = (t) => {
  const s = t.status
  if (s?.ahead > 0) return 'accent'
  if (s?.upstream && s.behind > 0) return 'warn'
  return 'muted'
}
const stateTitle = (tree, sig) => {
  const s = tree.status
  if (tree.prunable)
    return staleReason(tree) || 'Git 仍保留该工作树登记，但目录已不存在'
  if (!s) return sig.label
  return `已暂存 ${s.staged} · 未暂存 ${s.unstaged} · 未跟踪 ${s.untracked} · 冲突 ${s.conflicts}`
}
const toolTitle = (tree, name) => {
  const sessions = tree.sessions.filter((x) => x.source === name && !x.archived)
  return sessions.length
    ? `${name}：${sessions.length} 个未归档会话，最近一次 ${relTime(sessions[0].time)}`
    : name
}
const timeTitle = (tree) =>
  tree.lastChange
    ? `${fullTime(tree.lastChange.time)}（依据：${tree.lastChange.source}）`
    : '取不到可用的时间'

export function TreeRow({
  repo,
  tree,
  selected,
  focused,
  pick,
  onTicket,
  getTriggerProps,
  renderFactorySlot,
  act,
  now,
}) {
  const sig = signal(tree)
  const ticket = ticketOf(tree.branch)
  const usable = !tree.prunable && !tree.error
  const target = { kind: menuKind, value: { repo: repo.id, path: tree.path } }
  return (
    <div
      {...getTriggerProps(target, { tabIndex: -1 })}
      className={
        'wt-row' +
        (selected ? ' is-selected' : '') +
        (focused ? ' is-cursor' : '') +
        (tree.prunable ? ' is-stale' : '')
      }
      role="option"
      aria-selected={selected}
      data-path={tree.path}
      onClick={() => pick(repo.id, tree)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          pick(repo.id, tree)
        }
      }}
    >
      <span className="wt-dot" data-tone={sig.tone} title={sig.label} />
      <span className="wt-main">
        <span className="wt-name" data-mono={tree.detached ? '' : undefined}>
          {treeName(tree)}
        </span>
        {tree.main && <small className="wt-tag wt-tag-main">主目录</small>}
        {tree.locked && (
          <small className="wt-tag" title={tree.lockedReason || '已锁定'}>
            <Icon name="lock" size={11} />
            锁定
          </small>
        )}
        {tree.detached && <small className="wt-tag">分离</small>}
      </span>
      {ticket && (
        <button
          className="wt-ticket"
          style={{ '--ticket': ticket.color }}
          title={`只看 ${ticket.key} 相关的工作树`}
          onClick={(event) => {
            event.stopPropagation()
            onTicket(ticket.key)
          }}
        >
          {ticket.key}
        </button>
      )}
      {/* 宽屏时这层只是透明的格栅容器；窄屏时它变成第二行 */}
      <span className="wt-meta">
        <span
          className="wt-state"
          data-tone={sig.tone}
          title={stateTitle(tree, sig)}
        >
          {sig.label}
        </span>
        <span
          className="wt-up"
          data-tone={upTone(tree)}
          title={
            tree.status?.upstream
              ? `跟踪上游 ${tree.status.upstream}（按本地记录，不联网更新）`
              : '没有配置默认对比分支；不代表没有推送'
          }
        >
          {upLabel(tree)}
        </span>
        <time className="wt-time" title={timeTitle(tree)}>
          {tree.lastChange ? relTime(tree.lastChange.time, now) : '—'}
        </time>
      </span>
      <span className="wt-tools">
        {(tree.tools ?? []).map((name) => (
          <span
            key={name}
            className="wt-tool"
            data-live={tree.sessions.some(
              (x) =>
                x.source === name &&
                !x.archived &&
                (x.running || x.time > now - LIVE_WINDOW),
            )}
            title={toolTitle(tree, name)}
          >
            <i>{SHORT[name] ?? name[0]}</i>
            <em>{name}</em>
          </span>
        ))}
      </span>
      {usable && act.dsh && (
        <button
          className="wt-go"
          title="在 DSH 新开会话"
          aria-label="在 DSH 新开会话"
          onClick={(event) => {
            event.stopPropagation()
            act.newDsh(tree)
          }}
        >
          <Icon name="chat" size={15} />
        </button>
      )}
      {renderFactorySlot?.('contextMenu.button', {
        target,
        label: '更多操作',
        className: 'wt-menu-btn',
      })}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="wt-skeleton" aria-hidden="true">
      {[72, 46, 60, 38].map((width) => (
        <span key={width} style={{ width: `${width}%` }} />
      ))}
    </div>
  )
}

function summaryParts(trees) {
  const counts = repoSummary(trees)
  const parts = [
    ['dirty', '有改动', 'warn'],
    ['unpushed', '未推送', 'accent'],
    ['behind', '落后', 'muted'],
    ['trouble', '异常', 'danger'],
    ['stale', '失效', 'stale'],
  ].filter(([key]) => counts[key])
  if (!parts.length) return <span className="wt-count">全部干净</span>
  return parts.map(([key, label, tone]) => (
    <span key={key} className="wt-count" data-tone={tone}>
      <b>{counts[key]}</b>
      {label}
    </span>
  ))
}

function GroupHead({ repo, branches, collapsed, toggleGroup, openBranches }) {
  return (
    <header className="wt-grouphead">
      <button
        className="wt-group-toggle"
        aria-expanded={!collapsed}
        aria-label={collapsed ? `展开 ${repo.name}` : `收起 ${repo.name}`}
        onClick={() => toggleGroup(repo.id)}
      >
        <Icon name="chevron" size={12} className={collapsed ? '' : 'is-open'} />
      </button>
      <span className="wt-groupname" title={repo.path}>
        {repo.name}
      </span>
      <span className="wt-groupcount">{repo.count} 棵</span>
      <span className="wt-groupsummary">{summaryParts(repo.trees ?? [])}</span>
      <span className="wt-spacer" />
      <button
        className="wt-linkbtn"
        title="查看本地分支"
        onClick={openBranches}
      >
        分支 <b>{branches ?? '…'}</b>
      </button>
    </header>
  )
}

// 一个仓库在清单里的样子：分组头 + 在用的工作树 + 折起来的失效登记。
// 非就绪（读取中、读取失败）时只画分组头和占位。
function RepoGroup({
  entry,
  showHead,
  staleShown,
  collapsed,
  selected,
  cursor,
  pick,
  onTicket,
  getTriggerProps,
  renderFactorySlot,
  act,
  now,
  toggleGroup,
  toggleStale,
  openBranches,
  requestPrune,
  retry,
}) {
  const { repo } = entry
  const head =
    showHead &&
    GroupHead({
      repo,
      branches: repo.data?.branches?.length,
      collapsed,
      toggleGroup,
      openBranches: () => openBranches(repo.id),
    })
  if (repo.state === 'loading')
    return (
      <section className="wt-group" aria-busy="true" data-repo={repo.id}>
        {head}
        <Skeleton />
      </section>
    )
  if (repo.state === 'error')
    return (
      <section className="wt-group" data-repo={repo.id}>
        {head}
        <p className="wt-inlineerror" role="alert">
          <Icon name="warning" size={14} />
          {repo.error}
          <button onClick={() => retry(repo.id)}>重试</button>
        </p>
      </section>
    )
  const rows = (tree) => (
    <TreeRow
      key={tree.path}
      repo={repo}
      tree={tree}
      selected={selected?.repo === repo.id && selected.path === tree.path}
      focused={cursor === tree.path}
      pick={pick}
      onTicket={onTicket}
      getTriggerProps={getTriggerProps}
      renderFactorySlot={renderFactorySlot}
      act={act}
      now={now}
    />
  )
  return (
    <section className="wt-group" data-repo={repo.id}>
      {head}
      {!(showHead && collapsed) && (
        <>
          {entry.live.map(rows)}
          {entry.stale.length > 0 &&
            (staleShown ? (
              <>
                {entry.stale.map(rows)}
                <div className="wt-stalebar">
                  <button
                    className="wt-linkbtn"
                    onClick={() => toggleStale(repo.id)}
                  >
                    收起
                  </button>
                  <button
                    className="wt-linkbtn is-danger"
                    onClick={() => requestPrune(repo.id)}
                  >
                    <Icon name="broom" size={13} />
                    清理 {entry.stale.length} 条失效登记
                  </button>
                </div>
              </>
            ) : (
              <button className="wt-fold" onClick={() => toggleStale(repo.id)}>
                <Icon name="warning" size={13} />
                <b>{entry.stale.length} 棵登记已失效</b>
                <span>目录已不存在</span>
                <Icon name="chevron" size={12} className="wt-fold-chevron" />
              </button>
            ))}
          {!entry.live.length && !entry.stale.length && (
            <p className="wt-emptyline">没有符合当前筛选的工作树。</p>
          )}
        </>
      )}
    </section>
  )
}

export function WorkList({
  scope,
  view,
  repos,
  groups,
  quiet,
  quietOpen,
  staleOpen,
  filterStale,
  collapsed,
  selected,
  cursor,
  sort,
  progress,
  total,
  filtered,
  now,
  pick,
  onTicket,
  goAll,
  setSort,
  setView,
  setQuietOpen,
  toggleStale,
  toggleGroup,
  openBranches,
  requestPrune,
  retry,
  clearFilters,
  getTriggerProps,
  renderFactorySlot,
  act,
  scrollRef,
  catalogEmpty,
  children,
}) {
  const repo = repos.find((r) => r.id === scope)
  const render = (entry, showHead) => (
    <RepoGroup
      key={entry.repo.id}
      entry={entry}
      showHead={showHead}
      staleShown={filterStale || staleOpen.has(entry.repo.id)}
      collapsed={collapsed.has(entry.repo.id)}
      selected={selected}
      cursor={cursor}
      pick={pick}
      onTicket={onTicket}
      getTriggerProps={getTriggerProps}
      renderFactorySlot={renderFactorySlot}
      act={act}
      now={now}
      toggleGroup={toggleGroup}
      toggleStale={toggleStale}
      openBranches={openBranches}
      requestPrune={requestPrune}
      retry={retry}
    />
  )
  const loading = progress.total > progress.done
  const empty = !groups.length && !quiet.length && !loading
  return (
    <section className="wt-list" aria-label="工作树清单" ref={scrollRef}>
      <div className="wt-listhead">
        {scope === 'all' ? (
          <span className="wt-listtitle">
            全部仓库
            <b>{total.trees}</b>棵工作树
            <span className="wt-listsub">
              {groups.length + quiet.length} 个仓库
            </span>
          </span>
        ) : (
          <>
            <button className="wt-back" onClick={goAll} title="回到全部仓库">
              <Icon name="back" size={15} />
            </button>
            <div className="wt-seg" role="tablist">
              <button
                role="tab"
                aria-selected={view === 'trees'}
                onClick={() => setView('trees')}
              >
                工作树 <b>{repo?.count ?? 0}</b>
              </button>
              <button
                role="tab"
                aria-selected={view === 'branches'}
                onClick={() => setView('branches')}
              >
                本地分支 <b>{repo?.data?.branches?.length ?? '…'}</b>
              </button>
            </div>
            <Tail
              className="wt-listpath"
              title={repo?.path}
              text={repo?.path}
            />
          </>
        )}
        <span className="wt-spacer" />
        {view === 'trees' && (
          <label className="wt-sort">
            <span>排序</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="attention">需要关注优先</option>
              <option value="recent">最近改动</option>
            </select>
          </label>
        )}
      </div>
      {loading && (
        <div className="wt-progress" role="status">
          <span>
            正在读取仓库状态 {progress.done}/{progress.total}
          </span>
          <i style={{ '--p': `${(progress.done / progress.total) * 100}%` }} />
        </div>
      )}
      {filtered && view === 'trees' && (
        <button className="wt-filternote" onClick={clearFilters}>
          <Icon name="filter" size={12} />
          已按条件筛选，清除筛选
        </button>
      )}
      {view === 'branches' && scope !== 'all' ? (
        children
      ) : (
        <div className="wt-rows" role="listbox" aria-label="工作树">
          {groups.map((entry) => render(entry, scope === 'all'))}
          {quiet.length > 0 &&
            (quietOpen ? (
              <>
                {quiet.map((entry) => render(entry, true))}
                <button className="wt-fold" onClick={() => setQuietOpen(false)}>
                  收起这些仓库
                </button>
              </>
            ) : (
              <button
                className="wt-fold wt-fold-quiet"
                onClick={() => setQuietOpen(true)}
              >
                <b>其余 {quiet.length} 个仓库</b>
                <span>只有主检出，没有改动，也没有会话</span>
                <Icon name="chevron" size={12} className="wt-fold-chevron" />
              </button>
            ))}
          {loading && !groups.length && !quiet.length && <Skeleton />}
          {empty && (
            <p className="wt-emptyline">
              {repos.length
                ? '没有符合条件的工作树。'
                : catalogEmpty
                  ? '没有发现本机仓库。可以在插件配置的 projects 中指定项目目录。'
                  : '正在读取本机仓库…'}
              {filtered && (
                <button className="wt-linkbtn" onClick={clearFilters}>
                  清除筛选
                </button>
              )}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
