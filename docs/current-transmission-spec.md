# Current Transmission — Homepage Ledger Spec

Status: implemented and verified locally — 2026-10-02
Distribution: local only; no issue-tracker publication
Source: resolved Current Transmission grilling session

Owner revision — 2026-09-30: place Current Transmission immediately after the
Project wall and before More projects. This supersedes the original between-hero-and-wall
placement throughout this spec and its tickets. The hero gap remains a separate
spacing improvement. The owner subsequently selected direct reduction of the hero's
trailing and Project wall's leading padding, delivered in ticket 03. The original
requirement to fill the gap with the ledger is superseded.

## Problem Statement

The home page has a large unused band between the hero and the Project wall. The
separation reads as missing content and delays the introduction to the featured work.
Visitors also lack a compact way to see what Mitch is developing now, what he has
recently written, and which project idea he is exploring next.

The owner wants that space to provide useful, personal context while retaining the
site's restrained Chrome and allowing the chameleon tiles to remain the showpiece.

## Solution

Add **Current Transmission**, a compact Chrome ledger between the hero and the
Project wall. It presents three signals in this reading order:

| Signal | Source | Launch content | Interaction |
| --- | --- | --- | --- |
| Now Building | Manually curated | BIRDSVIEW | Link to its repository |
| Latest Dispatch | Newest published blog post | Derived title, summary, and publication date | Link to the post |
| Next Experiment | Manually curated | PIRATE WORLD, with IN CONCEPT status | Non-interactive |

Each signal has a fixed label, headline, supporting text, and minimal footer metadata.
The ledger header includes an editorial update date. Three equal columns become three
compact stacked rows on narrower screens. Existing whitespace is redistributed to
accommodate the ledger; the wide-layout Project wall should appear at the same scroll
depth or sooner. Stacked rows may take the additional space required for readability.

The ledger remains static apart from established link hover and keyboard-focus
transitions. An empty blog produces an honest, non-interactive Latest Dispatch
fallback rather than a missing signal.

## User Stories

1. As a visitor, I want useful content between the hero and Project wall, so that the transition feels intentional.
2. As a visitor, I want Current Transmission to appear before the Project wall, so that I understand the current activity before exploring featured work.
3. As a visitor, I want to see Now Building, so that I know which project is currently in development.
4. As a visitor, I want Now Building to identify Birdsview at launch, so that the status reflects the owner's actual work.
5. As a visitor, I want Now Building to link to the project's repository or published case study, so that I can investigate the work.
6. As a visitor, I want to see Latest Dispatch, so that I can discover the owner's recent writing from the home page.
7. As a returning visitor, I want Latest Dispatch to select the newest published post automatically, so that I see current writing without duplicate editorial maintenance.
8. As a visitor, I want Latest Dispatch to use the post's title and summary, so that the preview agrees with the blog.
9. As a visitor, I want Latest Dispatch to link to the post, so that I can read its complete content.
10. As a visitor, I want to see the post's publication date, so that I can assess when it was written.
11. As a visitor, I want to see Next Experiment, so that I can learn which side project or substantial prototype the owner is considering.
12. As a visitor, I want the pirate-game idea to be labeled IN CONCEPT, so that I understand it is still being explored.
13. As a visitor, I want concept content to have no misleading link, so that I am not sent to a placeholder destination.
14. As a visitor, I want each signal to use a consistent four-part structure, so that I can scan the ledger quickly.
15. As a visitor, I want footer metadata to remain minimal, so that it does not compete with the headline and description.
16. As a visitor, I want headlines to wrap naturally, so that long titles remain readable.
17. As a visitor, I want supporting text to appear as a two-line excerpt with an ellipsis when needed, so that previews remain compact.
18. As a visitor, I want linked articles to retain their complete text, so that a shortened ledger excerpt does not limit what I can read.
19. As a visitor, I want to see the ledger's editorial update date, so that I can assess the age of the manually curated signals.
20. As a visitor, I want older editorial entries to remain visible, so that the ledger communicates their age rather than silently disappearing.
21. As a desktop visitor, I want three equal columns, so that I can compare all three signals at a glance.
22. As a visitor on a narrower screen, I want the signals stacked in their original reading order, so that I can read them without horizontal scrolling.
23. As a phone visitor, I want readable text and comfortable links, so that the compact design remains usable.
24. As a desktop visitor, I want the Project wall to begin at the same scroll depth or sooner, so that adding the ledger does not postpone the featured work.
25. As a visitor, I want Current Transmission to use the existing Chrome identity, so that it belongs to the site and leaves project identities prominent.
26. As a keyboard user, I want to reach the available links with visible focus, so that I can navigate the ledger reliably.
27. As a keyboard user, I want non-interactive signals to remain outside the link tab sequence, so that focus only stops on actionable destinations.
28. As a visitor, I want the ledger to remain free of ambient animation, so that the Project wall retains the motion hierarchy.
29. As a visitor with reduced-motion preferences, I want complete information and usable links, so that I receive the same functional experience.
30. As a visitor when no blog posts are published, I want a FIRST DISPATCH PENDING signal with OFF AIR metadata, so that the three-signal layout remains honest and complete.
31. As the owner, I want to edit the manual signals together with their update date, so that editorial maintenance stays simple.
32. As the owner, I want PIRATE WORLD to remain a replaceable working title, so that exploring the idea can lead to a different name.
33. As the owner, I want invalid manual content to fail CI and the build with an exact field error, so that incomplete status data cannot be deployed silently.
34. As the owner, I want old dates, long copy, and an empty blog to remain valid states, so that validation rejects actual contract violations rather than editorial choices.
35. As the owner, I want ledger rendering to use local curated and blog content, so that it does not depend on live external services.
36. As a maintainer, I want verification through rendered behavior and the content contract, so that implementation can change without invalidating tests that mirror its internals.

