import { contact } from "@/content/contact";

const projects = [
  { name: "elevated-bpm", kind: "groovebox, in the browser" },
  { name: "terminal-one", kind: "trading floor for the dark" },
  { name: "telescope", kind: "star fields on demand" },
  { name: "sound-city", kind: "club flyers, printed loud" },
];

export default function Home() {
  return (
    <main id="main" tabIndex={-1}>
      <section className="hero" aria-labelledby="site-title">
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__topline">
          <p>Portfolio / experiments / notes</p>
          <p>{contact.location}</p>
        </div>
        <div className="hero__core">
          <p className="hero__eyebrow">Independent developer · nocturnal builds</p>
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
            <span aria-hidden="true">▼</span> project wall landing soon
          </p>
        </div>
      </section>

      <section className="wall-teaser" id="work" aria-labelledby="work-title">
        <div className="wall-teaser__bar">
          <h2 id="work-title">Selected work</h2>
          <p>04 tiles · assembling</p>
        </div>
        <ul className="wall-teaser__list">
          {projects.map((project) => (
            <li key={project.name}>
              <span className="wall-teaser__name">{project.name}</span>
              <span className="wall-teaser__kind">{project.kind}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact__bar">
          <h2 id="contact-title">Contact</h2>
          <p>Replies between builds</p>
        </div>
        <ul className="contact__links">
          <li>
            <a
              className="contact__link"
              href={contact.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              <span className="contact__index">01</span>
              GitHub <span className="contact__handle">@{contact.githubHandle}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a className="contact__link" href={`mailto:${contact.email}`}>
              <span className="contact__index">02</span>
              Email <span className="contact__handle">{contact.email}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
        <p className="contact__note">
          Say hi about a project, a collab, or the late shift. LinkedIn is on the
          bench for now.
        </p>
      </section>
    </main>
  );
}
