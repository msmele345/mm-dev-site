# 06 — Decouple the ledger tests from live editorial copy

Status: not started

## Parent

[Current Transmission spec](../../docs/current-transmission-spec.md)

[Approved ticket index](README.md)

## What to build

Let the owner revise the manual signals, change the editorial update date, or publish a new post without breaking the Current Transmission tests. Today the browser tests repeat the launch copy (BIRDSVIEW, PIRATE WORLD, the 30 SEP 2026 date, the Birdsview repository URL, and the first post's title, summary, and date) as literals, and the isolated fixture apps inherit the production editorial record. The first routine editorial update would fail many assertions that have nothing to do with a regression.

This is a prefactor for tickets 07–11: no rendered behavior changes. Tests against the real homepage derive their expectations from the curated record and the post catalogue. Isolated fixture apps write their own fixture editorial record instead of inheriting production copy.

## Acceptance criteria

- [ ] Tests that exercise the real homepage derive the expected Now Building, Next Experiment, editorial update date, and Latest Dispatch values from the curated editorial record and the newest catalogue post, not from repeated literals.
- [ ] Every isolated fixture app writes an explicit fixture editorial record; none depends on the production record's current values.
- [ ] Demonstrated, not assumed: temporarily changing the production headlines, supporting sentences, update date, and destination to other valid values leaves every Current Transmission test passing. Revert the temporary edit and record the evidence.
- [ ] Demonstrated the same way for the dispatch: temporarily adding a newer valid post leaves every Current Transmission test passing. Do not edit or delete real authored posts to manufacture the state.
- [ ] Fixed presentation strings that are part of the contract (signal labels, FIRST DISPATCH PENDING, OFF AIR, IN CONCEPT, the fallback sentence) remain asserted literally.
- [ ] No assertion is weakened or removed: section order, footer states, non-interactive signals, keyboard order, layout geometry, and build enforcement keep their current coverage.
- [ ] No source or style change to the rendered ledger. `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

## Blocked by

- None — can start immediately.
