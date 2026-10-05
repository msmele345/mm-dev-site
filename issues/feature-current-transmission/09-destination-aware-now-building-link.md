# 09 — Make the Now Building link match its destination

Status: not started

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

The content contract lets Now Building point at either an absolute HTTPS URL or a root-relative internal path (a published case study, per user story 5), but the rendered signal treats every destination the same way. Two defects follow:

- **Wrong footer cue.** The footer always reads "Repository ↗", even when the destination is an internal case study.
- **Inconsistent external behavior.** Every other external link in the Chrome (footer, contact, rail cards, case-study links) opens in a new tab with `rel="noreferrer"`. The Now Building link shows the same ↗ arrow but opens in the same tab without `rel`.

Make the link and its footer cue follow the destination:

- **External (HTTPS):** opens in a new tab with `rel="noreferrer"`, and keeps the "Repository ↗" cue. Owner decision 2026-10-03: new tab, matching the rest of the site.
- **Internal (root-relative):** navigates in the same tab using the site's client-side navigation, with a cue that names an internal destination (draft: "Case study →"). The cue copy is an editable draft for owner review.

## Acceptance criteria

- [ ] With an external destination, the Now Building link carries `target="_blank"` and `rel="noreferrer"`, and the footer shows the repository cue with the outbound arrow.
- [ ] With a root-relative destination, the link navigates in the same tab through client-side navigation, has no `target`, and the footer shows the internal cue instead of "Repository ↗". An isolated fixture proves it.
- [ ] Keyboard activation works for both forms: Enter on the external link opens the destination in a new page; Enter on the internal link reaches the destination route.
- [ ] Tests that previously followed the external link in the same tab now assert the destination and the new-tab behavior, without depending on the external site's availability.
- [ ] Next Experiment and the empty-blog fallback remain non-interactive; the Latest Dispatch link is unchanged.
- [ ] The content contract is unchanged: the same destinations are accepted and rejected, with the same field errors.
- [ ] Visible focus, tab order, and reduced-motion behavior are unchanged.
- [ ] The owner's review of the internal cue copy is recorded. Agent inspection alone does not satisfy this criterion.
- [ ] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

## Blocked by

- [06 — Decouple the ledger tests from live editorial copy](06-decouple-tests-from-live-copy.md)
- [07 — Render every signal through one component and validate in one place](07-single-signal-component-and-validation-site.md)
