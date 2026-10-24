# 04: Create an unpublished project from new files only

**What to build:** Add `npm run project -- create <slug> --title <title> [--source <path>]`.
It writes a new authored content file, a new identity directory with unfinished tile,
artwork, and stylesheet starters, a public image directory, and review notes, then
regenerates registration. It never patches hand-written source and never edits
`selection.json`, so the project stays unpublished and unfeatured.

**Blocked by:** [03](03-collect-readiness-and-check-command.md).

**Status:** ready-for-agent

- [ ] A failing public-command test is written before the create behavior.
- [ ] The command validates the slug with the exported readiness pattern and requires a nonblank title before any write.
- [ ] The content outline prefills only `slug`, `title`, `draft: true`, the three story kinds in order, and empty `links`; every owner-authored field is blank or empty so `check` reports it.
- [ ] Tile and artwork starters follow the Signal Loom structure (accessible link, shared `TileMeta`, shared motion contract, static art, decorative art hidden), render a visible "UNFINISHED" label, and carry the `onboarding:unfinished` marker in each generated identity file.
- [ ] The public image directory is created with a version-control placeholder that is not a screenshot.
- [ ] `--source <path>` records the source repository path and current revision in review notes; no copy is imported.
- [ ] The command regenerates registration with the shared generator; the ordinary application stays buildable with the new project authored but unpublished.
- [ ] `npm run project -- sync` exposes the same generator on its own, supports `--dry-run`, and is a no-op when registration is current.
- [ ] `--dry-run` lists every planned new file and the registration diff and leaves the checkout hash unchanged.
- [ ] A repeated identical run reports that the project already exists and changes nothing.
- [ ] An existing file with different content, or a slug already in use, stops the command with no changes.
- [ ] Every precondition is computed before the first write; generated registration is written last.
- [ ] `selection.json`, Current Transmission, and the more-projects rail are unchanged.
- [ ] `check` on a freshly created project reports stage "authored" with content not ready and presentation unfinished.
- [ ] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [ ] Completed acceptance criteria and actual verification evidence are recorded in this ticket.
