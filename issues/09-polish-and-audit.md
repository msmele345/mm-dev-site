# 09 — Polish & audit

## Parent

Wayfinder map: `/docs/plan/plan-history/map.md`

## What to build

A full pass across the finished surfaces before launch, using the `web-design-guidelines`
skill as the checklist:

- **Accessibility:** contrast on every tile identity (not just chrome), focus order and
  visible lime focus rings everywhere, alt text on screenshots, landmark structure.
- **Motion audit:** `prefers-reduced-motion` honored on every animated surface; ambient
  animations pause off-screen; single-crescendo rule holds; mobile crescendo
  (tap-and-hold / dominant-in-view) works.
- **Performance:** Core Web Vitals on home (four animated tiles is the risk), case
  studies, and blog; image optimization on all screenshots.
- **Responsive:** project wall, case studies, and blog from small phones to wide desktop.

## Acceptance criteria

- [x] Web-design-guidelines review run; findings fixed or explicitly waived
- [x] Reduced-motion verified on every animated component
- [x] Lighthouse (or equivalent) green on performance and accessibility for home, one case study, one post — mobile and desktop
- [x] No horizontal scroll or broken layout at narrow widths
- [x] Keyboard-only walkthrough of the whole site succeeds, crescendo included

## Result

Findings, fixes, waivers, and the Lighthouse numbers: [`docs/audit/09-polish-and-audit.md`](../docs/audit/09-polish-and-audit.md).
The machine-checkable half is `tests/polish-and-audit.spec.ts`.

## Blocked by

- [05 — Remaining three tiles](05-remaining-three-tiles.md)
- [06 — MDX blog](06-mdx-blog.md)
