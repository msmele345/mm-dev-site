# Content schema

The curated content file is the presentation-layer source of truth for a
project (ADR 0004). Every later surface — chameleon tiles, case studies,
build-time enrichment, the more-projects rail — consumes this field set.

Author a file in `src/content/projects/` that `satisfies Project` from
`src/content/projects/schema.ts`. The type is the schema. Two files already
validate it: `elevated-bpm.ts` and `terminal-one.ts`. Adding the second
required no schema change.

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
| `tile` | featured only | Identity for a chameleon tile / themed case study. Omit on the more-projects rail (issue 08). |
| `tile.motif` | with tile | What the tile *is* — `groovebox faceplate`, `trading terminal`, `star field`, `club flyer`. |
| `tile.displayFace` | with tile | Display typeface name. Case studies load the matching `next/font`. |
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

Issue 03a ships elevated-bpm on the wall and at `/work/elevated-bpm`.
terminal-one is authored against the schema but not yet on the wall or
routed — those land in issue 05.
