import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from './icons.jsx'
import { LEVELS, VERDICTS, issuesOf } from '../src/report.js'
import { relTime, scopeFiles } from './model.js'
import { defaultBase } from './review.js'
import { Modal } from './dialog.jsx'
import { Tail } from './bits.jsx'

// 哪棵工作树正由哪个 DSH 会话在审查，记在本机（只有会话编号、时间和审查对象的指纹，不含路径）。
const KEY = 'worktree-desk.reviews'
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}
export const reviews = {
  key: (repoId, tree) => `${repoId}:${tree.id}`,
  get(key) {
    const value = read()[key]
    return typeof value?.session === 'string' ? value : null
  },
  // 全部登记：[{ key, repo, tree, session, at, stamp }]。仓库和树的编号里没有冒号。
  list() {
    const all = []
    for (const [key, value] of Object.entries(read())) {
      if (typeof value?.session !== 'string') continue
      const at = key.lastIndexOf(':')
      const repo = key.slice(0, at),
        tree = key.slice(at + 1)
      if (repo && tree)
        all.push({
          key,
          repo,
          tree,
          session: value.session,
          at: typeof value.at === 'number' ? value.at : 0,
          stamp: typeof value.stamp === 'string' ? value.stamp : '',
          // 审的是哪个范围的改动（见 model.js 的 SCOPES）；早先的记录都是未提交的。
          scope: value.scope === 'outgoing' ? 'outgoing' : 'uncommitted',
          // 用的是不是这个仓库自己配的审查提示词。
          custom: value.custom === true,
        })
    }
    return all
  },
  set(key, value) {
    try {
      const all = read()
      if (value) all[key] = value
      else delete all[key]
      localStorage.setItem(KEY, JSON.stringify(all))
    } catch {
      /* 存不了：下次打开面板就当没审查过 */
    }
  },
}

// 一次审查在面板里的状态：
//   status  loading 正在读 | ready 读到了 | error 读取失败
//   entry   本机记下的那一条（reviews.list() 里的一项）
//   data    宿主返回的结果；at 是这一次读取的时间。
// 没有登记（没审查过、或者记录清掉了）时是 null。

// 一句话说明这次审查到哪一步了（悬停提示用）。
export function reviewLine(state, now) {
  if (state.status === 'loading') return '正在读取 AI 审查的结果'
  if (state.status === 'error') return `AI 审查的结果读取失败：${state.error}`
  const data = state.data
  if (data.missing) return '找不到这次 AI 审查的会话，它可能已经被删除'
  if (!data.known) return '这个会话不是工作树面板发起的审查'
  if (data.running) return `AI 审查进行中，${relTime(state.entry.at, now)}发起`
  if (!data.report)
    return data.problem
      ? `AI 审查没有完成：${data.problem}`
      : 'AI 审查会话已经结束，但没有给出可读取的结果'
  const issues = issuesOf(data.report.notes)
  const fix = issues.filter((note) => note.level === 'fix').length
  const parts = [VERDICTS[data.report.verdict][0]]
  if (fix) parts.push(`必须处理 ${fix}`)
  if (issues.length > fix) parts.push(`建议 ${issues.length - fix}`)
  // 审的是哪个范围的改动：未提交的，或者和上游比的（未推送的提交 + 还没提交的）。
  const scope = state.entry.scope === 'outgoing' ? '未推送' : '未提交'
  const how = state.entry.custom ? '，按本仓库的审查提示词' : ''
  return `AI 审查（${scope}的改动${how}）：${parts.join('，')}（${relTime(state.entry.at, now)}）`
}

// 审查之后这棵工作树的改动有没有变：对不上就是批注可能不再贴着原来的行。
export const changedSince = (state, stamp) =>
  !!stamp && !!state?.data?.report?.stamp && state.data.report.stamp !== stamp

// 清单行尾的审查标记：一眼看得出哪棵工作树走过 AI 审查、结论是什么、是不是还在审。
// stamp 是这棵树现在的改动指纹（见 review.js 的 stampOf），用来判断审查之后改动有没有变。
export function ReviewMark({ state, now, stamp }) {
  if (!state) return null
  const data = state.status === 'ready' ? state.data : null
  const known = data?.known && !data.missing
  const report = known ? data.report : null
  const running = known && data.running
  const changed = changedSince(state, stamp)
  // 星后面的数是要动手的：必须处理几处，加上建议几处（「说明」不算）。
  const issues = report ? issuesOf(report.notes).length : 0
  return (
    <b
      data-k="review"
      data-scope={state.entry.scope}
      data-tone={
        report ? VERDICTS[report.verdict][1] : running ? 'running' : 'none'
      }
      data-stale={changed ? '' : undefined}
      title={
        reviewLine(state, now) +
        (changed
          ? '；审查之后改动有变化'
          : report
            ? '。详情里有每一处的批注'
            : '')
      }
    >
      {running ? (
        <span className="wt-spinner wt-spinner-sm" aria-hidden="true" />
      ) : (
        <Icon name="spark" size={12} />
      )}
      {!running && issues > 0 && issues}
    </b>
  )
}

