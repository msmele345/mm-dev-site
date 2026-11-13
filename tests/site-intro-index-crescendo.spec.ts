import { expect, test } from "@playwright/test";
import { listWallProjects } from "@/content/projects/catalog";

const featuredIndex = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Featured projects" });

test.describe("Site intro index drives the wall", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test("hovering an index row puts the matching tile into crescendo", async ({ page }) => {
    const [first, second] = listWallProjects();
    const rows = featuredIndex(page).getByRole("link");

    await rows.first().hover();
    await expect(page.locator(`[data-tile-slug="${first.slug}"]`)).toHaveAttribute("data-crescendo", "true");
    await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);

    await rows.nth(1).hover();
    await expect(page.locator(`[data-tile-slug="${second.slug}"]`)).toHaveAttribute("data-crescendo", "true");
    await expect(page.locator(`[data-tile-slug="${first.slug}"]`)).toHaveAttribute("data-crescendo", "false");
    await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);

    await page.mouse.move(0, 0);
    await expect(page.locator(`[data-tile-slug="${second.slug}"]`)).toHaveAttribute("data-crescendo", "false");
    await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(0);
  });

  test("keyboard focus on an index row puts the matching tile into crescendo; blur clears it", async ({ page }) => {
    const [first, second] = listWallProjects();
    const rows = featuredIndex(page).getByRole("link");

    await rows.first().focus();
    await expect(page.locator(`[data-tile-slug="${first.slug}"]`)).toHaveAttribute("data-crescendo", "true");
    await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);

    await rows.nth(1).focus();
    await expect(page.locator(`[data-tile-slug="${second.slug}"]`)).toHaveAttribute("data-crescendo", "true");
    await expect(page.locator(`[data-tile-slug="${first.slug}"]`)).toHaveAttribute("data-crescendo", "false");

    // Moving focus outside the index clears the crescendo.
    await page.locator("h1").click();
    await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(0);
  });

  test("row and tile hand off a single crescendo in both directions", async ({ page }) => {
    const [first, second] = listWallProjects();
    const rows = featuredIndex(page).getByRole("link");
    const wall = page.getByRole("region", { name: "Project wall" });

    // Row → tile: hover a row, then hover a different tile directly.
    await rows.first().hover();
    await expect(page.locator(`[data-tile-slug="${first.slug}"]`)).toHaveAttribute("data-crescendo", "true");

    const secondTile = wall.locator(`[data-tile-slug="${second.slug}"]`);
    await secondTile.scrollIntoViewIfNeeded();
    await secondTile.hover();
    await expect(page.locator(`[data-tile-slug="${second.slug}"]`)).toHaveAttribute("data-crescendo", "true");
    await expect(page.locator(`[data-tile-slug="${first.slug}"]`)).toHaveAttribute("data-crescendo", "false");
    await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);

    // Tile → row: from a tile, move back to a row.
    await page.mouse.move(0, 0);
    await rows.nth(1).hover();
    await expect(page.locator(`[data-tile-slug="${second.slug}"]`)).toHaveAttribute("data-crescendo", "true");
    await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);

    // Now move pointer to the first tile (different from the row).
    const firstTile = wall.locator(`[data-tile-slug="${first.slug}"]`);
    await firstTile.hover();
    await expect(page.locator(`[data-tile-slug="${first.slug}"]`)).toHaveAttribute("data-crescendo", "true");
    await expect(page.locator(`[data-tile-slug="${second.slug}"]`)).toHaveAttribute("data-crescendo", "false");
    await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);
  });

  test("click and Enter on a row still navigate to the case study", async ({ page }) => {
    const [first] = listWallProjects();
    const rows = featuredIndex(page).getByRole("link");

    await rows.first().click();
    await expect(page).toHaveURL(new RegExp(`/work/${first.slug}$`));

    await page.goto("/");
    await page.setViewportSize({ width: 1280, height: 900 });
    await rows.first().focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`/work/${first.slug}$`));
  });

  test("touch pointers on a row do not trigger crescendo", async ({ page }) => {
    const [first] = listWallProjects();
    const rows = featuredIndex(page).getByRole("link");

    await rows.first().dispatchEvent("pointerover", { pointerType: "touch" });
    await rows.first().dispatchEvent("pointerdown", { pointerType: "touch" });
    await expect(page.locator(`[data-tile-slug="${first.slug}"]`)).toHaveAttribute("data-crescendo", "false");
    await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(0);
  });

  test("a real mobile tap does not trigger crescendo (and still navigates)", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await page.goto("/");

    const [first] = listWallProjects();
    const row = featuredIndex(page).getByRole("link").first();

    // Intercept the navigation so we can observe the crescendo state at the moment
    // of the tap, which is when a touch-driven focus would otherwise fire.
    await page.route(`**/work/${first.slug}`, async (route) => {
      // Hold briefly so we can assert before the page unloads.
      await new Promise((resolve) => setTimeout(resolve, 250));
      await route.continue();
    });

    await row.tap();
    await expect(page.locator(`[data-tile-slug="${first.slug}"]`)).toHaveAttribute("data-crescendo", "false");
    await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`/work/${first.slug}$`));
    await context.close();
  });

  test("reduced motion: hovering or focusing a row animates nothing", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.setViewportSize({ width: 1280, height: 900 });

    const [first] = listWallProjects();
    const rows = featuredIndex(page).getByRole("link");
    const tile = page.locator(`[data-tile-slug="${first.slug}"]`);
    await tile.scrollIntoViewIfNeeded();

    await rows.first().hover();
    const running = await tile.evaluate((el) => el.getAnimations({ subtree: true }).length);
    expect(running).toBe(0);

    await page.mouse.move(0, 0);
    await rows.first().focus();
    const runningFocus = await tile.evaluate((el) => el.getAnimations({ subtree: true }).length);
    expect(runningFocus).toBe(0);
  });

  test("every featured project row drives its tile", async ({ page }) => {
    const projects = listWallProjects();
    const rows = featuredIndex(page).getByRole("link");
    await expect(rows).toHaveCount(projects.length);

    for (const [index, project] of projects.entries()) {
      await rows.nth(index).hover();
      await expect(page.locator(`[data-tile-slug="${project.slug}"]`)).toHaveAttribute("data-crescendo", "true");
      await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);
      await page.mouse.move(0, 0);
    }
  });
});
