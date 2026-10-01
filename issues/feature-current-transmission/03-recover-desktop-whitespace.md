# 03 — Recover desktop whitespace without delaying featured projects

Status: implemented and verified locally — 2026-09-30

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Owner revision — 2026-09-30: Current Transmission follows the Project wall.
The owner selected direct spacing reduction instead of filling the gap with the ledger.

Reduce the oversized hero-to-wall gap by tightening the hero's trailing and Project wall's leading padding. Retain distinct section boundaries and the quiet, equal-column ledger below the wall. Demonstrate the improvement against the actual pre-ledger homepage captured in ticket 01.

This ticket can proceed while blog integration is being completed. Its own rendered content must satisfy the spacing contract; ticket 04 rechecks the final populated composition rather than assuming these measurements prove later content states.

## Acceptance criteria

- [x] At wide viewports, the three signals occupy equal columns in their established order, with thin dividers, subordinate footer metadata, and the existing page alignment and Chrome hierarchy.
- [x] Hero trailing spacing and Project wall leading spacing are reduced directly, while preserving legible separation and distinct section boundaries; Current Transmission remains below the Project wall.
- [x] At matching representative wide viewports, the Project wall starts at the same document position as the pre-ledger baseline or earlier, allowing only subpixel measurement rounding rather than an arbitrary regression budget.
- [x] Before/after measurements and screenshots record the actual viewport, content state, and Project wall positions. Missing baseline evidence is reported rather than replaced with a guessed measurement or a different historical page.
- [x] The wide composition has no horizontal overflow, clipped headlines, or competing featured-tile styling, and does not change Project wall selections, case-study destinations, or tile motion.
- [x] The same-or-earlier constraint is applied only to the wide three-column layout; narrow layouts may grow to preserve readability and comfortable links rather than being forced into the desktop height.
- [x] Desktop browser geometry assertions and an actual visual inspection verify the new spacing. Meaningful red-green evidence and required repository check results are recorded; final populated and narrow-screen checks remain in ticket 04.

## Verification

See [measurements, red-green evidence, checks, and inspected screenshots](../../docs/verification/current-transmission/03/README.md).
The real homepage still has two curated signals until ticket 02; all three wide
columns were inspected using the isolated empty-catalogue homepage. Final populated
and long-copy acceptance remains in ticket 04. No commits or deployments were made.

## Blocked by

- [01 — Render the curated ledger and empty-blog state](01-curated-ledger-and-empty-blog.md)
