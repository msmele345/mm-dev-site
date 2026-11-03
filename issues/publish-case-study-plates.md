# Publish the case-study plates

## Parent

None. Follow-up to the shipped case studies
([03a — Content schema & elevated-bpm case study](03a-content-schema-and-case-study.md),
[05 — Remaining three tiles](05-remaining-three-tiles.md)).
Those slices closed with the plates as the screenshots.
[09 — Polish & audit](09-polish-and-audit.md) left them as SVGs.
The wayfinder map is complete; this is not a new slice on it.

## What to build

The four featured case studies are about to take traffic. Each one renders two
SVG plates under the heading "Plates," and every caption currently ends with an
instruction to the author: "Replace with a live capture." The alt text calls
each image a "Draft plate." Five of the SVGs repeat that in `<title>`. All four
records also have `draft: true`, so the page opens with "Draft copy — pending
review."

Publish the plates as the finished images. Keep the files, the `src` paths, and
the "Plates" heading. Rewrite the visitor-facing words so they name what the
drawing shows. Clear the draft flag on the four featured records so the review
banner goes with the instruction. Story bodies stay as they are.

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

SVG `<title>` values that currently say "draft plate" take the same names:
"Terminal One paper and taken ledger", "Telescope local sky",
"Telescope constellation lesson", "Sound City review queue",
"Sound City events". `deck.svg`, `arc.svg`, and `console.svg` have no title;
leave them untitled. `<desc>` text already describes the drawing; leave it
unless it disagrees with the new alt.

Out of scope: live captures, new image files, tile art, story copy, the
"Plates" heading, readiness rules, and the draft-plate examples in
`docs/project-update-guide.md`, `docs/content-schema.md`, and the synthetic
fixtures (`signal-loom` and the showcase-app helper). A future project may
still ship a labeled draft plate.

## Acceptance criteria

- [ ] Red first: a test fails while any of the four featured case studies still renders "Replace with a live capture", an alt or caption containing "Draft plate", or "Draft copy — pending review".
- [ ] The eight alts and captions in `src/content/projects/authored/` match the table above, and each still describes only what that SVG draws.
- [ ] The five SVG titles that say "draft plate" use the names above. The three plates with no title stay untitled.
- [ ] `draft` is `false` on elevated-bpm, terminal-one, telescope, and sound-city. Story headings and bodies are unchanged.
- [ ] `tests/content-schema-and-case-study.spec.ts` and `tests/published-case-studies.spec.ts` expect the review banner to be absent on the featured case studies. Image-name assertions still pass against the new alt text.
- [ ] Readiness still accepts a labeled draft plate on an unfinished record. The synthetic fixtures and the project-update guide template still use one.
- [ ] `npm test`, `npm run lint`, and `npm run typecheck` pass.

## Blocked by

None. Can start immediately.
