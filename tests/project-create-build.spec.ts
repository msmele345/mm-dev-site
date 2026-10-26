import { expect, test } from "@playwright/test";
import { spawnSync, type ChildProcess } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createShowcaseApp } from "./support/showcase-app";
import { runTransmissionBuild, serveTransmissionApp } from "./support/transmission-app";

test("a created unfinished project leaves the production app buildable and unpublished", async ({ page, request }, info) => {
  test.setTimeout(180_000);
  const dir = createShowcaseApp();
  let server: ChildProcess | undefined;
  try {
    cpSync(join(process.cwd(), "scripts"), join(dir, "scripts"), { recursive: true });
    const selectionFile = join(dir, "src/content/projects/selection.json");
    const selectionBefore = readFileSync(selectionFile, "utf8");
    const create = spawnSync("npm", ["run", "project", "--", "create", "signal-loom", "--title", "Signal Loom"], {
      cwd: dir,
      encoding: "utf8",
    });
    expect(create.status, create.stderr).toBe(0);
    const collidingName = spawnSync("npm", ["run", "project", "--", "create", "terminal", "--title", "Terminal"], {
      cwd: dir,
      encoding: "utf8",
    });
    expect(collidingName.status, collidingName.stderr).toBe(0);
    expect(readFileSync(selectionFile, "utf8")).toBe(selectionBefore);

    const check = spawnSync("npm", ["run", "project", "--", "check", "signal-loom"], { cwd: dir, encoding: "utf8" });
    expect(check.status, check.stderr).toBe(0);
    expect(check.stdout).toContain("Stage: authored");
    expect(check.stdout).toContain("Content ready: no");
    expect(check.stdout).toContain("Presentation registered: yes");
    expect(check.stdout).toContain("Presentation finished: no");

    const preview = join(dir, "src/app/starter-preview");
    mkdirSync(preview);
    writeFileSync(join(preview, "page.tsx"), `
import Tile from "@/components/showcase/identities/signal-loom/Tile";
import Artwork from "@/components/showcase/identities/signal-loom/Artwork";
import TerminalArtwork from "@/components/showcase/identities/terminal-one/Artwork";
import TerminalStarter from "@/components/showcase/identities/terminal/Artwork";
import { signalLoom } from "@/content/projects/authored/signal-loom";

export default function Preview() {
  return (
    <main style={{ background: "#111", color: "white", display: "grid", gap: "2rem", padding: "2rem" }}>
      <div data-testid="tile-preview" className="tile-motion"><Tile project={{ ...signalLoom, stats: null }} index={0} /></div>
      <div data-testid="artwork-preview" className="case--signal-loom"><Artwork /></div>
      <div data-testid="existing-terminal" className="case--terminal-one"><TerminalArtwork /></div>
      <TerminalStarter />
    </main>
  );
}
`);
    const build = await runTransmissionBuild(dir);
    writeFileSync(info.outputPath("build.log"), build.output);
    expect(build.signal, build.output).toBeNull();
    expect(build.exitCode, build.output).toBe(0);
    const manifest = JSON.parse(readFileSync(join(dir, ".next/prerender-manifest.json"), "utf8"));
    expect(manifest.routes).toHaveProperty("/work/elevated-bpm");
    expect(manifest.routes).not.toHaveProperty("/work/signal-loom");
    expect(manifest.routes).not.toHaveProperty("/work/signal-loom/opengraph-image");

    server = await serveTransmissionApp(dir, 3044);
    const origin = "http://127.0.0.1:3044";
    expect((await request.get(`${origin}/work/elevated-bpm`)).status()).toBe(200);
    expect((await request.get(`${origin}/work/signal-loom`)).status()).toBe(404);
    expect((await request.get(`${origin}/work/signal-loom/opengraph-image`)).status()).toBe(404);
    const home = await (await request.get(origin)).text();
    expect(home).not.toContain('href="/work/signal-loom"');

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${origin}/starter-preview`);
    const tile = page.getByTestId("tile-preview");
    await expect(tile.getByRole("link", { name: /Signal Loom/ })).toHaveAttribute("href", "/work/signal-loom");
    await expect(tile.getByRole("link", { name: /Signal Loom/ })).toHaveAccessibleName(/unfinished/i);
    await expect(tile.getByText("UNFINISHED", { exact: true })).toBeVisible();
    const artwork = page.getByTestId("artwork-preview");
    await expect(artwork.getByText("UNFINISHED", { exact: true })).toBeVisible();
    await expect(artwork.getByText("Unfinished artwork", { exact: true })).not.toHaveAttribute("aria-hidden", "true");
    await expect(page.getByTestId("existing-terminal").locator(".case-motif--terminal")).toHaveCSS("display", "block");
    await page.screenshot({ path: info.outputPath("unfinished-starters.png"), fullPage: true });
  } finally {
    server?.kill();
    rmSync(dir, { recursive: true, force: true });
  }
});
