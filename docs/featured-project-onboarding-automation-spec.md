# Featured Project Onboarding Automation

Status: ready for implementation; local ticket breakdown revised 2026-10-23
Distribution: local Markdown
Scope: automating the repeatable parts of adding a net-new project

## Revision note

The first draft automated onboarding by patching hand-written TypeScript in place
(`catalog.ts` arrays and imports, `registry.ts` imports and entries) and appending to
`globals.css`. Making those edits safe required unambiguous text anchors, preflight,
result validation, multi-file atomic replacement, and failure injection at every write.

This revision removes the hand-edited edit points instead of guarding them:

- The published and featured selections move to one JSON data file.
- Each project's content and presentation move to per-project locations that the
  command creates as new files.
- The authored catalogue and presentation registration are generated barrels that are
  rebuilt deterministically from those locations and checked for drift by the build.
- Each identity owns its stylesheet; nothing appends to `globals.css`.

The five onboarding operations and the review boundary are unchanged. Two enabling
refactors precede them, and the readiness rules are refactored to report every finding.

## Problem Statement

Adding a net-new project requires the owner to coordinate a curated content file,
local imagery, a bespoke chameleon tile, case-study artwork, presentation registration,
publication, Project wall placement, verification, and review evidence. The existing
guide explains the sequence, and the Signal Loom fixture proves that the sequence
works, but a maintainer still performs the mechanical setup and wiring by hand.

Manual onboarding creates three recurring risks. A maintainer can miss one editing
surface, can publish placeholder material before it is ready, or can repeat a partial
operation and leave duplicate or conflicting entries. The build catches many invalid
states, but it reports only the first blocking error, after the maintainer has already
made the edits. Evidence collection also requires several separate commands and manual
notes.

The editing surfaces themselves make automation fragile. Registration and catalogue
membership are expressed as hand-written import lines and array entries spread across
shared source files, and identity styles live in one 2,000-line shared stylesheet.
Any tool that edits those files must locate text anchors that a human can reformat.

The owner needs a guided local workflow that performs safe, repeatable edits and
reports progress through the established project lifecycle. Automation must preserve
the site's defining constraint: every featured project keeps bespoke art direction,
source-grounded copy, and explicit owner review.

## Solution

First, reshape the editing surfaces so that every onboarding write is either a new
file, a regenerated file the tool wholly owns, or a JSON data edit:

- **Selection data** — the published case-study list and the ordered featured selection
  live in `src/content/projects/selection.json`. `catalog.ts` imports it and keeps its
  current public functions.
- **Authored content** — each curated content file lives at
  `src/content/projects/authored/<slug>.ts`.
- **Presentation identity** — each project's tile, case-study artwork, and stylesheet
  live in `src/components/showcase/identities/<slug>/` (`Tile.tsx`, `Artwork.tsx`,
  `identity.css`).
- **Generated registration** — `src/content/projects/authored.generated.ts` and
  `src/components/showcase/identities.generated.ts` are produced from those locations
  by one deterministic generator. They are checked in and reviewable, so registration
  stays explicit; nobody edits them by hand.

Then add a local project-onboarding command with separate operations for creating an
unpublished project, checking its readiness, publishing its case study, featuring it
on the Project wall, verifying the finished result, and regenerating registration.
Each operation reads the current repository state, applies only the required change,
and is safe to run again.

The create operation writes new authoring files and regenerates registration. It does
not publish or feature the project. The check operation reports the project's lifecycle
stage and every publication gate with all known local problems. The publish and feature
operations edit the selection data and enforce the transitions between stages. The
verify operation exercises the real public boundaries and collects review evidence.

The workflow automates structure, validation, and evidence collection. It does not
approve factual claims, create final art direction, decide typography, judge meaningful
alternative text, or replace owner copy and artwork review.

## Lifecycle Model

A project moves through three ordered stages:

1. **Authored** — a curated content file exists with a unique valid slug.
2. **Published** — its slug is in the published selection; `/work/<slug>` exists.
3. **Featured** — its slug is in the featured selection at a chosen position.

Publication is guarded by independent gates, any combination of which can be open or
closed for an authored project:

- **Content ready** — the curated content passes every readiness rule, including
  resolvable, correctly cased local images.
- **Presentation registered** — the identity directory holds both a tile and a
  case-study artwork, and the generated registration is current.
- **Presentation finished** — no identity file still carries the generated
  `onboarding:unfinished` marker.

Featuring is guarded by publication. A project can be published without being featured.

## User Stories

