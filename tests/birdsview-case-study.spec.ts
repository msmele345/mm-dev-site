import { expect, test } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { birdsview } from "@/content/projects/authored/birdsview";
import { contrast, cssColor } from "./support/color";

test("published birdsview case study renders complete curated content, artwork, fonts, metadata, and leaves featured wall unchanged", async ({ page, request }) => {
  const response = await page.goto("/work/birdsview");
  expect(response?.status()).toBe(200);

  const article = page.locator("article.case");
  await expect(article).toHaveClass(/case--birdsview/);
  await expect(article).toHaveCSS("--case-accent", birdsview.tile.palette.accent);
  await expect(article.getByRole("heading", { level: 1 })).toHaveText(birdsview.title);
  await expect(article.locator(".case__pitch")).toHaveText(birdsview.pitch);
  await expect(article.locator(".case__silkscreen")).toHaveText(`${birdsview.tile.motif} · birdsview`);
  await expect(article.locator(".case__draft")).toHaveText("Draft copy — pending review");

  const motif = article.locator(".case__hero > .case-motif--birdsview");
  await expect(motif).toBeVisible();
  await expect(motif).toHaveAttribute("aria-hidden", "true");
  await expect(article).not.toContainText(/UNFINISHED/i);

  // Story & Stack
  await expect(article.locator(".case__story-list > li")).toHaveCount(birdsview.story.length);
  for (const section of birdsview.story) {
    const item = article.locator(`.case__story-list > li[data-kind="${section.kind}"]`);
    await expect(item.getByRole("heading", { level: 3 })).toHaveText(section.heading);
    await expect(item.locator("p").last()).toHaveText(section.body);
  }
  await expect(article.locator(".case__stack li")).toHaveText([...birdsview.stack]);

  // Plates
  const figures = article.locator(".case__shots figure");
  await expect(figures).toHaveCount(birdsview.screenshots.length);
  for (const [index, shot] of birdsview.screenshots.entries()) {
    const image = figures.nth(index).getByRole("img", { name: shot.alt, exact: true });
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("src", shot.src);
    await expect(figures.nth(index).locator("figcaption")).toHaveText(shot.caption);
    await expect
      .poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
      .toBe(true);
  }

  // Demo link present, Repository link & enrichment absent
  await expect(article.getByRole("link", { name: /Live demo/i })).toHaveAttribute(
    "href",
    birdsview.links.demo,
  );
  await expect(article.getByRole("link", { name: /Repository/i })).toHaveCount(0);
  await expect(article.locator(".enrichment")).toHaveCount(0);

  // Real browser font check
  await page.evaluate(() => document.fonts.ready);
  const loadedFonts = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
  );
  expect(loadedFonts.some((family) => family.includes("Libre Caslon Display"))).toBe(true);
  expect(loadedFonts.some((family) => family.includes("DM Sans"))).toBe(true);
  await expect(article.getByRole("heading", { level: 1 })).toHaveCSS("font-family", /Libre Caslon Display/i);
  await expect(article.locator(".case__pitch")).toHaveCSS("font-family", /DM Sans/i);

  // Palette distinctness and contrast on ground and panel
  const { ground, panel, ink, mute, accent } = birdsview.tile.palette;
  expect(cssColor(accent)).not.toBe("rgb(198, 255, 0)");
  for (const surface of [ground, panel]) {
    expect(contrast(accent, surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(ink, surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(mute, surface)).toBeGreaterThanOrEqual(4.5);
  }

  // Responsive overflow & 320px H1 fit
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    const measured = await page.evaluate(() => {
      const root = document.documentElement;
      const h1 = document.querySelector("h1")!;
      return {
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        headingOverflow: h1.scrollWidth - h1.clientWidth,
      };
    });
    expect(measured.scrollWidth, `overflow at ${width}px`).toBeLessThanOrEqual(measured.clientWidth + 1);
    if (width === 320) {
      expect(measured.headingOverflow, "320px h1 overflow").toBeLessThanOrEqual(1);
    }
  }

  // Canonical, Open Graph, social image, and sitemap
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.mitchmele.dev/work/birdsview",
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Birdsview/);
  const social = await request.get("/work/birdsview/opengraph-image");
  expect(social.status()).toBe(200);
  expect(social.headers()["content-type"]).toContain("image/png");
  expect((await social.body()).byteLength).toBeGreaterThan(1000);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("https://www.mitchmele.dev/work/birdsview</loc>");

  // Featured wall stays unchanged in Ticket 02
  await page.goto("/");
  const wall = page.getByRole("region", { name: "Project wall" });
  expect(
    await wall.locator("[data-tile-slug]").evaluateAll((tiles) => tiles.map((t) => t.getAttribute("data-tile-slug"))),
  ).toEqual(["elevated-bpm", "terminal-one", "telescope", "sound-city"]);
  await expect(wall.locator('[data-tile-slug="birdsview"]')).toHaveCount(0);

  // CLI publication gates
  const check = spawnSync("npm", ["run", "project", "--", "check", "birdsview"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  expect(check.status, check.stderr).toBe(0);
  expect(check.stdout).toContain("Stage: published");
  expect(check.stdout).toContain("Content ready: yes");
  expect(check.stdout).toContain("Presentation registered: yes");
  expect(check.stdout).toContain("Presentation finished: yes");
  expect(check.stdout).not.toContain("Findings:");
});
