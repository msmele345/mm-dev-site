# 03: Collect every readiness finding and report it with a check command

**What to build:** Refactor readiness to collect every finding instead of stopping at
the first, extend it to registration, unfinished presentation, and stale generated
registration, and use it in both the build and a new read-only
`npm run project -- check <slug>` command. The report shows the project's lifecycle
stage (authored, published, featured) and each publication gate (content ready,
presentation registered, presentation finished).

**Blocked by:** [01](01-selection-data-file.md), [02](02-identity-directories-and-generated-registration.md).

**Status:** complete — 2026-10-24

- [x] A failing unit test is written first for collecting multiple findings from one catalogue. *(Written before this session's handoff; red state not re-observed. Additions this session were red first — see evidence.)*
- [x] `collectShowcaseFindings` returns structured findings (slug, subject, message); `validateShowcaseContent` throws one error listing every finding; existing readiness unit tests still pass.
- [x] Featured-selection rules (duplicate, unknown, unpublished) are part of the same finding collection.
- [x] The readiness input gains caller-supplied filesystem facts alongside `assetExists`: complete identity directories, the `onboarding:unfinished` marker, and whether generated registration matches the generator's output.
- [x] A published project that is unregistered, still marked unfinished, or backed by stale generated registration fails the build from `next.config.ts` with the slug and cause named. A barrel still importing a deleted authored file may fail earlier at module load with the missing path.
- [x] An authored file or identity directory whose name differs from the record's `slug` is reported as a finding.
- [x] The route-slug pattern is exported from `readiness.ts` for reuse.
- [x] A failing public-command test is written before the check command. *(Same note as above.)*
- [x] `npm run project -- check <slug>` runs on Node's native type stripping with no new dependency and never imports `catalog.ts` or React components.
- [x] The package script enters through a plain `.mjs` file that prints an actionable message on a Node version without native type stripping, then dynamically imports the erasable-only TypeScript implementation.
- [x] Lint and typecheck cover the script, with `allowImportingTsExtensions` or a scoped exclusion chosen and recorded.
- [x] The report shows the lifecycle stage and each gate separately, and lists every finding with the affected field, file, asset, or relationship.
- [x] Incomplete unpublished work is reported as not ready without failing development or build commands.
- [x] `draft: true`, labeled draft plates, missing optional links, and unavailable enrichment are reported as valid.
- [x] Unknown projects and invalid slugs return a nonzero status with actionable output.
- [x] Running the check never changes files, proven by a checkout hash before and after.
- [x] Tests cover representative projects at every stage and gate combination, and prove that fixing one finding removes only that finding.
- [x] `docs/content-schema.md` describes the stage and gate model and the aggregated build error.
- [x] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [x] Completed acceptance criteria and actual verification evidence are recorded in this ticket.

## Implementation notes and evidence

- **Readiness** (`src/content/projects/readiness.ts`): `collectShowcaseFindings` returns
  `{ slug, subject, message, blocksBuild, gate }`; `validateShowcaseContent` throws one
  newline-joined error of every blocking finding. Featured duplicate/unknown/unpublished
  rules are in the same collection (a duplicate featured slug is reported once, not
  re-checked). `ROUTE_SLUG` is exported. Only findings for published projects, or
  catalogue-wide rules, block the build; unpublished work is reported but never blocks.
- **Filesystem facts** (`src/content/projects/filesystem-facts.ts`): asset existence
  (case-sensitive), authored filename ↔ record slug, identity directory completeness,
  `onboarding:unfinished` files, and whether both generated barrels equal the
  generator's output. `next.config.ts` (now a config function) and the check command
  derive facts through this one module. `listWallProjects()` is no longer called from
  config; its guards remain as defensive assertions.
- **Stale registration** is a checkout-wide fact, so it is reported once per published
  project. A barrel importing a deleted authored file still fails at module load.
- **Command:** `npm run project -- check <slug>` → `scripts/project.mjs` (version
  guard, then dynamic import) → `src/content/projects/project-command.ts` (erasable
  TypeScript, explicit `.ts` imports, no `catalog.ts`/React). It prints stage, the three
  gates, project findings, and `Catalogue findings:` for findings that belong to no
  record (orphan identity directory or authored file, unknown references). Exit 0 for
  any gate state; nonzero for invalid slug, unknown project, malformed `selection.json`,
  or a missing camelCase export.
- **Typecheck decision:** `allowImportingTsExtensions` (valid because `noEmit` is set),
  with `scripts/project.mjs` added to `include` and `// @ts-check`. ESLint already
  covers `scripts/`. Recorded in `docs/content-schema.md`.
- **Session additions (red → green):**
  - The real repo printed `MODULE_TYPELESS_PACKAGE_JSON` on every check (the fixture
    hid it with `"type": "module"`). The fixture now uses the repository's own
    `project` script without a module type and asserts no warning (red); the script
    gained `--disable-warning=MODULE_TYPELESS_PACKAGE_JSON` like `registration` (green).
  - Duplicate featured slug re-reported "no published destination" (red); now reported
    once (green).
  - An orphan identity directory (`signal-loon/`) was collected but never displayed
    (red); `Catalogue findings:` now shows it (green).
  - Characterization tests (passed on first run): featured stage with closed content and
    finished gates; featured-but-unpublished relationship; draft copy, draft plate, no
    links, and unreachable `GITHUB_API_BASE_URL` with no token report every gate open
    and no findings.
- **Docs:** `docs/content-schema.md` Readiness rewritten for stages, gates, aggregated
  build error, blocking rules, and the check command; `docs/project-update-guide.md`
  points to the command; ADR 0007's "stale barrels not yet detected" consequence updated.
- **Verification (2026-10-24):**
  - `tests/unit/project-command.spec.ts`: 13 passed; `tests/unit/project-readiness.spec.ts`:
    38 passed; `tests/new-project-readiness-build.spec.ts`: 19 passed (unfinished
    marker, stale barrel, and filename-mismatch build failures name slug and cause).
  - `npm test`: **432 passed** (1.3m) on the final tree. An earlier full run had one
    failure in `current-transmission-hit-area.spec.ts` (390px, locator timeout under
    load); it passed alone 5/5 and with `--repeat-each=3` 15/15, and the next full run
    was clean. A run before that failed only from a concurrent Playwright run wiping
    `test-results/` (ENOENT on `build.log`); that spec passed 8/8 on rerun.
  - `npm run lint`, `npm run typecheck`, `npm run build` (four `/work/*` routes and OG
    images prerendered), `git diff --check`: passed. `npm run registration`:
    `Registration is already current.`
  - Real repo: `npm run project -- check` on all four projects reports
    `Stage: featured` with every gate `yes`; unknown and invalid slugs exit 1.
    `git status --porcelain | shasum` identical before and after.
