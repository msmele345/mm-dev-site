# 03 — First tracer tile: elevated-bpm

## Parent

Wayfinder map: `/plan/plan-history/map.md`

## What to build

The complete showcase path for one project, proving the pattern the other three tiles
will repeat: a curated content file for elevated-bpm → its chameleon tile on the home
page's project wall → its case-study page.

The tile is a **groovebox faceplate** (ADR 0002): step-sequencer LEDs, 909-style pads,
project name as hardware silkscreen. It implements all three motion states (ADR 0006):
static (reduced motion), ambient (slow LED pulse), crescendo on hover/focus (sequencer
visibly runs). Clicking opens the case-study page continuing the groovebox identity:
in-theme hero, problem → build → result story, screenshots, stack badges, repo + live
demo links. Draft the case-study copy from the project's own CONCEPT.md — the user edits
rather than writes from scratch.

This issue defines the curated content schema (ADR 0004) that all projects share:
title, slug, pitch, tile identity, story sections, screenshots, links, stack.

## Acceptance criteria

- [ ] Curated content schema defined and documented; elevated-bpm authored in it
- [ ] Groovebox tile renders on the home project wall with static, ambient, and crescendo states
- [ ] `prefers-reduced-motion` shows the static state; keyboard focus triggers crescendo
- [ ] Case-study page at its own route, in the groovebox identity, with story, screenshots, stack badges, and repo/demo links
- [ ] Draft case-study copy sourced from the project's concept docs, flagged for user review
- [ ] Animations are compositor-friendly and pause off-screen

## Blocked by

- [02 — Chrome shell](02-chrome-shell.md)
