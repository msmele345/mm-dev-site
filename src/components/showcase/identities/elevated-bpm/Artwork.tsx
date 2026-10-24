import type { EnrichedProject } from "@/content/projects/enrichment";
import type { TilePalette } from "@/content/projects/schema";
import "./identity.css";

export default function GrooveboxArtwork({ project }: { project: EnrichedProject }) {
  return <FaceplateMotif palette={project.tile!.palette} />;
}

function FaceplateMotif({ palette }: { palette: TilePalette }) {
  const steps = palette.steps ?? [
    palette.accent,
    palette.accent,
    palette.accent,
    palette.ink,
  ];

  return (
    <div className="faceplate" aria-hidden="true">
      <div className="faceplate__screw" />
      <div className="faceplate__screw faceplate__screw--right" />
      <p className="faceplate__brand">EB-01</p>
      <ol className="faceplate__steps">
        {Array.from({ length: 16 }, (_, index) => (
          <li
            key={index}
            className="faceplate__step"
            style={{
              color: steps[Math.floor(index / 4) % steps.length],
            }}
            data-lit={index % 4 === 0 || index === 13 ? "true" : "false"}
          />
        ))}
      </ol>
      <ol className="faceplate__pads">
        {["KICK", "CLAP", "CH", "OH"].map((label) => (
          <li key={label}>{label}</li>
        ))}
      </ol>
    </div>
  );
}
