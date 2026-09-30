# 03 — Recover desktop whitespace without delaying featured projects

Status: ready-for-agent (start when blockers are complete)

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Fit Current Transmission into the existing oversized wide-screen gap instead of postponing the featured work. Redistribute the hero's trailing and Project wall's leading spacing while retaining distinct section boundaries and a quiet, equal-column ledger. Demonstrate the improvement against the actual pre-ledger homepage captured in ticket 01.

This ticket can proceed while blog integration is being completed. Its own rendered content must satisfy the spacing contract; ticket 04 rechecks the final populated composition rather than assuming these measurements prove later content states.

## Acceptance criteria

- [ ] At wide viewports, the three signals occupy equal columns in their established order, with thin dividers, subordinate footer metadata, and the existing page alignment and Chrome hierarchy.
- [ ] Hero trailing spacing and Project wall leading spacing are redistributed so the ledger primarily consumes the former unused band, while preserving legible separation and distinct section boundaries.
- [ ] At matching representative wide viewports, the Project wall starts at the same document position as the pre-ledger baseline or earlier, allowing only subpixel measurement rounding rather than an arbitrary regression budget.
- [ ] Before/after measurements and screenshots record the actual viewport, content state, and Project wall positions. Missing baseline evidence is reported rather than replaced with a guessed measurement or a different historical page.
- [ ] The wide composition has no horizontal overflow, clipped headlines, or competing featured-tile styling, and does not change Project wall selections, case-study destinations, or tile motion.
- [ ] The same-or-earlier constraint is applied only to the wide three-column layout; narrow layouts may grow to preserve readability and comfortable links rather than being forced into the desktop height.
- [ ] Desktop browser geometry assertions and an actual visual inspection verify the new spacing. Meaningful red-green evidence and required repository check results are recorded; final populated and narrow-screen checks remain in ticket 04.

## Blocked by

- [01 — Render the curated ledger and empty-blog state](01-curated-ledger-and-empty-blog.md)

