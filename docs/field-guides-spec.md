# Field Guides — Publishing Spec

Status: draft — awaiting owner approval, 2026-11-06

Owner revision — 2026-11-11: the first published guide is **elevated-bpm**, not pstack.
Its existing multi-page guide in `elevated-bpm/learning/field-guide/` is regenerated as
one self-contained file with the `/field-guide` skill. The single-file contract is
unchanged. The URL is `/guides` and the nav label is "Guides". The pstack attribution
decision is withdrawn.
Distribution: local only; no issue-tracker publication
Decision record: [ADR 0008 — Field guides as self-contained HTML, served as-is](adr/0008-field-guides-as-self-contained-html.md)

## Problem Statement

The owner writes field guides to learn new tools and technologies: long-form, visual
developer guides, each authored as one self-contained HTML file in the sibling
`mm-dev-skills` repository. They currently live only on the owner's machine.

The owner wants other developers to be able to use them. The site has no surface for
them. The blog is MDX inside the Chrome, and each guide is a complete document with its
own nav, layout, scripts, and art direction. Publishing a guide must not require
porting it to MDX or breaking its identity. It also must not leave a visitor stranded
on a page with no way back to the rest of the site.

## Solution

Publish each field guide at **`/guides/<slug>`** as its own page, served exactly as
authored except for site-owned sharing tags added to `<head>`. Add a **Guides index**
at `/guides` in the Chrome, linked from the primary nav, the sitemap, and its own
sharing card.

| Surface | Identity | Source |
| --- | --- | --- |
| `/guides` | Chrome (ADR 0003) | Metadata read from each guide's `<head>` |
| `/guides/<slug>` | The guide's own design | `src/content/guides/<slug>.html`, served as-is |
| Sharing card per guide | Chrome card system | Guide title, description, subject |

The first published guide is **elevated-bpm**, a guide to the v3 Deck of the owner's
own featured project. The source is a five-page guide in
`~/a_workspace/elevated-bpm/learning/field-guide/` (index plus four chapters), which
shares an external `../assets/lesson.css` and links to `.md` copies, course pages, and
repository docs. It doesn't meet the contract as it stands. Ticket 01 regenerates it
with the `/field-guide` skill (`~/workspace/mm-dev-skills/mmStack/skills/field-guide/`)
as one self-contained file, `src/content/guides/elevated-bpm.html`.

## User Stories

1. As a developer, I want to read a field guide at a clean, stable URL, so that I can bookmark and share it.
2. As a developer, I want the guide to look and behave exactly as its author designed it, so that its diagrams, nav, and interactions work.
3. As a developer, I want a visible way back from a guide to the rest of the site, so that I can find other guides and the owner's work.
4. As a developer, I want a Guides index listing every published guide, newest first, so that I can see what's available.
5. As a developer, I want each index entry to show the guide's title, description, subject, and publication date, so that I can choose one quickly.
6. As a developer, I want to know which version of a tool a guide reflects, and when, so that I can judge whether it's still accurate.
7. As a developer, I want each guide to link to the official source for its subject, so that I can check it against the real thing.
8. As a developer, I want to reach the Guides index from the site's primary nav, so that I can find guides from any Chrome page.
9. As a visitor sharing a guide, I want a branded preview card with the guide's title and description, so that the link reads well in chat and social feeds.
10. As a search crawler, I want each guide and the index in the sitemap with canonical URLs, so that guides are indexed once, at the canonical origin.
11. As a visitor with reduced-motion preferences, I want a guide's content complete and readable without animation, so that I get the same information.
12. As a phone visitor, I want a guide to fit the screen without horizontal page scroll, so that I can read it on the go.
13. As a keyboard user, I want to move through the guide's nav, controls, and the way-back link with visible focus, so that I can use it without a mouse.
14. As a visitor following a bad link, I want an unknown guide slug to return the site's 404, so that I'm not shown an empty or broken page.
15. As the owner, I want to publish a guide by committing its HTML file, so that publishing is as simple as the blog.
16. As the owner, I want a guide to stay one portable file, with no sidecar metadata, so that I can keep authoring it the same way.
17. As the owner, I want the build to fail and name the guide and field when a guide breaks the contract, so that a broken or incomplete guide can't deploy silently.
18. As the owner, I want local-only notes and repository-relative links, such as machine paths, `.md` copies, and links into a project's docs, removed before a guide goes public, so that every published link works.
21. As a visitor reading the elevated-bpm guide, I want links to the project's case study and live demo, so that I can see the project and try the controls the guide describes.
19. As the owner, I want a written authoring checklist, so that publishing the next guide doesn't require rediscovering the contract.
20. As a maintainer, I want guides verified through the served page and the build contract, so that tests don't mirror private implementation.

