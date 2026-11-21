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

- [ ] Tests for the rendered birdsview case study and tile are written first and fail before the art and publication exist.
- [ ] `identities/birdsview/` holds a default-export `Tile.tsx`, `Artwork.tsx`, and a namespaced `identity.css`. Registration is regenerated with `npm run project -- sync`, and no project-specific branch is added to shared wall or case-study shells.
- [ ] The `onboarding:unfinished` marker is removed, and `npm run project -- check birdsview` reports all publication gates passing.
- [ ] The tile uses one accessible link to `/work/birdsview`, shared `TileMeta`, the supplied index, and the shared motion wrapper. Decorative art is hidden from assistive technology.
- [ ] Static, ambient, and crescendo states follow the shared motion contract. Reduced motion shows the composed static art. Off-screen animation pauses. Motion carries no essential information.
- [ ] The rendered display face is Libre Caslon Display, checked in the browser, not assumed from `displayFace`.
- [ ] The accent reads as birdsview's own colour, distinct from the Chrome's electric lime, and meets the contrast checks in the guide.
- [ ] `npm run project -- publish birdsview` adds the slug to `published` only. `featured` is unchanged.
- [ ] `npm run project -- verify birdsview` passes. Its evidence report (narrative, art, plates, alt text, captions, demo link present, repo link absent, canonical/OG metadata, social image, sitemap, captures at 390/768/1440px) is linked from this ticket.
- [ ] The case study renders complete curated content with no repository link and no enrichment.
- [ ] The other four case studies and tiles are unchanged.
- [ ] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- [ ] Owner review of the tile and case-study art direction is requested. Leave this box unchecked until the owner responds.

## Blocked by

- [01 — Author the birdsview record and plates](01-author-record-and-plates.md)
