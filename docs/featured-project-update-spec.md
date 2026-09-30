# Featured Project Update — Reusable Showcase Maintenance Spec

Status: ready for implementation — ticket breakdown approved
Distribution: local Markdown
Scope: adding, removing, replacing, and reordering featured Project wall selections

## Problem Statement

Updating the featured Project wall currently requires coordinating authored project
content, homepage selection, tile rendering, published case-study routes, and displayed
counts. Rendering and case-study artwork contain project-specific branching, while the
section copy assumes four projects. A new project can be selected but fail to render
if its artwork is not registered. An incorrectly coordinated removal can also damage
an existing destination.

The owner needs a repeatable way to curate the wall and introduce future projects,
with clear readiness requirements and verification. Leaving the homepage must not
erase an already published case study. Bespoke visual identity should remain a feature
of the showcase rather than being replaced by generic cards.

## Solution

Treat the authored project catalogue, ordered featured selection, published
case-study selection, and registered showcase artwork as related but distinct things.
Make rotation of already prepared projects a content edit. Make onboarding a new
project a documented process that supplies its curated content and bespoke artwork,
registers its presentation, publishes a valid case-study destination, and selects it
for the wall when ready.

Derive tile order, visible indices, and section counts from the featured selection.
Validate references and readiness during the build rather than silently hiding
unsupported projects. Preserve existing published case-study URLs, metadata, social
images, and sitemap entries when projects are unfeatured.

The resulting maintenance guide and checklist form a reusable template for future
updates. Current Transmission remains an independent editorial surface: Now Building
does not automatically promote a project into the featured selection.

## User Stories

1. As the owner, I want to add a prepared project to the featured selection, so that visitors can discover it on the home page.
2. As the owner, I want to remove a project from the featured selection, so that the wall reflects my current priorities.
3. As the owner, I want to replace one featured project with another, so that I can rotate the showcase without rebuilding its layout.
4. As the owner, I want to reorder the featured selection, so that its reading order communicates my intended emphasis.
5. As the owner, I want a single ordered selection to determine wall membership, so that I do not update several lists to perform one rotation.
6. As the owner, I want to retain authored records for unfeatured projects, so that later rotations can reuse their content.
7. As the owner, I want publication to remain independent of featuring, so that a published case study can exist without a homepage tile.
8. As a visitor, I want the wall to show exactly the selected projects, so that there are no hidden gaps or unexpected entries.
9. As a visitor, I want tile order and numbering to agree, so that the section reads coherently.
10. As a visitor, I want the displayed project count to match the visible selection, so that the site does not claim there are four projects when that changes.
11. As a visitor, I want each featured tile to open a published case study, so that its destination works.
12. As a returning visitor, I want an old case-study URL to remain usable after its tile leaves the wall, so that bookmarks and shared links survive curation.
13. As a visitor following an old link, I want the retained page to preserve its project identity, so that it remains a complete presentation.
14. As a visitor, I want a replacement tile to link to its own case study, so that the replaced project's identity is not overwritten.
15. As a visitor, I want single-project and odd-sized selections to look intentional, so that the wall remains composed when its size changes.
16. As a visitor on a phone, I want selected tiles to fit the viewport, so that I can read and activate them without horizontal scrolling.
17. As a visitor, I want an empty featured selection to have an honest state, so that I do not encounter phantom cards or broken navigation.
18. As a keyboard user, I want focus to follow the configured tile order, so that navigation agrees with the visual sequence.
19. As a keyboard user, I want visible focus and working tile activation, so that each selected case study is accessible.
20. As a touch user, I want the existing mobile tile interactions to survive selection changes, so that curation does not remove access to the showcase.
21. As a visitor, I want only one tile to crescendo at a time, so that added or reordered projects do not compete for active attention.
22. As a visitor, I want off-screen tile animation to pause, so that larger selections do not animate unnecessarily.
23. As a reduced-motion visitor, I want each selected project to have deliberate static art, so that its identity does not depend on animation.
24. As the owner, I want every new featured project to have a bespoke tile identity, so that the wall retains the chameleon-tile design.
25. As the owner, I want case-study artwork to be explicitly registered, so that a new project does not accidentally receive unrelated groovebox art.
26. As the owner, I want required titles, pitches, narrative, stack, and artwork to be documented, so that I can prepare future additions consistently.
27. As the owner, I want copy grounded in each source repository, so that case studies make supported claims.
28. As the owner, I want screenshot descriptions and captions checked, so that project imagery is accessible and understandable.
29. As the owner, I want clearly labeled draft copy and draft plates to remain usable, so that existing editorial-review conventions are preserved.
30. As the owner, I want missing remotes and unavailable GitHub statistics to remain valid, so that live enrichment does not determine feature eligibility.
31. As the owner, I want malformed destinations rejected, so that selected projects cannot ship unsafe or placeholder links.
32. As the owner, I want unknown or duplicate selected slugs to fail the build clearly, so that mistakes cannot silently change the wall.
33. As the owner, I want a missing tile renderer or unpublished featured destination to fail the build, so that every configured card can render and navigate.
34. As a maintainer, I want deterministic validation errors to identify the project and problem, so that content errors are quick to repair.
35. As a maintainer, I want to verify selection changes with isolated fixtures, so that tests do not rewrite the real curated showcase.
36. As a maintainer, I want tests through the rendered wall and case-study destinations, so that they describe behavior rather than private dispatch logic.
37. As the owner, I want a reusable update checklist, so that adding, removing, replacing, and reordering projects follow the same dependable workflow.
38. As the owner, I want Current Transmission to remain independently curated, so that editorial status and featured membership can change separately.

