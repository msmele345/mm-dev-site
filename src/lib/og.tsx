import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { type OgCard, titleFontSize } from "@/lib/og-card";

/** The Open Graph canvas every network crops from. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const INK = "#08090b";
const PAPER = "#ffffff";
const MUTE = "rgba(245,243,237,0.55)";

const FONTS_DIR = join(process.cwd(), "src", "assets", "fonts");

/**
 * Satori rasterises with real font data — it cannot read `next/font`, and it
 * rejects woff2 — so the two chrome faces are vendored as TTFs and read once
 * per build worker rather than once per card.
 */
const fontData = Promise.all([
  readFile(join(FONTS_DIR, "BebasNeue-Regular.ttf")),
  readFile(join(FONTS_DIR, "IBMPlexMono-Regular.ttf")),
]).then(([display, body]) => [
  { name: "Bebas Neue", data: display, style: "normal" as const, weight: 400 as const },
  { name: "IBM Plex Mono", data: body, style: "normal" as const, weight: 400 as const },
]);

/**
 * The site's shared-link skin: ink-black ground, accent rule, the wordmark
 * locked to the footer, and one loud line of display type. Every card is this
 * card — only the copy and the accent change (issue 07).
 */
export async function renderOgCard(card: OgCard): Promise<ImageResponse> {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "76px 88px 64px",
          position: "relative",
        }}
      >
        {/* Accent rule across the top — the tile's colour, or the chrome's lime. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: OG_SIZE.width,
            height: 14,
            background: card.accent,
          }}
        />
        {/* A single soft bloom keeps the ground from reading as flat black. */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            right: -220,
            bottom: -260,
            width: 780,
            height: 780,
            borderRadius: 780,
            backgroundImage: `radial-gradient(circle, ${card.accent} 0%, rgba(8,9,11,0) 68%)`,
            opacity: 0.22,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "IBM Plex Mono",
              fontSize: 24,
              letterSpacing: 6,
              color: card.accent,
            }}
          >
            {card.eyebrow}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Bebas Neue",
            fontSize: titleFontSize(card.title),
            lineHeight: 0.92,
            letterSpacing: 1,
            color: PAPER,
            maxWidth: 1024,
          }}
        >
          {card.title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: `1px solid ${card.accent}`,
            paddingTop: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Bebas Neue",
              fontSize: 40,
              letterSpacing: 4,
              color: PAPER,
            }}
          >
            {card.signature}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "IBM Plex Mono",
              fontSize: 24,
              color: MUTE,
            }}
          >
            {card.footnote}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fontData },
  );
}
