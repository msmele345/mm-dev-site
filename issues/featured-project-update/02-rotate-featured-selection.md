# 02 — Rotate the featured selection with accurate counts and responsive layout

Status: ready-for-agent (start when blockers are complete)

## Parent

[Featured Project Update spec](../../docs/featured-project-update-spec.md)

[Approved ticket index](README.md)

## What to build

Let the owner add, remove, replace, and reorder already prepared
projects by editing one ordered featured selection. The rendered wall displays exactly
that selection, with coherent indices, counts, and responsive geometry.

## Acceptance criteria

- [ ] One ordered selection determines wall membership and order; authored records are retained when unfeatured.
- [ ] Fixture changes demonstrate add, remove, replace, and reorder without changing shared renderers.
- [ ] Counts and visible numbering derive from rendered selection, with correct singular/plural wording.
- [ ] Empty selection keeps the Work anchor and heading, an honest zero count and empty state, and no placeholder cards.
- [ ] Zero, one, two, three, four, and five-card configurations are checked at representative phone, tablet, and desktop sizes without horizontal overflow or duplicate/empty cards.
- [ ] Duplicate selections and unknown project references fail the build with actionable errors.
- [ ] Visual reading order, keyboard focus order, link destinations, reduced-motion art, and shared tile interactions survive rotation.
- [ ] Tests use isolated fixtures and retain the production four-project selection.

## Blocked by

- [01 — Register showcase identities while preserving the four-project experience](01-register-showcase-identities.md)
