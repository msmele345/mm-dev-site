import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from the late shift: build logs, experiments, and what ships next.",
};

export default function BlogPage() {
  return (
    <main id="main" tabIndex={-1}>
      <section className="chrome-placeholder" aria-labelledby="blog-title">
        <div className="chrome-placeholder__bar">
          <h1 id="blog-title">Blog</h1>
          <p>coming online</p>
        </div>
        <p className="chrome-placeholder__copy">
          Notes from the late shift are being typeset. The first posts land with the
          project write-ups.
        </p>
      </section>
    </main>
  );
}
