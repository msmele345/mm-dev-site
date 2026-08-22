import Link from "next/link";
import { listWallProjects } from "@/content/projects/catalog";

export default function ProjectWall() {
  const projects = listWallProjects();

  return (
    <section className="project-wall" id="work" aria-labelledby="work-title">
      <div className="project-wall__bar">
        <h2 id="work-title">Project wall</h2>
        <p>01 of 04 · first tile live</p>
      </div>
      <ul className="project-wall__grid">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <Link className="project-wall__card" href={`/work/${project.slug}`}>
              <span className="project-wall__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="project-wall__name">{project.title}</span>
              <span className="project-wall__pitch">{project.pitch}</span>
              <span className="project-wall__go">
                Open case study <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
