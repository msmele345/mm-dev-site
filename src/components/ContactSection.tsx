import { contact } from "@/content/contact";

export default function ContactSection() {
    return (
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
    )
};