import { expect, test, type Page } from "@playwright/test";
import { rmSync } from "node:fs";
import type { ChildProcess } from "node:child_process";
import { listWallProjects } from "@/content/projects/catalog";
import { addPreparedFixtureProject, createShowcaseApp, writeFeaturedSelection } from "./support/showcase-app";
import { buildTransmissionApp, serveTransmissionApp } from "./support/transmission-app";

const EYEBROW = "Software engineer · Side projects · 2026";
const SENTENCE = "Every project here started as a question I couldn't leave alone.";

test.describe("Site intro", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens the page with the headline, eyebrow, and supporting sentence", async ({ page }) => {
    const intro = page.getByRole("region", { name: "Built to be curious." });
    await expect(intro.getByRole("heading", { level: 1 })).toHaveText("Built to be curious.");
    await expect(intro.getByText(EYEBROW, { exact: true })).toBeVisible();
    await expect(intro.getByText(SENTENCE, { exact: true })).toBeVisible();
  });

  test("the supporting sentence never repeats an invitation", () => {
    for (const { invitation } of listWallProjects()) {
      expect(SENTENCE.toLowerCase()).not.toContain(invitation.toLowerCase());
    }
  });

  test("indexes each featured project in wall order and links to its case study", async ({ page }) => {
    const projects = listWallProjects();
    const index = page.getByRole("navigation", { name: "Featured projects" });
    const rows = index.getByRole("link");
    await expect(rows).toHaveCount(projects.length);
    await expect(index.getByRole("listitem")).toHaveCount(projects.length);

    for (const [position, project] of projects.entries()) {
      const row = rows.nth(position);
      await expect(row).toHaveAttribute("href", `/work/${project.slug}`);
      await expect(row).toHaveAccessibleName(`${project.invitation} ${project.title}`);
      await expect(row).toContainText(String(position + 1).padStart(2, "0"));
    }

    const order = await page.getByRole("region", { name: "Project wall" }).locator("[data-tile-slug]")
      .evaluateAll((tiles) => tiles.map((tile) => tile.getAttribute("data-tile-slug")));
    expect(order).toEqual(projects.map(({ slug }) => slug));
  });

  test("works by keyboard and without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Built to be curious.");
    const [first] = listWallProjects();
    const rows = page.getByRole("navigation", { name: "Featured projects" }).getByRole("link");
    // Skip link, wordmark, and three nav links come before the first row.
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(rows.first()).toBeFocused();
    for (let position = 1; position < listWallProjects().length; position += 1) {
      await page.keyboard.press("Tab");
      await expect(rows.nth(position)).toBeFocused();
    }
    await rows.first().focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/work/${first.slug}$`));
    await context.close();
  });

  test("removes the old hero content and does not repeat the name", async ({ page }) => {
    const main = page.getByRole("main");
    await expect(main.getByText("MITCH MELE", { exact: false })).toHaveCount(0);
    await expect(main.getByText("Portfolio / experiments / notes")).toHaveCount(0);
    await expect(main.getByText("2026 Projects")).toHaveCount(0);
    await expect(main.getByText("the wall is open")).toHaveCount(0);
    await expect(page.locator('[class*="hero"]:not([class*="case__hero"])')).toHaveCount(0);
  });

  test("the intro stays ahead of the Project wall in document order", async ({ page }) => {
    const regions = page.getByRole("main").getByRole("region");
    await expect(regions.nth(0)).toHaveAccessibleName("Built to be curious.");
    await expect(regions.nth(1)).toHaveAccessibleName("Project wall");
  });
});

test("the Project wall drops its count and keeps a visually hidden heading as its label", async ({ page }) => {
  await page.goto("/");
  const wall = page.getByRole("region", { name: "Project wall" });
  const heading = wall.getByRole("heading", { name: "Project wall", level: 2 });
  await expect(heading).toHaveClass(/visually-hidden/);
  const box = await heading.boundingBox();
  expect(box!.width).toBeLessThanOrEqual(1);
  expect(box!.height).toBeLessThanOrEqual(1);
  await expect(wall.getByText(/featured projects?$/i)).toHaveCount(0);
  await expect(wall.locator(".project-wall__bar")).toHaveCount(0);
});

const featuredIndex = (page: Page) => page.getByRole("navigation", { name: "Featured projects" });
const FIRST_VIEWPORTS = [{ width: 1280, height: 800 }, { width: 390, height: 844 }];
const LIME = "rgb(198, 255, 0)";
/** At least this much of the first tile shows above the fold, past its padding and into the artwork. */
const MIN_VISIBLE_TILE = 48;
/** The old hero ran clamp(5rem, 23vw, 22rem); this cap keeps the headline a fraction of that at each width. */
const MAX_HEADLINE_SIZE = 88;

/** Resizing resolves before layout does; wait for a painted frame so geometry reads are not stale. */
async function resize(page: Page, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

/** The top of the first tile's artwork, not just its border, shows above the fold. */
async function expectFirstTileInOpeningView(page: Page) {
  for (const viewport of FIRST_VIEWPORTS) {
    await resize(page, viewport);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const tile = await page.locator("[data-tile-slug]").first().boundingBox();
    expect(tile!.y, `first tile at ${viewport.width}x${viewport.height}`).toBeLessThan(viewport.height - MIN_VISIBLE_TILE);
  }
}

test.describe("Site intro layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
  });

  test("desktop sets the headline left and the index right; mobile stacks them", async ({ page }) => {
    const core = page.locator(".site-intro__core");
    for (const width of [896, 1280, 1536]) {
      await resize(page, { width, height: 800 });
      const [desktopCore, desktopIndex] = [await core.boundingBox(), await featuredIndex(page).boundingBox()];
      expect(desktopIndex!.x, `index at ${width}px`).toBeGreaterThanOrEqual(desktopCore!.x + desktopCore!.width);
      expect(desktopIndex!.y, `index at ${width}px`).toBeLessThan(desktopCore!.y + desktopCore!.height);
    }

    await resize(page, { width: 390, height: 844 });
    const [mobileCore, mobileIndex] = [await core.boundingBox(), await featuredIndex(page).boundingBox()];
    expect(mobileIndex!.y).toBeGreaterThanOrEqual(mobileCore!.y + mobileCore!.height);
    expect(mobileIndex!.x).toBeCloseTo(mobileCore!.x, 0);
  });

  test("never overflows, and the headline stays bounded inside its container", async ({ page }) => {
    for (const width of [320, 375, 390, 414, 768, 895, 896, 1024, 1280, 1536, 2560]) {
      await resize(page, { width, height: 900 });
      const measured = await page.locator(".site-intro h1").evaluate((h1) => ({
        fontSize: parseFloat(getComputedStyle(h1).fontSize),
        overflow: h1.scrollWidth - h1.clientWidth,
        page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      expect(measured.page, `page at ${width}px`).toBeLessThanOrEqual(0);
      expect(measured.overflow, `headline at ${width}px`).toBeLessThanOrEqual(0);
      expect(measured.fontSize, `headline scale at ${width}px`).toBeLessThanOrEqual(MAX_HEADLINE_SIZE);
    }
  });

  test("the first tile shares the opening view", async ({ page }) => {
    await expectFirstTileInOpeningView(page);
  });

  test("mobile rows show position and invitation; the name stays in the accessible name", async ({ page }) => {
    const [first] = listWallProjects();
    const row = featuredIndex(page).getByRole("link").first();
    const name = row.locator(".site-intro__name");

    await resize(page, { width: 390, height: 844 });
    await expect(row.locator(".site-intro__position")).toBeVisible();
    await expect(row.locator(".site-intro__invitation")).toBeVisible();
    expect((await name.boundingBox())!.width).toBeLessThanOrEqual(1);
    await expect(row).toHaveAccessibleName(`${first.invitation} ${first.title}`);

    await resize(page, { width: 1280, height: 800 });
    expect((await name.boundingBox())!.width).toBeGreaterThan(1);
    await expect(row).toHaveAccessibleName(`${first.invitation} ${first.title}`);
  });

  test("hover and keyboard focus are distinct and lime", async ({ page }) => {
    await resize(page, { width: 1280, height: 800 });
    const row = featuredIndex(page).getByRole("link").first();
    const outline = () => row.evaluate((el) => getComputedStyle(el).outlineStyle);

    await row.hover();
    await expect(row.locator(".site-intro__invitation")).toHaveCSS("color", LIME);
    expect(await outline()).toBe("none");

    await page.mouse.move(0, 0);
    await expect(row.locator(".site-intro__invitation")).toHaveCSS("color", "rgb(255, 255, 255)");
    await page.keyboard.press("Tab"); // Puts the browser in keyboard modality so focus() shows the ring.
    await row.focus();
    await expect(row).toHaveCSS("outline-style", "solid");
    await expect(row).toHaveCSS("outline-color", LIME);
    await expect(row).toHaveCSS("outline-width", "2px");
  });

  test("reduced motion keeps the same layout and states with nothing animating", async ({ page }) => {
    const row = featuredIndex(page).getByRole("link").first();
    const measure = async () => {
      const boxes = [];
      for (const viewport of FIRST_VIEWPORTS) {
        await resize(page, viewport);
        boxes.push(await page.locator(".site-intro__core").boundingBox(), await featuredIndex(page).boundingBox());
      }
      return boxes;
    };
    const animated = await measure();
    await page.emulateMedia({ reducedMotion: "reduce" });
    // Poll: after emulateMedia on a live page, Chromium can briefly keep vw-based values
    // from the previous viewport after a resize. A real layout difference still fails.
    await expect.poll(measure).toEqual(animated);

    await resize(page, { width: 1280, height: 800 });
    await row.hover();
    // Immediately after hover, with no retry: any transition would still be running.
    const hovered = await row.evaluate((el) => ({
      running: el.getAnimations({ subtree: true }).length,
      color: getComputedStyle(el.querySelector(".site-intro__invitation")!).color,
    }));
    expect(hovered).toEqual({ running: 0, color: LIME });

    await page.mouse.move(0, 0);
    await page.keyboard.press("Tab"); // Puts the browser in keyboard modality so focus() shows the ring.
    await row.focus();
    await expect(row).toHaveCSS("outline-color", LIME);
  });

  test("index rows are comfortable touch targets at every width", async ({ page }) => {
    for (const width of [320, 390, 768, 1280]) {
      await resize(page, { width, height: 900 });
      const heights = await featuredIndex(page).getByRole("link")
        .evaluateAll((rows) => rows.map((row) => row.getBoundingClientRect().height));
      for (const height of heights) expect(height, `row at ${width}px`).toBeGreaterThanOrEqual(44);
    }
    await expect(featuredIndex(page).getByRole("link").first()).toHaveCSS("touch-action", "manipulation");
  });
});

test("the first tile stays in the opening view with six featured projects", async ({ page }) => {
  test.setTimeout(180_000);
  const dir = createShowcaseApp();
  let server: ChildProcess | undefined;
  try {
    addPreparedFixtureProject(dir);
    addPreparedFixtureProject(dir, { slug: "relay-yard", title: "Relay Yard", invitation: "Check the growth" });
    const slugs = ["orbit-lab", "elevated-bpm", "terminal-one", "telescope", "sound-city", "relay-yard"];
    writeFeaturedSelection(dir, slugs);
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3045);
    await page.goto("http://127.0.0.1:3045/");
    await expect(featuredIndex(page).getByRole("link")).toHaveCount(slugs.length);
    await expectFirstTileInOpeningView(page);
  } finally {
    if (server && server.exitCode === null) {
      const exited = new Promise((resolve) => server!.once("exit", resolve));
      server.kill();
      await exited;
    }
    rmSync(dir, { recursive: true, force: true });
  }
});
