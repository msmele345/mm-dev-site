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

- [x] `npm run project -- create birdsview --title "Birdsview" --source ../birdsview` has been run. The record is neither published nor featured.
- [x] `docs/project-review/birdsview.md` records the source paths read and the birdsview revision, noting any uncommitted source changes at authoring time.
- [x] Pitch, invitation, and problem/build/result story are plain English, and each claim traces to birdsview's CONTEXT, README, spec, ADRs, or data files. No usage, performance, or launch claims.
- [x] The story states birdsview is in development and names deferred work (day/night lighting and clouds, the quiz).
- [x] Any location or tour count matches `src/data/locations.json` and `src/data/tours.json` at authoring time, or the copy avoids exact counts.
- [x] `links.demo` is `https://birdsview-ochre.vercel.app` and loads birdsview. `links.repo` is absent.
- [x] Stack matches birdsview's `package.json`. The palette uses birdsview's ground, panel, ink, mute, and electric-mint accent values.
- [x] At least two SVG plates under `public/projects/birdsview/` are drawn, not traced from Google or EOX imagery. Each has visitor-facing alt text and a caption with no draft or author-instruction wording.
- [x] `draft` is `true`.
- [x] `npm run project -- check birdsview` reports content ready with no content findings. The only open gates are presentation-related.
- [x] The production `selection.json`, the other four records, and their art are unchanged.
- [x] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- [x] Owner review of pitch, invitation, and story is requested. Leave this box unchecked until the owner responds.

## Blocked by

None (can start immediately).

## Verification evidence

- Source repository: `/Users/mitchmele/a_workspace/birdsview` at revision `1fd7238284da2d74dcb7353f95f2e2033e1389c5` (clean working tree at authoring time); source paths and claim provenance recorded in [docs/project-review/birdsview.md](../../docs/project-review/birdsview.md).
- Live demo check: `curl -sSL -i --max-time 10 https://birdsview-ochre.vercel.app` returned `HTTP/2 200` serving `<title>birdsview — A world of wonder</title>`.
- Gate check (`npm run project -- check birdsview`): `Stage: authored`, `Content ready: yes`, `Presentation registered: yes`, `Presentation finished: no`, with only the expected `onboarding:unfinished` presentation finding on the untouched starter files.
- Verification commands:
  - `npm test -- tests/unit/birdsview-authoring.spec.ts` — 3 passed (after initial 3-test TDD red failure).
  - `npm run typecheck` — passed.
  - `npm run lint` — passed.
  - `npm run build` — passed (20 static routes built; `birdsview` unpublished and unfeatured).
  - `npm test` — 517 passed, 2 skipped (pre-existing skips in the suite).
- Unchanged production surfaces: `git diff` across `src/content/projects/selection.json`, the four existing project records, and their `public/projects/` directories is empty.
- Context docs (`CONTEXT.md`, `docs/GLOSSARY.md`, `docs/content-schema.md`) reviewed; featured-list updates belong to Ticket 03.
