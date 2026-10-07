# Ticket 07 verification — shared signal presentation and validation

Verified locally on 2026-10-06 before beginning ticket 08's date changes.

The private `TransmissionSignal` server component defines the label, headline,
supporting text, and footer once. Its optional destination controls whether the
headline gets a semantic link and link class. Empty dispatch and concept signals
therefore have no focusable element or link styling. Existing IDs, accessible
names, document order, copy, metadata, and destinations are retained.

`next.config.ts` is the sole production editorial enforcement point. Next loads
it for development and production builds before type checking or page rendering;
the inline comment records why validation belongs there. The validator and its
content contract are unchanged.

## Evidence

- The four existing Current Transmission browser specs and content-contract unit
  spec passed with **147 tests before and after** the refactor
  ([unchanged-test log](unchanged-tests.log)). No test assertions
  were changed for ticket 07. The run includes empty/populated/long-copy states,
  responsive geometry, keyboard activation, reduced motion, all nine real-build
  invalid fixtures, and valid editorial rebuilds.
- The missing-string and wrong-type build fixtures retain the production type
  annotation and report the exact editorial field error before TypeScript.
- `npm run typecheck` and `git diff --check` passed after the refactor.
- An independent review found no actionable behavior or scope changes.

## Final integration with ticket 08

All **317 tests**, `npm run lint`, `npm run typecheck`, `npm run build` (default
Turbopack), and `git diff --check` pass. The default build statically generated
all 20 pages. Both standards and spec reviews found no actionable issues.
See the [integrated test log](../08/full-tests.log) and
[ticket 08 record](../08/README.md) for the inspected date captures.

Ticket 08 intentionally changes date assertions; the unchanged-assertion run
above was completed first to isolate ticket 07's behavior preservation. Work
remains local and uncommitted; no push or deployment was performed.
