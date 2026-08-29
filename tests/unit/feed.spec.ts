import { expect, test } from "@playwright/test";
import { buildFeed } from "@/lib/feed";
import type { PostMeta } from "@/lib/posts";

const site = {
  url: "https://example.dev",
  title: "MITCH MELE — Developer",
  description: "Notes from the late shift.",
  author: "Mitch Mele",
} as const;

const post = (over: Partial<PostMeta> = {}): PostMeta => ({
  slug: "a-post",
  title: "A post",
  date: "2026-08-27",
  summary: "A summary.",
  tags: ["one"],
  ...over,
});

const tag = (xml: string, name: string): string[] =>
  [...xml.matchAll(new RegExp(`<${name}(?:[^>]*)>([\\s\\S]*?)</${name}>`, "g"))].map(
    (match) => match[1],
  );

test("declares a channel a validator will accept", () => {
  const xml = buildFeed([post()], site);

  expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  expect(xml).toContain('<rss version="2.0"');
  expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
  // A self-referencing atom:link is what the W3C validator asks for.
  expect(xml).toContain(
    '<atom:link href="https://example.dev/feed.xml" rel="self" type="application/rss+xml"/>',
  );
  expect(tag(xml, "language")).toEqual(["en"]);
  expect(tag(xml, "title")[0]).toBe("MITCH MELE — Developer");
  expect(tag(xml, "link")[0]).toBe("https://example.dev/blog");
});

test("carries every post as an item with an absolute permalink", () => {
  const xml = buildFeed(
    [post({ slug: "newer", title: "Newer", date: "2026-08-27" }),
     post({ slug: "older", title: "Older", date: "2026-08-01" })],
    site,
  );

  expect(tag(xml, "item")).toHaveLength(2);
  expect(tag(xml, "guid")).toEqual([
    "https://example.dev/blog/newer",
    "https://example.dev/blog/older",
  ]);
  expect(xml).toContain('<guid isPermaLink="true">');
  expect(tag(xml, "link").slice(1)).toEqual([
    "https://example.dev/blog/newer",
    "https://example.dev/blog/older",
  ]);
  expect(tag(xml, "category")).toEqual(["one", "one"]);
});

test("dates every item in RFC 822, the format RSS requires", () => {
  const xml = buildFeed([post({ date: "2026-08-27" })], site);

  expect(tag(xml, "pubDate")[0]).toBe("Thu, 27 Aug 2026 00:00:00 GMT");
});

test("stamps lastBuildDate from the newest post so it is stable per build", () => {
  const xml = buildFeed(
    [post({ slug: "newer", date: "2026-08-27" }), post({ slug: "older", date: "2026-08-01" })],
    site,
  );

  expect(tag(xml, "lastBuildDate")[0]).toBe("Thu, 27 Aug 2026 00:00:00 GMT");
});

test("escapes markup in titles and summaries instead of emitting it", () => {
  const xml = buildFeed(
    [post({ title: 'Ampersands & <angles>', summary: 'He said "no" & left' })],
    site,
  );

  expect(xml).toContain("Ampersands &amp; &lt;angles&gt;");
  expect(xml).toContain("He said &quot;no&quot; &amp; left");
  expect(xml).not.toContain("<angles>");
});

test("escapes a slug that would otherwise break every item in the feed", () => {
  // `&` is legal in a URL path, so `new URL` leaves it alone — bare in XML it
  // makes the whole document unparseable, not just this item.
  const xml = buildFeed([post({ slug: "a&b" })], site);

  expect(xml).toContain("<link>https://example.dev/blog/a&amp;b</link>");
  expect(xml).toContain(
    '<guid isPermaLink="true">https://example.dev/blog/a&amp;b</guid>',
  );
  expect(xml).not.toMatch(/blog\/a&(?!amp;)/);
});

test("credits the author on the channel and every item", () => {
  const xml = buildFeed([post()], site);

  expect(xml).toContain('xmlns:dc="http://purl.org/dc/elements/1.1/"');
  // Dublin Core carries a name; RSS's own <author> would demand an email address.
  expect(tag(xml, "dc:creator")).toEqual(["Mitch Mele", "Mitch Mele"]);
});

test("stays a valid empty feed when nothing is published", () => {
  const xml = buildFeed([], site);

  expect(tag(xml, "item")).toHaveLength(0);
  expect(xml).toContain("<channel>");
  expect(tag(xml, "lastBuildDate")).toHaveLength(0);
});
