# Updating the Project wall

Use this guide for preparing, adding, removing, replacing, or reordering projects.
The initial lineup has four projects; the selection is not limited to four.
Keep public slugs stable: never reuse an outgoing project's slug for a new identity.

## The four editing surfaces

| Surface | Source | Purpose |
|---|---|---|
| Authored catalogue | `src/content/projects/authored/<slug>.ts` | Curated copy and identity, including retained projects. Loaded through the generated `authored.generated.ts`. |
| Featured selection | `featured` in `src/content/projects/selection.json` | Homepage membership and order; drives count, numbering, and reading order. |
| Published case studies | `published` in `src/content/projects/selection.json` | Available `/work/<slug>` pages, metadata, social images, and sitemap entries. |
| Presentation identity | `src/components/showcase/identities/<slug>/` (`Tile.tsx`, `Artwork.tsx`, `identity.css`) | Explicit tile and case-study artwork for a slug. Registered through the generated `identities.generated.ts`. |

A featured project must be authored, registered, and published. A published project
need not be featured.

`selection.json` is the only publication and featuring surface. It is plain data,
`{ "published": [...], "featured": [...] }`, so edit it by hand or with a tool that
reads, validates, and rewrites it; `catalog.ts` imports it and needs no edits.
Published routes survive wall rotation: edit the ordered `featured` list to rotate
the wall, and retain the authored records and `published` slugs it leaves behind.
`draft: true` shows the copy-review flag; it does not unpublish a route. Clearly labeled draft plates are also valid for publication. Owner approval
of copy and visuals remains a separate review item.

Current Transmission (`src/content/current-transmission.ts`) and the more-projects
rail (`src/content/projects/rail.ts`) are independently curated. Wall updates do not
promote Now Building, edit the ledger, or move removed projects to the rail.

### Generated registration

`src/content/projects/authored.generated.ts` and
`src/components/showcase/identities.generated.ts` are generated from the `authored/`
and `identities/` listings (ADR 0007). **Never edit them by hand.** After adding,
renaming, or removing an authored file or identity directory, run:

```bash
npm run registration
```

Commit the regenerated files with the change; they are reviewed like any source. The
command is safe to repeat: an unchanged tree reports `Registration is already current.`
It refuses an identity directory missing `Tile.tsx` or `Artwork.tsx` and names the slug
and file. Names derive from the slug: `authored/your-project.ts` exports
`yourProject`, and both identity components are default exports. File and directory
names must equal the record's `slug` and start with a letter.

## Prepare a new project

- [ ] Read the source repository's CONCEPT, PRD, README, or equivalent. Record the
  source paths and revisions in the update's review notes; avoid unsupported outcomes.
- [ ] Choose a unique lowercase kebab-case slug and author a record using the outline below.
- [ ] Save it as `src/content/projects/authored/<slug>.ts` and run `npm run registration`.
- [ ] Add at least one image under `public/projects/<slug>/`; its content `src` starts
  with `/projects/`, not `/public/`. Check filename case, useful alt text, and caption.
- [ ] Complete the artwork checklist below, then register the presentation.
- [ ] Add the slug once to `published` in `selection.json`. Build and visit the case study directly.
- [ ] When ready for the wall, follow “Feature an existing project.”

### Reusable content outline

Create `src/content/projects/authored/your-project.ts`. Keep the schema import
type-only so plain `node` can load the file. Replace all example copy and provide
an actual local image before building. The full contract is in
[content-schema.md](content-schema.md) and `src/content/projects/schema.ts`.

