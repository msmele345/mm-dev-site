import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { postCard } from "@/lib/og-card";
import { listPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamicParams = false;

export const alt = `A post on ${site.wordmark}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Mirrors the page's own params so every post's card is baked at build time.
export function generateStaticParams() {
  return listPosts().map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = listPosts().find((candidate) => candidate.slug === slug);
  if (!post) notFound();

  return renderOgCard(postCard(post));
}
