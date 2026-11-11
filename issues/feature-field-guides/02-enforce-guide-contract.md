# 02 — Enforce the guide contract through the real build

Status: not started

## Parent

[Field Guides spec](../../docs/field-guides-spec.md)

[Ticket index](README.md)

## What to build

Read each guide's metadata from its `<head>` and check the structural rules. Make
`next dev` and `next build` fail with an error naming the guide file and the field or
rule. Call the validator from `next.config.ts` alongside the existing showcase and
editorial checks. Expose the parsed metadata (title, description, published, updated,
subject, subject version, source, slug) for tickets 03 and 04.

Choose the HTML parsing approach and record the choice and reason in this ticket's
verification notes. The options are a small parser dependency or a narrow, tested
reader. Don't use regular expressions over the whole document.

## Acceptance criteria

- [ ] Required fields are enforced, and each failure names the file and field:
  - `<title>` and `<meta name="description">` are present and not blank.
  - `guide:published` is a valid calendar date (`yyyy-mm-dd`). Use the existing calendar-date helpers.
  - `guide:subject` is present and not blank.
  - `guide:source` is an `https://` URL.
- [ ] Optional `guide:updated` must be a valid date, not before Published. Optional `guide:subject-version` must not be blank when present.
- [ ] A guide with no link to `/guides` fails, naming the way-back rule.
- [ ] A guide that loads an external resource fails and names the offending element. This covers `<script src>`, a stylesheet or other resource `<link>`, a CSS `@import` or `url()` pointing to `http(s)`, and an `http(s)` `src` on `<img>`, `<source>`, `<video>`, `<audio>`, or `<iframe>`. `data:` URIs and outbound `<a href>` links pass.
- [ ] A guide that authors its own `<link rel="canonical">`, `og:*`, or `twitter:*` tag fails, naming the tag.
- [ ] A file name that isn't a lowercase kebab-case slug fails.
- [ ] The committed `elevated-bpm.html` passes, and so does a minimal valid fixture with only the required fields.
- [ ] Unit tests exercise each rule with isolated fixtures. A build test shows an isolated invalid guide failing the real build with the intended message. Real guides aren't edited to create failures.
- [ ] Red-green evidence is recorded, and `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

## Blocked by

- [01 — Publish the elevated-bpm guide at its own URL](01-publish-elevated-bpm-guide.md)
