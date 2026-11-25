import React from 'react'
import { Icon } from './icons.jsx'

// 从开头省略的单行文本：路径这类信息集中在尾部的字符串，保留尾部比保留头部有用。
// 外层从右往左排，内层是独立的从左到右片段，于是省略号落在左边，文字本身仍是正常顺序。
export function Tail({ text, className = '', title }) {
  return (
    <span className={'wt-tail ' + className} title={title}>
      <span dir="ltr">{text}</span>
    </span>
  )
}

export function CopyButton({ value, label, act, title }) {
  const [done, setDone] = React.useState(false)
  React.useEffect(() => {
    if (!done) return
    const timer = setTimeout(() => setDone(false), 1400)
    return () => clearTimeout(timer)
  }, [done])
  return (
    <button
      className="wt-iconbtn"
      title={title ?? '复制'}
      aria-label={title ?? '复制'}
      onClick={async () => {
        if (await act.copy(value, label, true)) setDone(true)
      }}
    >
      <Icon name={done ? 'check' : 'copy'} size={14} />
    </button>
  )
}
