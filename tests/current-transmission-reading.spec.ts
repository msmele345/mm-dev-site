import { expect, test } from "@playwright/test";
import type { ChildProcess } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildTransmissionApp, createTransmissionApp, serveTransmissionApp } from "./support/transmission-app";
import { checkTransmissionLayout, expectStaticTransmission, expectVisibleLinkFocus } from "./support/transmission-reading";

const publishedTitle = "Shipping a groovebox that teaches techno";

test("stacked signals provide readable copy and comfortable link targets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const ledger = page.getByRole("region", { name: "Current Transmission" });

  for (const link of await ledger.getByRole("link").all()) {
    const target = await link.boundingBox();
    expect(target!.height).toBeGreaterThanOrEqual(44);
    expect(target!.width).toBeGreaterThanOrEqual(44);
  }
  for (const signal of await ledger.getByRole("article").all()) {
    const copy = signal.locator("p").nth(1);
    expect(await copy.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(14);
  }
});

test("the published ledger changes directly from full-width rows to equal columns", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Current Transmission" }).getByRole("heading", { level: 3 }))
    .toHaveText(["BIRDSVIEW", publishedTitle, "PIRATE WORLD"]);
  const measurements = await checkTransmissionLayout(page, info, "populated");
  writeFileSync(info.outputPath("populated-geometry.json"), JSON.stringify(measurements, null, 2));
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`published signals keep their reading order, visible link focus, and static content with ${reducedMotion} motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.route("https://github.com/msmele345/birdsview", (route) => route.fulfill({ body: "Birdsview repository", contentType: "text/html" }));
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const ledger = page.getByRole("region", { name: "Current Transmission" });
      await expect(ledger.getByRole("heading", { level: 3 })).toHaveText(["BIRDSVIEW", publishedTitle, "PIRATE WORLD"]);
      await expect(ledger.getByRole("link")).toHaveCount(2);
      await expect(ledger.getByRole("article", { name: "PIRATE WORLD" }).locator("a, button, input, [tabindex]")).toHaveCount(0);
      await expectStaticTransmission(ledger);
      await page.getByRole("region", { name: "Project wall" }).getByRole("link").last().focus();
      await page.keyboard.press("Tab");
      const building = ledger.getByRole("link", { name: "BIRDSVIEW" });
      const dispatch = ledger.getByRole("link", { name: publishedTitle });
      await expectVisibleLinkFocus(page, building);
      await page.keyboard.press("Tab");
      await expectVisibleLinkFocus(page, dispatch);
      await page.keyboard.press("Tab");
      await expect(page.getByRole("region", { name: "More projects" }).getByRole("link").first()).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expectVisibleLinkFocus(page, dispatch);
      await page.keyboard.press("Shift+Tab");
      await expectVisibleLinkFocus(page, building);
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL("https://github.com/msmele345/birdsview");
      await page.goto("/");
      await building.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL("/blog/shipping-a-groovebox-that-teaches-techno");
      await expect(page.getByRole("heading", { name: publishedTitle, level: 1 })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Lessons are data, not code", level: 2 })).toBeVisible();
      await expect(page.getByText("Patterns are tiny JSON, so sharing is a URL parameter, not a backend", { exact: true })).toBeVisible();
    }
  });
}

test("the final published homepage keeps the Project wall ahead of its actual pre-ledger baseline", async ({ page }, info) => {
  const baseline = JSON.parse(readFileSync("docs/verification/current-transmission/01/baseline.json", "utf8")) as {
    measurements: { viewport: { width: number; height: number }; projectWallTop: number }[];
  };
  const measurements = [];
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const previous of baseline.measurements) {
    await page.setViewportSize(previous.viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("region", { name: "Current Transmission" }).getByRole("heading", { name: publishedTitle })).toBeVisible();
    const projectWallTop = await page.getByRole("region", { name: "Project wall" }).evaluate((wall) => wall.getBoundingClientRect().top + window.scrollY);
    expect(projectWallTop).toBeLessThanOrEqual(previous.projectWallTop + 0.5);
    measurements.push({ viewport: previous.viewport, baselineTop: previous.projectWallTop, projectWallTop });
  }
  writeFileSync(info.outputPath("final-spacing.json"), JSON.stringify({ reducedMotion: "reduce", contentState: "real published blog; two curated signals", measurements }, null, 2));
});

const longTitle = "Field notes from a geography experiment: mapping coastlines, following surprising connections, and keeping the complete story readable on every screen";
const longSummary = "A complete set of field notes follows the coast from the first survey to the final observation, including the small islands, winding estuaries, changing light, and unexpected connections that deserve more than a short homepage preview. The report preserves every authored sentence so a reader can follow the dispatch for the full account, compare the early sketches with later discoveries, and read the final observation without losing any detail to the compact two-line excerpt.";
const buildingTitle = "BIRDSVIEW FIELD ATLAS — COASTLINESANDCONNECTIONSABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
const experimentTitle = "PIRATE WORLD — considering a generous all-ages adventure through islands, harbours, and unexplored seas";

test.describe("Reading isolated long authored copy", () => {
  let dir: string;
  let server: ChildProcess;
  test.beforeAll(async () => {
    test.setTimeout(180_000);
    dir = createTransmissionApp();
    writeFileSync(join(dir, "src/content/current-transmission.ts"), `export const currentTransmission = ${JSON.stringify({
      updatedOn: "2026-09-30",
      nowBuilding: { headline: buildingTitle, supportingText: longSummary, destination: "https://github.com/msmele345/birdsview" },
      nextExperiment: { headline: experimentTitle, supportingText: longSummary },
    }, null, 2)};\n`);
    writeFileSync(join(dir, "src/content/blog/long-field-notes.mdx"), `---\ntitle: ${JSON.stringify(longTitle)}\ndate: "2026-09-30"\nsummary: ${JSON.stringify(longSummary)}\ntags: [field-notes]\n---\n\n## The complete field report\n\n${longSummary}\n\n## Final observation\n\nThe final shoreline detail remains in the complete article.\n`);
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3023);
  });
  test.afterAll(async () => {
    server?.kill();
    if (server && server.exitCode === null) await new Promise((resolve) => server.once("exit", resolve));
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  test("long headlines wrap in every layout while summaries remain two-line excerpts", async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("http://127.0.0.1:3023/");
    const ledger = page.getByRole("region", { name: "Current Transmission" });
    await expect(ledger.getByRole("heading", { level: 3 })).toHaveText([buildingTitle, longTitle, experimentTitle]);
    const measurements = await checkTransmissionLayout(page, info, "long");
    writeFileSync(info.outputPath("long-geometry.json"), JSON.stringify(measurements, null, 2));
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const signal of await ledger.getByRole("article").all()) {
        const heading = signal.getByRole("heading", { level: 3 });
        const lines = await heading.evaluate((element) => element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight));
        expect(lines).toBeGreaterThan(1.5);
        const copy = signal.locator("p").nth(1);
        await expect(copy).toHaveText(longSummary);
        expect(await copy.evaluate((element) => element.scrollHeight > element.clientHeight + 1)).toBe(true);
      }
      await expectStaticTransmission(ledger);
    }
  });

  test("following the long dispatch retains every authored sentence and the article's ending", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:3023/");
    const ledger = page.getByRole("region", { name: "Current Transmission" });
    await ledger.getByRole("link", { name: buildingTitle }).focus();
    await page.keyboard.press("Tab");
    const dispatch = ledger.getByRole("link", { name: longTitle });
    await expectVisibleLinkFocus(page, dispatch);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("http://127.0.0.1:3023/blog/long-field-notes");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(longTitle);
    await expect(page.getByText(longSummary, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Final observation" })).toBeVisible();
    await expect(page.getByText("The final shoreline detail remains in the complete article.")).toBeVisible();
  });
});
