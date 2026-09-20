import type { MetadataRoute } from "next";
import type { PostMeta } from "@/lib/posts";

export type SitemapSite = {
  url: string;
};

/**
 * The site's crawlable surfaces, in reading order: home, the blog, every post,
 * every case study. Pure — content in, entries out — so the sitemap can be
 * asserted without a server, and so a build produces identical output for
 * identical content.
 *
 * Entries are addressed at the canonical origin rather than the serving host:
 * a sitemap listing a preview build's URLs would invite a crawler to index the
 * site twice (issue 10).
 *
 * A post is dated by its own publication date. The other surfaces carry no
 * `lastModified` at all — a build clock would claim every page changed on every
 * rebuild, which is worse than saying nothing.
 */
export function buildSitemap(
  posts: readonly PostMeta[],
  caseStudySlugs: readonly string[],
  site: SitemapSite,
): MetadataRoute.Sitemap {
  const absolute = (path: string) => new URL(path, site.url).toString();
  // `new URL("/", origin)` ends in a slash, and the home page's own canonical
  // tag does not. A crawler compares those two strings literally, so the
  // sitemap has to name the home page exactly the way the page names itself.
  const home = site.url.replace(/\/+$/, "");

  return [
    { url: home },
    { url: absolute("/blog") },
    ...posts.map((post) => ({
      url: absolute(`/blog/${post.slug}`),
      lastModified: post.date,
    })),
    // A repeated <loc> reads to a crawler as the same page listed twice.
    ...[...new Set(caseStudySlugs)].map((slug) => ({
      url: absolute(`/work/${slug}`),
    })),
  ];
}
