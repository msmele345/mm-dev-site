# 02 — Build the globe tile and publish the case study

Status: ready-for-agent

## Parent

[Birdsview featured project spec](../../docs/birdsview-featured-project-spec.md)

[Approved ticket index](README.md)

## What to build

Replace the starter art with birdsview's bespoke chameleon tile and case-study
artwork: a painted-miniature Globe with electric-mint Hotspots and a Fact card,
distinct from telescope's star field. Then publish `/work/birdsview`. It is not
yet on the wall.

- **Static:** the Globe frozen mid-turn with Hotspots and a legible Fact card.
- **Ambient:** slow Globe turn and soft Hotspot pulse.
- **Crescendo:** a Fly-in toward one Hotspot, ending with a Fact card or Passport
  Stamp.

CSS and SVG only: no Cesium, WebGL, or network imagery. Fonts (Libre Caslon
Display, DM Sans) load through the site's font conventions.

## Acceptance criteria

- [x] Tests for the rendered birdsview case study and tile are written first and fail before the art and publication exist.
- [x] `identities/birdsview/` holds a default-export `Tile.tsx`, `Artwork.tsx`, and a namespaced `identity.css`. Registration is regenerated with `npm run project -- sync`, and no project-specific branch is added to shared wall or case-study shells.
- [x] The `onboarding:unfinished` marker is removed, and `npm run project -- check birdsview` reports all publication gates passing.
- [x] The tile uses one accessible link to `/work/birdsview`, shared `TileMeta`, the supplied index, and the shared motion wrapper. Decorative art is hidden from assistive technology.
- [x] Static, ambient, and crescendo states follow the shared motion contract. Reduced motion shows the composed static art. Off-screen animation pauses. Motion carries no essential information.
- [x] The rendered display face is Libre Caslon Display, checked in the browser, not assumed from `displayFace`.
- [x] The accent reads as birdsview's own colour, distinct from the Chrome's electric lime, and meets the contrast checks in the guide.
- [x] `npm run project -- publish birdsview` adds the slug to `published` only. `featured` is unchanged.
- [x] `npm run project -- verify birdsview` passes. Its evidence report (narrative, art, plates, alt text, captions, demo link present, repo link absent, canonical/OG metadata, social image, sitemap, captures at 390/768/1440px) is linked from this ticket.
- [x] The case study renders complete curated content with no repository link and no enrichment.
- [x] The other four case studies and tiles are unchanged.
- [x] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- [ ] Owner review of the tile and case-study art direction is requested. Leave this box unchecked until the owner responds.

## Blocked by

- [01 — Author the birdsview record and plates](01-author-record-and-plates.md)

## Verification evidence

- [Verification evidence report](../../docs/verification/birdsview-featured/02/README.md) (copied from `.project-evidence/birdsview-Q8rDR9/README.md`, `Result: passed`, `Stage: published`, all three publication gates passing).
- **TDD cycles (red → green):**
  - [tests/birdsview-tile.spec.ts](../../tests/birdsview-tile.spec.ts) failed red on the starter `onboarding:unfinished` markers before bespoke art and font loading; passed 3/3 after implementing [src/fonts.ts](../../src/fonts.ts) and [src/components/showcase/identities/birdsview/](../../src/components/showcase/identities/birdsview/Tile.tsx).
  - [tests/birdsview-case-study.spec.ts](../../tests/birdsview-case-study.spec.ts) failed red with HTTP 404 on `/work/birdsview` before publication; passed 1/1 after `npm run project -- publish birdsview` (updating `published` only in [src/content/projects/selection.json](../../src/content/projects/selection.json); `featured` remains `["elevated-bpm", "terminal-one", "telescope", "sound-city"]`).
- **Browser font & colour checks:** `document.fonts` confirmed both `Libre Caslon Display` and `DM Sans` loaded and applied to headings/copy on the tile and `/work/birdsview`; `#45ffd0` (`rgb(69, 255, 208)`) is distinct from Chrome lime `#c6ff00` (`rgb(198, 255, 0)`) and clears WCAG AA (`>= 4.5:1`) on `#070e16`, `#0b141d`, and Chrome `#08090b` (Site intro row rest/hover, focus ring `>= 3:1`).
- **Agent visual inspection (separate from owner art-direction approval):** Inspected `case-study-390.png`, `case-study-768.png`, `case-study-1440.png` in [docs/verification/birdsview-featured/02/](../../docs/verification/birdsview-featured/02/README.md) plus `wall-390.png`, `wall-768.png`, `wall-1440.png`, and `tile-crescendo-1440.png`. Painted-miniature Earth with electric-mint hotspots, `Paris` Fact card, and `STAMPED` Passport Stamp render cleanly without clipping, overflow, or confusion with Telescope's star field; Libre Caslon Display and DM Sans render at all widths.
- **Verification commands:**
  - `npm run project -- sync` — `Registration is already current.`
  - `npm run project -- check birdsview` — `Stage: published`, `Content ready: yes`, `Presentation registered: yes`, `Presentation finished: yes`
  - `npm run project -- verify birdsview` — exited 0 (`Result: passed`)
  - `npm run typecheck` — passed
  - `npm run lint` — passed
  - `npm run build` — passed (22 static routes including `/work/birdsview` and `/work/birdsview/opengraph-image`)
  - `npm test` — 521 passed, 2 skipped (pre-existing skips in `tests/project-verification.spec.ts`)
- **Context docs & scope check:** Reviewed `CONTEXT.md`, `docs/GLOSSARY.md`, `docs/content-schema.md`, and `docs/project-review/birdsview.md` (featuring `birdsview` on the wall and updating `CONTEXT.md`/ADR 0002 belong to Ticket 03). `ProjectWall.tsx`, `CaseStudy.tsx`, and the other four projects' records, tiles, and `public/projects/` plates are unchanged.
