import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, listPosts } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return listPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = listPosts().find((candidate) => candidate.slug === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = listPosts().find((candidate) => candidate.slug === slug);
  if (!post) notFound();

  const { default: Content } = await import(`@/content/blog/${slug}.mdx`);

  return (
    <main id="main" tabIndex={-1}>
      <article className="post">
        <header className="post__header">
          <p className="post__eyebrow">
            <Link href="/blog">Blog</Link>
          </p>
          <h1>{post.title}</h1>
          <div className="post__meta">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <ul className="post__tags" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </header>

        <div className="post__body">
          <Content />
        </div>
      </article>
    </main>
  );
}
