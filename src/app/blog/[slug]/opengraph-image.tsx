import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { postCard } from "@/lib/og-card";
import { listPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamicParams = false;

/**
 * One alt string for every post. `generateImageMetadata` would let this name
 * the post, but it routes the image through `[__metadata_id__]`, which Next
 * cannot enumerate at build — the cards stop being prerendered and a crawler
 * pays a cold render for the preview it came to fetch. The card's own artwork
 * carries the title; the alt stays generic so the images stay static.
 */
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
