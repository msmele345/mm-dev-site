# 01: Move the published and featured selections into a data file

**What to build:** Move `CASE_STUDY_SLUGS` and `WALL_SLUGS` out of `catalog.ts` into
`src/content/projects/selection.json` as `{ "published": [...], "featured": [...] }`.
The site renders identically, and later operations can change publication and
featuring with a read-validate-write of plain data instead of patching source.

**Blocked by:** None (can start immediately).

**Status:** complete — 2026-10-23

- [x] A failing test is written first that drives publication and featuring through `selection.json` in an isolated app.
- [x] `catalog.ts` imports `selection.json`; `listCaseStudySlugs`, `listWallProjects`, and the other public catalogue functions keep their signatures and behavior.
- [x] The production selection is unchanged: all four projects published and featured in the current order.
- [x] Existing duplicate, unknown, and unpublished featured-slug errors still name the slug and relationship.
- [x] `writeFeaturedSelection`, `writePublishedSelection`, and `addSyntheticIdentity`'s publish step in `tests/support/showcase-app.ts` write `selection.json` instead of using `catalog.ts` text anchors.
- [x] The rotation, published-case-study, featured-selection, and new-project-readiness specs pass without behavioral changes.
- [x] `docs/project-update-guide.md` and `docs/content-schema.md` name `selection.json` as the publication and featuring surface, carrying over the guidance in the removed source comments.
- [x] Current Transmission and the more-projects rail are untouched.
- [x] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [x] Completed acceptance criteria and actual verification evidence are recorded in this ticket.

## Verification — 2026-10-23

- **Red:** `writeFeaturedSelection` and `writePublishedSelection` were first pointed at
  the copied `selection.json` while `catalog.ts` still held its constants.
  `npx playwright test tests/featured-selection.spec.ts -g "removing selections"`
  failed: the rebuilt isolated homepage still reported `"4 featured projects"` instead
  of `"1 featured project"`.
- **Green:** `catalog.ts` imports `selection.json`; the same test passed, along with
  `tests/unit/og-card.spec.ts` (catalogue loaded through Playwright's transform).
- Focused specs — `featured-selection`, `featured-selection-build`,
  `featured-selection-rotation`, `published-case-studies`, `new-project-readiness`, and
  `new-project-readiness-build`: **39 passed**, unchanged assertions. The duplicate,
  unknown, and unpublished featured-slug errors are still asserted verbatim there.
- `npm test`: **401 passed** (55.6s). `npm run lint`, `npm run typecheck`, and
  `npm run build` (default pipeline, local GitHub stand-in) passed; the build still
  prerenders `/work/elevated-bpm`, `/work/terminal-one`, `/work/telescope`, and
  `/work/sound-city`. `git diff --check` passed.
- Production selection: `selection.json` lists all four projects as `published` and
  `featured` in the previous order (elevated-bpm, terminal-one, telescope, sound-city).
- Test helpers read, validate, and rewrite `selection.json` (`updateSelection` in
  `tests/support/showcase-app.ts`); `addSyntheticIdentity` and
  `addPreparedFixtureProject` publish through it too. No `CASE_STUDY_SLUGS` or
  `WALL_SLUGS` text anchor remains.
- The removed source comments' guidance (published routes survive wall rotation;
  rotate by editing the ordered featured list and retain records and published slugs;
  draft copy is an independent review flag) now lives in
  `docs/project-update-guide.md` and `docs/content-schema.md`.
- `src/content/current-transmission.ts` and `src/content/projects/rail.ts` are untouched.
