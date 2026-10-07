# 07 — Render every signal through one component and validate in one place

Status: complete locally — 2026-10-06

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Make the ledger easy to change before tickets 09–11 change it. The four-part signal structure (label, headline, supporting text, footer metadata) is currently written out four times — Now Building, populated Latest Dispatch, the empty-blog fallback, and Next Experiment — so every later change to links, cues, or hit areas would have to be repeated in each copy. The editorial record is also validated twice, once before the build's type-checking phase and again when the ledger module loads, without a single statement of why.

Render all signals through one signal presentation that takes the label, headline, supporting text, footer metadata, and an optional destination. Settle validation on one clearly documented enforcement point, or keep the second with a comment that states what it protects against that the first does not.

This is a refactor: the rendered homepage is unchanged.

## Acceptance criteria

- [x] Now Building, Latest Dispatch (populated and empty-blog), and Next Experiment render through a single signal presentation; the four-part structure is defined once.
- [x] A signal without a destination renders no link, no tab stop, and no link styling, by construction rather than by a separate branch per signal.
- [x] Rendered output is unchanged: the same headings, labels, copy, footer metadata, document order, accessible names, and link destinations. The existing browser tests pass without edits to their assertions.
- [x] Invalid editorial content still fails the real production build with the exact field error, ahead of any generic type diagnostic. The existing build-enforcement and content-contract tests pass unchanged.
- [x] Validation has one documented enforcement point, or each remaining point carries a comment explaining its distinct purpose.
- [x] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

Evidence: [verification record](../../docs/verification/current-transmission/07/README.md),
including the 147 unchanged tests before ticket 08 and the final integrated checks.

## Blocked by

- [06 — Decouple the ledger tests from live editorial copy](06-decouple-tests-from-live-copy.md)