## Implementation Decisions

- **Catalogue:** keep a uniquely keyed collection of authored projects. Retain records
  needed by published case studies even after their homepage tiles are removed.
- **Featured selection:** maintain one explicit ordered list of project slugs. Its
  membership and order drive rendered cards, tile indices, accessible reading order,
  and section count. Selecting a project does not implicitly author or publish it.
- **Published case studies:** maintain explicit publication eligibility separately
  from featured membership. A featured project must have a published case study;
  a published project need not be featured. The existing draft-copy flag describes
  editorial review and must not be reinterpreted as an unpublished-route flag.
- **Showcase registration:** provide a cohesive registration point for each project's
  bespoke tile renderer and case-study artwork or explicit artwork choice. Reuse
  existing display-face, palette, and shared metadata conventions. Registering future
  artwork should not require new project-specific switches in the wall or case-study
  shell. This is a small explicit registry, not a general plugin system.
- **Baseline preservation:** migrate the current four projects through this contract
  before new maintenance behavior. Retain their existing order, artwork, palettes,
  routes, enrichment behavior, and motion states during that prefactoring.
- **Add existing:** append or insert a registered, publishable project into the
  ordered selection. No new bespoke UI code is needed to re-feature an already
  prepared project.
- **Add new:** author project content, supply and register its tile and case-study
  artwork, publish its case study, then add its slug to the desired position. New
  bespoke artwork remains normal feature work under ADR 0002; this spec does not
  promise that a content record alone creates a new visual identity.
- **Remove:** remove only the slug from the featured selection. Keep its authored
  content, published route, and required artwork registration. Do not automatically
  move it to the more-projects rail or change Current Transmission.
- **Replace:** remove the outgoing selected slug and insert the incoming prepared
  slug in the intended position. Preserve the outgoing project and URL. Replacement
  never reuses the outgoing slug for a different project's identity.
- **Reorder:** edit selection order only. Preserve stable project slugs and React
  identity; derive visible numbering from current position rather than stored indices.
- **Counts:** replace four-specific display copy with a count derived from the
  validated selection, using correct singular/plural language. A selected project
  must render one card; empty list items or silent filtering are invalid outcomes.
- **Layout:** retain the existing responsive grid and tile proportions. Support finite
  curated selections without enforcing exactly four cards. Verify zero, one, two,
  three, four, and five-card fixture configurations; five demonstrates extension
  beyond the current set rather than imposing a new maximum. Odd selections keep
  the last tile aligned in normal grid order without duplicated cards.
- **Empty selection:** keep the Project wall heading and Work
  anchor, report zero featured projects, and show a short neutral empty-state sentence.
  Render no tile placeholders or motion wrappers. This maintains the existing Work
  navigation destination when no projects are selected.
- **Published URL preservation:** featured rotation must not affect generation of
  published case-study routes, canonical metadata, social images, or sitemap entries.
  Old published pages continue to return successful responses after a real rebuild.
  Unpublished or unknown case-study routes remain unavailable.