1. As the owner, I want one command to prepare a new project, so that I do not repeat the same file and directory setup by hand.
2. As the owner, I want preparation to leave the project unpublished, so that generated placeholders cannot create a public case study.
3. As the owner, I want preparation to leave the Project wall unchanged, so that creating work in progress does not promote it.
4. As the owner, I want a dry run, so that I can inspect every planned edit before the command writes files.
5. As the owner, I want repeated runs to converge on the same result, so that retries do not create duplicate records or registrations.
6. As the owner, I want conflicts to stop without overwriting my work, so that a generator cannot destroy authored content or artwork.
7. As the owner, I want a valid lowercase kebab-case slug checked before any write, so that the project starts with a stable route identity.
8. As the owner, I want the generated content outline to match the current curated content contract, so that I start from the site's real requirements.
9. As the owner, I want a local project image directory prepared, so that screenshots and labeled draft plates have an expected home.
10. As the owner, I want tile and case-study artwork starting points, so that both required presentation pieces are visible in the workflow.
11. As the owner, I want generated artwork starting points marked unfinished in a way the build enforces, so that a template cannot be published as approved design.
12. As the owner, I want generated copy fields left empty, so that placeholder text cannot pass readiness and reach a public page.
13. As the owner, I want source repository paths and revisions recorded in review notes, so that future copy review can trace each claim.
14. As the owner, I want one readiness report, so that I can see every remaining local problem before I attempt publication.
15. As the owner, I want the readiness report to show the lifecycle stage and each publication gate separately, so that I know exactly what blocks the next step.
16. As the owner, I want the readiness report to name the affected field, file, or relationship, so that I can fix the source instead of tracing a generic failure.
17. As the owner, I want unpublished work to remain incomplete without breaking ordinary development, so that I can prepare a project over several sessions.
18. As the owner, I want publication to require complete local content and a registered, finished presentation, so that every public case study has its own identity.
19. As the owner, I want publication to remain separate from featuring, so that a case study can exist without a homepage tile.
20. As the owner, I want the publish operation to preserve the Project wall, Current Transmission, and the more-projects rail, so that one editorial decision does not change another.
21. As the owner, I want the feature operation to require a published destination, so that every featured tile opens a working case study.
22. As the owner, I want to choose the featured position explicitly, so that Project wall order communicates my intended emphasis.
23. As the owner, I want the feature operation to report the resulting membership and order, so that I can confirm the change before browser review.
24. As the owner, I want to edit the published and featured selections by hand in one small data file when I prefer, so that the command is a convenience rather than a requirement.
25. As the owner, I want verification to visit the homepage and case study through the real application, so that private helper success does not stand in for public behavior.
26. As the owner, I want verification to check canonical metadata, the social image, and sitemap membership, so that publication includes every public destination.
27. As the owner, I want verification to check keyboard, touch, reduced motion, and responsive layouts, so that a new identity keeps the established interaction contract.
28. As the owner, I want screenshots at representative phone, tablet, and desktop widths, so that I can review the actual composition.
29. As the owner, I want one evidence report with commands, results, changed paths, and captures, so that a future reviewer can audit the onboarding run.
30. As the owner, I want owner copy and artwork approval left unchecked until I complete them, so that automated success does not claim subjective approval.
31. As a maintainer, I want the commands and the development and production builds to use one set of readiness rules, so that two definitions of a valid project cannot drift apart.
32. As a maintainer, I want the build to report every readiness finding at once, so that fixing a broken checkout takes one pass.
33. As a maintainer, I want the build to fail when generated registration is stale, so that a hand-added or deleted identity directory cannot silently diverge from what renders.
34. As a maintainer, I want failed commands to leave the checkout unchanged, so that recovery does not require manual repository repair.
35. As a maintainer, I want unavailable GitHub enrichment and absent repository or demo links to remain valid, so that remote services do not control onboarding.
36. As a maintainer, I want clearly labeled draft copy and draft plates to remain valid, so that the existing editorial review convention survives automation.
37. As a maintainer, I want the four existing identities migrated without visible change, so that the restructuring is invisible to visitors.
38. As a visitor, I want every new featured tile to retain a bespoke visual identity, so that the Project wall does not become a generic card grid.
39. As a visitor, I want the new tile and its case study to describe the same project, so that homepage identity and destination identity agree.

## Implementation Decisions

### Editing surfaces

