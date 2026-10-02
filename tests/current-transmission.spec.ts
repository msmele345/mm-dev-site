import { expect, test } from "@playwright/test";
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ChildProcess } from "node:child_process";
import { buildTransmissionApp, createTransmissionApp, serveTransmissionApp } from "./support/transmission-app";
import { checkTransmissionLayout, expectStaticTransmission, expectVisibleLinkFocus } from "./support/transmission-reading";

test.describe("Current Transmission with an empty blog", () => {
  test.describe.configure({ mode: "serial" });
  let dir: string;
  let server: ChildProcess;
  test.beforeAll(async () => {
    test.setTimeout(180_000);
    dir = createTransmissionApp();
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3021);
  });
  test.afterAll(async () => {
    server?.kill();
    if (server && server.exitCode === null) await new Promise((resolve) => server.once("exit", resolve));
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  test("places the three editorial signals after the Project wall and before More projects", async ({ page }) => {
    await page.goto("http://127.0.0.1:3021/");
    const ledger = page.getByRole("region", { name: "Current Transmission" });
    await expect(ledger).toBeVisible();
    await expect(ledger.getByRole("heading", { level: 3 })).toHaveText([
      "BIRDSVIEW", "FIRST DISPATCH PENDING", "PIRATE WORLD",
    ]);
    await expect(ledger.getByText("Now Building", { exact: true })).toBeVisible();
    await expect(ledger.getByText("Latest Dispatch", { exact: true })).toBeVisible();
    await expect(ledger.getByText("Next Experiment", { exact: true })).toBeVisible();
    const mainRegions = page.getByRole("main").getByRole("region");
    await expect(mainRegions.nth(0)).toHaveAccessibleName("MITCH MELE");
    await expect(mainRegions.nth(1)).toHaveAccessibleName("Project wall");
    await expect(mainRegions.nth(2)).toHaveAccessibleName("Current Transmission");
    await expect(mainRegions.nth(3)).toHaveAccessibleName("More projects");
    const hero = await mainRegions.nth(0).boundingBox();
    const transmission = await ledger.boundingBox();
    const wall = await mainRegions.nth(1).boundingBox();
    const rail = await mainRegions.nth(3).boundingBox();
    expect(wall!.y).toBeGreaterThanOrEqual(hero!.y + hero!.height - 1);
    expect(transmission!.y).toBeGreaterThanOrEqual(wall!.y + wall!.height - 1);
    expect(rail!.y).toBeGreaterThanOrEqual(transmission!.y + transmission!.height - 1);
    for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.evaluate(() => document.fonts.ready);
      // Capture from the document top so the sticky nav does not cover the ledger header.
      await page.evaluate(() => {
        (document.activeElement as HTMLElement | null)?.blur();
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.screenshot({ path: test.info().outputPath(`empty-home-${viewport.width}.png`), fullPage: true });
      const clip = await ledger.boundingBox();
      await page.screenshot({ path: test.info().outputPath(`empty-ledger-${viewport.width}.png`), fullPage: true, clip: clip! });
    }
  });

  test("renders launch drafts, a stable manual date, and honest footer states", async ({ page }) => {
    await page.goto("http://127.0.0.1:3021/");
    const ledger = page.getByRole("region", { name: "Current Transmission" });
    await expect(ledger.getByText("UPDATED · 30 SEP 2026")).toBeVisible();
    await expect(ledger.locator("time")).toHaveAttribute("datetime", "2026-09-30");
    await expect(ledger.getByText("Explore a 3D globe, bird's-eye views, and surprising geography facts.")).toBeVisible();
    await expect(ledger.getByText("Exploring a 3D pirate adventure for players of all ages.")).toBeVisible();
    await expect(ledger.getByText("Field notes are being prepared.")).toBeVisible();
    await expect(ledger.getByText("Repository", { exact: false })).toBeVisible();
    await expect(ledger.getByText("OFF AIR", { exact: true })).toBeVisible();
    await expect(ledger.getByText("IN CONCEPT", { exact: true })).toBeVisible();
    await expect(ledger.getByRole("link", { name: "BIRDSVIEW" })).toHaveAttribute("href", "https://github.com/msmele345/birdsview");
    await expect(ledger).toHaveCSS("background-color", "rgb(8, 9, 11)");
    await expect(ledger.getByRole("heading", { name: "PIRATE WORLD" })).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(ledger.getByText("Now Building", { exact: true })).toHaveCSS("color", "rgb(198, 255, 0)");
    for (const title of ["FIRST DISPATCH PENDING", "PIRATE WORLD"]) {
      const signal = ledger.getByRole("article", { name: title });
      await expect(signal.locator("a, button, input, [tabindex]")).toHaveCount(0);
      await expect(signal).not.toHaveAttribute("tabindex");
    }
    await page.goto("http://127.0.0.1:3021/blog");
    await expect(page.getByText(/Nothing published yet/)).toBeVisible();
  });

  test("the empty-blog ledger stays complete on both sides of the breakpoint and across phone, tablet, and desktop", async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("http://127.0.0.1:3021/");
    const measurements = await checkTransmissionLayout(page, info, "empty");
    writeFileSync(info.outputPath("empty-geometry.json"), JSON.stringify(measurements, null, 2));
  });

  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    test(`keeps only Birdsview in the ledger tab sequence with ${reducedMotion} motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion });
      // Activate the semantic link without relying on the external site's availability.
      await page.route("https://github.com/msmele345/birdsview", (route) => route.fulfill({ body: "Birdsview repository", contentType: "text/html" }));
      for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
        await page.setViewportSize(viewport);
        await page.goto("http://127.0.0.1:3021/");
        const ledger = page.getByRole("region", { name: "Current Transmission" });
        await page.getByRole("region", { name: "Project wall" }).getByRole("link").last().focus();
        await page.keyboard.press("Tab");
        const building = ledger.getByRole("link", { name: "BIRDSVIEW" });
        await expectVisibleLinkFocus(page, building);
        await expect(ledger.getByRole("link")).toHaveCount(1);
        await page.keyboard.press("Tab");
        await expect(page.getByRole("region", { name: "More projects" }).getByRole("link").first()).toBeFocused();
        await expectStaticTransmission(ledger);
        await building.focus();
        await page.keyboard.press("Enter");
        await expect(page).toHaveURL("https://github.com/msmele345/birdsview");
      }
    });
  }

  test("editing the manual record and rebuilding preserves an old calendar date and the empty state", async ({ page }) => {
    test.setTimeout(180_000);
    server.kill();
    await new Promise((resolve) => server.once("exit", resolve));
    writeFileSync(join(dir, "src/content/current-transmission.ts"), `
export const currentTransmission = {
  updatedOn: "2001-01-02",
  nowBuilding: { headline: "FIELD ATLAS", supportingText: "Mapping the next geography experiment.", destination: "/work/telescope" },
  nextExperiment: { headline: "SAIL SKETCHES", supportingText: "Considering an all-ages sailing prototype." },
};
`);
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3021);
    await page.goto("http://127.0.0.1:3021/");
    const ledger = page.getByRole("region", { name: "Current Transmission" });
    await expect(ledger.getByText("UPDATED · 02 JAN 2001")).toBeVisible();
    await expect(ledger.getByRole("link", { name: "FIELD ATLAS" })).toHaveAttribute("href", "/work/telescope");
    await expect(ledger.getByText("Mapping the next geography experiment.")).toBeVisible();
    await expect(ledger.getByRole("heading", { name: "SAIL SKETCHES" })).toBeVisible();
    await expect(ledger.getByText("Considering an all-ages sailing prototype.")).toBeVisible();
    await expect(ledger.getByRole("heading", { name: "FIRST DISPATCH PENDING" })).toBeVisible();
    await expect(ledger.getByText("IN CONCEPT")).toBeVisible();
    await expect(ledger.getByText("OFF AIR")).toBeVisible();
  });
});

test("the production dispatch previews the published post and opens its complete article by keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const ledger = page.getByRole("region", { name: "Current Transmission" });
  const title = "Shipping a groovebox that teaches techno";
  await expect(ledger.getByRole("heading", { level: 3 })).toHaveText(["BIRDSVIEW", title, "PIRATE WORLD"]);
  const dispatch = ledger.getByRole("article", { name: title });
  await expect(dispatch.getByText("Latest Dispatch", { exact: true })).toBeVisible();
  await expect(dispatch.getByText("What it took to turn elevated-bpm's concept doc into a playable groovebox — and what the sequencer taught me about scheduling audio on the web.", { exact: true })).toBeVisible();
  await expect(dispatch.locator("time")).toHaveText("27 Aug 2026");
  await expect(dispatch.locator("time")).toHaveAttribute("datetime", "2026-08-27");
  await expect(ledger.getByText("UPDATED · 30 SEP 2026")).toBeVisible();
  await expect(ledger.locator("header time")).toHaveAttribute("datetime", "2026-09-30");
  await expect(ledger.getByText("FIRST DISPATCH PENDING")).toHaveCount(0);
  const link = dispatch.getByRole("link", { name: title });
  await expect(link).toHaveAttribute("href", "/blog/shipping-a-groovebox-that-teaches-techno");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: test.info().outputPath("populated-home-1440.png"), fullPage: true });
  const clip = await ledger.boundingBox();
  await page.screenshot({ path: test.info().outputPath("populated-ledger-1440.png"), fullPage: true, clip: clip! });
  await ledger.getByRole("link", { name: "BIRDSVIEW" }).focus();
  await page.keyboard.press("Tab");
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("outline-color", "rgb(198, 255, 0)");
  await expect(link).toHaveCSS("outline-style", "solid");
  await expect(link).toHaveCSS("outline-width", "2px");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("region", { name: "More projects" }).getByRole("link").first()).toBeFocused();
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/blog/shipping-a-groovebox-that-teaches-techno");
  await expect(page.getByRole("heading", { name: title, level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Lessons are data, not code", level: 2 })).toBeVisible();
  await expect(page.getByText("Patterns are tiny JSON, so sharing is a URL parameter, not a backend", { exact: true })).toBeVisible();
});
