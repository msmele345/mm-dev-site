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

| Ticket | Blocked by |
| --- | --- |
| [01 — Give each featured project a curated invitation](#01--give-each-featured-project-a-curated-invitation) | None |
| [02 — Replace the hero with a Site intro that indexes the Project wall](#02--replace-the-hero-with-a-site-intro-that-indexes-the-project-wall) | 01 |
| [03 — Compose the asymmetric layout so the wall shares the opening view](#03--compose-the-asymmetric-layout-so-the-wall-shares-the-opening-view) | 02 |
| [04 — Record the decision and update the maintenance guide](#04--record-the-decision-and-update-the-maintenance-guide) | 03 |

## Decisions already made

- **Headline:** "Built to be curious." It becomes the page `<h1>`.
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

**Status:** ready-for-agent

**Blocked by:** None (can start immediately)

### What to build

Each project that can be featured carries a short, human **invitation**: the verb
phrase a visitor sees in the Site intro index ("Make a beat", "Explore the sky",
"Find a show", "Trade the tape"). It is Curated content, authored alongside the
project's other presentation copy, grounded in what the project actually does (per
Content Provenance: no claims beyond each source repository's documentation). A project
missing a usable invitation fails the build with a slug- and field-specific message,
exactly like the other required presentation fields.

### Acceptance criteria

- [ ] Red first: a failing test shows a featured project without an invitation is rejected by the readiness check with the slug and field named.
- [ ] The four production featured projects each have a reviewed invitation that matches its documented behavior (groovebox, trading terminal, star field, club flyer).
- [ ] Blank, whitespace-only, and missing invitations fail the build; a valid one passes.
- [ ] Invitations are available wherever the featured selection is listed, in wall order.
- [ ] The synthetic new-project readiness fixture and the project-update guide's examples still validate (the fixture gains an invitation).
- [ ] No tile, case-study, or rail rendering changes.

---

## 02 — Replace the hero with a Site intro that indexes the Project wall

**Status:** ready-for-agent

**Blocked by:** 01

### What to build

The home page opens with a **Site intro** instead of the hero: an eyebrow, the headline
"Built to be curious." as the page `<h1>`, one muted supporting sentence, and an index
with one row per featured project in wall order. Each row shows its position, the
invitation, and the project name, and moves the visitor to that project's tile on the
Project wall. The old hero content and classes are gone. Works end to end with
keyboard, screen reader, and no JavaScript.

### Acceptance criteria

- [ ] Red first: tests for the h1, eyebrow, supporting sentence, and index fail before the component exists.
- [ ] The component and its CSS namespace are renamed from hero to Site intro; no `HeroHeader` or `.hero*` selectors remain (case-study hero classes excluded), and the section stays labelled by its `<h1>`.
- [ ] The top line, grid, "2026 Projects", and the "the wall is open" cue no longer render, and the name is not repeated in the intro.
- [ ] One index row per featured project, in wall order, driven by the same selection as the wall; reordering or rotating the selection changes the index with no other edit.
- [ ] Rows are real links with discernible names (invitation plus project name) that land on the matching tile; each wall tile has a stable, slug-based target and the sticky header does not cover it.
- [ ] No count or number-word is hard-coded in copy; an empty selection renders the headline without an empty index.
- [ ] Existing specs that asserted the old hero (`chrome-shell` "hero introduces Mitch…", `home-spacing`, `current-transmission` ordering) are updated to the new structure, and the Intro still precedes the wall in document order.
- [ ] Lint, typecheck, and the full suite pass.

---

## 03 — Compose the asymmetric layout so the wall shares the opening view

**Status:** ready-for-agent

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

- [ ] Layout tests (desktop and mobile widths) show left/right placement at desktop, stacked order on mobile, and no horizontal overflow at the project's supported widths, including 320px.
- [ ] At 1280×800 and 390×844, part of the first tile is visible without scrolling; the empty band between intro and wall stays within the limit the spacing test enforces.
- [ ] Headline size is bounded well below the old hero scale and never overflows its container at any width.
- [ ] Row hover and `:focus-visible` states are distinct, use the lime ring, and meet the contrast thresholds the polish-and-audit spec already measures.
- [ ] Reduced-motion users get the same layout and states with no animation dependence; any transition is disabled under `prefers-reduced-motion`.
- [ ] Touch targets for index rows meet the minimum size the audit enforces.
- [ ] Screenshots at representative widths are captured as evidence and the polish-and-audit spec still passes.

---

## 04 — Record the decision and update the maintenance guide

**Status:** ready-for-agent

**Blocked by:** 03

### What to build

Leave the repo explaining itself. The options document records which direction was
chosen; the project-update guide tells a future maintainer that featuring a project also
needs an invitation and shows where the Site intro index picks it up; the glossary
defines **Site intro** so it replaces "hero" in project vocabulary. No new ADR unless an
established decision actually changed (it should not).

### Acceptance criteria

- [ ] `docs/hero-header-options.md` status reflects the chosen direction (Option 2 layout with Option 5 index) and links this file.
- [ ] `docs/project-update-guide.md` adds the invitation to the new-project checklist and the rotate / reorder steps, and notes the index follows the featured selection automatically.
- [ ] `docs/GLOSSARY.md` defines **Site intro**, and `CONTEXT.md` / `AGENTS.md` references to the "hero" for the home page are corrected if any exist.
- [ ] A final grep confirms no stale references to the old component name or `.hero*` classes outside the case-study hero.
- [ ] Tickets 01–03 acceptance criteria are checked off with verification evidence recorded.
