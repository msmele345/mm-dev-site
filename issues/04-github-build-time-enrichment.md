# 04 — GitHub build-time enrichment

## Parent

Wayfinder map: `/plan/plan-history/map.md`

## What to build

Build-time enrichment per ADR 0004: at build, fetch live stats (commit count, last-push
date, language mix) from the GitHub API for projects whose curated content declares a
remote (github.com/msmele345), and layer them onto the tile and case-study page —
e.g. a "last active" line and language chips rendered in the chrome's lime accent.

Failures and missing remotes degrade gracefully: curated content renders alone, nothing
breaks. Requires a `GITHUB_TOKEN` env var on Vercel (task within this issue: the user
creates the token; wiring it via `vercel env` is part of the slice). Include a
periodic-rebuild mechanism so stats don't rot between deploys.

## Acceptance criteria

- [ ] elevated-bpm tile and case study show live commit count, last-push date, and language mix after a build
- [ ] A project without a remote (e.g. scholar, later) renders fully without stats — verified by test or demo
- [ ] API failure or missing token falls back to curated-only rendering with a build warning, not a build failure
- [ ] `GITHUB_TOKEN` configured in Vercel envs; documented in the README
- [ ] Scheduled rebuild (cron or equivalent) keeps stats fresh without manual deploys

## Blocked by

- [03a — Content schema & elevated-bpm case study](03a-content-schema-and-case-study.md)
- [03b — Groovebox tile & motion system](03b-groovebox-tile-and-motion.md)
