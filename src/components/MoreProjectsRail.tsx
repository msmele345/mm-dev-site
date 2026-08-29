import ProjectStats from "@/components/ProjectStats";
import { listEnrichedRailProjects } from "@/content/projects/catalog";
import type { Enriched } from "@/content/projects/enrichment";
import type { RailProject } from "@/content/projects/schema";

/**
 * The more-projects rail: breadth below the project wall, at a deliberately
 * lighter weight than the chameleon tiles. No project palettes, no motion, no
 * case-study pages — one chrome-voiced card per project, linking straight out
 * to the repository.
 *
 * The tier is the message: the wall is what these four projects *are*, the
 * rail is what else there is.
 */
export default async function MoreProjectsRail() {
  const projects = await listEnrichedRailProjects();

  return (
    <section
      className="rail"
      id="more-projects"
      aria-labelledby="more-projects-title"
    >
      <div className="rail__bar">
        <h2 id="more-projects-title">More projects</h2>
        <p>{projects.length} of many · curated, not crawled</p>
      </div>
      <ul className="rail__grid">
        {projects.map((project) => (
          <li key={project.slug}>
            <RailCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RailCard({ project }: { project: Enriched<RailProject> }) {
  const repo = project.links.repo;

  return (
    <article className={`rail-card rail-card--${project.slug}`}>
      <h3 className="rail-card__title">
        {repo ? (
          /* The whole card is the hit area (see `.rail-card__title a::after`),
             while the accessible name and the focus ring stay on the title. */
          <a href={repo} rel="noreferrer" target="_blank">
            {project.title}
            <span className="visually-hidden"> — repository on GitHub</span>
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
      {repo ? (
        <p className="rail-card__go" aria-hidden="true">
          Repository ↗
        </p>
      ) : (
        <p className="rail-card__note">{project.unlinkedNote}</p>
      )}
    </article>
  );
}
