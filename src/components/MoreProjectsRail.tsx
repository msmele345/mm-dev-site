import RailCard from "@/components/RailCard";
import { listEnrichedRailProjects } from "@/content/projects/catalog";

/**
 * The more-projects rail: breadth below the project wall, at a deliberately
 * lighter weight than the chameleon tiles. No project palettes, no motion, no
 * case-study pages — one chrome-voiced card per project, linking straight out
 * to the repository.
 *
 * The tier is the message: the wall is what these four projects *are*, the
 * rail is what else there is. Which projects that means is curated in
 * `content/projects/rail.ts`, never crawled from the public repo list.
 */
export default async function MoreProjectsRail() {
  const projects = await listEnrichedRailProjects();
  if (projects.length === 0) return null;

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
