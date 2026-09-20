import { expect, test } from "@playwright/test";
import { buildSitemap } from "@/lib/sitemap";
import type { PostMeta } from "@/lib/posts";

const site = { url: "https://example.dev" } as const;

const post = (over: Partial<PostMeta> = {}): PostMeta => ({
  slug: "a-post",
  title: "A post",
  date: "2026-08-27",
  summary: "A summary.",
  tags: ["one"],
  ...over,
});

const urls = (...args: Parameters<typeof buildSitemap>) =>
  buildSitemap(...args).map((entry) => entry.url);

test("lists the site's own surfaces: home, the blog, every post, every case study", () => {
  const listed = urls([post({ slug: "one" }), post({ slug: "two" })], ["telescope"], site);

  expect(listed).toEqual([
    "https://example.dev",
    "https://example.dev/blog",
    "https://example.dev/blog/one",
    "https://example.dev/blog/two",
    "https://example.dev/work/telescope",
  ]);
});

test("addresses every surface absolutely, at the canonical origin", () => {
  for (const url of urls([post()], ["telescope"], site)) {
    expect(url.startsWith("https://example.dev")).toBe(true);
  }
});

test("dates a post by its own publication date, not by the build clock", () => {
  const [, , entry] = buildSitemap([post({ date: "2026-08-27" })], [], site);

  expect(entry.lastModified).toBe("2026-08-27");
});

// A crawler treats a repeated <loc> as the same page listed twice.
test("lists a slug once even when it is named twice", () => {
  const listed = urls([post()], ["telescope", "telescope"], site);

  expect(listed.filter((url) => url.endsWith("/work/telescope"))).toHaveLength(1);
});

test("stays honest when there is nothing published yet", () => {
  expect(urls([], [], site)).toEqual([
    "https://example.dev",
    "https://example.dev/blog",
  ]);
});
