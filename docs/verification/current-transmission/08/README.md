# Ticket 08 verification — consistent calendar dates

Owner decision recorded on 2026-10-06: the ledger, blog index, post page, and
post OG card all use uppercase `DD MMM YYYY`, for example `02 SEP 2026`.

`formatCalendarDate` is the single production formatter. It formats the authored,
already validated `yyyy-mm-dd` calendar fields using a fixed twelve-month table.
No timestamp conversion or locale data can change the day or month abbreviation.
Source validation remains in the existing editorial and post content contracts.
Every `<time>` retains its authored ISO value in `datetime`.

## Red to green evidence

- The isolated production homepage first failed with expected `02 SEP 2099`
  and received `2 Sept 2099` for Latest Dispatch, while the header already read
  `03 SEP 2099`. The new assertions exposed the month and day-padding mismatch.
- All 13 focused calendar-date cases failed against the old formatter before
  implementation: one literal expectation for each month, including September,
  and a runtime timezone behind UTC. The same assertions pass with the new
  formatter.
- All 30 focused tests pass: calendar dates, OG card data, the isolated dispatch
  fixture and rebuild, and the existing MDX blog browser tests.
- The September fixture is built through the real production build in
  `America/Los_Angeles`. It verifies single-digit days in both ledger positions,
  all three blog-index dates, the post-header date, and authored ISO attributes.
  Existing newest-post selection, date ties, full article navigation, and stable
  editorial dates remain covered.
- The OG card's public data seam verifies `02 SEP 2026`; the existing August
  expectation now verifies `27 AUG 2026`.

## Final integration and visual inspection

| Check | Result |
| --- | --- |
| `npm test` | 317 of 317 pass — [full test log](full-tests.log) |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass, default Turbopack build; 20 static pages generated |
| `git diff --check` | Pass |
| Standards and spec reviews | No actionable findings |

Inspected the actual September-fixture screenshots at
[1440px desktop](september-ledger-1440.png),
[768px tablet](september-ledger-768.png), and
[390px phone](september-ledger-390.png). The header reads `UPDATED · 03 SEP 2099`
and the dispatch footer reads `02 SEP 2099`. Both dates fit cleanly and remain
subordinate to the signal headlines; existing columns/rows, spacing, and Chrome
styling are retained. The inspection is a rendered visual pass in addition to
the date and existing responsive browser assertions.

No authored blog or editorial content was changed for fixtures. Work remains
local and uncommitted; no push or deployment was performed.
