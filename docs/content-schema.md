# Content schema

The curated content file is the presentation-layer source of truth for a
project (ADR 0004). Every later surface — chameleon tiles, case studies,
build-time enrichment, the more-projects rail — consumes this field set.

Author `src/content/projects/authored/<slug>.ts`, exporting the record under the
camelCase of its slug (`elevated-bpm` → `elevatedBpm`), that `satisfies Project` from
`src/content/projects/schema.ts`. Keep that import type-only so plain `node` can load
the file. The type is the schema. The initial catalogue contains
elevated-bpm, terminal-one, telescope, and sound-city.
See the [project update guide](project-update-guide.md) for onboarding and rotation.

Copy is drafted from each source repo's CONCEPT / PRD / README. Files with
`draft: true` render a "Draft copy — pending review" flag on the case study.
That review does not block shipping.

## Fields

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Display name. |
| `slug` | yes | Route segment (`/work/[slug]`). |
| `pitch` | yes | One- or two-sentence hook. |
| `draft` | yes | `true` until the owner edits the copy. |
| `tile` | once published | Identity for a chameleon tile / themed case study. More-projects rail entries are a separate `RailProject` record with no tile (issue 08). |
| `tile.motif` | with tile | What the tile *is* — `groovebox faceplate`, `trading terminal`, `star field`, `club flyer`. |
| `tile.displayFace` | with tile | Display typeface name. Follow `src/fonts.ts` and CSS conventions; this field does not automatically load a font. |
| `tile.palette` | with tile | `ground`, `panel`, `ink`, `mute`, `accent`. Optional `steps` quad for sequencer LEDs. |
| `story` | yes | Ordered sections. v1 uses `problem` → `build` → `result`. |
| `story[].kind` | yes | `problem` \| `build` \| `result`. |
| `story[].heading` | yes | Section title. |
| `story[].body` | yes | Grounded in the source repo. No unsupported outcome claims. |
| `screenshots` | yes | May be draft plates. Each has `src`, `alt`, `caption`. |
| `links.repo` | no | GitHub URL. Presence of a remote is what issue 04 enriches. |
| `links.demo` | no | Live demo URL. |
| `stack` | yes | Badge labels. |

## Catalog

`src/content/projects/catalog.ts` is the only loader:

- `listProjects()` — every authored file
- `getProject(slug)` — one project, or `undefined`
- `listCaseStudySlugs()` — routes that should exist today
- `listWallProjects()` — cards on the home project wall

The authored catalogue is every file in `authored/`, registered by the generated
`src/content/projects/authored.generated.ts` (sorted by slug). Never edit that file by
hand; run `npm run registration` after adding, renaming, or removing an authored file
(ADR 0007). Publication and featuring are plain
data in `src/content/projects/selection.json`, the only surface for either:

```json
{ "published": ["elevated-bpm", "..."], "featured": ["elevated-bpm", "..."] }
```

`published` selects case-study routes; `featured` selects homepage membership and
order independently. All four initial projects are published and featured. Published
routes survive wall rotation: removing a `featured` slug retains its route, and
`draft` copy is an independent review flag, not a publication switch.

## Readiness

`next.config.ts` validates the catalogue before `next dev` or `next build` does
anything else (`src/content/projects/readiness.ts`). Every authored record needs
a unique lowercase kebab-case `slug`. An unfinished record may otherwise rest in
the catalogue; once its slug is published (featuring requires publication) it
also needs:

- a nonblank `title` and `pitch`, and a boolean `draft`
- at least one nonblank `stack` label
- a `tile` with a nonblank `motif` and `displayFace` and a hex-colour palette
  (`steps`, when present, is four hex colours)
- `problem` → `build` → `result` story sections with nonblank headings and bodies
- at least one screenshot or labeled draft plate whose `src` is a file under
  `public/` (case-sensitive), with nonblank `alt` and `caption`
- `links.repo` / `links.demo` either absent or absolute `https://` URLs

Published slugs must name an authored project once, and a featured slug must be
published. Errors name the slug and field, e.g.
`Project "telescope": screenshots[0].alt must be a non-empty string`.
A published project also needs a presentation: an identity directory
`src/components/showcase/identities/<slug>/` with `Tile.tsx`, `Artwork.tsx`, and
`identity.css`, registered by the generated `identities.generated.ts` (never edited by
hand). Without one the build stops with
`Showcase "<slug>": missing presentation registration`; a directory missing either
component stops `npm run registration` with the slug and file named.

`draft: true` and draft plates stay publishable, and a missing remote or
unavailable GitHub statistics never fail readiness (ADR 0004).
