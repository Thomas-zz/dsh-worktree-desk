import { readFile, readdir } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'

// All three adapters return directory evidence, not a guessed worktree owner.
async function withIndex(file, read) {
  const { DatabaseSync } = await import('node:sqlite')
  const db = new DatabaseSync(file, { readOnly: true, allowExtension: false })
  try {
    return read(db)
  } finally {
    db.close()
  }
}

async function codex() {
  const home = process.env.CODEX_HOME || path.join(homedir(), '.codex')
  const projects = []
  try {
    const state = JSON.parse(
      await readFile(path.join(home, '.codex-global-state.json'), 'utf8'),
    )
    for (const item of Object.values(state['local-projects'] ?? {})) {
      for (const root of item.rootPaths ?? [])
        projects.push({ name: item.name, root })
    }
  } catch {
    /* Optional desktop index; CLI-only installs still have threads. */
  }
  const files = (await readdir(home).catch(() => []))
    .filter((f) => /^state_\d+\.sqlite$/.test(f))
    .sort((a, b) => b.localeCompare(a, 'en', { numeric: true }))
  if (!files.length)
    return { projects, sessions: [], warning: '未发现本机会话索引' }
  try {
    // 子代理和守护复核线程是主线程的衍生物，cwd 相同；列出来只会淹没真正的会话。
    const sessions = await withIndex(path.join(home, files[0]), (db) =>
      db
        .prepare(
          `SELECT id, cwd AS directory, substr(title,1,120) AS title,
      coalesce(updated_at_ms, updated_at*1000) AS time, archived FROM threads
      WHERE cwd IS NOT NULL AND (thread_source IS NULL OR thread_source NOT IN ('subagent','guardian_review'))`,
        )
        .all(),
    )
    return {
      projects,
      sessions: sessions.map((s) => ({ ...s, evidence: '聊天目录' })),
    }
  } catch {
    return { projects, sessions: [], warning: '会话索引不可读或版本不兼容' }
  }
}

async function zcode() {
  return withIndex(
    path.join(homedir(), '.zcode/v2/tasks-index.sqlite'),
    (db) => {
      const projects = db
        .prepare(
          `SELECT p.project_id, p.name, r.root_path AS root FROM project_roots r JOIN projects p USING(project_id)
      WHERE p.deleted=0 AND p.host_id='local'`,
        )
        .all()
      // Opening an unregistered checkout as a project can create a different
      // workspace with no such task. Only navigate to the task's recorded root.
      const registered = new Map()
      for (const { project_id, root } of projects) {
        if (!registered.has(project_id)) registered.set(project_id, new Set())
        registered.get(project_id).add(root)
      }
      const sessions = db
        .prepare(
          `SELECT task_id AS id, substr(title,1,120) AS title, updated_at AS time, archived, task_status AS status,
      project_id, worktree_root, execution_directories, workspace_path FROM tasks WHERE deleted=0 AND host_id='local'`,
        )
        .all()
        .flatMap((row) => {
          const {
            project_id,
            worktree_root,
            execution_directories,
            workspace_path,
            ...session
          } = row
          let dirs = []
          try {
            const values = JSON.parse(execution_directories)
            if (Array.isArray(values))
              dirs = values.filter(
                (p) => typeof p === 'string' && path.isAbsolute(p),
              )
          } catch {
            /* old records */
          }
          const evidence = worktree_root
            ? '工作树目录'
            : dirs.length
              ? '执行目录'
              : '任务工作区'
          const paths = worktree_root
            ? [worktree_root]
            : dirs.length
              ? [...new Set(dirs)]
              : [workspace_path]
          return paths.map((directory) => ({
            ...session,
            directory,
            workspace:
              registered.get(project_id)?.has(workspace_path) &&
              path.isAbsolute(workspace_path)
                ? workspace_path
                : null,
            evidence,
          }))
        })
      return { projects, sessions }
    },
  )
}

async function dsh(ctx) {
  const projects = (ctx.workspaceRegistry?.list() ?? []).map((w) => ({
    name: w.title,
    root: w.path,
  }))
  try {
    const { items } = await ctx.sessionController.list(
      {},
      AbortSignal.timeout(10000),
    )
    const archived = new Set(ctx.workspaceRegistry?.archivedSessionIds ?? [])
    const sessions = items
      .filter((s) => !s.blank || s.running || s.projections?.values?.title)
      .map((s) => {
        const values = s.projections?.values ?? {}
        const directory = values.workingDirectory || s.cwd
        return {
          id: s.sessionId,
          directory,
          title: String(values.title ?? '').slice(0, 120),
          time: s.updatedAt,
          archived: archived.has(s.sessionId),
          running: !!(s.running && values.workingDirectory),
          evidence: values.workingDirectory ? '会话工作目录' : '会话初始目录',
        }
      })
    return { projects, sessions }
  } catch {
    return { projects, sessions: [], warning: '宿主会话列表不可用' }
  }
}

export async function readSources(ctx) {
  return Promise.all(
    [
      ['Codex', codex],
      ['ZCode', zcode],
      ['DSH', dsh],
    ].map(async ([name, read]) => {
      try {
        return { name, ...(await read(ctx)) }
      } catch {
        return {
          name,
          sessions: [],
          projects: [],
          warning: '本机索引未安装、不可读或版本不兼容',
        }
      }
    }),
  )
}
