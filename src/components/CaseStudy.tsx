import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project, TilePalette } from "@/content/projects/schema";

type CaseStudyProps = {
  project: Project;
  displayClassName?: string;
};

export default function CaseStudy({
  project,
  displayClassName,
}: CaseStudyProps) {
  const tile = project.tile;
  const palette = tile?.palette;

  return (
    <article
      className={`case${displayClassName ? ` ${displayClassName}` : ""}`}
      style={paletteStyle(palette)}
    >
      {project.draft ? (
        <p className="case__draft">Draft copy — pending review</p>
      ) : null}

      <header className="case__hero">
        <p className="case__silkscreen">
          {tile ? `${tile.motif} · ${project.slug}` : project.slug}
        </p>
        <h1>{project.title}</h1>
        <p className="case__pitch">{project.pitch}</p>
        {tile ? <FaceplateMotif palette={tile.palette} /> : null}
      </header>

      <section className="case__story" aria-labelledby="case-story">
        <h2 id="case-story">The story</h2>
        <ol className="case__story-list">
          {project.story.map((section) => (
            <li key={section.kind} data-kind={section.kind}>
              <p className="case__kind">{section.kind}</p>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {project.screenshots.length > 0 ? (
        <section className="case__shots" aria-labelledby="case-shots">
          <h2 id="case-shots">Plates</h2>
          <ul>
            {project.screenshots.map((shot) => (
              <li key={shot.src}>
                <figure>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={960}
                    height={540}
                    unoptimized
                  />
                  <figcaption>{shot.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="case__meta" aria-labelledby="case-stack">
        <h2 id="case-stack">Stack</h2>
        <ul className="case__stack">
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <ul className="case__links">
          {project.links.repo ? (
            <li>
              <a href={project.links.repo} rel="noreferrer" target="_blank">
                Repository <span aria-hidden="true">↗</span>
              </a>
            </li>
          ) : null}
          {project.links.demo ? (
            <li>
              <a href={project.links.demo} rel="noreferrer" target="_blank">
                Live demo <span aria-hidden="true">↗</span>
              </a>
            </li>
          ) : null}
        </ul>
      </section>
    </article>
  );
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

function paletteStyle(palette?: TilePalette): CSSProperties | undefined {
  if (!palette) return undefined;

  return {
    "--case-ground": palette.ground,
    "--case-panel": palette.panel,
    "--case-ink": palette.ink,
    "--case-mute": palette.mute,
    "--case-accent": palette.accent,
  } as CSSProperties;
}
