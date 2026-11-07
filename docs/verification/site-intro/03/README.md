# Ticket 03 — Site intro layout

Captured in Chromium from the dev server (its indicator hidden) with loaded fonts,
reduced motion, and the real four-project featured selection. Each image is the first
viewport, not the full page, except the hover and focus image, which is cropped to the
intro.

| Viewport | Image |
| --- | --- |
| 320 × 568 | [site-intro-320x568.png](site-intro-320x568.png) |
| 390 × 844 | [site-intro-390x844.png](site-intro-390x844.png) |
| 768 × 1024 | [site-intro-768x1024.png](site-intro-768x1024.png) |
| 896 × 800 (the first two-column width) | [site-intro-896x800.png](site-intro-896x800.png) |
| 1280 × 800 | [site-intro-1280x800.png](site-intro-1280x800.png) |
| 1536 × 864 | [site-intro-1536x864.png](site-intro-1536x864.png) |
| 1280, row 02 hovered, row 03 keyboard-focused | [site-intro-1280-hover-focus.png](site-intro-1280-hover-focus.png) |

The first tile's artwork shows above the fold at 1280 × 800 and 390 × 844, with four
projects here and with a six-project fixture in `tests/site-intro.spec.ts`.

## TDD

Red: five of the eight new `Site intro layout` and six-project tests failed before the
layout CSS existed (placement, mobile rows, row states, reduced motion, touch targets).
The other three already held with the stacked ticket 02 styles. Green: `site-intro`,
`home-spacing`, and `polish-and-audit`, then the full suite.

## Decision: touch-target size

The ticket asks for "the minimum size the audit enforces", but `polish-and-audit`
enforces no minimum; its touch checks cover `touch-action` only. Index rows use 44px
(`min-height: 2.75rem`), asserted at 320, 390, 768, and 1280px in
`tests/site-intro.spec.ts`.
