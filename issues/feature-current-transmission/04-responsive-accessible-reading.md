# 04 — Deliver responsive, accessible reading across content states

Status: complete locally — technical verification 2026-10-01; owner copy review approved 2026-10-02

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Make the populated and empty-blog ledger readable and usable from wide desktops to phones, including long authored copy. Finish the direct columns-to-rows transition, compact excerpts, and accessible interactions, then verify the combined homepage composition and obtain the owner's review of the rendered launch copy. This is a behavior slice, not a substitute for the tests owned by earlier tickets.

## Acceptance criteria

- [x] Three equal wide columns switch directly to three compact, full-width stacked rows in Now Building, Latest Dispatch, Next Experiment order, with hard divider lines. There is no intermediate two-column layout, orphaned signal, carousel, or horizontal scrolling.
- [x] Tests exercise both sides of the selected breakpoint plus representative desktop, tablet, and phone widths; populated and empty-blog states remain complete without horizontal overflow or clipped destinations.
- [x] Headlines wrap naturally without destructive shortening. Supporting text displays at most two visual lines with an ellipsis when needed, while preserving the full underlying authored strings and article content.
- [x] Isolated long-headline and long-summary fixtures, together with representative real blog copy, demonstrate the wrapping and excerpt behavior. Following the dispatch still exposes the article's complete content.
- [x] Stacked rows have readable text, comfortable link targets, and sufficient spacing even if the Project wall moves farther down than the old narrow-screen page.
- [x] Keyboard navigation follows the reading order with visible focus and working activation on Now Building and populated Latest Dispatch. Next Experiment and the empty fallback add no tab stops or misleading link behavior.
- [x] Normal and reduced-motion browser checks show complete information and usable navigation, without ambient animation, blinking, status pulses, or independent content motion. Any future status animation remains a deferred note, not shipped behavior.
- [x] The final populated wide layout is remeasured against ticket 01's baseline and still places the Project wall at the same document position or earlier, allowing only subpixel rounding. Adjust the final spacing if blog integration changed the earlier measurements.
- [x] Actual rendered desktop, tablet, and phone views are visually inspected for Chrome consistency, divider alignment, minimal footer metadata, and hierarchy relative to featured tiles. Screenshots and observations are recorded separately from structural test results.
- [x] Owner review of the rendered Birdsview, Pirate World, and fallback supporting copy is recorded. Draft copy remains editable; agent inspection alone does not satisfy this acceptance criterion.
- [x] Meaningful red-green evidence and the combined browser regression results are recorded, with npm test, npm run lint, npm run typecheck, and npm run build passing for the checkout being verified. If ticket 05 lands later, the final integrated checks are repeated before declaring the feature complete.

## Blocked by

- [02 — Connect Latest Dispatch to published blog content](02-latest-dispatch-from-blog.md)
- [03 — Recover desktop whitespace without delaying featured projects](03-recover-desktop-whitespace.md)

## Verification

Technical checks and actual browser captures are recorded in the
[ticket 04 verification record](../../docs/verification/current-transmission/04/README.md).
The 2026-10-01 verification passed the 17 combined Current Transmission/spacing checks,
all 172 repository tests, lint, type checking, and the production build. Mitch approved the owner review
on 2026-10-02 after reviewing the work to complete the required checklist item:
"Everything looks good." The verification record includes this approval and the
accompanying blog-copy cleanup. All 11 affected blog and dispatch browser checks
passed after that edit on 2026-10-02.
Ticket 05 remains separate; final integrated checks must be repeated after it lands.
