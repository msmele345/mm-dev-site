// onboarding:unfinished
import Link from "next/link";
import TileMeta, { tilePaletteStyle } from "@/components/tiles/TileMeta";
import type { EnrichedProject } from "@/content/projects/enrichment";
import "./identity.css";

export default function Tile({ project, index }: { project: EnrichedProject; index: number }) {
  const tile = project.tile;
  if (!tile) return null;

  return (
    <Link className="chameleon-tile onboarding-birdsview-tile" href={`/work/${project.slug}`} style={tilePaletteStyle(tile.palette)}>
      <div className="onboarding-birdsview-tile__art" aria-hidden="true">
        <span data-anim>UNFINISHED</span>
      </div>
      <span className="visually-hidden">Unfinished artwork. </span>
      <TileMeta project={project} index={index} classPrefix="onboarding-birdsview-tile" />
    </Link>
  );
}
