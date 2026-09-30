# 04 — Deliver responsive, accessible reading across content states

Status: ready-for-agent (start when blockers are complete)

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Make the populated and empty-blog ledger readable and usable from wide desktops to phones, including long authored copy. Finish the direct columns-to-rows transition, compact excerpts, and accessible interactions, then verify the combined homepage composition and obtain the owner's review of the rendered launch copy. This is a behavior slice, not a substitute for the tests owned by earlier tickets.

## Acceptance criteria

- [ ] Three equal wide columns switch directly to three compact, full-width stacked rows in Now Building, Latest Dispatch, Next Experiment order, with hard divider lines. There is no intermediate two-column layout, orphaned signal, carousel, or horizontal scrolling.
- [ ] Tests exercise both sides of the selected breakpoint plus representative desktop, tablet, and phone widths; populated and empty-blog states remain complete without horizontal overflow or clipped destinations.
- [ ] Headlines wrap naturally without destructive shortening. Supporting text displays at most two visual lines with an ellipsis when needed, while preserving the full underlying authored strings and article content.
- [ ] Isolated long-headline and long-summary fixtures, together with representative real blog copy, demonstrate the wrapping and excerpt behavior. Following the dispatch still exposes the article's complete content.
- [ ] Stacked rows have readable text, comfortable link targets, and sufficient spacing even if the Project wall moves farther down than the old narrow-screen page.
- [ ] Keyboard navigation follows the reading order with visible focus and working activation on Now Building and populated Latest Dispatch. Next Experiment and the empty fallback add no tab stops or misleading link behavior.
- [ ] Normal and reduced-motion browser checks show complete information and usable navigation, without ambient animation, blinking, status pulses, or independent content motion. Any future status animation remains a deferred note, not shipped behavior.
- [ ] The final populated wide layout is remeasured against ticket 01's baseline and still places the Project wall at the same document position or earlier, allowing only subpixel rounding. Adjust the final spacing if blog integration changed the earlier measurements.
- [ ] Actual rendered desktop, tablet, and phone views are visually inspected for Chrome consistency, divider alignment, minimal footer metadata, and hierarchy relative to featured tiles. Screenshots and observations are recorded separately from structural test results.
- [ ] Owner review of the rendered Birdsview, Pirate World, and fallback supporting copy is recorded. Draft copy remains editable; agent inspection alone does not satisfy this acceptance criterion.
- [ ] Meaningful red-green evidence and the combined browser regression results are recorded, with npm test, npm run lint, npm run typecheck, and npm run build passing for the checkout being verified. If ticket 05 lands later, the final integrated checks are repeated before declaring the feature complete.

## Blocked by

- [02 — Connect Latest Dispatch to published blog content](02-latest-dispatch-from-blog.md)
- [03 — Recover desktop whitespace without delaying featured projects](03-recover-desktop-whitespace.md)

