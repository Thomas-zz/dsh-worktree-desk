window.__ModuleLoader__.load({id:"dsh-worktree-desk",factory:(require)=>{const module={exports:{}};const exports=module.exports;
var ma=Object.create;var $n=Object.defineProperty;var ha=Object.getOwnPropertyDescriptor;var ga=Object.getOwnPropertyNames;var ba=Object.getPrototypeOf,xa=Object.prototype.hasOwnProperty;var va=(t,e)=>{for(var n in e)$n(t,n,{get:e[n],enumerable:!0})},Er=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of ga(e))!xa.call(t,o)&&o!==n&&$n(t,o,{get:()=>e[o],enumerable:!(r=ha(e,o))||r.enumerable});return t};var Ht=(t,e,n)=>(n=t!=null?ma(ba(t)):{},Er(e||!t||!t.__esModule?$n(n,"default",{value:t,enumerable:!0}):n,t)),ka=t=>Er($n({},"__esModule",{value:!0}),t);var fs={};va(fs,{apply:()=>us,inject:()=>ws});module.exports=ka(fs);var Sr=Ht(require("react"),1);var s=Ht(require("react"),1);var Un=`/* \u5DE5\u4F5C\u6811\u9762\u677F\u3002\u989C\u8272\u53D6\u5BBF\u4E3B\u4E3B\u9898\u4EE4\u724C\uFF08\u6D45\u6DF1\u4E24\u5957\u7531\u5BBF\u4E3B\u5207\u597D\uFF09\uFF0C\u540E\u9762\u8DDF\u7684\u662F\u5BBF\u4E3B\u6CA1\u7ED9\u65F6\u7684\u515C\u5E95\u503C\u3002
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
  /* \u5206\u7EC4\u5934\u7684\u5E95\u8272\u8981\u5438\u9876\u76D6\u4F4F\u4E0B\u9762\u6EDA\u8FC7\u7684\u884C\uFF0C\u6240\u4EE5\u4E0D\u80FD\u900F\u660E\u3002 */
  --wt-band: color-mix(in srgb, var(--wt-ink) 5.5%, var(--wt-bg));
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
.wt-wrap
  :is(
    .wt-list,
    .wt-dbody,
    .wt-dhead,
    .wt-railscroll,
    .wt-diffstack,
    .wt-treepanel .wt-files
  ) {
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
  /* \u5DE6\u53F3\u5404\u7559 9px\uFF1A\u6E05\u5355\u4E0A\u65B9\u7684\u7B5B\u9009\u7247\u591A\u4E86\u300C\u5BA1\u67E5\u8FC7\u300D\uFF0C\u9762\u677F\u5BBD 980 \u5DE6\u53F3\u65F6\u8FD8\u8981\u548C\u5DE5\u5177\u7B5B\u9009\u653E\u5F97\u4E0B\u540C\u4E00\u884C\u3002 */
  padding: 0 9px;
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
/* \u4ED3\u5E93\u4E0B\u62C9\u7684\u89E6\u53D1\u6309\u94AE\uFF1A\u5916\u5F62\u548C\u65C1\u8FB9\u7684\u7B5B\u9009\u6807\u7B7E\u4E00\u81F4\u3002 */
.wt-pick {
  position: relative;
  display: inline-flex;
  flex: none;
  max-width: 190px;
  min-width: 0;
}
.wt-pickname {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-pickbtn {
  position: relative;
  display: inline-flex;
  align-items: center;
  min-width: 0;
  max-width: 100%;
  height: 28px;
  /* \u53F3\u8FB9\u7559\u7ED9\u6298\u53E0\u7BAD\u5934\uFF1B\u7BAD\u5934\u7EDD\u5BF9\u5B9A\u4F4D\u5728\u53F3\u7AEF\uFF0C\u4E0D\u53C2\u4E0E\u540D\u79F0\u7684\u6536\u7F29\u3002 */
  padding: 0 25px 0 10px;
  border: 1px solid var(--wt-line-2);
  border-radius: 999px;
  background: var(--wt-surface);
  color: var(--wt-ink);
  font-size: 12.5px;
}
.wt-pickbtn:hover {
  border-color: var(--wt-ink-3);
}
.wt-pickbtn[aria-expanded='true'] {
  border-color: var(--wt-accent);
}
.wt-pickbtn .wt-icon {
  position: absolute;
  top: 50%;
  right: 8px;
  color: var(--wt-ink-3);
  transform: translateY(-50%);
}
/* \u9009\u4E2D\u4E86\u67D0\u4E2A\u4ED3\u5E93\u65F6\uFF0C\u540D\u79F0\u7ED9\u300C\xD7\u300D\u8BA9\u51FA\u4F4D\u7F6E\uFF08\xD7 \u5360\u53F3\u8FB9 24\u201342px\uFF09\uFF0C\u4E0D\u4F1A\u88AB\u538B\u4F4F\u3002 */
.wt-pick:has(.wt-pickclear) .wt-pickname {
  margin-right: 21px;
}
/* \u9009\u4E2D\u4E86\u67D0\u4E2A\u4ED3\u5E93\u65F6\uFF0C\u6298\u53E0\u7BAD\u5934\u5DE6\u8FB9\u591A\u4E00\u4E2A\u300C\xD7\u300D\uFF0C\u70B9\u5B83\u56DE\u5230\u5168\u90E8\u4ED3\u5E93\u3002 */
.wt-pickclear {
  position: absolute;
  top: 50%;
  right: 24px;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: var(--wt-ink-3);
  transform: translateY(-50%);
}
.wt-pickclear:hover {
  background: var(--wt-raised-2);
  color: var(--wt-ink);
}
/* \u5C55\u5F00\u7684\u4ED3\u5E93\u83DC\u5355\uFF1A\u5148\u76D6\u4F4F\u6574\u4E2A\u9762\u677F\uFF08\u70B9\u5916\u9762\u6536\u8D77\uFF09\uFF0C\u83DC\u5355\u8D34\u7740\u89E6\u53D1\u6309\u94AE\u3002
   \u83DC\u5355\u753B\u5728\u9762\u677F\u6839\u8282\u70B9\u4E0A\uFF0C\u4E0D\u6302\u5728\u4F1A\u6A2A\u5411\u6EDA\u52A8\u7684\u7B5B\u9009\u6761\u4E0B\u9762\u3002 */
.wt-picklayer {
  position: absolute;
  inset: 0;
  z-index: 40;
}
.wt-pickmenu {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--wt-line);
  border-radius: var(--wt-r);
  background: var(--wt-surface);
  box-shadow: var(--wt-shadow);
  animation: wt-pop 0.12s ease-out;
}
.wt-picksearch {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;
  height: 38px;
  padding: 0 6px 0 12px;
  border-bottom: 1px solid var(--wt-line);
  color: var(--wt-ink-3);
}
.wt-picksearch input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--wt-ink);
  font-size: 13px;
}
.wt-picksearch input::placeholder {
  color: var(--wt-ink-3);
}
.wt-picklist {
  position: relative; /* \u9009\u9879\u7684\u4F4D\u7F6E\u4EE5\u5B83\u4E3A\u51C6\uFF0C\u6EDA\u5230\u53EF\u89C1\u8303\u56F4\u7528 */
  flex: 1;
  min-height: 0;
  padding: 4px;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.wt-pickopt {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 8px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-2);
  font-size: 12.5px;
  cursor: default;
  user-select: none;
}
.wt-pickopt.is-active {
  background: var(--wt-hover);
  color: var(--wt-ink);
}
.wt-pickopt[aria-selected='true'] {
  color: var(--wt-ink);
  font-weight: 600;
}
/* \u5BF9\u52FE\u53EA\u753B\u5728\u5F53\u524D\u9009\u4E2D\u7684\u90A3\u4E00\u9879\u524D\u9762\uFF0C\u5176\u4F59\u9879\u7559\u540C\u6837\u5BBD\u7684\u4F4D\u7F6E\uFF0C\u540D\u79F0\u5BF9\u9F50\u3002 */
.wt-pickopt .wt-icon {
  color: var(--wt-accent);
  visibility: hidden;
}
.wt-pickopt[aria-selected='true'] .wt-icon {
  visibility: visible;
}
.wt-pickopt .wt-pickname {
  flex: 0 1 auto;
}
.wt-pickopt b {
  flex: none;
  margin-left: auto;
  color: var(--wt-ink-3);
  font-size: 11.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.wt-pickempty {
  padding: 20px 12px;
  color: var(--wt-ink-3);
  font-size: 12.5px;
  text-align: center;
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
  align-items: center;
  flex: none;
  gap: 6px;
  padding: 8px 10px 4px 16px;
  color: var(--wt-ink-3);
  font-size: 11.5px;
  letter-spacing: 0.04em;
}
/* \u6536\u8D77\u4ED3\u5E93\u680F\u7684\u6309\u94AE\u9760\u5230\u6700\u53F3\u8FB9\uFF0C\u548C\u6E05\u5355\u91CC\u5404\u884C\u7684\u9AD8\u5EA6\u5BF9\u9F50\u3002 */
.wt-railhead > .wt-iconbtn {
  width: 26px;
  height: 26px;
  margin-left: auto;
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
  /* \u5DE5\u4F5C\u6811\u884C\u6BD4\u4ED3\u5E93\u540D\u518D\u5F80\u53F3\u7F29\u8FDB\u591A\u5C11\uFF1B\u540D\u79F0\u5DE6\u7F18\u5230\u6E05\u5355\u5DE6\u7F18\u7684\u8DDD\u79BB\u3002 */
  --wt-child: 12px;
  --wt-name-x: 52px;
  container: list / inline-size;
  flex: 1 1 auto;
  min-width: 0;
  overflow-y: auto;
  background: var(--wt-bg);
}
/* \u5E76\u6392\u65F6\u6E05\u5355\u5360\u56FA\u5B9A\u7684\u5BBD\u5EA6\uFF08\u53EF\u4EE5\u62D6\uFF0C\u5BBD\u5EA6\u8BB0\u5728 --list-w\uFF09\uFF0C\u5176\u4F59\u90FD\u7ED9\u8BE6\u60C5\u3002
   \u9762\u677F\u592A\u7A84\u65F6\u6E05\u5355\u8BA9\u51FA\u4E00\u4E9B\uFF0C\u4F46\u8BE6\u60C5\u81F3\u5C11\u7559 360px\u3002 */
.wt-wrap[data-layout='split'] .wt-list {
  flex: 0 1 auto;
  width: var(--list-w, 340px);
  min-width: 240px;
  max-width: min(520px, calc(100% - 360px));
  border-right: 1px solid var(--wt-line);
}
/* \u6E05\u5355\u548C\u8BE6\u60C5\u4E4B\u95F4\u7684\u5206\u9694\u7EBF\uFF1A\u538B\u5728\u6E05\u5355\u7684\u53F3\u8FB9\u6846\u4E0A\uFF0C\u62D6\u7740\u8C03\u6E05\u5355\u5BBD\u5EA6\u3002 */
.wt-resizer {
  position: relative;
  z-index: 10;
  flex: none;
  width: 7px;
  margin: 0 -4px 0 -3px;
  cursor: col-resize;
  touch-action: none;
}
.wt-resizer::after {
  content: '';
  position: absolute;
  inset: 0 2px;
  border-radius: 2px;
  background: transparent;
  transition: background-color 0.12s;
}
.wt-resizer:is(:hover, :focus-visible, [data-dragging])::after {
  background: var(--wt-accent);
}
.wt-listhead {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 6px 0 4px;
  border-bottom: 1px solid var(--wt-line);
  background: var(--wt-bg);
}
.wt-listhead > .wt-iconbtn {
  width: 26px;
  height: 26px;
}
.wt-listtitle {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-left: 12px;
  color: var(--wt-ink-2);
  font-size: 12.5px;
  white-space: nowrap;
}
.wt-listtitle b {
  margin-left: 2px;
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
/* \u8BFB\u53D6\u8FDB\u5EA6\u8D34\u5728\u6E05\u5355\u5934\u4E0B\u6CBF\uFF0C\u4E0D\u5360\u9AD8\u5EA6\uFF1A\u540E\u53F0\u91CD\u8BFB\u65F6\u5185\u5BB9\u5DF2\u7ECF\u753B\u7740\uFF0C\u4E0D\u80FD\u4E0A\u4E0B\u8DF3\u3002 */
.wt-progress {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  overflow: hidden;
  pointer-events: none;
}
.wt-progress::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--p);
  border-radius: 2px;
  background: var(--wt-accent);
  transition: width 0.25s;
}
/* \u53EA\u7ED9\u8BFB\u5C4F\u8F6F\u4EF6\u770B\u7684\u6587\u5B57\u3002 */
.wt-vh {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
/* \u81EA\u5360\u4E00\u884C\uFF1A\u4E0A\u9762\u79BB\u6E05\u5355\u5934\u3001\u4E0B\u9762\u79BB\u4ED3\u5E93\u6807\u9898\u90FD\u7559\u51FA\u7A7A\u767D\uFF0C\u4E0D\u8D34\u7740\u4EFB\u4F55\u4E00\u8FB9\u3002 */
.wt-filternote {
  display: flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  max-width: calc(100% - 32px);
  margin: 10px 12px 14px 20px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--wt-selected);
  color: var(--wt-accent);
  font-size: 12px;
}
.wt-rows {
  padding-bottom: 20px;
}
/* \u53EA\u770B\u4E00\u4E2A\u4ED3\u5E93\u65F6\u4E0A\u9762\u6CA1\u6709\u4ED3\u5E93\u5934\uFF0C\u884C\u56DE\u5230\u6700\u5DE6\uFF0C\u548C\u6E05\u5355\u5934\u5BF9\u9F50\u3002 */
.wt-rows[data-flat] {
  --wt-child: 0px;
  --wt-name-x: 40px;
}

/* \u5206\u7EC4\uFF1A\u4ED3\u5E93\u662F\u6807\u9898\uFF0C\u5DE5\u4F5C\u6811\u662F\u6302\u5728\u5B83\u4E0B\u9762\u7684\u6761\u76EE\u3002
   \u6807\u9898\u5E26\u4E00\u6761\u5E95\u8272\u6A2A\u8D2F\u6574\u884C\u3001\u5B57\u6700\u5927\u6700\u7C97\uFF1B\u6761\u76EE\u7F29\u8FDB\u4E00\u683C\u3001\u5B57\u91CD\u8F83\u8F7B\u3002\u5217\u8868\u5F80\u4E0B\u6EDA\u65F6\u6807\u9898\u5438\u5728\u6E05\u5355\u5934\u4E0B\u9762\uFF0C
   \u968F\u65F6\u770B\u5F97\u51FA\u773C\u524D\u7684\u5DE5\u4F5C\u6811\u5C5E\u4E8E\u54EA\u4E2A\u4ED3\u5E93\u3002 */
.wt-group {
  padding-bottom: 8px;
}
.wt-grouphead {
  position: sticky;
  top: 40px; /* \u6E05\u5355\u5934\u7684\u9AD8\u5EA6 */
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 8px;
  background: var(--wt-band);
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
/* \u4ED3\u5E93\u540D\u6700\u591A\u5360\u5230\u300C\u603B\u5BBD\u51CF\u53BB\u6298\u53E0\u6309\u94AE\u3001\u95F4\u8DDD\u3001\u5DE5\u4F5C\u6811\u6570\u3001\u5206\u652F\u5165\u53E3\u548C\u6458\u8981\u7684\u6E10\u9690\u7559\u767D\u300D\uFF0C
   \u8FD9\u6837\u518D\u957F\u7684\u540D\u5B57\u4E5F\u4E0D\u4F1A\u628A\u53F3\u4FA7\u7684\u5206\u652F\u5165\u53E3\u6324\u51FA\u6E05\u5355\u3002 */
.wt-groupname {
  flex: 0 0 auto;
  max-width: min(46%, calc(100% - 198px));
  min-width: 0;
  overflow: hidden;
  color: var(--wt-ink);
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-groupcount {
  flex: none;
  color: var(--wt-ink-3);
  font-size: 11.5px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
/* \u5730\u65B9\u4E0D\u591F\u65F6\u53EA\u6709\u6458\u8981\u8BA9\u4F4D\uFF1A\u4ED3\u5E93\u540D\u548C\u5206\u652F\u5165\u53E3\u4E0D\u6536\u7F29\uFF0C\u6458\u8981\u53F3\u4FA7\u7559 14px \u7ED9\u6E10\u9690\uFF0C
   \u88AB\u6324\u6389\u7684\u90E8\u5206\u6DE1\u51FA\u53BB\u800C\u4E0D\u662F\u5207\u4E00\u534A\u3002 */
.wt-groupsummary {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding-right: 14px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(
    to right,
    #000 calc(100% - 14px),
    transparent
  );
  mask-image: linear-gradient(to right, #000 calc(100% - 14px), transparent);
}
.wt-branchlink {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  height: 24px;
  margin-right: -6px;
  padding: 0 6px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-3);
  font-size: 12px;
  white-space: nowrap;
}
.wt-branchlink b {
  color: var(--wt-ink-2);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.wt-branchlink:hover {
  background: var(--wt-raised-2);
  color: var(--wt-ink);
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

/* \u5DE5\u4F5C\u6811\u884C\u53EA\u6709\u4E00\u884C\uFF1A\u72B6\u6001\u70B9\u3001\u540D\u79F0\uFF08\u540E\u9762\u8DDF\u300C\u4E3B\u76EE\u5F55\u300D\u8FD9\u7C7B\u6807\u8BB0\uFF09\uFF0C\u884C\u5C3E\u662F\u8981\u52A8\u624B\u7684\u6570\u5B57\uFF08\u2191 \u672A\u63A8\u9001\u3001\u2193 \u843D\u540E\u3001\u6539\u52A8\u6570\u3001\u5F02\u5E38\uFF09\u3002
   \u5173\u8054\u5DE5\u5177\u548C\u6700\u8FD1\u6539\u52A8\u65F6\u95F4\u6392\u5728\u6570\u5B57\u524D\u9762\uFF0C\u6E05\u5355\u591F\u5BBD\u624D\u51FA\u73B0\uFF08\u89C1\u6587\u4EF6\u672B\u5C3E\u6309\u6E05\u5355\u5BBD\u5EA6\u7684\u89C4\u5219\uFF09\u3002
   \u7B2C\u4E00\u5217 24px \u4E0E\u5206\u7EC4\u5934\u7684\u6298\u53E0\u6309\u94AE\u540C\u5BBD\u540C\u4F4D\uFF1A\u72B6\u6001\u70B9\u6B63\u597D\u6302\u5728\u6298\u53E0\u6309\u94AE\u4E0B\u9762\uFF1B\u540D\u79F0\u518D\u5F80\u53F3\u7F29\u8FDB --wt-child\uFF0C
   \u4E00\u773C\u770B\u5F97\u51FA\u662F\u6302\u5728\u4ED3\u5E93\u540D\u4E0B\u9762\u7684\u3002
   \u8DEF\u5F84\u4E0D\u653E\u8FDB\u884C\u91CC\uFF1A\u7A84\u7684\u65F6\u5019\u53EA\u4F1A\u5269\u4E0B\u6700\u540E\u4E00\u6BB5\uFF0C\u6CA1\u6709\u4FE1\u606F\u91CF\uFF1B\u8BE6\u60C5\u680F\u548C\u60AC\u505C\u63D0\u793A\u91CC\u6709\u5B8C\u6574\u8DEF\u5F84\u3002 */
.wt-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 8px;
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
/* \u72B6\u6001\u70B9\u7684\u4F4D\u7F6E\u56FA\u5B9A\uFF1A\u6B63\u597D\u6302\u5728\u4ED3\u5E93\u6807\u9898\u7684\u6298\u53E0\u6309\u94AE\u4E0B\u9762\uFF1B\u6CA1\u6709\u70B9\u7684\u65F6\u5019\u8FD9\u4E00\u683C\u7A7A\u7740\uFF0C\u540D\u79F0\u4E0D\u632A\u4F4D\u3002 */
.wt-dotcell {
  display: grid;
  place-items: center;
  flex: none;
  width: 24px;
  height: 100%;
}
.wt-row > .wt-main {
  flex: 1 1 auto;
  padding-left: var(--wt-child);
}
.wt-main .wt-tag {
  margin-left: 0;
}
.wt-tag-lock {
  padding: 0 4px;
}
/* \u5173\u8054\u5DE5\u5177\u3001\u6700\u8FD1\u6539\u52A8\u65F6\u95F4\uFF1A\u6B21\u8981\u4FE1\u606F\uFF0C\u6392\u5728\u6570\u5B57\u524D\u9762\u3002 */
.wt-row > .wt-side {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
}
/* \u8FD9\u4E00\u884C\u80FD\u505A\u7684\u4E8B\uFF08\u65B0\u5F00 DSH \u4F1A\u8BDD\u3001\u66F4\u591A\uFF09\uFF1A\u5E73\u65F6\u5BBD\u5EA6\u4E3A 0\uFF0C\u505C\u5728\u4E0A\u9762\u3001\u9009\u4E2D\u6216\u952E\u76D8\u8D70\u5230\u65F6\u624D\u51FA\u6765\uFF0C\u4E0D\u5360\u5730\u65B9\u3002
   \u6309\u94AE\u4ECD\u5728\u6392\u7248\u91CC\u3001\u80FD\u88AB Tab \u5230\uFF0C\u53EA\u662F\u88AB\u88C1\u6389\uFF1B\u51FA\u6765\u65F6\u6324\u7684\u662F\u540D\u79F0\u7684\u7701\u7565\u53F7\uFF0C\u53F3\u8FB9\u7684\u6570\u5B57\u4E0D\u52A8\u3002 */
.wt-row > .wt-acts {
  display: inline-flex;
  flex: none;
  align-items: center;
  width: 0;
  overflow: hidden;
  opacity: 0;
}
.wt-row:is(:hover, .is-selected, :focus-within) > .wt-acts {
  width: auto;
  opacity: 1;
}
@media (hover: none) {
  /* \u89E6\u5C4F\u6CA1\u6709\u60AC\u505C\uFF1A\u6BCF\u4E00\u884C\u7684\u6309\u94AE\u5E38\u9A7B\uFF08\u4E0A\u4E0B\u5806\u53E0\u65F6\u4E5F\u6CA1\u6709\u300C\u9009\u4E2D\u7684\u884C\u300D\u53EF\u4EE5\u4F9D\u9760\uFF09\u3002 */
  .wt-row > .wt-acts {
    width: auto;
    opacity: 1;
  }
}
/* \u884C\u5C3E\u7684\u6570\u5B57\uFF1A\u7B49\u5BBD\u5B57\u4F53\uFF0C\u540C\u4E00\u5217\u4E0A\u4E0B\u5BF9\u9F50\u3002\u989C\u8272\u548C\u6807\u9898\u91CC\u5BF9\u5E94\u7684\u90A3\u53E5\u8BDD\u4E00\u81F4\u3002 */
.wt-marks {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  color: var(--wt-ink-3);
  font-family: var(--wt-mono);
  font-size: 11.5px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.wt-marks > b {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.wt-marks > b[data-k='ahead'] {
  color: var(--wt-accent);
}
.wt-marks > b[data-k='behind'],
.wt-marks > b[data-k='dirty'] {
  color: var(--wt-warn);
}
.wt-marks > b[data-k='trouble'] {
  color: var(--wt-danger);
}
.wt-marks > b[data-k='stale'] {
  font-family: var(--wt-font);
  font-weight: 500;
}
/* AI \u5BA1\u67E5\u7684\u7ED3\u8BBA\uFF1A\u6309\u7ED3\u8BBA\u7740\u8272\uFF08\u6CA1\u6709\u95EE\u9898 / \u6709\u5EFA\u8BAE / \u6709\u5FC5\u987B\u5904\u7406\u7684\uFF09\uFF0C\u8FD8\u5728\u5BA1\u7684\u662F\u8F6C\u5708\u3002
   \u5BA1\u67E5\u4E4B\u540E\u6539\u52A8\u53D8\u4E86\u5C31\u6DE1\u4E00\u4E9B\u3002 */
.wt-marks > b[data-k='review'] {
  color: var(--wt-ink-3);
}
.wt-marks > b[data-k='review'][data-tone='running'] {
  color: var(--wt-accent);
}
.wt-marks > b[data-k='review'][data-tone='ok'] {
  color: var(--wt-ok);
}
.wt-marks > b[data-k='review'][data-tone='warn'] {
  color: var(--wt-warn);
}
.wt-marks > b[data-k='review'][data-tone='danger'] {
  color: var(--wt-danger);
}
.wt-marks > b[data-k='review'][data-stale] {
  opacity: 0.6;
}
.wt-marks > b[data-k='review'] .wt-spinner-sm {
  width: 11px;
  height: 11px;
  border-width: 1.5px;
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
/* \u5E72\u51C0\u3001\u843D\u540E\u7684\u884C\u4E0D\u753B\u70B9\uFF08\u7EC4\u4EF6\u91CC\u6839\u672C\u4E0D\u6E32\u67D3\u8FD9\u4E2A\u5143\u7D20\uFF09\uFF0C\u8FD9\u91CC\u4E0D\u7559\u7A7A\u5FC3\u5706\u3002 */
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
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
}
/* \u5206\u652F\u540D\u91CC\u659C\u6760\u524D\u9762\u90A3\u6BB5\u53EA\u662F\u5206\u7C7B\uFF08feat/\u3001codex/\uFF09\uFF0C\u8C03\u6DE1\uFF0C\u89C6\u7EBF\u843D\u5728\u540E\u9762\u771F\u6B63\u533A\u5206\u5B83\u7684\u90A3\u6BB5\u4E0A\u3002 */
.wt-ns {
  color: var(--wt-ink-3);
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
.wt-row > .wt-acts > .wt-menu-btn {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-3);
}
.wt-row .wt-acts :is(.wt-go, .wt-menu-btn):hover {
  background: var(--wt-surface);
  color: var(--wt-ink);
  box-shadow: 0 0 0 1px var(--wt-line-2);
}

/* \u6298\u53E0\u6761\u3001\u5360\u4F4D\u3001\u7A7A\u884C */
.wt-fold {
  display: flex;
  align-items: center;
  gap: 8px;
  width: calc(100% - 16px);
  min-height: 34px;
  margin: 2px 8px 4px;
  padding: 0 10px 0 calc(var(--wt-name-x) - 8px);
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
  padding: 0 12px 6px var(--wt-name-x);
}
.wt-skeleton {
  display: grid;
  gap: 18px;
  padding: 9px 20px 11px var(--wt-name-x);
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
.wt-group > .wt-emptyline {
  padding-left: var(--wt-name-x);
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
  margin: 2px 8px 8px var(--wt-name-x);
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
/* \u8868\u5934\uFF08\u540D\u79F0\u3001\u8DEF\u5F84\u3001\u64CD\u4F5C\uFF09\u548C\u9875\u7B7E\u7559\u5728\u9876\u4E0A\uFF0C\u6B63\u6587\u81EA\u5DF1\u6EDA\u52A8\uFF1A\u770B\u5DEE\u5F02\u65F6\u64CD\u4F5C\u4E00\u76F4\u591F\u5F97\u7740\u3002 */
.wt-detail {
  container: detail / inline-size;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  background: var(--wt-surface);
}
.wt-dinner {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}
/* \u7A97\u53E3\u5F88\u77EE\u65F6\u8868\u5934\u81EA\u5DF1\u8BA9\u4F4D\uFF1A\u5B83\u53EF\u4EE5\u7F29\u77ED\u5E76\u5728\u5185\u90E8\u6EDA\u52A8\uFF0C\u6B63\u6587\u81F3\u5C11\u7559\u4E00\u5C4F\u53EF\u7528\u7684\u9AD8\u5EA6\u3002 */
.wt-dhead {
  flex: 0 1 auto;
  min-height: 64px;
  overflow-y: auto;
  padding: 12px 20px 0;
}
.wt-dtabs {
  flex: none;
}
.wt-dbody {
  position: relative;
  display: flex;
  flex: 1 1 160px;
  flex-direction: column;
  min-height: 120px;
  overflow-y: auto;
}
/* \u9875\u7B7E\u7684\u5185\u5BB9\u3002\u6CA1\u663E\u793A\u7684\u90A3\u4E2A\u9875\u7B7E\u4ECE\u6392\u7248\u91CC\u62FF\u51FA\u6765\u3001\u85CF\u8D77\u6765\uFF0C\u5C3A\u5BF8\u7167\u65E7\uFF1A\u5DEE\u5F02\u533A\u91CF\u597D\u7684\u5BBD\u5EA6\u548C\u6EDA\u52A8\u4F4D\u7F6E\u90FD\u8FD8\u5728\uFF0C
   \u5207\u56DE\u6765\u4E0D\u7528\u91CD\u8BFB\u3002 */
.wt-tabpane {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
.wt-tabpane:not([data-on]) {
  position: absolute;
  inset: 0;
  visibility: hidden;
  pointer-events: none;
}
.wt-tabpane > .wt-emptyline {
  flex: none;
}
.wt-panetext {
  padding: 8px 20px 0;
}
/* \u5931\u6548\u767B\u8BB0\u7684\u8BE6\u60C5\u6CA1\u6709\u6587\u4EF6\u533A\uFF1A\u6B63\u6587\u81EA\u5DF1\u5E26\u5DE6\u53F3\u7559\u767D\u3002 */
.wt-dbody.is-padded {
  padding: 0 20px 20px;
}
/* \u540D\u79F0\u8FD9\u4E00\u884C\u653E\u4E0D\u4E0B\u65F6\uFF0C\u300C\u8981\u52A8\u624B\u7684\u4E8B\u300D\u6574\u7EC4\u6362\u5230\u4E0B\u4E00\u884C\uFF0C\u4E0D\u628A\u540D\u79F0\u6324\u6CA1\u4E86\u3002 */
.wt-dtitle {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  min-width: 0;
}
.wt-todo {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 2px 12px;
  margin-left: auto;
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
/* \u6700\u8FD1\u6539\u52A8\u7684\u65F6\u95F4\u9760\u5728\u8DEF\u5F84\u90A3\u4E00\u884C\u7684\u6700\u53F3\u8FB9\uFF08\u6E05\u5355\u884C\u7A84\u7684\u65F6\u5019\u4E0D\u663E\u793A\u5B83\uFF0C\u8FD9\u91CC\u4E00\u5B9A\u6709\uFF09\u3002 */
.wt-dwhen {
  flex: none;
  color: var(--wt-ink-3);
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
/* \u6700\u8FD1\u4E00\u6B21\u63D0\u4EA4\uFF1A\u77ED\u53F7\u3001\u65F6\u95F4\u3001\u6807\u9898\uFF0C\u53EA\u5360\u4E00\u884C\uFF0C\u653E\u4E0D\u4E0B\u65F6\u7701\u7565\uFF08\u60AC\u505C\u770B\u5168\u6587\uFF09\u3002 */
.wt-dcommit {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  color: var(--wt-ink-2);
  font-size: 12.5px;
  white-space: nowrap;
}
.wt-dcommit > code,
.wt-dcommit > span:first-child {
  flex: none;
  color: var(--wt-ink-3);
  font-size: 11.5px;
}
.wt-dcommit time {
  flex: none;
  color: var(--wt-ink-3);
  font-variant-numeric: tabular-nums;
}
.wt-dsubject {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* \u64CD\u4F5C\u680F\uFF1A\u4E00\u884C\uFF0C\u6309\u8F7B\u91CD\u5206\u7EC4\uFF08\u89C1 detail.jsx \u7684 ActionBar\uFF09\u3002\u7EC4\u4E0E\u7EC4\u4E4B\u95F4\u9694\u5F00\uFF0C\u7EC4\u91CC\u7684\u6309\u94AE\u9996\u5C3E\u76F8\u63A5\u3002 */
.wt-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
  margin-top: 10px;
}
.wt-agroup {
  display: inline-flex;
  flex: none;
  align-items: center;
}
.wt-agroup > .wt-btn {
  padding: 0 9px;
  border-radius: 0;
}
.wt-agroup > .wt-btn:first-child {
  border-radius: var(--wt-r) 0 0 var(--wt-r);
}
.wt-agroup > .wt-btn:last-child {
  border-radius: 0 var(--wt-r) var(--wt-r) 0;
}
.wt-agroup > .wt-btn + .wt-btn {
  margin-left: -1px;
}
/* \u540C\u4E00\u7EC4\u91CC\u4E24\u4E2A\u5B9E\u5FC3\u6309\u94AE\u4E4B\u95F4\u9694\u4E00\u9053\u6D45\u7EBF\u3002 */
.wt-agroup > .wt-btn.is-primary + .wt-btn.is-primary {
  border-left-color: color-mix(in srgb, var(--wt-bg) 30%, transparent);
}
.wt-agroup > .wt-btn:hover:not(:disabled) {
  position: relative;
  z-index: 1;
}
.wt-sync .wt-spinner-sm {
  margin-left: 6px;
}
/* \u300C\u5230\u522B\u7684\u5E94\u7528\u91CC\u53BB\u300D\u7684\u56FE\u6807\u548C\u300C\u66F4\u591A\u300D\u9760\u5230\u64CD\u4F5C\u680F\u6700\u53F3\u8FB9\u3002 */
.wt-apps {
  gap: 2px;
  margin-left: auto;
}
.wt-appbtn {
  width: 28px;
  height: 28px;
  border: 1px solid var(--wt-line-2);
  background: var(--wt-surface);
  color: var(--wt-ink-2);
}
.wt-appbtn:hover:not(:disabled) {
  border-color: var(--wt-ink-3);
  background: var(--wt-raised);
  color: var(--wt-ink);
}
.wt-spinner-sm {
  width: 12px;
  height: 12px;
  border-width: 2px;
}
.wt-sync .wt-btn b {
  margin-left: 2px;
  color: var(--wt-accent);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.wt-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
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
.wt-btn.is-icon {
  width: 32px;
  padding: 0;
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
/* \u300C\u66F4\u591A\u300D\u662F\u5BBF\u4E3B\u753B\u7684\u6309\u94AE\uFF1A\u8FD9\u91CC\u628A\u5B83\u548C\u5DE6\u8FB9\u7684\u5E94\u7528\u56FE\u6807\u6309\u94AE\u505A\u6210\u4E00\u6A21\u4E00\u6837\u7684\u5C3A\u5BF8\u3001\u5706\u89D2\u3001\u5E95\u8272\u548C\u56FE\u6807\u5927\u5C0F\u3002 */
.wt-btn-more {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--wt-line-2);
  border-radius: var(--wt-r-sm);
  background: var(--wt-surface);
  color: var(--wt-ink-2);
}
.wt-btn-more > svg {
  width: 16px;
  height: 16px;
}
.wt-btn-more:hover:not(:disabled) {
  border-color: var(--wt-ink-3);
  background: var(--wt-raised);
  box-shadow: none;
}
/* \u9700\u8981\u52A8\u624B\u7684\u4E8B\uFF1A\u5B57\u91CD\u4E00\u4E9B\uFF0C\u989C\u8272\u548C\u6E05\u5355\u884C\u5C3E\u7684\u6570\u5B57\u4E00\u81F4\u3002 */
.wt-fstate {
  color: var(--wt-ink-3);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.wt-fstate[data-tone='accent'] {
  color: var(--wt-accent);
}
.wt-fstate[data-tone='warn'] {
  color: var(--wt-warn);
}
/* \u9875\u7B7E\u53F3\u8FB9\u7684\u53C2\u8003\u4FE1\u606F\uFF08\u5173\u8054\u5DE5\u5177\u3001\u5206\u652F\u8D77\u70B9\u3001\u4E0A\u6E38\uFF09\uFF1A\u6392\u6210\u4E00\u884C\uFF0C\u653E\u4E0D\u4E0B\u7684\u90E8\u5206\u6DE1\u51FA\uFF0C\u4E0D\u53E6\u5360\u4E00\u884C\u3002 */
.wt-refs {
  display: flex;
  flex: 0 1 auto;
  align-items: center;
  gap: 2px 12px;
  min-width: 0;
  margin-left: 12px;
  padding-right: 14px;
  overflow: hidden;
  color: var(--wt-ink-3);
  font-size: 11.5px;
  white-space: nowrap;
  -webkit-mask-image: linear-gradient(
    to right,
    #000 calc(100% - 14px),
    transparent
  );
  mask-image: linear-gradient(to right, #000 calc(100% - 14px), transparent);
}
.wt-refs i {
  margin-right: 4px;
  font-style: normal;
}
.wt-refs code {
  color: var(--wt-ink-2);
}
.wt-dtabs {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 8px;
  padding: 0 20px;
  border-bottom: 1px solid var(--wt-line);
}
.wt-dtabs [role='tab'] {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 5px;
  height: 36px;
  color: var(--wt-ink-3);
  font-size: 12.5px;
  white-space: nowrap;
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
.wt-notice.is-ok {
  background: color-mix(in srgb, var(--wt-ok) 14%, transparent);
  color: var(--wt-ok);
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
  min-height: 30px;
}
.wt-file:hover {
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

/* \u5DEE\u5F02\u3002\u4E0D\u80FD\u7ED9\u5916\u6846\u52A0 overflow: hidden\uFF0C\u5426\u5219\u5B83\u4F1A\u6210\u4E3A\u7C98\u6027\u5B9A\u4F4D\u7684\u53C2\u7167\uFF0C\u6807\u9898\u7C98\u4E0D\u5230\u9876\u4E0A\u3002 */
.wt-diffbox {
  background: var(--wt-bg);
}
.wt-diffsticky {
  position: sticky;
  top: 36px; /* \u8BA9\u5F00\u6587\u4EF6\u533A\u9876\u4E0A\u90A3\u6761\u5DE5\u5177\u680F */
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 10px;
  row-gap: 2px;
  padding-right: 8px;
  border-bottom: 1px solid var(--wt-line);
  background: var(--wt-bg);
}
.wt-diffhead {
  display: flex;
  /* \u4EE5\u6807\u9898\u7684\u5B8C\u6574\u5BBD\u5EA6\u53C2\u52A0\u6362\u884C\uFF1A\u6807\u9898\u548C\u5DE5\u5177\u653E\u4E0D\u4E0B\u4E00\u884C\u65F6\u5DE5\u5177\u6574\u7EC4\u6362\u884C\uFF0C\u4E0D\u628A\u6807\u9898\u6324\u6210\u7701\u7565\u53F7\u3002 */
  flex: 1 1 auto;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 36px;
  padding: 0 0 0 6px;
}
.wt-diffhead .wt-back {
  margin-left: 0;
}
/* \u91CD\u547D\u540D\u7684\u6587\u4EF6\uFF1A\u6807\u9898\u540E\u9762\u6807\u51FA\u539F\u6587\u4EF6\u540D\u3002 */
.wt-difffrom {
  flex: none;
  color: var(--wt-ink-3);
  font-family: var(--wt-mono);
  font-size: 11.5px;
}
.wt-difftitle {
  flex: 1;
  color: var(--wt-ink);
  font-family: var(--wt-mono);
  font-size: 12px;
}
.wt-difftools {
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 2px 8px;
  min-width: 0;
  padding: 4px 0;
}
.wt-difflayer {
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
/* \u4E0D\u7528 content-visibility\uFF1A\u5B83\u7ED9\u6CA1\u753B\u8FC7\u7684\u5757\u5148\u6309 600px \u4F30\u9AD8\u5EA6\uFF0C\u5361\u7247\u6EDA\u8FDB\u6765\u65F6\u518D\u7F29\u56DE\u53BB\uFF0C
   \u540E\u9762\u7684\u5185\u5BB9\u4F1A\u5F80\u4E0A\u8DF3\u3002\u5DEE\u5F02\u672C\u6765\u5C31\u53EA\u5728\u6EDA\u5230\u9644\u8FD1\u624D\u6302\u4E0A\uFF08\u89C1 files.jsx \u7684 Near\uFF09\uFF0C\u6302\u4E0A\u65F6\u5C31\u662F\u771F\u5B9E\u9AD8\u5EA6\u3002 */
.wt-hunk {
  content-visibility: visible;
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
/* \u8FD9\u4E00\u6BB5\u5728\u53EA\u770B\u4E00\u4E2A\u4ED3\u5E93\u65F6\u6392\u5728\u6E05\u5355\u672B\u5C3E\uFF0C\u662F\u548C\u5DE5\u4F5C\u6811\u540C\u4E00\u5C42\u7684\u4E00\u7EC4\uFF1A\u5206\u7EC4\u5934\u548C\u4ED3\u5E93\u5206\u7EC4\u5934\u4E00\u4E2A\u6837\u5B50\uFF0C
   \u6EDA\u4E0A\u53BB\u65F6\u5438\u5728\u6E05\u5355\u5934\u4E0B\u9762\uFF1B\u91CC\u9762\u7684\u5185\u5BB9\u7F29\u8FDB\u5230\u5DE5\u4F5C\u6811\u540D\u79F0\u7684\u90A3\u4E00\u5217\u3002 */
.wt-branchfold {
  padding-bottom: 4px;
}
.wt-branchhead .wt-groupname {
  font-family: var(--wt-mono);
  font-size: 12.5px;
}
.wt-branchhead .wt-groupname b {
  margin-left: 5px;
  color: var(--wt-ink-3);
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
/* \u6E05\u5355\u7A84\u65F6\u4ED3\u5E93\u5206\u7EC4\u5934\u7684\u6458\u8981\u4F1A\u8BA9\u4F4D\uFF1B\u8FD9\u4E00\u6BB5\u7684\u4E0D\u8BA9\uFF1A\u300C\u51E0\u4E2A\u68C0\u51FA\u4E86\u3001\u51E0\u4E2A\u6CA1\u6709\u300D\u6B63\u662F\u8981\u770B\u7684\u90A3\u53E5\u3002 */
.wt-groupsummary.wt-branchsum {
  display: flex;
}
.wt-branchsum .wt-count {
  gap: 2px;
}
.wt-branchbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 4px calc(var(--wt-name-x) - 12px);
}
.wt-branchnote {
  padding: 2px 8px 2px calc(var(--wt-name-x) - 4px);
}
.wt-branches {
  padding: 4px 8px 2px calc(var(--wt-name-x) - 12px);
}
.wt-branchlist > .wt-emptyline {
  padding-left: var(--wt-name-x);
}
.wt-branchlist > .wt-dtext:not(.wt-branchnote) {
  padding: 6px 8px 4px var(--wt-name-x);
}
.wt-branchlist .wt-more {
  margin-left: calc(var(--wt-name-x) - 40px);
}
/* \u6E05\u5355\u5F88\u7A84\u65F6\u5148\u820D\u6389\u300C\u5DF2\u5E76\u5165\u300D\u7684\u6570\uFF08\u5B83\u53EA\u5728\u5C55\u5F00\u540E\u7684\u7B5B\u9009\u91CC\u6709\u7528\uFF09\u3002 */
@container list (max-width: 359px) {
  .wt-branchmerged {
    display: none;
  }
}
/* \u6E05\u5355\u5934\u4E0A\u7684\u300C\u672C\u5730\u5206\u652F N\u300D\uFF1A\u540E\u9762\u8FD8\u6709\u8DEF\u5F84\uFF0C\u4E0D\u7559\u51FA\u8D34\u8FB9\u7684\u8D1F\u8FB9\u8DDD\u3002 */
.wt-listhead .wt-branchlink {
  margin-right: 0;
}
.wt-listhead .wt-listtitle + .wt-branchlink {
  margin-left: 2px;
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

/* \u300C\u672C\u4ED3\u5E93\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD\u300D\uFF1A\u8F93\u5165\u6846\u3001\u6587\u4EF6\u4F4D\u7F6E\u3001\u9ED8\u8BA4\u63D0\u793A\u8BCD\u3002 */
.wt-promptbox {
  display: block;
  width: 100%;
  min-height: 180px;
  margin-top: 10px;
  padding: 8px 10px;
  border: 1px solid var(--wt-line-2);
  border-radius: var(--wt-r);
  background: var(--wt-bg);
  color: var(--wt-ink);
  font: 12.5px/1.65 var(--wt-mono);
  resize: vertical;
}
.wt-promptbox:focus {
  border-color: var(--wt-accent);
  outline: 0;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--wt-accent) 14%, transparent);
}
.wt-promptbox::placeholder {
  color: var(--wt-ink-3);
}
.wt-promptbox:disabled {
  opacity: 0.6;
}
.wt-promptmeta {
  margin-top: 6px;
}
.wt-promptmeta code {
  word-break: break-all;
}
.wt-promptdefault {
  margin-top: 10px;
  color: var(--wt-ink-2);
  font-size: 12.5px;
}
.wt-promptdefault summary {
  cursor: pointer;
  color: var(--wt-ink-3);
}
.wt-promptdefault pre {
  margin-top: 4px;
  padding: 8px 10px;
  border-radius: var(--wt-r-sm);
  background: var(--wt-raised);
  color: var(--wt-ink-2);
  font: 12px/1.6 var(--wt-mono);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.wt-promptdefault p {
  margin-top: 8px;
}
.wt-promptdefault p:first-of-type {
  margin-top: 6px;
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

/* ---------- \u6309\u6E05\u5355\u5BBD\u5EA6\uFF1A\u6B21\u8981\u4FE1\u606F\u4F9D\u6B21\u8BA9\u4F4D ---------- */
@container list (max-width: 620px) {
  .wt-listpath {
    display: none;
  }
}
/* \u6E05\u5355\u7A84\u65F6\u4ED3\u5E93\u884C\u53EA\u7559\u540D\u79F0\u548C\u300C\u5206\u652F N\u300D\uFF1A\u6BCF\u68F5\u5DE5\u4F5C\u6811\u81EA\u5DF1\u7684\u72B6\u6001\u5C31\u5728\u4E0B\u9762\u51E0\u884C\u3002 */
@container list (max-width: 479px) {
  .wt-groupsummary {
    display: none;
  }
}
@container list (max-width: 419px) {
  .wt-groupcount {
    display: none;
  }
}
/* \u5DE5\u4F5C\u6811\u884C\uFF1A\u6700\u8FD1\u6539\u52A8\u65F6\u95F4\u5148\u8BA9\u4F4D\uFF0C\u518D\u662F\u4E0D\u5728\u6D3B\u52A8\u7684\u5173\u8054\u5DE5\u5177\uFF0C\u6700\u540E\u662F\u540D\u79F0\u540E\u9762\u7684\u6807\u8BB0\u3002
   \u53F3\u8FB9\u8981\u52A8\u624B\u7684\u6570\u5B57\u59CB\u7EC8\u90FD\u5728\u3002 */
@container list (max-width: 449px) {
  .wt-row > .wt-side > .wt-time {
    display: none;
  }
}
@container list (max-width: 399px) {
  .wt-tool:not([data-live]) {
    display: none;
  }
  /* \u53EA\u770B\u4E00\u4E2A\u4ED3\u5E93\u65F6\u9875\u7B7E\u548C\u6392\u5E8F\u653E\u4E0D\u4E0B\u4E00\u884C\uFF0C\u6392\u5E8F\u5148\u8BA9\u4F4D\uFF08\u628A\u6E05\u5355\u62D6\u5BBD\u5C31\u56DE\u6765\uFF09\u3002 */
  .wt-listhead[data-scope='one'] .wt-sort {
    display: none;
  }
  .wt-listsub {
    display: none;
  }
  .wt-sort > span {
    display: none;
  }
  .wt-listtitle {
    margin-left: 4px;
  }
  .wt-listhead {
    padding-left: 8px;
  }
}
@container list (max-width: 359px) {
  .wt-main .wt-tag {
    display: none;
  }
}
@container list (max-width: 339px) {
  .wt-listunit {
    display: none;
  }
}

/* ---------- \u6309\u8BE6\u60C5\u680F\u5BBD\u5EA6 ---------- */
/* \u300C\u5230\u522B\u7684\u5E94\u7528\u91CC\u53BB\u300D\u7684\u56FE\u6807\u5148\u8BA9\u4F4D\uFF1A\u5B83\u4EEC\u5728\u300C\u66F4\u591A\u300D\u548C\u53F3\u952E\u83DC\u5355\u91CC\u90FD\u6709\u3002
   \u8BE6\u60C5\u680F\u4E0D\u5230 680px \u65F6\uFF0C\u5E26\u7740\u300CAI \u5BA1\u67E5\u300D\u548C\u5E26\u6570\u5B57\u7684\u300C\u63A8\u9001\u300D\u653E\u4E0D\u4E0B\u4E00\u884C\u2014\u2014\u5B81\u53EF\u6574\u680F\u4FDD\u6301\u4E00\u884C\u3002 */
@container detail (max-width: 679px) {
  .wt-appbtn {
    display: none;
  }
}
@container detail (max-width: 559px) {
  .wt-dhead {
    padding: 10px 14px 0;
  }
  /* \u9875\u7B7E\u53F3\u8FB9\u7684\u53C2\u8003\u4FE1\u606F\u548C\u9875\u7B7E\u653E\u4E0D\u4E0B\u4E00\u884C\uFF1A\u6362\u5230\u9875\u7B7E\u4E0B\u9762\uFF0C\u4ECD\u7136\u770B\u5F97\u89C1\u3002 */
  .wt-dtabs {
    flex-wrap: wrap;
    padding-right: 14px;
    padding-left: 14px;
  }
  .wt-dbody.is-padded {
    padding: 0 14px 14px;
  }
  .wt-review {
    margin-right: 14px;
    margin-left: 14px;
  }
  .wt-panetext,
  .wt-rbar,
  .wt-rfile {
    padding-right: 14px;
    padding-left: 14px;
  }
  /* \u5DEE\u5F02\u533A\u7A84\uFF1A\u5DE5\u5177\u680F\u4E0A\u7684\u300C\u5168\u90E8\u5C55\u5F00 / \u6536\u8D77\u300D\u53EA\u7559\u56FE\u6807\u3002 */
  .wt-stackbar .wt-expandlabel {
    display: none;
  }
  .wt-refs {
    flex: 0 0 100%;
    order: 2;
    margin-left: 0;
    padding: 0 0 6px;
  }
  /* \u64CD\u4F5C\u680F\u653E\u4E0D\u4E0B\u5E26\u6587\u5B57\u7684\u6B21\u8981\u6309\u94AE\uFF1AAI \u5BA1\u67E5\u3001\u83B7\u53D6 / \u62C9\u53D6 / \u63A8\u9001\u53EA\u7559\u56FE\u6807\u548C\u6570\u5B57\uFF0C
     \u6700\u4E3B\u8981\u7684\u90A3\u4E2A\uFF08\u6253\u5F00 / \u65B0\u5F00 DSH \u4F1A\u8BDD\uFF09\u7167\u65E7\u5E26\u6587\u5B57\uFF0C\u6574\u680F\u4FDD\u6301\u4E00\u884C\u3002 */
  .wt-actions .wt-btn:not(.is-primary) .wt-btnlabel {
    display: none;
  }
  .wt-actions .wt-btn:not(.is-primary) {
    min-width: 30px;
    padding: 0 6px;
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

/* \u8BE6\u60C5\u680F\u5F88\u7A84\u65F6\uFF08\u624B\u673A\uFF09\uFF1A\u6B21\u8981\u6309\u94AE\u53EA\u7559\u56FE\u6807\uFF0C\u6700\u4E3B\u8981\u7684\u90A3\u4E2A\u4FDD\u7559\u6587\u5B57\uFF08\u60AC\u505C\u63D0\u793A\u548C\u8BFB\u5C4F\u540D\u5B57\u90FD\u5728\uFF09\u3002 */
@container detail (max-width: 430px) {
  .wt-actions .wt-btnlabel {
    display: none;
  }
  .wt-actions .wt-btn {
    min-width: 30px;
    padding: 0 6px;
  }
  .wt-actions .wt-btn.is-primary {
    width: auto;
    padding: 0 10px;
  }
  .wt-actions .wt-btn.is-primary .wt-btnlabel {
    display: inline;
  }
  /* \u300C\u5728 DSH \u65B0\u5F00\u4F1A\u8BDD\u300D\u5728\u624B\u673A\u4E0A\u7B80\u5199\u6210\u300C\u65B0\u5F00\u4F1A\u8BDD\u300D\uFF08\u60AC\u505C\u63D0\u793A\u548C\u8BFB\u5C4F\u540D\u5B57\u4E0D\u53D8\uFF09\u3002 */
  .wt-btnlong {
    display: none;
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
  .wt-pick {
    max-width: 150px;
  }
  .wt-chip {
    padding: 0 8px;
  }
  /* \u624B\u673A\u4E0A\u884C\u9AD8\u4E00\u70B9\uFF0C\u624B\u6307\u597D\u70B9\u3002 */
  .wt-row {
    height: 36px;
  }
  .wt-grouphead {
    height: 34px;
  }
  .wt-skeleton {
    gap: 24px;
    padding-top: 12px;
    padding-bottom: 14px;
  }
  .wt-noterow {
    padding-left: 12px;
  }
  .wt-empty {
    padding: 36px 20px;
  }
  .wt-emptystats {
    gap: 20px;
  }
}

/* ---------- \u6587\u4EF6\u533A\uFF1A\u5DEE\u5F02\u4ECE\u4E0A\u5230\u4E0B\u94FA\u5F00 + \u6587\u4EF6\u6811\uFF08\u56FA\u5B9A / \u6D6E\u7A97\uFF09 ---------- */
.wt-filelist {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
}
/* \u6D6E\u7A97\u6A21\u5F0F\u4E0B\u5DE6\u7F18\u7559\u51FA 14px \u7ED9\u628A\u624B\uFF1A\u628A\u624B\u5360\u81EA\u5DF1\u7684\u4F4D\u7F6E\uFF0C\u4E0D\u538B\u5728\u5DEE\u5F02\u4E0A\u3002 */
.wt-filelist.is-float {
  padding-left: 14px;
}
@media (hover: none) {
  /* \u89E6\u5C4F\u6CA1\u6709\u300C\u505C\u5728\u4E0A\u9762\u300D\u8FD9\u56DE\u4E8B\uFF1A\u4E0D\u7559\u628A\u624B\u7684\u4F4D\u7F6E\uFF0C\u6D6E\u7A97\u53EA\u4ECE\u5DE5\u5177\u680F\u7684\u6309\u94AE\u6253\u5F00\u3002 */
  .wt-filelist.is-float {
    padding-left: 0;
  }
  .wt-treefloat:not(.is-open) {
    display: none;
  }
}
/* \u56FA\u5B9A\uFF1A\u6587\u4EF6\u6811\u5360\u5DE6\u8FB9\u4E00\u680F\uFF08\u5BBD\u5EA6\u89C1 --tree-w\uFF09\uFF0C\u5DEE\u5F02\u6392\u5728\u53F3\u8FB9\uFF0C\u5404\u81EA\u6EDA\u52A8\u3002
   \u5DEE\u5F02\u5728\u6587\u6863\u987A\u5E8F\u91CC\u6392\u5728\u7B2C\u4E00\u4E2A\uFF08\u6362\u6446\u6CD5\u65F6\u4E0D\u91CD\u5EFA\uFF09\uFF0C\u753B\u9762\u4E0A\u7684\u5DE6\u53F3\u7528\u7F51\u683C\u4F4D\u7F6E\u5B9A\u3002 */
.wt-filelist.is-docked {
  display: grid;
  grid-template-columns: var(--tree-w) minmax(0, 1fr);
}
.wt-filelist.is-docked > .wt-diffstack {
  grid-column: 2;
  grid-row: 1;
}
.wt-filelist.is-docked > .wt-filetree {
  grid-column: 1;
  grid-row: 1;
}
.wt-treepanel {
  container: tree / inline-size;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: var(--wt-bg);
}
.wt-filetree {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--wt-line);
}
.wt-treehead {
  display: flex;
  flex: none;
  align-items: center;
  gap: 4px;
  padding: 4px 6px 0 10px;
}
.wt-treefilter {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 6px;
  padding: 6px 6px 8px 10px;
  border-bottom: 1px solid var(--wt-line);
}
.wt-treefilter .wt-minisearch {
  background: var(--wt-surface);
}
/* \u7B5B\u9009\u6807\u7B7E\u6392\u6210\u4E00\u884C\uFF1B\u6587\u4EF6\u6811\u7A84\u65F6\u6446\u6210\u6574\u9F50\u7684 2 \xD7 2\uFF0C\u4E0D\u8BA9\u6700\u540E\u4E00\u4E2A\u5B64\u96F6\u96F6\u5730\u6389\u5230\u7B2C\u4E8C\u884C\u3002 */
.wt-treefilter .wt-seg {
  flex: none;
  flex-wrap: nowrap;
}
@container tree (max-width: 264px) {
  .wt-treefilter .wt-seg {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 2px;
  }
  .wt-treefilter .wt-seg button {
    justify-content: center;
  }
}
/* \u56FE\u9489\uFF1A\u7AD6\u7740\u662F\u5DF2\u56FA\u5B9A\uFF0C\u659C\u7740\u662F\u6CA1\u56FA\u5B9A\u3002 */
.wt-pin .wt-icon {
  transform: rotate(45deg);
  transition: transform 0.12s;
}
.wt-pin[aria-pressed='true'] {
  background: var(--wt-selected);
  color: var(--wt-accent);
}
.wt-pin[aria-pressed='true'] .wt-icon {
  transform: none;
}
.wt-treepanel .wt-files {
  flex: 1;
  min-height: 0;
  padding: 4px 6px 10px;
  overflow-y: auto;
}
.wt-treepanel > .wt-emptyline {
  padding: 8px 10px;
}
/* \u6587\u4EF6\u6811\u4E0D\u5BBD\uFF1A\u5FBD\u6807\u5DF2\u7ECF\u8BF4\u660E\u4E86\u662F\u4FEE\u6539\u8FD8\u662F\u672A\u8DDF\u8E2A\uFF0C\u4E0D\u518D\u91CD\u590D\u5199\u4E00\u904D\uFF0C\u628A\u5730\u65B9\u7559\u7ED9\u6587\u4EF6\u540D\u3002 */
.wt-treepanel .wt-fchange {
  display: none;
}
.wt-treepanel .wt-file {
  grid-template-columns: 22px minmax(0, 1fr) max-content max-content;
  min-height: 28px;
}
.wt-treepanel .wt-dir {
  min-height: 26px;
}

/* \u6587\u4EF6\u6811\u91CC\u5F53\u524D\u6EDA\u5230\u7684\u6587\u4EF6\u3002 */
.wt-file[data-active] {
  background: var(--wt-selected);
}
.wt-fnote {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 3px;
  color: var(--wt-ink-2);
  font-size: 11px;
  font-variant-numeric: tabular-nums;
}
.wt-fnote[data-level='warn'] {
  color: var(--wt-warn);
}
.wt-fnote[data-level='fix'] {
  color: var(--wt-danger);
}
/* \u6D6E\u7A97\u6A21\u5F0F\u4E0B\u5B83\u662F\u5F39\u6027\u9879\u76EE\uFF1A\u8981\u58F0\u660E\u4F1A\u4F38\u957F\uFF0C\u5426\u5219\u5BBD\u5EA6\u8DDF\u7740\u5185\u5BB9\u8D70\u3001\u53F3\u8FB9\u7A7A\u51FA\u4E00\u622A\u3002\u56FA\u5B9A\u6210\u4E24\u680F\u540E\u5B83\u662F\u7F51\u683C\u5355\u5143\uFF0C\u81EA\u52A8\u586B\u6EE1\u3002 */
.wt-diffstack {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
}
.wt-stackbar {
  position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 36px;
  padding: 0 8px 0 6px;
  border-bottom: 1px solid var(--wt-line);
  background: var(--wt-bg);
}
/* \u6D6E\u7A97\u6A21\u5F0F\u4E0B\u5DE5\u5177\u680F\u6700\u5DE6\u8FB9\u662F\u6253\u5F00\u6587\u4EF6\u6811\u7684\u6309\u94AE\uFF1A\u9F20\u6807\u505C\u5728\u8FD9\u91CC\uFF0C\u6216\u8005\u70B9\u4E00\u4E0B\u3002 */
.wt-treetoggle {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 2px;
  margin-right: 4px;
}
.wt-treetoggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 240px;
  height: 26px;
  padding: 0 8px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-2);
  font-size: 12.5px;
}
.wt-treetoggle-btn:hover,
.wt-treetoggle-btn[aria-expanded='true'] {
  background: var(--wt-hover);
  color: var(--wt-ink);
}
.wt-treetoggle-label {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-treetoggle-btn b {
  color: var(--wt-ink);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.wt-treetoggle-btn small {
  color: var(--wt-ink-3);
  font-weight: 500;
}
.wt-treetoggle .wt-iconbtn {
  width: 22px;
  height: 22px;
}
/* \u4E0A\u4E00\u4E2A / \u4E0B\u4E00\u4E2A\u6587\u4EF6\uFF0C\u4E2D\u95F4\u662F\u300C\u7B2C\u51E0\u4E2A / \u5171\u51E0\u4E2A\u300D\u3002 */
.wt-stepper {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 2px;
  color: var(--wt-ink-2);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.wt-stepper b {
  min-width: 46px;
  color: var(--wt-ink);
  font-weight: 600;
  text-align: center;
}
.wt-stepper .wt-iconbtn {
  width: 24px;
  height: 24px;
}
.wt-stackcard {
  border-bottom: 1px solid var(--wt-line);
}
/* \u6D6E\u7A97\uFF1A\u5E73\u65F6\u53EA\u6709\u5DE6\u7F18 14px \u5BBD\u7684\u628A\u624B\uFF1B\u5C55\u5F00\u65F6\u5411\u53F3\u8BA9\u51FA\u6587\u4EF6\u6811\u7684\u5BBD\u5EA6\uFF08\u5185\u5BB9\u4E0D\u53D8\uFF0C\u53EA\u662F\u4E0D\u518D\u88AB\u88C1\u6389\uFF09\u3002
   \u628A\u624B\u548C\u6D6E\u7A97\u662F\u540C\u4E00\u4E2A\u5143\u7D20\uFF1A\u4ECE\u628A\u624B\u6ED1\u8FDB\u6D6E\u7A97\u4E0D\u7B97\u300C\u79BB\u5F00\u300D\u3002\u5B83\u4ECE\u5DE5\u5177\u680F\u4E0B\u9762\u5F00\u59CB\uFF0C\u4E0D\u76D6\u4F4F\u5DE5\u5177\u680F\u3002 */
.wt-treefloat {
  position: absolute;
  top: 36px;
  bottom: 0;
  left: 0;
  z-index: 6;
  width: 14px;
  overflow: hidden;
  background: var(--wt-bg);
  transition: width 0.14s ease-out;
}
.wt-treefloat.is-open {
  width: var(--tree-w);
  border-right: 1px solid var(--wt-line);
  box-shadow: var(--wt-shadow);
}
.wt-treestrip {
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 14px;
  color: var(--wt-ink-3);
  transition: opacity 0.1s;
}
.wt-treestrip:hover {
  color: var(--wt-ink);
  background: var(--wt-hover);
}
.wt-treefloat.is-open .wt-treestrip {
  opacity: 0;
  pointer-events: none;
}
.wt-treefloat > .wt-treepanel {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 14px;
  width: var(--tree-w);
  visibility: hidden;
  transition:
    visibility 0s linear 0.16s,
    left 0.14s ease-out;
}
.wt-treefloat.is-open > .wt-treepanel {
  left: 0;
  visibility: visible;
  transition-delay: 0s;
}
/* \u6536\u7740\u7684\u6587\u4EF6\u5C31\u662F\u4E00\u884C\u6587\u4EF6\u540D\u3002 */
.wt-filehead {
  width: 100%;
  border-radius: 0;
}
/* \u5DEE\u5F02\u8FD8\u6CA1\u8BFB\u5230\u65F6\u5148\u5360\u4E2A\u4F4D\u7F6E\uFF0C\u6EDA\u52A8\u6761\u4E0D\u8DF3\u52A8\u3002 */
.wt-filewait {
  height: 140px;
}

/* ---------- \u5BA1\u67E5\u72B6\u6001\u6761 ---------- */
.wt-review {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 10px;
  margin: 10px 20px 0;
  padding: 6px 10px;
  border: 1px solid var(--wt-line);
  border-radius: var(--wt-r);
  background: var(--wt-bg);
  color: var(--wt-ink-2);
  font-size: 12.5px;
}
.wt-review.is-running .wt-spinner {
  width: 14px;
  height: 14px;
  border-width: 2px;
}
.wt-review.is-failed {
  border-color: transparent;
  background: color-mix(in srgb, var(--wt-danger) 7%, var(--wt-bg));
  color: var(--wt-danger);
}
.wt-review.is-done > b {
  color: var(--wt-ink);
  font-weight: 650;
}
.wt-reviewicon {
  display: grid;
  flex: none;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--wt-raised);
  color: var(--wt-ink-2);
}
.wt-reviewicon[data-tone='ok'] {
  background: color-mix(in srgb, var(--wt-ok) 18%, transparent);
  color: var(--wt-ok);
}
.wt-reviewicon[data-tone='warn'] {
  background: color-mix(in srgb, var(--wt-warn) 20%, transparent);
  color: var(--wt-warn);
}
.wt-reviewicon[data-tone='danger'] {
  background: color-mix(in srgb, var(--wt-danger) 14%, transparent);
  color: var(--wt-danger);
}
.wt-reviewcounts {
  color: var(--wt-ink-3);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.wt-reviewcounts b {
  color: var(--wt-ink);
  font-weight: 600;
}
.wt-reviewsummary {
  flex: 1 1 200px;
  min-width: 0;
  overflow: hidden;
  color: var(--wt-ink-2);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-reviewhint,
.wt-reviewstale {
  color: var(--wt-ink-3);
  font-size: 12px;
}
.wt-reviewstale {
  color: var(--wt-warn);
}
/* \u5BA1\u67E5\u7ED3\u8BBA\u6761\u6392\u5728\u9875\u7B7E\u548C\u6B63\u6587\u4E4B\u95F4\uFF0C\u4E24\u4E2A\u9875\u7B7E\u4E0A\u90FD\u770B\u5F97\u89C1\u3002 */
.wt-dtabs + .wt-review {
  margin-top: 10px;
}
/* \u5173\u8054\u4F1A\u8BDD\u91CC\u6807\u51FA\u300C\u4EE3\u7801\u5BA1\u67E5\u300D\u7684\u90A3\u4E2A\u5C0F\u6807\u7B7E\uFF1A\u6392\u5728\u6807\u9898\u4E0B\u9762\uFF0C\u9760\u5DE6\uFF0C\u4E0D\u6491\u6EE1\u6574\u884C\u3002 */
.wt-sbody > .wt-tag {
  justify-self: start;
  margin-top: 2px;
  margin-left: 0;
}

/* ---------- \u5DEE\u5F02\u91CC\u7684\u6279\u6CE8 ---------- */
/* \u591F\u5BBD\uFF1A\u6279\u6CE8\u5360\u4EE3\u7801\u53F3\u8FB9\u4E00\u680F\uFF0C\u8D34\u7740\u5B83\u8BF4\u7684\u90A3\u4E00\u884C\u3002 */
.wt-diffbox[data-margin] {
  --wt-note: clamp(220px, 34%, 360px);
}
.wt-diffbox[data-margin] .wt-line,
.wt-diffbox[data-margin] .wt-hunkhead {
  grid-template-columns: 44px 44px 14px minmax(0, 1fr) var(--wt-note);
}
.wt-diffbox[data-margin] .wt-hunkbody.is-split {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) var(--wt-note);
}
/* \u5757\u5934\u8FD8\u662F\u516D\u683C\uFF08\u5DE6\u534A\u3001\u53F3\u534A\u5404\u662F\u884C\u53F7\u3001\u7B26\u53F7\u3001\u8303\u56F4\uFF09\uFF0C\u540E\u9762\u591A\u51FA\u6279\u6CE8\u90A3\u4E00\u680F\u3002 */
.wt-diffbox[data-margin] .wt-hunkhead.is-split {
  grid-template-columns: 44px 14px minmax(0, 1fr) 44px 14px minmax(0, 1fr) var(
      --wt-note
    );
}
/* \u5DE6\u534A\u3001\u53F3\u534A\u3001\u6279\u6CE8\u5404\u5360\u56FA\u5B9A\u7684\u4E00\u683C\u3002\u6CA1\u6709\u6279\u6CE8\u7684\u884C\u7B2C\u4E09\u683C\u7A7A\u7740\u2014\u2014\u4E0D\u5199\u6B7B\u4F4D\u7F6E\u7684\u8BDD\uFF0C
   \u6D4F\u89C8\u5668\u81EA\u52A8\u6392\u7248\u4F1A\u628A\u4E0B\u4E00\u884C\u7684\u4EE3\u7801\u586B\u8FDB\u8FD9\u4E2A\u7A7A\u683C\uFF0C\u6574\u4EFD\u5DEE\u5F02\u9519\u4F4D\u3001\u4EE3\u7801\u8DD1\u8FDB\u6279\u6CE8\u680F\u3002 */
.wt-diffbox[data-margin] .wt-srow > .wt-half:first-child {
  grid-column: 1;
}
.wt-diffbox[data-margin] .wt-srow > .wt-half:nth-child(2) {
  grid-column: 2;
}
/* \u884C\u91CC\u5E26\u7740\u6279\u6CE8\u5361\u7247\u65F6\u8FD9\u4E00\u884C\u4F1A\u53D8\u9AD8\uFF1A\u884C\u53F7\u680F\u7684\u7740\u8272\u53EA\u76D6\u4F4F\u8FD9\u4E00\u884C\u6587\u5B57\uFF0C\u4E0D\u8DDF\u7740\u62C9\u6210\u4E00\u6574\u5757\u3002 */
.wt-diffbox[data-margin] .wt-line > .wt-ln {
  align-self: start;
}
/* \u5012\u6570\u7B2C\u4E8C\u6761\u7F51\u683C\u7EBF\uFF0C\u4E5F\u5C31\u662F\u6700\u540E\u4E00\u680F\uFF1A\u4E0A\u4E0B\u5BF9\u7167\u662F\u4E94\u680F\uFF08\u2026\u4EE3\u7801\u3001\u6279\u6CE8\uFF09\uFF0C\u5DE6\u53F3\u5E76\u6392\u662F\u4E09\u680F\uFF08\u5DE6\u534A\u3001\u53F3\u534A\u3001\u6279\u6CE8\uFF09\uFF0C
   \u4E24\u79CD\u90FD\u843D\u5728\u6279\u6CE8\u90A3\u4E00\u680F\u3002\u5199\u6B7B\u680F\u53F7\u7684\u8BDD\uFF0C\u4E0A\u4E0B\u5BF9\u7167\u65F6\u4F1A\u843D\u8FDB\u300C\u7B26\u53F7\u300D\u90A3\u4E00\u683C\u3002 */
.wt-notecell {
  grid-column: -2;
  align-self: start;
  min-width: 0;
  padding: 6px 10px 6px 0;
}
.wt-notecell > .wt-note + .wt-note {
  margin-top: 6px;
}
/* \u7A84\uFF1A\u884C\u5C3E\u4E00\u4E2A\u6807\u8BB0\uFF0C\u70B9\u5F00\u5728\u8FD9\u4E00\u884C\u4E0B\u9762\u770B\u3002 */
.wt-codecell {
  display: flex;
  /* \u6491\u6EE1\u8FD9\u4E00\u884C\u7684\u9AD8\u5EA6\uFF0C\u6807\u8BB0\u5728\u91CC\u9762\u5C45\u4E2D\uFF1A\u6362\u884C\u540E\u5360\u597D\u51E0\u884C\u7684\u4EE3\u7801\uFF0C\u6807\u8BB0\u843D\u5728\u4E2D\u95F4\u800C\u4E0D\u662F\u8D34\u7740\u7B2C\u4E00\u884C\u3002 */
  align-items: center;
  align-self: stretch;
  min-width: 0;
}
.wt-codecell > .wt-code {
  flex: 0 1 auto;
  min-width: 0;
}
.wt-notemark {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 2px;
  height: 18px;
  margin: 0 8px 0 10px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--wt-raised-2);
  color: var(--wt-ink-2);
  font-size: 10.5px;
  font-weight: 600;
}
.wt-notemark[data-level='warn'] {
  color: var(--wt-warn);
}
.wt-notemark[data-level='fix'] {
  color: var(--wt-danger);
}
.wt-notemark:is(:hover, [aria-expanded='true']) {
  background: var(--wt-ink);
  color: var(--wt-bg);
}
/* \u6709\u95EE\u9898\u7684\u90A3\u4E00\u884C\uFF1A\u884C\u53F7\u680F\u7740\u8272\uFF0C\u6EDA\u8FC7\u53BB\u4E5F\u770B\u5F97\u89C1\u3002 */
.wt-line[data-note='warn'] > .wt-ln,
.wt-srow[data-note='warn'] > .wt-half[data-kind='add'] > .wt-ln {
  background: color-mix(in srgb, var(--wt-warn) 30%, transparent);
}
.wt-line[data-note='fix'] > .wt-ln,
.wt-srow[data-note='fix'] > .wt-half[data-kind='add'] > .wt-ln {
  background: color-mix(in srgb, var(--wt-danger) 32%, transparent);
}
.wt-line[data-flash] {
  animation: wt-flash 1.3s ease-out;
}
@keyframes wt-flash {
  from {
    box-shadow: inset 0 0 0 2px var(--wt-accent);
  }
}
.wt-noterow {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 12px 6px 102px;
  border-top: 1px solid var(--wt-line);
  border-bottom: 1px solid var(--wt-line);
  background: var(--wt-raised);
}
.wt-noterow.is-span,
.wt-noterow.is-loose {
  grid-column: 1 / -1;
}
/* \u5361\u7247\u5E73\u5206\u5B83\u6240\u5728\u7684\u90A3\u4E00\u6761\u3001\u94FA\u5230\u548C\u4EE3\u7801\u4E00\u6837\u7684\u53F3\u8FB9\uFF1A\u4E00\u6761\u91CC\u653E\u4E0D\u4E0B\u4E24\u5F20\u65F6\u624D\u6362\u884C\u3002 */
.wt-noterow > .wt-note {
  flex: 1 1 240px;
  min-width: 0;
}
.wt-note {
  min-width: 0;
  border: 1px solid var(--wt-line);
  border-radius: var(--wt-r-sm);
  background: var(--wt-surface);
  font-size: 12px;
}
.wt-note[data-level='fix'] {
  border-color: color-mix(in srgb, var(--wt-danger) 50%, transparent);
}
.wt-note[data-level='warn'] {
  border-color: color-mix(in srgb, var(--wt-warn) 55%, transparent);
}
.wt-notehead {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
  padding: 6px 8px;
}
.wt-notedot {
  flex: none;
  width: 7px;
  height: 7px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--wt-ink-3);
}
.wt-note[data-level='warn'] .wt-notedot {
  background: var(--wt-warn);
}
.wt-note[data-level='fix'] .wt-notedot {
  background: var(--wt-danger);
}
.wt-notetitle {
  flex: 1;
  min-width: 0;
  color: var(--wt-ink);
  font-weight: 600;
  line-height: 1.45;
  overflow-wrap: anywhere;
}
.wt-notetag {
  flex: none;
  padding: 0 5px;
  border-radius: 4px;
  background: var(--wt-raised);
  color: var(--wt-ink-2);
  font-size: 10.5px;
  font-weight: 500;
  line-height: 16px;
}
.wt-note[data-level='fix'] .wt-notetag {
  background: color-mix(in srgb, var(--wt-danger) 13%, transparent);
  color: var(--wt-danger);
}
.wt-note[data-level='warn'] .wt-notetag {
  background: color-mix(in srgb, var(--wt-warn) 18%, transparent);
  color: var(--wt-warn);
}
.wt-notechevron {
  flex: none;
  margin-top: 3px;
  color: var(--wt-ink-3);
  transform: rotate(-90deg);
}
.wt-notechevron.is-open {
  transform: none;
}
.wt-notebody {
  padding: 0 10px 8px 21px;
  color: var(--wt-ink-2);
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.wt-notejump {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 2px;
  color: var(--wt-ink-2);
  font-size: 12px;
  white-space: nowrap;
}
.wt-notejump .wt-iconbtn {
  width: 24px;
  height: 24px;
}
.wt-notejump b {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.wt-hunkno {
  display: inline-grid;
  flex: none;
  place-items: center;
  min-width: 18px;
  height: 16px;
  border-radius: 4px;
  background: var(--wt-selected);
  color: var(--wt-accent);
  font-size: 10.5px;
  font-weight: 600;
  line-height: 16px;
}

/* ---------- \u540C\u6B65\u7684\u7ED3\u679C ---------- */
.wt-syncout {
  max-height: 240px;
  margin-top: 10px;
  padding: 8px 10px;
  overflow: auto;
  border-radius: var(--wt-r-sm);
  background: var(--wt-raised);
  font-family: var(--wt-mono);
  font-size: 11.5px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  user-select: text;
}

/* ---------- \u5DE5\u5177\u680F\u4E0A\u770B\u5DEE\u5F02\u7684\u65B9\u5F0F\uFF08\u5DE6\u53F3\u5E76\u6392\u3001\u81EA\u52A8\u6362\u884C\uFF09\uFF1A\u5BF9\u6574\u4E2A\u6587\u4EF6\u533A\u751F\u6548 ---------- */
.wt-viewbtns {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 2px;
  margin-left: 2px;
}
.wt-viewbtns .wt-iconbtn {
  width: 24px;
  height: 24px;
}

/* ---------- \u5BA1\u67E5\u7ED3\u679C\u9875\u7B7E\uFF1A\u6279\u6CE8\u6309\u6587\u4EF6\u5217\u51FA ---------- */
.wt-rbar {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  flex: none;
  align-items: center;
  gap: 10px;
  padding: 10px 20px 8px;
  border-bottom: 1px solid var(--wt-line);
  background: var(--wt-bg);
}
.wt-rhint {
  min-width: 0;
  overflow: hidden;
  color: var(--wt-ink-3);
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-rfile {
  padding: 12px 20px 2px;
}
.wt-rfilehead {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 6px;
  color: var(--wt-ink-3);
  font-family: var(--wt-mono);
  font-size: 12px;
  font-weight: 600;
}
.wt-rfilepath {
  min-width: 0;
  overflow: hidden;
  color: var(--wt-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.wt-rfilehead b {
  color: var(--wt-ink-3);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}
.wt-rlist {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.wt-rnotehead {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 6px 8px;
}
.wt-rline {
  flex: none;
  margin-top: 1px;
  padding: 0 5px;
  border-radius: 4px;
  background: var(--wt-raised);
  color: var(--wt-ink-3);
  font-family: var(--wt-mono);
  font-size: 10.5px;
  line-height: 16px;
}

@media (prefers-reduced-motion: reduce) {
  .wt-wrap *,
  .wt-wrap *::before,
  .wt-wrap *::after {
    animation: none !important;
    transition: none !important;
  }
}

/* ---------- \u5DF2\u5BA1\u9605\uFF1A\u8BFB\u8FC7\u7684\u6587\u4EF6\u505A\u4E2A\u8BB0\u53F7\uFF0C\u53EA\u505A\u7EDF\u8BA1 ---------- */
/* \u52FE\u9009\u6846\uFF1A\u5DEE\u5F02\u7684\u6807\u9898\u884C\u3001\u6536\u8D77\u6765\u7684\u6587\u4EF6\u884C\u3001\u6587\u4EF6\u6811\u91CC\u662F\u540C\u4E00\u4E2A\u3002
   \u5BA1\u9605\u4E4B\u540E\u53C8\u6539\u8FC7\u7684\uFF0C\u6846\u91CC\u662F\u7425\u73C0\u8272\u7684\u4E00\u70B9\uFF0C\u6CA1\u6253\u52FE\u3002 */
.wt-reviewed {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 6px;
  border-radius: var(--wt-r-sm);
  color: var(--wt-ink-2);
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}
.wt-reviewed:hover {
  background: var(--wt-hover);
}
/* \u771F\u6B63\u7684\u52FE\u9009\u6846\u770B\u4E0D\u89C1\uFF0C\u4F46\u8FD8\u5728\u6392\u7248\u91CC\uFF1A\u952E\u76D8 Tab \u5F97\u5230\u3001\u8BFB\u5C4F\u8BFB\u5F97\u5230\uFF1B\u7126\u70B9\u843D\u5728\u65C1\u8FB9\u753B\u7684\u90A3\u4E2A\u6846\u4E0A\u3002 */
.wt-reviewed input {
  position: absolute;
  width: 14px;
  height: 14px;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
.wt-reviewed:has(input:focus-visible) .wt-reviewedbox {
  outline: 2px solid var(--wt-accent);
  outline-offset: 2px;
}
.wt-reviewedbox {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--wt-ink-3);
  border-radius: 4px;
  background: var(--wt-bg);
  color: #fff;
  transition:
    background 0.12s,
    border-color 0.12s;
}
.wt-reviewedbox .wt-icon {
  stroke-width: 2.6;
}
.wt-reviewed:hover .wt-reviewedbox {
  border-color: var(--wt-ink-2);
}
.wt-reviewed[data-state='viewed'] .wt-reviewedbox {
  border-color: var(--wt-accent);
  background: var(--wt-accent);
}
.wt-reviewed[data-state='changed'] .wt-reviewedbox {
  border-color: var(--wt-warn);
  background: color-mix(in srgb, var(--wt-warn) 20%, transparent);
}
.wt-reviewed[data-state='changed'] .wt-reviewedbox::after {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--wt-warn);
}
.wt-reviewed[data-state='viewed'] .wt-reviewedlabel {
  color: var(--wt-ink-3);
}
.wt-difftools .wt-reviewed {
  margin-left: 2px;
}
/* \u6587\u4EF6\u6811\u91CC\u7684\u4E00\u4E2A\u6587\u4EF6\uFF1A\u5DE6\u8FB9\u662F\u52FE\uFF0C\u53F3\u8FB9\u662F\u6587\u4EF6\u540D\u3002\u52FE\u548C\u76EE\u5F55\u884C\u7684\u7BAD\u5934\u4E0A\u4E0B\u5BF9\u9F50\u6210\u4E00\u5217\u3002 */
.wt-filewrap {
  display: flex;
  align-items: center;
  min-width: 0;
}
.wt-filewrap > .wt-reviewed {
  height: 28px;
  padding: 0 2px 0 calc(9px + var(--depth, 0) * 16px);
}
.wt-filewrap > .wt-file {
  flex: 1;
  width: auto;
  min-width: 0;
  padding-left: 4px;
}
/* \u6536\u7740\u7684\u6587\u4EF6\uFF1A\u4E00\u884C\u6587\u4EF6\u540D\uFF0C\u6700\u53F3\u662F\u300C\u5DF2\u5BA1\u9605\u300D\u3002\u6574\u884C\u90FD\u80FD\u70B9\u5F00\uFF0C\u52FE\u9009\u6846\u90A3\u4E00\u5757\u9664\u5916\u3002 */
.wt-filerow {
  display: flex;
  align-items: center;
  min-width: 0;
}
.wt-filerow:hover {
  background: var(--wt-hover);
}
.wt-filerow > .wt-file {
  flex: 1;
  width: auto;
  min-width: 0;
  padding-left: 6px;
  /* \u5FBD\u6807\u548C\u6587\u4EF6\u540D\u4E4B\u540E\u7684\u4E1C\u897F\u53EF\u591A\u53EF\u5C11\uFF08\u6709\u65B0\u6539\u52A8\u3001\u6279\u6CE8\u6570\u3001\u6539\u52A8\u8BF4\u660E\u3001\u589E\u5220\u884C\u6570\u3001\u7BAD\u5934\uFF09\uFF0C\u5404\u5360\u4E00\u683C\u3001\u6309\u5185\u5BB9\u5B9A\u5BBD\u3002
     \u5199\u6B7B\u4E94\u683C\u7684\u8BDD\uFF0C\u5E26\u6279\u6CE8\u7684\u6587\u4EF6\u591A\u51FA\u4E00\u4E2A\u5143\u7D20\uFF0C\u7BAD\u5934\u4F1A\u88AB\u6324\u5230\u7B2C\u4E8C\u884C\u3002 */
  grid-template-columns: 22px minmax(0, 1fr);
  grid-auto-flow: column;
  grid-auto-columns: max-content;
}
.wt-filerow > .wt-file:hover {
  background: none;
}
.wt-filerow > .wt-reviewed {
  margin-right: 6px;
}
/* \u5DF2\u5BA1\u9605\u7684\u6587\u4EF6\uFF1A\u5FBD\u6807\u548C\u6587\u4EF6\u540D\u6DE1\u4E00\u70B9\uFF0C\u4E00\u773C\u770B\u5F97\u51FA\u54EA\u4E9B\u8FD8\u6CA1\u770B\u3002 */
.wt-stackcard[data-viewed='viewed'] :is(.wt-fname, .wt-badge),
.wt-filewrap[data-viewed='viewed'] :is(.wt-fname, .wt-badge) {
  opacity: 0.62;
}
/* \u5BA1\u9605\u4E4B\u540E\u53C8\u6709\u6539\u52A8\u7684\u6587\u4EF6\u3002 */
.wt-tag-changed {
  background: color-mix(in srgb, var(--wt-warn) 16%, transparent);
  color: var(--wt-warn);
}
/* \u5DF2\u5BA1\u9605\u7684\u8FDB\u5EA6\u73AF\uFF1A\u4ECE\u5341\u4E8C\u70B9\u8D77\u987A\u65F6\u9488\u586B\u5230\u5DF2\u5BA1\u9605\u7684\u5360\u6BD4\u3002\u6E05\u5355\u884C\u5C3E\u548C\u5DE5\u5177\u680F\u91CC\u662F\u540C\u4E00\u4E2A\u3002 */
.wt-ring {
  flex: none;
  width: 14px;
  height: 14px;
  transform: rotate(-90deg);
}
.wt-ring-track,
.wt-ring-fill {
  fill: none;
  stroke-width: 2;
}
.wt-ring-track {
  stroke: var(--wt-line-2);
}
.wt-ring-fill {
  stroke: var(--wt-ok);
  transition: stroke-dasharray 0.2s;
}
/* \u6E05\u5355\u884C\u5C3E\u7684\u5DF2\u5BA1\u9605\u8FDB\u5EA6\uFF1A\u73AF + 3/8\uFF1B\u90FD\u8BFB\u5B8C\u4E86\u662F\u4E00\u4E2A\u7EFF\u8272\u7684\u5BF9\u52FE\u3002 */
.wt-marks > b[data-k='seen'] {
  gap: 3px;
  font-family: var(--wt-font);
  font-size: 11px;
  font-weight: 600;
}
.wt-marks > b[data-k='seen'][data-done] {
  color: var(--wt-ok);
}
/* AI \u5BA1\u67E5\u7684\u661F\u540E\u9762\u7684\u6570\uFF1A\u6709\u51E0\u5904\u8981\u5904\u7406\u3002 */
.wt-marks > b[data-k='review'] {
  font-family: var(--wt-font);
  font-size: 11px;
  font-weight: 650;
}
/* \u5DE5\u5177\u680F\u4E0A\u7684\u8FDB\u5EA6\uFF1A\u73AF +\u300C\u5DF2\u5BA1\u9605 3 / 12\u300D\uFF0C\u65C1\u8FB9\u4E00\u952E\u5168\u6807\u3002
   \u5DEE\u5F02\u533A\u7A84\u7684\u65F6\u5019\u53EA\u5199 3/12\uFF0C\u518D\u7A84\u628A\u300C\u5168\u90E8\u5DF2\u5BA1\u9605\u300D\u6536\u8D77\u6765\uFF08\u9010\u4E2A\u52FE\u7167\u6837\u53EF\u4EE5\uFF09\u3002 */
.wt-diffstack {
  container: stack / inline-size;
}
.wt-seen {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 5px;
  padding: 0 4px;
  color: var(--wt-ink-2);
  font-size: 12px;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.wt-seen[data-done] {
  color: var(--wt-ok);
}
.wt-seenshort {
  display: none;
}
@container stack (max-width: 619px) {
  .wt-seenlong {
    display: none;
  }
  .wt-seenshort {
    display: inline;
  }
}
@container stack (max-width: 539px) {
  .wt-seenall {
    display: none;
  }
}
/* \u5DEE\u5F02\u533A\u5F88\u7A84\uFF08\u56FA\u5B9A\u6210\u4E24\u680F\u3001\u5DE6\u8FB9\u76EE\u5F55\u53C8\u5360\u53BB\u4E00\u680F\uFF09\uFF1A\u8FDB\u5EA6\u53EA\u7559\u73AF\uFF0C\u6570\u5B57\u5728\u60AC\u505C\u63D0\u793A\u548C\u6E05\u5355\u884C\u5C3E\u3002 */
@container stack (max-width: 409px) {
  .wt-seenlong,
  .wt-seenshort {
    display: none;
  }
}

/* ---------- \u300C\u672A\u63A8\u9001\u300D\u7684\u8303\u56F4\uFF1A\u548C\u4E0A\u6E38\u6BD4\u7684\u6539\u52A8 ---------- */
/* \u548C\u4E0A\u6E38\u6BD4\u65F6\u5DF2\u7ECF\u63D0\u4EA4\u7684\u6587\u4EF6\uFF1A\u5FBD\u6807\u5E26\u4E00\u70B9\u5E95\u8272\uFF0C\u548C\u300C\u5DF2\u6682\u5B58\u300D\u7684\u5B9E\u5FC3\u58A8\u8272\u533A\u5206\u5F00\u3002 */
.wt-badge[data-tone='commit'] {
  background: color-mix(in srgb, var(--wt-accent) 13%, transparent);
  color: var(--wt-accent);
}
/* \u8FD9\u4E2A\u8303\u56F4\u91CC\u5305\u542B\u7684\u63D0\u4EA4\uFF1A\u548C\u54EA\u4E2A\u4E0A\u6E38\u6BD4\u3001\u51E0\u4E2A\u63D0\u4EA4\uFF0C\u65B0\u7684\u5728\u524D\u3002 */
.wt-outgoing {
  flex: none;
  padding: 8px 20px 4px;
  color: var(--wt-ink-2);
  font-size: 12.5px;
}
.wt-outgoinghead {
  margin-bottom: 2px;
}
.wt-commits li {
  display: flex;
  gap: 8px;
  min-width: 0;
  min-height: 22px;
  white-space: nowrap;
}
.wt-commits time {
  flex: none;
  color: var(--wt-ink-3);
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}
.wt-outgoingmore {
  margin-left: 6px;
  color: var(--wt-ink-3);
  font-size: 12px;
}
@container detail (max-width: 559px) {
  .wt-outgoing {
    padding-right: 14px;
    padding-left: 14px;
  }
}
`;var Xn=t=>new URL(t,document.baseURI);async function Na(t,e){if(!t.ok)throw Error((await t.json().catch(()=>({}))).error||e(t.status));return t.json()}async function zt(t,e,n,r,o){let i=Xn(`api/worktree-desk/${t}`);return i.search=new URLSearchParams(e).toString(),Na(await fetch(i,{signal:n,cache:"no-store",...r?{method:"POST",headers:{"X-Worktree-Action":r,...o===void 0?{}:{"content-type":"application/json"}},...o===void 0?{}:{body:JSON.stringify(o)}}:{}}),d=>`\u8BFB\u53D6\u5931\u8D25\uFF08${d}\uFF09`)}async function Ar(t){let e=await fetch(Xn("open-in-app/apps"),{signal:t,cache:"no-store"}).catch(()=>null);return e?.ok?(await e.json().catch(()=>({}))).apps??[]:[]}async function Or(t,e){return!!(await fetch(Xn("open-in-app/open"),{method:"POST",cache:"no-store",headers:{"content-type":"application/json"},body:JSON.stringify({app:t,path:e})}).catch(()=>null))?.ok}var Sa=t=>typeof t?.id=="string"&&typeof t?.path=="string"&&typeof t?.name=="string"&&Array.isArray(t?.trees)&&t?.trees.every(e=>typeof e?.path=="string"),Ca=t=>typeof t?.time=="number"&&Array.isArray(t?.trees)&&t.trees.every(e=>typeof e?.path=="string"&&Array.isArray(e?.sessions));function $a(t,e){let n=[];for(let[o,i]of e)i.data&&n.push([o,i.data]);let r=JSON.stringify({v:1,catalog:t,repos:n});return r.length>4e6?null:r}function za(t){let e;try{e=JSON.parse(t)}catch{return null}let n=e?.v===1?e.catalog:null;if(!n||typeof n.time!="number"||!Array.isArray(n.repos)||!n.repos.every(Sa))return null;let r=new Set(n.repos.map(i=>i.id)),o=new Map;for(let i of Array.isArray(e.repos)?e.repos:[]){let[d,c]=Array.isArray(i)?i:[];r.has(d)&&Ca(c)&&o.set(d,{state:"ready",data:c})}return{catalog:n,details:o}}function Ir(t,e){let n=new Map;for(let r of e.repos){let o=t.get(r.id)?.data;o&&n.set(r.id,{state:"loading",data:o})}return n}var Jn="worktree-desk.cache",Ve=null,Dr=null,Ke={get features(){return Dr},set features(t){Dr=t},load(){if(Ve)return Ve;let t=null;try{t=localStorage.getItem(Jn)}catch{}return Ve=t?za(t):null,Ve},save(t){Ve=t;let e=$a(t.catalog,t.details);if(e)try{localStorage.setItem(Jn,e)}catch{}},clear(){Ve=null;try{localStorage.removeItem(Jn)}catch{}}};var w=Ht(require("react"),1);var M=Ht(require("react"),1),Lr={branch:M.default.createElement(M.default.Fragment,null,M.default.createElement("circle",{cx:"6",cy:"5",r:"2.3"}),M.default.createElement("circle",{cx:"6",cy:"19",r:"2.3"}),M.default.createElement("circle",{cx:"18",cy:"5",r:"2.3"}),M.default.createElement("path",{d:"M6 7.3v9.4m12-9.4c0 6-5.5 6.4-12 6.4"})),search:M.default.createElement(M.default.Fragment,null,M.default.createElement("circle",{cx:"10.5",cy:"10.5",r:"6"}),M.default.createElement("path",{d:"m15 15 4.5 4.5"})),refresh:M.default.createElement("path",{d:"M20 10a8 8 0 1 0-1 7M20 4v6h-6"}),chevron:M.default.createElement("path",{d:"m7 10 5 5 5-5"}),close:M.default.createElement("path",{d:"M6 6l12 12M18 6 6 18"}),check:M.default.createElement("path",{d:"m5 12.5 4.5 4.5L19 7.5"}),copy:M.default.createElement(M.default.Fragment,null,M.default.createElement("rect",{x:"8",y:"8",width:"11",height:"12",rx:"2"}),M.default.createElement("path",{d:"M15 8V4H4v11h4"})),external:M.default.createElement(M.default.Fragment,null,M.default.createElement("path",{d:"M13.5 5H19v5.5M19 5l-8.5 8.5"}),M.default.createElement("path",{d:"M19 14.5V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h3.5"})),folder:M.default.createElement("path",{d:"M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"}),terminal:M.default.createElement("path",{d:"M4 5.5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Zm3 4 3 3-3 3m5.5 0H17"}),code:M.default.createElement("path",{d:"m9 8-4 4 4 4m6-8 4 4-4 4"}),chat:M.default.createElement(M.default.Fragment,null,M.default.createElement("path",{d:"M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V16A1.5 1.5 0 0 1 4 14.5Z"}),M.default.createElement("path",{d:"M12 8.5v4M10 10.5h4"})),bubble:M.default.createElement("path",{d:"M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V16A1.5 1.5 0 0 1 4 14.5Z"}),more:M.default.createElement(M.default.Fragment,null,M.default.createElement("circle",{cx:"5.5",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"}),M.default.createElement("circle",{cx:"12",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"}),M.default.createElement("circle",{cx:"18.5",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"})),warning:M.default.createElement("path",{d:"M12 4.5 3 19h18ZM12 10v4m0 2.6v.1"}),broom:M.default.createElement(M.default.Fragment,null,M.default.createElement("path",{d:"m14 4 6 6"}),M.default.createElement("path",{d:"M20 10 12.5 17.5a3 3 0 0 1-2.1.9H5.5a1 1 0 0 1-1-1v-4.9c0-.8.3-1.6.9-2.1L13 3"}),M.default.createElement("path",{d:"m9 11 4 4"})),back:M.default.createElement("path",{d:"M19 12H5m6-6-6 6 6 6"}),columns:M.default.createElement("path",{d:"M4 5.5h16v13H4Zm8 0v13"}),rows:M.default.createElement("path",{d:"M4 5.5h16v13H4Zm0 6.5h16"}),wrap:M.default.createElement("path",{d:"M4 6h16M4 10.5h12a3 3 0 0 1 0 6h-3m2-2-2 2 2 2"}),help:M.default.createElement(M.default.Fragment,null,M.default.createElement("circle",{cx:"12",cy:"12",r:"8"}),M.default.createElement("path",{d:"M9.8 9.6a2.3 2.3 0 1 1 3.2 2.1c-.7.3-1 .8-1 1.6m0 2.6v.1"})),lock:M.default.createElement(M.default.Fragment,null,M.default.createElement("path",{d:"M6 11h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1Z"}),M.default.createElement("path",{d:"M9 11V8a3 3 0 0 1 6 0v3"})),sort:M.default.createElement("path",{d:"M8 17V7M5 10l3-3 3 3M16 7v10m-3-3 3 3 3-3"}),filter:M.default.createElement("path",{d:"M4 6h16l-6.5 7.5V19l-3-1.8v-3.7Z"}),file:M.default.createElement(M.default.Fragment,null,M.default.createElement("path",{d:"M7 3.5h7l5 5V19a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19V5A1.5 1.5 0 0 1 7.5 3.5Z"}),M.default.createElement("path",{d:"M14 3.5v5h5"})),review:M.default.createElement(M.default.Fragment,null,M.default.createElement("path",{d:"M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v8a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V16A1.5 1.5 0 0 1 4 14.5Z"}),M.default.createElement("path",{d:"m9 10.4 2 2 4-4.2"})),spark:M.default.createElement("path",{d:"M12 3.5c.6 4.6 2.4 6.9 7.5 8.5-5.1 1.6-6.9 3.9-7.5 8.5-.6-4.6-2.4-6.9-7.5-8.5 5.1-1.6 6.9-3.9 7.5-8.5Z"}),comment:M.default.createElement("path",{d:"M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3.5v-3.5h.5a2 2 0 0 1-2-2Z"}),left:M.default.createElement("path",{d:"m14 7-5 5 5 5"}),right:M.default.createElement("path",{d:"m10 7 5 5-5 5"}),unfold:M.default.createElement("path",{d:"m7 9 5-5 5 5m-10 6 5 5 5-5"}),fold:M.default.createElement("path",{d:"m7 4 5 5 5-5m-10 16 5-5 5 5"}),arrowUp:M.default.createElement("path",{d:"M12 19V5m-6 6 6-6 6 6"}),arrowDown:M.default.createElement("path",{d:"M12 5v14m-6-6 6 6 6-6"}),pin:M.default.createElement("path",{d:"M8.5 4h7l-1 6 2.5 2.2V14h-10v-1.8L9.5 10l-1-6ZM12 14v6.5"}),grip:M.default.createElement(M.default.Fragment,null,M.default.createElement("circle",{cx:"9",cy:"6",r:"1.2",fill:"currentColor",stroke:"none"}),M.default.createElement("circle",{cx:"15",cy:"6",r:"1.2",fill:"currentColor",stroke:"none"}),M.default.createElement("circle",{cx:"9",cy:"12",r:"1.2",fill:"currentColor",stroke:"none"}),M.default.createElement("circle",{cx:"15",cy:"12",r:"1.2",fill:"currentColor",stroke:"none"}),M.default.createElement("circle",{cx:"9",cy:"18",r:"1.2",fill:"currentColor",stroke:"none"}),M.default.createElement("circle",{cx:"15",cy:"18",r:"1.2",fill:"currentColor",stroke:"none"})),files:M.default.createElement("path",{d:"M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"}),collapse:M.default.createElement("path",{d:"m11 7-5 5 5 5m7-10-5 5 5 5"}),expand:M.default.createElement("path",{d:"m6 7 5 5-5 5m7-10 5 5-5 5"}),fetch:M.default.createElement("path",{d:"M12 3.5v10m-4-4 4 4 4-4M5 17.5h14M7.5 20.5h9"}),pull:M.default.createElement("path",{d:"M12 3.5v11m-4-4 4 4 4-4M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2"}),push:M.default.createElement("path",{d:"M12 15v-11m-4 4 4-4 4 4M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2"})};function z({name:t="branch",size:e=16,className:n=""}){return M.default.createElement("svg",{className:`wt-icon ${n}`,width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",style:{flex:"none"}},Lr[t]??Lr.branch)}var ft=Ht(require("react"),1);function Xt({text:t,className:e="",title:n}){return ft.default.createElement("span",{className:"wt-tail "+e,title:n},ft.default.createElement("span",{dir:"ltr"},t))}function zn(){let t=(0,ft.useRef)(null),[e,n]=(0,ft.useState)(0);return(0,ft.useLayoutEffect)(()=>{t.current&&n(t.current.clientWidth)},[]),(0,ft.useEffect)(()=>{let r=t.current;if(!r)return;let o=()=>n(r.clientWidth);o();let i=new ResizeObserver(o);return i.observe(r),()=>i.disconnect()},[]),[t,e]}var Pr=2*Math.PI*5.5;function Tn({share:t}){return ft.default.createElement("svg",{className:"wt-ring",viewBox:"0 0 14 14","aria-hidden":"true"},ft.default.createElement("circle",{className:"wt-ring-track",cx:"7",cy:"7",r:"5.5"}),ft.default.createElement("circle",{className:"wt-ring-fill",cx:"7",cy:"7",r:"5.5",strokeDasharray:`${Math.min(1,Math.max(0,t||0))*Pr} ${Pr}`}))}function Yn({value:t,label:e,act:n,title:r}){let[o,i]=ft.default.useState(!1);return ft.default.useEffect(()=>{if(!o)return;let d=setTimeout(()=>i(!1),1400);return()=>clearTimeout(d)},[o]),ft.default.createElement("button",{className:"wt-iconbtn",title:r??"\u590D\u5236","aria-label":r??"\u590D\u5236",onClick:async()=>{await n.copy(t,e,!0)&&i(!0)}},ft.default.createElement(z,{name:o?"check":"copy",size:14}))}var p=Ht(require("react"),1);var v=Ht(require("react"),1);var Hr=/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)$/,jr=/^@@@ -(\d+)(?:,(\d+))? (?:-\d+(?:,\d+)? )+\+(\d+)(?:,(\d+))? @@@(.*)$/;function Qn(t,e){let n={oldStart:Number(e[1]),oldCount:e[2]===void 0?1:Number(e[2]),newStart:Number(e[3]),newCount:e[4]===void 0?1:Number(e[4]),heading:e[5].trim(),lines:[]};return t.hunks.push(n),n}var Ta=["","0",void 0,"1",void 0,""];function Rn(t){let e=String(t??"").split(`
`);e.at(-1)===""&&e.pop();let n={from:null,to:null,oldMode:null,newMode:null,binary:!1,hunks:[],additions:0,deletions:0},r=null,o=null,i=0,d=0,c=!1;for(let l of e){if(!r){let u=jr.exec(l)||Hr.exec(l);if(u){c=u[0].startsWith("@@@"),r=Qn(n,u),i=r.oldStart,d=r.newStart,o=null;continue}if(l.startsWith("--- ")){n.from=l.slice(4).split("	")[0];continue}if(l.startsWith("+++ ")){n.to=l.slice(4).split("	")[0];continue}if(l.startsWith("old mode ")){n.oldMode=l.slice(9).trim();continue}if(l.startsWith("new mode ")){n.newMode=l.slice(9).trim();continue}if(/^(Binary files |GIT binary patch)/.test(l)){n.binary=!0;continue}if(!/^[ +-]/.test(l))continue;r=Qn(n,Ta),c=!1,i=0,d=1,o=null}if(l.startsWith("diff --git "))break;let b=l[0];if(b==="@"){let u=jr.exec(l)||Hr.exec(l);if(u){c=u[0].startsWith("@@@"),r=Qn(n,u),i=r.oldStart,d=r.newStart,o=null;continue}}if(b==="\\"){o&&(o.noNewline=!0);continue}let f=c?l[0]:b,g=f==="+"?"add":f==="-"?"del":"ctx",x={kind:g,text:l.slice(c?2:1),oldNo:null,newNo:null,noNewline:!1};g!=="add"&&(x.oldNo=i++),g!=="del"&&(x.newNo=d++),g==="add"?n.additions++:g==="del"&&n.deletions++,r.lines.push(x),o=x}return n}function Mn(t){let e=[],n=[],r=()=>{let o=n.filter(c=>c.kind==="del"),i=n.filter(c=>c.kind==="add"),d=Math.min(o.length,i.length);for(let c=0;c<d;c++)e.push({kind:"change",left:o[c],right:i[c]});for(let c=d;c<o.length;c++)e.push({kind:"del",left:o[c],right:null});for(let c=d;c<i.length;c++)e.push({kind:"add",left:null,right:i[c]});n.length=0};for(let o of t.lines)o.kind==="ctx"?(r(),e.push({kind:"ctx",left:o,right:o})):n.push(o);return r(),e}var Ma=/\s+|[\w\u0080-\uffff]+|[^\s\w\u0080-\uffff]/gu,Ea=16e4;function Fr(t){let e=[];for(let n of t.matchAll(Ma))e.push([n.index,n.index+n[0].length]);return e}function qr(t,e){let n=Fr(t),r=Fr(e),o=n.map(([u,$])=>t.slice(u,$)),i=r.map(([u,$])=>e.slice(u,$)),d=0;for(;d<o.length&&d<i.length&&o[d]===i[d];)d++;let c=o.length,l=i.length;for(;c>d&&l>d&&o[c-1]===i[l-1];)c--,l--;let b=new Uint8Array(o.length),f=new Uint8Array(i.length),g=c-d,x=l-d;if(g&&x&&g*x>Ea)b.fill(1,d,c),f.fill(1,d,l);else if(g&&x){let u=new Uint16Array((g+1)*(x+1)),$=(S,O)=>S*(x+1)+O;for(let S=g-1;S>=0;S--)for(let O=x-1;O>=0;O--)u[$(S,O)]=o[d+S]===i[d+O]?u[$(S+1,O+1)]+1:Math.max(u[$(S+1,O)],u[$(S,O+1)]);let y=0,N=0;for(;y<g&&N<x;)o[d+y]===i[d+N]?(y++,N++):u[$(y+1,N)]>=u[$(y,N+1)]?b[d+y++]=1:f[d+N++]=1;for(;y<g;)b[d+y++]=1;for(;N<x;)f[d+N++]=1}else{for(let u=d;u<c;u++)b[u]=1;for(let u=d;u<l;u++)f[u]=1}return[Br(b,n,t),Br(f,r,e)]}function Br(t,e,n){let r=[];for(let o=0;o<e.length;o++){if(t[o]!==1)continue;let[i,d]=e[o],c=r.at(-1);!!c&&(c[1]===i||/^\s+$/.test(n.slice(i,d))||/^\s+$/.test(n.slice(c[1],i)))?r[r.length-1]=[c[0],d]:r.push([i,d])}return r.flatMap(([o,i])=>{let d=/^\s*/.exec(n.slice(o,i))[0].length,c=/\s*$/.exec(n.slice(o,i))[0].length;return o+d<i-c?[[o+d,i-c]]:[]})}function re(t){let e=t.status;return t.prunable?{key:"stale",rank:8,tone:"muted",label:"\u767B\u8BB0\u5931\u6548"}:e?.conflicts?{key:"conflict",rank:0,tone:"danger",label:`${e.conflicts} \u4E2A\u51B2\u7A81`}:t.operations?.length?{key:"operation",rank:1,tone:"danger",label:t.operations.join(" \xB7 ")}:t.error?{key:"error",rank:2,tone:"danger",label:t.limited?"\u672A\u68C0\u67E5\u6587\u4EF6":"\u8BFB\u53D6\u5931\u8D25"}:e?.total?{key:"dirty",rank:3,tone:"warn",label:`${e.total} \u9879\u6539\u52A8`}:e?.ahead>0?{key:"ahead",rank:4,tone:"accent",label:`${e.ahead} \u4E2A\u63D0\u4EA4\u672A\u63A8\u9001`}:e?.behind>0?{key:"behind",rank:5,tone:"muted",label:`\u843D\u540E ${e.behind} \u4E2A\u63D0\u4EA4`}:e?{key:"clean",rank:7,tone:"clean",label:"\u5E72\u51C0"}:{key:"unknown",rank:6,tone:"muted",label:"\u65E0\u6587\u4EF6\u72B6\u6001"}}var er=["Codex","ZCode","DSH"];var En=t=>{let{tone:e}=re(t);return e==="muted"||e==="clean"?null:e};function _r(t){let e=0;for(let n of t.sessions??[])!n.archived&&n.time>e&&(e=n.time);return e}function Vr(t,e,n=!0){if(n){let r=re(t).rank-re(e).rank;if(r)return r;let o=_r(e)-_r(t);if(o)return o}return(e.lastChange?.time??-1/0)-(t.lastChange?.time??-1/0)||t.path.localeCompare(e.path)}var ne={all:["\u5168\u90E8",()=>!0],dirty:["\u6709\u6539\u52A8",t=>t.status?.total>0],unpushed:["\u6709\u672A\u63A8\u9001",t=>t.status?.ahead>0],behind:["\u843D\u540E\u4E0A\u6E38",t=>t.status?.behind>0],trouble:["\u5F02\u5E38",t=>re(t).rank<=2],reviewed:["\u5BA1\u67E5\u8FC7",(t,e)=>!!e?.reviewed?.(e.repo,t)],stale:["\u5931\u6548\u767B\u8BB0",t=>!!t.prunable]};function An(t){let e={dirty:0,unpushed:0,behind:0,trouble:0,stale:0};for(let n of t)ne.dirty[1](n)&&e.dirty++,ne.unpushed[1](n)&&e.unpushed++,ne.behind[1](n)&&e.behind++,ne.trouble[1](n)&&e.trouble++,ne.stale[1](n)&&e.stale++;return e}function Ce(t){return t.bare?"\u88F8\u4ED3\u5E93":t.branch?t.branch:t.head?.slice(0,8)||"\u5206\u652F\u672A\u77E5"}function Kr(t){let e=String(t??""),n=e.indexOf("/");return n<1?[null,e]:[e.slice(0,n+1),e.slice(n+1)]}function gt(t,e=Date.now()){if(!Number.isFinite(t))return"\u65F6\u95F4\u672A\u77E5";let n=e-t,r=new Date(t),o=r.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1});if(n<60*1e3)return"\u521A\u521A";if(n<3600*1e3)return`${Math.floor(n/6e4)} \u5206\u949F\u524D`;if(n<720*60*1e3)return`${Math.floor(n/36e5)} \u5C0F\u65F6\u524D`;let i=r.toLocaleDateString("zh-CN",{month:"numeric",day:"numeric"});return n<10080*60*1e3?`${i} ${o}`:r.getFullYear()===new Date(e).getFullYear()?i:r.toLocaleDateString("zh-CN",{year:"numeric",month:"numeric",day:"numeric"})}function Et(t){return Number.isFinite(t)?new Date(t).toLocaleString("zh-CN",{hour12:!1}):"\u65F6\u95F4\u672A\u77E5"}var tr=t=>(t||"").toLocaleLowerCase();function he(t,...e){let n=tr(t).trim().split(/\s+/).filter(Boolean);if(!n.length)return!0;let r=tr(e.filter(Boolean).join(`
`));return n.every(o=>r.includes(o))}var On=(t,e)=>e&&t===e?"~":t.startsWith(e+"/")?"~/"+t.slice(e.length+1):t;function Zr(t){let e={files:[],dirs:new Map};for(let i of t){let d=i.path.split("/"),c=e;for(let l of d.slice(0,-1))c.dirs.has(l)||c.dirs.set(l,{files:[],dirs:new Map}),c=c.dirs.get(l);c.files.push(i)}let n=(i,d)=>i.path.localeCompare(d.path);function r(i,d){if(d&&!i.files.length&&i.dirs.size===1){let[f,g]=[...i.dirs][0];return r(g,d+f+"/")}let c=[...i.dirs].sort(([f],[g])=>f.localeCompare(g)).map(([f,g])=>r(g,f+"/")),l=[...i.files].sort(n),b=l.length+c.reduce((f,g)=>f+g.count,0);return{name:d,dirs:c,files:l,count:b}}let o=r(e,"");return{dirs:o.dirs,files:o.files,count:o.count}}var Aa={A:"\u65B0\u589E",M:"\u4FEE\u6539",D:"\u5220\u9664",R:"\u91CD\u547D\u540D",C:"\u590D\u5236",T:"\u7C7B\u578B\u53D8\u5316"},me=t=>Aa[t]||t;function Ze(t){if(t.conflict)return{code:"U",text:"\u51B2\u7A81",detail:"\u5408\u5E76\u51B2\u7A81\uFF0C\u5C1A\u672A\u89E3\u51B3",staged:!1,unstaged:!1,tone:"danger"};if(t.xy==="??")return{code:"?",text:"\u672A\u8DDF\u8E2A",detail:"\u65B0\u6587\u4EF6\uFF0C\u5C1A\u672A\u52A0\u5165 Git",staged:!1,unstaged:!1,tone:"untracked"};if(t.st){let l=t.from?`\uFF08\u539F ${t.from}\uFF09`:"";return{code:t.st,text:t.dirty?"\u5DF2\u63D0\u4EA4\uFF0C\u53C8\u6709\u6539\u52A8":`${me(t.st)}\uFF0C\u5DF2\u63D0\u4EA4`,detail:t.dirty?`${me(t.st)}${l}\uFF0C\u5DF2\u63D0\u4EA4\uFF1B\u4E4B\u540E\u5DE5\u4F5C\u76EE\u5F55\u91CC\u53C8\u6709\u6539\u52A8\uFF0C\u90FD\u8FD8\u6CA1\u63A8\u9001`:`${me(t.st)}${l}\uFF0C\u5DF2\u63D0\u4EA4\uFF0C\u8FD8\u6CA1\u63A8\u9001`,staged:!1,unstaged:!1,outgoing:!0,tone:"commit"}}let[e,n]=t.xy,r=e!==".",o=n!==".",i=t.from?`\uFF08\u539F ${t.from}\uFF09`:"",d,c;return r&&o?(d="\u5DF2\u6682\u5B58\uFF0C\u53C8\u6709\u6539\u52A8",c=`${me(e)}\u5DF2\u6682\u5B58${i}\uFF1B\u4E4B\u540E\u53C8${me(n)}\uFF0C\u672A\u6682\u5B58`):r?(d="\u5DF2\u6682\u5B58",c=`${me(e)}${i}\uFF0C\u5DF2\u6682\u5B58`):(d=me(n)+i,c=`${me(n)}${i}\uFF0C\u672A\u6682\u5B58`),{code:r&&o?e+n:r?e:n,text:d,detail:c,staged:r,unstaged:o,tone:r?"staged":"unstaged"}}var Oa={all:["\u5168\u90E8",()=>!0],unstaged:["\u672A\u6682\u5B58",t=>Ze(t).unstaged],staged:["\u5DF2\u6682\u5B58",t=>Ze(t).staged],untracked:["\u672A\u8DDF\u8E2A",t=>t.xy==="??"]},Da={all:["\u5168\u90E8",()=>!0],committed:["\u5DF2\u63D0\u4EA4",t=>!!t.st&&!t.dirty],touched:["\u53C8\u6709\u6539\u52A8",t=>!!t.dirty],untracked:["\u672A\u8DDF\u8E2A",t=>t.xy==="??"]},Gr=t=>t==="outgoing"?Da:Oa,Ur={uncommitted:"\u672A\u63D0\u4EA4",outgoing:"\u672A\u63A8\u9001"},$e=["uncommitted","outgoing"],Vt=(t,e)=>e==="outgoing"?t.status?.outgoing?.files??null:t.status?.files??null,le=(t,e)=>e==="outgoing"?t.status?.outgoing?.total??0:t.status?.total??0,Xr=(t,e="uncommitted")=>{let n=t?.status;return!n||t.error?!1:e==="outgoing"?!n.outgoing:!(n.total>0)},ln=t=>le(t,"uncommitted")>0?"uncommitted":le(t,"outgoing")>0?"outgoing":"uncommitted";function Jr(t){if(t.prunable)return[{key:"stale"}];let e=t.status,n=[];e?.ahead>0&&n.push({key:"ahead",count:e.ahead}),e?.behind>0&&n.push({key:"behind",count:e.behind});let{key:r,rank:o}=re(t);return r==="dirty"?n.push({key:"dirty",count:e.total}):o<=2?n.push({key:"trouble"}):r==="unknown"&&n.push({key:"unknown"}),n}function Yr(t,e){let n=t.status;return e==="stale"?nr(t)||"Git \u4ECD\u4FDD\u7559\u8BE5\u5DE5\u4F5C\u6811\u767B\u8BB0\uFF0C\u4F46\u76EE\u5F55\u5DF2\u4E0D\u5B58\u5728":e==="dirty"?`${n.total} \u9879\u6539\u52A8\uFF1A\u5DF2\u6682\u5B58 ${n.staged} \xB7 \u672A\u6682\u5B58 ${n.unstaged} \xB7 \u672A\u8DDF\u8E2A ${n.untracked}`:e==="ahead"?`${n.ahead} \u4E2A\u63D0\u4EA4\u672A\u63A8\u9001\uFF08\u8DDF\u8E2A ${n.upstream}\uFF0C\u6309\u672C\u5730\u8BB0\u5F55\uFF0C\u4E0D\u8054\u7F51\u66F4\u65B0\uFF09`:e==="behind"?`\u843D\u540E\u4E0A\u6E38 ${n.behind} \u4E2A\u63D0\u4EA4\uFF08\u8DDF\u8E2A ${n.upstream}\uFF0C\u6309\u672C\u5730\u8BB0\u5F55\uFF0C\u4E0D\u8054\u7F51\u66F4\u65B0\uFF09`:re(t).label}var Wr=["#3b82f6","#6366f1","#a855f7","#d946ef","#ec4899","#0d9488","#0891b2","#7c8db5"];function Qr(t){let e=String(t??""),n=/(?<![A-Za-z])([A-Za-z]{1,10})-(\d{2,7})(?!\d)/.exec(e),r=n?n[2]:/(?<!\d)(\d{4,6})(?!\d)/.exec(e)?.[1];if(!r)return null;let o=Number(r);return{key:n?`${n[1].toUpperCase()}-${r}`:r,color:Wr[o%Wr.length]}}var Ia=[["gitdir file points to non-existent location","\u5DE5\u4F5C\u6811\u7684 .git \u6587\u4EF6\u6307\u5411\u7684 Git \u76EE\u5F55\u5DF2\u4E0D\u5B58\u5728"],[".git points to non-existent location",".git \u6307\u5411\u7684 Git \u76EE\u5F55\u5DF2\u4E0D\u5B58\u5728"],["gitdir file does not exist","\u5DE5\u4F5C\u6811\u76EE\u5F55\u91CC\u6CA1\u6709 .git \u6587\u4EF6"],["not a valid directory","\u767B\u8BB0\u7684\u8DEF\u5F84\u4E0D\u662F\u4E00\u4E2A\u76EE\u5F55"],["unable to read gitdir file","\u8BFB\u4E0D\u5230\u5DE5\u4F5C\u6811\u7684 .git \u6587\u4EF6"],[".git is not a file",".git \u4E0D\u662F\u6587\u4EF6"]];function nr(t){let e=t.prunableReason||"";return Ia.find(([n])=>e.includes(n))?.[1]??e}function Rr(t,e,n="\u5168\u90E8\u4ED3\u5E93"){let r=({id:o,name:i,path:d,count:c})=>({id:o,name:i,path:d,count:c});return tr(e).trim()?t.filter(o=>he(e,o.name,o.path,...o.groups??[])).map(r):[{id:"all",name:n},...t.map(r)]}function Dn(t){return t?.length===1&&t[0].main&&!t[0].prunable&&!t[0].error&&!t[0].operations?.length&&re(t[0]).key==="clean"&&!t[0].tools?.length}function to(t,e){let n=o=>Math.min(...o.live.map(i=>re(i).rank),99),r=o=>Math.max(...o.live.map(i=>i.lastChange?.time??0),0);return[...t].sort((o,i)=>(e==="attention"?n(o)-n(i):0)||r(i)-r(o)||o.repo.name.localeCompare(i.repo.name))}var La="worktree-desk-review",Pa=80,eo=t=>{let e=5381;for(let n=0;n<t.length;n++)e=(e<<5)+e+t.charCodeAt(n)|0;return(e>>>0).toString(16).padStart(8,"0")};function Ge(t,e="uncommitted"){if(e!=="outgoing"){let i=(t?.status?.files??[]).map(d=>`${d.xy}\0${d.path}\0${d.from??""}\0${d.add??""}\0${d.del??""}\0${d.lines??""}`).sort().join(`
`)+`
#${t?.status?.total??0}`;return eo(i)}let n=t?.status?.outgoing;if(!n)return"";let r=(n.files??[]).map(o=>`${o.st??o.xy}\0${o.path}\0${o.from??""}\0${o.add??""}\0${o.del??""}\0${o.lines??""}\0${o.mtime??""}`).sort().join(`
`)+`
${n.base}
#${n.total}`;return"o"+eo(r)}var ze=t=>"`"+t+"`",Ha={uncommitted:"\u5C1A\u672A\u63D0\u4EA4\u7684\u6539\u52A8",outgoing:"\u8FD8\u6CA1\u63A8\u5230\u8FDC\u7AEF\u7684\u6539\u52A8\uFF08\u672A\u63A8\u9001\u7684\u63D0\u4EA4\uFF0C\u52A0\u4E0A\u8FD8\u6CA1\u63D0\u4EA4\u7684\uFF09"};function dn(t="uncommitted"){return`${t==="outgoing"?"\u8BF7\u5BF9\u8FD9\u4E2A\u5DE5\u4F5C\u6811\u91CC\u8FD8\u6CA1\u63A8\u5230\u8FDC\u7AEF\u7684\u6539\u52A8\u505A\u4E00\u6B21\u4EE3\u7801\u5BA1\u67E5\uFF1A\u672A\u63A8\u9001\u7684\u63D0\u4EA4\uFF0C\u52A0\u4E0A\u8FD8\u6CA1\u63D0\u4EA4\u7684\u6539\u52A8\u3002":"\u8BF7\u5BF9\u8FD9\u4E2A\u5DE5\u4F5C\u6811\u91CC\u5C1A\u672A\u63D0\u4EA4\u7684\u6539\u52A8\u505A\u4E00\u6B21\u4EE3\u7801\u5BA1\u67E5\u3002"}
\u53EA\u5217\u8981\u52A8\u624B\u7684\u7ED3\u8BBA\uFF1A\u5FC5\u987B\u5904\u7406\u7684\u95EE\u9898\uFF0C\u548C\u5EFA\u8BAE\u3002\u91CD\u70B9\u627E\u903B\u8F91\u9519\u8BEF\u3001\u8FB9\u754C\u60C5\u51B5\u3001\u9519\u8BEF\u5904\u7406\u3001\u5B89\u5168\u9690\u60A3\u3001\u6027\u80FD\u95EE\u9898\u3001\u6D4B\u8BD5\u7F3A\u53E3\uFF0C\u4EE5\u53CA\u548C\u6539\u52A8\u610F\u56FE\u4E0D\u7B26\u7684\u5730\u65B9\u3002
\u4E0D\u786E\u5B9A\u7684\u5199\u6210\u7591\u95EE\uFF0C\u4E0D\u8981\u731C\uFF1B\u548C\u8FD9\u6B21\u6539\u52A8\u65E0\u5173\u7684\u65E7\u95EE\u9898\u4E0D\u5199\u3002`}function ro(t,e,n="uncommitted",r=null){let o=t?.status,i=n==="outgoing"?o?.outgoing:null,d=(i?i.files:o?.files)??[],c=i?i.total:o?.total??0,l=d.slice(0,Pa).map(y=>{let N=Ze(y),S=y.xy==="??"?y.lines!=null?`  +${y.lines}`:"":y.add!=null?`  +${y.add} \u2212${y.del}`:"";return`- [${N.text}] ${y.path}${y.from?`\uFF08\u539F ${y.from}\uFF09`:""}${S}`}),b=c>d.length?`
\uFF08\u5171 ${c} \u4E2A\u6587\u4EF6\uFF0C\u4E0A\u9762\u53EA\u5217\u51FA\u524D ${d.length} \u4E2A\uFF0C\u5176\u4F59\u8BF7\u7528 ${ze(i?`git diff --name-only ${i.base}`:"git status --short")} \u67E5\u770B\uFF09`:"",f=i?.base??"",g=i?`git diff ${f}`:"git diff HEAD",x=i?`- \u6BD4\u8F83\u57FA\u51C6\u662F\u4E0A\u6E38 ${ze(i.ref)}\uFF08\u63D0\u4EA4 ${f}\uFF09\uFF0C\u6709 ${o?.ahead??0} \u4E2A\u63D0\u4EA4\u8FD8\u6CA1\u63A8\u9001\u3002
- \u548C\u57FA\u51C6\u76F8\u6BD4\u5171\u6539\u4E86 ${c} \u4E2A\u6587\u4EF6\uFF1A\u5DF2\u7ECF\u63D0\u4EA4\u7684\u548C\u8FD8\u6CA1\u63D0\u4EA4\u7684\uFF08\u5DF2\u6682\u5B58\u3001\u672A\u6682\u5B58\u3001\u672A\u8DDF\u8E2A\uFF09\u90FD\u7B97\u3002`:`- \u672A\u63D0\u4EA4\u7684\u6539\u52A8\u5171 ${c} \u4E2A\u6587\u4EF6\uFF1A\u5DF2\u6682\u5B58\u3001\u672A\u6682\u5B58\u3001\u672A\u8DDF\u8E2A\u7684\u65B0\u6587\u4EF6\u90FD\u7B97\u3002`,u={verdict:"warn",summary:"\u6574\u4F53\u601D\u8DEF\u6E05\u695A\uFF1B\u5BFC\u5165\u5931\u8D25\u7684\u60C5\u51B5\u9700\u8981\u5904\u7406\uFF0C\u53E6\u6709\u4E00\u5904\u53EF\u4EE5\u7B80\u5316\u3002",stamp:e,notes:[{file:"src/import.ts",hunk:2,side:"new",line:40,quote:"return JSON.parse(text)",level:"fix",title:"\u6CA1\u6709\u5904\u7406\u89E3\u6790\u5931\u8D25",body:"text \u4E0D\u662F\u5408\u6CD5 JSON \u65F6\u4F1A\u76F4\u63A5\u629B\u51FA\uFF0C\u8C03\u7528\u65B9\u62FF\u4E0D\u5230\u4EFB\u4F55\u63D0\u793A\u3002\u5EFA\u8BAE\u6355\u83B7\u540E\u8FD4\u56DE\u660E\u786E\u7684\u9519\u8BEF\u3002"},{file:"src/import.ts",hunk:2,side:"old",line:31,quote:"const text = await read(path)",level:"warn",title:"\u65E7\u5B9E\u73B0\u91CC\u7684\u8BFB\u53D6\u6CA1\u6709\u91CA\u653E",body:"\u8FD9\u4E00\u884C\u88AB\u5220\u6389\u4E86\uFF0C\u4F46\u65B0\u5B9E\u73B0\u540C\u6837\u6CA1\u6709\u5173\u95ED\u6587\u4EF6\u53E5\u67C4\uFF0C\u786E\u8BA4\u662F\u5426\u9700\u8981 finally\u3002"}]};return`${typeof r=="string"&&r.trim()?r.trim():dn(n)}

## \u8303\u56F4
- \u5206\u652F\uFF1A${t.branch||"\uFF08\u5206\u79BB HEAD\uFF09"}\uFF08HEAD ${(t.head||"").slice(0,10)}\uFF09
${x}
${l.join(`
`)}${b}

## \u505A\u6CD5
1. \u7528 ${ze("git status --short")} \u548C ${ze(`${g} --`)} \u770B\u5168\u6539\u52A8\uFF1B\u672A\u8DDF\u8E2A\u7684\u65B0\u6587\u4EF6\u5728 diff \u91CC\u6CA1\u6709\uFF0C\u8981\u76F4\u63A5\u8BFB\u6587\u4EF6\u3002\u9700\u8981\u65F6\u8BFB\u4E0A\u4E0B\u6587\u3002
2. \u9010\u4E2A\u6587\u4EF6\u3001\u9010\u4E2A\u6539\u52A8\u5757\u5730\u770B\u3002${ze(g)} \u91CC\u6BCF\u4E2A @@ \u5757\u662F\u4E00\u4E2A\u6539\u52A8\u5757\uFF0C\u5728\u540C\u4E00\u4E2A\u6587\u4EF6\u91CC\u6309\u4ECE\u4E0A\u5230\u4E0B\u7684\u987A\u5E8F\u4ECE 1 \u5F00\u59CB\u7F16\u53F7\u3002

## \u7EA6\u675F
\u8FD9\u662F\u4E00\u6B21\u53EA\u8BFB\u5BA1\u67E5\uFF1A\u4E0D\u8981\u4FEE\u6539\u3001\u683C\u5F0F\u5316\u6216\u63D0\u4EA4\u4EFB\u4F55\u6587\u4EF6\uFF0C\u4E0D\u8981\u5207\u6362\u5206\u652F\uFF0C\u4E0D\u8981\u6267\u884C\u4F1A\u6539\u52A8\u4ED3\u5E93\u6216\u6587\u4EF6\u7684\u547D\u4EE4\u3002

## \u8F93\u51FA
\u5148\u7528\u51E0\u53E5\u8BDD\u7ED9\u51FA\u603B\u4F53\u7ED3\u8BBA\u3002\u7136\u540E\u5728\u56DE\u590D\u7684\u6700\u672B\u5C3E\u7ED9\u51FA\u4E00\u4E2A\u4EE3\u7801\u5757\uFF0C\u8BED\u8A00\u6807\u8BB0\u5199 ${ze("worktree-review")}\uFF0C\u5185\u5BB9\u662F\u4E25\u683C\u7684 JSON\uFF08\u4E0D\u5E26\u6CE8\u91CA\uFF0C\u4E0D\u5E26\u591A\u4F59\u7684\u9017\u53F7\uFF09\u3002\u7ED3\u6784\u5982\u4E0B\uFF08\u5185\u5BB9\u662F\u793A\u4F8B\uFF0C\u6362\u6210\u4F60\u7684\u5B9E\u9645\u7ED3\u8BBA\uFF09\uFF1A

\`\`\`json
${JSON.stringify(u,null,2)}
\`\`\`

\u8981\u6C42\uFF1A
- notes \u53EA\u5217\u6709\u95EE\u9898\u7684\u6539\u52A8\uFF0C\u6309\u6587\u4EF6\u3001\u6309\u884C\u53F7\u4ECE\u4E0A\u5230\u4E0B\u6392\u5217\uFF1B\u6CA1\u6709\u95EE\u9898\u5C31\u7ED9\u7A7A\u6570\u7EC4 ${ze("[]")}\u3002
- warn \u662F\u5EFA\u8BAE\u6216\u7591\u95EE\uFF0Cfix \u662F\u5FC5\u987B\u5904\u7406\u7684\u95EE\u9898\u3002
- verdict\uFF1A\u6CA1\u6709\u95EE\u9898\u662F pass\uFF0C\u53EA\u6709\u5EFA\u8BAE\u6216\u7591\u95EE\u662F warn\uFF0C\u6709\u5FC5\u987B\u5904\u7406\u7684\u95EE\u9898\u662F fail\u3002
- line \u662F\u8FD9\u4E00\u884C\u5728\u6539\u52A8\u4E4B\u540E\u90A3\u4E2A\u6587\u4EF6\u91CC\u7684\u884C\u53F7\uFF1Bquote \u539F\u6837\u590D\u5236\u8FD9\u4E00\u884C\u91CC\u7684\u4E00\u6BB5\u6587\u5B57\uFF08\u4E0D\u8981\u6539\u5199\u3001\u4E0D\u8981\u7701\u7565\u4E2D\u95F4\uFF09\uFF0C\u7528\u6765\u5BF9\u9F50\u3002\u88AB\u5220\u9664\u7684\u884C side \u586B old\u3001line \u586B\u6539\u52A8\u4E4B\u524D\u7684\u884C\u53F7\u3002
- stamp \u539F\u6837\u586B\uFF1A${e}
- \u5168\u90E8\u7528\u4E2D\u6587\uFF0Ctitle \u548C body \u5199\u7ED9\u6539\u4EE3\u7801\u7684\u4EBA\u770B\uFF0C\u76F4\u63A5\u8BF4\u7ED3\u8BBA\u3002

\uFF08\u7531\u5DE5\u4F5C\u6811\u9762\u677F\u53D1\u8D77\u7684\u4EE3\u7801\u5BA1\u67E5\uFF1A${La}\uFF09`}var rr={left:t=>t.oldNo,right:t=>t.newNo};function ja(t,e){let n=e?.hunks??[];if(!n.length)return{hunk:null,row:null,side:t.side==="old"?"left":"right"};let r=t.hunk>=1&&t.hunk<=n.length?t.hunk-1:-1,o=[...[r].filter(l=>l>=0),...n.map((l,b)=>b).filter(l=>l!==r)],i=n.map(l=>Mn(l)),d=t.side==="old"?["left","right"]:["right","left"],c=(l,b,f)=>({hunk:l,row:b,side:f,exact:!0});if(t.quote){let l=null;for(let b of o)i[b].forEach((f,g)=>{for(let x of d){let u=f[x];if(!u?.text.includes(t.quote))continue;let $=t.line?Math.abs(rr[x](u)-t.line):0;(!l||$<l.gap)&&(l={hunk:b,row:g,side:x,gap:$})}});if(l)return c(l.hunk,l.row,l.side)}if(t.line){for(let l of d)for(let b of o){let f=i[b].findIndex(g=>rr[l](g[l]??{})===t.line);if(f>=0)return c(b,f,l)}for(let l of d){let b=null;for(let f of o)i[f].forEach((g,x)=>{let u=rr[l](g[l]??{});if(!u)return;let $=Math.abs(u-t.line);(!b||$<b.gap)&&(b={hunk:f,row:x,side:l,gap:$})});if(b)return{...b,exact:!1}}}return{hunk:o[0],row:null,side:d[0],exact:!1}}function oo(t,e){let n=new Map,r=d=>(n.has(d)||n.set(d,new Map),n.get(d)),o=(t??[]).map((d,c)=>{let l=e?ja(d,e):{hunk:null,row:null,side:"right"};return{note:d,i:c,...l}});for(let d of o)if(d.hunk!==null)if(d.row===null){let c=r(d.hunk);c.has(-1)||c.set(-1,[]),c.get(-1).push(d)}else{let c=r(d.hunk);c.has(d.row)||c.set(d.row,[]),c.get(d.row).push(d)}let i=o.filter(d=>d.hunk===null);return{placed:o,byHunk:n,loose:i}}var ao=t=>t.filter(e=>e.row!==null).map(e=>({...e,index:e.hunk*1e6+e.row})).sort((e,n)=>e.index-n.index),no=t=>String(t??"").replace(/\\/g,"/").replace(/^\.\//,"");function io(t,e){let n=new Map,r=(e??[]).map(i=>[i,no(i.path)]),o=[];for(let i of t??[]){let d=no(i.file),c=r.find(([,l])=>l===d);if(!c){let l=r.filter(([,b])=>b.slice(b.lastIndexOf("/")+1)===d);l.length===1&&(c=l[0])}if(!c){o.push(i);continue}n.has(c[0].id)||n.set(c[0].id,[]),n.get(c[0].id).push({...i,file:c[1]})}return{byFile:n,loose:o}}function so(t,e={}){let{skip:n,branch:r,head:o,scope:i="uncommitted",ref:d,at:c}=e,l=[],b=0;for(let $ of t??[])n?.has($.file)?b+=1:l.push($);if(!l.length)return{text:"",count:0,skipped:b};let f={fix:"\u5FC5\u987B\u5904\u7406",warn:"\u5EFA\u8BAE"},g=["fix","warn"].flatMap($=>l.map((y,N)=>({note:y,index:N})).filter(({note:y})=>y.level===$)),x=["\u8BF7\u5904\u7406\u4E0B\u9762\u7684\u4EE3\u7801\u5BA1\u67E5\u7ED3\u8BBA\uFF1A\u9010\u6761\u5224\u65AD\uFF0C\u8BE5\u6539\u7684\u5C31\u6539\uFF0C\u4E0D\u8BA4\u540C\u7684\u8BF4\u660E\u7406\u7531\u3002","",`- \u5206\u652F\uFF1A${r||"\uFF08\u5206\u79BB HEAD\uFF09"}${o?`\uFF08\u5BA1\u67E5\u65F6\u7684\u63D0\u4EA4 ${o.slice(0,10)}\uFF09`:""}`,`- \u8303\u56F4\uFF1A${Ha[i]}${d?`\uFF0C\u548C\u4E0A\u6E38 ${d} \u6BD4`:""}`,`- \u5BA1\u67E5\u65F6\u95F4\uFF1A${Et(c)}`],u=null;return g.forEach(({note:$},y)=>{if($.level!==u){u=$.level;let O=l.filter(E=>E.level===u).length;x.push("",`## ${f[u]}\uFF08${O}\uFF09`)}let N=$.side==="old"?"\u65E7":"",S=$.line?` \xB7 ${N}\u7B2C ${$.line} \u884C`:$.hunk?` \xB7 \u7B2C ${$.hunk} \u5757`:"";x.push("",`### ${y+1}. ${$.file}${S}`),x.push($.title||f[u]),$.body&&$.body!==$.title&&x.push("",$.body)}),b&&x.push("",`\uFF08\u53E6\u6709 ${b} \u6761\u7ED3\u8BBA\u6240\u5728\u7684\u6587\u4EF6\u4F60\u5DF2\u7ECF\u5BA1\u9605\u8FC7\uFF0C\u6CA1\u6709\u5217\u8FDB\u6765\u3002\uFF09`),{text:x.join(`
`)+`
`,count:l.length,skipped:b}}var ge={info:["\u8BF4\u660E","info"],warn:["\u5EFA\u8BAE","warn"],fix:["\u5FC5\u987B\u5904\u7406","danger"]};var Ue=t=>(t??[]).filter(e=>e.level==="fix"||e.level==="warn");function lo(t){if(!t)return t;let e=Ue(t.notes);return e.length===t.notes.length?t:{...t,notes:e,verdict:e.length?t.verdict:"pass"}}var In={pass:["\u5BA1\u67E5\u901A\u8FC7","ok"],warn:["\u6709\u4FEE\u6539\u5EFA\u8BAE","warn"],fail:["\u6709\u9700\u8981\u5904\u7406\u7684\u95EE\u9898","danger"]};var Fa=[];function Ba(t){if(t.st)return[["outgoing","\u672A\u63A8\u9001"]];if(t.xy==="??")return[["new","\u65B0\u6587\u4EF6"]];if(t.conflict)return[["work","\u51B2\u7A81"]];let e=[];return t.xy[0]!=="."&&e.push(["index","\u5DF2\u6682\u5B58"]),t.xy[1]!=="."&&e.push(["work","\u672A\u6682\u5B58"]),e}var qa={new:"\u65B0\u6587\u4EF6\uFF1A\u8FD8\u6CA1\u52A0\u8FDB Git\uFF0C\u770B\u7684\u662F\u5DE5\u4F5C\u76EE\u5F55\u91CC\u7684\u5185\u5BB9",work:"\u672A\u6682\u5B58\uFF1A\u6BD4\u8F83\u6682\u5B58\u533A\u548C\u5DE5\u4F5C\u76EE\u5F55",index:"\u5DF2\u6682\u5B58\uFF1A\u6BD4\u8F83 HEAD \u548C\u6682\u5B58\u533A",outgoing:"\u672A\u63A8\u9001\uFF1A\u6BD4\u8F83\u4E0A\u6E38\u548C\u73B0\u5728\u7684\u5DE5\u4F5C\u76EE\u5F55\uFF08\u672A\u63A8\u9001\u7684\u63D0\u4EA4\uFF0C\u52A0\u4E0A\u8FD8\u6CA1\u63D0\u4EA4\u7684\u6539\u52A8\uFF09"},_a=880,Wa=1160,po={fix:2,warn:1,info:0},Xe=t=>t.reduce((e,n)=>po[n.note.level]>po[e]?n.note.level:e,"info");function Va(t,e){let n=[],r=0;for(let[o,i]of e)o>r&&n.push({text:t.slice(r,o),mark:!1}),n.push({text:t.slice(o,i),mark:!0}),r=i;return r<t.length&&n.push({text:t.slice(r),mark:!1}),n}function or({text:t,ranges:e}){return v.default.createElement("span",{className:"wt-code"},Va(t,e).map((n,r)=>n.mark?v.default.createElement("mark",{key:r},n.text):v.default.createElement("span",{key:r},n.text)))}function wo(t){return(0,v.useMemo)(()=>Mn(t).map(e=>({...e,ranges:e.left&&e.right?qr(e.left.text,e.right.text):[[],[]]})),[t])}function ir({item:t}){let{note:e}=t,[n,r]=(0,v.useState)(!0),[o]=ge[e.level],i=e.body&&e.body!==e.title?e.body:"";return v.default.createElement("div",{className:"wt-note","data-level":e.level,"data-open":n?"":void 0,id:`wt-note-${t.i}`},v.default.createElement("button",{type:"button",className:"wt-notehead","aria-expanded":n,onClick:()=>r(!n)},v.default.createElement("i",{className:"wt-notedot",title:o}),v.default.createElement("span",{className:"wt-notetitle"},e.title||o),e.level!=="info"&&v.default.createElement("small",{className:"wt-notetag"},o),i&&v.default.createElement(z,{name:"chevron",size:12,className:"wt-notechevron"+(n?" is-open":"")})),n&&i&&v.default.createElement("p",{className:"wt-notebody"},i))}function ar({list:t,open:e,onToggle:n}){return v.default.createElement("button",{type:"button",className:"wt-notemark","data-level":Xe(t),"aria-expanded":e,"aria-label":`\u67E5\u770B\u8FD9\u4E00\u884C\u7684 ${t.length} \u6761\u6279\u6CE8`,title:`\u8FD9\u4E00\u884C\u6709 ${t.length} \u6761\u6279\u6CE8`,onClick:r=>{r.stopPropagation(),n(!e)}},v.default.createElement(z,{name:"comment",size:13}),t.length>1&&v.default.createElement("b",null,t.length))}function uo({text:t,ranges:e,mark:n}){return n?v.default.createElement("span",{className:"wt-codecell"},v.default.createElement(or,{text:t,ranges:e}),n):v.default.createElement(or,{text:t,ranges:e})}var Pn=(t,e,n)=>{if(!t?.length)return null;let r=t.filter(o=>o.side===e);return r.length?r:n?t:null};function Ka({hunk:t,notes:e,margin:n,shown:r,toggle:o,flash:i}){let d=wo(t),c=f=>v.default.createElement(ir,{item:f,key:f.i}),l=e?.get(-1),b=(f,g,x,u,$,y,N,S)=>{if(!S?.length)return[v.default.createElement("div",{className:"wt-line","data-kind":g,key:f},v.default.createElement("span",{className:"wt-ln"},x??""),v.default.createElement("span",{className:"wt-ln"},u??""),v.default.createElement("span",{className:"wt-sign"},$),v.default.createElement(or,{text:y,ranges:N}))];let O=Xe(S),E=S.map(F=>F.i),L=E.some(F=>r.has(F));return[v.default.createElement("div",{className:"wt-line","data-kind":g,"data-note":O,"data-note-ids":E.join(" "),"data-flash":E.includes(i)||void 0,key:f},v.default.createElement("span",{className:"wt-ln"},x??""),v.default.createElement("span",{className:"wt-ln"},u??""),v.default.createElement("span",{className:"wt-sign"},$),v.default.createElement(uo,{text:y,ranges:N,mark:n?void 0:v.default.createElement(ar,{list:S,open:L,onToggle:F=>o(E,F)})}),n&&v.default.createElement("span",{className:"wt-notecell"},S.map(c))),...!n&&L?[v.default.createElement("div",{className:"wt-noterow","data-level":O,key:`${f}-notes`},S.map(c))]:[]]};return v.default.createElement("div",{className:"wt-hunkbody"},l?.length>0&&v.default.createElement("div",{className:"wt-noterow","data-level":Xe(l)},l.map(c)),d.flatMap((f,g)=>{let x=e?.get(g);if(f.kind==="ctx")return b(g,"ctx",f.left.oldNo,f.left.newNo," ",f.left.text,[],x);let u=[];return f.left&&u.push(...b(`${g}-`,"del",f.left.oldNo,null,"-",f.left.text,f.ranges[0],Pn(x,"left",!f.right))),f.right&&u.push(...b(`${g}+`,"add",null,f.right.newNo,"+",f.right.text,f.ranges[1],Pn(x,"right",!f.left))),u}))}function Ln({line:t,ranges:e,mark:n}){return t?v.default.createElement("div",{className:"wt-half","data-kind":t.kind},v.default.createElement("span",{className:"wt-ln"},t.oldNo??""),v.default.createElement("span",{className:"wt-sign"},t.kind==="add"?"+":t.kind==="del"?"-":""),v.default.createElement(uo,{text:t.text,ranges:e,mark:n})):v.default.createElement("div",{className:"wt-half is-empty"},v.default.createElement("span",{className:"wt-ln"}),v.default.createElement("span",{className:"wt-sign"}),v.default.createElement("span",{className:"wt-code"}))}function Za({hunk:t,notes:e,margin:n,shown:r,toggle:o}){let i=wo(t),d=l=>v.default.createElement(ir,{item:l,key:l.i}),c=e?.get(-1);return v.default.createElement("div",{className:"wt-hunkbody is-split"},c?.length>0&&v.default.createElement("div",{className:"wt-noterow is-span","data-level":Xe(c)},c.map(d)),i.flatMap((l,b)=>{let f=e?.get(b);if(!f?.length)return[v.default.createElement("div",{className:"wt-srow",key:b,"data-kind":l.kind},v.default.createElement(Ln,{line:l.left,ranges:l.ranges[0]}),v.default.createElement(Ln,{line:l.right,ranges:l.ranges[1]}))];let g=Pn(f,"left",!l.right),x=Pn(f,"right",!l.left),u=N=>!!N?.some(S=>r.has(S.i)),$=(N,S)=>N?.length&&o(N.map(O=>O.i),S),y=f.map(N=>N.i);return[v.default.createElement("div",{className:"wt-srow",key:b,"data-kind":l.kind,"data-note":Xe(f)},v.default.createElement(Ln,{line:l.left,ranges:l.ranges[0],mark:n||!g?void 0:v.default.createElement(ar,{list:g,open:u(g),onToggle:N=>$(g,N)})}),v.default.createElement(Ln,{line:l.right,ranges:l.ranges[1],mark:n||!x?void 0:v.default.createElement(ar,{list:x,open:u(x),onToggle:N=>$(x,N)})}),n&&v.default.createElement("span",{className:"wt-notecell"},f.map(d))),...!n&&y.some(N=>r.has(N))?[v.default.createElement("div",{className:"wt-noterow is-span","data-level":Xe(f),key:`${b}-notes`},f.map(d))]:[]]}))}var co=(t,e)=>e===1?`${t}`:`${t},${e}`;function Ga({hunk:t,split:e,numbered:n,index:r}){let o=`-${co(t.oldStart,t.oldCount)}`,i=`+${co(t.newStart,t.newCount)}`,d=v.default.createElement(v.default.Fragment,null,n&&v.default.createElement("b",{className:"wt-hunkno"},r+1),v.default.createElement("code",null,"@@ ",o," ",i," @@"),t.heading&&v.default.createElement("span",{className:"wt-hunkctx"},t.heading));return v.default.createElement("div",{className:"wt-hunkhead"+(e?" is-split":"")},e?v.default.createElement(v.default.Fragment,null,v.default.createElement("span",{className:"wt-ln"}),v.default.createElement("span",{className:"wt-sign"}),v.default.createElement("span",{className:"wt-hunklabel"},d),v.default.createElement("span",{className:"wt-ln"}),v.default.createElement("span",{className:"wt-sign"}),v.default.createElement("span",{className:"wt-hunklabel"},v.default.createElement("code",null,i))):v.default.createElement(v.default.Fragment,null,v.default.createElement("span",{className:"wt-ln"}),v.default.createElement("span",{className:"wt-ln"}),v.default.createElement("span",{className:"wt-sign"}),v.default.createElement("span",{className:"wt-hunklabel"},d)))}function Ua({text:t,split:e,byHunk:n,margin:r,shown:o,toggle:i,flash:d}){let c=(0,v.useMemo)(()=>Rn(t).hunks,[t]);return v.default.createElement("div",{className:"wt-diff"+(e?" is-split":"")},c.map((l,b)=>v.default.createElement("div",{className:"wt-hunk",key:b},v.default.createElement(Ga,{hunk:l,split:e,numbered:!!n,index:b}),e?v.default.createElement(Za,{hunk:l,notes:n?.get(b),margin:r,shown:o,toggle:i}):v.default.createElement(Ka,{hunk:l,notes:n?.get(b),margin:r,shown:o,toggle:i,flash:d}))))}function fo({file:t,repository:e,tree:n,split:r,wrap:o,title:i,notes:d,tools:c}){let l=(0,v.useMemo)(()=>Ba(t),[t]),[b,f]=(0,v.useState)(l.at(-1)[0]),[g,x]=(0,v.useState)(null),[u,$]=zn(),y=d??Fa;(0,v.useEffect)(()=>{let B=new AbortController;return x(null),zt("patch",{id:e,tree:n,file:t.id,layer:b},B.signal).then(q=>{B.signal.aborted||x({layer:b,...q})}).catch(q=>{B.signal.aborted||x({layer:b,note:q.message})}),()=>B.abort()},[t.id,e,n,b]);let N=g?.layer===b?g:null,S=(0,v.useMemo)(()=>N?.text?Rn(N.text):null,[N]),O=t.add??S?.additions,E=t.del??S?.deletions,{byHunk:L,loose:F,placed:Y}=(0,v.useMemo)(()=>oo(y,S),[y,S]),U=Y.length>0&&$>=(r?Wa:_a),[D,_]=(0,v.useState)(()=>new Set);(0,v.useEffect)(()=>{_(B=>{let q=new Set(Y.map(ct=>ct.i));return q.size===B.size&&[...q].every(ct=>B.has(ct))?B:q})},[Y]);let Q=(B,q)=>_(ct=>{let R=new Set(ct);for(let yt of B)q?R.add(yt):R.delete(yt);return R}),X=(0,v.useMemo)(()=>ao(Y),[Y]),[kt,it]=(0,v.useState)(-1),[K,lt]=(0,v.useState)(-1),wt=B=>{if(!X.length)return;let q=(kt+B+X.length)%X.length,ct=X[q];it(q),U||Q([ct.i],!0),lt(ct.i),setTimeout(()=>lt(-1),1400),requestAnimationFrame(()=>u.current?.querySelector(`[data-note-ids~="${ct.i}"]`)?.scrollIntoView({block:"center"}))};return v.default.createElement("section",{className:"wt-diffbox","aria-label":"\u6587\u4EF6\u5DEE\u5F02","data-margin":U?"":void 0,ref:u},v.default.createElement("div",{className:"wt-diffsticky"},i,v.default.createElement("div",{className:"wt-difftools"},l.length>1?v.default.createElement("div",{className:"wt-seg wt-seg-sm",role:"tablist"},l.map(([B,q])=>v.default.createElement("button",{key:B,role:"tab","aria-selected":b===B,onClick:()=>f(B)},q))):v.default.createElement("small",{className:"wt-difflayer",title:qa[l[0][0]]},l[0][1]),v.default.createElement("span",{className:"wt-spacer"}),X.length>0&&v.default.createElement("span",{className:"wt-notejump",role:"group","aria-label":"\u5728\u6279\u6CE8\u4E4B\u95F4\u8DF3\u8F6C"},v.default.createElement("button",{type:"button",className:"wt-iconbtn",title:"\u4E0A\u4E00\u6761\u6279\u6CE8","aria-label":"\u4E0A\u4E00\u6761\u6279\u6CE8",onClick:()=>wt(-1)},v.default.createElement(z,{name:"left",size:14})),v.default.createElement("span",null,"\u6279\u6CE8"," ",v.default.createElement("b",null,kt<0?X.length:`${kt+1}/${X.length}`)),v.default.createElement("button",{type:"button",className:"wt-iconbtn",title:"\u4E0B\u4E00\u6761\u6279\u6CE8","aria-label":"\u4E0B\u4E00\u6761\u6279\u6CE8",onClick:()=>wt(1)},v.default.createElement(z,{name:"right",size:14}))),t.xy!=="??"&&v.default.createElement("span",{className:"wt-fstat",title:t.add!=null?t.st?"\u76F8\u5BF9\u4E0A\u6E38\u7684\u589E\u5220\u884C\u6570":"\u76F8\u5BF9 HEAD \u7684\u589E\u5220\u884C\u6570":void 0},v.default.createElement("i",null,"+",t.add??S?.additions??"\u2014"),v.default.createElement("i",null,"\u2212",t.del??S?.deletions??"\u2014")),c)),!N||N.note?v.default.createElement("p",{className:"wt-emptyline",role:"status"},N?.note||"\u6B63\u5728\u8BFB\u53D6\u5DEE\u5F02\u2026"):S?.binary?v.default.createElement("p",{className:"wt-emptyline"},"\u4E8C\u8FDB\u5236\u6587\u4EF6\uFF0C\u6CA1\u6709\u53EF\u663E\u793A\u7684\u6587\u672C\u5DEE\u5F02\u3002"):S?.hunks.length?v.default.createElement("div",{className:"wt-diffscroll","data-wrap":o||U?"true":void 0},v.default.createElement(Ua,{text:N.text,split:r,byHunk:Y.length?L:null,margin:U,shown:D,toggle:Q,flash:K})):v.default.createElement("p",{className:"wt-emptyline"},"\u8FD9\u4E2A\u6587\u4EF6\u6CA1\u6709\u5185\u5BB9\u5DEE\u5F02\u3002"),F.length>0&&v.default.createElement("div",{className:"wt-noterow is-loose","data-level":"warn"},F.map(B=>v.default.createElement(ir,{item:B,key:B.i}))),N?.truncated&&v.default.createElement("p",{className:"wt-emptyline"},"\u5DEE\u5F02\u8F83\u957F\uFF0C\u53EA\u663E\u793A\u4E86\u5F00\u5934\u90E8\u5206\u3002"))}var Te="worktree-desk/tree",Hn={current:null},sr="worktree-desk.prefs",bt={get(t,e){try{return JSON.parse(localStorage.getItem(sr)??"{}")[t]??e}catch{return e}},set(t,e){try{localStorage.setItem(sr,JSON.stringify({...JSON.parse(localStorage.getItem(sr)??"{}"),[t]:e}))}catch{}}},Xa=[["iterm","warp","ghostty","kitty","terminal","windowsterminal"],["vscode","vscodeinsiders","cursor","windsurf","zed","xcode","intellij"],["sourcetree","fork","github","tower","gitkraken"],["finder","explorer","filemanager"]],Ja=["terminal","code","branch","folder"],Ya={iterm:"iTerm",warp:"Warp",ghostty:"Ghostty",kitty:"kitty",terminal:"\u7EC8\u7AEF",windowsterminal:"\u7EC8\u7AEF",vscode:"VS Code",vscodeinsiders:"VS Code Insiders",cursor:"Cursor",windsurf:"Windsurf",zed:"Zed",xcode:"Xcode",intellij:"IntelliJ IDEA",sourcetree:"Sourcetree",fork:"Fork",github:"GitHub Desktop",tower:"Tower",gitkraken:"GitKraken",finder:"\u8BBF\u8FBE",explorer:"\u8D44\u6E90\u7BA1\u7406\u5668",filemanager:"\u6587\u4EF6\u7BA1\u7406\u5668"},Qa=new Set(["finder","explorer","filemanager"]),Ra=[{app:"finder",target:"finder",group:3,label:"\u5728\u8BBF\u8FBE\u4E2D\u663E\u793A",icon:"folder",fallback:!0},{app:"terminal",target:"terminal",group:0,label:"\u5728\u7EC8\u7AEF\u4E2D\u6253\u5F00",icon:"terminal",fallback:!0}];function mo(t){return t?.length?Xa.flatMap((e,n)=>e.filter(r=>t.includes(r)).map(r=>{let o=Ya[r]??r;return{app:r,group:n,icon:Ja[n],label:Qa.has(r)?`\u5728 ${o} \u4E2D\u663E\u793A`:`\u5728 ${o} \u4E2D\u6253\u5F00`}})):Ra}function ho(t){let{lookup:e,apps:n,act:r}=Hn.current??{},o=e?.(t.repo,t.path);if(!o||!r)return[];let i=!o.prunable&&!o.error,d=g=>o.sessions.find(x=>x.source===g&&!x.archived),c=o.sessions.filter(g=>g.source==="DSH"&&!g.archived),l=d("Codex"),b=d("ZCode"),f=[];if(i&&r.dsh&&(c.length&&f.push({id:"dsh:open",label:"\u6253\u5F00 DSH \u4F1A\u8BDD",run:()=>r.openDsh(o)}),f.push({id:"dsh:new",label:c.length?"\u65B0\u5F00\u4E00\u4E2A DSH \u4F1A\u8BDD":"\u5728 DSH \u65B0\u5F00\u4F1A\u8BDD",run:()=>r.newDsh(o)}),Vt(o,"uncommitted")?.length&&r.review&&f.push({id:"dsh:review",label:"AI \u5BA1\u67E5\u672A\u63D0\u4EA4\u7684\u6539\u52A8",run:()=>r.review(t.repo,o,"uncommitted")}),Vt(o,"outgoing")?.length&&r.review&&f.push({id:"dsh:review-outgoing",label:"AI \u5BA1\u67E5\u672A\u63A8\u9001\u7684\u6539\u52A8",run:()=>r.review(t.repo,o,"outgoing")}),r.editPrompt&&f.push({id:"dsh:review-prompt",label:Hn.current.prompted?.(t.repo)?"\u672C\u4ED3\u5E93\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD\uFF08\u5DF2\u81EA\u5B9A\u4E49\uFF09\u2026":"\u672C\u4ED3\u5E93\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD\u2026",run:()=>r.editPrompt(t.repo)})),l&&f.push({id:"codex:open",label:"\u5728 Codex \u4E2D\u6253\u5F00",run:()=>r.openTool(o,l,t.repo)}),b&&f.push({id:"zcode:open",label:"\u5728 ZCode \u4E2D\u6253\u5F00",run:()=>r.openTool(o,b,t.repo)}),i)for(let g of n)f.push({id:`open:${g.app}`,label:g.label,separatorBefore:f.length===0,run:()=>r.openApp(t.repo,o,g)});return f.push({id:"copy:path",label:"\u590D\u5236\u8DEF\u5F84",separatorBefore:f.length>0,run:()=>r.copy(o.path,"\u5DF2\u590D\u5236\u8DEF\u5F84")}),o.branch&&f.push({id:"copy:branch",label:"\u590D\u5236\u5206\u652F\u540D",run:()=>r.copy(o.branch,"\u5DF2\u590D\u5236\u5206\u652F\u540D")}),o.prunable&&f.push({id:"prune",label:"\u6E05\u7406\u672C\u4ED3\u5E93\u7684\u5931\u6548\u767B\u8BB0",danger:!0,separatorBefore:!0,run:()=>r.requestPrune(t.repo)}),f}var pr="worktree-desk.viewed";var ti={};var go=(t,e=2166136261)=>{let n=e;for(let r=0;r<t.length;r++)n^=t.charCodeAt(r),n=Math.imul(n,16777619);return(n>>>0).toString(16).padStart(8,"0")},ko=t=>go(t)+go(t,2654435769),jn=t=>ko(t);function Ee(t){return ko([t.path,t.from??"",t.add??t.lines??"",t.del??"",t.mtime??"",t.size??""].join("\0"))}function pn(t,e,n){let r=t[jn(e.path)];return r===void 0?"unviewed":r===n?"viewed":"changed"}function cr(t,e){let n={total:t.length,viewed:0,changed:0};for(let r of t){let o=pn(e,r,Ee(r));o!=="unviewed"&&(n[o]+=1)}return n}function ei(t){let e;try{e=JSON.parse(t??"")}catch{return{}}if(!e||typeof e!="object"||Array.isArray(e))return{};let n={};for(let[r,o]of Object.entries(e)){if(!r||!o||typeof o!="object")continue;let i={};for(let[d,c]of Object.entries(o.files??{}))typeof d=="string"&&typeof c=="string"&&(i[d]=c);Object.keys(i).length&&(n[r]={at:Number.isFinite(o.at)?o.at:0,files:i})}return n}var lr=()=>{try{return ei(localStorage.getItem(pr))}catch{return null}},Me=null,yo=0,bo=0,ni=()=>bo=Math.max(Date.now(),bo+1),dr=new Set,No=()=>{yo+=1,dr.forEach(t=>t())},xo=(t,e)=>{let n=lr();if(!n)return!1;Object.keys(e).length?n[t]={at:ni(),files:e}:delete n[t];let r=Object.fromEntries(Object.entries(n).sort((o,i)=>i[1].at-o[1].at).slice(0,200));try{localStorage.setItem(pr,JSON.stringify(r))}catch{return!1}return Me=r,No(),!0},vo=new WeakMap,xt={get version(){return yo},subscribe(t){return dr.add(t),()=>dr.delete(t)},has(t){return Me??=lr(),!!(Me&&Me[t])},marksOf(t){return Me??=lr(),Me?.[t]?.files??ti},progress(t,e){let n=xt.marksOf(t),r=vo.get(e);if(r&&r.marks===n)return r.value;let o=cr(e,n);return vo.set(e,{marks:n,value:o}),o},mark(t,e,n,r){let o=e.find(l=>l.path===n);if(!o)return!1;let i=new Set(e.map(l=>jn(l.path))),d=jn(n),c={};for(let[l,b]of Object.entries(xt.marksOf(t)))l!==d&&i.has(l)&&(c[l]=b);return r&&(c[d]=Ee(o)),xo(t,c)},markAll(t,e,n){let r={};if(n)for(let o of e)r[jn(o.path)]=Ee(o);return xo(t,r)},clear(){Me=null;try{localStorage.removeItem(pr)}catch{}No()}};var So=560,ri=200,Co=280,oi=400,ai=1500,ii=900,si=140,li=220,di=160,pi=40,ci={area(){}},wi=t=>t.xy==="??"?t.lines??20:(t.add??20)+(t.del??20),$o=(t,e,n)=>{let r=new Set,o=0;for(let i of t)n?.(i)!=="viewed"&&(e(i)?r.add(i.id):(o+=wi(i),o<=ai&&r.add(i.id)));return r},ui=(t,e)=>t.size===e.size&&[...t].every(n=>e.has(n)),zo=(t,e,n)=>t.off.has(e)?!1:t.on.has(e)?!0:n||t.all;function Mo(t,e=[]){for(let n of t.dirs)Mo(n,e);for(let n of t.files)e.push(n);return e}var Fn=t=>t.slice(t.lastIndexOf("/")+1);function Eo(t){let e=0,n=0,r=!1;for(let o of t.files)o.add!=null&&(e+=o.add,n+=o.del,r=!0);for(let o of t.dirs){let i=Eo(o);e+=i.add,n+=i.del,r||=i.known}return{add:e,del:n,known:r}}function Ao({file:t}){return t.xy==="??"?p.default.createElement("span",{className:"wt-fstat"},t.lines!=null?p.default.createElement("i",null,"+",t.lines):p.default.createElement("i",null,"\u65B0\u6587\u4EF6")):t.add==null?p.default.createElement("span",{className:"wt-fstat"}):p.default.createElement("span",{className:"wt-fstat"},p.default.createElement("i",null,"+",t.add),p.default.createElement("i",null,"\u2212",t.del))}var To={fix:2,warn:1,info:0};function Oo({notes:t}){if(!t?.length)return null;let e=t.reduce((n,r)=>To[r.level]>To[n]?r.level:n,"info");return p.default.createElement("span",{className:"wt-fnote","data-level":e,title:`${t.length} \u6761\u5BA1\u67E5\u6279\u6CE8`},p.default.createElement(z,{name:"comment",size:11}),t.length)}function fi({children:t,placeholder:e}){let n=(0,p.useRef)(null),[r,o]=(0,p.useState)(!1);return(0,p.useEffect)(()=>{let i=n.current;if(!i||typeof IntersectionObserver>"u"){o(!0);return}let d=i.closest(".wt-diffstack"),c=new IntersectionObserver(l=>{l.some(b=>b.isIntersecting)&&(o(!0),c.disconnect())},{root:d,rootMargin:`${ii}px 0px`});return c.observe(i),()=>c.disconnect()},[]),p.default.createElement("div",{ref:n},r?t:e)}function wr({file:t,state:e,onChange:n,bare:r=!1}){return p.default.createElement("label",{className:"wt-reviewed"+(r?" is-bare":""),"data-state":e,title:e==="viewed"?"\u5DF2\u5BA1\u9605\u3002\u70B9\u4E00\u4E0B\u53D6\u6D88":e==="changed"?"\u5BA1\u9605\u4E4B\u540E\u8FD9\u4E2A\u6587\u4EF6\u53C8\u6709\u6539\u52A8\u3002\u70B9\u4E00\u4E0B\u91CD\u65B0\u6807\u4E3A\u5DF2\u5BA1\u9605":"\u770B\u8FC7\u4E86\uFF1A\u6807\u4E3A\u5DF2\u5BA1\u9605\uFF08\u952E\u76D8 V \u5207\u6362\u5F53\u524D\u6587\u4EF6\uFF09"},p.default.createElement("input",{type:"checkbox",checked:e==="viewed","aria-label":`\u5C06 ${t.path} \u6807\u8BB0\u4E3A\u5DF2\u5BA1\u9605`,onChange:o=>n(t,o.target.checked)}),p.default.createElement("span",{className:"wt-reviewedbox","aria-hidden":"true"},e==="viewed"&&p.default.createElement(z,{name:"check",size:11})),!r&&p.default.createElement("span",{className:"wt-reviewedlabel"},"\u5DF2\u5BA1\u9605"))}function mi(t,e){let[,n]=(0,p.useReducer)(r=>r+1,0);return(0,p.useEffect)(()=>xt.subscribe(n),[]),(0,p.useMemo)(()=>xt.marksOf(t),[t,e,xt.version])}var hi=(0,p.memo)(function({file:e,badge:n,depth:r,notes:o,state:i,pick:d,active:c,onReviewed:l}){return p.default.createElement("div",{className:"wt-filewrap",style:{"--depth":r},"data-file":e.id,"data-viewed":i},p.default.createElement(wr,{file:e,state:i,onChange:l,bare:!0}),p.default.createElement("button",{type:"button",className:"wt-file","data-active":c?"":void 0,title:`${e.path} \xB7 ${n.detail}`,onClick:()=>d(e)},p.default.createElement("span",{className:"wt-badge","data-tone":n.tone},n.code),p.default.createElement("span",{className:"wt-fname"},r?Fn(e.path):e.path,e.from&&p.default.createElement("small",null," \u2190 ",Fn(e.from))),p.default.createElement(Oo,{notes:o}),p.default.createElement(Ao,{file:e})))});function Do({node:t,prefix:e,depth:n,badges:r,isOpen:o,toggleDir:i,pick:d,notesFor:c,active:l,stateOf:b,onReviewed:f}){return p.default.createElement(p.default.Fragment,null,t.dirs.map(g=>{let x=e+g.name,u=o(x),$=Eo(g);return p.default.createElement("div",{className:"wt-dirwrap",key:x},p.default.createElement("button",{type:"button",className:"wt-dir",style:{"--depth":n},"aria-expanded":u,onClick:()=>i(x)},p.default.createElement(z,{name:"chevron",size:12,className:u?"is-open":""}),p.default.createElement("span",{className:"wt-dirname"},g.name),p.default.createElement("span",{className:"wt-dircount"},g.count),$.known&&p.default.createElement("span",{className:"wt-fstat"},p.default.createElement("i",null,"+",$.add),p.default.createElement("i",null,"\u2212",$.del))),u&&p.default.createElement(Do,{node:g,prefix:x,depth:n+1,badges:r,isOpen:o,toggleDir:i,pick:d,notesFor:c,active:l,stateOf:b,onReviewed:f}))}),t.files.map(g=>p.default.createElement(hi,{key:g.path,file:g,badge:r.get(g.path),depth:n,notes:c?.get(g.id),state:b(g),pick:d,active:l===g.id,onReviewed:f})))}function gi({query:t,setQuery:e}){return p.default.createElement("label",{className:"wt-minisearch"},p.default.createElement(z,{name:"search",size:13}),p.default.createElement("input",{"aria-label":"\u7B5B\u9009\u6587\u4EF6",placeholder:"\u7B5B\u9009\u6587\u4EF6",value:t,onChange:n=>e(n.target.value)}),t&&p.default.createElement("button",{type:"button",className:"wt-iconbtn","aria-label":"\u6E05\u9664\u7B5B\u9009",onClick:()=>e("")},p.default.createElement(z,{name:"close",size:12})))}function bi({filter:t,setFilter:e,counts:n,filters:r}){return p.default.createElement("div",{className:"wt-seg wt-seg-sm",role:"tablist"},Object.entries(r).map(([o,[i]])=>p.default.createElement("button",{key:o,role:"tab","aria-selected":t===o,onClick:()=>e(o)},i,o!=="all"&&n[o]>0&&p.default.createElement("b",null,n[o]))))}function Io({tree:t,repository:e,scope:n="uncommitted",notesFor:r,live:o=!0,remember:i=ci}){let d=t.status,c=n==="outgoing"?d.outgoing:d,l=c.files,b=c.total,f=Gr(n),[g,x]=zn(),[u,$]=(0,p.useState)(()=>bt.get("tree","float")==="pin"),y=u&&x>=So,N=x>=So,S=Math.round(y?Math.min(Co,Math.max(ri,x*.32)):Math.min(Co,Math.max(180,x-48))),O=y?x-S>=660:x>=680,E=`wt-tree-${t.id.slice(0,8)}`,[L]=(0,p.useState)(()=>i.get().scopes[n]),F=(0,p.useCallback)(m=>i.area(n,m),[i,n]),Y=(0,p.useRef)(F);Y.current=F;let U=`${e}:${t.id}`,D=mi(U,l),_=(0,p.useMemo)(()=>new Map(l.map(m=>[m.path,Ee(m)])),[l]),Q=(0,p.useCallback)(m=>pn(D,m,_.get(m.path)),[D,_]),[X,kt]=(0,p.useState)(()=>bt.get("split",!1)===!0),[it,K]=(0,p.useState)(()=>{let m=bt.get("wrap",null);return typeof m=="boolean"?m:null}),lt=it===null?!O:it,wt=m=>{kt(m),bt.set("split",m),m&&!lt&&(K(!0),bt.set("wrap",!0))},B=m=>{K(m),bt.set("wrap",m)},[q,ct]=(0,p.useState)({open:!1,held:!1}),[R,yt]=(0,p.useState)(!1),Tt=(0,p.useRef)(q);Tt.current=q;let jt=(0,p.useRef)({panel:!1,trigger:!1}),V=(0,p.useRef)(0),mt=(0,p.useRef)(0),Ft=(0,p.useRef)(null),tt=(0,p.useRef)("mouse"),Ot=(0,p.useRef)(u);Ot.current=u;let Bt=(0,p.useRef)(null),j=(0,p.useRef)(null),st=(0,p.useRef)(null),Nt=(0,p.useRef)(null),Jt=(0,p.useRef)(null),Dt=(m,A)=>{clearTimeout(V.current),clearTimeout(mt.current),yt(!0),ct({open:!0,held:m}),A&&tt.current!=="touch"&&Qe("search")},It=m=>{clearTimeout(V.current),clearTimeout(mt.current),ct({open:!1,held:!1}),mt.current=setTimeout(()=>yt(!1),di),m&&st.current?.contains(document.activeElement)&&Qe("trigger")},Qe=m=>{Ft.current={where:m,at:Date.now()}};(0,p.useEffect)(()=>{let m=Ft.current;if(!m)return;if(Date.now()-m.at>600){Ft.current=null;return}let A={search:()=>st.current?.querySelector("input"),trigger:()=>Ot.current?null:j.current,pin:()=>Ot.current?st.current?.querySelector(".wt-pin"):null}[m.where]();A&&(A.focus({preventScroll:!0}),Ft.current=null)}),(0,p.useEffect)(()=>(clearTimeout(mt.current),()=>clearTimeout(mt.current)),[]);let un=m=>m.pointerType==="mouse",Oe=m=>A=>{un(A)&&(jt.current[m]=!0,clearTimeout(V.current),!y&&!Tt.current.open&&(V.current=setTimeout(()=>Dt(!1),si)))},fn=m=>A=>{un(A)&&(jt.current[m]=!1,clearTimeout(V.current),V.current=setTimeout(()=>{let{open:W,held:G}=Tt.current,dt=document.activeElement,Mt=dt?.tagName==="INPUT"&&st.current?.contains(dt);W&&!G&&!Mt&&!jt.current.panel&&!jt.current.trigger&&It(!0)},li))};(0,p.useEffect)(()=>{y&&It(!1)},[y]),(0,p.useEffect)(()=>{o||It(!1)},[o]),(0,p.useEffect)(()=>{if(!q.open)return;let m=A=>{g.current?.contains(A.target)||It(!0)};return document.addEventListener("pointerdown",m,!0),()=>document.removeEventListener("pointerdown",m,!0)},[q.open]),(0,p.useEffect)(()=>{if(!q.open)return;let m=A=>{A.key==="Escape"&&(A.stopPropagation(),It(!0))};return document.addEventListener("keydown",m,!0),()=>document.removeEventListener("keydown",m,!0)},[q.open]);let ce=m=>m.detail===0||tt.current!=="touch",Re=(0,p.useRef)(null);(0,p.useEffect)(()=>{let A=setTimeout(()=>{let W=Nt.current,G=Re.current;Re.current=null;let dt=W?.querySelector(`[data-file="${CSS.escape(G?.file??"")}"]`);dt&&(W.scrollTop+=dt.getBoundingClientRect().top-W.getBoundingClientRect().top-G.offset)},220);return()=>clearTimeout(A)},[y]);let De=()=>{let m=!u,A=Nt.current;if(A){let W=A.getBoundingClientRect().top+36;for(let G of A.querySelectorAll(".wt-stackcard"))if(G.getBoundingClientRect().bottom>W){Re.current={file:G.dataset.file,offset:G.getBoundingClientRect().top-A.getBoundingClientRect().top};break}}$(m),bt.set("tree",m?"pin":"float"),m?st.current?.contains(document.activeElement)&&Qe("pin"):It(!0)},Vn=u?y?"\u53D6\u6D88\u56FA\u5B9A\uFF1A\u6587\u4EF6\u6811\u53D8\u56DE\u6D6E\u7A97\uFF0C\u9F20\u6807\u79FB\u5F00\u5C31\u6536\u8D77":"\u5DF2\u56FA\u5B9A\uFF0C\u4F46\u6587\u4EF6\u533A\u73B0\u5728\u4E0D\u591F\u5BBD\uFF08\u7EA6 560px \u4EE5\u4E0A\u624D\u884C\uFF09\uFF0C\u6682\u65F6\u8FD8\u662F\u6D6E\u7A97":N?"\u56FA\u5B9A\uFF1A\u6587\u4EF6\u6811\u5E38\u9A7B\u5728\u5DE6\u8FB9\uFF0C\u5DEE\u5F02\u6392\u5728\u53F3\u8FB9\uFF0C\u4E92\u4E0D\u906E\u6321":"\u6587\u4EF6\u533A\u591F\u5BBD\uFF08\u7EA6 560px \u4EE5\u4E0A\uFF09\u624D\u80FD\u628A\u6587\u4EF6\u6811\u56FA\u5B9A\u6210\u5DE6\u53F3\u4E24\u680F",St=(0,p.useMemo)(()=>new Map(l.map(m=>[m.path,Ze(m)])),[l]),[ht,tn]=(0,p.useState)(()=>Object.hasOwn(f,L.filter)?L.filter:"all"),[Ct,Ie]=(0,p.useState)(L.query),[Kt,mn]=(0,p.useState)(()=>L.dirs?{all:L.dirs.all,off:new Set(L.dirs.off),on:new Set(L.dirs.on)}:{all:l.length<=oi,off:new Set,on:new Set}),Le=(0,p.useRef)(!1),Pe=(0,p.useCallback)(m=>!!r?.get(m.id)?.length,[r]),[Yt,qt]=(0,p.useState)(L.how||"auto"),[Qt,Rt]=(0,p.useState)(()=>L.how&&L.how!=="auto"?new Set(L.open):$o(l,Pe,Q)),[J,be]=(0,p.useState)(null),He=(0,p.useRef)(J);He.current=J;let te=ht!=="all"||Ct.trim()!=="",hn=()=>{tn("all"),Ie("")},Zt=(0,p.useMemo)(()=>l.filter(m=>f[ht][1](m)&&he(Ct,m.path,m.from)),[l,f,ht,Ct]),en=(0,p.useMemo)(()=>Zr(Zt),[Zt]),nt=(0,p.useMemo)(()=>Mo(en),[en]),gn=(0,p.useCallback)(m=>zo(Kt,m,te),[Kt,te]),pt=te||Kt.all&&!Kt.off.size,je=(0,p.useCallback)(m=>{Le.current=!0,mn(A=>{let W=new Set(A.on),G=new Set(A.off);return zo(A,m,te)?(W.delete(m),G.add(m)):(G.delete(m),W.add(m)),{...A,on:W,off:G}})},[te]),Fe=m=>{Le.current=!0,mn({all:m,on:new Set,off:new Set})};(0,p.useEffect)(()=>{F({filter:ht,query:Ct,...Yt==="auto"?{how:"auto"}:{how:Yt,open:[...Qt]},...Le.current?{dirs:{all:Kt.all,on:[...Kt.on],off:[...Kt.off]}}:{}})},[F,ht,Ct,Yt,Qt,Kt]),(0,p.useEffect)(()=>{Rt(m=>{let A=Yt==="all"?new Set(nt.map(W=>W.id)):Yt==="auto"?$o(nt,Pe,Q):m;return A===m||ui(m,A)?m:A})},[nt,Pe,Yt,Q]);let _t=(0,p.useCallback)(m=>{qt("custom"),Rt(A=>{let W=new Set(A);return W.delete(m.id)||W.add(m.id),W})},[]),Gt=nt.length>0&&nt.every(m=>Qt.has(m.id)),bn=m=>{qt(m?"all":"custom"),Rt(m?new Set(nt.map(A=>A.id)):new Set)};(0,p.useEffect)(()=>be(null),[ht,Ct]);let we=(m,A,W)=>{let G=Nt.current;if(!G)return;let dt=`[data-file="${CSS.escape(m)}"]`,Mt=()=>{let Lt=G.querySelector(dt);if(!Lt)return null;let Se=Lt.getBoundingClientRect().top-G.getBoundingClientRect().top+G.scrollTop-A,an=Math.abs(Se-G.scrollTop)>2;return an&&(G.scrollTop=Se),!an},se=!1,$t=0,at=0,on=["wheel","pointerdown","touchstart","keydown"],Ne=()=>{if(!se){se=!0;for(let Lt of on)G.removeEventListener(Lt,Ne);W?.()}};for(let Lt of on)G.addEventListener(Lt,Ne,{passive:!0});let fe=()=>{if(se)return;let Lt=Mt();if(Lt===null||at++>pi||$t>=6)return Ne();$t=Lt?$t+1:0,setTimeout(fe,80)};fe()},oe=(0,p.useCallback)((m,A)=>{if(!xt.mark(U,l,m.path,A)||(qt("custom"),Rt(dt=>{let Mt=new Set(dt);return A?Mt.delete(m.id):Mt.add(m.id),Mt}),!A))return;let W=Nt.current,G=W?.querySelector(`[data-file="${CSS.escape(m.id)}"]`);G&&G.getBoundingClientRect().top<W.getBoundingClientRect().top+36&&we(m.id,36)},[U,l]),ot=(0,p.useMemo)(()=>cr(nt,D),[nt,D]),xe=m=>{xt.markAll(U,l,m)&&(m?(qt("custom"),Rt(new Set)):qt("auto"))},xn=(0,p.useRef)(null);xn.current=m=>{if(m.key.toLowerCase()!=="v"||m.metaKey||m.ctrlKey||m.altKey||m.nativeEvent?.isComposing)return;let A=m.target;if(!(A instanceof Element)||A.closest("input, textarea, select, [contenteditable]"))return;let W=g.current?.contains(A)&&A.closest("[data-file]")?A.closest("[data-file]"):null,G=l.find(dt=>dt.id===W?.dataset.file)??l.find(dt=>dt.id===He.current)??nt[0];G&&(m.preventDefault(),oe(G,Q(G)!=="viewed"))},(0,p.useEffect)(()=>{if(!o)return;let m=g.current?.closest(".wt-wrap");if(!m)return;let A=W=>xn.current?.(W);return m.addEventListener("keydown",A),()=>m.removeEventListener("keydown",A)},[o]);let Ut=(0,p.useRef)({file:null,offset:0,at:0}),Wt=(0,p.useRef)(!1),ae=x>0;(0,p.useEffect)(()=>{let m=Nt.current;if(!m)return;let A=()=>{let W=m.getBoundingClientRect(),G=W.top+56,dt=null,Mt=0;for(let $t of m.querySelectorAll(".wt-stackcard")){let at=$t.getBoundingClientRect().top;if(at>G)break;dt=$t.dataset.file,Mt=Math.round(at-W.top)}if(be(dt),!dt||!Wt.current)return;let se=Date.now();dt===Ut.current.file&&se-Ut.current.at<400||(Ut.current={file:dt,offset:Mt,at:se},Y.current({anchor:{file:dt,offset:Mt}}))};return A(),m.addEventListener("scroll",A,{passive:!0}),()=>{m.removeEventListener("scroll",A),Ut.current.file&&Y.current({anchor:{file:Ut.current.file,offset:Ut.current.offset}})}},[ae]),(0,p.useEffect)(()=>{ae&&(L.anchor?.file?we(L.anchor.file,L.anchor.offset,()=>{Wt.current=!0}):Wt.current=!0)},[ae]),(0,p.useEffect)(()=>{!y||!J||Jt.current?.querySelector(`[data-file="${CSS.escape(J)}"]`)?.scrollIntoView({block:"nearest"})},[J,y]);let vn=(0,p.useRef)(Qt);vn.current=Qt;let Be=(0,p.useRef)(y);Be.current=y;let ie=(0,p.useRef)(It);ie.current=It;let ue=(0,p.useCallback)((m,A=!1)=>{vn.current.has(m.id)||(qt("custom"),Rt(W=>new Set(W).add(m.id))),A&&!Be.current&&ie.current(!0),we(m.id,36)},[]),Kn=(0,p.useCallback)(m=>ue(m,!0),[ue]),kn=m=>{let A=nt.findIndex(G=>G.id===J),W=nt[(A+m+nt.length*2)%nt.length];W&&ue(W)},Zn=(0,p.useMemo)(()=>{let m={all:0};for(let A of Object.keys(f))A!=="all"&&(m[A]=l.filter(f[A][1]).length);return m},[l,f]),qe=p.default.createElement(Do,{node:en,prefix:"",depth:0,badges:St,isOpen:gn,toggleDir:je,pick:Kn,notesFor:r,active:J,stateOf:Q,onReviewed:oe}),_e=p.default.createElement("p",{className:"wt-emptyline"},"\u6CA1\u6709\u7B26\u5408\u7B5B\u9009\u6761\u4EF6\u7684\u6587\u4EF6\u3002"),nn=b>l.length&&p.default.createElement("p",{className:"wt-emptyline"},"\u53EA\u5217\u51FA\u524D ",l.length," \u9879\uFF0C\u5171 ",b," \u9879\u3002"),ve=(0,p.useCallback)((m,A,W)=>p.default.createElement(fo,{file:m,repository:e,tree:t.id,split:X&&m.xy!=="??",wrap:lt,title:p.default.createElement("div",{className:"wt-diffhead"},p.default.createElement("button",{type:"button",className:"wt-back",onClick:()=>_t(m),"aria-label":"\u6536\u8D77\u5DEE\u5F02",title:"\u6536\u8D77\u5DEE\u5F02"},p.default.createElement(z,{name:"chevron",size:14,className:"is-open"})),p.default.createElement("span",{className:"wt-badge","data-tone":A.tone,title:A.detail},A.code),p.default.createElement(Xt,{className:"wt-difftitle",title:m.path,text:m.path}),m.from&&p.default.createElement("span",{className:"wt-difffrom",title:`\u539F\u8DEF\u5F84\uFF1A${m.from}`},"\u2190 ",Fn(m.from)),W==="changed"&&p.default.createElement("small",{className:"wt-tag wt-tag-changed"},"\u6709\u65B0\u6539\u52A8")),notes:r?.get(m.id),tools:p.default.createElement(wr,{file:m,state:W,onChange:oe})}),[e,t.id,X,lt,r,_t,oe]),yn={id:E,ref:st,className:"wt-treepanel",role:"complementary","aria-label":"\u6587\u4EF6\u5217\u8868"},ke=m=>p.default.createElement("div",{...m},p.default.createElement("div",{className:"wt-treehead"},p.default.createElement("span",{className:"wt-listtitle"},"\u6587\u4EF6",p.default.createElement("b",null,b)),p.default.createElement("span",{className:"wt-spacer"}),p.default.createElement("button",{type:"button",className:"wt-iconbtn",title:pt?"\u6536\u8D77\u5168\u90E8\u76EE\u5F55":"\u5C55\u5F00\u5168\u90E8\u76EE\u5F55","aria-label":pt?"\u6536\u8D77\u5168\u90E8\u76EE\u5F55":"\u5C55\u5F00\u5168\u90E8\u76EE\u5F55","aria-pressed":pt,onClick:()=>Fe(!pt)},p.default.createElement(z,{name:pt?"fold":"unfold",size:14})),p.default.createElement("button",{type:"button",className:"wt-iconbtn wt-pin","data-on":u||void 0,disabled:u?!y:!N,"aria-pressed":u,title:Vn,onClick:De},p.default.createElement(z,{name:"pin",size:14}))),p.default.createElement("div",{className:"wt-treefilter"},p.default.createElement(bi,{filter:ht,setFilter:tn,counts:Zn,filters:f}),p.default.createElement(gi,{query:Ct,setQuery:Ie})),p.default.createElement("div",{className:"wt-files",ref:Jt},Zt.length?qe:_e),nn),We=[ht!=="all"&&f[ht][0],Ct.trim()&&`\u201C${Ct.trim()}\u201D`].filter(Boolean).join(" \xB7 "),rn=nt.findIndex(m=>m.id===J),ye=O?X?"\u5DE6\u53F3\u5E76\u6392\uFF1A\u70B9\u4E00\u4E0B\u5207\u6362\u4E3A\u4E0A\u4E0B\u5BF9\u7167":"\u4E0A\u4E0B\u5BF9\u7167\uFF1A\u70B9\u4E00\u4E0B\u5207\u6362\u4E3A\u5DE6\u53F3\u5E76\u6392":"\u5DEE\u5F02\u533A\u4E0D\u591F\u5BBD\uFF0C\u5DE6\u53F3\u5E76\u6392\u653E\u4E0D\u4E0B\uFF1A\u628A\u6587\u4EF6\u6811\u6536\u6210\u6D6E\u7A97\uFF0C\u6216\u8005\u628A\u7A97\u53E3\u62C9\u5BBD",ee=ot.viewed===ot.total,Nn=p.default.createElement(p.default.Fragment,null,p.default.createElement("div",{className:"wt-stackbar"},!y&&p.default.createElement("span",{className:"wt-treetoggle",ref:Bt,onPointerEnter:Oe("trigger"),onPointerLeave:fn("trigger")},p.default.createElement("button",{type:"button",ref:j,className:"wt-treetoggle-btn","aria-haspopup":"true","aria-expanded":q.open,"aria-controls":E,title:"\u6587\u4EF6\u5217\u8868\uFF1A\u9F20\u6807\u505C\u5728\u8FD9\u91CC\uFF0C\u6216\u8005\u70B9\u4E00\u4E0B",onClick:m=>q.open&&q.held?It(!0):Dt(!0,ce(m))},p.default.createElement(z,{name:"files",size:15}),p.default.createElement("span",{className:"wt-treetoggle-label"},We||"\u6587\u4EF6"," ",p.default.createElement("b",null,te?nt.length:b,te&&p.default.createElement("small",null,"/",b)))),te&&p.default.createElement("button",{type:"button",className:"wt-iconbtn",title:"\u6E05\u9664\u6587\u4EF6\u7B5B\u9009","aria-label":"\u6E05\u9664\u6587\u4EF6\u7B5B\u9009",onClick:hn},p.default.createElement(z,{name:"close",size:12}))),!y&&p.default.createElement("span",{className:"wt-spacer"}),nt.length>0&&p.default.createElement("span",{className:"wt-stepper",role:"group","aria-label":"\u4E0A\u4E00\u4E2A / \u4E0B\u4E00\u4E2A\u6587\u4EF6"},p.default.createElement("button",{type:"button",className:"wt-iconbtn",title:"\u4E0A\u4E00\u4E2A\u6587\u4EF6","aria-label":"\u4E0A\u4E00\u4E2A\u6587\u4EF6",disabled:nt.length<2,onClick:()=>kn(-1)},p.default.createElement(z,{name:"left",size:14})),p.default.createElement("b",null,rn<0?"\u2014":rn+1,"/",nt.length),p.default.createElement("button",{type:"button",className:"wt-iconbtn",title:"\u4E0B\u4E00\u4E2A\u6587\u4EF6","aria-label":"\u4E0B\u4E00\u4E2A\u6587\u4EF6",disabled:nt.length<2,onClick:()=>kn(1)},p.default.createElement(z,{name:"right",size:14}))),p.default.createElement(xi,{files:nt}),ot.total>0&&p.default.createElement(p.default.Fragment,null,p.default.createElement("span",{className:"wt-seen",role:"progressbar","aria-label":"\u5DF2\u5BA1\u9605\u7684\u6587\u4EF6","aria-valuemin":0,"aria-valuemax":ot.total,"aria-valuenow":ot.viewed,"aria-valuetext":`\u5DF2\u5BA1\u9605 ${ot.viewed} / ${ot.total}${ot.changed?`\uFF0C${ot.changed} \u4E2A\u5BA1\u9605\u540E\u53C8\u6709\u6539\u52A8`:""}`,"data-done":ee?"":void 0,title:ot.changed?`\u5DF2\u5BA1\u9605 ${ot.viewed} / ${ot.total}\uFF0C\u53E6\u6709 ${ot.changed} \u4E2A\u6587\u4EF6\u5BA1\u9605\u540E\u53C8\u6709\u6539\u52A8`:ee?"\u8FD9\u4E2A\u8303\u56F4\u7684\u6587\u4EF6\u90FD\u5DF2\u5BA1\u9605":`\u5DF2\u5BA1\u9605 ${ot.viewed} / ${ot.total} \u4E2A\u6587\u4EF6\uFF08\u952E\u76D8 V \u5207\u6362\u5F53\u524D\u6587\u4EF6\uFF09`},p.default.createElement(Tn,{share:ot.viewed/ot.total}),p.default.createElement("span",{className:"wt-seenlong"},"\u5DF2\u5BA1\u9605 ",ot.viewed," / ",ot.total),p.default.createElement("span",{className:"wt-seenshort"},ot.viewed,"/",ot.total)),p.default.createElement("button",{type:"button",className:"wt-linkbtn wt-seenall",title:ee?"\u6E05\u9664\u8FD9\u4E2A\u8303\u56F4\u91CC\u5168\u90E8\u7684\u5DF2\u5BA1\u9605\u6807\u8BB0":"\u628A\u773C\u4E0B\u663E\u793A\u7684\u6587\u4EF6\u5168\u90E8\u6807\u4E3A\u5DF2\u5BA1\u9605",onClick:()=>xe(!ee)},ee?"\u6E05\u9664\u5DF2\u5BA1\u9605":"\u5168\u90E8\u5DF2\u5BA1\u9605")),p.default.createElement("button",{type:"button",className:"wt-linkbtn",onClick:()=>bn(!Gt)},p.default.createElement(z,{name:Gt?"fold":"unfold",size:13}),p.default.createElement("span",{className:"wt-expandlabel"},Gt?"\u5168\u90E8\u6536\u8D77":"\u5168\u90E8\u5C55\u5F00")),p.default.createElement("span",{className:"wt-viewbtns",role:"group","aria-label":"\u5DEE\u5F02\u7684\u663E\u793A\u65B9\u5F0F"},p.default.createElement("button",{type:"button",className:"wt-iconbtn",title:ye,"aria-label":X?"\u5207\u6362\u4E3A\u4E0A\u4E0B\u5BF9\u7167":"\u5207\u6362\u4E3A\u5DE6\u53F3\u5E76\u6392","aria-pressed":X,disabled:!O,onClick:()=>wt(!X)},p.default.createElement(z,{name:X?"rows":"columns",size:15})),p.default.createElement("button",{type:"button",className:"wt-iconbtn",title:lt?"\u957F\u884C\u81EA\u52A8\u6362\u884C\uFF1A\u70B9\u4E00\u4E0B\u53D6\u6D88":"\u957F\u884C\u4E0D\u6362\u884C\uFF1A\u70B9\u4E00\u4E0B\u81EA\u52A8\u6362\u884C","aria-label":"\u81EA\u52A8\u6362\u884C","aria-pressed":lt,onClick:()=>B(!lt)},p.default.createElement(z,{name:"wrap",size:15})))),nt.map(m=>p.default.createElement(vi,{key:m.id,file:m,badge:St.get(m.path),open:Qt.has(m.id),notes:r?.get(m.id),reviewed:Q(m),onToggle:_t,onReviewed:oe,renderDiff:ve})),nn);return ae?p.default.createElement("div",{ref:g,className:"wt-filelist "+(y?"is-docked":"is-float"),style:{"--tree-w":`${S}px`},onPointerDown:m=>{tt.current=m.pointerType}},p.default.createElement("div",{className:"wt-diffstack",ref:Nt},Nn),y?p.default.createElement("div",{key:"docked",className:"wt-filetree"},ke({className:"wt-treepanel",ref:st})):p.default.createElement("div",{key:"float",className:"wt-treefloat"+(q.open?" is-open":""),onPointerEnter:Oe("panel"),onPointerLeave:fn("panel"),onFocus:m=>{!q.open&&m.target.matches?.(":focus-visible")&&Dt(!0,!0)},onBlur:m=>{let A=m.relatedTarget;!m.currentTarget.contains(A)&&!Bt.current?.contains(A)&&It(!1)}},p.default.createElement("button",{type:"button",className:"wt-treestrip","aria-label":"\u5C55\u5F00\u6587\u4EF6\u5217\u8868","aria-expanded":q.open,"aria-controls":E,title:"\u6587\u4EF6\u5217\u8868\uFF1A\u9F20\u6807\u505C\u5728\u8FD9\u91CC\uFF0C\u6216\u8005\u70B9\u4E00\u4E0B",onClick:m=>Dt(!0,ce(m))},p.default.createElement(z,{name:"grip",size:13})),R&&ke(yn))):p.default.createElement("div",{ref:g,className:"wt-filelist is-float"})}function xi({files:t}){let e=0,n=0;for(let r of t)e+=r.xy==="??"?r.lines??0:r.add??0,n+=r.del??0;return p.default.createElement("span",{className:"wt-fstat"},p.default.createElement("i",null,"+",e),p.default.createElement("i",null,"\u2212",n))}var vi=(0,p.memo)(function({file:e,badge:n,open:r,notes:o,reviewed:i,onToggle:d,onReviewed:c,renderDiff:l}){return p.default.createElement("div",{className:"wt-stackcard","data-file":e.id,"data-open":r?"":void 0,"data-viewed":i},r?p.default.createElement(fi,{placeholder:p.default.createElement("div",{className:"wt-filewait"})},l(e,n,i)):p.default.createElement("div",{className:"wt-filerow"},p.default.createElement("button",{type:"button",className:"wt-file wt-filehead",style:{"--depth":0},"aria-expanded":!1,title:`${e.path} \xB7 ${n.detail}`,onClick:()=>d(e)},p.default.createElement("span",{className:"wt-badge","data-tone":n.tone},n.code),p.default.createElement("span",{className:"wt-fname"},e.path,e.from&&p.default.createElement("small",null," \u2190 ",Fn(e.from))),i==="changed"&&p.default.createElement("small",{className:"wt-tag wt-tag-changed"},"\u6709\u65B0\u6539\u52A8"),p.default.createElement(Oo,{notes:o}),p.default.createElement("span",{className:"wt-fchange"},n.text),p.default.createElement(Ao,{file:e}),p.default.createElement(z,{name:"chevron",size:12,className:"wt-file-chevron"})),p.default.createElement(wr,{file:e,state:i,onChange:c})))});var C=Ht(require("react"),1);var At=Ht(require("react"),1);var Lo='button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';function Je({title:t,onClose:e,children:n,footer:r,wide:o,initialFocus:i}){let d=(0,At.useRef)(null),c=(0,At.useRef)(e);return c.current=e,(0,At.useEffect)(()=>{let l=document.activeElement,b=d.current;((i&&b?.querySelector(i))??b?.querySelector(".wt-modalfoot button")??b?.querySelector(Lo)??b)?.focus({preventScroll:!0});let f=g=>{if(g.key==="Escape"){g.stopPropagation(),c.current();return}if(g.key!=="Tab"||!b)return;let x=[...b.querySelectorAll(Lo)].filter(N=>N.offsetParent!==null);if(!x.length)return;let u=x[0],$=x.at(-1),y=document.activeElement;!b.contains(y)||y===b?(g.preventDefault(),(g.shiftKey?$:u).focus()):!g.shiftKey&&y===$?(g.preventDefault(),u.focus()):g.shiftKey&&y===u&&(g.preventDefault(),$.focus())};return document.addEventListener("keydown",f,!0),()=>{document.removeEventListener("keydown",f,!0),l instanceof HTMLElement&&l.isConnected&&l.focus({preventScroll:!0})}},[]),At.default.createElement("div",{className:"wt-modal-mask",onPointerDown:l=>{l.target===l.currentTarget&&e()}},At.default.createElement("div",{className:"wt-modal"+(o?" is-wide":""),role:"dialog","aria-modal":"true","aria-label":t,ref:d,tabIndex:-1},At.default.createElement("header",{className:"wt-modalhead"},At.default.createElement("h2",null,t),At.default.createElement("button",{className:"wt-iconbtn","aria-label":"\u5173\u95ED",onClick:e},At.default.createElement(z,{name:"close",size:16}))),At.default.createElement("div",{className:"wt-modalbody"},n),r&&At.default.createElement("footer",{className:"wt-modalfoot"},r)))}var Ho="worktree-desk.reviews",ur=()=>{try{return JSON.parse(localStorage.getItem(Ho)??"{}")}catch{return{}}},vt={key:(t,e)=>`${t}:${e.id}`,get(t){let e=ur()[t];return typeof e?.session=="string"?e:null},list(){let t=[];for(let[e,n]of Object.entries(ur())){if(typeof n?.session!="string")continue;let r=e.lastIndexOf(":"),o=e.slice(0,r),i=e.slice(r+1);o&&i&&t.push({key:e,repo:o,tree:i,session:n.session,at:typeof n.at=="number"?n.at:0,stamp:typeof n.stamp=="string"?n.stamp:"",scope:n.scope==="outgoing"?"outgoing":"uncommitted",custom:n.custom===!0})}return t},set(t,e){try{let n=ur();e?n[t]=e:delete n[t],localStorage.setItem(Ho,JSON.stringify(n))}catch{}}};function ki(t,e){if(t.status==="loading")return"\u6B63\u5728\u8BFB\u53D6 AI \u5BA1\u67E5\u7684\u7ED3\u679C";if(t.status==="error")return`AI \u5BA1\u67E5\u7684\u7ED3\u679C\u8BFB\u53D6\u5931\u8D25\uFF1A${t.error}`;let n=t.data;if(n.missing)return"\u627E\u4E0D\u5230\u8FD9\u6B21 AI \u5BA1\u67E5\u7684\u4F1A\u8BDD\uFF0C\u5B83\u53EF\u80FD\u5DF2\u7ECF\u88AB\u5220\u9664";if(!n.known)return"\u8FD9\u4E2A\u4F1A\u8BDD\u4E0D\u662F\u5DE5\u4F5C\u6811\u9762\u677F\u53D1\u8D77\u7684\u5BA1\u67E5";if(n.running)return`AI \u5BA1\u67E5\u8FDB\u884C\u4E2D\uFF0C${gt(t.entry.at,e)}\u53D1\u8D77`;if(!n.report)return n.problem?`AI \u5BA1\u67E5\u6CA1\u6709\u5B8C\u6210\uFF1A${n.problem}`:"AI \u5BA1\u67E5\u4F1A\u8BDD\u5DF2\u7ECF\u7ED3\u675F\uFF0C\u4F46\u6CA1\u6709\u7ED9\u51FA\u53EF\u8BFB\u53D6\u7684\u7ED3\u679C";let r=Ue(n.report.notes),o=r.filter(l=>l.level==="fix").length,i=[In[n.report.verdict][0]];o&&i.push(`\u5FC5\u987B\u5904\u7406 ${o}`),r.length>o&&i.push(`\u5EFA\u8BAE ${r.length-o}`);let d=t.entry.scope==="outgoing"?"\u672A\u63A8\u9001":"\u672A\u63D0\u4EA4",c=t.entry.custom?"\uFF0C\u6309\u672C\u4ED3\u5E93\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD":"";return`AI \u5BA1\u67E5\uFF08${d}\u7684\u6539\u52A8${c}\uFF09\uFF1A${i.join("\uFF0C")}\uFF08${gt(t.entry.at,e)}\uFF09`}var fr=(t,e)=>!!e&&!!t?.data?.report?.stamp&&t.data.report.stamp!==e;function jo({state:t,now:e,stamp:n}){if(!t)return null;let r=t.status==="ready"?t.data:null,o=r?.known&&!r.missing,i=o?r.report:null,d=o&&r.running,c=fr(t,n),l=i?Ue(i.notes).length:0;return C.default.createElement("b",{"data-k":"review","data-scope":t.entry.scope,"data-tone":i?In[i.verdict][1]:d?"running":"none","data-stale":c?"":void 0,title:ki(t,e)+(c?"\uFF1B\u5BA1\u67E5\u4E4B\u540E\u6539\u52A8\u6709\u53D8\u5316":i?"\u3002\u8BE6\u60C5\u91CC\u6709\u6BCF\u4E00\u5904\u7684\u6279\u6CE8":"")},d?C.default.createElement("span",{className:"wt-spinner wt-spinner-sm","aria-hidden":"true"}):C.default.createElement(z,{name:"spark",size:12}),!d&&l>0&&l)}var yi=(t,e)=>{let n=Math.floor((e-t)/6e4);return n<1?"\u4E0D\u5230 1 \u5206\u949F":n<60?`${n} \u5206\u949F`:`${Math.floor(n/60)} \u5C0F\u65F6 ${n%60} \u5206\u949F`};function Fo({copy:t,act:e}){return t?.count?C.default.createElement("button",{type:"button",className:"wt-linkbtn",title:"\u590D\u5236\u8FD8\u6CA1\u5BA1\u9605\u7684\u6587\u4EF6\u91CC\u7684\u5BA1\u67E5\u7ED3\u8BBA\uFF08\u5DF2\u5BA1\u9605\u7684\u4E0D\u590D\u5236\uFF09\uFF0C\u53EF\u4EE5\u76F4\u63A5\u8D34\u7ED9 AI \u53BB\u6539",onClick:()=>e.copy(t.text,`\u5DF2\u590D\u5236 ${t.count} \u6761\u5BA1\u67E5\u7ED3\u8BBA`)},C.default.createElement(z,{name:"copy",size:12}),"\u590D\u5236\u7ED3\u8BBA"):null}function Bo({state:t,act:e,repo:n,tree:r,retry:o,stale:i=!1,loose:d=0,copy:c=null,now:l}){if(!t)return null;let b=t.entry?.scope??"uncommitted",f=Vt(r,b)?.length>0&&e.review?C.default.createElement("button",{type:"button",className:"wt-linkbtn",onClick:()=>e.review(n.id,r,b)},C.default.createElement(z,{name:"refresh",size:12}),"\u91CD\u65B0\u5BA1\u67E5"):null,g=C.default.createElement("button",{type:"button",className:"wt-linkbtn",onClick:()=>e.openReview(t.entry.session)},C.default.createElement(z,{name:"chat",size:12}),"\u5BA1\u67E5\u4F1A\u8BDD"),x=e.editPrompt&&C.default.createElement("button",{type:"button",className:"wt-linkbtn",title:"\u8FD9\u4E2A\u4ED3\u5E93\u81EA\u5DF1\u914D\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD\uFF08\u53EA\u6362\u300C\u5BA1\u4EC0\u4E48\u3001\u91CD\u70B9\u627E\u4EC0\u4E48\u300D\uFF09",onClick:()=>e.editPrompt(n.id)},"\u5BA1\u67E5\u63D0\u793A\u8BCD",t.entry?.custom?"\uFF08\u672C\u4ED3\u5E93\uFF09":""),u=C.default.createElement("button",{type:"button",className:"wt-linkbtn",onClick:()=>e.forgetReview(n.id,r)},"\u6E05\u9664\u8BB0\u5F55");if(t.status==="loading")return C.default.createElement("div",{className:"wt-review is-running",role:"status"},C.default.createElement("span",{className:"wt-spinner","aria-hidden":"true"}),"\u6B63\u5728\u8BFB\u53D6\u5BA1\u67E5\u7ED3\u679C\u2026");if(t.status==="error")return C.default.createElement("div",{className:"wt-review is-failed",role:"alert"},C.default.createElement(z,{name:"warning",size:14}),"\u5BA1\u67E5\u7ED3\u679C\u8BFB\u53D6\u5931\u8D25\uFF1A",t.error,C.default.createElement("button",{type:"button",className:"wt-linkbtn",onClick:()=>o(n,r)},"\u91CD\u8BD5"),u);let{data:$}=t;if($.missing||!$.known)return C.default.createElement("div",{className:"wt-review is-failed",role:"status"},C.default.createElement(z,{name:"warning",size:14}),$.missing?"\u627E\u4E0D\u5230\u8FD9\u6B21\u5BA1\u67E5\u7684\u4F1A\u8BDD\uFF0C\u5B83\u53EF\u80FD\u5DF2\u7ECF\u88AB\u5220\u9664\u3002":"\u8FD9\u4E2A\u4F1A\u8BDD\u4E0D\u662F\u5DE5\u4F5C\u6811\u9762\u677F\u53D1\u8D77\u7684\u5BA1\u67E5\u3002",g,u);if($.running)return C.default.createElement("div",{className:"wt-review is-running",role:"status"},C.default.createElement("span",{className:"wt-spinner","aria-hidden":"true"}),"AI \u5BA1\u67E5",t.entry.scope==="outgoing"?"\u672A\u63A8\u9001\u7684\u6539\u52A8":"","\u8FDB\u884C\u4E2D \xB7 \u5DF2\u7528\u65F6 ",yi(t.entry.at,l),C.default.createElement("span",{className:"wt-reviewhint"},"\u7ED3\u679C\u51FA\u6765\u540E\u4F1A\u6807\u5728\u6BCF\u4E00\u5904\u6539\u52A8\u65C1\u8FB9"),C.default.createElement("span",{className:"wt-spacer"}),g,x);if(!$.report)return C.default.createElement("div",{className:"wt-review is-failed",role:"status"},C.default.createElement(z,{name:"warning",size:14}),$.problem?`\u5BA1\u67E5\u6CA1\u6709\u5B8C\u6210\uFF1A${$.problem}`:"\u5BA1\u67E5\u4F1A\u8BDD\u5DF2\u7ECF\u7ED3\u675F\uFF0C\u4F46\u6CA1\u6709\u7ED9\u51FA\u53EF\u8BFB\u53D6\u7684\u7ED3\u679C\u3002",C.default.createElement("span",{className:"wt-reviewhint"},"\u53EF\u4EE5\u6253\u5F00\u4F1A\u8BDD\u770B\u770B\u8BE6\u60C5"),C.default.createElement("span",{className:"wt-spacer"}),g,f,x);let y=$.report,N=Ue(y.notes),S=N.filter(L=>L.level==="fix").length,[O,E]=In[y.verdict];return C.default.createElement("div",{className:"wt-review is-done","data-verdict":y.verdict},C.default.createElement("span",{className:"wt-reviewicon","data-tone":E},C.default.createElement(z,{name:y.verdict==="pass"?"check":"warning",size:14})),C.default.createElement("b",null,O),t.entry.scope==="outgoing"&&C.default.createElement("span",{className:"wt-reviewhint"},"\u5BA1\u7684\u662F\u672A\u63A8\u9001\u7684\u6539\u52A8"),t.entry.custom&&C.default.createElement("span",{className:"wt-reviewhint"},"\u6309\u672C\u4ED3\u5E93\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD"),C.default.createElement("span",{className:"wt-reviewcounts"},ge.fix[0]," ",C.default.createElement("b",null,S)," \xB7 ",ge.warn[0]," ",C.default.createElement("b",null,N.length-S)),C.default.createElement("span",{className:"wt-reviewsummary",title:y.summary},y.summary),C.default.createElement("span",{className:"wt-spacer"}),i&&C.default.createElement("span",{className:"wt-reviewstale",title:"\u5BA1\u67E5\u4E4B\u540E\u8FD9\u4E2A\u5DE5\u4F5C\u6811\u7684\u6539\u52A8\u6709\u53D8\u5316\uFF0C\u7ED3\u8BBA\u7684\u4F4D\u7F6E\u53EF\u80FD\u5BF9\u4E0D\u4E0A\u73B0\u5728\u7684\u884C"},"\u6539\u52A8\u5DF2\u53D8\u5316\uFF0C\u6279\u6CE8\u4F4D\u7F6E\u53EF\u80FD\u4E0D\u51C6"),d>0&&C.default.createElement("span",{className:"wt-reviewstale",title:"\u8FD9\u4E9B\u6279\u6CE8\u6307\u5411\u7684\u6587\u4EF6\u4E0D\u5728\u5F53\u524D\u7684\u6539\u52A8\u91CC"},"\u53E6\u6709 ",d," \u6761\u5BF9\u4E0D\u4E0A\u4F4D\u7F6E"),C.default.createElement(Fo,{copy:c,act:e}),g,f,x)}var Ni={all:"\u5168\u90E8",fix:"\u5FC5\u987B\u5904\u7406",warn:"\u5EFA\u8BAE"},Po=t=>t.line?t.side==="old"?`\u65E7\u7B2C ${t.line} \u884C`:`\u7B2C ${t.line} \u884C`:t.hunk?`\u7B2C ${t.hunk} \u5757`:"";function qo({report:t,copy:e,act:n,onPrompt:r}){let[o,i]=(0,C.useState)("all"),d=Ue(t.notes),c={fix:d.filter(f=>f.level==="fix").length,warn:d.filter(f=>f.level==="warn").length},l=(0,C.useMemo)(()=>{let f=new Map;for(let g of d)o!=="all"&&g.level!==o||(f.has(g.file)||f.set(g.file,[]),f.get(g.file).push(g));return[...f]},[d,o]),b=f=>f.some(g=>g.level==="fix")?"fix":"warn";return C.default.createElement("div",{className:"wt-rnotes"},C.default.createElement("div",{className:"wt-rbar"},C.default.createElement("div",{className:"wt-seg wt-seg-sm",role:"tablist","aria-label":"\u770B\u54EA\u4E00\u7C7B\u7ED3\u8BBA"},["all","fix","warn"].filter(f=>f==="all"||c[f]).map(f=>C.default.createElement("button",{key:f,role:"tab","aria-selected":o===f,onClick:()=>i(f)},Ni[f],f!=="all"&&C.default.createElement("b",null,c[f])))),C.default.createElement("span",{className:"wt-rhint"},o==="all"?"\u8981\u5904\u7406\u7684\u7ED3\u8BBA\u6309\u6587\u4EF6\u5217\u5728\u4E0B\u9762\uFF0C\u5DEE\u5F02\u91CC\u4E5F\u6807\u5728\u5BF9\u5E94\u7684\u4EE3\u7801\u884C\u65C1":"\u53EA\u5217\u8FD9\u4E00\u7C7B\u7ED3\u8BBA"),C.default.createElement("span",{className:"wt-spacer"}),r&&C.default.createElement("button",{type:"button",className:"wt-linkbtn",title:"\u8FD9\u4E2A\u4ED3\u5E93\u81EA\u5DF1\u914D\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD\uFF08\u53EA\u6362\u300C\u5BA1\u4EC0\u4E48\u3001\u91CD\u70B9\u627E\u4EC0\u4E48\u300D\uFF09",onClick:r},"\u5BA1\u67E5\u63D0\u793A\u8BCD"),C.default.createElement(Fo,{copy:e,act:n})),l.map(([f,g])=>C.default.createElement("section",{className:"wt-rfile",key:f,"data-level":b(g)},C.default.createElement("h3",{className:"wt-rfilehead"},C.default.createElement(z,{name:"file",size:13}),C.default.createElement("span",{className:"wt-rfilepath",title:f},f),C.default.createElement("b",null,g.length)),C.default.createElement("div",{className:"wt-rlist"},g.map((x,u)=>{let $=x.body&&x.body!==x.title?x.body:"";return C.default.createElement("div",{className:"wt-note","data-level":x.level,key:u},C.default.createElement("div",{className:"wt-rnotehead"},C.default.createElement("i",{className:"wt-notedot",title:ge[x.level][0]}),Po(x)&&C.default.createElement("span",{className:"wt-rline"},Po(x)),C.default.createElement("span",{className:"wt-notetitle"},x.title||ge[x.level][0]),C.default.createElement("small",{className:"wt-notetag"},ge[x.level][0])),$&&C.default.createElement("p",{className:"wt-notebody"},$))})))),!l.length&&C.default.createElement("p",{className:"wt-emptyline"},d.length?"\u6CA1\u6709\u8FD9\u4E00\u7C7B\u7684\u7ED3\u8BBA\u3002":"\u8FD9\u6B21\u5BA1\u67E5\u6CA1\u6709\u8981\u5904\u7406\u7684\u7ED3\u8BBA\u3002"))}function _o({repo:t,act:e,onClose:n}){let[r,o]=(0,C.useState)(""),[i,d]=(0,C.useState)(null),[c,l]=(0,C.useState)(""),[b,f]=(0,C.useState)(""),[g,x]=(0,C.useState)(!0),u=(0,C.useRef)(null),$=i!==null;(0,C.useEffect)(()=>{$&&u.current?.focus({preventScroll:!0})},[$]),(0,C.useEffect)(()=>{let S=new AbortController;return e.loadPrompt(t.id,S.signal).then(({prompt:O,file:E})=>{S.signal.aborted||(o(O),d(O),l(E??""),x(!1))}).catch(O=>{S.signal.aborted||(f(`\u8BFB\u53D6\u5931\u8D25\uFF1A${O.message}`),x(!1))}),()=>S.abort()},[]);let y=i!==null&&r.trim()!==i,N=async()=>{x(!0),f("");try{await e.savePrompt(t.id,r),n()}catch(S){f(`\u4FDD\u5B58\u5931\u8D25\uFF1A${S.message}`),x(!1)}};return C.default.createElement(Je,{title:"\u672C\u4ED3\u5E93\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD",wide:!0,initialFocus:".wt-promptbox",onClose:()=>!g&&n(),footer:C.default.createElement(C.default.Fragment,null,C.default.createElement("button",{type:"button",className:"wt-btn",disabled:g||!i||!r.trim(),title:"\u6E05\u7A7A\uFF0C\u6539\u7528\u9ED8\u8BA4\u7684\u63D0\u793A\u8BCD\uFF08\u8981\u70B9\u300C\u4FDD\u5B58\u300D\u624D\u751F\u6548\uFF09",onClick:()=>o("")},"\u6539\u7528\u9ED8\u8BA4"),C.default.createElement("span",{className:"wt-spacer"}),C.default.createElement("button",{type:"button",className:"wt-btn",disabled:g,onClick:n},"\u53D6\u6D88"),C.default.createElement("button",{type:"button",className:"wt-btn is-primary",disabled:g||!y,onClick:N},g?"\u5904\u7406\u4E2D\u2026":"\u4FDD\u5B58"))},C.default.createElement("p",{className:"wt-dsub"},C.default.createElement("span",{className:"wt-drepo"},t.name),C.default.createElement(Xt,{className:"wt-dpath",title:t.path,text:t.path})),C.default.createElement("p",{className:"wt-dtext"},"\u8FD9\u91CC\u5199\u7684\u66FF\u6362\u9ED8\u8BA4\u7684",C.default.createElement("b",null,"\u57FA\u672C\u63D0\u793A\u8BCD"),"\uFF1A\u5BA1\u4EC0\u4E48\u3001\u91CD\u70B9\u627E\u4EC0\u4E48\uFF08\u6BD4\u5982\u672C\u4ED3\u5E93\u7684\u7EA6\u5B9A\u3001\u6700\u5728\u610F\u7684\u90A3\u51E0\u7C7B\u95EE\u9898\u3001 \u7528\u5230\u7684\u6846\u67B6\u548C\u89C4\u8303\uFF09\u3002\u8303\u56F4\u3001\u67E5\u770B\u65B9\u6CD5\u3001\u53EA\u8BFB\u7EA6\u675F\u548C\u8F93\u51FA\u683C\u5F0F\u7531\u9762\u677F\u56FA\u5B9A\u7ED9\u51FA\uFF0C\u4E0D\u7528\u5199\u3002\u7559\u7A7A\u5C31\u662F\u7528\u9ED8\u8BA4\u7684\u3002"),C.default.createElement("textarea",{ref:u,className:"wt-promptbox","aria-label":"\u672C\u4ED3\u5E93\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD",placeholder:dn(),spellCheck:!1,value:r,disabled:i===null,onChange:S=>o(S.target.value)}),C.default.createElement("p",{className:"wt-dtext wt-promptmeta"},r.trim().length," / 20000 \u5B57",c&&C.default.createElement(C.default.Fragment,null," \xB7 ","\u5B58\u5728 ",C.default.createElement("code",{title:c},c),"\uFF0C\u4E5F\u53EF\u4EE5\u76F4\u63A5\u6539\u8FD9\u4E2A\u6587\u4EF6")),C.default.createElement("details",{className:"wt-promptdefault"},C.default.createElement("summary",null,"\u9ED8\u8BA4\u63D0\u793A\u8BCD\u5199\u7684\u662F\u4EC0\u4E48"),C.default.createElement("p",null,"\u5BA1\u672A\u63D0\u4EA4\u7684\u6539\u52A8\u65F6\uFF1A"),C.default.createElement("pre",null,dn("uncommitted")),C.default.createElement("p",null,"\u5BA1\u672A\u63A8\u9001\u7684\u6539\u52A8\u65F6\uFF1A"),C.default.createElement("pre",null,dn("outgoing"))),b&&C.default.createElement("p",{className:"wt-notice is-danger",role:"alert"},C.default.createElement(z,{name:"warning",size:14}),b))}var vr="worktree-desk.view";var mr=/^[0-9a-f]{32}$/,hr=t=>typeof t=="string"&&/^[0-9a-f]{32}:[0-9a-f]{32}$/.test(t),Wo=t=>typeof t=="string"&&mr.test(t),cn=(t,e=80)=>typeof t=="string"?t.slice(0,e):"",wn=(t,e=300)=>Array.isArray(t)?[...new Set(t.filter(n=>typeof n=="string").map(n=>n.slice(0,e)))].slice(0,400):[],Si=t=>Number.isFinite(t)&&t>=0&&t<=1e7?Math.round(t):0,Go=(t,e)=>e.includes(t)?t:"",gr=t=>Number.isFinite(t?.at)?t.at:0;function kr(t){let e=t&&typeof t=="object"?t:{},{selected:n}=e;return{scope:e.scope==="all"||mr.test(e.scope??"")?e.scope:"all",query:cn(e.query,200),filter:cn(e.filter,20),tool:cn(e.tool,20),stack:e.stack===1?1:0,selected:mr.test(n?.repo??"")&&typeof n?.path=="string"&&n.path.length>0&&n.path.length<=4096?{repo:n.repo,path:n.path}:null,collapsed:wn(e.collapsed,80),staleOpen:wn(e.staleOpen,80),quietOpen:e.quietOpen===!0,branchesOpen:e.branchesOpen===!0,top:Si(e.top)}}function br(t){let e=t&&typeof t=="object"?t:{},n=e.dirs&&typeof e.dirs=="object"?e.dirs:null,{anchor:r}=e;return{filter:cn(e.filter,20),query:cn(e.query,200),how:Go(e.how,["auto","all","custom"]),open:wn(e.open,80).filter(Wo),dirs:n?{all:n.all===!0,on:wn(n.on),off:wn(n.off)}:null,anchor:Wo(r?.file)&&Number.isFinite(r?.offset)&&Math.abs(r.offset)<=1e6?{file:r.file,offset:r.offset}:null}}function xr(t){let e=t&&typeof t=="object"?t:{},n=e.scopes&&typeof e.scopes=="object"?e.scopes:{};return{tab:Go(e.tab,["uncommitted","outgoing","sessions","review"]),scopes:{uncommitted:br(n.uncommitted),outgoing:br(n.outgoing)}}}function Ci(t){let e;try{e=JSON.parse(t??"")}catch{return null}if(e?.v!==1||typeof e!="object")return null;let n={};for(let[r,o]of Object.entries(e.trees??{}))hr(r)&&(n[r]={...xr(o),at:gr(o)});return{list:kr(e.list),trees:n}}function $i(t){return JSON.stringify({v:1,...t})}var Ae=null,Ye=0,Vo=0,zi=()=>Vo=Math.max(Date.now(),Vo+1),Ko=!1,Uo=()=>({list:kr({}),trees:{}}),Xo=()=>{if(clearTimeout(Ye),Ye=0,!!Ae)try{localStorage.setItem(vr,$i(Ae))}catch{}},Zo=()=>{clearTimeout(Ye),Ye=setTimeout(Xo,300)},Bn=()=>{if(Ae)return Ae;let t=null;try{t=Ci(localStorage.getItem(vr))}catch{}return Ae=t??Uo(),Ko||(Ko=!0,typeof addEventListener=="function"&&addEventListener("pagehide",Xo)),Ae},de={load(){return Bn()},tree(t){return xr(hr(t)?Bn().trees[t]:null)},saveList(t){let e=Bn();e.list=kr({...e.list,...t}),Zo()},saveTree(t,e){if(!hr(t))return;let n=Bn(),r=n.trees[t],o={...r?.scopes};for(let d of["uncommitted","outgoing"])e.scopes?.[d]&&(o[d]=br({...r?.scopes?.[d],...e.scopes[d]}));let i={...n.trees,[t]:{...xr({tab:e.tab??r?.tab,scopes:o}),at:zi()}};n.trees=Object.fromEntries(Object.entries(i).sort((d,c)=>gr(c[1])-gr(d[1])).slice(0,24)),Zo()},clear(){clearTimeout(Ye),Ye=0,Ae=Uo();try{localStorage.removeItem(vr)}catch{}}};var Ti={Codex:"C",ZCode:"Z",DSH:"D"};function Mi(t){let e=t.origin;if(!e)return"\u65E0\u521B\u5EFA\u8BB0\u5F55";if(e.kind==="initial")return"\u4ED3\u5E93\u7684\u9996\u6B21\u63D0\u4EA4";if(!e.ref)return"\u67D0\u6B21\u63D0\u4EA4\uFF08\u5206\u652F\u540D\u672A\u8BB0\u5F55\uFF09";let n=/^[0-9a-f]{7,64}$/i.test(e.ref);return e.kind==="copy"?`\u590D\u5236\u81EA ${e.ref}`:n&&e.sha.toLowerCase().startsWith(e.ref.toLowerCase())||e.ref==="HEAD"?"\u67D0\u6B21\u63D0\u4EA4\uFF08\u5206\u652F\u540D\u672A\u8BB0\u5F55\uFF09":`\u521B\u5EFA\u81EA ${e.ref}`}function Ei({tree:t}){let e=t.status;return w.default.createElement("span",{className:"wt-todo"},e?.ahead>0&&w.default.createElement("span",{className:"wt-fstate","data-tone":"accent",title:"\u6309\u672C\u5730\u8BB0\u5F55\u6BD4\u8F83\uFF0C\u4E0D\u8054\u7F51\u66F4\u65B0"},e.ahead," \u4E2A\u63D0\u4EA4\u672A\u63A8\u9001"),e?.behind>0&&w.default.createElement("span",{className:"wt-fstate","data-tone":"warn",title:"\u6309\u672C\u5730\u8BB0\u5F55\u6BD4\u8F83\uFF0C\u4E0D\u8054\u7F51\u66F4\u65B0"},"\u843D\u540E\u4E0A\u6E38 ",e.behind," \u4E2A\u63D0\u4EA4"))}function Ai({tree:t}){let e=t.status;return!t.tools?.length&&!t.branch?null:w.default.createElement("p",{className:"wt-refs"},t.tools.map(n=>w.default.createElement("span",{key:n,className:"wt-tool",title:`${n}\uFF1A\u8FD9\u4E2A\u76EE\u5F55\u91CC\u6709\u5B83\u7684\u672A\u5F52\u6863\u4F1A\u8BDD`},w.default.createElement("i",null,Ti[n]??n[0]))),t.branch&&w.default.createElement("span",{className:"wt-ref",title:"\u6765\u6E90\uFF1A\u672C\u5730 Git \u5206\u652F\u5F15\u7528\u65E5\u5FD7\u3002\u8D77\u70B9\u4E0D\u7B49\u4E8E\u5F53\u524D\u8DDF\u8E2A\u7684\u4E0A\u6E38\u3002"},w.default.createElement("i",null,"\u8D77\u70B9"),Mi(t)),e&&t.branch&&w.default.createElement("span",{className:"wt-ref",title:e.upstream?`\u6309\u672C\u5730\u8BB0\u5F55\u6BD4\u8F83\uFF0C\u4E0D\u8054\u7F51\u66F4\u65B0\uFF1A\u9886\u5148 ${e.ahead}\uFF0C\u843D\u540E ${e.behind}`:"\u6B64\u5206\u652F\u6CA1\u6709\u9ED8\u8BA4\u5BF9\u6BD4\u5BF9\u8C61\uFF1B\u4E0D\u7B49\u4E8E\u4ECE\u672A\u63A8\u9001"},w.default.createElement("i",null,"\u4E0A\u6E38"),w.default.createElement("code",null,e.upstream??"\u672A\u8BBE\u7F6E")))}var Oi=[["fetch","\u83B7\u53D6","fetch",()=>"\u53D6\u56DE\u8FDC\u7AEF\u7684\u6700\u65B0\u8BB0\u5F55\uFF0C\u8BA9\u672A\u63A8\u9001 / \u843D\u540E\u7684\u6570\u5B57\u53D8\u51C6"],["pull","\u62C9\u53D6","pull",(t,e)=>e?.upstream?e.behind>0?`\u628A\u5F53\u524D\u5206\u652F\u5FEB\u8FDB\u5230\u8FDC\u7AEF\uFF1A\u6309\u672C\u5730\u8BB0\u5F55\u843D\u540E ${e.behind} \u4E2A\u63D0\u4EA4`:"\u53D6\u56DE\u8FDC\u7AEF\u66F4\u65B0\uFF0C\u80FD\u5FEB\u8FDB\u5C31\u5FEB\u8FDB\u5F53\u524D\u5206\u652F":"\u8FD9\u4E2A\u5206\u652F\u6CA1\u6709\u8BBE\u7F6E\u4E0A\u6E38\uFF0C\u4E0D\u80FD\u62C9\u53D6"],["push","\u63A8\u9001","push",(t,e)=>e?.upstream?e.ahead>0?`\u628A ${e.ahead} \u4E2A\u63D0\u4EA4\u63A8\u5230\u8FDC\u7AEF\u7684\u540C\u540D\u5206\u652F`:"\u6CA1\u6709\u672A\u63A8\u9001\u7684\u63D0\u4EA4":"\u8FD9\u4E2A\u5206\u652F\u8FD8\u6CA1\u6709\u4E0A\u6E38\uFF1A\u63A8\u9001\u65F6\u4F1A\u5728\u8FDC\u7AEF\u5EFA\u7ACB\u540C\u540D\u5206\u652F"]];function Di({repo:t,tree:e,act:n}){let r=e.status,[o,i]=(0,w.useState)(!1),d=e.operations?.length?`\u6709\u64CD\u4F5C\u8FD8\u6CA1\u505A\u5B8C\uFF08${e.operations.join("\u3001")}\uFF09`:e.detached?"\u5F53\u524D\u505C\u5728\u67D0\u6B21\u63D0\u4EA4\u4E0A\uFF08\u5206\u79BB HEAD\uFF09\uFF0C\u4E0D\u5728\u5206\u652F\u4E0A":"",c=l=>d?[!1,d]:l==="fetch"?[!0,""]:l==="pull"?r?.upstream?r.ahead>0&&r.behind>0?[!1,"\u672C\u5730\u548C\u8FDC\u7AEF\u5404\u6709\u5BF9\u65B9\u6CA1\u6709\u7684\u63D0\u4EA4\uFF0C\u4E0D\u80FD\u5FEB\u8FDB\uFF1A\u8BF7\u5728\u7EC8\u7AEF\u91CC\u5408\u5E76\u6216\u53D8\u57FA"]:[!0,""]:[!1,"\u8FD9\u4E2A\u5206\u652F\u6CA1\u6709\u8BBE\u7F6E\u4E0A\u6E38\uFF0C\u4E0D\u80FD\u62C9\u53D6"]:r?.upstream&&r.ahead===0?[!1,"\u6CA1\u6709\u672A\u63A8\u9001\u7684\u63D0\u4EA4"]:[!0,""];return w.default.createElement("span",{className:"wt-agroup wt-sync",role:"group","aria-label":"\u4E0E\u8FDC\u7AEF\u540C\u6B65"},Oi.map(([l,b,f,g])=>{let[x,u]=c(l),$=l==="pull"?r?.behind:l==="push"?r?.ahead:0;return w.default.createElement("button",{key:l,type:"button",className:"wt-btn",disabled:!x,title:x?g(e,r):u,onClick:async()=>{if(l!=="fetch")return n.sync(t.id,e,l);i(!0);try{await n.sync(t.id,e,l)}finally{i(!1)}}},w.default.createElement(z,{name:f,size:14}),w.default.createElement("span",{className:"wt-btnlabel"},b),o&&w.default.createElement("span",{className:"wt-spinner wt-spinner-sm","aria-hidden":"true"}),x&&!o&&$>0&&w.default.createElement("b",null,$))}))}function Ii({repo:t,tree:e,services:n,apps:r,act:o,renderFactorySlot:i,review:d,reviewScope:c,prompted:l=!1}){let b=n.state.dsh,f=!e.prunable&&!e.error,g=Vt(e,c)?.length>0,x=d?.status==="ready"&&d.data.known&&!d.data.missing&&!!d.data.running,u=e.sessions.filter(y=>y.source==="DSH"&&!y.archived),$=r.filter((y,N)=>r.findIndex(S=>S.group===y.group)===N);return w.default.createElement("div",{className:"wt-actions"},b&&f&&w.default.createElement(w.default.Fragment,null,w.default.createElement("span",{className:"wt-agroup",role:"group","aria-label":"DSH \u4F1A\u8BDD"},u.length>0&&w.default.createElement("button",{className:"wt-btn is-primary",title:`\u6253\u5F00\u6700\u8FD1\u7684 DSH \u4F1A\u8BDD\uFF1A${u[0].title||u[0].id}`,onClick:()=>o.openDsh(e)},w.default.createElement(z,{name:"bubble",size:15}),w.default.createElement("span",{className:"wt-btnlabel"},"\u6253\u5F00 DSH \u4F1A\u8BDD")),w.default.createElement("button",{className:"wt-btn is-primary"+(u.length?" is-icon":""),title:"\u628A\u8FD9\u4E2A\u76EE\u5F55\u767B\u8BB0\u4E3A\u5DE5\u4F5C\u533A\uFF0C\u5E76\u6253\u5F00\u4E00\u4E2A\u65B0\u7684 DSH \u4F1A\u8BDD","aria-label":u.length?"\u65B0\u5F00\u4F1A\u8BDD":"\u5728 DSH \u65B0\u5F00\u4F1A\u8BDD",onClick:()=>o.newDsh(e)},w.default.createElement(z,{name:"chat",size:15}),u.length?w.default.createElement("span",{className:"wt-vh"},"\u65B0\u5F00\u4F1A\u8BDD"):w.default.createElement("span",{className:"wt-btnlabel"},w.default.createElement("span",{className:"wt-btnlong"},"\u5728 DSH "),"\u65B0\u5F00\u4F1A\u8BDD"))),g&&o.review&&w.default.createElement("button",{className:"wt-btn",disabled:x,title:(x?"\u8FD9\u68F5\u5DE5\u4F5C\u6811\u7684 AI \u5BA1\u67E5\u8FD8\u5728\u8FDB\u884C\uFF0C\u7ED3\u679C\u51FA\u6765\u540E\u4F1A\u6807\u5728\u5BF9\u5E94\u7684\u4EE3\u7801\u884C\u65C1":c==="outgoing"?"\u5728\u8FD9\u4E2A\u76EE\u5F55\u65B0\u5F00\u4E00\u4E2A DSH \u4F1A\u8BDD\uFF0C\u5BA1\u67E5\u8FD8\u6CA1\u63A8\u5230\u8FDC\u7AEF\u7684\u6539\u52A8\uFF08\u672A\u63A8\u9001\u7684\u63D0\u4EA4\u548C\u8FD8\u6CA1\u63D0\u4EA4\u7684\uFF0C\u53EA\u8BFB\uFF09\u3002\u5BA1\u5B8C\u540E\u8981\u5904\u7406\u7684\u5730\u65B9\u4F1A\u6807\u5728\u5BF9\u5E94\u7684\u4EE3\u7801\u884C\u65C1":"\u5728\u8FD9\u4E2A\u76EE\u5F55\u65B0\u5F00\u4E00\u4E2A DSH \u4F1A\u8BDD\u6765\u5BA1\u67E5\u672A\u63D0\u4EA4\u7684\u6539\u52A8\uFF08\u53EA\u8BFB\uFF09\u3002\u5BA1\u5B8C\u540E\u8981\u5904\u7406\u7684\u5730\u65B9\u4F1A\u6807\u5728\u5BF9\u5E94\u7684\u4EE3\u7801\u884C\u65C1")+(l?"\u3002\u7528\u7684\u662F\u672C\u4ED3\u5E93\u81EA\u5DF1\u914D\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD":""),"aria-label":"AI \u5BA1\u67E5",onClick:()=>o.review(t.id,e,c)},w.default.createElement(z,{name:"spark",size:15}),w.default.createElement("span",{className:"wt-btnlabel"},"AI \u5BA1\u67E5"))),f&&o.features?.includes("sync")&&w.default.createElement(Di,{repo:t,tree:e,act:o}),w.default.createElement("span",{className:"wt-agroup wt-apps"},f&&$.map(y=>w.default.createElement("button",{key:y.app,type:"button",className:"wt-iconbtn wt-appbtn",title:y.label,"aria-label":y.label,onClick:()=>o.openApp(t.id,e,y)},w.default.createElement(z,{name:y.icon,size:15}))),i?.("contextMenu.button",{target:{kind:Te,value:{repo:t.id,path:e.path}},label:"\u66F4\u591A\u64CD\u4F5C",className:"wt-menu-btn wt-btn-more"})))}function Li({tree:t,repository:e,services:n,act:r,now:o,codexNavigation:i,reviewSession:d}){let[c,l]=(0,w.useState)(8),[b,f]=(0,w.useState)(!1),g=t.sessions.filter(N=>!N.archived),x=t.sessions.filter(N=>N.archived),u=(b?[...g,...x]:g).slice(0,c),$=N=>!N.archived&&(N.source==="DSH"?!!n.dsh:N.source==="ZCode"||N.source==="Codex"?!!i:!1),y=N=>N.source==="DSH"?"\u6253\u5F00\u4F1A\u8BDD":N.source==="Codex"?"\u5728 Codex \u6253\u5F00":N.title?"\u590D\u5236\u6807\u9898\u5E76\u6253\u5F00 ZCode":"\u6253\u5F00 ZCode";return w.default.createElement(w.default.Fragment,null,u.length?w.default.createElement("ul",{className:"wt-sessions"},u.map(N=>w.default.createElement("li",{className:"wt-session",key:`${N.source}:${N.id}`},w.default.createElement("span",{className:"wt-toolchip","data-tool":N.source},N.source),w.default.createElement("div",{className:"wt-sbody"},w.default.createElement("span",{className:"wt-stitle",title:N.title||N.id},N.title||N.id),N.source==="DSH"&&N.id===d&&w.default.createElement("small",{className:"wt-tag",title:"\u8FD9\u4E2A\u4F1A\u8BDD\u662F\u5DE5\u4F5C\u6811\u9762\u677F\u53D1\u8D77\u7684\u4EE3\u7801\u5BA1\u67E5"},w.default.createElement(z,{name:"review",size:11}),"\u4EE3\u7801\u5BA1\u67E5"),w.default.createElement("small",null,N.running?"\u8FD0\u884C\u4E2D \xB7 ":"",w.default.createElement("span",{title:Et(N.time)},gt(N.time,o))," \xB7 ",N.evidence,N.archived?" \xB7 \u5DF2\u5F52\u6863":"")),w.default.createElement("div",{className:"wt-sacts"},$(N)&&w.default.createElement("button",{className:"wt-linkbtn",onClick:()=>r.openTool(t,N,e)},y(N),w.default.createElement(z,{name:"external",size:12})),w.default.createElement(Yn,{value:N.id,label:"\u5DF2\u590D\u5236\u4F1A\u8BDD ID",act:r,title:"\u590D\u5236\u4F1A\u8BDD ID"}))))):w.default.createElement("p",{className:"wt-emptyline"},b||!x.length?"\u672A\u5339\u914D\u5230\u4F1A\u8BDD\u8BB0\u5F55\uFF0C\u4E0D\u80FD\u636E\u6B64\u5224\u65AD\u5DE5\u4F5C\u6811\u662F\u5426\u6709\u4EBA\u4F7F\u7528\u3002":"\u6CA1\u6709\u672A\u5F52\u6863\u7684\u4F1A\u8BDD\u3002"),w.default.createElement("div",{className:"wt-sessionbar"},(b?g.length+x.length:g.length)>u.length&&w.default.createElement("button",{className:"wt-linkbtn",onClick:()=>l(c+12)},"\u518D\u663E\u793A"," ",Math.min(12,(b?t.sessions.length:g.length)-u.length)," ","\u6761"),x.length>0&&w.default.createElement("button",{className:"wt-linkbtn",onClick:()=>f(!b)},b?`\u9690\u85CF ${x.length} \u4E2A\u5DF2\u5F52\u6863\u4F1A\u8BDD`:`\u663E\u793A ${x.length} \u4E2A\u5DF2\u5F52\u6863\u4F1A\u8BDD`)))}function Pi({out:t,now:e}){let[n,r]=(0,w.useState)(!1),o=n?t.commits:t.commits.slice(0,4),i=t.commits.length;return w.default.createElement("div",{className:"wt-outgoing"},w.default.createElement("p",{className:"wt-outgoinghead"},"\u548C\u4E0A\u6E38 ",w.default.createElement("code",null,t.ref)," \u6BD4\uFF1A",i?`${i}${t.more?"+":""} \u4E2A\u63D0\u4EA4\u8FD8\u6CA1\u63A8\u9001`:"\u6709\u63D0\u4EA4\u8FD8\u6CA1\u63A8\u9001",t.total>0&&`\uFF0C${t.total} \u4E2A\u6587\u4EF6\u6709\u6539\u52A8`),w.default.createElement("ul",{className:"wt-commits"},o.map(d=>w.default.createElement("li",{key:d.sha},w.default.createElement("code",{title:d.sha},d.sha.slice(0,10)),w.default.createElement("time",{title:Et(d.time)},gt(d.time,e)),w.default.createElement("span",{className:"wt-dsubject",title:d.title},d.title)))),i>o.length&&w.default.createElement("button",{className:"wt-linkbtn",onClick:()=>r(!0)},"\u8FD8\u6709 ",i-o.length," \u4E2A\u63D0\u4EA4"),n&&t.more&&w.default.createElement("span",{className:"wt-outgoingmore"},"\u66F4\u65E9\u7684\u63D0\u4EA4\u6CA1\u6709\u5217\u51FA"))}function Hi({repo:t,tree:e,showRepo:n,onBack:r,onExpandList:o,onTicket:i,services:d,apps:c,act:l,now:b,getTriggerProps:f,renderFactorySlot:g,requestPrune:x,reload:u,home:$,review:y,retryReview:N}){let S=vt.key(t.id,e),[O]=(0,w.useState)(()=>({get:()=>de.tree(S),area:(j,st)=>de.saveTree(S,{scopes:{[j]:st}})})),E=y?.status==="ready"?y.data.report:null,L=(0,w.useMemo)(()=>lo(E),[E]),F=y?.entry?.scope??"uncommitted",Y=()=>{let j=ln(e);return le(e,j)>0?j:y?"review":"sessions"},[U,D]=(0,w.useState)(()=>{let j=O.get().tab;return j==="review"&&!y||$e.includes(j)&&!le(e,j)?Y():j||Y()}),_=j=>{D(j),de.saveTree(S,{tab:j})},[Q,X]=(0,w.useState)(()=>new Set($e.includes(U)?[U]:[]));(0,w.useEffect)(()=>{$e.includes(U)&&X(j=>j.has(U)?j:new Set(j).add(U))},[U]);let kt=(0,w.useRef)(null);(0,w.useEffect)(()=>{let j={uncommitted:le(e,"uncommitted"),outgoing:le(e,"outgoing")},st=kt.current;if(kt.current=j,!st||!$e.includes(U)||j[U]>0)return;let Nt=U==="uncommitted"?"outgoing":"uncommitted";st[U]>0&&j[Nt]>0&&_(Nt)},[e.status,U]);let it=En(e),K=e.status,lt=Qr(e.branch),wt=t.data?.codexNavigation,B=(0,w.useMemo)(()=>L?io(L.notes,Vt(e,y?.entry?.scope??"uncommitted")??[]):null,[L,y?.entry,K]),q=j=>y?.entry&&F===j?B?.byFile??null:null,ct=(0,w.useMemo)(()=>Ge(e,F),[K,F]),R=fr(y,ct),[,yt]=(0,w.useReducer)(j=>j+1,0);(0,w.useEffect)(()=>xt.subscribe(yt),[]);let Tt=xt.version,jt=(0,w.useMemo)(()=>{if(!L||!y?.entry)return null;let j=Vt(e,F)??[],st=xt.marksOf(S),Nt=new Set(j.filter(Dt=>pn(st,Dt,Ee(Dt))==="viewed").map(Dt=>Dt.path)),Jt=[...B?.byFile.values()??[]].flat().concat(B?.loose??[]);return so(Jt,{skip:Nt,branch:e.branch,head:e.head,scope:F,ref:K?.outgoing?.ref,at:y.entry.at})},[L,y?.entry,F,K,e.branch,e.head,S,Tt]),V=U==="review"&&!L?"sessions":U,mt=$e.includes(V)?V:ln(e),Ft={kind:Te,value:{repo:t.id,path:e.path}},tt=w.default.createElement("div",{className:"wt-dtitle"},r&&w.default.createElement("button",{className:"wt-back",onClick:r,"aria-label":"\u8FD4\u56DE\u5217\u8868"},w.default.createElement(z,{name:"back",size:16})),o&&w.default.createElement("button",{className:"wt-back",onClick:o,"aria-label":"\u5C55\u5F00\u5DE5\u4F5C\u6811\u6E05\u5355",title:"\u5C55\u5F00\u5DE5\u4F5C\u6811\u6E05\u5355\uFF08\u952E\u76D8 \u2191 \u2193 \u4E5F\u80FD\u6362\u5DE5\u4F5C\u6811\uFF09"},w.default.createElement(z,{name:"expand",size:16})),it&&w.default.createElement("span",{className:"wt-dot","data-tone":it,title:re(e).label}),w.default.createElement("h2",{className:"wt-dname","data-mono":e.detached?"":void 0,title:e.branch||e.head},Ce(e)),e.main&&w.default.createElement("small",{className:"wt-tag"},"\u4E3B\u76EE\u5F55"),e.locked&&w.default.createElement("small",{className:"wt-tag",title:e.lockedReason||"\u5DF2\u9501\u5B9A"},w.default.createElement(z,{name:"lock",size:11}),"\u9501\u5B9A"),e.detached&&w.default.createElement("small",{className:"wt-tag"},"\u5206\u79BB HEAD"),lt&&w.default.createElement("button",{type:"button",className:"wt-ticket",style:{"--ticket":lt.color},title:`\u53EA\u770B ${lt.key} \u76F8\u5173\u7684\u5DE5\u4F5C\u6811`,onClick:()=>i(lt.key)},lt.key),w.default.createElement(Ei,{tree:e})),Ot=w.default.createElement("p",{className:"wt-dsub"},n&&w.default.createElement("span",{className:"wt-drepo"},t.name),w.default.createElement(Xt,{className:"wt-dpath",title:e.path,text:On(e.path,$)}),w.default.createElement(Yn,{value:e.path,label:"\u5DF2\u590D\u5236\u8DEF\u5F84",act:l,title:"\u590D\u5236\u8DEF\u5F84"}),w.default.createElement("span",{className:"wt-spacer"}),w.default.createElement("span",{className:"wt-dwhen",title:e.lastChange?`\u6700\u8FD1\u6539\u52A8\uFF1A${Et(e.lastChange.time)}\uFF08\u4F9D\u636E\uFF1A${e.lastChange.source}\uFF09`:"\u53D6\u4E0D\u5230\u53EF\u7528\u7684\u65F6\u95F4"},"\u6700\u8FD1\u6539\u52A8"," ",e.lastChange?gt(e.lastChange.time,b):"\u65F6\u95F4\u672A\u77E5"));if(e.prunable)return w.default.createElement("div",{className:"wt-dinner"},w.default.createElement("header",{className:"wt-dhead"},tt,Ot),w.default.createElement("div",{className:"wt-dbody is-padded"},w.default.createElement("p",{className:"wt-notice is-warn",role:"status"},w.default.createElement(z,{name:"warning",size:14}),nr(e)||"Git \u4ECD\u4FDD\u7559\u7740\u8FD9\u68F5\u5DE5\u4F5C\u6811\u7684\u767B\u8BB0\uFF0C\u4F46\u76EE\u5F55\u5DF2\u7ECF\u4E0D\u5B58\u5728\u3002"),w.default.createElement("p",{className:"wt-dtext"},"\u6E05\u7406\u53EA\u4F1A\u79FB\u9664 Git \u91CC\u7684\u767B\u8BB0\uFF0C\u4E0D\u4F1A\u5220\u9664\u4EFB\u4F55\u6587\u4EF6\uFF1B\u8303\u56F4\u662F\u6574\u4E2A\u4ED3\u5E93\u7684\u5931\u6548\u767B\u8BB0\u3002"),w.default.createElement("div",{className:"wt-actions"},w.default.createElement("button",{className:"wt-btn is-danger",onClick:()=>x(t.id)},w.default.createElement(z,{name:"broom",size:15}),"\u6E05\u7406\u5931\u6548\u767B\u8BB0"))));let Bt=j=>{let st=le(e,"outgoing");return j==="uncommitted"?w.default.createElement(w.default.Fragment,null,"\u6CA1\u6709\u672A\u63D0\u4EA4\u7684\u6539\u52A8\u3002",st>0&&w.default.createElement("button",{className:"wt-linkbtn",onClick:()=>_("outgoing")},st," \u4E2A\u6587\u4EF6\u5728\u672A\u63A8\u9001\u7684\u63D0\u4EA4\u91CC")):"\u548C\u4E0A\u6E38\u76F8\u6BD4\u6CA1\u6709\u6587\u4EF6\u6539\u52A8\u3002"};return w.default.createElement("div",{className:"wt-dinner"},w.default.createElement("header",{className:"wt-dhead",...f(Ft,{tabIndex:-1})},tt,Ot,w.default.createElement("p",{className:"wt-dcommit"},e.head?w.default.createElement("code",{title:e.head},e.head.slice(0,10)):w.default.createElement("span",null,"\u5C1A\u65E0\u63D0\u4EA4"),e.commit&&w.default.createElement(w.default.Fragment,null,w.default.createElement("time",{title:Et(e.commit.time)},gt(e.commit.time,b)),w.default.createElement("span",{className:"wt-dsubject",title:e.commit.title},e.commit.title))),e.operations?.length>0&&w.default.createElement("p",{className:"wt-notice is-danger",role:"status"},w.default.createElement(z,{name:"warning",size:14}),e.operations.join(" \xB7 ")),e.error&&w.default.createElement("p",{className:"wt-notice is-danger",role:"alert"},w.default.createElement(z,{name:"warning",size:14}),e.error,w.default.createElement("button",{className:"wt-linkbtn",onClick:()=>u(t.id)},"\u91CD\u8BD5")),e.limited&&w.default.createElement("p",{className:"wt-notice is-warn",role:"status"},w.default.createElement(z,{name:"warning",size:14}),e.limited),w.default.createElement(Ii,{repo:t,tree:e,services:d,apps:c,act:l,renderFactorySlot:g,review:y,reviewScope:mt,prompted:!!t.data?.reviewPrompt})),w.default.createElement("div",{className:"wt-dtabs",role:"tablist"},w.default.createElement("button",{role:"tab","aria-selected":V==="uncommitted",onClick:()=>_("uncommitted")},"\u672A\u63D0\u4EA4 ",w.default.createElement("b",null,K?.total??"\u2014")),le(e,"outgoing")>0&&w.default.createElement("button",{role:"tab","aria-selected":V==="outgoing",onClick:()=>_("outgoing")},"\u672A\u63A8\u9001 ",w.default.createElement("b",null,K.outgoing.total)),w.default.createElement("button",{role:"tab","aria-selected":V==="sessions",onClick:()=>_("sessions")},"\u5173\u8054\u4F1A\u8BDD ",w.default.createElement("b",null,e.sessions.length)),L&&w.default.createElement("button",{role:"tab","aria-selected":V==="review",onClick:()=>_("review")},"\u5BA1\u67E5\u7ED3\u679C ",w.default.createElement("b",null,L.notes.length)),w.default.createElement("span",{className:"wt-spacer"}),w.default.createElement(Ai,{tree:e})),w.default.createElement(Bo,{state:y,act:l,repo:t,tree:e,retry:N,stale:R,loose:B?.loose.length??0,copy:jt,now:b}),w.default.createElement("div",{className:"wt-dbody"},$e.filter(j=>Q.has(j)).map(j=>{let st=Vt(e,j);return w.default.createElement("div",{key:j,className:"wt-tabpane",role:"tabpanel","aria-label":Ur[j],"data-on":V===j?"":void 0,"aria-hidden":V!==j},st?st.length?w.default.createElement(w.default.Fragment,null,j==="outgoing"&&w.default.createElement(Pi,{out:K.outgoing,now:b}),e.hasSubmodules&&w.default.createElement("p",{className:"wt-dtext wt-panetext"},"\u5B50\u6A21\u5757\u53EA\u6BD4\u8F83\u63D0\u4EA4\u6307\u9488\uFF0C\u4E0D\u626B\u63CF\u5B50\u6A21\u5757\u5185\u90E8\u7684\u6539\u52A8\u3002"),w.default.createElement(Io,{tree:e,repository:t.id,scope:j,notesFor:q(j),live:V===j,remember:O})):w.default.createElement("p",{className:"wt-emptyline"},Bt(j)):w.default.createElement("p",{className:"wt-emptyline"},e.error?"\u65E0\u6CD5\u8BFB\u53D6\u6587\u4EF6\u72B6\u6001\u3002":"\u6CA1\u6709\u8BFB\u5230\u6587\u4EF6\u72B6\u6001\u3002"))}),w.default.createElement("div",{className:"wt-tabpane",role:"tabpanel","data-on":V==="sessions"?"":void 0,"aria-hidden":V!=="sessions"},w.default.createElement(Li,{tree:e,repository:t.id,services:d,act:l,now:b,codexNavigation:wt,reviewSession:y?.entry?.session})),L&&w.default.createElement("div",{className:"wt-tabpane",role:"tabpanel","data-on":V==="review"?"":void 0,"aria-hidden":V!=="review"},w.default.createElement(qo,{report:L,copy:jt,act:l,onPrompt:l.editPrompt&&(()=>l.editPrompt(t.id))}))))}function ji({total:t,warnings:e,onClear:n,busy:r,missing:o}){return o?w.default.createElement("div",{className:"wt-empty"},w.default.createElement("h2",null,"\u6CA1\u6709\u8BFB\u5230\u4ED3\u5E93\u6E05\u5355"),w.default.createElement("p",{className:"wt-dtext"},"\u9762\u677F\u4ECE DSH \u5DE5\u4F5C\u533A\u3001Codex \u548C ZCode \u7684\u672C\u673A\u7D22\u5F15\u91CC\u53D1\u73B0\u4ED3\u5E93\u3002\u53EF\u4EE5\u5728\u63D2\u4EF6\u914D\u7F6E\u7684 projects \u4E2D\u8865\u5145\u76EE\u5F55\u3002")):r?w.default.createElement("div",{className:"wt-empty"},w.default.createElement("span",{className:"wt-spinner","aria-hidden":"true"}),w.default.createElement("p",{className:"wt-dtext"},"\u6B63\u5728\u8BFB\u53D6\u5404\u4ED3\u5E93\u7684\u72B6\u6001\uFF0C\u8BFB\u5B8C\u4E00\u4E2A\u663E\u793A\u4E00\u4E2A\u2026")):w.default.createElement("div",{className:"wt-empty"},e.length>0&&w.default.createElement("details",{className:"wt-sources"},w.default.createElement("summary",null,"\u90E8\u5206\u6570\u636E\u4E0D\u53EF\u7528\uFF08",e.length,"\uFF09"),e.map(i=>w.default.createElement("p",{key:i},i))),w.default.createElement("h2",null,t.repos," \u4E2A\u4ED3\u5E93\uFF0C",t.trees," \u68F5\u5DE5\u4F5C\u6811"),t.stale+t.trouble+t.dirty+t.unpushed>0?w.default.createElement("dl",{className:"wt-emptystats"},[["trouble","\u5F02\u5E38","danger"],["dirty","\u6709\u6539\u52A8","warn"],["unpushed","\u6709\u672A\u63A8\u9001","accent"],["stale","\u5931\u6548\u767B\u8BB0","stale"]].filter(([i])=>t[i]).map(([i,d,c])=>w.default.createElement("div",{key:i},w.default.createElement("dt",{"data-tone":c},d),w.default.createElement("dd",null,t[i])))):w.default.createElement("p",{className:"wt-dtext"},"\u6240\u6709\u5DE5\u4F5C\u6811\u90FD\u662F\u5E72\u51C0\u7684\u3002"),w.default.createElement("p",{className:"wt-dtext"},"\u5728\u5DE6\u4FA7\u9009\u4E00\u68F5\u5DE5\u4F5C\u6811\uFF0C\u67E5\u770B\u6587\u4EF6\u6539\u52A8\u548C\u5173\u8054\u4F1A\u8BDD\uFF0C\u6216\u76F4\u63A5\u5728\u8FD9\u91CC\u5F00\u5DE5\u3002\u952E\u76D8 \u2191 \u2193 \u4E5F\u53EF\u4EE5\u79FB\u52A8\u9009\u62E9\u3002"),n&&w.default.createElement("button",{className:"wt-linkbtn",onClick:n},"\u5F53\u524D\u6709\u7B5B\u9009\u6761\u4EF6\uFF0C\u6E05\u9664\u540E\u663E\u793A\u5168\u90E8\u5DE5\u4F5C\u6811"))}function Jo({target:t,loading:e,error:n,split:r,showRepo:o,onBack:i,onExpandList:d,onTicket:c,services:l,apps:b,act:f,now:g,getTriggerProps:x,renderFactorySlot:u,retry:$,requestPrune:y,reload:N,home:S,review:O,retryReview:E,total:L,warnings:F,onClear:Y,busy:U,missing:D}){if(!t)return w.default.createElement("aside",{className:"wt-detail","aria-label":"\u5DE5\u4F5C\u6811\u8BE6\u60C5"},w.default.createElement("div",{className:"wt-dinner"},w.default.createElement(ji,{total:L,warnings:F,onClear:Y,busy:U,missing:D})));let{repo:_,tree:Q}=t;return e||n||!Q?w.default.createElement("aside",{className:"wt-detail","aria-label":"\u5DE5\u4F5C\u6811\u8BE6\u60C5","aria-busy":!n},w.default.createElement("div",{className:"wt-dinner"},w.default.createElement("p",{className:"wt-emptyline"},n?w.default.createElement(w.default.Fragment,null,n,w.default.createElement("button",{className:"wt-linkbtn",onClick:()=>$(_.id)},"\u91CD\u8BD5")):"\u6B63\u5728\u8BFB\u53D6\u8FD9\u68F5\u5DE5\u4F5C\u6811\u7684\u72B6\u6001\u2026"))):w.default.createElement("aside",{className:"wt-detail","aria-label":"\u5DE5\u4F5C\u6811\u8BE6\u60C5"},w.default.createElement(Hi,{key:`${_.id}:${Q.path}`,repo:_,tree:Q,showRepo:o,onBack:r?null:i,onExpandList:d,onTicket:c,services:l,apps:b,act:f,now:g,getTriggerProps:x,renderFactorySlot:u,requestPrune:y,reload:N,home:S,review:O,retryReview:E}))}var rt=Ht(require("react"),1);function Yo({repos:t,counts:e,scope:n,choose:r,onCollapse:o}){let[i,d]=(0,rt.useState)(!1),c=u=>{let $=An(u.trees??[]);return $.trouble?"danger":$.dirty||$.unpushed?"warn":$.stale?"stale":""},l=u=>u.state==="ready"&&Dn(u.trees),b=u=>rt.default.createElement("button",{key:u.id,className:"wt-railitem"+(n===u.id?" is-active":""),"aria-current":n===u.id?"true":void 0,title:u.path,onClick:()=>r(u.id)},rt.default.createElement("span",{className:"wt-raildot","data-tone":c(u)}),rt.default.createElement("span",{className:"wt-railname"},u.name),rt.default.createElement("b",null,u.count)),f=t.filter(l),g=t.filter(u=>!l(u)),x=t.filter(u=>u.state==="ready").length;return rt.default.createElement("nav",{className:"wt-rail","aria-label":"\u4ED3\u5E93"},rt.default.createElement("div",{className:"wt-railhead"},rt.default.createElement("h2",null,"\u4ED3\u5E93"),rt.default.createElement("span",null,x===t.length?t.length:`${x}/${t.length}`),o&&rt.default.createElement("button",{className:"wt-iconbtn",title:"\u6536\u8D77\u4ED3\u5E93\u680F","aria-label":"\u6536\u8D77\u4ED3\u5E93\u680F","aria-expanded":"true",onClick:o},rt.default.createElement(z,{name:"collapse",size:15}))),rt.default.createElement("div",{className:"wt-railscroll"},rt.default.createElement("button",{className:"wt-railitem wt-railall"+(n==="all"?" is-active":""),"aria-current":n==="all"?"true":void 0,onClick:()=>r("all")},rt.default.createElement("span",{className:"wt-raildot"}),rt.default.createElement("span",{className:"wt-railname"},"\u5168\u90E8\u4ED3\u5E93"),rt.default.createElement("b",null,e.all)),g.map(b),f.length>0&&(i?rt.default.createElement(rt.default.Fragment,null,f.map(b),rt.default.createElement("button",{className:"wt-railitem wt-railfold",onClick:()=>d(!1)},rt.default.createElement("span",{className:"wt-raildot"}),rt.default.createElement("span",{className:"wt-railname"},"\u6536\u8D77"))):rt.default.createElement("button",{className:"wt-railitem wt-railfold",onClick:()=>d(!0)},rt.default.createElement("span",{className:"wt-raildot"}),rt.default.createElement("span",{className:"wt-railname"},"\u53EA\u6709\u4E3B\u68C0\u51FA\u7684\u5B89\u9759\u4ED3\u5E93"),rt.default.createElement("b",null,f.length)))))}var k=Ht(require("react"),1);var P=Ht(require("react"),1);var qn={all:["\u5168\u90E8",()=>!0],unchecked:["\u672A\u68C0\u51FA",(t,e)=>!e],unpushed:["\u6709\u672A\u63A8\u9001",t=>t.ahead>0],merged:["\u5DF2\u5E76\u5165",t=>t.merged]},Fi=t=>t.upstream?t.gone?"\u4E0A\u6E38\u5F15\u7528\u5DF2\u4E0D\u5B58\u5728":[t.ahead&&`\u2191${t.ahead}`,t.behind&&`\u2193${t.behind}`].filter(Boolean).join(" ")||"\u4E0E\u4E0A\u6E38\u540C\u6B65":"\u672A\u8BBE\u4E0A\u6E38",Bi=t=>t.behind>0?"warn":t.ahead>0?"accent":t.gone?"stale":"muted";function Qo({repo:t,now:e,query:n,open:r,toggle:o,showTree:i,retry:d}){let[c,l]=(0,P.useState)("all"),[b,f]=(0,P.useState)(80),g=t.data?.branches,x=t.data?.mergedInto?.replace(/^origin\//,""),u=(0,P.useMemo)(()=>{let E=new Set;for(let L of t.data?.trees??[])L.branch&&!L.bare&&E.add(L.branch);return E},[t.data]);if(!g)return P.default.createElement("section",{className:"wt-branchfold","data-open":"","aria-label":"\u672C\u5730\u5206\u652F"},P.default.createElement("header",{className:"wt-grouphead wt-branchhead"},P.default.createElement("span",{className:"wt-group-toggle"}),P.default.createElement("span",{className:"wt-groupname"},"\u672C\u5730\u5206\u652F")),P.default.createElement("p",{className:"wt-inlineerror",role:"alert"},P.default.createElement(z,{name:"warning",size:14}),"\u672C\u5730\u5206\u652F\u8BFB\u53D6\u5931\u8D25\u3002",P.default.createElement("button",{className:"wt-linkbtn",onClick:()=>d(t.id)},"\u91CD\u8BD5")));let $=n.trim(),y=E=>u.has(E.name),N=g.filter(E=>he($,E.name,E.head,E.upstream,E.subject)&&qn[c][1](E,y(E))),S=Object.fromEntries(Object.keys(qn).map(E=>[E,g.filter(L=>qn[E][1](L,y(L))).length])),O=S.unchecked;return P.default.createElement("section",{className:"wt-branchfold","data-open":r||void 0,"aria-label":"\u672C\u5730\u5206\u652F"},P.default.createElement("header",{className:"wt-grouphead wt-branchhead"},P.default.createElement("button",{className:"wt-group-toggle","aria-expanded":r,"aria-label":r?"\u6536\u8D77\u672C\u5730\u5206\u652F":`\u5C55\u5F00\u672C\u5730\u5206\u652F\uFF08${g.length} \u4E2A\uFF09`,onClick:o},P.default.createElement(z,{name:"chevron",size:12,className:r?"is-open":""})),P.default.createElement("span",{className:"wt-groupname"},"\u672C\u5730\u5206\u652F ",P.default.createElement("b",null,g.length)),P.default.createElement("span",{className:"wt-groupsummary wt-branchsum"},P.default.createElement("span",{className:"wt-count"},P.default.createElement("b",null,g.length-O),"\u5DF2\u68C0\u51FA"),P.default.createElement("span",{className:"wt-count"},P.default.createElement("b",null,O),"\u672A\u68C0\u51FA"),S.unpushed>0&&P.default.createElement("span",{className:"wt-count","data-tone":"accent"},P.default.createElement("b",null,S.unpushed),"\u672A\u63A8\u9001"),S.merged>0&&P.default.createElement("span",{className:"wt-count wt-branchmerged"},P.default.createElement("b",null,S.merged),"\u5DF2\u5E76\u5165"))),r&&P.default.createElement("div",{className:"wt-branchlist"},P.default.createElement("div",{className:"wt-branchbar"},P.default.createElement("div",{className:"wt-seg wt-seg-sm",role:"tablist","aria-label":"\u770B\u54EA\u4E00\u7C7B\u672C\u5730\u5206\u652F"},Object.entries(qn).map(([E,[L]])=>P.default.createElement("button",{key:E,role:"tab","aria-selected":c===E,onClick:()=>{l(E),f(80)}},L,P.default.createElement("b",null,S[E]))))),P.default.createElement("p",{className:"wt-dtext wt-branchnote"},O?`\u4E0A\u9762\u7684\u5DE5\u4F5C\u6811\u5404\u68C0\u51FA\u4E86\u4E00\u4E2A\u5206\u652F\uFF1B\u53E6\u5916 ${O} \u4E2A\u5206\u652F\u6CA1\u6709\u68C0\u51FA\u5230\u4EFB\u4F55\u76EE\u5F55\uFF0C\u8981\u770B\u5B83\u7684\u6539\u52A8\u5F97\u5148\u68C0\u51FA\u3002`:"\u8FD9\u91CC\u7684\u5206\u652F\u90FD\u68C0\u51FA\u5728\u4E0A\u9762\u51E0\u68F5\u5DE5\u4F5C\u6811\u91CC\u3002"),N.length?P.default.createElement("ul",{className:"wt-branches"},N.slice(0,b).map(E=>{let L=(t.data.trees??[]).filter(F=>F.branch===E.name&&!F.bare);return P.default.createElement("li",{className:"wt-branch",key:E.name},P.default.createElement("div",{className:"wt-branchtop"},P.default.createElement("span",{className:"wt-bname",title:E.name},E.name),E.merged&&P.default.createElement("small",{className:"wt-tag",title:`\u5DF2\u5B8C\u6574\u5E76\u5165 ${x}\uFF08\u6309\u672C\u5730\u8BB0\u5F55\uFF09`},"\u5DF2\u5E76\u5165"),P.default.createElement("span",{className:"wt-spacer"}),L.length?L.map(F=>P.default.createElement("button",{key:F.path,className:"wt-linkbtn",title:F.path,onClick:()=>i(F.path)},F.main?"\u4E3B\u76EE\u5F55":"\u67E5\u770B\u5DE5\u4F5C\u6811",P.default.createElement(z,{name:"external",size:12}))):P.default.createElement("small",{className:"wt-tag is-muted"},"\u672A\u68C0\u51FA")),P.default.createElement("p",{className:"wt-branchsub"},P.default.createElement("span",{className:"wt-bup","data-tone":Bi(E),title:E.upstream?`\u8DDF\u8E2A\u4E0A\u6E38 ${E.upstream}\uFF08\u6309\u672C\u5730\u8BB0\u5F55\uFF0C\u4E0D\u8054\u7F51\u66F4\u65B0\uFF09`:"\u6CA1\u6709\u8BBE\u7F6E\u8DDF\u8E2A\u4E0A\u6E38\uFF1B\u4E0D\u4EE3\u8868\u6CA1\u6709\u63A8\u9001"},Fi(E),E.upstream&&P.default.createElement("em",null,E.upstream)),P.default.createElement("code",{title:E.head},E.head),P.default.createElement("time",{title:Et(E.time)},gt(E.time,e)),P.default.createElement("span",{title:E.subject},E.subject)))})):P.default.createElement("p",{className:"wt-emptyline"},"\u6CA1\u6709\u5339\u914D\u7684\u672C\u5730\u5206\u652F\u3002"),N.length>b&&P.default.createElement("button",{className:"wt-more",onClick:()=>f(b+80)},"\u7EE7\u7EED\u663E\u793A\uFF08\u8FD8\u6709 ",N.length-b," \u4E2A\uFF09"),P.default.createElement("p",{className:"wt-dtext"},"\u300C\u5DF2\u5E76\u5165\u300D\u6309\u672C\u5730\u8BB0\u5F55\u5224\u65AD\uFF0C\u76F8\u5BF9 ",P.default.createElement("code",null,x??"\u4E3B\u5206\u652F"),"\uFF1B\u672A\u68C0\u51FA\u4E0D\u7B49\u4E8E\u53EF\u4EE5\u5220\u9664\u3002")))}var qi={Codex:"C",ZCode:"Z",DSH:"D"},_i=1800*1e3,Wi=(t,e,n)=>t.sessions.some(r=>r.source===e&&!r.archived&&(r.running||r.time>n-_i)),Vi=(t,e)=>{let n=t.sessions.filter(r=>r.source===e&&!r.archived);return n.length?`${e}\uFF1A${n.length} \u4E2A\u672A\u5F52\u6863\u4F1A\u8BDD\uFF0C\u6700\u8FD1\u4E00\u6B21 ${gt(n[0].time)}`:e},Ki=t=>t.lastChange?`\u6700\u8FD1\u6539\u52A8\uFF1A${Et(t.lastChange.time)}\uFF08\u4F9D\u636E\uFF1A${t.lastChange.source}\uFF09`:"\u53D6\u4E0D\u5230\u53EF\u7528\u7684\u65F6\u95F4";function Zi({tree:t}){let[e,n]=Kr(Ce(t));return k.default.createElement("span",{className:"wt-name","data-mono":t.detached?"":void 0,title:t.branch||t.head},e&&k.default.createElement("span",{className:"wt-ns"},e),n)}function Gi({value:t}){if(!t?.total)return null;let e=t.viewed===t.total;return k.default.createElement("b",{"data-k":"seen","data-done":e?"":void 0,title:e?`${t.total} \u4E2A\u6587\u4EF6\u90FD\u5DF2\u5BA1\u9605`:`\u5DF2\u5BA1\u9605 ${t.viewed} / ${t.total} \u4E2A\u6587\u4EF6${t.changed?`\uFF0C${t.changed} \u4E2A\u5BA1\u9605\u540E\u53C8\u6709\u6539\u52A8`:""}`},e?k.default.createElement(z,{name:"check",size:12}):k.default.createElement(k.default.Fragment,null,k.default.createElement(Tn,{share:t.viewed/t.total}),`${t.viewed}/${t.total}`))}function Ui({repo:t,tree:e,selected:n,focused:r,pick:o,getTriggerProps:i,renderFactorySlot:d,act:c,now:l,reviewOf:b,seenOf:f}){let g=En(e),x=!e.prunable&&!e.error,u=Jr(e),$=b?.(t.id,e)??null,y=f?.(t,e)??null,N={kind:Te,value:{repo:t.id,path:e.path}};return k.default.createElement("div",{...i(N,{tabIndex:-1}),className:"wt-row"+(n?" is-selected":"")+(r?" is-cursor":"")+(e.prunable?" is-stale":""),role:"option","aria-selected":n,"data-path":e.path,onClick:()=>o(t.id,e),onKeyDown:S=>{(S.key==="Enter"||S.key===" ")&&(S.preventDefault(),o(t.id,e))}},k.default.createElement("span",{className:"wt-dotcell"},g&&k.default.createElement("span",{className:"wt-dot","data-tone":g})),k.default.createElement("span",{className:"wt-main"},k.default.createElement(Zi,{tree:e}),e.main&&k.default.createElement("small",{className:"wt-tag wt-tag-main"},"\u4E3B\u76EE\u5F55"),e.detached&&k.default.createElement("small",{className:"wt-tag"},"\u5206\u79BB"),e.locked&&k.default.createElement("small",{className:"wt-tag wt-tag-lock",title:e.lockedReason||"\u5DF2\u9501\u5B9A"},k.default.createElement(z,{name:"lock",size:11}),k.default.createElement("span",{className:"wt-vh"},"\u9501\u5B9A"))),k.default.createElement("span",{className:"wt-side"},e.tools?.length>0&&k.default.createElement("span",{className:"wt-tools"},e.tools.map(S=>k.default.createElement("span",{key:S,className:"wt-tool","data-live":Wi(e,S,l)||void 0,title:Vi(e,S)},k.default.createElement("i",null,qi[S]??S[0])))),k.default.createElement("time",{className:"wt-time",title:Ki(e)},e.lastChange?gt(e.lastChange.time,l):"\u2014")),k.default.createElement("span",{className:"wt-acts"},x&&c.dsh&&k.default.createElement("button",{className:"wt-go",title:"\u5728 DSH \u65B0\u5F00\u4F1A\u8BDD","aria-label":"\u5728 DSH \u65B0\u5F00\u4F1A\u8BDD",onClick:S=>{S.stopPropagation(),c.newDsh(e)}},k.default.createElement(z,{name:"chat",size:14})),d?.("contextMenu.button",{target:N,label:"\u66F4\u591A\u64CD\u4F5C",className:"wt-menu-btn"})),k.default.createElement("span",{className:"wt-marks"},$&&k.default.createElement(jo,{state:$,now:l,stamp:Ge(e,$?.entry?.scope)}),u.map(({key:S,count:O})=>k.default.createElement("b",{key:S,"data-k":S,title:Yr(e,S)},(S==="ahead"||S==="behind")&&k.default.createElement(z,{name:S==="ahead"?"arrowUp":"arrowDown",size:11}),S==="trouble"&&k.default.createElement(z,{name:"warning",size:12}),S==="dirty"&&`\xB1${O}`,S==="ahead"||S==="behind"?O:S==="stale"?"\u5931\u6548":S==="unknown"?"\u2014":"")),y&&k.default.createElement(Gi,{value:y})))}function Ro(){return k.default.createElement("div",{className:"wt-skeleton","aria-hidden":"true"},[64,42,56,34,50].map(t=>k.default.createElement("span",{key:t,style:{width:`${t}%`}})))}function Xi(t){if(!t)return null;let e=An(t),n=[["dirty","\u6709\u6539\u52A8","warn"],["unpushed","\u672A\u63A8\u9001","accent"],["behind","\u843D\u540E","muted"],["trouble","\u5F02\u5E38","danger"],["stale","\u5931\u6548","stale"]].filter(([r])=>e[r]);return n.length?n.map(([r,o,i])=>k.default.createElement("span",{key:r,className:"wt-count","data-tone":i},k.default.createElement("b",null,e[r]),o)):k.default.createElement("span",{className:"wt-count"},"\u5168\u90E8\u5E72\u51C0")}function Ji({repo:t,branches:e,collapsed:n,toggleGroup:r,showBranches:o}){return k.default.createElement("header",{className:"wt-grouphead"},k.default.createElement("button",{className:"wt-group-toggle","aria-expanded":!n,"aria-label":n?`\u5C55\u5F00 ${t.name}`:`\u6536\u8D77 ${t.name}`,onClick:()=>r(t.id)},k.default.createElement(z,{name:"chevron",size:12,className:n?"":"is-open"})),k.default.createElement("span",{className:"wt-groupname",title:t.path},t.name),k.default.createElement("span",{className:"wt-groupcount"},t.count," \u68F5\u5DE5\u4F5C\u6811"),k.default.createElement("span",{className:"wt-groupsummary"},Xi(t.trees)),k.default.createElement("span",{className:"wt-spacer"}),k.default.createElement("button",{className:"wt-branchlink",title:"\u53EA\u770B\u8FD9\u4E2A\u4ED3\u5E93\uFF0C\u5E76\u5C55\u5F00\u5B83\u7684\u672C\u5730\u5206\u652F",onClick:o},"\u5206\u652F ",k.default.createElement("b",null,e??"\u2026")))}function Yi({entry:t,showHead:e,staleShown:n,collapsed:r,selected:o,cursor:i,pick:d,getTriggerProps:c,renderFactorySlot:l,act:b,now:f,toggleGroup:g,toggleStale:x,showBranches:u,requestPrune:$,retry:y,reviewOf:N,seenOf:S}){let{repo:O}=t,E=e&&Ji({repo:O,branches:O.data?.branches?.length,collapsed:r,toggleGroup:g,showBranches:()=>u?.(O.id)});if(!O.data)return k.default.createElement("section",{className:"wt-group","aria-busy":O.state!=="error","data-repo":O.id},E,O.state==="error"?k.default.createElement("p",{className:"wt-inlineerror",role:"alert"},k.default.createElement(z,{name:"warning",size:14}),O.error,k.default.createElement("button",{onClick:()=>y(O.id)},"\u91CD\u8BD5")):k.default.createElement(Ro,null));let L=F=>k.default.createElement(Ui,{key:F.path,repo:O,tree:F,selected:o?.repo===O.id&&o.path===F.path,focused:i===F.path,pick:d,getTriggerProps:c,renderFactorySlot:l,act:b,now:f,reviewOf:N,seenOf:S});return k.default.createElement("section",{className:"wt-group","aria-busy":O.state==="loading","data-repo":O.id},E,!(e&&r)&&k.default.createElement(k.default.Fragment,null,t.live.map(L),O.error&&k.default.createElement("p",{className:"wt-inlineerror",role:"status"},k.default.createElement(z,{name:"warning",size:14}),"\u8FD9\u6B21\u6CA1\u8BFB\u5230\u65B0\u7684\u72B6\u6001\uFF0C\u5148\u663E\u793A ",gt(O.data.time,f),"\u7684\u7ED3\u679C\u3002",k.default.createElement("button",{onClick:()=>y(O.id)},"\u91CD\u8BD5")),t.stale.length>0&&(n?k.default.createElement(k.default.Fragment,null,t.stale.map(L),k.default.createElement("div",{className:"wt-stalebar"},k.default.createElement("button",{className:"wt-linkbtn",onClick:()=>x(O.id)},"\u6536\u8D77"),k.default.createElement("button",{className:"wt-linkbtn is-danger",onClick:()=>$(O.id)},k.default.createElement(z,{name:"broom",size:13}),"\u6E05\u7406 ",t.stale.length," \u6761\u5931\u6548\u767B\u8BB0"))):k.default.createElement("button",{className:"wt-fold",onClick:()=>x(O.id)},k.default.createElement(z,{name:"warning",size:13}),k.default.createElement("b",null,t.stale.length," \u68F5\u767B\u8BB0\u5DF2\u5931\u6548"),k.default.createElement("span",null,"\u76EE\u5F55\u5DF2\u4E0D\u5B58\u5728"),k.default.createElement(z,{name:"chevron",size:12,className:"wt-fold-chevron"}))),!t.live.length&&!t.stale.length&&k.default.createElement("p",{className:"wt-emptyline"},"\u6CA1\u6709\u7B26\u5408\u5F53\u524D\u7B5B\u9009\u7684\u5DE5\u4F5C\u6811\u3002")))}function ta({scope:t,repos:e,groups:n,quiet:r,quietOpen:o,staleOpen:i,filterStale:d,collapsed:c,selected:l,cursor:b,sort:f,progress:g,total:x,filtered:u,now:$,pick:y,goAll:N,setSort:S,setQuietOpen:O,toggleStale:E,toggleGroup:L,requestPrune:F,retry:Y,reviewOf:U,seenOf:D,clearFilters:_,getTriggerProps:Q,renderFactorySlot:X,act:kt,scrollRef:it,catalogEmpty:K,onCollapse:lt,onExpandRail:wt,branches:B,query:q,showTree:ct}){let R=e.find(tt=>tt.id===t),yt=(0,k.useRef)(null),Tt=(0,k.useRef)(B?.jump??0);(0,k.useEffect)(()=>{let tt=B?.jump??0;if(Tt.current===tt||!yt.current)return;Tt.current=tt;let Ot=setTimeout(()=>{let Bt=it.current,j=yt.current;if(!Bt||!j)return;let st=j.getBoundingClientRect(),Nt=Bt.getBoundingClientRect().top,Jt=st.top-Nt;Jt>=40&&Jt+34<=Bt.clientHeight||(Bt.scrollTop+=Jt-40)},0);return()=>clearTimeout(Ot)},[B?.jump,R?.data?.branches,it]);let jt=!!(B&&(B.open||B.forced)),V=(tt,Ot)=>k.default.createElement(Yi,{key:tt.repo.id,entry:tt,showHead:Ot,staleShown:d||i.has(tt.repo.id),collapsed:c.has(tt.repo.id),selected:l,cursor:b,pick:y,getTriggerProps:Q,renderFactorySlot:X,act:kt,now:$,toggleGroup:L,toggleStale:E,showBranches:B?.show,requestPrune:F,retry:Y,reviewOf:U,seenOf:D}),mt=g.total>g.done,Ft=!n.length&&!r.length&&!mt;return k.default.createElement("section",{className:"wt-list","aria-label":"\u5DE5\u4F5C\u6811\u6E05\u5355",ref:it},k.default.createElement("div",{className:"wt-listhead","data-scope":t==="all"?"all":"one"},wt&&k.default.createElement("button",{className:"wt-iconbtn",title:"\u5C55\u5F00\u4ED3\u5E93\u680F","aria-label":"\u5C55\u5F00\u4ED3\u5E93\u680F",onClick:wt},k.default.createElement(z,{name:"expand",size:15})),t==="all"?k.default.createElement("span",{className:"wt-listtitle"},"\u5168\u90E8\u4ED3\u5E93",k.default.createElement("b",null,x.trees),k.default.createElement("span",{className:"wt-listunit"},"\u68F5\u5DE5\u4F5C\u6811"),k.default.createElement("span",{className:"wt-listsub"},n.length+r.length," \u4E2A\u4ED3\u5E93")):k.default.createElement(k.default.Fragment,null,k.default.createElement("button",{className:"wt-back",onClick:N,title:"\u56DE\u5230\u5168\u90E8\u4ED3\u5E93"},k.default.createElement(z,{name:"back",size:15})),k.default.createElement("span",{className:"wt-listtitle"},"\u5DE5\u4F5C\u6811",k.default.createElement("b",null,R?.count??0)),k.default.createElement("button",{className:"wt-branchlink","aria-expanded":jt,title:"\u8FD9\u4E2A\u4ED3\u5E93\u7684\u5168\u90E8\u5206\u652F\uFF08\u5728\u6E05\u5355\u672B\u5C3E\uFF09\uFF1A\u70B9\u4E00\u4E0B\u5C55\u5F00\u5E76\u6EDA\u8FC7\u53BB",onClick:B?.show&&(()=>B.show(t))},"\u672C\u5730\u5206\u652F ",k.default.createElement("b",null,R?.data?.branches?.length??"\u2026")),k.default.createElement(Xt,{className:"wt-listpath",title:R?.path,text:R?.path})),k.default.createElement("span",{className:"wt-spacer"}),k.default.createElement("label",{className:"wt-sort"},k.default.createElement("span",null,"\u6392\u5E8F"),k.default.createElement("select",{value:f,onChange:tt=>S(tt.target.value)},k.default.createElement("option",{value:"attention"},"\u9700\u8981\u5173\u6CE8\u4F18\u5148"),k.default.createElement("option",{value:"recent"},"\u6700\u8FD1\u6539\u52A8"))),lt&&k.default.createElement("button",{className:"wt-iconbtn",title:"\u6536\u8D77\u5DE5\u4F5C\u6811\u6E05\u5355\uFF0C\u628A\u5730\u65B9\u8BA9\u7ED9\u8BE6\u60C5","aria-label":"\u6536\u8D77\u5DE5\u4F5C\u6811\u6E05\u5355","aria-expanded":"true",onClick:lt},k.default.createElement(z,{name:"collapse",size:15})),mt&&k.default.createElement("span",{className:"wt-progress",role:"status",style:{"--p":`${g.done/g.total*100}%`}},k.default.createElement("span",{className:"wt-vh"},"\u6B63\u5728\u8BFB\u53D6\u4ED3\u5E93\u72B6\u6001 ",g.done,"/",g.total))),u&&k.default.createElement("button",{className:"wt-filternote",onClick:_},k.default.createElement(z,{name:"filter",size:12}),"\u5DF2\u6309\u6761\u4EF6\u7B5B\u9009\uFF0C\u6E05\u9664\u7B5B\u9009"),k.default.createElement("div",{className:"wt-rows",role:"listbox","aria-label":"\u5DE5\u4F5C\u6811","data-flat":t!=="all"?"":void 0},n.map(tt=>V(tt,t==="all")),t!=="all"&&k.default.createElement("div",{role:"presentation",ref:yt},k.default.createElement(Qo,{repo:R,now:$,query:q??"",open:jt,toggle:B?.toggle,showTree:ct,retry:Y})),r.length>0&&(o?k.default.createElement(k.default.Fragment,null,r.map(tt=>V(tt,!0)),k.default.createElement("button",{className:"wt-fold",onClick:()=>O(!1)},"\u6536\u8D77\u8FD9\u4E9B\u4ED3\u5E93")):k.default.createElement("button",{className:"wt-fold wt-fold-quiet",onClick:()=>O(!0)},k.default.createElement("b",null,"\u5176\u4F59 ",r.length," \u4E2A\u4ED3\u5E93"),k.default.createElement("span",null,"\u53EA\u6709\u4E3B\u68C0\u51FA\uFF0C\u6CA1\u6709\u6539\u52A8\uFF0C\u4E5F\u6CA1\u6709\u4F1A\u8BDD"),k.default.createElement(z,{name:"chevron",size:12,className:"wt-fold-chevron"}))),mt&&!n.length&&!r.length&&k.default.createElement(Ro,null),Ft&&k.default.createElement("p",{className:"wt-emptyline"},e.length?"\u6CA1\u6709\u7B26\u5408\u6761\u4EF6\u7684\u5DE5\u4F5C\u6811\u3002":K?"\u6CA1\u6709\u53D1\u73B0\u672C\u673A\u4ED3\u5E93\u3002\u53EF\u4EE5\u5728\u63D2\u4EF6\u914D\u7F6E\u7684 projects \u4E2D\u6307\u5B9A\u9879\u76EE\u76EE\u5F55\u3002":"\u6B63\u5728\u8BFB\u53D6\u672C\u673A\u4ED3\u5E93\u2026",u&&k.default.createElement("button",{className:"wt-linkbtn",onClick:_},"\u6E05\u9664\u7B5B\u9009"))))}var Z=Ht(require("react"),1);function ea({name:t,path:e,selected:n,open:r,buttonRef:o,onOpen:i,onClear:d}){return Z.default.createElement("div",{className:"wt-pick"},Z.default.createElement("button",{ref:o,type:"button",className:"wt-pickbtn",title:e?`\u5F53\u524D\u4ED3\u5E93\uFF1A${e}`:"\u9009\u62E9\u4ED3\u5E93","aria-haspopup":"listbox","aria-expanded":r,onClick:i},Z.default.createElement("span",{className:"wt-pickname"},t),Z.default.createElement(z,{name:"chevron",size:13})),n&&Z.default.createElement("button",{type:"button",className:"wt-pickclear",title:"\u56DE\u5230\u5168\u90E8\u4ED3\u5E93","aria-label":"\u6E05\u9664\uFF0C\u56DE\u5230\u5168\u90E8\u4ED3\u5E93",onClick:d},Z.default.createElement(z,{name:"close",size:12})))}function na({repos:t,scope:e,total:n,anchor:r,onChoose:o,onClose:i}){let[d,c]=(0,Z.useState)(""),[l,b]=(0,Z.useState)(0),[f,g]=(0,Z.useState)(null),x=(0,Z.useRef)(null),u=(0,Z.useRef)(null),y=`wt-pick-${(0,Z.useRef)(Math.random().toString(36).slice(2)).current}`,N=d.trim(),S=(0,Z.useMemo)(()=>{let D=Rr(t,N);return N?D:[{...D[0],count:n},...D.slice(1)]},[t,N,n]),O=S.map(D=>D.id).join(`
`);(0,Z.useEffect)(()=>b(0),[O]),(0,Z.useEffect)(()=>{let D=u.current,_=D?.children[l];if(!D||!_)return;let{clientHeight:Q,scrollTop:X}=D;_.offsetTop<X+4?D.scrollTop=_.offsetTop-4:_.offsetTop+_.offsetHeight>X+Q-4&&(D.scrollTop=_.offsetTop+_.offsetHeight-Q+4)},[l,O]);let E=r?.closest(".wt-wrap");(0,Z.useLayoutEffect)(()=>{if(!r||!E)return;let D=()=>{let Q=r.getBoundingClientRect(),X=E.getBoundingClientRect(),kt=Math.max(Q.width,Math.min(288,X.width-16));g({left:Math.max(8,Math.min(Q.left-X.left,X.width-kt-8)),width:kt,top:Q.bottom-X.top+4,maxHeight:Math.max(96,Math.min(420,X.bottom-Q.bottom-16))})};D();let _=new ResizeObserver(D);return _.observe(E),()=>_.disconnect()},[r,E]);let L=(0,Z.useRef)(!1);(0,Z.useEffect)(()=>{!f||L.current||(L.current=!0,x.current?.focus({preventScroll:!0}))},[f]);let F=()=>{i(),r?.isConnected&&r.focus({preventScroll:!0})},Y=D=>{F(),o(D)};return Z.default.createElement("div",{className:"wt-picklayer",onKeyDown:D=>{if(!D.nativeEvent.isComposing){if(D.key==="Escape"){D.preventDefault(),D.stopPropagation(),F();return}if(D.target===x.current)if(D.key==="ArrowDown"||D.key==="ArrowUp"){if(D.preventDefault(),D.stopPropagation(),!S.length)return;let _=D.key==="ArrowDown"?1:S.length-1;b(Q=>(Q+_)%S.length)}else D.key==="Enter"&&(D.preventDefault(),D.stopPropagation(),S[l]&&Y(S[l].id))}},onMouseDown:D=>D.preventDefault(),onClick:D=>{D.target===D.currentTarget&&F()},onBlur:D=>{D.currentTarget.contains(D.relatedTarget)||i()}},Z.default.createElement("div",{className:"wt-pickmenu",style:f??{visibility:"hidden"}},Z.default.createElement("label",{className:"wt-picksearch"},Z.default.createElement(z,{name:"search",size:15}),Z.default.createElement("input",{ref:x,type:"text",role:"combobox","aria-label":"\u641C\u7D22\u4ED3\u5E93","aria-autocomplete":"list","aria-expanded":"true","aria-controls":y,"aria-activedescendant":S.length?`${y}-${l}`:void 0,placeholder:"\u641C\u7D22\u4ED3\u5E93\u3001\u8DEF\u5F84\u6216\u6240\u5C5E\u9879\u76EE",value:d,spellCheck:!1,onChange:D=>c(D.target.value)}),d&&Z.default.createElement("button",{type:"button",className:"wt-iconbtn","aria-label":"\u6E05\u9664\u641C\u7D22",onClick:()=>{c(""),x.current?.focus({preventScroll:!0})}},Z.default.createElement(z,{name:"close",size:13}))),Z.default.createElement("ul",{id:y,role:"listbox","aria-label":"\u4ED3\u5E93",className:"wt-picklist",tabIndex:-1,ref:u},S.map((D,_)=>Z.default.createElement("li",{key:D.id,id:`${y}-${_}`,role:"option","aria-selected":D.id===e,className:"wt-pickopt"+(_===l?" is-active":""),onPointerMove:()=>_!==l&&b(_),onClick:()=>Y(D.id)},Z.default.createElement(z,{name:"check",size:14}),Z.default.createElement("span",{className:"wt-pickname",title:D.path},D.name),D.count!=null&&Z.default.createElement("b",null,D.count)))),!S.length&&Z.default.createElement("p",{className:"wt-pickempty"},"\u6CA1\u6709\u5339\u914D\u7684\u4ED3\u5E93\u3002")))}var Qi=820,ra=1120,Nr=340,ia=240,sa=520,Wn=t=>Math.min(sa,Math.max(ia,Math.round(Number(t)||Nr))),Ri=4,ts=5e3,es=4e3,_n=["all","dirty","unpushed","behind","trouble","reviewed","stale"],ns=new Set,rs=()=>({getTriggerProps:(t,e)=>e??{}});function os(t){let[,e]=(0,s.useReducer)(n=>n+1,0);(0,s.useEffect)(()=>t.subscribe(e),[t])}async function oa(t){try{return await navigator.clipboard.writeText(t),!0}catch{let e=document.createElement("textarea");e.value=t,e.setAttribute("readonly",""),e.style.cssText="position:fixed;opacity:0;pointer-events:none",document.body.appendChild(e),e.select();let n=!1;try{n=document.execCommand("copy")}catch{}return e.remove(),n}}var pe=t=>String(t?.message??t).replace(/\s+/g," ").slice(0,160),aa=(t,e,n)=>{let r=t.get(e)?.data;return new Map(t).set(e,r?{state:"ready",data:r,error:n.message}:{state:"error",error:n.message})},yr=class t extends s.default.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}componentDidCatch(){this.props.retry&&(Ke.clear(),de.clear())}render(){let{children:e,fallback:n,retry:r}=this.props;return this.state.failed?r?s.default.createElement(t,{fallback:n},r):n:e}},as={fetch:"\u83B7\u53D6",pull:"\u62C9\u53D6",push:"\u63A8\u9001"};function is(t){let{op:e,plan:n}=t,r=s.default.createElement("b",{key:"b"},n.branch);return e==="push"?s.default.createElement(s.default.Fragment,null,s.default.createElement("p",{className:"wt-dtext"},"\u628A ",r," ",n.ahead!=null?`\u4E0A\u7684 ${n.ahead} \u4E2A\u63D0\u4EA4`:"\u4E0A\u672A\u63A8\u9001\u7684\u63D0\u4EA4",n.push.create?s.default.createElement(s.default.Fragment,null,"\u63A8\u5230\u8FDC\u7AEF ",s.default.createElement("code",null,n.push.remote),"\uFF1A\u5EFA\u7ACB\u540C\u540D\u5206\u652F"," ",s.default.createElement("code",null,n.push.branch),"\uFF0C\u5E76\u8BBE\u4E3A\u5B83\u7684\u4E0A\u6E38\u3002"):s.default.createElement(s.default.Fragment,null,"\u63A8\u5230"," ",s.default.createElement("code",null,n.push.remote,"/",n.push.branch),"\u3002")),s.default.createElement("p",{className:"wt-dtext"},"\u4E0D\u5F3A\u63A8\uFF1A\u8FDC\u7AEF\u6709\u672C\u5730\u6CA1\u6709\u7684\u63D0\u4EA4\u65F6\uFF0C\u8FD9\u6B21\u63A8\u9001\u4F1A\u88AB\u62D2\u7EDD\u3002",n.dirty>0&&" \u672A\u63D0\u4EA4\u7684\u6539\u52A8\u4E0D\u4F1A\u88AB\u63A8\u9001\uFF0C\u53EA\u63A8\u5DF2\u7ECF\u63D0\u4EA4\u7684\u5185\u5BB9\u3002")):e==="pull"?s.default.createElement(s.default.Fragment,null,s.default.createElement("p",{className:"wt-dtext"},"\u4ECE ",s.default.createElement("code",null,n.upstream)," \u53D6\u56DE\u66F4\u65B0\uFF0C\u628A ",r," \u5FEB\u8FDB\u5230\u8FDC\u7AEF\u3002",n.behind>0?` \u6309\u672C\u5730\u8BB0\u5F55\u843D\u540E ${n.behind} \u4E2A\u63D0\u4EA4\u3002`:" \u672C\u5730\u8BB0\u5F55\u663E\u793A\u6CA1\u6709\u843D\u540E\u7684\u63D0\u4EA4\uFF0C\u4EE5\u8FDC\u7AEF\u7684\u5B9E\u9645\u60C5\u51B5\u4E3A\u51C6\u3002"),s.default.createElement("p",{className:"wt-dtext"},"\u53EA\u505A\u5FEB\u8FDB\uFF1A\u4E0D\u80FD\u5FEB\u8FDB\u65F6\u4EC0\u4E48\u90FD\u4E0D\u6539\u3002",n.dirty>0&&` \u6709 ${n.dirty} \u4E2A\u6587\u4EF6\u672A\u63D0\u4EA4\uFF1A\u5982\u679C\u548C\u8FDC\u7AEF\u7684\u66F4\u65B0\u51B2\u7A81\uFF0CGit \u4F1A\u505C\u4E0B\u6765\uFF0C\u4E0D\u52A8\u4F60\u7684\u6587\u4EF6\u3002`)):s.default.createElement("p",{className:"wt-dtext"},"\u53D6\u56DE\u8FDC\u7AEF\u7684\u6700\u65B0\u8BB0\u5F55\uFF0C\u4E0D\u52A8\u4F60\u7684\u6587\u4EF6\u548C\u5206\u652F\u3002")}function ss({job:t,onClose:e,onRun:n}){let r=as[t.op],o=t.state==="busy",i=t.result;return s.default.createElement(Je,{title:t.state==="done"?i.ok?`${r}\u5B8C\u6210`:`${r}\u6CA1\u6709\u5B8C\u6210`:`\u786E\u8BA4${r}`,onClose:()=>!o&&e(),footer:s.default.createElement(s.default.Fragment,null,t.state==="ready"&&s.default.createElement(s.default.Fragment,null,s.default.createElement("button",{className:"wt-btn",onClick:e},"\u53D6\u6D88"),s.default.createElement("button",{className:"wt-btn"+(t.op==="push"?" is-primary":""),onClick:()=>n(t)},r,t.op==="push"&&t.plan.push.create?"\u5E76\u5EFA\u7ACB\u8FDC\u7AEF\u5206\u652F":"")),t.state==="done"&&s.default.createElement("button",{className:"wt-btn is-primary",onClick:e},"\u5B8C\u6210"))},s.default.createElement("p",{className:"wt-dsub"},s.default.createElement("span",{className:"wt-drepo"},t.tree.branch||"\u5206\u79BB HEAD"),s.default.createElement(Xt,{className:"wt-dpath",title:t.tree.path,text:t.tree.path})),t.state!=="done"&&is(t),t.state==="busy"&&s.default.createElement("p",{className:"wt-emptyline",role:"status"},s.default.createElement("span",{className:"wt-spinner","aria-hidden":"true"}),"\u6B63\u5728",r,"\uFF0C\u5927\u4ED3\u5E93\u53EF\u80FD\u8981\u7B49\u4E00\u4F1A\u513F\u2026"),t.error&&s.default.createElement("p",{className:"wt-notice is-danger",role:"alert"},s.default.createElement(z,{name:"warning",size:14}),t.error),t.state==="done"&&s.default.createElement(s.default.Fragment,null,s.default.createElement("p",{className:"wt-notice "+(i.ok?"is-ok":"is-danger"),role:"status"},s.default.createElement(z,{name:i.ok?"check":"warning",size:14}),i.head),i.output&&s.default.createElement("pre",{className:"wt-syncout"},i.output)))}function ls({width:t,onResize:e,onCommit:n}){let[r,o]=(0,s.useState)(!1),i=(0,s.useRef)(null),d=c=>{i.current&&(i.current=null,o(!1),c.currentTarget.hasPointerCapture?.(c.pointerId)&&c.currentTarget.releasePointerCapture(c.pointerId),n(t))};return s.default.createElement("div",{className:"wt-resizer",role:"separator","aria-orientation":"vertical","aria-label":"\u8C03\u6574\u5DE5\u4F5C\u6811\u6E05\u5355\u7684\u5BBD\u5EA6","aria-valuemin":ia,"aria-valuemax":sa,"aria-valuenow":t,tabIndex:0,"data-dragging":r?"":void 0,onPointerDown:c=>{c.button===0&&(c.preventDefault(),c.currentTarget.setPointerCapture(c.pointerId),i.current={x:c.clientX,width:t},o(!0))},onPointerMove:c=>{i.current&&e(i.current.width+c.clientX-i.current.x)},onPointerUp:d,onPointerCancel:d,onDoubleClick:()=>n(Nr),onKeyDown:c=>{let l=c.key==="ArrowLeft"?-16:c.key==="ArrowRight"?16:0;if(!l)return;c.preventDefault();let b=Wn(t+l);e(b),n(b)}})}function la(t){let e=Ke.load(),n=r=>s.default.createElement(ds,{key:r?"saved":"empty",saved:r?e:null,...t});return s.default.createElement(yr,{fallback:s.default.createElement("div",{className:"wt-wrap"},s.default.createElement("style",null,Un),s.default.createElement("p",{className:"wt-emptyline"},"\u9762\u677F\u663E\u793A\u51FA\u9519\u3002",s.default.createElement("button",{className:"wt-linkbtn",onClick:()=>location.reload()},"\u5237\u65B0"))),retry:n(!1)},n(!!e))}function ds({services:t,useContextMenu:e,renderFactorySlot:n,saved:r}){os(t);let{getTriggerProps:o}=(e??rs)(),i=(0,s.useRef)(null),d=(0,s.useRef)(null),c=(0,s.useRef)(null),l=(0,s.useRef)(null),[b,f]=(0,s.useState)(0),[g,x]=(0,s.useState)(()=>Date.now()),[u,$]=(0,s.useState)(()=>r?{...r.catalog,cached:!0}:null),[y,N]=(0,s.useState)(""),[S,O]=(0,s.useState)(!1),[E,L]=(0,s.useState)(!1),[F,Y]=(0,s.useState)(()=>r?.details??new Map),[U,D]=(0,s.useState)(0),[_,Q]=(0,s.useState)({done:0,total:0}),[X,kt]=(0,s.useState)([]),[it]=(0,s.useState)(()=>de.load().list),[K,lt]=(0,s.useState)(it.scope),[wt,B]=(0,s.useState)(it.query),[q,ct]=(0,s.useState)(()=>Object.hasOwn(ne,it.filter)?it.filter:"all"),[R,yt]=(0,s.useState)(()=>er.includes(it.tool)?it.tool:""),[Tt,jt]=(0,s.useState)(()=>bt.get("sort","attention")),[V,mt]=(0,s.useState)(it.selected),[Ft,tt]=(0,s.useState)(it.stack),[Ot,Bt]=(0,s.useState)(()=>Wn(bt.get("listW",Nr))),[j,st]=(0,s.useState)(()=>bt.get("railOff",!1)===!0),[Nt,Jt]=(0,s.useState)(()=>bt.get("listOff",!1)===!0),[Dt,It]=(0,s.useState)(it.branchesOpen===!0),[Qe,un]=(0,s.useState)(0),[Oe,fn]=(0,s.useState)(()=>new Set(it.collapsed)),[ce,Re]=(0,s.useState)(()=>new Set(it.staleOpen)),[De,Vn]=(0,s.useState)(it.quietOpen),[St,ht]=(0,s.useState)(null),[tn,Ct]=(0,s.useState)(null),[Ie,Kt]=(0,s.useState)(null),[mn,Le]=(0,s.useState)(!1),[Pe,Yt]=(0,s.useState)(!1),[qt,Qt]=(0,s.useState)(null),Rt=(0,s.useRef)(K);Rt.current=K;let J=(0,s.useMemo)(()=>(u?.repos??[]).map(a=>{let h=F.get(a.id);return{id:a.id,path:a.path,name:a.name,groups:a.groups,count:a.trees.length,state:h?.state??(u?"loading":"idle"),error:h?.error,data:h?.data,trees:h?.data?.trees??null}}),[u,F]),be=!u||J.some(a=>a.state==="loading"),He=(0,s.useMemo)(()=>{let a=u?.time??0;for(let h of J)h.data&&(a=Math.min(a,h.data.time));return a},[u,J]),te=J.some(a=>a.data),hn=!!u&&!u.cached,Zt=hn?Array.isArray(u.features)?u.features:[]:Array.isArray(r?.catalog?.features)?r.catalog.features:Ke.features,en=hn&&Zt.length===0,nt=(0,s.useMemo)(()=>J.find(a=>a.id===K)??null,[J,K]),gn=!!r||U>0,pt=b>=Qi,je=b>=ra&&!j,Fe=pt&&Nt,_t=!pt&&Ft>0,Gt=wt.trim(),bn=u?.home??"",we=t.state;(0,s.useEffect)(()=>{let a=i.current;if(!a)return;let h=()=>f(a.clientWidth);h();let T=new ResizeObserver(h);return T.observe(a),()=>T.disconnect()},[]),(0,s.useEffect)(()=>{let a=setInterval(()=>x(Date.now()),6e4);return()=>clearInterval(a)},[]),(0,s.useEffect)(()=>{if(r&&!U&&Array.isArray(r.catalog?.features))return;let a=new AbortController;return L(!0),N(""),zt("catalog",U?{refresh:"1"}:{},a.signal).then(h=>{a.signal.aborted||($(h),Ke.features=Array.isArray(h.features)?h.features:[],Y(T=>Ir(T,h)))}).catch(h=>{a.signal.aborted||N(h.message)}).finally(()=>{a.signal.aborted||L(!1)}),()=>a.abort()},[U]),(0,s.useEffect)(()=>{if(!u||u.cached)return;let a=new AbortController,h=u.repos.map(H=>H.id);if(Rt.current!=="all"){let H=h.indexOf(Rt.current);H>0&&h.unshift(...h.splice(H,1))}let T=0;Q({done:0,total:h.length});let I=async()=>{for(;h.length&&!a.signal.aborted;){let H=h.shift();try{let et=await zt("repository",{id:H},a.signal);if(a.signal.aborted)return;Y(ut=>new Map(ut).set(H,{state:"ready",data:et}))}catch(et){if(a.signal.aborted)return;Y(ut=>aa(ut,H,et))}T+=1,a.signal.aborted||Q(et=>({...et,done:T}))}};for(let H=0;H<Ri;H++)I();return()=>a.abort()},[u]),(0,s.useEffect)(()=>{de.saveList({scope:K,query:wt,filter:q,tool:R,stack:Ft,selected:V,collapsed:[...Oe],staleOpen:[...ce],quietOpen:De,branchesOpen:Dt})},[K,wt,q,R,Ft,V,Oe,ce,De,Dt]),(0,s.useEffect)(()=>{K==="all"||!u||u.repos.some(a=>a.id===K)||lt("all")},[u,K]);let oe=(0,s.useRef)(null);oe.current=u?{catalog:{...u,cached:void 0},details:F}:null,(0,s.useEffect)(()=>{let a=()=>{oe.current&&Ke.save(oe.current)},h=setTimeout(a,400);return addEventListener("pagehide",a),()=>{clearTimeout(h),removeEventListener("pagehide",a)}},[u,F]),(0,s.useEffect)(()=>{let a=!0;return Ar().then(h=>{a&&kt(mo(h))}),()=>{a=!1}},[]);let ot=(0,s.useCallback)(async a=>{Y(h=>new Map(h).set(a,{state:"loading",data:h.get(a)?.data}));try{let h=await zt("repository",{id:a});Y(T=>new Map(T).set(a,{state:"ready",data:h}))}catch(h){Y(T=>aa(T,a,h))}},[]),[xe,xn]=(0,s.useState)(()=>new Map),Ut=(0,s.useRef)(xe),Wt=(0,s.useCallback)((a,h)=>{let T=new Map(Ut.current);h?T.set(a,h):T.delete(a),Ut.current=T,xn(T)},[]),ae=(0,s.useCallback)(async(a,h=!1)=>{let T=vt.list();for(let H of T){if(a&&!a.includes(H.key))continue;let et=Ut.current.get(H.key);if(!(!h&&et&&et.entry.session===H.session&&(!(et.status==="loading"||et.status==="ready"&&et.data.running)||Date.now()-et.at<es))){Wt(H.key,{status:"loading",entry:H,at:Date.now()});try{let ut=await zt("review",{id:H.repo,tree:H.tree,session:H.session});Wt(H.key,{status:"ready",entry:H,data:ut,at:Date.now()})}catch(ut){Wt(H.key,{status:"error",entry:H,error:ut.message,at:Date.now()})}}}let I=new Set(T.map(H=>H.key));for(let H of Ut.current.keys())I.has(H)||Wt(H,null)},[Wt]);(0,s.useEffect)(()=>{if(!u)return;let a=!0,h=!1,T=async()=>{if(!(!a||h)){h=!0;try{await ae()}finally{h=!1}}};T();let I=setInterval(T,ts);return()=>{a=!1,clearInterval(I)}},[u,ae]);let vn=(0,s.useCallback)((a,h)=>xe.get(vt.key(a,h))??null,[xe]),Be=(0,s.useMemo)(()=>new Set(vt.list().map(a=>a.key)),[xe]),ie=(0,s.useCallback)((a,h)=>Be.has(vt.key(a.id,h)),[Be]),ue=(0,s.useCallback)(a=>{vt.set(a,null),Wt(a,null)},[Wt]);(0,s.useEffect)(()=>{if(u)for(let a of vt.list()){let h=J.find(I=>I.id===a.repo);if(!h?.data)continue;let T=h.data.trees?.find(I=>I.id===a.tree);T?Xr(T,a.scope)&&ue(a.key):!u.cached&&h.state==="ready"&&!h.error&&ue(a.key)}},[J,u,Be]);let[Kn,kn]=(0,s.useReducer)(a=>a+1,0);(0,s.useEffect)(()=>xt.subscribe(kn),[]);let Zn=(0,s.useCallback)((a,h)=>{let T=vt.key(a.id,h);if(!xt.has(T))return null;let I=Vt(h,ln(h));return I?.length?xt.progress(T,I):null},[J,Kn]),qe=(0,s.useCallback)((a,h,T)=>{let I=Object.fromEntries(_n.map(et=>[et,0])),H={};for(let et of a)for(let ut of et.trees??[]){for(let Pt of ut.tools??[])H[Pt]=(H[Pt]??0)+1;if(!(h&&!ut.tools?.includes(h))){I.all+=1;for(let Pt of _n.slice(1))ne[Pt][1](ut,{repo:et,reviewed:T})&&(I[Pt]+=1)}}return{totals:I,tools:H}},[]),_e=(0,s.useMemo)(()=>qe(J,R,ie),[J,R,ie,qe]),nn=(0,s.useMemo)(()=>K==="all"?_e:nt?qe([nt],R,ie):{totals:Object.fromEntries(_n.map(a=>[a,0])),tools:{}},[_e,K,nt,R,ie,qe]),ve=nn.totals,yn=nn.tools,ke=(0,s.useMemo)(()=>J.map(a=>{let h=he(Gt,a.name,a.path,...a.groups),T=(a.trees??[]).filter(I=>(!R||I.tools?.includes(R))&&(h||he(Gt,Ce(I),I.path,I.head)));return{repo:a,live:T.filter(I=>!I.prunable&&ne[q][1](I,{repo:a,reviewed:ie})).sort((I,H)=>Vr(I,H,Tt==="attention")),stale:T.filter(I=>I.prunable)}}),[J,Gt,R,q,Tt,ie]),We=(0,s.useMemo)(()=>to(ke.filter(a=>a.live.length||a.stale.length||a.repo.state==="error"),Tt),[ke,Tt]),rn=K==="all"&&q==="all"&&!Gt&&!R,ye=(0,s.useMemo)(()=>rn?We.filter(a=>Dn(a.repo.trees)):[],[We,rn]),ee=(0,s.useMemo)(()=>K==="all"?We.filter(a=>!ye.includes(a)):ke.filter(a=>a.repo.id===K),[We,ye,K,ke]),Nn=De?[...ee,...ye]:ee,m=(0,s.useMemo)(()=>Nn.flatMap(a=>[...a.live,...q==="stale"||ce.has(a.repo.id)?a.stale:[]].map(h=>({repo:a.repo,tree:h}))),[Nn,q,ce]),A=!!Gt||q!=="all"||!!R,W=(0,s.useMemo)(()=>[...(u?.sources??[]).filter(a=>a.warning).map(a=>`${a.name}\uFF1A${a.warning}`),...(u?.warnings??[]).map(a=>`${a.root}\uFF1A${a.message}`)],[u]),G=(0,s.useCallback)((a,h)=>{mt({repo:a,path:h.path}),pt||tt(1)},[pt]);(0,s.useEffect)(()=>{if(!u||_t||m.some(h=>h.repo.id===V?.repo&&h.tree.path===V?.path))return;let a=m[0];mt(pt&&a?{repo:a.repo.id,path:a.tree.path}:null)},[m,pt,_t,u,V]);let dt=(0,s.useRef)(!0);(0,s.useEffect)(()=>{if(dt.current){dt.current=!1;return}tt(0)},[K,wt,q,R,pt]),(0,s.useEffect)(()=>{je&&Yt(!1)},[je]);let Mt=(0,s.useRef)(!0);(0,s.useEffect)(()=>{if(Mt.current){Mt.current=!1;return}c.current?.scrollTo?.({top:0})},[K]);let se=(0,s.useRef)(it.top);(0,s.useLayoutEffect)(()=>{let a=c.current;if(!a)return;a.scrollTop=se.current;let h=()=>{se.current=a.scrollTop,de.saveList({top:a.scrollTop})};return a.addEventListener("scroll",h,{passive:!0}),()=>{a.removeEventListener("scroll",h),h()}},[Fe,_t]),(0,s.useEffect)(()=>{if(!qt)return;let a=setTimeout(()=>Qt(null),4500);return()=>clearTimeout(a)},[qt]);let $t=(0,s.useMemo)(()=>{if(!V||!u)return null;let a=J.find(h=>h.id===V.repo);return a?{repo:a,tree:a.trees?.find(h=>h.path===V.path)??null}:null},[J,V,u]),at=(0,s.useCallback)((a,h=!1)=>{if(t.state.notify)return t.state.notify(a,h);Qt({text:a,tone:h?"ok":"bad"})},[t]),on=(0,s.useCallback)(async(a,h,T)=>{try{let I=await zt("sync-plan",{id:a,tree:h.id});if(!I[T]?.ok){at(I[T]?.reason||"\u8FD9\u9879\u64CD\u4F5C\u73B0\u5728\u4E0D\u80FD\u6267\u884C",!1);return}if(T==="fetch")return Ne({repo:a,tree:h,op:T,plan:I});Ct({repo:a,tree:h,op:T,plan:I,state:"ready"})}catch(I){at(`\u6CA1\u6CD5\u5224\u65AD\u8FD9\u9879\u64CD\u4F5C\u4F1A\u505A\u4EC0\u4E48\uFF1A${pe(I)}`,!1)}},[at]);async function Ne(a){let h=a.op==="fetch";h||Ct({...a,state:"busy",error:""});try{let T=await zt("sync",{id:a.repo,tree:a.tree.id,op:a.op,expect:a.plan.stamp},void 0,"sync");h&&T.ok?at(T.head,!0):Ct({...a,state:"done",result:T}),await ot(a.repo)}catch(T){h?at(`\u83B7\u53D6\u6CA1\u6709\u5B8C\u6210\uFF1A${pe(T)}`,!1):Ct({...a,state:"ready",error:pe(T)})}}let fe=(0,s.useCallback)(async a=>{try{let h=await zt("prune-plan",{id:a});if(!h.entries.length)return at("\u6CA1\u6709\u53EF\u6E05\u7406\u7684\u5931\u6548\u767B\u8BB0",!1);ht({repo:a,plan:h,state:"ready",error:""})}catch(h){at(`\u65E0\u6CD5\u9884\u89C8\u5F85\u6E05\u7406\u7684\u767B\u8BB0\uFF1A${h.message}`,!1)}},[at]),Lt=(0,s.useCallback)(async a=>{let h=t.state.dsh;if(h)try{let T=await h.createWorkspace(a.path);await h.openWorkspace(T).catch(()=>{})}catch(T){at(`\u65E0\u6CD5\u5728\u8FD9\u4E2A\u76EE\u5F55\u6253\u5F00 DSH \u4F1A\u8BDD\uFF1A${pe(T)}`,!1)}},[t,at]),Se=(0,s.useCallback)(async(a,h)=>{let T=await zt("review-prompt",{id:a},h);return{prompt:typeof T.prompt=="string"?T.prompt:"",file:typeof T.file=="string"?T.file:""}},[]),an=(0,s.useCallback)(async(a,h)=>{let T=await zt("set-review-prompt",{id:a},void 0,"prompt",{prompt:h}),I=typeof T.prompt=="string"?T.prompt:"";return Y(H=>{let et=H.get(a);return et?.data?new Map(H).set(a,{...et,data:{...et.data,reviewPrompt:!!I}}):H}),I},[]),Cr=(0,s.useCallback)(async(a,h,T="uncommitted")=>{let I=t.state.dsh;if(!I)return;let H=vt.key(a,h),et=Ge(h,T),ut=Zt?.includes("prompt")?await Se(a).then(Pt=>Pt.prompt).catch(()=>null):null;try{let Pt=await I.connect(await I.createWorkspace(h.path));vt.set(H,{session:Pt,at:Date.now(),stamp:et,scope:T,custom:!!ut}),I.openSession(Pt),await I.send(Pt,ro(h,et,T,ut))}catch(Pt){vt.set(H,null),at(`\u65E0\u6CD5\u53D1\u8D77\u5BA1\u67E5\uFF1A${pe(Pt)}`,!1)}},[t,at,Zt,Se]),sn=(0,s.useMemo)(()=>({dsh:we.dsh,review:we.dsh&&Zt?.includes("review")?Cr:null,features:Zt,newDsh:Lt,openDsh(a){let h=t.state.dsh;if(!h)return;let T=a.sessions.filter(I=>I.source==="DSH"&&!I.archived);if(!T.length)return Lt(a);try{h.openSession(T[0].id)}catch(I){at(`\u65E0\u6CD5\u6253\u5F00\u4F1A\u8BDD\uFF1A${pe(I)}`,!1)}},async openApp(a,h,T){let I=T.label.replace(/^在/,"").replace(/中(打开|显示)$/,"");try{if(T.fallback)await zt("open-folder",{id:a,tree:h.id,target:T.target},void 0,"open");else if(!await Or(T.app,h.path))throw Error("\u5BBF\u4E3B\u6CA1\u6709\u54CD\u5E94")}catch(H){at(`\u65E0\u6CD5\u7528${I}\u6253\u5F00\uFF1A${pe(H)}`,!1)}},async openTool(a,h,T){if(h.source==="DSH"){try{t.state.dsh?.openSession(h.id)}catch(H){at(`\u65E0\u6CD5\u6253\u5F00\u4F1A\u8BDD\uFF1A${pe(H)}`,!1)}return}let I=h.source==="ZCode"&&h.title?await oa(h.title):!1;try{await zt("open-session",{id:T,tree:a.id,session:h.id,source:h.source},void 0,"navigate"),h.source==="ZCode"&&at(I?"\u5DF2\u590D\u5236\u6807\u9898\uFF0C\u53EF\u5728 ZCode \u91CC\u6309\u6807\u9898\u627E\u5230\u539F\u4F1A\u8BDD":"\u5DF2\u8BF7\u6C42\u6253\u5F00 ZCode\uFF0C\u53EF\u6309\u6807\u9898\u6216 ID \u67E5\u627E\u539F\u4F1A\u8BDD",!0)}catch(H){at(H.message,!1)}},async copy(a,h,T){let I=await oa(a);return I?!T&&h&&at(h,!0):at("\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u9009\u4E2D\u6587\u5B57\u624B\u52A8\u590D\u5236",!1),I},openReview(a){try{t.state.dsh?.openSession(a)}catch(h){at(`\u65E0\u6CD5\u6253\u5F00\u5BA1\u67E5\u4F1A\u8BDD\uFF1A${pe(h)}`,!1)}},forgetReview(a,h){ue(vt.key(a,h))},editPrompt:Zt?.includes("prompt")?a=>Kt(a):null,loadPrompt:Se,savePrompt:an,retryReview(a,h){ae([vt.key(a.id,h)],!0)},sync:on,requestPrune:fe}),[t,at,fe,Lt,on,Cr,Zt,we.dsh,ae,Wt,ue,Se,an]);Hn.current={lookup:(a,h)=>F.get(a)?.data?.trees?.find(T=>T.path===h),prompted:a=>!!F.get(a)?.data?.reviewPrompt,apps:X,act:sn};let pa=async()=>{let a=St;ht({...a,state:"busy",error:""});try{let h=await zt("prune",{id:a.repo,expect:a.plan.entries.length},void 0,"prune");ht(null),D(T=>T+1),Qt({text:`\u5DF2\u6E05\u7406 ${h.removed.length} \u6761\u5931\u6548\u767B\u8BB0`,tone:"ok"})}catch(h){if(/重新确认/.test(h.message))return fe(a.repo);ht({...a,state:"ready",error:h.message})}},ca=a=>{jt(a),bt.set("sort",a)},Gn=()=>{B(""),ct("all"),yt("")},Sn=a=>lt(a),wa=a=>{lt(a),It(!0),un(h=>h+1)},ua=a=>{Gn(),mt({repo:K,path:a}),pt||tt(1)},$r=a=>{lt("all"),ct("all"),B(a)},fa=a=>{let h=a.target,T=h instanceof HTMLElement&&h.closest("input, textarea, select, [contenteditable]");if(a.key==="Escape"){if(T){h===d.current&&wt?B(""):h.blur();return}_t?(a.preventDefault(),tt(0)):wt&&B("");return}if((a.metaKey||a.ctrlKey)&&a.key.toLowerCase()==="f"){a.preventDefault(),d.current?.focus(),d.current?.select();return}if(!(T||_t))if(a.key==="/")a.preventDefault(),d.current?.focus();else if(a.key==="ArrowDown"||a.key==="ArrowUp"){a.preventDefault();let I=m.findIndex(ut=>ut.repo.id===V?.repo&&ut.tree.path===V?.path),H=a.key==="ArrowDown"?Math.min(m.length-1,I+1):Math.max(0,I-1),et=m[H<0?0:H];et&&(mt({repo:et.repo.id,path:et.tree.path}),c.current?.querySelector(`[data-path="${CSS.escape(et.tree.path)}"]`)?.scrollIntoView({block:"nearest"}))}else a.key==="Enter"&&V&&!pt&&(a.preventDefault(),tt(1))},zr=St?J.find(a=>a.id===St.repo):null,Tr=J.find(a=>a.id===Ie),Mr=E||!u,Cn=(a,h)=>{a==="railOff"?st(h):Jt(h),bt.set(a,h)};return s.default.createElement("div",{ref:i,className:"wt-wrap","data-layout":pt?"split":"stack","data-busy":be?"":void 0,style:{"--list-w":`${Ot}px`},tabIndex:-1,onKeyDown:fa,onPointerDown:a=>{a.target.closest("button, a, input, select, textarea, [contenteditable], [tabindex]")||i.current?.focus({preventScroll:!0})}},s.default.createElement("style",null,Un),s.default.createElement("header",{className:"wt-top"},s.default.createElement("span",{className:"wt-brand"},s.default.createElement(z,{size:17}),s.default.createElement("h1",null,"\u5DE5\u4F5C\u6811")),s.default.createElement("label",{className:"wt-search"},s.default.createElement(z,{name:"search",size:15}),s.default.createElement("input",{ref:d,"aria-label":"\u641C\u7D22\u4ED3\u5E93\u3001\u5206\u652F\u3001\u5DE5\u5355\u53F7\u6216\u8DEF\u5F84",placeholder:"\u641C\u7D22\u4ED3\u5E93\u3001\u5206\u652F\u3001\u5DE5\u5355\u53F7\u6216\u8DEF\u5F84",value:wt,spellCheck:!1,onChange:a=>B(a.target.value)}),wt?s.default.createElement("button",{className:"wt-iconbtn","aria-label":"\u6E05\u9664\u641C\u7D22",onClick:()=>B("")},s.default.createElement(z,{name:"close",size:13})):s.default.createElement("kbd",{title:"\u5FEB\u6377\u952E \u2318F \u6216 /"},"/")),be||E?s.default.createElement("span",{className:"wt-readat",role:"status",title:gn?`\u5148\u663E\u793A\u4E0A\u6B21\u8BFB\u5230\u7684\u7ED3\u679C\uFF1A${Et(He)}`:void 0},gn?"\u6B63\u5728\u66F4\u65B0\u2026":"\u6B63\u5728\u8BFB\u53D6\u2026"):u&&s.default.createElement("span",{className:"wt-readat",title:Et(He)},"\u8BFB\u53D6\u4E8E ",gt(He,g)),s.default.createElement("button",{className:"wt-iconbtn",title:"\u5237\u65B0\uFF1A\u91CD\u65B0\u8BFB\u53D6\u5404\u4ED3\u5E93\u7684\u72B6\u6001\uFF08\u6253\u5F00\u9762\u677F\u65F6\u4E0D\u4F1A\u81EA\u52A8\u5237\u65B0\uFF09","aria-label":"\u5237\u65B0",disabled:Mr,onClick:()=>D(a=>a+1)},s.default.createElement(z,{name:"refresh",size:16,className:Mr?"spin":""})),s.default.createElement("button",{className:"wt-iconbtn",title:"\u8FD9\u4E9B\u540D\u8BCD\u662F\u4EC0\u4E48\u610F\u601D","aria-label":"\u8BF4\u660E","aria-haspopup":"dialog",onClick:()=>Le(!0)},s.default.createElement(z,{name:"help",size:16}))),qt&&!we.notify&&s.default.createElement("div",{className:"wt-flash","data-tone":qt.tone,role:"status"},qt.text),en&&!S&&s.default.createElement("div",{className:"wt-flash is-stay",role:"status"},"\u9762\u677F\u5DF2\u7ECF\u66F4\u65B0\uFF0C\u5BBF\u4E3B\u91CC\u7684\u63D2\u4EF6\u8981\u91CD\u542F DSH \u624D\u4F1A\u6362\uFF1A\u91CD\u542F\u540E\u624D\u6709\u300C\u83B7\u53D6 / \u62C9\u53D6 / \u63A8\u9001\u300D\u548C\u300CAI \u5BA1\u67E5\u300D\u3002",s.default.createElement("button",{className:"wt-linkbtn",onClick:()=>O(!0)},"\u77E5\u9053\u4E86")),y&&s.default.createElement("div",{className:"wt-flash is-stay","data-tone":"bad",role:"alert"},y,u&&" \xB7 \u4E0B\u9762\u4FDD\u7559\u4E0A\u6B21\u8BFB\u5230\u7684\u7ED3\u679C",s.default.createElement("button",{className:"wt-linkbtn",onClick:()=>D(a=>a+1)},"\u91CD\u8BD5")),!_t&&s.default.createElement("div",{className:"wt-filters"},!je&&s.default.createElement(ea,{name:nt?.name??"\u5168\u90E8\u4ED3\u5E93",path:nt?.path,selected:!!nt,open:Pe,buttonRef:l,onOpen:()=>Yt(!0),onClear:()=>Sn("all")}),s.default.createElement("div",{className:"wt-chips",role:"group","aria-label":"\u6309\u72B6\u6001\u7B5B\u9009"},_n.map(a=>s.default.createElement("button",{key:a,className:"wt-chip","aria-pressed":q===a,"data-empty":ve[a]?void 0:"",onClick:()=>ct(q===a?"all":a)},ne[a][0],s.default.createElement("b",null,ve[a])))),s.default.createElement("span",{className:"wt-spacer"}),s.default.createElement("div",{className:"wt-chips",role:"group","aria-label":"\u6309\u5173\u8054\u5DE5\u5177\u7B5B\u9009"},s.default.createElement("button",{className:"wt-chip","aria-pressed":!R,onClick:()=>yt("")},"\u5168\u90E8\u5DE5\u5177"),er.map(a=>s.default.createElement("button",{key:a,className:"wt-chip","aria-pressed":R===a,"data-empty":yn[a]?void 0:"",onClick:()=>yt(R===a?"":a)},a,s.default.createElement("b",null,yn[a]??0))))),s.default.createElement("div",{className:"wt-body"},je&&s.default.createElement(Yo,{repos:J,counts:_e.totals,scope:K,choose:Sn,onCollapse:()=>Cn("railOff",!0)}),!_t&&!Fe&&s.default.createElement(ta,{scope:K,repos:J,groups:ee,quiet:ye,quietOpen:De,staleOpen:ce,filterStale:q==="stale",collapsed:A?ns:Oe,selected:pt?V:null,cursor:V?.path,sort:Tt,progress:be?_:{done:1,total:1},total:{trees:ve.all},filtered:A,now:g,pick:G,onTicket:$r,goAll:()=>Sn("all"),setSort:ca,setQuietOpen:Vn,toggleStale:a=>Re(h=>{let T=new Set(h);return T.delete(a)||T.add(a),T}),toggleGroup:a=>fn(h=>{let T=new Set(h);return T.delete(a)||T.add(a),T}),branches:{open:Dt,forced:!!Gt,jump:Qe,toggle:()=>It(a=>!a),show:wa},requestPrune:fe,retry:ot,reviewOf:vn,seenOf:Zn,clearFilters:Gn,getTriggerProps:o,renderFactorySlot:n,act:sn,scrollRef:c,catalogEmpty:!!u&&J.length===0,onCollapse:pt?()=>Cn("listOff",!0):null,onExpandRail:b>=ra&&j?()=>Cn("railOff",!1):null,showTree:ua,query:Gt}),pt&&!Fe&&s.default.createElement(ls,{width:Ot,onResize:a=>Bt(Wn(a)),onCommit:a=>{let h=Wn(a);Bt(h),bt.set("listW",h)}}),(pt||_t)&&s.default.createElement(Jo,{target:$t,loading:!u||$t?.repo.state==="loading"&&!$t?.repo.data,error:$t?.repo.data?null:$t?.repo.error,split:pt,showRepo:K==="all",onBack:()=>tt(0),onExpandList:Fe?()=>Cn("listOff",!1):null,onTicket:$r,services:t,apps:X,act:sn,now:g,home:bn,getTriggerProps:o,renderFactorySlot:n,retry:ot,reload:ot,requestPrune:fe,review:$t?.tree?xe.get(vt.key($t.repo.id,$t.tree))??null:null,retryReview:sn.retryReview,total:{repos:ee.length+ye.length,trees:ve.all,...ve},warnings:W,onClear:A?Gn:null,busy:be&&!te,missing:!!u&&J.length===0})),Pe&&s.default.createElement(na,{repos:J,scope:K,total:_e.totals.all,anchor:l.current,onChoose:Sn,onClose:()=>Yt(!1)}),tn&&s.default.createElement(ss,{job:tn,onClose:()=>Ct(null),onRun:Ne}),St&&zr&&s.default.createElement(Je,{title:`\u6E05\u7406 ${St.plan.entries.length} \u6761\u5931\u6548\u767B\u8BB0`,onClose:()=>St.state!=="busy"&&ht(null),footer:s.default.createElement(s.default.Fragment,null,s.default.createElement("button",{className:"wt-btn",disabled:St.state==="busy",onClick:()=>ht(null)},"\u53D6\u6D88"),s.default.createElement("button",{className:"wt-btn is-danger",disabled:St.state==="busy",onClick:pa},s.default.createElement(z,{name:"broom",size:15}),St.state==="busy"?"\u6B63\u5728\u6E05\u7406\u2026":"\u6E05\u7406\u767B\u8BB0"))},s.default.createElement("p",{className:"wt-dtext"},s.default.createElement("b",null,zr.name)," ","\u91CC\u4E0B\u9762\u8FD9\u4E9B\u5DE5\u4F5C\u6811\u7684\u76EE\u5F55\u5DF2\u7ECF\u4E0D\u5B58\u5728\u3002\u6E05\u7406\u53EA\u79FB\u9664 Git \u91CC\u7684\u767B\u8BB0\uFF0C\u4E0D\u4F1A\u5220\u9664\u4EFB\u4F55\u6587\u4EF6\uFF1B\u76EE\u5F55\u4E4B\u540E\u5982\u679C\u6062\u590D\uFF0C\u9700\u8981\u91CD\u65B0\u767B\u8BB0\u4E3A\u5DE5\u4F5C\u6811\u3002"),s.default.createElement("ul",{className:"wt-prunelist"},St.plan.trees.map(a=>s.default.createElement("li",{key:a.path},s.default.createElement("span",null,Ce(a)),s.default.createElement(Xt,{className:"wt-prunepath",title:a.path,text:On(a.path,bn)})))),St.error&&s.default.createElement("p",{className:"wt-notice is-danger",role:"alert"},St.error)),Ie&&Tr&&s.default.createElement(_o,{key:Ie,repo:Tr,act:sn,onClose:()=>Kt(null)}),mn&&s.default.createElement(Je,{title:"\u600E\u4E48\u770B\u8FD9\u5F20\u6E05\u5355",onClose:()=>Le(!1),wide:!0},s.default.createElement("dl",{className:"wt-glossary"},s.default.createElement("dt",null,"\u5DE5\u4F5C\u6811"),s.default.createElement("dd",null,"\u4E00\u4EFD\u72EC\u7ACB\u7684\u68C0\u51FA\u76EE\u5F55\u548C\u6682\u5B58\u533A\u3002\u540C\u4E00\u4ED3\u5E93\u7684\u5DE5\u4F5C\u6811\u5171\u4EAB\u63D0\u4EA4\u548C\u5206\u652F\uFF1B\u4E00\u68F5\u6811\u901A\u5E38\u68C0\u51FA\u4E00\u4E2A\u5206\u652F\uFF0C \u4E5F\u53EF\u4EE5\u505C\u5728\u67D0\u6B21\u63D0\u4EA4\uFF08\u5206\u79BB HEAD\uFF09\u3002"),s.default.createElement("dt",null,"\u6700\u8FD1\u6539\u52A8"),s.default.createElement("dd",null,"HEAD \u63D0\u4EA4\u65F6\u95F4\u548C\u6240\u6709\u6539\u52A8\u6587\u4EF6\u4FEE\u6539\u65F6\u95F4\u4E2D\u8F83\u665A\u7684\u90A3\u4E2A\uFF0C\u4E0D\u542B\u804A\u5929\u65F6\u95F4\u3002"),s.default.createElement("dt",null,"\u72B6\u6001\u70B9"),s.default.createElement("dd",null,"\u5206\u652F\u540D\u524D\u9762\u7684\u5706\u70B9\uFF0C\u53EA\u5728\u8FD9\u68F5\u5DE5\u4F5C\u6811\u6709\u4E8B\u53EF\u505A\u65F6\u51FA\u73B0\uFF1A\u9EC4\u8272\u662F\u6709\u672A\u63D0\u4EA4\u7684\u6539\u52A8\uFF0C\u84DD\u8272\u662F\u6709\u672A\u63A8\u9001\u7684\u63D0\u4EA4\uFF0C \u7EA2\u8272\u662F\u51B2\u7A81\u3001\u5408\u5E76\u6216\u53D8\u57FA\u8FDB\u884C\u4E2D\u3001\u8BFB\u53D6\u5931\u8D25\u3002\u6CA1\u6709\u5706\u70B9\u5C31\u662F\u5E72\u51C0\uFF0C\u6216\u8005\u53EA\u9700\u8981\u7559\u610F\uFF08\u6BD4\u5982\u843D\u540E\u4E0A\u6E38\uFF09\u3002"),s.default.createElement("dt",null,"\u884C\u5C3E\u7684\u6570\u5B57"),s.default.createElement("dd",null,"\u5DE5\u4F5C\u6811\u4E00\u884C\u53EA\u5199\u8981\u52A8\u624B\u7684\u4E8B\uFF1A\u2191 \u662F\u672A\u63A8\u9001\u7684\u63D0\u4EA4\u6570\uFF0C\u2193 \u662F\u843D\u540E\u7684\u63D0\u4EA4\u6570\uFF0C\u5E26\u7B14\u7684\u662F\u6539\u52A8\u4E86\u591A\u5C11\u4E2A\u6587\u4EF6\uFF0C \u7EA2\u8272\u8B66\u793A\u662F\u51B2\u7A81\u6216\u6709\u64CD\u4F5C\u505A\u5230\u4E00\u534A\uFF0C\u60AC\u505C\u80FD\u770B\u5230\u5B8C\u6574\u7684\u4E00\u53E5\u8BDD\u3002\u56DB\u89D2\u661F\u662F AI \u5BA1\u67E5\u7684\u7ED3\u8BBA\uFF0C\u540E\u9762\u7684\u6570\u662F\u6709\u51E0\u5904\u8981\u5904\u7406\uFF08\u89C1\u4E0B\u9762\u7684\u300CAI \u5BA1\u67E5\u300D\uFF09\uFF1B\u5C0F\u5706\u73AF\u662F\u300C\u5DF2\u5BA1\u9605\u300D\u7684\u8FDB\u5EA6\uFF08\u89C1\u4E0B\u9762\u7684\u300C\u5DF2\u5BA1\u9605\u300D\uFF09\u3002\u8DEF\u5F84\u3001\u4E0A\u6E38\u3001\u5206\u652F\u8D77\u70B9\u3001\u6700\u8FD1\u4E00\u6B21\u63D0\u4EA4\u3001\u5DE5\u5355\u53F7\u548C \u5173\u8054\u5DE5\u5177\u90FD\u5728\u9009\u4E2D\u540E\u7684\u8BE6\u60C5\u91CC\uFF1B\u6E05\u5355\u62C9\u5BBD\u540E\uFF0C\u884C\u91CC\u4E5F\u4F1A\u5E26\u51FA\u6700\u8FD1\u6539\u52A8\u65F6\u95F4\u548C\u5173\u8054\u5DE5\u5177\u3002"),s.default.createElement("dt",null,"\u63A5\u7740\u4E0A\u6B21\u770B"),s.default.createElement("dd",null,"\u7B5B\u9009\u3001\u9009\u4E2D\u7684\u5DE5\u4F5C\u6811\u3001\u6536\u8D77\u7684\u4ED3\u5E93\u3001\u505C\u5728\u7684\u9875\u7B7E\u548C\u6EDA\u52A8\u4F4D\u7F6E\u90FD\u8BB0\u5728\u672C\u673A\uFF1A\u5207\u5230\u522B\u7684\u9762\u677F\u518D\u56DE\u6765\u3001\u6216\u8005\u91CD\u542F\u4E4B\u540E\uFF0C \u63A5\u7740\u4E0A\u6B21\u7684\u5730\u65B9\u770B\u3002\u60F3\u4ECE\u5934\u6765\uFF0C\u6E05\u9664\u7B5B\u9009\u3001\u56DE\u5230\u5168\u90E8\u4ED3\u5E93\u5C31\u884C\u3002"),s.default.createElement("dt",null,"\u672A\u63D0\u4EA4 / \u672A\u63A8\u9001"),s.default.createElement("dd",null,"\u8BE6\u60C5\u91CC\u7684\u300C\u672A\u63D0\u4EA4\u300D\u662F\u5DE5\u4F5C\u76EE\u5F55\u548C HEAD \u6BD4\u7684\u6539\u52A8\uFF1B\u300C\u672A\u63A8\u9001\u300D\u662F\u548C\u4E0A\u6E38\u6BD4\u7684\uFF1A\u8FD8\u6CA1\u63A8\u9001\u7684\u63D0\u4EA4\uFF0C\u52A0\u4E0A\u8FD8\u6CA1\u63D0\u4EA4\u7684\u6539\u52A8\u3002\u5DE5\u4F5C\u533A\u662F\u5E72\u51C0\u7684\u3001\u4F46\u6709\u63D0\u4EA4\u6CA1\u63A8\u9001\u65F6\uFF0C \u6539\u52A8\u90FD\u5728\u300C\u672A\u63A8\u9001\u300D\u91CC\uFF1B\u63A8\u9001\u4E4B\u540E\u8FD9\u4E2A\u9875\u7B7E\u5C31\u6CA1\u6709\u4E86\u3002"),s.default.createElement("dt",null,"\u5DF2\u5BA1\u9605"),s.default.createElement("dd",null,"\u8BFB\u8FC7\u7684\u6587\u4EF6\u5728\u5DEE\u5F02\u6807\u9898\u884C\u7684\u53F3\u8FB9\uFF08\u6587\u4EF6\u6811\u91CC\u4E5F\u6709\uFF09\u52FE\u4E0A\u300C\u5DF2\u5BA1\u9605\u300D\uFF0C\u952E\u76D8 V \u5207\u6362\u5F53\u524D\u6587\u4EF6\u3002\u52FE\u4E0A\u7684\u6587\u4EF6\u4F1A\u6536\u8D77\u6765\uFF0C\u5DE5\u5177\u680F\u548C\u6E05\u5355\u884C\u5C3E\u90FD\u6709\u8FDB\u5EA6\uFF1B\u4E4B\u540E\u6587\u4EF6\u53C8\u6539\u4E86\uFF0C\u4F1A\u63D0\u793A\u300C\u6709\u65B0\u6539\u52A8\u300D\u3002 \u53EA\u7528\u6765\u7EDF\u8BA1\u770B\u8FC7\u4E86\u54EA\u4E9B\uFF0C\u4E0D\u5F71\u54CD\u4EFB\u4F55\u64CD\u4F5C\u3002"),s.default.createElement("dt",null,"\u5206\u652F\u4E0E\u5DE5\u4F5C\u6811"),s.default.createElement("dd",null,"\u5DE5\u4F5C\u6811\u662F\u68C0\u51FA\u67D0\u4E2A\u5206\u652F\u7684\u76EE\u5F55\uFF1A\u6E05\u5355\u91CC\u7684\u4E00\u884C\u5DE5\u4F5C\u6811\uFF0C\u5C31\u662F\u300C\u8FD9\u4E2A\u5206\u652F + \u653E\u5B83\u7684\u76EE\u5F55 + \u76EE\u5F55\u91CC\u8FD8\u6CA1\u63D0\u4EA4\u7684\u6539\u52A8\u300D\u3002 \u540C\u4E00\u4E2A\u5206\u652F\u540C\u4E00\u65F6\u95F4\u53EA\u80FD\u68C0\u51FA\u5230\u4E00\u4E2A\u76EE\u5F55\uFF1B\u6CA1\u68C0\u51FA\u7684\u5206\u652F\u53EA\u6709\u540D\u5B57\u548C\u63D0\u4EA4\uFF0C\u6CA1\u6709\u672A\u63D0\u4EA4\u7684\u6539\u52A8\u53EF\u770B\u3002 \u53EA\u770B\u4E00\u4E2A\u4ED3\u5E93\u65F6\uFF0C\u4E0A\u9762\u662F\u5B83\u7684\u5168\u90E8\u5DE5\u4F5C\u6811\uFF1B\u6E05\u5355\u672B\u5C3E\u7684\u300C\u672C\u5730\u5206\u652F\u300D\u5C55\u5F00\u662F\u8FD9\u4E2A\u4ED3\u5E93\u7684\u5168\u90E8\u5206\u652F\uFF0C \u68C0\u51FA\u4E86\u7684\u540E\u9762\u6709\u300C\u67E5\u770B\u5DE5\u4F5C\u6811\u300D\uFF0C\u5176\u4F59\u6807\u7740\u300C\u672A\u68C0\u51FA\u300D\u3002\u641C\u7D22\u6846\u91CC\u7684\u8BCD\u5BF9\u5206\u652F\u540D\u4E5F\u751F\u6548\u3002"),s.default.createElement("dt",null,"\u6536\u8D77\u4E0E\u5C55\u5F00"),s.default.createElement("dd",null,"\u4ED3\u5E93\u680F\u548C\u5DE5\u4F5C\u6811\u6E05\u5355\u7684\u53F3\u4E0A\u89D2\u53EF\u4EE5\u4E00\u952E\u6536\u8D77\uFF0C\u628A\u5730\u65B9\u5168\u8BA9\u7ED9\u8BE6\u60C5\u3002\u6536\u8D77\u540E\uFF0C\u6E05\u5355\u5934\u4E0A\u7684\u300C\xBB\u300D\u5C55\u5F00\u4ED3\u5E93\u680F\uFF0C \u8BE6\u60C5\u6807\u9898\u524D\u7684\u300C\xBB\u300D\u5C55\u5F00\u6E05\u5355\uFF08\u952E\u76D8 \u2191 \u2193 \u4E5F\u80FD\u6362\u5DE5\u4F5C\u6811\uFF09\u3002\u6E05\u5355\u548C\u8BE6\u60C5\u4E4B\u95F4\u7684\u5206\u9694\u7EBF\u53EF\u4EE5\u62D6\u7740\u8C03\u5BBD\uFF0C\u53CC\u51FB\u56DE\u5230\u9ED8\u8BA4\u3002"),s.default.createElement("dt",null,"\u6587\u4EF6\u6811"),s.default.createElement("dd",null,"\u8BE6\u60C5\u91CC\u6240\u6709\u6587\u4EF6\u7684\u5DEE\u5F02\u4ECE\u4E0A\u5230\u4E0B\u94FA\u5F00\u3002\u6587\u4EF6\u6811\u9ED8\u8BA4\u662F\u6D6E\u7A97\uFF1A\u9F20\u6807\u505C\u5728\u5DE6\u7F18\u7684\u628A\u624B\u6216\u5DE5\u5177\u680F\u7684\u300C\u6587\u4EF6\u300D\u4E0A\u5C31\u6ED1\u51FA\u6765\uFF0C \u79FB\u5F00\u3001\u9009\u4E2D\u4E00\u4E2A\u6587\u4EF6\u6216\u6309 Esc \u5C31\u6536\u56DE\u53BB\uFF1B\u70B9\u4E00\u4E0B\u6253\u5F00\u7684\u4F1A\u7559\u7740\uFF0C\u70B9\u5916\u9762\u624D\u6536\u3002\u70B9\u56FE\u9489\u628A\u5B83\u56FA\u5B9A\u5728\u5DE6\u8FB9\u3001\u5DEE\u5F02\u6392\u5230\u53F3\u8FB9\uFF0C \u4E92\u4E0D\u906E\u6321\uFF08\u6587\u4EF6\u533A\u591F\u5BBD\u65F6\u624D\u884C\uFF09\uFF1B\u518D\u70B9\u4E00\u6B21\u53D8\u56DE\u6D6E\u7A97\u3002\u5DE5\u5177\u680F\u6700\u53F3\u8FB9\u7684\u4E24\u4E2A\u6309\u94AE\u5207\u6362\u5DE6\u53F3\u5E76\u6392\u548C\u81EA\u52A8\u6362\u884C\uFF0C \u5BF9\u6574\u4E2A\u6587\u4EF6\u533A\u751F\u6548\uFF0C\u4E0D\u7528\u6BCF\u4E2A\u6587\u4EF6\u5404\u9009\u4E00\u904D\u3002"),s.default.createElement("dt",null,"\u5173\u8054\u5DE5\u5177"),s.default.createElement("dd",null,"\u6309\u4F1A\u8BDD\u76EE\u5F55\u5339\u914D\u5230\u7684 Codex / ZCode / DSH \u4F1A\u8BDD\u3002\u8FD9\u662F\u76EE\u5F55\u5173\u8054\uFF0C\u4E0D\u662F\u5728\u7EBF\u72B6\u6001\uFF1B\u5B57\u6BCD\u9AD8\u4EAE\u8868\u793A\u6700\u8FD1 30 \u5206\u949F\u5185\u6709\u4F1A\u8BDD\u66F4\u65B0\uFF0C\u6216\u4F1A\u8BDD\u6B63\u5728\u8FD0\u884C\u3002"),s.default.createElement("dt",null,"\u4E0A\u6E38"),s.default.createElement("dd",null,"\u2191 \u662F\u672A\u63A8\u9001\u7684\u63D0\u4EA4\u6570\uFF0C\u2193 \u662F\u843D\u540E\u7684\u63D0\u4EA4\u6570\uFF0C\u90FD\u6309\u672C\u5730\u8BB0\u5F55\u6BD4\u8F83\uFF0C\u9762\u677F\u4E0D\u8054\u7F51 fetch\u3002\u300C\u672A\u8BBE\u4E0A\u6E38\u300D\u4E0D\u7B49\u4E8E\u6CA1\u63A8\u9001\u3002"),s.default.createElement("dt",null,"\u83B7\u53D6\u3001\u62C9\u53D6\u3001\u63A8\u9001"),s.default.createElement("dd",null,"\u90FD\u53EA\u9488\u5BF9\u5F53\u524D\u5206\u652F\u3002\u83B7\u53D6\u53EA\u66F4\u65B0\u8FDC\u7AEF\u5206\u652F\u7684\u672C\u5730\u8BB0\u5F55\uFF1B\u62C9\u53D6\u53EA\u505A\u5FEB\u8FDB\uFF0C\u4E0D\u80FD\u5FEB\u8FDB\u65F6\u4EC0\u4E48\u90FD\u4E0D\u6539\uFF1B\u63A8\u9001\u4E0D\u5F3A\u63A8\uFF0C \u8FDC\u7AEF\u6709\u672C\u5730\u6CA1\u6709\u7684\u63D0\u4EA4\u65F6\u4F1A\u88AB\u62D2\u7EDD\u3002\u62C9\u53D6\u548C\u63A8\u9001\u6267\u884C\u524D\u4F1A\u5148\u544A\u8BC9\u4F60\u5C06\u505A\u4EC0\u4E48\u3002\u6570\u5B57\u6309\u672C\u5730\u8BB0\u5F55\u8BA1\u7B97\uFF0C\u83B7\u53D6\u4E4B\u540E\u624D\u51C6\u3002"),s.default.createElement("dt",null,"AI \u5BA1\u67E5"),s.default.createElement("dd",null,"\u5728\u8FD9\u4E2A\u76EE\u5F55\u65B0\u5F00\u4E00\u4E2A DSH \u4F1A\u8BDD\uFF0C\u8BA9\u5B83\u53EA\u8BFB\u5730\u5BA1\u67E5\u6539\u52A8\uFF1A\u505C\u5728\u300C\u672A\u63D0\u4EA4\u300D\u9875\u7B7E\u4E0A\u5BA1\u7684\u662F\u672A\u63D0\u4EA4\u7684\uFF0C\u505C\u5728\u300C\u672A\u63A8\u9001\u300D\u4E0A\u5BA1\u7684\u662F\u8FD8\u6CA1\u63A8\u5230\u8FDC\u7AEF\u7684\u3002 \u5B83\u53EA\u62A5\u8981\u52A8\u624B\u7684\u7ED3\u8BBA\uFF1A\u5FC5\u987B\u5904\u7406\u7684\u95EE\u9898\uFF0C\u548C\u5EFA\u8BAE\u3002\u53D1\u8D77\u540E\u8FD9\u68F5\u5DE5\u4F5C\u6811\u7684\u884C\u5C3E\u6709\u4E00\u4E2A\u56DB\u89D2\u661F\uFF1A\u8F6C\u5708\u662F\u8FD8\u5728\u5BA1\uFF0C \u5BA1\u5B8C\u6309\u7ED3\u8BBA\u7740\u8272\uFF08\u7EFF\u662F\u6CA1\u6709\u95EE\u9898\uFF0C\u7425\u73C0\u662F\u6709\u4FEE\u6539\u5EFA\u8BAE\uFF0C\u7EA2\u662F\u6709\u5FC5\u987B\u5904\u7406\u7684\u95EE\u9898\uFF09\uFF0C\u661F\u540E\u9762\u7684\u6570\u662F\u6709\u51E0\u5904\u8981\u5904\u7406\uFF0C \u60AC\u505C\u80FD\u770B\u5230\u4E00\u53E5\u8BDD\u7684\u7ED3\u8BBA\u3002\u6E05\u5355\u4E0A\u65B9\u7684\u300C\u5BA1\u67E5\u8FC7\u300D\u80FD\u628A\u505A\u8FC7\u5BA1\u67E5\u7684\u5DE5\u4F5C\u6811\u5355\u72EC\u7B5B\u51FA\u6765\u3002 \u8BE6\u60C5\u91CC\u9875\u7B7E\u4E0B\u9762\u662F\u7ED3\u8BBA\u6761\uFF1B\u5BF9\u5E94\u7684\u6587\u4EF6\u9875\u7B7E\u91CC\uFF0C\u6709\u95EE\u9898\u7684\u6539\u52A8\u65C1\u8FB9\u6807\u7740\u7ED3\u8BBA\uFF08\u5DEE\u5F02\u591F\u5BBD\u65F6\u5728\u53F3\u8FB9\u4E00\u680F\uFF0C \u7A84\u65F6\u5728\u8FD9\u4E00\u884C\u4E0B\u9762\uFF09\uFF0C\u300C\u5BA1\u67E5\u7ED3\u679C\u300D\u9875\u7B7E\u91CC\u6309\u6587\u4EF6\u5217\u51FA\u5168\u90E8\u7ED3\u8BBA\u3002\u7ED3\u8BBA\u6761\u4E0A\u7684\u300C\u590D\u5236\u7ED3\u8BBA\u300D\u628A\u8FD8\u6CA1\u5BA1\u9605\u7684\u6587\u4EF6\u91CC\u7684\u7ED3\u8BBA \u590D\u5236\u6210\u4E00\u6BB5\u8BDD\uFF0C\u53EF\u4EE5\u76F4\u63A5\u8D34\u7ED9 AI \u53BB\u6539\uFF08\u5DF2\u5BA1\u9605\u7684\u6587\u4EF6\u4E0D\u590D\u5236\uFF09\u3002\u5BA1\u67E5\u4E4B\u540E\u6539\u52A8\u53C8\u53D8\u4E86\uFF0C\u4F1A\u63D0\u793A\u6279\u6CE8\u4F4D\u7F6E\u53EF\u80FD\u4E0D\u51C6\uFF1B \u5BA1\u8FC7\u7684\u6539\u52A8\u5168\u90FD\u63D0\u4EA4\uFF08\u6216\u63A8\u9001\uFF09\u4E86\uFF0C\u8FD9\u6B21\u5BA1\u67E5\u7684\u8BB0\u5F55\u81EA\u52A8\u6E05\u6389\u3002\u60F3\u91CD\u6765\u70B9\u300C\u91CD\u65B0\u5BA1\u67E5\u300D\uFF0C\u4E0D\u60F3\u7559\u70B9\u300C\u6E05\u9664\u8BB0\u5F55\u300D\u3002 \u6BCF\u4E2A\u4ED3\u5E93\u53EF\u4EE5\u5728\u53F3\u952E\u83DC\u5355\u7684\u300C\u672C\u4ED3\u5E93\u7684\u5BA1\u67E5\u63D0\u793A\u8BCD\u300D\u91CC\uFF0C\u6362\u6389\u9ED8\u8BA4\u7684\u300C\u5BA1\u4EC0\u4E48\u3001\u91CD\u70B9\u627E\u4EC0\u4E48\u300D\uFF1B\u8303\u56F4\u3001\u53EA\u8BFB\u7EA6\u675F\u548C\u8F93\u51FA\u683C\u5F0F \u4E0D\u8DDF\u7740\u6362\u3002"),s.default.createElement("dt",null,"\u8BFB\u53D6\u4E8E"),s.default.createElement("dd",null,"\u6E05\u5355\u548C\u5404\u4ED3\u5E93\u7684\u72B6\u6001\u662F\u90A3\u4E00\u523B\u8BFB\u5230\u7684\u3002\u6253\u5F00\u9762\u677F\u65F6\u76F4\u63A5\u663E\u793A\u4E0A\u6B21\u7559\u4E0B\u7684\u7ED3\u679C\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u91CD\u8BFB\uFF1B\u8981\u770B\u6700\u65B0\u7684\u70B9\u53F3\u4E0A\u89D2\u7684\u5237\u65B0\u3002 \u62C9\u53D6\u3001\u63A8\u9001\u3001\u6E05\u7406\u767B\u8BB0\u4E4B\u540E\uFF0C\u76F8\u5173\u7684\u4ED3\u5E93\u4F1A\u81EA\u52A8\u91CD\u8BFB\u3002"),s.default.createElement("dt",null,"\u5931\u6548\u767B\u8BB0"),s.default.createElement("dd",null,"\u76EE\u5F55\u5DF2\u7ECF\u4E0D\u5B58\u5728\u3001\u4F46 Git \u4ECD\u4FDD\u7559\u7684\u5DE5\u4F5C\u6811\u767B\u8BB0\u3002\u53EF\u4EE5\u6E05\u7406\uFF0C\u6E05\u7406\u4E0D\u4F1A\u5220\u9664\u4EFB\u4F55\u6587\u4EF6\u3002"),s.default.createElement("dt",null,"\u5DE5\u5355\u8272\u6807"),s.default.createElement("dd",null,"\u4ECE\u5206\u652F\u540D\u91CC\u53D6\u51FA\u7684\u5DE5\u5355\u53F7\u3002\u540C\u4E00\u4E2A\u9700\u6C42\u5728\u591A\u4E2A\u4ED3\u5E93\u7684\u5DE5\u4F5C\u6811\u540C\u8272\uFF0C\u70B9\u5B83\u53EA\u770B\u8FD9\u4E2A\u9700\u6C42\u7684\u5DE5\u4F5C\u6811\u3002"))))}var da="worktree-desk",ps=t=>new Promise(e=>setTimeout(e,t));function cs(){let t=new Set,e={dsh:null,notify:null};return{state:e,set(n){Object.assign(e,n),t.forEach(r=>r())},subscribe(n){return t.add(n),()=>t.delete(n)}}}var ws=["slots"];function us(t){let e=cs();t.inject(["workspaces","uiWorkspace","sessions"],n=>{e.set({dsh:{openSession:r=>n.uiWorkspace.openSession(r),createWorkspace:async r=>(await n.workspaces.create({path:r})).workspaceId,openWorkspace:r=>n.uiWorkspace.openWorkspace(r),connect:r=>n.uiWorkspace.connectWorkspace(r),send:async(r,o)=>{for(let i=0;i<100;i++){let d=n.sessions.scope(r)?.get("conversation");if(d)return d.send(o);await ps(50)}throw Error("\u4F1A\u8BDD\u8FD8\u6CA1\u6709\u51C6\u5907\u597D")}}}),n.effect(()=>()=>e.set({dsh:null}))}),t.inject(["contextMenus"],n=>{e.set({notify:(r,o)=>n.contextMenus.notify(r,o)}),n.effect(()=>n.contextMenus.register({id:"worktree-desk.tree",target:Te,order:100,resolve:r=>ho(r)}))}),t.slots.inject("main",()=>t.slots.register({name:"main",key:da},n=>Sr.default.createElement(la,{services:e,useContextMenu:n.useContextMenu,renderFactorySlot:n.renderFactorySlot}))),t.slots.inject("sidebar.panellist",()=>t.slots.register({name:"sidebar.panellist",id:da,order:6,label:()=>"\u5DE5\u4F5C\u6811"},n=>Sr.default.createElement(z,{size:n.size})))}
return module.exports}})
