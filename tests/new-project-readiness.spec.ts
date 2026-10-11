import { expect, test } from "@playwright/test";
import type { ChildProcess } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  addSyntheticIdentity,
  createShowcaseApp,
  syntheticProject,
  writeFeaturedSelection,
} from "./support/showcase-app";
import { buildTransmissionApp, serveTransmissionApp } from "./support/transmission-app";

const origin = "http://127.0.0.1:3036";
const SHARED_SHELLS = ["src/components/ProjectWall.tsx", "src/components/CaseStudy.tsx", "src/fonts.ts"];

test.describe("onboarding a synthetic bespoke identity through the real build", () => {
  test.describe.configure({ mode: "serial" });
  let dir: string;
  let server: ChildProcess | undefined;
  const project = syntheticProject();

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
    addSyntheticIdentity(dir);
    writeFeaturedSelection(dir, ["signal-loom", "telescope"]);
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3036);
  });
  test.afterAll(async () => {
    await stopServer();
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  test("the shared wall and case-study shells gain no project-specific branch", () => {
    for (const file of SHARED_SHELLS) {
      const onboarded = readFileSync(join(dir, file), "utf8");
      expect(onboarded, file).toBe(readFileSync(join(process.cwd(), file), "utf8"));
      expect(onboarded, file).not.toMatch(/signal-loom|SignalLoom/);
    }
  });

  test("the featured tile renders its own curated content and bespoke art without enrichment", async ({ page }, info) => {
    await page.goto(origin);
    const wall = page.getByRole("region", { name: "Project wall" });
    await expect(wall.locator(".project-wall__bar p")).toHaveText("2 featured projects");
    expect(await wall.locator("[data-tile-slug]").evaluateAll((tiles) => tiles.map((tile) => tile.getAttribute("data-tile-slug")))).toEqual(["signal-loom", "telescope"]);

    const tile = wall.getByRole("link").first();
    await expect(tile).toHaveAttribute("href", "/work/signal-loom");
    await expect(tile).toHaveClass(/signal-loom-tile/);
    await expect(tile.locator(".signal-loom-tile__index")).toHaveText("01");
    await expect(tile.locator("strong")).toHaveText(project.title);
    await expect(tile.locator(".signal-loom-tile__pitch")).toHaveText(project.pitch);
    await expect(tile).toHaveCSS("background-color", "rgb(18, 10, 31)");
    await expect(tile.locator('.signal-loom-tile__loom[aria-hidden="true"] .signal-loom-tile__thread')).toHaveCount(8);
    await expect(tile.locator(".telescope-tile__sky, .groovebox-tile__deck, .terminal-tile__screen, .sound-city-tile__poster")).toHaveCount(0);

    // The stand-in has no such repository: enrichment fails for this project only.
    await expect(tile.locator(".enrichment")).toHaveCount(0);
    await expect(wall.locator('[data-tile-slug="telescope"] .enrichment')).toContainText("222 commits");

    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      await wall.screenshot({ path: info.outputPath(`wall-${width}.png`), animations: "disabled", style: ".site-header { visibility: hidden; }" });
    }
  });

  test("the published case study renders the full authored record, local imagery, and destinations", async ({ page, request }, info) => {
    const response = await page.goto(`${origin}/work/signal-loom`);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Signal Loom/);
    const article = page.locator("article.case");
    await expect(article).toHaveClass(/case--signal-loom/);
    await expect(article).toHaveCSS("--case-accent", "#ff5ad1");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title);
    await expect(article.locator(".case__pitch")).toHaveText(project.pitch);
    await expect(article.locator(".case__silkscreen")).toHaveText("woven signal · signal-loom");
    // Draft copy keeps its review flag and does not block publication.
    await expect(article.getByText("Draft copy — pending review")).toBeVisible();

    await expect(article.locator(".case__hero .case-motif--signal-loom")).toBeVisible();
    await expect(article.locator(".case__hero .case-motif")).toHaveCount(1);
    await expect(article.locator(".case__hero .faceplate")).toHaveCount(0);

    await expect(article.locator(".case__story-list > li")).toHaveCount(3);
    for (const section of project.story) {
      const item = article.locator(`.case__story-list > li[data-kind="${section.kind}"]`);
      await expect(item.getByRole("heading", { level: 3 })).toHaveText(section.heading);
      await expect(item.locator("p").last()).toHaveText(section.body);
    }
    await expect(article.locator(".case__stack li")).toHaveText(project.stack);

    // Labeled draft plates are reviewable imagery: described, captioned, and resolvable.
    const figures = article.locator(".case__shots figure");
    await expect(figures).toHaveCount(project.screenshots.length);
    for (const [index, shot] of project.screenshots.entries()) {
      const image = figures.nth(index).getByRole("img", { name: shot.alt });
      await expect(image).toBeVisible();
      await expect(figures.nth(index).locator("figcaption")).toHaveText(shot.caption);
      expect(await image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
      const asset = await request.get(`${origin}${shot.src}`);
      expect(asset.status()).toBe(200);
      expect(asset.headers()["content-type"]).toContain("image/svg+xml");
    }

    await expect(article.getByRole("link", { name: /Repository/ })).toHaveAttribute("href", project.links.repo!);
    await expect(article.getByRole("link", { name: /Live demo/ })).toHaveAttribute("href", project.links.demo!);
    await expect(article.locator(".enrichment")).toHaveCount(0);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/work\/signal-loom$/);
    expect((await request.get(`${origin}/work/signal-loom/opengraph-image`)).status()).toBe(200);
    expect(await (await request.get(`${origin}/sitemap.xml`)).text()).toContain("/work/signal-loom</loc>");
    await page.screenshot({ path: info.outputPath("case-study-1440.png"), fullPage: true, animations: "disabled" });
  });

  test("the tile keeps keyboard and touch access, static art, and the shared motion contract", async ({ page, browser }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(origin);
    const wall = page.getByRole("region", { name: "Project wall" });
    const motion = wall.locator('[data-tile-slug="signal-loom"]');
    const link = motion.getByRole("link");
    const threads = motion.locator(".signal-loom-tile__thread");

    // Static state: nothing moves, and the frozen weave is deliberate art —
    // every thread visible at its own length rather than a stalled first frame.
    await link.scrollIntoViewIfNeeded();
    const frozen = await threads.evaluateAll((elements) => elements.map((element) => {
      const style = getComputedStyle(element);
      return { animation: style.animationName, opacity: style.opacity, height: element.getBoundingClientRect().height };
    }));
    expect(frozen).toHaveLength(8);
    for (const thread of frozen) {
      expect(thread.animation).toBe("none");
      expect(thread.opacity).toBe("1");
      expect(thread.height).toBeGreaterThan(20);
    }
    expect(new Set(frozen.map((thread) => Math.round(thread.height))).size).toBe(8);
    await link.focus();
    await expect(link).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(`${origin}/work/signal-loom`);

    // Ambient → crescendo, one tile at a time, through hover and keyboard focus.
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(origin);
    await link.scrollIntoViewIfNeeded();
    await expect(motion).toHaveAttribute("data-in-view", "true");
    await expect(motion).toHaveAttribute("data-crescendo", "false");
    await expect(threads.first()).toHaveCSS("animation-name", "loom-weave");
    await expect(threads.first()).toHaveCSS("animation-duration", "4s");
    await expect(threads.first()).toHaveCSS("animation-play-state", "running");
    await link.hover();
    await expect(motion).toHaveAttribute("data-crescendo", "true");
    await expect(threads.first()).toHaveCSS("animation-duration", "0.8s");
    await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);
    await wall.locator('[data-tile-slug="telescope"]').getByRole("link").hover();
    await expect(motion).toHaveAttribute("data-crescendo", "false");
    await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);
    await page.mouse.move(0, 0);
    await link.focus();
    await expect(motion).toHaveAttribute("data-crescendo", "true");
    await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);
    await page.keyboard.press("Tab");
    await expect(wall.locator('[data-tile-slug="telescope"]')).toHaveAttribute("data-crescendo", "true");
    await expect(motion).toHaveAttribute("data-crescendo", "false");

    // Off-screen motion pauses.
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await expect(motion).toHaveAttribute("data-in-view", "false");
    await expect(threads.first()).toHaveCSS("animation-play-state", "paused");

    const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    try {
      const phone = await touch.newPage();
      await phone.goto(origin);
      expect(await phone.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      const phoneMotion = phone.locator('[data-tile-slug="signal-loom"]');
      const phoneLink = phoneMotion.getByRole("link");
      await phoneLink.scrollIntoViewIfNeeded();
      await phoneLink.dispatchEvent("pointerdown", { pointerType: "touch" });
      await expect(phoneMotion).toHaveAttribute("data-crescendo", "true");
      await expect(phone.locator('[data-crescendo="true"]')).toHaveCount(1);
      await phoneLink.dispatchEvent("pointerup", { pointerType: "touch" });
      await expect(phoneMotion).toHaveAttribute("data-crescendo", "false");
      await phoneLink.tap();
      await expect(phone).toHaveURL(`${origin}/work/signal-loom`);
    } finally {
      await touch.close();
    }
  });

  test("reviewed copy with no repository or demo still builds a complete tile and case study", async ({ page }) => {
    test.setTimeout(240_000);
    await stopServer();
    writeFileSync(
      join(dir, "src/content/projects/signal-loom.ts"),
      `import type { Project } from "./schema";\nexport const signalLoom: Project = ${JSON.stringify({ ...project, draft: false, links: {} }, null, 2)};\n`,
    );
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3036);

    await page.goto(origin);
    const tile = page.getByRole("region", { name: "Project wall" }).getByRole("link").first();
    await expect(tile.locator("strong")).toHaveText(project.title);
    await expect(tile.locator(".signal-loom-tile__pitch")).toHaveText(project.pitch);
    await expect(tile.locator(".enrichment")).toHaveCount(0);
    await tile.click();
    await expect(page).toHaveURL(`${origin}/work/signal-loom`);

    const article = page.locator("article.case");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(project.title);
    await expect(article.getByText("Draft copy — pending review")).toHaveCount(0);
    await expect(article.locator(".case__story-list > li")).toHaveCount(3);
    await expect(article.locator(".case__stack li")).toHaveText(project.stack);
    await expect(article.locator(".case__shots figcaption")).toHaveText(project.screenshots.map((shot) => shot.caption));
    await expect(article.locator(".case-motif--signal-loom")).toBeVisible();
    // Absent remotes omit their controls instead of rendering dead links.
    await expect(article.locator(".case__links a")).toHaveCount(0);
    await expect(article.locator(".enrichment")).toHaveCount(0);
  });
});
