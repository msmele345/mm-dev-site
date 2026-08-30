# 09 — Polish & audit: findings, fixes, and waivers

Date: 2026-08-29 · Branch: `feat/09-polish-and-audit`

The pre-launch pass across every finished surface, run against the
[Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)
checklist named by [issue 09](../../issues/09-polish-and-audit.md).

Everything machine-checkable landed in `tests/polish-and-audit.spec.ts` rather than in
this file. That spec is the durable artefact: this document records the one-shot
Lighthouse numbers and the judgement calls a test cannot make.

## How to re-run

Browser audit (dev server, GitHub stand-in, both started by Playwright):

```bash
npm run test -- tests/polish-and-audit.spec.ts
```

Lighthouse needs a **production** build — `next dev` performance numbers are noise:

```bash
node tests/support/github-mock.mjs 4010 &
GITHUB_API_BASE_URL=http://127.0.0.1:4010 GITHUB_TOKEN=mock-token npm run build
npx next start -p 3100 -H 127.0.0.1 &

export CHROME_PATH="$(node -e "console.log(require('playwright').chromium.executablePath())")"
npx lighthouse@12 http://127.0.0.1:3100/ --preset=desktop --chrome-flags=--headless=new
```

## Lighthouse

Lighthouse 12, headless Chromium, production build against the GitHub stand-in.
Mobile is the default (throttled Moto G Power); desktop is `--preset=desktop`.

| Surface | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| home — mobile | 98 | 96 | 100 | 100 | 2.5 s | 0 | 10 ms |
| home — desktop | 100 | 96 | 100 | 100 | 0.5 s | 0 | 0 ms |
| `/work/elevated-bpm` — mobile | 97 | 96 | 100 | 100 | 2.5 s | 0 | 0 ms |
| `/work/elevated-bpm` — desktop | 100 | 96 | 100 | 100 | 0.5 s | 0 | 0 ms |
| post — mobile | 98 | 96 | 100 | 100 | 2.3 s | 0 | 0 ms |
| post — desktop | 100 | 96 | 100 | 100 | 0.5 s | 0 | 0 ms |

Four animated tiles were the stated performance risk. They cost nothing measurable:
CLS is 0 everywhere and TBT never exceeds 10 ms, because the motion system animates
only `transform` and `opacity` (asserted in the spec) and pauses off-screen.

## Findings fixed

**Horizontal scroll on two case studies at 320px** — `src/app/globals.css`
The `.case__hero h1` floor of `4.5rem` is wider than a 320px screen in the two
non-condensed faces: "ELEVATED" in Chakra Petch and "TERMINAL" in IBM Plex Mono each
overran the page gutter and dragged a scrollbar onto the whole document (342px and
348px against a 320px viewport). Telescope and Sound City were fine — Bebas Neue is
condensed enough to fit, which is why the bug survived issue 05. Floor lowered to
`3.25rem`, plus `overflow-wrap: break-word` as a guard for a future single-word title.

**Faceplate silkscreen below AA** — `src/app/globals.css`
The `EB-01` brand and the `KICK / CLAP / CH / OH` pad labels were `--tile-mute` printed
onto the hardware gradient, not onto the tile ground: 3.03:1 on the pad and 4.15:1 on
the faceplate. Both now use a new `--tile-silk` / `--case-silk` — the tile's own ink
mixed 75% into its panel — which clears 4.5:1 on every palette (worst case 5.24:1,
elevated-bpm). The gradient stops moved into `--hw-*` tokens so the audit can measure
against the exact surface a label sits on instead of a copied literal.

**Code comments below AA** — `src/app/globals.css`
Shiki's `min-dark` prints comments at `#6B737C`, which is 4.07:1 on the code panel —
under the floor for 13px text, and comments are the one token carrying prose. Lifted to
`#767F88` (4.78:1). Every token is now measured by the spec, so a theme change fails
loudly rather than silently regressing.

