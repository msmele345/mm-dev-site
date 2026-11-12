# Publish the featured case studies

## Parent

None. Follow-up to the shipped case studies
([03a — Content schema & elevated-bpm case study](03a-content-schema-and-case-study.md),
[05 — Remaining three tiles](05-remaining-three-tiles.md)).
Those slices closed with the plates as the screenshots.
[09 — Polish & audit](09-polish-and-audit.md) left them as SVGs.
The wayfinder map is complete; this is not a new slice on it.

This ticket began as "Publish the case-study plates" and covered only the plate
words and the draft flag. It now covers the whole cleanup of the four authored
records in `src/content/projects/authored/`: placeholders, wrong demo links,
and a plain-English pass on the copy.

## What to build

The four featured case studies are about to take traffic. Three things stand
between the authored records and a published state:

1. **Placeholders.** Every plate caption ends with an instruction to the
   author ("Replace with a live capture."), every alt calls the image a "Draft
   plate," and five SVGs repeat that in `<title>`.
2. **Wrong demo links.** Two records point at `vercel.app` domains that are not
   the project's deployment.
3. **Jargon-heavy copy.** Pitches and story sections read like internal design
   notes. A visitor should understand them without knowing the codebase.

When all three are done, flip `draft` to `false` on the four records so the
"Draft copy — pending review" banner goes away. The flip is the last step.

Keep the plate files, their `src` paths, the "Plates" heading, the titles,
slugs, invitations, tile identities, and stack lists.

### 1. Plates

The labeled-draft-plate convention stays valid for a project that is still being
authored. This ticket covers only the four featured records:

| Project | File | Alt | Caption |
| --- | --- | --- | --- |
| elevated-bpm | `deck.svg` | EB-01 deck: sixteen step keys in four colors and pads labeled kick, clap, closed hat, and open hat. | The faceplate. Sixteen steps and four drum pads. |
| elevated-bpm | `arc.svg` | Lesson arc labeled silence to groove, step 04 of 14, clap on 2 and 4. | The lesson arc, from silence to a first groove. |
| terminal-one | `console.svg` | Portfolio console with AAPL and NVDA quotes, a delayed advisory notice, and a pull lever control. | The portfolio console. Delayed quotes, advisory only. |
| terminal-one | `ledger.svg` | Paper and taken ledger with SPY, QQQ, and NVDA rows, rank, state, and a why-this-trade note. | The paper and taken ledger. |
| telescope | `sky.svg` | Local sky at 22:14 with stars, Orion line art, a horizon, and compass headings. | The local sky and horizon. |
| telescope | `lesson.svg` | Orion line art beside a constellation lesson panel and a read the myth control. | A constellation, then the lesson. |
| sound-city | `queue.svg` | Chicago review queue with Smartbar, Podlasie, and Spybar rows, source evidence, and accept or reject controls. | The review queue and its source trail. |
| sound-city | `events.svg` | Tonight listing for Chicago with Smartbar at 23:00 and Podlasie Club at 22:00, both source verified. | The Chicago event finder. |

SVG `<title>` values that currently say "draft plate" take these names:
"Terminal One paper and taken ledger", "Telescope local sky",
"Telescope constellation lesson", "Sound City review queue",
"Sound City events". `deck.svg`, `arc.svg`, and `console.svg` have no title;
leave them untitled. `<desc>` text already describes the drawing; leave it
unless it disagrees with the new alt.

### 2. Demo links

Use each repository's GitHub homepage URL as the source of truth:

| Project | Currently in the record | Correct |
| --- | --- | --- |
| telescope | `https://telescope.vercel.app` | `https://telescope-lake.vercel.app` |
| sound-city | `https://sound-city.vercel.app` (serves an unrelated page titled "Vite App") | `https://sound-city-ten.vercel.app` |
| elevated-bpm | `https://elevated-bpm-dusky.vercel.app` | unchanged |
| terminal-one | none | none (desktop app, no demo) |

Confirm each corrected URL loads the right project before committing.

### 3. Plain-English copy

Rewrite `pitch` and the `story` headings and bodies in plain, simple language.
Say what the project does and why before how it is built. Name a technology
only where it helps a visitor; the `stack` list already carries the rest.

