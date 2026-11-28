import "./identity.css";

const CASE_HOTSPOTS = [
  { x: 108, y: 92 },
  { x: 150, y: 78 },
  { x: 176, y: 124 },
  { x: 212, y: 84 },
  { x: 222, y: 158 },
] as const;

/**
 * birdsview's static case-study hero artwork: a composed Fact card + Passport
 * Stamp paired with a painted-miniature SVG globe. No motion on long-form prose.
 */
export default function BirdsviewArtwork() {
  return (
    <div className="case-motif case-motif--birdsview" aria-hidden="true">
      <div className="birdsview-case__card">
        <div className="birdsview-case__card-head">
          <p className="birdsview-case__coords">EUROPE / CITY · 48.86° N</p>
          <div className="birdsview-case__stamp">
            <span className="birdsview-case__stamp-brand">BIRDSVIEW</span>
            <span className="birdsview-case__stamp-word">STAMPED</span>
            <span className="birdsview-case__stamp-dot" />
          </div>
        </div>
        <p className="birdsview-case__place">Paris</p>
        <p className="birdsview-case__fact">
          Heat expands the Eiffel Tower&apos;s iron in summer, making it grow slightly taller until winter cools it back down.
        </p>
        <div className="birdsview-case__card-foot">
          <span>FACT 1 OF 2</span>
          <span>PASSPORT · 4 OF 26</span>
        </div>
      </div>

      <div className="birdsview-case__globe-wrap">
        <svg
          className="birdsview-case__globe-svg"
          viewBox="0 0 320 240"
          role="presentation"
        >
          <defs>
            <radialGradient id="birdsview-case-atmo" cx="50%" cy="50%" r="50%">
              <stop offset="76%" stopColor="#45ffd0" stopOpacity="0" />
              <stop offset="92%" stopColor="#45ffd0" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#45ffd0" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="birdsview-case-ocean" cx="38%" cy="34%" r="68%">
              <stop offset="0%" stopColor="#1d5478" />
              <stop offset="58%" stopColor="#0d2b44" />
              <stop offset="100%" stopColor="#071625" />
            </radialGradient>
            <radialGradient id="birdsview-case-shade" cx="34%" cy="30%" r="70%">
              <stop offset="54%" stopColor="#070e16" stopOpacity="0" />
              <stop offset="100%" stopColor="#04080e" stopOpacity="0.74" />
            </radialGradient>
            <clipPath id="birdsview-case-clip">
              <circle cx="164" cy="120" r="96" />
            </clipPath>
          </defs>

          <circle cx="164" cy="120" r="106" fill="url(#birdsview-case-atmo)" />
          <circle
            cx="164"
            cy="120"
            r="97"
            fill="none"
            stroke="#45ffd0"
            strokeOpacity="0.36"
            strokeWidth="1.5"
          />

          <g clipPath="url(#birdsview-case-clip)">
            <circle cx="164" cy="120" r="96" fill="url(#birdsview-case-ocean)" />

            <g fill="none" stroke="#a1e8d6" strokeOpacity="0.14" strokeWidth="1">
              <ellipse cx="164" cy="120" rx="96" ry="30" />
              <ellipse cx="164" cy="120" rx="96" ry="64" />
              <ellipse cx="164" cy="120" rx="36" ry="96" />
              <ellipse cx="164" cy="120" rx="70" ry="96" />
              <line x1="68" y1="120" x2="260" y2="120" />
              <line x1="164" y1="24" x2="164" y2="216" />
            </g>

            {/* Painted-miniature stylised landmasses */}
            <path
              d="M84 68 C102 55, 126 58, 134 74 C142 90, 122 102, 106 100 C90 98, 76 82, 84 68 Z"
              fill="#2a5c54"
            />
            <path
              d="M96 72 C108 66, 120 70, 122 81 C112 87, 100 84, 96 72 Z"
              fill="#3a614e"
            />
            <path
              d="M104 116 C118 110, 130 122, 126 146 C122 170, 108 186, 98 174 C88 162, 92 122, 104 116 Z"
              fill="#2a5c54"
            />
            <path
              d="M102 140 C111 136, 116 150, 112 164 C106 158, 100 148, 102 140 Z"
              fill="#7d6c4d"
              opacity="0.72"
            />

            <path
              d="M146 54 C172 46, 206 52, 224 68 C236 80, 230 98, 212 104 C194 108, 174 94, 154 96 C142 96, 134 68, 146 54 Z"
              fill="#2a5c54"
            />
            <path
              d="M164 64 C188 58, 212 66, 216 80 C206 90, 180 88, 164 81 Z"
              fill="#3a614e"
            />
            <path
              d="M186 73 C202 72, 210 80, 204 89 C192 92, 182 84, 186 73 Z"
              fill="#7d6c4d"
              opacity="0.7"
            />

            <path
              d="M154 108 C176 104, 198 114, 200 138 C202 164, 184 188, 168 186 C156 184, 152 160, 144 142 C138 126, 140 112, 154 108 Z"
              fill="#3a614e"
            />
            <path
              d="M160 116 C178 114, 190 126, 188 142 C176 144, 162 134, 160 116 Z"
              fill="#7d6c4d"
              opacity="0.74"
            />

            <path
              d="M210 150 C226 144, 240 154, 238 170 C236 184, 218 190, 208 180 C200 172, 202 154, 210 150 Z"
              fill="#2a5c54"
            />

            <ellipse cx="164" cy="30" rx="50" ry="13" fill="#9fb8c2" opacity="0.28" />
            <circle cx="164" cy="120" r="96" fill="url(#birdsview-case-shade)" />
          </g>

          {/* Hotspots + callout badges */}
          <g>
            {CASE_HOTSPOTS.map((spot) => (
              <g key={`${spot.x}-${spot.y}`}>
                <circle cx={spot.x} cy={spot.y} r="10" fill="#45ffd0" fillOpacity="0.2" />
                <circle
                  cx={spot.x}
                  cy={spot.y}
                  r="4.2"
                  fill="#45ffd0"
                  stroke="#070e16"
                  strokeWidth="1.4"
                />
              </g>
            ))}

            <line x1="150" y1="78" x2="112" y2="48" stroke="#45ffd0" strokeOpacity="0.65" strokeWidth="1.1" />
            <rect x="64" y="34" width="48" height="20" rx="2" fill="#0b141d" stroke="#487d71" strokeWidth="1" />
            <text
              x="88"
              y="48"
              textAnchor="middle"
              fill="#f4eedf"
              fontSize="10"
              fontWeight="500"
            >
              Paris
            </text>

            <line x1="176" y1="124" x2="230" y2="124" stroke="#45ffd0" strokeOpacity="0.65" strokeWidth="1.1" />
            <rect x="230" y="114" width="48" height="20" rx="2" fill="#0b141d" stroke="#487d71" strokeWidth="1" />
            <text
              x="254"
              y="128"
              textAnchor="middle"
              fill="#f4eedf"
              fontSize="10"
              fontWeight="500"
            >
              Cairo
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
