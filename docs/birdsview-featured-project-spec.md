# Birdsview — Featured Project Spec

Status: ready for implementation — ticket breakdown approved 2026-11-21 ([tickets](../issues/birdsview-featured/README.md))
Distribution: local Markdown
Scope: onboarding birdsview as a fifth featured project, leading the Project wall

## Problem Statement

birdsview is the owner's most actively developed project, yet the site only mentions
it in Current Transmission's Now Building signal. That signal links to a private
GitHub repository, so every visitor who follows it reaches a 404. The Project wall
shows four earlier projects and nothing of the work in progress.

The owner wants birdsview on the wall as a chameleon tile with a full case study, in
first position, so the homepage leads with current work. Earlier specs deliberately
deferred this: the [featured-project update spec](featured-project-update-spec.md),
the [onboarding automation spec](featured-project-onboarding-automation-spec.md),
and the [Current Transmission spec](current-transmission-spec.md) each list "adding
Birdsview" as out of scope. This spec is that separate task.

## Solution

Use the shipped onboarding workflow in the [project update guide](project-update-guide.md)
(`create` → author → `check` → `publish` → `verify` → `feature`). No new maintenance
infrastructure is needed.

1. Author a source-grounded birdsview record with SVG plates.
2. Build a bespoke globe tile and case-study artwork, then publish `/work/birdsview`.
3. Feature it at position 1, shifting the current four to positions 2–5.
4. Repoint Now Building from the private repository to `/work/birdsview`.

The case study says plainly that birdsview is in development (release one). No new
status field is added.

## Owner Decisions (2026-11-21)

