# 01: Move the published and featured selections into a data file

**What to build:** Move `CASE_STUDY_SLUGS` and `WALL_SLUGS` out of `catalog.ts` into
`src/content/projects/selection.json` as `{ "published": [...], "featured": [...] }`.
The site renders identically, and later operations can change publication and
featuring with a read-validate-write of plain data instead of patching source.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] A failing test is written first that drives publication and featuring through `selection.json` in an isolated app.
- [ ] `catalog.ts` imports `selection.json`; `listCaseStudySlugs`, `listWallProjects`, and the other public catalogue functions keep their signatures and behavior.
- [ ] The production selection is unchanged: all four projects published and featured in the current order.
- [ ] Existing duplicate, unknown, and unpublished featured-slug errors still name the slug and relationship.
- [ ] `writeFeaturedSelection`, `writePublishedSelection`, and `addSyntheticIdentity`'s publish step in `tests/support/showcase-app.ts` write `selection.json` instead of using `catalog.ts` text anchors.
- [ ] The rotation, published-case-study, featured-selection, and new-project-readiness specs pass without behavioral changes.
- [ ] `docs/project-update-guide.md` and `docs/content-schema.md` name `selection.json` as the publication and featuring surface, carrying over the guidance in the removed source comments.
- [ ] Current Transmission and the more-projects rail are untouched.
- [ ] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [ ] Completed acceptance criteria and actual verification evidence are recorded in this ticket.
