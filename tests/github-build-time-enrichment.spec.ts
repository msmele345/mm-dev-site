import { expect, test, type Page } from "@playwright/test";

/**
 * Fixture values served by tests/support/github-mock.mjs. They look nothing
 * like the real repo's, so a dev server reused without GITHUB_API_BASE_URL
 * fails here loudly instead of quietly passing against live GitHub.
 */
const COMMITS = "1,234";
const PUSHED_AT = "2026-02-14T02:00:00Z";
const PUSHED_ON = "14 Feb 2026"; // 02:00 UTC — the day before in the Americas.

const tile = (page: Page) => page.getByRole("link", { name: /elevated bpm/i });

test("the tile carries the project's live github stats", async ({ page }) => {
  await page.goto("/");

  const strip = tile(page).locator(".enrichment--tile");
  await expect(strip).toContainText(`${COMMITS} commits`);
  await expect(strip).toContainText(`Last active ${PUSHED_ON}`);
  await expect(strip.locator("time")).toHaveAttribute("datetime", PUSHED_AT);
  await expect(strip.locator(".enrichment__chip")).toHaveText([
    "TypeScript",
    "CSS",
    "JavaScript",
  ]);
});

test("the case study reports commits, last push, and language mix", async ({
  page,
}) => {
  await page.goto("/work/elevated-bpm");

  const band = page.locator(".enrichment--case");
  await expect(
    band.getByRole("heading", { name: /live from github/i }),
  ).toBeVisible();

  await expect(band.getByText("Commits")).toBeVisible();
  await expect(band.locator("dd").first()).toHaveText(COMMITS);
  await expect(band.locator("time")).toHaveText(PUSHED_ON);
  await expect(band.locator("time")).toHaveAttribute("datetime", PUSHED_AT);

  // 750k / 150k / 100k bytes of source.
  await expect(band.locator(".enrichment__chip")).toHaveText([
    "TypeScript75%",
    "CSS15%",
    "JavaScript10%",
  ]);
});

test("enrichment wears the chrome's lime, not the project's palette", async ({
  page,
}) => {
  await page.goto("/work/elevated-bpm");

  // The groovebox's own accent is #4dff6a; the chrome's lime is #c6ff00.
  await expect(page.locator(".enrichment--case dd").first()).toHaveCSS(
    "color",
    "rgb(198, 255, 0)",
  );
  await expect(
    page.getByRole("heading", { name: /live from github/i }),
  ).toHaveCSS("color", "rgb(198, 255, 0)");
});

test("live stats are additive — curated content still carries the page", async ({
  page,
}) => {
  await page.goto("/work/elevated-bpm");

  const main = page.getByRole("main");
  await expect(main.getByText(/playable from the first click/i)).toBeVisible();
  await expect(
    main.getByRole("heading", { name: /the instrument came last/i }),
  ).toBeVisible();
  await expect(main.getByRole("heading", { name: /^stack$/i })).toBeVisible();
  await expect(main.getByRole("link", { name: /repository/i })).toBeVisible();
});

test("stats add no keyboard traps inside the tile", async ({ page }) => {
  await page.goto("/");

  const strip = tile(page).locator(".enrichment--tile");
  await expect(strip).toBeVisible();
  expect(await strip.locator("a, button, input, [tabindex]").count()).toBe(0);
});
