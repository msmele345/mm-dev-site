# 05 — Review the published guide and write the authoring checklist

Status: not started

## Parent

[Field Guides spec](../../docs/field-guides-spec.md)

[Ticket index](README.md)

## What to build

Run the per-guide quality review on `pstack` at its served URL, and fix any problems in
the guide file. Write `docs/field-guide-authoring.md` so the next guide can be published
without rediscovering the contract. Then record the decision across the planning docs.

## Acceptance criteria

- [ ] **Reduced motion:** with `prefers-reduced-motion: reduce`, the guide shows complete, readable content. Animations and smooth scrolling are off, and revealed sections are visible.
- [ ] **Phone width:** at 375px there's no horizontal page scroll. The nav, catalog, and diagrams stay usable or reflow deliberately. Note the cost of the fixed blur and grain layers, and fix it if it's a real problem.
- [ ] **Keyboard:** the way-back link, section nav, search, and filter chips are reachable in a sensible order with visible focus.
- [ ] **Editorial:** no local-only paths or remarks. Credits, license, and the unofficial note are present. The subject version and date the guide reflects are visible to readers. Claims trace back to the source material.
- [ ] `docs/field-guide-authoring.md` covers:
  - copying a draft in and naming the slug
  - the required and optional meta tags, with an example `<head>`
  - the way-back link
  - the self-contained rule
  - the editorial cleanup
  - the quality review
  - the checks to run
- [ ] ADR 0008's status changes to accepted. `CONTEXT.md` lists field guides in its Experience Model and Architecture Commitments. The ticket index and spec status are updated.
- [ ] Review evidence is recorded: screenshots or captures of the reduced-motion, 375px, and keyboard passes. The agent's inspection and the owner's approval are recorded separately.

## Blocked by

- [01 — Publish the pstack guide at its own URL](01-publish-pstack-guide.md)
- [03 — Add the Guides index, nav link, and sitemap entries](03-guides-index-nav-and-sitemap.md)
- [04 — Give guides canonical URLs and sharing cards](04-canonical-and-sharing-cards.md)
