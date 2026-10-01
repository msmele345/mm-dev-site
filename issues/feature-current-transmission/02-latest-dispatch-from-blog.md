# 02 — Connect Latest Dispatch to published blog content

Status: implemented and verified locally — 2026-10-01

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Turn Latest Dispatch into an automatically maintained preview of the newest published blog post. Visitors can read the matching title, summary, and publication date on the homepage and follow the link to the complete article. The curated signals and their editorial date remain independent of blog publication. The empty-catalogue experience from ticket 01 remains intact.

## Acceptance criteria

- [x] A populated production homepage derives Latest Dispatch's headline, supporting summary, publication date, and route from the existing local MDX post catalogue rather than duplicate editorial fields or a runtime API.
- [x] Selection agrees with the catalogue's existing newest-first ordering and deterministic date-tie handling. No new draft filtering, scheduling semantics, or alternate post-metadata source is introduced.
- [x] Latest Dispatch displays the selected post's own publication date with stable calendar formatting, separately from the manual header date, and keeps its footer metadata minimal.
- [x] A semantic, keyboard-accessible dispatch link uses visible focus treatment; activating it reaches the corresponding article and its complete content.
- [x] Isolated fixtures with multiple dates and a tied newest date demonstrate the expected selection through rendered homepage behavior, without assertions that mirror private component wiring.
- [x] Adding a newer isolated post and rebuilding changes Latest Dispatch's title, summary, date, and destination while leaving both curated signals and the manual editorial date unchanged.
- [x] An isolated empty catalogue still produces FIRST DISPATCH PENDING, the preparation sentence, and OFF AIR without a link; no signal disappears and no stale article destination remains.
- [x] The feature remains static-first and uses existing publication semantics, without a live GitHub query, CMS, new external service, or edit to real posts for fixture setup.
- [x] Meaningful red-green evidence, page-boundary regression results, and required repository check results are recorded. Long-copy and final cross-viewport acceptance remain explicit responsibilities of ticket 04.

## Implementation evidence

See [red-green evidence, fixture rebuilds, required checks, and desktop inspection](../../docs/verification/current-transmission/02/README.md).
The production ledger now displays all three signals, deriving Latest Dispatch from
the existing catalogue. Ticket 04 retains long-copy, final cross-viewport, integrated
accessibility, and owner-copy acceptance; ticket 05 retains editorial build enforcement.
Changes are local and uncommitted.

## Blocked by

- [01 — Render the curated ledger and empty-blog state](01-curated-ledger-and-empty-blog.md)
