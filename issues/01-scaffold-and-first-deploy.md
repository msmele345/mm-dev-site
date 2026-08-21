# 01 — Scaffold & first deploy

## Parent

Wayfinder map: `/plan/plan-history/map.md`

## What to build

A running, deployed skeleton: a Next.js App Router + React 19 app that ships to Vercel
and renders a placeholder home page already wearing the site's skin — ink-black ground,
stark white type, electric lime accent, and the display/body type choices established as
design tokens (see ADR 0001, ADR 0003). This is the tracer through the whole delivery
pipeline: repo → build → live URL.

## Acceptance criteria

- [ ] Fresh Next.js App Router project with React 19 builds and runs locally
- [ ] Color and typography design tokens defined once and used by the placeholder page (no hardcoded hex in components)
- [ ] Placeholder home renders ink-black ground, white type, lime accent — visibly the site's aesthetic, not a framework default page
- [ ] Deployed to Vercel; live `.vercel.app` URL loads the placeholder
- [ ] Lint + typecheck pass in the build

## Blocked by

None - can start immediately
