# 04 — Enforce new-project readiness across registration, publication, and featuring

Status: complete

## Parent

[Featured Project Update spec](../../docs/featured-project-update-spec.md)

[Approved ticket index](README.md)

## What to build

Provide a dependable onboarding path for a future bespoke project:
complete curated content and registered art produce a working tile and case study,
while incomplete or contradictory local configuration stops the build clearly.

## Acceptance criteria

- [x] A synthetic new identity with distinct tile and case-study presentation can be authored, published, and featured through the documented extension points.
- [x] Its title, pitch, narrative, stack, theme, reviewable images, image descriptions/captions, and destination render correctly through the public pages.
- [x] Local image references resolve; labeled draft plates and draft copy keep the established review behavior.
- [x] A new identity requires no new project-specific dispatch branch in shared wall or case-study shells.
- [x] Missing/blank required content, duplicate catalogue slugs, invalid routes/URLs, unresolved assets, and missing registration fail with slug/field-specific errors.
- [x] Invalid production-shaped fixtures demonstrate actual build failure, beyond isolated validator assertions.
- [x] Missing repository/demo links and failed GitHub enrichment still render complete curated content.
- [x] The synthetic tile verifies keyboard/touch access, deliberate reduced-motion art, and the shared animation contract.
- [x] No actual new project is added to the production lineup.

## Blocked by

- [02 — Rotate the featured selection with accurate counts and responsive layout](02-rotate-featured-selection.md)
- [03 — Preserve published case studies independently of homepage featuring](03-preserve-published-case-studies.md)

## Verification

- Evidence and screenshots: [`docs/verification/featured-project-update/04/`](../../docs/verification/featured-project-update/04/README.md).
- `src/content/projects/readiness.ts` validates the catalogue and publication list;
  `next.config.ts` runs it, plus the featured-selection check, before dev or build.
- `tests/unit/project-readiness.spec.ts` covers each field rule and valid edge case.
- `tests/new-project-readiness-build.spec.ts` runs the real build against fifteen
  production-shaped invalid fixtures. Red: eleven of the first thirteen built successfully before
  the config check existed. Green: each exits 1 with the slug and problem named.
- `tests/new-project-readiness.spec.ts` onboards the test-only "Signal Loom"
  identity into an isolated app copy, builds, serves, and verifies the tile, case
  study, imagery, destinations, enrichment fallback, link-less rebuild, keyboard,
  touch, reduced-motion art, and the shared motion contract. Shared shells are
  byte-identical to production.
- The production catalogue, selection, registry, and `public/` are unchanged.
- Lint, typecheck, production build, and diff whitespace checks passed. Full suite:
  395 passed. An earlier full run had two transient failures (`chrome-shell` nav
  visibility, `published-case-studies` timeout) that did not reproduce.
- Standards and spec reviews ran; their fixes are listed in the verification README.
