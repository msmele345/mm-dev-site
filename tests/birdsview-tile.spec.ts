import { expect, test, type Page } from "@playwright/test";
import type { ChildProcess } from "node:child_process";
import { rmSync } from "node:fs";
import { birdsview } from "@/content/projects/authored/birdsview";
import { contrast, cssColor, parseColor, type Rgb } from "./support/color";
import {
  createShowcaseApp,
  writeFeaturedSelection,
  writePublishedSelection,
} from "./support/showcase-app";
import { buildTransmissionApp, serveTransmissionApp } from "./support/transmission-app";

const ORIGIN = "http://127.0.0.1:3046";

test.describe("birdsview bespoke globe tile and Site intro seam", () => {
  test.describe.configure({ mode: "serial" });
  let dir = "";
  let server: ChildProcess | undefined;

  async function stopServer() {
    const running = server;
    server = undefined;
    if (running && running.exitCode === null && running.signalCode === null) {
      const exited = new Promise((resolve) => running.once("exit", resolve));
      running.kill();
      await exited;
    }
  }

  test.beforeAll(async () => {
    test.setTimeout(240_000);
    dir = createShowcaseApp();
    writePublishedSelection(dir, ["birdsview", "telescope"]);
    writeFeaturedSelection(dir, ["birdsview", "telescope"]);
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3046);
  });

  test.afterAll(async () => {
    await stopServer();
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  test("renders bespoke globe tile, loaded fonts, distinct electric-mint accent, and AA contrast", async ({ page }) => {
    await page.goto(ORIGIN);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => document.fonts.ready);

    const wall = page.getByRole("region", { name: "Project wall" });
    const siteIndex = page.getByRole("navigation", { name: "Featured projects" });

    expect(
      await wall.locator("[data-tile-slug]").evaluateAll((tiles) => tiles.map((t) => t.getAttribute("data-tile-slug"))),
    ).toEqual(["birdsview", "telescope"]);
    expect(
      await siteIndex.getByRole("link").evaluateAll((links) => links.map((l) => l.getAttribute("href"))),
    ).toEqual(["/work/birdsview", "/work/telescope"]);
    await expect(siteIndex.getByRole("link").first()).toHaveAccessibleName(
      `${birdsview.invitation} ${birdsview.title}`,
    );

    const motion = wall.locator('[data-tile-slug="birdsview"]');
    const links = motion.getByRole("link");
    await expect(links).toHaveCount(1);
    const tile = links.first();
    await expect(tile).toHaveAttribute("href", "/work/birdsview");
    await expect(tile).toHaveClass(/birdsview-tile/);

    // Shared TileMeta fields
    await expect(tile.locator(".birdsview-tile__index")).toHaveText("01");
    await expect(tile.locator("strong")).toHaveText(birdsview.title);
    await expect(tile.locator(".birdsview-tile__pitch")).toHaveText(birdsview.pitch);
    await expect(tile.locator(".birdsview-tile__go")).toHaveText(/Open case study/);

    // Decorative stage is hidden from assistive technology; CSS/SVG only; no starter or other-tile artifacts
    const stage = tile.locator(".birdsview-tile__stage");
    await expect(stage).toHaveAttribute("aria-hidden", "true");
    await expect(tile).not.toContainText(/UNFINISHED/i);
    await expect(tile.locator(".enrichment")).toHaveCount(0);
    await expect(
      tile.locator(".telescope-tile__sky, .groovebox-tile__faceplate, .terminal-tile__screen, .sound-city-tile__poster"),
    ).toHaveCount(0);
    await expect(tile.locator("canvas, img")).toHaveCount(0);
    await expect(stage.locator("svg.birdsview-tile__globe-svg")).toBeVisible();

    // Real browser font loading check (not inferred from displayFace)
    const loadedFonts = await page.evaluate(() =>
      [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family),
    );
    expect(loadedFonts.some((family) => family.includes("Libre Caslon Display"))).toBe(true);
    expect(loadedFonts.some((family) => family.includes("DM Sans"))).toBe(true);
    await expect(tile.locator("strong")).toHaveCSS("font-family", /Libre Caslon Display/i);
    await expect(tile.locator(".birdsview-tile__pitch")).toHaveCSS("font-family", /DM Sans/i);

    // Palette & contrast checks
    await expect(tile).toHaveCSS("background-color", cssColor(birdsview.tile.palette.ground));
    expect(cssColor(birdsview.tile.palette.accent)).not.toBe("rgb(198, 255, 0)");

    const ink = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const composited = (color: string, groundColor = ink): Rgb => {
      const [r, g, b, alpha = 1] = (color.match(/[\d.]+/g) ?? []).map(Number);
      const ground = parseColor(groundColor);
      return [r, g, b].map((ch, i) => ch * alpha + ground[i] * (1 - alpha)) as Rgb;
    };

    // Site intro row contrast against Chrome ink (#08090b) at rest and hover + focus ring
    const indexRow = siteIndex.getByRole("link").first();
    for (const color of await indexRow.locator("span").evaluateAll((spans) => spans.map((s) => getComputedStyle(s).color))) {
      expect(contrast(composited(color), ink), "Site intro row at rest").toBeGreaterThanOrEqual(4.5);
    }
    await indexRow.hover();
    await expect(indexRow.locator(".site-intro__invitation")).toHaveCSS(
      "color",
      cssColor(birdsview.tile.palette.accent),
    );
    for (const color of await indexRow.locator("span").evaluateAll((spans) => spans.map((s) => getComputedStyle(s).color))) {
      expect(contrast(composited(color), ink), "Site intro row on hover").toBeGreaterThanOrEqual(4.5);
    }
    await page.mouse.move(0, 0);
    await page.keyboard.press("Tab");
    await indexRow.focus();
    const rowRing = await indexRow.evaluate((el) => getComputedStyle(el).outlineColor);
    expect(contrast(composited(rowRing), ink), "Site intro row focus ring").toBeGreaterThanOrEqual(3);

    // Tile meta and Fact card text contrast against their actual backgrounds
    const tileGround = birdsview.tile.palette.ground;
    for (const sel of [
      "strong",
      ".birdsview-tile__pitch",
      ".birdsview-tile__index",
      ".birdsview-tile__go",
    ]) {
      const color = await tile.locator(sel).evaluate((el) => getComputedStyle(el).color);
      expect(contrast(composited(color, tileGround), tileGround), `${sel} on tile ground`).toBeGreaterThanOrEqual(4.5);
    }
    const cardBg = await tile.locator(".birdsview-tile__card").evaluate((el) => getComputedStyle(el).backgroundColor);
    for (const sel of [
      ".birdsview-tile__card-eyebrow",
      ".birdsview-tile__card-title",
      ".birdsview-tile__card-fact",
    ]) {
      const color = await tile.locator(sel).evaluate((el) => getComputedStyle(el).color);
      expect(contrast(composited(color, cardBg), cardBg), `${sel} on fact card`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("static state freezes art cleanly under reduced motion across 390, 768, and 1440px", async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(ORIGIN);
    const wall = page.getByRole("region", { name: "Project wall" });
    const motion = wall.locator('[data-tile-slug="birdsview"]');
    const link = motion.getByRole("link");

    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await expectNoOverflow(page);
      await wall.screenshot({
        path: info.outputPath(`wall-${width}.png`),
        animations: "disabled",
        style: ".site-header { visibility: hidden; }",
      });
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await link.scrollIntoViewIfNeeded();

    const animatedCount = await motion.locator("[data-anim]").count();
    expect(animatedCount).toBeGreaterThan(0);
    expect(
      await motion.locator("[data-anim]").evaluateAll((els) => els.every((el) => getComputedStyle(el).animationName === "none")),
    ).toBe(true);

    for (const sel of [
      "svg.birdsview-tile__globe-svg",
      ".birdsview-tile__hotspot",
      ".birdsview-tile__card",
      ".birdsview-tile__stamp",
    ]) {
      const el = motion.locator(sel).first();
      await expect(el).toBeVisible();
      const box = await el.boundingBox();
      expect(box?.width, `${sel} width`).toBeGreaterThan(0);
      expect(box?.height, `${sel} height`).toBeGreaterThan(0);
      const opacity = await el.evaluate((node) => Number(getComputedStyle(node).opacity));
      expect(opacity, `${sel} opacity`).toBeGreaterThanOrEqual(0.9);
    }

    await page.keyboard.press("Tab");
    await link.focus();
    await expect(link).toHaveCSS("outline-style", "solid");
    await expect(link).toHaveCSS("outline-color", "rgb(198, 255, 0)");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(`${ORIGIN}/work/birdsview`);
  });

  test("ambient, crescendo, exclusivity, Site intro coupling, compositor keyframes, off-screen pause, and mobile touch", async ({ page, browser }, info) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ORIGIN);
    await page.mouse.move(0, 0);

    const wall = page.getByRole("region", { name: "Project wall" });
    const siteIndex = page.getByRole("navigation", { name: "Featured projects" });
    const motion = wall.locator('[data-tile-slug="birdsview"]');
    const link = motion.getByRole("link");
    await link.scrollIntoViewIfNeeded();

    await expect(motion).toHaveAttribute("data-in-view", "true");
    await expect(motion).toHaveAttribute("data-crescendo", "false");
    await expect(motion.locator(".birdsview-tile__surface")).toHaveCSS("animation-name", "birdsview-globe-turn");
    await expect(motion.locator(".birdsview-tile__surface")).toHaveCSS("animation-play-state", "running");
    await expect(motion.locator(".birdsview-tile__hotspot-ring").first()).toHaveCSS("animation-name", "birdsview-hotspot-pulse");

    // Hover crescendo + exclusivity
    await link.hover();
    await expect(motion).toHaveAttribute("data-crescendo", "true");
    await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);
    await expect(motion.locator(".birdsview-tile__camera")).toHaveCSS("animation-name", "birdsview-fly-in");
    await expect(motion.locator(".birdsview-tile__stamp")).toHaveCSS("animation-name", "birdsview-stamp-land");
    await page.waitForTimeout(900);
    await link.screenshot({ path: info.outputPath("tile-crescendo-1440.png") });

    // Verify all keyframes used across ambient and crescendo animate only transform and opacity
    const keyframeAudit = await page.evaluate(() => {
      const used = new Set<string>();
      for (const el of document.querySelectorAll('[data-tile-slug="birdsview"] [data-anim]')) {
        for (const name of getComputedStyle(el).animationName.split(",")) {
          const trimmed = name.trim();
          if (trimmed && trimmed !== "none") used.add(trimmed);
        }
      }
      const properties = new Set<string>();
      const found = new Set<string>();
      for (const sheet of [...document.styleSheets]) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of [...rules]) {
          if (!(rule instanceof CSSKeyframesRule) || !used.has(rule.name)) continue;
          found.add(rule.name);
          for (const frame of [...rule.cssRules] as CSSKeyframeRule[]) {
            for (const prop of [...frame.style]) properties.add(prop);
          }
        }
      }
      return { used: [...used].sort(), found: [...found].sort(), properties: [...properties].sort() };
    });
    expect(keyframeAudit.found).toEqual(keyframeAudit.used);
    expect(keyframeAudit.used.length).toBeGreaterThanOrEqual(4);
    for (const prop of keyframeAudit.properties) {
      expect(["opacity", "transform"]).toContain(prop);
    }

    // Handoff to telescope
    await wall.locator('[data-tile-slug="telescope"]').getByRole("link").hover();
    await expect(motion).toHaveAttribute("data-crescendo", "false");
    await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);

    // Keyboard focus crescendo + Tab handoff
    await page.mouse.move(0, 0);
    await link.focus();
    await expect(motion).toHaveAttribute("data-crescendo", "true");
    await page.keyboard.press("Tab");
    await expect(wall.locator('[data-tile-slug="telescope"]')).toHaveAttribute("data-crescendo", "true");
    await expect(motion).toHaveAttribute("data-crescendo", "false");

    // Site intro index row hover and focus drive birdsview crescendo exclusively
    const indexRow = siteIndex.getByRole("link").first();
    await indexRow.hover();
    await expect(motion).toHaveAttribute("data-crescendo", "true");
    await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);
    await page.mouse.move(0, 0);
    await indexRow.focus();
    await expect(motion).toHaveAttribute("data-crescendo", "true");
    await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);

    // Off-screen pause
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(motion).toHaveAttribute("data-in-view", "false");
    expect(
      await motion.locator("[data-anim]").evaluateAll((els) =>
        els.every((el) => getComputedStyle(el).animationPlayState === "paused"),
      ),
    ).toBe(true);

    // Mobile touch interaction
    const touch = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    try {
      const phone = await touch.newPage();
      await phone.goto(ORIGIN);
      await expectNoOverflow(phone);
      const phoneMotion = phone.locator('[data-tile-slug="birdsview"]');
      const phoneLink = phoneMotion.getByRole("link");
      await phoneLink.scrollIntoViewIfNeeded();
      await phoneLink.dispatchEvent("pointerdown", { pointerType: "touch" });
      await expect(phoneMotion).toHaveAttribute("data-crescendo", "true");
      await expect(phone.locator('[data-crescendo="true"]')).toHaveCount(1);
      await phoneLink.dispatchEvent("pointerup", { pointerType: "touch" });
      await expect(phoneMotion).toHaveAttribute("data-crescendo", "false");
      await phoneLink.tap();
      await expect(phone).toHaveURL(`${ORIGIN}/work/birdsview`);
    } finally {
      await touch.close();
    }
  });
});

async function expectNoOverflow(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  const dimensions = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport);
}
