import { expect, test } from "@playwright/test";
import { socialMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

test("keeps the large-image card on every page that overrides its social copy", () => {
  const meta = socialMetadata({
    title: "A post",
    description: "A summary.",
    path: "/blog/a-post",
  });

  // A page-level `twitter` block replaces the root one wholesale, so the card
  // type has to be restated or the preview silently shrinks to a thumbnail.
  expect(meta.twitter?.card).toBe("summary_large_image");
  expect(meta.twitter).toMatchObject({ title: "A post", description: "A summary." });
});

test("mirrors title and description across both social vocabularies", () => {
  const meta = socialMetadata({
    title: "Sound City",
    description: "A dark house finder.",
    path: "/work/sound-city",
  });

  expect(meta.openGraph).toMatchObject({
    title: "Sound City",
    description: "A dark house finder.",
    url: "/work/sound-city",
    siteName: site.wordmark,
  });
});

test("defaults to a website and takes an article when asked", () => {
  expect(socialMetadata({ title: "t", description: "d", path: "/" }).openGraph?.type).toBe(
    "website",
  );
  expect(
    socialMetadata({ title: "t", description: "d", path: "/", type: "article" }).openGraph
      ?.type,
  ).toBe("article");
});