- **Project readiness:** require a nonblank title and pitch, unique valid route slug,
  stack labels, valid palette and display identity, registered tile presentation,
  case-study narrative, and a published case-study destination. Use the established
  problem/build/result narrative structure. Validate nonblank story headings and bodies.
- **Artwork and screenshots:** new featured-project preparation
  includes at least one reviewable case-study image or labeled draft plate with a
  source, meaningful alternative text, and caption. Resolve local assets during the
  build. Preserve the existing convention that labeled draft copy and draft plates
  do not automatically block publication; owner visual review remains separate.
- **External destinations:** repository and live-demo links remain optional under
  the established schema. When present, require valid absolute HTTPS URLs and render
  the corresponding controls; omit absent controls. A missing remote is not a content
  failure. Do not make external service availability a prerequisite for a successful
  content build.
- **Motion and access:** reuse the shared static, ambient, and crescendo behavior.
  At most one tile crescendos at a time; off-screen motion pauses. Every registered
  tile must remain legible and navigable with reduced motion, keyboard, and touch.
  Registration must not couple this feature to a redesign of the shared motion system.
- **Enrichment:** preserve build-time optional GitHub statistics and curated-content
  fallback. Validation rejects local content/configuration errors, while an external
  statistics failure still degrades gracefully under ADR 0004.
- **Validation and build enforcement:** check the production selection and publication
  relationships on the real build path. Reject duplicate catalogue slugs, duplicate
  selections, unknown references, malformed required content, invalid URLs, unresolved
  assets, missing renderer registrations, and selected projects lacking a published
  destination. Errors name the offending slug and relevant field or relationship.
  Do not silently omit entries or substitute unrelated artwork.
- **Reusable workflow:** document separate checklists for preparing a new project,
  featuring an existing one, removing, replacing, and reordering. Include an authored
  content outline, artwork-registration checklist, publication requirements, and
  browser/build evidence to collect for review.

## Testing Decisions

Use the existing rendered homepage and published case-study routes as the primary
public boundary. Exercise selection changes through controlled fixture configurations,
then verify visible order, count, artwork, navigation, and retained pages. Add focused
catalogue/registration validation tests for deterministic invalid-content behavior.
These boundaries extend the existing browser coverage and were included in the
approved ticket breakdown.

- **Prior art:** existing wall and tile browser tests, case-study route/content tests,
  shared motion coverage, responsive accessibility checks, rail selection validation,
  enrichment fallback tests, sitemap tests, and social metadata/image tests.
- **Prefactoring regression:** verify the four real projects retain their current
  artwork, destinations, typography, order, and static/ambient/crescendo behavior.
- **Rotation scenarios:** exercise add, remove, replace, and reorder through fixtures.
  Check the exact visible project sequence, derived numbering and count, absence of
  duplicate/empty cards, and correct case-study navigation after each configuration.
- **Publication independence:** build a fixture, remove a featured slug without
  unpublishing it, rebuild, and visit its old URL directly. Verify its successful
  response, narrative, themed artwork, metadata, social image, and sitemap inclusion.
  This catches static-generation failures that a content-function assertion cannot.
- **Unknown destinations:** check that unknown/unpublished case-study URLs remain
  unavailable, and invalid selected references fail configuration validation.
- **Selection sizes:** inspect zero, one, two, three, four, and five-card fixture
  configurations at representative phone, tablet, and desktop widths. Check grid
  geometry, reading order, empty-state anchor, overflow, and the final odd card.
- **Accessibility and motion:** verify keyboard focus order follows selection order,
  focus remains visible, Enter activates the correct link, touch retains existing
  interaction, one crescendo is active at a time, and off-screen motion pauses.
  Verify deliberate static artwork and functional navigation under reduced motion.
- **Readiness failures:** test missing content, unknown/duplicate slugs, invalid
  links, unresolved artwork assets, missing registration, and unpublished featured
  destinations. Demonstrate actual build failure with a named error, not only a
  passing isolated validator test.
- **Valid edge cases:** accept unfeatured published projects, clearly labeled draft
  copy/plates, projects without repository or demo links, and unavailable enrichment.
  Use local stand-ins rather than live network services for deterministic checks.
