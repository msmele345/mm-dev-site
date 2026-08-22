# 05 — Remaining three tiles

## Parent

Wayfinder map: `/plan/plan-history/map.md`

## What to build

Repeat the pattern proven in issues 03a and 03b for the other three featured projects —
each a curated content file, a chameleon tile with the three motion states, and an
in-identity case-study page:

- **terminal-one** → trading terminal: scrolling ticker tape, green phosphor numbers,
  a slot-machine flourish in the crescendo. Story angle: Spring Boot + desktop monorepo,
  deterministic recommendation engine.
- **telescope** → star field: twinkling stars ambient; a constellation draws itself on
  crescendo. Story angle: shipped product, rendering the real sky.
- **sound-city** → club flyer: grainy dark poster, neon "TONIGHT" energy. Story angle:
  event-data ingestion for Chicago house/techno.

Draft case-study copy from each project's own docs (README/PRD/HOW_IT_WAS_BUILT). The
project wall composes all four tiles; only one tile crescendos at a time (ADR 0006).

## Acceptance criteria

- [ ] All three tiles on the project wall with static, ambient, and crescendo states
- [ ] Case-study page per project in its identity, with story, screenshots, stack badges, repo/demo links
- [ ] Draft copy sourced from each project's docs, flagged for user review
- [ ] Only one tile in crescendo at a time; wall stays performant with four ambient tiles (no jank on mid-range mobile)
- [ ] Enrichment stats appear on all three (their repos have remotes)

## Blocked by

- [03a — Content schema & elevated-bpm case study](03a-content-schema-and-case-study.md)
- [03b — Groovebox tile & motion system](03b-groovebox-tile-and-motion.md)
