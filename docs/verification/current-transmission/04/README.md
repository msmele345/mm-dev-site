# Ticket 04 verification — 1 October 2026

Implemented on the existing `feat/04-responsive-accesesible-reading` branch,
starting from `68ec66f233fad9fd0370f6058bddad1ff2c2669b` with a clean worktree.
Technical acceptance is verified locally. Mitch approved the owner review of the
rendered launch supporting copy on 2 October 2026; that criterion is now checked.

## Delivered reading behavior

The existing direct transition at 56rem (896px with the default font size) is
retained: three equal columns become three full-width rows in Now Building,
Latest Dispatch, Next Experiment order. Stacked rows use horizontal hard dividers;
columns use vertical dividers. Neither layout has an intermediate pair of columns,
an orphaned signal, or horizontal scrolling.

Ledger links now have a minimum height of 2.75rem (44px), and supporting copy is
0.875rem (14px). Both changes use the existing Chrome typography and colors.
Headlines wrap, including a long unbroken word. Supporting paragraphs keep their
full authored strings while displaying at most two lines; overflow receives the
browser's visible ellipsis. The dispatch article retains its complete body through
its final section.

Semantic links remain in reading order, with the existing lime focus ring visible
below the sticky navigation. Birdsview and the populated dispatch activate with
Enter. Next Experiment and the empty dispatch contribute no tab stops. The empty
catalogue still displays FIRST DISPATCH PENDING, its preparation sentence, and
OFF AIR. Normal and reduced-motion checks cover phone and desktop navigation;
the ledger and its pseudo-elements have no ambient animations.
The future status pulse remains deferred.

The presentation remains a Server Component derived from local content. The
1 October implementation added no client state, fixture switch, live service,
editorial validator, or authored-post edit. The 2 October owner review includes
the blog-copy cleanup recorded below. Ticket 05 retains the build-validation
responsibility.

## Red → green and browser evidence

The first page-boundary regression,
`npm test -- tests/current-transmission-reading.spec.ts --workers=1`, failed on
the Birdsview target's 41px height against the 44px reading target. Adding the
minimum height advanced that same test to a second failure: supporting copy was
13px against the 14px reading size. Increasing the copy size made it pass.

The combined Current Transmission and spacing run passed all 17 checks:

```sh
npm test -- tests/current-transmission-reading.spec.ts tests/current-transmission.spec.ts tests/current-transmission-dispatch.spec.ts tests/home-spacing.spec.ts --workers=2
```

The reading tests measure rendered geometry at 320, 390, 768, 895, 896, 1024,
and 1440px for the real published dispatch, an isolated empty catalogue, and an
isolated long-copy production build. They assert signal order, equal widths,
the direct column/row transition, dividers, text height, uncut headlines,
comfortable unclipped destinations, and no horizontal overflow. Measurements are
saved separately from visual observations in [populated geometry](populated-geometry.json),
[empty geometry](empty-geometry.json), and [long-copy geometry](long-geometry.json).

The long fixture supplies long manual headlines and summaries as well as a long
MDX title and summary. Only temporary application files are written. Tests retain
the full summary string, measure its clipped display, and follow the keyboard
dispatch link to the complete article and its closing observation. Representative
real blog copy is also checked and remains complete in its linked article.
Ticket 01/02 empty-state, derivation, date-tie, and rebuild regressions still pass.

Initial geometry checks sampled the instant after a media-query resize, before
the site's existing near-zero reduced-motion reset had settled. Waiting two
animation frames before geometry reads fixed that measurement timing; no production
motion policy was changed. Reduced motion uses the existing global 0.01ms duration
override, so a literal zero-duration assertion was removed in favor of the observable
absence of running animations and identical usable navigation.

## Final populated spacing

Rechecked the actual ticket 01 baseline at matching viewports with loaded fonts
and reduced motion. The regression allows only 0.5px of subpixel measurement
tolerance; these results are substantially earlier. Current Transmission still
follows the Project wall and precedes More projects.

| Viewport | Ticket 01 wall top | Final populated wall top | Earlier by |
| --- | --- | --- | --- |
| 1024 × 900 | 769.765625px | 670.890625px | 98.875px |
| 1440 × 900 | 973.796875px | 829.796875px | 144px |

Raw comparison: [final spacing](final-spacing.json), using the unchanged
[ticket 01 baseline](../01/baseline.json). Stacked layouts are allowed the height
needed for readable copy and full headline wrapping.

## Actual visual inspection

Inspected Chromium captures with loaded Bebas Neue and IBM Plex Mono fonts.
The final captures come from the passing full suite: the real authored-post
homepage uses the repository's development server with local GitHub enrichment
fixtures; empty and long states use isolated production builds served by Next.js.
These are browser renders, not markup-only checks.

