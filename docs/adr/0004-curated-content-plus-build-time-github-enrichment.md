# ADR 0004 — Curated content + build-time GitHub enrichment

Status: accepted — 2026-08-17

## Context

Of the showcased projects, only elevated-bpm, terminal-one, telescope, and sound-city
have GitHub remotes (github.com/msmele345). scholar has no remote; change-buddy and
infra-as-code aren't git repos. A purely API-driven site would drop them and surrender
narrative control; a purely hand-written site lets stats rot.

## Decision

- Every project is a **curated content file** (title, pitch, tile identity, screenshots,
  links, stack) — the owner controls the story.
- At **build time**, live stats (commit count, last-push date, language mix) are fetched
  from the GitHub API for repos with remotes and layered onto the curated data.
- **No runtime GitHub dependency.** Enrichment failures degrade gracefully to curated
  data alone; missing-remote projects simply render without live stats.

## Consequences

- Requires a `GITHUB_TOKEN` build env var for rate limits (a setup task).
- Stats freshness is bounded by build frequency; periodic rebuilds (cron/ISR) keep
  "last active" honest.
- The "more projects" rail can mix curated non-remote projects with selected live repos.
