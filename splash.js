/**
 * Pre-paint boot sequence.
 *
 * The markup, its stylesheet and its controller are injected straight into the
 * served `index.html` — a `style` row lands in `<head>`, the `html` row opens
 * the body. The browser parses that markup before the application scripts, so
 * this is literally the first thing painted, and it keeps playing while the
 * SPA boots underneath.
 *
 * The controller also synthesizes the boot sound (Web Audio, no asset files).
 * Every cue is pinned to a visual beat of the same timeline:
 *
 *   0.00  sub bed + air            (backdrop fades in)
 *   0.09  noise riser              (runs until the bar tops out)
 *   0.24  4×(0.08) corner ticks    (frame corners snap)
 *   0.30  rule ping                (top rule expands)
 *   0.44  16 letter ticks @34ms    (wordmark letters light up)
 *   0.70  impact                   (emblem core lights)
 *   2.15  charge chime + sparkles  (percentage hits 100)
 *   2.45  ready hit                (SYSTEM READY)
 *   2.75  leave whoosh             (fade + blur out)
 *
 * A blocked AudioContext (autoplay policy) degrades to silence; the first
 * gesture during the sequence starts the remaining cues from their real
 * position instead of firing them all at once.
 */

/** Matches the client half's data attribute so nothing else collides. */
const NS = 'dsh-boot'

/** How long the percentage readout takes to climb from 0 to 100. */
export const FILL_MS = 1800

/** Where the bar's fill animation starts (CSS delay). */
export const FILL_DELAY_MS = 350

/** Sequence length on screen. */
export const READY_MS = 2450
export const LEAVE_MS = 2750
export const REMOVE_MS = 3420
export const LEAVE_TRANSITION_MS = 620

/** Drop per-line indentation; the stylesheet ships inline in every index. */
const compact = (css) => css
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line !== '' && !line.startsWith('/*'))
  .join('')

