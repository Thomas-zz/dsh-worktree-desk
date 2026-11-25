import React, { useState } from 'react'
import { isQuiet, repoSummary } from './model.js'

// 仓库导航栏：多工作树的、或有动态的仓库常驻；只有主检出且安静的收在末尾。
export function Rail({ repos, counts, scope, choose }) {
  const [expanded, setExpanded] = useState(false)
  // 有异常用红、有改动或未推送用琥珀、只剩失效登记用灰。
  const tone = (repo) => {
    const c = repoSummary(repo.trees ?? [])
    return c.trouble
      ? 'danger'
      : c.dirty || c.unpushed
        ? 'warn'
        : c.stale
          ? 'stale'
          : ''
  }
  const quiet = (repo) => repo.state === 'ready' && isQuiet(repo.trees)
  const item = (repo) => (
    <button
      key={repo.id}
      className={'wt-railitem' + (scope === repo.id ? ' is-active' : '')}
      aria-current={scope === repo.id ? 'true' : undefined}
      title={repo.path}
      onClick={() => choose(repo.id)}
    >
      <span className="wt-raildot" data-tone={tone(repo)} />
      <span className="wt-railname">{repo.name}</span>
      <b>{repo.count}</b>
    </button>
  )
  const idle = repos.filter(quiet)
  const shown = repos.filter((repo) => !quiet(repo))
  const settled = repos.filter((repo) => repo.state === 'ready').length
  return (
    <nav className="wt-rail" aria-label="仓库">
      <div className="wt-railhead">
        <h2>仓库</h2>
        <span>
          {settled === repos.length
            ? repos.length
            : `${settled}/${repos.length}`}
        </span>
      </div>
      <div className="wt-railscroll">
        <button
          className={
            'wt-railitem wt-railall' + (scope === 'all' ? ' is-active' : '')
          }
          aria-current={scope === 'all' ? 'true' : undefined}
          onClick={() => choose('all')}
        >
          <span className="wt-raildot" />
          <span className="wt-railname">全部仓库</span>
          <b>{counts.all}</b>
        </button>
        {shown.map(item)}
        {idle.length > 0 &&
          (expanded ? (
            <>
              {idle.map(item)}
              <button
                className="wt-railitem wt-railfold"
                onClick={() => setExpanded(false)}
              >
                <span className="wt-raildot" />
                <span className="wt-railname">收起</span>
              </button>
            </>
          ) : (
            <button
              className="wt-railitem wt-railfold"
              onClick={() => setExpanded(true)}
            >
              <span className="wt-raildot" />
              <span className="wt-railname">只有主检出的安静仓库</span>
              <b>{idle.length}</b>
            </button>
          ))}
      </div>
    </nav>
  )
}