- Move `CASE_STUDY_SLUGS` and `WALL_SLUGS` into `src/content/projects/selection.json` as
  `{ "published": [...], "featured": [...] }`. `catalog.ts` imports it and keeps
  `listCaseStudySlugs`, `listWallProjects`, and the other public functions unchanged.
  No consumer depends on the literal-union `as const` types.
- Move each curated content file to `src/content/projects/authored/<slug>.ts`. These
  files keep type-only imports so Node can load them without a TypeScript runner.
- Move each identity to `src/components/showcase/identities/<slug>/` with a default-export
  `Tile.tsx`, a default-export `Artwork.tsx`, and a namespaced plain `identity.css`
  imported by those components. Split the shared `artwork.tsx` and the identity
  sections of `globals.css` accordingly. Shared Chrome, wall, and motion styles stay in
  `globals.css`. Class names do not change.
- One generator produces `authored.generated.ts` and `identities.generated.ts` from the
  directory listings, sorted by slug, with a "generated; do not edit" header. Its
  output is a pure function of the directory listing, so regeneration is byte-identical
  when nothing changed.
- Names derive from the slug. An authored file `authored/<slug>.ts` exports its record
  under the camelCase of the slug (`elevated-bpm` → `elevatedBpm`), matching the current
  files. Identity components are default exports. The authored filename and the
  identity directory name must equal the record's `slug`.
- `registry.ts` builds the showcase registry from the generated entries. The existing
  missing-component and duplicate checks remain. No project-specific branches are added
  to `ProjectWall.tsx` or `CaseStudy.tsx`.
- Record the move from hand-written registration to generated registration in a new ADR.

### Readiness

- Refactor `readiness.ts` to collect findings rather than throw on the first problem.
  `collectShowcaseFindings` returns structured findings (slug, subject, message).
  `validateShowcaseContent` remains the build entry point and throws one error listing
  every finding.
- Move featured-selection checks (duplicate, unknown, unpublished) into the same finding
  collection. `listWallProjects` may keep its guards as defensive assertions.
- Extend the readiness input with filesystem facts supplied by the caller, in the same
  style as `assetExists`: which identity directories hold both components, whether any
  identity file carries the `onboarding:unfinished` marker, and whether the generated
  registration files match the generator's expected output.
- A published project with an unregistered presentation, an unfinished presentation,
  or stale generated registration fails readiness. The build reports this from
  `next.config.ts` instead of at render time.
- An authored file or identity directory whose name differs from the record's `slug` is
  a finding.
- `next.config.ts` imports the catalogue, and through it the authored barrel, before
  readiness runs. A barrel that still imports a deleted authored file therefore fails
  module loading with the missing path, which is acceptable and actionable. Stale
  registration for added files and for identities is reported as a readiness finding.
- Export the route-slug pattern from `readiness.ts` so `create` validates slugs with the
  same rule.
- Keep local content checks independent of GitHub, a token, repository availability, or
  live-demo availability.
- Keep `draft: true` and clearly labeled draft plates publishable under the existing
  editorial convention.

### Command

- Provide one repository-owned script exposed as `npm run project -- <operation>` with
  `create`, `check`, `publish`, `feature`, `verify`, and `sync` operations.
- Run on Node's native type stripping with the existing dependency set. The script
  imports only modules that load natively — `readiness.ts`, the generator, authored
  content files, and `selection.json` — and never imports `catalog.ts` or React
  components.
- The package script's entry point is a plain `.mjs` file that checks the Node version
  and exits with an actionable message when native type stripping is unavailable, then
  dynamically imports the TypeScript implementation.
- The implementation uses only erasable TypeScript (no enums, namespaces, or parameter
  properties) and explicit `.ts` extensions on its own relative imports. Typecheck
  accommodates this through `allowImportingTsExtensions` or a scoped exclusion, decided
  in the ticket that introduces the script.
- `create <slug> --title <title> [--source <path>]` writes the authored content file,
  the identity directory, the public image directory, and review notes, then
  regenerates registration. It never edits `selection.json`.
- `check <slug>` prints the lifecycle stage, each publication gate, and every finding.
  It writes nothing.
- `publish <slug>` adds the slug to `published` only when every publication gate is
  open. `feature <slug> --position <n>` inserts the slug into `featured` only when the
  project is published, and reports the resulting order.
- `sync` regenerates registration. `create` calls the same generator.
- `verify <slug>` runs a parameterized Playwright suite against the real application and
  writes an evidence report.
- Every write operation accepts `--dry-run`, which prints the planned new files and
  the selection or registration diff and writes nothing.
- Every write operation is idempotent. A repeated request reports that the requested
  state already exists and changes nothing. It never adds duplicate entries.

