import React from 'react'

// 统一的线性图标：24 网格、圆头、1.6 描边，和宿主自带的图标观感一致。
const lines = {
  branch: (
    <>
      <circle cx="6" cy="5" r="2.3" />
      <circle cx="6" cy="19" r="2.3" />
      <circle cx="18" cy="5" r="2.3" />
      <path d="M6 7.3v9.4m12-9.4c0 6-5.5 6.4-12 6.4" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 4.5 4.5" />
    </>
  ),
  refresh: <path d="M20 10a8 8 0 1 0-1 7M20 4v6h-6" />,
  chevron: <path d="m7 10 5 5 5-5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  copy: (
    <>
      <rect x="8" y="8" width="11" height="12" rx="2" />
      <path d="M15 8V4H4v11h4" />
    </>
  ),
  external: (
    <>
      <path d="M13.5 5H19v5.5M19 5l-8.5 8.5" />
      <path d="M19 14.5V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3.5" />
    </>
  ),
  folder: (
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
  ),
  terminal: (
    <path d="M4 5.5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm3 4 3 3-3 3m5.5 0H17" />
  ),
  code: <path d="m9 8-4 4 4 4m6-8 4 4-4 4" />,
  chat: (
    <>
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V16A1.5 1.5 0 0 1 4 14.5Z" />
      <path d="M12 8.5v4M10 10.5h4" />
    </>
  ),
  // 不带加号的对话气泡：打开已有的会话（带加号的 chat 是新开会话）。
  bubble: (
    <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V16A1.5 1.5 0 0 1 4 14.5Z" />
  ),
  more: (
    <>
      <circle cx="5.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  warning: <path d="M12 4.5 3 19h18ZM12 10v4m0 2.6v.1" />,
  broom: (
    <>
      <path d="m14 4 6 6" />
      <path d="M20 10 12.5 17.5a3 3 0 0 1-2.1.9H5.5a1 1 0 0 1-1-1v-4.9c0-.8.3-1.6.9-2.1L13 3" />
      <path d="m9 11 4 4" />
    </>
  ),
  back: <path d="M19 12H5m6-6-6 6 6 6" />,
  columns: <path d="M4 5.5h16v13H4Zm8 0v13" />,
  rows: <path d="M4 5.5h16v13H4Zm0 6.5h16" />,
  wrap: <path d="M4 6h16M4 10.5h12a3 3 0 0 1 0 6h-3m2-2-2 2 2 2" />,
  help: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M9.8 9.6a2.3 2.3 0 1 1 3.2 2.1c-.7.3-1 .8-1 1.6m0 2.6v.1" />
    </>
  ),
  lock: (
    <>
      <path d="M6 11h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z" />
      <path d="M9 11V8a3 3 0 0 1 6 0v3" />
    </>
  ),
  sort: <path d="M8 17V7M5 10l3-3 3 3M16 7v10m-3-3 3 3 3-3" />,
  filter: <path d="M4 6h16l-6.5 7.5V19l-3-1.8v-3.7Z" />,
  file: (
    <>
      <path d="M7 3.5h7l5 5V19a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5Z" />
      <path d="M14 3.5v5h5" />
    </>
  ),
  // 代码审查：对话气泡里一个对勾。
  review: (
    <>
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V16A1.5 1.5 0 0 1 4 14.5Z" />
      <path d="m9 10.4 2 2 4-4.2" />
    </>
  ),
  // 四角星：AI 审查。
  spark: (
    <path d="M12 3.5c.6 4.6 2.4 6.9 7.5 8.5-5.1 1.6-6.9 3.9-7.5 8.5-.6-4.6-2.4-6.9-7.5-8.5 5.1-1.6 6.9-3.9 7.5-8.5Z" />
  ),
  // 批注：空的对话气泡。
  comment: (
    <path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3.5v-3.5h.5a2 2 0 0 1-2-2Z" />
  ),
  left: <path d="m14 7-5 5 5 5" />,
  right: <path d="m10 7 5 5-5 5" />,
  // 全部展开：上下两个箭头向外；全部收起：向内。
  unfold: <path d="m7 9 5-5 5 5m-10 6 5 5 5-5" />,
  fold: <path d="m7 4 5 5 5-5m-10 16 5-5 5 5" />,
  // 清单行尾：未推送、落后的提交数前面的箭头。
  arrowUp: <path d="M12 19V5m-6 6 6-6 6 6" />,
  arrowDown: <path d="M12 5v14m-6-6 6 6 6-6" />,
  // 图钉：竖着是已固定，斜着（样式里转 45°）是没固定。
  pin: <path d="M8.5 4h7l-1 6 2.5 2.2V14h-10v-1.8L9.5 10l-1-6ZM12 14v6.5" />,
  // 文件区左缘的把手：两列小点。
  grip: (
    <>
      <circle cx="9" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  files: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  // 收起 / 展开面板里的某一栏。
  collapse: <path d="m11 7-5 5 5 5m7-10-5 5 5 5" />,
  expand: <path d="m6 7 5 5-5 5m7-10 5 5-5 5" />,
  // 与远端同步：取回落到远端记录上，拉取收进仓库，推送从仓库送出去。
  fetch: <path d="M12 3.5v10m-4-4 4 4 4-4M5 17.5h14M7.5 20.5h9" />,
  pull: (
    <path d="M12 3.5v11m-4-4 4 4 4-4M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
  ),
  push: (
    <path d="M12 15v-11m-4 4 4-4 4 4M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
  ),
}

export function Icon({ name = 'branch', size = 16, className = '' }) {
  return (
    <svg
      className={`wt-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      {lines[name] ?? lines.branch}
    </svg>
  )
}
