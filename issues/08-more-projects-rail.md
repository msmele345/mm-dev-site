# 08 — More-projects rail

## Parent

Wayfinder map: `/plan/plan-history/map.md`

## What to build

The compact "more projects" rail below the project wall: smaller high-contrast cards —
no full chameleon theming — showing breadth beyond the four featured tiles. Mix curated
non-remote projects (scholar; optionally change-buddy, infra-as-code) with a hand-picked
selection of the 82 public repos. Curated entries use the same content schema as featured
projects (minus tile identity); entries with remotes get enrichment stats. Cards link to
repo or a short curated blurb — no case-study pages at this tier.

## Acceptance criteria

- [ ] Rail renders below the project wall with visibly lighter-weight cards than the tiles
- [ ] scholar appears (no remote → curated data only, no stats, nothing broken)
- [ ] At least three additional repos appear with enriched stats
- [ ] Selection is curated in content files, not auto-pulled from all public repos
- [ ] Rail is responsive and keyboard-navigable

## Blocked by

- [04 — GitHub build-time enrichment](04-github-build-time-enrichment.md)
