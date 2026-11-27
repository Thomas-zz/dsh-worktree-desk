import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
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

// 量一个元素的宽度，尺寸变了跟着更新。
export function useWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  // 第一次量在浏览器画之前做完：挂上来的第一帧就按真正的宽度排，不会先按 0 宽画一遍再跳。
  useLayoutEffect(() => {
    if (ref.current) setWidth(ref.current.clientWidth)
  }, [])
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

// 「已审阅」的进度环：14px、2px 的线，从十二点起顺时针填到已审阅的占比。清单行尾和文件区的工具栏里是同一个。
const RING = 2 * Math.PI * 5.5
export function Ring({ share }) {
  return (
    <svg className="wt-ring" viewBox="0 0 14 14" aria-hidden="true">
      <circle className="wt-ring-track" cx="7" cy="7" r="5.5" />
      <circle
        className="wt-ring-fill"
        cx="7"
        cy="7"
        r="5.5"
        strokeDasharray={`${Math.min(1, Math.max(0, share || 0)) * RING} ${RING}`}
      />
    </svg>
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
