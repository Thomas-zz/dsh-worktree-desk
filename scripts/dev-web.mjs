// 在隔离的 Web profile 里跑真实宿主：不挂载桌面 profile、凭据和会话。
// 用法：node scripts/dev-web.mjs（环境变量 WT_WEB_PORT 换端口）。
import { createHash } from 'node:crypto'
import { execFile, spawn } from 'node:child_process'
import {
  copyFile,
  mkdir,
  readlink,
  readdir,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const repo = fileURLToPath(new URL('../', import.meta.url))
const base = join(homedir(), '.local', 'share', 'dsh-worktree-desk-web')
await mkdir(base, { recursive: true, mode: 0o700 })
// 每个源码目录一个 home：换分支测试不会串到别的检出。
const home = join(
  base,
  createHash('sha256').update(repo).digest('hex').slice(0, 16),
)
const dshHome = join(home, '.dsh')
const profile = join(dshHome, 'profiles', 'worktree-desk-web')
const modules = join(profile, 'node_modules')
await mkdir(modules, { recursive: true, mode: 0o700 })
async function seed(path, contents) {
  try {
    await writeFile(path, contents, { flag: 'wx', mode: 0o600 })
  } catch (e) {
    if (e.code !== 'EEXIST') throw e
  }
}
await seed(
  join(profile, 'package.json'),
  JSON.stringify(
    {
      name: 'dsh-profile-worktree-desk-web',
      private: true,
      dependencies: { 'dsh-worktree-desk': `link:${repo}` },
      dsh: {
        profile: {
          bundles: [
            '@deepseek-ai/dsh-base',
            '@deepseek-ai/dsh-web-app',
            'dsh-worktree-desk',
          ],
        },
      },
    },
    null,
    2,
  ),
)
await seed(join(profile, 'cordis.yml'), '[]\n')
await seed(join(profile, 'cordis.patch.yml'), '[]\n')
const link = join(modules, 'dsh-worktree-desk')
try {
  await symlink(repo, link, 'dir')
} catch (e) {
  if (e.code !== 'EEXIST' || resolve(await readlink(link)) !== resolve(repo))
    throw e
}

// 隔离 home 里没有 Codex / ZCode 索引。用只读快照铺一份真实数据，面板才有东西可看。
// 快照是副本：宿主和插件都不会写到真实的 ~/.codex、~/.zcode。
const realHome = homedir()
async function snapshotIndex(source, target) {
  if (!(await stat(source).catch(() => null))) return
  await mkdir(join(target, '..'), { recursive: true })
  await promisify(execFile)('sqlite3', [source, `.backup '${target}'`])
}
const codexHome = join(home, '.codex')
const realCodex = join(realHome, '.codex')
await mkdir(codexHome, { recursive: true })
if (await stat(join(realCodex, '.codex-global-state.json')).catch(() => null))
  await copyFile(
    join(realCodex, '.codex-global-state.json'),
    join(codexHome, '.codex-global-state.json'),
  )
const codexStates = (await readdir(realCodex).catch(() => []))
  .filter((f) => /^state_\d+\.sqlite$/.test(f))
  .sort((a, b) => b.localeCompare(a, 'en', { numeric: true }))
if (codexStates[0])
  await snapshotIndex(
    join(realCodex, codexStates[0]),
    join(codexHome, codexStates[0]),
  )
await snapshotIndex(
  join(realHome, '.zcode/v2/tasks-index.sqlite'),
  join(home, '.zcode/v2/tasks-index.sqlite'),
)

const macCLI =
  '/Applications/DeepSeek Harness.app/Contents/Resources/runtime/cli/bin/dsh'
const cli =
  process.env.DSH_BIN ||
  (process.platform === 'darwin' && (await stat(macCLI).catch(() => false))
    ? macCLI
    : 'dsh')
const tmp = join(home, 'tmp')
await mkdir(tmp, { recursive: true, mode: 0o700 })
const env = {
  PATH: process.env.PATH,
  HOME: home,
  USERPROFILE: home,
  DSH_HOME: dshHome,
  XDG_CONFIG_HOME: join(home, '.config'),
  XDG_DATA_HOME: join(home, '.local/share'),
  XDG_CACHE_HOME: join(home, '.cache'),
  LANG: process.env.LANG || 'en_US.UTF-8',
  TMPDIR: tmp,
}
for (const key of ['SystemRoot', 'ComSpec', 'PATHEXT'])
  if (process.env[key]) env[key] = process.env[key]
console.log(`DSH Web 开发环境：${dshHome}`)
const args = [
  '--profile',
  'worktree-desk-web',
  '--host',
  '127.0.0.1',
  '--port',
  process.env.WT_WEB_PORT || '4328',
]
if (process.env.WT_WEB_NO_OPEN === '1') args.push('--no-open')
const child = spawn(cli, args, { env, cwd: home, stdio: 'inherit' })
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig))
child.on('error', (err) => {
  console.error(`无法启动 DSH Web：${err.message}。可用 DSH_BIN 指定 CLI。`)
  process.exitCode = 1
})
child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal === 'SIGINT' ? 0 : 1)
})
