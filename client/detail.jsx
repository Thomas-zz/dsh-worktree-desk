import React, { useEffect, useRef, useState } from 'react'
import { Icon } from './icons.jsx'
import { CopyButton, Tail } from './bits.jsx'
import { DiffView } from './diff-view.jsx'
import { FileList } from './files.jsx'
import { menuKind } from './hub.js'
import {
  fileBadge,
  fullTime,
  homeTilde,
  relTime,
  staleReason,
  signal,
  treeName,
} from './model.js'

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

function Facts({ tree }) {
  const s = tree.status
  return (
    <p className="wt-facts">
      <span title="当前提交">
        <i>HEAD</i>
        <code>{tree.head?.slice(0, 10) || '尚无提交'}</code>
      </span>
      {tree.branch && (
        <span title="来源：本地 Git 分支引用日志。起点不等于当前跟踪的上游。">
          <i>起点</i>
          {originText(tree)}
        </span>
      )}
      {s && tree.branch && (
        <span
          title={
            s.upstream
              ? `按本地记录比较，不联网更新：领先 ${s.ahead}，落后 ${s.behind}`
              : '此分支没有默认对比对象；不等于从未推送'
          }
        >
          <i>上游</i>
          {s.upstream ? <code>{s.upstream}</code> : '未设置'}
        </span>
      )}
      {tree.locked && tree.lockedReason && (
        <span title={tree.lockedReason}>
          <i>锁定原因</i>
          {tree.lockedReason}
        </span>
      )}
    </p>
  )
}

function ActionBar({ repo, tree, services, apps, act, renderFactorySlot }) {
  const dsh = services.state.dsh
  const usable = !tree.prunable && !tree.error
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
          {live.length > 0 && (
            <button
              className="wt-btn is-primary"
              title={`打开最近的 DSH 会话：${live[0].title || live[0].id}`}
              onClick={() => act.openDsh(tree)}
            >
              <Icon name="chat" size={15} />
              打开 DSH 会话
            </button>
          )}
          <button
            className={'wt-btn' + (live.length ? '' : ' is-primary')}
            title="把这个目录登记为工作区，并打开一个新的 DSH 会话"
            onClick={() => act.newDsh(tree)}
          >
            <Icon name="chat" size={15} />
            {live.length ? '新开会话' : '在 DSH 新开会话'}
          </button>
        </>
      )}
      {usable &&
        picks.slice(0, 4).map((target) => (
          <button
            key={target.app}
            className="wt-btn"
            title={target.label}
            onClick={() => act.openApp(repo.id, tree, target)}
          >
            <Icon name={target.icon} size={15} />
            <span className="wt-btnlabel">
              {target.label.replace(/^在|中(打开|显示)$/g, '')}
            </span>
          </button>
        ))}
      {renderFactorySlot?.('contextMenu.button', {
        target: { kind: menuKind, value: { repo: repo.id, path: tree.path } },
        label: '更多操作',
        className: 'wt-menu-btn wt-btn-more',
      })}
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

