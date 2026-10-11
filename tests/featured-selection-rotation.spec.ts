import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { rmSync, writeFileSync } from "node:fs";
import type { ChildProcess } from "node:child_process";
import { addPreparedFixtureProject, createShowcaseApp, writeFeaturedSelection } from "./support/showcase-app";
import { buildTransmissionApp, serveTransmissionApp } from "./support/transmission-app";

const scenarios = [
  { name: "baseline", slugs: ["elevated-bpm", "terminal-one", "telescope", "sound-city"] },
  { name: "remove", slugs: ["elevated-bpm", "telescope", "sound-city"] },
  { name: "replace", slugs: ["elevated-bpm", "terminal-one", "sound-city"] },
  { name: "reorder", slugs: ["sound-city", "terminal-one", "elevated-bpm"] },
  { name: "pair", slugs: ["sound-city", "telescope"] },
  { name: "single", slugs: ["telescope"] },
  { name: "empty", slugs: [] },
  { name: "add", slugs: ["sound-city", "orbit-lab", "telescope", "elevated-bpm", "terminal-one"] },
];

async function checkLayout(page: Page, info: TestInfo, slugs: string[]) {
  const wall = page.getByRole("region", { name: "Project wall" });
  await expect(wall.locator(".project-wall__bar p")).toHaveText(`${slugs.length} featured ${slugs.length === 1 ? "project" : "projects"}`);
  await expect(wall.locator(".project-wall__grid > li")).toHaveCount(slugs.length);
  await expect(wall.getByRole("link")).toHaveCount(slugs.length);
  expect(await wall.locator("[data-tile-slug]").evaluateAll((tiles) => tiles.map((tile) => tile.getAttribute("data-tile-slug")))).toEqual(slugs);
  await expect(wall.locator('[class$="__index"]')).toHaveText(["01", "02", "03", "04", "05"].slice(0, slugs.length));
  await expect(wall.locator("li:empty")).toHaveCount(0);
  if (!slugs.length) {
    await expect(wall.getByText("No featured projects right now.")).toBeVisible();
    await expect(wall.locator("ul, .tile-motion")).toHaveCount(0);
  }
  const measurements = [];
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(0, 0);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const geometry = await wall.evaluate((section) => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
      tiles: [...section.querySelectorAll(".project-wall__grid > li")].map((tile) => {
        const { x, y, width, height } = tile.getBoundingClientRect();
        return { x, y, width, height, links: tile.querySelectorAll("a").length };
      }),
    }));
    expect(geometry.content).toBeLessThanOrEqual(geometry.viewport);
    for (const [index, tile] of geometry.tiles.entries()) {
      expect(tile.links).toBe(1);
      expect(tile.width).toBeGreaterThan(200);
      expect(tile.height).toBeGreaterThan(200);
      expect(tile.x).toBeGreaterThanOrEqual(0);
      expect(tile.x + tile.width).toBeLessThanOrEqual(width);
      const previous = geometry.tiles[index - 1];
      if (previous) {
        if (width >= 896 && index % 2 === 1) {
          expect(tile.y).toBeCloseTo(previous.y, 0);
          expect(tile.x).toBeGreaterThan(previous.x);
        } else {
          expect(tile.y).toBeGreaterThanOrEqual(previous.y + previous.height);
          expect(tile.x).toBeCloseTo(geometry.tiles[0].x, 0);
        }
      }
    }
    measurements.push({ width, ...geometry });
    // Capture the whole section after Playwright settles scrolling; hide only
    // the sticky header so it cannot obscure artwork in the review image.
    await wall.screenshot({
      path: info.outputPath(`wall-${width}.png`),
      animations: "disabled",
      style: ".site-header { visibility: hidden; }",
    });
  }
  writeFileSync(info.outputPath("geometry.json"), JSON.stringify(measurements, null, 2));
}

