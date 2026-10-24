# ADR 0007 — Generated, checked-in showcase registration

Status: accepted — 2026-10-23

## Context

Registering a project used to mean hand-editing shared source: an import line and an
array entry in `catalog.ts`, an import pair and an entry in `registry.ts`, and
appended rules in a 2,000-line `globals.css`. A maintainer could miss one surface,
and any tool that automates onboarding had to find and patch text anchors a human can
reformat.

Registration must still stay explicit (ADR 0002): a project never gets art by
convention or fallback, and a reviewer must be able to see exactly which records and
identities ship.

## Decision

- Each project owns its files. Curated content lives in
  `src/content/projects/authored/<slug>.ts`, exporting the record under the camelCase
  of the slug. Each identity lives in `src/components/showcase/identities/<slug>/` as
  a default-export `Tile.tsx`, a default-export `Artwork.tsx`, and a plain
  `identity.css` imported by those components. File and directory names equal the slug.
- One deterministic generator (`src/lib/generate-registration.ts`, run with
  `npm run registration`) derives `src/content/projects/authored.generated.ts` and
  `src/components/showcase/identities.generated.ts` from those listings: sorted by
  slug, headed "generated; do not edit", byte-identical when nothing changed.
- The generator refuses an identity directory missing `Tile.tsx` or `Artwork.tsx`,
  naming the slug and file, rather than omitting or substituting art.
- The generated barrels are **checked in**. `catalog.ts` and `registry.ts` read them;
  the registry keeps its duplicate and missing-component checks.

## Consequences

- Registration stays explicit and reviewable: the barrels are ordinary source files,
  so every added or removed project appears as a diff in review. Nothing is discovered
  at build or run time.
- Nobody edits the barrels by hand; adding, renaming, or removing an authored file or
  identity directory is followed by `npm run registration`.
- Onboarding writes become new files or wholly regenerated files, never patches to
  hand-written source. Identity styles load after `globals.css`, so shared Chrome,
  wall, and motion rules stay in `globals.css` and identities refine them.
- Authored files keep type-only imports so plain `node` can load them, and the
  generator uses only Node built-ins, for later onboarding tooling.
- Stale barrels are not yet detected by the build; readiness reports them in a later
  enhancement.
