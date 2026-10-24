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
- `listAuthoredFileRecords()` — each authored filename beside its record's `slug`,
  for readiness

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

### Stages and gates

A project moves through three ordered **stages**:

1. **Authored** — `authored/<slug>.ts` exists with a unique valid slug.
2. **Published** — its slug is in `published`; `/work/<slug>` exists.
3. **Featured** — its slug is in `featured`; featuring requires publication.

Publication is guarded by three independent **gates**, in any combination:

- **Content ready** — the record passes every content rule below.
- **Presentation registered** — `src/components/showcase/identities/<slug>/` holds
  `Tile.tsx` and `Artwork.tsx`, and both generated barrels match what
  `npm run registration` would write.
- **Presentation finished** — no file in the identity directory still contains the
  `onboarding:unfinished` marker.

### Content rules

Every authored record needs a unique lowercase kebab-case `slug` (the `ROUTE_SLUG`
pattern exported from `src/content/projects/readiness.ts`). An unfinished record may
otherwise rest in the catalogue; it is content ready when it has:

- a nonblank `title` and `pitch`, and a boolean `draft`
- at least one nonblank `stack` label
- a `tile` with a nonblank `motif` and `displayFace` and a hex-colour palette
  (`steps`, when present, is four hex colours)
- `problem` → `build` → `result` story sections with nonblank headings and bodies
- at least one screenshot or labeled draft plate whose `src` is a file under
  `public/` (case-sensitive), with nonblank `alt` and `caption`
- `links.repo` / `links.demo` either absent or absolute `https://` URLs

`draft: true` and draft plates stay publishable, and a missing remote or
unavailable GitHub statistics never fail readiness (ADR 0004).

Relationship rules: published slugs must name an authored project once; a featured
slug must be authored, selected once, and published; an authored filename and an
identity directory name must equal a record's `slug`.

### Findings and the build

`collectShowcaseFindings` gathers every problem in one pass as structured findings
(`slug`, `subject`, `message`, plus the gate it closes and whether it blocks the
build). `next.config.ts` runs `validateShowcaseContent` before `next dev` or
`next build` does anything else, with filesystem facts from
`src/content/projects/filesystem-facts.ts`. It throws **one error listing every
blocking finding**, one line each:

```text
Project "telescope": title must be a non-empty string
Project "telescope": screenshots[0].alt must be a non-empty string
```

A finding blocks the build when it belongs to a published project, or
breaks a catalogue-wide rule (invalid or duplicate slug, unknown or duplicate
published/featured reference, featured but unpublished). Incomplete **unpublished**
work never blocks `dev` or `build`; the check command still reports it. Blocking
presentation findings read:

- `Showcase "<slug>": missing presentation registration`
- `Showcase "<slug>": presentation contains onboarding:unfinished marker in <file>`
- `Showcase "<slug>": does not match authored files and identity directories; run npm run registration`
- `Project "<slug>": authored/<file>.ts filename must match record slug "<slug>"`

Stale generated registration is a checkout-wide fact, so it is reported once for
every published project. A barrel that still imports a deleted authored file fails
earlier, at module load, naming the missing path; run `npm run registration`.

### Check command

```bash
npm run project -- check <slug>
```

Read-only: it reports the stage, each gate, and every finding for that project, then
exits `0` whether or not the gates are open. Findings that belong to no record — an
identity directory or authored file named for no slug, an unknown published or
featured reference — follow under `Catalogue findings:`. An invalid slug, an unknown project, a
malformed `selection.json`, or an authored file without its camelCase export exits
nonzero with the problem named. For example:

```text
Project: signal-loom
Stage: authored
Content ready: no
Presentation registered: yes
Presentation finished: no
Findings:
- pitch: must be a non-empty string
- presentation: contains onboarding:unfinished marker in src/components/showcase/identities/signal-loom/Tile.tsx
```

The command runs on Node's native TypeScript type stripping (Node 22.22 or newer)
with no new dependency. `scripts/project.mjs` exits with an upgrade message on older
Node, then imports `src/content/projects/project-command.ts`, which uses only erasable
TypeScript and reads `selection.json`, the authored files, and the filesystem
directly — never `catalog.ts` or React components. Its relative imports carry
explicit `.ts` extensions, which `tsconfig.json` accepts through
`allowImportingTsExtensions` (safe because typecheck runs with `noEmit`);
`scripts/project.mjs` is in the typecheck `include` and is linted with the rest of
the repository.
