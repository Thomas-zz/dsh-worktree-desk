import path from 'node:path'
import { homedir } from 'node:os'
import { createHash } from 'node:crypto'
import { readdir, realpath } from 'node:fs/promises'
import {
  checkoutOf,
  git,
  inspectTree,
  localBranches,
  mapLimited,
  readWorktrees,
} from './git.js'
import { readSources } from './sources.js'

export const pathKey = (value) =>
  createHash('sha256').update(value).digest('hex').slice(0, 32)
export const listTrees = async (root) =>
  readWorktrees(await git(root, 'worktree', 'list', '--porcelain', '-z'))

// 判断「分支已并入」的参照：远端默认分支（如 origin/master）；没有就退回主检出当前的分支。
// 名称直接来自 Git 自己的输出，只排除会被当成选项的写法。
async function mergeTarget(repo) {
  const remote = (
    await git(
      repo.common,
      'symbolic-ref',
      '--short',
      'refs/remotes/origin/HEAD',
    ).catch(() => '')
  ).trim()
  const main = (await listTrees(repo.common).catch(() => [])).find(
    (t) => t.main && t.branch && !t.bare,
  )
  const target = remote || main?.branch || ''
  return /^[^-]/.test(target) && !/[\s\0]/.test(target) ? target : null
}
const isPath = (p) => typeof p === 'string' && path.isAbsolute(p)

function snapshotSessions(index, canonical) {
  return [...(index.get(canonical)?.values() ?? [])]
}

export async function inventory(ctx, config = {}) {
  const sources = await readSources(ctx)
  const projects = [
    ...(config.projects ?? []),
    ...sources.flatMap((s) => s.projects),
  ].filter((p) => isPath(p?.root))
  const candidates = new Set(projects.map((p) => p.root))
  for (const source of sources)
    for (const session of source.sessions)
      if (isPath(session.directory)) candidates.add(session.directory)
  const checkout = new Map()
  // Resolve once per distinct path, not once per historical chat.
  async function locate(p) {
    if (!checkout.has(p)) checkout.set(p, checkoutOf(p))
    return checkout.get(p)
  }
  const groups = new Map()
  function addGroup(root, name) {
    if (!groups.has(root)) groups.set(root, new Set())
    if (name) groups.get(root).add(name)
  }
  await mapLimited([...new Set(projects.map((p) => p.root))], async (root) => {
    const names = projects
      .filter((p) => p.root === root)
      .map((p) => p.name || path.basename(root))
    const own = await locate(root)
    if (own) {
      for (const name of names) addGroup(own, name)
      return
    }
    // A project may be a collection of sibling repos. Never crawl an entire disk or home directory.
    if (root === path.parse(root).root || root === homedir()) return
    const children = await readdir(root, { withFileTypes: true }).catch(
      () => [],
    )
    for (const entry of children) {
      if (
        !entry.isDirectory() ||
        entry.name.startsWith('.') ||
        entry.name === 'node_modules'
      )
        continue
      const child = path.join(root, entry.name)
      const checkoutRoot = await locate(child)
      if (!checkoutRoot) continue
      candidates.add(child)
      for (const name of names) addGroup(checkoutRoot, name)
    }
  })
  const roots = [
    ...new Set((await mapLimited([...candidates], locate)).filter(Boolean)),
  ]
  const commonRoots = new Map(),
    warnings = []
  await mapLimited(roots, async (root) => {
    try {
      const common = await realpath(
        (
          await git(
            root,
            'rev-parse',
            '--path-format=absolute',
            '--git-common-dir',
          )
        ).replace(/\n$/, ''),
      )
      if (!commonRoots.has(common)) commonRoots.set(common, root)
    } catch {
      warnings.push({ root, message: 'Git 元数据不可读' })
    }
  })
  const sessionsByRoot = new Map()
  for (const source of sources) {
    for (const session of source.sessions) {
      if (!isPath(session.directory)) continue
      const root = await locate(session.directory)
      if (!root) continue
      if (!sessionsByRoot.has(root)) sessionsByRoot.set(root, new Map())
      const rows = sessionsByRoot.get(root),
        key = `${source.name}:${session.id}`
      if (!rows.has(key)) rows.set(key, { ...session, source: source.name })
    }
  }
  const repos = (
    await mapLimited([...commonRoots], async ([common, root]) => {
      try {
        const trees = await listTrees(root)
        if (!trees.length) throw Error('empty')
        const names = new Set()
        for (const t of trees) {
          const canonical = await realpath(t.path).catch(() => t.path)
          for (const name of groups.get(canonical) ?? []) names.add(name)
          // 「哪个工具在用」只看未归档的会话；归档记录仍可在详情里看到。
          t.tools = [
            ...new Set(
              snapshotSessions(sessionsByRoot, canonical)
                .filter((s) => !s.archived)
                .map((s) => s.source),
            ),
          ].sort()
        }
        return {
          id: pathKey(common),
          common,
          root,
          path: trees[0].path,
          name: path.basename(trees[0].path),
          groups: [...names].sort(),
          trees,
        }
      } catch {
        warnings.push({ root, message: '无法列出工作树' })
        return null
      }
    })
  )
    .filter(Boolean)
    .sort(
      (a, b) =>
        b.trees.length - a.trees.length ||
        a.name.localeCompare(b.name) ||
        a.path.localeCompare(b.path),
    )
  return {
    repos,
    sessionsByRoot,
    warnings,
    sources: sources.map(({ name, warning }) => ({ name, warning })),
    time: Date.now(),
  }
}

export function summary(snapshot) {
  return {
    time: snapshot.time,
    // 面板用它把路径里的主目录缩写成 ~。
    home: homedir(),
    warnings: snapshot.warnings,
    sources: snapshot.sources,
    repos: snapshot.repos.map(({ id, path, name, groups, trees }) => ({
      id,
      path,
      name,
      groups,
      trees: trees.map(({ path, branch, head, detached, tools }) => ({
        path,
        branch,
        head,
        detached,
        tools,
      })),
    })),
  }
}

export async function details(repo, snapshot) {
  // The seed can be a temporary checkout; the common directory survives its removal.
  const trees = await listTrees(repo.common)
  // Failure of the optional branch comparison must not hide checkout status.
  const mergedInto = await mergeTarget(repo).catch(() => null)
  const branches = await localBranches(repo.common, mergedInto).catch(
    () => null,
  )
  return {
    id: repo.id,
    branches,
    // 分支「已并入」是相对哪个分支判断的；取不到就不下结论。
    mergedInto,
    time: Date.now(),
    trees: (
      await mapLimited(
        trees,
        async (tree) => {
          const inspected = await inspectTree(tree, repo.common)
          const canonical = await realpath(tree.path).catch(() => tree.path)
          const sessions = snapshotSessions(
            snapshot.sessionsByRoot,
            canonical,
          ).sort(
            (a, b) =>
              Number(!!b.running) - Number(!!a.running) || b.time - a.time,
          )
          // 「哪个工具在用」只看未归档的会话；归档记录仍可在详情里看到。
          const live = sessions.filter((s) => !s.archived)
          return {
            ...inspected,
            id: pathKey(tree.path),
            sessions,
            tools: [...new Set(live.map((s) => s.source))].sort(),
          }
        },
        3,
      )
    ).sort(
      (a, b) =>
        (b.lastChange?.time ?? -Infinity) - (a.lastChange?.time ?? -Infinity) ||
        a.path.localeCompare(b.path),
    ),
  }
}
