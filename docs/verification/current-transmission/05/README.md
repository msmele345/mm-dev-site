# Ticket 05 verification — 2 October 2026

Implemented on `feat/05-enforce-editorial-build-contract`, starting from
`32f6b6bfde9f1a8374b9e3e0565f90d072977e85` with a clean worktree. Tickets 01–04
are integrated at that revision. All ticket 05 criteria and the final integrated
technical checks are verified locally.

## Editorial contract and build integration

`src/lib/current-transmission.ts` owns the editorial type and its runtime validator.
The production record in `src/content/current-transmission.ts` retains its type
annotation and authored copy/date. All six required strings reject missing, blank,
and mistyped values with their exact field paths. The date requires yyyy-mm-dd
syntax and a UTC calendar round trip, rejecting impossible dates and accepting
old dates and valid leap days. The validator preserves every authored string.

Now Building accepts a root-relative path or an absolute HTTPS URL. It rejects
executable and other unsupported schemes, protocol-relative links, malformed
URLs, credentials, whitespace, control characters, and backslashes that could
change URL interpretation. Destination validation is synchronous and local;
external availability is not checked. A destination property on Next Experiment
is rejected even when its value is undefined, null, empty, or mistyped.

`next.config.ts` validates the production record during configuration loading,
before Next's TypeScript phase. This ensures typed content errors still produce
the editorial field error. The homepage module also validates its imported record,
covering development edits after configuration initialization. Valid builds retain
Next's type checking and static prerendering. Latest Dispatch continues to use the
existing local post catalogue and publication policy.

## Red → green evidence

Tests exercise the public content-contract function, the actual build command,
and the rendered homepage.

| Regression | Observed red result | Green behavior |
| --- | --- | --- |
| Executable Now Building destination in an isolated app | The production build resolved successfully instead of rejecting the record | Nonzero build with `nowBuilding.destination` error |
| Missing editorial update date | Validator did not throw | Exact `updatedOn` error; matrix covers every required field |
| Impossible date `2026-02-31` | Validator did not throw; 50 other contract checks passed | Exact calendar-date error |
| Destination on Next Experiment | Validator silently discarded the property | Exact `nextExperiment.destination` error |
| Missing supporting text, numeric headline, and concept destination in typed build fixtures | All three builds failed in TypeScript before reaching the expected contract error | Configuration preflight produces the exact contract error first |

The last regression preserves the same `TransmissionEditorial` annotation as the
production record. Its [observed red output](type-ordering-red.json) includes
TS2741 for missing supporting text, TS2322 for the numeric headline, and TS2353
for the concept destination. Adding the configuration preflight made all three
pass in the same real build tests. An unused validator or a fixture stripped of
the production annotation would not satisfy this check.

## Actual build outcomes

Isolated applications copy the real source/configuration, keep an empty local
blog, and share installed dependencies. Fixtures edit only the copied manual
record; authored production content and real blog posts stay intact. The helper
invokes the package script used by `.github/workflows/ci.yml`, with `CI=1`:

```sh
npm run build -- --webpack
```

Webpack supports the isolated fixture's dependency symlink. The ordinary
production command is separately verified with the default Turbopack bundler.
The fixture's existing GitHub enrichment uses the local test server; it has no
live external-link dependency. Builds run with `TZ=America/Los_Angeles` to exercise
calendar rendering outside UTC.

All nine invalid fixture builds exited **1** without a terminating signal and
contained the exact error below. [Recorded build results](build-results.json)
include the scenario, exit code, expected error, and actual complete output.

| Invalid content | Exact observed error |
| --- | --- |
| Missing supporting sentence | `Current Transmission nowBuilding.supportingText must be a non-empty string` |
| Whitespace-only working title | `Current Transmission nextExperiment.headline must be a non-empty string` |
| Numeric headline | `Current Transmission nowBuilding.headline must be a non-empty string` |
| Malformed or impossible date | `Current Transmission updatedOn must be a real ISO calendar date (yyyy-mm-dd)` |
| Executable, protocol-relative, or HTTP destination | `Current Transmission nowBuilding.destination must be a safe root-relative path or an absolute HTTPS URL` |
| Destination on the concept | `Current Transmission nextExperiment.destination is forbidden because Next Experiment is non-interactive` |

