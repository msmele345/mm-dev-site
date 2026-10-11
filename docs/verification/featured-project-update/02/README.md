# Ticket 02 — Featured selection rotation

Verification date: 2026-10-11.

## Behavior

`WALL_SLUGS` in `src/content/projects/catalog.ts` remains the single ordered
featured selection. Editing it changes membership, rendered order, visible indices,
and the section count. Authored records and case-study publication slugs remain
separate. The production selection still contains Elevated BPM, Terminal One,
Telescope, and Sound City, in that order.

The section uses `1 featured project` or `<count> featured projects`. An empty
selection retains the Project wall heading and `#work` destination, reports zero,
and says “No featured projects right now.” It renders no list or motion wrappers.
Unknown and duplicate selections now throw actionable errors during homepage
prerendering, causing the real build to fail rather than silently dropping cards.

## TDD and public boundaries

- Singular count: the rebuilt one-project homepage first failed because the header
  still read `04 of 04 · four night machines`; it passed after deriving the count.
- Empty state: the rebuilt zero-project homepage first failed because its empty-state
  sentence was absent; it passed after conditional rendering of the neutral sentence.
- Invalid selections: both duplicate and unknown fixture builds initially exited
  successfully. They now exit with code 1 and name the offending slug and correction.
- Isolated application copies use a local GitHub stand-in. Rotation scenarios edit
  only the copied selection after initial fixture preparation, then rebuild and
  exercise the public homepage and case-study destinations.

## Rotation and browser evidence

The sequence verifies the baseline, removal, replacement, reordering, two cards,
one card, zero cards, and an expanded five-card selection. At 390px and 768px the
existing grid has one column; at 1440px it has two. Odd final cards stay in normal
left-column order, and a single desktop card retains the existing tile width.

Each scenario checks exact membership, sequential indices, singular/plural count,
link destinations, nonempty cards, document overflow, and geometric reading order.
Keyboard Tab follows selection order with visible lime outlines; Enter opens the
selected destination. Reduced motion freezes the artwork. Reordered and expanded
walls additionally verify single-crescendo handoff, off-screen pausing, touch hold,
and tap navigation.

The fifth fixture, Orbit Lab, is a separate authored slug with an explicit
registration that reuses Telescope artwork. It proves prepared-project selection
and five-card geometry. It is not a production project or the later ticket's
proof of onboarding distinct new artwork.

Screenshots are actual Chromium captures in reduced motion. Capture-only CSS hides
the sticky site header to keep it from covering the wall. Agent inspection checks
composition, count legibility, complete artwork, spacing, and odd-card alignment;
it is separate from owner visual/copy approval.

## Review

- Standards review: no findings.
- Ticket-scope review: no findings.
- The later publication-independence, comprehensive readiness, distinct-artwork
  extension, and maintenance-guide work remains in its own tickets. This ticket
  includes only a retained outgoing page smoke check, not that full publication proof.

## Captures

| Scenario | Phone | Tablet | Desktop | Measurements |
| --- | --- | --- | --- | --- |
| baseline | [390px](baseline-390.png) | [768px](baseline-768.png) | [1440px](baseline-1440.png) | [geometry](baseline-geometry.json) |
| remove | [390px](remove-390.png) | [768px](remove-768.png) | [1440px](remove-1440.png) | [geometry](remove-geometry.json) |
| replace | [390px](replace-390.png) | [768px](replace-768.png) | [1440px](replace-1440.png) | [geometry](replace-geometry.json) |
| reorder | [390px](reorder-390.png) | [768px](reorder-768.png) | [1440px](reorder-1440.png) | [geometry](reorder-geometry.json) |
| pair | [390px](pair-390.png) | [768px](pair-768.png) | [1440px](pair-1440.png) | [geometry](pair-geometry.json) |
| single | [390px](single-390.png) | [768px](single-768.png) | [1440px](single-1440.png) | [geometry](single-geometry.json) |
| empty | [390px](empty-390.png) | [768px](empty-768.png) | [1440px](empty-1440.png) | [geometry](empty-geometry.json) |
| add | [390px](add-390.png) | [768px](add-768.png) | [1440px](add-1440.png) | [geometry](add-geometry.json) |

## Required checks

- `npm test`: **342 passed**; includes all 12 new ticket tests.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed with the default production Turbopack build.
- `git diff --check`: passed.

The initial restricted production build could not fetch Google Fonts. The same
build passed outside the sandbox with network access. Isolated fixture builds use
webpack to support the shared dependency symlink, following the existing harness.
Both real-build invalid-selection tests failed as expected with the relevant slug.
