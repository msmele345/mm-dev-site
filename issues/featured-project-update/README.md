# Featured Project Update — Approved Tickets

Implement the reusable Project wall maintenance capability in the [local spec](../../docs/featured-project-update-spec.md). The owner approved the five-ticket breakdown; each ticket is a separate Markdown file.

Work the **frontier**: start a ticket only when all its blockers are complete. Ticket 01 can start immediately; tickets 02 and 03 can follow independently, then 04, then 05.

| Ticket | Blocked by |
| --- | --- |
| [01 — Register showcase identities while preserving the four-project experience](01-register-showcase-identities.md) | None |
| [02 — Rotate the featured selection with accurate counts and responsive layout](02-rotate-featured-selection.md) | 01 |
| [03 — Preserve published case studies independently of homepage featuring](03-preserve-published-case-studies.md) | 01 |
| [04 — Enforce new-project readiness across registration, publication, and featuring](04-enforce-new-project-readiness.md) | 02, 03 |
| [05 — Deliver the reusable project-update guide and verify complete maintenance flows](05-reusable-project-update-guide.md) | 04 |

All implementation acceptance criteria remain unchecked. Completing the planning work is not evidence that feature behavior has been implemented.

The production four-project selection is retained by this work. Adding Birdsview as a real featured project is a separate task. Current Transmission does not block these tickets.

Follow the repository's TDD and feature-branch workflow during implementation. Preserve unrelated checkout changes and record actual verification evidence in the ticket being worked.
