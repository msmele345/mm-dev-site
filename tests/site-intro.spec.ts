import { expect, test } from "@playwright/test";
import { listWallProjects } from "@/content/projects/catalog";

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
