# 01 — Publish the elevated-bpm guide at its own URL

Status: not started

## Parent

[Field Guides spec](../../docs/field-guides-spec.md)

[Ticket index](README.md)

## What to build

Serve field guides from `src/content/guides/<slug>.html` at `/guides/<slug>`, exactly as
authored, through a statically generated Route Handler. Publish the first guide,
`elevated-bpm`.

The existing guide in `~/a_workspace/elevated-bpm/learning/field-guide/` has five
pages, an external `../assets/lesson.css`, and links to `.md` copies, course pages,
and repository docs. Regenerate it as one self-contained file with the `/field-guide`
skill:

- Run `/field-guide` with the output path `src/content/guides/elevated-bpm.html`.
- Use as sources `learning/field-guide/*.md`, `CONCEPT.md`,
  `docs/specs/v3-groove-bank-acid.md`, and `GLOSSARY.md` from the elevated-bpm
  repository. Cover the guide's overview and its four strands: Feel (Swing and
  Level), Find your way around the Deck, the Pattern bank, and Acid (Accent, Slide,
  and Env Mod).
- Don't invent claims. Every control, default, and behavior must trace back to a
  source.
- Make every link absolute or an in-page anchor. Link to the case study
  (`/work/elevated-bpm`), the demo, and the repository. Drop the `.md`, course-page,
  and repository-relative links. Outside references such as Roland and Ableton may
  stay.
- Add the metadata contract tags to `<head>`:
  - `guide:published`
  - `guide:subject`: "Elevated BPM"
  - `guide:subject-version`: "3.0"
  - `guide:source`: `https://github.com/msmele345/elevated-bpm`
- Add a way-back link to `/guides` in the guide's own nav. Style it within the
  guide's design and make it keyboard reachable.
- Decide the palette: the template's ink and lime, or the groovebox lesson palette
  to match the tile. Record the choice.

Head injection, site-side build validation, and the index are later tickets. This
ticket serves the authored file unchanged.

## Acceptance criteria

- [ ] `src/content/guides/elevated-bpm.html` is one file with inline CSS and JS. It has no external stylesheet, script, font, or image, and it passes the skill's `scripts/check-guide.mjs`.
- [ ] The guide covers the overview and all four strands. Its claims trace back to the listed elevated-bpm sources. Every link is absolute or an in-page anchor and resolves. There are no `.md`, course-page, or repository-relative links.
- [ ] The guide links to `/work/elevated-bpm`, the demo, and the repository. It carries the required meta tags and a way-back link to `/guides`.
- [ ] `GET /guides/elevated-bpm` returns 200 with `Content-Type: text/html; charset=utf-8`, and the response matches the committed file.
- [ ] The guide's nav, section links, interactive components, and scripts work at the served URL, with no console errors.
- [ ] `GET /guides/<unknown>` returns the site's 404.
- [ ] The build output lists guide routes as statically generated, not dynamic. This is checked against the bundled Next 16 docs for Route Handlers and `generateStaticParams`.
- [ ] The guides directory and slug derivation are read in one place, ready for the validator, index, and sitemap.
- [ ] Browser tests cover the served guide, the 404, and the way-back link's `href`. Red-green evidence is recorded, and `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- [ ] The agent's visual inspection of the guide at 1440px, 768px, and 390px is recorded. The owner reviews the regenerated copy separately.

## Blocked by

None.