| Question | Decision |
| --- | --- |
| Wall position | Lead at position 1. Order becomes birdsview, elevated-bpm, terminal-one, telescope, sound-city. |
| In-development signal | In the copy only. No schema, tile, or badge changes. |
| Links | Demo link only (`https://birdsview-ochre.vercel.app`, the repo's GitHub homepage). No repository link while the repo is private. Now Building points to `/work/birdsview`. |
| Imagery | Hand-drawn SVG plates, like the other four projects. No captures of the running app. |
| Title | "Birdsview" (capitalised). The slug stays `birdsview`. |

## User Stories

1. As a visitor, I want the wall to open with the project the owner is building now, so that I see current work first.
2. As a visitor, I want the birdsview tile to look like a small version of birdsview, so that I can tell what it is before I click.
3. As a visitor, I want the birdsview tile to look different from the telescope star field, so that the two space-adjacent projects don't blur together.
4. As a visitor, I want the Site intro index to list birdsview first with its own invitation and accent, so that the index and the wall agree.
5. As a visitor, I want a birdsview case study that explains what it does and why, in plain English, so that I understand it without knowing the code.
6. As a visitor, I want the case study to say birdsview is still in development, so that I don't mistake it for a finished product.
7. As a visitor, I want a working link to try birdsview, so that I can use the globe myself.
8. As a visitor, I want no link to a repository I can't open, so that I don't hit a 404.
9. As a visitor, I want Now Building to take me to the birdsview case study, so that the homepage's "what I'm building" link works.
10. As a keyboard user, I want the birdsview tile first in tab order with visible focus and Enter activation, so that it is as reachable as every other tile.
11. As a touch user, I want the established mobile tile interaction to work on the birdsview tile, so that phones aren't left out.
12. As a reduced-motion visitor, I want deliberate static birdsview art, so that the tile's identity does not depend on animation.
13. As a visitor, I want only one tile to crescendo at a time, so that a fifth tile doesn't compete with the others.
14. As a returning visitor, I want the four existing case studies to keep their URLs, art, and content, so that nothing I bookmarked breaks.
15. As the owner, I want every claim in the case study traceable to birdsview's own docs, so that the site makes no unsupported claims.
16. As the owner, I want to review the copy and the tile art before they ship, so that the identity matches my intent.
17. As the owner, I want the plates to avoid Google and EOX imagery, so that the site stays clear of tile-extraction and attribution terms.

## Implementation Decisions

### Content

- **Slug and title:** slug `birdsview`, title "Birdsview" (owner decision). The slug
  stays lowercase; the title is what visitors read on the tile and case study.
- **Sources:** birdsview's `CONTEXT.md`, `README.md`, `docs/spec.md`, `docs/adr/`,
  and `docs/specs/`. Record paths and the revision in `docs/project-review/birdsview.md`.
  Note any uncommitted source changes at authoring time.
- **Counts come from the data, not the README.** The source README says 20 locations;
  `src/data/locations.json` currently holds 26 across all seven continents, with two
  tours. Read the data files when writing copy, or avoid exact counts.
- **Story:** problem / build / result, in the plain-English style of the
  [published case studies](../issues/publish-case-study-plates.md). Supportable
  material: the spinning Globe, Hotspots, Fly-in to a Bird's-eye view, Fact cards
  written to read aloud to a ten-year-old, guided Tours, the Passport, Quality tiers,
  the Diorama grade, Google or open-data mode per session, zero spend, kid-safe, no
  accounts or backend. The result section says release one is in progress and
  names what is deferred (day/night lighting and clouds per its ADR 0011; the quiz).
- **No unsupported claims:** no usage numbers, performance figures, or "launched"
  language. Zero spend is a design constraint (quota caps), not a measured outcome.
- **Invitation:** a short verb phrase supported by the source, e.g. "Fly over the
  world" or "Take me somewhere" (the app's own tour button). Owner picks.
- **Stack:** from `package.json`: TypeScript, React 19, Vite, CesiumJS, Zod, Vitest,
  Playwright, Vercel. Google Photorealistic 3D Tiles may be listed as a data source.
- **Links:** `links.demo` only. Omit `links.repo`. With no repo link, build-time
  enrichment has nothing to fetch, which is a valid curated-only state (ADR 0004).
- **Draft flag:** start `draft: true`. Flip to `false` only after owner copy review,
  matching the convention in the published case studies.

### Plates

- At least two SVG plates under `public/projects/birdsview/`, drawn in the tile's
  palette: e.g. the Globe with glowing Hotspots, and a Bird's-eye view with an open
  Fact card or a Passport page with Stamps.
- Drawn, not traced from rendered Google or EOX imagery. Coastlines may be stylised.
- Alt text describes what is visible; captions are visitor-facing, with no "draft
  plate" or author instructions (same rule as the published four).

### Tile identity

- **Art direction (draft for owner approval):** a painted-miniature Globe. Ink-blue
  ground, a small Earth with an atmosphere rim, electric-mint Hotspots, and a Fact
  card in Libre Caslon Display. Stars, if any, stay faint background; telescope owns
  the star field.
- **Ambient:** the Globe turns slowly and the Hotspots pulse softly.
- **Crescendo:** a Fly-in. The view zooms toward one Hotspot and a Fact card or
  Passport Stamp lands. It runs on hover, keyboard focus, the matching Site intro
  index row, and the established mobile interaction.
- **Static:** the Globe frozen mid-turn with Hotspots and a legible Fact card. It is a
  composed picture in its own right, not the first animation frame.
- **Palette** (from birdsview's `src/styles.css`): ground `#070e16`, panel `#0b141d`,
  ink `#f4eedf`, mute `#abb8bf`, accent `#45ffd0` (electric mint). The mint is distinct
  from the Chrome's electric lime (`#c6ff00`); confirm it still reads as birdsview's
  own colour in the Site intro index row next to lime Chrome.
- **Fonts:** Libre Caslon Display for display, DM Sans for supporting text. Load
  them following `src/fonts.ts`; `displayFace` does not load a font.
- **Rendering:** CSS/SVG only. No Cesium, WebGL, or network imagery in the tile or
  the case-study artwork.
- Follow the guide's artwork checklist: one accessible link, shared `TileMeta`,
  shared motion wrapper, namespaced `identity.css`, decorative art hidden from
  assistive technology, off-screen pause.

### Wall and Current Transmission

- Feature with `npm run project -- feature birdsview --position 1`. The Site intro
  index follows automatically.
- Existing slugs, routes, art, and invitations are unchanged. Their visible
  positions shift by one; that is expected.
- Repoint `nowBuilding.destination` to `/work/birdsview` and update `updatedOn`.
  The internal-destination behaviour (same-tab navigation, "Case study →" cue)
  already exists from Current Transmission ticket 09; no code change is expected.
  Headline and supporting text stay as they are unless the owner revises them.

### Documentation

- Update `CONTEXT.md`'s featured-projects list and ADR 0002's project-to-art-direction
  mapping with birdsview (deliberate change to an established decision).
- Update ADR 0004 only if its list of showcased repositories would otherwise be
  wrong.
- Update `docs/current-transmission-spec.md`'s Now Building destination note.

## Testing Decisions

- Follow TDD. Tests describe rendered behaviour (wall, Site intro index, case-study
  page, Now Building link), not identity internals.
- Prior art: `tests/new-project-readiness.spec.ts`, `tests/remaining-three-tiles.spec.ts`,
  `tests/site-intro.spec.ts`, `tests/featured-selection-rotation.spec.ts`, and the
  Current Transmission ticket 09 tests.
- Tests that assert the exact production wall order or count will need updating for
  the five-tile order. Prefer reading the order from the selection over hard-coding
  it again, in line with Current Transmission ticket 06 (decouple tests from live
  copy).
- `npm run project -- verify birdsview` evidence covers publication and featuring:
  captures at 390/768/1440px, keyboard, touch, reduced motion, crescendo exclusivity,
  off-screen pause, metadata, social image, and sitemap.
- Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- Agent inspection is recorded separately from owner approval of copy and art.

## Out of Scope

- A status/badge field or any schema change.
- Linking or enriching from the private repository.
- Captures of the running app, or any Google or EOX imagery.
- Changing the other four projects' copy, art, or slugs.
- Changes to the more-projects rail or Next Experiment.
- Changes to the birdsview repository itself (including its stale location count).
- Wall layout changes for five tiles beyond what the existing odd-selection layout
  already supports.

## Open Questions for Owner Review

- Invitation wording.
- Tile art direction approval, once the identity is rendered.
- Whether Now Building's supporting text should change once it links to the case study.
