import type { EnrichedProject } from "@/content/projects/enrichment";
import type { TilePalette } from "@/content/projects/schema";

export function TerminalArtwork() {
  return (
    <div className="case-motif case-motif--terminal" aria-hidden="true">
      <p className="case-motif__tape">SPY +0.42 · QQQ -0.18 · NVDA +1.08</p>
      <p className="case-motif__readout">RANK / 87.4</p>
      <ol className="case-motif__reels">
        <li>CALL</li>
        <li>30Δ</li>
        <li>45D</li>
      </ol>
    </div>
  );
}

export function TelescopeArtwork() {
  return (
    <div className="case-motif case-motif--telescope" aria-hidden="true">
      <span className="case-motif__star case-motif__star--one" />
      <span className="case-motif__star case-motif__star--two" />
      <span className="case-motif__star case-motif__star--three" />
      <span className="case-motif__star case-motif__star--four" />
      <span className="case-motif__line case-motif__line--one" />
      <span className="case-motif__line case-motif__line--two" />
      <span className="case-motif__line case-motif__line--three" />
      <p>ORION · LOCAL SKY · 22:14</p>
    </div>
  );
}

export function SoundCityArtwork() {
  return (
    <div className="case-motif case-motif--sound-city" aria-hidden="true">
      <p className="case-motif__venue">CHICAGO / SOURCE VERIFIED</p>
      <p className="case-motif__tonight">TONIGHT</p>
      <p className="case-motif__bill">HOUSE · TECHNO · AFTER DARK</p>
    </div>
  );
}

export function GrooveboxArtwork({ project }: { project: EnrichedProject }) {
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