export const CSS = compact(`
.${NS} {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  overflow: hidden;
  pointer-events: none;
  opacity: 1;
  color: #f2f7fb;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: opacity ${LEAVE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${LEAVE_TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1), filter ${LEAVE_TRANSITION_MS}ms ease, visibility ${LEAVE_TRANSITION_MS}ms step-end;
  animation: ${NS}-auto-hide 1ms linear ${REMOVE_MS + 2600}ms forwards;
}
.${NS}[data-leaving="true"] {
  opacity: 0;
  transform: scale(1.012);
  filter: blur(6px);
  visibility: hidden;
}
.${NS} .${NS}__backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 90% at 50% 42%, color-mix(in srgb, var(--dsh-boot-accent) 9%, transparent) 0%, rgba(0, 0, 0, 0) 58%),
    radial-gradient(140% 110% at 50% 50%, #05080d 0%, #020407 62%, #000 100%);
  box-shadow: inset 0 0 240px 40px rgba(0, 0, 0, 0.88);
  opacity: 0;
  animation: ${NS}-fade 900ms ease-out 60ms forwards;
}
.${NS} .${NS}__grid {
  position: absolute;
  inset: -1px;
  background-image: radial-gradient(circle at center, rgba(255, 255, 255, 0.085) 0.75px, transparent 1.25px);
  background-size: 30px 30px;
  background-position: center;
  -webkit-mask-image: radial-gradient(ellipse 58% 52% at 50% 47%, #000 0%, rgba(0, 0, 0, 0.5) 52%, transparent 78%);
  mask-image: radial-gradient(ellipse 58% 52% at 50% 47%, #000 0%, rgba(0, 0, 0, 0.5) 52%, transparent 78%);
  opacity: 0;
  animation: ${NS}-grid 2600ms cubic-bezier(0.22, 1, 0.36, 1) 120ms forwards;
}
.${NS} .${NS}__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0) 18%, rgba(0, 0, 0, 0) 82%, rgba(0, 0, 0, 0.78) 100%),
    radial-gradient(ellipse 78% 70% at 50% 50%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.66) 100%);
}
.${NS} .${NS}__frame { position: absolute; inset: 22px; }
.${NS} .${NS}__corner {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  border-color: color-mix(in srgb, var(--dsh-boot-accent) 55%, rgba(255, 255, 255, 0.68));
  border-style: solid;
  border-width: 0;
  animation: ${NS}-corner 700ms ease-out forwards;
}
.${NS} .${NS}__corner--tl { top: 0; left: 0; border-top-width: 1px; border-left-width: 1px; animation-delay: 240ms; }
.${NS} .${NS}__corner--tr { top: 0; right: 0; border-top-width: 1px; border-right-width: 1px; animation-delay: 320ms; }
.${NS} .${NS}__corner--bl { bottom: 0; left: 0; border-bottom-width: 1px; border-left-width: 1px; animation-delay: 400ms; }
.${NS} .${NS}__corner--br { bottom: 0; right: 0; border-bottom-width: 1px; border-right-width: 1px; animation-delay: 480ms; }
.${NS} .${NS}__rule {
  position: absolute;
  top: 0;
  left: 50%;
  width: 132px;
  height: 1px;
  transform-origin: center;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--dsh-boot-accent) 70%, rgba(255, 255, 255, 0.7)), transparent);
  opacity: 0;
  animation: ${NS}-rule 1100ms cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards;
}
.${NS} .${NS}__stage {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  padding: 6vh 24px;
  text-align: center;
}
.${NS} .${NS}__corewrap { position: relative; display: flex; align-items: center; justify-content: center; }
.${NS} .${NS}__emblem { width: min(232px, 40vw); height: min(232px, 40vw); overflow: visible; }
.${NS} .${NS}__draw {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ${NS}-draw 1600ms cubic-bezier(0.33, 1, 0.68, 1) 80ms forwards;
}
.${NS} .${NS}__draw--late { animation-delay: 300ms; }
.${NS} .${NS}__dots {
  opacity: 0;
  transform-box: view-box;
  transform-origin: center;
  animation: ${NS}-fade 1100ms ease-out 520ms forwards, ${NS}-spin 90s linear 0s infinite;
}
.${NS} .${NS}__arc {
  opacity: 0;
  transform-box: view-box;
  transform-origin: center;
  animation: ${NS}-fade 900ms ease-out 420ms forwards, ${NS}-spin 6400ms linear 0s infinite;
}
.${NS} .${NS}__orbit {
  opacity: 0;
  transform-box: view-box;
  transform-origin: center;
  animation: ${NS}-fade 1200ms ease-out 600ms forwards, ${NS}-spin-rev 15000ms linear 0s infinite;
}
.${NS} .${NS}__orbit--wide {
  animation: ${NS}-fade 1200ms ease-out 820ms forwards, ${NS}-spin 21000ms linear 0s infinite;
}
.${NS} .${NS}__core {
  fill: #fff;
  transform-box: fill-box;
  transform-origin: center;
  animation: ${NS}-core 3600ms ease-in-out 500ms infinite;
}
.${NS} .${NS}__cross {
  opacity: 0;
  stroke: color-mix(in srgb, var(--dsh-boot-accent) 42%, rgba(255, 255, 255, 0.42));
  animation: ${NS}-fade 800ms ease-out 380ms forwards;
}
.${NS} .${NS}__halo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: min(300px, 52vw);
  height: min(300px, 52vw);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--dsh-boot-accent) 16%, transparent) 0%, transparent 62%);
  opacity: 0;
  animation: ${NS}-halo 3600ms ease-in-out 700ms infinite;
}
.${NS} .${NS}__mark { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.${NS} .${NS}__word {
  margin: 0;
  font-size: clamp(13px, 1.5vw, 17px);
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: 0.46em;
  padding-left: 0.46em;
  color: #f2f7fb;
  white-space: nowrap;
}
.${NS} .${NS}__letter {
  display: inline-block;
  opacity: 0;
  filter: blur(7px);
  transform: translateY(5px);
  animation: ${NS}-letter 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.${NS} .${NS}__subtitle {
  font-family: ui-monospace, "Cascadia Mono", "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 9px;
  line-height: 1;
  letter-spacing: 0.34em;
  padding-left: 0.34em;
  text-transform: uppercase;
  color: rgba(224, 236, 246, 0.42);
  opacity: 0;
  animation: ${NS}-fade 1200ms ease-out 900ms forwards;
}
.${NS} .${NS}__bar { width: min(300px, 62vw); display: flex; flex-direction: column; gap: 10px; opacity: 0; animation: ${NS}-fade 900ms ease-out 1100ms forwards; }
.${NS} .${NS}__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  font-family: ui-monospace, "Cascadia Mono", "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 9px;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(226, 238, 247, 0.5);
}
.${NS}[data-phase="ready"] .${NS}__row {
  color: color-mix(in srgb, var(--dsh-boot-accent) 72%, #ffffff);
  text-shadow: 0 0 12px color-mix(in srgb, var(--dsh-boot-accent) 42%, transparent);
  transition: color 400ms ease;
}
.${NS} .${NS}__pct { font-variant-numeric: tabular-nums; color: rgba(236, 245, 252, 0.74); }
.${NS} .${NS}__track { position: relative; height: 1px; width: 100%; background: rgba(255, 255, 255, 0.1); overflow: hidden; }
.${NS} .${NS}__fill {
  position: absolute;
  inset: 0;
  transform-origin: left center;
  transform: scaleX(0);
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.35), color-mix(in srgb, var(--dsh-boot-accent) 82%, #ffffff));
  box-shadow: 0 0 10px color-mix(in srgb, var(--dsh-boot-accent) 55%, transparent);
  animation: ${NS}-fill ${FILL_MS}ms cubic-bezier(0.3, 0.7, 0.2, 1) ${FILL_DELAY_MS}ms forwards;
}
.${NS} .${NS}__scan {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 22%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent);
  opacity: 0.5;
  animation: ${NS}-scan 1500ms linear 1300ms infinite;
}
.${NS} .${NS}__meta {
  position: absolute;
  left: 42px;
  right: 42px;
  display: flex;
  justify-content: space-between;
  gap: 18px;
  font-family: ui-monospace, "Cascadia Mono", "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 8.5px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(214, 228, 240, 0.3);
  opacity: 0;
  animation: ${NS}-fade 1100ms ease-out forwards;
}
.${NS} .${NS}__meta--top { top: 36px; animation-delay: 640ms; }
.${NS} .${NS}__meta--bottom { bottom: 36px; animation-delay: 900ms; }
.${NS} .${NS}__dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  margin-right: 9px;
  border-radius: 50%;
  vertical-align: middle;
  background: color-mix(in srgb, var(--dsh-boot-accent) 78%, #ffffff);
  box-shadow: 0 0 8px color-mix(in srgb, var(--dsh-boot-accent) 60%, transparent);
  animation: ${NS}-blink 1800ms ease-in-out infinite;
}
.${NS} .${NS}__hint {
  position: absolute;
  left: 50%;
  bottom: 76px;
  transform: translateX(-50%);
  font-family: ui-monospace, "Cascadia Mono", "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 8.5px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(206, 222, 236, 0.22);
  white-space: nowrap;
  opacity: 0;
  animation: ${NS}-fade 900ms ease-out 1400ms forwards;
}
.${NS} .${NS}__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
.${NS} [data-lang] { display: none; }
:root:lang(zh) .${NS} [data-lang="zh"] { display: inline; }
:root:not(:lang(zh)) .${NS} [data-lang="en"] { display: inline; }
.${NS} [data-phase-label] { display: none !important; }
:root:lang(zh) .${NS}[data-phase="init"] [data-lang="zh"][data-phase-label="init"],
:root:lang(zh) .${NS}[data-phase="ready"] [data-lang="zh"][data-phase-label="ready"] { display: inline !important; }
:root:not(:lang(zh)) .${NS}[data-phase="init"] [data-lang="en"][data-phase-label="init"],
:root:not(:lang(zh)) .${NS}[data-phase="ready"] [data-lang="en"][data-phase-label="ready"] { display: inline !important; }

@keyframes ${NS}-fade { to { opacity: 1; } }
@keyframes ${NS}-grid {
  0% { opacity: 0; transform: scale(1.035); }
  100% { opacity: 1; transform: none; }
}
@keyframes ${NS}-corner {
  0% { opacity: 0; transform: scale(1.6); }
  100% { opacity: 1; transform: none; }
}
@keyframes ${NS}-rule {
  0% { opacity: 0; transform: scaleX(0); }
  55% { opacity: 0.85; }
  100% { opacity: 0.5; transform: scaleX(1); }
}
@keyframes ${NS}-draw {
  0% { stroke-dashoffset: 1; }
  100% { stroke-dashoffset: 0; }
}
@keyframes ${NS}-spin { to { transform: rotate(360deg); } }
@keyframes ${NS}-spin-rev { to { transform: rotate(-360deg); } }
@keyframes ${NS}-core {
  0%, 100% { opacity: 0.68; transform: scale(0.74); }
  50% { opacity: 1; transform: scale(1.14); }
}
@keyframes ${NS}-halo {
  0%, 100% { opacity: 0.28; transform: translate(-50%, -50%) scale(0.9); }
  50% { opacity: 0.62; transform: translate(-50%, -50%) scale(1.05); }
}
@keyframes ${NS}-letter {
  0% { opacity: 0; filter: blur(7px); transform: translateY(5px); }
  100% { opacity: 1; filter: blur(0); transform: none; }
}
@keyframes ${NS}-fill { to { transform: scaleX(1); } }
@keyframes ${NS}-scan {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(520%); }
}
@keyframes ${NS}-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
@keyframes ${NS}-auto-hide {
  to {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .${NS} .${NS}__draw { animation: none; stroke-dashoffset: 0; }
  .${NS} .${NS}__dots,
  .${NS} .${NS}__arc,
  .${NS} .${NS}__orbit,
  .${NS} .${NS}__core,
  .${NS} .${NS}__halo,
  .${NS} .${NS}__scan,
  .${NS} .${NS}__dot,
  .${NS} .${NS}__letter { animation: none !important; opacity: 1; filter: none; transform: none; }
  .${NS} .${NS}__halo { opacity: 0.4; }
  .${NS} .${NS}__backdrop,
  .${NS} .${NS}__grid,
  .${NS} .${NS}__corner,
  .${NS} .${NS}__rule,
  .${NS} .${NS}__subtitle,
  .${NS} .${NS}__bar,
  .${NS} .${NS}__meta,
  .${NS} .${NS}__hint { animation-duration: 1ms !important; animation-delay: 0ms !important; }
  .${NS},
  .${NS} * { transition-duration: 200ms !important; }
}
@media (max-width: 560px) {
  .${NS} .${NS}__meta { left: 28px; right: 28px; }
  .${NS} .${NS}__meta--top span:last-child,
  .${NS} .${NS}__meta--bottom span:last-child { display: none; }
  .${NS} .${NS}__hint { bottom: 64px; }
}
`)

