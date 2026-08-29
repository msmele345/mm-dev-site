/**
 * The site's own identity, in one place: the canonical origin plus the strings
 * that have to read the same in the chrome, the feed, and the OG cards.
 * The origin is a constant, not `VERCEL_URL` — a feed's permalinks and a shared
 * card's address must point at the canonical site, never at a preview build.
 */
export const site = {
  url: "https://mitchmele.dev",
  host: "mitchmele.dev",
  title: "MITCH MELE — Developer",
  wordmark: "MITCH MELE",
  description:
    "The development portfolio of Mitch Mele: grooveboxes, trading terminals, star fields, and club flyers — built after dark, shipped with intent.",
  blogTitle: "MITCH MELE — Blog",
  blogDescription:
    "Notes from the late shift: build logs, experiments, and what ships next.",
  author: "Mitch Mele",
  feedPath: "/feed.xml",
} as const;

/** Absolute URL for a site-relative path — the form feeds and OG tags require. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}
