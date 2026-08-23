## WHAT — Stack & Structure
- Project Name: mm-dev-site (Site to Showcase Development Work in Galley and Blogging)
- Next.js React 19
- Vercel for CI/CD
**One-liner:** Site to Showcase Development Work in Galley and Blogging. The gallery is visually stunning and eye catching, just like the projects that it will showcase.

# Project Overview and Plan:
See @docs/plan/plan-history/map.md for Wayfinder map and Project Plan
See @issues for planned work slices

## Agent Orientation
- Domain: personal portfolio + blog. Owner: Mitch Mele (github: msmele345).
- Skills to consult during implementation: `frontend-design`, `vercel:nextjs`,
  `vercel-react-best-practices`, `web-design-guidelines`.
- Source projects live as siblings in `~/a_workspace/` — their CONCEPT/PRD/README docs
  are the raw material for case-study copy.
- ADRs recording these decisions live in `docs/adr/`; vocabulary in `docs/GLOSSARY.md`.
- This map was charted and worked in a single compressed session at the user's request
  (full pipeline: /wayfinder → /grill-with-docs → /to-issues).


## Cadences to follow:
1. TDD on any new feature code or bug fixes. Use Test Driven Development whenever possible
2. Red green refactor. Reference the /tdd skill and follow it


# Git Strategy and Instructions
- Create feature branches off of main for each new feature or task. Name branches using the format `feat/short-description` (e.g., `feat/spotify-integration`).
- Git Strategy is Git Flow with the following branches:
    - `main` - production ready code
    - `feat/*` - individual feature branches created from main, merged back into main when complete (merges done by the user)
    - `release/*` - created from main when preparing for a release. This is done by me unless I request you the agent to do it.
- PRs should be used to merge feature branches into main. PRs should be reviewed and approved by me before merging.
- **Merge method depends on the target branch** (this matters — getting it wrong breaks branch ancestry):
    - `feat/* → main`: **Squash and Merge** — keeps main's history clean, one commit per feature.
    - `release/* → main` **Create a Merge Commit (`--no-ff`), NEVER squash.** Squash-merging into main collapses the shared commits into a brand-new commit with no ancestry link, so Git's merge base for the *next* release stays stuck at the old point and every changed file surfaces spurious `add/add` conflicts. A real merge commit preserves ancestry and keeps subsequent releases conflict-free.
- Commit messages should follow best practices and use the format: (feat:, chore:, fix:, docs:, refactor:) Examples:
    - `feat: add new widget for genre breakdown`
    - `chore: minor tasks like updating dependencies or fixing typos`
    - `fix: resolve bug in Spotify API integration`
    - `docs: update README with setup instructions`
    - `refactor: service layer redesign`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
