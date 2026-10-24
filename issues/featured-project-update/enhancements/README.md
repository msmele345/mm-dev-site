# Featured Project Onboarding Automation Tickets

Implement the local onboarding workflow in the
[automation spec](../../../docs/featured-project-onboarding-automation-spec.md).

Revised 2026-10-23: the original five tickets patched `catalog.ts`, `registry.ts`, and
`globals.css` through guarded text edits. They were replaced by this set, which first
moves those surfaces to selection data, per-project directories, and generated
registration, so every onboarding write is a new file, a regenerated file, or a JSON
edit. See the spec's revision note.

Work the frontier. Start a ticket only after every blocker is complete.

| Ticket | Blocked by |
| --- | --- |
| [01: Move the published and featured selections into a data file](01-selection-data-file.md) | None |
| [02: Migrate identities to per-project directories with generated registration](02-identity-directories-and-generated-registration.md) | None |
| [03: Collect every readiness finding and report it with a check command](03-collect-readiness-and-check-command.md) | 01, 02 |
| [04: Create an unpublished project from new files only](04-create-unpublished-project.md) | 03 |
| [05: Publish a ready case study](05-publish-ready-case-study.md) | 03 |
| [06: Feature a published project at an explicit position](06-feature-published-project.md) | 05 |
| [07: Verify onboarding end to end and assemble review evidence](07-verify-onboarding-evidence.md) | 04, 06 |

Tickets 01 and 02 are behavior-preserving refactors; visitors must see no change.
Both rewrite `tests/support/showcase-app.ts` (`addSyntheticIdentity` covers publication
and identity wiring), so rebase the second onto the first if they run in parallel.
Tickets 04 and 05 can proceed in parallel once 03 is complete.

Follow the repository's TDD and feature-branch workflow. Treat the selected ticket as
the task boundary, check completed tracer bullets in that ticket, and preserve unrelated
checkout changes. No ticket adds a real project to the production selection.
