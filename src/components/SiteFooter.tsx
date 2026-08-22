import Link from "next/link";
import { contact } from "@/content/contact";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__wordmark" aria-hidden="true">
          MITCH MELE
        </p>
        <ul className="site-footer__links">
          <li>
            <Link href="/#work">Work</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/#contact">Contact</Link>
          </li>
          <li>
            <a href={contact.githubUrl} rel="noreferrer" target="_blank">
              GitHub ↗
            </a>
          </li>
        </ul>
        <p className="site-footer__meta">
          {contact.location} · built after dark, no templates
        </p>
        <p className="site-footer__meta">© {new Date().getFullYear()} Mitch Mele</p>
      </div>
    </footer>
  );
}
