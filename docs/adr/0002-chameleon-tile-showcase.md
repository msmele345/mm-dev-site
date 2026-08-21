# ADR 0002 — Chameleon-tile showcase

Status: accepted — 2026-08-17

## Context

The brief is "dazzling, high contrast, poppy." The featured projects already carry strong
visual identities of their own: elevated-bpm is a hardware-styled groovebox, terminal-one
an NYSE-floor-meets-slot-machine cockpit, telescope a night-sky renderer, sound-city a
dark club-scene event finder. Generic screenshot cards would flatten that. Alternatives
considered: typographic poster wall, immersive scroll-driven chapters (too heavy),
bento grid (too generic).

## Decision

Each featured project is showcased as a **chameleon tile**: a card rendered as a
mini-world in that project's own visual identity —

- **elevated-bpm** → groovebox faceplate: step-sequencer LEDs, 909-style pads
- **terminal-one** → trading terminal: scrolling ticker tape, green phosphor numbers
- **telescope** → star field: twinkling stars, a constellation that draws itself
- **sound-city** → club flyer: grainy dark poster, neon "TONIGHT" energy

Clicking a tile opens a full **case-study page** continuing that identity: in-theme hero,
problem → build → result story, screenshots/GIFs, stack badges, repo + demo links.

## Consequences

- Each tile is a bespoke component — more build effort per project, but each one is a
  small portfolio piece in itself.
- The site chrome must stay neutral so tiles carry the color (see [ADR 0003](0003-ink-black-chrome-electric-lime.md)).
- Adding a future project means designing it a tile identity — a feature, not a chore.
- Motion is governed by [ADR 0006](0006-motion-ambient-plus-hover-crescendo.md).
