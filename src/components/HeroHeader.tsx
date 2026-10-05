import { contact } from "@/content/contact";

export default function HeroHeader() {
    return (
        <section className="hero" aria-labelledby="site-title">
            <div className="hero__grid" aria-hidden="true" />
            <div className="hero__topline">
                <p>Portfolio / experiments / notes</p>
                <p>{contact.location}</p>
            </div>
            <div className="hero__core">
                <p className="hero__eyebrow">Software Engineer · Side Quest Showcase</p>
                <h1 id="site-title">MITCH MELE</h1>
                <p className="hero__hook">Sounds, vibrations, strobe lights, lever pulls, and space explorations. Side projects are supposed to be fun.</p>
                <p className="hero__summary">
                    2026 Projects
                </p>
                <p className="hero__next">
                    <span aria-hidden="true">▼</span> the wall is open
                </p>
            </div>
        </section>
    )
};