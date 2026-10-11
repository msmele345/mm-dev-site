# 03 — Preserve published case studies independently of homepage featuring

Status: complete

## Parent

[Featured Project Update spec](../../docs/featured-project-update-spec.md)

[Approved ticket index](README.md)

## What to build

Keep a published project reachable at its existing URL when it is
not selected for the homepage, including themed content, metadata, social image,
and sitemap entry. Featuring must require a real published destination.

## Acceptance criteria

- [x] Published case-study eligibility and featured membership remain distinct configuration concepts.
- [x] A fixture can publish a case study without featuring it.
- [x] After unfeaturing and rebuilding, the prior published URL returns a successful response with its original project identity and narrative.
- [x] Canonical metadata, social image availability, and sitemap inclusion survive unfeaturing.
- [x] Unknown or unpublished case-study URLs remain unavailable.
- [x] A selected project with no published case-study destination fails the build with its slug identified.
- [x] Publication is not inferred from the existing draft-copy review flag.
- [x] The existing four published routes remain available and no real project is unpublished.

## Blocked by

- [01 — Register showcase identities while preserving the four-project experience](01-register-showcase-identities.md)

## Verification

- Added `tests/published-case-studies.spec.ts` using isolated copied production apps.
- Red: a build with featured but unpublished `elevated-bpm` incorrectly succeeded.
  Green: the build rejects it with the slug and missing publication relationship.
- The rebuild fixture also exposed an unpublished social image returning 200;
  an explicit publication guard now makes it return 404.
- The fixture builds and serves, removes only the featured selection, rebuilds,
  and verifies retained narrative, theme, artwork, canonical metadata, social image,
  sitemap entry, and all four original routes. Published draft copy remains valid;
  a non-draft authored but unpublished fixture remains unavailable.
- Focused production-build/browser checks: 2 passed. Full suite: 344 passed.
- Lint, typecheck, production build, and diff whitespace checks passed.
- Standards and ticket-scope reviews found no code issues.
