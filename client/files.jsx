// 文件改动区：右边把所有文件的差异从上到下铺开，滚动着看；左边是文件树，用来一眼看全改了哪些文件、跳到某个文件。
// 文件树有两种形态，由用户用图钉切换（记在本机）：
//   浮窗  平时收成左缘一条把手，鼠标停上去（或点一下）滑出来盖在差异上，鼠标移开、选中文件或按 Esc 就收回去；
//   固定  文件区够宽时占住左边一栏，差异排在右边，互不遮挡。
// 左右并排、自动换行是整个文件区的设置：在顶上的工具栏里切一次，所有差异一起变（也记在本机）。
// 一个范围（未提交，或者和上游比的「未推送」）一份。读过的文件可以标成「已审阅」：标了的收起来，工具栏上有进度；
// 只做统计，不挡任何操作。停在哪（怎么筛的、滚到哪个文件）也记在本机，回到这棵工作树时接着看。
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { Ring, Tail, useWidth } from './bits.jsx'
import { DiffView } from './diff-view.jsx'
import { Icon } from './icons.jsx'
import { prefs } from './hub.js'
import { fileBadge, fileFilters, groupFiles, match } from './model.js'
import { digestOf, progressOf, viewed, viewedStateOf } from './viewed.js'

// 固定成左右两栏时，文件区至少要这么宽：左边目录至少 200px，右边差异还要放得下。
const DOCK_AT = 560
const TREE_MIN = 200
const TREE_MAX = 280
// 文件不超过这么多时目录默认全展开；再多先收着。
const TREE_FLAT_MAX = 400
// 默认展开的差异累计到这么多行就停，再往下的文件先收着，保持可扫。有批注的文件总是展开。
const AUTO_LINES = 1500
// 文件多的时候不一次读完全部差异：滚到附近再读。
const NEAR = 900
// 浮窗：鼠标停到把手或按钮上这么久才展开（只是路过左边时不弹出来）；离开这么久才收起。
const OPEN_DELAY = 140
const CLOSE_DELAY = 220
// 和样式里收起的动画一样长：动画放完才卸掉内容。
const CLOSE_MS = 160
// 把某个文件按到指定位置时最多盯这么久：差异是陆续读进来的，高度一直在变。
const SETTLE_TRIES = 40
const NO_REMEMBER = { area() {} }

const weight = (file) =>
  file.xy === '??' ? (file.lines ?? 20) : (file.add ?? 20) + (file.del ?? 20)
// 默认展开的差异：累计在预算内的，加上有批注的。标成已审阅的不展开——读过了。
const autoOpen = (files, noted, stateOf) => {
  const open = new Set()
  let used = 0
  for (const file of files) {
    if (stateOf?.(file) === 'viewed') continue
    if (noted(file)) open.add(file.id)
    else {
      used += weight(file)
      if (used <= AUTO_LINES) open.add(file.id)
    }
  }
  return open
}
// 两份名单的内容一样（不看是不是同一个对象）。
const sameIds = (a, b) => a.size === b.size && [...a].every((id) => b.has(id))
// 目录展没展开：用户点过的优先；没点过的看默认（筛选时全展开）。
const expandedIn = (dirs, key, filtered) =>
  dirs.off.has(key) ? false : dirs.on.has(key) ? true : filtered || dirs.all
// 文件在树里的先后顺序（同层目录在前、文件在后），铺开的差异按这个顺序排。
function flatten(node, out = []) {
  for (const dir of node.dirs) flatten(dir, out)
  for (const file of node.files) out.push(file)
  return out
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

// 这个文件上有几条审查批注、最重的是哪一档。
const RANK = { fix: 2, warn: 1, info: 0 }
function NoteCount({ notes }) {
  if (!notes?.length) return null
  const level = notes.reduce(
    (top, note) => (RANK[note.level] > RANK[top] ? note.level : top),
    'info',
  )
  return (
    <span
      className="wt-fnote"
      data-level={level}
      title={`${notes.length} 条审查批注`}
    >
      <Icon name="comment" size={11} />
      {notes.length}
    </span>
  )
}

// 滚到附近才把内容挂上：一次展开几十个文件时，不必同时读几十份差异。
function Near({ children, placeholder }) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }
    const root = el.closest('.wt-diffstack')
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true)
          observer.disconnect()
        }
      },
      { root, rootMargin: `${NEAR}px 0px` },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref}>{near ? children : placeholder}</div>
}

// 「已审阅」的勾选：差异的标题行、收起来的文件行、文件树里用的是同一个。
//   viewed   审阅过，之后没再改；changed 审阅过、之后又改了（琥珀色的一点）；unviewed 还没审阅。
function Reviewed({ file, state, onChange, bare = false }) {
  return (
    <label
      className={'wt-reviewed' + (bare ? ' is-bare' : '')}
      data-state={state}
      title={
        state === 'viewed'
          ? '已审阅。点一下取消'
          : state === 'changed'
            ? '审阅之后这个文件又有改动。点一下重新标为已审阅'
            : '看过了：标为已审阅（键盘 V 切换当前文件）'
      }
    >
      <input
        type="checkbox"
        checked={state === 'viewed'}
        aria-label={`将 ${file.path} 标记为已审阅`}
        onChange={(event) => onChange(file, event.target.checked)}
      />
      <span className="wt-reviewedbox" aria-hidden="true">
        {state === 'viewed' && <Icon name="check" size={11} />}
      </span>
      {!bare && <span className="wt-reviewedlabel">已审阅</span>}
    </label>
  )
}

