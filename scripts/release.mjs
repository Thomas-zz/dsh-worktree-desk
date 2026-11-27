// 发布稳定版：取私有仓 main 上的一个提交，在干净的导出目录里安装、测试、构建并做脱敏审查，
// 通过后把同一个提交以「一个版本一个提交」的快照推到公开仓并建 Release。
// 公开仓只收快照；私有历史、未发布的分支和本机文件都不过去。流程说明见 README「开发」一节。
//
//   npm run release -- --dry-run          只演练到公开仓快照校验，不提交、不推送
//   npm run release -- --bump patch       升版本号并发布；也可 --version 0.4.1
//   npm run release --                    发布当前版本号的标签（已打过标签时，例如上次中断后重跑）
//   注意中间的 --：npm 会把 -- 开头的参数当成自己的配置，不加的话到不了脚本手里。
//   可选：--notes <文件路径或文本> 作为 Release 说明；--public、--releases 换目录（测试用）；--yes 跳过确认
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import {
  cp,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'
import { createRelease } from './release-github.mjs'
import { auditTree, installPushHook, loadRules } from './release-audit.mjs'
import { scanText } from './release-scan.mjs'

const sh = (command, args, cwd, { show = false, env } = {}) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: show ? 'inherit' : 'pipe',
    env: { ...process.env, ...env },
  })
  if (result.status !== 0) {
    const label = show
      ? [command, ...args].slice(0, 4).join(' ')
      : `${command} ${args.join(' ')}`
    throw new Error(
      `「${label}」失败（退出码 ${result.status}）${show ? '' : `\n${(result.stderr || result.stdout || '').trim()}`}`,
    )
  }
  return (result.stdout || '').trim()
}
const git = (dir, args, options) => sh('git', args, dir, options)
const ask = (question) =>
  new Promise((answer) => {
    const io = createInterface({ input: process.stdin, output: process.stdout })
    io.question(question, (text) => {
      io.close()
      answer(text)
    })
  })
const bumpVersion = (version, part) => {
  const parts = version.split('.').map(Number)
  const index = { major: 0, minor: 1, patch: 2 }[part]
  if (
    parts.length !== 3 ||
    !parts.every(Number.isInteger) ||
    index === undefined
  )
    throw new Error(`版本号 ${version} 或 --bump ${part} 不合法`)
  parts[index] += 1
  for (let i = index + 1; i < 3; i++) parts[i] = 0
  return parts.join('.')
}

/** 把版本号写进 package.json 与锁文件并提交、打标签；出现版本号以外的差异就还原并拒绝。 */
async function stampVersion(repo, version, tag) {
  const files = ['package.json', 'package-lock.json']
  const before = files.map((file) => git(repo, ['show', `HEAD:${file}`]))
  const after = before.map((text) => {
    const json = JSON.parse(text)
    json.version = version
    if (json.packages?.['']) json.packages[''].version = version
    return `${JSON.stringify(json, null, 2)}\n`
  })
  try {
    for (const [index, file] of files.entries())
      await writeFile(join(repo, file), after[index])
    const changed = git(repo, ['diff', '--name-only'])
      .split('\n')
      .filter(Boolean)
    const lines = git(repo, ['diff', '--unified=0'])
      .split('\n')
      .filter((line) => /^[+-]/.test(line) && !/^(\+\+\+|---)/.test(line))
    if (
      changed.some((file) => !files.includes(file)) ||
      !lines.every((line) => /^[+-]\s*"version": "\d+\.\d+\.\d+",?$/.test(line))
    )
      throw new Error('升版本号产生了版本号以外的差异')
    if (changed.length) git(repo, ['commit', '-am', tag])
    git(repo, ['tag', '-a', tag, '-m', tag])
  } catch (error) {
    for (const [index, file] of files.entries())
      await writeFile(join(repo, file), before[index])
    throw error
  }
}