- **New-project extension:** use a synthetic project with a distinct registered
  presentation to prove onboarding without adding another dispatch branch to shared
  wall/case-study shells. Do not feature an actual new project as a test side effect.
- **Visual proof:** inspect changed layouts and newly authored artwork in a real
  browser. Automated DOM and CSS checks support this review but do not replace it.
- **Implementation cadence:** use meaningful red-green-refactor slices and the
  required repository checks. Record evidence and mark only verified criteria complete.

## Out of Scope

- Adding Birdsview or another real project to the featured production selection now.
- Designing Birdsview's tile or case study as part of the maintenance infrastructure.
- Building a project-management CMS, runtime editing UI, or plugin framework.
- Automatically promoting Now Building or Next Experiment into featured membership.
- Automatically moving removed projects into the more-projects rail.
- Deleting published case studies, renaming public slugs, redirects, or taking pages offline.
- Replacing bespoke chameleon tiles with a generic card template.
- Changing the established Chrome palette, motion policy, or shared tile design direction.
- Runtime GitHub dependence or changes to the existing optional statistics policy.
- Deploying changes or implementing these tickets during specification.

## Further Notes

Implementation slices are published locally in the [approved ticket index](../issues/featured-project-update/README.md), with one Markdown file per ticket and explicit dependency links. All implementation criteria remain unchecked.

This spec is a reusable maintenance capability, not a request to rotate the live
selection immediately. The current four-project lineup remains the initial production
configuration. The approved breakdown includes the documented defaults for zero-selection
behavior and minimum image readiness.

The primary decisions follow [chameleon-tile identity](adr/0002-chameleon-tile-showcase.md),
[Chrome identity](adr/0003-ink-black-chrome-electric-lime.md),
[curated content and optional enrichment](adr/0004-curated-content-plus-build-time-github-enrichment.md),
and [motion behavior](adr/0006-motion-ambient-plus-hover-crescendo.md).
Use [the glossary](GLOSSARY.md) for vocabulary and the existing
[content schema](content-schema.md) as the starting authoring contract.

The historical v1 choice of four featured projects describes the initial lineup.
Implementation should update fixed-lineup explanatory documentation to describe the
new maintenance capability without rewriting the historical decision record.

[Current Transmission](current-transmission-spec.md) is an independent feature and
is not a prerequisite for this work. Rotating the wall does not edit the ledger, blog,
or more-projects rail.

### Reusable Project Update Checklist

- [ ] Identify the operation: add, remove, replace, or reorder.
- [ ] Ground any new or changed copy in the source project's documentation.
- [ ] Supply the authored content, theme, screenshots or labeled draft plates, and optional external links.
- [ ] Supply/register bespoke tile artwork and appropriate case-study artwork for a new identity.
- [ ] Publish the incoming case-study destination before selecting it for the wall.
- [ ] Edit featured selection order while retaining outgoing published content and registrations.
- [ ] Verify exact visible membership, count, numbering, and destinations after rebuilding.
- [ ] Verify outgoing published URLs, metadata, social images, and sitemap entries remain available.
- [ ] Inspect changed layouts and interactions at phone, tablet, and desktop sizes.
- [ ] Verify keyboard, touch, reduced motion, and enrichment fallback behavior.
- [ ] Record required-check results and owner visual/copy review where applicable.

### Implementation Acceptance Checklist

- [ ] The original four projects render through explicit registrations with their existing identities preserved.
- [ ] An ordered featured selection supports add, remove, replace, and reorder operations.
- [ ] Wall membership, indices, count, and reading order derive from that selection.
- [ ] Zero, one, odd, and expanded selections have intentional responsive layouts without overflow.
- [ ] Featured projects always link to published case studies.
- [ ] Unfeaturing does not remove published routes, metadata, social images, or sitemap entries.
- [ ] New-project readiness and artwork requirements are documented and validated.
- [ ] Invalid local content, references, and registrations fail the real build with actionable errors.
- [ ] Optional remote links, labeled draft material, and enrichment failures retain their valid behavior.
- [ ] Selection changes preserve keyboard/touch access, reduced-motion art, and shared motion behavior.
- [ ] A distinct synthetic new project verifies the extension path without changing the production lineup.
- [ ] A reusable authoring guide, registration checklist, and operation-specific verification workflow are delivered.
- [ ] Required repository checks and relevant visual review evidence are recorded.
