# ADR 0006 — Motion: ambient + hover crescendo

Status: accepted — 2026-08-17

## Context

Four animated tile-worlds on one page can compete for attention, burn battery, and hurt
Core Web Vitals — but a static wall isn't "dazzling," and mobile has no hover.

## Decision

- **Ambient state (default):** each tile idles with subtle life — a slow LED pulse, one
  drifting star, a faint ticker crawl. Cheap, low-frequency animation.
- **Crescendo (hover/focus):** the tile goes full-energy — sequencer runs, ticker speeds
  up, constellation draws itself. Only one tile crescendos at a time.
- **Reduced motion:** `prefers-reduced-motion` freezes tiles to static art. Non-negotiable.
- **Mobile:** ambient by default; crescendo on tap-and-hold or when a tile is the
  dominant in-view element.

## Consequences

- Every tile component implements the three states: static / ambient / crescendo.
- Animations must be compositor-friendly (transform/opacity; canvas where needed) and
  pause off-screen.
- Keyboard focus triggers crescendo — the showpiece is accessible, not hover-gated.
