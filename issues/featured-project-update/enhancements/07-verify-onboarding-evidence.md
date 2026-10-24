# 07: Verify onboarding end to end and assemble review evidence

**What to build:** Add `npm run project -- verify <slug>`, which runs a Playwright suite
parameterized by slug against the real application and writes one evidence report.
Prove the whole workflow with one end-to-end chain in an isolated app, and finish the
project-update guide.

**Blocked by:** [04](04-create-unpublished-project.md), [06](06-feature-published-project.md).

**Status:** ready-for-agent

- [ ] A failing public-command test is written before the verification and evidence behavior.
- [ ] Verification is a Playwright spec that receives the slug through the environment and generalizes `tests/new-project-readiness.spec.ts`; there is no second browser-driving harness.
- [ ] The command reads the project's lifecycle stage and runs only the checks that stage requires.
- [ ] Published verification covers narrative, project artwork, local imagery, optional-link behavior, enrichment fallback, canonical metadata, social image, and sitemap membership.
- [ ] Featured verification covers exact membership, position, visible index, count, reading order, and destination.
- [ ] Browser checks cover keyboard activation, visible focus, touch behavior, reduced motion, shared motion states, and horizontal overflow.
- [ ] Phone (390px), tablet (768px), and desktop (1440px) captures are saved without claiming that screenshots approve visual quality.
- [ ] The evidence report records the slug, stage and gates, source provenance from the review notes, changed paths, commands, results, and capture links.
- [ ] The report leaves owner copy review, owner artwork approval, physical-device review, deployment, and production curation unchecked unless the owner supplies that evidence.
- [ ] A failed verification exits nonzero, keeps its diagnostic evidence, and does not change `selection.json` or any project file.
- [ ] One end-to-end chain test in an isolated app runs create, applies the Signal Loom content and art over the starters and removes the unfinished marker, then runs check, publish, feature, and verify through a real rebuild.
- [ ] The chain test leaves the production catalogue, selection, identities, and Project wall unchanged.
- [ ] `docs/project-update-guide.md` documents create, check, publish, feature, verify, and sync with expected outputs and recovery behavior, and keeps the manual `selection.json` flows for removal, replacement, and reordering.
- [ ] Focused tests, the full test suite, lint, typecheck, build, and whitespace checks pass.
- [ ] Completed acceptance criteria and actual verification evidence are recorded in this ticket.