## Implementation Decisions

- **Content location:** `src/content/guides/<slug>.html`, alongside
  `src/content/blog/`. The file name is the slug: lowercase kebab-case, with no
  `-guide` suffix. The repository copy is the published source of truth.
  Re-importing an updated draft is a manual copy followed by the authoring checklist.
- **Authoring tool:** guides are produced with the `/field-guide` skill, which outputs
  one self-contained file from its `TEMPLATE.html` and validates it with
  `scripts/check-guide.mjs`. The skill's checks and this site's build contract are
  separate. A guide must pass both.
- **First guide:** `elevated-bpm`, regenerated from the existing five-page guide.
  - **Sources:** `learning/field-guide/*.md`, `CONCEPT.md`,
    `docs/specs/v3-groove-bank-acid.md`, and `GLOSSARY.md` in the elevated-bpm
    repository. Claims come from these sources and the released app.
  - **Links:** every link is absolute or an in-page anchor. There are no `.md`
    copies, links to course pages, or repository-relative links. Link to the case
    study (`/work/elevated-bpm`), the demo (`https://elevated-bpm-dusky.vercel.app`),
    and the repository (`https://github.com/msmele345/elevated-bpm`). Outside
    references such as the Roland and Ableton links may stay.
  - **Metadata:** `guide:subject` is "Elevated BPM", `guide:subject-version` is
    "3.0", and `guide:source` is the repository URL.
- **Serving:** a Route Handler at `src/app/guides/[slug]/route.ts` returns the guide
  with `Content-Type: text/html; charset=utf-8`. It's prerendered at build time with
  `generateStaticParams` over the guides directory, and unknown slugs return the
  site's 404. In Next 16, GET handlers are dynamic by default, so confirm in the build
  output that guide routes are static (see the bundled docs:
  `03-file-conventions/route.md` and `04-functions/generate-static-params.md`).
- **Why not `public/`:** a static file there would need a `.html` URL or a rewrite. It
  would also skip the build contract and give the sitemap and index no list of guides.
  The Route Handler is the one place to add head tags.
- **Metadata contract:** read from the guide's `<head>`:

  | Field | Element | Rule |
  | --- | --- | --- |
  | Title | `<title>` | Required, not blank |
  | Description | `<meta name="description">` | Required, not blank |
  | Published | `<meta name="guide:published">` | Required, valid calendar date `yyyy-mm-dd` |
  | Updated | `<meta name="guide:updated">` | Optional; valid date, not before Published |
  | Subject | `<meta name="guide:subject">` | Required, not blank: the tool or technology name |
  | Subject version | `<meta name="guide:subject-version">` | Optional, not blank when present |
  | Source | `<meta name="guide:source">` | Required `https://` URL to the subject's official docs or repository |

  Reuse `src/lib/calendar-date.ts` for date validation and formatting, so guide dates
  match the blog's uppercase `DD MMM YYYY` display.
