# Current Transmission — Approved Tickets

Implement the homepage ledger described in the [local spec](../../docs/current-transmission-spec.md). The owner approved this five-ticket breakdown; each ticket is a separate Markdown file. Distribution is local only.

Work the **frontier**: start a ticket only when all its blockers are complete. Ticket 01 comes first. Tickets 02, 03, and 05 can then proceed independently; ticket 04 follows 02 and 03.

Owner placement revision — 2026-09-30: Current Transmission follows the Project wall
and precedes More projects. The owner subsequently selected direct hero whitespace
reduction; ticket 03 is implemented and verified locally in its
[verification record](../../docs/verification/current-transmission/03/README.md).

| Ticket | Blocked by |
| --- | --- |
| [01 — Render the curated ledger and empty-blog state](01-curated-ledger-and-empty-blog.md) | None |
| [02 — Connect Latest Dispatch to published blog content](02-latest-dispatch-from-blog.md) | 01 |
| [03 — Recover desktop whitespace without delaying featured projects](03-recover-desktop-whitespace.md) | 01 |
| [04 — Deliver responsive, accessible reading across content states](04-responsive-accessible-reading.md) | 02, 03 |
| [05 — Reject invalid editorial updates through the actual build](05-enforce-editorial-build-contract.md) | 01 |

Ticket 01 must capture the actual pre-ledger homepage at representative wide viewports before inserting the section or changing surrounding spacing. Ticket 03 uses that baseline, and ticket 04 rechecks it with the final populated dispatch. Preserve existing checkout changes when capturing the baseline; a clean historical revision is not a substitute for the page being changed.

Ticket 01 delivers the complete empty-catalogue scenario, not a production workaround that hides existing posts. Ticket 02 supplies the populated scenario. The feature is not complete until all five tickets are verified, including build enforcement in 05 and the separate owner review of rendered launch copy in 04. Ticket numbering does not add a dependency from 04 to 05.

Ticket 01 is implemented and verified locally; see its checked criteria and
[verification record](../../docs/verification/current-transmission/01/README.md).
Ticket 02 is implemented and verified locally; see its checked criteria and
[verification record](../../docs/verification/current-transmission/02/README.md).
The production homepage now shows all three signals, with Latest Dispatch derived
from the existing blog catalogue. The isolated empty-catalogue homepage also retains
all three. Ticket 03 is already verified.
Ticket 04 is complete locally, with technical verification and owner approval recorded in its
[verification record](../../docs/verification/current-transmission/04/README.md),
including owner review of rendered launch copy on 2026-10-02. Ticket 05 is complete
locally, with exact field errors enforced before TypeScript in the real production
build. Its [verification record](../../docs/verification/current-transmission/05/README.md)
includes typed invalid fixtures, valid editorial rebuilds, inspected phone/tablet/desktop
captures, and all 303 tests plus lint, type checking, and the default build passing
after integration with tickets 02–04. All five tickets and the feature-wide acceptance
checklist are now verified locally. Planning approval is separate from this implementation
and rendered verification evidence.

## Verification and scope

Follow the repository's feature-branch workflow and use TDD with meaningful red-green-refactor slices. Each ticket owns tests for the behavior it introduces; 04 owns the combined layout and browser acceptance. Assert rendered homepage behavior and observable content-contract outcomes rather than private component wiring.

Use isolated fixtures for empty catalogues, date ties, newer posts, long copy, and invalid manual content. Do not edit or delete real posts to manufacture these states. Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` as applicable to each slice, and repeat the complete checks on the final integrated feature. Record actual evidence and check off only verified criteria. An automated structural check is not a visual pass, and agent copy inspection is not owner approval.

The tickets retain the existing static-first architecture, Chrome identity, and minimal footer metadata. No ambient animation ships in this version; a future slow status pulse remains deferred. PIRATE WORLD remains a tentative, editable working title, with no destination or release commitment.

Adding Birdsview to the Project wall or writing its case study is separate work. These tickets neither depend on nor block the Featured Project Update tickets. No commits, pushes, deployments, or external issue publication are authorized by this local planning request.