```ts
import type { Project } from "../schema";

export const yourProject = {
  title: "Your Project",
  slug: "your-project",
  pitch: "A concrete explanation of what the project does.",
  draft: true,
  tile: {
    motif: "Describe the bespoke visual identity",
    displayFace: "Bebas Neue",
    palette: {
      ground: "#120a1f", panel: "#1d1230", ink: "#f6efff",
      mute: "#a394bd", accent: "#ff5ad1",
    },
  },
  story: [
    { kind: "problem", heading: "The need", body: "Source-grounded problem." },
    { kind: "build", heading: "The work", body: "What was implemented and why." },
    { kind: "result", heading: "The outcome", body: "Supported results and limits." },
  ],
  screenshots: [{
    src: "/projects/your-project/plate.svg",
    alt: "Describe the information visible in this image.",
    caption: "Draft plate — replace with a reviewed capture.",
  }],
  links: {},
  stack: ["TypeScript"],
} satisfies Project;
```

`links.repo` and `links.demo` are optional absolute HTTPS URLs. Omit missing links;
do not insert placeholder destinations. Missing remotes and failed build-time GitHub
statistics are valid: curated content must still render. Remote availability is not
a readiness check. Palette values must be hex colours; optional `steps` contains four.

### Artwork and registration checklist

- [ ] Create `src/components/showcase/identities/<slug>/` with a default-export
  `Tile.tsx` and a default-export `Artwork.tsx`. A content record does not generate
  an identity.
- [ ] Follow `ShowcasePresentation` in `src/components/showcase/registration.ts`:
  `Tile` receives `project`, `index`, and optional `displayClassName`;
  `CaseStudyArtwork` receives `project`.
- [ ] Use one accessible link to `/work/${project.slug}`, shared `TileMeta`, palette
  conventions, and the supplied index. Keep decorative art hidden from assistive technology.
- [ ] Use the shared motion wrapper provided by the wall. Styles should respect
  `data-crescendo`, `data-in-view`, `data-anim`, and reduced motion. Inspect the existing
  identities and `tests/support/synthetic-identity/signal-loom/` for complete examples.
- [ ] Supply deliberate static art, visible keyboard focus, touch activation, and
  off-screen animation pausing. Never make essential information depend on motion.
- [ ] Add namespaced styles in the identity's own plain `identity.css`, imported by
  both components. Shared Chrome, wall, tile-shell, and motion styles stay in
  `src/app/globals.css`; identity styles load after it. Check the actual rendered font;
  `displayFace` is not an automatic font loader. Follow `src/fonts.ts` and existing
  CSS font conventions if introducing a face.
- [ ] Run `npm run registration`; it adds
  `{ slug: "your-project", Tile: YourProjectTile, CaseStudyArtwork: YourProjectArtwork }`
  to `identities.generated.ts`. No project-specific dispatch belongs in
  `ProjectWall.tsx` or `CaseStudy.tsx`.
- [ ] Review the tile and case-study artwork together, including image alt text and captions.

The real dev/build path checks unique valid catalogue slugs and full readiness for
published projects. Unpublished records may remain unfinished. It rejects malformed
published content, duplicate/unknown references,
unresolved local images, missing published registrations, and unpublished featured
projects. Errors name the slug and field or relationship, and the build lists every
blocking finding at once. Fix the named source;
do not hide entries or substitute another project's art to make the build pass.

Run `npm run project -- check your-project` at any point. It is read-only and reports
the project's stage (authored, published, featured), each publication gate (content
ready, presentation registered, presentation finished), and every finding, including
for unpublished work the build lets through. See `docs/content-schema.md`.

## Feature an existing project

- [ ] Confirm its catalogue record, presentation, assets, and published route exist.
- [ ] Preview the intended one-based position with
  `npm run project -- feature your-project --position 2 --dry-run`.
- [ ] Run the same command without `--dry-run` to insert its slug once into
  `featured` in `selection.json`, then review the reported Project wall order.
  You can also edit the selection by hand. Repeating the same command makes no
  changes; requesting a different position for an existing entry stops and reports
  its current position. Use the manual reorder flow below to move entries.
- [ ] Rebuild and check membership, count, indices, and destination using the evidence
  checklist below. Already prepared projects need no new bespoke UI code.

