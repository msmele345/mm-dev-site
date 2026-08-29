import { notFound } from "next/navigation";
import { getProject, listCaseStudySlugs } from "@/content/projects/catalog";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { caseStudyCard } from "@/lib/og-card";
import { site } from "@/lib/site";

export const dynamicParams = false;

export const alt = `A case study on ${site.wordmark}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Mirrors the page's own params so every case study's card is baked at build time.
export function generateStaticParams() {
  return listCaseStudySlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return renderOgCard(caseStudyCard(project));
}
