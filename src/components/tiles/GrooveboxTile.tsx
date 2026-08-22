import Link from "next/link";
import type { CSSProperties } from "react";
import type { Project, TilePalette } from "@/content/projects/schema";

type GrooveboxTileProps = {
  project: Project;
  index: number;
  displayClassName?: string;
};

const STEP_COUNT = 16;
const PAD_LABELS = ["KICK", "CLAP", "CH", "OH"] as const;

/**
 * elevated-bpm's chameleon tile: a groovebox faceplate (ADR 0002) —
 * step-sequencer LEDs, 909-style pads, the project name as hardware
 * silkscreen. Motion states (ADR 0006) live in globals.css:
 * ambient = slow LED pulse, crescendo = the sequencer runs, static =
 * frozen lit pattern under prefers-reduced-motion.
 */
export default function GrooveboxTile({
  project,
  index,
  displayClassName,
}: GrooveboxTileProps) {
  const tile = project.tile;
  if (!tile) return null;

  const palette = tile.palette;
  const steps = palette.steps ?? [
    palette.accent,
    palette.accent,
    palette.accent,
    palette.ink,
  ];

  return (
    <Link
      className={`groovebox-tile${displayClassName ? ` ${displayClassName}` : ""}`}
      href={`/work/${project.slug}`}
      style={paletteStyle(palette)}
    >
      <div className="groovebox-tile__faceplate">
        <div className="groovebox-tile__screw" aria-hidden="true" />
        <div
          className="groovebox-tile__screw groovebox-tile__screw--right"
          aria-hidden="true"
        />
        <div className="groovebox-tile__topline" aria-hidden="true">
          <span className="groovebox-tile__brand">EB-01</span>
          <span className="groovebox-tile__tempo" data-anim />
        </div>
        <p className="groovebox-tile__silkscreen">{project.title}</p>
        <ol className="groovebox-tile__steps" aria-hidden="true">
          {Array.from({ length: STEP_COUNT }, (_, stepIndex) => (
            <li
              key={stepIndex}
              className="groovebox-tile__step"
              data-lit={
                stepIndex % 4 === 0 || stepIndex === 13 ? "true" : "false"
              }
              style={
                {
                  "--step-color": steps[Math.floor(stepIndex / 4) % steps.length],
                  "--step-index": stepIndex,
                } as CSSProperties
              }
            >
              <span className="groovebox-tile__step-glow" data-anim />
            </li>
          ))}
        </ol>
        <ol className="groovebox-tile__pads" aria-hidden="true">
          {PAD_LABELS.map((label) => (
            <li key={label} data-anim>
              {label}
            </li>
          ))}
        </ol>
      </div>
      <div className="groovebox-tile__meta">
        <span className="groovebox-tile__index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="groovebox-tile__pitch">{project.pitch}</span>
        <span className="groovebox-tile__go">
          Open case study <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

function paletteStyle(palette: TilePalette): CSSProperties {
  return {
    "--tile-ground": palette.ground,
    "--tile-panel": palette.panel,
    "--tile-ink": palette.ink,
    "--tile-mute": palette.mute,
    "--tile-accent": palette.accent,
  } as CSSProperties;
}
