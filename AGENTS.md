## WHAT — Stack & Structure
- Project Name: mm-dev-site (Site to Showcase Development Work in Galley and Blogging)
- Next.js React 19
- Vercel for CI/CD
**One-liner:** Site to Showcase Development Work in Galley and Blogging. The gallery is visually stunning and eye catching, just like the projects that it will showcase.

# Project Overview and Plan:
See @docs/plan/site-v1/map.md for Wayfinder map and Project Plan
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
- Create feature branches off of develop for each new feature or task. Name branches using the format `feat/short-description` (e.g., `feat/spotify-integration`).
- Git Strategy is Git Flow with the following branches:
    - `main` - production ready code
    - `feat/*` - individual feature branches created from main, merged back into main when complete (merges done by the user)
    - `release/*` - created from main when preparing for a release
- PRs should be used to merge feature branches into develop, and release branches into main. PRs should be reviewed and approved by me before merging.
- **Merge method depends on the target branch** (this matters — getting it wrong breaks branch ancestry):
    - `feat/* → main`: **Squash and Merge** — keeps main's history clean, one commit per feature.
    - `release/* → main` **Create a Merge Commit (`--no-ff`), NEVER squash.** Squash-merging into main collapses the shared commits into a brand-new commit with no ancestry link, so Git's merge base for the *next* release stays stuck at the old point and every changed file surfaces spurious `add/add` conflicts. A real merge commit preserves ancestry and keeps subsequent releases conflict-free.
    - If a `release → main` merge ever shows conflicts on every changed file, the cause is a prior squash-merge into main breaking ancestry. Fix: branch the release off develop, `git merge --no-ff -X ours origin/main` into it (keeps develop's content, brings main's tip in as a parent so main becomes an ancestor), then open the release PR — it will be conflict-free — and merge it with a merge commit.
- Commit messages should follow best practices and use the format: (feat:, chore:, fix:, docs:, refactor:) Examples:
    - `feat: add new widget for genre breakdown`
    - `chore: minor tasks like updating dependencies or fixing typos`
    - `fix: resolve bug in Spotify API integration`
    - `docs: update README with setup instructions`
    - `refactor: service layer redesign`