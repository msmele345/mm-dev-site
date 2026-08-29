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
                <p className="hero__hook">Built after dark. Shipped with intent.</p>
                <p className="hero__summary">
                    I make machines that feel alive — grooveboxes you can play, trading
                    terminals that watch the tape, star fields that draw themselves. Every
                    build gets its own identity: loud, specific, and made to run all night.
                    The projects on this wall are the proof; the rest of the night is
                    shipping.
                </p>
                <p className="hero__next">
                    <span aria-hidden="true">▼</span> the wall is open
                </p>
            </div>
        </section>
    )
};