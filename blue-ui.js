window.__ModuleLoader__.load({
  id: '@local/scifi-splash',
  factory() {
    const ATTR = 'data-dsh-azure'

    /**
     * 浅色拟态层：浅粉紫蓝打底的软光界面。
     *
     * 结构只做三件事：
     *   1. 覆盖主题 token —— 底色、层次、文字、描边、侧栏全部走浅粉紫；
     *   2. 一份 CSS —— 换色大肥鱼背景水印、拟态白卡、品牌渐变 logo；
     *   3. 一个 document 标记 —— 所有规则都挂在 :root[data-dsh-azure] 下面，
     *      插件停用即整套样式一起消失，不留残迹。
     */
    const TOKENS = {
      // ── surfaces ────────────────────────────────────────────────
      '--dsw-alias-bg-base': { light: '#FAF9FD', dark: '#0A0E2A' },
      '--dsw-alias-bg-layer-1': { light: '#FFFFFF', dark: '#120F2C' },
      '--dsw-alias-bg-layer-2': { light: '#F4F2FB', dark: '#191437' },
      '--dsw-alias-bg-layer-3': { light: '#ECEAF6', dark: '#211B42' },
      '--dsw-alias-bg-overlay': { light: '#FDFDFF', dark: '#0F0C22' },
      '--dsw-alias-bg-module-platform': { light: '#F6F4FC', dark: '#15112F' },
      '--dsw-alias-bg-multi-select': { light: '#EFEBFA', dark: '#1B1539' },
      '--dsw-alias-bg-skeleton': { light: '#7C6CF21A', dark: '#7C6CF21A' },

      // ── separators ──────────────────────────────────────────────
      '--dsw-alias-border-l1': { light: '#EDEBF5', dark: '#2A2448' },
      '--dsw-alias-border-l2': { light: '#E3E0F0', dark: '#332C54' },
      '--dsw-alias-border-l3': { light: '#D6D2E8', dark: '#3E3663' },
      '--dsw-alias-border-l4': { light: '#C6C1DC', dark: '#4B4273' },

      // ── accent ──────────────────────────────────────────────────
      '--dsw-alias-brand-primary': { light: '#7C6CF2', dark: '#B9A4FF' },
      '--dsw-alias-brand-primary-new-colorprimary-new-color': { light: '#7C6CF2', dark: '#B9A4FF' },
      '--dsw-alias-brand-primary-invert': { light: '#FFF9FE', dark: '#0B1026' },
      '--dsw-alias-brand-text': { light: '#0B1026', dark: '#F2EFFF' },
      '--dsw-alias-link': { light: '#6C5CE7', dark: '#B9A4FF' },
      '--dsw-alias-menu-icon': { light: '#4A4F68', dark: '#A9A4C8' },

      // ── text ────────────────────────────────────────────────────
      '--dsw-alias-label-primary': { light: '#0B1026', dark: '#F1EEFF' },
      '--dsw-alias-label-primary-bluish': { light: '#22284A', dark: '#DCD6FF' },
      '--dsw-alias-label-secondary': { light: '#555B75', dark: '#A9A4C8' },
      '--dsw-alias-label-tertiary': { light: '#5F6580', dark: '#8C87AC' },
      '--dsw-alias-label-caption': { light: '#767C94', dark: '#6E698C' },
      '--dsw-alias-label-primary-dimmed': { light: '#333A55', dark: '#CFC9F2' },
      '--dsw-alias-label-primary-inverted': { light: '#FFFFFF', dark: '#0B1026' },

      // ── interaction ─────────────────────────────────────────────
      '--dsw-alias-interactive-bg-hover': { light: '#7C6CF214', dark: '#B9A4FF14' },
      '--dsw-alias-interactive-bg-active': { light: '#7C6CF220', dark: '#B9A4FF26' },
      '--dsw-alias-interactive-bg-hover-solid': { light: '#F4F1FB', dark: '#1D1740' },
      '--dsw-alias-interactive-bg-hover-accent': { light: '#7C6CF224', dark: '#B9A4FF2E' },
      '--dsw-alias-button-elevated-fill': { light: '#FFFFFF', dark: '#2A1F55' },
      '--dsw-alias-button-elevated-fill-hover': { light: '#F8F6FE', dark: '#35296A' },
      '--dsw-alias-button-primary-fill': { light: '#0B1026', dark: '#B9A4FF' },
      '--dsw-alias-button-primary-hover': { light: '#22284A', dark: '#CBB8FF' },

      // ── sidebar ─────────────────────────────────────────────────
      '--dsw-specific-sidebar-fill': { light: '#F7F5FC', dark: '#0D0A24' },
      '--dsw-specific-sidebar-nav-item-hover': { light: '#F0EDFA', dark: '#171039' },
      '--dsw-specific-sidebar-nav-item-active': { light: '#E9E4F8', dark: '#1E1746' },
      '--dsw-specific-sidebar-nav-item-active-accent': { light: '#7C6CF2', dark: '#B9A4FF' },

      // ── conversation surfaces ───────────────────────────────────
      '--dsw-specific-input-major': { light: '#FFFFFF', dark: '#141033' },
      '--dsw-specific-bubble': { light: '#F0EBFA', dark: '#1B1440' },
      '--dsw-specific-bubble-highlight': { light: '#E4DCF6', dark: '#2A1F55' },
      '--dsw-specific-selector': { light: '#F5F2FC', dark: '#161138' },
      '--dsw-specific-tip': { light: '#F4F1FB', dark: '#171139' },

      // ── code, scrollbars, tooltips ──────────────────────────────
      '--dsw-alias-markdown-code-block': { light: '#F7F5FD', dark: '#100C26' },
      '--dsw-alias-markdown-code-block-banner': { light: '#F1EDFA', dark: '#15102E' },
      '--dsw-alias-markdown-inline-code': { light: '#F3EFFB', dark: '#171139' },
      '--dsw-alias-markdown-tag': { light: '#EFEBFA', dark: '#1A1440' },
      '--dsw-alias-scrollbar-bg-l1': { light: '#E4E0F0', dark: '#241D46' },
      '--dsw-alias-scrollbar-bg-l2': { light: '#E4E0F0', dark: '#241D46' },
      '--dsw-alias-scrollbar-hover-l1': { light: '#D4CEE8', dark: '#332A5C' },
      '--dsw-alias-scrollbar-hover-l2': { light: '#D4CEE8', dark: '#332A5C' },
      '--dsw-alias-tooltip-bg': { light: '#22284A', dark: '#1D1740' },
      '--dsw-alias-tooltip-key-bg': { light: '#323A62', dark: '#2A2150' },
      '--dsw-alias-bg-document-preview': { light: '#F7F5FC', dark: '#0D0A24' },
      '--dsw-specific-menu': { light: '#FDFDFFEF', dark: '#100C26EE' },
      '--dsw-alias-menu-group-header-fill': { light: '#F7F5FCF0', dark: '#120E2AF0' },
    }

    for (const token of Object.keys(TOKENS)) TOKENS[token].dark = TOKENS[token].light

    /**
     * Q 版大肥鱼（换色版）：粉紫蓝，作为整页背景水印。
     */
    /**
     * Q 版大鲸鱼（简笔画水印）：圆胖身体、头顶喷水、眯眼笑、腮边一点粉，
     * 浅色半透明填充 + 粉紫蓝渐变描边，跟浅色拟态主题一个调子。
     */
    const FISH = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 460" fill="none">',
      '<defs>',
      '<linearGradient id="wg" x1="0" y1="0" x2="1" y2="1">',
      '<stop offset="0" stop-color="#F2A7B4"/><stop offset=".52" stop-color="#B9A4E8"/><stop offset="1" stop-color="#5B8DEF"/>',
      '</linearGradient>',
      '<linearGradient id="wf" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#FFFFFF" stop-opacity=".78"/><stop offset="1" stop-color="#FFFFFF" stop-opacity=".30"/>',
      '</linearGradient>',
      '</defs>',
      '<g opacity=".62">',
      '<path d="M470 84c-8-26-8-52 0-78" stroke="url(#wg)" stroke-width="3.2" stroke-linecap="round"/>',
      '<path d="M470 66c-16-4-28-16-32-32" stroke="url(#wg)" stroke-width="2.6" stroke-linecap="round"/>',
      '<path d="M470 60c14-4 24-14 28-28" stroke="url(#wg)" stroke-width="2.6" stroke-linecap="round"/>',
      '<path d="M150 240c0-86 98-152 224-152 134 0 214 76 214 152 0 80-80 144-214 144-126 0-224-60-224-144Z" fill="url(#wf)" stroke="url(#wg)" stroke-width="3.4"/>',
      '<path d="M152 240c-42-30-78-36-108-54 8 22 8 44 0 66 30-18 66-26 108-12Z" fill="url(#wf)" stroke="url(#wg)" stroke-width="3" stroke-linejoin="round"/>',
      '<path d="M322 342c24 30 62 34 86 10" stroke="url(#wg)" stroke-width="3" stroke-linecap="round"/>',
      '<circle cx="486" cy="206" r="14" fill="#FFFFFF"/>',
      '<circle cx="490" cy="210" r="6.4" fill="#2A3048"/>',
      '<circle cx="482" cy="202" r="2.6" fill="#FFFFFF"/>',
      '<path d="M556 246c-15 15-38 17-53 2" stroke="url(#wg)" stroke-width="3.4" stroke-linecap="round"/>',
      '<ellipse cx="536" cy="270" rx="17" ry="8" fill="#F2A7B4" opacity=".38"/>',
      '<path d="M304 344c42 22 94 24 136 8" stroke="url(#wg)" stroke-width="2.2" stroke-linecap="round" opacity=".5"/>',
      '</g>',
      '</svg>',
    ].join('')

    const LOGO_DEFS = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">',
      '<defs>',
      '<linearGradient id="dsh-azure-mark" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="18">',
      '<stop offset="0" stop-color="#F2A7B4"/><stop offset=".55" stop-color="#8E7CF4"/><stop offset="1" stop-color="#5B8DEF"/>',
      '</linearGradient>',
      '<linearGradient id="dsh-azure-word" gradientUnits="userSpaceOnUse" x1="26" y1="0" x2="184" y2="24">',
      '<stop offset="0" stop-color="#0B1026"/><stop offset=".55" stop-color="#3A2E7A"/><stop offset="1" stop-color="#2A57A6"/>',
      '</linearGradient>',
      '<linearGradient id="dsh-azure-icon" x1="0.06" y1="0.06" x2="0.94" y2="0.94">',
      '<stop offset="0" stop-color="#F2A7B4"/><stop offset=".42" stop-color="#B49BE8"/><stop offset=".72" stop-color="#7C6CF2"/><stop offset="1" stop-color="#5B8DEF"/>',
      '</linearGradient>',
      '</defs>',
      '</svg>',
    ].join('')

    const STYLE = `
:root[${ATTR}] {
  --dsw-radius-panel: 18px;
  --dsw-radius-lg: 16px;
  color-scheme: light;
}

/* 面板/弹窗投影统一走深色（设置界面背后那圈不再发白） */
:root[${ATTR}] body {
  --dsw-shadow-lv1: 0 2px 4px 0 rgba(8, 10, 28, .08);
  --dsw-shadow-lv1-blur: 0 6px 16px 0 rgba(8, 10, 28, .10);
  --dsw-shadow-lv2: 0 6px 18px 0 rgba(8, 10, 28, .08), 0 2px 8px 0 rgba(8, 10, 28, .06);
  --dsw-shadow-lv3: 0 0 1px 0 rgba(8, 10, 28, .10), 0 18px 44px -18px rgba(8, 10, 28, .38);
  --dsw-elevation-panel: 0 0 0 .5px rgba(8, 10, 28, .10), 0 22px 54px -22px rgba(8, 10, 28, .42);
  --dsw-elevation-prominent: 0 0 0 .5px rgba(8, 10, 28, .12), 0 28px 70px -26px rgba(8, 10, 28, .50);
  --dsw-elevation-soft: 0 0 0 .5px rgba(8, 10, 28, .08), 0 14px 36px -18px rgba(8, 10, 28, .30);
  background-color: #FAF9FD;
  background-image:
    radial-gradient(1100px 540px at 50% -80px, rgba(248, 226, 233, .9), transparent 65%),
    radial-gradient(900px 480px at 0% 30%, rgba(230, 228, 250, .7), transparent 60%),
    radial-gradient(1000px 520px at 70% 92%, rgba(214, 224, 250, .6), transparent 62%),
    var(--dsh-azure-fish, none);
  background-repeat: no-repeat;
  background-position: 50% -80px, 0% 30%, 70% 92%, right -3vw bottom -6vh;
  background-size: auto, auto, auto, min(46vw, 560px) auto;
  background-attachment: fixed;
}

/* 外壳与对话列露底 */
:root[${ATTR}] [class*="_frame"]:has([class*="sidebarCol"]),
:root[${ATTR}] [class*="centerCol"],
:root[${ATTR}] [class*="_root"][data-phase] {
  background-color: transparent;
  background-image: none;
}

:root[${ATTR}] [data-dsh-azure-collapsed] [data-rightbar-col] {
  display: none;
}

/* ── 小模块：拟态白卡 ─────────────────────────────────────────── */
:root[${ATTR}] :is(
  [class*="_card"], [class*="_ioCard"], [class*="_fileCard"],
  [class*="_tile"], [class*="_panel"]
):not(:is(
  [class*="cardPreview"], [class*="cardWorkspaceTrigger"], [class*="cardHead"],
  [class*="cardMain"], [class*="cardBody"], [class*="cardText"], [class*="cardTitle"],
  [class*="cardDesc"], [class*="cardMeta"], [class*="cardEnd"], [class*="cardOpen"],
  [class*="cardHeader"], [class*="cardFooter"], [class*="cardContent"], [class*="cardRow"],
  [class*="cardLine"], [class*="cardTag"], [class*="cardSubtitle"], [class*="cardActions"],
  [class*="cards"], [class*="titleRow"], [class*="statusTag"], [class*="panelRow"],
  [class*="panelTitle"], [class*="panelIcon"], [class*="panelList"], [class*="panelActive"],
  [class*="panelButton"]
)) {
  border: 1px solid rgba(255, 255, 255, .92);
  border-radius: var(--dsw-radius-panel);
  background-image: none;
  background-color: #FFFFFF;
  box-shadow:
    8px 8px 20px rgba(25, 30, 66, .09),
    -6px -6px 16px rgba(255, 255, 255, .9),
    inset 0 1px 0 #FFFFFF;
  transition: box-shadow .18s ease, transform .18s ease;
}

:root[${ATTR}] :is(
  [class*="_card"], [class*="_ioCard"], [class*="_fileCard"],
  [class*="_tile"], [class*="_panel"]
):not(:is(
  [class*="cardPreview"], [class*="cardWorkspaceTrigger"], [class*="cardHead"],
  [class*="cardMain"], [class*="cardBody"], [class*="cardText"], [class*="cardTitle"],
  [class*="cardDesc"], [class*="cardMeta"], [class*="cardEnd"], [class*="cardOpen"],
  [class*="cardHeader"], [class*="cardFooter"], [class*="cardContent"], [class*="cardRow"],
  [class*="cardLine"], [class*="cardTag"], [class*="cardSubtitle"], [class*="cardActions"],
  [class*="cards"], [class*="titleRow"], [class*="statusTag"], [class*="panelRow"],
  [class*="panelTitle"], [class*="panelIcon"], [class*="panelList"], [class*="panelActive"],
  [class*="panelButton"]
)):hover {
  background-color: #FCFAFF;
  box-shadow:
    12px 12px 26px rgba(25, 30, 66, .12),
    -8px -8px 18px rgba(255, 255, 255, .95),
    inset 0 1px 0 #FFFFFF;
}

:root[${ATTR}] :is([class*="_card"], [class*="_ioCard"], [class*="_fileCard"], [class*="_tile"], [class*="_panel"]):not([class*="_panelList"]):not([class*="_panelRow"]):focus-within {
  box-shadow:
    0 0 0 2px rgba(124, 108, 242, .16),
    12px 12px 26px rgba(25, 30, 66, .10),
    -8px -8px 18px rgba(255, 255, 255, .95),
    inset 0 1px 0 #FFFFFF;
}

/* ── 模块图标：品牌三色渐变 ──────────────────────────────────── */
:root[${ATTR}] :is(
  [class*="_card"], [class*="_ioCard"], [class*="_fileCard"],
  [class*="_tile"], [class*="_panel"]
) :is(
  [class*="cardIcon"], [class*="CardIcon"], [class*="IconTile"], [class*="iconTile"],
  [class*="moduleIcon"], [class*="itemIcon"], [class*="featureIcon"],
  [class*="artwork"], [class*="Artwork"]
) svg :is(path, rect, circle, ellipse, polygon, polyline, line)[fill]:not([fill="none"]) {
  fill: url(#dsh-azure-icon) !important;
}

:root[${ATTR}] :is(
  [class*="_card"], [class*="_ioCard"], [class*="_fileCard"],
  [class*="_tile"], [class*="_panel"]
) :is(
  [class*="cardIcon"], [class*="CardIcon"], [class*="IconTile"], [class*="iconTile"],
  [class*="moduleIcon"], [class*="itemIcon"], [class*="featureIcon"],
  [class*="artwork"], [class*="Artwork"]
) svg :is(path, rect, circle, ellipse, polygon, polyline, line)[stroke]:not([stroke="none"]) {
  stroke: url(#dsh-azure-icon) !important;
}

:root[${ATTR}] :is(
  [class*="_card"], [class*="_ioCard"], [class*="_fileCard"],
  [class*="_tile"], [class*="_panel"]
) :is(
  [class*="cardIcon"], [class*="CardIcon"], [class*="IconTile"], [class*="iconTile"],
  [class*="moduleIcon"], [class*="itemIcon"], [class*="featureIcon"],
  [class*="artwork"], [class*="Artwork"]
) svg foreignObject div {
  background: conic-gradient(from 90deg, #F2A7B4 0deg, #C9BEF2 34deg, #7C6CF2 96deg, #C9BEF2 190deg, #F2A7B4 360deg) !important;
}

/* ── logo ─────────────────────────────────────────────────────── */
:root[${ATTR}] :is([class*="brandMark"], [class*="railMark"]) svg path {
  fill: url(#dsh-azure-mark);
}
:root[${ATTR}] [class*="brandName"] svg path {
  fill: url(#dsh-azure-word);
}

/* ── 侧栏导航：无边框，悬停/点选时缩放 ─────────────────────────── */
:root[${ATTR}] [class*="_panelList"],
:root[${ATTR}] [class*="_panelList"]:focus-within,
:root[${ATTR}] [class*="_panelList"]:has([class*="_panelRow"]:focus) {
  box-shadow: none !important;
  border-color: transparent !important;
  outline: none !important;
  background-color: transparent !important;
}

:root[${ATTR}] [class*="_panelRow"] {
  transform-origin: center left;
  transition:
    transform .22s cubic-bezier(.2, .9, .25, 1.05),
    background-color .18s ease,
    color .18s ease,
    box-shadow .18s ease;
}

:root[${ATTR}] [class*="_panelList"]:not(:has([class*="_panelRow"]:hover)):has([class*="_panelRow"]:focus) [class*="_panelRow"]:not(:focus) {
  transform: scale(.965);
}
:root[${ATTR}] [class*="_panelList"]:not(:has([class*="_panelRow"]:hover)) [class*="_panelRow"]:focus {
  transform: scale(1.045);
}
:root[${ATTR}] [class*="_panelList"]:has([class*="_panelRow"]:hover) [class*="_panelRow"]:not(:hover) {
  transform: scale(.965) !important;
}
:root[${ATTR}] [class*="_panelList"]:has([class*="_panelRow"]:hover) [class*="_panelRow"]:hover {
  transform: scale(1.045) !important;
}
:root[${ATTR}] [class*="_panelRow"]:active {
  transform: scale(.995) !important;
}

/* ── 输入区：浅色底、无实时模糊 ─────────────────────────────────── */
:root[${ATTR}] :is(
  [class*="composer"], [class*="Composer"],
  [class*="inputArea"], [class*="InputArea"]
):not(textarea):not(input) {
  background: rgba(255, 255, 255, .82) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border-radius: 20px;
}

:root[${ATTR}] textarea,
:root[${ATTR}] [contenteditable="true"] {
  background-color: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* ── 顶部整块（标题 + 标签行）：透明底，模糊层盖在它背后 ──────────
   选「包含面包屑但不再包含消息」的那层容器：标题、对话/轨迹标签、右侧按钮
   都在这块里，整块透明 + 背后模糊，文字仍在最上层。 */
:root[${ATTR}] :is(div, header, section):has([class*="crumb"]):not(:has([class*="flowItem"])) {
  position: relative;
  z-index: 0;
  background: transparent !important;
  background-image: none !important;
}

:root[${ATTR}] :is(div, header, section):has([class*="crumb"]):not(:has([class*="flowItem"]))::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 62%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 62%, transparent 100%);
}

/* ── 对话界面：顶部滚动渐变模糊 ─────────────────────────────────
   给消息滚动区挂一个 sticky 的模糊层，配渐隐蒙版：
   内容往上滚时，越靠顶越糊，往下自然变清晰。 */
:root[${ATTR}] [class*="_scroll"]:has([class*="flowItem"]) {
  position: relative;
}

:root[${ATTR}] [class*="_scroll"]:has([class*="flowItem"])::before {
  content: "";
  position: sticky;
  top: 0;
  display: block;
  flex: none;
  height: 64px;
  margin-bottom: -64px;
  pointer-events: none;
  z-index: 6;
  background: linear-gradient(to bottom, rgba(250, 249, 253, .38), rgba(250, 249, 253, 0));
  backdrop-filter: blur(14px) saturate(150%);
  -webkit-backdrop-filter: blur(14px) saturate(150%);
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 46%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 46%, transparent 100%);
}

/* ── 小修饰 ───────────────────────────────────────────────────── */
:root[${ATTR}] ::selection {
  background: color-mix(in srgb, #7C6CF2 26%, transparent);
}
:root[${ATTR}] * {
  scrollbar-color: color-mix(in srgb, #7C6CF2 28%, #E4E0F0) transparent;
}
`

    return {
      inject: ['theme'],
      apply(ctx) {
        ctx.effect(() => ctx.theme.overrideTokens('@local/scifi-splash', TOKENS), 'scifi-splash: azure token layer')

        ctx.effect(() => {
          const root = document.documentElement
          root.setAttribute(ATTR, '')
          return () => root.removeAttribute(ATTR)
        }, 'scifi-splash: azure document marker')

        // 鱼是运行时拼出来的 data URL：源文件里只留可读的 SVG，不塞一大串转义
        ctx.effect(() => {
          const root = document.documentElement
          const url = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(FISH) + '")'
          root.style.setProperty('--dsh-azure-fish', url)
          return () => root.style.removeProperty('--dsh-azure-fish')
        }, 'scifi-splash: fish backdrop')

        // 右侧那一列（文件树 / 文档预览）开着时会变成一整块浅白挡在右边：
        // CSS 先把内容藏掉，这里再把布局里第三条网格轨道压成 0，避免只留一条空白。
        ctx.effect(() => {
          const observers = []
          const seen = new WeakSet()
          let finder = null

          const splitTracks = (value) => {
            const tracks = []
            let depth = 0
            let current = ''
            for (const ch of value) {
              if (ch === '(') depth += 1
              else if (ch === ')') depth -= 1
              if (depth === 0 && /\s/.test(ch)) {
                if (current) tracks.push(current)
                current = ''
                continue
              }
              current += ch
            }
            if (current) tracks.push(current)
            return tracks
          }

          const watch = (frame) => {
            if (seen.has(frame) || typeof MutationObserver !== 'function') return
            seen.add(frame)
            const observer = new MutationObserver(collapse)
            observer.observe(frame, { attributes: true, attributeFilter: ['style'] })
            observers.push(observer)
          }

          const collapse = () => {
            let marked = 0
            const frames = document.querySelectorAll('[class*="_frame"]')
            for (const frame of frames) {
              if (!frame.querySelector || !frame.querySelector('[class*="sidebarCol"]')) continue
              const inline = frame.style && frame.style.gridTemplateColumns
              if (!inline) continue
              const tracks = splitTracks(inline)
              if (tracks.length !== 3) continue
              if (tracks[2] !== '0px') {
                frame.style.gridTemplateColumns = tracks[0] + ' ' + tracks[1] + ' 0px'
              }
              frame.setAttribute('data-dsh-azure-collapsed', '')
              watch(frame)
              marked += 1
            }
            return marked
          }

          // 外壳可能比插件晚挂载：先试一次，没赶上就等它出现，命中后立刻停止观察
          if (collapse() === 0 && document.body && typeof MutationObserver === 'function') {
            finder = new MutationObserver(() => {
              if (collapse() > 0 && finder) {
                finder.disconnect()
                finder = null
              }
            })
            finder.observe(document.body, { childList: true, subtree: true })
          }
          window.addEventListener('resize', collapse)
          return () => {
            window.removeEventListener('resize', collapse)
            if (finder) finder.disconnect()
            observers.forEach((observer) => observer.disconnect())
            const marked = document.querySelectorAll('[data-dsh-azure-collapsed]')
            for (const frame of marked) frame.removeAttribute('data-dsh-azure-collapsed')
          }
        }, 'scifi-splash: collapse right column')

        ctx.effect(() => {
          const holder = document.createElement('div')
          holder.setAttribute('data-dsh-azure-defs', '')
          holder.setAttribute('aria-hidden', 'true')
          holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'
          holder.innerHTML = LOGO_DEFS
          document.body.appendChild(holder)
          return () => holder.remove()
        }, 'scifi-splash: logo gradients')

        ctx.effect(() => {
          const id = '@local/scifi-splash/azure.css'
          if (document.querySelector('style[data-plugin-css="' + id + '"]') !== null) return () => {}
          const tag = document.createElement('style')
          tag.dataset.plugin = 'scifi-splash'
          tag.dataset.pluginCss = id
          tag.textContent = STYLE
          document.head.appendChild(tag)
          return () => tag.remove()
        }, 'scifi-splash: azure atmosphere')
      },
    }
  },
})






