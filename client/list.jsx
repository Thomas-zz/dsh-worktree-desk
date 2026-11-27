import React, { useEffect, useRef } from 'react'
import { Ring, Tail } from './bits.jsx'
import { Branches } from './branches.jsx'
import { Icon } from './icons.jsx'
import { menuKind } from './hub.js'
import { stampOf } from './review.js'
import { ReviewMark } from './review.jsx'
import {
  branchLabel,
  fullTime,
  markText,
  markTone,
  relTime,
  repoSummary,
  rowMarks,
  treeName,
} from './model.js'

const SHORT = { Codex: 'C', ZCode: 'Z', DSH: 'D' }
const LIVE_WINDOW = 30 * 60 * 1000

const live = (tree, name, now) =>
  tree.sessions.some(
    (x) =>
      x.source === name &&
      !x.archived &&
      (x.running || x.time > now - LIVE_WINDOW),
  )
const toolTitle = (tree, name) => {
  const sessions = tree.sessions.filter((x) => x.source === name && !x.archived)
  return sessions.length
    ? `${name}：${sessions.length} 个未归档会话，最近一次 ${relTime(sessions[0].time)}`
    : name
}
const timeTitle = (tree) =>
  tree.lastChange
    ? `最近改动：${fullTime(tree.lastChange.time)}（依据：${tree.lastChange.source}）`
    : '取不到可用的时间'
function BranchName({ tree }) {
  const [ns, rest] = branchLabel(treeName(tree))
  return (
    <span
      className="wt-name"
      data-mono={tree.detached ? '' : undefined}
      title={tree.branch || tree.head}
    >
      {ns && <span className="wt-ns">{ns}</span>}
      {rest}
    </span>
  )
}

// 行尾的「已审阅」进度：读过的文件占这个范围全部改动的多少，都读完了只剩一个对勾。
// 只在这棵工作树标过已审阅之后才出现。
function SeenMark({ value }) {
  if (!value?.total) return null
  const done = value.viewed === value.total
  return (
    <b
      data-k="seen"
      data-done={done ? '' : undefined}
      title={
        done
          ? `${value.total} 个文件都已审阅`
          : `已审阅 ${value.viewed} / ${value.total} 个文件${
              value.changed ? `，${value.changed} 个审阅后又有改动` : ''
            }`
      }
    >
      {done ? (
        <Icon name="check" size={12} />
      ) : (
        <>
          <Ring share={value.viewed / value.total} />
          {`${value.viewed}/${value.total}`}
        </>
      )}
    </b>
  )
}

// 一行工作树：状态点、名称，行尾是 AI 审查的结论、已审阅的进度和要动手的数字（未推送 ↑、落后 ↓、改动数、异常）。
// 关联工具和最近改动时间是次要信息，清单够宽才跟着出来；路径、上游、提交这些在详情里。
export function TreeRow({
  repo,
  tree,
  selected,
  focused,
  pick,
  getTriggerProps,
  renderFactorySlot,
  act,
  now,
  reviewOf,
  seenOf,
}) {
  const mark = markTone(tree)
  const usable = !tree.prunable && !tree.error
  const marks = rowMarks(tree)
  // 这棵树的 AI 审查到了哪一步（没审查过是 null）。审查过的才去算改动的指纹，判断审查之后有没有变。
  const review = reviewOf?.(repo.id, tree) ?? null
  const seen = seenOf?.(repo, tree) ?? null
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
      <span className="wt-dotcell">
        {mark && <span className="wt-dot" data-tone={mark} />}
      </span>
      <span className="wt-main">
        <BranchName tree={tree} />
        {tree.main && <small className="wt-tag wt-tag-main">主目录</small>}
        {tree.detached && <small className="wt-tag">分离</small>}
        {tree.locked && (
          <small
            className="wt-tag wt-tag-lock"
            title={tree.lockedReason || '已锁定'}
          >
            <Icon name="lock" size={11} />
            <span className="wt-vh">锁定</span>
          </small>
        )}
      </span>
      <span className="wt-side">
        {tree.tools?.length > 0 && (
          <span className="wt-tools">
            {tree.tools.map((name) => (
              <span
                key={name}
                className="wt-tool"
                data-live={live(tree, name, now) || undefined}
                title={toolTitle(tree, name)}
              >
                <i>{SHORT[name] ?? name[0]}</i>
              </span>
            ))}
          </span>
        )}
        <time className="wt-time" title={timeTitle(tree)}>
          {tree.lastChange ? relTime(tree.lastChange.time, now) : '—'}
        </time>
      </span>
      {/* 这一行能做的事：停在上面、选中或键盘走到时才出来，平时不占地方。 */}
      <span className="wt-acts">
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
            <Icon name="chat" size={14} />
          </button>
        )}
        {renderFactorySlot?.('contextMenu.button', {
          target,
          label: '更多操作',
          className: 'wt-menu-btn',
        })}
      </span>
      <span className="wt-marks">
        {review && (
          <ReviewMark
            state={review}
            now={now}
            stamp={stampOf(tree, review?.entry?.scope)}
          />
        )}
        {marks.map(({ key, count }) => (
          <b key={key} data-k={key} title={markText(tree, key)}>
            {(key === 'ahead' || key === 'behind') && (
              <Icon
                name={key === 'ahead' ? 'arrowUp' : 'arrowDown'}
                size={11}
              />
            )}
            {key === 'trouble' && <Icon name="warning" size={12} />}
            {/* 改动数写成 ±N：和 ↑↓ 的提交数区分开。 */}
            {key === 'dirty' && `±${count}`}
            {key === 'ahead' || key === 'behind'
              ? count
              : key === 'stale'
                ? '失效'
                : key === 'unknown'
                  ? '—'
                  : ''}
          </b>
        ))}
        {seen && <SeenMark value={seen} />}
      </span>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="wt-skeleton" aria-hidden="true">
      {[64, 42, 56, 34, 50].map((width) => (
        <span key={width} style={{ width: `${width}%` }} />
      ))}
    </div>
  )
}

