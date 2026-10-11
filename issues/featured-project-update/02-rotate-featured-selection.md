# 02 — Rotate the featured selection with accurate counts and responsive layout

Status: implemented — verified 2026-10-11

## Parent

[Featured Project Update spec](../../docs/featured-project-update-spec.md)

[Approved ticket index](README.md)

## What to build

Let the owner add, remove, replace, and reorder already prepared
projects by editing one ordered featured selection. The rendered wall displays exactly
that selection, with coherent indices, counts, and responsive geometry.

## Acceptance criteria

- [x] One ordered selection determines wall membership and order; authored records are retained when unfeatured.
- [x] Fixture changes demonstrate add, remove, replace, and reorder without changing shared renderers.
- [x] Counts and visible numbering derive from rendered selection, with correct singular/plural wording.
- [x] Empty selection keeps the Work anchor and heading, an honest zero count and empty state, and no placeholder cards.
- [x] Zero, one, two, three, four, and five-card configurations are checked at representative phone, tablet, and desktop sizes without horizontal overflow or duplicate/empty cards.
- [x] Duplicate selections and unknown project references fail the build with actionable errors.
- [x] Visual reading order, keyboard focus order, link destinations, reduced-motion art, and shared tile interactions survive rotation.
- [x] Tests use isolated fixtures and retain the production four-project selection.

## Blocked by

- [01 — Register showcase identities while preserving the four-project experience](01-register-showcase-identities.md)

## Verification — 2026-10-11

- `WALL_SLUGS` remains the single ordered selection; catalogue records and
  published slugs are retained. The real four-project lineup is unchanged.
- Red–green production-fixture checks cover singular counts, the empty state,
  and build failure for duplicate/unknown selections with actionable named errors.
- Eight rebuilt rotation scenarios cover baseline, remove, replace, reorder,
  two, one, zero, and five cards at **390px, 768px, and 1440px**. Exact membership,
  numbering, counts, grid order, overflow, static art, and destinations pass.
- Rotated and expanded selections preserve keyboard navigation and visible focus,
  single crescendo, off-screen pause, touch hold, and tap activation.
- Agent visually inspected the Chromium captures across all sizes. The original
  grid proportions and odd-card alignment remain intact. This is agent inspection,
  not owner visual/copy approval.
- Full `npm test`: **342 passed** (including all **12 new ticket tests**).
  `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check` pass.
  The default production build required network access for its configured fonts;
  it succeeded after rerunning outside the restricted sandbox.
- Standards review: no findings. Ticket-scope review: no findings.
- [Verification notes, screenshots, and geometry](../../docs/verification/featured-project-update/02/README.md).
- Later-ticket publication/readiness/onboarding/guide work remains separate.
