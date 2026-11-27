import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Icon } from './icons.jsx'
import { CopyButton, Tail } from './bits.jsx'
import { FileArea } from './files.jsx'
import { menuKind } from './hub.js'
import { changedSince, ReviewBar, ReviewNotes, reviews } from './review.jsx'
import { copyText, groupNotes, stampOf } from './review.js'
import { shrinkReport } from '../src/report.js'
import { digestOf, viewed, viewedStateOf } from './viewed.js'
import { viewState } from './viewstate.js'
import {
  FILE_TABS,
  SCOPES,
  defaultScope,
  fullTime,
  homeTilde,
  markTone,
  relTime,
  scopeFiles,
  scopeTotal,
  signal,
  staleReason,
  ticketOf,
  treeName,
} from './model.js'

const SHORT = { Codex: 'C', ZCode: 'Z', DSH: 'D' }

// 「分支起点」：只陈述本地引用日志里实际记下的内容，不推测父分支。
function originText(t) {
  const origin = t.origin
  if (!origin) return '无创建记录'
  if (origin.kind === 'initial') return '仓库的首次提交'
  if (!origin.ref) return '某次提交（分支名未记录）'
  const hash = /^[0-9a-f]{7,64}$/i.test(origin.ref)
  if (origin.kind === 'copy') return `复制自 ${origin.ref}`
  if (hash && origin.sha.toLowerCase().startsWith(origin.ref.toLowerCase()))
    return '某次提交（分支名未记录）'
  return origin.ref === 'HEAD'
    ? '某次提交（分支名未记录）'
    : `创建自 ${origin.ref}`
}

// 需要动手的事（清单行尾是 ↑2、↓3 这样的数字，这里写成同样意思的一句话），排在标题行最右边。
function TodoFacts({ tree }) {
  const s = tree.status
  return (
    <span className="wt-todo">
      {s?.ahead > 0 && (
        <span
          className="wt-fstate"
          data-tone="accent"
          title="按本地记录比较，不联网更新"
        >
          {s.ahead} 个提交未推送
        </span>
      )}
      {s?.behind > 0 && (
        <span
          className="wt-fstate"
          data-tone="warn"
          title="按本地记录比较，不联网更新"
        >
          落后上游 {s.behind} 个提交
        </span>
      )}
    </span>
  )
}

// 参考信息：关联工具、分支起点、上游。放在页签那一行的右边，地方不够时淡出，不另占一行。
function RefFacts({ tree }) {
  const s = tree.status
  if (!tree.tools?.length && !tree.branch) return null
  return (
    <p className="wt-refs">
      {tree.tools.map((name) => (
        <span
          key={name}
          className="wt-tool"
          title={`${name}：这个目录里有它的未归档会话`}
        >
          <i>{SHORT[name] ?? name[0]}</i>
        </span>
      ))}
      {tree.branch && (
        <span
          className="wt-ref"
          title="来源：本地 Git 分支引用日志。起点不等于当前跟踪的上游。"
        >
          <i>起点</i>
          {originText(tree)}
        </span>
      )}
      {s && tree.branch && (
        <span
          className="wt-ref"
          title={
            s.upstream
              ? `按本地记录比较，不联网更新：领先 ${s.ahead}，落后 ${s.behind}`
              : '此分支没有默认对比对象；不等于从未推送'
          }
        >
          <i>上游</i>
          <code>{s.upstream ?? '未设置'}</code>
        </span>
      )}
    </p>
  )
}

