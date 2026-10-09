# Ticket 10 verification — 2026-10-09

The headline link now stretches across its signal through an absolutely positioned pseudo-element, contained by the signal. Removing the inline-block, minimum height, and padding from the headline restores the same text layout as non-interactive signals. Native links, destinations, accessible names, and Chrome focus styling remain intact.

## Automated evidence

- Red: the new rendered text-spacing assertion failed before the CSS change (2px difference against the allowed 1px at the first tested width).
- Green: `npm test` — **324 passed**. `npm run lint`, `npm run typecheck`, and `npm run build` also passed.
- Geometry covers 320, 390, 768, 895, 896, 1024, and 1440 CSS pixels in populated, empty-blog, and long-copy states. See [populated measurements](populated-geometry.json), [empty measurements](empty-geometry.json), and [long-copy measurements](long-geometry.json).
- At 1440px, populated BIRDSVIEW and PIRATE WORLD have identical headline and copy starts. All three empty-blog headlines and copy starts also match exactly. Label-to-text spacing is 10px and heading-box-to-copy spacing is 12px across signals and layouts. Wrapped headlines retain their natural extra lines.
- Surface hit tests sample nine points per signal, including edges and padding; target dimensions exceed 44×44px, and divider points do not resolve to links. Non-interactive surfaces resolve to no link.
- Actual mouse navigation covers 768, 895, 896, and 1440px; actual touch navigation covers 390px. Padding, copy, and footer activate both repository and dispatch links. Clicking the concept leaves the homepage in place.
- Existing tests pass for accessible names, tab order, keyboard activation, sticky-header clearance, static/reduced-motion behavior, long-copy wrapping and clamping, and full article content.
- The first full run had 323 passes and one test point obscured by the Next.js development toolbar. Centering the signal before hit testing removed that test obstruction; the final full run passed all 324 tests.

## Visual inspection — separate from automated results

Agent inspected the populated and empty-blog captures at [phone](populated-ledger-390.png), [tablet](populated-ledger-768.png), and [desktop](populated-ledger-1440.png) sizes, alongside [empty phone](empty-ledger-390.png), [empty tablet](empty-ledger-768.png), and [empty desktop](empty-ledger-1440.png).

Single-line headline and supporting-copy baselines align across desktop columns. Stacked rows keep consistent label, headline, and copy spacing. Dividers remain clear, footer metadata stays quiet, and wrapped dispatch copy stays contained. Breakpoint captures at 895px and 896px are retained for all three content states.

Inspected [desktop single-line focus](headline-focus-1440.png) and [phone wrapped-headline focus](long-headline-focus-390.png): the established lime outline follows the headline text, including its wrapped fragments, without outlining the signal surface. The [long-copy desktop](long-ledger-1440.png) capture retains natural wrapping and two-line excerpts.

This is local agent verification, not deployment or new owner copy approval. Standards and spec reviews found no implementation defects; the requested focus-ring visual evidence was recorded above.