## Remove a featured project

- [ ] Remove only its entry from `featured`.
- [ ] Retain its `authored/` record, slug in `published`, identity directory
  (components and `identity.css`), fonts, and local images needed by its published page.
- [ ] Rebuild and visit the old URL directly; check its metadata, social image, and sitemap.
  Removing every selection keeps the Work anchor and heading, reports zero featured
  projects, and displays “No featured projects right now.” without placeholder cards.

## Replace a featured project

- [ ] Prepare and publish the incoming identity first.
- [ ] Replace the outgoing slug in `featured` with the incoming slug at the desired position.
- [ ] Retain all outgoing publication dependencies as described under removal.
- [ ] Rebuild; open both URLs and verify each retains its own identity. Never overwrite
  the outgoing record or reuse its public slug for the incoming project.

## Reorder the wall

- [ ] Move existing entries within `featured`; change no project slugs or stored indices.
- [ ] Rebuild; check visible sequence, contiguous numbering, count, and keyboard order.
  Odd selections keep the final tile in normal grid order; five is not a maximum.

## Rehearse safely with the synthetic identity

Run from the repository root:

```bash
npm test -- tests/new-project-readiness.spec.ts --workers=1
npm test -- tests/featured-selection-rotation.spec.ts tests/published-case-studies.spec.ts --workers=1
```

The first test file executes the guide's extension points in a temporary app copy:
`addSyntheticIdentity` in `tests/support/showcase-app.ts` writes Signal Loom's
`authored/signal-loom.ts` record, copies its image and its `identities/signal-loom/`
directory (tile, artwork, and `identity.css`), runs the registration generator, and
adds the slug to `published` in `selection.json`. The initial featured selection is `["signal-loom", "telescope"]`.
It verifies content, keyboard/touch/motion, and screenshots at 390, 768, and 1440px.
It also rebuilds with no external links. The same app then follows this sequence,
stopping its server and rebuilding before each visit:

| Operation | `featured` |
|---|---|
| Reorder | `["telescope", "signal-loom"]` |
| Replace | `["telescope", "sound-city"]` |
| Re-feature | `["signal-loom", "telescope", "sound-city"]` |
| Remove | `["telescope", "sound-city"]` |

Each step checks exact wall links/count/indices and the retained Signal Loom page,
artwork, narrative, canonical metadata, social image, and sitemap. Fixture builds
use webpack to support shared dependencies and a local GitHub stand-in; the normal
production build below still uses the repository's default build pipeline.
The fixture is deleted afterward. Do not add Signal Loom to production to rehearse.
The other tests cover zero through five selections and existing URL preservation.

## Evidence to collect for every update

- [ ] Record the operation, incoming/outgoing slugs, intended order, copy sources,
  changed files, and commands/results in review notes.
- [ ] Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.
- [ ] Inspect the rebuilt homepage: exact membership, count, consecutive indices,
  no duplicate or empty cards, and every tile's destination.
- [ ] Visit outgoing published URLs directly after rebuilding; verify identity,
  narrative, canonical/OG metadata, `/work/<slug>/opengraph-image`, and `/sitemap.xml`.
- [ ] Inspect real-browser captures at representative phone (390px), tablet (768px),
  and desktop (1440px) widths: readable art/copy, no overflow, and intentional odd rows.
- [ ] Tab through the configured order, confirm visible focus, and activate with Enter.
  Check touch press/release and navigation, one crescendo at a time, off-screen pause,
  and legible static artwork with functional links under reduced motion.
- [ ] Verify curated fallback with missing remotes or unavailable enrichment using
  local fixtures. Separate structural assertions from actual visual inspection.
- [ ] Record agent inspection evidence separately from owner copy/artwork approval.
  Leave owner items unchecked until the owner reviews them.

For this guide's rehearsal evidence see
[ticket 05 verification](verification/featured-project-update/05/README.md).
