import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="site-header__skip" href="#main">
        Skip to content
      </a>
      <nav className="site-header__nav" aria-label="Primary">
        <Link className="site-header__wordmark" href="/">
          MITCH&nbsp;MELE
          <span className="visually-hidden"> — home</span>
        </Link>
        <ul className="site-header__links">
          <li>
            <Link href="/#work">Work</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/#contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
