# 03 — Preserve published case studies independently of homepage featuring

Status: ready-for-agent (start when blockers are complete)

## Parent

[Featured Project Update spec](../../docs/featured-project-update-spec.md)

[Approved ticket index](README.md)

## What to build

Keep a published project reachable at its existing URL when it is
not selected for the homepage, including themed content, metadata, social image,
and sitemap entry. Featuring must require a real published destination.

## Acceptance criteria

- [ ] Published case-study eligibility and featured membership remain distinct configuration concepts.
- [ ] A fixture can publish a case study without featuring it.
- [ ] After unfeaturing and rebuilding, the prior published URL returns a successful response with its original project identity and narrative.
- [ ] Canonical metadata, social image availability, and sitemap inclusion survive unfeaturing.
- [ ] Unknown or unpublished case-study URLs remain unavailable.
- [ ] A selected project with no published case-study destination fails the build with its slug identified.
- [ ] Publication is not inferred from the existing draft-copy review flag.
- [ ] The existing four published routes remain available and no real project is unpublished.

## Blocked by

- [01 — Register showcase identities while preserving the four-project experience](01-register-showcase-identities.md)
