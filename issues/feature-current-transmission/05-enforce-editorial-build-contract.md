# 05 — Reject invalid editorial updates through the actual build

Status: implemented and verified locally — 2026-10-02

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Make manual ledger maintenance safe from local editing through production build and rendered output. Valid editorial changes rebuild into the homepage; actual contract violations fail the real build and its CI invocation with an exact field error. Keep validation and build integration together so an unused validator cannot be mistaken for deployment protection.

## Acceptance criteria

- [x] The production manual record is validated during the actual production build path in addition to type checking. Invalid content causes a nonzero build failure; exporting a validator or testing it in isolation is not sufficient.
- [x] Missing editorial update date, Now Building headline, Now Building supporting sentence, Now Building destination, Next Experiment headline, or Next Experiment supporting sentence is rejected with the specific offending field named.
- [x] Empty or whitespace-only required strings and wrong field types are rejected with field-specific errors. Focused contract tests exercise each required field, not only a single representative headline.
- [x] The editorial date must be a real ISO calendar date in yyyy-mm-dd form. Malformed and impossible dates fail with the date field named, while an old valid calendar date remains accepted and visible without timezone drift or expiry.
- [x] The Now Building destination accepts a safe root-relative internal path or an absolute HTTPS URL. Executable schemes, protocol-relative URLs, non-HTTPS external URLs, and other unsafe forms fail with the destination field named; validation makes no external link-health request.
- [x] A destination on Next Experiment is rejected with the offending field named, preserving its non-interactive concept semantics rather than silently ignoring invalid data.
- [x] Longer valid headlines and supporting sentences remain accepted without a character-count limit or destructive truncation, and an empty blog remains a valid state rather than a manual-content failure.
- [x] Isolated invalid-content fixtures demonstrate failure through the real build with the intended field error. Focused tests cover every invalid class, and valid fixtures demonstrate successful builds; authored production content and real blog posts are not overwritten to manufacture failures.
- [x] Editing valid manual headlines, supporting copy, the working title, destination, and editorial date in an isolated fixture, then rebuilding, produces the corresponding visible homepage content and allowed link behavior. Rebuilding unchanged valid content leaves the editorial date unchanged.
- [x] The validation path retains static-first local rendering without a CMS, browser editor, runtime API, external service, or new post publication policy.
- [x] Meaningful red-green evidence, exact observed build errors, valid build results, and rendered-output checks are recorded. Required repository checks pass for valid production content, and the complete checks are repeated after integration with tickets 02 through 04 before feature completion.

## Implementation evidence

See the [red-green record, exact build failures, valid rebuilds, inspected captures,
and final integrated checks](../../docs/verification/current-transmission/05/README.md).
Validation runs during Next configuration loading before TypeScript and at the
homepage content boundary. Typed isolated fixtures prove the real CI build script
reports the exact editorial field, including errors that TypeScript would also reject.
The final suite passed all 303 tests; lint, type checking, and the default Turbopack
production build passed with the homepage remaining static.

## Blocked by

- [01 — Render the curated ledger and empty-blog state](01-curated-ledger-and-empty-blog.md)
