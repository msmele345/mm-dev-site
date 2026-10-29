import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { VerificationInput } from "../src/content/projects/project-verify";

// This suite is selected only by the command's dedicated config. Ordinary tests
// keep the synthetic onboarding and rotation regressions without running twice.
const slug = process.env.PROJECT_VERIFY_SLUG;
const inputFile = process.env.PROJECT_VERIFY_INPUT;
const input: VerificationInput | undefined = inputFile ? JSON.parse(readFileSync(inputFile, "utf8")) : undefined;
test.skip(!slug || !input, "Invoked by npm run project -- verify <slug>");

test("published case study, imagery, metadata, fallback and responsive captures", async ({ page, request }, info) => {
  if (!input) throw new Error("Missing verification input");
  const { project, selection } = input;
  expect(project.slug).toBe(slug);
  const route = `/work/${slug}`;
  expect((await page.goto(route))?.status()).toBe(200);
  const article = page.locator("article.case");
  await expect(article).toHaveClass(new RegExp(`case--${slug}(?: |$)`));
  await expect(article.getByRole("heading", { level: 1 })).toHaveText(project.title);
  await expect(article.locator(".case__pitch")).toHaveText(project.pitch);
  await expect(article.locator(".case__silkscreen")).toHaveText(`${project.tile?.motif} · ${slug}`);
  await expect(article.locator(".case__hero > [aria-hidden=\"true\"]")).toBeVisible();
  await expect(article).toHaveCSS("--case-accent", project.tile!.palette.accent);
  await expect(article.locator(".case__story-list > li")).toHaveCount(project.story.length);
  for (const section of project.story) {
    const item = article.locator(`[data-kind="${section.kind}"]`);
    await expect(item.getByRole("heading")).toHaveText(section.heading);
    await expect(item.locator("p").last()).toHaveText(section.body);
  }
  await expect(article.locator(".case__stack li")).toHaveText(project.stack);
  await expect(article.locator(".case__draft")).toHaveCount(project.draft ? 1 : 0);
  const figures = article.locator(".case__shots figure");
  await expect(figures).toHaveCount(project.screenshots.length);
  for (const [index, shot] of project.screenshots.entries()) {
    const image = figures.nth(index).getByRole("img", { name: shot.alt, exact: true });
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("src", shot.src);
    await expect(figures.nth(index).locator("figcaption")).toHaveText(shot.caption);
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    const asset = await request.get(shot.src);
    expect(asset.status()).toBe(200);
    expect(asset.headers()["content-type"]).toContain("image/");
  }
  for (const [key, label] of [["repo", "Repository"], ["demo", "Live demo"]] as const) {
    const link = article.getByRole("link", { name: new RegExp(label) });
    if (project.links[key]) await expect(link).toHaveAttribute("href", project.links[key]!);
    else await expect(link).toHaveCount(0);
  }
  await expect(article.locator(".enrichment")).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.mitchmele.dev${route}`);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", new RegExp(project.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  const social = await request.get(`${route}/opengraph-image`);
  expect(social.status()).toBe(200);
  expect(social.headers()["content-type"]).toContain("image/png");
  expect((await social.body()).length).toBeGreaterThan(100);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain(`${route}</loc>`);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expectNoOverflow(page);
    await page.screenshot({ path: info.outputPath(`case-study-${width}.png`), fullPage: true, animations: "disabled" });
  }
  if (input.stage === "published") {
    await page.goto("/");
    await expect(page.locator(`[data-tile-slug="${slug}"]`)).toHaveCount(0);
    expect(selection.featured).not.toContain(slug);
  }
});

test("featured membership, indices, keyboard, touch and shared motion", async ({ page, browser }, info) => {
  test.skip(input?.stage !== "featured", "Project is not featured");
  if (!input) throw new Error("Missing verification input");
  const { project, selection } = input;
  await page.goto("/");
  const wall = page.getByRole("region", { name: "Project wall" });
  const tiles = wall.locator("[data-tile-slug]");
  expect(await tiles.evaluateAll((elements) => elements.map((element) => element.getAttribute("data-tile-slug")))).toEqual(selection.featured);
  await expect(wall.locator(".project-wall__bar p")).toHaveText(`${selection.featured.length} featured project${selection.featured.length === 1 ? "" : "s"}`);
  expect(await wall.getByRole("link").evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual(selection.featured.map((entry) => `/work/${entry}`));
  await expect(wall.locator('[class$="__index"]')).toHaveText(selection.featured.map((_, index) => String(index + 1).padStart(2, "0")));
  const motion = wall.locator(`[data-tile-slug="${slug}"]`);
  const link = motion.getByRole("link");
  await expect(link.getByText(project.title, { exact: true })).toBeVisible();
  await expect(link.locator('[class$="__pitch"]')).toHaveText(project.pitch);
  await expect(motion.locator(".enrichment")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expectNoOverflow(page);
    await wall.screenshot({ path: info.outputPath(`wall-${width}.png`), animations: "disabled", style: ".site-header { visibility: hidden; }" });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await link.scrollIntoViewIfNeeded();
  const art = motion.locator('[aria-hidden="true"]').first();
  await expect(art).toBeVisible();
  expect(await motion.locator("[data-anim]").evaluateAll((elements) => elements.every((element) => getComputedStyle(element).animationName === "none"))).toBe(true);
  const links = wall.getByRole("link");
  await links.first().focus();
  for (let index = 0; index < selection.featured.length; index++) {
    await expect(links.nth(index)).toBeFocused();
    const focus = await links.nth(index).evaluate((element) => {
      const style = getComputedStyle(element);
      return style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
    });
    expect(focus).toBe(true);
    if (index < selection.featured.length - 1) await page.keyboard.press("Tab");
  }
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`/work/${slug}$`));

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.mouse.move(0, 0);
  await link.scrollIntoViewIfNeeded();
  await expect(motion).toHaveAttribute("data-in-view", "true");
  await expect(motion).toHaveAttribute("data-crescendo", "false");
  const animated = motion.locator("[data-anim]");
  expect(await animated.count()).toBeGreaterThan(0);
  expect(await animated.evaluateAll((elements) => elements.some((element) => getComputedStyle(element).animationName !== "none" && getComputedStyle(element).animationPlayState === "running"))).toBe(true);
  await link.hover();
  await expect(motion).toHaveAttribute("data-crescendo", "true");
  await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);
  await link.focus();
  await expect(motion).toHaveAttribute("data-crescendo", "true");
  if (selection.featured.length > 1) {
    // Select a different identity explicitly; the selection is the expected order.
    await wall.locator(`[data-tile-slug="${selection.featured.find((entry) => entry !== slug)}"]`).getByRole("link").hover();
    await expect(motion).toHaveAttribute("data-crescendo", "false");
    await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);
  }
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(motion).toHaveAttribute("data-in-view", "false");
  expect(await animated.evaluateAll((elements) => elements.every((element) => getComputedStyle(element).animationPlayState === "paused"))).toBe(true);

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  try {
    const phone = await touch.newPage();
    await phone.goto(info.project.use.baseURL!);
    const phoneMotion = phone.locator(`[data-tile-slug="${slug}"]`);
    const phoneLink = phoneMotion.getByRole("link");
    await phoneLink.scrollIntoViewIfNeeded();
    await phoneLink.dispatchEvent("pointerdown", { pointerType: "touch" });
    await expect(phoneMotion).toHaveAttribute("data-crescendo", "true");
    await expect(phone.locator('[data-crescendo="true"]')).toHaveCount(1);
    await phoneLink.dispatchEvent("pointerup", { pointerType: "touch" });
    await expect(phoneMotion).toHaveAttribute("data-crescendo", "false");
    await phoneLink.tap();
    await expect(phone).toHaveURL(new RegExp(`/work/${slug}$`));
  } finally { await touch.close(); }
});


async function expectNoOverflow(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  const dimensions = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth,
    overflowing: [...document.querySelectorAll("body *")].filter((element) => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1).map((element) => element.className).slice(0, 12),
  }));
  expect(dimensions.scroll, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport);
}
