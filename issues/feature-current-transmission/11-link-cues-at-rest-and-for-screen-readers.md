# 11 — Show where each link goes, at rest and to screen readers

Status: implemented and technically verified locally; owner cue review pending

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Make it clear which signals are links and where they lead, without relying on hover.

- **Latest Dispatch has no cue at rest.** Its headline looks identical to the non-interactive Next Experiment headline until hovered, and touch visitors never get a hover state. Its footer shows only the publication date. Add a minimal destination cue beside the date (draft: `27 AUG 2026 · READ →`). This stays within the spec's footer allowance of "a destination cue, publication date, or concept state". The cue copy is an editable draft for owner review.
- **Screen readers hear only the headline.** A link's accessible name is just its headline (for example "BIRDSVIEW"), with nothing saying it leads to a repository, a case study, or an article. Associate each link with its footer cue as its accessible description, so the destination is announced without changing the heading text or the link's accessible name.

The empty-blog fallback and Next Experiment stay non-interactive and gain no cue.

## Acceptance criteria

- [x] A populated Latest Dispatch footer shows the publication date and a destination cue, visible without hover at every tested width, and visually subordinate like the existing footer metadata.
- [x] The empty-blog fallback footer remains exactly OFF AIR and Next Experiment's remains exactly IN CONCEPT, with no destination cue and no link.
- [x] Each ledger link has an accessible description naming its destination kind (repository, case study, or article). The link's accessible name and the heading text are unchanged.
- [x] Decorative arrows remain hidden from assistive technology.
- [x] The publication date keeps its `<time>` element and ISO `datetime`.
- [x] Stacked and three-column layouts keep their geometry: no added rows of height beyond the footer line, no horizontal overflow, footers still aligned to the bottom of their columns.
- [x] No ambient animation is introduced; keyboard order, visible focus, and reduced-motion behavior are unchanged.
- [ ] The owner's review of the dispatch cue copy is recorded. Agent inspection alone does not satisfy this criterion.
- [x] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

## Blocked by

- [09 — Make the Now Building link match its destination](09-destination-aware-now-building-link.md)

## Verification

See the [ticket 11 verification record](../../docs/verification/current-transmission/11/README.md)
for red/green evidence, checks, and rendered phone/tablet/desktop captures.
The dispatch draft is `READ →`; its accessible description adds “article”.
Owner review has not yet been received and remains open.
