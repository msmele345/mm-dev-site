import { expect, test } from "@playwright/test";

test("four-tile wall composes cleanly at desktop width", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator("#work .tile-motion")).toHaveCount(4);
  await page.locator("#work").screenshot({
    animations: "disabled",
    path: testInfo.outputPath("project-wall-desktop.png"),
  });
});

test("four ambient tiles do not overflow a mid-range mobile viewport", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("#work .tile-motion")).toHaveCount(4);

  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(widths.content).toBe(widths.viewport);

  await page.locator("#work").screenshot({
    animations: "disabled",
    path: testInfo.outputPath("project-wall-mobile.png"),
  });
});

test("case-study heroes continue each project identity", async ({ page }, testInfo) => {
  for (const slug of ["terminal-one", "telescope", "sound-city"]) {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/work/${slug}`);
    await page.locator(".case__hero").screenshot({
      animations: "disabled",
      path: testInfo.outputPath(`${slug}-hero.png`),
    });
  }
});
