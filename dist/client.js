window.__ModuleLoader__.load({id:"dsh-worktree-desk",factory:(require)=>{const module={exports:{}};const exports=module.exports;
var fn=Object.create;var It=Object.defineProperty;var hn=Object.getOwnPropertyDescriptor;var gn=Object.getOwnPropertyNames;var bn=Object.getPrototypeOf,xn=Object.prototype.hasOwnProperty;var vn=(t,e)=>{for(var n in e)It(t,n,{get:e[n],enumerable:!0})},xe=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of gn(e))!xn.call(t,i)&&i!==n&&It(t,i,{get:()=>e[i],enumerable:!(r=hn(e,i))||r.enumerable});return t};var X=(t,e,n)=>(n=t!=null?fn(bn(t)):{},xe(e||!t||!t.__esModule?It(n,"default",{value:t,enumerable:!0}):n,t)),kn=t=>xe(It({},"__esModule",{value:!0}),t);var ga={};vn(ga,{apply:()=>ha,inject:()=>fa});module.exports=kn(ga);var de=X(require("react"),1);var l=X(require("react"),1);var ve=`/* \u5DE5\u4F5C\u6811\u9762\u677F\u3002\u989C\u8272\u53D6\u5BBF\u4E3B\u4E3B\u9898\u4EE4\u724C\uFF08\u6D45\u6DF1\u4E24\u5957\u7531\u5BBF\u4E3B\u5207\u597D\uFF09\uFF0C\u540E\u9762\u8DDF\u7684\u662F\u5BBF\u4E3B\u6CA1\u7ED9\u65F6\u7684\u515C\u5E95\u503C\u3002
   \u65AD\u70B9\u4E00\u5F8B\u6309\u5BB9\u5668\u5BBD\u5EA6\u8D70\uFF08desk / list / detail \u4E09\u4E2A\u5BB9\u5668\uFF09\uFF0C\u4E0D\u4F9D\u8D56\u7A97\u53E3\u5927\u5C0F\u3002
   \u91CD\u7F6E\u89C4\u5219\u90FD\u5305\u5728 :where() \u91CC\uFF0C\u4F18\u5148\u7EA7\u538B\u5230\u6700\u4F4E\uFF0C\u4E0D\u8DDF\u7EC4\u4EF6\u81EA\u5DF1\u7684\u7C7B\u540D\u62A2\u3002 */
.wt-wrap {
  --wt-bg: var(--dsw-alias-bg-base, #ffffff);
  --wt-surface: var(--dsw-alias-bg-layer-1, #ffffff);
  --wt-ink: var(--dsw-alias-label-primary, #1b2330);
  --wt-ink-2: var(--dsw-alias-label-secondary, #586376);
  --wt-ink-3: var(--dsw-alias-label-tertiary, #8b95a6);
  --wt-line: var(--dsw-alias-border-l1, #e8eaef);
  --wt-line-2: var(--dsw-alias-border-l2, #d5d9e1);
  --wt-accent: var(--dsw-alias-state-business-primary, #1677ff);
  --wt-danger: var(--dsw-alias-state-error-primary, #d4380d);
  --wt-add-bg: var(--dsw-alias-file-diff-added-bg, rgba(38, 162, 105, 0.11));
  --wt-del-bg: var(--dsw-alias-file-diff-deleted-bg, rgba(214, 69, 69, 0.09));
  --wt-add-ink: var(--dsw-alias-file-diff-added-marker, #1a7f4b);
  --wt-del-ink: var(--dsw-alias-file-diff-deleted-marker, #c0392b);

  /* \u4EE5\u4E0B\u7531\u4E0A\u9762\u7684\u4EE4\u724C\u6D3E\u751F\u3002\u5BBF\u4E3B\u6D45\u8272\u4E3B\u9898\u4E0B\u51E0\u5C42\u80CC\u666F\u540C\u4E3A\u7EAF\u767D\u3001\u72B6\u6001\u8272\u504F\u4EAE\uFF0C
     \u76F4\u63A5\u62FF\u6765\u5F53\u5C42\u6B21\u5E95\u8272\u548C\u5C0F\u5B57\u989C\u8272\u5BF9\u6BD4\u5EA6\u4E0D\u591F\uFF0C\u6240\u4EE5\u6DF7\u5165\u58A8\u8272\u6765\u8C03\uFF1B\u6DF1\u8272\u4E3B\u9898\u4E0B\u58A8\u8272\u662F\u6D45\u7684\uFF0C\u540C\u6837\u6210\u7ACB\u3002 */
  --wt-hover: var(
    --dsw-alias-interactive-bg-hover,
    color-mix(in srgb, var(--wt-ink) 6%, transparent)
  );
  --wt-raised: color-mix(in srgb, var(--wt-ink) 5.5%, transparent);
  --wt-raised-2: color-mix(in srgb, var(--wt-ink) 10%, transparent);
  --wt-selected: color-mix(in srgb, var(--wt-accent) 11%, transparent);
  --wt-selected-2: color-mix(in srgb, var(--wt-accent) 18%, transparent);
  --wt-warn: color-mix(
    in srgb,
    var(--dsw-alias-state-warn-primary, #f59e0b) 74%,
    var(--wt-ink)
  );
  --wt-ok: color-mix(
    in srgb,
    var(--dsw-alias-state-success-primary, #22c55e) 62%,
    var(--wt-ink)
  );
  --wt-add-mark: color-mix(in srgb, var(--wt-add-ink) 26%, transparent);
  --wt-del-mark: color-mix(in srgb, var(--wt-del-ink) 24%, transparent);
  --wt-font: var(
    --dsw-font-family,
    system-ui,
    -apple-system,
    'PingFang SC',
    sans-serif
  );
  --wt-mono: var(
    --ds-font-family-code,
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Consolas,
    monospace
  );
  --wt-r: var(--dsw-radius-sm, 8px);
  --wt-r-sm: var(--dsw-radius-xs, 5px);
  --wt-shadow: var(--dsw-elevation-panel, 0 10px 30px rgba(16, 24, 40, 0.16));

  position: relative;
  container: desk / inline-size;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--wt-bg);
  color: var(--wt-ink);
  font: 13px/1.5 var(--wt-font);
  text-align: left;
  -webkit-font-smoothing: antialiased;
}
.wt-wrap *,
.wt-wrap *::before,
.wt-wrap *::after {
  box-sizing: border-box;
}
:where(.wt-wrap) :is(h1, h2, h3, p, ul, ol, dl, dd, dt, figure) {
  margin: 0;
}
:where(.wt-wrap) :is(ul, ol) {
  padding: 0;
  list-style: none;
}
:where(.wt-wrap) button {
  appearance: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
:where(.wt-wrap) button:disabled {
  cursor: default;
}
:where(.wt-wrap) :where(button, input, select, [tabindex]):focus-visible {
  outline: 2px solid var(--wt-accent);
  outline-offset: -2px;
}
:where(.wt-wrap) :is(input, select) {
  font: inherit;
  color: inherit;
}
:where(.wt-wrap) :is(code, kbd) {
  font-family: var(--wt-mono);
  font-variant-numeric: tabular-nums;
}
:where(.wt-wrap) [data-mono] {
  font-family: var(--wt-mono);
  letter-spacing: -0.01em;
}
.wt-wrap :is(.wt-list, .wt-detail, .wt-railscroll) {
  scrollbar-width: thin;
  scrollbar-color: var(--wt-line-2) transparent;
  overscroll-behavior: contain;
}
.wt-icon {
  display: block;
  flex: none;
}
.wt-spacer {
  flex: 1;
}
.wt-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--wt-line-2);
  border-top-color: var(--wt-ink-3);
  border-radius: 50%;
  animation: wt-spin 0.8s linear infinite;
}
/* \u4ECE\u5F00\u5934\u7701\u7565\u7684\u5355\u884C\u6587\u672C\uFF08\u89C1 bits.jsx \u7684 Tail\uFF09\u3002 */
.wt-tail {
  display: block;
  min-width: 0;
  overflow: hidden;
  direction: rtl;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-tail > span {
  unicode-bidi: isolate;
}
.spin {
  animation: wt-spin 0.9s linear infinite;
}
@keyframes wt-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ---------- \u9876\u680F ---------- */
.wt-top {
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 12px 0 20px;
  border-bottom: 1px solid var(--wt-line);
}
.wt-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
  color: var(--wt-ink);
  flex: none;
}
.wt-brand h1 {
  font-size: 15px;
  font-weight: 650;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.wt-search {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 1 480px;
  min-width: 0;
  height: 34px;
  padding: 0 4px 0 10px;
  border: 1px solid var(--wt-line-2);
  border-radius: var(--wt-r);
  background: var(--wt-surface);
  color: var(--wt-ink-3);
  transition:
    border-color 0.12s,
    box-shadow 0.12s;
}
.wt-search:focus-within {
  border-color: var(--wt-accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wt-accent) 14%, transparent);
}
.wt-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--wt-ink);
  font-size: 13px;
}
.wt-search input::placeholder {
  color: var(--wt-ink-3);
}
.wt-search kbd {
  min-width: 22px;
  height: 20px;
  margin-right: 2px;
  border: 1px solid var(--wt-line-2);
  border-radius: 4px;
  color: var(--wt-ink-3);
  font-size: 11px;
  line-height: 18px;
  text-align: center;
}
.wt-readat {
  margin-left: auto;
  color: var(--wt-ink-3);
  font-size: 12px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.wt-iconbtn {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-2);
}
.wt-iconbtn:hover:not(:disabled) {
  background: var(--wt-hover);
  color: var(--wt-ink);
}
.wt-iconbtn[aria-pressed='true'] {
  background: var(--wt-selected);
  color: var(--wt-accent);
}
.wt-iconbtn:disabled {
  opacity: 0.45;
}

.wt-flash {
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 20px;
  border-bottom: 1px solid var(--wt-line);
  background: var(--wt-raised);
  color: var(--wt-ink-2);
  font-size: 12.5px;
}
.wt-flash[data-tone='bad'] {
  color: var(--wt-danger);
}

/* ---------- \u7B5B\u9009\u6761 ---------- */
.wt-filters {
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 8px 12px 8px 12px;
  border-bottom: 1px solid var(--wt-line);
}
.wt-chips {
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.wt-chips:last-child {
  flex: none;
}
.wt-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex: none;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--wt-line-2);
  border-radius: 999px;
  background: var(--wt-surface);
  color: var(--wt-ink-2);
  font-size: 12.5px;
  white-space: nowrap;
  transition:
    border-color 0.12s,
    background-color 0.12s,
    color 0.12s;
}
.wt-chip b {
  color: var(--wt-ink-3);
  font-weight: 550;
  font-variant-numeric: tabular-nums;
}
.wt-chip:hover {
  border-color: var(--wt-ink-3);
  color: var(--wt-ink);
}
/* \u8BA1\u6570\u4E3A\u96F6\u7684\u6761\u4EF6\u70B9\u8FDB\u53BB\u4E5F\u6CA1\u6709\u5185\u5BB9\uFF1A\u6574\u4F53\u8C03\u6DE1\uFF0C\u4F46\u4ECD\u53EF\u70B9\u3002 */
.wt-chip[data-empty] {
  border-color: var(--wt-line);
  color: var(--wt-ink-3);
}
.wt-chip[aria-pressed='true'],
.wt-chip[aria-pressed='true']:hover {
  border-color: var(--wt-ink);
  background: var(--wt-ink);
  color: var(--wt-bg);
}
.wt-chip[aria-pressed='true'] b {
  color: inherit;
  opacity: 0.72;
}
.wt-scope {
  flex: none;
  max-width: 190px;
  min-width: 0;
  height: 28px;
  padding: 0 8px;
  border: 1px solid var(--wt-line-2);
  border-radius: 999px;
  background: var(--wt-surface);
  color: var(--wt-ink);
  font-size: 12.5px;
  text-overflow: ellipsis;
}

/* ---------- \u4E3B\u4F53\u4E09\u680F ---------- */
.wt-body {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: stretch;
}

/* \u4ED3\u5E93\u5BFC\u822A\u680F */
.wt-rail {
  display: flex;
  flex: none;
  flex-direction: column;
  width: 228px;
  min-height: 0;
  border-right: 1px solid var(--wt-line);
}
.wt-railhead {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex: none;
  padding: 14px 16px 6px 24px;
  color: var(--wt-ink-3);
  font-size: 11.5px;
  letter-spacing: 0.04em;
}
.wt-railhead h2 {
  font-size: inherit;
  font-weight: 600;
}
.wt-railscroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 8px 12px;
}
.wt-railitem {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 30px;
  padding: 0 8px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-2);
  font-size: 12.5px;
}
.wt-railitem:hover {
  background: var(--wt-hover);
  color: var(--wt-ink);
}
.wt-railitem.is-active {
  background: var(--wt-hover);
  color: var(--wt-ink);
  font-weight: 600;
}
.wt-raildot {
  flex: none;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.wt-raildot[data-tone='danger'] {
  background: var(--wt-danger);
}
.wt-raildot[data-tone='warn'] {
  background: var(--wt-warn);
}
.wt-raildot[data-tone='stale'] {
  background: var(--wt-line-2);
}
.wt-railname {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wt-railitem b {
  color: var(--wt-ink-3);
  font-size: 11.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.wt-railall {
  color: var(--wt-ink);
  font-weight: 600;
}
.wt-railfold {
  color: var(--wt-ink-3);
}

/* ---------- \u6E05\u5355 ---------- */
.wt-list {
  container: list / inline-size;
  flex: 1 1 auto;
  min-width: 0;
  overflow-y: auto;
  background: var(--wt-bg);
}
.wt-wrap[data-layout='split'] .wt-list {
  flex: 1 1 46%;
  max-width: 640px;
  border-right: 1px solid var(--wt-line);
}
.wt-listhead {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 12px 0 8px;
  border-bottom: 1px solid var(--wt-line);
  background: var(--wt-bg);
}
.wt-listtitle {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-left: 8px;
  color: var(--wt-ink-2);
  font-size: 12.5px;
  white-space: nowrap;
}
.wt-listtitle b {
  margin-left: 4px;
  color: var(--wt-ink);
  font-size: 16px;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
.wt-listsub {
  margin-left: 6px;
  color: var(--wt-ink-3);
  font-size: 12px;
}
.wt-listpath {
  flex: 1;
  min-width: 0;
  color: var(--wt-ink-3);
  font-family: var(--wt-mono);
  font-size: 11px;
}
.wt-seg {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex: none;
  padding: 2px;
  border-radius: var(--wt-r);
  background: var(--wt-raised);
}
.wt-seg button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: calc(var(--wt-r) - 2px);
  color: var(--wt-ink-2);
  font-size: 12.5px;
  white-space: nowrap;
}
.wt-seg button:hover {
  color: var(--wt-ink);
}
.wt-seg button[aria-selected='true'] {
  background: var(--wt-surface);
  color: var(--wt-ink);
  font-weight: 600;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.1);
}
.wt-seg b {
  color: var(--wt-ink-3);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.wt-seg-sm button {
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
}
.wt-back {
  display: grid;
  place-items: center;
  flex: none;
  width: 28px;
  height: 28px;
  margin-left: 2px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-2);
}
.wt-back:hover {
  background: var(--wt-hover);
  color: var(--wt-ink);
}
.wt-sort {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  color: var(--wt-ink-3);
  font-size: 12px;
  white-space: nowrap;
}
.wt-sort select {
  height: 26px;
  padding: 0 4px 0 2px;
  border: 1px solid transparent;
  border-radius: var(--wt-r-sm);
  background: transparent;
  color: var(--wt-ink-2);
  font: inherit;
  cursor: pointer;
}
.wt-sort select:hover {
  background: var(--wt-hover);
  color: var(--wt-ink);
}
.wt-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 20px;
  border-bottom: 1px solid var(--wt-line);
  color: var(--wt-ink-3);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.wt-progress i {
  position: relative;
  flex: 1;
  height: 2px;
  overflow: hidden;
  border-radius: 2px;
  background: var(--wt-line);
}
.wt-progress i::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--p);
  border-radius: 2px;
  background: var(--wt-accent);
  transition: width 0.25s;
}
.wt-filternote {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0 0 20px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--wt-selected);
  color: var(--wt-accent);
  font-size: 12px;
}
.wt-rows {
  padding-bottom: 28px;
}

/* \u5206\u7EC4\u5934 */
.wt-group {
  padding-bottom: 2px;
}
.wt-grouphead {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  padding: 0 12px 0 8px;
}
.wt-group-toggle {
  display: grid;
  place-items: center;
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-3);
}
.wt-group-toggle:hover {
  background: var(--wt-hover);
  color: var(--wt-ink);
}
.wt-group-toggle .wt-icon {
  transform: rotate(-90deg);
  transition: transform 0.12s;
}
.wt-group-toggle .wt-icon.is-open {
  transform: none;
}
.wt-groupname {
  max-width: 48%;
  overflow: hidden;
  color: var(--wt-ink);
  font-size: 12.5px;
  font-weight: 650;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-groupcount {
  color: var(--wt-ink-3);
  font-size: 11.5px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.wt-groupsummary {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  overflow: hidden;
}
.wt-count {
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
  color: var(--wt-ink-3);
  font-size: 11.5px;
  white-space: nowrap;
}
.wt-count b {
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
.wt-count[data-tone='warn'] b {
  color: var(--wt-warn);
}
.wt-count[data-tone='accent'] b {
  color: var(--wt-accent);
}
.wt-count[data-tone='danger'] b {
  color: var(--wt-danger);
}
.wt-linkbtn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--wt-accent);
  font-size: 12px;
  white-space: nowrap;
}
.wt-linkbtn:hover {
  background: var(--wt-selected);
}
.wt-linkbtn b {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.wt-linkbtn.is-danger {
  color: var(--wt-danger);
}
.wt-linkbtn.is-danger:hover {
  background: color-mix(in srgb, var(--wt-danger) 12%, transparent);
}

/* \u5DE5\u4F5C\u6811\u884C\uFF0C\u56FA\u5B9A\u4E24\u884C\uFF1A\u7B2C\u4E00\u884C \u540D\u79F0 + \u6309\u94AE\uFF0C\u7B2C\u4E8C\u884C \u5DE5\u5355\u3001\u72B6\u6001\u3001\u4E0A\u6E38\u3001\u65F6\u95F4 + \u5173\u8054\u5DE5\u5177\u3002
   \u7B2C\u4E00\u5217 24px \u4E0E\u5206\u7EC4\u5934\u7684\u6298\u53E0\u6309\u94AE\u540C\u5BBD\uFF0C\u540D\u79F0\u5DE6\u7F18\u56E0\u6B64\u5BF9\u9F50\u3002
   \u8DEF\u5F84\u4E0D\u653E\u8FDB\u884C\u91CC\uFF1A\u7A84\u7684\u65F6\u5019\u53EA\u4F1A\u5269\u4E0B\u6700\u540E\u4E00\u6BB5\uFF0C\u6CA1\u6709\u4FE1\u606F\u91CF\uFF1B\u8BE6\u60C5\u680F\u548C\u60AC\u505C\u63D0\u793A\u91CC\u6709\u5B8C\u6574\u8DEF\u5F84\u3002 */
.wt-row {
  position: relative;
  display: grid;
  grid-template-columns:
    24px max-content minmax(0, 1fr) max-content 26px
    26px;
  grid-template-areas:
    'dot main main main go menu'
    'dot ticket meta meta tools tools';
  align-items: center;
  column-gap: 8px;
  row-gap: 3px;
  min-height: 38px;
  padding: 7px 8px;
  cursor: default;
  user-select: none;
}
.wt-row:hover {
  background: var(--wt-hover);
}
.wt-row.is-selected {
  background: var(--wt-selected);
}
.wt-row.is-cursor::before {
  content: '';
  position: absolute;
  inset: 3px 4px;
  border-radius: var(--wt-r-sm);
  box-shadow: inset 0 0 0 1.5px var(--wt-accent);
  pointer-events: none;
}
.wt-row.is-stale .wt-name {
  color: var(--wt-ink-2);
}
.wt-row > .wt-dot {
  grid-area: dot;
  align-self: start;
  margin-top: 6px;
}
.wt-row > .wt-main {
  grid-area: main;
}
.wt-row > .wt-meta {
  display: flex;
  grid-area: meta;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.wt-row > .wt-meta > * {
  text-align: left;
}
.wt-row > .wt-meta > .wt-time {
  margin-left: auto;
}
/* \u6CA1\u8BBE\u4E0A\u6E38\u5F88\u5E38\u89C1\uFF0C\u884C\u91CC\u4E0D\u5360\u4F4D\u7F6E\uFF1B\u8BE6\u60C5\u91CC\u7167\u5E38\u663E\u793A\u3002 */
.wt-row > .wt-meta > .wt-up[data-tone='muted'] {
  display: none;
}
.wt-row > .wt-ticket {
  grid-area: ticket;
}
.wt-row > .wt-tools {
  grid-area: tools;
  justify-content: flex-end;
  padding-left: 12px;
}
.wt-row > .wt-go {
  grid-area: go;
}
.wt-row > .wt-menu-btn {
  grid-area: menu;
}
.wt-row .wt-tag:not(.wt-tag-main) {
  display: none;
}
.wt-dot {
  justify-self: center;
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--wt-line-2);
}
.wt-dot[data-tone='warn'] {
  background: var(--wt-warn);
}
.wt-dot[data-tone='danger'] {
  background: var(--wt-danger);
}
.wt-dot[data-tone='accent'] {
  background: var(--wt-accent);
}
.wt-dot:is([data-tone='clean'], [data-tone='muted']) {
  background: transparent;
  box-shadow: inset 0 0 0 1.5px var(--wt-line-2);
}
.wt-main {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.wt-ticket {
  flex: none;
  padding: 0 5px;
  border-radius: 4px;
  color: color-mix(in srgb, var(--ticket) 84%, var(--wt-ink));
  background: color-mix(in srgb, var(--ticket) 13%, transparent);
  font-family: var(--wt-mono);
  font-size: 10.5px;
  font-weight: 600;
  line-height: 16px;
  white-space: nowrap;
}
.wt-ticket:hover {
  background: color-mix(in srgb, var(--ticket) 26%, transparent);
}
.wt-name {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  flex: none;
  height: 16px;
  margin-left: 6px;
  padding: 0 5px;
  border-radius: 4px;
  background: var(--wt-raised);
  color: var(--wt-ink-3);
  font-size: 10.5px;
  font-weight: 500;
  line-height: 16px;
  white-space: nowrap;
  vertical-align: 1px;
}
.wt-tag.is-muted {
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--wt-line-2);
}
.wt-state {
  color: var(--wt-ink-3);
  font-size: 12px;
  white-space: nowrap;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.wt-state[data-tone='warn'] {
  color: var(--wt-warn);
}
.wt-state[data-tone='danger'] {
  color: var(--wt-danger);
}
.wt-state[data-tone='accent'] {
  color: var(--wt-accent);
}
.wt-state[data-tone='clean'] {
  color: var(--wt-ink-3);
}
.wt-up {
  color: var(--wt-ink-3);
  font-family: var(--wt-mono);
  font-size: 11.5px;
  white-space: nowrap;
  text-align: right;
}
.wt-up[data-tone='accent'] {
  color: var(--wt-accent);
}
.wt-up[data-tone='warn'] {
  color: var(--wt-warn);
}
.wt-tools {
  display: flex;
  justify-content: flex-end;
  gap: 3px;
}
.wt-tool {
  display: inline-flex;
  align-items: center;
  height: 18px;
  overflow: hidden;
  border-radius: 4px;
  background: var(--wt-raised);
  color: var(--wt-ink-2);
  font-size: 10.5px;
  line-height: 1;
  white-space: nowrap;
}
.wt-tool i {
  padding: 0 5px;
  font-style: normal;
  font-weight: 700;
}
.wt-tool em {
  display: none;
}
.wt-tool[data-live='true'] {
  background: var(--wt-selected);
  color: var(--wt-accent);
}
.wt-time {
  color: var(--wt-ink-3);
  font-size: 11.5px;
  white-space: nowrap;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.wt-go,
.wt-row > .wt-menu-btn {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-3);
}
.wt-go {
  opacity: 0;
}
.wt-row:is(:hover, .is-selected, :focus-within) .wt-go {
  opacity: 1;
}
.wt-row :is(.wt-go, .wt-menu-btn):hover {
  background: var(--wt-surface);
  color: var(--wt-ink);
  box-shadow: 0 0 0 1px var(--wt-line-2);
}
@media (hover: none) {
  /* \u89E6\u5C4F\u6CA1\u6709\u60AC\u505C\uFF1A\u5E38\u9A7B\u663E\u793A\u3002 */
  .wt-go {
    opacity: 1;
  }
}

/* \u6298\u53E0\u6761\u3001\u5360\u4F4D\u3001\u7A7A\u884C */
.wt-fold {
  display: flex;
  align-items: center;
  gap: 8px;
  width: calc(100% - 16px);
  min-height: 34px;
  margin: 2px 8px 4px;
  padding: 0 10px 0 32px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-3);
  font-size: 12px;
}
.wt-fold:hover {
  background: var(--wt-hover);
  color: var(--wt-ink-2);
}
.wt-fold b {
  font-weight: 600;
  color: var(--wt-ink-2);
}
.wt-fold > span {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-fold-quiet {
  justify-content: center;
  padding-left: 10px;
  color: var(--wt-ink-3);
}
.wt-fold-quiet > span {
  flex: none;
}
.wt-fold-chevron {
  transform: rotate(-90deg);
}
.wt-stalebar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px 6px 40px;
}
.wt-skeleton {
  display: grid;
  gap: 12px;
  padding: 6px 20px 14px 40px;
}
.wt-skeleton span {
  display: block;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    var(--wt-raised) 20%,
    var(--wt-line) 50%,
    var(--wt-raised) 80%
  );
  background-size: 200% 100%;
  animation: wt-shimmer 1.4s linear infinite;
}
@keyframes wt-shimmer {
  to {
    background-position: -200% 0;
  }
}
.wt-emptyline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  color: var(--wt-ink-3);
  font-size: 12.5px;
}
.wt-inlineerror {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 2px 8px 8px 40px;
  padding: 6px 10px;
  border-radius: var(--wt-r-sm);
  background: color-mix(in srgb, var(--wt-danger) 9%, transparent);
  color: var(--wt-danger);
  font-size: 12.5px;
}
.wt-more {
  display: block;
  margin: 4px auto;
  padding: 6px 12px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-accent);
  font-size: 12.5px;
}
.wt-more:hover {
  background: var(--wt-selected);
}

/* ---------- \u8BE6\u60C5\u680F ---------- */
.wt-detail {
  container: detail / inline-size;
  flex: 1 1 54%;
  min-width: 0;
  overflow-y: auto;
  background: var(--wt-surface);
}
.wt-dinner {
  max-width: 1200px;
  padding-bottom: 28px;
}
.wt-dinner-flush {
  max-width: none;
  padding-bottom: 0;
}
.wt-dhead {
  padding: 16px 20px 0;
}
.wt-dtitle {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.wt-dtitle .wt-back {
  margin-left: -6px;
}
.wt-dtitle .wt-dot {
  width: 9px;
  height: 9px;
}
.wt-dname {
  min-width: 0;
  overflow: hidden;
  font-size: 16px;
  font-weight: 650;
  letter-spacing: -0.01em;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-dname .wt-tag,
.wt-dtitle .wt-tag {
  margin-left: 0;
}
.wt-dsub {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  min-width: 0;
}
.wt-drepo {
  flex: none;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--wt-raised);
  color: var(--wt-ink-3);
  font-size: 11.5px;
}
.wt-dpath {
  flex: 0 1 auto;
  color: var(--wt-ink-2);
  font-size: 12px;
}
.wt-dcommit {
  display: -webkit-box;
  margin-top: 10px;
  overflow: hidden;
  color: var(--wt-ink-2);
  font-size: 12.5px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.wt-dcommit time {
  margin-right: 8px;
  color: var(--wt-ink-3);
  font-variant-numeric: tabular-nums;
}
.wt-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
}
.wt-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 11px;
  border: 1px solid var(--wt-line-2);
  border-radius: var(--wt-r);
  background: var(--wt-surface);
  color: var(--wt-ink);
  font-size: 12.5px;
  font-weight: 500;
  white-space: nowrap;
}
.wt-btn:hover:not(:disabled) {
  border-color: var(--wt-ink-3);
  background: var(--wt-raised);
}
.wt-btn.is-primary {
  border-color: var(--wt-ink);
  background: var(--wt-ink);
  color: var(--wt-bg);
}
.wt-btn.is-primary:hover:not(:disabled) {
  border-color: var(--wt-ink);
  background: var(--wt-ink);
  opacity: 0.86;
}
.wt-btn.is-danger {
  border-color: color-mix(in srgb, var(--wt-danger) 45%, transparent);
  color: var(--wt-danger);
}
.wt-btn.is-danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--wt-danger) 10%, transparent);
  border-color: var(--wt-danger);
}
.wt-btn:disabled {
  opacity: 0.55;
}
.wt-btn-more {
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--wt-line-2);
  border-radius: var(--wt-r);
  color: var(--wt-ink-2);
}
.wt-btn-more:hover:not(:disabled) {
  border-color: var(--wt-ink-3);
  background: var(--wt-raised);
  box-shadow: none;
}
.wt-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 14px;
  margin-top: 10px;
  color: var(--wt-ink-3);
  font-size: 11.5px;
}
.wt-facts i {
  margin-right: 4px;
  font-style: normal;
}
.wt-facts code {
  color: var(--wt-ink-2);
}
.wt-dtabs {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 14px;
  padding: 0 20px;
  border-bottom: 1px solid var(--wt-line);
}
.wt-dtabs [role='tab'] {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 36px;
  color: var(--wt-ink-3);
  font-size: 12.5px;
}
.wt-dtabs [role='tab']:hover {
  color: var(--wt-ink);
}
.wt-dtabs [role='tab'][aria-selected='true'] {
  color: var(--wt-ink);
  font-weight: 600;
}
.wt-dtabs [role='tab'][aria-selected='true']::after {
  content: '';
  position: absolute;
  inset: auto 0 -1px;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: var(--wt-ink);
}
.wt-dtabs b {
  color: var(--wt-ink-3);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.wt-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 7px 10px;
  border-radius: var(--wt-r-sm);
  font-size: 12.5px;
}
.wt-notice.is-warn {
  background: color-mix(in srgb, var(--wt-warn) 12%, transparent);
  color: var(--wt-warn);
}
.wt-notice.is-danger {
  background: color-mix(in srgb, var(--wt-danger) 10%, transparent);
  color: var(--wt-danger);
}
.wt-dtext {
  color: var(--wt-ink-2);
  font-size: 12.5px;
  line-height: 1.7;
}
.wt-dhead + .wt-dtext,
.wt-dtabs + .wt-dtext {
  padding: 8px 20px 0;
}

/* \u6587\u4EF6\u6539\u52A8 */
.wt-filebar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  padding: 10px 20px 8px;
}
.wt-minisearch {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  height: 26px;
  padding: 0 4px 0 8px;
  border: 1px solid var(--wt-line);
  border-radius: var(--wt-r-sm);
  background: var(--wt-bg);
  color: var(--wt-ink-3);
}
.wt-minisearch:focus-within {
  border-color: var(--wt-accent);
}
.wt-minisearch input {
  flex: 1;
  width: 96px;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--wt-ink);
  font-size: 12px;
}
.wt-minisearch input::placeholder {
  color: var(--wt-ink-3);
}
.wt-files {
  padding: 0 12px 4px;
}
.wt-dir,
.wt-file {
  display: grid;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0 8px 0 calc(8px + var(--depth, 0) * 16px);
  border-radius: var(--wt-r-sm);
}
.wt-dir {
  grid-template-columns: 16px minmax(0, 1fr) max-content max-content;
  min-height: 30px;
  color: var(--wt-ink-2);
  font-size: 12px;
}
.wt-dir:hover {
  background: var(--wt-hover);
  color: var(--wt-ink);
}
.wt-dir .wt-icon {
  transform: rotate(-90deg);
}
.wt-dir .wt-icon.is-open {
  transform: none;
}
.wt-dirname,
.wt-dircount {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-dirname {
  font-family: var(--wt-mono);
  font-size: 11.5px;
}
.wt-dircount {
  color: var(--wt-ink-3);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.wt-file {
  grid-template-columns: 22px minmax(0, 1fr) max-content max-content 14px;
  min-height: 32px;
}
.wt-file:hover,
.wt-file.is-open {
  background: var(--wt-hover);
}
.wt-badge {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 18px;
  padding: 0 4px;
  border-radius: 4px;
  font-family: var(--wt-mono);
  font-size: 10.5px;
  font-weight: 600;
  line-height: 1;
}
/* \u5FBD\u6807\u53EA\u7528\u58A8\u8272\u548C\u7EA2\u8272\uFF1A\u5B9E\u5FC3\u662F\u5DF2\u6682\u5B58\uFF0C\u7A7A\u5FC3\u662F\u672A\u6682\u5B58\uFF0C\u865A\u7EBF\u662F\u672A\u8DDF\u8E2A\u3002 */
.wt-badge[data-tone='staged'] {
  background: var(--wt-ink);
  color: var(--wt-bg);
}
.wt-badge[data-tone='unstaged'] {
  box-shadow: inset 0 0 0 1px var(--wt-ink-2);
  color: var(--wt-ink);
}
.wt-badge[data-tone='untracked'] {
  box-shadow: inset 0 0 0 1px var(--wt-ink-3);
  color: var(--wt-ink-2);
}
.wt-badge[data-tone='danger'] {
  background: var(--wt-danger);
  color: #fff;
}
.wt-fname {
  min-width: 0;
  overflow: hidden;
  color: var(--wt-ink);
  font-family: var(--wt-mono);
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-fname small {
  color: var(--wt-ink-3);
  font-size: 11px;
}
.wt-fchange {
  color: var(--wt-ink-3);
  font-size: 11.5px;
  white-space: nowrap;
}
.wt-fstat {
  display: inline-flex;
  gap: 6px;
  font-family: var(--wt-mono);
  font-size: 11px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.wt-fstat i {
  font-style: normal;
}
.wt-fstat i:first-child {
  color: var(--wt-add-ink);
}
.wt-fstat i:last-child {
  color: var(--wt-del-ink);
}
.wt-file-chevron {
  color: var(--wt-ink-3);
  transform: rotate(-90deg);
}
.wt-file-chevron.is-open {
  transform: none;
}
.wt-file-chevron.is-away {
  transform: none;
}

/* \u5C31\u5730\u5DEE\u5F02 */
.wt-diffbox {
  margin: 2px 0 8px calc(8px + var(--depth, 0) * 16px + 8px);
  border: 1px solid var(--wt-line);
  border-radius: var(--wt-r);
  background: var(--wt-bg);
}
.wt-dinner-flush .wt-diffbox {
  margin: 0;
  border: 0;
  border-radius: 0;
}
/* \u4E0D\u80FD\u7ED9\u5916\u6846\u52A0 overflow: hidden\uFF0C\u5426\u5219\u5B83\u4F1A\u6210\u4E3A\u7C98\u6027\u5B9A\u4F4D\u7684\u53C2\u7167\uFF0C\u6807\u9898\u7C98\u4E0D\u5230\u8BE6\u60C5\u680F\u9876\u90E8\u3002
   \u5706\u89D2\u7531\u9996\u5C3E\u4E24\u4E2A\u5B50\u5143\u7D20\u5404\u81EA\u8D1F\u8D23\u3002 */
.wt-diffsticky {
  position: sticky;
  top: 0;
  z-index: 3;
  border-bottom: 1px solid var(--wt-line);
  border-radius: calc(var(--wt-r) - 1px) calc(var(--wt-r) - 1px) 0 0;
  background: var(--wt-bg);
}
.wt-diffbox > :last-child {
  border-radius: 0 0 calc(var(--wt-r) - 1px) calc(var(--wt-r) - 1px);
}
.wt-dinner-flush .wt-diffbox > :last-child {
  border-radius: 0;
}
.wt-dinner-flush .wt-diffsticky {
  border-radius: 0;
}
.wt-diffhead {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 0 12px 0 6px;
}
.wt-diffhead .wt-back {
  margin-left: 0;
}
.wt-difftitle {
  flex: 1;
  color: var(--wt-ink);
  font-family: var(--wt-mono);
  font-size: 12px;
}
.wt-difftools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
  padding: 6px 12px;
}
.wt-diffnote {
  color: var(--wt-ink-3);
  font-size: 11.5px;
  white-space: nowrap;
}
.wt-diffscroll {
  overflow: auto;
}
.wt-diff {
  min-width: max-content;
  font-family: var(--wt-mono);
  font-size: 12px;
  line-height: 20px;
}
.wt-diffscroll[data-wrap='true'] .wt-diff {
  min-width: 0;
}
.wt-hunk {
  content-visibility: auto;
  contain-intrinsic-size: auto 600px;
}
.wt-hunk + .wt-hunk {
  border-top: 4px solid var(--wt-line);
}
.wt-hunkhead,
.wt-line {
  display: grid;
  grid-template-columns: 44px 44px 14px minmax(0, 1fr);
}
.wt-hunkhead {
  align-items: center;
  min-height: 24px;
  background: var(--wt-raised);
  color: var(--wt-accent);
}
.wt-hunklabel {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding-left: 10px;
  white-space: nowrap;
}
.wt-hunklabel code {
  font-size: 11px;
}
.wt-hunkctx {
  overflow: hidden;
  color: var(--wt-ink-3);
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-ln,
.wt-sign {
  color: var(--wt-ink-3);
  font-size: 11px;
  user-select: none;
}
.wt-ln {
  padding-right: 10px;
  text-align: right;
}
.wt-sign {
  text-align: center;
}
.wt-code {
  padding-right: 16px;
  white-space: pre;
  tab-size: 4;
}
.wt-line {
  min-height: 20px;
  color: var(--wt-ink);
  white-space: pre;
}
.wt-line[data-kind='add'],
.wt-line[data-kind='add'] .wt-ln {
  background: var(--wt-add-bg);
}
.wt-line[data-kind='del'],
.wt-line[data-kind='del'] .wt-ln {
  background: var(--wt-del-bg);
}
.wt-line[data-kind='add'] .wt-sign {
  color: var(--wt-add-ink);
}
.wt-line[data-kind='del'] .wt-sign {
  color: var(--wt-del-ink);
}
.wt-code mark {
  border-radius: 2px;
  background: var(--wt-add-mark);
  color: inherit;
}
.wt-line[data-kind='del'] .wt-code mark {
  background: var(--wt-del-mark);
}
.wt-diffscroll[data-wrap='true'] :is(.wt-line, .wt-half, .wt-code) {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
/* \u5DE6\u53F3\u5E76\u6392 */
.wt-hunkhead.is-split {
  grid-template-columns: 44px 14px minmax(0, 1fr) 44px 14px minmax(0, 1fr);
}
/* \u5DE6\u53F3\u4E24\u5217\u7531\u6574\u4E2A\u5DEE\u5F02\u5757\u7EDF\u4E00\u5206\uFF1A\u4E0D\u6362\u884C\u65F6\u4E24\u680F\u6309\u6700\u957F\u7684\u4E00\u884C\u7B49\u5BBD\u6491\u5F00\uFF0C\u5404\u884C\u7684\u5206\u754C\u4E00\u81F4\u3002 */
.wt-hunkbody.is-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}
.wt-srow {
  display: contents;
}
.wt-half {
  display: grid;
  grid-template-columns: 44px 14px minmax(0, 1fr);
  align-items: start;
  min-height: 20px;
  color: var(--wt-ink);
  white-space: pre;
}
.wt-half + .wt-half {
  border-left: 1px solid var(--wt-line);
}
.wt-half[data-kind='add'],
.wt-half[data-kind='add'] .wt-ln {
  background: var(--wt-add-bg);
}
.wt-half[data-kind='del'],
.wt-half[data-kind='del'] .wt-ln {
  background: var(--wt-del-bg);
}
.wt-half[data-kind='add'] .wt-sign {
  color: var(--wt-add-ink);
}
.wt-half[data-kind='del'] .wt-sign {
  color: var(--wt-del-ink);
}

/* \u5173\u8054\u4F1A\u8BDD */
.wt-sessions {
  padding: 4px 12px;
}
.wt-session {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) max-content;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: var(--wt-r-sm);
}
.wt-session:hover {
  background: var(--wt-hover);
}
.wt-toolchip {
  justify-self: start;
  height: 20px;
  padding: 0 7px;
  border-radius: 4px;
  background: var(--wt-raised);
  color: var(--wt-ink-2);
  font-size: 11px;
  font-weight: 600;
  line-height: 20px;
}
.wt-sbody {
  display: grid;
  gap: 1px;
  min-width: 0;
}
.wt-stitle {
  overflow: hidden;
  font-size: 12.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-sbody small {
  overflow: hidden;
  color: var(--wt-ink-3);
  font-size: 11.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-sacts {
  display: flex;
  align-items: center;
  gap: 2px;
}
.wt-sessionbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 6px 20px;
}

/* \u6CA1\u6709\u9009\u4E2D\u9879\u65F6\u7684\u6982\u89C8 */
.wt-empty {
  display: grid;
  gap: 16px;
  justify-items: center;
  max-width: 480px;
  margin: 0 auto;
  padding: 56px 32px;
  text-align: center;
}
.wt-empty h2 {
  font-size: 17px;
  font-weight: 650;
  letter-spacing: -0.01em;
}
.wt-emptystats {
  display: flex;
  gap: 32px;
}
.wt-emptystats div {
  display: grid;
  gap: 2px;
}
.wt-emptystats dt {
  color: var(--wt-ink-3);
  font-size: 11.5px;
}
.wt-emptystats dt[data-tone='danger'] {
  color: var(--wt-danger);
}
.wt-emptystats dt[data-tone='warn'] {
  color: var(--wt-warn);
}
.wt-emptystats dt[data-tone='accent'] {
  color: var(--wt-accent);
}
.wt-emptystats dd {
  font-size: 24px;
  font-weight: 650;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}
.wt-empty .wt-dtext {
  max-width: 34em;
}
.wt-sources {
  justify-self: stretch;
  color: var(--wt-ink-3);
  font-size: 12px;
  text-align: left;
}
.wt-sources summary {
  cursor: pointer;
}
.wt-sources p {
  padding: 4px 0;
}

/* ---------- \u672C\u5730\u5206\u652F ---------- */
.wt-branchbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 10px 20px;
  border-bottom: 1px solid var(--wt-line);
}
.wt-branchsearch {
  flex: 1 1 200px;
  max-width: 320px;
}
.wt-branches {
  padding: 4px 12px;
}
.wt-branch {
  padding: 7px 8px;
  border-radius: var(--wt-r-sm);
}
.wt-branch:hover {
  background: var(--wt-hover);
}
.wt-branchtop {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.wt-bname {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-family: var(--wt-mono);
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-bup {
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  flex: none;
  color: var(--wt-ink-3);
  font-family: var(--wt-mono);
  font-size: 11.5px;
  white-space: nowrap;
}
.wt-bup[data-tone='accent'] {
  color: var(--wt-accent);
}
.wt-bup[data-tone='warn'] {
  color: var(--wt-warn);
}
.wt-bup em {
  max-width: 180px;
  overflow: hidden;
  font-style: normal;
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-branchsub {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 2px;
  min-width: 0;
  color: var(--wt-ink-3);
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}
.wt-branchsub code {
  font-size: 11px;
}
.wt-branchsub span {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--wt-ink-2);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-branchlist > .wt-dtext {
  padding: 8px 20px 0;
}

/* ---------- \u5BF9\u8BDD\u6846 ---------- */
.wt-modal-mask {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 20px;
  background: color-mix(in srgb, var(--wt-ink) 34%, transparent);
  animation: wt-fade 0.12s ease-out;
}
.wt-modal {
  width: min(440px, 100%);
  max-height: 100%;
  overflow: auto;
  border-radius: 12px;
  background: var(--wt-surface);
  color: var(--wt-ink);
  box-shadow: var(--wt-shadow);
  animation: wt-pop 0.14s ease-out;
}
.wt-modal.is-wide {
  width: min(580px, 100%);
}
.wt-modalhead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 12px 4px 18px;
}
.wt-modalhead h2 {
  font-size: 14.5px;
  font-weight: 650;
}
.wt-modalbody {
  padding: 8px 18px 8px;
}
.wt-modalfoot {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px 18px;
}
.wt-prunelist {
  display: grid;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: var(--wt-r);
  background: var(--wt-raised);
}
.wt-prunelist li {
  display: grid;
  gap: 1px;
  min-width: 0;
}
.wt-prunelist span {
  overflow: hidden;
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-prunepath {
  color: var(--wt-ink-3);
  font-size: 11px;
}
.wt-glossary {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 12px 18px;
  padding: 4px 0 8px;
}
.wt-glossary dt {
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
}
.wt-glossary dd {
  color: var(--wt-ink-2);
  font-size: 12.5px;
  line-height: 1.7;
}
@keyframes wt-fade {
  from {
    opacity: 0;
  }
}
@keyframes wt-pop {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
}

/* ---------- \u6309\u6E05\u5355\u5BBD\u5EA6\uFF1A\u4E24\u884C\u5F0F\u7D27\u51D1\u884C ---------- */
@container list (max-width: 620px) {
  .wt-listpath {
    display: none;
  }
}

/* \u6E05\u5355\u66F4\u7A84\u65F6\uFF08\u5E76\u6392\u5E03\u5C40\u7684\u5DE6\u680F\u6216\u624B\u673A\uFF09\uFF1A\u6E05\u5355\u5934\u53EA\u7559\u5FC5\u8981\u7684\u3002 */
@container list (max-width: 400px) {
  .wt-listsub {
    display: none;
  }
  .wt-sort > span {
    display: none;
  }
  .wt-listtitle {
    margin-left: 0;
  }
  .wt-listhead {
    padding-left: 12px;
  }
}

/* ---------- \u6309\u8BE6\u60C5\u680F\u5BBD\u5EA6\uFF1A\u56FE\u6807\u5F0F\u6309\u94AE\u3001\u6536\u7A84\u7559\u767D ---------- */
@container detail (max-width: 560px) {
  .wt-dhead {
    padding: 12px 14px 0;
  }
  .wt-dtabs,
  .wt-filebar {
    padding-right: 14px;
    padding-left: 14px;
  }
  .wt-session {
    grid-template-columns: minmax(0, 1fr) max-content;
  }
  .wt-session .wt-toolchip {
    grid-column: 1;
  }
  .wt-session .wt-sbody {
    grid-column: 1;
  }
  .wt-session .wt-sacts {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
  .wt-fchange {
    display: none;
  }
  .wt-bup em {
    display: none;
  }
}

/* \u8BE6\u60C5\u680F\u5F88\u7A84\u65F6\uFF08\u624B\u673A\uFF09\uFF1A\u5E94\u7528\u6309\u94AE\u6536\u6210\u7EAF\u56FE\u6807\u3002 */
@container detail (max-width: 430px) {
  .wt-btnlabel {
    display: none;
  }
  .wt-actions .wt-btn {
    width: 32px;
    height: 32px;
    justify-content: center;
    padding: 0;
  }
  .wt-actions .wt-btn.is-primary {
    width: auto;
    padding: 0 12px;
  }
}

/* ---------- \u6309\u9762\u677F\u5BBD\u5EA6\uFF1A\u7A84\u5C4F ---------- */
@container desk (max-width: 620px) {
  .wt-top {
    gap: 4px;
    height: 48px;
    padding: 0 6px 0 12px;
  }
  .wt-brand {
    margin-right: 2px;
  }
  .wt-search {
    flex: 1 1 auto;
  }
  .wt-search kbd {
    display: none;
  }
  .wt-readat {
    display: none;
  }
  .wt-filters {
    flex-wrap: nowrap;
    gap: 6px;
    padding: 6px 8px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .wt-filters > .wt-spacer {
    display: none;
  }
  .wt-filters > .wt-chips {
    flex: none;
    overflow: visible;
  }
  .wt-filters > .wt-chips + .wt-chips {
    padding-left: 8px;
    border-left: 1px solid var(--wt-line);
  }
  .wt-scope {
    max-width: 150px;
  }
  .wt-chip {
    padding: 0 8px;
  }
  .wt-dinner {
    padding-bottom: 20px;
  }
  .wt-empty {
    padding: 36px 20px;
  }
  .wt-emptystats {
    gap: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wt-wrap *,
  .wt-wrap *::before,
  .wt-wrap *::after {
    animation: none !important;
    transition: none !important;
  }
}
`;var te=t=>new URL(t,document.baseURI);async function Nn(t,e){if(!t.ok)throw Error((await t.json().catch(()=>({}))).error||e(t.status));return t.json()}async function Q(t,e,n,r){let i=te(`api/worktree-desk/${t}`);return i.search=new URLSearchParams(e).toString(),Nn(await fetch(i,{signal:n,cache:"no-store",...r?{method:"POST",headers:{"X-Worktree-Action":r}}:{}}),s=>`\u8BFB\u53D6\u5931\u8D25\uFF08${s}\uFF09`)}async function ke(t){let e=await fetch(te("open-in-app/apps"),{signal:t,cache:"no-store"}).catch(()=>null);return e?.ok?(await e.json().catch(()=>({}))).apps??[]:[]}async function ye(t,e){return!!(await fetch(te("open-in-app/open"),{method:"POST",cache:"no-store",headers:{"content-type":"application/json"},body:JSON.stringify({app:t,path:e})}).catch(()=>null))?.ok}var M=X(require("react"),1);var N=X(require("react"),1),Ne={branch:N.default.createElement(N.default.Fragment,null,N.default.createElement("circle",{cx:"6",cy:"5",r:"2.3"}),N.default.createElement("circle",{cx:"6",cy:"19",r:"2.3"}),N.default.createElement("circle",{cx:"18",cy:"5",r:"2.3"}),N.default.createElement("path",{d:"M6 7.3v9.4m12-9.4c0 6-5.5 6.4-12 6.4"})),search:N.default.createElement(N.default.Fragment,null,N.default.createElement("circle",{cx:"10.5",cy:"10.5",r:"6"}),N.default.createElement("path",{d:"m15 15 4.5 4.5"})),refresh:N.default.createElement("path",{d:"M20 10a8 8 0 1 0-1 7M20 4v6h-6"}),chevron:N.default.createElement("path",{d:"m7 10 5 5 5-5"}),close:N.default.createElement("path",{d:"M6 6l12 12M18 6 6 18"}),check:N.default.createElement("path",{d:"m5 12.5 4.5 4.5L19 7.5"}),copy:N.default.createElement(N.default.Fragment,null,N.default.createElement("rect",{x:"8",y:"8",width:"11",height:"12",rx:"2"}),N.default.createElement("path",{d:"M15 8V4H4v11h4"})),external:N.default.createElement(N.default.Fragment,null,N.default.createElement("path",{d:"M13.5 5H19v5.5M19 5l-8.5 8.5"}),N.default.createElement("path",{d:"M19 14.5V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3.5"})),folder:N.default.createElement("path",{d:"M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"}),terminal:N.default.createElement("path",{d:"M4 5.5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm3 4 3 3-3 3m5.5 0H17"}),code:N.default.createElement("path",{d:"m9 8-4 4 4 4m6-8 4 4-4 4"}),chat:N.default.createElement(N.default.Fragment,null,N.default.createElement("path",{d:"M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V16A1.5 1.5 0 0 1 4 14.5Z"}),N.default.createElement("path",{d:"M12 8.5v4M10 10.5h4"})),more:N.default.createElement(N.default.Fragment,null,N.default.createElement("circle",{cx:"5.5",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"}),N.default.createElement("circle",{cx:"12",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"}),N.default.createElement("circle",{cx:"18.5",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"})),warning:N.default.createElement("path",{d:"M12 4.5 3 19h18ZM12 10v4m0 2.6v.1"}),broom:N.default.createElement(N.default.Fragment,null,N.default.createElement("path",{d:"m14 4 6 6"}),N.default.createElement("path",{d:"M20 10 12.5 17.5a3 3 0 0 1-2.1.9H5.5a1 1 0 0 1-1-1v-4.9c0-.8.3-1.6.9-2.1L13 3"}),N.default.createElement("path",{d:"m9 11 4 4"})),back:N.default.createElement("path",{d:"M19 12H5m6-6-6 6 6 6"}),columns:N.default.createElement("path",{d:"M4 5.5h16v13H4Zm8 0v13"}),rows:N.default.createElement("path",{d:"M4 5.5h16v13H4Zm0 6.5h16"}),wrap:N.default.createElement("path",{d:"M4 6h16M4 10.5h12a3 3 0 0 1 0 6h-3m2-2-2 2 2 2"}),help:N.default.createElement(N.default.Fragment,null,N.default.createElement("circle",{cx:"12",cy:"12",r:"8"}),N.default.createElement("path",{d:"M9.8 9.6a2.3 2.3 0 1 1 3.2 2.1c-.7.3-1 .8-1 1.6m0 2.6v.1"})),lock:N.default.createElement(N.default.Fragment,null,N.default.createElement("path",{d:"M6 11h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z"}),N.default.createElement("path",{d:"M9 11V8a3 3 0 0 1 6 0v3"})),sort:N.default.createElement("path",{d:"M8 17V7M5 10l3-3 3 3M16 7v10m-3-3 3 3 3-3"}),filter:N.default.createElement("path",{d:"M4 6h16l-6.5 7.5V19l-3-1.8v-3.7Z"}),file:N.default.createElement(N.default.Fragment,null,N.default.createElement("path",{d:"M7 3.5h7l5 5V19a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5Z"}),N.default.createElement("path",{d:"M14 3.5v5h5"}))};function S({name:t="branch",size:e=16,className:n=""}){return N.default.createElement("svg",{className:`wt-icon ${n}`,width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",style:{flex:"none"}},Ne[t]??Ne.branch)}function at(t){let e=t.status;return t.prunable?{key:"stale",rank:8,tone:"muted",label:"\u767B\u8BB0\u5931\u6548"}:e?.conflicts?{key:"conflict",rank:0,tone:"danger",label:`${e.conflicts} \u4E2A\u51B2\u7A81`}:t.operations?.length?{key:"operation",rank:1,tone:"danger",label:t.operations.join(" \xB7 ")}:t.error?{key:"error",rank:2,tone:"danger",label:t.limited?"\u672A\u68C0\u67E5\u6587\u4EF6":"\u8BFB\u53D6\u5931\u8D25"}:e?.total?{key:"dirty",rank:3,tone:"warn",label:`${e.total} \u9879\u6539\u52A8`}:e?.ahead>0?{key:"ahead",rank:4,tone:"accent",label:`${e.ahead} \u4E2A\u63D0\u4EA4\u672A\u63A8\u9001`}:e?.behind>0?{key:"behind",rank:5,tone:"muted",label:`\u843D\u540E ${e.behind} \u4E2A\u63D0\u4EA4`}:e?{key:"clean",rank:7,tone:"clean",label:"\u5E72\u51C0"}:{key:"unknown",rank:6,tone:"muted",label:"\u65E0\u6587\u4EF6\u72B6\u6001"}}var Te=["Codex","ZCode","DSH"];function Ce(t){let e=0;for(let n of t.sessions??[])!n.archived&&n.time>e&&(e=n.time);return e}function $e(t,e,n=!0){if(n){let r=at(t).rank-at(e).rank;if(r)return r;let i=Ce(e)-Ce(t);if(i)return i}return(e.lastChange?.time??-1/0)-(t.lastChange?.time??-1/0)||t.path.localeCompare(e.path)}var nt={all:["\u5168\u90E8",()=>!0],dirty:["\u6709\u6539\u52A8",t=>t.status?.total>0],unpushed:["\u6709\u672A\u63A8\u9001",t=>t.status?.ahead>0],behind:["\u843D\u540E\u4E0A\u6E38",t=>t.status?.behind>0],trouble:["\u5F02\u5E38",t=>at(t).rank<=2],stale:["\u5931\u6548\u767B\u8BB0",t=>!!t.prunable]};function Lt(t){let e={dirty:0,unpushed:0,behind:0,trouble:0,stale:0};for(let n of t)nt.dirty[1](n)&&e.dirty++,nt.unpushed[1](n)&&e.unpushed++,nt.behind[1](n)&&e.behind++,nt.trouble[1](n)&&e.trouble++,nt.stale[1](n)&&e.stale++;return e}function pt(t){return t.bare?"\u88F8\u4ED3\u5E93":t.branch?t.branch:t.head?.slice(0,8)||"\u5206\u652F\u672A\u77E5"}function et(t,e=Date.now()){if(!Number.isFinite(t))return"\u65F6\u95F4\u672A\u77E5";let n=e-t,r=new Date(t),i=r.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1});if(n<60*1e3)return"\u521A\u521A";if(n<3600*1e3)return`${Math.floor(n/6e4)} \u5206\u949F\u524D`;if(n<720*60*1e3)return`${Math.floor(n/36e5)} \u5C0F\u65F6\u524D`;let s=r.toLocaleDateString("zh-CN",{month:"numeric",day:"numeric"});return n<10080*60*1e3?`${s} ${i}`:`${r.toLocaleDateString("zh-CN",{year:"numeric",month:"numeric",day:"numeric"})}`}function rt(t){return Number.isFinite(t)?new Date(t).toLocaleString("zh-CN",{hour12:!1}):"\u65F6\u95F4\u672A\u77E5"}var Se=t=>(t||"").toLocaleLowerCase();function ut(t,...e){let n=Se(t).trim().split(/\s+/).filter(Boolean);if(!n.length)return!0;let r=Se(e.filter(Boolean).join(`
`));return n.every(i=>r.includes(i))}var $t=(t,e)=>e&&t===e?"~":t.startsWith(e+"/")?"~/"+t.slice(e.length+1):t;function De(t){let e={files:[],dirs:new Map};for(let s of t){let c=s.path.split("/"),p=e;for(let f of c.slice(0,-1))p.dirs.has(f)||p.dirs.set(f,{files:[],dirs:new Map}),p=p.dirs.get(f);p.files.push(s)}let n=(s,c)=>s.path.localeCompare(c.path);function r(s,c){if(!s.files.length&&s.dirs.size===1){let[h,d]=[...s.dirs][0];return r(d,c+h+"/")}let p=[...s.dirs].sort(([h],[d])=>h.localeCompare(d)).map(([h,d])=>r(d,h+"/")),f=[...s.files].sort(n),k=f.length+p.reduce((h,d)=>h+d.count,0);return{name:c,dirs:p,files:f,count:k}}let i=r(e,"");return{dirs:i.dirs,files:i.files,count:i.count}}var Cn={A:"\u65B0\u589E",M:"\u4FEE\u6539",D:"\u5220\u9664",R:"\u91CD\u547D\u540D",C:"\u590D\u5236",T:"\u7C7B\u578B\u53D8\u5316"},Tt=t=>Cn[t]||t;function Ot(t){if(t.conflict)return{code:"U",text:"\u51B2\u7A81",detail:"\u5408\u5E76\u51B2\u7A81\uFF0C\u5C1A\u672A\u89E3\u51B3",staged:!1,tone:"danger"};if(t.xy==="??")return{code:"?",text:"\u672A\u8DDF\u8E2A",detail:"\u65B0\u6587\u4EF6\uFF0C\u5C1A\u672A\u52A0\u5165 Git",staged:!1,tone:"untracked"};let[e,n]=t.xy,r=e!==".",i=n!==".",s=t.from?`\uFF08\u539F ${t.from}\uFF09`:"",c,p;return r&&i?(c="\u5DF2\u6682\u5B58\uFF0C\u53C8\u6709\u6539\u52A8",p=`${Tt(e)}\u5DF2\u6682\u5B58${s}\uFF1B\u4E4B\u540E\u53C8${Tt(n)}\uFF0C\u672A\u6682\u5B58`):r?(c="\u5DF2\u6682\u5B58",p=`${Tt(e)}${s}\uFF0C\u5DF2\u6682\u5B58`):(c=Tt(n)+s,p=`${Tt(n)}${s}\uFF0C\u672A\u6682\u5B58`),{code:r&&i?e+n:r?e:n,text:c,detail:p,staged:r,tone:r?"staged":"unstaged"}}var ze=["#3b82f6","#6366f1","#a855f7","#d946ef","#ec4899","#0d9488","#0891b2","#7c8db5"];function Me(t){let e=String(t??""),n=/(?<![A-Za-z])([A-Za-z]{1,10})-(\d{2,7})(?!\d)/.exec(e),r=n?n[2]:/(?<!\d)(\d{4,6})(?!\d)/.exec(e)?.[1];if(!r)return null;let i=Number(r);return{key:n?`${n[1].toUpperCase()}-${r}`:r,color:ze[i%ze.length]}}var Sn=[["gitdir file points to non-existent location","\u5DE5\u4F5C\u6811\u7684 .git \u6587\u4EF6\u6307\u5411\u7684 Git \u76EE\u5F55\u5DF2\u4E0D\u5B58\u5728"],[".git points to non-existent location",".git \u6307\u5411\u7684 Git \u76EE\u5F55\u5DF2\u4E0D\u5B58\u5728"],["gitdir file does not exist","\u5DE5\u4F5C\u6811\u76EE\u5F55\u91CC\u6CA1\u6709 .git \u6587\u4EF6"],["not a valid directory","\u767B\u8BB0\u7684\u8DEF\u5F84\u4E0D\u662F\u4E00\u4E2A\u76EE\u5F55"],["unable to read gitdir file","\u8BFB\u4E0D\u5230\u5DE5\u4F5C\u6811\u7684 .git \u6587\u4EF6"],[".git is not a file",".git \u4E0D\u662F\u6587\u4EF6"]];function jt(t){let e=t.prunableReason||"";return Sn.find(([n])=>e.includes(n))?.[1]??e}function Pt(t){return t?.length===1&&t[0].main&&!t[0].prunable&&!t[0].error&&!t[0].operations?.length&&at(t[0]).key==="clean"&&!t[0].tools?.length}function He(t,e){let n=i=>Math.min(...i.live.map(s=>at(s).rank),99),r=i=>Math.max(...i.live.map(s=>s.lastChange?.time??0),0);return[...t].sort((i,s)=>(e==="attention"?n(i)-n(s):0)||r(s)-r(i)||i.repo.name.localeCompare(s.repo.name))}var Wt={all:["\u5168\u90E8",()=>!0],unchecked:["\u672A\u68C0\u51FA",(t,e)=>!e],unpushed:["\u6709\u672A\u63A8\u9001",t=>t.ahead>0],merged:["\u5DF2\u5E76\u5165",t=>t.merged]},zn=t=>t.upstream?t.gone?"\u4E0A\u6E38\u5F15\u7528\u5DF2\u4E0D\u5B58\u5728":[t.ahead&&`\u2191${t.ahead}`,t.behind&&`\u2193${t.behind}`].filter(Boolean).join(" ")||"\u4E0E\u4E0A\u6E38\u540C\u6B65":"\u672A\u8BBE\u4E0A\u6E38",Tn=t=>t.behind>0?"warn":t.ahead>0?"accent":t.gone?"stale":"muted";function Ee({repo:t,now:e,showTree:n,retry:r}){let[i,s]=(0,M.useState)(""),[c,p]=(0,M.useState)("all"),[f,k]=(0,M.useState)(80),h=t.data?.branches,d=t.data?.mergedInto?.replace(/^origin\//,""),g=(0,M.useMemo)(()=>{let x=new Set;for(let z of t.data?.trees??[])z.branch&&!z.bare&&x.add(z.branch);return x},[t.data]);if(!h)return M.default.createElement("div",{className:"wt-branchlist"},M.default.createElement("p",{className:"wt-inlineerror",role:"alert"},M.default.createElement(S,{name:"warning",size:14}),"\u672C\u5730\u5206\u652F\u8BFB\u53D6\u5931\u8D25\u3002",M.default.createElement("button",{className:"wt-linkbtn",onClick:()=>r(t.id)},"\u91CD\u8BD5")));let y=i.trim(),v=h.filter(x=>ut(y,x.name,x.head,x.upstream)&&Wt[c][1](x,g.has(x.name))),b=Object.fromEntries(Object.keys(Wt).map(x=>[x,h.filter(z=>Wt[x][1](z,g.has(z.name))).length]));return M.default.createElement("div",{className:"wt-branchlist"},M.default.createElement("div",{className:"wt-branchbar"},M.default.createElement("label",{className:"wt-minisearch wt-branchsearch"},M.default.createElement(S,{name:"search",size:13}),M.default.createElement("input",{"aria-label":"\u7B5B\u9009\u672C\u5730\u5206\u652F",placeholder:"\u7B5B\u9009\u5206\u652F\u3001\u4E0A\u6E38\u6216\u63D0\u4EA4",value:i,onChange:x=>{s(x.target.value),k(80)}}),i&&M.default.createElement("button",{className:"wt-iconbtn","aria-label":"\u6E05\u9664",onClick:()=>s("")},M.default.createElement(S,{name:"close",size:12}))),M.default.createElement("div",{className:"wt-seg wt-seg-sm",role:"tablist"},Object.entries(Wt).map(([x,[z]])=>M.default.createElement("button",{key:x,role:"tab","aria-selected":c===x,onClick:()=>{p(x),k(80)}},z,M.default.createElement("b",null,b[x]))))),v.length?M.default.createElement("ul",{className:"wt-branches"},v.slice(0,f).map(x=>{let z=(t.data.trees??[]).filter(D=>D.branch===x.name&&!D.bare);return M.default.createElement("li",{className:"wt-branch",key:x.name},M.default.createElement("div",{className:"wt-branchtop"},M.default.createElement("span",{className:"wt-bname",title:x.name},x.name),x.merged&&M.default.createElement("small",{className:"wt-tag",title:`\u5DF2\u5B8C\u6574\u5E76\u5165 ${d}\uFF08\u6309\u672C\u5730\u8BB0\u5F55\uFF09`},"\u5DF2\u5E76\u5165"),M.default.createElement("span",{className:"wt-spacer"}),z.length?z.map(D=>M.default.createElement("button",{key:D.path,className:"wt-linkbtn",title:D.path,onClick:()=>n(D.path)},D.main?"\u4E3B\u76EE\u5F55":"\u67E5\u770B\u5DE5\u4F5C\u6811",M.default.createElement(S,{name:"external",size:12}))):M.default.createElement("small",{className:"wt-tag is-muted"},"\u672A\u68C0\u51FA")),M.default.createElement("p",{className:"wt-branchsub"},M.default.createElement("span",{className:"wt-bup","data-tone":Tn(x),title:x.upstream?`\u8DDF\u8E2A\u4E0A\u6E38 ${x.upstream}\uFF08\u6309\u672C\u5730\u8BB0\u5F55\uFF0C\u4E0D\u8054\u7F51\u66F4\u65B0\uFF09`:"\u6CA1\u6709\u8BBE\u7F6E\u8DDF\u8E2A\u4E0A\u6E38\uFF1B\u4E0D\u4EE3\u8868\u6CA1\u6709\u63A8\u9001"},zn(x),x.upstream&&M.default.createElement("em",null,x.upstream)),M.default.createElement("code",{title:x.head},x.head),M.default.createElement("time",{title:rt(x.time)},et(x.time,e)),M.default.createElement("span",{title:x.subject},x.subject)))})):M.default.createElement("p",{className:"wt-emptyline"},"\u6CA1\u6709\u5339\u914D\u7684\u672C\u5730\u5206\u652F\u3002"),v.length>f&&M.default.createElement("button",{className:"wt-more",onClick:()=>k(f+80)},"\u7EE7\u7EED\u663E\u793A\uFF08\u8FD8\u6709 ",v.length-f," \u4E2A\uFF09"),M.default.createElement("p",{className:"wt-dtext"},"\u300C\u5DF2\u5E76\u5165\u300D\u6309\u672C\u5730\u8BB0\u5F55\u5224\u65AD\uFF0C\u76F8\u5BF9 ",M.default.createElement("code",null,d??"\u4E3B\u5206\u652F"),"\uFF1B\u672A\u68C0\u51FA\u4E0D\u7B49\u4E8E\u53EF\u4EE5\u5220\u9664\u3002"))}var o=X(require("react"),1);var mt=X(require("react"),1);function ct({text:t,className:e="",title:n}){return mt.default.createElement("span",{className:"wt-tail "+e,title:n},mt.default.createElement("span",{dir:"ltr"},t))}function ee({value:t,label:e,act:n,title:r}){let[i,s]=mt.default.useState(!1);return mt.default.useEffect(()=>{if(!i)return;let c=setTimeout(()=>s(!1),1400);return()=>clearTimeout(c)},[i]),mt.default.createElement("button",{className:"wt-iconbtn",title:r??"\u590D\u5236","aria-label":r??"\u590D\u5236",onClick:async()=>{await n.copy(t,e,!0)&&s(!0)}},mt.default.createElement(S,{name:i?"check":"copy",size:14}))}var m=X(require("react"),1);var Ae=/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)$/,Ie=/^@@@ -(\d+)(?:,(\d+))? (?:-\d+(?:,\d+)? )+\+(\d+)(?:,(\d+))? @@@(.*)$/;function ne(t,e){let n={oldStart:Number(e[1]),oldCount:e[2]===void 0?1:Number(e[2]),newStart:Number(e[3]),newCount:e[4]===void 0?1:Number(e[4]),heading:e[5].trim(),lines:[]};return t.hunks.push(n),n}var $n=["","0",void 0,"1",void 0,""];function ae(t){let e=String(t??"").split(`
`);e.at(-1)===""&&e.pop();let n={from:null,to:null,oldMode:null,newMode:null,binary:!1,hunks:[],additions:0,deletions:0},r=null,i=null,s=0,c=0,p=!1;for(let f of e){if(!r){let y=Ie.exec(f)||Ae.exec(f);if(y){p=y[0].startsWith("@@@"),r=ne(n,y),s=r.oldStart,c=r.newStart,i=null;continue}if(f.startsWith("--- ")){n.from=f.slice(4).split("	")[0];continue}if(f.startsWith("+++ ")){n.to=f.slice(4).split("	")[0];continue}if(f.startsWith("old mode ")){n.oldMode=f.slice(9).trim();continue}if(f.startsWith("new mode ")){n.newMode=f.slice(9).trim();continue}if(/^(Binary files |GIT binary patch)/.test(f)){n.binary=!0;continue}if(!/^[ +-]/.test(f))continue;r=ne(n,$n),p=!1,s=0,c=1,i=null}if(f.startsWith("diff --git "))break;let k=f[0];if(k==="@"){let y=Ie.exec(f)||Ae.exec(f);if(y){p=y[0].startsWith("@@@"),r=ne(n,y),s=r.oldStart,c=r.newStart,i=null;continue}}if(k==="\\"){i&&(i.noNewline=!0);continue}let h=p?f[0]:k,d=h==="+"?"add":h==="-"?"del":"ctx",g={kind:d,text:f.slice(p?2:1),oldNo:null,newNo:null,noNewline:!1};d!=="add"&&(g.oldNo=s++),d!=="del"&&(g.newNo=c++),d==="add"?n.additions++:d==="del"&&n.deletions++,r.lines.push(g),i=g}return n}function je(t){let e=[],n=[],r=()=>{let i=n.filter(p=>p.kind==="del"),s=n.filter(p=>p.kind==="add"),c=Math.min(i.length,s.length);for(let p=0;p<c;p++)e.push({kind:"change",left:i[p],right:s[p]});for(let p=c;p<i.length;p++)e.push({kind:"del",left:i[p],right:null});for(let p=c;p<s.length;p++)e.push({kind:"add",left:null,right:s[p]});n.length=0};for(let i of t.lines)i.kind==="ctx"?(r(),e.push({kind:"ctx",left:i,right:i})):n.push(i);return r(),e}var Dn=/\s+|[\w\u0080-\uffff]+|[^\s\w\u0080-\uffff]/gu,Mn=16e4;function Le(t){let e=[];for(let n of t.matchAll(Dn))e.push([n.index,n.index+n[0].length]);return e}function Pe(t,e){let n=Le(t),r=Le(e),i=n.map(([y,v])=>t.slice(y,v)),s=r.map(([y,v])=>e.slice(y,v)),c=0;for(;c<i.length&&c<s.length&&i[c]===s[c];)c++;let p=i.length,f=s.length;for(;p>c&&f>c&&i[p-1]===s[f-1];)p--,f--;let k=new Uint8Array(i.length),h=new Uint8Array(s.length),d=p-c,g=f-c;if(d&&g&&d*g>Mn)k.fill(1,c,p),h.fill(1,c,f);else if(d&&g){let y=new Uint16Array((d+1)*(g+1)),v=(z,D)=>z*(g+1)+D;for(let z=d-1;z>=0;z--)for(let D=g-1;D>=0;D--)y[v(z,D)]=i[c+z]===s[c+D]?y[v(z+1,D+1)]+1:Math.max(y[v(z+1,D)],y[v(z,D+1)]);let b=0,x=0;for(;b<d&&x<g;)i[c+b]===s[c+x]?(b++,x++):y[v(b+1,x)]>=y[v(b,x+1)]?k[c+b++]=1:h[c+x++]=1;for(;b<d;)k[c+b++]=1;for(;x<g;)h[c+x++]=1}else{for(let y=c;y<p;y++)k[y]=1;for(let y=c;y<f;y++)h[y]=1}return[Oe(k,n,t),Oe(h,r,e)]}function Oe(t,e,n){let r=[];for(let i=0;i<e.length;i++){if(t[i]!==1)continue;let[s,c]=e[i],p=r.at(-1);!!p&&(p[1]===s||/^\s+$/.test(n.slice(s,c))||/^\s+$/.test(n.slice(p[1],s)))?r[r.length-1]=[p[0],c]:r.push([s,c])}return r.flatMap(([i,s])=>{let c=/^\s*/.exec(n.slice(i,s))[0].length,p=/\s*$/.exec(n.slice(i,s))[0].length;return i+c<s-p?[[i+c,s-p]]:[]})}var ft="worktree-desk/tree",ie={current:null},re="worktree-desk.prefs",it={get(t,e){try{return JSON.parse(localStorage.getItem(re)??"{}")[t]??e}catch{return e}},set(t,e){try{localStorage.setItem(re,JSON.stringify({...JSON.parse(localStorage.getItem(re)??"{}"),[t]:e}))}catch{}}},Hn=[["iterm","warp","ghostty","kitty","terminal","windowsterminal"],["vscode","vscodeinsiders","cursor","windsurf","zed","xcode","intellij"],["sourcetree","fork","github","tower","gitkraken"],["finder","explorer","filemanager"]],En=["terminal","code","branch","folder"],An={iterm:"iTerm",warp:"Warp",ghostty:"Ghostty",kitty:"kitty",terminal:"\u7EC8\u7AEF",windowsterminal:"\u7EC8\u7AEF",vscode:"VS Code",vscodeinsiders:"VS Code Insiders",cursor:"Cursor",windsurf:"Windsurf",zed:"Zed",xcode:"Xcode",intellij:"IntelliJ IDEA",sourcetree:"Sourcetree",fork:"Fork",github:"GitHub Desktop",tower:"Tower",gitkraken:"GitKraken",finder:"\u8BBF\u8FBE",explorer:"\u8D44\u6E90\u7BA1\u7406\u5668",filemanager:"\u6587\u4EF6\u7BA1\u7406\u5668"},In=new Set(["finder","explorer","filemanager"]),Ln=[{app:"finder",target:"finder",group:3,label:"\u5728\u8BBF\u8FBE\u4E2D\u663E\u793A",icon:"folder",fallback:!0},{app:"terminal",target:"terminal",group:0,label:"\u5728\u7EC8\u7AEF\u4E2D\u6253\u5F00",icon:"terminal",fallback:!0}];function We(t){return t?.length?Hn.flatMap((e,n)=>e.filter(r=>t.includes(r)).map(r=>{let i=An[r]??r;return{app:r,group:n,icon:En[n],label:In.has(r)?`\u5728 ${i} \u4E2D\u663E\u793A`:`\u5728 ${i} \u4E2D\u6253\u5F00`}})):Ln}function Fe(t){let{lookup:e,apps:n,act:r}=ie.current??{},i=e?.(t.repo,t.path);if(!i||!r)return[];let s=!i.prunable&&!i.error,c=d=>i.sessions.find(g=>g.source===d&&!g.archived),p=i.sessions.filter(d=>d.source==="DSH"&&!d.archived),f=c("Codex"),k=c("ZCode"),h=[];if(s&&r.dsh&&(p.length&&h.push({id:"dsh:open",label:"\u6253\u5F00 DSH \u4F1A\u8BDD",run:()=>r.openDsh(i)}),h.push({id:"dsh:new",label:p.length?"\u65B0\u5F00\u4E00\u4E2A DSH \u4F1A\u8BDD":"\u5728 DSH \u65B0\u5F00\u4F1A\u8BDD",run:()=>r.newDsh(i)})),f&&h.push({id:"codex:open",label:"\u5728 Codex \u4E2D\u6253\u5F00",run:()=>r.openTool(i,f,t.repo)}),k&&h.push({id:"zcode:open",label:"\u5728 ZCode \u4E2D\u6253\u5F00",run:()=>r.openTool(i,k,t.repo)}),s)for(let d of n)h.push({id:`open:${d.app}`,label:d.label,separatorBefore:h.length===0,run:()=>r.openApp(t.repo,i,d)});return h.push({id:"copy:path",label:"\u590D\u5236\u8DEF\u5F84",separatorBefore:h.length>0,run:()=>r.copy(i.path,"\u5DF2\u590D\u5236\u8DEF\u5F84")}),i.branch&&h.push({id:"copy:branch",label:"\u590D\u5236\u5206\u652F\u540D",run:()=>r.copy(i.branch,"\u5DF2\u590D\u5236\u5206\u652F\u540D")}),i.prunable&&h.push({id:"prune",label:"\u6E05\u7406\u672C\u4ED3\u5E93\u7684\u5931\u6548\u767B\u8BB0",danger:!0,separatorBefore:!0,run:()=>r.requestPrune(t.repo)}),h}function On(t){if(t.xy==="??")return[["new","\u65B0\u6587\u4EF6"]];if(t.conflict)return[["work","\u51B2\u7A81"]];let e=[];return t.xy[0]!=="."&&e.push(["index","\u5DF2\u6682\u5B58"]),t.xy[1]!=="."&&e.push(["work","\u672A\u6682\u5B58"]),e}function jn(t,e){let n=[],r=0;for(let[i,s]of e)i>r&&n.push({text:t.slice(r,i),mark:!1}),n.push({text:t.slice(i,s),mark:!0}),r=s;return r<t.length&&n.push({text:t.slice(r),mark:!1}),n}function Ft({text:t,ranges:e}){return m.default.createElement("span",{className:"wt-code"},jn(t,e).map((n,r)=>n.mark?m.default.createElement("mark",{key:r},n.text):m.default.createElement("span",{key:r},n.text)))}function qe(t){return(0,m.useMemo)(()=>je(t).map(e=>({...e,ranges:e.left&&e.right?Pe(e.left.text,e.right.text):[[],[]]})),[t])}function Pn({hunk:t}){let e=qe(t);return m.default.createElement("div",{className:"wt-hunkbody"},e.flatMap((n,r)=>{if(n.kind==="ctx")return[m.default.createElement("div",{className:"wt-line","data-kind":"ctx",key:r},m.default.createElement("span",{className:"wt-ln"},n.left.oldNo??""),m.default.createElement("span",{className:"wt-ln"},n.left.newNo??""),m.default.createElement("span",{className:"wt-sign"}," "),m.default.createElement(Ft,{text:n.left.text,ranges:[]}))];let i=[];return n.left&&i.push(m.default.createElement("div",{className:"wt-line","data-kind":"del",key:`${r}-`},m.default.createElement("span",{className:"wt-ln"},n.left.oldNo??""),m.default.createElement("span",{className:"wt-ln"}),m.default.createElement("span",{className:"wt-sign"},"-"),m.default.createElement(Ft,{text:n.left.text,ranges:n.ranges[0]}))),n.right&&i.push(m.default.createElement("div",{className:"wt-line","data-kind":"add",key:`${r}+`},m.default.createElement("span",{className:"wt-ln"}),m.default.createElement("span",{className:"wt-ln"},n.right.newNo??""),m.default.createElement("span",{className:"wt-sign"},"+"),m.default.createElement(Ft,{text:n.right.text,ranges:n.ranges[1]}))),i}))}function Ze({line:t,ranges:e}){return t?m.default.createElement("div",{className:"wt-half","data-kind":t.kind},m.default.createElement("span",{className:"wt-ln"},t.oldNo??""),m.default.createElement("span",{className:"wt-sign"},t.kind==="add"?"+":t.kind==="del"?"-":""),m.default.createElement(Ft,{text:t.text,ranges:e})):m.default.createElement("div",{className:"wt-half is-empty"},m.default.createElement("span",{className:"wt-ln"}),m.default.createElement("span",{className:"wt-sign"}),m.default.createElement("span",{className:"wt-code"}))}function Wn({hunk:t}){let e=qe(t);return m.default.createElement("div",{className:"wt-hunkbody is-split"},e.map((n,r)=>m.default.createElement("div",{className:"wt-srow",key:r,"data-kind":n.kind},m.default.createElement(Ze,{line:n.left,ranges:n.ranges[0]}),m.default.createElement(Ze,{line:n.right,ranges:n.ranges[1]}))))}var Be=(t,e)=>e===1?`${t}`:`${t},${e}`;function Fn({hunk:t,split:e}){let n=`-${Be(t.oldStart,t.oldCount)}`,r=`+${Be(t.newStart,t.newCount)}`;return m.default.createElement("div",{className:"wt-hunkhead"+(e?" is-split":"")},e?m.default.createElement(m.default.Fragment,null,m.default.createElement("span",{className:"wt-ln"}),m.default.createElement("span",{className:"wt-sign"}),m.default.createElement("span",{className:"wt-hunklabel"},m.default.createElement("code",null,n),t.heading&&m.default.createElement("span",{className:"wt-hunkctx"},t.heading)),m.default.createElement("span",{className:"wt-ln"}),m.default.createElement("span",{className:"wt-sign"}),m.default.createElement("span",{className:"wt-hunklabel"},m.default.createElement("code",null,r))):m.default.createElement(m.default.Fragment,null,m.default.createElement("span",{className:"wt-ln"}),m.default.createElement("span",{className:"wt-ln"}),m.default.createElement("span",{className:"wt-sign"}),m.default.createElement("span",{className:"wt-hunklabel"},m.default.createElement("code",null,"@@ ",n," ",r," @@"),t.heading&&m.default.createElement("span",{className:"wt-hunkctx"},t.heading))))}function Zn({text:t,split:e}){let n=(0,m.useMemo)(()=>ae(t).hunks,[t]);return m.default.createElement("div",{className:"wt-diff"+(e?" is-split":"")},n.map((r,i)=>m.default.createElement("div",{className:"wt-hunk",key:i},m.default.createElement(Fn,{hunk:r,split:e}),e?m.default.createElement(Wn,{hunk:r}):m.default.createElement(Pn,{hunk:r}))))}function oe({file:t,repository:e,tree:n,wide:r,title:i,native:s}){let c=(0,m.useMemo)(()=>On(t),[t]),[p,f]=(0,m.useState)(c.at(-1)[0]),[k,h]=(0,m.useState)(()=>r&&it.get("split",!1)),[d,g]=(0,m.useState)(()=>it.get("wrap",!r)),[y,v]=(0,m.useState)(null);(0,m.useEffect)(()=>{let T=new AbortController;return v(null),Q("patch",{id:e,tree:n,file:t.id,layer:p},T.signal).then(E=>{T.signal.aborted||v({layer:p,...E})}).catch(E=>{T.signal.aborted||v({layer:p,note:E.message})}),()=>T.abort()},[t.id,e,n,p]);let b=y?.layer===p?y:null,x=(0,m.useMemo)(()=>b?.text?ae(b.text):null,[b]),z=t.add??x?.additions,D=t.del??x?.deletions;return m.default.createElement("section",{className:"wt-diffbox","aria-label":"\u6587\u4EF6\u5DEE\u5F02"},m.default.createElement("div",{className:"wt-diffsticky"},i,m.default.createElement("div",{className:"wt-difftools"},m.default.createElement("div",{className:"wt-seg wt-seg-sm",role:"tablist"},c.map(([T,E])=>m.default.createElement("button",{key:T,role:"tab","aria-selected":p===T,onClick:()=>f(T)},E))),m.default.createElement("small",{className:"wt-diffnote"},p==="index"?"HEAD \u2192 \u6682\u5B58\u533A":p==="work"?t.conflict?"\u5408\u5E76\u4E2D\u7684\u5DE5\u4F5C\u6587\u4EF6":"\u6682\u5B58\u533A \u2192 \u5DE5\u4F5C\u76EE\u5F55":"\u5DE5\u4F5C\u76EE\u5F55\u4E2D\u7684\u65B0\u6587\u4EF6"),m.default.createElement("span",{className:"wt-spacer"}),t.xy!=="??"&&m.default.createElement("span",{className:"wt-fstat",title:t.add!=null?"\u76F8\u5BF9 HEAD \u7684\u589E\u5220\u884C\u6570":void 0},m.default.createElement("i",null,"+",t.add??x?.additions??"\u2014"),m.default.createElement("i",null,"\u2212",t.del??x?.deletions??"\u2014")),m.default.createElement("button",{className:"wt-iconbtn",title:r?k?"\u5207\u6362\u4E3A\u4E0A\u4E0B\u5BF9\u7167":"\u5207\u6362\u4E3A\u5DE6\u53F3\u5E76\u6392":"\u9762\u677F\u4E0D\u591F\u5BBD\uFF0C\u65E0\u6CD5\u5DE6\u53F3\u5E76\u6392","aria-label":k?"\u5207\u6362\u4E3A\u4E0A\u4E0B\u5BF9\u7167":"\u5207\u6362\u4E3A\u5DE6\u53F3\u5E76\u6392","aria-pressed":k,disabled:!r,onClick:()=>{!k&&!d&&(g(!0),it.set("wrap",!0)),h(!k),it.set("split",!k)}},m.default.createElement(S,{name:k?"rows":"columns",size:15})),m.default.createElement("button",{className:"wt-iconbtn",title:d?"\u53D6\u6D88\u81EA\u52A8\u6362\u884C":"\u957F\u884C\u81EA\u52A8\u6362\u884C","aria-label":d?"\u53D6\u6D88\u81EA\u52A8\u6362\u884C":"\u957F\u884C\u81EA\u52A8\u6362\u884C","aria-pressed":d,onClick:()=>{g(!d),it.set("wrap",!d)}},m.default.createElement(S,{name:"wrap",size:15})))),!b||b.note?m.default.createElement("p",{className:"wt-emptyline",role:"status"},b?.note||"\u6B63\u5728\u8BFB\u53D6\u5DEE\u5F02\u2026"):x?.binary?m.default.createElement("p",{className:"wt-emptyline"},"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u672C\u5DEE\u5F02\u3002"):x?.hunks.length?m.default.createElement("div",{className:"wt-diffscroll","data-wrap":d},m.default.createElement(Zn,{text:b.text,split:k})):m.default.createElement("p",{className:"wt-emptyline"},"\u8FD9\u4E2A\u6587\u4EF6\u6CA1\u6709\u5185\u5BB9\u5DEE\u5F02\u3002"),b?.truncated&&m.default.createElement("p",{className:"wt-emptyline"},"\u5DEE\u5F02\u8F83\u957F\uFF0C\u53EA\u663E\u793A\u4E86\u5F00\u5934\u90E8\u5206\u3002",s&&m.default.createElement("button",{className:"wt-linkbtn",onClick:()=>s(t)},"\u5230 DSH \u53F3\u680F\u770B\u5B8C\u6574\u5DEE\u5F02",m.default.createElement(S,{name:"external",size:12}))))}var $=X(require("react"),1);var Bn={all:"\u5168\u90E8",unstaged:"\u672A\u6682\u5B58",staged:"\u5DF2\u6682\u5B58",untracked:"\u672A\u8DDF\u8E2A"},Ge={unstaged:t=>t.unstaged,staged:t=>t.staged,untracked:(t,e)=>e.xy==="??"},Ve=t=>t.slice(t.lastIndexOf("/")+1);function Ke(t){let e=0,n=0,r=!1;for(let i of t.files)i.add!=null&&(e+=i.add,n+=i.del,r=!0);for(let i of t.dirs){let s=Ke(i);e+=s.add,n+=s.del,r||=s.known}return{add:e,del:n,known:r}}function qn({file:t}){return t.xy==="??"?$.default.createElement("span",{className:"wt-fstat"},t.lines!=null?$.default.createElement("i",null,"+",t.lines):$.default.createElement("i",null,"\u65B0\u6587\u4EF6")):t.add==null?$.default.createElement("span",{className:"wt-fstat"}):$.default.createElement("span",{className:"wt-fstat"},$.default.createElement("i",null,"+",t.add),$.default.createElement("i",null,"\u2212",t.del))}function Ue({node:t,prefix:e,depth:n,badges:r,isOpen:i,toggle:s,open:c,onOpen:p,inline:f,renderDiff:k}){let h=d=>{let g=r.get(d.path);return c?.id===d.id&&f?$.default.createElement("div",{className:"wt-filewrap",key:d.path,style:{"--depth":n}},k(d,g)):$.default.createElement("div",{className:"wt-filewrap",key:d.path,style:{"--depth":n}},$.default.createElement("button",{className:"wt-file","aria-expanded":!1,title:`${d.path} \xB7 ${g.detail}`,onClick:()=>p(d)},$.default.createElement("span",{className:"wt-badge","data-tone":g.tone},g.code),$.default.createElement("span",{className:"wt-fname"},n?Ve(d.path):d.path,d.from&&$.default.createElement("small",null," \u2190 ",Ve(d.from))),$.default.createElement("span",{className:"wt-fchange"},g.text),$.default.createElement(qn,{file:d}),$.default.createElement(S,{name:"chevron",size:12,className:"wt-file-chevron"+(f?"":" is-away")})))};return $.default.createElement($.default.Fragment,null,t.dirs.map(d=>{let g=e+d.name,y=i(g),v=Ke(d);return $.default.createElement("div",{className:"wt-dirwrap",key:g},$.default.createElement("button",{className:"wt-dir",style:{"--depth":n},"aria-expanded":y,onClick:()=>s(g)},$.default.createElement(S,{name:"chevron",size:12,className:y?"is-open":""}),$.default.createElement("span",{className:"wt-dirname"},d.name),$.default.createElement("span",{className:"wt-dircount"},d.count),v.known&&$.default.createElement("span",{className:"wt-fstat"},$.default.createElement("i",null,"+",v.add),$.default.createElement("i",null,"\u2212",v.del))),y&&$.default.createElement(Ue,{node:d,prefix:g,depth:n+1,badges:r,isOpen:i,toggle:s,open:c,onOpen:p,inline:f,renderDiff:k}))}),t.files.map(h))}function _e({tree:t,open:e,onOpen:n,inline:r,renderDiff:i}){let s=t.status,c=(0,$.useMemo)(()=>new Map(s.files.map(T=>[T.path,Ot(T)])),[s]),[p,f]=(0,$.useState)("all"),[k,h]=(0,$.useState)(""),[d,g]=(0,$.useState)(()=>({all:s.files.length<=40,off:new Set,on:new Set})),y=s.files.filter(T=>{let E=c.get(T.path);return Ge[p]&&!Ge[p](E,T)?!1:ut(k,T.path,T.from)}),v=(0,$.useMemo)(()=>De(y),[y]),b=p!=="all"||k.trim()!=="",x=T=>d.off.has(T)?!1:d.on.has(T)?!0:b||d.all,z=T=>g(E=>{let W=new Set(E.on),F=new Set(E.off);return x(T)?(W.delete(T),F.add(T)):(F.delete(T),W.add(T)),{...E,on:W,off:F}}),D={unstaged:s.unstaged,staged:s.staged,untracked:s.untracked};return $.default.createElement("div",{className:"wt-filelist"},$.default.createElement("div",{className:"wt-filebar"},$.default.createElement("div",{className:"wt-seg wt-seg-sm",role:"tablist"},Object.entries(Bn).map(([T,E])=>$.default.createElement("button",{key:T,role:"tab","aria-selected":p===T,onClick:()=>f(T)},E,T!=="all"&&D[T]>0&&$.default.createElement("b",null,D[T])))),$.default.createElement("label",{className:"wt-minisearch"},$.default.createElement(S,{name:"search",size:13}),$.default.createElement("input",{"aria-label":"\u7B5B\u9009\u6587\u4EF6",placeholder:"\u7B5B\u9009\u6587\u4EF6",value:k,onChange:T=>h(T.target.value)})),v.dirs.length>0&&!b&&$.default.createElement("button",{className:"wt-linkbtn",onClick:()=>g(T=>({...T,all:!T.all,on:new Set,off:new Set}))},d.all?"\u5168\u90E8\u6536\u8D77":"\u5168\u90E8\u5C55\u5F00")),y.length?$.default.createElement("div",{className:"wt-files"},$.default.createElement(Ue,{node:v,prefix:"",depth:0,badges:c,isOpen:x,toggle:z,open:e,onOpen:n,inline:r,renderDiff:i})):$.default.createElement("p",{className:"wt-emptyline"},"\u6CA1\u6709\u7B26\u5408\u7B5B\u9009\u6761\u4EF6\u7684\u6587\u4EF6\u3002"),s.total>s.files.length&&$.default.createElement("p",{className:"wt-emptyline"},"\u53EA\u5217\u51FA\u524D ",s.files.length," \u9879\uFF0C\u5171 ",s.total," \u9879\u3002"))}function Gn(t){let e=t.origin;if(!e)return"\u65E0\u521B\u5EFA\u8BB0\u5F55";if(e.kind==="initial")return"\u4ED3\u5E93\u7684\u9996\u6B21\u63D0\u4EA4";if(!e.ref)return"\u67D0\u6B21\u63D0\u4EA4\uFF08\u5206\u652F\u540D\u672A\u8BB0\u5F55\uFF09";let n=/^[0-9a-f]{7,64}$/i.test(e.ref);return e.kind==="copy"?`\u590D\u5236\u81EA ${e.ref}`:n&&e.sha.toLowerCase().startsWith(e.ref.toLowerCase())||e.ref==="HEAD"?"\u67D0\u6B21\u63D0\u4EA4\uFF08\u5206\u652F\u540D\u672A\u8BB0\u5F55\uFF09":`\u521B\u5EFA\u81EA ${e.ref}`}function Vn({tree:t}){let e=t.status;return o.default.createElement("p",{className:"wt-facts"},o.default.createElement("span",{title:"\u5F53\u524D\u63D0\u4EA4"},o.default.createElement("i",null,"HEAD"),o.default.createElement("code",null,t.head?.slice(0,10)||"\u5C1A\u65E0\u63D0\u4EA4")),t.branch&&o.default.createElement("span",{title:"\u6765\u6E90\uFF1A\u672C\u5730 Git \u5206\u652F\u5F15\u7528\u65E5\u5FD7\u3002\u8D77\u70B9\u4E0D\u7B49\u4E8E\u5F53\u524D\u8DDF\u8E2A\u7684\u4E0A\u6E38\u3002"},o.default.createElement("i",null,"\u8D77\u70B9"),Gn(t)),e&&t.branch&&o.default.createElement("span",{title:e.upstream?`\u6309\u672C\u5730\u8BB0\u5F55\u6BD4\u8F83\uFF0C\u4E0D\u8054\u7F51\u66F4\u65B0\uFF1A\u9886\u5148 ${e.ahead}\uFF0C\u843D\u540E ${e.behind}`:"\u6B64\u5206\u652F\u6CA1\u6709\u9ED8\u8BA4\u5BF9\u6BD4\u5BF9\u8C61\uFF1B\u4E0D\u7B49\u4E8E\u4ECE\u672A\u63A8\u9001"},o.default.createElement("i",null,"\u4E0A\u6E38"),e.upstream?o.default.createElement("code",null,e.upstream):"\u672A\u8BBE\u7F6E"),t.locked&&t.lockedReason&&o.default.createElement("span",{title:t.lockedReason},o.default.createElement("i",null,"\u9501\u5B9A\u539F\u56E0"),t.lockedReason))}function Kn({repo:t,tree:e,services:n,apps:r,act:i,renderFactorySlot:s}){let c=n.state.dsh,p=!e.prunable&&!e.error,f=e.sessions.filter(h=>h.source==="DSH"&&!h.archived),k=r.filter((h,d)=>r.findIndex(g=>g.group===h.group)===d);return o.default.createElement("div",{className:"wt-actions"},c&&p&&o.default.createElement(o.default.Fragment,null,f.length>0&&o.default.createElement("button",{className:"wt-btn is-primary",title:`\u6253\u5F00\u6700\u8FD1\u7684 DSH \u4F1A\u8BDD\uFF1A${f[0].title||f[0].id}`,onClick:()=>i.openDsh(e)},o.default.createElement(S,{name:"chat",size:15}),"\u6253\u5F00 DSH \u4F1A\u8BDD"),o.default.createElement("button",{className:"wt-btn"+(f.length?"":" is-primary"),title:"\u628A\u8FD9\u4E2A\u76EE\u5F55\u767B\u8BB0\u4E3A\u5DE5\u4F5C\u533A\uFF0C\u5E76\u6253\u5F00\u4E00\u4E2A\u65B0\u7684 DSH \u4F1A\u8BDD",onClick:()=>i.newDsh(e)},o.default.createElement(S,{name:"chat",size:15}),f.length?"\u65B0\u5F00\u4F1A\u8BDD":"\u5728 DSH \u65B0\u5F00\u4F1A\u8BDD")),p&&k.slice(0,4).map(h=>o.default.createElement("button",{key:h.app,className:"wt-btn",title:h.label,onClick:()=>i.openApp(t.id,e,h)},o.default.createElement(S,{name:h.icon,size:15}),o.default.createElement("span",{className:"wt-btnlabel"},h.label.replace(/^在|中(打开|显示)$/g,"")))),s?.("contextMenu.button",{target:{kind:ft,value:{repo:t.id,path:e.path}},label:"\u66F4\u591A\u64CD\u4F5C",className:"wt-menu-btn wt-btn-more"}))}function Un({tree:t,repository:e,services:n,act:r,now:i,codexNavigation:s}){let[c,p]=(0,o.useState)(8),[f,k]=(0,o.useState)(!1),h=t.sessions.filter(b=>!b.archived),d=t.sessions.filter(b=>b.archived),g=(f?[...h,...d]:h).slice(0,c),y=b=>!b.archived&&(b.source==="DSH"?!!n.dsh:b.source==="ZCode"||b.source==="Codex"?!!s:!1),v=b=>b.source==="DSH"?"\u6253\u5F00\u4F1A\u8BDD":b.source==="Codex"?"\u5728 Codex \u6253\u5F00":b.title?"\u590D\u5236\u6807\u9898\u5E76\u6253\u5F00 ZCode":"\u6253\u5F00 ZCode";return o.default.createElement(o.default.Fragment,null,g.length?o.default.createElement("ul",{className:"wt-sessions"},g.map(b=>o.default.createElement("li",{className:"wt-session",key:`${b.source}:${b.id}`},o.default.createElement("span",{className:"wt-toolchip","data-tool":b.source},b.source),o.default.createElement("div",{className:"wt-sbody"},o.default.createElement("span",{className:"wt-stitle",title:b.title||b.id},b.title||b.id),o.default.createElement("small",null,b.running?"\u8FD0\u884C\u4E2D \xB7 ":"",o.default.createElement("span",{title:rt(b.time)},et(b.time,i))," \xB7 ",b.evidence,b.archived?" \xB7 \u5DF2\u5F52\u6863":"")),o.default.createElement("div",{className:"wt-sacts"},y(b)&&o.default.createElement("button",{className:"wt-linkbtn",onClick:()=>r.openTool(t,b,e)},v(b),o.default.createElement(S,{name:"external",size:12})),o.default.createElement(ee,{value:b.id,label:"\u5DF2\u590D\u5236\u4F1A\u8BDD ID",act:r,title:"\u590D\u5236\u4F1A\u8BDD ID"}))))):o.default.createElement("p",{className:"wt-emptyline"},f||!d.length?"\u672A\u5339\u914D\u5230\u4F1A\u8BDD\u8BB0\u5F55\uFF0C\u4E0D\u80FD\u636E\u6B64\u5224\u65AD\u5DE5\u4F5C\u6811\u662F\u5426\u6709\u4EBA\u4F7F\u7528\u3002":"\u6CA1\u6709\u672A\u5F52\u6863\u7684\u4F1A\u8BDD\u3002"),o.default.createElement("div",{className:"wt-sessionbar"},(f?h.length+d.length:h.length)>g.length&&o.default.createElement("button",{className:"wt-linkbtn",onClick:()=>p(c+12)},"\u518D\u663E\u793A"," ",Math.min(12,(f?t.sessions.length:h.length)-g.length)," ","\u6761"),d.length>0&&o.default.createElement("button",{className:"wt-linkbtn",onClick:()=>k(!f)},f?`\u9690\u85CF ${d.length} \u4E2A\u5DF2\u5F52\u6863\u4F1A\u8BDD`:`\u663E\u793A ${d.length} \u4E2A\u5DF2\u5F52\u6863\u4F1A\u8BDD`)))}function _n({repo:t,tree:e,split:n,wide:r,showRepo:i,onBack:s,onDiff:c,services:p,apps:f,act:k,now:h,getTriggerProps:d,renderFactorySlot:g,requestPrune:y,reload:v,home:b}){let[x,z]=(0,o.useState)(e.status?.total?"files":"sessions"),[D,T]=(0,o.useState)(null),E=at(e),W=e.status,F=t.data?.codexNavigation,V=p.state.nativeChanges&&e.sessions.some(O=>O.source==="DSH"&&!O.archived)?O=>k.nativeChanges(t.id,e,O):null,R=!n&&!!D;if((0,o.useEffect)(()=>{c?.(R)},[R,c]),e.prunable)return o.default.createElement("div",{className:"wt-dinner"},o.default.createElement("header",{className:"wt-dhead"},s&&o.default.createElement("button",{className:"wt-back",onClick:s,"aria-label":"\u8FD4\u56DE\u5217\u8868"},o.default.createElement(S,{name:"back",size:16})),o.default.createElement("span",{className:"wt-dot","data-tone":"muted"}),o.default.createElement("h2",{className:"wt-dname"},pt(e))),o.default.createElement("p",{className:"wt-dsub"},i&&o.default.createElement("span",{className:"wt-drepo"},t.name),o.default.createElement(ct,{className:"wt-dpath",text:$t(e.path,b)})),o.default.createElement("p",{className:"wt-notice is-warn",role:"status"},o.default.createElement(S,{name:"warning",size:14}),jt(e)||"Git \u4ECD\u4FDD\u7559\u7740\u8FD9\u68F5\u5DE5\u4F5C\u6811\u7684\u767B\u8BB0\uFF0C\u4F46\u76EE\u5F55\u5DF2\u7ECF\u4E0D\u5B58\u5728\u3002"),o.default.createElement("p",{className:"wt-dtext"},"\u6E05\u7406\u53EA\u4F1A\u79FB\u9664 Git \u91CC\u7684\u767B\u8BB0\uFF0C\u4E0D\u4F1A\u5220\u9664\u4EFB\u4F55\u6587\u4EF6\uFF1B\u8303\u56F4\u662F\u6574\u4E2A\u4ED3\u5E93\u7684\u5931\u6548\u767B\u8BB0\u3002"),o.default.createElement("div",{className:"wt-actions"},o.default.createElement("button",{className:"wt-btn is-danger",onClick:()=>y(t.id)},o.default.createElement(S,{name:"broom",size:15}),"\u6E05\u7406\u5931\u6548\u767B\u8BB0")));let L=(O,K=Ot(O))=>o.default.createElement("div",{className:"wt-diffhead"},R?o.default.createElement("button",{className:"wt-back",onClick:()=>T(null),"aria-label":"\u8FD4\u56DE\u6587\u4EF6\u5217\u8868"},o.default.createElement(S,{name:"back",size:16})):o.default.createElement("button",{className:"wt-back",onClick:()=>T(null),"aria-label":"\u6536\u8D77\u5DEE\u5F02",title:"\u6536\u8D77\u5DEE\u5F02"},o.default.createElement(S,{name:"chevron",size:14,className:"is-open"})),o.default.createElement("span",{className:"wt-badge","data-tone":K.tone,title:K.detail},K.code),o.default.createElement(ct,{className:"wt-difftitle",title:O.path,text:O.path}),o.default.createElement("span",{className:"wt-fchange"},K.text),V&&o.default.createElement("button",{className:"wt-linkbtn",title:"\u5207\u6362\u5230\u8BE5\u76EE\u5F55\u7684 DSH \u4F1A\u8BDD\uFF0C\u5728\u53F3\u680F\u7528\u539F\u751F\u300C\u672C\u5730\u53D8\u66F4\u300D\u67E5\u770B",onClick:()=>V(O)},"\u5728\u53F3\u680F\u67E5\u770B",o.default.createElement(S,{name:"external",size:12})));if(R)return o.default.createElement("div",{className:"wt-dinner wt-dinner-flush"},o.default.createElement(oe,{file:D,repository:t.id,tree:e.id,wide:!1,title:L(D),native:V}));let J=O=>o.default.createElement(oe,{file:O,repository:t.id,tree:e.id,wide:r,title:L(O),native:V});return o.default.createElement("div",{className:"wt-dinner"},o.default.createElement("header",{className:"wt-dhead",...d({kind:ft,value:{repo:t.id,path:e.path}},{tabIndex:-1})},o.default.createElement("div",{className:"wt-dtitle"},s&&o.default.createElement("button",{className:"wt-back",onClick:s,"aria-label":"\u8FD4\u56DE\u5217\u8868"},o.default.createElement(S,{name:"back",size:16})),o.default.createElement("span",{className:"wt-dot","data-tone":E.tone,title:E.label}),o.default.createElement("h2",{className:"wt-dname","data-mono":e.detached?"":void 0,title:e.branch||e.head},pt(e)),e.main&&o.default.createElement("small",{className:"wt-tag"},"\u4E3B\u76EE\u5F55"),e.locked&&o.default.createElement("small",{className:"wt-tag",title:e.lockedReason||"\u5DF2\u9501\u5B9A"},o.default.createElement(S,{name:"lock",size:11}),"\u9501\u5B9A"),e.detached&&o.default.createElement("small",{className:"wt-tag"},"\u5206\u79BB HEAD")),o.default.createElement("p",{className:"wt-dsub"},i&&o.default.createElement("span",{className:"wt-drepo"},t.name),o.default.createElement(ct,{className:"wt-dpath",title:e.path,text:$t(e.path,b)}),o.default.createElement(ee,{value:e.path,label:"\u5DF2\u590D\u5236\u8DEF\u5F84",act:k,title:"\u590D\u5236\u8DEF\u5F84"})),e.commit&&o.default.createElement("p",{className:"wt-dcommit",title:e.commit.title},o.default.createElement("time",{title:rt(e.commit.time)},et(e.commit.time,h)),e.commit.title),e.error&&o.default.createElement("p",{className:"wt-notice is-danger",role:"alert"},o.default.createElement(S,{name:"warning",size:14}),e.error,o.default.createElement("button",{className:"wt-linkbtn",onClick:()=>v(t.id)},"\u91CD\u8BD5")),e.limited&&o.default.createElement("p",{className:"wt-notice is-warn",role:"status"},o.default.createElement(S,{name:"warning",size:14}),e.limited),o.default.createElement(Kn,{repo:t,tree:e,services:p,apps:f,act:k,renderFactorySlot:g}),o.default.createElement(Vn,{tree:e})),o.default.createElement("div",{className:"wt-dtabs",role:"tablist"},o.default.createElement("button",{role:"tab","aria-selected":x==="files",onClick:()=>z("files")},"\u6587\u4EF6\u6539\u52A8 ",o.default.createElement("b",null,W?.total??"\u2014")),o.default.createElement("button",{role:"tab","aria-selected":x==="sessions",onClick:()=>z("sessions")},"\u5173\u8054\u4F1A\u8BDD ",o.default.createElement("b",null,e.sessions.length)),o.default.createElement("span",{className:"wt-spacer"}),V&&o.default.createElement("button",{className:"wt-linkbtn",title:"\u5207\u6362\u5230\u8BE5\u76EE\u5F55\u7684 DSH \u4F1A\u8BDD\uFF0C\u5728\u53F3\u680F\u7528\u539F\u751F\u300C\u672C\u5730\u53D8\u66F4\u300D\u67E5\u770B",onClick:()=>V(null)},"\u5728 DSH \u53F3\u680F\u67E5\u770B",o.default.createElement(S,{name:"external",size:12}))),x==="files"?W?W.total?o.default.createElement(o.default.Fragment,null,e.hasSubmodules&&o.default.createElement("p",{className:"wt-dtext"},"\u5B50\u6A21\u5757\u53EA\u6BD4\u8F83\u63D0\u4EA4\u6307\u9488\uFF0C\u4E0D\u626B\u63CF\u5B50\u6A21\u5757\u5185\u90E8\u7684\u6539\u52A8\u3002"),o.default.createElement(_e,{tree:e,open:D,onOpen:T,inline:n,renderDiff:J})):o.default.createElement("p",{className:"wt-emptyline"},"\u6CA1\u6709\u672A\u63D0\u4EA4\u7684\u6539\u52A8\u3002"):o.default.createElement("p",{className:"wt-emptyline"},e.error?"\u65E0\u6CD5\u8BFB\u53D6\u6587\u4EF6\u72B6\u6001\u3002":"\u6CA1\u6709\u8BFB\u5230\u6587\u4EF6\u72B6\u6001\u3002"):o.default.createElement(Un,{tree:e,repository:t.id,services:p,act:k,now:h,codexNavigation:F}))}function Qn({total:t,warnings:e,onClear:n,busy:r,missing:i}){return i?o.default.createElement("div",{className:"wt-empty"},o.default.createElement("h2",null,"\u6CA1\u6709\u8BFB\u5230\u4ED3\u5E93\u6E05\u5355"),o.default.createElement("p",{className:"wt-dtext"},"\u9762\u677F\u4ECE DSH \u5DE5\u4F5C\u533A\u3001Codex \u548C ZCode \u7684\u672C\u673A\u7D22\u5F15\u91CC\u53D1\u73B0\u4ED3\u5E93\u3002\u53EF\u4EE5\u5728\u63D2\u4EF6\u914D\u7F6E\u7684 projects \u4E2D\u8865\u5145\u76EE\u5F55\u3002")):r?o.default.createElement("div",{className:"wt-empty"},o.default.createElement("span",{className:"wt-spinner","aria-hidden":"true"}),o.default.createElement("p",{className:"wt-dtext"},"\u6B63\u5728\u8BFB\u53D6\u5404\u4ED3\u5E93\u7684\u72B6\u6001\uFF0C\u8BFB\u5B8C\u4E00\u4E2A\u663E\u793A\u4E00\u4E2A\u2026")):o.default.createElement("div",{className:"wt-empty"},e.length>0&&o.default.createElement("details",{className:"wt-sources"},o.default.createElement("summary",null,"\u90E8\u5206\u6570\u636E\u4E0D\u53EF\u7528\uFF08",e.length,"\uFF09"),e.map(s=>o.default.createElement("p",{key:s},s))),o.default.createElement("h2",null,t.repos," \u4E2A\u4ED3\u5E93\uFF0C",t.trees," \u68F5\u5DE5\u4F5C\u6811"),t.stale+t.trouble+t.dirty+t.unpushed>0?o.default.createElement("dl",{className:"wt-emptystats"},[["trouble","\u5F02\u5E38","danger"],["dirty","\u6709\u6539\u52A8","warn"],["unpushed","\u6709\u672A\u63A8\u9001","accent"],["stale","\u5931\u6548\u767B\u8BB0","stale"]].filter(([s])=>t[s]).map(([s,c,p])=>o.default.createElement("div",{key:s},o.default.createElement("dt",{"data-tone":p},c),o.default.createElement("dd",null,t[s])))):o.default.createElement("p",{className:"wt-dtext"},"\u6240\u6709\u5DE5\u4F5C\u6811\u90FD\u662F\u5E72\u51C0\u7684\u3002"),o.default.createElement("p",{className:"wt-dtext"},"\u5728\u5DE6\u4FA7\u9009\u4E00\u68F5\u5DE5\u4F5C\u6811\uFF0C\u67E5\u770B\u6587\u4EF6\u6539\u52A8\u548C\u5173\u8054\u4F1A\u8BDD\uFF0C\u6216\u76F4\u63A5\u5728\u8FD9\u91CC\u5F00\u5DE5\u3002\u952E\u76D8 \u2191 \u2193 \u4E5F\u53EF\u4EE5\u79FB\u52A8\u9009\u62E9\u3002"),n&&o.default.createElement("button",{className:"wt-linkbtn",onClick:n},"\u5F53\u524D\u6709\u7B5B\u9009\u6761\u4EF6\uFF0C\u6E05\u9664\u540E\u663E\u793A\u5168\u90E8\u5DE5\u4F5C\u6811"))}function Jn(){let t=(0,o.useRef)(null),[e,n]=(0,o.useState)(0);return(0,o.useEffect)(()=>{let r=t.current;if(!r)return;let i=()=>n(r.clientWidth);i();let s=new ResizeObserver(i);return s.observe(r),()=>s.disconnect()},[]),[t,e]}function Qe({target:t,loading:e,error:n,split:r,showRepo:i,onBack:s,onDiff:c,services:p,apps:f,act:k,now:h,getTriggerProps:d,renderFactorySlot:g,retry:y,requestPrune:v,reload:b,home:x,total:z,warnings:D,onClear:T,busy:E,missing:W}){let[F,V]=Jn(),R=V>=680;if(!t)return o.default.createElement("aside",{className:"wt-detail","aria-label":"\u5DE5\u4F5C\u6811\u8BE6\u60C5",ref:F},o.default.createElement(Qn,{total:z,warnings:D,onClear:T,busy:E,missing:W}));let{repo:L,tree:J}=t;return e||n||!J?o.default.createElement("aside",{className:"wt-detail","aria-label":"\u5DE5\u4F5C\u6811\u8BE6\u60C5","aria-busy":!n,ref:F},o.default.createElement("div",{className:"wt-dinner"},o.default.createElement("p",{className:"wt-emptyline"},n?o.default.createElement(o.default.Fragment,null,n,o.default.createElement("button",{className:"wt-linkbtn",onClick:()=>y(L.id)},"\u91CD\u8BD5")):"\u6B63\u5728\u8BFB\u53D6\u8FD9\u68F5\u5DE5\u4F5C\u6811\u7684\u72B6\u6001\u2026"))):o.default.createElement("aside",{className:"wt-detail","aria-label":"\u5DE5\u4F5C\u6811\u8BE6\u60C5",ref:F},o.default.createElement(_n,{key:`${L.id}:${J.path}`,repo:L,tree:J,split:r,wide:R,showRepo:i,onBack:r?null:s,onDiff:c,services:p,apps:f,act:k,now:h,getTriggerProps:d,renderFactorySlot:g,requestPrune:v,reload:b,home:x}))}var G=X(require("react"),1);var Je='button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';function se({title:t,onClose:e,children:n,footer:r,wide:i}){let s=(0,G.useRef)(null),c=(0,G.useRef)(e);return c.current=e,(0,G.useEffect)(()=>{let p=document.activeElement,f=s.current;(f?.querySelector(".wt-modalfoot button")??f?.querySelector(Je)??f)?.focus({preventScroll:!0});let k=h=>{if(h.key==="Escape"){h.stopPropagation(),c.current();return}if(h.key!=="Tab"||!f)return;let d=[...f.querySelectorAll(Je)].filter(b=>b.offsetParent!==null);if(!d.length)return;let g=d[0],y=d.at(-1),v=document.activeElement;!f.contains(v)||v===f?(h.preventDefault(),(h.shiftKey?y:g).focus()):!h.shiftKey&&v===y?(h.preventDefault(),g.focus()):h.shiftKey&&v===g&&(h.preventDefault(),y.focus())};return document.addEventListener("keydown",k,!0),()=>{document.removeEventListener("keydown",k,!0),p instanceof HTMLElement&&p.isConnected&&p.focus({preventScroll:!0})}},[]),G.default.createElement("div",{className:"wt-modal-mask",onPointerDown:p=>{p.target===p.currentTarget&&e()}},G.default.createElement("div",{className:"wt-modal"+(i?" is-wide":""),role:"dialog","aria-modal":"true","aria-label":t,ref:s,tabIndex:-1},G.default.createElement("header",{className:"wt-modalhead"},G.default.createElement("h2",null,t),G.default.createElement("button",{className:"wt-iconbtn","aria-label":"\u5173\u95ED",onClick:e},G.default.createElement(S,{name:"close",size:16}))),G.default.createElement("div",{className:"wt-modalbody"},n),r&&G.default.createElement("footer",{className:"wt-modalfoot"},r)))}var I=X(require("react"),1);function Ye({repos:t,counts:e,scope:n,choose:r}){let[i,s]=(0,I.useState)(!1),c=g=>{let y=Lt(g.trees??[]);return y.trouble?"danger":y.dirty||y.unpushed?"warn":y.stale?"stale":""},p=g=>g.state==="ready"&&Pt(g.trees),f=g=>I.default.createElement("button",{key:g.id,className:"wt-railitem"+(n===g.id?" is-active":""),"aria-current":n===g.id?"true":void 0,title:g.path,onClick:()=>r(g.id)},I.default.createElement("span",{className:"wt-raildot","data-tone":c(g)}),I.default.createElement("span",{className:"wt-railname"},g.name),I.default.createElement("b",null,g.count)),k=t.filter(p),h=t.filter(g=>!p(g)),d=t.filter(g=>g.state==="ready").length;return I.default.createElement("nav",{className:"wt-rail","aria-label":"\u4ED3\u5E93"},I.default.createElement("div",{className:"wt-railhead"},I.default.createElement("h2",null,"\u4ED3\u5E93"),I.default.createElement("span",null,d===t.length?t.length:`${d}/${t.length}`)),I.default.createElement("div",{className:"wt-railscroll"},I.default.createElement("button",{className:"wt-railitem wt-railall"+(n==="all"?" is-active":""),"aria-current":n==="all"?"true":void 0,onClick:()=>r("all")},I.default.createElement("span",{className:"wt-raildot"}),I.default.createElement("span",{className:"wt-railname"},"\u5168\u90E8\u4ED3\u5E93"),I.default.createElement("b",null,e.all)),h.map(f),k.length>0&&(i?I.default.createElement(I.default.Fragment,null,k.map(f),I.default.createElement("button",{className:"wt-railitem wt-railfold",onClick:()=>s(!1)},I.default.createElement("span",{className:"wt-raildot"}),I.default.createElement("span",{className:"wt-railname"},"\u6536\u8D77"))):I.default.createElement("button",{className:"wt-railitem wt-railfold",onClick:()=>s(!0)},I.default.createElement("span",{className:"wt-raildot"}),I.default.createElement("span",{className:"wt-railname"},"\u53EA\u6709\u4E3B\u68C0\u51FA\u7684\u5B89\u9759\u4ED3\u5E93"),I.default.createElement("b",null,k.length)))))}var w=X(require("react"),1);var Yn={Codex:"C",ZCode:"Z",DSH:"D"},Xn=1800*1e3,Rn=t=>{let e=t.status;return!e||t.detached?"\u2014":e.upstream?e.ahead===null?"\u65E0\u6CD5\u6BD4\u8F83":[e.ahead&&`\u2191${e.ahead}`,e.behind&&`\u2193${e.behind}`].filter(Boolean).join(" ")||"\u5DF2\u540C\u6B65":"\u672A\u8BBE\u4E0A\u6E38"},ta=t=>{let e=t.status;return e?.ahead>0?"accent":e?.upstream&&e.behind>0?"warn":"muted"},ea=(t,e)=>{let n=t.status;return t.prunable?jt(t)||"Git \u4ECD\u4FDD\u7559\u8BE5\u5DE5\u4F5C\u6811\u767B\u8BB0\uFF0C\u4F46\u76EE\u5F55\u5DF2\u4E0D\u5B58\u5728":n?`\u5DF2\u6682\u5B58 ${n.staged} \xB7 \u672A\u6682\u5B58 ${n.unstaged} \xB7 \u672A\u8DDF\u8E2A ${n.untracked} \xB7 \u51B2\u7A81 ${n.conflicts}`:e.label},na=(t,e)=>{let n=t.sessions.filter(r=>r.source===e&&!r.archived);return n.length?`${e}\uFF1A${n.length} \u4E2A\u672A\u5F52\u6863\u4F1A\u8BDD\uFF0C\u6700\u8FD1\u4E00\u6B21 ${et(n[0].time)}`:e},aa=t=>t.lastChange?`${rt(t.lastChange.time)}\uFF08\u4F9D\u636E\uFF1A${t.lastChange.source}\uFF09`:"\u53D6\u4E0D\u5230\u53EF\u7528\u7684\u65F6\u95F4";function ra({repo:t,tree:e,selected:n,focused:r,pick:i,onTicket:s,getTriggerProps:c,renderFactorySlot:p,act:f,now:k}){let h=at(e),d=Me(e.branch),g=!e.prunable&&!e.error,y={kind:ft,value:{repo:t.id,path:e.path}};return w.default.createElement("div",{...c(y,{tabIndex:-1}),className:"wt-row"+(n?" is-selected":"")+(r?" is-cursor":"")+(e.prunable?" is-stale":""),role:"option","aria-selected":n,"data-path":e.path,onClick:()=>i(t.id,e),onKeyDown:v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),i(t.id,e))}},w.default.createElement("span",{className:"wt-dot","data-tone":h.tone,title:h.label}),w.default.createElement("span",{className:"wt-main"},w.default.createElement("span",{className:"wt-name","data-mono":e.detached?"":void 0},pt(e)),e.main&&w.default.createElement("small",{className:"wt-tag wt-tag-main"},"\u4E3B\u76EE\u5F55"),e.locked&&w.default.createElement("small",{className:"wt-tag",title:e.lockedReason||"\u5DF2\u9501\u5B9A"},w.default.createElement(S,{name:"lock",size:11}),"\u9501\u5B9A"),e.detached&&w.default.createElement("small",{className:"wt-tag"},"\u5206\u79BB")),d&&w.default.createElement("button",{className:"wt-ticket",style:{"--ticket":d.color},title:`\u53EA\u770B ${d.key} \u76F8\u5173\u7684\u5DE5\u4F5C\u6811`,onClick:v=>{v.stopPropagation(),s(d.key)}},d.key),w.default.createElement("span",{className:"wt-meta"},w.default.createElement("span",{className:"wt-state","data-tone":h.tone,title:ea(e,h)},h.label),w.default.createElement("span",{className:"wt-up","data-tone":ta(e),title:e.status?.upstream?`\u8DDF\u8E2A\u4E0A\u6E38 ${e.status.upstream}\uFF08\u6309\u672C\u5730\u8BB0\u5F55\uFF0C\u4E0D\u8054\u7F51\u66F4\u65B0\uFF09`:"\u6CA1\u6709\u914D\u7F6E\u9ED8\u8BA4\u5BF9\u6BD4\u5206\u652F\uFF1B\u4E0D\u4EE3\u8868\u6CA1\u6709\u63A8\u9001"},Rn(e)),w.default.createElement("time",{className:"wt-time",title:aa(e)},e.lastChange?et(e.lastChange.time,k):"\u2014")),w.default.createElement("span",{className:"wt-tools"},(e.tools??[]).map(v=>w.default.createElement("span",{key:v,className:"wt-tool","data-live":e.sessions.some(b=>b.source===v&&!b.archived&&(b.running||b.time>k-Xn)),title:na(e,v)},w.default.createElement("i",null,Yn[v]??v[0]),w.default.createElement("em",null,v)))),g&&f.dsh&&w.default.createElement("button",{className:"wt-go",title:"\u5728 DSH \u65B0\u5F00\u4F1A\u8BDD","aria-label":"\u5728 DSH \u65B0\u5F00\u4F1A\u8BDD",onClick:v=>{v.stopPropagation(),f.newDsh(e)}},w.default.createElement(S,{name:"chat",size:15})),p?.("contextMenu.button",{target:y,label:"\u66F4\u591A\u64CD\u4F5C",className:"wt-menu-btn"}))}function Xe(){return w.default.createElement("div",{className:"wt-skeleton","aria-hidden":"true"},[72,46,60,38].map(t=>w.default.createElement("span",{key:t,style:{width:`${t}%`}})))}function ia(t){let e=Lt(t),n=[["dirty","\u6709\u6539\u52A8","warn"],["unpushed","\u672A\u63A8\u9001","accent"],["behind","\u843D\u540E","muted"],["trouble","\u5F02\u5E38","danger"],["stale","\u5931\u6548","stale"]].filter(([r])=>e[r]);return n.length?n.map(([r,i,s])=>w.default.createElement("span",{key:r,className:"wt-count","data-tone":s},w.default.createElement("b",null,e[r]),i)):w.default.createElement("span",{className:"wt-count"},"\u5168\u90E8\u5E72\u51C0")}function oa({repo:t,branches:e,collapsed:n,toggleGroup:r,openBranches:i}){return w.default.createElement("header",{className:"wt-grouphead"},w.default.createElement("button",{className:"wt-group-toggle","aria-expanded":!n,"aria-label":n?`\u5C55\u5F00 ${t.name}`:`\u6536\u8D77 ${t.name}`,onClick:()=>r(t.id)},w.default.createElement(S,{name:"chevron",size:12,className:n?"":"is-open"})),w.default.createElement("span",{className:"wt-groupname",title:t.path},t.name),w.default.createElement("span",{className:"wt-groupcount"},t.count," \u68F5"),w.default.createElement("span",{className:"wt-groupsummary"},ia(t.trees??[])),w.default.createElement("span",{className:"wt-spacer"}),w.default.createElement("button",{className:"wt-linkbtn",title:"\u67E5\u770B\u672C\u5730\u5206\u652F",onClick:i},"\u5206\u652F ",w.default.createElement("b",null,e??"\u2026")))}function sa({entry:t,showHead:e,staleShown:n,collapsed:r,selected:i,cursor:s,pick:c,onTicket:p,getTriggerProps:f,renderFactorySlot:k,act:h,now:d,toggleGroup:g,toggleStale:y,openBranches:v,requestPrune:b,retry:x}){let{repo:z}=t,D=e&&oa({repo:z,branches:z.data?.branches?.length,collapsed:r,toggleGroup:g,openBranches:()=>v(z.id)});if(z.state==="loading")return w.default.createElement("section",{className:"wt-group","aria-busy":"true","data-repo":z.id},D,w.default.createElement(Xe,null));if(z.state==="error")return w.default.createElement("section",{className:"wt-group","data-repo":z.id},D,w.default.createElement("p",{className:"wt-inlineerror",role:"alert"},w.default.createElement(S,{name:"warning",size:14}),z.error,w.default.createElement("button",{onClick:()=>x(z.id)},"\u91CD\u8BD5")));let T=E=>w.default.createElement(ra,{key:E.path,repo:z,tree:E,selected:i?.repo===z.id&&i.path===E.path,focused:s===E.path,pick:c,onTicket:p,getTriggerProps:f,renderFactorySlot:k,act:h,now:d});return w.default.createElement("section",{className:"wt-group","data-repo":z.id},D,!(e&&r)&&w.default.createElement(w.default.Fragment,null,t.live.map(T),t.stale.length>0&&(n?w.default.createElement(w.default.Fragment,null,t.stale.map(T),w.default.createElement("div",{className:"wt-stalebar"},w.default.createElement("button",{className:"wt-linkbtn",onClick:()=>y(z.id)},"\u6536\u8D77"),w.default.createElement("button",{className:"wt-linkbtn is-danger",onClick:()=>b(z.id)},w.default.createElement(S,{name:"broom",size:13}),"\u6E05\u7406 ",t.stale.length," \u6761\u5931\u6548\u767B\u8BB0"))):w.default.createElement("button",{className:"wt-fold",onClick:()=>y(z.id)},w.default.createElement(S,{name:"warning",size:13}),w.default.createElement("b",null,t.stale.length," \u68F5\u767B\u8BB0\u5DF2\u5931\u6548"),w.default.createElement("span",null,"\u76EE\u5F55\u5DF2\u4E0D\u5B58\u5728"),w.default.createElement(S,{name:"chevron",size:12,className:"wt-fold-chevron"}))),!t.live.length&&!t.stale.length&&w.default.createElement("p",{className:"wt-emptyline"},"\u6CA1\u6709\u7B26\u5408\u5F53\u524D\u7B5B\u9009\u7684\u5DE5\u4F5C\u6811\u3002")))}function Re({scope:t,view:e,repos:n,groups:r,quiet:i,quietOpen:s,staleOpen:c,filterStale:p,collapsed:f,selected:k,cursor:h,sort:d,progress:g,total:y,filtered:v,now:b,pick:x,onTicket:z,goAll:D,setSort:T,setView:E,setQuietOpen:W,toggleStale:F,toggleGroup:V,openBranches:R,requestPrune:L,retry:J,clearFilters:O,getTriggerProps:K,renderFactorySlot:ot,act:st,scrollRef:U,catalogEmpty:kt,children:Z}){let lt=n.find(j=>j.id===t),dt=(j,qt)=>w.default.createElement(sa,{key:j.repo.id,entry:j,showHead:qt,staleShown:p||c.has(j.repo.id),collapsed:f.has(j.repo.id),selected:k,cursor:h,pick:x,onTicket:z,getTriggerProps:K,renderFactorySlot:ot,act:st,now:b,toggleGroup:V,toggleStale:F,openBranches:R,requestPrune:L,retry:J}),yt=g.total>g.done,B=!r.length&&!i.length&&!yt;return w.default.createElement("section",{className:"wt-list","aria-label":"\u5DE5\u4F5C\u6811\u6E05\u5355",ref:U},w.default.createElement("div",{className:"wt-listhead"},t==="all"?w.default.createElement("span",{className:"wt-listtitle"},"\u5168\u90E8\u4ED3\u5E93",w.default.createElement("b",null,y.trees),"\u68F5\u5DE5\u4F5C\u6811",w.default.createElement("span",{className:"wt-listsub"},r.length+i.length," \u4E2A\u4ED3\u5E93")):w.default.createElement(w.default.Fragment,null,w.default.createElement("button",{className:"wt-back",onClick:D,title:"\u56DE\u5230\u5168\u90E8\u4ED3\u5E93"},w.default.createElement(S,{name:"back",size:15})),w.default.createElement("div",{className:"wt-seg",role:"tablist"},w.default.createElement("button",{role:"tab","aria-selected":e==="trees",onClick:()=>E("trees")},"\u5DE5\u4F5C\u6811 ",w.default.createElement("b",null,lt?.count??0)),w.default.createElement("button",{role:"tab","aria-selected":e==="branches",onClick:()=>E("branches")},"\u672C\u5730\u5206\u652F ",w.default.createElement("b",null,lt?.data?.branches?.length??"\u2026"))),w.default.createElement(ct,{className:"wt-listpath",title:lt?.path,text:lt?.path})),w.default.createElement("span",{className:"wt-spacer"}),e==="trees"&&w.default.createElement("label",{className:"wt-sort"},w.default.createElement("span",null,"\u6392\u5E8F"),w.default.createElement("select",{value:d,onChange:j=>T(j.target.value)},w.default.createElement("option",{value:"attention"},"\u9700\u8981\u5173\u6CE8\u4F18\u5148"),w.default.createElement("option",{value:"recent"},"\u6700\u8FD1\u6539\u52A8")))),yt&&w.default.createElement("div",{className:"wt-progress",role:"status"},w.default.createElement("span",null,"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u72B6\u6001 ",g.done,"/",g.total),w.default.createElement("i",{style:{"--p":`${g.done/g.total*100}%`}})),v&&e==="trees"&&w.default.createElement("button",{className:"wt-filternote",onClick:O},w.default.createElement(S,{name:"filter",size:12}),"\u5DF2\u6309\u6761\u4EF6\u7B5B\u9009\uFF0C\u6E05\u9664\u7B5B\u9009"),e==="branches"&&t!=="all"?Z:w.default.createElement("div",{className:"wt-rows",role:"listbox","aria-label":"\u5DE5\u4F5C\u6811"},r.map(j=>dt(j,t==="all")),i.length>0&&(s?w.default.createElement(w.default.Fragment,null,i.map(j=>dt(j,!0)),w.default.createElement("button",{className:"wt-fold",onClick:()=>W(!1)},"\u6536\u8D77\u8FD9\u4E9B\u4ED3\u5E93")):w.default.createElement("button",{className:"wt-fold wt-fold-quiet",onClick:()=>W(!0)},w.default.createElement("b",null,"\u5176\u4F59 ",i.length," \u4E2A\u4ED3\u5E93"),w.default.createElement("span",null,"\u53EA\u6709\u4E3B\u68C0\u51FA\uFF0C\u6CA1\u6709\u6539\u52A8\uFF0C\u4E5F\u6CA1\u6709\u4F1A\u8BDD"),w.default.createElement(S,{name:"chevron",size:12,className:"wt-fold-chevron"}))),yt&&!r.length&&!i.length&&w.default.createElement(Xe,null),B&&w.default.createElement("p",{className:"wt-emptyline"},n.length?"\u6CA1\u6709\u7B26\u5408\u6761\u4EF6\u7684\u5DE5\u4F5C\u6811\u3002":kt?"\u6CA1\u6709\u53D1\u73B0\u672C\u673A\u4ED3\u5E93\u3002\u53EF\u4EE5\u5728\u63D2\u4EF6\u914D\u7F6E\u7684 projects \u4E2D\u6307\u5B9A\u9879\u76EE\u76EE\u5F55\u3002":"\u6B63\u5728\u8BFB\u53D6\u672C\u673A\u4ED3\u5E93\u2026",v&&w.default.createElement("button",{className:"wt-linkbtn",onClick:O},"\u6E05\u9664\u7B5B\u9009"))))}var la=820,da=1040,pa=4,le=["all","dirty","unpushed","behind","trouble","stale"],ca=()=>({getTriggerProps:(t,e)=>e??{}});function wa(t){let[,e]=(0,l.useReducer)(n=>n+1,0);(0,l.useEffect)(()=>t.subscribe(e),[t])}async function tn(t){try{return await navigator.clipboard.writeText(t),!0}catch{let e=document.createElement("textarea");e.value=t,e.setAttribute("readonly",""),e.style.cssText="position:fixed;opacity:0;pointer-events:none",document.body.appendChild(e),e.select();let n=!1;try{n=document.execCommand("copy")}catch{}return e.remove(),n}}var Zt=t=>String(t?.message??t).replace(/\s+/g," ").slice(0,160);function en({services:t,useContextMenu:e,renderFactorySlot:n}){wa(t);let{getTriggerProps:r}=(e??ca)(),i=(0,l.useRef)(null),s=(0,l.useRef)(null),c=(0,l.useRef)(null),[p,f]=(0,l.useState)(0),[k,h]=(0,l.useState)(()=>Date.now()),[d,g]=(0,l.useState)(null),[y,v]=(0,l.useState)(""),[b,x]=(0,l.useState)(!1),[z,D]=(0,l.useState)(()=>new Map),[T,E]=(0,l.useState)(0),[W,F]=(0,l.useState)({done:0,total:0}),[V,R]=(0,l.useState)([]),[L,J]=(0,l.useState)("all"),[O,K]=(0,l.useState)("trees"),[ot,st]=(0,l.useState)(""),[U,kt]=(0,l.useState)("all"),[Z,lt]=(0,l.useState)(""),[dt,yt]=(0,l.useState)(()=>it.get("sort","attention")),[B,j]=(0,l.useState)(null),[qt,wt]=(0,l.useState)(0),[nn,an]=(0,l.useState)(()=>new Set),[Gt,rn]=(0,l.useState)(()=>new Set),[pe,on]=(0,l.useState)(!1),[_,ht]=(0,l.useState)(null),[sn,ce]=(0,l.useState)(!1),[Nt,Vt]=(0,l.useState)(null),Kt=(0,l.useRef)(L);Kt.current=L;let P=(0,l.useMemo)(()=>(d?.repos??[]).map(a=>{let u=z.get(a.id);return{id:a.id,path:a.path,name:a.name,groups:a.groups,count:a.trees.length,state:u?.state??(d?"loading":"idle"),error:u?.error,data:u?.data,trees:u?.data?.trees??null}}),[d,z]),Ut=!d||P.some(a=>a.state==="loading"),Y=p>=la,_t=p>=da,gt=!Y&&qt>0,Ct=ot.trim(),we=d?.home??"",Dt=t.state;(0,l.useEffect)(()=>{let a=i.current;if(!a)return;let u=()=>f(a.clientWidth);u();let C=new ResizeObserver(u);return C.observe(a),()=>C.disconnect()},[]),(0,l.useEffect)(()=>{let a=setInterval(()=>h(Date.now()),6e4);return()=>clearInterval(a)},[]),(0,l.useEffect)(()=>{let a=new AbortController;return x(!0),v(""),Q("catalog",T?{refresh:"1"}:{},a.signal).then(u=>{a.signal.aborted||(g(u),D(new Map))}).catch(u=>{a.signal.aborted||v(u.message)}).finally(()=>{a.signal.aborted||x(!1)}),()=>a.abort()},[T]),(0,l.useEffect)(()=>{if(!d)return;let a=new AbortController,u=d.repos.map(A=>A.id);if(Kt.current!=="all"){let A=u.indexOf(Kt.current);A>0&&u.unshift(...u.splice(A,1))}let C=0;F({done:0,total:u.length});let H=async()=>{for(;u.length&&!a.signal.aborted;){let A=u.shift();try{let tt=await Q("repository",{id:A},a.signal);if(a.signal.aborted)return;D(vt=>new Map(vt).set(A,{state:"ready",data:tt}))}catch(tt){if(a.signal.aborted)return;D(vt=>new Map(vt).set(A,{state:"error",error:tt.message}))}C+=1,a.signal.aborted||F(tt=>({...tt,done:C}))}};for(let A=0;A<pa;A++)H();return()=>a.abort()},[d]),(0,l.useEffect)(()=>{let a=!0;return ke().then(u=>{a&&R(We(u))}),()=>{a=!1}},[]);let Mt=(0,l.useCallback)(async a=>{D(u=>{let C=new Map(u);return C.delete(a),C});try{let u=await Q("repository",{id:a});D(C=>new Map(C).set(a,{state:"ready",data:u}))}catch(u){D(C=>new Map(C).set(a,{state:"error",error:u.message}))}},[]),bt=(0,l.useMemo)(()=>{let a=Object.fromEntries(le.map(u=>[u,0]));for(let u of P)for(let C of u.trees??[])if(!(Z&&!C.tools?.includes(Z))){a.all+=1;for(let H of le.slice(1))nt[H][1](C)&&(a[H]+=1)}return a},[P,Z]),ue=(0,l.useMemo)(()=>{let a={};for(let u of P)for(let C of u.trees??[])for(let H of C.tools??[])a[H]=(a[H]??0)+1;return a},[P]),Ht=(0,l.useMemo)(()=>P.map(a=>{let u=ut(Ct,a.name,a.path,...a.groups),C=(a.trees??[]).filter(H=>(!Z||H.tools?.includes(Z))&&(u||ut(Ct,pt(H),H.path,H.head)));return{repo:a,live:C.filter(H=>!H.prunable&&nt[U][1](H)).sort((H,A)=>$e(H,A,dt==="attention")),stale:C.filter(H=>H.prunable)}}),[P,Ct,Z,U,dt]),Et=(0,l.useMemo)(()=>He(Ht.filter(a=>a.live.length||a.stale.length||a.repo.state==="error"),dt),[Ht,dt]),me=L==="all"&&U==="all"&&!Ct&&!Z,St=(0,l.useMemo)(()=>me?Et.filter(a=>Pt(a.repo.trees)):[],[Et,me]),At=(0,l.useMemo)(()=>L==="all"?Et.filter(a=>!St.includes(a)):Ht.filter(a=>a.repo.id===L),[Et,St,L,Ht]),fe=pe?[...At,...St]:At,xt=(0,l.useMemo)(()=>fe.flatMap(a=>[...a.live,...U==="stale"||Gt.has(a.repo.id)?a.stale:[]].map(u=>({repo:a.repo,tree:u}))),[fe,U,Gt]),he=!!Ct||U!=="all"||!!Z,ln=(0,l.useMemo)(()=>[...(d?.sources??[]).filter(a=>a.warning).map(a=>`${a.name}\uFF1A${a.warning}`),...(d?.warnings??[]).map(a=>`${a.root}\uFF1A${a.message}`)],[d]),dn=(0,l.useCallback)((a,u)=>{j({repo:a,path:u.path}),Y||wt(1)},[Y]);(0,l.useEffect)(()=>{if(!d||gt||xt.some(u=>u.repo.id===B?.repo&&u.tree.path===B?.path))return;let a=xt[0];j(Y&&a?{repo:a.repo.id,path:a.tree.path}:null)},[xt,Y,gt,d,B]),(0,l.useEffect)(()=>{wt(0)},[L,ot,U,Z,O]),(0,l.useEffect)(()=>{c.current?.scrollTo?.({top:0})},[L,O]),(0,l.useEffect)(()=>{if(!Nt)return;let a=setTimeout(()=>Vt(null),4500);return()=>clearTimeout(a)},[Nt]);let Qt=(0,l.useMemo)(()=>{if(!B||!d)return null;let a=P.find(u=>u.id===B.repo);return a?{repo:a,tree:a.trees?.find(u=>u.path===B.path)??null}:null},[P,B,d]),q=(0,l.useCallback)((a,u=!1)=>{if(t.state.notify)return t.state.notify(a,u);Vt({text:a,tone:u?"ok":"bad"})},[t]),zt=(0,l.useCallback)(async a=>{try{let u=await Q("prune-plan",{id:a});if(!u.entries.length)return q("\u6CA1\u6709\u53EF\u6E05\u7406\u7684\u5931\u6548\u767B\u8BB0",!1);ht({repo:a,plan:u,state:"ready",error:""})}catch(u){q(`\u65E0\u6CD5\u9884\u89C8\u5F85\u6E05\u7406\u7684\u767B\u8BB0\uFF1A${u.message}`,!1)}},[q]),Jt=(0,l.useCallback)(async a=>{let u=t.state.dsh;if(u)try{let C=await u.createWorkspace(a.path);await u.openWorkspace(C).catch(()=>{})}catch(C){q(`\u65E0\u6CD5\u5728\u8FD9\u4E2A\u76EE\u5F55\u6253\u5F00 DSH \u4F1A\u8BDD\uFF1A${Zt(C)}`,!1)}},[t,q]),Yt=(0,l.useMemo)(()=>({dsh:Dt.dsh,newDsh:Jt,openDsh(a){let u=t.state.dsh;if(!u)return;let C=a.sessions.filter(H=>H.source==="DSH"&&!H.archived);if(!C.length)return Jt(a);try{u.openSession(C[0].id)}catch(H){q(`\u65E0\u6CD5\u6253\u5F00\u4F1A\u8BDD\uFF1A${Zt(H)}`,!1)}},async openApp(a,u,C){let H=C.label.replace(/^在/,"").replace(/中(打开|显示)$/,"");try{if(C.fallback)await Q("open-folder",{id:a,tree:u.id,target:C.target},void 0,"open");else if(!await ye(C.app,u.path))throw Error("\u5BBF\u4E3B\u6CA1\u6709\u54CD\u5E94")}catch(A){q(`\u65E0\u6CD5\u7528${H}\u6253\u5F00\uFF1A${Zt(A)}`,!1)}},async openTool(a,u,C){if(u.source==="DSH"){try{t.state.dsh?.openSession(u.id)}catch(A){q(`\u65E0\u6CD5\u6253\u5F00\u4F1A\u8BDD\uFF1A${Zt(A)}`,!1)}return}let H=u.source==="ZCode"&&u.title?await tn(u.title):!1;try{await Q("open-session",{id:C,tree:a.id,session:u.id,source:u.source},void 0,"navigate"),u.source==="ZCode"&&q(H?"\u5DF2\u590D\u5236\u6807\u9898\uFF0C\u53EF\u5728 ZCode \u91CC\u6309\u6807\u9898\u627E\u5230\u539F\u4F1A\u8BDD":"\u5DF2\u8BF7\u6C42\u6253\u5F00 ZCode\uFF0C\u53EF\u6309\u6807\u9898\u6216 ID \u67E5\u627E\u539F\u4F1A\u8BDD",!0)}catch(A){q(A.message,!1)}},async copy(a,u,C){let H=await tn(a);return H?!C&&u&&q(u,!0):q("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u9009\u4E2D\u6587\u5B57\u624B\u52A8\u590D\u5236",!1),H},async nativeChanges(a,u,C){let H=t.state.nativeChanges;if(!H)return!1;let A=await H({repository:a,tree:u.id,file:C});return A||q("\u6CA1\u80FD\u6253\u5F00\u53F3\u680F\uFF1A\u8FD9\u4E2A\u76EE\u5F55\u5F53\u524D\u6CA1\u6709\u53EF\u7528\u7684 DSH \u4F1A\u8BDD",!1),A},requestPrune:zt}),[t,q,zt,Jt,Dt.dsh,Dt.nativeChanges]);ie.current={lookup:(a,u)=>z.get(a)?.data?.trees?.find(C=>C.path===u),apps:V,act:Yt};let pn=async()=>{let a=_;ht({...a,state:"busy",error:""});try{let u=await Q("prune",{id:a.repo,expect:a.plan.entries.length},void 0,"prune");ht(null),E(C=>C+1),Vt({text:`\u5DF2\u6E05\u7406 ${u.removed.length} \u6761\u5931\u6548\u767B\u8BB0`,tone:"ok"})}catch(u){if(/重新确认/.test(u.message))return zt(a.repo);ht({...a,state:"ready",error:u.message})}},cn=a=>{yt(a),it.set("sort",a)},Xt=()=>{st(""),kt("all"),lt("")},Rt=a=>{J(a),K("trees")},wn=a=>{K("trees"),Xt(),j({repo:L,path:a}),Y||wt(1)},un=a=>{J("all"),K("trees"),kt("all"),st(a)},mn=a=>{let u=a.target,C=u instanceof HTMLElement&&u.closest("input, textarea, select, [contenteditable]");if(a.key==="Escape"){if(C){u===s.current&&ot?st(""):u.blur();return}gt?(a.preventDefault(),wt(0)):ot&&st("");return}if((a.metaKey||a.ctrlKey)&&a.key.toLowerCase()==="f"){a.preventDefault(),s.current?.focus(),s.current?.select();return}if(!(C||gt||O!=="trees"))if(a.key==="/")a.preventDefault(),s.current?.focus();else if(a.key==="ArrowDown"||a.key==="ArrowUp"){a.preventDefault();let H=xt.findIndex(vt=>vt.repo.id===B?.repo&&vt.tree.path===B?.path),A=a.key==="ArrowDown"?Math.min(xt.length-1,H+1):Math.max(0,H-1),tt=xt[A<0?0:A];tt&&(j({repo:tt.repo.id,path:tt.tree.path}),c.current?.querySelector(`[data-path="${CSS.escape(tt.tree.path)}"]`)?.scrollIntoView({block:"nearest"}))}else a.key==="Enter"&&B&&!Y&&(a.preventDefault(),wt(1))},ge=_?P.find(a=>a.id===_.repo):null,be=b||!d;return l.default.createElement("div",{ref:i,className:"wt-wrap","data-layout":Y?"split":"stack","data-busy":Ut?"":void 0,onKeyDown:mn},l.default.createElement("style",null,ve),l.default.createElement("header",{className:"wt-top"},l.default.createElement("span",{className:"wt-brand"},l.default.createElement(S,{size:17}),l.default.createElement("h1",null,"\u5DE5\u4F5C\u6811")),l.default.createElement("label",{className:"wt-search"},l.default.createElement(S,{name:"search",size:15}),l.default.createElement("input",{ref:s,"aria-label":"\u641C\u7D22\u4ED3\u5E93\u3001\u5206\u652F\u3001\u5DE5\u5355\u53F7\u6216\u8DEF\u5F84",placeholder:"\u641C\u7D22\u4ED3\u5E93\u3001\u5206\u652F\u3001\u5DE5\u5355\u53F7\u6216\u8DEF\u5F84",value:ot,spellCheck:!1,onChange:a=>st(a.target.value)}),ot?l.default.createElement("button",{className:"wt-iconbtn","aria-label":"\u6E05\u9664\u641C\u7D22",onClick:()=>st("")},l.default.createElement(S,{name:"close",size:13})):l.default.createElement("kbd",{title:"\u5FEB\u6377\u952E \u2318F \u6216 /"},"/")),d&&l.default.createElement("span",{className:"wt-readat",title:rt(d.time)},"\u8BFB\u53D6\u4E8E ",et(d.time,k)),l.default.createElement("button",{className:"wt-iconbtn",title:"\u5237\u65B0","aria-label":"\u5237\u65B0",disabled:be,onClick:()=>E(a=>a+1)},l.default.createElement(S,{name:"refresh",size:16,className:be?"spin":""})),l.default.createElement("button",{className:"wt-iconbtn",title:"\u8FD9\u4E9B\u540D\u8BCD\u662F\u4EC0\u4E48\u610F\u601D","aria-label":"\u8BF4\u660E","aria-haspopup":"dialog",onClick:()=>ce(!0)},l.default.createElement(S,{name:"help",size:16}))),Nt&&!Dt.notify&&l.default.createElement("div",{className:"wt-flash","data-tone":Nt.tone,role:"status"},Nt.text),y&&l.default.createElement("div",{className:"wt-flash is-stay","data-tone":"bad",role:"alert"},y,d&&" \xB7 \u4E0B\u9762\u4FDD\u7559\u4E0A\u6B21\u8BFB\u5230\u7684\u7ED3\u679C",l.default.createElement("button",{className:"wt-linkbtn",onClick:()=>E(a=>a+1)},"\u91CD\u8BD5")),(O==="trees"||!_t)&&l.default.createElement("div",{className:"wt-filters"},!_t&&l.default.createElement("select",{className:"wt-scope","aria-label":"\u4ED3\u5E93\u8303\u56F4",value:L,onChange:a=>Rt(a.target.value)},l.default.createElement("option",{value:"all"},"\u5168\u90E8\u4ED3\u5E93"),P.map(a=>l.default.createElement("option",{key:a.id,value:a.id},a.name," \xB7 ",a.count))),O==="trees"&&l.default.createElement(l.default.Fragment,null,l.default.createElement("div",{className:"wt-chips",role:"group","aria-label":"\u6309\u72B6\u6001\u7B5B\u9009"},le.map(a=>l.default.createElement("button",{key:a,className:"wt-chip","aria-pressed":U===a,"data-empty":bt[a]?void 0:"",onClick:()=>kt(U===a?"all":a)},nt[a][0],l.default.createElement("b",null,bt[a])))),l.default.createElement("span",{className:"wt-spacer"}),l.default.createElement("div",{className:"wt-chips",role:"group","aria-label":"\u6309\u5173\u8054\u5DE5\u5177\u7B5B\u9009"},l.default.createElement("button",{className:"wt-chip","aria-pressed":!Z,onClick:()=>lt("")},"\u5168\u90E8\u5DE5\u5177"),Te.map(a=>l.default.createElement("button",{key:a,className:"wt-chip","aria-pressed":Z===a,"data-empty":ue[a]?void 0:"",onClick:()=>lt(Z===a?"":a)},a,l.default.createElement("b",null,ue[a]??0)))))),l.default.createElement("div",{className:"wt-body"},_t&&l.default.createElement(Ye,{repos:P,counts:bt,scope:L,choose:Rt}),!gt&&l.default.createElement(Re,{scope:L,view:O,repos:P,groups:At,quiet:St,quietOpen:pe,staleOpen:Gt,filterStale:U==="stale",collapsed:nn,selected:Y?B:null,cursor:B?.path,sort:dt,progress:Ut?W:{done:1,total:1},total:{trees:bt.all},filtered:he,now:k,pick:dn,onTicket:un,goAll:()=>Rt("all"),setSort:cn,setView:K,setQuietOpen:on,toggleStale:a=>rn(u=>{let C=new Set(u);return C.delete(a)||C.add(a),C}),toggleGroup:a=>an(u=>{let C=new Set(u);return C.delete(a)||C.add(a),C}),openBranches:a=>{J(a),K("branches")},requestPrune:zt,retry:Mt,clearFilters:Xt,getTriggerProps:r,renderFactorySlot:n,act:Yt,scrollRef:c,catalogEmpty:!!d&&P.length===0},l.default.createElement(Ee,{repo:P.find(a=>a.id===L),now:k,showTree:wn,retry:Mt})),(Y||gt)&&l.default.createElement(Qe,{target:Qt,loading:!d||Qt?.repo.state==="loading",error:Qt?.repo.error,split:Y,showRepo:L==="all",onBack:()=>wt(0),onDiff:a=>wt(a?2:1),services:t,apps:V,act:Yt,now:k,home:we,getTriggerProps:r,renderFactorySlot:n,retry:Mt,reload:Mt,requestPrune:zt,total:{repos:At.length+St.length,trees:bt.all,...bt},warnings:ln,onClear:he?Xt:null,busy:Ut,missing:!!d&&P.length===0})),_&&ge&&l.default.createElement(se,{title:`\u6E05\u7406 ${_.plan.entries.length} \u6761\u5931\u6548\u767B\u8BB0`,onClose:()=>_.state!=="busy"&&ht(null),footer:l.default.createElement(l.default.Fragment,null,l.default.createElement("button",{className:"wt-btn",disabled:_.state==="busy",onClick:()=>ht(null)},"\u53D6\u6D88"),l.default.createElement("button",{className:"wt-btn is-danger",disabled:_.state==="busy",onClick:pn},l.default.createElement(S,{name:"broom",size:15}),_.state==="busy"?"\u6B63\u5728\u6E05\u7406\u2026":"\u6E05\u7406\u767B\u8BB0"))},l.default.createElement("p",{className:"wt-dtext"},l.default.createElement("b",null,ge.name)," ","\u91CC\u4E0B\u9762\u8FD9\u4E9B\u5DE5\u4F5C\u6811\u7684\u76EE\u5F55\u5DF2\u7ECF\u4E0D\u5B58\u5728\u3002\u6E05\u7406\u53EA\u79FB\u9664 Git \u91CC\u7684\u767B\u8BB0\uFF0C\u4E0D\u4F1A\u5220\u9664\u4EFB\u4F55\u6587\u4EF6\uFF1B\u76EE\u5F55\u4E4B\u540E\u5982\u679C\u6062\u590D\uFF0C\u9700\u8981\u91CD\u65B0\u767B\u8BB0\u4E3A\u5DE5\u4F5C\u6811\u3002"),l.default.createElement("ul",{className:"wt-prunelist"},_.plan.trees.map(a=>l.default.createElement("li",{key:a.path},l.default.createElement("span",null,pt(a)),l.default.createElement(ct,{className:"wt-prunepath",title:a.path,text:$t(a.path,we)})))),_.error&&l.default.createElement("p",{className:"wt-notice is-danger",role:"alert"},_.error)),sn&&l.default.createElement(se,{title:"\u600E\u4E48\u770B\u8FD9\u5F20\u6E05\u5355",onClose:()=>ce(!1),wide:!0},l.default.createElement("dl",{className:"wt-glossary"},l.default.createElement("dt",null,"\u5DE5\u4F5C\u6811"),l.default.createElement("dd",null,"\u4E00\u4EFD\u72EC\u7ACB\u7684\u68C0\u51FA\u76EE\u5F55\u548C\u6682\u5B58\u533A\u3002\u540C\u4E00\u4ED3\u5E93\u7684\u5DE5\u4F5C\u6811\u5171\u4EAB\u63D0\u4EA4\u548C\u5206\u652F\uFF1B\u4E00\u68F5\u6811\u901A\u5E38\u68C0\u51FA\u4E00\u4E2A\u5206\u652F\uFF0C \u4E5F\u53EF\u4EE5\u505C\u5728\u67D0\u6B21\u63D0\u4EA4\uFF08\u5206\u79BB HEAD\uFF09\u3002"),l.default.createElement("dt",null,"\u6700\u8FD1\u6539\u52A8"),l.default.createElement("dd",null,"HEAD \u63D0\u4EA4\u65F6\u95F4\u548C\u6240\u6709\u6539\u52A8\u6587\u4EF6\u4FEE\u6539\u65F6\u95F4\u4E2D\u8F83\u665A\u7684\u90A3\u4E2A\uFF0C\u4E0D\u542B\u804A\u5929\u65F6\u95F4\u3002"),l.default.createElement("dt",null,"\u5173\u8054\u5DE5\u5177"),l.default.createElement("dd",null,"\u6309\u4F1A\u8BDD\u76EE\u5F55\u5339\u914D\u5230\u7684 Codex / ZCode / DSH \u4F1A\u8BDD\u3002\u8FD9\u662F\u76EE\u5F55\u5173\u8054\uFF0C\u4E0D\u662F\u5728\u7EBF\u72B6\u6001\uFF1B\u4EAE\u8D77\u7684\u5C0F\u70B9\u8868\u793A\u6700\u8FD1 30 \u5206\u949F\u5185\u6709\u4F1A\u8BDD\u66F4\u65B0\u3002"),l.default.createElement("dt",null,"\u4E0A\u6E38"),l.default.createElement("dd",null,"\u2191 \u662F\u672A\u63A8\u9001\u7684\u63D0\u4EA4\u6570\uFF0C\u2193 \u662F\u843D\u540E\u7684\u63D0\u4EA4\u6570\uFF0C\u90FD\u6309\u672C\u5730\u8BB0\u5F55\u6BD4\u8F83\uFF0C\u9762\u677F\u4E0D\u8054\u7F51 fetch\u3002\u300C\u672A\u8BBE\u4E0A\u6E38\u300D\u4E0D\u7B49\u4E8E\u6CA1\u63A8\u9001\u3002"),l.default.createElement("dt",null,"\u5931\u6548\u767B\u8BB0"),l.default.createElement("dd",null,"\u76EE\u5F55\u5DF2\u7ECF\u4E0D\u5B58\u5728\u3001\u4F46 Git \u4ECD\u4FDD\u7559\u7684\u5DE5\u4F5C\u6811\u767B\u8BB0\u3002\u53EF\u4EE5\u6E05\u7406\uFF0C\u6E05\u7406\u4E0D\u4F1A\u5220\u9664\u4EFB\u4F55\u6587\u4EF6\u3002"),l.default.createElement("dt",null,"\u5DE5\u5355\u8272\u6807"),l.default.createElement("dd",null,"\u4ECE\u5206\u652F\u540D\u91CC\u53D6\u51FA\u7684\u5DE5\u5355\u53F7\u3002\u540C\u4E00\u4E2A\u9700\u6C42\u5728\u591A\u4E2A\u4ED3\u5E93\u7684\u5DE5\u4F5C\u6811\u540C\u8272\uFF0C\u70B9\u5B83\u53EA\u770B\u8FD9\u4E2A\u9700\u6C42\u7684\u5DE5\u4F5C\u6811\u3002"))))}var Bt="worktree-desk";function ua(){let t=new Set,e={dsh:null,nativeChanges:null,notify:null};return{state:e,set(n){Object.assign(e,n),t.forEach(r=>r())},subscribe(n){return t.add(n),()=>t.delete(n)}}}function ma(t){let{sidebarRight:e,sidebarRightTabs:n,layout:r,uiSession:i,uiWorkspace:s}=t;return async({repository:c,tree:p,file:f,signal:k})=>{let h=()=>i.adapter.current.getSnapshot()?.key,d=()=>r.panelInfo.getSnapshot().activePanelId,g=h();if(!n.get?.("forge-changes"))return!1;let v=(await Q("native-session",{id:c,tree:p,current:g||""},k)).sessionId;if(!v||k.aborted||d()!==Bt||h()!==g)return!1;v===g?r.selectPanel(null):s.openSession(v);for(let b=0;b<50;b++){if(d()!==null||h()!==v)return!1;if(e.mounted.getSnapshot()===v)try{return e.openResource(`dsh-resource://forge-changes/${encodeURIComponent(v)}/local`,{kind:"forge-changes",destination:"sidebar",...f&&{params:{path:f.path}}}),!0}catch(x){if(!String(x?.message).includes("no session surface is mounted"))break}await new Promise(x=>setTimeout(x,40))}return d()===null&&h()===v&&r.selectPanel(Bt),!1}}var fa=["slots"];function ha(t){let e=ua();t.inject(["workspaces","uiWorkspace"],n=>{e.set({dsh:{openSession:r=>n.uiWorkspace.openSession(r),createWorkspace:async r=>(await n.workspaces.create({path:r})).workspaceId,openWorkspace:r=>n.uiWorkspace.openWorkspace(r)}}),n.effect(()=>()=>e.set({dsh:null}))}),t.inject(["sidebarRight","sidebarRightTabs","layout","uiSession","uiWorkspace"],n=>{e.set({nativeChanges:ma(n)}),n.effect(()=>()=>e.set({nativeChanges:null}))}),t.inject(["contextMenus"],n=>{e.set({notify:(r,i)=>n.contextMenus.notify(r,i)}),n.effect(()=>n.contextMenus.register({id:"worktree-desk.tree",target:ft,order:100,resolve:r=>Fe(r)}))}),t.slots.inject("main",()=>t.slots.register({name:"main",key:Bt},n=>de.default.createElement(en,{services:e,useContextMenu:n.useContextMenu,renderFactorySlot:n.renderFactorySlot}))),t.slots.inject("sidebar.panellist",()=>t.slots.register({name:"sidebar.panellist",id:Bt,order:6,label:()=>"\u5DE5\u4F5C\u6811"},n=>de.default.createElement(S,{size:n.size})))}
return module.exports}})
