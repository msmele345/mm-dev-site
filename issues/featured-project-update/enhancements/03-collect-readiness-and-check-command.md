# 03: Collect every readiness finding and report it with a check command

**What to build:** Refactor readiness to collect every finding instead of stopping at
the first, extend it to registration, unfinished presentation, and stale generated
registration, and use it in both the build and a new read-only
`npm run project -- check <slug>` command. The report shows the project's lifecycle
stage (authored, published, featured) and each publication gate (content ready,
presentation registered, presentation finished).

**Blocked by:** [01](01-selection-data-file.md), [02](02-identity-directories-and-generated-registration.md).

**Status:** ready-for-agent

- [ ] A failing unit test is written first for collecting multiple findings from one catalogue.
- [ ] `collectShowcaseFindings` returns structured findings (slug, subject, message); `validateShowcaseContent` throws one error listing every finding; existing readiness unit tests still pass.
- [ ] Featured-selection rules (duplicate, unknown, unpublished) are part of the same finding collection.
- [ ] The readiness input gains caller-supplied filesystem facts alongside `assetExists`: complete identity directories, the `onboarding:unfinished` marker, and whether generated registration matches the generator's output.
- [ ] A published project that is unregistered, still marked unfinished, or backed by stale generated registration fails the build from `next.config.ts` with the slug and cause named. A barrel still importing a deleted authored file may fail earlier at module load with the missing path.
- [ ] An authored file or identity directory whose name differs from the record's `slug` is reported as a finding.
- [ ] The route-slug pattern is exported from `readiness.ts` for reuse.
- [ ] A failing public-command test is written before the check command.
- [ ] `npm run project -- check <slug>` runs on Node's native type stripping with no new dependency and never imports `catalog.ts` or React components.
- [ ] The package script enters through a plain `.mjs` file that prints an actionable message on a Node version without native type stripping, then dynamically imports the erasable-only TypeScript implementation.
- [ ] Lint and typecheck cover the script, with `allowImportingTsExtensions` or a scoped exclusion chosen and recorded.
- [ ] The report shows the lifecycle stage and each gate separately, and lists every finding with the affected field, file, asset, or relationship.
- [ ] Incomplete unpublished work is reported as not ready without failing development or build commands.
- [ ] `draft: true`, labeled draft plates, missing optional links, and unavailable enrichment are reported as valid.
- [ ] Unknown projects and invalid slugs return a nonzero status with actionable output.
- [ ] Running the check never changes files, proven by a checkout hash before and after.
- [ ] Tests cover representative projects at every stage and gate combination, and prove that fixing one finding removes only that finding.
- [ ] `docs/content-schema.md` describes the stage and gate model and the aggregated build error.
- [ ] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [ ] Completed acceptance criteria and actual verification evidence are recorded in this ticket.