Rules:

- Ground every claim in the sibling repository's README, CONCEPT, or PRD under
  `~/a_workspace/`. Drop any claim that cannot be found there.
- Keep the three-section shape: problem, build, result.
- Work one project at a time. Mitch reviews each project's copy before the
  next one starts.
- `pitch` also renders on the wall tile, the page metadata, and the OG
  description, so check it reads well in all three.

Known lines to rewrite (a starting list, not a limit):

| Project | Field | Line |
| --- | --- | --- |
| elevated-bpm | pitch | "goal-checked curriculum woven into the live instrument" |
| elevated-bpm | build body | "declarative goals checked against live pattern state"; "one local ProjectState document"; "The DAW is architecture, not UI" |
| terminal-one | pitch | "deterministic options-trade recommendation engine" |
| terminal-one | build heading | "Rules engine, neon thin client" |
| terminal-one | build body | "JWT auth"; "greeks and IV are computed in-house" |
| terminal-one | result body | "EOD batch plus on-demand lever pulls emit ranked, explainable trades" |
| telescope | build body | "sky-math, time-controller, star-catalog, and zipcode modules"; "Instanced points" |
| telescope | result body | "A Hipparcos cross-match raised star-distance coverage from 34% to more than 99%" — verify against the telescope repo or drop |
| sound-city | pitch | "source-verified Chicago event data — from discovery and ingestion through a maintainer review queue" |
| sound-city | build body | "route handlers… model city-aware events"; "Refresh targets produce reviewable suggestions" |

### 4. Tests that change

Banner assertions that currently expect "Draft copy" to be visible on a featured
case study, and must expect it absent:

- `tests/remaining-three-tiles.spec.ts` — three assertions, one per case study
- `tests/content-schema-and-case-study.spec.ts`
- `tests/published-case-studies.spec.ts`

Image-name assertions that the new alts break:

- `tests/remaining-three-tiles.spec.ts` — `/local night sky/i` (new alt starts
  "Local sky at 22:14")
- `tests/remaining-three-tiles.spec.ts` — `/event review queue/i` (new alt
  starts "Chicago review queue")

Copy pins that the rewrite may break; update them to the approved copy:

- `tests/remaining-three-tiles.spec.ts` — "9,000 real stars",
  "source-verified chicago event data"
- `tests/content-schema-and-case-study.spec.ts` and
  `tests/published-case-studies.spec.ts` — the elevated-bpm headings "The
  instrument came last", "Instrument first, curriculum inside", "Silence to
  groove"

Demo-link assertions for telescope and sound-city in
`tests/remaining-three-tiles.spec.ts` take the corrected URLs.

## Out of scope

Live captures, new image files, tile art, the "Plates" heading, titles, slugs,
invitations, stack lists, readiness rules, and the draft-plate examples in
`docs/project-update-guide.md`, `docs/content-schema.md`, and the synthetic
fixtures (`signal-loom` and the showcase-app helper). A future project may
still ship a labeled draft plate.

## Acceptance criteria

- [ ] Red first: a test fails while any of the four featured case studies still renders "Replace with a live capture", an alt or caption containing "Draft plate", or "Draft copy — pending review".
- [ ] The eight alts and captions in `src/content/projects/authored/` match the table above, and each still describes only what that SVG draws.
- [ ] The five SVG titles that say "draft plate" use the names above. The three plates with no title stay untitled.
- [ ] The telescope and sound-city demo links match the table above, and each loads the right project.
- [ ] Each project's pitch and story are rewritten in plain English, with every claim traceable to the sibling repository's documents, and approved by Mitch.
- [ ] `draft` is `false` on elevated-bpm, terminal-one, telescope, and sound-city, flipped after the copy is approved.
- [ ] The tests listed under "Tests that change" are updated: the banner is expected absent on the featured case studies, and the image-name, copy, and demo-link assertions match the new content.
- [ ] Readiness still accepts a labeled draft plate on an unfinished record. The synthetic fixtures and the project-update guide template still use one.
- [ ] `npm test`, `npm run lint`, and `npm run typecheck` pass.

## Blocked by

None. Can start immediately.
