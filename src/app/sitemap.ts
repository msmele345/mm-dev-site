import type { MetadataRoute } from "next";
import { listCaseStudySlugs } from "@/content/projects/catalog";
import { listPosts } from "@/lib/posts";
import { buildSitemap } from "@/lib/sitemap";
import { site } from "@/lib/site";

// Posts are in-repo MDX (ADR 0005) and projects are curated files, so the whole
// sitemap is known at build time; without this the route would be per-request.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(listPosts(), listCaseStudySlugs(), site);
}
