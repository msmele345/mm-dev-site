/**
 * @jsxImportSource react
 *
 * Pinned so this component can be rendered in a unit test — same reason as
 * ProjectStats. Matches tsconfig's `react-jsx`, so it is a no-op for Next.
 */
import ProjectStats from "@/components/ProjectStats";
import type { Enriched } from "@/content/projects/enrichment";
import type { RailProject } from "@/content/projects/schema";

/**
 * One more-projects rail card: the whole presentation of a rail-tier project,
 * since there is no case-study page behind it.
 *
 * An entry with no remote is a complete state rather than a degraded one — no
 * stats block, no dead link, and a note saying why the card is not clickable.
 */
export default function RailCard({
  project,
}: {
  project: Enriched<RailProject>;
}) {
  const repo = project.links.repo;

  return (
    <article className={`rail-card rail-card--${project.slug}`}>
      <h3 className="rail-card__title">
        {repo ? (
          /* The whole card is the hit area (see `.rail-card__title a::after`),
             while the accessible name and the focus ring stay on the title.
             The outbound arrow rides the title rather than taking a line of
             its own — the card is one tier lighter than a tile, and every
             line it does not spend is part of that. */
          <a href={repo} rel="noreferrer" target="_blank">
            {project.title}
            <span className="visually-hidden"> — repository on GitHub</span>
            <span aria-hidden="true" className="rail-card__out">
              ↗
            </span>
          </a>
        ) : (
          project.title
        )}
      </h3>
      <p className="rail-card__pitch">{project.pitch}</p>
      <ProjectStats stats={project.stats} variant="tile" />
      <ul className="rail-card__stack">
        {/* Three, like a tile's language chips: the rail states the shape of a
            project, and the repository holds the full inventory. */}
        {project.stack.slice(0, 3).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {!repo && project.unlinkedNote ? (
        <p className="rail-card__note">{project.unlinkedNote}</p>
      ) : null}
    </article>
  );
}