function corner(name) {
  return `<div class="${NS}__corner ${NS}__corner--${name}"></div>`
}

function wordmark() {
  const brand = 'DEEPSEEK HARNESS'
  return [...brand].map((ch, index) =>
    `<span class="${NS}__letter" style="animation-delay:${440 + index * 34}ms">${ch === ' ' ? '&nbsp;' : ch}</span>`,
  ).join('')
}

/** The splash body markup; injected directly after `<body>`. */
export const MARKUP = `<div class="${NS}" id="${NS}" data-phase="init" role="presentation" style="--dsh-boot-accent:var(--dsw-alias-brand-primary,#5ee6ff)">
<style>${CSS}</style>
<div class="${NS}__backdrop"></div>
<div class="${NS}__grid"></div>
<div class="${NS}__veil"></div>
<div class="${NS}__frame">
<div class="${NS}__rule"></div>
${corner('tl')}${corner('tr')}${corner('bl')}${corner('br')}
</div>
<div class="${NS}__meta ${NS}__meta--top">
<span><span class="${NS}__dot"></span><span data-lang="en">NEURAL LINK</span><span data-lang="zh">神经链路</span></span>
<span><span data-lang="en">SN 7F-02 / CORE 01</span><span data-lang="zh">序列号 7F-02 / 核心 01</span></span>
</div>
<div class="${NS}__stage">
<div class="${NS}__corewrap">
<div class="${NS}__halo"></div>
<svg class="${NS}__emblem" viewBox="0 0 240 240" aria-hidden="true">
<circle class="${NS}__draw" cx="120" cy="120" r="88" fill="none" stroke="rgba(236,246,252,0.20)" stroke-width="1" pathLength="1"></circle>
<circle class="${NS}__draw ${NS}__draw--late" cx="120" cy="120" r="64" fill="none" stroke="rgba(236,246,252,0.12)" stroke-width="1" pathLength="1"></circle>
<circle class="${NS}__dots" cx="120" cy="120" r="104" fill="none" stroke="rgba(236,246,252,0.24)" stroke-width="5" stroke-dasharray="0.6 7.4" pathLength="100"></circle>
<circle class="${NS}__arc" cx="120" cy="120" r="88" fill="none" stroke="var(--dsh-boot-accent)" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="52 500" pathLength="100" opacity="0.9"></circle>
<ellipse class="${NS}__orbit" cx="120" cy="120" rx="114" ry="40" fill="none" stroke="rgba(236,246,252,0.15)" stroke-width="1"></ellipse>
<ellipse class="${NS}__orbit ${NS}__orbit--wide" cx="120" cy="120" rx="40" ry="114" fill="none" stroke="rgba(236,246,252,0.1)" stroke-width="1"></ellipse>
<g class="${NS}__cross">
<line x1="120" y1="96" x2="120" y2="106" stroke-width="1"></line>
<line x1="120" y1="134" x2="120" y2="144" stroke-width="1"></line>
<line x1="96" y1="120" x2="106" y2="120" stroke-width="1"></line>
<line x1="134" y1="120" x2="144" y2="120" stroke-width="1"></line>
</g>
<circle cx="120" cy="120" r="13" fill="var(--dsh-boot-accent)" opacity="0.12"></circle>
<circle class="${NS}__core" cx="120" cy="120" r="2.7"></circle>
</svg>
</div>
<div class="${NS}__mark">
<p class="${NS}__word" aria-hidden="true">${wordmark()}</p>
<span class="${NS}__subtitle"><span data-lang="en">COGNITIVE INTERFACE</span><span data-lang="zh">认知接口</span></span>
</div>
<div class="${NS}__bar">
<div class="${NS}__row">
<span><span data-lang="en" data-phase-label="init">INITIALIZING</span><span data-lang="en" data-phase-label="ready">SYSTEM READY</span><span data-lang="zh" data-phase-label="init">正在初始化</span><span data-lang="zh" data-phase-label="ready">系统就绪</span></span>
<span class="${NS}__pct">0%</span>
</div>
<div class="${NS}__track"><div class="${NS}__fill"></div><div class="${NS}__scan"></div></div>
</div>
</div>
<div class="${NS}__meta ${NS}__meta--bottom">
<span><span data-lang="en">BUILD 0.2.1</span><span data-lang="zh">版本 0.2.1</span></span>
<span><span data-lang="en">CLICK TO SKIP</span><span data-lang="zh">点击跳过</span></span>
</div>
<span class="${NS}__sr" role="status" aria-live="polite"><span data-lang="en">DeepSeek Harness is starting</span><span data-lang="zh">DeepSeek Harness 正在启动</span></span>
</div>
`

