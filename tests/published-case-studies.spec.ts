import { expect, test } from "@playwright/test";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ChildProcess } from "node:child_process";
import { addPreparedFixtureProject, writeFeaturedSelection, createShowcaseApp } from "./support/showcase-app";
import { buildTransmissionApp, serveTransmissionApp, runTransmissionBuild } from "./support/transmission-app";

function writePublishedSelection(dir: string, slugs: readonly string[]) {
  const file = join(dir, "src/content/projects/catalog.ts");
  const source = readFileSync(file, "utf8");
  const selection = /const CASE_STUDY_SLUGS = \[[\s\S]*?\] as const;/;
  if (!selection.test(source)) throw new Error("Publication fixture could not find CASE_STUDY_SLUGS");
  writeFileSync(file, source.replace(selection, `const CASE_STUDY_SLUGS = ${JSON.stringify(slugs)} as const;`));
}

test("build rejects a featured project without a published case study", async () => {
  test.setTimeout(180_000);
  const dir = createShowcaseApp();
  try {
    writePublishedSelection(dir, ["terminal-one", "telescope", "sound-city"]);
    const result = await runTransmissionBuild(dir);
    expect(result.exitCode, result.output).not.toBe(0);
    expect(result.output).toContain('Featured selection "elevated-bpm": no published case-study destination');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("unfeaturing and rebuilding retains published identity, metadata, images and sitemap", async ({ page, request }) => {
  test.setTimeout(360_000);
  const dir = createShowcaseApp();
  let server: ChildProcess | undefined;
  const origin = "http://127.0.0.1:3035";
  const published = ["elevated-bpm", "terminal-one", "telescope", "sound-city"];
  async function stopServer() {
    if (server && server.exitCode === null) {
      const exited = new Promise((resolve) => server!.once("exit", resolve));
      server.kill();
      await exited;
    }
    server = undefined;
  }
  async function retainedPage() {
    expect((await page.goto(`${origin}/work/elevated-bpm`))?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Elevated BPM");
    await expect(page.getByText("Draft copy — pending review")).toBeVisible();
    await expect(page.getByRole("heading", { name: "The instrument came last" })).toBeVisible();
    const identity = await page.locator("article.case").evaluate((element) => ({
      className: element.className,
      style: element.getAttribute("style"),
      story: element.querySelector(".case__story")?.textContent,
      artwork: element.querySelector(".case__hero .faceplate")?.outerHTML,
    }));
    expect(identity.artwork).toBeTruthy();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.mitchmele.dev/work/elevated-bpm");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Elevated BPM/);
    const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(imageUrl).toBeTruthy();
    const image = await request.get(`${origin}${new URL(imageUrl!).pathname}`);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    expect((await image.body()).length).toBeGreaterThan(1000);
    const sitemap = await request.get(`${origin}/sitemap.xml`);
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("https://www.mitchmele.dev/work/elevated-bpm</loc>");
    return identity;
  }
  try {
    // A fully authored, reviewed record is still unavailable unless explicitly published.
    addPreparedFixtureProject(dir);
    const catalogue = join(dir, "src/content/projects/catalog.ts");
    writeFileSync(catalogue, readFileSync(catalogue, "utf8").replace('slug: "orbit-lab",', 'slug: "orbit-lab", draft: false,'));
    writePublishedSelection(dir, published);
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3035);
    await page.goto(origin);
    await expect(page.getByRole("region", { name: "Project wall" }).locator('a[href="/work/elevated-bpm"]')).toHaveCount(1);
    const before = await retainedPage();
    await stopServer();

    writeFeaturedSelection(dir, ["terminal-one", "telescope", "sound-city"]);
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3035);
    await page.goto(origin);
    const wall = page.getByRole("region", { name: "Project wall" });
    await expect(wall.getByRole("link")).toHaveCount(3);
    await expect(wall.locator('a[href="/work/elevated-bpm"]')).toHaveCount(0);
    expect(await retainedPage()).toEqual(before);
    for (const slug of published) {
      expect((await request.get(`${origin}/work/${slug}`)).status()).toBe(200);
    }
    for (const slug of ["orbit-lab", "unknown-project"]) {
      expect((await request.get(`${origin}/work/${slug}`)).status()).toBe(404);
      expect((await request.get(`${origin}/work/${slug}/opengraph-image`)).status()).toBe(404);
      expect(await (await request.get(`${origin}/sitemap.xml`)).text()).not.toContain(`/work/${slug}`);
    }
  } finally {
    await stopServer();
    rmSync(dir, { recursive: true, force: true });
  }
});