- **Structural rules:** checked by the same build validation as the metadata contract.
  - **Way back:** the document contains a link whose `href` is `/guides`.
  - **Self-contained:** no `<script src>`, `<link rel="stylesheet">`, or other
    `<link>` that loads a resource. No `@import` or `url()` pointing to an `http(s)`
    origin. No `<img>`, `<source>`, `<video>`, `<audio>`, or `<iframe>` with an
    `http(s)` `src`. Inline content and `data:` URIs are allowed, and so are
    outbound `<a href>` links.
  - **Site-owned tags absent:** no authored `<link rel="canonical">`, `og:*`, or
    `twitter:*` tags.
- **Parsing:** read `<head>` and the structural signals with an HTML parser, not
  ad-hoc regular expressions over the whole document. Choosing a small parser
  dependency, or a tested, deliberately narrow reader, is decided in ticket 02 and
  recorded there.
- **Build enforcement:** call the guide validator from `next.config.ts` alongside
  `validateShowcaseContent` and `validateTransmissionEditorial`, so that `next dev`
  and `next build` both fail early. Each error names the file and the field or rule,
  for example `elevated-bpm.html: guide:published needs a valid calendar date (yyyy-mm-dd)`.
  An exported validator that nothing calls doesn't satisfy this.
- **Head injection:** after `<head>` opens, the handler adds:
  - the canonical URL (`site.url` + `/guides/<slug>`)
  - `og:type=article`, `og:title`, `og:description`, `og:url`, `og:site_name`,
    `og:image`, and `article:published_time`
  - `twitter:card=summary_large_image` with the title and description
  - the site RSS alternate

  Build the values from the same sources as `socialMetadata` (`src/lib/metadata.ts`)
  so that card type and site name are stated once. Escape all values. Inject nothing
  into `<body>`. Otherwise the response is the authored file, byte for byte.
- **Sharing cards:** add a guide card and a guides-index card to `src/lib/og-card.ts`
  and render them with the existing `renderOgCard`. A per-guide image route lives
  under the guide's segment, or a sibling segment if Next doesn't allow a metadata
  image route alongside `route.ts`. Confirm this in ticket 04.
- **Guides index:** `src/app/guides/page.tsx` lives in the Chrome and mirrors the
  `/blog` index structure and styles:
  - a bar with the title and a one-line description
  - guides newest first by Published, with ties broken by slug
  - each entry shows the date, title linked to the guide, description, and subject
    with its version when present
  - an honest empty state when no guides exist

  Plain `<a>` links (not `next/link`) go to guide pages, because they're full
  document loads outside the app's layout.
- **Primary nav:** add "Guides" to `SiteHeader` between Blog and Contact. The order is
  Work / Blog / Guides / Contact.
- **Sitemap:** `buildSitemap` adds `/guides` and each guide's canonical URL. A guide's
  `lastModified` is Updated when present, otherwise Published.
- **Editorial rules:** applied by the owner during the checklist; not machine-checked.
  - Remove local-only notes: machine paths, "for local reference," and scratch-copy
    remarks.
  - When the owner isn't the subject's author, keep credits and licenses, and label the
    guide unofficial.
  - Make no claims the source material doesn't support (CONTEXT.md, Content Provenance).
- **Per-guide quality bar:** before publishing, each guide is reviewed under reduced
  motion, at phone width (375px) with no horizontal page scroll, and with keyboard
  focus visible on its controls. The site can't style fixes into a guide, so any fix
  happens in the guide file.
- **Authoring checklist:** `docs/field-guide-authoring.md` covers:
  - copying a draft in
  - adding the meta tags and the way-back link
  - the editorial cleanup
  - the quality review
  - running the checks

## Testing Decisions

A good test asserts what a visitor receives at a URL, or the observable result of
validating a guide file. Avoid asserting private parser structure or snapshotting
whole guide documents.

- **Prior art:** follow the existing patterns:
  - `tests/mdx-blog.spec.ts` for the index and article routes
  - `tests/rss-and-og-images.spec.ts` for sharing tags and images
  - `tests/current-transmission-build.spec.ts` and `tests/new-project-readiness-build.spec.ts`
    for real-build enforcement with isolated invalid fixtures
  - `tests/unit/` for contract-level checks
