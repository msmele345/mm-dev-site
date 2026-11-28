# Project verification: birdsview

Stage: published

Recorded: 2026-11-28T03:38:28.961Z

Content ready: yes

Presentation registered: yes

Presentation finished: yes

## Source review notes

# "Birdsview" review notes

Source repository: "/Users/mitchmele/a_workspace/birdsview"

Source revision: `1fd7238284da2d74dcb7353f95f2e2033e1389c5`

Working tree at authoring time: clean (`git -C ../birdsview status --short` returned no uncommitted source changes).

Live demo check at authoring time: `https://birdsview-ochre.vercel.app` returned HTTP 200 serving `birdsview — A world of wonder`.

## Source paths read

- `CONTEXT.md` — product overview, domain glossary (`Globe`, `Hotspot`, `Fly-in`, `Bird's-eye view`, `Fact card`, `Tour`, `Passport`, `Stamp`, `Quality tier`, `Google mode`, `Open-data mode`, `Diorama grade`), and binding constraints (zero spend, single root request per session, kid-safe, no accounts, no backend).
- `README.md` — setup, quota setup, tour/passport behavior, open-data terrain, and Vercel preset. Note: `README.md` states `20 curated locations`; `src/data/locations.json` currently holds 26, so copy uses the data file count.
- `package.json` — stack dependencies and tooling (`TypeScript`, `React 19`, `Vite`, `CesiumJS`, `Zod`, `Vitest`, `Playwright`).
- `docs/spec.md` — Release One spec (problem statement, solution, user stories, out-of-scope items including quiz deferral and lighting/cloud deferral).
- `docs/adr/0001-cesiumjs-with-google-3d-tiles.md` through `docs/adr/0011-release-one-lighting-and-cloud-scope.md` — architectural decisions: free-tier quota cap (0001), Google or open-data per session without mixing (0002), curated JSON content without backend (0003), kid-safe no-accounts experience and read-aloud facts (0004), release-one loop and quiz deferral (0005), quality tiers and painted-miniature diorama grade (0006), Vite/React/Cesium/Vercel stack (0007), testing strategy (0008), secrets/dev flag (0009), attribution links exception (0010), and deferral of current-time day/night lighting and clouds beyond release one (0011).
- `docs/specs/green-accent-spec.md`, `docs/specs/location-batch-spec.md`, `docs/specs/google-globe-startup-spec.md` — electric-mint accent selection (`#45ffd0`, `#a1e8d6`, `#487d71`), expanded location batch and second tour, and startup/attribution behavior.
- `src/data/locations.json` — 26 locations across all 7 continents (9 `city`, 9 `natural-wonder`, 8 `geological-site`), including exact Paris coordinates (`48.86° N · 2.29° E`) and facts used on `fact-card.svg`.
- `src/data/tours.json` — 2 curated tours: `"Once around the world"` (13 stops) and `"What shapes the land?"` (6 stops).
- `src/styles.css` — palette tokens (`#070e16` surface/ground, `#0b141d` attribution/panel, `#f4eedf` ink, `#abb8bf` mute, `#45ffd0` electric-mint accent, `#a1e8d6` support, `#487d71` border, `#f08a78` visited passport dot) and fonts (`Libre Caslon Display`, `DM Sans`).
- `src/App.tsx`, `src/FactCard.tsx`, `src/Passport.tsx`, `src/TourControls.tsx` — UI copy and control layout used as reference for the hand-drawn SVG plates.

## Claim provenance

- **Pitch & invitation (`"Fly over the world"`):** grounded in `CONTEXT.md`, `docs/spec.md`, and `src/App.tsx` / `src/TourControls.tsx` (`"Take me somewhere"` is available as a source-verbatim alternative invitation).
- **Problem:** grounded in `docs/spec.md` ("Geography is taught from flat maps and lists of capitals..."), `ADR 0003`, and `ADR 0004`.
- **Build:** grounded in `docs/spec.md`, `ADR 0001`, `ADR 0002`, `ADR 0006` (painted-miniature diorama grade, quality tiers), and `ADR 0004` (read-aloud facts, no accounts).
- **Result & deferred scope:** release-one status grounded in `docs/spec.md` and `docs/specs/*`; counts (`26 locations across all seven continents`, `two guided tours`) verified directly from `src/data/locations.json` and `src/data/tours.json`; deferred day/night lighting and clouds grounded in `ADR 0011`; deferred quiz grounded in `ADR 0005` and `docs/spec.md`. No usage, performance, or launch claims appear.
- **SVG plates (`globe.svg`, `fact-card.svg`):** hand-drawn vector illustrations in the birdsview palette with no Google or EOX imagery.

## Owner review

- [ ] Review source-grounded copy (pitch, invitation, and problem/build/result story) and flip `draft: false` when approved.
- [ ] Confirm invitation wording (draft: `"Fly over the world"`; source-verbatim alternative: `"Take me somewhere"`).
- [ ] Review SVG plates (`public/projects/birdsview/globe.svg` and `public/projects/birdsview/fact-card.svg`), alt text, and captions.
- [ ] Review tile and case-study artwork (Ticket 02).


## Changed paths

```text

Branch changes relative to main:
None.
Checkout changes:
M src/components/showcase/identities/birdsview/Artwork.tsx
 M src/components/showcase/identities/birdsview/Tile.tsx
 M src/components/showcase/identities/birdsview/identity.css
 M src/content/projects/selection.json
 M src/fonts.ts
?? docs/verification/birdsview-featured/02/README.md
?? docs/verification/birdsview-featured/02/browser/.last-run.json
?? docs/verification/birdsview-featured/02/browser/project-verification-publi-1306f-ack-and-responsive-captures/case-study-1440.png
?? docs/verification/birdsview-featured/02/browser/project-verification-publi-1306f-ack-and-responsive-captures/case-study-390.png
?? docs/verification/birdsview-featured/02/browser/project-verification-publi-1306f-ack-and-responsive-captures/case-study-768.png
?? docs/verification/birdsview-featured/02/build.log
?? docs/verification/birdsview-featured/02/input.json
?? docs/verification/birdsview-featured/02/playwright.log
?? docs/verification/birdsview-featured/02/results.json
?? tests/birdsview-case-study.spec.ts
?? tests/birdsview-tile.spec.ts

```

## Commands and results

Command: npm run project -- verify birdsview

Browser checks: required for published work

## Owner evidence

- [ ] Owner copy review

- [ ] Owner artwork approval

- [ ] Physical-device review

- [ ] Deployment

- [ ] Production curation

Captures are automated evidence and do not approve visual quality.

Command: npm run build -- --webpack (isolated checkout snapshot; unavailable local enrichment)

Build exit: 0

Command: playwright test --config playwright.project.config.ts

Browser exit: 0

Browser checks: passed

Result: passed

## Diagnostic evidence and captures

- [build.log](build.log)

- [input.json](input.json)

- [playwright.log](playwright.log)

- [results.json](results.json)

- [browser/.last-run.json](browser/.last-run.json)

- [browser/project-verification-publi-1306f-ack-and-responsive-captures/case-study-1440.png](browser/project-verification-publi-1306f-ack-and-responsive-captures/case-study-1440.png)

- [browser/project-verification-publi-1306f-ack-and-responsive-captures/case-study-390.png](browser/project-verification-publi-1306f-ack-and-responsive-captures/case-study-390.png)

- [browser/project-verification-publi-1306f-ack-and-responsive-captures/case-study-768.png](browser/project-verification-publi-1306f-ack-and-responsive-captures/case-study-768.png)