## Implementation Decisions

- **Placement and responsibility:** introduce a Current Transmission presentation
  module in the home-page composition between the hero and Project wall. Treat it as
  Chrome, not a chameleon tile or another featured-project tier.
- **Visual identity:** follow ADR 0003: ink-black ground, white reading text, sparse
  electric-lime labels and link accents, established typography, and thin ledger
  dividers. Use the existing design-token system. Keep footer metadata visually
  subordinate, limited to a destination cue, publication date, or concept state.
- **Manual content:** maintain one typed curated content record containing the
  editorial update date, Now Building headline, supporting sentence and destination,
  and Next Experiment headline and supporting sentence. Next Experiment has no
  destination. Its initial footer is the fixed presentation state IN CONCEPT.
- **Now Building launch:** use BIRDSVIEW and the verified repository destination
  `https://github.com/msmele345/birdsview`. The earlier MM-DEV-SITE selection was
  superseded by the owner's clarification that Birdsview is still in development.
- **Next Experiment launch:** use PIRATE WORLD as an editable placeholder for a
  possible 3D pirate-world game for all ages. It represents a project-level idea,
  rather than routine maintenance or an individual portfolio-site feature. It is
  tentative and must not imply a scheduled build or committed release.
- **Blog derivation:** reuse the existing post catalogue's newest-first order and
  deterministic tie handling. Derive Latest Dispatch's title, supporting summary,
  date, and route from the selected post. Use the catalogue's existing publication
  semantics; this feature does not add draft filtering or a scheduling system.
- **Freshness:** display the manually maintained ledger date in the header as
  `UPDATED · DD MMM YYYY`. Format calendar dates consistently without local-timezone
  drift. Show the post's own publication date in Latest Dispatch. A rebuild or blog
  change must not automatically rewrite the manual editorial update date.
- **Empty blog:** retain Latest Dispatch with the headline FIRST DISPATCH PENDING,
  a short sentence indicating that field notes are being prepared, and OFF AIR
  footer metadata. Render it without a destination or link behavior.
- **Copy presentation:** headlines wrap naturally. Supporting text uses a two-line
  excerpt and an ellipsis when it overflows. Preserve the underlying authored copy;
  do not destructively shorten blog metadata or add a character-count validator.
- **Wide layout:** render three equal columns in the established reading order.
  Reduce the hero's trailing padding and Project wall's leading padding so the ledger
  primarily consumes the existing oversized gap. Preserve distinct section boundaries.
  Compare against the actual pre-change home page at matching viewports.
