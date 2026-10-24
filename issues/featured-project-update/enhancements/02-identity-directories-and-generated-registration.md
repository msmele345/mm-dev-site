# 02: Migrate identities to per-project directories with generated registration

**What to build:** Give every project a self-contained home and replace hand-written
catalogue and registry wiring with generated barrels. Curated content moves to
`src/content/projects/authored/<slug>.ts`. Each identity moves to
`src/components/showcase/identities/<slug>/` as `Tile.tsx`, `Artwork.tsx`, and a
namespaced `identity.css`. One deterministic generator produces
`src/content/projects/authored.generated.ts` and
`src/components/showcase/identities.generated.ts`. Visitors see no change.

**Blocked by:** None (can start immediately; independent of 01).

**Status:** ready-for-agent

- [ ] A failing generator test is written first: given a directory listing, the generator produces sorted, deterministic barrel source with a "generated; do not edit" header.
- [ ] Running the generator twice over an unchanged tree produces byte-identical output.
- [ ] The generator refuses an identity directory missing `Tile.tsx` or `Artwork.tsx` and names the slug and missing file; it never silently omits or substitutes art.
- [ ] The four content records move to `authored/` with type-only imports, and each loads under plain `node` without a TypeScript runner.
- [ ] Generated names follow the spec's convention: authored files export the camelCase of the slug, identity components are default exports, and file and directory names equal the slug.
- [ ] `catalog.ts` reads the authored catalogue from `authored.generated.ts`; `registry.ts` builds the showcase registry from `identities.generated.ts` and keeps its duplicate and missing-component checks.
- [ ] `artwork.tsx` is split into per-identity `Artwork.tsx` files, and the four tiles move into their identity directories.
- [ ] Identity-specific rules move from `globals.css` into each identity's plain `identity.css`, imported by its components, with class names unchanged. Shared Chrome, wall, and motion styles stay in `globals.css`.
- [ ] Homepage and all four case studies are visually unchanged: captures at 390, 768, and 1440px from a production build before and after the migration are compared and recorded. Production builds merge CSS differently from dev, and moved identity rules change cascade position.
- [ ] `ProjectWall.tsx` and `CaseStudy.tsx` gain no project-specific branches.
- [ ] Test helpers in `tests/support/showcase-app.ts` write identity directories and run the generator instead of using `catalog.ts`, `registry.ts`, or `globals.css` text anchors. The Signal Loom fixture and the `orbit-lab` prepared project use the directory convention (`orbit-lab` may re-export the telescope components).
- [ ] A new ADR records the move from hand-written to generated registration and why registration remains explicit and reviewable.
- [ ] `docs/project-update-guide.md` and `docs/content-schema.md` describe the new locations and state that the generated files are never edited by hand.
- [ ] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [ ] Completed acceptance criteria and actual verification evidence are recorded in this ticket.
