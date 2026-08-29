# Vendored fonts

These TTFs exist only for `ImageResponse` (OG card generation, issue 07). Satori
rasterises with raw font data — it cannot read `next/font`, and it rejects woff2,
which is what Google Fonts serves by default. The chrome itself still loads both
faces through `next/font/google`; these files are never shipped to the browser.

| File                       | Family        | Licence                                                    |
| -------------------------- | ------------- | ---------------------------------------------------------- |
| `BebasNeue-Regular.ttf`    | Bebas Neue    | SIL Open Font License 1.1 — github.com/dharmatype/Bebas-Neue |
| `IBMPlexMono-Regular.ttf`  | IBM Plex Mono | SIL Open Font License 1.1 — github.com/IBM/plex             |

Both are redistributable under the OFL. Keep this list in step with `src/lib/og.tsx`.
