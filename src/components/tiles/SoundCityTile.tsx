import Link from "next/link";
import type { CSSProperties } from "react";
import ProjectStats from "@/components/ProjectStats";
import type { EnrichedProject } from "@/content/projects/enrichment";
import type { TilePalette } from "@/content/projects/schema";

export default function SoundCityTile({
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
      className="chameleon-tile sound-city-tile"
      href={`/work/${project.slug}`}
      style={paletteStyle(tile.palette)}
    >
      <div className="sound-city-tile__poster">
        <div className="sound-city-tile__grain" aria-hidden="true" />
        <p className="sound-city-tile__stamp">CHI / SOURCE VERIFIED</p>
        <p className="sound-city-tile__tonight" data-anim>TONIGHT</p>
        <p className="sound-city-tile__lineup">HOUSE · TECHNO<br />AFTER DARK</p>
        <div className="sound-city-tile__meter" aria-hidden="true">
          {Array.from({ length: 12 }, (_, bar) => (
            <span
              key={bar}
              data-anim
              style={
                {
                  "--bar": bar,
                  "--bar-height": `${24 + (bar % 5) * 14}%`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
      <div className="sound-city-tile__meta">
        <span className="sound-city-tile__index">{String(index + 1).padStart(2, "0")}</span>
        <strong>{project.title}</strong>
        <span className="sound-city-tile__pitch">{project.pitch}</span>
        <ProjectStats stats={project.stats} variant="tile" />
        <span className="sound-city-tile__go">Open case study <span aria-hidden="true">→</span></span>
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