// 这棵工作树记着的「已审阅」（路径摘要 → 指纹）。标记有增减时重新取。
function useMarks(tree, files) {
  const [, redraw] = useReducer((n) => n + 1, 0)
  useEffect(() => viewed.subscribe(redraw), [])
  return useMemo(() => viewed.marksOf(tree), [tree, files, viewed.version])
}

// 文件树里的一个文件：勾「已审阅」，或者点它滚到右侧它的差异。
// 文件多的树里，滚动差异时会频繁换「当前文件」：只让换到的那两行重画，其余的行直接沿用。
const FileRow = memo(function FileRow({
  file,
  badge,
  depth,
  notes,
  state,
  pick,
  active,
  onReviewed,
}) {
  return (
    <div
      className="wt-filewrap"
      style={{ '--depth': depth }}
      data-file={file.id}
      data-viewed={state}
    >
      <Reviewed file={file} state={state} onChange={onReviewed} bare />
      <button
        type="button"
        className="wt-file"
        data-active={active ? '' : undefined}
        title={`${file.path} · ${badge.detail}`}
        onClick={() => pick(file)}
      >
        <span className="wt-badge" data-tone={badge.tone}>
          {badge.code}
        </span>
        <span className="wt-fname">
          {depth ? base(file.path) : file.path}
          {file.from && <small> ← {base(file.from)}</small>}
        </span>
        <NoteCount notes={notes} />
        <Stats file={file} />
      </button>
    </div>
  )
})

// 文件树的一段：目录可折叠，文件排在目录后面。
function Node({
  node,
  prefix,
  depth,
  badges,
  isOpen,
  toggleDir,
  pick,
  notesFor,
  active,
  stateOf,
  onReviewed,
}) {
  return (
    <>
      {node.dirs.map((dir) => {
        const key = prefix + dir.name
        const expanded = isOpen(key)
        const totals = sum(dir)
        return (
          <div className="wt-dirwrap" key={key}>
            <button
              type="button"
              className="wt-dir"
              style={{ '--depth': depth }}
              aria-expanded={expanded}
              onClick={() => toggleDir(key)}
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
                toggleDir={toggleDir}
                pick={pick}
                notesFor={notesFor}
                active={active}
                stateOf={stateOf}
                onReviewed={onReviewed}
              />
            )}
          </div>
        )
      })}
      {node.files.map((file) => (
        <FileRow
          key={file.path}
          file={file}
          badge={badges.get(file.path)}
          depth={depth}
          notes={notesFor?.get(file.id)}
          state={stateOf(file)}
          pick={pick}
          active={active === file.id}
          onReviewed={onReviewed}
        />
      ))}
    </>
  )
}

function Search({ query, setQuery }) {
  return (
    <label className="wt-minisearch">
      <Icon name="search" size={13} />
      <input
        aria-label="筛选文件"
        placeholder="筛选文件"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          type="button"
          className="wt-iconbtn"
          aria-label="清除筛选"
          onClick={() => setQuery('')}
        >
          <Icon name="close" size={12} />
        </button>
      )}
    </label>
  )
}

