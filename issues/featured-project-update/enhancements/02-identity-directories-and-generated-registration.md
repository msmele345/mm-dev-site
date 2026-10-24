# 02: Migrate identities to per-project directories with generated registration

**What to build:** Give every project a self-contained home and replace hand-written
catalogue and registry wiring with generated barrels. Curated content moves to
`src/content/projects/authored/<slug>.ts`. Each identity moves to
`src/components/showcase/identities/<slug>/` as `Tile.tsx`, `Artwork.tsx`, and a
namespaced `identity.css`. One deterministic generator produces
`src/content/projects/authored.generated.ts` and
`src/components/showcase/identities.generated.ts`. Visitors see no change.

**Blocked by:** None (can start immediately; independent of 01).

**Status:** complete — 2026-10-24

- [x] A failing generator test is written first: given a directory listing, the generator produces sorted, deterministic barrel source with a "generated; do not edit" header.
- [x] Running the generator twice over an unchanged tree produces byte-identical output.
- [x] The generator refuses an identity directory missing `Tile.tsx` or `Artwork.tsx` and names the slug and missing file; it never silently omits or substitutes art.
- [x] The four content records move to `authored/` with type-only imports, and each loads under plain `node` without a TypeScript runner.
- [x] Generated names follow the spec's convention: authored files export the camelCase of the slug, identity components are default exports, and file and directory names equal the slug.
- [x] `catalog.ts` reads the authored catalogue from `authored.generated.ts`; `registry.ts` builds the showcase registry from `identities.generated.ts` and keeps its duplicate and missing-component checks.
- [x] `artwork.tsx` is split into per-identity `Artwork.tsx` files, and the four tiles move into their identity directories.
- [x] Identity-specific rules move from `globals.css` into each identity's plain `identity.css`, imported by its components, with class names unchanged. Shared Chrome, wall, and motion styles stay in `globals.css`.
- [x] Homepage and all four case studies are visually unchanged: captures at 390, 768, and 1440px from a production build before and after the migration are compared and recorded. Production builds merge CSS differently from dev, and moved identity rules change cascade position.
- [x] `ProjectWall.tsx` and `CaseStudy.tsx` gain no project-specific branches.
- [x] Test helpers in `tests/support/showcase-app.ts` write identity directories and run the generator instead of using `catalog.ts`, `registry.ts`, or `globals.css` text anchors. The Signal Loom fixture and the `orbit-lab` prepared project use the directory convention (`orbit-lab` may re-export the telescope components).
- [x] A new ADR records the move from hand-written to generated registration and why registration remains explicit and reviewable.
- [x] `docs/project-update-guide.md` and `docs/content-schema.md` describe the new locations and state that the generated files are never edited by hand.
- [x] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [x] Completed acceptance criteria and actual verification evidence are recorded in this ticket.

## Verification — 2026-10-24

- **Red:** `tests/unit/registration-generator.spec.ts` was written first and failed to
  load: `@/lib/generate-registration` did not exist.
- **Green:** `src/lib/generate-registration.ts` (Node built-ins only) renders both
  barrels as a pure function of the listing; `npm run registration`
  (`scripts/registration.mjs`) writes only barrels whose content differs. The spec
  (10 tests) covers sorted output with the "Generated …; do not edit" header,
  camelCase/PascalCase names from the slug, identical output for reordered listings,
  byte-identical repeat syncs (second run changes nothing; `.DS_Store` ignored),
  refusal of an identity missing `Tile.tsx` or `Artwork.tsx` with slug and file named
  and no barrel written, refusal of unnameable or colliding slugs, checked-in barrels
  equal to generator output, and each `authored/<slug>.ts` loading under plain `node`
  (native type stripping) with exactly one export, `camelCase(slug)`, whose `slug`
  equals the filename.
- Records moved with `git mv` to `src/content/projects/authored/` (type-only
  `../schema` import). Tiles moved to `identities/<slug>/Tile.tsx`; `artwork.tsx` split
  into four default-export `Artwork.tsx` files. `catalog.ts` reads
  `authored.generated.ts`; `registry.ts` is `createShowcaseRegistry(identities)` and
  keeps its duplicate and missing-component checks
  (`tests/unit/showcase-registration.spec.ts`). `listProjects()` is now slug-sorted;
  only readiness and `getProject` consume it.
- CSS: identity rules moved verbatim into each `identity.css` (grouped selectors split
  per identity in original order; `.groovebox-tile [data-anim]` moved out of the shared
  reduced-motion rule). `globals.css` keeps tokens (including `--hw-*`), Chrome, `.case`
  and `.case-motif` bases, `.tile-motion`, `.chameleon-tile`, the wall grid, the shared
  `.chameleon-tile [data-anim]` static rule, the off-screen pause, and the global
  reduced-motion kill. No class names changed.
- **Visual comparison (production build).** Before any ticket-02 change, and again
  after, ran `npm run build` (default Turbopack pipeline, local GitHub stand-in) and
  `next start`, then captured `/` and all four `/work/<slug>` pages at 390, 768, and
  1440px, under both `no-preference` and `reduce` motion (full page, animations
  disabled): **30/30 PNGs byte-identical** (`cmp`). The baseline was captured twice to
  confirm determinism. A computed-style dump of every element on the same 30
  page/width/motion combinations, in rest, forced-crescendo, and forced-off-screen
  states, showed **zero property differences** (opacity/transform ignored only on
  elements with a running animation, whose sampled values differ between any two runs).
  Captures were kept in the session scratchpad, not the repository.
- `src/components/ProjectWall.tsx`, `src/components/CaseStudy.tsx`, Current
  Transmission, and the rail are unchanged.
- Test helpers write `authored/` records and identity directories and call
  `syncRegistration`; no `catalog.ts`, `registry.ts`, or `globals.css` anchors remain.
  The Signal Loom fixture lives at `tests/support/synthetic-identity/signal-loom/`
  (`Tile.tsx`, `Artwork.tsx`, `identity.css`). `orbit-lab` is a standalone authored
  record whose identity re-exports the telescope components;
  `addPreparedFixtureProject(dir, { draft: false })` replaces the old `catalog.ts`
  text edit in `published-case-studies.spec.ts`.
- ADR: [0007 — Generated, checked-in showcase registration](../../../docs/adr/0007-generated-showcase-registration.md).
  `docs/project-update-guide.md` and `docs/content-schema.md` describe the new
  locations, `npm run registration`, and that generated files are never hand-edited.
- Focused specs (unit, featured-selection, featured-selection-build, rotation,
  published-case-studies, new-project-readiness, new-project-readiness-build,
  groovebox, remaining-three-tiles, content-schema): passed. Earlier attempts timed out
  when the laptop slept on battery overnight (tests reporting 15 minutes against
  180-second limits); a manual isolated build of the failing shape finished in 5s with
  the expected error, and the reruns under `caffeinate` passed.
- `npm test`: **411 passed** (58.0s). `npm run lint`, `npm run typecheck`,
  `npm run build`, and `git diff --check` passed. `npm run registration` reports
  `Registration is already current.`
