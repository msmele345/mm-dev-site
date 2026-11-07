import Link from "next/link";
import { listWallProjects } from "@/content/projects/catalog";

/** A blinking lime underscore after the headline. Set false to remove it. */
const SHOW_CURSOR = true;

export default function SiteIntro() {
    const projects = listWallProjects();

    return (
        <section className="site-intro" aria-labelledby="site-title" data-cursor={SHOW_CURSOR || undefined}>
            <div className="site-intro__inner">
                <div className="site-intro__core">
                    <p className="site-intro__eyebrow">Software engineer · Side projects · 2026</p>
                    <h1 id="site-title">Built to be curious.</h1>
                    <p className="site-intro__sentence">Every project here started as a question I couldn&apos;t leave alone.</p>
                </div>
                {projects.length > 0 && (
                    <nav className="site-intro__index" aria-label="Featured projects">
                        <ol>
                            {projects.map((project, index) => (
                                <li key={project.slug}>
                                    <Link href={`/work/${project.slug}`}>
                                        <span className="site-intro__position" aria-hidden="true">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <span className="site-intro__caret" aria-hidden="true">▸</span>
                                        <span className="site-intro__invitation">{project.invitation}</span>
                                        {" "}
                                        <span className="site-intro__leader" aria-hidden="true" />
                                        <span className="site-intro__name">{project.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}
            </div>
        </section>
    )
};
