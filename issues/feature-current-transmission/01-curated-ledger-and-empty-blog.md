# 01 — Render the curated ledger and empty-blog state

Status: ready-for-agent (start when blockers are complete)

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Introduce Current Transmission between the hero and Project wall, delivering the manually curated signals and the complete empty-blog experience through the rendered homepage. Use the existing Chrome identity and a single typed editorial record. Capture the actual pre-change wide-screen spacing before introducing the ledger so later spacing work can make an evidence-backed comparison.

This slice demonstrates the empty-catalogue scenario with isolated fixtures. It must not hide real published posts or introduce a fake dispatch to imply that the populated-blog feature is complete; that behavior belongs to ticket 02.

## Acceptance criteria

- [ ] Before inserting the ledger or changing surrounding spacing, record the Project wall's document position and screenshots at representative wide viewports, with viewport sizes and enough baseline context for matching comparisons. Preserve existing checkout changes in this baseline.
- [ ] The rendered homepage exposes an accessibly titled Current Transmission section between the hero and Project wall, with document and visual reading order Now Building, Latest Dispatch, Next Experiment.
- [ ] The ledger uses the established ink-black Chrome, white reading text, sparse electric-lime accents, shared typography and design tokens, and thin dividers; it is not a chameleon tile or another featured-project tier.
- [ ] Each signal presents the agreed label, headline, supporting sentence, and visually subordinate footer metadata. Footer content is limited to a destination cue, publication date, or concept/fallback state as appropriate.
- [ ] Now Building displays BIRDSVIEW with supporting copy and a semantic, keyboard-accessible link to https://github.com/msmele345/birdsview, using the established visible focus treatment.
- [ ] Next Experiment displays the editable PIRATE WORLD working title and tentative all-ages 3D pirate-game copy, with IN CONCEPT metadata. It has no destination, link behavior, or tab stop and does not imply a scheduled release.
- [ ] An isolated empty blog catalogue retains Latest Dispatch with FIRST DISPATCH PENDING, the preparation sentence, and OFF AIR metadata. All three signals remain present, and the fallback has no destination, link behavior, or tab stop.
- [ ] One typed manual record owns the editorial update date, both curated headlines and supporting sentences, and the Now Building destination. Editing valid curated content and rebuilding updates its rendered signal without introducing browser editing or external services.
- [ ] The header displays the manual date as UPDATED · DD MMM YYYY without local-timezone calendar drift. Old valid dates remain visible, and rebuilding alone does not regenerate the date.
- [ ] Launch supporting sentences use the spec's editable drafts pending the rendered owner review in ticket 04; no permanent branding decision is inferred from the placeholder.
- [ ] No ambient animation, blinking marker, status pulse, or independently animated content is introduced. Existing Chrome link hover and focus treatment remains the only ledger transition behavior.
- [ ] Page-boundary tests prove placement, labels, manual content, date, destination, and the empty-blog state through isolated fixtures. Meaningful red-green evidence and the required repository check results are recorded without changing or deleting real posts.

## Blocked by

None — can start immediately.

