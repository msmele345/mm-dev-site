# 01 — Publish the pstack guide at its own URL

Status: not started

## Parent

[Field Guides spec](../../docs/field-guides-spec.md)

[Ticket index](README.md)

## What to build

Serve field guides from `src/content/guides/<slug>.html` at `/guides/<slug>`, exactly as
authored, through a statically generated Route Handler. Publish the first guide,
`pstack`, after its editorial cleanup.

Copy `~/workspace/mm-dev-skills/docs/field-guides/pstack-guide.html` to
`src/content/guides/pstack.html` and prepare it:

- Add the metadata contract tags to `<head>`: `guide:published`, `guide:subject`,
  `guide:subject-version` (`0.9.107`), and `guide:source`. The owner confirms the
  source URL.
- Add a way-back link to `/guides` in the guide's own nav. It's styled within the
  guide's design and keyboard reachable.
- Remove the local-only footer copy: the `~/.copilot/installed-plugins/...` path,
  "Generated … for local reference," and the `.scratch/` remark. Rephrase the
  provenance as the plugin version the guide reflects.
- Keep the unofficial-guide note and the Lauren Tan, Michael Denyer, MIT, and Cursor
  credits.

Head injection, build validation, and the index are later tickets. This ticket serves
the authored file unchanged.

## Acceptance criteria

- [ ] `GET /guides/pstack` returns 200 with `Content-Type: text/html; charset=utf-8`, and the response matches the committed file.
- [ ] The guide's own nav, section links, catalog search and filters, and scripts work at the served URL. No console errors are new compared with opening the file directly.
- [ ] `GET /guides/<unknown>` returns the site's 404.
- [ ] The build output lists guide routes as statically generated, not dynamic. This is checked against the bundled Next 16 docs for Route Handlers and `generateStaticParams`.
- [ ] The committed guide carries the required meta tags, the way-back link to `/guides`, and no local-only machine paths or scratch-copy remarks. Its credits and unofficial note are intact.
- [ ] The guides directory and slug derivation are read in one place, ready for the validator, index, and sitemap.
- [ ] Browser tests cover the served guide, the 404, and the way-back link's `href`. Red-green evidence is recorded, and `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.

## Blocked by

None. Owner decisions 1 (URL and label) and 4 (pstack attribution and source URL) in
the spec are confirmed before starting.
