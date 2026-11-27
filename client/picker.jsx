import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Icon } from './icons.jsx'
import { scopeOptions } from './model.js'

// 窄面板上选仓库用的下拉：能搜索、能清除。
// 触发按钮留在筛选条里；展开的菜单由面板根节点画（见 desk.jsx）——
// 筛选条窄的时候自己会横向滚动，菜单挂在它下面会被裁掉。

export function ScopeTrigger({
  name,
  path,
  selected,
  open,
  buttonRef,
  onOpen,
  onClear,
}) {
  return (
    <div className="wt-pick">
      <button
        ref={buttonRef}
        type="button"
        className="wt-pickbtn"
        title={path ? `当前仓库：${path}` : '选择仓库'}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onOpen}
      >
        <span className="wt-pickname">{name}</span>
        <Icon name="chevron" size={13} />
      </button>
      {selected && (
        <button
          type="button"
          className="wt-pickclear"
          title="回到全部仓库"
          aria-label="清除，回到全部仓库"
          onClick={onClear}
        >
          <Icon name="close" size={12} />
        </button>
      )}
    </div>
  )
}

export function ScopeMenu({
  repos,
  scope,
  total,
  anchor,
  onChoose,
  onClose,
}) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [place, setPlace] = useState(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  // 列表元素的 id：读屏软件靠它把搜索框和选项关联起来。
  const seed = useRef(Math.random().toString(36).slice(2)).current
  const listId = `wt-pick-${seed}`
  const needle = query.trim()
  const options = useMemo(() => {
    const list = scopeOptions(repos, needle)
    // 「全部仓库」后面显示工作树总数，和清单头的数字一致。
    return needle ? list : [{ ...list[0], count: total }, ...list.slice(1)]
  }, [repos, needle, total])
  // 选项集合变了（输入关键词、清单里多了或少了仓库），键盘光标回到第一项；
  // 后台重读只换数据、不换仓库，不动光标。
  const ids = options.map((option) => option.id).join('\n')
  useEffect(() => setActive(0), [ids])
  useEffect(() => {
    const list = listRef.current
    const option = list?.children[active]
    if (!list || !option) return
    const { clientHeight, scrollTop } = list
    if (option.offsetTop < scrollTop + 4)
      list.scrollTop = option.offsetTop - 4
    else if (
      option.offsetTop + option.offsetHeight >
      scrollTop + clientHeight - 4
    )
      list.scrollTop =
        option.offsetTop + option.offsetHeight - clientHeight + 4
  }, [active, ids])

  // 菜单贴着触发按钮下方展开，不超出面板。触发按钮在面板顶上的筛选条里，下方总有地方。
  const wrap = anchor?.closest('.wt-wrap')
  useLayoutEffect(() => {
    if (!anchor || !wrap) return
    const compute = () => {
      const button = anchor.getBoundingClientRect()
      const panel = wrap.getBoundingClientRect()
      const width = Math.max(button.width, Math.min(288, panel.width - 16))
      setPlace({
        left: Math.max(
          8,
          Math.min(button.left - panel.left, panel.width - width - 8),
        ),
        width,
        top: button.bottom - panel.top + 4,
        maxHeight: Math.max(
          96,
          Math.min(420, panel.bottom - button.bottom - 16),
        ),
      })
    }
    compute()
    // 面板尺寸变了（拖动窗口、侧栏开合）就重新贴一次。
    const observer = new ResizeObserver(compute)
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [anchor, wrap])

  // 菜单先量好位置才显示，隐藏着的元素是聚焦不了的：所以等第一次定位完再把焦点放进搜索框。
  // 之后重新定位（面板变大变小）不再抢焦点。
  const entered = useRef(false)
  useEffect(() => {
    if (!place || entered.current) return
    entered.current = true
    inputRef.current?.focus({ preventScroll: true })
  }, [place])

  // 收起并把焦点交还触发按钮：Esc、选中、点在菜单外面都走这里。
  // 焦点自己离开菜单（Tab 出去、点了面板外的地方）时只收起，不把焦点拉回来。
  const dismiss = () => {
    onClose()
    if (anchor?.isConnected) anchor.focus({ preventScroll: true })
  }
  const confirm = (id) => {
    dismiss()
    onChoose(id)
  }
  // 键盘处理挂在整层上：焦点在搜索框里，或者 Tab 到了菜单里的「清除搜索」按钮上，Esc 都能收起。
  const onKey = (event) => {
    // 输入法组字中的回车和 Esc 是给输入法的，不当成确认或关闭。
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      dismiss()
      return
    }
    // 焦点在菜单里的按钮上时，方向键和回车留给按钮自己。
    if (event.target !== inputRef.current) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      event.stopPropagation()
      if (!options.length) return
      const step = event.key === 'ArrowDown' ? 1 : options.length - 1
      setActive((index) => (index + step) % options.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      if (options[active]) confirm(options[active].id)
    }
  }

  return (
    <div
      className="wt-picklayer"
      onKeyDown={onKey}
      // 按下时不改焦点：焦点留在搜索框里，点选项时菜单不会在 click 之前就因为失焦收起。
      onMouseDown={(event) => event.preventDefault()}
      // 等这一次点击完成了才收起。按下就收起的话，这一下会穿透到底下的行上，把它选中。
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss()
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onClose()
      }}
    >
      <div className="wt-pickmenu" style={place ?? { visibility: 'hidden' }}>
        <label className="wt-picksearch">
          <Icon name="search" size={15} />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label="搜索仓库"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={
              options.length ? `${listId}-${active}` : undefined
            }
            placeholder="搜索仓库、路径或所属项目"
            value={query}
            spellCheck={false}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              type="button"
              className="wt-iconbtn"
              aria-label="清除搜索"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus({ preventScroll: true })
              }}
            >
              <Icon name="close" size={13} />
            </button>
          )}
        </label>
        <ul
          id={listId}
          role="listbox"
          aria-label="仓库"
          className="wt-picklist"
          // 没有可聚焦子元素的滚动容器，浏览器会自动让它能被 Tab 选中；焦点应该直接离开菜单。
          tabIndex={-1}
          ref={listRef}
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={option.id === scope}
              className={
                'wt-pickopt' + (index === active ? ' is-active' : '')
              }
              onPointerMove={() => index !== active && setActive(index)}
              onClick={() => confirm(option.id)}
            >
              <Icon name="check" size={14} />
              <span className="wt-pickname" title={option.path}>
                {option.name}
              </span>
              {option.count != null && <b>{option.count}</b>}
            </li>
          ))}
        </ul>
        {!options.length && <p className="wt-pickempty">没有匹配的仓库。</p>}
      </div>
    </div>
  )
}
