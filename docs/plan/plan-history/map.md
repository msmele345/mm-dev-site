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

## Implementation slices

- [01 — Scaffold & first deploy](../../../issues/01-scaffold-and-first-deploy.md) — Next.js and React foundation, visual tokens, CI, and the first Vercel deployment.
- [02 — Chrome shell](../../../issues/02-chrome-shell.md) — Navigation, wordmark, hero/about, contact links, footer, and metadata.
- [03a — Content schema & elevated-bpm case study](../../../issues/03a-content-schema-and-case-study.md) — Curated project content and the first full case-study route.
- [03b — Groovebox tile & motion system](../../../issues/03b-groovebox-tile-and-motion.md) — The first chameleon tile and reusable static, ambient, and crescendo states.
- [04 — GitHub build-time enrichment](../../../issues/04-github-build-time-enrichment.md) — Build-time repository statistics with graceful fallback behavior.
- [05 — Remaining three tiles](../../../issues/05-remaining-three-tiles.md) — terminal-one, telescope, and sound-city tiles and case studies.
- [06 — MDX blog](../../../issues/06-mdx-blog.md) — In-repository posts, blog routes, code presentation, and interactive embeds.
- [07 — RSS + OG images](../../../issues/07-rss-and-og-images.md) — Feed generation and branded sharing images.
- [08 — More-projects rail](../../../issues/08-more-projects-rail.md) — A curated, lightweight showcase below the featured project wall.
- [09 — Polish & audit](../../../issues/09-polish-and-audit.md) — Accessibility, motion, performance, and responsive review.
- [10 — Custom domain](../../../issues/10-custom-domain.md) — Domain, DNS, HTTPS, and canonical URL setup.

## Not yet specified

(Empty — all remaining work graduated into implementation issues at `/issues/`.
Per-tile art direction is specified inside each tile's issue; remaining HITL tasks
— domain purchase, GitHub token — are issues there too.)

## Out of scope

- **Dark/light theme toggle** — the ink-black identity *is* the design; a light mode dilutes it (ruled out in [09 — v1 scope](09-v1-scope.md)).
- **Runtime GitHub API rendering** — stats are build-time only; no runtime dependency (implemented through [04 — GitHub build-time enrichment](../../../issues/04-github-build-time-enrichment.md)).
- **Headless CMS** — single-author blog doesn't warrant a service dependency (implemented through [06 — MDX blog](../../../issues/06-mdx-blog.md)).
- **Showcasing all 82 public repos** — only a curated "more projects" rail beyond the four featured tiles.
