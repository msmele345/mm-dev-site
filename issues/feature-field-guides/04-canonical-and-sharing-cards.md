# 04 — Give guides canonical URLs and sharing cards

Status: not started

## Parent

[Field Guides spec](../../docs/field-guides-spec.md)

[Ticket index](README.md)

## What to build

When serving a guide, add site-owned tags to its `<head>`:

- the canonical URL
- Open Graph tags, including `og:image` and `article:published_time`
- `twitter:card=summary_large_image` with title and description
- the RSS alternate

Build the values from the same sources as `socialMetadata`, so card type and site name
are stated once. Add guide and guides-index cards to `src/lib/og-card.ts` and render
them through `renderOgCard`. Give `/guides` its own social metadata and image.

Check whether Next allows a metadata image route in the same segment as `route.ts`.
If it doesn't, serve per-guide images from a sibling segment. Record the outcome.

Default for spec decision 2: guides stay out of `feed.xml`. Follow the owner's choice
if it changed before this ticket starts.

## Acceptance criteria

- [ ] A served guide's `<head>` contains exactly one each of the canonical URL (at the canonical origin, not the serving host), the Open Graph tags (type, title, description, URL, site name, image, published time), and the Twitter tags. Values come from the guide's metadata and are HTML-escaped.
- [ ] Nothing is injected into `<body>`. Apart from the added head tags, the response matches the committed file.
- [ ] Each guide's `og:image` resolves to a 1200×630 PNG card with the guide's title and subject in the site's card system. `/guides` has its own card and social metadata.
- [ ] A title or description containing `"`, `<`, or `&` renders safe, correct tags. Prove this with a fixture.
- [ ] Guide routes stay statically generated.
- [ ] Tests follow `tests/rss-and-og-images.spec.ts`. Red-green evidence is recorded, and `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass. A sample card is visually inspected.

## Blocked by

- [02 — Enforce the guide contract through the real build](02-enforce-guide-contract.md)
