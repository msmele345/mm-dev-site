import { expect, test } from "@playwright/test";
import type { ChildProcess } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildTransmissionApp, createTransmissionApp, serveTransmissionApp } from "./support/transmission-app";
import { liveTransmission } from "./support/transmission-editorial";
import { checkTransmissionLayout, expectSignalHitArea, expectStaticTransmission, expectVisibleLinkFocus } from "./support/transmission-reading";

const { nowBuilding, nextExperiment, dispatch: published } = liveTransmission();
const publishedTitle = published.title;

test("dispatch destination cue is visible at rest on one footer line", async ({ page }, info) => {
  await page.goto("/");
  const ledger = page.getByRole("region", { name: "Current Transmission" });
  const dispatch = ledger.getByRole("article", { name: publishedTitle });
  const footer = dispatch.locator("p").last();
  for (const width of [320, 390, 768, 895, 896, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.mouse.move(0, 0);
    await page.evaluate(() => document.fonts.ready);
    await expect(footer).toContainText("· READ");
    await expect(footer.getByText("READ", { exact: false })).toBeVisible();
    const geometry = await footer.evaluate((element) => ({
      height: element.getBoundingClientRect().height,
      lineHeight: parseFloat(getComputedStyle(element).lineHeight),
    }));
    expect(geometry.height).toBeLessThanOrEqual(geometry.lineHeight + 1);
    const footerBottoms = await ledger.getByRole("article").evaluateAll((articles) => articles.map((article) => {
      const footer = article.querySelector("p:last-child")!;
      const style = getComputedStyle(article);
      const bottom = footer.getBoundingClientRect().bottom;
      return { bottom, inset: article.getBoundingClientRect().bottom - bottom - parseFloat(style.paddingBottom) };
    }));
    for (const item of footerBottoms) {
      expect(Math.abs(item.inset)).toBeLessThanOrEqual(1);
      if (width >= 896) expect(Math.abs(item.bottom - footerBottoms[0].bottom)).toBeLessThanOrEqual(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if ([390, 768, 1440].includes(width)) {
      await ledger.screenshot({ path: info.outputPath(`link-cues-${width}.png`) });
    }
  }
});

test("ledger links describe destinations without changing headline names", async ({ page }) => {
  await page.goto("/");
  const ledger = page.getByRole("region", { name: "Current Transmission" });
  const building = ledger.getByRole("link", { name: nowBuilding.headline, exact: true });
  await expect(building).toHaveAccessibleName(nowBuilding.headline);
  await expect(building).toHaveAccessibleDescription(nowBuilding.destination.startsWith("/") ? "Case study" : "Repository");
  const dispatch = ledger.getByRole("link", { name: publishedTitle, exact: true });
  await expect(dispatch).toHaveAccessibleName(publishedTitle);
  await expect(dispatch).toHaveAccessibleDescription(/READ article$/);
  const snapshot = await ledger.ariaSnapshot();
  expect(snapshot).not.toMatch(/[→↗]/);
  await expect(ledger.getByRole("heading", { level: 3 })).toHaveText([nowBuilding.headline, publishedTitle, nextExperiment.headline]);
});

test("stacked signals provide readable copy and comfortable link targets", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const ledger = page.getByRole("region", { name: "Current Transmission" });

  for (const signal of await ledger.getByRole("article").all()) {
    await expectSignalHitArea(signal);
    const copy = signal.locator("p").nth(1);
    expect(await copy.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(14);
  }
});

test("the published ledger changes directly from full-width rows to equal columns", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Current Transmission" }).getByRole("heading", { level: 3 }))
    .toHaveText([nowBuilding.headline, publishedTitle, nextExperiment.headline]);
  const measurements = await checkTransmissionLayout(page, info, "populated");
  writeFileSync(info.outputPath("populated-geometry.json"), JSON.stringify(measurements, null, 2));
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`published signals keep their reading order, visible link focus, and static content with ${reducedMotion} motion`, async ({ page, context }) => {
    await page.emulateMedia({ reducedMotion });
    const externalDestination = !nowBuilding.destination.startsWith("/");
    if (externalDestination) {
      await context.route(nowBuilding.destination, (route) => route.fulfill({ body: "Now Building destination", contentType: "text/html" }));
    }
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const ledger = page.getByRole("region", { name: "Current Transmission" });
      await expect(ledger.getByRole("heading", { level: 3 })).toHaveText([nowBuilding.headline, publishedTitle, nextExperiment.headline]);
      await expect(ledger.getByRole("link")).toHaveCount(2);
      await expect(ledger.getByRole("article", { name: nextExperiment.headline }).locator("a, button, input, [tabindex]")).toHaveCount(0);
      await expectStaticTransmission(ledger);
      await page.getByRole("region", { name: "Project wall" }).getByRole("link").last().focus();
      await page.keyboard.press("Tab");
      const building = ledger.getByRole("link", { name: nowBuilding.headline });
      const dispatch = ledger.getByRole("link", { name: publishedTitle });
      await expect(dispatch).not.toHaveAttribute("target");
      await expect(dispatch).not.toHaveAttribute("rel");
      await expectVisibleLinkFocus(page, building);
      await page.keyboard.press("Tab");
      await expectVisibleLinkFocus(page, dispatch);
      await page.keyboard.press("Tab");
      await expectVisibleLinkFocus(page, page.getByRole("region", { name: "More projects" }).getByRole("link").first());
      await page.keyboard.press("Shift+Tab");
      await expectVisibleLinkFocus(page, dispatch);
      await page.keyboard.press("Shift+Tab");
      await expectVisibleLinkFocus(page, building);
      if (externalDestination) {
        await expect(building).toHaveAttribute("target", "_blank");
        await expect(building).toHaveAttribute("rel", "noreferrer");
        const homepageUrl = page.url();
        const popupPromise = page.waitForEvent("popup");
        await page.keyboard.press("Enter");
        const popup = await popupPromise;
        await expect(popup).toHaveURL(nowBuilding.destination);
        await expect(popup.getByText("Now Building destination", { exact: true })).toBeVisible();
        await expect(page).toHaveURL(homepageUrl);
        await popup.close();
      } else {
        await expect(building).not.toHaveAttribute("target");
        await expect(building).not.toHaveAttribute("rel");
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL(nowBuilding.destination);
      }
      await page.goto("/");
      await building.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(published.route);
      // The article's own body is covered by the isolated dispatch and long-copy fixtures.
      await expect(page.getByRole("heading", { name: publishedTitle, level: 1 })).toBeVisible();
    }
  });

  test(`reverse ledger focus clears the sticky header after manual scrolling with ${reducedMotion} motion`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion });
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const ledger = page.getByRole("region", { name: "Current Transmission" });
      const building = ledger.getByRole("link", { name: nowBuilding.headline });
      const dispatch = ledger.getByRole("link", { name: publishedTitle });
      for (const offset of [0, 8]) {
        await dispatch.focus();
        await expectVisibleLinkFocus(page, dispatch);
        // A visitor can scroll the preceding link into the header-covered strip.
        // Shift+Tab must bring that link and its focus ring clear of the header.
        await building.evaluate((link, shift) => window.scrollTo({
          top: link.getBoundingClientRect().top + window.scrollY - shift,
          behavior: "instant",
        }), offset);
        await page.keyboard.press("Shift+Tab");
        await expectVisibleLinkFocus(page, building);
      }
      await page.screenshot({ path: info.outputPath(`reverse-focus-${viewport.width}.png`) });
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
const buildingTitle = "FIELD ATLAS — COASTLINESANDCONNECTIONSABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
const experimentTitle = "SAIL SKETCHES — considering a generous all-ages adventure through islands, harbours, and unexplored seas";

test.describe("Reading isolated long authored copy", () => {
  let dir: string;
  let server: ChildProcess;
  test.beforeAll(async () => {
    test.setTimeout(180_000);
    dir = createTransmissionApp({
      updatedOn: "2025-03-14",
      nowBuilding: { headline: buildingTitle, supportingText: longSummary, destination: "https://example.com/field-atlas" },
      nextExperiment: { headline: experimentTitle, supportingText: longSummary },
    });
    writeFileSync(join(dir, "src/content/blog/long-field-notes.mdx"), `---\ntitle: ${JSON.stringify(longTitle)}\ndate: "2025-03-14"\nsummary: ${JSON.stringify(longSummary)}\ntags: [field-notes]\n---\n\n## The complete field report\n\n${longSummary}\n\n## Final observation\n\nThe final shoreline detail remains in the complete article.\n`);
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

  test("following the long dispatch retains every authored sentence and the article's ending", async ({ page }, info) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:3023/");
    const ledger = page.getByRole("region", { name: "Current Transmission" });
    await ledger.getByRole("link", { name: buildingTitle }).focus();
    await page.keyboard.press("Tab");
    const dispatch = ledger.getByRole("link", { name: longTitle });
    await expectVisibleLinkFocus(page, dispatch);
    await page.screenshot({ path: info.outputPath("long-headline-focus-390.png") });
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("http://127.0.0.1:3023/blog/long-field-notes");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(longTitle);
    await expect(page.getByText(longSummary, { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Final observation" })).toBeVisible();
    await expect(page.getByText("The final shoreline detail remains in the complete article.")).toBeVisible();
  });
});
