import Link from "next/link";
import type { CSSProperties } from "react";
import type { EnrichedProject } from "@/content/projects/enrichment";
import TileMeta, { tilePaletteStyle } from "./TileMeta";

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
      style={tilePaletteStyle(tile.palette)}
    >
      <div className="sound-city-tile__poster" aria-hidden="true">
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
      <TileMeta project={project} index={index} classPrefix="sound-city-tile" />
    </Link>
  );
}