**Double-tap zoom delay on the groovebox tile and the sequencer embed** —
`src/app/globals.css`
`touch-action: manipulation` and an intentional `-webkit-tap-highlight-color` existed on
`.chameleon-tile` but never reached `.groovebox-tile`, and the embed's step and transport
buttons had neither.

**No `theme-color`** — `src/app/layout.tsx`
Android's address bar and iOS's PWA status bar painted a light strip above an ink-black
site. Declared as `#08090b`, matching `--color-ink`.

**Favicon 404** — `src/app/icon.svg` (new)
`/favicon.ico` 404'd on every page, which Lighthouse counts as a console error
(best practices 96 → 100). Added a sequencer glyph in the chrome's lime on ink.

**Full-bleed layout under a notch** — `src/app/globals.css`
Every section runs edge to edge, and the `1.25rem` minimum page gutter is narrower than
an iPhone's 44px landscape safe-area inset. `body` now carries
`padding-inline: env(safe-area-inset-left) env(safe-area-inset-right)`, which also keeps
the sticky header out from under the cutout; `html` paints the same ink behind the
strips, so nothing shows. (Not covered by a test — Playwright cannot emulate insets.)

**Typography** — `src/content/blog/…​.mdx`, `src/app/globals.css`
Straight quotes in post prose replaced with curly. `text-wrap: balance` added to the
three headings that lacked it (`.blog__title a`, `.rail-card__title`,
`.case__story-list h3`).

## Findings waived

**Footer wordmark contrast — 1.29:1** (`.site-footer__wordmark`)
The only remaining Lighthouse accessibility flag, on all six runs. It is the giant
ghosted "MITCH MELE" at `--color-grid`, `aria-hidden="true"`, duplicating the header
wordmark that is a real, high-contrast link. It is texture, not content — WCAG 1.4.3
exempts text that is pure decoration. Raising it to 4.5:1 would make it a second
headline and break the identity established in
[03 — brand wordmark](../plan/plan-history/03-brand-wordmark.md). Waived; accessibility
stays at 96, which is green.

**Screenshots served unoptimized** (`src/components/CaseStudy.tsx`)
Issue 09 asks for "image optimization on all screenshots". The plates are SVGs, which
`next/image` does not optimize without `dangerouslyAllowSVG`; `unoptimized` is the
correct setting, not a shortcut. They already carry explicit `width`/`height` and lazy
loading, so they cost no layout shift — CLS is 0 on every case study.

**Ambient motion has no pause control** (WCAG 2.2.2)
Tile ambient loops run longer than five seconds without an on-screen pause button. The
mitigations are the ones ADR 0006 designed for: `prefers-reduced-motion` freezes every
surface into deliberate static art (asserted per-surface in the spec), motion pauses
off-screen, and only `transform`/`opacity` animate. A visible pause control on four
decorative tiles would cost more than it buys on a portfolio wall. Revisit if the wall
ever carries information in motion.

**Sentence-case headings**
The guidelines ask for Title Case. "Project wall", "More projects", "The story",
"Live from GitHub" are the site's established ledger voice. Deliberate; not changed.

**Framework-owned performance items**
`render-blocking-resources`, `unused-javascript`, and `legacy-javascript` all point at
Next's own chunks. Performance is 97–100; nothing here is ours to fix.

## Checked and passing, no change needed

- Landmarks (`banner` / `main` / `contentinfo` / `navigation`) and a gapless heading
  order on all four page types.
- Focus: `:focus-visible` everywhere, no `outline: none` without a replacement, and the
  sticky header never parks over a focused element on any surface.
- Keyboard: the whole home page is reachable by Tab in reading order, every tile
  crescendos on focus with a lime ring, and the single-crescendo rule holds through the
  keyboard path as well as hover.
- Contrast on all four tile palettes — mute, ink, and accent on both ground and panel —
  plus the chrome's mute, reading copy, and lime. Worst passing pair is 4.65:1.
- Alt text on every case-study plate.
- No `transition: all`; keyframes touch only `transform` and `opacity`.
- `Intl` for every date and number; no hardcoded formats.
- Empty states handled for posts, rail entries, screenshots, and absent GitHub stats.