const FLAGS = new Set([
  '--dry-run',
  '--yes',
  '--version',
  '--bump',
  '--public',
  '--releases',
  '--notes',
])
const USAGE =
  '参数没有被完整传进来：npm 会把 -- 开头的参数当成自己的配置吃掉（例如 npm run release --dry-run --bump patch 到脚本手里只剩 patch），演练就这样变成了真发布。请写成 npm run release -- --dry-run --bump patch，或直接 node scripts/release.mjs --dry-run --bump patch'

/** 参数不完整就拒绝执行：宁可让人重敲一次命令，也不猜它本来想做什么。 */
function checkArgs(args) {
  if (
    process.env.npm_config_dry_run === 'true' ||
    process.env.npm_config_yes === 'true'
  )
    throw new Error(USAGE)
  let stray = false
  for (let at = 0; at < args.length; at++) {
    if (!FLAGS.has(args[at])) stray = true
    else if (args[at] !== '--dry-run' && args[at] !== '--yes') at++
  }
  if (stray) throw new Error(USAGE)
}

/** 撤掉本次运行打的版本提交和标签，只在还没推送时用。只动「起点提交」或它上面那一个版本提交，别的不碰。 */
function undoStamp(repo, tag, start) {
  try {
    const now = git(repo, ['rev-parse', 'HEAD'])
    if (now !== start && git(repo, ['rev-parse', 'HEAD^']) !== start) return
    git(repo, ['tag', '-d', tag])
    if (now !== start) git(repo, ['reset', '--hard', start])
    console.error(
      `\n还没有推送：已撤掉这次的版本提交和标签 ${tag}。改完后用同一条命令重来。`,
    )
  } catch (failure) {
    console.error(
      `\n没能自动撤掉版本提交和标签 ${tag}（${failure.message}），请手动检查 git log 和 git tag。`,
    )
  }
}

/** --notes 给的是已存在的文件就读它的内容，否则当作说明文本；没给就用版本号。 */
const releaseNotes = async (notes, tag, cwd) => {
  if (!notes) return tag
  const file = resolve(cwd, notes)
  return (await stat(file).catch(() => null))?.isFile()
    ? (await readFile(file, 'utf8')).trim()
    : notes
}

