# Wayfinder map — mm-dev-site v1

Label: wayfinder:map
Status: complete — destination reached 2026-08-17

## Destination

An approved, implementation-ready set of vertical-slice issues in `/issues` for v1 of
Mitch Mele's personal site + blog: a dazzling, high-contrast, poppy showcase of existing
dev projects. The map is done when any agent could pick up issue 01 and start building.

## Notes

- Domain: personal portfolio + blog. Owner: Mitch Mele (github: msmele345).
- Skills to consult during implementation: `frontend-design`, `vercel:nextjs`,
  `vercel-react-best-practices`, `web-design-guidelines`.
- Source projects live as siblings in `~/a_workspace/` — their CONCEPT/PRD/README docs
  are the raw material for case-study copy.
- ADRs recording these decisions live in `docs/adr/`; vocabulary in `docs/GLOSSARY.md`.
- This map was charted and worked in a single compressed session at the user's request
  (full pipeline: /wayfinder → /grill-with-docs → /to-issues).

## Decisions so far

- [01 — Showcase concept](docs/plan/site-v1/01-showcase-concept.md) — Chameleon tiles: each project card is a mini-world in that project's own visual identity.
- [02 — Chrome aesthetic](issues/02-chrome-aesthetic.md) — Ink-black ground, stark white type, electric lime accent.
- [03 — Brand wordmark](issues/03-brand-wordmark.md) — MITCH MELE, the real name set huge.
- [04 — Featured projects](issues/04-featured-projects.md) — elevated-bpm, terminal-one, telescope, sound-city; each gets a full tile.
- [05 — Project data source](issues/05-project-data-source.md) — Curated content files + build-time GitHub enrichment for repos with remotes.
- [06 — Stack](issues/06-stack.md) — Next.js App Router + React 19, deployed on Vercel.
- [07 — Blog authoring](issues/07-blog-authoring.md) — MDX in-repo; React components embeddable in posts.
- [08 — Tile click destination](issues/08-tile-click-destination.md) — Full case-study page per project, in that project's identity.
- [09 — v1 scope](issues/09-v1-scope.md) — Core + about/hero/contact, RSS + OG images, "more projects" rail. No theme toggle.
- [10 — Motion policy](issues/10-motion-policy.md) — Ambient idle + hover crescendo; prefers-reduced-motion freezes to static art.
- [11 — Deploy & domain](issues/11-deploy-and-domain.md) — Vercel; custom personal domain connected post-launch.

## Not yet specified

(Empty — all remaining work graduated into implementation issues at `/issues/`.
Per-tile art direction is specified inside each tile's issue; remaining HITL tasks
— domain purchase, GitHub token — are issues there too.)

## Out of scope

- **Dark/light theme toggle** — the ink-black identity *is* the design; a light mode dilutes it (ruled out in [09 — v1 scope](issues/09-v1-scope.md)).
- **Runtime GitHub API rendering** — stats are build-time only; no runtime dependency (ruled out in [05 — Project data source](issues/05-project-data-source.md)).
- **Headless CMS** — single-author blog doesn't warrant a service dependency (ruled out in [07 — Blog authoring](issues/07-blog-authoring.md)).
- **Showcasing all 82 public repos** — only a curated "more projects" rail beyond the four featured tiles.
