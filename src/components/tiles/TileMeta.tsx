import type { CSSProperties } from "react";
import ProjectStats from "@/components/ProjectStats";
import type { EnrichedProject } from "@/content/projects/enrichment";
import type { TilePalette } from "@/content/projects/schema";

export default function TileMeta({
  project,
  index,
  classPrefix,
}: {
  project: EnrichedProject;
  index: number;
  classPrefix: string;
}) {
  return (
    <div className={`${classPrefix}__meta`}>
      <span className={`${classPrefix}__index`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <strong>{project.title}</strong>
      <span className={`${classPrefix}__pitch`}>{project.pitch}</span>
      <ProjectStats stats={project.stats} variant="tile" />
      <span className={`${classPrefix}__go`}>
        Open case study <span aria-hidden="true">→</span>
      </span>
    </div>
  );
}

export function tilePaletteStyle(palette: TilePalette): CSSProperties {
  return {
    "--tile-ground": palette.ground,
    "--tile-panel": palette.panel,
    "--tile-ink": palette.ink,
    "--tile-mute": palette.mute,
    "--tile-accent": palette.accent,
  } as CSSProperties;
}
