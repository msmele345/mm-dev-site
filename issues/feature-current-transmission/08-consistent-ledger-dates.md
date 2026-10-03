# 08 — Format the ledger's two dates consistently

Status: not started

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Make the editorial update date and the Latest Dispatch publication date read as the same format, as the spec requires ("Format calendar dates consistently without local-timezone drift").

They currently differ in two ways:

- **Month abbreviation.** On the Node version CI uses, the en-GB short month for September is "Sept". The header trims the month to three letters; the post date does not. A September post would render `30 SEPT 2026` beside `UPDATED · 30 SEP 2026`. This is latent only because the one published post is dated August.
- **Day padding.** The header zero-pads the day (`02 JAN 2001`); the dispatch does not (`2 APR 2099`).

Both ledger dates should come from one shared, unit-tested calendar-date formatter with a three-letter month that does not vary with the runtime's locale data.

**Owner decision to record in this ticket before implementation:** whether the blog index, post page, and OG card adopt the same formatter (one date format site-wide) or keep their current unpadded format, with only the ledger changing. The site-wide option is recommended, because those surfaces would otherwise show "Sept" for September posts.

## Acceptance criteria

- [ ] The editorial update date and the dispatch publication date are produced by one shared formatter, covered by focused unit tests.
- [ ] The month is always exactly three letters. A unit test covers every month, including September, and a fixture post dated in September renders a three-letter month in the ledger.
- [ ] Both ledger dates use the same day padding; a fixture with a single-digit day in each position proves it.
- [ ] Formatting is pinned to UTC: the rendered dates match the authored yyyy-mm-dd values when the build runs in a timezone behind UTC.
- [ ] Each `<time>` element keeps its authored ISO date in `datetime`.
- [ ] The owner's decision on the blog index, post page, and OG card is recorded here, and those surfaces and their tests match it.
- [ ] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

## Blocked by

- [06 — Decouple the ledger tests from live editorial copy](06-decouple-tests-from-live-copy.md)
