# 04: Create an unpublished project from new files only

**What to build:** Add `npm run project -- create <slug> --title <title> [--source <path>]`.
It writes a new authored content file, a new identity directory with unfinished tile,
artwork, and stylesheet starters, a public image directory, and review notes, then
regenerates registration. It never patches hand-written source and never edits
`selection.json`, so the project stays unpublished and unfeatured.

**Blocked by:** [03](03-collect-readiness-and-check-command.md).

**Status:** complete (2026-10-26)

- [x] A failing public-command test is written before the create behavior.
- [x] The command validates the slug with the exported readiness pattern and requires a nonblank title before any write.
- [x] The content outline prefills only `slug`, `title`, `draft: true`, the three story kinds in order, and empty `links`; every owner-authored field is blank or empty so `check` reports it.
- [x] Tile and artwork starters follow the Signal Loom structure (accessible link, shared `TileMeta`, shared motion contract, static art, decorative art hidden), render a visible "UNFINISHED" label, and carry the `onboarding:unfinished` marker in each generated identity file.
- [x] The public image directory is created with a version-control placeholder that is not a screenshot.
- [x] `--source <path>` records the source repository path and current revision in review notes; no copy is imported.
- [x] The command regenerates registration with the shared generator; the ordinary application stays buildable with the new project authored but unpublished.
- [x] `npm run project -- sync` exposes the same generator on its own, supports `--dry-run`, and is a no-op when registration is current.
- [x] `--dry-run` lists every planned new file and the registration diff and leaves the checkout hash unchanged.
- [x] A repeated identical run reports that the project already exists and changes nothing.
- [x] An existing file with different content, or a slug already in use, stops the command with no changes.
- [x] Every precondition is computed before the first write; generated registration is written last.
- [x] `selection.json`, Current Transmission, and the more-projects rail are unchanged.
- [x] `check` on a freshly created project reports stage "authored" with content not ready and presentation unfinished.
- [x] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [x] Completed acceptance criteria and actual verification evidence are recorded in this ticket.

## Implementation notes and evidence

- The public `create` test first failed with `Usage: npm run project -- check <slug>`.
  It passed after implementation. Later regression tests first reproduced the Terminal
  One artwork changing from `block` to `grid`, a read-only retry failing with `EACCES`,
  and an identical source retry failing after the source repository advanced.
- Creation plans all new files and both generated barrels before writing. A retry keeps
  the recorded source revision after checking that it is a commit in the source
  repository. Starter CSS uses an onboarding-specific namespace. As specified, the
  multi-file write is preflighted but is not an atomic transaction.
- `tests/project-create-build.spec.ts` creates two unfinished projects in an isolated
  app, builds it, and checks the existing published route, the new 404 page and social
  image, and the unchanged homepage selection. A test-only browser preview checks the
  labels, accessible link name, reduced-motion rendering, and Terminal One's artwork.
  Its captured preview was visually inspected; it is not owner artwork approval.
- The real checkout's `create proof-project --title 'Proof Project' --dry-run` listed
  six new files and both registration diffs. `sync --dry-run` reported that
  registration was current. Neither command created a project.
- `npm test -- --workers=4`: **445 passed**. `npm run lint`, `npm run typecheck`,
  `npm run build`, and `git diff --check` passed. The production build retained the
  four existing case-study and social-image routes.
- The readiness slug pattern also accepts names beginning with digits, but the existing
  registration generator requires a leading letter for TypeScript identifiers.
  The command reports that restriction before writing. It also rejects reserved
  generated identifiers and collisions before writing.
