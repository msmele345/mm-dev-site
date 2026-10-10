# 01 — Register showcase identities while preserving the four-project experience

Status: implemented — verified 2026-10-10

## Parent

[Featured Project Update spec](../../docs/featured-project-update-spec.md)

[Approved ticket index](README.md)

## What to build

Preserve the current four tiles and case studies through explicit
presentation registrations, making future project identities registerable without
adding dispatch branches to the shared wall or case-study shell.

## Acceptance criteria

- [x] All four current tiles retain their order, art, palette, typography, and case-study links.
- [x] Published case studies retain their current artwork and curated narrative.
- [x] A cohesive registration point associates each project with its tile and appropriate case-study artwork.
- [x] Shared wall and case-study shells no longer assume that an unknown project should render nothing or inherit unrelated groovebox artwork.
- [x] Registration checks name missing or conflicting project presentation references.
- [x] Existing static, ambient, crescendo, off-screen pause, keyboard, and touch behavior remains verified through rendered pages.
- [x] Required checks pass and the production four-project lineup remains unchanged.

## Blocked by

None — can start immediately.

## Verification — 2026-10-10

- `src/components/showcase/registry.ts` explicitly pairs each current tile with its
  case-study artwork. Shared shells resolve registrations and reject missing tile
  identities; neither shell has project-specific dispatch or fallback artwork.
- Registration tests demonstrated red then green for missing references, duplicate
  slugs, and missing tile/case-study artwork components, with named errors.
- Focused registration, wall, case-study, and motion suite: **24 passed**.
- Full `npm test`: **330 passed**. Includes rendered static/ambient/crescendo states,
  off-screen pause, keyboard focus/navigation, touch interaction, responsive checks,
  curated narrative, artwork, enrichment, and social metadata coverage.
- `npm run lint`, `npm run typecheck`, `npm run build`, and `git diff --check` passed.
  The production build retained all four case-study and project social-image routes.
- Agent visually inspected Chromium captures of the 1440px wall and all four
  case-study heroes in reduced motion. Order, bespoke artwork, palettes, and display
  typography remain intact. No CSS, curated records, tile components, or motion
  components changed. This is agent inspection, not owner visual/copy approval.
- Standards review: no findings. Ticket-scope review: no findings.
- Selection rotation, publication independence, broader readiness/build validation,
  and the synthetic extension fixture remain with the subsequent tickets.
