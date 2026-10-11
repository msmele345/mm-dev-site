# Ticket 04 — New-project readiness

Verification date: 2026-10-11.

## Behavior

`next.config.ts` now validates the authored catalogue, the published case-study
list, and the featured selection before `next dev` or `next build` does anything
else. `src/content/projects/readiness.ts` checks local content only: slug format
and uniqueness, title, pitch, stack, tile identity and hex palette, the
problem/build/result narrative, the draft flag, at least one screenshot or draft plate with a
resolvable `public/` source (matched case-exactly, so a path that only works on
a case-insensitive disk is rejected), description and caption, and optional HTTPS
repository/demo links. Published slugs must name an authored project exactly once.
Every error names the slug and the field or relationship.

A published slug nobody authored used to prerender a silent 404; it now stops the
build. A missing presentation registration is not a config-time check: it fails
where the artwork is resolved, while prerendering the home page (featured) or
`/work/<slug>` (published). The fixture covers the featured route.

The rules apply to every authored record, not only published or featured ones, so
an unfinished record cannot sit in the catalogue. `tile.displayFace` is checked
for presence only; a face `src/fonts.ts` does not load falls back to the chrome
display face, as it does for three of the four production projects.

Enrichment is untouched: a missing remote or a failed GitHub lookup is never a
readiness failure. The production lineup, registry, and `public/` are unchanged.

## Synthetic identity

"Signal Loom" exists only under `tests/support/synthetic-identity/` and is written
into an isolated copy of the app by `addSyntheticIdentity`: a content record, a
published slug, a bespoke tile and case-study artwork with their styles, a local
draft plate, and one registry line. The helper edits no shared shell: `ProjectWall.tsx`, `CaseStudy.tsx`, and
`fonts.ts` in the onboarded copy stay byte-identical to production, and the tile
and artwork still render, which is what shows no dispatch branch was needed.

`tests/new-project-readiness.spec.ts` builds and serves that copy and checks,
through the public pages:

- the tile's index, title, pitch, palette, bespoke art, and destination
- the case study's title, pitch, motif, narrative, stack, artwork, draft flag,
  plate description/caption, plate asset response, repository/demo controls,
  canonical metadata, social image, and sitemap entry
- curated content with no statistics when the GitHub stand-in has no such
  repository (the neighbouring Telescope tile still shows its statistics)
- a rebuild with `draft: false` and `links: {}`: no draft flag, no link controls,
  complete tile and case study
- deliberate static art under reduced motion, ambient → crescendo on hover and
  keyboard focus, a single crescendo at a time, off-screen pause, Enter and touch
  activation, and no horizontal overflow at 390px

## Build failures

`tests/new-project-readiness-build.spec.ts` runs `npm run build` against fifteen
production-shaped fixtures, each wrong in one way: blank title, missing pitch, empty
stack, blank narrative body, missing image description, unresolved local image, mis-cased local image,
non-HTTPS repository, placeholder demo, invalid route slug, duplicate catalogue
slug, unauthored published slug, twice-published slug, featured-but-unpublished project, and missing
registration. Each exits 1 with the named error.

Red first: before the config check existed, eleven of the original thirteen builds
succeeded. Only the unpublished-featured and missing-registration cases already
failed.

`tests/unit/project-readiness.spec.ts` covers each field rule and the valid edge
cases directly.

The fixtures build with webpack, as the existing isolated-app harness does; the
repository's own Turbopack production build passes with the check in place.

## Required checks

- Lint, typecheck, production build, and `git diff --check`: passed.
- Full suite: 395 passed.
- An earlier full run, started straight after a production build, had two
  failures — `chrome-shell` (primary nav not visible) and
  `published-case-studies` (360s timeout). Neither reproduced in isolation or in
  later full runs.
- Standards and spec reviews ran. Fixed from them: draft-flag check, four-colour
  `steps`, case-exact asset resolution, a twice-published build fixture, and the
  `tile` row in `docs/content-schema.md`.

## Visual evidence

- `wall-1440.png`, `wall-390.png` — the synthetic tile beside Telescope in its
  static state
- `case-study-1440.png` — the synthetic case study with draft flag, artwork,
  narrative, draft plate, stack, and destinations