- **Served guide:** `/guides/elevated-bpm` returns 200 as `text/html`. The `<body>` matches
  the committed file. The way-back link reaches `/guides`. An unknown slug returns 404.
- **Head injection:** the canonical URL is the canonical origin, the Open Graph and
  Twitter tags carry the guide's title and description, and the image URL resolves to
  a PNG. Each injected tag appears once.
- **Contract:** exercise each rule with an isolated fixture guide, and check that the
  error names the file and the field:
  - missing or blank fields
  - impossible dates, and Updated before Published
  - a non-https source
  - a missing way-back link
  - each class of external resource
  - an authored canonical or Open Graph tag

  Also check that a valid guide with only the required fields passes.
- **Build enforcement:** an isolated invalid guide makes the real build fail with the
  intended message.
- **Index:** check ordering by date, tie handling, the fields shown, links to guide
  URLs, and the empty state from an isolated empty directory. Never edit or delete
  real guides to create a state.
- **Nav and sitemap:** the primary nav shows Work / Blog / Guides / Contact on Chrome
  pages. The sitemap lists `/guides` and each guide at the canonical origin, with the
  correct `lastModified`.
- **Per-guide review:** for each published guide, record:
  - a reduced-motion pass
  - a 375px no-overflow check
  - a keyboard pass
  - an actual visual inspection

  An automated structural check isn't a visual pass, and agent inspection isn't owner
  approval.
- **Workflow:** use red-green-refactor for behavior changes. Run `npm test`,
  `npm run lint`, `npm run typecheck`, and `npm run build`. Check off only verified
  acceptance criteria.

## Owner Decisions

Resolved 2026-11-11:

- **URL and label:** `/guides`, with the nav label "Guides".
- **First guide:** elevated-bpm, regenerated as one file with `/field-guide`. The
  pstack attribution question no longer applies.

Pending. Defaults apply unless the owner chooses otherwise before the affected ticket
starts:

1. **RSS:** guides stay out of `feed.xml` for now (default), or appear as feed items
   next to posts. This affects ticket 04.
2. **Current Transmission:** Latest Dispatch stays blog-only (default), or the newest
   guide can appear there. Changing it would revise the Current Transmission spec.
3. **v3 release timing:** the guide describes the elevated-bpm v3 Deck. On
   2026-11-11, elevated-bpm `develop` was 20 commits ahead of `main`, so v3 may not
   be live at the demo yet. By default the guide is published only once v3 is live
   at the demo URL, so the guide and the demo agree. This affects ticket 05 and
   publishing.

## Out of Scope

- Converting guides to MDX or React, or rendering them inside the Chrome layout or an iframe.
- Rewriting, minifying, or re-theming a guide's body at build or serve time.
- An import script that syncs from `mm-dev-skills`; copying is manual for now.
- Guide search, tags or filtering on the index, series, or reading-progress features.
- A light theme for the index (ADR 0003 and the v1 exclusions stand).
- Comments, analytics events, or any runtime external service.
- Accepting guides from contributors other than the owner (ADR 0008 consequence).
- Changing the blog, Current Transmission, or Project wall, unless a pending decision above says so.

## Further Notes

- `pstack-guide.html`, an earlier `/field-guide` output, shows the template's
  baseline. It has a sound reduced-motion rule and loads no external resources. Its
  main remaining risk is phone performance from the fixed `blur(80px)` aurora and the
  blended grain layers. Ticket 05 checks the same template layers in the elevated-bpm
  guide.
- The existing elevated-bpm pages use the project's own lesson palette rather than
  the template's ink and lime. Whether the regenerated guide keeps the groovebox
  palette to match its tile and case study is an authoring choice in ticket 01. Both
  are allowed (ADR 0008).
- Adding a link from the elevated-bpm case study to the guide is out of scope here.
  It would change curated project content.
- Future guides may vary their palette and layout freely. The Guides index and
  sharing cards provide the shared, consistent frame.
