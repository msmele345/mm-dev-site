# Ticket 01 verification — 30 September 2026

Implemented on `feat/01-render-curated-ledger-empty-blog-state`, starting from
`1ee4ba4e34d40affa7a0d9eb3aff3999abc12562`. The working tree was clean before
baseline capture. No authored blog files were edited, removed, or hidden.

## Pre-ledger baseline

Captured the actual running checkout **before** adding the ledger or changing CSS.
The original Hero and Project wall spacing remains unchanged in this ticket.
Chromium, reduced motion, loaded web fonts, document coordinates at matching widths:

| Viewport | Project wall section top | Hero height | Hero bottom padding | Wall top padding |
| --- | ---: | ---: | ---: | ---: |
| 1024 × 900 | 769.765625 px | 716.03125 px | 81.92 px | 71.68 px |
| 1440 × 900 | 973.796875 px | 915.21875 px | 112 px | 96 px |

[Machine-readable context](baseline.json), [1024 screenshot](baseline-1024.png),
[1440 screenshot](baseline-1440.png). These measure the `#work` section boundary,
not the heading or first tile. Ticket 03 must compare the same boundary, viewport,
font readiness, and reduced-motion setting. The captured enrichment was the
checkout's normal build-time source; changing those stats is not a spacing comparison.

## Ticket boundary

The real blog already has a published post. The intermediate production ledger
therefore shows **Now Building and Next Experiment only** until ticket 02 derives
the populated Latest Dispatch. This was the recommended scope assumption stated
during implementation after an optional clarification received no reply. It avoids
misrepresenting existing writing as FIRST DISPATCH PENDING or pulling ticket 02
forward. The empty-catalogue homepage is complete with all three signals.

`tests/support/transmission-app.ts` copies the app to a temporary directory and
excludes only that copy's blog directory, creating an empty catalogue there. It
builds the real Next app with webpack (for the temporary node_modules symlink) and
serves the production homepage on port 3021. No production fixture switch, browser
editing, alternative post metadata, or live service is added to the ledger.
The normal repository production build also passes using its default Turbopack path.

## Red → green and regressions

1. Placement test first failed at the rendered homepage because the accessible
   Current Transmission region did not exist. After introducing the server component,
   typed editorial record, and Chrome CSS, the same empty-catalogue test passed.
2. The manual-date regression failed with `30 SEPT 2026` instead of the specified
   `30 SEP 2026`. UTC-pinned Intl parts now supply a three-letter month and padded day.
3. Six focused page tests pass: placement/document and visual order; launch drafts,
   destination, date and footer states; keyboard focus/activation and no ambient
   motion under both motion preferences; isolated editorial edit plus production
   rebuild; and real authored-post preservation on the intermediate homepage.
4. The rebuilt editorial fixture changes both headlines, both sentences, and the
   Now Building destination. `UPDATED · 02 JAN 2001` remains visible despite the
   build running in America/Los_Angeles. The empty dispatch and fixed states remain.
   Rebuilding does not generate an editorial timestamp.

| Required check | Result |
| --- | --- |
| `npm test` | 161 passed, including the six new tests |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run build` | Passed; homepage remains statically prerendered |
| Focused rerun after screenshot capture correction | Six passed |

Standards and ticket-spec review passes found no actionable defects. Repository
checks are local evidence, not a deployment or owner approval.

## Visual inspection

Agent inspected the rendered empty-catalogue homepage and ledger at 1440 × 900,
768 × 1024, and 390 × 844. White reading text, sparse lime labels, muted footer
metadata, shared display/body faces, thin hard dividers, and section hierarchy agree
with Chrome. The empty state uses equal wide columns and full-width stacked rows.
The phone header wraps the update date underneath its title; no text is obscured.

| Width | Full composition | Ledger detail |
| --- | --- | --- |
| 1440 | [Homepage](empty-home-1440.png) | [Ledger](empty-ledger-1440.png) |
| 768 | [Homepage](empty-home-768.png) | [Ledger](empty-ledger-768.png) |
| 390 | [Homepage](empty-home-390.png) | [Ledger](empty-ledger-390.png) |

Screenshots were captured from document top so the sticky nav cannot obscure the
ledger title during capture. This is an agent visual pass of ticket 01's empty state,
not final populated/long-copy/breakpoint acceptance. Supporting sentences remain
editable drafts. Owner review belongs to ticket 04 and has not occurred.

## Remaining track work

- 02: derive the populated dispatch from the existing MDX catalogue.
- 03: recover wide-screen whitespace using the preserved baseline.
- 04: final populated/empty/long-copy responsiveness, accessibility, and owner review.
- 05: runtime editorial contract validation through the actual build.

No commits, pushes, deployments, or external issue publication were performed.

## Owner placement follow-up — 30 September 2026

- [x] Moved Current Transmission immediately below the Project wall and before More projects.
- [x] Updated the rendered placement and keyboard regressions for the revised order.
- [x] Kept hero spacing unchanged while providing two spacing suggestions for owner selection.

The updated placement regression first failed because the second homepage region
was Current Transmission rather than Project wall. Moving the server component
made all six Current Transmission tests pass. Keyboard traversal now goes from
the last featured-project link to Birdsview, then to the first More projects link.
Lint, typecheck, production build, and diff whitespace checks also passed.

Inspected the revised empty-catalogue composition at
[1440px](below-wall-home-1440.png), [768px](below-wall-home-768.png), and
[390px](below-wall-home-390.png). Earlier screenshots above record the initial
placement and are retained as historical evidence. The owner revision in the spec
supersedes the original placement; ticket 03's whitespace work remains incomplete.

At 1440px the current gap includes 80px of hero core bottom padding, 112px of hero
bottom padding, and 96px of Project wall top padding. The suggested treatments are
to reduce that stacked spacing directly, or to relocate the existing wall cue to
the hero boundary as a semantic `#work` link and tighten the wall's leading spacing.
