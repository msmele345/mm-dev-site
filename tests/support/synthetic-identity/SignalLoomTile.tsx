import Link from "next/link";
import type { CSSProperties } from "react";
import TileMeta, { tilePaletteStyle } from "@/components/tiles/TileMeta";
import type { EnrichedProject } from "@/content/projects/enrichment";

/**
 * Test-only bespoke tile for the synthetic "signal-loom" identity. It is copied
 * into an isolated app to prove the onboarding path; it never ships.
 */
export default function SignalLoomTile({
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
      className="chameleon-tile signal-loom-tile"
      href={`/work/${project.slug}`}
      style={tilePaletteStyle(tile.palette)}
    >
      <div className="signal-loom-tile__loom" aria-hidden="true">
        <p>WARP · WEFT · 08</p>
        {Array.from({ length: 8 }, (_, thread) => (
          <span
            className="signal-loom-tile__thread"
            data-anim
            key={thread}
            style={{ "--thread": thread } as CSSProperties}
          />
        ))}
      </div>
      <TileMeta project={project} index={index} classPrefix="signal-loom-tile" />
    </Link>
  );
}
