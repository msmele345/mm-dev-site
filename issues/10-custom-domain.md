# 10 — Custom domain

## Parent

Wayfinder map: `.scratch/site-v1/map.md`

## What to build

Put the site on its own name (ADR / wayfinder decision 11 — Deploy & domain). The
domain purchase is **HITL — the user picks and buys the name** (e.g. mitchmele.dev);
this issue then connects it to the Vercel project, verifies DNS/SSL, and updates
site metadata so canonical URLs, RSS, and OG images point at the custom domain.

## Acceptance criteria

- [ ] User has chosen and purchased the domain (checklist handed to user if needed)
- [ ] Domain connected to the Vercel project; HTTPS serving on apex and/or www with redirect settled
- [ ] Canonical URLs, sitemap/robots, RSS links, and OG metadata use the custom domain
- [ ] `.vercel.app` URL still resolves (redirects to the domain)

## Blocked by

- [01 — Scaffold & first deploy](01-scaffold-and-first-deploy.md)
- (Purchase step can happen anytime; wiring waits on a deployed project)
