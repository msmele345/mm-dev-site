# 12 — Current Transmission

Type: grilling
Status: resolved — local spec written
Blocked by: none

## Question 1

Where does the Current Transmission content come from?

## Answer

**Hybrid model.** **Now Building** and **Next Experiment** are manually curated;
**Latest Dispatch** is derived from the newest published blog post. This keeps the
editorial signals intentional while allowing the blog signal to stay current without
duplicate maintenance.

## Question 2

Does every signal require a destination?

## Answer

**No — use mixed behavior.** **Now Building** links to the project's published case
study or repository, and **Latest Dispatch** links to its blog post. **Next Experiment**
is non-interactive and carries a small `IN CONCEPT` status at launch, reflecting the
owner's later clarification of the idea's stage. Do not create placeholder pages
solely to make every signal clickable.

## Question 3

Does Current Transmission expose the freshness of its manually curated status?

## Answer

**Yes.** The ledger header shows one compact `UPDATED · DD MMM YYYY` date stored with
the manually curated content. **Latest Dispatch** retains the blog post's own publication
date. Stale content remains visible rather than disappearing automatically; the visible
update date communicates its age honestly.

## Question 4

How much content does each signal carry?

## Answer

Use a shared four-part structure: a fixed signal label, a short headline, one supporting
sentence that occupies no more than two visual lines, and minimal footer metadata. The
footer only provides the essential destination cue, post date, or `IN CONCEPT` state; it
must remain visually subordinate and must not become a second description.

## Question 5

How does the ledger adapt to narrower viewports?

## Answer

Use three equal columns at wide widths, then switch directly to three compact,
full-width rows in the same reading order. Keep hard divider lines between rows. Do not
introduce horizontal scrolling, a carousel, or a two-column intermediate layout that
leaves the third signal orphaned.

## Question 6

Does Current Transmission introduce its own ambient motion?

## Answer

**No ambient animation in the initial version.** The ledger remains static apart from
the established hover and keyboard-focus transitions on its two links. This preserves
the motion hierarchy: the Project wall remains the home page's animated showpiece.

## Future consideration

A low-frequency status pulse for **Now Building** may be reconsidered in a later polish
pass. It is deliberately deferred rather than included in the initial feature.

## Question 7

Does the ledger add vertical length to the home page or replace the existing oversized
gap?

## Answer

**Redistribute the current whitespace.** Reduce the hero's trailing padding and the
Project wall's leading padding, then fit Current Transmission primarily inside the
recovered space. Retain enough separation for the hero, ledger, and Project wall to
read as distinct sections. In the wide three-column layout, the Project wall should
begin at approximately the same scroll depth as it does now, or slightly sooner.
The stacked-layout adjustment is recorded in Question 16.

## Question 8

What does **Latest Dispatch** show when there are no published blog posts?

## Answer

Preserve the three-signal ledger with an honest, non-interactive fallback. Use the
headline `FIRST DISPATCH PENDING`, a brief supporting sentence that field notes are
being prepared, and the minimal footer state `OFF AIR`. Do not collapse the column or
invent a destination.

## Question 9

What makes the manually curated transmission content incomplete or invalid, and how is
that state handled?

## Answer

**Fail CI and the build with an error naming the exact field.** Manual content is
incomplete when the ledger update date, either headline, either supporting sentence,
or the **Now Building** destination is missing. It is invalid when a required string is
blank, the update date is not a real ISO calendar date, the destination is neither a
safe internal path nor an HTTPS URL, a value has the wrong type, or **Next Experiment**
is given a destination despite being non-interactive.

An old update date is valid because its age is visible. An empty blog is valid because
it has the agreed `OFF AIR` state. Copy length is a responsive presentation concern,
not a character-count validation rule; browser tests protect the two-line design.

## Question 10

Which project does **Now Building** feature at launch?

## Answer

