# Site Intro — Replace the Hero Header

Replace the oversized hero with a compact **Site intro**: an asymmetric header that
states one idea and indexes the featured projects, so the **Project wall**'s artwork
shares the opening view. Direction chosen from
[`docs/hero-header-options.md`](../docs/hero-header-options.md): Option 2's layout with
Option 5's verb index as the right-hand column, using the telescope app's quiet
eyebrow → title → muted-sentence hierarchy inside the existing ink / white / lime Chrome
(ADR 0003 is unchanged; no new palette, no light mode).

Work against these tickets in order, on a branch named `feat/site-intro` cut from `main`.
Follow the repository TDD cadence (red, green, refactor) and tick each acceptance
criterion as it is verified. Preserve unrelated checkout changes.

**Tickets 01–03 ship as a single PR.** 01 has no visible output and 02 removes the
`.hero*` styles before 03 lays out the replacement, so merging either alone leaves
`main` with an unstyled intro. 04 may ride in the same PR or follow it.

| Ticket | Blocked by |
| --- | --- |
| [01 — Give each featured project a curated invitation](#01--give-each-featured-project-a-curated-invitation) | None |
| [02 — Replace the hero with a Site intro that indexes the Project wall](#02--replace-the-hero-with-a-site-intro-that-indexes-the-project-wall) | 01 |
| [03 — Compose the asymmetric layout so the wall shares the opening view](#03--compose-the-asymmetric-layout-so-the-wall-shares-the-opening-view) | 02 |
| [04 — Record the decision and update the maintenance guide](#04--record-the-decision-and-update-the-maintenance-guide) | 03 |

## Decisions already made

- **Eyebrow:** "Software engineer · Side projects · 2026".
- **Headline:** "Built to be curious." It becomes the page `<h1>`.
- **Supporting sentence:** "Every project here started as a question I couldn't leave
  alone." It says *why* the projects exist, not *what* they are (the index already
  says what), so it must not repeat the invitations.
- **Index rows link to case studies** (`/work/{slug}`), not to tiles. The wall already
  shares the opening view, so an in-page jump adds little; the index is navigation.
  No tile ids or `scroll-margin` work is needed.
- **Project wall bar:** the "N featured projects" count is removed and the
  "Project wall" `<h2>` becomes visually hidden (it still labels the section). The
  index now introduces the wall; three visible listings of the same projects in one
  viewport is noise.
- **Invitation lives on `Project`** (the featured tier), not `ProjectCore`. Rail
  entries never need one.
- **Mobile index is compact:** below the desktop breakpoint each row shows position
  and invitation only; the project name stays in the row's accessible name via
  visually hidden text. This keeps the first tile in view as the featured count grows.
- **Name:** stays in the Chrome wordmark and page metadata only; the intro no longer
  repeats it.
- **Index rows** derive from the same curated featured selection as the Project wall,
  so add / remove / replace / reorder (see the
  [Featured Project Update spec](../docs/featured-project-update-spec.md)) flows through
  with no second list to maintain. Copy must not hard-code a project count.
- **Removed:** the top line, background grid, "2026 Projects" paragraph, and "the wall is
  open" cue. The `HeroHeader` component and `.hero*` classes are renamed, not kept
  alongside. Case-study heroes (`.case__hero`) are a different concept and are untouched.
- **Out of scope:** tile art, case-study pages, Current Transmission, and any
  light/dark behavior. Per-row crescendo triggering is deferred (only one tile may
  crescendo at a time; revisit separately).

---

## 01 — Give each featured project a curated invitation

**Status:** implemented and verified locally — 2026-10-31

**Blocked by:** None (can start immediately)

### What to build

Each project that can be featured carries a short, human **invitation**: the verb
phrase a visitor sees in the Site intro index ("Make a beat", "Explore the sky",
"Find a show", "Pull the lever"). It is Curated content, authored alongside the
project's other presentation copy, grounded in what the project actually does (per
Content Provenance: no claims beyond each source repository's documentation). A project
missing a usable invitation fails the build with a slug- and field-specific message,
exactly like the other required presentation fields.

### Acceptance criteria

- [x] Red first: a failing test shows a featured project without an invitation is rejected by the readiness check with the slug and field named.
- [x] `invitation` is a required field on `Project`, not `ProjectCore`; rail entries validate without one.
- [x] Provenance check: each invitation is verified against its source repository's CONCEPT / PRD / README in `~/a_workspace/` (in particular "Trade the tape" for terminal-one and "Find a show" for sound-city), and the doc that supports it is noted in the PR. *(Verified, and "Trade the tape" rejected; see Provenance below. Table is in [PR #28](https://github.com/msmele345/mm-dev-site/pull/28).)*
- [x] The four production featured projects each have a reviewed invitation that matches its documented behavior (groovebox, trading terminal, star field, club flyer). *(Owner approved "Pull the lever".)*
- [x] Blank, whitespace-only, and missing invitations fail the build; a valid one passes.
- [x] Invitations are available wherever the featured selection is listed, in wall order.
- [x] The synthetic new-project readiness fixture and the project-update guide's examples still validate (the fixture gains an invitation).
- [x] No tile, case-study, or rail rendering changes.

### Provenance

"Trade the tape" was the proposed terminal-one invitation. It failed the check: no
terminal-one doc uses "tape", and the README and PRD D14 say the app is advisory and
never routes a live order. It is replaced with the documented core interaction.

| Project | Invitation | Supporting doc |
| --- | --- | --- |
| elevated-bpm | Make a beat | `CONCEPT.md` — playable groovebox for making techno; "Shareable beats" |
| terminal-one | Pull the lever | `docs/PRD.md` — D9, D17, FR-15, primary flow "Pull the lever" |
| telescope | Explore the sky | `docs/PRD.md` — story 4, drag the sky dome to "explore in every direction" |
| sound-city | Find a show | `PRD.md` — local music finder; find events; "upcoming shows" (story 14) |

### Verification

`tests/unit/project-readiness.spec.ts` covers the readiness rules. Full suite on
2026-10-31: 493 passed, 2 skipped (`project-verification`, which only runs through
`npm run project -- verify <slug>`).

---

## 02 — Replace the hero with a Site intro that indexes the Project wall

**Status:** implemented and verified locally — 2026-10-31

**Blocked by:** 01

### What to build

The home page opens with a **Site intro** instead of the hero: an eyebrow, the headline
"Built to be curious." as the page `<h1>`, one muted supporting sentence, and an index
with one row per featured project in wall order. Each row shows its position, the
invitation, and the project name, and links to that project's case study. The
Project wall bar drops its count and visually hides its heading. The old hero content
and classes are gone. Works end to end with
keyboard, screen reader, and no JavaScript.

### Acceptance criteria

- [x] Red first: tests for the h1, eyebrow, supporting sentence, and index fail before the component exists.
- [x] The component and its CSS namespace are renamed from hero to Site intro; no `HeroHeader` or `.hero*` selectors remain (case-study hero classes excluded), and the section stays labelled by its `<h1>`.
- [x] The top line, grid, "2026 Projects", and the "the wall is open" cue no longer render, and the name is not repeated in the intro.
- [x] One index row per featured project, in wall order, driven by the same selection as the wall; reordering or rotating the selection changes the index with no other edit.
- [x] Eyebrow and supporting sentence render exactly the copy in "Decisions already made"; the sentence does not repeat any invitation.
- [x] Rows are real links to `/work/{slug}` with discernible names (invitation plus project name).
- [x] The Project wall no longer shows a featured-project count; its "Project wall" `<h2>` is visually hidden and still labels the section.
- [x] No count or number-word is hard-coded in copy; an empty selection renders the headline without an empty index.
- [x] Existing specs that asserted the old hero (`chrome-shell` "hero introduces Mitch…", `home-spacing`, `current-transmission` ordering) are updated to the new structure, and the Intro still precedes the wall in document order.
- [x] Lint, typecheck, and the full suite pass.

### Verification

Red: `tests/site-intro.spec.ts` failed 6 of 7 before `SiteIntro` existed (the seventh is a copy guard on the sentence constant). Green: that spec, lint, typecheck, and the full Playwright suite pass. Rows and the wall share `listWallProjects()`; the rotation spec asserts index order across remove, replace, reorder, add, and empty selections.

---

## 03 — Compose the asymmetric layout so the wall shares the opening view

**Status:** implemented and verified locally — 2026-10-31

**Blocked by:** 02

### What to build

Make the Site intro look and feel right. At desktop widths the headline block sits on
the left and the index on the right, with a headline scale far below the old 23vw
display type; on mobile they stack. The intro is short enough that the top of the
Project wall's artwork is visible in the first viewport. Use the telescope app's
hierarchy and restraint (small uppercase eyebrow, plain title, one muted sentence,
generous whitespace) in the existing ink / white / lime language. Index rows have clear
hover and keyboard-focus states in lime and stay legible without relying on motion.

### Acceptance criteria

- [x] Layout tests (desktop and mobile widths) show left/right placement at desktop, stacked order on mobile, and no horizontal overflow at the project's supported widths, including 320px.
- [x] At 1280×800 and 390×844, part of the first tile is visible without scrolling; the empty band between intro and wall stays within the limit the spacing test enforces.
- [x] The first-viewport check also passes with a six-project featured fixture, so growth in the selection does not push the wall off screen.
- [x] On mobile, index rows show position and invitation only; the project name remains in each link's accessible name.
- [x] Headline size is bounded well below the old hero scale and never overflows its container at any width.
- [x] Row hover and `:focus-visible` states are distinct, use the lime ring, and meet the contrast thresholds the polish-and-audit spec already measures.
- [x] Reduced-motion users get the same layout and states with no animation dependence; any transition is disabled under `prefers-reduced-motion`.
- [x] Touch targets for index rows meet the minimum size the audit enforces. *(The audit enforces no minimum; rows use 44px. See the evidence README.)*
- [x] Screenshots at representative widths are captured as [evidence](../docs/verification/site-intro/03/README.md) and the polish-and-audit spec still passes.

---

## 04 — Record the decision and update the maintenance guide

**Status:** implemented and verified locally — 2026-10-31

**Blocked by:** 03

### What to build

Leave the repo explaining itself. The options document records which direction was
chosen; the project-update guide tells a future maintainer that featuring a project also
needs an invitation and shows where the Site intro index picks it up; the glossary
defines **Site intro** so it replaces "hero" in project vocabulary. No new ADR unless an
established decision actually changed (it should not).

### Acceptance criteria

- [x] `docs/hero-header-options.md` status reflects the chosen direction (Option 2 layout with Option 5 index) and links this file.
- [x] `docs/project-update-guide.md` adds the invitation to the new-project checklist and the rotate / reorder steps, and notes the index follows the featured selection automatically.
- [x] `docs/GLOSSARY.md` defines **Site intro**, and `CONTEXT.md` / `AGENTS.md` references to the "hero" for the home page are corrected if any exist.
- [x] A final grep confirms no stale references to the old component name or `.hero*` classes outside the case-study hero.
- [x] Tickets 01–03 acceptance criteria are checked off with verification evidence recorded.

### Verification

The grep covered `src`, `scripts`, `tests`, `README.md`, `AGENTS.md`, `CONTEXT.md`, the
glossary, the project-update guide, and the content schema. No `HeroHeader` or `.hero*`
reference remains; in `src` the word "hero" survives only for the case-study hero
(`.case__hero` and comments on it). Dated specs, tickets, and verification records keep it as history. Lint and
typecheck pass, and the full suite result is recorded under ticket 01.
