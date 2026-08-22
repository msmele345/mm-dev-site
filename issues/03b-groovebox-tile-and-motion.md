# 03b — Groovebox tile & motion system

## Parent

Wayfinder map: `/docs/plan/plan-history/map.md`

## What to build

The first real chameleon tile (ADR 0002), replacing 03a's placeholder card on the
project wall: elevated-bpm as a **groovebox faceplate** — step-sequencer LEDs, 909-style
pads, project name as hardware silkscreen — rendering from the content file 03a
established, and clicking through to the case study 03a built.

This slice also establishes the motion system the other three tiles reuse (ADR 0006):
the three states (static / ambient / crescendo), how they are triggered, and the
performance discipline that keeps four of them on one page viable. Issue 05 repeats
this pattern three times; the primitives it repeats are defined here.

- **Static** — `prefers-reduced-motion`; the faceplate is legible art, no animation.
- **Ambient** — slow LED pulse, idling on the wall.
- **Crescendo** — the sequencer visibly runs, on hover *and* keyboard focus.

## Acceptance criteria

- [ ] Groovebox faceplate tile renders on the project wall from elevated-bpm's content file, replacing the placeholder card
- [ ] Tile links through to the elevated-bpm case-study page
- [ ] All three motion states implemented: static, ambient, crescendo
- [ ] `prefers-reduced-motion` shows the static state; keyboard focus triggers crescendo with a visible lime focus ring
- [ ] Only `transform` and `opacity` are animated — no layout- or paint-triggering properties — verified in the DevTools Rendering panel
- [ ] Ambient animation stops via IntersectionObserver when the tile leaves the viewport, and resumes on re-entry
- [ ] Motion state logic is factored for reuse by the three tiles in issue 05, not inlined in the groovebox component

## Blocked by

- [03a — Content schema & elevated-bpm case study](03a-content-schema-and-case-study.md)
