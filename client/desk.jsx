import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import css from './style.css'
import { hostApps, hostOpen, request } from './api.js'
import { cache, keepKnown } from './cache.js'
import { DetailPane } from './detail.jsx'
import { Modal } from './dialog.jsx'
import { latest, openTargets, prefs } from './hub.js'
import { Icon } from './icons.jsx'
import { Tail } from './bits.jsx'
import {
  FILTERS,
  TOOLS,
  arrange,
  compareTrees,
  defaultScope,
  fullTime,
  homeTilde,
  isQuiet,
  match,
  relTime,
  reviewGone,
  scopeFiles,
  treeName,
} from './model.js'
import { Rail } from './rail.jsx'
import { WorkList } from './list.jsx'
import { ScopeMenu, ScopeTrigger } from './picker.jsx'
import { stampOf, reviewPrompt } from './review.js'
import { PromptDialog, reviews } from './review.jsx'
import { viewed } from './viewed.js'
import { viewState } from './viewstate.js'

const SPLIT_AT = 820 // 容器到这里：清单与详情并排
// 再宽这么多：左侧显示仓库导航栏。它要占 228px；清单收窄之后，到这里时详情栏还能有 550px 左右。
const RAIL_AT = 1120
// 并排时清单的宽度：默认值，和能拖到的范围（再宽就挤详情，再窄就看不全分支名）。
const LIST_W = 340
const LIST_MIN = 240
const LIST_MAX = 520
const clampList = (value) =>
  Math.min(LIST_MAX, Math.max(LIST_MIN, Math.round(Number(value) || LIST_W)))
const CONCURRENCY = 4 // 同时读取的仓库数
const REVIEW_POLL = 5000 // 有审查在进行时，隔这么久再看一次结果
const REVIEW_FRESH = 4000 // 刚读过的结果这么久之内不重复读
// 筛选片的顺序。「审查过」排在「失效登记」前面：清单窄到放不下时先被挤出去的是失效登记。
const FILTER_KEYS = [
  'all',
  'dirty',
  'unpushed',
  'behind',
  'trouble',
  'reviewed',
  'stale',
]
const NOTHING = new Set()
const NO_MENU = () => ({
  getTriggerProps: (_target, handlers) => handlers ?? {},
})

// 宿主服务是逐步接上的（可选能力就绪后才出现），变化时让面板重画一次。
function useServices(store) {
  const [, redraw] = useReducer((n) => n + 1, 0)
  useEffect(() => store.subscribe(redraw), [store])
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Web 模式或权限被拒时退回临时文本框。
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
    document.body.appendChild(field)
    field.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      /* 交给调用方提示 */
    }
    field.remove()
    return ok
  }
}
const reason = (error) =>
  String(error?.message ?? error)
    .replace(/\s+/g, ' ')
    .slice(0, 160)
// 这次没读到某个仓库：上次的数据还在就接着显示，只在它的分组里提示一句；没有才换成错误。
const failed = (map, id, error) => {
  const data = map.get(id)?.data
  return new Map(map).set(
    id,
    data
      ? { state: 'ready', data, error: error.message }
      : { state: 'error', error: error.message },
  )
}

// 画上次留下的结果时出了错（比如插件升级后数据对不上了）：不带它重画一次，不惊动用户。
// 再出错就只显示一句话，不让宿主的整个界面跟着白屏。
class Guard extends React.Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    // 把出错的那份结果清掉，下次打开面板不再撞上。记下来的界面状态也一起清：说不准是它触发的。
    if (this.props.retry) {
      cache.clear()
      viewState.clear()
    }
  }
  render() {
    const { children, fallback, retry } = this.props
    if (!this.state.failed) return children
    return retry ? <Guard fallback={fallback}>{retry}</Guard> : fallback
  }
}

const SYNC_LABEL = { fetch: '获取', pull: '拉取', push: '推送' }

// 计划里和这种操作有关的数字，以及确认之后会发生什么。
function planText(job) {
  const { op, plan } = job
  const branch = <b key="b">{plan.branch}</b>
  if (op === 'push')
    return (
      <>
        <p className="wt-dtext">
          把 {branch}{' '}
          {plan.ahead != null ? `上的 ${plan.ahead} 个提交` : '上未推送的提交'}
          {plan.push.create ? (
            <>
              推到远端 <code>{plan.push.remote}</code>：建立同名分支{' '}
              <code>{plan.push.branch}</code>，并设为它的上游。
            </>
          ) : (
            <>
              推到{' '}
              <code>
                {plan.push.remote}/{plan.push.branch}
              </code>
              。
            </>
          )}
        </p>
        <p className="wt-dtext">
          不强推：远端有本地没有的提交时，这次推送会被拒绝。
          {plan.dirty > 0 && ' 未提交的改动不会被推送，只推已经提交的内容。'}
        </p>
      </>
    )
  if (op === 'pull')
    return (
      <>
        <p className="wt-dtext">
          从 <code>{plan.upstream}</code> 取回更新，把 {branch} 快进到远端。
          {plan.behind > 0
            ? ` 按本地记录落后 ${plan.behind} 个提交。`
            : ' 本地记录显示没有落后的提交，以远端的实际情况为准。'}
        </p>
        <p className="wt-dtext">
          只做快进：不能快进时什么都不改。
          {plan.dirty > 0 &&
            ` 有 ${plan.dirty} 个文件未提交：如果和远端的更新冲突，Git 会停下来，不动你的文件。`}
        </p>
      </>
    )
  return <p className="wt-dtext">取回远端的最新记录，不动你的文件和分支。</p>
}

function SyncDialog({ job, onClose, onRun }) {
  const label = SYNC_LABEL[job.op]
  const busy = job.state === 'busy'
  const result = job.result
  return (
    <Modal
      title={
        job.state === 'done'
          ? result.ok
            ? `${label}完成`
            : `${label}没有完成`
          : `确认${label}`
      }
      onClose={() => !busy && onClose()}
      footer={
        <>
          {job.state === 'ready' && (
            <>
              <button className="wt-btn" onClick={onClose}>
                取消
              </button>
              <button
                className={'wt-btn' + (job.op === 'push' ? ' is-primary' : '')}
                onClick={() => onRun(job)}
              >
                {label}
                {job.op === 'push' && job.plan.push.create
                  ? '并建立远端分支'
                  : ''}
              </button>
            </>
          )}
          {job.state === 'done' && (
            <button className="wt-btn is-primary" onClick={onClose}>
              完成
            </button>
          )}
        </>
      }
    >
      <p className="wt-dsub">
        <span className="wt-drepo">{job.tree.branch || '分离 HEAD'}</span>
        <Tail className="wt-dpath" title={job.tree.path} text={job.tree.path} />
      </p>
      {job.state !== 'done' && planText(job)}
      {job.state === 'busy' && (
        <p className="wt-emptyline" role="status">
          <span className="wt-spinner" aria-hidden="true" />
          正在{label}，大仓库可能要等一会儿…
        </p>
      )}
      {job.error && (
        <p className="wt-notice is-danger" role="alert">
          <Icon name="warning" size={14} />
          {job.error}
        </p>
      )}
      {job.state === 'done' && (
        <>
          <p
            className={'wt-notice ' + (result.ok ? 'is-ok' : 'is-danger')}
            role="status"
          >
            <Icon name={result.ok ? 'check' : 'warning'} size={14} />
            {result.head}
          </p>
          {result.output && <pre className="wt-syncout">{result.output}</pre>}
        </>
      )}
    </Modal>
  )
}