const elapsed = (at, now) => {
  const minutes = Math.floor((now - at) / 60000)
  if (minutes < 1) return '不到 1 分钟'
  if (minutes < 60) return `${minutes} 分钟`
  return `${Math.floor(minutes / 60)} 小时 ${minutes % 60} 分钟`
}

// 「复制结论」：复制还没审阅的文件里的结论（copy 由详情栏算好，见 detail.jsx）。
function CopyNotes({ copy, act }) {
  if (!copy?.count) return null
  return (
    <button
      type="button"
      className="wt-linkbtn"
      title="复制还没审阅的文件里的审查结论（已审阅的不复制），可以直接贴给 AI 去改"
      onClick={() => act.copy(copy.text, `已复制 ${copy.count} 条审查结论`)}
    >
      <Icon name="copy" size={12} />
      复制结论
    </button>
  )
}

// 详情里的审查结论条：进行中、结论，或者没拿到结果时的说明。
// stale：审查之后改动有变化。loose：对不上当前文件清单的结论条数。copy：见 CopyNotes。
// 审查过的改动已经不在了的（没提交的都提交了、没推送的都推送了），记录会被面板自动清掉，走不到这里。
export function ReviewBar({
  state,
  act,
  repo,
  tree,
  retry,
  stale = false,
  loose = 0,
  copy = null,
  now,
}) {
  if (!state) return null
  // 再审一次，审的还是原来那个范围；这个范围眼下没有改动就没法再审。
  const againScope = state.entry?.scope ?? 'uncommitted'
  const again =
    scopeFiles(tree, againScope)?.length > 0 && act.review ? (
      <button
        type="button"
        className="wt-linkbtn"
        onClick={() => act.review(repo.id, tree, againScope)}
      >
        <Icon name="refresh" size={12} />
        重新审查
      </button>
    ) : null
  const open = (
    <button
      type="button"
      className="wt-linkbtn"
      onClick={() => act.openReview(state.entry.session)}
    >
      <Icon name="chat" size={12} />
      审查会话
    </button>
  )
  const prompt = act.editPrompt && (
    <button
      type="button"
      className="wt-linkbtn"
      title="这个仓库自己配的审查提示词（只换「审什么、重点找什么」）"
      onClick={() => act.editPrompt(repo.id)}
    >
      审查提示词{state.entry?.custom ? '（本仓库）' : ''}
    </button>
  )
  const forget = (
    <button
      type="button"
      className="wt-linkbtn"
      onClick={() => act.forgetReview(repo.id, tree)}
    >
      清除记录
    </button>
  )
  if (state.status === 'loading')
    return (
      <div className="wt-review is-running" role="status">
        <span className="wt-spinner" aria-hidden="true" />
        正在读取审查结果…
      </div>
    )
  if (state.status === 'error')
    return (
      <div className="wt-review is-failed" role="alert">
        <Icon name="warning" size={14} />
        审查结果读取失败：{state.error}
        <button
          type="button"
          className="wt-linkbtn"
          onClick={() => retry(repo, tree)}
        >
          重试
        </button>
        {forget}
      </div>
    )
  const { data } = state
  if (data.missing || !data.known)
    return (
      <div className="wt-review is-failed" role="status">
        <Icon name="warning" size={14} />
        {data.missing
          ? '找不到这次审查的会话，它可能已经被删除。'
          : '这个会话不是工作树面板发起的审查。'}
        {open}
        {forget}
      </div>
    )
  if (data.running)
    return (
      <div className="wt-review is-running" role="status">
        <span className="wt-spinner" aria-hidden="true" />
        AI 审查{state.entry.scope === 'outgoing' ? '未推送的改动' : ''}进行中 ·
        已用时 {elapsed(state.entry.at, now)}
        <span className="wt-reviewhint">结果出来后会标在每一处改动旁边</span>
        <span className="wt-spacer" />
        {open}
        {prompt}
      </div>
    )
  if (!data.report)
    return (
      <div className="wt-review is-failed" role="status">
        <Icon name="warning" size={14} />
        {data.problem
          ? `审查没有完成：${data.problem}`
          : '审查会话已经结束，但没有给出可读取的结果。'}
        <span className="wt-reviewhint">可以打开会话看看详情</span>
        <span className="wt-spacer" />
        {open}
        {again}
        {prompt}
      </div>
    )
  const report = data.report
  const issues = issuesOf(report.notes)
  const fix = issues.filter((note) => note.level === 'fix').length
  const [label, tone] = VERDICTS[report.verdict]
  return (
    <div className="wt-review is-done" data-verdict={report.verdict}>
      <span className="wt-reviewicon" data-tone={tone}>
        <Icon
          name={report.verdict === 'pass' ? 'check' : 'warning'}
          size={14}
        />
      </span>
      <b>{label}</b>
      {state.entry.scope === 'outgoing' && (
        <span className="wt-reviewhint">审的是未推送的改动</span>
      )}
      {state.entry.custom && (
        <span className="wt-reviewhint">按本仓库的审查提示词</span>
      )}
      <span className="wt-reviewcounts">
        {LEVELS.fix[0]} <b>{fix}</b> · {LEVELS.warn[0]}{' '}
        <b>{issues.length - fix}</b>
      </span>
      <span className="wt-reviewsummary" title={report.summary}>
        {report.summary}
      </span>
      <span className="wt-spacer" />
      {stale && (
        <span
          className="wt-reviewstale"
          title="审查之后这个工作树的改动有变化，结论的位置可能对不上现在的行"
        >
          改动已变化，批注位置可能不准
        </span>
      )}
      {loose > 0 && (
        <span
          className="wt-reviewstale"
          title="这些批注指向的文件不在当前的改动里"
        >
          另有 {loose} 条对不上位置
        </span>
      )}
      <CopyNotes copy={copy} act={act} />
      {open}
      {again}
      {prompt}
    </div>
  )
}

