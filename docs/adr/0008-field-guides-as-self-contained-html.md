# ADR 0008 — Field guides as self-contained HTML, served as-is

Status: proposed — 2026-11-06

## Context

The owner writes **field guides**: long-form, visual developer guides to a tool or
technology, produced with the `/field-guide` skill in the sibling `mm-dev-skills`
repository. Each guide is one complete HTML document. It has its own `<head>`, inline
CSS and JavaScript, a fixed section nav, a full-screen opening, fixed atmosphere
layers, and no external assets (`pstack-guide.html`, an example output, is about
125 KB with no dependencies).

Not every existing guide has this shape. The elevated-bpm guide is five pages sharing
an external stylesheet, with links into its repository. The owner chose to regenerate
it as one file instead of widening the format.

The owner wants to publish them on this site. Three ways were considered:

- **Convert each guide to MDX** (ADR 0005). This keeps every page inside the Chrome,
  but each guide would need hand-porting into React. The single-file authoring loop
  would break, and the guide's bespoke layout and scripts would fight the site's
  stylesheet.
- **Embed the guide in an iframe on a Chrome page.** This would show two navs and two
  scrollbars. The guide's fixed elements would position against the iframe. Its
  content would also be indexed at the raw file's address instead of the page's.
- **Serve the file as its own page.** The guide keeps its identity, and the site adds
  only what the file can't supply for itself.

A guide that owns the whole page already matches the site's model. Chameleon tiles
and case studies carry their own art direction (ADR 0002). The first guide's ink and
lime palette is also close to ADR 0003's.

## Decision

- Field guides are **committed, self-contained HTML files** in
  `src/content/guides/<slug>.html`. The file name is the slug. Publishing works like
  the blog: commit the file and push. The copy in this repository is the published
  source of truth. Guides are drafted with the `/field-guide` skill. A guide is one
  page; a multi-page guide is regenerated as one file before publishing.
- Each guide is served **as its own page** at `/guides/<slug>` by a statically
  generated Route Handler. It isn't converted to MDX, isn't wrapped in the Chrome, and
  isn't embedded in an iframe. Unknown slugs return 404.
- **The site owns the sharing tags, and the guide owns everything else.** At serve
  time the handler adds the canonical URL and the Open Graph, Twitter, and RSS-alternate
  tags to the guide's `<head>`. It adds no visible markup, styles, or scripts.
- **The guide carries its own metadata contract** in its `<head>`:
  - `<title>` and `<meta name="description">`
  - `guide:published`, `guide:subject`, and `guide:source` meta tags
  - optional `guide:updated` and `guide:subject-version` meta tags

  The build reads these values for the index, sitemap, and sharing cards. It needs no
  sidecar file, so each guide stays one HTML file.
- **The way back to the site is authored, not injected.** Each guide's own nav
  includes a link to `/guides`. Adding visible markup to an unknown layout would risk
  colliding with the guide's fixed elements.
- The contract is **enforced during the real build**, alongside the existing showcase
  and editorial checks. If a guide breaks the contract, the build fails and the error
  names the guide and the field.
- `/guides` is a **Chrome index page** (ADR 0003). The primary nav links to it.

## Consequences

- An author can keep writing a guide as one portable file. The site never rewrites a
  guide's body.
- A guide renders outside the shared header and footer, so the way back depends on
  the authored link. The build checks that the link exists.
- A guide can't load external stylesheets, scripts, fonts, or images. Inline content
  and `data:` URIs keep it dependency-free and stop it from adding third-party
  requests to the site. Links out to other sites are allowed.
- A guide can't declare its own canonical or Open Graph tags, because those are the
  site's job. A guide that declares them fails the build instead of shipping
  duplicates.
- A guide's inline scripts run on the site's origin. This is acceptable because only
  the owner authors guides. Accepting outside contributions would reopen this
  decision.
- Each guide's accessibility, reduced-motion behavior, and phone-width layout belong
  to that guide. The site can't style a fix in, so every guide gets its own review
  before publishing.
- Guides about third-party tools need attribution, an "unofficial" note where the
  owner isn't the tool's author, and the version and date the guide reflects. This
  follows CONTEXT.md's rule against unsupported claims.
