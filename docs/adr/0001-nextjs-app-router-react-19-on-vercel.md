# ADR 0001 — Next.js App Router + React 19 on Vercel

Status: accepted — 2026-08-17

## Context

The site is a static-first portfolio + blog with rich interactive project tiles, MDX
content, and build-time data enrichment. The owner already runs Next.js in telescope and
sound-city, and Vite SPAs elsewhere. A Vite SPA would require hand-rolling blog routing,
MDX, RSS, OG images, and SEO; Astro would be a new stack whose islands model adds
ceremony around the React-heavy chameleon tiles.

## Decision

Build with **Next.js (App Router) and React 19**, deployed on **Vercel**.

## Consequences

- MDX, image optimization, metadata/OG APIs, and static generation come built-in.
- Chameleon tiles are client components inside otherwise-static pages; keep them
  islands-shaped so the rest of the site stays static.
- Build-time GitHub enrichment runs during static generation (revalidated builds keep
  stats fresh — see [ADR 0004](0004-curated-content-plus-build-time-github-enrichment.md)).
- Zero-config deploy; custom domain connects later without code change.