- **Stacked layout:** switch directly from three columns to three compact full-width
  rows separated by hard divider lines. Avoid a two-column intermediate layout,
  carousel, and horizontal scrolling. Allow sufficient height for readable text and
  comfortable links, even when the Project wall moves farther down than before on
  narrow screens. The same-or-earlier scroll-depth constraint applies to the wide
  three-column layout only.
- **Links and accessibility:** Now Building and a populated Latest Dispatch expose
  semantic, keyboard-accessible links with visible focus. Next Experiment and the
  empty-blog fallback remain non-interactive. Give the section an accessible title
  and preserve the visual reading order in document order. Reuse established Chrome
  hover and focus treatment.
- **Motion:** introduce no ambient animation, blinking marker, status pulse, or
  independently animated content. Essential content and navigation remain complete
  with reduced-motion preferences.
- **Rendering:** preserve the static-first architecture. Derive the ledger from
  local curated content and the existing MDX catalogue. No live API, CMS, or external
  link-health dependency is needed to render or validate it.
- **Validation:** validate the production manual record during the actual build
  path, in addition to type checking. Fail CI/build with an error naming the offending
  field for each contract violation. Merely exporting an unused validator does not
  satisfy this requirement.

The manual content contract rejects:

| Violation | Required behavior |
| --- | --- |
| Missing editorial update date, either headline, either supporting sentence, or Now Building destination | Fail with the specific field named |
| A required string is empty or whitespace-only | Fail with the specific field named |
| Update date is not a real ISO calendar date in yyyy-mm-dd form | Fail with the date field named |
| Now Building destination is neither a safe root-relative internal path nor an absolute HTTPS URL | Fail with the destination field named |
| A field has the wrong type | Fail with the specific field named |
| Next Experiment contains a destination | Fail because the signal is non-interactive |

Unsafe destination forms include executable schemes and protocol-relative URLs.
Validation does not require a network request to determine external availability.
An old valid date, an empty blog catalogue, and longer copy are valid states.

## Testing Decisions

The owner approved the rendered home page as the primary test boundary during
grilling. A good test asserts what a visitor sees, reads, or can activate, or the
observable result of validating a content record. Avoid component-state assertions,
checks that mirror private implementation, and snapshots of internal data wiring.

- **Prior art:** extend the approach used by the existing Chrome browser tests,
  MDX index/post browser tests, responsive accessibility checks, and post-metadata
  validation tests. Use Playwright at the page boundary and focused tests at the
  manual content-contract boundary.
- **Normal homepage:** verify section order, all three labels, launch selections,
  destination URLs, minimal footer states, editorial update date, and publication
  date. Activate the blog link and confirm the corresponding article is reached.
- **Derived content:** use isolated fixtures with multiple post dates and verify
  newest-post selection agrees with the existing catalogue, including its tie
  behavior. Confirm that adding a newer fixture and rebuilding updates Latest
  Dispatch without editing the manual signals.
- **Empty blog:** use an isolated empty catalogue and verify FIRST DISPATCH PENDING,
  the preparation sentence, OFF AIR, all three signals still present, and no link
  for the fallback. Do not edit or delete real authored posts to manufacture a state.
- **Responsive geometry:** inspect desktop, tablet, and phone layouts and exercise
  both sides of the chosen layout breakpoint. Verify three equal columns or three
  full-width rows, stable reading order, dividers, and no horizontal overflow.
- **Long copy:** exercise a long headline and summary; verify natural headline
  wrapping and the two-line excerpt with an ellipsis. Confirm the article retains
  its full content. Check representative real blog copy as well as fixtures.
- **Spacing evidence:** capture the Project wall's pre-change document position at
  representative wide viewports. Compare matching post-change views and confirm it
  starts at the same position or sooner, allowing only subpixel measurement rounding.
  Review stacked layouts for readable spacing rather than enforcing desktop height.
- **Keyboard and motion:** verify link focus and activation, visible focus styling,
  non-interactive concept/fallback behavior, and the absence of ambient animation.
  Repeat the relevant checks with reduced-motion preferences enabled.
