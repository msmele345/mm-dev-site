import GrooveboxTile from "@/components/tiles/GrooveboxTile";
import SoundCityTile from "@/components/tiles/SoundCityTile";
import TelescopeTile from "@/components/tiles/TelescopeTile";
import TerminalTile from "@/components/tiles/TerminalTile";
import ProjectWallMotion from "@/components/tiles/ProjectWallMotion";
import TileMotion from "@/components/tiles/TileMotion";
import { listEnrichedWallProjects } from "@/content/projects/catalog";
import type { EnrichedProject } from "@/content/projects/enrichment";
import { displayFaceClass } from "@/fonts";

export default async function ProjectWall() {
  const projects = await listEnrichedWallProjects();

  return (
    <section className="project-wall" id="work" aria-labelledby="work-title">
      <div className="project-wall__bar">
        <h2 id="work-title">Project wall</h2>
        <p>04 of 04 · four night machines</p>
      </div>
      <ProjectWallMotion>
        {projects.map((project, index) => (
          <li key={project.slug}>
            {project.tile ? (
              <TileMotion slug={project.slug}>
                {renderTile(project, index)}
              </TileMotion>
            ) : null}
          </li>
        ))}
      </ProjectWallMotion>
    </section>
  );
}

function renderTile(project: EnrichedProject, index: number) {
  switch (project.slug) {
    case "elevated-bpm":
      return (
        <GrooveboxTile
          project={project}
          index={index}
          displayClassName={displayFaceClass(project.tile?.displayFace)}
        />
      );
    case "terminal-one":
      return <TerminalTile project={project} index={index} />;
    case "telescope":
      return <TelescopeTile project={project} index={index} />;
    case "sound-city":
      return <SoundCityTile project={project} index={index} />;
    default:
      return null;
  }
}
