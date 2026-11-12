# Site intro index drives the wall

## Parent

Follow-up to [Site intro](site-intro.md), which deferred this: "Per-row
crescendo triggering is deferred (only one tile may crescendo at a time;
revisit separately)." This is not a new slice on the wayfinder map.

## Why

The index and the wall share the opening view but do not respond to each other.
Pointing at "Pull the lever" should wake the Terminal One tile, so the intro
works as a control for the wall instead of a list above it.

## What to build

Hovering an index row with a mouse, or moving keyboard focus to it, puts the
matching tile into its crescendo. Leaving the row, or moving focus away, returns
the tile to ambient.

- Only one tile crescendos at a time. A row and a tile can never hold two
  different tiles in crescendo; the most recent hover or focus wins.
- Rows stay real links to `/work/{slug}`. A click or Enter still navigates.
- Touch does nothing new. A tap on a row navigates, as today; the wall's
  existing mobile crescendo (tap-and-hold, dominant in view) is unchanged.
- Under `prefers-reduced-motion` no tile crescendos from a row. Tiles stay
  static.
- Without JavaScript the index still works as navigation and the tiles keep
  their own hover and focus behaviour.
- A tile that is off screen may be marked active but must not animate until it
  is in view, as today.

The wall's active-tile state currently lives inside the wall
(`ProjectWallMotion`, `CrescendoContext`) and the Site intro renders outside
it. The two need to share that state. The Site intro's content should stay
server-rendered; add only as much client code as the rows need.

### ADR 0006 and glossary

ADR 0006 defines crescendo as triggered by hover or focus on the tile. Amend it
to add the Site intro index row as a trigger, and update the **Crescendo** entry
in `docs/GLOSSARY.md` to match.

## Out of scope

- The reverse direction: hovering a tile does not highlight its index row.
- Scrolling the wall into view when a row is hovered.
- Any change to tile art, the crescendo animations themselves, or mobile
  crescendo rules.
- Row colours and intro layout, covered by
  [Tie the Site intro to the Project wall](site-intro-project-accents.md).

## Acceptance criteria

- [ ] Red first: a test fails while hovering an index row leaves the matching tile out of crescendo.
- [ ] Mouse hover on a row puts the matching tile, and only that tile, into crescendo; leaving the row returns it to ambient.
- [ ] Keyboard focus on a row does the same; moving focus out of the index clears it.
- [ ] Moving from a row to a different tile, or from a tile to a different row, never leaves two tiles in crescendo.
- [ ] Rows still navigate to `/work/{slug}` on click and Enter.
- [ ] Touch pointers do not trigger crescendo from a row; existing mobile crescendo tests pass unchanged.
- [ ] Under reduced motion, hovering or focusing a row animates nothing.
- [ ] With JavaScript disabled, `tests/site-intro.spec.ts` "works by keyboard and without JavaScript" still passes.
- [ ] Works for every featured project and follows the featured selection through add / remove / replace / reorder with no second list.
- [ ] The Site intro's headline, eyebrow, sentence, and links are still in the server-rendered HTML.
- [ ] ADR 0006 and the glossary's **Crescendo** entry name the index row as a trigger.
- [ ] `npm test`, `npm run lint`, and `npm run typecheck` pass.

## Blocked by

[Tie the Site intro to the Project wall](site-intro-project-accents.md). Both
change the index rows, and the row's accent and the tile's crescendo should
land as one gesture.
