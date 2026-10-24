# 05: Publish a ready case study

**What to build:** Add `npm run project -- publish <slug>`. It adds the slug to the
`published` list in `selection.json` only when every publication gate is open: content
ready, presentation registered, and presentation finished. The Project wall and other
editorial surfaces stay unchanged.

**Blocked by:** [03](03-collect-readiness-and-check-command.md). Can proceed alongside 04,
using an isolated app with a hand-authored project.

**Status:** ready-for-agent

- [ ] A failing public-command test is written before the publish behavior.
- [ ] `--dry-run` reports the proposed `published` change and leaves the checkout hash unchanged.
- [ ] Publication refuses projects with incomplete content, unresolved or mis-cased assets, a missing presentation, an `onboarding:unfinished` marker, or stale generated registration.
- [ ] A refusal lists every blocking finding from the shared readiness collection and leaves the checkout unchanged.
- [ ] A successful publication appends the slug once to `published` and changes nothing else in `selection.json`.
- [ ] Repeating publication reports that the project is already published and makes no changes.
- [ ] `featured`, Current Transmission, and the more-projects rail are unchanged.
- [ ] `draft: true` and labeled draft plates do not block publication.
- [ ] After a successful publish, `check` reports stage "published" and the build's readiness passes.
- [ ] Rendered publication behavior (route, metadata, social image, sitemap) relies on the existing published-case-study specs, which drive `selection.json` since ticket 01; this ticket adds no extra rebuild test.
- [ ] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [ ] Completed acceptance criteria and actual verification evidence are recorded in this ticket.
