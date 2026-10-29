# 06: Feature a published project at an explicit position

**What to build:** Add `npm run project -- feature <slug> --position <n>`. It inserts an
already published project into the ordered `featured` list in `selection.json` at an
explicit one-based position and reports the resulting Project wall order.

**Blocked by:** [05](05-publish-ready-case-study.md).

**Status:** complete

- [x] A failing public-command test is written before the feature behavior.
- [x] `--dry-run` reports the current and proposed order and leaves the checkout hash unchanged.
- [x] The command refuses a project that is not published and names the publication relationship.
- [x] The command rejects positions outside the resulting selection with the valid range stated.
- [x] A successful run inserts the slug once and prints the exact resulting membership and order.
- [x] Repeating the same request reports that the project already occupies that position and makes no changes.
- [x] A request for an already featured project at a different position stops and states the current position; the command does not move entries.
- [x] `published`, Current Transmission, and the more-projects rail are unchanged.
- [x] After a successful run, `check` reports stage "featured" and the build's readiness passes.
- [x] Rendered wall behavior (order, indices, count, destination, keyboard order, motion contract) relies on the existing rotation and featured-selection specs; this ticket adds no extra rebuild test.
- [x] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [x] Completed acceptance criteria and actual verification evidence are recorded in this ticket.

## Verification evidence

- TDD red. Before production changes, the first public-command test expected exit 0
  but received exit 1 and the existing usage message, which did not accept `feature`.
  Actual output is in `/tmp/featured-06-red.log`. Insertion, dry-run, argument/range,
  and retry behavior were added in red/green slices.
- Focused command coverage passed all 47 tests, including 11 new feature tests, with
  `npx playwright test --config /tmp/featured-06-playwright.config.mjs`.
  The temporary config uses the repository's real Playwright installation and runs
  `tests/unit/project-command.spec.ts` without app servers. Actual output is in
  `/tmp/featured-06-focused-worker.log`.
- Public-command fixtures cover empty/front/middle/end insertion, exact reported order,
  dry runs in either option order, strict arguments, valid-range diagnostics including
  zero and negative positions, same-position no-ops, and move refusals naming the
  current position. Whole-checkout hashes stay unchanged for previews, refusals,
  and repeats. Restoring only `selection.json` after a successful insertion restores
  the original checkout hash, proving no other fixture files changed. Extra selection
  properties and the unchanged `published` list are preserved.
- Prospective readiness uses the existing collector. Fixtures verify the publication
  relationship, aggregated content/presentation/registration blockers, unrelated
  invalid published work, and malformed or duplicate selections, including duplicate
  same-position requests. Incomplete unpublished work remains allowed.
- After insertion, the real `check` command reports `Stage: featured`, and the build's
  `validateShowcaseContent` guard accepts the resulting fixture. Existing rotation and
  featured-selection specs supply rendered order, indices, count, destinations,
  keyboard, responsive, and motion coverage. This ticket adds no extra rebuild test.
- Independent standards and spec reviews reported no findings in the code and tests.
  The scoped comment audit found no added comments or suppressions.
- `npm run lint` and `npm run typecheck` passed. `npm test -- --workers=2` passed all
  467 tests, including rendered rotation and retained case-study destinations. The
  successful run used permission for local test servers after sandbox binding failed.
  Actual suite output is in `/tmp/featured-06-suite.log`.
- `npm run build` passed with the production Turbopack build, retaining all four
  case-study and social-image routes. The successful build used permission to fetch
  existing Google Fonts after the sandbox blocked font access. Actual output is in
  `/tmp/featured-06-build.log`. `git diff --check` passed.
- A real-checkout `npm run project -- feature telescope --position 3 --dry-run`
  reported the existing position and exact current wall order without changes.
  Production selection data, Current Transmission, and the more-projects rail remain
  unchanged. The project update guide now documents preview, insertion, and the
  existing manual reorder flow. No commits, push, PR, or deployment were performed.