function TreeDetail({
  repo,
  tree,
  split,
  wide,
  showRepo,
  onBack,
  onDiff,
  services,
  apps,
  act,
  now,
  getTriggerProps,
  renderFactorySlot,
  requestPrune,
  reload,
  home,
}) {
  const [tab, setTab] = useState(tree.status?.total ? 'files' : 'sessions')
  const [open, setOpen] = useState(null)
  const sig = signal(tree)
  const s = tree.status
  const codexNavigation = repo.data?.codexNavigation
  // 原生「本地变更」挂在 DSH 会话的右栏上：只有这棵树有未归档的 DSH 会话、宿主也提供了通道时才提供。
  const native =
    services.state.nativeChanges &&
    tree.sessions.some((x) => x.source === 'DSH' && !x.archived)
      ? (file) => act.nativeChanges(repo.id, tree, file)
      : null
  const full = !split && !!open
  // 窄屏下差异占满整栏：告诉外层压入一层返回栈。
  useEffect(() => {
    onDiff?.(full)
  }, [full, onDiff])

  if (tree.prunable)
    return (
      <div className="wt-dinner">
        <header className="wt-dhead">
          {onBack && (
            <button className="wt-back" onClick={onBack} aria-label="返回列表">
              <Icon name="back" size={16} />
            </button>
          )}
          <span className="wt-dot" data-tone="muted" />
          <h2 className="wt-dname">{treeName(tree)}</h2>
        </header>
        <p className="wt-dsub">
          {showRepo && <span className="wt-drepo">{repo.name}</span>}
          <Tail className="wt-dpath" text={homeTilde(tree.path, home)} />
        </p>
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
    )

  const diffTitle = (file, badge = fileBadge(file)) => (
    <div className="wt-diffhead">
      {full ? (
        <button
          className="wt-back"
          onClick={() => setOpen(null)}
          aria-label="返回文件列表"
        >
          <Icon name="back" size={16} />
        </button>
      ) : (
        <button
          className="wt-back"
          onClick={() => setOpen(null)}
          aria-label="收起差异"
          title="收起差异"
        >
          <Icon name="chevron" size={14} className="is-open" />
        </button>
      )}
      <span className="wt-badge" data-tone={badge.tone} title={badge.detail}>
        {badge.code}
      </span>
      <Tail className="wt-difftitle" title={file.path} text={file.path} />
      <span className="wt-fchange">{badge.text}</span>
      {native && (
        <button
          className="wt-linkbtn"
          title="切换到该目录的 DSH 会话，在右栏用原生「本地变更」查看"
          onClick={() => native(file)}
        >
          在右栏查看
          <Icon name="external" size={12} />
        </button>
      )}
    </div>
  )
  if (full)
    return (
      <div className="wt-dinner wt-dinner-flush">
        <DiffView
          file={open}
          repository={repo.id}
          tree={tree.id}
          wide={false}
          title={diffTitle(open)}
          native={native}
        />
      </div>
    )

  const renderDiff = (file) => (
    <DiffView
      file={file}
      repository={repo.id}
      tree={tree.id}
      wide={wide}
      title={diffTitle(file)}
      native={native}
    />
  )
  return (
    <div className="wt-dinner">
      <header
        className="wt-dhead"
        {...getTriggerProps(
          { kind: menuKind, value: { repo: repo.id, path: tree.path } },
          { tabIndex: -1 },
        )}
      >
        <div className="wt-dtitle">
          {onBack && (
            <button className="wt-back" onClick={onBack} aria-label="返回列表">
              <Icon name="back" size={16} />
            </button>
          )}
          <span className="wt-dot" data-tone={sig.tone} title={sig.label} />
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
        </div>
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
        </p>
        {tree.commit && (
          <p className="wt-dcommit" title={tree.commit.title}>
            <time title={fullTime(tree.commit.time)}>
              {relTime(tree.commit.time, now)}
            </time>
            {tree.commit.title}
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
        />
        <Facts tree={tree} />
      </header>
      <div className="wt-dtabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'files'}
          onClick={() => setTab('files')}
        >
          文件改动 <b>{s?.total ?? '—'}</b>
        </button>
        <button
          role="tab"
          aria-selected={tab === 'sessions'}
          onClick={() => setTab('sessions')}
        >
          关联会话 <b>{tree.sessions.length}</b>
        </button>
        <span className="wt-spacer" />
        {native && (
          <button
            className="wt-linkbtn"
            title="切换到该目录的 DSH 会话，在右栏用原生「本地变更」查看"
            onClick={() => native(null)}
          >
            在 DSH 右栏查看
            <Icon name="external" size={12} />
          </button>
        )}
      </div>
      {tab === 'files' ? (
        !s ? (
          <p className="wt-emptyline">
            {tree.error ? '无法读取文件状态。' : '没有读到文件状态。'}
          </p>
        ) : !s.total ? (
          <p className="wt-emptyline">没有未提交的改动。</p>
        ) : (
          <>
            {tree.hasSubmodules && (
              <p className="wt-dtext">
                子模块只比较提交指针，不扫描子模块内部的改动。
              </p>
            )}
            <FileList
              tree={tree}
              open={open}
              onOpen={setOpen}
              inline={split}
              renderDiff={renderDiff}
            />
          </>
        )
      ) : (
        <SessionList
          tree={tree}
          repository={repo.id}
          services={services}
          act={act}
          now={now}
          codexNavigation={codexNavigation}
        />
      )}
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

// 详情栏自己量宽度：够宽时差异可以左右并排。
function usePaneWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width]
}

export function DetailPane({
  target,
  loading,
  error,
  split,
  showRepo,
  onBack,
  onDiff,
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
  total,
  warnings,
  onClear,
  busy,
  missing,
}) {
  const [ref, width] = usePaneWidth()
  const wide = width >= 680
  if (!target)
    return (
      <aside className="wt-detail" aria-label="工作树详情" ref={ref}>
        <Empty
          total={total}
          warnings={warnings}
          onClear={onClear}
          busy={busy}
          missing={missing}
        />
      </aside>
    )
  const { repo, tree } = target
  if (loading || error || !tree)
    return (
      <aside
        className="wt-detail"
        aria-label="工作树详情"
        aria-busy={!error}
        ref={ref}
      >
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
    <aside className="wt-detail" aria-label="工作树详情" ref={ref}>
      <TreeDetail
        key={`${repo.id}:${tree.path}`}
        repo={repo}
        tree={tree}
        split={split}
        wide={wide}
        showRepo={showRepo}
        onBack={split ? null : onBack}
        onDiff={onDiff}
        services={services}
        apps={apps}
        act={act}
        now={now}
        getTriggerProps={getTriggerProps}
        renderFactorySlot={renderFactorySlot}
        requestPrune={requestPrune}
        reload={reload}
        home={home}
      />
    </aside>
  )
}
