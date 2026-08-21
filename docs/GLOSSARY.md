# Glossary — mm-dev-site

Domain vocabulary for the site. Issues, ADRs, and code use these terms.

- **Chameleon tile** — a featured project's card on the home page, rendered as a
  mini-world in that project's own visual identity (groovebox faceplate, trading
  terminal, star field, club flyer). See ADR 0002.
- **Chrome** — everything around the tiles: nav, hero, blog, footer. Ink-black ground,
  white type, electric lime accent. See ADR 0003.
- **Wordmark** — the MITCH MELE brand mark set in the display face; appears in nav,
  tab title, and OG images.
- **Project wall** — the home-page section holding the four chameleon tiles.
- **Case study** — a project's full page, continuing its tile identity: problem → build
  → result story, screenshots, stack badges, repo + demo links.
- **More-projects rail** — compact high-contrast list below the project wall for
  non-featured work (scholar, selected repos); smaller cards, no full theming.
- **Curated content file** — the hand-written source of truth for a project (pitch,
  identity, links, screenshots). See ADR 0004.
- **Enrichment** — build-time layering of live GitHub stats (commits, last push,
  languages) onto curated content. Never a runtime dependency.
- **Ambient state** — a tile's idle animation: subtle, low-frequency life.
- **Crescendo** — a tile's full-energy state on hover/focus (or tap-and-hold /
  dominant-in-view on mobile). One tile at a time. See ADR 0006.
- **Static state** — the frozen tile art shown under `prefers-reduced-motion`.
