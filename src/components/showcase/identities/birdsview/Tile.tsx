import Link from "next/link";
import type { CSSProperties } from "react";
import TileMeta, { tilePaletteStyle } from "@/components/tiles/TileMeta";
import type { EnrichedProject } from "@/content/projects/enrichment";
import "./identity.css";

const HOTSPOTS = [
  { x: 172, y: 112, primary: false },
  { x: 218, y: 84, primary: true },
  { x: 244, y: 124, primary: false },
  { x: 276, y: 90, primary: false },
  { x: 282, y: 158, primary: false },
] as const;

const SURFACE_OFFSETS = [0, 200] as const;

/**
 * birdsview's chameleon tile: a painted-miniature Earth with electric-mint
 * hotspots, a legible Fact card, and a Passport Stamp (ADR 0002).
 * Motion states (ADR 0006) live in identity.css: ambient = slow globe turn
 * and soft hotspot pulse, crescendo = fly-in toward the target hotspot and
 * stamp landing, static = composed mid-turn view under prefers-reduced-motion.
 */
export default function BirdsviewTile({
  project,
  index,
  displayClassName,
}: {
  project: EnrichedProject;
  index: number;
  displayClassName?: string;
}) {
  const tile = project.tile;
  if (!tile) return null;

  return (
    <Link
      className={`chameleon-tile birdsview-tile${displayClassName ? ` ${displayClassName}` : ""}`}
      href={`/work/${project.slug}`}
      style={tilePaletteStyle(tile.palette)}
    >
      <div className="birdsview-tile__stage" aria-hidden="true">
        <div className="birdsview-tile__hud">
          <span className="birdsview-tile__eyebrow">BIRD&apos;S-EYE VIEW</span>
          <span className="birdsview-tile__badge">PASSPORT · 04/26</span>
        </div>

        <div className="birdsview-tile__camera" data-anim>
          <svg
            className="birdsview-tile__globe-svg"
            viewBox="0 0 360 230"
            role="presentation"
          >
            <defs>
              <radialGradient id="birdsview-tile-glow" cx="64%" cy="50%" r="52%">
                <stop offset="0%" stopColor="#13344d" stopOpacity="0.65" />
                <stop offset="58%" stopColor="#0b1d2c" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#070e16" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="birdsview-tile-atmo" cx="50%" cy="50%" r="50%">
                <stop offset="76%" stopColor="#45ffd0" stopOpacity="0" />
                <stop offset="92%" stopColor="#45ffd0" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#45ffd0" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="birdsview-tile-ocean" cx="38%" cy="34%" r="68%">
                <stop offset="0%" stopColor="#1d5478" />
                <stop offset="58%" stopColor="#0d2b44" />
                <stop offset="100%" stopColor="#071625" />
              </radialGradient>
              <radialGradient id="birdsview-tile-shade" cx="34%" cy="30%" r="70%">
                <stop offset="54%" stopColor="#070e16" stopOpacity="0" />
                <stop offset="100%" stopColor="#04080e" stopOpacity="0.74" />
              </radialGradient>
              <clipPath id="birdsview-tile-clip">
                <circle cx="232" cy="116" r="88" />
              </clipPath>
            </defs>

            <rect width="360" height="230" fill="url(#birdsview-tile-glow)" />

            <circle cx="232" cy="116" r="97" fill="url(#birdsview-tile-atmo)" />
            <circle
              cx="232"
              cy="116"
              r="89"
              fill="none"
              stroke="#45ffd0"
              strokeOpacity="0.38"
              strokeWidth="1.5"
            />

            <g clipPath="url(#birdsview-tile-clip)">
              <circle cx="232" cy="116" r="88" fill="url(#birdsview-tile-ocean)" />

              {/* Stationary latitude lines preserve spherical reading */}
              <g fill="none" stroke="#a1e8d6" strokeOpacity="0.14" strokeWidth="0.9">
                <ellipse cx="232" cy="116" rx="88" ry="26" />
                <ellipse cx="232" cy="116" rx="88" ry="58" />
                <line x1="144" y1="116" x2="320" y2="116" />
              </g>

              {/* Two tiled 200px cycles turn seamlessly via translateX */}
              <g className="birdsview-tile__surface" data-anim>
                {SURFACE_OFFSETS.map((offset) => (
                  <g key={offset} transform={`translate(${offset}, 0)`}>
                    <line
                      x1="158"
                      y1="26"
                      x2="158"
                      y2="206"
                      stroke="#a1e8d6"
                      strokeOpacity="0.11"
                      strokeWidth="0.9"
                    />
                    <line
                      x1="224"
                      y1="26"
                      x2="224"
                      y2="206"
                      stroke="#a1e8d6"
                      strokeOpacity="0.11"
                      strokeWidth="0.9"
                    />
                    <line
                      x1="292"
                      y1="26"
                      x2="292"
                      y2="206"
                      stroke="#a1e8d6"
                      strokeOpacity="0.11"
                      strokeWidth="0.9"
                    />

                    {/* Western stylised continents */}
                    <path
                      d="M150 66 C168 54, 192 56, 200 72 C206 86, 188 98, 172 96 C156 94, 142 78, 150 66 Z"
                      fill="#2a5c54"
                    />
                    <path
                      d="M162 69 C174 63, 186 68, 188 78 C178 84, 166 81, 162 69 Z"
                      fill="#3a614e"
                    />
                    <path
                      d="M174 112 C188 106, 200 118, 196 140 C192 162, 178 178, 168 166 C158 154, 162 118, 174 112 Z"
                      fill="#2a5c54"
                    />
                    <path
                      d="M172 134 C181 130, 186 144, 182 158 C176 152, 170 142, 172 134 Z"
                      fill="#7d6c4d"
                      opacity="0.72"
                    />

                    {/* Central/Eastern stylised continents */}
                    <path
                      d="M214 54 C238 46, 272 52, 288 68 C298 80, 294 98, 276 102 C258 106, 240 94, 222 96 C210 96, 202 68, 214 54 Z"
                      fill="#2a5c54"
                    />
                    <path
                      d="M232 63 C254 58, 278 65, 282 78 C272 88, 248 86, 232 79 Z"
                      fill="#3a614e"
                    />
                    <path
                      d="M254 71 C268 70, 276 78, 270 86 C258 89, 249 82, 254 71 Z"
                      fill="#7d6c4d"
                      opacity="0.7"
                    />
                    <path
                      d="M220 106 C242 102, 264 112, 266 134 C268 158, 250 180, 234 178 C222 176, 218 152, 212 136 C206 122, 208 108, 220 106 Z"
                      fill="#3a614e"
                    />
                    <path
                      d="M226 112 C243 110, 254 122, 252 136 C241 138, 228 130, 226 112 Z"
                      fill="#7d6c4d"
                      opacity="0.75"
                    />
                    <path
                      d="M276 144 C290 140, 304 150, 302 164 C300 176, 284 182, 274 172 C266 164, 268 148, 276 144 Z"
                      fill="#2a5c54"
                    />

                    {/* Soft polar frost */}
                    <ellipse cx="232" cy="34" rx="46" ry="12" fill="#9fb8c2" opacity="0.28" />
                  </g>
                ))}
              </g>

              <circle cx="232" cy="116" r="88" fill="url(#birdsview-tile-shade)" />
            </g>

            {/* Electric-mint hotspots */}
            <g>
              {HOTSPOTS.map((spot, spotIndex) => (
                <g
                  key={`${spot.x}-${spot.y}`}
                  className="birdsview-tile__hotspot"
                  transform={`translate(${spot.x}, ${spot.y})`}
                  style={{ "--hotspot-index": spotIndex } as CSSProperties}
                >
                  <circle
                    className="birdsview-tile__hotspot-ring"
                    data-anim
                    cx="0"
                    cy="0"
                    r={spot.primary ? 12 : 9.5}
                    fill="#45ffd0"
                    fillOpacity="0.24"
                  />
                  {spot.primary ? (
                    <circle
                      className="birdsview-tile__target-ring"
                      data-anim
                      cx="0"
                      cy="0"
                      r="14"
                      fill="none"
                      stroke="#45ffd0"
                      strokeWidth="1.2"
                      strokeOpacity="0.78"
                    />
                  ) : null}
                  <circle
                    cx="0"
                    cy="0"
                    r={spot.primary ? 4.4 : 3.5}
                    fill="#45ffd0"
                    stroke="#070e16"
                    strokeWidth="1.4"
                  />
                </g>
              ))}
              <line
                x1="213"
                y1="89"
                x2="148"
                y2="132"
                stroke="#45ffd0"
                strokeOpacity="0.58"
                strokeWidth="1"
              />
            </g>
          </svg>
        </div>

        <div className="birdsview-tile__card" data-anim>
          <p className="birdsview-tile__card-eyebrow">EUROPE · 48.86° N</p>
          <p className="birdsview-tile__card-title">Paris</p>
          <p className="birdsview-tile__card-fact">
            Eiffel Tower grows taller in summer.
          </p>
        </div>

        <div className="birdsview-tile__stamp" data-anim>
          <span className="birdsview-tile__stamp-brand">BIRDSVIEW</span>
          <span className="birdsview-tile__stamp-word">STAMPED</span>
          <span className="birdsview-tile__stamp-dot" />
        </div>
      </div>

      <TileMeta project={project} index={index} classPrefix="birdsview-tile" />
    </Link>
  );
}
