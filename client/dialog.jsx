import React, { useEffect, useRef } from 'react'
import { Icon } from './icons.jsx'

// 面板内的对话框：焦点进来、Esc 或点遮罩关闭、Tab 在框内循环。
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// initialFocus：打开时焦点落到哪个控件（选择器）；不给就按下面的默认规则。
export function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
  initialFocus,
}) {
  const ref = useRef(null)
  // 关闭回调每次渲染都可能是新的，事件监听里要拿到最新的那个。
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const previously = document.activeElement
    const box = ref.current
    // 默认焦点落在最稳妥的位置：有底部按钮就落在第一个（确认类对话框里是「取消」）。
    ;(
      (initialFocus && box?.querySelector(initialFocus)) ??
      box?.querySelector('.wt-modalfoot button') ??
      box?.querySelector(FOCUSABLE) ??
      box
    )?.focus({ preventScroll: true })
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        close.current()
        return
      }
      if (event.key !== 'Tab' || !box) return
      const items = [...box.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null,
      )
      if (!items.length) return
      const first = items[0],
        last = items.at(-1),
        current = document.activeElement
      if (!box.contains(current) || current === box) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      }
    }
    // 监听挂在整个文档上：说明类对话框里没有可聚焦的控件，焦点可能还留在打开它的按钮上。
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      if (previously instanceof HTMLElement && previously.isConnected)
        previously.focus({ preventScroll: true })
    }
  }, [])
  return (
    <div
      className="wt-modal-mask"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={'wt-modal' + (wide ? ' is-wide' : '')}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={ref}
        tabIndex={-1}
      >
        <header className="wt-modalhead">
          <h2>{title}</h2>
          <button className="wt-iconbtn" aria-label="关闭" onClick={onClose}>
            <Icon name="close" size={16} />
          </button>
        </header>
        <div className="wt-modalbody">{children}</div>
        {footer && <footer className="wt-modalfoot">{footer}</footer>}
      </div>
    </div>
  )
}
