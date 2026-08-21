export default function Home() {
  return (
    <main className="launch-page" aria-labelledby="site-title">
      <div className="launch-page__grid" aria-hidden="true" />
      <div className="launch-page__topline">
        <p>Portfolio / experiments / notes</p>
        <p>Chicago, IL</p>
      </div>

      <section className="launch-page__hero">
        <p className="launch-page__eyebrow">Independent developer</p>
        <h1 id="site-title">MITCH MELE</h1>
        <p className="launch-page__summary">
          A new home for things made late, solved carefully, and shipped with intent.
        </p>
      </section>

      <footer className="launch-page__footer">
        <p>Site under construction</p>
        <span aria-hidden="true" />
        <p>01 / 01</p>
      </footer>
    </main>
  );
}