// 获取 / 拉取 / 推送连成一组。能不能点只看本地记录，点了之后宿主会先出一份计划，确认了才执行。
const SYNC = [
  [
    'fetch',
    '获取',
    'fetch',
    () => '取回远端的最新记录，让未推送 / 落后的数字变准',
  ],
  [
    'pull',
    '拉取',
    'pull',
    (t, s) =>
      !s?.upstream
        ? '这个分支没有设置上游，不能拉取'
        : s.behind > 0
          ? `把当前分支快进到远端：按本地记录落后 ${s.behind} 个提交`
          : '取回远端更新，能快进就快进当前分支',
  ],
  [
    'push',
    '推送',
    'push',
    (t, s) =>
      !s?.upstream
        ? '这个分支还没有上游：推送时会在远端建立同名分支'
        : s.ahead > 0
          ? `把 ${s.ahead} 个提交推到远端的同名分支`
          : '没有未推送的提交',
  ],
]
function SyncButtons({ repo, tree, act }) {
  const s = tree.status
  const [fetching, setFetching] = useState(false)
  // 有操作做到一半时不同步；分离 HEAD 不在分支上，没有可拉可推的东西。
  const blocked = tree.operations?.length
    ? `有操作还没做完（${tree.operations.join('、')}）`
    : tree.detached
      ? '当前停在某次提交上（分离 HEAD），不在分支上'
      : ''
  const able = (op) => {
    if (blocked) return [false, blocked]
    if (op === 'fetch') return [true, '']
    if (op === 'pull') {
      if (!s?.upstream) return [false, '这个分支没有设置上游，不能拉取']
      if (s.ahead > 0 && s.behind > 0)
        return [
          false,
          '本地和远端各有对方没有的提交，不能快进：请在终端里合并或变基',
        ]
      return [true, '']
    }
    if (s?.upstream && s.ahead === 0) return [false, '没有未推送的提交']
    return [true, '']
  }
  return (
    <span className="wt-agroup wt-sync" role="group" aria-label="与远端同步">
      {SYNC.map(([op, label, icon, hint]) => {
        const [ok, why] = able(op)
        const count = op === 'pull' ? s?.behind : op === 'push' ? s?.ahead : 0
        return (
          <button
            key={op}
            type="button"
            className="wt-btn"
            disabled={!ok}
            title={ok ? hint(tree, s) : why}
            onClick={async () => {
              if (op !== 'fetch') return act.sync(repo.id, tree, op)
              setFetching(true)
              try {
                await act.sync(repo.id, tree, op)
              } finally {
                setFetching(false)
              }
            }}
          >
            <Icon name={icon} size={14} />
            <span className="wt-btnlabel">{label}</span>
            {fetching && (
              <span className="wt-spinner wt-spinner-sm" aria-hidden="true" />
            )}
            {ok && !fetching && count > 0 && <b>{count}</b>}
          </button>
        )
      })}
    </span>
  )
}

