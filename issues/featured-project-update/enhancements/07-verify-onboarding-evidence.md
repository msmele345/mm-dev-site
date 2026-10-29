# 07: Verify onboarding end to end and assemble review evidence

**What to build:** Add `npm run project -- verify <slug>`, which runs a Playwright suite
parameterized by slug against the real application and writes one evidence report.
Prove the whole workflow with one end-to-end chain in an isolated app, and finish the
project-update guide.

**Blocked by:** [04](04-create-unpublished-project.md), [06](06-feature-published-project.md).

**Status:** implemented — automated verification complete

- [x] A failing public-command test is written before the verification and evidence behavior.
- [x] Verification is a Playwright spec that receives the slug through the environment and generalizes `tests/new-project-readiness.spec.ts`; there is no second browser-driving harness.
- [x] The command reads the project's lifecycle stage and runs only the checks that stage requires.
- [x] Published verification covers narrative, project artwork, local imagery, optional-link behavior, enrichment fallback, canonical metadata, social image, and sitemap membership.
- [x] Featured verification covers exact membership, position, visible index, count, reading order, and destination.
- [x] Browser checks cover keyboard activation, visible focus, touch behavior, reduced motion, shared motion states, and horizontal overflow.
- [x] Phone (390px), tablet (768px), and desktop (1440px) captures are saved without claiming that screenshots approve visual quality.
- [x] The evidence report records the slug, stage and gates, source provenance from the review notes, changed paths, commands, results, and capture links.
- [x] The report leaves owner copy review, owner artwork approval, physical-device review, deployment, and production curation unchecked unless the owner supplies that evidence.
- [x] A failed verification exits nonzero, keeps its diagnostic evidence, and does not change `selection.json` or any project file.
- [x] One end-to-end chain test in an isolated app runs create, applies the Signal Loom content and art over the starters and removes the unfinished marker, then runs check, publish, feature, and verify through a real rebuild.
- [x] The chain test leaves the production catalogue, selection, identities, and Project wall unchanged.
- [x] `docs/project-update-guide.md` documents create, check, publish, feature, verify, and sync with expected outputs and recovery behavior, and keeps the manual `selection.json` flows for removal, replacement, and reordering.
- [x] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [x] Completed acceptance criteria and actual verification evidence are recorded in this ticket.

## Actual verification evidence — 2026-10-28

Implemented `npm run project -- verify <slug>` with stage-specific reports and a
single slug-parameterized Playwright suite. Verification uses an isolated fresh
build, preserves source/selection, retains diagnostics on failure, and saves phone,
tablet, and desktop captures. The guide documents all six operations and recovery,
including manual removal, replacement, and reordering.

- Red/green public-command tests: unknown operation failed first; closed published
  gates initially exited zero and then passed after failure handling was added.
- Focused CLI tests: 49 passed. The isolated create → author Signal Loom → check →
  publish → feature → verify chain passed, covering published and featured stages,
  present/absent links, and an intentionally broken rendered destination with retained
  failure evidence and unchanged source hashes.
- Final full suite: **470 passed, 2 intentionally skipped** (the environment-only
  parameterized spec is executed by the command inside the chain).
- Lint, typecheck, production build, and whitespace checks passed.
- Final existing-identity smoke: `verify elevated-bpm` passed both browser tests.
- Standards and Spec review findings were fixed and verified; no remaining findings.

[Durable reports, logs, captures, failure trace, and review boundaries](../../../docs/verification/featured-project-update/enhancements/07/README.md).
Owner copy/artwork approval, physical-device review, deployment, and production
curation remain unchecked in that evidence bundle. Production selections and
project files were preserved.
