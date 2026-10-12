# Ticket 05 verification — 11 October 2026

Delivered [the reusable project update guide](../../../project-update-guide.md), linked
from the repository README and content schema. Updated current context/glossary
wording without changing historical ADRs or planning records.

## Commands and results

- `npm test -- tests/new-project-readiness.spec.ts --workers=1`: **9 passed** (45.6s).
- `npm test -- --output=/tmp/featured-05-suite-results`: **401 passed** (58.8s).
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed, using the normal production build pipeline.
- `git diff --check`: passed.

Local fixture servers initially hit sandbox `listen EPERM`; the authorized rerun
outside the sandbox passed. Logs from this session are in
`/tmp/featured-05-focused.log`, `/tmp/featured-05-suite.log`, and
`/tmp/featured-05-build.log` (temporary, not repository artifacts).

## Maintenance walkthrough

`tests/new-project-readiness.spec.ts` now follows the guide on one isolated app:
prepare/publish/feature Signal Loom, reorder it, replace it with Sound City,
re-feature it, and remove it. Each rotation stops the server, edits only the copied
featured selection, builds, and serves again. Each step checks visible count,
indices, exact destination order, and Signal Loom's retained successful page,
narrative, bespoke artwork, canonical/OG metadata, PNG social image, and sitemap.

Existing onboarding assertions verify the full authored record, local draft plate,
optional links, failed enrichment, keyboard/Enter, touch press/release and tap,
static reduced-motion art, single active crescendo, and off-screen pausing.
The full suite also runs the zero-through-five selection fixtures and the existing
published-URL retention checks. No production catalogue, selection, registration,
or artwork was changed for this rehearsal.

This ticket adds documentation and verification of existing application behavior;
there is no new feature implementation or artificial red phase. The public rendered
homepage and rebuilt case-study routes are the spec-approved test boundaries.

## Visual inspection

The agent opened and inspected these fresh Chromium captures from the full run:

- [390px wall](wall-390.png): both tiles stack; title, pitch, artwork, and links fit.
- [768px wall](wall-768.png): deliberate single column, readable spacing and art.
- [1440px wall](wall-1440.png): two aligned tiles with distinct identities and
  sequential indices; reduced-motion threads form a complete static composition.
- [1440px case study](case-study-1440.png): consistent violet identity, visible draft
  flag, three narrative sections, captioned plate, stack, and destination controls.

No clipping or overlap was observed in those captures. Automated geometry assertions
cover overflow and odd/expanded selections at the same three widths. Browser input
checks cover keyboard/touch/motion behavior; this is not physical-device testing.

## Review and ownership

Separate standards and spec reviewers found no blocking findings. The spec review
identified stale automatic-font-loading wording in the content schema; it was corrected.
Concurrent ticket-04 readiness changes were preserved, excluded from this ticket's
implementation scope, and included in the final whole-checkout test run. The guide
reflects their current rule: valid unique catalogue slugs for all records, full
readiness when published. `docs/content-schema.md` contains edits from both tasks.

- [x] Agent documentation, browser screenshot inspection, and behavioral checks.
- [ ] Owner review of the guide and copy.
- [ ] Owner artwork/composition approval.

No deployment, commit, or production curation change was performed.
