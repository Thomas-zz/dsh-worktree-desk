import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  PROMPT_MAX,
  cleanPrompt,
  promptFile,
  readPrompt,
  writePrompt,
} from '../src/prompts.js'

// 每条测试用自己的临时目录。
const dir = () => mkdtempSync(path.join(tmpdir(), 'wt-prompt-'))

test('没配置过读到空串；存了就读到，换行统一、首尾空白去掉；空串是删掉', async () => {
  const common = dir()
  assert.equal(await readPrompt(common), '')
  const saved = await writePrompt(common, '  只看金额精度。\r\n\r\n第二段\r\n ')
  assert.equal(saved, '只看金额精度。\n\n第二段')
  assert.equal(await readPrompt(common), '只看金额精度。\n\n第二段')
  // 文件在 Git 公共目录下自己的子目录里，结尾有换行
  const file = promptFile(common)
  assert.equal(file, path.join(common, 'worktree-desk', 'review-prompt.md'))
  assert.ok(existsSync(file))
  assert.equal(readFileSync(file, 'utf8'), '只看金额精度。\n\n第二段\n')
  // 直接改文件也读得到
  writeFileSync(file, '\n手改的\n')
  assert.equal(await readPrompt(common), '手改的')
  // 删了以后不留空文件
  assert.equal(await writePrompt(common, ' \n '), '')
  assert.equal(existsSync(file), false)
  assert.equal(await readPrompt(common), '')
})

test('内容不合法就拒收：不是文字、太长、带控制字符', async () => {
  // 换行和制表符是允许的
  assert.equal(cleanPrompt(' a\tb\nc '), 'a\tb\nc')
  assert.throws(() => cleanPrompt(5), /必须是文字/)
  assert.throws(() => cleanPrompt(null), /必须是文字/)
  assert.equal(cleanPrompt('x'.repeat(PROMPT_MAX)).length, PROMPT_MAX)
  assert.throws(() => cleanPrompt('x'.repeat(PROMPT_MAX + 1)), /太长/)
  assert.throws(() => cleanPrompt('a\u0000b'), /控制字符/)
  await assert.rejects(writePrompt(dir(), 'x\u0007y'), /控制字符/)
})

test('目录不像 Git 公共目录时不读不写', async () => {
  assert.equal(await readPrompt('relative/.git'), '')
  assert.equal(await readPrompt(undefined), '')
  await assert.rejects(writePrompt('relative/.git', 'x'), /Git 目录/)
  await assert.rejects(writePrompt('/tmp/x/../y', 'x'), /Git 目录/)
})