test.describe("featured rotation through rebuilt homepages", () => {
  test.describe.configure({ mode: "serial" });
  let dir: string;
  let server: ChildProcess | undefined;
  async function stopServer() {
    if (server && server.exitCode === null && server.signalCode === null) {
      const exited = new Promise((resolve) => server!.once("exit", resolve));
      server.kill();
      await exited;
    }
    server = undefined;
  }
  test.beforeAll(() => {
    dir = createShowcaseApp();
    addPreparedFixtureProject(dir);
  });
  test.afterAll(async () => {
    await stopServer();
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  for (const { name, slugs } of scenarios) {
    test(`${name}: exact membership, responsive reading order, static art, and keyboard destinations`, async ({ page, browser }, info) => {
      test.setTimeout(180_000);
      await stopServer();
      writeFeaturedSelection(dir, slugs);
      writeFileSync(info.outputPath("build.log"), await buildTransmissionApp(dir));
      server = await serveTransmissionApp(dir, 3032);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("http://127.0.0.1:3032/");
      await checkLayout(page, info, slugs);
      const wall = page.getByRole("region", { name: "Project wall" });
      for (const part of await wall.locator("[data-anim]").all()) {
        await expect(part).toHaveCSS("animation-name", "none");
      }
      for (const [index, slug] of slugs.entries()) {
        const tile = wall.getByRole("link").nth(index);
        await expect(tile).toHaveAttribute("href", `/work/${slug}`);
        expect(await tile.locator('[aria-hidden="true"]').count()).toBeGreaterThan(0);
      }
      if (!slugs.length) return;
      // Enter the wall using Tab, then traverse it in configured order.
      for (let stops = 0; stops < 15; stops++) {
        await page.keyboard.press("Tab");
        if (await wall.getByRole("link").first().evaluate((el) => el === document.activeElement)) break;
      }
      for (let index = 0; index < slugs.length; index++) {
        const tile = wall.getByRole("link").nth(index);
        await expect(tile).toBeFocused();
        await expect(tile).toHaveCSS("outline-style", "solid");
        await expect(tile).toHaveCSS("outline-color", "rgb(198, 255, 0)");
        if (index < slugs.length - 1) await page.keyboard.press("Tab");
      }
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(`http://127.0.0.1:3032/work/${slugs.at(-1)}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

      // Check every selected destination, including the newly added prepared fixture.
      for (const slug of slugs) {
        const response = await page.goto(`http://127.0.0.1:3032/work/${slug}`);
        expect(response?.status()).toBe(200);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      }
      if (name !== "reorder" && name !== "add") return;
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await page.goto("http://127.0.0.1:3032/");
      for (const slug of slugs) {
        const motion = wall.locator(`[data-tile-slug="${slug}"]`);
        await motion.getByRole("link").hover();
        await expect(motion).toHaveAttribute("data-crescendo", "true");
        await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);
      }
      const first = wall.locator(".tile-motion").first();
      await first.scrollIntoViewIfNeeded();
      await expect(first).toHaveAttribute("data-in-view", "true");
      await expect(first.locator("[data-anim]").first()).toHaveCSS("animation-play-state", "running");
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
      await expect(first).toHaveAttribute("data-in-view", "false");
      await expect(first.locator("[data-anim]").first()).toHaveCSS("animation-play-state", "paused");

      const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
      try {
        const phone = await touch.newPage();
        await phone.goto("http://127.0.0.1:3032/");
        const motion = phone.locator(`[data-tile-slug="${slugs[0]}"]`);
        const link = motion.getByRole("link");
        await link.scrollIntoViewIfNeeded();
        await link.dispatchEvent("pointerdown", { pointerType: "touch" });
        await expect(motion).toHaveAttribute("data-crescendo", "true");
        await expect(phone.locator('[data-crescendo="true"]')).toHaveCount(1);
        await link.dispatchEvent("pointerup", { pointerType: "touch" });
        await expect(motion).toHaveAttribute("data-crescendo", "false");
        await link.tap();
        await expect(phone).toHaveURL(`http://127.0.0.1:3032/work/${slugs[0]}`);
      } finally {
        await touch.close();
      }
    });
  }
});
