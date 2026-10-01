import { expect, test } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";

test("the Project wall follows the hero cue without an oversized empty band", async ({ page }) => {
  const baseline = JSON.parse(readFileSync("docs/verification/current-transmission/01/baseline.json", "utf8"));
  const measurements = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [
    { width: 1024, height: 900 }, { width: 1440, height: 900 },
    { width: 768, height: 1024 }, { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const cue = await page.getByText("the wall is open", { exact: false }).boundingBox();
    const wall = page.getByRole("region", { name: "Project wall" });
    const heading = await wall.getByRole("heading", { name: "Project wall" }).boundingBox();
    const wallBox = await wall.boundingBox();
    const gap = heading!.y - (cue!.y + cue!.height);
    // Preserve a clear section break while keeping the featured work close to its cue.
    expect(gap).toBeGreaterThanOrEqual(40);
    expect(gap).toBeLessThanOrEqual(112);
    const previous = baseline.measurements.find((entry: { viewport: { width: number } }) => entry.viewport.width === viewport.width);
    if (previous) expect(wallBox!.y).toBeLessThan(previous.projectWallTop);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    measurements.push({ viewport, projectWallTop: wallBox!.y, cueToWallHeadingGap: gap });
    await page.screenshot({ path: test.info().outputPath(`home-${viewport.width}.png`), fullPage: true });
    await page.screenshot({ path: test.info().outputPath(`hero-${viewport.width}.png`) });
  }
  writeFileSync(test.info().outputPath("spacing.json"), JSON.stringify({ reducedMotion: "reduce", contentState: "real published blog; two curated signals", measurements }, null, 2));
});
