# ADR 0003 — Ink-black chrome with electric lime accent

Status: accepted — 2026-08-17

## Context

Chameleon tiles each bring their own palette; the chrome around them must not compete.
"High contrast and poppy" was the brief. The projects share nocturnal DNA (club, night
sky, late-night trading floor). Alternatives: paper-white brutalist (fights the mood),
duotone accent-shifting by scroll position (complexity everywhere). Accent candidates:
electric lime, hot magenta, cyan.

## Decision

- **Ground:** near-black ink. **Type:** stark white, with the **MITCH MELE** wordmark
  set huge in the display face.
- **Accent:** electric lime (#C6FF00 territory), used sparingly — links, hovers, focus
  rings, highlights. "Techno flyer meets terminal phosphor."
- **No dark/light theme toggle** — the ink-black identity is the design.
- OG images and RSS branding follow the same ink-black + lime system.

## Consequences

- Tiles detonate against the neutral ground; chrome never competes.
- Lime-on-black passes contrast easily; body text stays white-on-black (lime is for
  moments, not paragraphs).
- All colors defined as design tokens so tile palettes stay scoped per tile.
