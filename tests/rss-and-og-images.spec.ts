import { expect, test, type Page } from "@playwright/test";

const POST_SLUG = "shipping-a-groovebox-that-teaches-techno";
const POST_TITLE = "Shipping a groovebox that teaches techno";

const metaContent = (page: Page, selector: string) =>
  page.locator(selector).first().getAttribute("content");

/** Every surface that can be shared, and the title its card must carry. */
const SHARED_PAGES = [
  { path: "/", label: "home", ogTitle: "MITCH MELE — Developer" },
  { path: "/blog", label: "blog index", ogTitle: "MITCH MELE — Blog" },
  { path: `/blog/${POST_SLUG}`, label: "post", ogTitle: POST_TITLE },
  { path: "/work/sound-city", label: "case study", ogTitle: "Sound City" },
] as const;

test.describe("RSS feed", () => {
  test("serves a parseable RSS document as an RSS content type", async ({ request }) => {
    const response = await request.get("/feed.xml");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/rss+xml");

    const xml = await response.text();
    expect(xml).toContain('<rss version="2.0"');
    // The self-reference every feed validator asks for.
    expect(xml).toContain('rel="self" type="application/rss+xml"');
    expect(xml).toContain("<language>en</language>");
  });

  test("carries every published post as a dated item with an absolute link", async ({
    request,
  }) => {
    const xml = await (await request.get("/feed.xml")).text();

    expect(xml).toContain(`<title>${POST_TITLE}</title>`);
    expect(xml).toContain(
      `<guid isPermaLink="true">https://mitchmele.dev/blog/${POST_SLUG}</guid>`,
    );
    expect(xml).toContain("<pubDate>Thu, 27 Aug 2026 00:00:00 GMT</pubDate>");
  });

  test("is discoverable from the blog — in the head and on the page", async ({ page }) => {
    await page.goto("/blog");

    await expect(
      page.locator('link[rel="alternate"][type="application/rss+xml"]'),
    ).toHaveAttribute("href", /\/feed\.xml$/);
    await expect(page.getByRole("link", { name: /rss/i })).toHaveAttribute(
      "href",
      "/feed.xml",
    );
  });
});

test.describe("Open Graph images", () => {
  for (const { path, label, ogTitle } of SHARED_PAGES) {
    test(`the ${label} declares a large-image card with its own title`, async ({ page }) => {
      await page.goto(path);

      expect(await metaContent(page, 'meta[property="og:title"]')).toBe(ogTitle);
      expect(await metaContent(page, 'meta[name="twitter:card"]')).toBe(
        "summary_large_image",
      );
      expect(await metaContent(page, 'meta[property="og:description"]')).toBeTruthy();
      // Twitter reuses the Open Graph artwork rather than a second image.
      expect(await metaContent(page, 'meta[name="twitter:image"]')).toBe(
        await metaContent(page, 'meta[property="og:image"]'),
      );
    });

    test(`the ${label} card renders as a 1200x630 png`, async ({ page, request }) => {
      await page.goto(path);
      const image = await metaContent(page, 'meta[property="og:image"]');
      if (!image) throw new Error(`${label} declared no og:image`);

      expect(await metaContent(page, 'meta[property="og:image:width"]')).toBe("1200");
      expect(await metaContent(page, 'meta[property="og:image:height"]')).toBe("630");
      expect(await metaContent(page, 'meta[property="og:image:alt"]')).toBeTruthy();

      // The declared URL is canonical; fetch the same route on this server.
      const response = await request.get(new URL(image).pathname + new URL(image).search);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/png");
      expect((await response.body()).byteLength).toBeGreaterThan(1000);
    });
  }

  test("gives each case study its own tile-coloured card", async ({ page }) => {
    await page.goto("/work/sound-city");
    const soundCity = await metaContent(page, 'meta[property="og:image"]');

    await page.goto("/work/telescope");
    const telescope = await metaContent(page, 'meta[property="og:image"]');

    expect(soundCity).toContain("/work/sound-city/opengraph-image");
    expect(telescope).toContain("/work/telescope/opengraph-image");
  });
});
