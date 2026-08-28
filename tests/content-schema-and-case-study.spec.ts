import { expect, test } from "@playwright/test";

test("elevated-bpm case study lives at its own route", async ({ page }) => {
  await page.goto("/work/elevated-bpm");

  await expect(
    page.getByRole("heading", { name: /elevated bpm/i, level: 1 }),
  ).toBeVisible();
});

test("unpublished case studies return 404", async ({ page }) => {
  const response = await page.goto("/work/not-a-project");

  expect(response?.status()).toBe(404);
});

test("case study renders from the curated content file", async ({ page }) => {
  await page.goto("/work/elevated-bpm");

  const main = page.getByRole("main");
  await expect(main.getByText(/playable from the first click/i)).toBeVisible();
  await expect(
    main.getByRole("heading", { name: /the instrument came last/i }),
  ).toBeVisible();
  await expect(
    main.getByRole("heading", { name: /instrument first, curriculum inside/i }),
  ).toBeVisible();
  await expect(
    main.getByRole("heading", { name: /silence to groove/i }),
  ).toBeVisible();

  await expect(main.getByRole("img", { name: /eb-01 deck/i })).toBeVisible();
  await expect(main.getByRole("img", { name: /lesson arc/i })).toBeVisible();

  await expect(main.getByRole("listitem").filter({ hasText: /^Tone\.js$/ })).toBeVisible();
  await expect(main.getByRole("link", { name: /repository/i })).toHaveAttribute(
    "href",
    "https://github.com/msmele345/elevated-bpm",
  );
  await expect(main.getByRole("link", { name: /live demo/i })).toHaveAttribute(
    "href",
    "https://elevated-bpm-dusky.vercel.app",
  );
  await expect(main.getByText(/draft copy/i)).toBeVisible();
});

test("case study continues the groovebox identity", async ({ page }) => {
  await page.goto("/work/elevated-bpm");

  const heading = page.getByRole("heading", { name: /elevated bpm/i, level: 1 });
  await expect(heading).toHaveCSS("font-family", /Chakra Petch/);
  await expect(heading).toHaveCSS("color", "rgb(232, 228, 218)");

  const article = page.locator("article.case");
  await expect(article).toHaveCSS("background-color", "rgb(12, 13, 15)");
  await expect(page.locator(".faceplate")).toBeVisible();
  await expect(page.locator(".faceplate__step")).toHaveCount(16);
  await expect(page.locator(".faceplate__pads li")).toHaveCount(4);
});
