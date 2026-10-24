import { showcase } from "@/components/showcase/registry";
import Image from "next/image";
import type { CSSProperties } from "react";
import ProjectStats from "@/components/ProjectStats";
import type { EnrichedProject } from "@/content/projects/enrichment";
import type { TilePalette } from "@/content/projects/schema";

type CaseStudyProps = {
  project: EnrichedProject;
  displayClassName?: string;
};

export default function CaseStudy({
  project,
  displayClassName,
}: CaseStudyProps) {
  const { CaseStudyArtwork } = showcase.get(project.slug);
  const tile = project.tile;
  if (!tile) throw new Error(`Showcase "${project.slug}": missing tile identity`);
  const palette = tile?.palette;

  return (
    <article
      className={`case case--${project.slug}${displayClassName ? ` ${displayClassName}` : ""}`}
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
        <CaseStudyArtwork project={project} />
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

      <ProjectStats stats={project.stats} variant="case" />

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
