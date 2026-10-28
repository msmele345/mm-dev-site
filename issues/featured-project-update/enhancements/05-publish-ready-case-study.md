# 05: Publish a ready case study

**What to build:** Add `npm run project -- publish <slug>`. It adds the slug to the
`published` list in `selection.json` only when every publication gate is open: content
ready, presentation registered, and presentation finished. The Project wall and other
editorial surfaces stay unchanged.

**Blocked by:** [03](03-collect-readiness-and-check-command.md). Can proceed alongside 04,
using an isolated app with a hand-authored project.

**Status:** complete

- [x] A failing public-command test is written before the publish behavior.
- [x] `--dry-run` reports the proposed `published` change and leaves the checkout hash unchanged.
- [x] Publication refuses projects with incomplete content, unresolved or mis-cased assets, a missing presentation, an `onboarding:unfinished` marker, or stale generated registration.
- [x] A refusal lists every blocking finding from the shared readiness collection and leaves the checkout unchanged.
- [x] A successful publication appends the slug once to `published` and changes nothing else in `selection.json`.
- [x] Repeating publication reports that the project is already published and makes no changes.
- [x] `featured`, Current Transmission, and the more-projects rail are unchanged.
- [x] `draft: true` and labeled draft plates do not block publication.
- [x] After a successful publish, `check` reports stage "published" and the build's readiness passes.
- [x] Rendered publication behavior (route, metadata, social image, sitemap) relies on the existing published-case-study specs, which drive `selection.json` since ticket 01; this ticket adds no extra rebuild test.
- [x] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [x] Completed acceptance criteria and actual verification evidence are recorded in this ticket.

## Verification evidence

- TDD red. Before implementation, the new public-command test expected success but
  exited 1 with the old usage message, which did not accept `publish`.
- TDD green. The command file passed all 36 tests after implementation. Independent
  focused verification of command and shared readiness passed all 73 tests with
  `npx playwright test tests/unit/project-command.spec.ts tests/unit/project-readiness.spec.ts --config=/tmp/featured-05-publish-playwright.config.cjs --workers=1`.
  The temporary config omits app servers because these tests invoke the real command
  in isolated filesystem fixtures.
- Fixtures verify each closed publication gate independently, aggregated refusal
  findings, whole-checkout hashes for refusals/dry runs/repeats, preserved selection
  properties and editorial data, and successful publication of draft copy/plates.
- After public-command publication, `check` reports `Stage: published` and the
  build's `validateShowcaseContent` guard accepts the resulting fixture. Existing
  published-case-study specs remain the rendered route/metadata/social-image/sitemap
  coverage; this ticket adds no rebuild test.
- `npm run lint` and `npm run typecheck` passed.
- Independent standards and spec reviews reported no actionable findings.
- `npm test -- --workers=2` passed all 456 tests, including the existing published
  case-study rebuild and rendered-destination specs. The sandbox initially prevented
  the fixture server binding; the successful run used permission for local servers.
- `npm run build` passed using the production Turbopack build. `git diff --check`
  passed. Production selection data and all editorial surfaces are unchanged.