- **Validation:** exercise each invalid class in the contract and verify an exact
  field error. Include impossible dates, blank strings, unsafe destinations, wrong
  types, and a Next Experiment destination. Verify an old valid date and longer
  strings remain accepted.
- **Build enforcement:** use an isolated invalid-content fixture to demonstrate
  that the real build fails with the intended field error. A passing validator test
  alone does not prove production-build enforcement.
- **Visual review:** inspect the rendered desktop, tablet, and phone composition
  for Chrome consistency, quiet footer metadata, and hierarchy relative to the
  chameleon tiles. Automated structural assertions do not substitute for this pass.
- **Workflow:** implement meaningful behavior changes through red-green-refactor,
  then run the repository's required checks. Record evidence and check off only
  verified acceptance criteria; owner copy review remains separate.

## Out of Scope

- Ambient status animation or a low-frequency Now Building pulse in this version.
- A CMS, browser editing interface, runtime GitHub queries, or new external services.
- Blog-authoring changes, draft/scheduling infrastructure, or another source of post metadata.
- Additional signals, a status history, activity feeds, or progress percentages.
- Automatic stale-content hiding, expiry, or automatic editorial timestamp updates.
- Placeholder pages or destinations for conceptual work.
- Adding Birdsview to the Project wall, making it a chameleon tile, or writing a case study.
- Building the pirate game, choosing its permanent brand, or committing to its release.
- Reworking the existing tile motion system or changing the site's Chrome identity.
- Publishing this spec to the issue tracker under the current local-only request.

## Further Notes

Decision provenance: [resolved grilling record](plan/plan-history/12-current-transmission.md)
and [project vocabulary](GLOSSARY.md). The feature follows the existing decisions on
[Chrome identity](adr/0003-ink-black-chrome-electric-lime.md),
[curated content and enrichment](adr/0004-curated-content-plus-build-time-github-enrichment.md),
[MDX authoring](adr/0005-mdx-in-repo-blog.md), and
[motion hierarchy](adr/0006-motion-ambient-plus-hover-crescendo.md).
No new ADR is needed for these reversible feature choices.

Launch supporting sentences remain editable drafts for review with the rendered ledger:

- **BIRDSVIEW:** "Explore a 3D globe, bird's-eye views, and surprising geography facts."
- **PIRATE WORLD:** "Exploring a 3D pirate adventure for players of all ages."
- **Empty-blog fallback:** "Field notes are being prepared."

A low-frequency Now Building status pulse may be explored in a future polish pass.
It is deliberately deferred from this spec. PIRATE WORLD is a working title and may
change as the concept develops.

### Implementation Acceptance Checklist

- [x] Current Transmission follows the Project wall and precedes More projects in the existing Chrome identity, per the owner's 2026-09-30 placement revision.
- [x] Three signals use the agreed four-part structure and minimal footer metadata.
- [x] Now Building features BIRDSVIEW with the verified repository destination.
- [x] Latest Dispatch derives from the newest post, links correctly, and displays its publication date.
- [x] Next Experiment features the editable PIRATE WORLD placeholder with IN CONCEPT and no link.
- [x] The header displays the manual editorial update date; stale valid content stays visible.
- [x] An empty blog retains the non-interactive FIRST DISPATCH PENDING / OFF AIR signal.
- [x] Headlines wrap naturally and supporting text uses the agreed two-line excerpt behavior.
- [x] Wide columns become compact stacked rows without overflow or an orphaned intermediate layout.
- [x] Matching wide-view measurements show the Project wall starts at the same scroll depth or sooner.
- [x] Keyboard navigation, visible focus, reduced-motion behavior, and absence of ambient motion are verified.
- [x] Invalid manual content fails the actual build with a field-specific error; valid edge cases pass.
- [x] Desktop, tablet, and phone composition has been visually inspected and required repository checks pass.
- [x] Owner review of the rendered launch copy is recorded.

Final integration evidence: [ticket 05 verification](verification/current-transmission/05/README.md),
including all 303 tests, lint, type checking, and the default production build after
tickets 02–04 were integrated. The [ticket 04 verification](verification/current-transmission/04/README.md)
records the owner's rendered launch-copy approval on 2026-10-02; current agent inspection
does not replace that approval.
