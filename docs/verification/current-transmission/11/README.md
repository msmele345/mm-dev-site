# Ticket 11 — Link cues at rest and accessible descriptions

Verified locally on 2026-10-09. Owner dispatch-cue review remains pending.

## Delivered behavior

- Latest Dispatch shows its existing publication date followed by `· READ →` at rest.
- Each linked headline references its own footer with `aria-describedby`. Accessible
  descriptions identify Repository, Case study, or READ article (with the dispatch date).
  The word “article” uses the existing visually-hidden utility.
- Link names and heading text remain unchanged. Decorative arrows remain hidden from
  assistive technology; the publication date retains its time element and ISO datetime.
- OFF AIR and IN CONCEPT remain exact, non-interactive footer states.
- Existing footer styling, link hit areas, focus behavior, layout, and motion are retained.

## Verification

The approved rendered-homepage boundary was used for TDD:

1. The resting-cue test failed with `27 AUG 2026` instead of a date plus `· READ`.
   After adding the cue it passed at 320, 390, 768, 895, 896, 1024, and 1440px.
2. The description test failed with an empty accessible description instead of
   `Repository`. After associating the footer it passed, including unchanged link
   names, article destination wording, and an accessibility snapshot without arrows.
3. The isolated rebuilt internal-destination fixture verifies the unchanged HARBOUR
   LOG name with a Case study description. Existing isolated empty/long-copy/date
   fixtures, keyboard traversal, focus, activation, and both motion preferences pass.
4. Footer geometry checks verify a single dispatch metadata line, no page overflow,
   bottom placement in every signal, and aligned footer bottoms in three-column layouts.

Checks on the final implementation:

- Focused ledger suite: 20 passed.
- Full `npm test`: 326 passed (33.5s), including the additional footer geometry assertions.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; static routes generated.
- `git diff --check`: passed.
- Standards and spec reviews: no actionable findings.
- UI review used the [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), subject to repository conventions.

Browser-computed accessible descriptions and accessibility snapshots were tested;
this is not a claim of a manual VoiceOver or NVDA listening session.

## Rendered evidence and owner review

Agent visually inspected these captures. Metadata remains subordinate, the cue stays
on one line, stacked layouts remain readable, and wide footers align.

- [Phone, 390px](link-cues-390.png)
- [Tablet, 768px](link-cues-768.png)
- [Desktop, 1440px](link-cues-1440.png)

Draft for owner review: `27 AUG 2026 · READ →` (date remains derived from the post).
No owner approval has been received. This record does not approve ticket 09's separate
Case study cue. No commit, push, PR, or deployment was performed.
