import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import css from './style.css'
import { hostApps, hostOpen, request } from './api.js'
import { Branches } from './branches.jsx'
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
  fullTime,
  homeTilde,
  isQuiet,
  match,
  relTime,
  treeName,
} from './model.js'
import { Rail } from './rail.jsx'
import { WorkList } from './list.jsx'

const SPLIT_AT = 820 // 容器到这里：列表与详情并排
const RAIL_AT = 1040 // 再宽：左侧显示仓库导航栏
const CONCURRENCY = 4 // 同时读取的仓库数
const FILTER_KEYS = ['all', 'dirty', 'unpushed', 'behind', 'trouble', 'stale']
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

export function Desk({ services, useContextMenu, renderFactorySlot }) {
  useServices(services)
  const { getTriggerProps } = (useContextMenu ?? NO_MENU)()
  const rootRef = useRef(null),
    searchRef = useRef(null),
    listRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [catalog, setCatalog] = useState(null)
  const [catalogError, setCatalogError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [details, setDetails] = useState(() => new Map())
  const [revision, bump] = useState(0)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [apps, setApps] = useState([])
  const [scope, setScope] = useState('all')
  const [view, setView] = useState('trees')
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [tool, setTool] = useState('')
  const [sort, setSortValue] = useState(() => prefs.get('sort', 'attention'))
  const [selected, setSelected] = useState(null)
  const [stack, setStack] = useState(0) // 窄屏：0 清单，1 详情，2 差异
  const [collapsed, setCollapsed] = useState(() => new Set())
  const [staleOpen, setStaleOpen] = useState(() => new Set())
  const [quietOpen, setQuietOpen] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [help, setHelp] = useState(false)
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
  const split = width >= SPLIT_AT
  const rail = width >= RAIL_AT
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
  useEffect(() => {
    const ctl = new AbortController()
    setRefreshing(true)
    setCatalogError('')
    request('catalog', revision ? { refresh: '1' } : {}, ctl.signal)
      .then((data) => {
        if (ctl.signal.aborted) return
        setCatalog(data)
        setDetails(new Map())
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
    if (!catalog) return
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
          setDetails((map) =>
            new Map(map).set(id, { state: 'error', error: error.message }),
          )
        }
        done += 1
        if (!ctl.signal.aborted) setProgress((value) => ({ ...value, done }))
      }
    }
    for (let i = 0; i < CONCURRENCY; i++) run()
    return () => ctl.abort()
  }, [catalog])

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
    setDetails((map) => {
      const next = new Map(map)
      next.delete(id)
      return next
    })
    try {
      const data = await request('repository', { id })
      setDetails((map) => new Map(map).set(id, { state: 'ready', data }))
    } catch (error) {
      setDetails((map) =>
        new Map(map).set(id, { state: 'error', error: error.message }),
      )
    }
  }, [])

  // ---- 派生数据 ----
  const counts = useMemo(() => {
    const totals = Object.fromEntries(FILTER_KEYS.map((key) => [key, 0]))
    for (const repo of repos)
      for (const t of repo.trees ?? []) {
        if (tool && !t.tools?.includes(tool)) continue
        totals.all += 1
        for (const key of FILTER_KEYS.slice(1))
          if (FILTERS[key][1](t)) totals[key] += 1
      }
    return totals
  }, [repos, tool])
  const toolCounts = useMemo(() => {
    const totals = {}
    for (const repo of repos)
      for (const t of repo.trees ?? [])
        for (const name of t.tools ?? []) totals[name] = (totals[name] ?? 0) + 1
    return totals
  }, [repos])

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
            .filter((t) => !t.prunable && FILTERS[filter][1](t))
            .sort((a, b) => compareTrees(a, b, sort === 'attention')),
          stale: hit.filter((t) => t.prunable),
        }
      }),
    [repos, needle, tool, filter, sort],
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
  useEffect(() => {
    setStack(0)
  }, [scope, query, filter, tool, view])
  useEffect(() => {
    listRef.current?.scrollTo?.({ top: 0 })
  }, [scope, view])
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
  const act = useMemo(
    () => ({
      dsh: svc.dsh,
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
      async nativeChanges(repoId, tree, file) {
        const open = services.state.nativeChanges
        if (!open) return false
        const opened = await open({ repository: repoId, tree: tree.id, file })
        if (!opened)
          notify('没能打开右栏：这个目录当前没有可用的 DSH 会话', false)
        return opened
      },
      requestPrune,
    }),
    [services, notify, requestPrune, newDsh, svc.dsh, svc.nativeChanges],
  )
  // 右键菜单打开时读取这里：树记录、可用应用、操作。
  latest.current = {
    lookup: (repoId, path) =>
      details.get(repoId)?.data?.trees?.find((t) => t.path === path),
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
  const choose = (repoId) => {
    setScope(repoId)
    setView('trees')
  }
  const showTree = (path) => {
    setView('trees')
    clearFilters()
    setSelected({ repo: scope, path })
    if (!split) setStack(1)
  }
  const onTicket = (key) => {
    setScope('all')
    setView('trees')
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
    if (typing || stacked || view !== 'trees') return
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
  const loading = refreshing || !catalog
  return (
    <div
      ref={rootRef}
      className="wt-wrap"
      data-layout={split ? 'split' : 'stack'}
      data-busy={busy ? '' : undefined}
      onKeyDown={onKey}
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
        {catalog && (
          <span className="wt-readat" title={fullTime(catalog.time)}>
            读取于 {relTime(catalog.time, now)}
          </span>
        )}
        <button
          className="wt-iconbtn"
          title="刷新"
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

      {(view === 'trees' || !rail) && (
        <div className="wt-filters">
          {!rail && (
            <select
              className="wt-scope"
              aria-label="仓库范围"
              value={scope}
              onChange={(e) => choose(e.target.value)}
            >
              <option value="all">全部仓库</option>
              {repos.map((repo) => (
                <option key={repo.id} value={repo.id}>
                  {repo.name} · {repo.count}
                </option>
              ))}
            </select>
          )}
          {view === 'trees' && (
            <>
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
              <div
                className="wt-chips"
                role="group"
                aria-label="按关联工具筛选"
              >
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
            </>
          )}
        </div>
      )}

      <div className="wt-body">
        {rail && (
          <Rail repos={repos} counts={counts} scope={scope} choose={choose} />
        )}
        {!stacked && (
          <WorkList
            scope={scope}
            view={view}
            repos={repos}
            groups={groups}
            quiet={quiet}
            quietOpen={quietOpen}
            staleOpen={staleOpen}
            filterStale={filter === 'stale'}
            collapsed={collapsed}
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
            setView={setView}
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
            openBranches={(id) => {
              setScope(id)
              setView('branches')
            }}
            requestPrune={requestPrune}
            retry={retry}
            clearFilters={clearFilters}
            getTriggerProps={getTriggerProps}
            renderFactorySlot={renderFactorySlot}
            act={act}
            scrollRef={listRef}
            catalogEmpty={!!catalog && repos.length === 0}
          >
            <Branches
              repo={repos.find((r) => r.id === scope)}
              now={now}
              showTree={showTree}
              retry={retry}
            />
          </WorkList>
        )}
        {(split || stacked) && (
          <DetailPane
            target={target}
            loading={!catalog || target?.repo.state === 'loading'}
            error={target?.repo.error}
            split={split}
            showRepo={scope === 'all'}
            onBack={() => setStack(0)}
            onDiff={(open) => setStack(open ? 2 : 1)}
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
            total={{
              repos: groups.length + quiet.length,
              trees: counts.all,
              ...counts,
            }}
            warnings={warnings}
            onClear={filtered ? clearFilters : null}
            busy={busy}
            missing={!!catalog && repos.length === 0}
          />
        )}
      </div>

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
            <dt>关联工具</dt>
            <dd>
              按会话目录匹配到的 Codex / ZCode / DSH
              会话。这是目录关联，不是在线状态；亮起的小点表示最近 30
              分钟内有会话更新。
            </dd>
            <dt>上游</dt>
            <dd>
              ↑ 是未推送的提交数，↓ 是落后的提交数，都按本地记录比较，面板不联网
              fetch。「未设上游」不等于没推送。
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
