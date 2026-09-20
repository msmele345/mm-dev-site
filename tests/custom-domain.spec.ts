import { expect, test } from "@playwright/test";

const CANONICAL = "https://www.mitchmele.dev";

/** The canonical URL of every page a crawler should be able to reach. */
const EXPECTED_URLS = [
  CANONICAL,
  `${CANONICAL}/blog`,
  `${CANONICAL}/blog/shipping-a-groovebox-that-teaches-techno`,
  `${CANONICAL}/work/elevated-bpm`,
  `${CANONICAL}/work/terminal-one`,
  `${CANONICAL}/work/telescope`,
  `${CANONICAL}/work/sound-city`,
] as const;

const locs = (xml: string) =>
  [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

test.describe("robots.txt", () => {
  test("invites crawlers in and points them at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");

    const text = await response.text();
    expect(text).toContain("User-Agent: *");
    expect(text).toContain("Allow: /");
    // The sitemap is advertised at the custom domain, not at whatever host served it.
    expect(text).toContain(`Sitemap: ${CANONICAL}/sitemap.xml`);
  });
});

test.describe("sitemap.xml", () => {
  test("serves a sitemap document as XML", async ({ request }) => {
    const response = await request.get("/sitemap.xml");

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
    expect(await response.text()).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    );
  });

  test("lists every page at its custom-domain URL", async ({ request }) => {
    const listed = locs(await (await request.get("/sitemap.xml")).text());

    for (const url of EXPECTED_URLS) {
      expect(listed).toContain(url);
    }
  });

  test("names no origin but the canonical one", async ({ request }) => {
    const listed = locs(await (await request.get("/sitemap.xml")).text());

    expect(listed.length).toBeGreaterThan(0);
    for (const url of listed) {
      expect(new URL(url).origin).toBe(CANONICAL);
    }
  });

  test("lists only pages that actually resolve", async ({ request }) => {
    const listed = locs(await (await request.get("/sitemap.xml")).text());

    for (const url of listed) {
      const response = await request.get(new URL(url).pathname);
      expect(response.status(), `${url} is listed but does not resolve`).toBe(200);
    }
  });
});