// 「审查结果」页签里的筛选：只看有问题的那两类。
const ONLY = { all: '全部', fix: '必须处理', warn: '建议' }
const where = (note) =>
  note.line
    ? note.side === 'old'
      ? `旧第 ${note.line} 行`
      : `第 ${note.line} 行`
    : note.hunk
      ? `第 ${note.hunk} 块`
      : ''

// 「审查结果」页签：结论按文件列出来。差异还在时它们同时标在代码行旁。
// copy / act：「复制结论」（见 CopyNotes）。onPrompt：打开「本仓库的审查提示词」。
export function ReviewNotes({ report, copy, act, onPrompt }) {
  const [only, setOnly] = useState('all')
  const issues = issuesOf(report.notes)
  const counts = {
    fix: issues.filter((note) => note.level === 'fix').length,
    warn: issues.filter((note) => note.level === 'warn').length,
  }
  const groups = useMemo(() => {
    const byFile = new Map()
    for (const note of issues) {
      if (only !== 'all' && note.level !== only) continue
      if (!byFile.has(note.file)) byFile.set(note.file, [])
      byFile.get(note.file).push(note)
    }
    return [...byFile]
  }, [issues, only])
  const worst = (notes) =>
    notes.some((note) => note.level === 'fix') ? 'fix' : 'warn'
  return (
    <div className="wt-rnotes">
      <div className="wt-rbar">
        <div
          className="wt-seg wt-seg-sm"
          role="tablist"
          aria-label="看哪一类结论"
        >
          {['all', 'fix', 'warn']
            .filter((key) => key === 'all' || counts[key])
            .map((key) => (
              <button
                key={key}
                role="tab"
                aria-selected={only === key}
                onClick={() => setOnly(key)}
              >
                {ONLY[key]}
                {key !== 'all' && <b>{counts[key]}</b>}
              </button>
            ))}
        </div>
        <span className="wt-rhint">
          {only === 'all'
            ? '要处理的结论按文件列在下面，差异里也标在对应的代码行旁'
            : '只列这一类结论'}
        </span>
        <span className="wt-spacer" />
        {onPrompt && (
          <button
            type="button"
            className="wt-linkbtn"
            title="这个仓库自己配的审查提示词（只换「审什么、重点找什么」）"
            onClick={onPrompt}
          >
            审查提示词
          </button>
        )}
        <CopyNotes copy={copy} act={act} />
      </div>
      {groups.map(([file, notes]) => (
        <section className="wt-rfile" key={file} data-level={worst(notes)}>
          <h3 className="wt-rfilehead">
            <Icon name="file" size={13} />
            <span className="wt-rfilepath" title={file}>
              {file}
            </span>
            <b>{notes.length}</b>
          </h3>
          <div className="wt-rlist">
            {notes.map((note, i) => {
              const body =
                note.body && note.body !== note.title ? note.body : ''
              return (
                <div className="wt-note" data-level={note.level} key={i}>
                  <div className="wt-rnotehead">
                    <i className="wt-notedot" title={LEVELS[note.level][0]} />
                    {where(note) && (
                      <span className="wt-rline">{where(note)}</span>
                    )}
                    <span className="wt-notetitle">
                      {note.title || LEVELS[note.level][0]}
                    </span>
                    <small className="wt-notetag">
                      {LEVELS[note.level][0]}
                    </small>
                  </div>
                  {body && <p className="wt-notebody">{body}</p>}
                </div>
              )
            })}
          </div>
        </section>
      ))}
      {!groups.length && (
        <p className="wt-emptyline">
          {issues.length ? '没有这一类的结论。' : '这次审查没有要处理的结论。'}
        </p>
      )}
    </div>
  )
}

