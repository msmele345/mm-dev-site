import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, listPosts } from "@/lib/posts";
import { socialMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: site.blogDescription,
  ...socialMetadata({
    title: site.blogTitle,
    description: site.blogDescription,
    path: "/blog",
  }),
};

export default function BlogPage() {
  const posts = listPosts();

  return (
    <main id="main" tabIndex={-1}>
      <section className="blog" aria-labelledby="blog-title">
        <div className="blog__bar">
          <h1 id="blog-title">Blog</h1>
          <p>notes from the late shift</p>
          <a className="blog__feed" href={site.feedPath}>
            RSS <span aria-hidden="true">↗</span>
          </a>
        </div>

        {posts.length === 0 ? (
          <p className="blog__empty">
            Nothing published yet. The first posts land with the project
            write-ups.
          </p>
        ) : (
          <ul className="blog__list" aria-label="Posts">
            {posts.map((post) => (
              <li key={post.slug} className="blog__item">
                <p className="blog__date">
                  <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                </p>
                <h2 className="blog__title">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="blog__summary">{post.summary}</p>
                <ul className="blog__tags" aria-label="Tags">
                  {post.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
