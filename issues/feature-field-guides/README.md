# Field Guides — Tickets

Status: draft — awaiting owner approval, 2026-11-06

Publish the owner's self-contained HTML field guides at `/guides/<slug>`, with a
Chrome Guides index at `/guides`, as described in the
[local spec](../../docs/field-guides-spec.md) and
[ADR 0008](../../docs/adr/0008-field-guides-as-self-contained-html.md). Each ticket is
a separate Markdown file. Distribution is local only.

Work the **frontier**: start a ticket only when all its blockers are complete. Work on
a branch cut from `main` (`feat/field-guides`), follow the repository TDD cadence, and
check off each acceptance criterion only once it's verified.

| Ticket | Blocked by |
| --- | --- |
| [01 — Publish the elevated-bpm guide at its own URL](01-publish-elevated-bpm-guide.md) | None |
| [02 — Enforce the guide contract through the real build](02-enforce-guide-contract.md) | 01 |
| [03 — Add the Guides index, nav link, and sitemap entries](03-guides-index-nav-and-sitemap.md) | 02 |
| [04 — Give guides canonical URLs and sharing cards](04-canonical-and-sharing-cards.md) | 02 |
| [05 — Review the published guide and write the authoring checklist](05-review-and-authoring-checklist.md) | 01, 03, 04 |

After 02, tickets 03 and 04 can proceed independently.

**Tickets 01–03 ship together.** Ticket 01 publishes a guide whose way-back link points
to `/guides`, and that page doesn't exist until 03. Merging 01 or 02 alone would put a
broken link on `main`. Ticket 04 may ride in the same PR or follow it before the guide
is announced. Ticket 05 must be complete before the guide is linked from anywhere
public.

The spec records [owner decisions](../../docs/field-guides-spec.md#owner-decisions).
Resolved on 2026-11-11: the URL is `/guides`, the nav label is "Guides", and the first
guide is elevated-bpm, regenerated as one file with `/field-guide`. Three decisions are
still pending, with defaults: RSS, Current Transmission, and v3 release timing. By
default the guide isn't published until elevated-bpm v3 is live at the demo.

No commits beyond the docs, pushes, deployments, or external issue publication are
authorized by this planning request.