async function main() {
  const repo = fileURLToPath(new URL('../', import.meta.url))
  const pkg = JSON.parse(await readFile(join(repo, 'package.json'), 'utf8'))
  const args = process.argv.slice(2)
  checkArgs(args)
  const option = (flag) => {
    const at = args.indexOf(flag)
    return at < 0 ? undefined : args[at + 1]
  }
  const dryRun = args.includes('--dry-run')
  const yes = args.includes('--yes')
  const publicDir = resolve(
    option('--public') || join(repo, '..', `${pkg.name}-public`),
  )
  const releasesDir = resolve(
    option('--releases') ||
      join(homedir(), '.local', 'share', pkg.name, 'releases'),
  )
  const distFile = pkg.exports['./client']
  if (!dryRun && !yes && !process.stdin.isTTY)
    throw new Error('发布需要交互确认；非交互环境请加 --yes')

  // 1. 开发目录：在 main 上、没有未提交的改动、不落后于私有仓。
  if (git(repo, ['branch', '--show-current']) !== 'main')
    throw new Error('只在 main 上发布；功能分支先合回 main')
  if (git(repo, ['status', '--porcelain', '--untracked-files=all']))
    throw new Error('开发目录有未提交的改动，先提交或收起')
  git(repo, ['fetch', 'origin', 'main'])
  if (git(repo, ['rev-list', '--count', 'HEAD..origin/main']) !== '0')
    throw new Error('本地的 main 落后于私有仓的 origin/main，先 git pull')

  // 2. 版本号与标签。演练时不落任何提交，把 HEAD 当作候选。
  const explicit = option('--version')
  const part = option('--bump')
  if (explicit && part) throw new Error('--version 和 --bump 只能给一个')
  const start = git(repo, ['rev-parse', 'HEAD'])
  const onHead = (name) =>
    !!git(repo, ['tag', '--list', name]) &&
    git(repo, ['rev-parse', `${name}^{commit}`]) === start
  // 这次运行里有没有打版本提交和标签、有没有开始推送：决定中止时要不要撤。
  let stampedNow = false,
    pushing = false
  // 上次升完版本号就中断：标签已经打在 HEAD 上，接着发这个版本，不再往上升。
  const stamped = onHead(`v${pkg.version}`)
  const version = stamped
    ? pkg.version
    : explicit || (part ? bumpVersion(pkg.version, part) : pkg.version)
  if (!/^\d+\.\d+\.\d+$/.test(version))
    throw new Error(`版本号 ${version} 不合法`)
  const tag = `v${version}`
  if (stamped) {
    if (explicit && explicit !== pkg.version)
      throw new Error(
        `HEAD 已经是打过标签的 v${pkg.version}，不能再发成 ${tag}`,
      )
    if (explicit || part)
      console.log(`HEAD 上的 v${pkg.version} 已经打过标签，接着发布它`)
  } else if (git(repo, ['tag', '--list', tag])) {
    throw new Error(`${tag} 已经打过，换一个版本号`)
  } else if (!explicit && !part) {
    throw new Error(
      `${tag} 还没打过；发布请带 --bump patch|minor|major 或 --version X.Y.Z`,
    )
  } else if (!dryRun) {
    await stampVersion(repo, version, tag)
    stampedNow = true
  }
  console.log(
    `\n== ${tag} ← ${git(repo, ['rev-parse', '--short', 'HEAD'])}${dryRun ? '（演练）' : ''}`,
  )

  // 3. 导出这个提交，在干净目录里安装、测试、构建。
  const work = await mkdtemp(join(tmpdir(), `${pkg.name}-release-`))
  let keepWork = false
  try {
    const tar = join(work, 'head.tar')
    const source = join(work, 'source')
    git(repo, ['archive', '--format=tar', '-o', tar, 'HEAD'])
    await mkdir(source)
    sh('tar', ['-xf', tar, '-C', source], work)
    const exported = JSON.parse(
      await readFile(join(source, 'package.json'), 'utf8'),
    )
    if (exported.version !== version)
      await writeFile(
        join(source, 'package.json'),
        `${JSON.stringify({ ...exported, version }, null, 2)}\n`,
      )
    console.log('\n== 干净目录安装')
    sh('npm', ['ci', '--no-audit', '--no-fund'], source, { show: true })
    console.log('\n== 测试')
    sh('npm', ['test'], source, { show: true })
    const committed = await readFile(join(source, distFile))
    sh('npm', ['run', 'build'], source)
    if (!(await readFile(join(source, distFile))).equals(committed))
      throw new Error(
        `提交里的 ${distFile} 与源码的构建结果不一致：在开发目录 npm run build 后提交`,
      )

    // 4. 脱敏审查：发布提交的每个文件（内容和路径）加上发布说明。公开的是快照提交，它的提交信息和身份
    //    由公开仓克隆决定，所以这两项在推送时由 pre-push 钩子审查（见第 6 步），不看私有仓这个提交自己的信息，也不看祖先。
    //    私有名单必须在：少了它只剩通用规则，拦不住本机专属的词。
    const rules = await loadRules(repo, { required: true })
    const notes = await releaseNotes(option('--notes'), tag, repo)
    const hits = [
      ...auditTree(repo, git(repo, ['rev-parse', 'HEAD']), rules),
      ...scanText(notes, rules).map((hit) => ({
        where: '发布说明',
        kind: '发布说明',
        location: '发布说明',
        ...hit,
      })),
    ]
    console.log(`\n== 脱敏审查：${hits.length} 处命中`)
    if (hits.length) {
      for (const hit of hits)
        console.error(
          `  ${hit.where}  ${hit.line ? `${hit.location}:${hit.line}` : hit.location}  [${hit.rule}] ${hit.excerpt}`,
        )
      throw new Error('脱敏审查有命中，先处理再发布')
    }

    // 5. 打包，核对包里只有清单内的内容，并留一份本地回退包。
    const tgzName = `${pkg.name}-${version}.tgz`
    sh('npm', ['pack', '--pack-destination', work], source)
    const tgz = join(work, tgzName)
    const sha = createHash('sha256')
      .update(await readFile(tgz))
      .digest('hex')
    const entries = sh('tar', ['-tzf', tgz], work)
      .split('\n')
      .map((entry) => entry.replace(/^package\/|\/$/g, ''))
      .filter(Boolean)
    // 清单里的目录包含其下全部内容，文件只包含自身；与 npm 的 files 规则一致。
    const expected = (entry) =>
      [
        'package.json',
        'README.md',
        'LICENSE',
        'LICENSE.md',
        'LICENSE.txt',
      ].includes(entry) ||
      pkg.files.some(
        (path) =>
          entry === path || entry.startsWith(`${path.replace(/\/$/, '')}/`),
      )
    const unexpected = [...new Set(entries.filter((entry) => !expected(entry)))]
    if (unexpected.length)
      throw new Error(
        `包里出现了清单以外的内容：${unexpected.slice(0, 12).join('、')}`,
      )
    console.log(
      `\n== 打包：${tgzName}，${entries.length} 个条目\n   sha256 ${sha}`,
    )
    const keep = join(releasesDir, version)
    // 回退包等确认之后再落盘（见下），中途停下时不会留下一个没发布过的版本的包。

    // 6. 公开仓快照：先在临时索引里核对「导出内容 == 发布提交的树」，一致才动公开仓克隆。
    if (!(await stat(join(publicDir, '.git'))))
      throw new Error(`找不到公开仓克隆 ${publicDir}，可用 --public 指定`)
    git(publicDir, ['fetch', 'origin'])
    if (git(publicDir, ['branch', '--show-current']) !== 'main')
      throw new Error('公开仓克隆不在 main 上')
    if (git(publicDir, ['status', '--porcelain', '--untracked-files=all']))
      throw new Error('公开仓克隆有未提交的改动，先处理')
    const email = git(publicDir, ['config', '--get', 'user.email'])
    if (!/@users\.noreply\.github\.com$/.test(email || ''))
      throw new Error(
        `公开仓克隆的提交邮箱（${email || '未设置'}）不是 GitHub noreply 地址，先改这个克隆的 user.email`,
      )
    const tree = git(repo, ['rev-parse', 'HEAD^{tree}'])
    const snapshot = join(work, 'snapshot')
    await mkdir(snapshot)
    sh('tar', ['-xf', tar, '-C', snapshot], work)
    const staged = (...others) =>
      sh(
        'git',
        [
          '--git-dir',
          join(publicDir, '.git'),
          '--work-tree',
          snapshot,
          ...others,
        ],
        snapshot,
        { env: { GIT_INDEX_FILE: join(work, 'index') } },
      )
    staged('read-tree', 'origin/main')
    staged('add', '-A')
    if (staged('write-tree') !== tree)
      throw new Error('导出内容与发布提交的树不一致，没有改动公开仓')
    const head = git(publicDir, ['rev-parse', 'HEAD'])
    const remote = git(publicDir, ['rev-parse', 'origin/main'])
    const published = git(publicDir, ['tag', '--list', tag])
    const sameSnapshot =
      published && git(publicDir, ['rev-parse', `${tag}^{tree}`]) === tree
    // 上次推送到一半中断时，允许公开仓克隆停在本次要推的快照上。
    const resumed =
      sameSnapshot && git(publicDir, ['merge-base', remote, head]) === remote
    if (head !== remote && !resumed)
      throw new Error('公开仓克隆与 origin/main 不一致，先 git pull 或 reset')
    if (published && !sameSnapshot)
      throw new Error(`公开仓已经有 ${tag}，内容和本次发布不同；不覆盖`)

    const slug = git(publicDir, ['remote', 'get-url', 'origin']).match(
      /github\.com[:/]([^/]+\/[^/]+?)(?:\.git)?$/,
    )?.[1]
    // 脱敏审查的第二道闸：公开仓克隆里的每次推送（包括手工 git push）都再审一遍；
    // 开发目录里指向公开仓地址的推送也拦下来审，私有历史不能从这条路出去。
    const auditTool = join(repo, 'scripts', 'release-audit.mjs')
    await installPushHook({ cwd: publicDir, tool: auditTool })
    if (slug)
      await installPushHook({
        cwd: repo,
        tool: auditTool,
        onlyRemote: `github.com[:/]${slug}`,
      })
    if (dryRun) {
      console.log(
        `\n演练通过：${tag} 的导出内容可原样作为公开仓快照（树 ${tree.slice(0, 12)}）。没有提交，没有推送。`,
      )
      return
    }

    // 认不出 GitHub 仓库的克隆多半是测试环境，不让它往本机真实的回退包目录里写。
    if (!slug && !option('--releases'))
      throw new Error(
        `公开仓克隆的 origin 不是 GitHub 地址，像是测试环境：回退包目录请用 --releases 显式指定（默认会写到 ${releasesDir}）。本次没有推送`,
      )
    console.log(
      `\n== 即将发布\n   私有仓  ${git(repo, ['remote', 'get-url', 'origin'])}  main 与 ${tag}\n   公开仓  ${slug || publicDir}  main ${published ? '快照已在，只补推送' : '新增一个快照提交'}\n   回退包  ${keep}`,
    )
    if (
      !yes &&
      !/^y(es)?$/i.test(
        (await ask('推送到公开仓并创建 Release？[y/N] ')).trim(),
      )
    )
      throw new Error('已取消：公开仓未改动')

    // 回退包：Release 的资产也从这里取。
    if (!(await stat(keep).catch(() => null))) {
      await mkdir(join(keep, 'package'), { recursive: true })
      await cp(tgz, join(keep, tgzName))
      await writeFile(join(keep, 'SHA256SUMS'), `${sha}  ${tgzName}\n`)
      sh(
        'tar',
        ['-xzf', tgz, '-C', join(keep, 'package'), '--strip-components=1'],
        work,
      )
    }

    if (!published) {
      // 把公开仓克隆的工作区换成导出内容：只删已跟踪的文件，未跟踪的（如 node_modules）不动。
      for (const file of git(publicDir, ['ls-files', '-z'])
        .split('\0')
        .filter(Boolean))
        await rm(join(publicDir, file), { force: true })
      for (const entry of await readdir(snapshot))
        await cp(join(snapshot, entry), join(publicDir, entry), {
          recursive: true,
        })
      git(publicDir, ['add', '-A'])
      if (git(publicDir, ['write-tree']) !== tree)
        throw new Error('公开仓克隆暂存的内容与发布提交不一致，没有推送')
      git(publicDir, ['commit', '-m', tag])
      git(publicDir, ['tag', '-a', tag, '-m', tag])
    }

    // 7. 先推私有仓（标签与提交要有备份），再推公开仓。
    console.log('\n== 推送')
    pushing = true
    git(repo, ['push', 'origin', 'main'], { show: true })
    git(repo, ['push', 'origin', tag], { show: true })
    git(publicDir, ['push', 'origin', 'main'], { show: true })
    git(publicDir, ['push', 'origin', tag], { show: true })

    // 8. Release 资产：已登录的 gh 优先，不行就用 git 的 GitHub 凭据调 API，都不行就列出要手动上传的文件。
    const assets = [join(keep, tgzName), join(keep, 'SHA256SUMS')]
    await createRelease({ slug, tag, notes, assets, cwd: repo, run: sh })
    console.log(
      '桌面直链开发目录，不受影响。要看上一个版本：git checkout <标签>，看完切回 main。',
    )
  } catch (error) {
    keepWork = true
    // 检查没过或用户取消，而且还没开始推送：撤掉这次的版本提交和标签，改完后用同一条命令重来。
    if (stampedNow && !pushing) undoStamp(repo, tag, start)
    throw error
  } finally {
    if (keepWork) console.error(`临时目录保留供排查：${work}`)
    else await rm(work, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(`\n发布中止：${error.message}`)
  process.exit(1)
})
