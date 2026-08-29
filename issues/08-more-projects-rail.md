# 08 — More-projects rail

## Parent

Wayfinder map: `/docs/plan/plan-history/map.md`

## What to build

The compact "more projects" rail below the project wall: smaller high-contrast cards —
no full chameleon theming — showing breadth beyond the four featured tiles. Mix curated
non-remote projects (scholar; optionally change-buddy, infra-as-code) with a hand-picked
selection of the 82 public repos. Curated entries use the same content schema as featured
projects (minus tile identity); entries with remotes get enrichment stats. Cards link to
repo or a short curated blurb — no case-study pages at this tier.

## Acceptance criteria

- [x] Rail renders below the project wall with visibly lighter-weight cards than the tiles
- [x] ~~scholar appears~~ — dropped at the owner's request (unfinished side idea).
      The no-remote path it was meant to prove is covered by `tests/unit/rail.spec.ts`
      instead, so a future entry without a remote still renders as a complete card.
- [x] At least three additional repos appear with enriched stats
- [x] Selection is curated in content files, not auto-pulled from all public repos
- [x] Rail is responsive and keyboard-navigable

## Blocked by

- [04 — GitHub build-time enrichment](04-github-build-time-enrichment.md)