function Filters({ filter, setFilter, counts, filters }) {
  return (
    <div className="wt-seg wt-seg-sm" role="tablist">
      {Object.entries(filters).map(([key, [label]]) => (
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
  )
}

// live 为假表示这个页签眼下没显示（切到了别的页签）：浮窗收起来，不留一个看不见的浮层。
// remember 把这个范围停在哪记下来（见 viewstate.js）。
export function FileArea({
  tree,
  repository,
  scope = 'uncommitted',
  notesFor,
  live = true,
  remember = NO_REMEMBER,
}) {
  const s = tree.status
  const data = scope === 'outgoing' ? s.outgoing : s
  const all = data.files
  const total = data.total
  const filters = fileFilters(scope)
  const [rootRef, width] = useWidth()
  // 图钉：固定还是浮窗，记在本机。
  const [pinned, setPinned] = useState(
    () => prefs.get('tree', 'float') === 'pin',
  )
  const docked = pinned && width >= DOCK_AT
  const canPin = width >= DOCK_AT
  const treeW = Math.round(
    docked
      ? Math.min(TREE_MAX, Math.max(TREE_MIN, width * 0.32))
      : Math.min(TREE_MAX, Math.max(180, width - 48)),
  )
  // 左侧文件树占了 treeW；差异够不够左右并排，要看右边剩多少。
  const diffWide = docked ? width - treeW >= 660 : width >= 680
  const treeId = `wt-tree-${tree.id.slice(0, 8)}`

  // ---- 看到哪儿了：记下来，回到这棵工作树时接着看 ----
  const [saved] = useState(() => remember.get().scopes[scope])
  const keep = useCallback(
    (patch) => remember.area(scope, patch),
    [remember, scope],
  )
  const keepNow = useRef(keep)
  keepNow.current = keep

  // ---- 已审阅 ----
  const key = `${repository}:${tree.id}`
  const marks = useMarks(key, all)
  const digests = useMemo(
    () => new Map(all.map((file) => [file.path, digestOf(file)])),
    [all],
  )
  const stateOf = useCallback(
    (file) => viewedStateOf(marks, file, digests.get(file.path)),
    [marks, digests],
  )

  // ---- 看差异的方式：整个文件区一套，在工具栏里切 ----
  const [split, setSplitOn] = useState(() => prefs.get('split', false) === true)
  // 换行没设过时跟着宽度走：差异够宽就不换行。
  const [wrapSet, setWrapSet] = useState(() => {
    const saved = prefs.get('wrap', null)
    return typeof saved === 'boolean' ? saved : null
  })
  const wrap = wrapSet === null ? !diffWide : wrapSet
  const setSplit = (on) => {
    setSplitOn(on)
    prefs.set('split', on)
    // 并排后每栏只剩一半宽；长行不换行会把右栏挤出屏幕，所以切到并排时顺带换行。
    if (on && !wrap) {
      setWrapSet(true)
      prefs.set('wrap', true)
    }
  }
  const setWrap = (on) => {
    setWrapSet(on)
    prefs.set('wrap', on)
  }

  // ---- 浮窗的开与关 ----
  // open：正在显示；held：点按或键盘打开的，不随鼠标离开收起。
  // mounted：内容挂着的时长比 open 多一段收起的动画。
  const [float, setFloat] = useState({ open: false, held: false })
  const [mounted, setMounted] = useState(false)
  const latest = useRef(float)
  latest.current = float
  const inside = useRef({ panel: false, trigger: false })
  const timer = useRef(0)
  const unmount = useRef(0)
  // 焦点的交接要等界面画完（比如取消固定之后触发按钮才出现）：记下要交给谁、什么时候提的。
  const wantFocus = useRef(null)
  // 最近一次按下用的是鼠标还是手指：触屏点开浮窗时不把焦点放进搜索框（会立刻弹出软键盘）。
  const pointer = useRef('mouse')
  const pinnedNow = useRef(pinned)
  pinnedNow.current = pinned
  const triggerRef = useRef(null)
  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const stackRef = useRef(null)
  const treeRef = useRef(null)

  const show = (held, focus) => {
    clearTimeout(timer.current)
    clearTimeout(unmount.current)
    setMounted(true)
    setFloat({ open: true, held })
    if (focus && pointer.current !== 'touch') askFocus('search')
  }
  const hide = (focus) => {
    clearTimeout(timer.current)
    clearTimeout(unmount.current)
    setFloat({ open: false, held: false })
    unmount.current = setTimeout(() => setMounted(false), CLOSE_MS)
    // 焦点还在浮窗里：交还给触发按钮，不让它掉回页面开头。
    if (focus && panelRef.current?.contains(document.activeElement))
      askFocus('trigger')
  }
  // 只认已经到手、而且属于眼下这种摆法的元素；过了一会儿还没办成就作废，
  // 免得用户已经点到别处之后突然抢焦点。
  const askFocus = (where) => {
    wantFocus.current = { where, at: Date.now() }
  }
  useEffect(() => {
    const want = wantFocus.current
    if (!want) return
    if (Date.now() - want.at > 600) {
      wantFocus.current = null
      return
    }
    const target = {
      search: () => panelRef.current?.querySelector('input'),
      trigger: () => (pinnedNow.current ? null : buttonRef.current),
      pin: () =>
        pinnedNow.current ? panelRef.current?.querySelector('.wt-pin') : null,
    }[want.where]()
    if (!target) return
    target.focus({ preventScroll: true })
    wantFocus.current = null
  })
  useEffect(() => {
    clearTimeout(unmount.current)
    return () => clearTimeout(unmount.current)
  }, [])

  const mouse = (event) => event.pointerType === 'mouse'
  const enter = (spot) => (event) => {
    if (!mouse(event)) return
    inside.current[spot] = true
    clearTimeout(timer.current)
    if (!docked && !latest.current.open)
      timer.current = setTimeout(() => show(false), OPEN_DELAY)
  }
  const leave = (spot) => (event) => {
    if (!mouse(event)) return
    inside.current[spot] = false
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const { open, held } = latest.current
      const focus = document.activeElement
      // 正在浮窗的搜索框里打字时不收：鼠标挪开也不打断输入。
      const typing =
        focus?.tagName === 'INPUT' && panelRef.current?.contains(focus)
      if (
        open &&
        !held &&
        !typing &&
        !inside.current.panel &&
        !inside.current.trigger
      )
        hide(true)
    }, CLOSE_DELAY)
  }
  // 固定成两栏之后浮窗就没有意义了：收掉。
  useEffect(() => {
    if (docked) hide(false)
    // hide 只用 ref 和 setState，不会变。
  }, [docked])
  useEffect(() => {
    if (!live) hide(false)
  }, [live])
  // 点在文件区外面也收起（点按打开的那种）。
  useEffect(() => {
    if (!float.open) return
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) hide(true)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () =>
      document.removeEventListener('pointerdown', onPointerDown, true)
  }, [float.open])
  // 浮窗开着时 Esc 一定收得起它，不管焦点在不在面板里（鼠标停出来的浮窗，焦点常常还在别处）。
  // 在捕获阶段拦下来：外层的「返回」「清除搜索」不再跟着响应这一次 Esc。
  useEffect(() => {
    if (!float.open) return
    const onEsc = (event) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      hide(true)
    }
    document.addEventListener('keydown', onEsc, true)
    return () => document.removeEventListener('keydown', onEsc, true)
  }, [float.open])
  // 点开之后要不要把焦点放进搜索框：键盘激活的要（click.detail 为 0），触屏点的不要。
  const byKeyboard = (event) =>
    event.detail === 0 || pointer.current !== 'touch'
  // 换摆法时差异区的宽度会变（换行重排）：记下眼下停在哪个文件、离顶多远，换完把它按回原处。
  const keepAt = useRef(null)
  useEffect(() => {
    const place = () => {
      const el = stackRef.current
      const keep = keepAt.current
      keepAt.current = null
      const card = el?.querySelector(
        `[data-file="${CSS.escape(keep?.file ?? '')}"]`,
      )
      if (!card) return
      el.scrollTop +=
        card.getBoundingClientRect().top -
        el.getBoundingClientRect().top -
        keep.offset
    }
    // 等布局换完（浮窗收起的动画、差异的换行重排）。
    const timer = setTimeout(place, 220)
    return () => clearTimeout(timer)
  }, [docked])
  const togglePin = () => {
    const next = !pinned
    // 眼下露在顶上的第一个文件（哪怕只露出一点）。
    const el = stackRef.current
    if (el) {
      const edge = el.getBoundingClientRect().top + 36
      for (const card of el.querySelectorAll('.wt-stackcard'))
        if (card.getBoundingClientRect().bottom > edge) {
          keepAt.current = {
            file: card.dataset.file,
            offset:
              card.getBoundingClientRect().top - el.getBoundingClientRect().top,
          }
          break
        }
    }
    setPinned(next)
    prefs.set('tree', next ? 'pin' : 'float')
    if (!next) {
      // 取消固定：变回浮窗，并且收起来。
      hide(true)
    } else if (panelRef.current?.contains(document.activeElement)) {
      // 固定成两栏后文件树换了位置，图钉是新的：焦点跟过去，键盘操作不中断。
      askFocus('pin')
    }
  }
  const pinTitle = pinned
    ? docked
      ? '取消固定：文件树变回浮窗，鼠标移开就收起'
      : '已固定，但文件区现在不够宽（约 560px 以上才行），暂时还是浮窗'
    : canPin
      ? '固定：文件树常驻在左边，差异排在右边，互不遮挡'
      : '文件区够宽（约 560px 以上）才能把文件树固定成左右两栏'

  // ---- 文件清单 ----
  const badges = useMemo(
    () => new Map(all.map((file) => [file.path, fileBadge(file)])),
    [all],
  )
  const [filter, setFilter] = useState(() =>
    Object.hasOwn(filters, saved.filter) ? saved.filter : 'all',
  )
  const [query, setQuery] = useState(saved.query)
  // 目录默认全展开：一眼看到改了什么。文件多到几百个时先收着——几千行一次画出来会卡一下，
  // 先看目录和数量，要看的目录再点开（筛选、搜索时命中项所在的目录照常自动展开）。
  const [dirs, setDirs] = useState(() =>
    saved.dirs
      ? {
          all: saved.dirs.all,
          off: new Set(saved.dirs.off),
          on: new Set(saved.dirs.on),
        }
      : { all: all.length <= TREE_FLAT_MAX, off: new Set(), on: new Set() },
  )
  // 目录是不是用户动过：动过的才记下来，没动过的下次按文件数重新定。
  const touched = useRef(false)
  const noted = useCallback(
    (file) => !!notesFor?.get(file.id)?.length,
    [notesFor],
  )
  // 展开着差异的文件，以及这份名单是怎么来的：
  //   auto   默认规则（累计在预算内的，加上有批注的），清单变了就重新算；
  //   all    用户点了「全部展开」，清单变了也保持全展开；
  //   custom 用户自己点过某个文件、标过已审阅或点了「全部收起」，名单只跟着他点的走。
  const [how, setHow] = useState(saved.how || 'auto')
  const [open, setOpen] = useState(() =>
    saved.how && saved.how !== 'auto'
      ? new Set(saved.open)
      : autoOpen(all, noted, stateOf),
  )
  const [active, setActive] = useState(null)
  const activeNow = useRef(active)
  activeNow.current = active

  // 筛选和搜索对文件树与右侧的差异同时生效：只留符合的文件，专心看这一部分。
  const filtered = filter !== 'all' || query.trim() !== ''
  const clear = () => {
    setFilter('all')
    setQuery('')
  }
  // 筛选结果只在条件变化时重算：每次渲染都得到一份新的清单，会让下面跟着清单走的副作用不停地重画。
  const files = useMemo(
    () =>
      all.filter(
        (file) =>
          filters[filter][1](file) && match(query, file.path, file.from),
      ),
    [all, filters, filter, query],
  )
  const root = useMemo(() => groupFiles(files), [files])
  const ordered = useMemo(() => flatten(root), [root])
  // 筛选或搜索时命中项散在各个目录里，目录跟着展开，否则会「筛出了结果却看不见」。
  const isOpen = useCallback(
    (key) => expandedIn(dirs, key, filtered),
    [dirs, filtered],
  )
  const dirsAll = filtered || (dirs.all && !dirs.off.size)
  const toggleDir = useCallback(
    (key) => {
      touched.current = true
      setDirs((state) => {
        const on = new Set(state.on),
          off = new Set(state.off)
        if (expandedIn(state, key, filtered)) {
          on.delete(key)
          off.add(key)
        } else {
          off.delete(key)
          on.add(key)
        }
        return { ...state, on, off }
      })
    },
    [filtered],
  )
  const setDirsAll = (expand) => {
    touched.current = true
    setDirs({ all: expand, on: new Set(), off: new Set() })
  }
  // 怎么筛的、哪些是自己点开点收的：记下来，回到这棵工作树时接着看。
  // 按默认规则算的名单不记（下次照规则重算）；目录只在动过之后才记。
  useEffect(() => {
    keep({
      filter,
      query,
      ...(how === 'auto' ? { how: 'auto' } : { how, open: [...open] }),
      ...(touched.current
        ? { dirs: { all: dirs.all, on: [...dirs.on], off: [...dirs.off] } }
        : {}),
    })
  }, [keep, filter, query, how, open, dirs])

  // 清单（筛选、搜索）或批注变了：按名单的来路重新决定哪些展开。
  useEffect(() => {
    // 内容没变就沿用原来那份名单：换一个新的等于多画一轮。
    setOpen((old) => {
      const next =
        how === 'all'
          ? new Set(ordered.map((file) => file.id))
          : how === 'auto'
            ? autoOpen(ordered, noted, stateOf)
            : old
      return next === old || sameIds(old, next) ? old : next
    })
    // open 故意不进依赖：它是这里的结果，不是原因。
  }, [ordered, noted, how, stateOf])
  const toggleFile = useCallback((file) => {
    setHow('custom')
    setOpen((old) => {
      const next = new Set(old)
      if (!next.delete(file.id)) next.add(file.id)
      return next
    })
  }, [])
  const diffsAll =
    ordered.length > 0 && ordered.every((file) => open.has(file.id))
  const setDiffsAll = (expand) => {
    setHow(expand ? 'all' : 'custom')
    setOpen(expand ? new Set(ordered.map((file) => file.id)) : new Set())
  }

  // 换了筛选或搜索，原来滚到的那个文件可能已经不在列表里。
  useEffect(() => setActive(null), [filter, query])

  // 把某个文件的卡片放到离差异区顶上 gap 的位置。
  // 上面的卡片要滚到附近才真正展开（之前只占一个大概的高度），一跳过去它们会跟着展开，把目标往下推。
  // 所以跳过去之后盯一小会儿：目标挪了就再按回去，位置稳住或者用户自己动了才停。
  const settle = (fileId, gap, onDone) => {
    const el = stackRef.current
    if (!el) return
    const selector = `[data-file="${CSS.escape(fileId)}"]`
    const place = () => {
      const card = el.querySelector(selector)
      // 这个文件已经不在清单里了。
      if (!card) return null
      // 让开顶上常驻的那条工具栏：文件的标题行正好落在它下面，第一行差异不被盖住。
      const top =
        card.getBoundingClientRect().top -
        el.getBoundingClientRect().top +
        el.scrollTop -
        gap
      const moved = Math.abs(top - el.scrollTop) > 2
      if (moved) el.scrollTop = top
      return !moved
    }
    let done = false,
      stable = 0,
      tries = 0
    const events = ['wheel', 'pointerdown', 'touchstart', 'keydown']
    const stop = () => {
      if (done) return
      done = true
      for (const name of events) el.removeEventListener(name, stop)
      onDone?.()
    }
    for (const name of events)
      el.addEventListener(name, stop, { passive: true })
    const tick = () => {
      if (done) return
      const still = place()
      if (still === null) return stop()
      if (tries++ > SETTLE_TRIES || stable >= 6) return stop()
      stable = still ? stable + 1 : 0
      setTimeout(tick, 80)
    }
    tick()
  }

  // ---- 已审阅：标一个、全标、全清 ----
  // 标成已审阅的文件收起来（读完了，下一个跟上），取消标记就重新展开——和 DSH 侧栏、GitHub 的 Viewed 一样。
  const setReviewed = useCallback(
    (file, value) => {
      if (!viewed.mark(key, all, file.path, value)) return
      setHow('custom')
      setOpen((old) => {
        const next = new Set(old)
        if (value) next.delete(file.id)
        else next.add(file.id)
        return next
      })
      if (!value) return
      // 读差异时文件的标题早滚过顶了：收完把这一行拉回顶上，看得到自己刚标的是哪个、接着是哪个。
      const el = stackRef.current
      const card = el?.querySelector(`[data-file="${CSS.escape(file.id)}"]`)
      if (
        card &&
        card.getBoundingClientRect().top < el.getBoundingClientRect().top + 36
      )
        settle(file.id, 36)
    },
    [key, all],
  )
  // 眼下显示的文件里的进度。审阅后又改了的不算已审阅。
  const progress = useMemo(() => progressOf(ordered, marks), [ordered, marks])
  const setReviewedAll = (value) => {
    if (!viewed.markAll(key, all, value)) return
    if (value) {
      setHow('custom')
      setOpen(new Set())
    } else {
      // 全部取消：回到默认规则，没读过的照旧展开。
      setHow('auto')
    }
  }
  // 键盘 V：标的是焦点所在的那个文件（标题行、文件树里点的）；焦点不在具体文件里就是露在顶上的那个。
  const keyNow = useRef(null)
  keyNow.current = (event) => {
    if (
      event.key.toLowerCase() !== 'v' ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.nativeEvent?.isComposing
    )
      return
    const el = event.target
    if (
      !(el instanceof Element) ||
      el.closest('input, textarea, select, [contenteditable]')
    )
      return
    const card =
      rootRef.current?.contains(el) && el.closest('[data-file]')
        ? el.closest('[data-file]')
        : null
    const file =
      all.find((item) => item.id === card?.dataset.file) ??
      all.find((item) => item.id === activeNow.current) ??
      ordered[0]
    if (!file) return
    event.preventDefault()
    setReviewed(file, stateOf(file) !== 'viewed')
  }
  useEffect(() => {
    // 只有正显示着的那个范围接 V：两个范围的文件区是同时挂着的。
    if (!live) return
    const wrap = rootRef.current?.closest('.wt-wrap')
    if (!wrap) return
    const onKey = (event) => keyNow.current?.(event)
    wrap.addEventListener('keydown', onKey)
    return () => wrap.removeEventListener('keydown', onKey)
  }, [live])

  // ---- 右侧的差异滚到哪个文件了 ----
  // 文件树里跟着高亮；停在哪也记下来，回到这棵工作树时按回去。
  const anchor = useRef({ file: null, offset: 0, at: 0 })
  // 上次停着的文件按回原位之前，不记新的位置（刚挂上来时量到的是最上面那个）。
  const restored = useRef(false)
  const ready = width > 0
  useEffect(() => {
    const el = stackRef.current
    if (!el) return
    // 滚动事件本来就每个画面最多来一次，直接量，不再等 requestAnimationFrame（标签页在后台时它不来）。
    const track = () => {
      const box = el.getBoundingClientRect()
      const line = box.top + 56
      let current = null,
        top = 0
      for (const card of el.querySelectorAll('.wt-stackcard')) {
        const at = card.getBoundingClientRect().top
        if (at > line) break
        current = card.dataset.file
        top = Math.round(at - box.top)
      }
      setActive(current)
      if (!current || !restored.current) return
      // 在同一个文件里来回滚，不用每一下都记。
      const now = Date.now()
      if (current === anchor.current.file && now - anchor.current.at < 400)
        return
      anchor.current = { file: current, offset: top, at: now }
      keepNow.current({ anchor: { file: current, offset: top } })
    }
    track()
    el.addEventListener('scroll', track, { passive: true })
    return () => {
      el.removeEventListener('scroll', track)
      // 面板关掉、换到别的工作树时，最后停的位置可能是几百毫秒内滚出来的：补记一次。
      if (anchor.current.file)
        keepNow.current({
          anchor: {
            file: anchor.current.file,
            offset: anchor.current.offset,
          },
        })
    }
  }, [ready])
  // 回到这棵工作树：把上次露在顶上的那个文件按回原处。
  useEffect(() => {
    if (!ready) return
    if (saved.anchor?.file)
      settle(saved.anchor.file, saved.anchor.offset, () => {
        restored.current = true
      })
    else restored.current = true
    // 只在量到宽度的那一次做。
  }, [ready])
  // 固定成两栏时，文件树也跟着滚到那个文件。
  useEffect(() => {
    if (!docked || !active) return
    treeRef.current
      ?.querySelector(`[data-file="${CSS.escape(active)}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [active, docked])
  // 点文件树里的文件：滚到它的差异（收着的先展开）。浮窗里点的，顺手把浮窗收起。
  const openNow = useRef(open)
  openNow.current = open
  const dockedNow = useRef(docked)
  dockedNow.current = docked
  const hideNow = useRef(hide)
  hideNow.current = hide
  const goTo = useCallback((file, fromTree = false) => {
    if (!openNow.current.has(file.id)) {
      setHow('custom')
      setOpen((old) => new Set(old).add(file.id))
    }
    if (fromTree && !dockedNow.current) hideNow.current(true)
    settle(file.id, 36)
  }, [])
  const pick = useCallback((file) => goTo(file, true), [goTo])
  const step = (offset) => {
    const at = ordered.findIndex((file) => file.id === active)
    const next = ordered[(at + offset + ordered.length * 2) % ordered.length]
    if (next) goTo(next)
  }

  // 各个筛选条件下有几个文件。
  const counts = useMemo(() => {
    const out = { all: 0 }
    for (const name of Object.keys(filters))
      if (name !== 'all') out[name] = all.filter(filters[name][1]).length
    return out
  }, [all, filters])
  const rows = (
    <Node
      node={root}
      prefix=""
      depth={0}
      badges={badges}
      isOpen={isOpen}
      toggleDir={toggleDir}
      pick={pick}
      notesFor={notesFor}
      active={active}
      stateOf={stateOf}
      onReviewed={setReviewed}
    />
  )
  const empty = <p className="wt-emptyline">没有符合筛选条件的文件。</p>
  const limited = total > all.length && (
    <p className="wt-emptyline">
      只列出前 {all.length} 项，共 {total} 项。
    </p>
  )

  // 一个文件的差异。看差异的方式变了（并排、换行、批注来了、已审阅变了）才需要重新给出这一段。
  const renderDiff = useCallback(
    (file, badge, reviewed) => (
      <DiffView
        file={file}
        repository={repository}
        tree={tree.id}
        // 新文件没有旧的一侧，并排只会空出半栏：即使开了并排，也照常上下对照。
        split={split && file.xy !== '??'}
        wrap={wrap}
        title={
          <div className="wt-diffhead">
            <button
              type="button"
              className="wt-back"
              onClick={() => toggleFile(file)}
              aria-label="收起差异"
              title="收起差异"
            >
              <Icon name="chevron" size={14} className="is-open" />
            </button>
            <span
              className="wt-badge"
              data-tone={badge.tone}
              title={badge.detail}
            >
              {badge.code}
            </span>
            <Tail className="wt-difftitle" title={file.path} text={file.path} />
            {file.from && (
              <span className="wt-difffrom" title={`原路径：${file.from}`}>
                ← {base(file.from)}
              </span>
            )}
            {reviewed === 'changed' && (
              <small className="wt-tag wt-tag-changed">有新改动</small>
            )}
          </div>
        }
        notes={notesFor?.get(file.id)}
        tools={<Reviewed file={file} state={reviewed} onChange={setReviewed} />}
      />
    ),
    [repository, tree.id, split, wrap, notesFor, toggleFile, setReviewed],
  )
  const panelProps = {
    id: treeId,
    ref: panelRef,
    className: 'wt-treepanel',
    role: 'complementary',
    'aria-label': '文件列表',
  }

  // 文件树：固定的左栏和浮窗里画的是同一份。
  const treePanel = (props) => (
    <div {...props}>
      <div className="wt-treehead">
        <span className="wt-listtitle">
          文件<b>{total}</b>
        </span>
        <span className="wt-spacer" />
        <button
          type="button"
          className="wt-iconbtn"
          title={dirsAll ? '收起全部目录' : '展开全部目录'}
          aria-label={dirsAll ? '收起全部目录' : '展开全部目录'}
          aria-pressed={dirsAll}
          onClick={() => setDirsAll(!dirsAll)}
        >
          <Icon name={dirsAll ? 'fold' : 'unfold'} size={14} />
        </button>
        <button
          type="button"
          className="wt-iconbtn wt-pin"
          data-on={pinned || undefined}
          disabled={pinned ? !docked : !canPin}
          aria-pressed={pinned}
          title={pinTitle}
          onClick={togglePin}
        >
          <Icon name="pin" size={14} />
        </button>
      </div>
      <div className="wt-treefilter">
        <Filters
          filter={filter}
          setFilter={setFilter}
          counts={counts}
          filters={filters}
        />
        <Search query={query} setQuery={setQuery} />
      </div>
      <div className="wt-files" ref={treeRef}>
        {files.length ? rows : empty}
      </div>
      {limited}
    </div>
  )
  // 筛选着的时候，按钮上写明筛的是什么，旁边给个「×」：浮窗收着也知道差异不是全部。
  const scopeText = [
    filter !== 'all' && filters[filter][0],
    query.trim() && `“${query.trim()}”`,
  ]
    .filter(Boolean)
    .join(' · ')
  const at = ordered.findIndex((file) => file.id === active)
  const splitTitle = diffWide
    ? split
      ? '左右并排：点一下切换为上下对照'
      : '上下对照：点一下切换为左右并排'
    : '差异区不够宽，左右并排放不下：把文件树收成浮窗，或者把窗口拉宽'
  const done = progress.viewed === progress.total
  const cards = (
    <>
      <div className="wt-stackbar">
        {!docked && (
          <span
            className="wt-treetoggle"
            ref={triggerRef}
            onPointerEnter={enter('trigger')}
            onPointerLeave={leave('trigger')}
          >
            <button
              type="button"
              ref={buttonRef}
              className="wt-treetoggle-btn"
              aria-haspopup="true"
              aria-expanded={float.open}
              aria-controls={treeId}
              title="文件列表：鼠标停在这里，或者点一下"
              onClick={(event) =>
                float.open && float.held
                  ? hide(true)
                  : show(true, byKeyboard(event))
              }
            >
              <Icon name="files" size={15} />
              <span className="wt-treetoggle-label">
                {scopeText || '文件'}{' '}
                <b>
                  {filtered ? ordered.length : total}
                  {filtered && <small>/{total}</small>}
                </b>
              </span>
            </button>
            {filtered && (
              <button
                type="button"
                className="wt-iconbtn"
                title="清除文件筛选"
                aria-label="清除文件筛选"
                onClick={clear}
              >
                <Icon name="close" size={12} />
              </button>
            )}
          </span>
        )}
        {/* 浮窗模式下左边有打开文件树的按钮，其余靠右；固定成两栏后直接从左边排起。 */}
        {!docked && <span className="wt-spacer" />}
        {ordered.length > 0 && (
          <span
            className="wt-stepper"
            role="group"
            aria-label="上一个 / 下一个文件"
          >
            <button
              type="button"
              className="wt-iconbtn"
              title="上一个文件"
              aria-label="上一个文件"
              disabled={ordered.length < 2}
              onClick={() => step(-1)}
            >
              <Icon name="left" size={14} />
            </button>
            <b>
              {at < 0 ? '—' : at + 1}/{ordered.length}
            </b>
            <button
              type="button"
              className="wt-iconbtn"
              title="下一个文件"
              aria-label="下一个文件"
              disabled={ordered.length < 2}
              onClick={() => step(1)}
            >
              <Icon name="right" size={14} />
            </button>
          </span>
        )}
        <Totals files={ordered} />
        {/* 已审阅的进度：读过的文件占多少；旁边一键全标（或者全清）。 */}
        {progress.total > 0 && (
          <>
            <span
              className="wt-seen"
              role="progressbar"
              aria-label="已审阅的文件"
              aria-valuemin={0}
              aria-valuemax={progress.total}
              aria-valuenow={progress.viewed}
              aria-valuetext={`已审阅 ${progress.viewed} / ${progress.total}${
                progress.changed ? `，${progress.changed} 个审阅后又有改动` : ''
              }`}
              data-done={done ? '' : undefined}
              title={
                progress.changed
                  ? `已审阅 ${progress.viewed} / ${progress.total}，另有 ${progress.changed} 个文件审阅后又有改动`
                  : done
                    ? '这个范围的文件都已审阅'
                    : `已审阅 ${progress.viewed} / ${progress.total} 个文件（键盘 V 切换当前文件）`
              }
            >
              <Ring share={progress.viewed / progress.total} />
              <span className="wt-seenlong">
                已审阅 {progress.viewed} / {progress.total}
              </span>
              <span className="wt-seenshort">
                {progress.viewed}/{progress.total}
              </span>
            </span>
            <button
              type="button"
              className="wt-linkbtn wt-seenall"
              title={
                done
                  ? '清除这个范围里全部的已审阅标记'
                  : '把眼下显示的文件全部标为已审阅'
              }
              onClick={() => setReviewedAll(!done)}
            >
              {done ? '清除已审阅' : '全部已审阅'}
            </button>
          </>
        )}
        <button
          type="button"
          className="wt-linkbtn"
          onClick={() => setDiffsAll(!diffsAll)}
        >
          <Icon name={diffsAll ? 'fold' : 'unfold'} size={13} />
          <span className="wt-expandlabel">
            {diffsAll ? '全部收起' : '全部展开'}
          </span>
        </button>
        {/* 看差异的方式对整个文件区生效：在这里切一次，不用每个文件各选一遍。 */}
        <span className="wt-viewbtns" role="group" aria-label="差异的显示方式">
          <button
            type="button"
            className="wt-iconbtn"
            title={splitTitle}
            aria-label={split ? '切换为上下对照' : '切换为左右并排'}
            aria-pressed={split}
            disabled={!diffWide}
            onClick={() => setSplit(!split)}
          >
            <Icon name={split ? 'rows' : 'columns'} size={15} />
          </button>
          <button
            type="button"
            className="wt-iconbtn"
            title={
              wrap ? '长行自动换行：点一下取消' : '长行不换行：点一下自动换行'
            }
            aria-label="自动换行"
            aria-pressed={wrap}
            onClick={() => setWrap(!wrap)}
          >
            <Icon name="wrap" size={15} />
          </button>
        </span>
      </div>
      {ordered.map((file) => (
        <StackCard
          key={file.id}
          file={file}
          badge={badges.get(file.path)}
          open={open.has(file.id)}
          notes={notesFor?.get(file.id)}
          reviewed={stateOf(file)}
          onToggle={toggleFile}
          onReviewed={setReviewed}
          renderDiff={renderDiff}
        />
      ))}
      {limited}
    </>
  )

  // 还没量到宽度（刚挂上来，或者页签没显示）时先只放一个空壳：量完再按真正的宽度一次画对，
  // 不会先按 0 宽画一遍浮窗的摆法、下一帧再跳成两栏。
  if (!ready) return <div ref={rootRef} className="wt-filelist is-float" />

  return (
    <div
      ref={rootRef}
      className={'wt-filelist ' + (docked ? 'is-docked' : 'is-float')}
      style={{ '--tree-w': `${treeW}px` }}
      onPointerDown={(event) => {
        pointer.current = event.pointerType
      }}
    >
      {/* 差异永远排在第一个：固定和浮窗之间切换时，它是同一个元素——滚动位置和已经读到的差异都留着，
          滚动监听也不会跟丢。两边的文件树用了不同的 key，切换时整个换掉，不拿旧节点改类名。 */}
      <div className="wt-diffstack" ref={stackRef}>
        {cards}
      </div>
      {docked ? (
        <div key="docked" className="wt-filetree">
          {treePanel({ className: 'wt-treepanel', ref: panelRef })}
        </div>
      ) : (
        // 左缘的把手 + 浮窗是同一个元素：从把手滑进浮窗不算「离开」。
        <div
          key="float"
          className={'wt-treefloat' + (float.open ? ' is-open' : '')}
          onPointerEnter={enter('panel')}
          onPointerLeave={leave('panel')}
          onFocus={(event) => {
            // 键盘 Tab 到把手上：展开，并把焦点带进搜索框。
            if (!float.open && event.target.matches?.(':focus-visible'))
              show(true, true)
          }}
          onBlur={(event) => {
            // 焦点离开浮窗（Tab 走了）就收起；挪到工具栏那一组按钮上不算离开——那是同一个入口。
            const to = event.relatedTarget
            if (
              !event.currentTarget.contains(to) &&
              !triggerRef.current?.contains(to)
            )
              hide(false)
          }}
        >
          <button
            type="button"
            className="wt-treestrip"
            aria-label="展开文件列表"
            aria-expanded={float.open}
            aria-controls={treeId}
            title="文件列表：鼠标停在这里，或者点一下"
            onClick={(event) => show(true, byKeyboard(event))}
          >
            <Icon name="grip" size={13} />
          </button>
          {mounted && treePanel(panelProps)}
        </div>
      )}
    </div>
  )
}

function Totals({ files }) {
  let add = 0,
    del = 0
  for (const file of files) {
    add += file.xy === '??' ? (file.lines ?? 0) : (file.add ?? 0)
    del += file.del ?? 0
  }
  return (
    <span className="wt-fstat">
      <i>+{add}</i>
      <i>−{del}</i>
    </span>
  )
}

// 右侧铺开时的一个文件：展开着就是差异（标题行粘在顶上），收着就是一行文件名，行尾是「已审阅」。
// 展开着哪些文件、批注、看差异的方式、已审阅都没变的时候，这个文件不必重画（文件多的时候滚动差异会经常换「当前文件」）。
const StackCard = memo(function StackCard({
  file,
  badge,
  open,
  notes,
  reviewed,
  onToggle,
  onReviewed,
  renderDiff,
}) {
  return (
    <div
      className="wt-stackcard"
      data-file={file.id}
      data-open={open ? '' : undefined}
      data-viewed={reviewed}
    >
      {open ? (
        <Near placeholder={<div className="wt-filewait" />}>
          {renderDiff(file, badge, reviewed)}
        </Near>
      ) : (
        <div className="wt-filerow">
          <button
            type="button"
            className="wt-file wt-filehead"
            style={{ '--depth': 0 }}
            aria-expanded={false}
            title={`${file.path} · ${badge.detail}`}
            onClick={() => onToggle(file)}
          >
            <span className="wt-badge" data-tone={badge.tone}>
              {badge.code}
            </span>
            <span className="wt-fname">
              {file.path}
              {file.from && <small> ← {base(file.from)}</small>}
            </span>
            {reviewed === 'changed' && (
              <small className="wt-tag wt-tag-changed">有新改动</small>
            )}
            <NoteCount notes={notes} />
            <span className="wt-fchange">{badge.text}</span>
            <Stats file={file} />
            <Icon name="chevron" size={12} className="wt-file-chevron" />
          </button>
          <Reviewed file={file} state={reviewed} onChange={onReviewed} />
        </div>
      )}
    </div>
  )
})