// 清单和详情之间的分隔线：拖着调清单的宽度，左右方向键一次挪 16px，双击回到默认宽度。
// 松手（或按键、双击）时才告诉上层记下来。
function Resizer({ width, onResize, onCommit }) {
  const [dragging, setDragging] = useState(false)
  const start = useRef(null)
  const stop = (event) => {
    if (!start.current) return
    start.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture?.(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
    onCommit(width)
  }
  return (
    <div
      className="wt-resizer"
      role="separator"
      aria-orientation="vertical"
      aria-label="调整工作树清单的宽度"
      aria-valuemin={LIST_MIN}
      aria-valuemax={LIST_MAX}
      aria-valuenow={width}
      tabIndex={0}
      data-dragging={dragging ? '' : undefined}
      // 按下时不改焦点：拖动期间清单里的行不该被选中。
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        start.current = { x: event.clientX, width }
        setDragging(true)
      }}
      onPointerMove={(event) => {
        if (!start.current) return
        onResize(start.current.width + event.clientX - start.current.x)
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onDoubleClick={() => onCommit(LIST_W)}
      onKeyDown={(event) => {
        const step =
          event.key === 'ArrowLeft' ? -16 : event.key === 'ArrowRight' ? 16 : 0
        if (!step) return
        event.preventDefault()
        const next = clampList(width + step)
        onResize(next)
        onCommit(next)
      }}
    />
  )
}

export function Desk(props) {
  const saved = cache.load()
  const panel = (fromCache) => (
    <Panel
      key={fromCache ? 'saved' : 'empty'}
      saved={fromCache ? saved : null}
      {...props}
    />
  )
  return (
    <Guard
      fallback={
        <div className="wt-wrap">
          <style>{css}</style>
          <p className="wt-emptyline">
            面板显示出错。
            <button className="wt-linkbtn" onClick={() => location.reload()}>
              刷新
            </button>
          </p>
        </div>
      }
      retry={panel(false)}
    >
      {panel(!!saved)}
    </Guard>
  )
}

function Panel({ services, useContextMenu, renderFactorySlot, saved }) {
  useServices(services)
  const { getTriggerProps } = (useContextMenu ?? NO_MENU)()
  const rootRef = useRef(null),
    searchRef = useRef(null),
    listRef = useRef(null),
    pickRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  // 有上次读到的结果就先原样画它（标上 cached），新的清单到了再逐个仓库重读。
  const [catalog, setCatalog] = useState(() =>
    saved ? { ...saved.catalog, cached: true } : null,
  )
  const [catalogError, setCatalogError] = useState('')
  // 「宿主里的插件还是旧版」的提示，点过「知道了」就不再显示。
  const [oldHostOff, setOldHostOff] = useState(false)
  // 点了刷新，正在重读清单。
  const [refreshing, setRefreshing] = useState(false)
  const [details, setDetails] = useState(() => saved?.details ?? new Map())
  const [revision, bump] = useState(0)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [apps, setApps] = useState([])
  // 看到哪儿了（筛选、选中的工作树、折叠、滚动位置）：接着上次的地方，记在本机（见 viewstate.js）。
  const [savedView] = useState(() => viewState.load().list)
  const [scope, setScope] = useState(savedView.scope)
  const [query, setQuery] = useState(savedView.query)
  const [filter, setFilter] = useState(() =>
    Object.hasOwn(FILTERS, savedView.filter) ? savedView.filter : 'all',
  )
  const [tool, setTool] = useState(() =>
    TOOLS.includes(savedView.tool) ? savedView.tool : '',
  )
  const [sort, setSortValue] = useState(() => prefs.get('sort', 'attention'))
  const [selected, setSelected] = useState(savedView.selected)
  const [stack, setStack] = useState(savedView.stack) // 窄屏：0 清单，1 详情
  // 版面：清单的宽度、仓库栏和工作树清单有没有收起。都记在本机，下次打开还是这样。
  const [listW, setListW] = useState(() =>
    clampList(prefs.get('listW', LIST_W)),
  )
  const [railOff, setRailOff] = useState(
    () => prefs.get('railOff', false) === true,
  )
  const [listOff, setListOff] = useState(
    () => prefs.get('listOff', false) === true,
  )
  // 只看一个仓库时，清单末尾的「本地分支」展没展开：记在本机，回到这个仓库还是这样。
  const [branchesOpen, setBranchesOpen] = useState(
    savedView.branchesOpen === true,
  )
  // 从别处点进来看分支（仓库分组头上的「分支 N」、清单头上的「本地分支 N」）：展开，并滚到它那儿。
  const [branchJump, setBranchJump] = useState(0)
  const [collapsed, setCollapsed] = useState(() => new Set(savedView.collapsed))
  const [staleOpen, setStaleOpen] = useState(() => new Set(savedView.staleOpen))
  const [quietOpen, setQuietOpen] = useState(savedView.quietOpen)
  const [confirm, setConfirm] = useState(null)
  // 获取 / 拉取 / 推送：先出计划让用户确认，再执行，结果留在对话框里。
  const [sync, setSync] = useState(null)
  // 「本仓库的审查提示词」对话框开着的是哪个仓库。
  const [promptFor, setPromptFor] = useState(null)
  const [help, setHelp] = useState(false)
  // 窄面板上，筛选条里的仓库下拉是否展开着。
  const [picking, setPicking] = useState(false)
  const [notice, setNotice] = useState(null)
  const scopeRef = useRef(scope)
  scopeRef.current = scope

  // 面板是否还在读：清单没到，或还有仓库的状态没读完。清单到达和开始逐个读取之间没有空窗。
  const repos = useMemo(
    () =>
      (catalog?.repos ?? []).map((repo) => {
        const entry = details.get(repo.id)
        return {
          id: repo.id,
          path: repo.path,
          name: repo.name,
          groups: repo.groups,
          count: repo.trees.length,
          state: entry?.state ?? (catalog ? 'loading' : 'idle'),
          error: entry?.error,
          data: entry?.data,
          trees: entry?.data?.trees ?? null,
        }
      }),
    [catalog, details],
  )
  const busy = !catalog || repos.some((repo) => repo.state === 'loading')
  // 眼下画着的数据是什么时候读的：清单和各仓库里取最早的那个。
  const readAt = useMemo(() => {
    let time = catalog?.time ?? 0
    for (const repo of repos)
      if (repo.data) time = Math.min(time, repo.data.time)
    return time
  }, [catalog, repos])
  const hasData = repos.some((repo) => repo.data)
  // 宿主声明的能力（获取 / 拉取 / 推送、AI 审查）。新的清单说了算；先画上次的结果时用上次记下的，
  // 免得按钮闪一下才出现。null 是还不知道（刚升级、本机留存的结果里没有这项）。
  const fresh = !!catalog && !catalog.cached
  const features = fresh
    ? Array.isArray(catalog.features)
      ? catalog.features
      : []
    : Array.isArray(saved?.catalog?.features)
      ? saved.catalog.features
      : cache.features
  // 前端已经是新版、宿主里的插件还是旧版：要重启 DSH 才会换。那段时间不显示宿主做不到的操作，并说明原因。
  const oldHost = fresh && features.length === 0
  const scoped = useMemo(
    () => repos.find((r) => r.id === scope) ?? null,
    [repos, scope],
  )
  // 眼下画着上次的结果、同时在后台重读（打开面板时接上了上次的结果，或者点了刷新）。
  const resuming = !!saved || revision > 0
  const split = width >= SPLIT_AT
  // 仓库栏：面板够宽，而且用户没有把它收起。收起之后，筛选条上出现仓库下拉。
  const rail = width >= RAIL_AT && !railOff
  // 清单只在并排布局里收得起：上下堆叠时它就是整个面板。
  const hideList = split && listOff
  const stacked = !split && stack > 0
  const needle = query.trim()
  const home = catalog?.home ?? ''
  const svc = services.state

  // ---- 尺寸与时间 ----
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000)
    return () => clearInterval(timer)
  }, [])

  // ---- 数据：先拿仓库清单，再逐个仓库读状态，读完一个画一个 ----
  // 打开面板时先画上次留下的结果，不自动重读：每次进来都把所有仓库重读一遍，清单会闪、机器也吃力。
  // 想看最新的点右上角的「刷新」。头一次打开（还没有留存的结果）、点了刷新之后才读；
  // 旧版本留下的结果里没有「宿主的能力」这一项，也重读一次，免得新的操作一直不出现。
  useEffect(() => {
    if (saved && !revision && Array.isArray(saved.catalog?.features)) return
    const ctl = new AbortController()
    setRefreshing(true)
    setCatalogError('')
    request('catalog', revision ? { refresh: '1' } : {}, ctl.signal)
      .then((data) => {
        if (ctl.signal.aborted) return
        setCatalog(data)
        cache.features = Array.isArray(data.features) ? data.features : []
        setDetails((old) => keepKnown(old, data))
      })
      .catch((error) => {
        if (!ctl.signal.aborted) setCatalogError(error.message)
      })
      .finally(() => {
        if (!ctl.signal.aborted) setRefreshing(false)
      })
    return () => ctl.abort()
  }, [revision])

  useEffect(() => {
    // 画的是上次的结果时先不逐个重读：新的清单马上就到，到齐了再一起读。
    if (!catalog || catalog.cached) return
    const ctl = new AbortController()
    const queue = catalog.repos.map((repo) => repo.id)
    // 当前正看着的仓库先读。
    if (scopeRef.current !== 'all') {
      const at = queue.indexOf(scopeRef.current)
      if (at > 0) queue.unshift(...queue.splice(at, 1))
    }
    let done = 0
    setProgress({ done: 0, total: queue.length })
    const run = async () => {
      while (queue.length && !ctl.signal.aborted) {
        const id = queue.shift()
        try {
          const data = await request('repository', { id }, ctl.signal)
          if (ctl.signal.aborted) return
          setDetails((map) => new Map(map).set(id, { state: 'ready', data }))
        } catch (error) {
          if (ctl.signal.aborted) return
          setDetails((map) => failed(map, id, error))
        }
        done += 1
        if (!ctl.signal.aborted) setProgress((value) => ({ ...value, done }))
      }
    }
    for (let i = 0; i < CONCURRENCY; i++) run()
    return () => ctl.abort()
  }, [catalog])

  // 筛选、选中、折叠这些变了就记下来：切走再回来、重启之后，接着上次的地方看。
  useEffect(() => {
    viewState.saveList({
      scope,
      query,
      filter,
      tool,
      stack,
      selected,
      collapsed: [...collapsed],
      staleOpen: [...staleOpen],
      quietOpen,
      branchesOpen,
    })
  }, [
    scope,
    query,
    filter,
    tool,
    stack,
    selected,
    collapsed,
    staleOpen,
    quietOpen,
    branchesOpen,
  ])
  // 记着的仓库已经不在清单里（挪走了、删了）：回到全部仓库。
  useEffect(() => {
    if (scope === 'all' || !catalog) return
    if (!catalog.repos.some((repo) => repo.id === scope)) setScope('all')
  }, [catalog, scope])

  // 读到的结果留在本机，下次打开面板先画它。后台重读时存的也是眼下画着的这一份。
  const kept = useRef(null)
  // 留存的只是清单和数据；「这份是留存的结果」这个标记不存。
  kept.current = catalog
    ? { catalog: { ...catalog, cached: undefined }, details }
    : null
  useEffect(() => {
    const flush = () => {
      if (kept.current) cache.save(kept.current)
    }
    // 关页面时定时器可能还没到点：补存一次。
    const timer = setTimeout(flush, 400)
    addEventListener('pagehide', flush)
    return () => {
      clearTimeout(timer)
      removeEventListener('pagehide', flush)
    }
  }, [catalog, details])

  useEffect(() => {
    let alive = true
    hostApps().then((list) => {
      if (alive) setApps(openTargets(list))
    })
    return () => {
      alive = false
    }
  }, [])

  const retry = useCallback(async (id) => {
    setDetails((map) =>
      new Map(map).set(id, { state: 'loading', data: map.get(id)?.data }),
    )
    try {
      const data = await request('repository', { id })
      setDetails((map) => new Map(map).set(id, { state: 'ready', data }))
    } catch (error) {
      setDetails((map) => failed(map, id, error))
    }
  }, [])

  // ---- AI 审查的结果 ----
  // 哪棵树由哪个会话审查，记在本机（见 review.jsx）。面板打开时把登记过的都读一遍：
  // 清单行尾的标记和详情里的结论条共用这一份，正在进行的隔几秒再看一次。
  const [reviewMap, setReviewMap] = useState(() => new Map())
  const reviewNow = useRef(reviewMap)
  const putReview = useCallback((key, value) => {
    const next = new Map(reviewNow.current)
    if (value) next.set(key, value)
    else next.delete(key)
    reviewNow.current = next
    setReviewMap(next)
  }, [])
  // keys：只读这几棵树；force：不管刚读过没有，都再读一遍。
  const loadReviews = useCallback(
    async (keys, force = false) => {
      const entries = reviews.list()
      for (const entry of entries) {
        if (keys && !keys.includes(entry.key)) continue
        const old = reviewNow.current.get(entry.key)
        if (!force && old && old.entry.session === entry.session) {
          // 已经有结果、而且审查已经结束的，不再读；正在进行的和还没读完的，刚读过就先等一等。
          const pending =
            old.status === 'loading' ||
            (old.status === 'ready' && old.data.running)
          if (!pending || Date.now() - old.at < REVIEW_FRESH) continue
        }
        putReview(entry.key, { status: 'loading', entry, at: Date.now() })
        try {
          const data = await request('review', {
            id: entry.repo,
            tree: entry.tree,
            session: entry.session,
          })
          putReview(entry.key, { status: 'ready', entry, data, at: Date.now() })
        } catch (error) {
          putReview(entry.key, {
            status: 'error',
            entry,
            error: error.message,
            at: Date.now(),
          })
        }
      }
      // 记录已经被清掉的，从这份状态里去掉。
      const known = new Set(entries.map((entry) => entry.key))
      for (const key of reviewNow.current.keys())
        if (!known.has(key)) putReview(key, null)
    },
    [putReview],
  )
  useEffect(() => {
    if (!catalog) return
    let alive = true,
      busy = false
    const tick = async () => {
      if (!alive || busy) return
      busy = true
      try {
        await loadReviews()
      } finally {
        busy = false
      }
    }
    tick()
    const timer = setInterval(tick, REVIEW_POLL)
    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [catalog, loadReviews])
  const reviewOf = useCallback(
    (repoId, tree) => reviewMap.get(reviews.key(repoId, tree)) ?? null,
    [reviewMap],
  )
  // 哪些工作树做过 AI 审查（包括还在审的、没审完的）：清单上的「审查过」按它筛、按它计数。
  const reviewKeys = useMemo(
    () => new Set(reviews.list().map((entry) => entry.key)),
    [reviewMap],
  )
  const isReviewed = useCallback(
    (repo, tree) => reviewKeys.has(reviews.key(repo.id, tree)),
    [reviewKeys],
  )
  const forgetReview = useCallback(
    (key) => {
      reviews.set(key, null)
      putReview(key, null)
    },
    [putReview],
  )
  // 审查过的改动已经不在了——没提交的都提交（或者挪走）了，没推送的都推送了——结论就没有可看的了：
  // 记录自动清掉，清单上也不再算它「审查过」。工作树本身没了（登记清理掉了）也一样。
  // 各仓库的状态是重读时才更新的，所以这件事跟着刷新、拉取、推送之后发生。
  useEffect(() => {
    if (!catalog) return
    for (const entry of reviews.list()) {
      const repo = repos.find((r) => r.id === entry.repo)
      // 这个仓库还没有可用的状态：说不准。
      if (!repo?.data) continue
      const tree = repo.data.trees?.find((t) => t.id === entry.tree)
      if (!tree) {
        // 手上是这次重读的结果、里面已经没有这棵树：它不在了。（上次留下的旧结果说了不算。）
        if (!catalog.cached && repo.state === 'ready' && !repo.error)
          forgetReview(entry.key)
      } else if (reviewGone(tree, entry.scope)) forgetReview(entry.key)
    }
    // forgetReview 只用 ref 和 setState，不会变。reviewKeys：登记里多了一条（刚发起的审查结果读回来了）也核对一次。
  }, [repos, catalog, reviewKeys])

  // ---- 已审阅的进度 ----
  // 清单行尾的那个小圆环：这棵树标过已审阅才显示，算的是默认范围（没提交的看「未提交」，否则看「未推送」）。
  // 标记是按文件的改动记的，提交之后改动没变就跟过去，所以它说的就是「眼下的改动读完了没有」。
  const [seenVersion, redrawSeen] = useReducer((n) => n + 1, 0)
  useEffect(() => viewed.subscribe(redrawSeen), [])
  const seenOf = useCallback(
    (repo, tree) => {
      const key = reviews.key(repo.id, tree)
      if (!viewed.has(key)) return null
      const files = scopeFiles(tree, defaultScope(tree))
      return files?.length ? viewed.progress(key, files) : null
    },
    // repos 变了（重读过状态）文件清单就是新的；标记有增减时换一个新函数，行尾的进度跟着重画。
    [repos, seenVersion],
  )

  // ---- 派生数据 ----
  // 筛选片上的数字说的是「点下去会列出几棵」：全部仓库时是全部的，只看一个仓库时是它自己的。
  const tally = useCallback((list, only, reviewed) => {
    const totals = Object.fromEntries(FILTER_KEYS.map((key) => [key, 0]))
    const tools = {}
    for (const repo of list)
      for (const t of repo.trees ?? []) {
        for (const name of t.tools ?? []) tools[name] = (tools[name] ?? 0) + 1
        if (only && !t.tools?.includes(only)) continue
        totals.all += 1
        for (const key of FILTER_KEYS.slice(1))
          if (FILTERS[key][1](t, { repo, reviewed })) totals[key] += 1
      }
    return { totals, tools }
  }, [])
  const allCounts = useMemo(
    () => tally(repos, tool, isReviewed),
    [repos, tool, isReviewed, tally],
  )
  const inScope = useMemo(
    () =>
      scope === 'all'
        ? allCounts
        : scoped
          ? tally([scoped], tool, isReviewed)
          : {
              totals: Object.fromEntries(FILTER_KEYS.map((key) => [key, 0])),
              tools: {},
            },
    [allCounts, scope, scoped, tool, isReviewed, tally],
  )
  const counts = inScope.totals
  const toolCounts = inScope.tools

  // 每个仓库里符合搜索、工具、状态条件的工作树，分成在用的与失效登记两组。
  const entries = useMemo(
    () =>
      repos.map((repo) => {
        const repoHit = match(needle, repo.name, repo.path, ...repo.groups)
        const hit = (repo.trees ?? []).filter(
          (t) =>
            (!tool || t.tools?.includes(tool)) &&
            (repoHit || match(needle, treeName(t), t.path, t.head)),
        )
        return {
          repo,
          live: hit
            .filter(
              (t) =>
                !t.prunable &&
                FILTERS[filter][1](t, { repo, reviewed: isReviewed }),
            )
            .sort((a, b) => compareTrees(a, b, sort === 'attention')),
          stale: hit.filter((t) => t.prunable),
        }
      }),
    [repos, needle, tool, filter, sort, isReviewed],
  )
  const arranged = useMemo(
    () =>
      arrange(
        entries.filter(
          (e) => e.live.length || e.stale.length || e.repo.state === 'error',
        ),
        sort,
      ),
    [entries, sort],
  )
  // 只有在「不加任何条件看全部」时，才把安静的仓库折叠起来。
  const canFold = scope === 'all' && filter === 'all' && !needle && !tool
  const quiet = useMemo(
    () => (canFold ? arranged.filter((e) => isQuiet(e.repo.trees)) : []),
    [arranged, canFold],
  )
  const groups = useMemo(
    () =>
      scope === 'all'
        ? arranged.filter((e) => !quiet.includes(e))
        : entries.filter((e) => e.repo.id === scope),
    [arranged, quiet, scope, entries],
  )
  const shown = quietOpen ? [...groups, ...quiet] : groups
  // 键盘上下键的行走顺序：先各仓库在用的工作树，再是展开的失效登记。
  const rows = useMemo(
    () =>
      shown.flatMap((entry) =>
        [
          ...entry.live,
          ...(filter === 'stale' || staleOpen.has(entry.repo.id)
            ? entry.stale
            : []),
        ].map((tree) => ({ repo: entry.repo, tree })),
      ),
    [shown, filter, staleOpen],
  )
  const filtered = !!needle || filter !== 'all' || !!tool
  const warnings = useMemo(
    () => [
      ...(catalog?.sources ?? [])
        .filter((source) => source.warning)
        .map((source) => `${source.name}：${source.warning}`),
      ...(catalog?.warnings ?? []).map((w) => `${w.root}：${w.message}`),
    ],
    [catalog],
  )

  const pick = useCallback(
    (repoId, tree) => {
      setSelected({ repo: repoId, path: tree.path })
      if (!split) setStack(1)
    },
    [split],
  )
  // 选中项不在可见范围时：并排布局选第一行，让详情始终有内容；窄屏则不选。
  useEffect(() => {
    if (!catalog || stacked) return
    if (
      rows.some(
        (r) => r.repo.id === selected?.repo && r.tree.path === selected?.path,
      )
    )
      return
    const first = rows[0]
    if (split && first)
      setSelected({ repo: first.repo.id, path: first.tree.path })
    else setSelected(null)
  }, [rows, split, stacked, catalog, selected])
  // 换了筛选或仓库，或者版式在并排和上下堆叠之间变了：回到清单（并排时详情栏常驻，不进返回栈；
  // 窗口拖窄变成堆叠后不该直接停在详情里）。面板刚挂上来的那一次不算：上次停在详情还是清单要接上。
  const firstStack = useRef(true)
  useEffect(() => {
    if (firstStack.current) {
      firstStack.current = false
      return
    }
    setStack(0)
  }, [scope, query, filter, tool, split])
  // 面板变宽、左侧出现仓库栏之后，筛选条上的仓库下拉就没有了，展开着的菜单跟着收起。
  useEffect(() => {
    if (rail) setPicking(false)
  }, [rail])
  // 换了仓库，清单回到顶上。面板刚挂上来的那一次不算：那一次要把清单按回上次滚到的位置。
  const firstList = useRef(true)
  useEffect(() => {
    if (firstList.current) {
      firstList.current = false
      return
    }
    listRef.current?.scrollTo?.({ top: 0 })
  }, [scope])
  // 清单滚到哪儿了：滚的时候记下来；清单重新出现（面板切回来、从详情回到清单）时按回去。
  const listTop = useRef(savedView.top)
  useLayoutEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = listTop.current
    const save = () => {
      listTop.current = el.scrollTop
      viewState.saveList({ top: el.scrollTop })
    }
    el.addEventListener('scroll', save, { passive: true })
    return () => {
      el.removeEventListener('scroll', save)
      save()
    }
  }, [hideList, stacked])
  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 4500)
    return () => clearTimeout(timer)
  }, [notice])

  const target = useMemo(() => {
    if (!selected || !catalog) return null
    const repo = repos.find((r) => r.id === selected.repo)
    if (!repo) return null
    return {
      repo,
      tree: repo.trees?.find((t) => t.path === selected.path) ?? null,
    }
  }, [repos, selected, catalog])

  // ---- 操作 ----
  const notify = useCallback(
    (text, success = false) => {
      if (services.state.notify) return services.state.notify(text, success)
      setNotice({ text, tone: success ? 'ok' : 'bad' })
    },
    [services],
  )
  // 与远端同步。获取不用确认，直接做；拉取和推送先出计划，用户确认后才执行。
  const requestSync = useCallback(
    async (repoId, tree, op) => {
      try {
        const plan = await request('sync-plan', { id: repoId, tree: tree.id })
        if (!plan[op]?.ok) {
          notify(plan[op]?.reason || '这项操作现在不能执行', false)
          return
        }
        // 获取不用确认：直接做，按钮上转圈；只有失败时才弹出输出。
        if (op === 'fetch') return runSync({ repo: repoId, tree, op, plan })
        setSync({ repo: repoId, tree, op, plan, state: 'ready' })
      } catch (error) {
        notify(`没法判断这项操作会做什么：${reason(error)}`, false)
      }
    },
    [notify],
  )
  async function runSync(current) {
    // 获取不经过对话框：成功只有一句话（提示一下），失败才把 Git 的输出留在对话框里。
    const quiet = current.op === 'fetch'
    if (!quiet) setSync({ ...current, state: 'busy', error: '' })
    try {
      const result = await request(
        'sync',
        {
          id: current.repo,
          tree: current.tree.id,
          op: current.op,
          expect: current.plan.stamp,
        },
        undefined,
        'sync',
      )
      if (quiet && result.ok) notify(result.head, true)
      else setSync({ ...current, state: 'done', result })
      // 同步过了：未推送、落后的数字和文件状态都按最新的重读。
      await retry(current.repo)
    } catch (error) {
      if (quiet) notify(`获取没有完成：${reason(error)}`, false)
      else setSync({ ...current, state: 'ready', error: reason(error) })
    }
  }

  const requestPrune = useCallback(
    async (repoId) => {
      try {
        const plan = await request('prune-plan', { id: repoId })
        if (!plan.entries.length) return notify('没有可清理的失效登记', false)
        setConfirm({ repo: repoId, plan, state: 'ready', error: '' })
      } catch (error) {
        notify(`无法预览待清理的登记：${error.message}`, false)
      }
    },
    [notify],
  )
  const newDsh = useCallback(
    async (tree) => {
      const dsh = services.state.dsh
      if (!dsh) return
      try {
        const id = await dsh.createWorkspace(tree.path)
        // 打开会话失败由宿主自己的工作区提示负责，这里不再重复一遍。
        await dsh.openWorkspace(id).catch(() => {})
      } catch (error) {
        notify(`无法在这个目录打开 DSH 会话：${reason(error)}`, false)
      }
    },
    [services, notify],
  )
  // 发起代码审查：在这个目录新开（或复用一个空白的）DSH 会话，把审查请求发进去。
  // 哪个会话在审记在本机，回到面板时据此取回结果。
  // scope 是审哪个范围的改动（见 model.js 的 SCOPES）；不写是未提交的。
  // 这个仓库自己配的审查提示词（基本那一段，见 review.js 的 reviewPrompt）；没配是空串。
  const loadPrompt = useCallback(async (repoId, signal) => {
    const value = await request('review-prompt', { id: repoId }, signal)
    return {
      prompt: typeof value.prompt === 'string' ? value.prompt : '',
      file: typeof value.file === 'string' ? value.file : '',
    }
  }, [])
  // 存这个仓库的审查提示词（空串是删掉）。存完顺手更新手上的状态：清单的右键菜单要写明「已自定义」。
  const savePrompt = useCallback(async (repoId, text) => {
    const value = await request(
      'set-review-prompt',
      { id: repoId },
      undefined,
      'prompt',
      { prompt: text },
    )
    const prompt = typeof value.prompt === 'string' ? value.prompt : ''
    setDetails((map) => {
      const entry = map.get(repoId)
      return entry?.data
        ? new Map(map).set(repoId, {
            ...entry,
            data: { ...entry.data, reviewPrompt: !!prompt },
          })
        : map
    })
    return prompt
  }, [])
  const startReview = useCallback(
    async (repoId, tree, scope = 'uncommitted') => {
      const dsh = services.state.dsh
      if (!dsh) return
      const key = reviews.key(repoId, tree)
      const stamp = stampOf(tree, scope)
      // 这个仓库自己配的审查提示词。宿主还是旧版、或者一时读不到，就用默认的。
      const custom = features?.includes('prompt')
        ? await loadPrompt(repoId)
            .then((value) => value.prompt)
            .catch(() => null)
        : null
      try {
        const session = await dsh.connect(await dsh.createWorkspace(tree.path))
        reviews.set(key, {
          session,
          at: Date.now(),
          stamp,
          scope,
          custom: !!custom,
        })
        dsh.openSession(session)
        await dsh.send(session, reviewPrompt(tree, stamp, scope, custom))
      } catch (error) {
        reviews.set(key, null)
        notify(`无法发起审查：${reason(error)}`, false)
      }
    },
    [services, notify, features, loadPrompt],
  )
  const act = useMemo(
    () => ({
      dsh: svc.dsh,
      // 宿主的会话能力还没接上、或宿主代码还是旧版时是 null，按钮和菜单项都不出现。
      review: svc.dsh && features?.includes('review') ? startReview : null,
      features,
      newDsh,
      openDsh(tree) {
        const dsh = services.state.dsh
        if (!dsh) return
        const live = tree.sessions.filter(
          (s) => s.source === 'DSH' && !s.archived,
        )
        if (!live.length) return newDsh(tree)
        try {
          dsh.openSession(live[0].id)
        } catch (error) {
          notify(`无法打开会话：${reason(error)}`, false)
        }
      },
      async openApp(repoId, tree, target) {
        const name = target.label
          .replace(/^在/, '')
          .replace(/中(打开|显示)$/, '')
        try {
          if (target.fallback) {
            await request(
              'open-folder',
              { id: repoId, tree: tree.id, target: target.target },
              undefined,
              'open',
            )
          } else if (!(await hostOpen(target.app, tree.path)))
            throw Error('宿主没有响应')
        } catch (error) {
          notify(`无法用${name}打开：${reason(error)}`, false)
        }
      },
      async openTool(tree, session, repoId) {
        if (session.source === 'DSH') {
          try {
            services.state.dsh?.openSession(session.id)
          } catch (error) {
            notify(`无法打开会话：${reason(error)}`, false)
          }
          return
        }
        // ZCode 只能打开工作区、不能定位到某个会话：先把标题复制好，方便在里面搜。
        const copied =
          session.source === 'ZCode' && session.title
            ? await writeClipboard(session.title)
            : false
        try {
          await request(
            'open-session',
            {
              id: repoId,
              tree: tree.id,
              session: session.id,
              source: session.source,
            },
            undefined,
            'navigate',
          )
          if (session.source === 'ZCode')
            notify(
              copied
                ? '已复制标题，可在 ZCode 里按标题找到原会话'
                : '已请求打开 ZCode，可按标题或 ID 查找原会话',
              true,
            )
        } catch (error) {
          notify(error.message, false)
        }
      },
      async copy(text, label, quiet) {
        const ok = await writeClipboard(text)
        if (!ok) notify('复制失败，请选中文字手动复制', false)
        else if (!quiet && label) notify(label, true)
        return ok
      },
      openReview(session) {
        try {
          services.state.dsh?.openSession(session)
        } catch (error) {
          notify(`无法打开审查会话：${reason(error)}`, false)
        }
      },
      forgetReview(repoId, tree) {
        forgetReview(reviews.key(repoId, tree))
      },
      // 「本仓库的审查提示词」。宿主还是旧版时是 null，入口不出现。
      editPrompt: features?.includes('prompt')
        ? (repoId) => setPromptFor(repoId)
        : null,
      loadPrompt,
      savePrompt,
      retryReview(repo, tree) {
        loadReviews([reviews.key(repo.id, tree)], true)
      },
      sync: requestSync,
      requestPrune,
    }),
    [
      services,
      notify,
      requestPrune,
      newDsh,
      requestSync,
      startReview,
      features,
      svc.dsh,
      loadReviews,
      putReview,
      forgetReview,
      loadPrompt,
      savePrompt,
    ],
  )
  // 右键菜单打开时读取这里：树记录、可用应用、操作。
  latest.current = {
    lookup: (repoId, path) =>
      details.get(repoId)?.data?.trees?.find((t) => t.path === path),
    // 这个仓库有没有自己的审查提示词（右键菜单的文案用）。
    prompted: (repoId) => !!details.get(repoId)?.data?.reviewPrompt,
    apps,
    act,
  }

  const runPrune = async () => {
    const current = confirm
    setConfirm({ ...current, state: 'busy', error: '' })
    try {
      const result = await request(
        'prune',
        { id: current.repo, expect: current.plan.entries.length },
        undefined,
        'prune',
      )
      setConfirm(null)
      bump((value) => value + 1)
      setNotice({
        text: `已清理 ${result.removed.length} 条失效登记`,
        tone: 'ok',
      })
    } catch (error) {
      // 期间登记变过：重新预览，让用户对着最新清单再确认一次。
      if (/重新确认/.test(error.message)) return requestPrune(current.repo)
      setConfirm({ ...current, state: 'ready', error: error.message })
    }
  }

  // ---- 键盘 ----
  const setSort = (value) => {
    setSortValue(value)
    prefs.set('sort', value)
  }
  const clearFilters = () => {
    setQuery('')
    setFilter('all')
    setTool('')
  }
  const choose = (repoId) => setScope(repoId)
  // 从清单里的入口跳到一个仓库的「本地分支」那一段（见 list.jsx）：展开它，并滚过去。
  const showBranches = (repoId) => {
    setScope(repoId)
    setBranchesOpen(true)
    setBranchJump((n) => n + 1)
  }
  const showTree = (path) => {
    clearFilters()
    setSelected({ repo: scope, path })
    if (!split) setStack(1)
  }
  const onTicket = (key) => {
    setScope('all')
    setFilter('all')
    setQuery(key)
  }
  const onKey = (event) => {
    const el = event.target
    const typing =
      el instanceof HTMLElement &&
      el.closest('input, textarea, select, [contenteditable]')
    if (event.key === 'Escape') {
      if (typing) {
        if (el === searchRef.current && query) setQuery('')
        else el.blur()
        return
      }
      if (stacked) {
        event.preventDefault()
        setStack(0)
      } else if (query) setQuery('')
      return
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') {
      event.preventDefault()
      searchRef.current?.focus()
      searchRef.current?.select()
      return
    }
    if (typing || stacked) return
    if (event.key === '/') {
      event.preventDefault()
      searchRef.current?.focus()
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const at = rows.findIndex(
        (r) => r.repo.id === selected?.repo && r.tree.path === selected?.path,
      )
      const next =
        event.key === 'ArrowDown'
          ? Math.min(rows.length - 1, at + 1)
          : Math.max(0, at - 1)
      const row = rows[next < 0 ? 0 : next]
      if (row) {
        setSelected({ repo: row.repo.id, path: row.tree.path })
        listRef.current
          ?.querySelector(`[data-path="${CSS.escape(row.tree.path)}"]`)
          ?.scrollIntoView({ block: 'nearest' })
      }
    } else if (event.key === 'Enter' && selected && !split) {
      event.preventDefault()
      setStack(1)
    }
  }

  const confirmRepo = confirm ? repos.find((r) => r.id === confirm.repo) : null
  const promptRepo = repos.find((r) => r.id === promptFor)
  const loading = refreshing || !catalog
  // 收起或展开某一栏：立刻生效，也记进偏好。
  const fold = (key, value) => {
    if (key === 'railOff') setRailOff(value)
    else setListOff(value)
    prefs.set(key, value)
  }
  return (
    <div
      ref={rootRef}
      className="wt-wrap"
      data-layout={split ? 'split' : 'stack'}
      data-busy={busy ? '' : undefined}
      style={{ '--list-w': `${listW}px` }}
      tabIndex={-1}
      onKeyDown={onKey}
      // 点在面板里没有控件的地方时，把焦点放到面板上：之后的 ↑ ↓ 仍然能换工作树
      // （焦点掉到页面上，快捷键就没人接）。
      onPointerDown={(event) => {
        if (
          !event.target.closest(
            'button, a, input, select, textarea, [contenteditable], [tabindex]',
          )
        )
          rootRef.current?.focus({ preventScroll: true })
      }}
    >
      <style>{css}</style>
      <header className="wt-top">
        <span className="wt-brand">
          <Icon size={17} />
          <h1>工作树</h1>
        </span>
        <label className="wt-search">
          <Icon name="search" size={15} />
          <input
            ref={searchRef}
            aria-label="搜索仓库、分支、工单号或路径"
            placeholder="搜索仓库、分支、工单号或路径"
            value={query}
            spellCheck={false}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button
              className="wt-iconbtn"
              aria-label="清除搜索"
              onClick={() => setQuery('')}
            >
              <Icon name="close" size={13} />
            </button>
          ) : (
            <kbd title="快捷键 ⌘F 或 /">/</kbd>
          )}
        </label>
        {busy || refreshing ? (
          <span
            className="wt-readat"
            role="status"
            title={
              resuming ? `先显示上次读到的结果：${fullTime(readAt)}` : undefined
            }
          >
            {resuming ? '正在更新…' : '正在读取…'}
          </span>
        ) : (
          catalog && (
            <span className="wt-readat" title={fullTime(readAt)}>
              读取于 {relTime(readAt, now)}
            </span>
          )
        )}
        <button
          className="wt-iconbtn"
          title="刷新：重新读取各仓库的状态（打开面板时不会自动刷新）"
          aria-label="刷新"
          disabled={loading}
          onClick={() => bump((value) => value + 1)}
        >
          <Icon name="refresh" size={16} className={loading ? 'spin' : ''} />
        </button>
        <button
          className="wt-iconbtn"
          title="这些名词是什么意思"
          aria-label="说明"
          aria-haspopup="dialog"
          onClick={() => setHelp(true)}
        >
          <Icon name="help" size={16} />
        </button>
      </header>

      {notice && !svc.notify && (
        <div className="wt-flash" data-tone={notice.tone} role="status">
          {notice.text}
        </div>
      )}
      {oldHost && !oldHostOff && (
        <div className="wt-flash is-stay" role="status">
          面板已经更新，宿主里的插件要重启 DSH 才会换：重启后才有「获取 / 拉取 /
          推送」和「AI 审查」。
          <button className="wt-linkbtn" onClick={() => setOldHostOff(true)}>
            知道了
          </button>
        </div>
      )}
      {catalogError && (
        <div className="wt-flash is-stay" data-tone="bad" role="alert">
          {catalogError}
          {catalog && ' · 下面保留上次读到的结果'}
          <button
            className="wt-linkbtn"
            onClick={() => bump((value) => value + 1)}
          >
            重试
          </button>
        </div>
      )}

      {/* 上下堆叠时正看着详情：上面没有清单，筛选条也就没有用，不占这一行。
          其余时候它一直在：只看一个仓库时数字换成这个仓库的，不因为看的是工作树还是分支而出现消失。 */}
      {!stacked && (
        <div className="wt-filters">
          {!rail && (
            <ScopeTrigger
              name={scoped?.name ?? '全部仓库'}
              path={scoped?.path}
              selected={!!scoped}
              open={picking}
              buttonRef={pickRef}
              onOpen={() => setPicking(true)}
              onClear={() => choose('all')}
            />
          )}
          <div className="wt-chips" role="group" aria-label="按状态筛选">
            {FILTER_KEYS.map((key) => (
              <button
                key={key}
                className="wt-chip"
                aria-pressed={filter === key}
                data-empty={counts[key] ? undefined : ''}
                onClick={() => setFilter(filter === key ? 'all' : key)}
              >
                {FILTERS[key][0]}
                <b>{counts[key]}</b>
              </button>
            ))}
          </div>
          <span className="wt-spacer" />
          <div className="wt-chips" role="group" aria-label="按关联工具筛选">
            <button
              className="wt-chip"
              aria-pressed={!tool}
              onClick={() => setTool('')}
            >
              全部工具
            </button>
            {TOOLS.map((name) => (
              <button
                key={name}
                className="wt-chip"
                aria-pressed={tool === name}
                data-empty={toolCounts[name] ? undefined : ''}
                onClick={() => setTool(tool === name ? '' : name)}
              >
                {name}
                <b>{toolCounts[name] ?? 0}</b>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="wt-body">
        {rail && (
          <Rail
            repos={repos}
            counts={allCounts.totals}
            scope={scope}
            choose={choose}
            onCollapse={() => fold('railOff', true)}
          />
        )}
        {!stacked && !hideList && (
          <WorkList
            scope={scope}
            repos={repos}
            groups={groups}
            quiet={quiet}
            quietOpen={quietOpen}
            staleOpen={staleOpen}
            filterStale={filter === 'stale'}
            // 筛选、搜索时仓库分组一律展开：命中的工作树不能藏在收起的分组里。
            collapsed={filtered ? NOTHING : collapsed}
            selected={split ? selected : null}
            cursor={selected?.path}
            sort={sort}
            progress={busy ? progress : { done: 1, total: 1 }}
            total={{ trees: counts.all }}
            filtered={filtered}
            now={now}
            pick={pick}
            onTicket={onTicket}
            goAll={() => choose('all')}
            setSort={setSort}
            setQuietOpen={setQuietOpen}
            toggleStale={(id) =>
              setStaleOpen((set) => {
                const next = new Set(set)
                if (!next.delete(id)) next.add(id)
                return next
              })
            }
            toggleGroup={(id) =>
              setCollapsed((set) => {
                const next = new Set(set)
                if (!next.delete(id)) next.add(id)
                return next
              })
            }
            branches={{
              open: branchesOpen,
              // 搜索时一律展开：命中的分支不能藏在收起来的那一段里。
              forced: !!needle,
              jump: branchJump,
              toggle: () => setBranchesOpen((on) => !on),
              show: showBranches,
            }}
            requestPrune={requestPrune}
            retry={retry}
            reviewOf={reviewOf}
            seenOf={seenOf}
            clearFilters={clearFilters}
            getTriggerProps={getTriggerProps}
            renderFactorySlot={renderFactorySlot}
            act={act}
            scrollRef={listRef}
            catalogEmpty={!!catalog && repos.length === 0}
            onCollapse={split ? () => fold('listOff', true) : null}
            onExpandRail={
              width >= RAIL_AT && railOff ? () => fold('railOff', false) : null
            }
            showTree={showTree}
            query={needle}
          />
        )}
        {/* 清单和详情之间的分隔线：拖着调清单宽度。 */}
        {split && !hideList && (
          <Resizer
            width={listW}
            onResize={(value) => setListW(clampList(value))}
            onCommit={(value) => {
              const next = clampList(value)
              setListW(next)
              prefs.set('listW', next)
            }}
          />
        )}
        {(split || stacked) && (
          <DetailPane
            target={target}
            loading={
              !catalog ||
              (target?.repo.state === 'loading' && !target?.repo.data)
            }
            error={target?.repo.data ? null : target?.repo.error}
            split={split}
            showRepo={scope === 'all'}
            onBack={() => setStack(0)}
            // 返回栈只在上下堆叠时有意义。并排时详情常驻，不往栈里放东西：
            // 否则窗口一拖窄，面板就直接停在详情里，看不到清单。
            onExpandList={hideList ? () => fold('listOff', false) : null}
            onTicket={onTicket}
            services={services}
            apps={apps}
            act={act}
            now={now}
            home={home}
            getTriggerProps={getTriggerProps}
            renderFactorySlot={renderFactorySlot}
            retry={retry}
            reload={retry}
            requestPrune={requestPrune}
            review={
              target?.tree
                ? (reviewMap.get(reviews.key(target.repo.id, target.tree)) ??
                  null)
                : null
            }
            retryReview={act.retryReview}
            total={{
              repos: groups.length + quiet.length,
              trees: counts.all,
              ...counts,
            }}
            warnings={warnings}
            onClear={filtered ? clearFilters : null}
            busy={busy && !hasData}
            missing={!!catalog && repos.length === 0}
          />
        )}
      </div>

      {picking && (
        <ScopeMenu
          repos={repos}
          scope={scope}
          total={allCounts.totals.all}
          anchor={pickRef.current}
          onChoose={choose}
          onClose={() => setPicking(false)}
        />
      )}
      {sync && (
        <SyncDialog job={sync} onClose={() => setSync(null)} onRun={runSync} />
      )}
      {confirm && confirmRepo && (
        <Modal
          title={`清理 ${confirm.plan.entries.length} 条失效登记`}
          onClose={() => confirm.state !== 'busy' && setConfirm(null)}
          footer={
            <>
              <button
                className="wt-btn"
                disabled={confirm.state === 'busy'}
                onClick={() => setConfirm(null)}
              >
                取消
              </button>
              <button
                className="wt-btn is-danger"
                disabled={confirm.state === 'busy'}
                onClick={runPrune}
              >
                <Icon name="broom" size={15} />
                {confirm.state === 'busy' ? '正在清理…' : '清理登记'}
              </button>
            </>
          }
        >
          <p className="wt-dtext">
            <b>{confirmRepo.name}</b>{' '}
            里下面这些工作树的目录已经不存在。清理只移除 Git
            里的登记，不会删除任何文件；目录之后如果恢复，需要重新登记为工作树。
          </p>
          <ul className="wt-prunelist">
            {confirm.plan.trees.map((tree) => (
              <li key={tree.path}>
                <span>{treeName(tree)}</span>
                <Tail
                  className="wt-prunepath"
                  title={tree.path}
                  text={homeTilde(tree.path, home)}
                />
              </li>
            ))}
          </ul>
          {confirm.error && (
            <p className="wt-notice is-danger" role="alert">
              {confirm.error}
            </p>
          )}
        </Modal>
      )}
      {promptFor && promptRepo && (
        <PromptDialog
          key={promptFor}
          repo={promptRepo}
          act={act}
          onClose={() => setPromptFor(null)}
        />
      )}
      {help && (
        <Modal title="怎么看这张清单" onClose={() => setHelp(false)} wide>
          <dl className="wt-glossary">
            <dt>工作树</dt>
            <dd>
              一份独立的检出目录和暂存区。同一仓库的工作树共享提交和分支；一棵树通常检出一个分支，
              也可以停在某次提交（分离 HEAD）。
            </dd>
            <dt>最近改动</dt>
            <dd>
              HEAD 提交时间和所有改动文件修改时间中较晚的那个，不含聊天时间。
            </dd>
            <dt>状态点</dt>
            <dd>
              分支名前面的圆点，只在这棵工作树有事可做时出现：黄色是有未提交的改动，蓝色是有未推送的提交，
              红色是冲突、合并或变基进行中、读取失败。没有圆点就是干净，或者只需要留意（比如落后上游）。
            </dd>
            <dt>行尾的数字</dt>
            <dd>
              工作树一行只写要动手的事：↑ 是未推送的提交数，↓
              是落后的提交数，带笔的是改动了多少个文件，
              红色警示是冲突或有操作做到一半，悬停能看到完整的一句话。四角星是
              AI 审查的结论，后面的数是有几处要处理（见下面的「AI
              审查」）；小圆环是「已审阅」的进度（见下面的「已审阅」）。路径、上游、分支起点、最近一次提交、工单号和
              关联工具都在选中后的详情里；清单拉宽后，行里也会带出最近改动时间和关联工具。
            </dd>
            <dt>接着上次看</dt>
            <dd>
              筛选、选中的工作树、收起的仓库、停在的页签和滚动位置都记在本机：切到别的面板再回来、或者重启之后，
              接着上次的地方看。想从头来，清除筛选、回到全部仓库就行。
            </dd>
            <dt>未提交 / 未推送</dt>
            <dd>
              详情里的「未提交」是工作目录和 HEAD
              比的改动；「未推送」是和上游比的：还没推送的提交，加上还没提交的改动。工作区是干净的、但有提交没推送时，
              改动都在「未推送」里；推送之后这个页签就没有了。
            </dd>
            <dt>已审阅</dt>
            <dd>
              读过的文件在差异标题行的右边（文件树里也有）勾上「已审阅」，键盘 V
              切换当前文件。勾上的文件会收起来，工具栏和清单行尾都有进度；之后文件又改了，会提示「有新改动」。
              只用来统计看过了哪些，不影响任何操作。
            </dd>
            <dt>分支与工作树</dt>
            <dd>
              工作树是检出某个分支的目录：清单里的一行工作树，就是「这个分支 +
              放它的目录 + 目录里还没提交的改动」。
              同一个分支同一时间只能检出到一个目录；没检出的分支只有名字和提交，没有未提交的改动可看。
              只看一个仓库时，上面是它的全部工作树；清单末尾的「本地分支」展开是这个仓库的全部分支，
              检出了的后面有「查看工作树」，其余标着「未检出」。搜索框里的词对分支名也生效。
            </dd>
            <dt>收起与展开</dt>
            <dd>
              仓库栏和工作树清单的右上角可以一键收起，把地方全让给详情。收起后，清单头上的「»」展开仓库栏，
              详情标题前的「»」展开清单（键盘 ↑ ↓
              也能换工作树）。清单和详情之间的分隔线可以拖着调宽，双击回到默认。
            </dd>
            <dt>文件树</dt>
            <dd>
              详情里所有文件的差异从上到下铺开。文件树默认是浮窗：鼠标停在左缘的把手或工具栏的「文件」上就滑出来，
              移开、选中一个文件或按 Esc
              就收回去；点一下打开的会留着，点外面才收。点图钉把它固定在左边、差异排到右边，
              互不遮挡（文件区够宽时才行）；再点一次变回浮窗。工具栏最右边的两个按钮切换左右并排和自动换行，
              对整个文件区生效，不用每个文件各选一遍。
            </dd>
            <dt>关联工具</dt>
            <dd>
              按会话目录匹配到的 Codex / ZCode / DSH
              会话。这是目录关联，不是在线状态；字母高亮表示最近 30
              分钟内有会话更新，或会话正在运行。
            </dd>
            <dt>上游</dt>
            <dd>
              ↑ 是未推送的提交数，↓ 是落后的提交数，都按本地记录比较，面板不联网
              fetch。「未设上游」不等于没推送。
            </dd>
            <dt>获取、拉取、推送</dt>
            <dd>
              都只针对当前分支。获取只更新远端分支的本地记录；拉取只做快进，不能快进时什么都不改；推送不强推，
              远端有本地没有的提交时会被拒绝。拉取和推送执行前会先告诉你将做什么。数字按本地记录计算，获取之后才准。
            </dd>
            <dt>AI 审查</dt>
            <dd>
              在这个目录新开一个 DSH
              会话，让它只读地审查改动：停在「未提交」页签上审的是未提交的，停在「未推送」上审的是还没推到远端的。
              它只报要动手的结论：必须处理的问题，和建议。发起后这棵工作树的行尾有一个四角星：转圈是还在审，
              审完按结论着色（绿是没有问题，琥珀是有修改建议，红是有必须处理的问题），星后面的数是有几处要处理，
              悬停能看到一句话的结论。清单上方的「审查过」能把做过审查的工作树单独筛出来。
              详情里页签下面是结论条；对应的文件页签里，有问题的改动旁边标着结论（差异够宽时在右边一栏，
              窄时在这一行下面），「审查结果」页签里按文件列出全部结论。结论条上的「复制结论」把还没审阅的文件里的结论
              复制成一段话，可以直接贴给 AI
              去改（已审阅的文件不复制）。审查之后改动又变了，会提示批注位置可能不准；
              审过的改动全都提交（或推送）了，这次审查的记录自动清掉。想重来点「重新审查」，不想留点「清除记录」。
              每个仓库可以在右键菜单的「本仓库的审查提示词」里，换掉默认的「审什么、重点找什么」；范围、只读约束和输出格式
              不跟着换。
            </dd>
            <dt>读取于</dt>
            <dd>
              清单和各仓库的状态是那一刻读到的。打开面板时直接显示上次留下的结果，不会自动重读；要看最新的点右上角的刷新。
              拉取、推送、清理登记之后，相关的仓库会自动重读。
            </dd>
            <dt>失效登记</dt>
            <dd>
              目录已经不存在、但 Git
              仍保留的工作树登记。可以清理，清理不会删除任何文件。
            </dd>
            <dt>工单色标</dt>
            <dd>
              从分支名里取出的工单号。同一个需求在多个仓库的工作树同色，点它只看这个需求的工作树。
            </dd>
          </dl>
        </Modal>
      )}
    </div>
  )
}
