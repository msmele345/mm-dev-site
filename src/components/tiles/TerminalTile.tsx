import Link from "next/link";
import type { CSSProperties } from "react";
import ProjectStats from "@/components/ProjectStats";
import type { EnrichedProject } from "@/content/projects/enrichment";
import type { TilePalette } from "@/content/projects/schema";

export default function TerminalTile({
  project,
  index,
}: {
  project: EnrichedProject;
  index: number;
}) {
  const tile = project.tile;
  if (!tile) return null;

  return (
    <Link
      className="chameleon-tile terminal-tile"
      href={`/work/${project.slug}`}
      style={paletteStyle(tile.palette)}
    >
      <div className="terminal-tile__screen">
        <p className="terminal-tile__ticker" data-anim>
          SPY 602.41 +0.42% · QQQ 531.08 -0.18% · NVDA 184.72 +1.08% ·
        </p>
        <div className="terminal-tile__mast">
          <span>T1 / OPTIONS DESK</span>
          <span>MARKET DELAYED</span>
        </div>
        <p className="terminal-tile__score">87.4</p>
        <p className="terminal-tile__signal">RANKED SIGNAL / DEFINED RISK</p>
        <ol className="terminal-tile__reels" aria-hidden="true">
          {["CALL", "30Δ", "45D"].map((value, reelIndex) => (
            <li key={value} style={{ "--reel": reelIndex } as CSSProperties}>
              <span data-anim>{value}</span>
            </li>
          ))}
        </ol>
      </div>
      <TileMeta project={project} index={index} className="terminal-tile" />
    </Link>
  );
}

function TileMeta({
  project,
  index,
  className,
}: {
  project: EnrichedProject;
  index: number;
  className: string;
}) {
  return (
    <div className={`${className}__meta`}>
      <span className={`${className}__index`}>{String(index + 1).padStart(2, "0")}</span>
      <strong>{project.title}</strong>
      <span className={`${className}__pitch`}>{project.pitch}</span>
      <ProjectStats stats={project.stats} variant="tile" />
      <span className={`${className}__go`}>Open case study <span aria-hidden="true">→</span></span>
    </div>
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
