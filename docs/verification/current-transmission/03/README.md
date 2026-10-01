# Ticket 03 — tightened hero spacing

Owner selected direct gap reduction on 30 September 2026 after moving Current
Transmission below the Project wall. Hero top padding and type remain unchanged.
Hero core bottom padding is now 24px, outer bottom padding ranges from 16–24px,
and Project wall top padding ranges from 24–48px. Other section padding is unchanged.

## Measurements and visual inspection

Compared the same Project wall section boundary against the
[actual pre-ledger checkout baseline](../01/baseline.json), with Chromium,
loaded fonts, matching wide viewports, and reduced motion. Hero content is unchanged.
These measurements use the real published blog with two curated ledger signals.
Tests use the normal GitHub mock; baseline enrichment differed, but stats below the
wall boundary do not influence its document position.

| Viewport | Previous wall top | New wall top | Earlier by | Cue-to-heading gap |
| --- | ---: | ---: | ---: | ---: |
| 1024 × 900 | 769.77px | 670.89px | 98.88px | 86.42px |
| 1440 × 900 | 973.80px | 829.80px | 144px | 97px |
| 768 × 1024 | — | 554.66px | — | 71.72px |
| 390 × 844 | — | 481.89px | — | 65px |

At 1440px the old cue-to-heading gap was approximately 289px including the border;
it is now 97px. The new spacing retains a visible section break without the oversized
empty band. [Machine-readable measurements](spacing.json).

Agent inspected [1024px](hero-1024.png), [1440px](hero-1440.png),
[768px](hero-768.png), and [390px](hero-390.png) screenshots. Hero text and wall
headings remain legible and unclipped. The full empty-catalogue 1440px screenshot
from the accompanying Current Transmission test was also inspected: all three
ledger columns retain their Chrome hierarchy below the featured tiles.

## Red → green and checks

The new rendered-homepage test first failed at 1024px: cue-to-heading gap
216.02px exceeded the 112px regression ceiling. After reducing the three stacked
padding contributions, it passes at all four widths. It also checks no horizontal
overflow and that the wall starts earlier than the preserved wide baseline. A
40px lower bound preserves readable section separation; narrow layouts are not
compared to desktop baseline positions.

- `npm test`: 162 passed, including spacing and empty-blog placement/keyboard tests.
- `npm run lint`: passed after rerunning sequentially; the initial parallel attempt
  encountered Playwright recreating the test-results directory during ESLint traversal.
- `npm run typecheck`: passed.
- `npm run build`: passed; homepage remains statically prerendered.
- `git diff --check`: passed.

Only hero trailing spacing and Project wall leading spacing changed in production
CSS. Project selection, destinations, tile artwork/motion, and authored blog content
are unchanged. Final populated/long-copy responsiveness and owner copy review remain
in ticket 04. No commits, pushes, or deployments were made.
