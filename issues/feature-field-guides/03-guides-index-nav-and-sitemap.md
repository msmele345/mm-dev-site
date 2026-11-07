# 03 — Add the Guides index, nav link, and sitemap entries

Status: not started

## Parent

[Field Guides spec](../../docs/field-guides-spec.md)

[Ticket index](README.md)

## What to build

Add `/guides` as a Chrome page that lists published guides from the metadata built in
ticket 02. Mirror the `/blog` index's structure and styles. Add "Guides" to the primary
nav, and add the index and each guide to the sitemap. Guides open as full document
loads, so link to them with plain `<a>` elements.

## Acceptance criteria

- [ ] `/guides` renders in the Chrome (ADR 0003): ink ground, white type, lime accents, the shared header and footer, an `h1`, and a one-line description.
- [ ] Guides are listed newest first by Published, with ties broken by slug.
- [ ] Each entry shows the formatted date (the shared `DD MMM YYYY` format), title linked to `/guides/<slug>`, description, and subject. The subject version is shown when present.
- [ ] An isolated empty guides directory produces an honest empty state, not a blank page.
- [ ] The primary nav reads Work / Blog / Guides / Contact on Chrome pages, with existing focus and hover treatment. "Guides" reaches `/guides`.
- [ ] The guide's way-back link and the index link complete a round trip: index → guide → index.
- [ ] `buildSitemap` lists `/guides` and each guide's canonical URL. A guide's `lastModified` is Updated when present, otherwise Published.
- [ ] Page is readable at 375px, 768px, and 1440px with no horizontal overflow. Entries are keyboard reachable with visible focus.
- [ ] Browser and sitemap tests cover the above using isolated fixtures for ordering, ties, and the empty state. Red-green evidence is recorded, and `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass. The agent's visual inspection is recorded and kept separate from owner approval.

## Blocked by

- [02 — Enforce the guide contract through the real build](02-enforce-guide-contract.md)
