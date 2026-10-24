import ProjectWallMotion from "@/components/tiles/ProjectWallMotion";
import TileMotion from "@/components/tiles/TileMotion";
import { listEnrichedWallProjects } from "@/content/projects/catalog";
import { showcase } from "@/components/showcase/registry";
import { displayFaceClass } from "@/fonts";

export default async function ProjectWall() {
  const projects = await listEnrichedWallProjects();

  return (
    <section className="project-wall" id="work" aria-labelledby="work-title">
      <div className="project-wall__bar">
        <h2 id="work-title">Project wall</h2>
        <p>{projects.length} featured {projects.length === 1 ? "project" : "projects"}</p>
      </div>
      {projects.length === 0 ? (
        <p className="project-wall__empty">No featured projects right now.</p>
      ) : (
        <ProjectWallMotion>
          {projects.map((project, index) => {
            const { Tile } = showcase.get(project.slug);
            if (!project.tile) throw new Error(`Showcase "${project.slug}": missing tile identity`);
            return (
              <li key={project.slug}>
                <TileMotion slug={project.slug}>
                  <Tile
                    project={project}
                    index={index}
                    displayClassName={displayFaceClass(project.tile.displayFace)}
                  />
                </TileMotion>
              </li>
            );
          })}
        </ProjectWallMotion>
      )}
    </section>
  );
}
