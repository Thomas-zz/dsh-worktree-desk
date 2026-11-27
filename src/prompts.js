// 按仓库配置的审查提示词：只替换「基本提示词」那一段（审什么、重点找什么），见 client/review.js 的 reviewPrompt。
// 每个仓库一份，存在它的 Git 公共目录里：<common>/worktree-desk/review-prompt.md，所有工作树共用。
// 不放进工作目录：那样它会出现在文件改动里，还会被 AI 拿去审查。
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

export const PROMPT_MAX = 20000
// 公共目录本来就直接取自 Git 自己的输出；这里再挡一道，别把文件写到别处去。
const isDir = (value) =>
  typeof value === 'string' &&
  path.isAbsolute(value) &&
  path.normalize(value) === value

export const promptFile = (common) =>
  path.join(common, 'worktree-desk', 'review-prompt.md')

// 规范后的提示词：统一换行、去掉首尾空白。空串表示不配置（用默认的）。
export function cleanPrompt(text) {
  if (typeof text !== 'string')
    throw Object.assign(Error('提示词必须是文字'), {
      status: 400,
      expose: true,
    })
  const value = text.replace(/\r\n?/g, '\n').trim()
  if (value.length > PROMPT_MAX)
    throw Object.assign(Error(`提示词太长（最多 ${PROMPT_MAX} 字）`), {
      status: 413,
      expose: true,
    })
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value))
    throw Object.assign(Error('提示词里有不能用的控制字符'), {
      status: 400,
      expose: true,
    })
  return value
}

// 读这个仓库的提示词；没配置过、或者目录不像 Git 公共目录，都当作没有。
export async function readPrompt(common) {
  if (!isDir(common)) return ''
  const text = await readFile(promptFile(common), 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return ''
    throw error
  })
  return text.replace(/\r\n?/g, '\n').trim()
}

// 存下（空串是删掉）。先写临时文件再改名：写到一半不会留下半份。
export async function writePrompt(common, text) {
  const value = cleanPrompt(text)
  if (!isDir(common))
    throw Object.assign(Error('找不到这个仓库的 Git 目录'), {
      status: 404,
      expose: true,
    })
  const file = promptFile(common)
  if (!value) {
    await rm(file, { force: true })
    return ''
  }
  await mkdir(path.dirname(file), { recursive: true })
  const temp = `${file}.${process.pid}.tmp`
  await writeFile(temp, value + '\n', { mode: 0o600 })
  await rename(temp, file)
  return value
}
