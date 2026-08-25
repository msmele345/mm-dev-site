import GrooveboxTile from "@/components/tiles/GrooveboxTile";
import TileMotion from "@/components/tiles/TileMotion";
import { listEnrichedWallProjects } from "@/content/projects/catalog";
import { displayFaceClass } from "@/fonts";

export default async function ProjectWall() {
  const projects = await listEnrichedWallProjects();

  return (
    <section className="project-wall" id="work" aria-labelledby="work-title">
      <div className="project-wall__bar">
        <h2 id="work-title">Project wall</h2>
        <p>01 of 04 · groovebox faceplate</p>
      </div>
      <ul className="project-wall__grid">
        {projects.map((project, index) => (
          <li key={project.slug}>
            {project.tile ? (
              <TileMotion>
                <GrooveboxTile
                  project={project}
                  index={index}
                  displayClassName={displayFaceClass(project.tile.displayFace)}
                />
              </TileMotion>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
