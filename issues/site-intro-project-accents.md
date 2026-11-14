# Tie the Site intro to the Project wall

## Parent

Follow-up to [Site intro](site-intro.md), which shipped the compact intro and
its index. This is not a new slice on the wayfinder map.

## Why

The Site intro works on its own but reads as a separate page from the wall
below it. Three things cause that:

- The intro has almost no colour. The only lime is the headline cursor; the
  index is white and grey. Every tile directly below has its own palette.
- The index and the wall list the same projects with the same 01–04 positions,
  but the tiles show the position in the project's accent and the index shows
  it in grey. Nothing connects row 02 to the second tile.
- A full-width rule sits between the intro and the wall, and the headline is
  still large enough to compete with the tiles.

## What to build

### 1. Each index row carries its project's accent

Each row in the Site intro index takes its colour from that project's
`tile.palette.accent`, the same value the tile uses:

- At rest, the position number ("01") is in the project's accent.
- On hover and keyboard focus, the invitation, the caret, and the row's top
  border use the project's accent where they use lime today.
- The focus ring stays lime. It is the Chrome's focus treatment everywhere else.
- The project name and the dotted leader stay as they are.

The accent comes from the curated record, so add / remove / replace / reorder
of the featured selection needs no second list.

### 2. The intro hands off to the wall

- Remove the rule between the Site intro and the Project wall. The rules above
  the rail and the contact section stay.
- Reduce the headline size by about 25–30% at every width (today
  `clamp(2.5rem, 1.25rem + 5vw, 5.5rem)`). It stays mono, uppercase, and the
  page `<h1>`.
- Keep the gap between the intro and the first tile within the limit
  `tests/home-spacing.spec.ts` enforces, and keep the first tile in the opening
  view.

### ADR 0003

ADR 0003 says lime is the Chrome's accent and tile palettes stay scoped per
tile. Project accents in the index are a deliberate, narrow exception: the
index is the Chrome's pointer to the wall. Amend ADR 0003 to record it, limited
to the Site intro index rows. No other Chrome surface takes a project colour.

## Out of scope

- Triggering a tile's crescendo from an index row. That is
  [Site intro index drives the wall](site-intro-index-crescendo.md).
- The mobile index. Below the desktop breakpoint rows still show position and
  invitation only, as decided in [Site intro](site-intro.md).
- Headline, eyebrow, and sentence copy; the headline face; the cursor.
- Tile art, case-study pages, Current Transmission, and the rail.

## Acceptance criteria

- [x] Red first: a test fails while an index row's position number is not the project's `tile.palette.accent`.
- [x] Each row's position number renders in its project's accent at rest, for all featured projects and in wall order.
- [x] On hover and on keyboard focus, the invitation, caret, and top border use the project's accent. The focus ring is still lime, and hover and focus remain visibly distinct.
- [x] `tests/site-intro.spec.ts` "hover and keyboard focus are distinct and lime" is updated to the new behaviour.
- [x] Every featured accent meets the contrast thresholds the polish-and-audit spec measures against the ink ground. A project whose accent fails is reported by slug.
- [x] Reordering or rotating the featured selection changes the row accents with no other edit (covered in the rotation spec).
- [x] No rule renders between the Site intro and the Project wall. The rail and contact rules are unchanged.
- [x] The headline is about 25–30% smaller at desktop and mobile widths, never overflows its container, and the existing bounded-headline and first-tile-in-view tests pass, including the six-project fixture.
- [x] `tests/home-spacing.spec.ts` passes.
- [x] Reduced-motion users get the same colours and states with nothing animating.
- [x] ADR 0003 records the index-row exception.
- [x] Before and after screenshots at 1440×900 and 390×844 are saved under `docs/verification/site-intro/`.
- [x] `npm test`, `npm run lint`, and `npm run typecheck` pass.

## Blocked by

None. Can start immediately.
