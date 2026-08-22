# Repository Context

## Product

mm-dev-site is Mitch Mele's personal portfolio and development blog.

The site should feel like a showcase rather than a conventional portfolio template:
high-contrast, visually memorable, and expressive enough that each featured project
can carry its own identity.

## Experience Model

The site has two visual layers:

1. **Chrome** — the shared navigation, hero, blog, contact, and footer. It uses an
   ink-black background, white typography, and electric-lime accents.
2. **Chameleon tiles** — featured-project cards that become miniature versions of the
   projects they represent. Each tile has its own art direction while remaining part
   of the same project wall.

Featured projects:

- **elevated-bpm** — groovebox
- **terminal-one** — trading terminal
- **telescope** — star field
- **sound-city** — club flyer

## Product Principles

- The work should be experienced visually, not merely listed.
- Project personality belongs inside the tiles and case studies.
- Shared chrome remains visually consistent and lets project identities stand out.
- Motion enhances the experience but never carries essential information.
- Reduced-motion users receive deliberate static artwork, not a degraded experience.
- Case-study copy should be grounded in each source repository's actual documentation.
- Curated project content remains useful when external services are unavailable.

## Architecture Commitments

These are established decisions, not defaults to reconsider during individual issues:

- Next.js App Router with React 19
- Vercel deployment
- In-repository MDX blog
- Curated project content files
- GitHub metadata added at build time only
- No runtime GitHub API dependency
- No headless CMS for v1
- No light/dark theme toggle for v1
- Four fully themed featured projects, followed by a lighter more-projects rail

See [`docs/adr/`](docs/adr/) for the decisions and their rationale.

## Motion Model

Chameleon tiles use three states:

- **Static** — frozen, legible artwork for reduced-motion users
- **Ambient** — subtle idle motion
- **Crescendo** — the active state triggered by hover, keyboard focus, or the
  established mobile interaction

Only one tile should crescendo at a time.

## Content Provenance

Source projects live as sibling repositories under `~/a_workspace/`.

When writing case-study content:

1. Read that project's `CONCEPT.md`, PRD, README, or equivalent design documents.
2. Treat those documents as raw material rather than inventing claims.
3. Keep curated copy in this repository as the site's presentation-layer source of
   truth.
4. Do not make unsupported claims about production use, performance, or outcomes.

## Sources of Truth

Use the narrowest applicable source:

1. The selected file in [`issues/`](issues/) — task scope, dependencies, and
   acceptance criteria
2. [`docs/adr/`](docs/adr/) — architectural and product decisions
3. [`docs/GLOSSARY.md`](docs/GLOSSARY.md) — domain terminology
4. [`docs/plan/plan-history/map.md`](docs/plan/plan-history/map.md) — planning history
   and overall destination
5. [`AGENTS.md`](AGENTS.md) — implementation workflow and repository rules
6. [`README.md`](README.md) — setup and developer commands

If documents disagree, stop and resolve the contradiction instead of silently
choosing one.

## Scope Discipline

Work against one selected issue at a time.

- Implement only that issue's acceptance criteria and required enabling work.
- Do not pull later-issue functionality forward merely because it is adjacent.
- Preserve explicit v1 exclusions.
- Update an ADR when deliberately changing an established decision.
- Do not use this document as a running task log.

## Vocabulary

Use the terms defined in [`docs/GLOSSARY.md`](docs/GLOSSARY.md), especially:

- Chrome
- Chameleon tile
- Project wall
- Case study
- More-projects rail
- Ambient state
- Crescendo
- Static state
- Curated content
- Enrichment