// 操作栏排成一行，按轻重分三组，每组都不从中间断开：
//   左边是要在这里开工的（打开 / 新开 DSH 会话、AI 审查），接着是与远端同步；
//   右边是「到别的应用里去」的纯图标和「更多」。放不下时整组换行。
function ActionBar({
  repo,
  tree,
  services,
  apps,
  act,
  renderFactorySlot,
  review,
  // 「AI 审查」审哪个范围的改动（见 model.js 的 SCOPES）。
  reviewScope,
  // 这个仓库配了自己的审查提示词。
  prompted = false,
}) {
  const dsh = services.state.dsh
  const usable = !tree.prunable && !tree.error
  const reviewable = scopeFiles(tree, reviewScope)?.length > 0
  // 这棵树的 AI 审查还在进行：按钮先不许再发起一次。
  const reviewing =
    review?.status === 'ready' &&
    review.data.known &&
    !review.data.missing &&
    !!review.data.running
  const live = tree.sessions.filter((s) => s.source === 'DSH' && !s.archived)
  // 每类应用只留最靠前的那个（装了两个终端时不必都摆出来），其余在「更多」里。
  const picks = apps.filter(
    (target, index) =>
      apps.findIndex((t) => t.group === target.group) === index,
  )
  return (
    <div className="wt-actions">
      {dsh && usable && (
        <>
          <span className="wt-agroup" role="group" aria-label="DSH 会话">
            {live.length > 0 && (
              <button
                className="wt-btn is-primary"
                title={`打开最近的 DSH 会话：${live[0].title || live[0].id}`}
                onClick={() => act.openDsh(tree)}
              >
                <Icon name="bubble" size={15} />
                <span className="wt-btnlabel">打开 DSH 会话</span>
              </button>
            )}
            <button
              className={'wt-btn is-primary' + (live.length ? ' is-icon' : '')}
              title="把这个目录登记为工作区，并打开一个新的 DSH 会话"
              aria-label={live.length ? '新开会话' : '在 DSH 新开会话'}
              onClick={() => act.newDsh(tree)}
            >
              <Icon name="chat" size={15} />
              {live.length ? (
                <span className="wt-vh">新开会话</span>
              ) : (
                <span className="wt-btnlabel">
                  <span className="wt-btnlong">在 DSH </span>
                  新开会话
                </span>
              )}
            </button>
          </span>
          {reviewable && act.review && (
            <button
              className="wt-btn"
              disabled={reviewing}
              title={
                (reviewing
                  ? '这棵工作树的 AI 审查还在进行，结果出来后会标在对应的代码行旁'
                  : reviewScope === 'outgoing'
                    ? '在这个目录新开一个 DSH 会话，审查还没推到远端的改动（未推送的提交和还没提交的，只读）。审完后要处理的地方会标在对应的代码行旁'
                    : '在这个目录新开一个 DSH 会话来审查未提交的改动（只读）。审完后要处理的地方会标在对应的代码行旁') +
                (prompted ? '。用的是本仓库自己配的审查提示词' : '')
              }
              aria-label="AI 审查"
              onClick={() => act.review(repo.id, tree, reviewScope)}
            >
              <Icon name="spark" size={15} />
              <span className="wt-btnlabel">AI 审查</span>
            </button>
          )}
        </>
      )}
      {usable && act.features?.includes('sync') && (
        <SyncButtons repo={repo} tree={tree} act={act} />
      )}
      <span className="wt-agroup wt-apps">
        {usable &&
          picks.map((target) => (
            <button
              key={target.app}
              type="button"
              className="wt-iconbtn wt-appbtn"
              title={target.label}
              aria-label={target.label}
              onClick={() => act.openApp(repo.id, tree, target)}
            >
              <Icon name={target.icon} size={15} />
            </button>
          ))}
        {renderFactorySlot?.('contextMenu.button', {
          target: { kind: menuKind, value: { repo: repo.id, path: tree.path } },
          label: '更多操作',
          className: 'wt-menu-btn wt-btn-more',
        })}
      </span>
    </div>
  )
}