### Write safety

- Every write is one of: create a file that does not exist, replace a wholly generated
  file with deterministic output, or read-validate-write `selection.json`. No operation
  patches hand-written source.
- Preflight the complete operation before the first write. Invalid input, an existing
  file with different content, or a failing gate stops the operation with no changes.
- Multi-file writes are not claimed to be atomic. The contract is preflight-then-write:
  every precondition and the final readiness result are computed in memory before any
  file is written. Write JSON and generated files last.

### Generated starting points

- The content outline prefills only `slug`, `title`, `draft: true`, the three story
  kinds in order, and empty `links`. Every owner-authored field (pitch, motif, display
  face, palette, story headings and bodies, stack, screenshots) is left blank or empty
  so readiness reports it until the owner writes it.
- Tile and artwork starters derive their structure from the Signal Loom fixture: one
  accessible link, shared `TileMeta`, the shared motion contract, deliberate static art,
  and decorative art hidden from assistive technology. They render a visible
  "UNFINISHED" label and carry the `onboarding:unfinished` marker. The owner removes the
  marker when the art direction is real.
- The public image directory contains a placeholder that keeps it under version control
  and is not a screenshot.
- Review notes record the source repository path and revision when `--source` is given.
  The command imports no copy from the source.

### Boundaries

- Keep Current Transmission and the more-projects rail outside all onboarding changes.
- Treat verification output as agent evidence. It never marks owner copy review, artwork
  approval, physical-device review, or deployment approval complete.
- Keep the command small and repository-specific. Do not create a general plugin
  framework, content management system, or reusable code generator platform.

## Testing Decisions

- Test the command through its public command-line interface. Assert exit status,
  human-readable output, and resulting repository state rather than private helper calls.
- Run write-operation tests in isolated copies of the production-shaped application.
  Never rewrite the curated production catalogue to exercise onboarding cases.
- Verify dry runs and failed operations by comparing a content hash of the checkout
  before and after the command.
- Verify idempotency by running each successful operation twice and confirming that the
  second run makes no changes.
- Cover invalid slugs, file collisions, differing existing content, closed gates,
  invalid positions, and stale registration.
- Test the readiness refactor with the existing unit suite plus collect-all cases: one
  run reports every finding, and fixing one finding removes only that finding.
- Prove the two enabling refactors by keeping the existing rendered tests passing and
  comparing homepage and case-study captures before and after at 390, 768, and 1440px.
- Test `publish` and `feature` at the command and readiness boundary. Rendering from the
  selection data is already covered by the rotation and published-case-study specs once
  their helpers write `selection.json`. One end-to-end chain test covers the full
  rebuild path.
- The end-to-end chain test runs create, author the Signal Loom content and art over the
  starters, check, publish, feature, and verify in one isolated app.
- Reuse the existing synthetic identity, selection-rotation fixtures, published-case-study
  fixtures, readiness tests, and browser evidence conventions as prior art.
- Keep identity-specific visual quality and factual editorial approval as manual review
  items. Automated tests may confirm that declared elements render, but they cannot
  approve the design or claims.

## Out of Scope

- Adding Birdsview or another real project to the production catalogue, publication
  list, or Project wall.
- Generating final project copy from source documents without owner review.
- Generating or approving final chameleon-tile art direction.
- Replacing bespoke chameleon tiles with a generic project template.
- Automatically publishing or featuring a project during creation.
- Automatically changing Current Transmission or the more-projects rail.
- Requiring a GitHub remote, live demo, working enrichment, or external network access
  for local readiness.
- Building a browser-based editor, content management system, runtime administration
  page, or general plugin system.
- Unpublishing, removing, or renaming projects through the command. The guide's manual
  removal and replacement flows remain, now as edits to `selection.json`.
- Deploying the site, opening a pull request, or changing the production featured
  selection.
- Treating automated screenshots as owner visual approval or physical-device evidence.

## Further Notes

The existing Signal Loom fixture is executable proof of the onboarding steps and the
structural template for generated starters. Its text anchors into `catalog.ts`,
`registry.ts`, and `globals.css` are retired by the enabling refactors and must not
become the write contract for the command.

Node 22.22 loads `readiness.ts` and the curated content files natively, but not
`catalog.ts` (extensionless value imports) or `registry.ts` (React components). That
is why the command reads the selection JSON and authored files directly and checks
registration through filesystem facts rather than importing those modules.

The implementation tickets are in the
[onboarding automation enhancement index](../issues/featured-project-update/enhancements/README.md).
