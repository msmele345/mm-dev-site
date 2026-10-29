# Enhancement 07 verification evidence

Implemented on 2026-10-28 in `feat/fpu-enhancement-07-verify-evidence`.

The command uses the shared readiness findings and runs
`tests/project-verification.spec.ts` with the slug in `PROJECT_VERIFY_SLUG`.
A dedicated Playwright config serves a freshly built temporary snapshot of the
real application. No production catalogue, selection, identity, or wall edit was
required. The isolated chain hashes source and public assets before/after verification
and checks the production tree against its original hash.

## Commands and results

| Check | Result |
|---|---|
| First red: public `verify reports authored gates...` test | Failed with unknown-operation usage before implementation; passed after the authored report slice. |
| Next red: public `verify retains diagnostics...` test | Failed because verification exited zero for failed publication gates; passed after failure handling. |
| Focused `tests/unit/project-command.spec.ts` | 49 passed; all also passed in the final full suite. |
| `npm test -- --workers=2` | 470 passed, 2 intentionally skipped, 2.3 minutes. [Full log](full-tests.log). |
| `npm run lint` | Passed. [Log](lint.log). |
| `npm run typecheck` | Passed. [Log](typecheck.log). |
| `npm run build` | Passed with the production default bundler. [Log](build.log). |
| `npm run project -- verify elevated-bpm` | Passed: 2 browser tests against the real existing identity. [Report](existing-elevated-bpm/README.md). |
| `git diff --check` | Passed. |

The two skipped tests in the ordinary full suite are the parameterized verifier
spec itself: its required slug/input environment is supplied by `verify` instead.
The chain executes that same spec in its dedicated config, including both stage
branches, so those skips do not stand in for missing browser evidence.

## Isolated public-command chain

`tests/project-verify-chain.spec.ts` passed in 23.6 seconds in the final full suite:

1. `create signal-loom --title "Signal Loom" --source <this repository>` records
   source provenance and prepares unpublished content/art starters.
2. `verify signal-loom` records the authored stage and closed gates without a build.
   [Authored report](authored/README.md).
3. The test writes the established Signal Loom authored record, copies its local
   plate and bespoke identity over the starters, and thereby removes the unfinished
   marker. `check` confirms the finished presentation.
4. `publish signal-loom` and `verify signal-loom` rebuild the app and exercise
   published narrative/art/imagery, both optional links, unavailable-enrichment fallback,
   metadata, social image, sitemap, overflow, and responsive captures.
   [Published report](published/README.md).
5. The fixture omits both optional links, then `feature signal-loom --position 2`
   and `verify signal-loom` rebuild again. Exact five-project order, position/index,
   count, keyboard order/focus/Enter, touch press/release/navigation, reduced motion,
   ambient/crescendo exclusivity, and off-screen pause all pass.
   [Featured report and captures](featured/README.md).
6. The test changes the fixture tile destination to Telescope, then runs `verify`
   again. The build succeeds and browser checks fail with exit 1. The report,
   Playwright failure screenshot, trace, and logs remain available, and the broken
   fixture's source/selection hash stays unchanged during verification.
   [Expected failure report](failed/README.md).

## Browser and visual evidence boundaries

Every published/featured report links its generated 390px, 768px, and 1440px
captures. The agent inspected the real existing identity's wall and case-study
captures at all three widths, plus Signal Loom's phone/desktop wall and tablet
case-study captures. Layouts show the declared artwork and text, an ordered wall,
and no horizontal overflow. The five-card fixture retains normal odd-row alignment.
This is agent browser/capture inspection; screenshots do not approve visual quality.
Touch checks use Chromium emulation, not a physical device.
Archived text logs have trailing whitespace normalized; diagnostic content and binary
artifacts are preserved. The command's original run directories retain raw output.

## Review

- Standards axis: process-group timeout cleanup, nonzero timeout results, independent
  Git diagnostics, and duplicated layout setup findings were fixed; reviewer confirmed
  no remaining findings.
- Spec axis: removed a title-tag assumption that excluded Elevated BPM; the final
  production-identity smoke check passes. No remaining spec findings.

## Owner evidence

- [ ] Owner copy review
- [ ] Owner artwork approval
- [ ] Physical-device review
- [ ] Deployment
- [ ] Production curation