The 121 focused contract tests cover each of the six required fields with missing,
empty, whitespace-only, number, null, boolean, array, and object values. Additional
cases cover malformed signal records, impossible/leap dates, safe/unsafe links,
forbidden destination presence, and long copy without truncation or a length limit.

The valid build test completes three successful production builds, with their
[complete logs recorded](valid-builds.log):

1. A valid record with date `2001-01-02`, manually edited titles/copy, an HTTPS
   destination, and an empty blog displays all three signals. Its external link
   activates by keyboard against a browser navigation fixture.
2. Editing both headlines, both supporting sentences, the working title,
   destination, and date rebuilds into the corresponding visible homepage. Long
   copy remains complete in the DOM. The allowed internal link
   `/work/telescope?view=build#notes` activates by keyboard and reaches the case study.
   Next Experiment and FIRST DISPATCH PENDING retain no interactive controls.
3. Rebuilding without rewriting the record keeps `2000-02-29` and the visible
   `UPDATED · 29 FEB 2000` header. Empty-blog fallback and edited headlines/link
   remain correct.

## Rendered inspection

Inspected the final passing suite's Chromium captures at 390, 768, and 1440px,
with loaded fonts. Edited fixture captures temporarily hide the sticky navigation
only during section screenshots to prevent occlusion. The initial viewport-based
crop missed part of the tablet/desktop ledger after resizing; section screenshots
corrected the evidence capture without changing product styling.

| State | Phone | Tablet | Desktop |
| --- | --- | --- | --- |
| Published dispatch and launch copy | [390px](populated-ledger-390.png) | [768px](populated-ledger-768.png) | [1440px](populated-ledger-1440.png) |
| Valid edited long manual copy and empty blog | [390px](edited-ledger-390.png) | [768px](edited-ledger-768.png) | [1440px](edited-ledger-1440.png) |

The inspected ledgers retain ink-black Chrome, readable white headlines/copy,
lime labels, quiet date/footer metadata, and aligned dividers. Phone/tablet rows
wrap full headlines and show visible two-line excerpt ellipses where needed;
desktop retains three equal columns. The old leap-day header remains visible,
and the empty dispatch reads as a complete OFF AIR signal.

The full suite repeats ticket 02's newest-post/tie/rebuild behavior and ticket 04's
long-copy, breakpoint, keyboard, and reduced-motion checks. The
[final populated spacing measurements](final-spacing.json) repeat the unchanged
actual ticket 01 baseline: the wall begins at 670.890625px at 1024px and
829.796875px at 1440px, respectively 98.875px and 144px earlier than the baseline.

## Final integrated checks

These complete checks were repeated after integrating the build preflight repair
with tickets 02–04. Lint ran after the browser suite to avoid test-output races.

| Check | Result |
| --- | --- |
| Initial isolated build suite | 10 passed |
| Typed build-order regression after repair | 3 passed |
| Final `npm test` | 303 passed |
| Final `npm run lint` | Passed |
| Final `npm run typecheck` | Passed |
| Final `npm run build` | Passed with default Turbopack; `/` remains static |
| `git diff --check` | Passed |

The [final production build output](production-build.log) records the successful
TypeScript phase and static route output. The final suite includes 121 contract
tests, nine invalid builds, and the valid three-build/rendered-edit scenario.

## Review and feature acceptance

Independent standards and spec reviews are complete. Standards had no actionable
findings. The spec review identified the typed-build ordering gap; the red tests,
configuration preflight, green tests, and follow-up review resolve it. Both axes
have zero remaining findings. Repository Next.js, React, and interface guidance
was consulted; no presentation behavior or authored copy changed in this ticket.

The parent feature checklist is now checked using the integrated results above,
ticket 01–04 evidence, and the [owner copy approval already recorded in ticket 04](../04/README.md#owner-launch-copy-review).
That approval was given on 2 October 2026; agent inspection does not replace it.
All five tickets are complete locally. No commits, pushes, deployments, or external
issue publication were performed in this implementation session.
