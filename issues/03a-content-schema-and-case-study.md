# 03a — Content schema & elevated-bpm case study

## Parent

Wayfinder map: `/docs/plan/plan-history/map.md`

## What to build

The static half of the showcase tracer: the curated content schema every project shares
(ADR 0004), elevated-bpm authored in it, and its case-study page live at its own route.

The schema (ADR 0004) covers: title, slug, pitch, tile identity, story sections,
screenshots, links, stack. Every later surface consumes it — the remaining tiles
(issue 05), build-time enrichment (issue 04), and the more-projects rail (issue 08,
which uses it minus tile identity). Getting the field set right here is the point of
this slice, so it is validated by authoring a *second* project's content file
(terminal-one) against it before anything is built on top — even though terminal-one's
tile does not exist yet.

The case-study page continues the groovebox identity in static form: in-theme hero,
the story (problem → build → result), screenshots, stack badges, repo and live-demo
links. Draft the copy from elevated-bpm's own `CONCEPT.md` (sibling repo in
`~/a_workspace/`) — the user edits rather than writes from scratch, and that edit pass
does **not** block this issue closing.

Issue 02 built the chrome but no project wall, so this slice also introduces the wall
container on the home page, holding a single unthemed placeholder card that links to
the case study. Issue 03b replaces that card with the real faceplate.

## Acceptance criteria

- [ ] Content schema defined and documented, covering title, slug, pitch, tile identity, story sections, screenshots, links, stack
- [ ] Schema validated by authoring two content files against it — elevated-bpm and terminal-one — with no schema changes needed for the second
- [ ] Case-study page at its own route, rendering entirely from the content file: story, screenshots, stack badges, repo/demo links
- [ ] Case study shares the tile's palette and display face, and reuses the faceplate motif in its hero
- [ ] Project wall container on the home page with an unthemed placeholder card linking to the case study
- [ ] Draft copy sourced from elevated-bpm's `CONCEPT.md` and flagged for user review — review is non-blocking, the slice ships with draft copy in place
- [ ] Deployed: the case-study route loads on the live URL

## Blocked by

- [02 — Chrome shell](02-chrome-shell.md)
