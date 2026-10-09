# 10 — Align the columns and make the whole signal the hit area

Status: implemented and verified locally — 2026-10-09

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Fix the wide-layout misalignment between linked and non-interactive signals, and make a linked signal comfortable to activate anywhere on its surface.

The headline link currently reserves its 44px touch target inside the heading's own box. That pushes a linked headline about 4px lower than a non-interactive one, and its supporting text about 10px lower, so the three columns do not share baselines. It is visible in the recorded desktop capture (BIRDSVIEW against PIRATE WORLD in `docs/verification/current-transmission/04/populated-ledger-1440.png`).

Move the hit area off the headline's layout: a linked signal's entire surface activates its link, as the more-projects rail cards already do, while the accessible name and the focus ring stay on the headline text. Linked and non-interactive signals then share identical headline and copy positions.

## Acceptance criteria

- [x] In the three-column layout, single-line headlines in linked and non-interactive signals share the same top position, and their supporting text starts at the same position, within 1px. Measured in both the populated and empty-blog states.
- [x] The same holds in stacked rows: a linked signal's headline-to-label and copy-to-headline spacing equals a non-interactive signal's, within 1px.
- [x] Clicking or tapping anywhere on a linked signal activates its link. Clicking a non-interactive signal does nothing.
- [x] Each linked signal's hit area is at least 44 by 44 CSS pixels at every tested width, and stays inside its own signal without overlapping a neighbor or a divider.
- [x] The focus ring is drawn around the headline text, not the whole signal, and remains the established Chrome focus treatment.
- [x] Each signal still exposes exactly one link (or none); tab order and accessible names are unchanged.
- [x] Long-headline and long-summary fixtures still wrap and clamp as before, without horizontal overflow, on both sides of the layout breakpoint.
- [x] No ambient animation is introduced; reduced-motion behavior is unchanged.
- [x] Desktop, tablet, and phone captures are visually inspected for column alignment and recorded separately from the structural test results.
- [x] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

## Blocked by

- [07 — Render every signal through one component and validate in one place](07-single-signal-component-and-validation-site.md)

## Verification

[Ticket 10 evidence](../../docs/verification/current-transmission/10/README.md) records rendered geometry, pointer and keyboard checks, separate visual inspection, and required repository checks.
