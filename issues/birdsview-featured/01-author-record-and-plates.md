# 01 — Author the birdsview record and plates

Status: ready-for-agent

## Parent

[Birdsview featured project spec](../../docs/birdsview-featured-project-spec.md)

[Approved ticket index](README.md)

## What to build

Create birdsview as an authored, unpublished, unfeatured project whose curated
content is complete: plain-English pitch and story grounded in the birdsview
repository, an invitation, stack, demo link, palette and display identity, and
at least two SVG plates. `npm run project -- check birdsview` reports the content
gate as ready. The tile and case-study art are left as the starters `create`
produces; ticket 02 builds them.

The copy says birdsview is in development (release one in progress) and names what
is deferred. Counts come from birdsview's data files, not its README, which is
stale.

## Acceptance criteria

- [ ] `npm run project -- create birdsview --title "Birdsview" --source ../birdsview` has been run. The record is neither published nor featured.
- [ ] `docs/project-review/birdsview.md` records the source paths read and the birdsview revision, noting any uncommitted source changes at authoring time.
- [ ] Pitch, invitation, and problem/build/result story are plain English, and each claim traces to birdsview's CONTEXT, README, spec, ADRs, or data files. No usage, performance, or launch claims.
- [ ] The story states birdsview is in development and names deferred work (day/night lighting and clouds, the quiz).
- [ ] Any location or tour count matches `src/data/locations.json` and `src/data/tours.json` at authoring time, or the copy avoids exact counts.
- [ ] `links.demo` is `https://birdsview-ochre.vercel.app` and loads birdsview. `links.repo` is absent.
- [ ] Stack matches birdsview's `package.json`. The palette uses birdsview's ground, panel, ink, mute, and electric-mint accent values.
- [ ] At least two SVG plates under `public/projects/birdsview/` are drawn, not traced from Google or EOX imagery. Each has visitor-facing alt text and a caption with no draft or author-instruction wording.
- [ ] `draft` is `true`.
- [ ] `npm run project -- check birdsview` reports content ready with no content findings. The only open gates are presentation-related.
- [ ] The production `selection.json`, the other four records, and their art are unchanged.
- [ ] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- [ ] Owner review of pitch, invitation, and story is requested. Leave this box unchecked until the owner responds.

## Blocked by

None (can start immediately).