Launch with `BIRDSVIEW`, linking to `https://github.com/msmele345/birdsview`.
The owner approved replacing the initial `MM-DEV-SITE` selection after clarifying
that Birdsview is still in development. The destination matches the sibling project's
configured Git remote.

## Question 11

What does **Next Experiment** represent?

## Answer

The next side-quest project or substantial prototype. This project-level meaning keeps
the signal aligned with the Side Quest Showcase; routine maintenance and individual
portfolio-site features do not qualify.

## Question 12

Which project does **Next Experiment** feature at launch?

## Answer

The initial selection of `BIRDSVIEW` was superseded by the owner's clarification:
Birdsview is still in development. The next project is not planned yet; the likely
direction is a 3D pirate-world game for all ages, with the idea still being fleshed out.

Treat the pirate game as a tentative concept rather than a committed build. Its
supporting launch copy remains a draft.

## Question 13

How does **Next Experiment** communicate the pirate game's early stage?

## Answer

Use `IN CONCEPT` as the minimal launch footer, replacing the initial `QUEUED` choice.
The idea is still being explored and is not yet a planned or scheduled project.

## Question 14

What is the pirate game's launch working title?

## Answer

Use `PIRATE WORLD` as a placeholder. The owner expects the name may change as the idea
is explored further. Keep it editable as curated content and do not treat it as a
permanent brand, URL slug, or architectural name.

Suggested supporting copy, pending final copy review: "Exploring a 3D pirate adventure
for players of all ages."

## Question 15

How does the compact ledger handle longer copy?

## Answer

Headlines wrap naturally. Supporting text is displayed as a two-line excerpt with an
ellipsis when it overflows. Linked posts retain their complete text at the destination.
This is a presentation rule rather than a character-count validation limit.

## Question 16

How does the spacing contract apply when the ledger stacks on narrower screens?

## Answer

Keep the same-or-earlier Project wall scroll-depth requirement for the wide
three-column layout. In the stacked layout, minimize padding but allow the additional
height required for readable text and comfortable links. Do not compress the stacked
rows merely to meet the wide-layout height requirement.

## Question 17

What establishes a successfully implemented ledger?

## Answer — approved verification boundary

Use the rendered home page as the primary test boundary, following the existing
Chrome and MDX Playwright coverage. Check the three signals, exact destinations and
dates, newest-post selection, empty-blog fallback, keyboard access, visible focus,
non-interactive concept state, natural headline wrapping, two-line excerpts, and
three-column-to-stacked geometry without horizontal overflow. Check the absence of
ambient animation and behavior with reduced-motion preferences.

Capture the pre-change Project wall position and compare it at matching wide
viewports. Inspect desktop, tablet, and phone composition visually, including longer
blog copy. Exercise alternate post catalogues through isolated test fixtures rather
than changing real authored posts.

Use focused content-contract tests plus a build failure check for invalid manual
content. A structurally valid old update date must pass. Validation must identify the
offending field and must not depend on external link availability.

## Launch-copy handoff

The launch selections and behavior are settled. Supporting sentences remain editable
draft copy for review with the rendered ledger:

- **Now Building:** `BIRDSVIEW`, linked to `https://github.com/msmele345/birdsview`.
  Suggested supporting sentence: "Explore a 3D globe, bird's-eye views, and surprising
  geography facts."
- **Latest Dispatch:** title, summary, publication date, and destination from the
  newest published blog post; the approved `OFF AIR` fallback applies to an empty blog.
- **Next Experiment:** `PIRATE WORLD`, a replaceable working title, with `IN CONCEPT`
  and no link. Suggested supporting sentence: "Exploring a 3D pirate adventure for
  players of all ages."

## Spec readiness

Product behavior, content sources, launch selections, responsive rules, failure
behavior, and verification expectations are resolved. The synthesis is saved in the
[local Current Transmission spec](../../current-transmission-spec.md). At the owner's
request, the spec remains local and has not been published to the issue tracker.
No new ADR is required: the ledger follows the existing Chrome identity, and its
feature-level choices remain inexpensive to change.