// 「本仓库的审查提示词」：只换基本那一段（审什么、重点找什么）；范围、做法、只读约束、输出格式
// 由面板固定给出。存在这个仓库的 Git 公共目录里（下面写着路径），也可以直接改那个文件。
//   act.loadPrompt(id, signal) → { prompt, file }   act.savePrompt(id, text) → 存下的文字（空串是改用默认）
export function PromptDialog({ repo, act, onClose }) {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(null) // null 是还没读到
  const [file, setFile] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(true) // 读着或存着
  const boxRef = useRef(null)
  // 打开时输入框还在读、点不了：读完再把焦点放进去。
  const loaded = saved !== null
  useEffect(() => {
    if (loaded) boxRef.current?.focus({ preventScroll: true })
  }, [loaded])
  useEffect(() => {
    const ctl = new AbortController()
    act
      .loadPrompt(repo.id, ctl.signal)
      .then(({ prompt, file }) => {
        if (ctl.signal.aborted) return
        setText(prompt)
        setSaved(prompt)
        setFile(file ?? '')
        setBusy(false)
      })
      .catch((error) => {
        if (ctl.signal.aborted) return
        setError(`读取失败：${error.message}`)
        setBusy(false)
      })
    return () => ctl.abort()
    // 只在打开的时候读一次。
  }, [])
  const dirty = saved !== null && text.trim() !== saved
  const save = async () => {
    setBusy(true)
    setError('')
    try {
      await act.savePrompt(repo.id, text)
      onClose()
    } catch (error) {
      setError(`保存失败：${error.message}`)
      setBusy(false)
    }
  }
  return (
    <Modal
      title="本仓库的审查提示词"
      wide
      initialFocus=".wt-promptbox"
      onClose={() => !busy && onClose()}
      footer={
        <>
          <button
            type="button"
            className="wt-btn"
            disabled={busy || !saved || !text.trim()}
            title="清空，改用默认的提示词（要点「保存」才生效）"
            onClick={() => setText('')}
          >
            改用默认
          </button>
          <span className="wt-spacer" />
          <button
            type="button"
            className="wt-btn"
            disabled={busy}
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="button"
            className="wt-btn is-primary"
            disabled={busy || !dirty}
            onClick={save}
          >
            {busy ? '处理中…' : '保存'}
          </button>
        </>
      }
    >
      <p className="wt-dsub">
        <span className="wt-drepo">{repo.name}</span>
        <Tail className="wt-dpath" title={repo.path} text={repo.path} />
      </p>
      <p className="wt-dtext">
        这里写的替换默认的<b>基本提示词</b>
        ：审什么、重点找什么（比如本仓库的约定、最在意的那几类问题、
        用到的框架和规范）。范围、查看方法、只读约束和输出格式由面板固定给出，不用写。留空就是用默认的。
      </p>
      <textarea
        ref={boxRef}
        className="wt-promptbox"
        aria-label="本仓库的审查提示词"
        placeholder={defaultBase()}
        spellCheck={false}
        value={text}
        disabled={saved === null}
        onChange={(event) => setText(event.target.value)}
      />
      <p className="wt-dtext wt-promptmeta">
        {text.trim().length} / 20000 字
        {file && (
          <>
            {' · '}
            存在 <code title={file}>{file}</code>，也可以直接改这个文件
          </>
        )}
      </p>
      <details className="wt-promptdefault">
        <summary>默认提示词写的是什么</summary>
        <p>审未提交的改动时：</p>
        <pre>{defaultBase('uncommitted')}</pre>
        <p>审未推送的改动时：</p>
        <pre>{defaultBase('outgoing')}</pre>
      </details>
      {error && (
        <p className="wt-notice is-danger" role="alert">
          <Icon name="warning" size={14} />
          {error}
        </p>
      )}
    </Modal>
  )
}