/**
 * Controller: language before first paint, the percentage readout, the single
 * ready transition, dismissal and cleanup. Written as one expression so the
 * markup can embed it directly.
 */
export const SCRIPT = `(function(){
  var root = document.documentElement;
  var nav = (navigator.language || 'en').toLowerCase();
  root.lang = nav.indexOf('zh') === 0 ? 'zh' : 'en';
  var el = document.getElementById(${JSON.stringify(NS)});
  if (!el) return;
  var pct = el.querySelector('.${NS}__pct');
  var frame = 0;
  var timers = [];
  var disposed = false;
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  /* ---------- boot sound: synthesized, no asset files ---------- */
  var AC = window.AudioContext || window.webkitAudioContext;
  var actx = null, master = null, noiseBuf = null;
  var audioOn = false, audioOff = false, unlockTimer = 0;
  var t0 = performance.now();

  function since() { return performance.now() - t0; }

  function tone(type, from, to, at, dur, peak, pan) {
    var o = actx.createOscillator(), g = actx.createGain(), tail = g;
    o.type = type;
    o.frequency.setValueAtTime(from, at);
    if (to && to !== from) o.frequency.exponentialRampToValueAtTime(to, at + dur);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g);
    if (pan != null && actx.createStereoPanner) {
      tail = actx.createStereoPanner();
      tail.pan.value = pan;
      g.connect(tail);
    }
    tail.connect(master);
    o.start(at);
    o.stop(at + dur + 0.06);
  }

  function wash(at, dur, peak, type, from, to, q) {
    var src = actx.createBufferSource(), flt = actx.createBiquadFilter(), g = actx.createGain();
    src.buffer = noiseBuf;
    flt.type = type;
    flt.Q.value = q;
    flt.frequency.setValueAtTime(from, at);
    if (to && to !== from) flt.frequency.exponentialRampToValueAtTime(to, at + dur);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + Math.min(0.45, dur * 0.55));
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(flt);
    flt.connect(g);
    g.connect(master);
    src.start(at);
    src.stop(at + dur + 0.05);
  }

  function planCues() {
    var cues = [];
    function cue(at, span, fn) { cues.push([at, span, fn]); }

    cue(0, 2600, function (at, dur) {
      tone('sine', 46, 41, at, dur, 0.085);
      tone('sine', 69, 61, at, dur, 0.045);
      wash(at, dur, 0.02, 'lowpass', 520, 220, 0.7);
    });
    cue(90, 2050, function (at, dur) {
      wash(at, dur, 0.1, 'bandpass', 240, 5200, 1.1);
    });
    cue(240, 0, function (at) { tone('triangle', 1976, 0, at, 0.05, 0.05, -0.6); });
    cue(320, 0, function (at) { tone('triangle', 2349, 0, at, 0.05, 0.05, -0.22); });
    cue(400, 0, function (at) { tone('triangle', 2794, 0, at, 0.05, 0.05, 0.22); });
    cue(480, 0, function (at) { tone('triangle', 3136, 0, at, 0.05, 0.05, 0.6); });
    cue(300, 0, function (at) { tone('sine', 1760, 1760, at, 0.3, 0.028); });
    var brand = 'DEEPSEEK HARNESS';
    for (var i = 0; i < brand.length; i++) {
      if (brand.charAt(i) === ' ') continue;
      (function (index, lvl) {
        cue(440 + index * 34, 0, function (at) {
          tone('square', 784 + lvl * 58, 0, at, 0.03, 0.02, index % 2 ? 0.4 : -0.4);
        });
      })(i, i);
    }
    cue(690, 0, function (at) {
      tone('sine', 96, 32, at, 0.8, 0.24);
      wash(at, 0.3, 0.06, 'lowpass', 1600, 260, 0.8);
    });
    cue(2150, 0, function (at) {
      tone('triangle', 1046.5, 1046.5, at, 0.7, 0.06);
      tone('triangle', 1568, 1568, at, 0.75, 0.05);
      tone('sine', 2093, 2093, at, 0.6, 0.035);
      tone('sine', 2637, 2637, at + 0.09, 0.35, 0.03);
      tone('sine', 3136, 3136, at + 0.17, 0.3, 0.025);
      tone('sine', 3520, 3520, at + 0.24, 0.28, 0.02);
    });
    cue(2200, 250, function (at, dur) {
      wash(at, dur, 0.05, 'highpass', 700, 5600, 1.3);
    });
    cue(2450, 0, function (at) {
      wash(at, 0.14, 0.07, 'highpass', 2400, 2400, 0.9);
      tone('sine', 130, 44, at, 0.5, 0.2);
      tone('triangle', 392, 392, at, 0.55, 0.085);
      tone('triangle', 587.33, 587.33, at + 0.02, 0.7, 0.075);
      tone('sine', 784, 784, at + 0.04, 0.55, 0.05);
    });
    cue(2750, 640, function (at, dur) {
      wash(at, dur, 0.085, 'lowpass', 4200, 340, 0.9);
    });
    return cues;
  }

  function play() {
    if (audioOn || audioOff || !actx || actx.state !== 'running') return;
    audioOn = true;
    var off = since() / 1000;
    var base = actx.currentTime - off;
    var cues = planCues();
    for (var i = 0; i < cues.length; i++) {
      var at = cues[i][0], span = cues[i][1], fire = cues[i][2];
      var late = off * 1000 - at;
      if (span <= 0) {
        if (late > 40) continue;
        fire(base + at / 1000);
      } else {
        if (late >= span) continue;
        var start = late > 0 ? actx.currentTime + 0.01 : base + at / 1000;
        fire(start, (span - (late > 0 ? late : 0)) / 1000);
      }
    }
    removeEventListener('pointerdown', resumeAudio, true);
    removeEventListener('keydown', resumeAudio, true);
    clearTimeout(unlockTimer);
  }

  function resumeAudio() {
    if (!actx || audioOff) return;
    var p = actx.resume && actx.resume();
    if (p && p.then) p.then(play, function () {});
    else play();
  }

  function stopAudio(fadeMs) {
    audioOff = true;
    removeEventListener('pointerdown', resumeAudio, true);
    removeEventListener('keydown', resumeAudio, true);
    clearTimeout(unlockTimer);
    if (!actx || !master) return;
    try {
      var now = actx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now);
      master.gain.exponentialRampToValueAtTime(0.0001, now + (fadeMs || 180) / 1000);
      setTimeout(function () { try { actx.close(); } catch (e) {} }, (fadeMs || 180) + 90);
    } catch (e) {}
  }

  function bootAudio() {
    if (!AC || document.hidden) return;
    try {
      actx = new AC();
      master = actx.createGain();
      master.gain.value = 0.9;
      var limiter = actx.createDynamicsCompressor();
      limiter.threshold.value = -14;
      limiter.knee.value = 10;
      limiter.ratio.value = 6;
      limiter.attack.value = 0.004;
      limiter.release.value = 0.25;
      master.connect(limiter);
      limiter.connect(actx.destination);
      var len = Math.floor(actx.sampleRate * 2);
      noiseBuf = actx.createBuffer(1, len, actx.sampleRate);
      var data = noiseBuf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    } catch (e) {
      actx = null;
      return;
    }
    resumeAudio();
    if (!audioOn) {
      addEventListener('pointerdown', resumeAudio, true);
      addEventListener('keydown', resumeAudio, true);
      unlockTimer = setTimeout(function () {
        removeEventListener('pointerdown', resumeAudio, true);
        removeEventListener('keydown', resumeAudio, true);
      }, 8000);
    }
  }

  function detach() {
    removeEventListener('keydown', skip, true);
    removeEventListener('pointerdown', skip, true);
    removeEventListener('wheel', skip, true);
  }
  function done() {
    if (disposed) return;
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    for (var i = 0; i < timers.length; i++) clearTimeout(timers[i]);
    detach();
    stopAudio(0);
    if (el.parentNode) el.parentNode.removeChild(el);
  }
  function leave(ms) {
    if (disposed) return;
    detach();
    stopAudio(ms);
    el.setAttribute('data-leaving', 'true');
    later(done, ms);
  }
  function skip() { leave(${LEAVE_TRANSITION_MS}); }
  bootAudio();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (pct) pct.textContent = '0%';
    later(function () {
      var started = performance.now();
      (function tick(now) {
        if (disposed) return;
        var p = Math.min(100, (now - started) / ${FILL_MS} * 100);
        if (pct) pct.textContent = Math.round(p) + '%';
        if (p < 100) frame = requestAnimationFrame(tick);
      })(started);
    }, ${FILL_DELAY_MS});
    addEventListener('keydown', skip, true);
    addEventListener('pointerdown', skip, true);
    addEventListener('wheel', skip, { capture: true, passive: true });
  } else if (pct) {
    pct.textContent = '100%';
  }
  later(function () {
    if (disposed) return;
    detach();
    el.setAttribute('data-phase', 'ready');
    if (pct) pct.textContent = '100%';
  }, ${READY_MS});
  later(function () { leave(${REMOVE_MS - LEAVE_MS}); }, ${LEAVE_MS});
}());`

/** Rows contributed to every served index response. */
export const ROWS = [
  { kind: 'html', placement: 'body', html: MARKUP },
  { kind: 'script', placement: 'body', text: SCRIPT },
]
