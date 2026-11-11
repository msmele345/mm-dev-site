# 05 — Review the published guide and write the authoring checklist

Status: not started

## Parent

[Field Guides spec](../../docs/field-guides-spec.md)

[Ticket index](README.md)

## What to build

Run the per-guide quality review on `elevated-bpm` at its served URL, and fix any problems in
the guide file. Write `docs/field-guide-authoring.md` so the next guide can be published
without rediscovering the contract. Then record the decision across the planning docs.

## Acceptance criteria

- [ ] **Reduced motion:** with `prefers-reduced-motion: reduce`, the guide shows complete, readable content. Animations and smooth scrolling are off, and revealed sections are visible.
- [ ] **Phone width:** at 375px there's no horizontal page scroll. The nav, catalog, and diagrams stay usable or reflow deliberately. Note the cost of the fixed blur and grain layers, and fix it if it's a real problem.
- [ ] **Keyboard:** the way-back link, section nav, search, and filter chips are reachable in a sensible order with visible focus.
- [ ] **Editorial:** the guide has no local-only paths, `.md`, or repository-relative links. The subject version and date it reflects are visible to readers. Claims trace back to the elevated-bpm sources, and the controls it describes match the app live at the demo URL (spec decision 3).
- [ ] **Template layers:** if the guide kept the template's fixed blur and grain layers, check them for phone performance and record the result.
- [ ] `docs/field-guide-authoring.md` covers:
  - generating a draft with `/field-guide` and naming the slug
  - passing the skill's `check-guide.mjs` and the site build contract
  - the required and optional meta tags, with an example `<head>`
  - the way-back link
  - the self-contained rule
  - the editorial cleanup
  - the quality review
  - the checks to run
- [ ] ADR 0008's status changes to accepted. `CONTEXT.md` lists field guides in its Experience Model and Architecture Commitments. The ticket index and spec status are updated.
- [ ] Review evidence is recorded: screenshots or captures of the reduced-motion, 375px, and keyboard passes. The agent's inspection and the owner's approval are recorded separately.

## Blocked by

- [01 — Publish the elevated-bpm guide at its own URL](01-publish-elevated-bpm-guide.md)
- [03 — Add the Guides index, nav link, and sitemap entries](03-guides-index-nav-and-sitemap.md)
- [04 — Give guides canonical URLs and sharing cards](04-canonical-and-sharing-cards.md)
