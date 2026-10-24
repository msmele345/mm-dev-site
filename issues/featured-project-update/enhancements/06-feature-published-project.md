# 06: Feature a published project at an explicit position

**What to build:** Add `npm run project -- feature <slug> --position <n>`. It inserts an
already published project into the ordered `featured` list in `selection.json` at an
explicit one-based position and reports the resulting Project wall order.

**Blocked by:** [05](05-publish-ready-case-study.md).

**Status:** ready-for-agent

- [ ] A failing public-command test is written before the feature behavior.
- [ ] `--dry-run` reports the current and proposed order and leaves the checkout hash unchanged.
- [ ] The command refuses a project that is not published and names the publication relationship.
- [ ] The command rejects positions outside the resulting selection with the valid range stated.
- [ ] A successful run inserts the slug once and prints the exact resulting membership and order.
- [ ] Repeating the same request reports that the project already occupies that position and makes no changes.
- [ ] A request for an already featured project at a different position stops and states the current position; the command does not move entries.
- [ ] `published`, Current Transmission, and the more-projects rail are unchanged.
- [ ] After a successful run, `check` reports stage "featured" and the build's readiness passes.
- [ ] Rendered wall behavior (order, indices, count, destination, keyboard order, motion contract) relies on the existing rotation and featured-selection specs; this ticket adds no extra rebuild test.
- [ ] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [ ] Completed acceptance criteria and actual verification evidence are recorded in this ticket.
