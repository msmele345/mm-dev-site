import type { PostMeta } from "@/lib/posts";

export type FeedSite = {
  url: string;
  title: string;
  description: string;
  author: string;
};

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/**
 * Post text is authored freely in frontmatter, so every value that lands in
 * the XML is escaped — an unescaped `&` alone makes the whole feed unparseable.
 */
function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ESCAPES[character]);
}

/** RSS dates are RFC 822; the posts' yyyy-mm-dd is pinned to UTC midnight. */
function rfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

function itemXml(post: PostMeta, site: FeedSite): string {
  // `&` is a legal path character, so `new URL` passes it through untouched —
  // a slug carrying one would make the whole document unparseable if emitted raw.
  const url = escapeXml(new URL(`/blog/${post.slug}`, site.url).toString());

  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    `      <pubDate>${rfc822(post.date)}</pubDate>`,
    `      <description>${escapeXml(post.summary)}</description>`,
    `      <dc:creator>${escapeXml(site.author)}</dc:creator>`,
    ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
    "    </item>",
  ].join("\n");
}

/**
 * RSS 2.0 for the blog. Pure: posts in, XML out — no filesystem, no clock, so
 * a build produces byte-identical output for identical content.
 *
 * `lastBuildDate` comes from the newest post rather than `Date.now()`: the feed
 * is prerendered, and a wall-clock stamp would claim the feed changed on every
 * rebuild when nothing was published.
 */
export function buildFeed(
  posts: readonly PostMeta[],
  site: FeedSite,
): string {
  const blogUrl = escapeXml(new URL("/blog", site.url).toString());
  const feedUrl = escapeXml(new URL("/feed.xml", site.url).toString());
  const newest = posts[0];

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" ' +
      'xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${escapeXml(site.title)}</title>`,
    `    <link>${blogUrl}</link>`,
    `    <description>${escapeXml(site.description)}</description>`,
    "    <language>en</language>",
    // Dublin Core carries a plain name; RSS's own <author> demands an email address.
    `    <dc:creator>${escapeXml(site.author)}</dc:creator>`,
    // The self-reference a feed validator asks every feed to declare.
    `    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>`,
    ...(newest ? [`    <lastBuildDate>${rfc822(newest.date)}</lastBuildDate>`] : []),
    ...posts.map((post) => itemXml(post, site)),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