function summaryParts(trees) {
  // 还没读到状态时不下结论（空数组会被算成「全部干净」）。
  if (!trees) return null
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

function GroupHead({ repo, branches, collapsed, toggleGroup, showBranches }) {
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
      <span className="wt-groupcount">{repo.count} 棵工作树</span>
      <span className="wt-groupsummary">{summaryParts(repo.trees)}</span>
      <span className="wt-spacer" />
      <button
        className="wt-branchlink"
        title="只看这个仓库，并展开它的本地分支"
        onClick={showBranches}
      >
        分支 <b>{branches ?? '…'}</b>
      </button>
    </header>
  )
}

// 一个仓库在清单里的样子：分组头（仓库名）+ 它下面的工作树 + 折起来的失效登记。
// 还没有可画的数据（第一次读取中、读取失败）时只画分组头和占位；后台重读时照旧画着上次的数据。
function RepoGroup({
  entry,
  showHead,
  staleShown,
  collapsed,
  selected,
  cursor,
  pick,
  getTriggerProps,
  renderFactorySlot,
  act,
  now,
  toggleGroup,
  toggleStale,
  showBranches,
  requestPrune,
  retry,
  reviewOf,
  seenOf,
}) {
  const { repo } = entry
  const head =
    showHead &&
    GroupHead({
      repo,
      branches: repo.data?.branches?.length,
      collapsed,
      toggleGroup,
      showBranches: () => showBranches?.(repo.id),
    })
  if (!repo.data)
    return (
      <section
        className="wt-group"
        aria-busy={repo.state !== 'error'}
        data-repo={repo.id}
      >
        {head}
        {repo.state === 'error' ? (
          <p className="wt-inlineerror" role="alert">
            <Icon name="warning" size={14} />
            {repo.error}
            <button onClick={() => retry(repo.id)}>重试</button>
          </p>
        ) : (
          <Skeleton />
        )}
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
      getTriggerProps={getTriggerProps}
      renderFactorySlot={renderFactorySlot}
      act={act}
      now={now}
      reviewOf={reviewOf}
      seenOf={seenOf}
    />
  )
  return (
    <section
      className="wt-group"
      aria-busy={repo.state === 'loading'}
      data-repo={repo.id}
    >
      {head}
      {!(showHead && collapsed) && (
        <>
          {entry.live.map(rows)}
          {repo.error && (
            <p className="wt-inlineerror" role="status">
              <Icon name="warning" size={14} />
              这次没读到新的状态，先显示 {relTime(repo.data.time, now)}
              的结果。
              <button onClick={() => retry(repo.id)}>重试</button>
            </p>
          )}
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
  goAll,
  setSort,
  setQuietOpen,
  toggleStale,
  toggleGroup,
  requestPrune,
  retry,
  reviewOf,
  seenOf,
  clearFilters,
  getTriggerProps,
  renderFactorySlot,
  act,
  scrollRef,
  catalogEmpty,
  // 并排布局里：收起清单，把地方让给详情。仓库栏被用户收起后：在这里给个入口把它展开。
  onCollapse,
  onExpandRail,
  // 只看一个仓库时，清单末尾的「本地分支」那一段（见 branches.jsx）。
  //   open     展没展开；toggle 切换；show(repoId) 跳到某个仓库的这一段（展开并滚过去）
  //   forced   搜索时一律展开：命中的分支不能藏在收起来的那一段里
  //   jump     每加一次就展开并滚到这一段；query 是上面的搜索词，这里一并筛分支
  branches,
  query,
  showTree,
}) {
  const repo = repos.find((r) => r.id === scope)
  const foldRef = useRef(null)
  // 从别处跳进来看分支时滚到这一段。换仓库时上层会先把清单滚回顶上，所以等这一轮的副作用都跑完再滚；
  // 这个仓库的状态还没读到时这一段还没画出来，读到以后再滚。
  const jumped = useRef(branches?.jump ?? 0)
  useEffect(() => {
    const jump = branches?.jump ?? 0
    if (jumped.current === jump || !foldRef.current) return
    jumped.current = jump
    const timer = setTimeout(() => {
      const list = scrollRef.current
      const fold = foldRef.current
      if (!list || !fold) return
      const box = fold.getBoundingClientRect()
      const top = list.getBoundingClientRect().top
      const head = box.top - top
      // 这一段的标题已经在清单里看得见（工作树不多的时候就是这样）：不动，
      // 免得为了多露出一点把上面一行工作树卷到清单头底下。
      if (head >= 40 && head + 34 <= list.clientHeight) return
      // 让开清单头（40px），这一段的标题正好露在它下面。
      list.scrollTop += head - 40
    }, 0)
    return () => clearTimeout(timer)
  }, [branches?.jump, repo?.data?.branches, scrollRef])
  const foldOpen = !!(branches && (branches.open || branches.forced))
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
      getTriggerProps={getTriggerProps}
      renderFactorySlot={renderFactorySlot}
      act={act}
      now={now}
      toggleGroup={toggleGroup}
      toggleStale={toggleStale}
      showBranches={branches?.show}
      requestPrune={requestPrune}
      retry={retry}
      reviewOf={reviewOf}
      seenOf={seenOf}
    />
  )
  const loading = progress.total > progress.done
  const empty = !groups.length && !quiet.length && !loading
  return (
    <section className="wt-list" aria-label="工作树清单" ref={scrollRef}>
      <div className="wt-listhead" data-scope={scope === 'all' ? 'all' : 'one'}>
        {onExpandRail && (
          <button
            className="wt-iconbtn"
            title="展开仓库栏"
            aria-label="展开仓库栏"
            onClick={onExpandRail}
          >
            <Icon name="expand" size={15} />
          </button>
        )}
        {scope === 'all' ? (
          <span className="wt-listtitle">
            全部仓库
            <b>{total.trees}</b>
            <span className="wt-listunit">棵工作树</span>
            <span className="wt-listsub">
              {groups.length + quiet.length} 个仓库
            </span>
          </span>
        ) : (
          <>
            <button className="wt-back" onClick={goAll} title="回到全部仓库">
              <Icon name="back" size={15} />
            </button>
            {/* 这个仓库的工作树在下面；它的全部分支在清单末尾那一段，点这里展开并滚过去。 */}
            <span className="wt-listtitle">
              工作树
              <b>{repo?.count ?? 0}</b>
            </span>
            <button
              className="wt-branchlink"
              aria-expanded={foldOpen}
              title="这个仓库的全部分支（在清单末尾）：点一下展开并滚过去"
              onClick={branches?.show && (() => branches.show(scope))}
            >
              本地分支 <b>{repo?.data?.branches?.length ?? '…'}</b>
            </button>
            <Tail
              className="wt-listpath"
              title={repo?.path}
              text={repo?.path}
            />
          </>
        )}
        <span className="wt-spacer" />
        <label className="wt-sort">
          <span>排序</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="attention">需要关注优先</option>
            <option value="recent">最近改动</option>
          </select>
        </label>
        {onCollapse && (
          <button
            className="wt-iconbtn"
            title="收起工作树清单，把地方让给详情"
            aria-label="收起工作树清单"
            aria-expanded="true"
            onClick={onCollapse}
          >
            <Icon name="collapse" size={15} />
          </button>
        )}
        {/* 进度条贴在清单头下沿：后台重读时内容已经画着，不能让它们上下跳 */}
        {loading && (
          <span
            className="wt-progress"
            role="status"
            style={{
              '--p': `${(progress.done / progress.total) * 100}%`,
            }}
          >
            <span className="wt-vh">
              正在读取仓库状态 {progress.done}/{progress.total}
            </span>
          </span>
        )}
      </div>
      {filtered && (
        <button className="wt-filternote" onClick={clearFilters}>
          <Icon name="filter" size={12} />
          已按条件筛选，清除筛选
        </button>
      )}
      <div
        className="wt-rows"
        role="listbox"
        aria-label="工作树"
        data-flat={scope !== 'all' ? '' : undefined}
      >
        {groups.map((entry) => render(entry, scope === 'all'))}
        {scope !== 'all' && (
          <div role="presentation" ref={foldRef}>
            <Branches
              repo={repo}
              now={now}
              query={query ?? ''}
              open={foldOpen}
              toggle={branches?.toggle}
              showTree={showTree}
              retry={retry}
            />
          </div>
        )}
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
    </section>
  )
}
