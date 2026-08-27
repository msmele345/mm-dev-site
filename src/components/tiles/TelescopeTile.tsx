import Link from "next/link";
import type { CSSProperties } from "react";
import type { EnrichedProject } from "@/content/projects/enrichment";
import TileMeta, { tilePaletteStyle } from "./TileMeta";

const STARS = [
  [9, 22, 2], [18, 68, 3], [28, 38, 2], [36, 77, 2],
  [43, 25, 4], [51, 54, 3], [61, 39, 2], [68, 72, 3],
  [76, 18, 2], [83, 48, 4], [90, 30, 2], [94, 78, 2],
] as const;

export default function TelescopeTile({
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
      className="chameleon-tile telescope-tile"
      href={`/work/${project.slug}`}
      style={tilePaletteStyle(tile.palette)}
    >
      <div className="telescope-tile__sky" aria-hidden="true">
        <p>LOCAL SKY · 22:14</p>
        {STARS.map(([x, y, size], starIndex) => (
          <span
            className="telescope-tile__star"
            data-anim
            key={`${x}-${y}`}
            style={
              {
                "--star-x": `${x}%`,
                "--star-y": `${y}%`,
                "--star-size": `${size}px`,
                "--star-index": starIndex,
              } as CSSProperties
            }
          />
        ))}
        <span className="telescope-tile__line telescope-tile__line--one" data-anim />
        <span className="telescope-tile__line telescope-tile__line--two" data-anim />
        <span className="telescope-tile__line telescope-tile__line--three" data-anim />
        <span className="telescope-tile__horizon" />
      </div>
      <TileMeta project={project} index={index} classPrefix="telescope-tile" />
    </Link>
  );
}
