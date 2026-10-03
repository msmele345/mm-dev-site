# Ticket 06 verification — decouple the ledger tests from live editorial copy

Verified locally on 2026-10-03. Test-only change: nothing under `src/` or the styles
is modified, so the rendered ledger is unchanged.

## What changed

- Tests against the real homepage read the curated editorial record and the newest
  catalogue post through one support helper, and compare the page with those values.
  The header date is checked against the spec's `UPDATED · DD MMM YYYY` rule, written
  independently of the component.
- Every isolated fixture app now receives a fixture editorial record when it is
  created. The fixture's update date (2025-03-14), headlines, sentences, and
  destination all differ from production.
- Fixed presentation strings are still literal: the three signal labels,
  FIRST DISPATCH PENDING, OFF AIR, IN CONCEPT, "Field notes are being prepared.",
  and the Repository cue.

## Evidence

| Check | Result |
| --- | --- |
| Before the change, production copy temporarily replaced | 6 ledger tests failed and 6 did not run (of 17 in the three browser specs and the spacing spec) |
| After the change, same temporary production copy | 148 of 148 ledger tests pass — [editorial-change.log](editorial-change.log) |
| After the change, a temporary newer post added | 148 of 148 ledger tests pass — [newer-post.log](newer-post.log) |
| Full suite on restored production content | 303 of 303 pass |
| `npm run lint`, `npm run typecheck`, `npm run build` | Pass |

The temporary edit changed both headlines, both supporting sentences, the update date
(2026-11-05), and the destination (`https://example.com/tide-table`). The temporary
post was a new untracked file dated 2026-10-03; no authored post was edited or deleted.
Both were reverted, and the logs record their exact content. "Ledger tests" means the
four Current Transmission specs, the content-contract unit spec, and the spacing spec.

## Coverage notes

- **One assertion changed its target.** Two production tests used to check a heading
  and a sentence from the body of the launch post after following Latest Dispatch.
  Those literals would fail as soon as a newer post is published, so the tests now
  check the destination URL and the article's title heading. Reaching the complete
  article body is still asserted in the isolated dispatch and long-copy fixtures.
- **Assertions added.** The production test now also checks both curated supporting
  sentences and the Now Building destination. The rebuild test now uses headlines that
  differ from the starting fixture and checks that the old ones are gone.
- **Dispatch date format.** The production test expects the same format the blog uses
  for that post. Pinning the ledger's own date format belongs to ticket 08.
- **Blog tests outside this ticket** still repeat the launch post's date and would
  fail when a newer post is published.
