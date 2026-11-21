# 03 — Lead the Project wall with birdsview

Status: ready-for-agent

## Parent

[Birdsview featured project spec](../../docs/birdsview-featured-project-spec.md)

[Approved ticket index](README.md)

## What to build

Feature birdsview at position 1. The Project wall and the Site intro index read
birdsview, elevated-bpm, terminal-one, telescope, sound-city, numbered 01–05.
birdsview's index row carries its invitation and accent. Update tests that
hard-code the four-project production order, and update the docs that list the
featured projects.

## Acceptance criteria

- [ ] Tests asserting the new five-project order are written first and fail before the selection changes. Tests that hard-coded the old order read it from the selection where practical instead of hard-coding the new one.
- [ ] `npm run project -- feature birdsview --position 1` reports the exact order above, and `selection.json` contains birdsview once in `featured`.
- [ ] The wall shows five tiles with consecutive indices 01–05 and no duplicate or empty cards. The odd fifth tile sits in normal grid order at 390, 768, and 1440px.
- [ ] The Site intro index lists birdsview first with its invitation and accent. Hovering or focusing its row crescendos the birdsview tile.
- [ ] birdsview is first in keyboard order, has visible focus, and opens `/work/birdsview` on Enter. Touch press, release, and navigation work.
- [ ] Only one tile crescendos at a time across all five.
- [ ] The four existing tiles keep their art, slugs, invitations, and destinations; only their visible positions shift.
- [ ] `npm run project -- verify birdsview` passes with featured checks, and its evidence report is linked from this ticket.
- [ ] `CONTEXT.md` and ADR 0002 list birdsview and its art direction. ADR 0004 is updated if its project list would otherwise be wrong. No other stale four-project references remain in the context docs.
- [ ] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

## Blocked by

- [02 — Build the globe tile and publish the case study](02-globe-tile-and-publish.md)
