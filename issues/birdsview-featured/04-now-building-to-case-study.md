# 04 — Point Now Building at the birdsview case study

Status: ready-for-agent

## Parent

[Birdsview featured project spec](../../docs/birdsview-featured-project-spec.md)

[Approved ticket index](README.md)

## What to build

Now Building in Current Transmission links to the private birdsview repository,
which 404s for visitors. Point it at `/work/birdsview` instead. The internal
destination behaviour already exists (Current Transmission ticket 09): same-tab
client-side navigation and the "Case study →" cue. This should be a content change
with no code changes.

## Acceptance criteria

- [ ] A test asserting that Now Building navigates to `/work/birdsview` in the same tab, with the internal cue, is written first and fails before the content change.
- [ ] `nowBuilding.destination` is `/work/birdsview`, and `updatedOn` is set to the date of the change.
- [ ] The Now Building link has no `target`, Enter reaches the case study, and the footer shows the internal cue instead of "Repository ↗".
- [ ] No link to `github.com/msmele345/birdsview` remains on the site.
- [ ] Headline, Latest Dispatch, and Next Experiment are unchanged. Supporting text is unchanged unless the owner revises it.
- [ ] `docs/current-transmission-spec.md` notes the new Now Building destination and why it changed.
- [ ] `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

## Blocked by

- [02 — Build the globe tile and publish the case study](02-globe-tile-and-publish.md)