function SessionList({
  tree,
  repository,
  services,
  act,
  now,
  codexNavigation,
  reviewSession,
}) {
  const [limit, setLimit] = useState(8)
  const [archived, setArchived] = useState(false)
  const live = tree.sessions.filter((s) => !s.archived)
  const old = tree.sessions.filter((s) => s.archived)
  const rows = (archived ? [...live, ...old] : live).slice(0, limit)
  const openable = (s) =>
    !s.archived &&
    (s.source === 'DSH'
      ? !!services.dsh
      : s.source === 'ZCode' || s.source === 'Codex'
        ? !!codexNavigation
        : false)
  const label = (s) =>
    s.source === 'DSH'
      ? '打开会话'
      : s.source === 'Codex'
        ? '在 Codex 打开'
        : s.title
          ? '复制标题并打开 ZCode'
          : '打开 ZCode'
  return (
    <>
      {!rows.length ? (
        <p className="wt-emptyline">
          {archived || !old.length
            ? '未匹配到会话记录，不能据此判断工作树是否有人使用。'
            : '没有未归档的会话。'}
        </p>
      ) : (
        <ul className="wt-sessions">
          {rows.map((s) => (
            <li className="wt-session" key={`${s.source}:${s.id}`}>
              <span className="wt-toolchip" data-tool={s.source}>
                {s.source}
              </span>
              <div className="wt-sbody">
                <span className="wt-stitle" title={s.title || s.id}>
                  {s.title || s.id}
                </span>
                {s.source === 'DSH' && s.id === reviewSession && (
                  <small
                    className="wt-tag"
                    title="这个会话是工作树面板发起的代码审查"
                  >
                    <Icon name="review" size={11} />
                    代码审查
                  </small>
                )}
                <small>
                  {s.running ? '运行中 · ' : ''}
                  <span title={fullTime(s.time)}>
                    {relTime(s.time, now)}
                  </span> · {s.evidence}
                  {s.archived ? ' · 已归档' : ''}
                </small>
              </div>
              <div className="wt-sacts">
                {openable(s) && (
                  <button
                    className="wt-linkbtn"
                    onClick={() => act.openTool(tree, s, repository)}
                  >
                    {label(s)}
                    <Icon name="external" size={12} />
                  </button>
                )}
                <CopyButton
                  value={s.id}
                  label="已复制会话 ID"
                  act={act}
                  title="复制会话 ID"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="wt-sessionbar">
        {(archived ? live.length + old.length : live.length) > rows.length && (
          <button className="wt-linkbtn" onClick={() => setLimit(limit + 12)}>
            再显示{' '}
            {Math.min(
              12,
              (archived ? tree.sessions.length : live.length) - rows.length,
            )}{' '}
            条
          </button>
        )}
        {old.length > 0 && (
          <button className="wt-linkbtn" onClick={() => setArchived(!archived)}>
            {archived
              ? `隐藏 ${old.length} 个已归档会话`
              : `显示 ${old.length} 个已归档会话`}
          </button>
        )}
      </div>
    </>
  )
}

// 「未推送」的范围里包含的提交：和哪个上游比、几个提交，新的在前。多了先只列几条。
function OutgoingCommits({ out, now }) {
  const [more, setMore] = useState(false)
  const shown = more ? out.commits : out.commits.slice(0, 4)
  const count = out.commits.length
  return (
    <div className="wt-outgoing">
      <p className="wt-outgoinghead">
        和上游 <code>{out.ref}</code> 比：
        {count
          ? `${count}${out.more ? '+' : ''} 个提交还没推送`
          : '有提交还没推送'}
        {out.total > 0 && `，${out.total} 个文件有改动`}
      </p>
      <ul className="wt-commits">
        {shown.map((commit) => (
          <li key={commit.sha}>
            <code title={commit.sha}>{commit.sha.slice(0, 10)}</code>
            <time title={fullTime(commit.time)}>
              {relTime(commit.time, now)}
            </time>
            <span className="wt-dsubject" title={commit.title}>
              {commit.title}
            </span>
          </li>
        ))}
      </ul>
      {count > shown.length && (
        <button className="wt-linkbtn" onClick={() => setMore(true)}>
          还有 {count - shown.length} 个提交
        </button>
      )}
      {more && out.more && (
        <span className="wt-outgoingmore">更早的提交没有列出</span>
      )}
    </div>
  )
}

function TreeDetail({
  repo,
  tree,
  showRepo,
  onBack,
  onExpandList,
  onTicket,
  services,
  apps,
  act,
  now,
  getTriggerProps,
  renderFactorySlot,
  requestPrune,
  reload,
  home,
  review,
  retryReview,
}) {
  // 停在哪个页签、文件区怎么看着的：记在本机，回到这棵工作树时接着看（见 viewstate.js）。
  const treeKey = reviews.key(repo.id, tree)
  const [remember] = useState(() => ({
    get: () => viewState.tree(treeKey),
    area: (scope, patch) =>
      viewState.saveTree(treeKey, { scopes: { [scope]: patch } }),
  }))
  const full = review?.status === 'ready' ? review.data.report : null
  // 「说明」不再显示：只留必须处理和建议（见 src/report.js 的 shrinkReport）。
  const report = useMemo(() => shrinkReport(full), [full])
  // 审查的是哪个范围的改动（早先的记录都是未提交的）。
  const reviewScope = review?.entry?.scope ?? 'uncommitted'
  // 默认停在哪个页签：有没提交的看「未提交」；都提交了、还有没推送的看「未推送」。
  const initial = () => {
    const scope = defaultScope(tree)
    if (scopeTotal(tree, scope) > 0) return scope
    return review ? 'review' : 'sessions'
  }
  const [tab, setTabState] = useState(() => {
    const saved = remember.get().tab
    // 记着的页签这棵树眼下没有内容（推送完了、改动都提交了、清掉了审查记录）：回到默认。
    if (saved === 'review' && !review) return initial()
    if (FILE_TABS.includes(saved) && !scopeTotal(tree, saved)) return initial()
    return saved || initial()
  })
  const setTab = (value) => {
    setTabState(value)
    viewState.saveTree(treeKey, { tab: value })
  }
  // 两个范围的文件区第一次看到才挂上，之后藏着不拆（藏着的也会去读差异，没看过的范围不必读）。
  const [seen, setSeen] = useState(
    () => new Set(FILE_TABS.includes(tab) ? [tab] : []),
  )
  useEffect(() => {
    if (FILE_TABS.includes(tab))
      setSeen((old) => (old.has(tab) ? old : new Set(old).add(tab)))
  }, [tab])
  // 正看着的范围在眼皮底下空了（提交完、推送完），另一个范围还有东西：换过去，不留在空页上。
  const totalsBefore = useRef(null)
  useEffect(() => {
    const totals = {
      uncommitted: scopeTotal(tree, 'uncommitted'),
      outgoing: scopeTotal(tree, 'outgoing'),
    }
    const before = totalsBefore.current
    totalsBefore.current = totals
    if (!before || !FILE_TABS.includes(tab) || totals[tab] > 0) return
    const other = tab === 'uncommitted' ? 'outgoing' : 'uncommitted'
    // 自己点开一个空的范围看一眼是允许的：只在它是从有到没的时候才换。
    if (before[tab] > 0 && totals[other] > 0) setTab(other)
  }, [tree.status, tab])
  const mark = markTone(tree)
  const s = tree.status
  const ticket = ticketOf(tree.branch)
  const codexNavigation = repo.data?.codexNavigation
  // 审查结果按文件分好，交给差异视图落到行上。批注是对着审查的那个范围做的，只贴在同一个范围的差异上。
  const grouped = useMemo(
    () =>
      report
        ? groupNotes(
            report.notes,
            scopeFiles(tree, review?.entry?.scope ?? 'uncommitted') ?? [],
          )
        : null,
    [report, review?.entry, s],
  )
  const notesFor = (scope) =>
    review?.entry && reviewScope === scope ? (grouped?.byFile ?? null) : null
  // 审查之后改动有没有变：现在的指纹和审查时的对不上就是变了（按审查的那个范围算）。
  const stamp = useMemo(() => stampOf(tree, reviewScope), [s, reviewScope])
  const stale = changedSince(review, stamp)
  // 「复制结论」复制什么：这个范围里还要处理的结论，去掉已审阅的文件里的（那些看过了）。
  // 勾了「已审阅」要跟着变：标记有增减时重算一遍。
  const [, redrawViewed] = useReducer((n) => n + 1, 0)
  useEffect(() => viewed.subscribe(redrawViewed), [])
  const viewedVersion = viewed.version
  const copyable = useMemo(() => {
    if (!report || !review?.entry) return null
    const files = scopeFiles(tree, reviewScope) ?? []
    const marks = viewed.marksOf(treeKey)
    const skip = new Set(
      files
        .filter(
          (file) => viewedStateOf(marks, file, digestOf(file)) === 'viewed',
        )
        .map((file) => file.path),
    )
    // 对不上当前文件清单的结论也带上：它们不在任何文件里，谈不上审阅过。
    const notes = [...(grouped?.byFile.values() ?? [])]
      .flat()
      .concat(grouped?.loose ?? [])
    return copyText(notes, {
      skip,
      branch: tree.branch,
      head: tree.head,
      scope: reviewScope,
      ref: s?.outgoing?.ref,
      at: review.entry.at,
    })
    // grouped 由 report 和文件清单算出来，report 变了它一定变。
  }, [
    report,
    review?.entry,
    reviewScope,
    s,
    tree.branch,
    tree.head,
    treeKey,
    viewedVersion,
  ])
  // 「审查结果」只在有结果时才有。正停在它上面时结果没了（清除了记录），回到关联会话。
  const shown = tab === 'review' && !report ? 'sessions' : tab
  // 「AI 审查」审的是眼下正看着的范围；不在文件页签上时是默认的那个。
  const actScope = FILE_TABS.includes(shown) ? shown : defaultScope(tree)
  const menu = { kind: menuKind, value: { repo: repo.id, path: tree.path } }
  const title = (
    <div className="wt-dtitle">
      {onBack && (
        <button className="wt-back" onClick={onBack} aria-label="返回列表">
          <Icon name="back" size={16} />
        </button>
      )}
      {onExpandList && (
        <button
          className="wt-back"
          onClick={onExpandList}
          aria-label="展开工作树清单"
          title="展开工作树清单（键盘 ↑ ↓ 也能换工作树）"
        >
          <Icon name="expand" size={16} />
        </button>
      )}
      {mark && (
        <span className="wt-dot" data-tone={mark} title={signal(tree).label} />
      )}
      <h2
        className="wt-dname"
        data-mono={tree.detached ? '' : undefined}
        title={tree.branch || tree.head}
      >
        {treeName(tree)}
      </h2>
      {tree.main && <small className="wt-tag">主目录</small>}
      {tree.locked && (
        <small className="wt-tag" title={tree.lockedReason || '已锁定'}>
          <Icon name="lock" size={11} />
          锁定
        </small>
      )}
      {tree.detached && <small className="wt-tag">分离 HEAD</small>}
      {/* 工单号在清单的单行里放不下，挪到这里：点它只看这个工单的工作树。 */}
      {ticket && (
        <button
          type="button"
          className="wt-ticket"
          style={{ '--ticket': ticket.color }}
          title={`只看 ${ticket.key} 相关的工作树`}
          onClick={() => onTicket(ticket.key)}
        >
          {ticket.key}
        </button>
      )}
      <TodoFacts tree={tree} />
    </div>
  )
  const sub = (
    <p className="wt-dsub">
      {showRepo && <span className="wt-drepo">{repo.name}</span>}
      <Tail
        className="wt-dpath"
        title={tree.path}
        text={homeTilde(tree.path, home)}
      />
      <CopyButton
        value={tree.path}
        label="已复制路径"
        act={act}
        title="复制路径"
      />
      <span className="wt-spacer" />
      <span
        className="wt-dwhen"
        title={
          tree.lastChange
            ? `最近改动：${fullTime(tree.lastChange.time)}（依据：${tree.lastChange.source}）`
            : '取不到可用的时间'
        }
      >
        最近改动{' '}
        {tree.lastChange ? relTime(tree.lastChange.time, now) : '时间未知'}
      </span>
    </p>
  )

  if (tree.prunable)
    return (
      <div className="wt-dinner">
        <header className="wt-dhead">
          {title}
          {sub}
        </header>
        <div className="wt-dbody is-padded">
          <p className="wt-notice is-warn" role="status">
            <Icon name="warning" size={14} />
            {staleReason(tree) ||
              'Git 仍保留着这棵工作树的登记，但目录已经不存在。'}
          </p>
          <p className="wt-dtext">
            清理只会移除 Git
            里的登记，不会删除任何文件；范围是整个仓库的失效登记。
          </p>
          <div className="wt-actions">
            <button
              className="wt-btn is-danger"
              onClick={() => requestPrune(repo.id)}
            >
              <Icon name="broom" size={15} />
              清理失效登记
            </button>
          </div>
        </div>
      </div>
    )

  const emptyText = (scope) => {
    // 工作区是干净的、但提交还没推送：改动都在「未推送」里，指个路。
    const pushable = scopeTotal(tree, 'outgoing')
    if (scope === 'uncommitted')
      return (
        <>
          没有未提交的改动。
          {pushable > 0 && (
            <button className="wt-linkbtn" onClick={() => setTab('outgoing')}>
              {pushable} 个文件在未推送的提交里
            </button>
          )}
        </>
      )
    return '和上游相比没有文件改动。'
  }
  return (
    <div className="wt-dinner">
      <header className="wt-dhead" {...getTriggerProps(menu, { tabIndex: -1 })}>
        {title}
        {sub}
        {/* 最近一次提交：短号、时间、标题，只占一行，放不下时省略（悬停看全文）。 */}
        <p className="wt-dcommit">
          {tree.head ? (
            <code title={tree.head}>{tree.head.slice(0, 10)}</code>
          ) : (
            <span>尚无提交</span>
          )}
          {tree.commit && (
            <>
              <time title={fullTime(tree.commit.time)}>
                {relTime(tree.commit.time, now)}
              </time>
              <span className="wt-dsubject" title={tree.commit.title}>
                {tree.commit.title}
              </span>
            </>
          )}
        </p>
        {/* 合并、变基这类做到一半的操作，清单里是红色的标记，详情里要说出是什么。 */}
        {tree.operations?.length > 0 && (
          <p className="wt-notice is-danger" role="status">
            <Icon name="warning" size={14} />
            {tree.operations.join(' · ')}
          </p>
        )}
        {tree.error && (
          <p className="wt-notice is-danger" role="alert">
            <Icon name="warning" size={14} />
            {tree.error}
            <button className="wt-linkbtn" onClick={() => reload(repo.id)}>
              重试
            </button>
          </p>
        )}
        {tree.limited && (
          <p className="wt-notice is-warn" role="status">
            <Icon name="warning" size={14} />
            {tree.limited}
          </p>
        )}
        <ActionBar
          repo={repo}
          tree={tree}
          services={services}
          apps={apps}
          act={act}
          renderFactorySlot={renderFactorySlot}
          review={review}
          reviewScope={actScope}
          prompted={!!repo.data?.reviewPrompt}
        />
      </header>
      <div className="wt-dtabs" role="tablist">
        {/* 页签就是范围：没提交的改动、没推送的改动（有未推送的提交时才有）。 */}
        <button
          role="tab"
          aria-selected={shown === 'uncommitted'}
          onClick={() => setTab('uncommitted')}
        >
          未提交 <b>{s?.total ?? '—'}</b>
        </button>
        {scopeTotal(tree, 'outgoing') > 0 && (
          <button
            role="tab"
            aria-selected={shown === 'outgoing'}
            onClick={() => setTab('outgoing')}
          >
            未推送 <b>{s.outgoing.total}</b>
          </button>
        )}
        <button
          role="tab"
          aria-selected={shown === 'sessions'}
          onClick={() => setTab('sessions')}
        >
          关联会话 <b>{tree.sessions.length}</b>
        </button>
        {report && (
          <button
            role="tab"
            aria-selected={shown === 'review'}
            onClick={() => setTab('review')}
          >
            审查结果 <b>{report.notes.length}</b>
          </button>
        )}
        <span className="wt-spacer" />
        <RefFacts tree={tree} />
      </div>
      {/* 审查结论条在页签外面：不管停在哪个页签都看得见这棵树审查过、结论是什么。 */}
      <ReviewBar
        state={review}
        act={act}
        repo={repo}
        tree={tree}
        retry={retryReview}
        stale={stale}
        loose={grouped?.loose.length ?? 0}
        copy={copyable}
        now={now}
      />
      <div className="wt-dbody">
        {/* 几个页签的内容都挂着，没显示的那个藏起来：切回来时差异不用重读，滚动位置、筛选也都还在。 */}
        {FILE_TABS.filter((scope) => seen.has(scope)).map((scope) => {
          const files = scopeFiles(tree, scope)
          return (
            <div
              key={scope}
              className="wt-tabpane"
              role="tabpanel"
              aria-label={SCOPES[scope]}
              data-on={shown === scope ? '' : undefined}
              aria-hidden={shown !== scope}
            >
              {!files ? (
                <p className="wt-emptyline">
                  {tree.error ? '无法读取文件状态。' : '没有读到文件状态。'}
                </p>
              ) : !files.length ? (
                <p className="wt-emptyline">{emptyText(scope)}</p>
              ) : (
                <>
                  {scope === 'outgoing' && (
                    <OutgoingCommits out={s.outgoing} now={now} />
                  )}
                  {tree.hasSubmodules && (
                    <p className="wt-dtext wt-panetext">
                      子模块只比较提交指针，不扫描子模块内部的改动。
                    </p>
                  )}
                  <FileArea
                    tree={tree}
                    repository={repo.id}
                    scope={scope}
                    notesFor={notesFor(scope)}
                    live={shown === scope}
                    remember={remember}
                  />
                </>
              )}
            </div>
          )
        })}
        <div
          className="wt-tabpane"
          role="tabpanel"
          data-on={shown === 'sessions' ? '' : undefined}
          aria-hidden={shown !== 'sessions'}
        >
          <SessionList
            tree={tree}
            repository={repo.id}
            services={services}
            act={act}
            now={now}
            codexNavigation={codexNavigation}
            reviewSession={review?.entry?.session}
          />
        </div>
        {report && (
          <div
            className="wt-tabpane"
            role="tabpanel"
            data-on={shown === 'review' ? '' : undefined}
            aria-hidden={shown !== 'review'}
          >
            <ReviewNotes
              report={report}
              copy={copyable}
              act={act}
              onPrompt={act.editPrompt && (() => act.editPrompt(repo.id))}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function Empty({ total, warnings, onClear, busy, missing }) {
  if (missing)
    return (
      <div className="wt-empty">
        <h2>没有读到仓库清单</h2>
        <p className="wt-dtext">
          面板从 DSH 工作区、Codex 和 ZCode
          的本机索引里发现仓库。可以在插件配置的 projects 中补充目录。
        </p>
      </div>
    )
  if (busy)
    return (
      <div className="wt-empty">
        <span className="wt-spinner" aria-hidden="true" />
        <p className="wt-dtext">正在读取各仓库的状态，读完一个显示一个…</p>
      </div>
    )
  return (
    <div className="wt-empty">
      {warnings.length > 0 && (
        <details className="wt-sources">
          <summary>部分数据不可用（{warnings.length}）</summary>
          {warnings.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </details>
      )}
      <h2>
        {total.repos} 个仓库，{total.trees} 棵工作树
      </h2>
      {total.stale + total.trouble + total.dirty + total.unpushed > 0 ? (
        <dl className="wt-emptystats">
          {[
            ['trouble', '异常', 'danger'],
            ['dirty', '有改动', 'warn'],
            ['unpushed', '有未推送', 'accent'],
            ['stale', '失效登记', 'stale'],
          ]
            .filter(([key]) => total[key])
            .map(([key, label, tone]) => (
              <div key={key}>
                <dt data-tone={tone}>{label}</dt>
                <dd>{total[key]}</dd>
              </div>
            ))}
        </dl>
      ) : (
        <p className="wt-dtext">所有工作树都是干净的。</p>
      )}
      <p className="wt-dtext">
        在左侧选一棵工作树，查看文件改动和关联会话，或直接在这里开工。键盘 ↑ ↓
        也可以移动选择。
      </p>
      {onClear && (
        <button className="wt-linkbtn" onClick={onClear}>
          当前有筛选条件，清除后显示全部工作树
        </button>
      )}
    </div>
  )
}

// 详情栏。表头（名称、路径、操作）和页签留在顶上，正文自己滚动：看差异时操作一直够得着。
export function DetailPane({
  target,
  loading,
  error,
  split,
  showRepo,
  onBack,
  onExpandList,
  onTicket,
  services,
  apps,
  act,
  now,
  getTriggerProps,
  renderFactorySlot,
  retry,
  requestPrune,
  reload,
  home,
  review,
  retryReview,
  total,
  warnings,
  onClear,
  busy,
  missing,
}) {
  if (!target)
    return (
      <aside className="wt-detail" aria-label="工作树详情">
        <div className="wt-dinner">
          <Empty
            total={total}
            warnings={warnings}
            onClear={onClear}
            busy={busy}
            missing={missing}
          />
        </div>
      </aside>
    )
  const { repo, tree } = target
  if (loading || error || !tree)
    return (
      <aside className="wt-detail" aria-label="工作树详情" aria-busy={!error}>
        <div className="wt-dinner">
          <p className="wt-emptyline">
            {error ? (
              <>
                {error}
                <button className="wt-linkbtn" onClick={() => retry(repo.id)}>
                  重试
                </button>
              </>
            ) : (
              '正在读取这棵工作树的状态…'
            )}
          </p>
        </div>
      </aside>
    )
  return (
    <aside className="wt-detail" aria-label="工作树详情">
      <TreeDetail
        key={`${repo.id}:${tree.path}`}
        repo={repo}
        tree={tree}
        showRepo={showRepo}
        onBack={split ? null : onBack}
        onExpandList={onExpandList}
        onTicket={onTicket}
        services={services}
        apps={apps}
        act={act}
        now={now}
        getTriggerProps={getTriggerProps}
        renderFactorySlot={renderFactorySlot}
        requestPrune={requestPrune}
        reload={reload}
        home={home}
        review={review}
        retryReview={retryReview}
      />
    </aside>
  )
}
