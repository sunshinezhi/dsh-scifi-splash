# dsh-scifi-splash

A light neumorphic theme plus a dark sci-fi boot animation for DeepSeek Harness. Soft pastel glass cards, a gradient logo, a pale fish watermark — and a deep-space boot sequence on launch.

## What it does

- **Light neumorphic UI** — pale pink / lilac / blue gradients, white cards with soft double shadows and inner highlights, matching inputs, buttons and switches.
- **Gradient brand mark** — the logo keeps its shape, only its colour shifts to pink → violet → blue; selected states, primary buttons and progress bars follow.
- **Fish watermark** — a quiet Q-style fish in the lower-right of the conversation area, kept translucent so text stays readable.
- **Dark sci-fi boot animation** — injected before first paint (`#0A0E2A → #120A24 → #1B0716`), HUD lines, progress bar, `CLICK TO SKIP`, and a fully closed 1px frame that covers the old top-right gap.
- Works across the chat surface, plugin market, settings, voice clone and pet pages.

## Install

```bash
dsh plugin add dsh-scifi-splash
```

Or find **Sci-Fi Splash** in the DSH plugin market and restart.

## Compatibility

- DeepSeek Harness `>= 0.2.1`
- Injects `scifi-boot` and `scifi-blue` rows through `cordis.patch.yml`; host files are not modified.

## License

MIT