| State | Phone, 390px | Tablet, 768px | Desktop, 1440px |
| --- | --- | --- | --- |
| Published dispatch | [Ledger](populated-ledger-390.png) | [Ledger](populated-ledger-768.png) | [Ledger](populated-ledger-1440.png) |
| Empty blog | [Ledger](empty-ledger-390.png) | [Ledger](empty-ledger-768.png) | [Ledger](empty-ledger-1440.png) |
| Long authored copy | [Ledger](long-ledger-390.png) | [Ledger](long-ledger-768.png) | [Ledger](long-ledger-1440.png) |
| Homepage composition | [Home](populated-home-390.png) | [Home](populated-home-768.png) | [Home](populated-home-1440.png) |

Breakpoint captures: [published 895px](populated-ledger-895.png),
[published 896px](populated-ledger-896.png), [empty 895px](empty-ledger-895.png),
[empty 896px](empty-ledger-896.png), [long 895px](long-ledger-895.png), and
[long 896px](long-ledger-896.png).

Visual observations, separate from structural assertions:

- The ink-black surface, white reading text, lime labels, display headings, and
  muted metadata maintain Chrome. The ledger is visibly quieter than the themed
  Project wall above it.
- Phone and tablet rows use the full reading width with aligned horizontal rules,
  sufficient space between label, headline, excerpt, and footer, and readable
  targets. The phone header date wraps onto its own line without colliding.
- Desktop dividers share the header rule and column height, while footer metadata
  remains minimal and aligns along the bottom of the ledger.
- Real and fixture summaries show visible ellipses when they overflow. Long
  headlines remain fully readable across multiple lines, including the unbroken
  word; their additional height is intentional.
- The empty dispatch retains a distinct, honest row with preparation copy and
  OFF AIR. It carries no visual link cue.

## Required checkout checks — 1 October 2026

| Check | Result |
| --- | --- |
| Combined Current Transmission and spacing regressions | 17 passed |
| `npm test` | 172 passed |
| `npm run lint` | Passed after the browser suite completed |
| `npm run typecheck` | Passed |
| `npm run build` | Passed with default Turbopack; `/` remains static |
| `git diff --check` | Passed |

The entire Current Transmission feature remains incomplete until ticket 05 is
verified. Owner copy review is recorded below. Repeat the final integrated checks
after ticket 05 lands.

## Review

Independent reviews covered the starting revision and complete working changes,
including newly added tests and evidence files.

- Standards: one test-boundary finding was corrected. A motion assertion rejected
  every static transform, which could fail a valid layout refactor without any
  motion. It now checks animation behavior on the ledger and its pseudo-elements
  and running browser animations, allowing fixed layout transforms. No production
  standards violations or actionable code smells were found. Follow-up review
  confirmed the finding was resolved, with no remaining actionable issues. The
  full suite passed all 172 tests again after this correction.
- Spec: no implementation defects or scope creep were found. At the time of this
  technical review, the owner copy-review criterion remained pending and distinct
  from technical verification. The subsequent owner approval is recorded below;
  ticket 05 remains out of scope.

## Owner launch-copy review

Approved by Mitch on 2 October 2026. After reviewing the ticket 04 work to complete
the user-required checklist item, the owner reported: "Everything looks good."
This records approval of the rendered launch copy, including the three supporting
sentences presented for review:

- Birdsview: "Explore a 3D globe, bird's-eye views, and surprising geography facts."
- Pirate World: "Exploring a 3D pirate adventure for players of all ages."
- Empty dispatch: "Field notes are being prepared."

The manual drafts remain editable in `src/content/current-transmission.ts`, with
the empty preparation sentence in `src/components/CurrentTransmission.tsx`.
Agent visual inspection does not constitute owner copy approval.

During the same review, Mitch identified the blog's "What the embed proves"
section as copy that should be removed. That section explained the site's MDX
setup and promised future case studies. It has been removed from
`src/content/blog/shipping-a-groovebox-that-teaches-techno.mdx`. Existing dispatch
navigation checks now verify the remaining final section, "Lessons are data, not
code", and its closing pattern-sharing bullet so they still prove that readers
can reach the article's complete content.

The 2 October follow-up passed all 11 affected browser checks: eight blog checks
(including the working sequencer), two phone/desktop dispatch-navigation checks
with normal and reduced motion, and the production dispatch preview/keyboard
navigation check. Commands:

```sh
npm test -- tests/mdx-blog.spec.ts tests/current-transmission-reading.spec.ts tests/current-transmission.spec.ts --grep 'blog index|post page|published signals keep|real published|populated' --workers=2
npm test -- tests/current-transmission.spec.ts --grep 'production dispatch previews' --workers=1
```

`git diff --check` also passed. The full repository suite, lint, type checking,
and production build listed above are the 1 October results; they were not repeated
for this copy-only follow-up.

No commits, pushes, deployments, or external issue publication were performed.
