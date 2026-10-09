# Ticket 09 verification — destination-aware Now Building link

Now Building follows its curated destination. Absolute HTTPS destinations render
an external link with `target="_blank"` and `rel="noreferrer"`, and retain the
`Repository ↗` footer. Root-relative destinations use Next.js client-side
navigation in the same tab and display the draft `Case study →` footer.

The shared signal remains a server component. Latest Dispatch, the concept and
empty-blog states, and the editorial content contract are unchanged. No authored
editorial or blog content was altered to exercise these states.

## Red to green evidence

- The external fixture first failed because its link had no `_blank` target
  ([red log](mm-dev-site-09-external-red.log)). After adding the new-tab attributes,
  the same test passed ([green log](mm-dev-site-09-external-green.log)). Enter opens
  the intercepted destination in a new page while the original homepage stays
  open. The test exercises phone and desktop layouts with visible keyboard focus.
- The internal fixture first failed with expected `Case study →` and received
  `Repository ↗` ([red log](mm-dev-site-09-internal-red.log)). After selecting the
  footer from the destination, the same test passed
  ([green log](mm-dev-site-09-internal-green.log)). The fixture has no target or rel,
  reaches `/work/telescope` by Enter in the same page, and preserves the original
  document identity, proving client-side navigation without a reload.
- Internal and external fixture navigation checks cover phone and desktop layouts,
  normal and reduced motion, the existing tab order and visible focus, and no
  ambient ledger animation. All external navigation is intercepted at the browser
  context boundary, so no external site's availability is required.
- Existing production reading and valid-build activation tests now assert popup
  behavior for HTTPS destinations. Production reading tests follow the curated
  destination type rather than assuming that it always remains external. Latest
  Dispatch still reaches the published article in the same tab without target or rel.

## Rendered inspection and owner copy review

Inspected the isolated internal fixture at [1440px desktop](internal-ledger-1440.png),
[768px tablet](internal-ledger-768.png), and [390px phone](internal-ledger-390.png).
The internal cue fits cleanly beneath the supporting copy in both columns and rows,
uses the existing quiet footer styling, and remains visually subordinate to the
headlines. These captures use fixture content, not the authored launch record.

Also inspected the populated homepage at [1440px desktop](populated-ledger-1440.png),
[768px tablet](populated-ledger-768.png), and [390px phone](populated-ledger-390.png).
The authored BIRDSVIEW signal retains `Repository ↗`; the existing Chrome styling,
dispatch date, concept state, and reading order remain intact.

The owner was shown the rendered phone preview and asked to review `Case study →`.
Owner approval is pending; agent visual inspection does not satisfy this criterion.

## Integration checks

| Check | Result |
| --- | --- |
| `npm test` | 317 of 317 pass — [full test log](full-tests.log) |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass, default Turbopack build; 20 static pages — [build log](build.log) |
| `git diff --check` | Pass |
| Standards review | No actionable findings |
| Spec review | No actionable findings |

The initial sandboxed build could not download Google Fonts. The same default build
passed with network access; no application changes or alternate build settings were
needed. All existing invalid-build fixtures and content-contract tests pass unchanged.

Work is local on `feat/current-transmission-09-destination-aware-now-building`.
No commit, push, or deployment was performed.

## CI reverse-focus follow-up

The original integration run above predates the reported CI focus failure. See the
[CI focus repair](focus-ci-repair.md) for its reproduced failure, retained regression,
scroll-margin correction, bounded test synchronization, and follow-up check results.
