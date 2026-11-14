import { expect, test, type Page } from "@playwright/test";
import { rmSync } from "node:fs";
import type { ChildProcess } from "node:child_process";
import { listWallProjects } from "@/content/projects/catalog";
import { addPreparedFixtureProject, createShowcaseApp, writeFeaturedSelection } from "./support/showcase-app";
import { buildTransmissionApp, serveTransmissionApp } from "./support/transmission-app";
import { contrast, cssColor } from "./support/color";

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
      await expect(row.locator(".site-intro__position")).toHaveCSS("color", cssColor(project.tile!.palette.accent));
    }

    for (const project of projects) {
      expect(contrast(project.tile!.palette.accent, INK), `${project.slug} accent contrast`).toBeGreaterThanOrEqual(4.5);
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
const INK = "#08090b";
const EXPECTED_HEADLINE_SIZES = new Map([
  [320, 28], [375, 28], [390, 28], [414, 28.49], [768, 40.88], [895, 45.325],
  [896, 45.36], [1024, 49.84], [1280, 58.8], [1536, 61.6], [2560, 61.6],
]);

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

async function expectBoundedHeadline(page: Page) {
  for (const [width, fontSize] of EXPECTED_HEADLINE_SIZES) {
    await resize(page, { width, height: 900 });
    const measured = await page.locator(".site-intro h1").evaluate((h1) => ({
      fontSize: parseFloat(getComputedStyle(h1).fontSize),
      overflow: h1.scrollWidth - h1.clientWidth,
      page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
    expect(measured.page, `page at ${width}px`).toBeLessThanOrEqual(0);
    expect(measured.overflow, `headline at ${width}px`).toBeLessThanOrEqual(0);
    expect(measured.fontSize, `headline scale at ${width}px`).toBeLessThanOrEqual(MAX_HEADLINE_SIZE);
    expect(measured.fontSize, `reduced headline at ${width}px`).toBeCloseTo(fontSize, 2);
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
    await expectBoundedHeadline(page);
  });

  test("hands off to the wall without a rule while the rail and contact rules remain", async ({ page }) => {
    await expect(page.locator(".project-wall")).toHaveCSS("border-top-width", "0px");
    await expect(page.locator(".rail")).toHaveCSS("border-top-width", "1px");
    await expect(page.locator(".contact")).toHaveCSS("border-top-width", "1px");
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

  test("hover and keyboard focus use the project accent and keep a lime focus ring", async ({ page }) => {
    await resize(page, { width: 1280, height: 800 });
    const row = featuredIndex(page).getByRole("link").first();
    const accent = cssColor(listWallProjects()[0].tile!.palette.accent);
    const outline = () => row.evaluate((el) => getComputedStyle(el).outlineStyle);

    await row.hover();
    await expect(row.locator(".site-intro__invitation")).toHaveCSS("color", accent);
    await expect(row.locator(".site-intro__caret")).toHaveCSS("color", accent);
    await expect(row).toHaveCSS("border-top-color", accent);
    expect(await outline()).toBe("none");

    await page.mouse.move(0, 0);
    await expect(row.locator(".site-intro__invitation")).toHaveCSS("color", "rgb(255, 255, 255)");
    await page.keyboard.press("Tab"); // Puts the browser in keyboard modality so focus() shows the ring.
    await row.focus();
    await expect(row.locator(".site-intro__invitation")).toHaveCSS("color", accent);
    await expect(row.locator(".site-intro__caret")).toHaveCSS("color", accent);
    await expect(row).toHaveCSS("border-top-color", accent);
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
    expect(hovered).toEqual({ running: 0, color: cssColor(listWallProjects()[0].tile!.palette.accent) });

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

test("six featured projects keep the bounded headline and first tile in the opening view", async ({ page }) => {
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
    await expectBoundedHeadline(page);
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

test.describe("Site intro type and readout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await resize(page, { width: 1280, height: 800 });
  });

  test("the headline shares the case-study register: mono, uppercase, full-strength copy", async ({ page }) => {
    const styles = await page.evaluate(() => {
      const read = (selector: string) => getComputedStyle(document.querySelector(selector)!);
      const h1 = read(".site-intro h1");
      return {
        bodyFace: getComputedStyle(document.body).fontFamily,
        headlineFace: h1.fontFamily,
        transform: h1.textTransform,
        invitationFace: read(".site-intro__invitation").fontFamily,
        sentence: read(".site-intro__sentence").color,
        mute: read(".site-intro__eyebrow").color,
      };
    });
    expect(styles.headlineFace).toBe(styles.bodyFace);
    expect(styles.invitationFace).toBe(styles.bodyFace);
    expect(styles.transform).toBe("uppercase");
    expect(styles.sentence).not.toBe(styles.mute);
  });

  test("rows read as a terminal readout with a leader and a caret hidden from assistive tech", async ({ page }) => {
    const [first] = listWallProjects();
    const row = featuredIndex(page).getByRole("link").first();
    const caret = row.locator(".site-intro__caret");
    await expect(row.locator(".site-intro__leader")).toHaveAttribute("aria-hidden", "true");
    await expect(caret).toHaveAttribute("aria-hidden", "true");
    await expect(row).toHaveAccessibleName(`${first.invitation} ${first.title}`);

    await expect(caret).toBeHidden();
    await row.hover();
    await expect(caret).toBeVisible();
    await expect(caret).toHaveCSS("color", cssColor(first.tile!.palette.accent));

    await page.mouse.move(0, 0);
    await expect(caret).toBeHidden();
    await page.keyboard.press("Tab");
    await row.focus();
    await expect(caret).toBeVisible();
  });

  test("the optional headline cursor adds no text and holds still under reduced motion", async ({ page }) => {
    const h1 = page.locator(".site-intro h1");
    await expect(h1).toHaveText("Built to be curious.");
    await expect(page.getByRole("region", { name: "Built to be curious." })).toBeVisible();
    const cursorOn = await page.locator(".site-intro[data-cursor]").count();
    const after = () => h1.evaluate((el) => {
      const style = getComputedStyle(el, "::after");
      return { content: style.content, animation: style.animationName };
    });
    if (!cursorOn) {
      expect((await after()).content).toBe("none");
      return;
    }
    expect((await after()).content).toBe('""');
    expect((await after()).animation).not.toBe("none");
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect((await after()).animation).toBe("none");
  });
});
