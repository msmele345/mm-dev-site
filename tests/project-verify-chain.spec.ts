import { expect, test } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createShowcaseApp, syntheticProject, writeAuthoredRecord } from "./support/showcase-app";

function contentHash(root: string) {
  const digest = createHash("sha256");
  function visit(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      digest.update(entry.name);
      if (entry.isDirectory()) visit(join(dir, entry.name));
      else digest.update(readFileSync(join(dir, entry.name)));
    }
  }
  visit(join(root, "src"));
  visit(join(root, "public"));
  return digest.digest("hex");
}

test("the public onboarding chain rebuilds and verifies published and featured Signal Loom without changing production", async ({}, info) => {
  test.setTimeout(600_000);
  const productionBefore = contentHash(process.cwd());
  const dir = createShowcaseApp();
  function command(...args: string[]) {
    const result = spawnSync("npm", ["run", "project", "--", ...args], { cwd: dir, encoding: "utf8", timeout: 240_000 });
    writeFileSync(info.outputPath(`${args.join("-").replace(/[^a-zA-Z0-9-]/g, "_")}.log`), `${result.stdout}\n${result.stderr}`);
    return result;
  }
  function report(output: string, label: string) {
    const file = output.trim().split("Evidence report: ")[1];
    const text = readFileSync(file, "utf8");
    cpSync(join(file, ".."), info.outputPath(label), { recursive: true });
    return text;
  }
  try {
    cpSync("scripts", join(dir, "scripts"), { recursive: true });
    cpSync("tests", join(dir, "tests"), { recursive: true });
    cpSync("playwright.project.config.ts", join(dir, "playwright.project.config.ts"));
    expect(command("create", "signal-loom", "--title", "Signal Loom", "--source", process.cwd()).status).toBe(0);
    const authored = command("verify", "signal-loom");
    expect(authored.status, authored.stderr).toBe(0);
    expect(report(authored.stdout, "authored")).toContain("Stage: authored");
    writeAuthoredRecord(dir, "signal-loom", syntheticProject());
    cpSync("tests/support/synthetic-identity/signal-loom", join(dir, "src/components/showcase/identities/signal-loom"), { recursive: true });
    mkdirSync(join(dir, "public/projects/signal-loom"), { recursive: true });
    cpSync("tests/support/synthetic-identity/plate.svg", join(dir, "public/projects/signal-loom/plate.svg"));
    expect(command("check", "signal-loom").stdout).toContain("Presentation finished: yes");
    expect(command("publish", "signal-loom").status).toBe(0);
    const publishedBefore = contentHash(dir);
    const published = command("verify", "signal-loom");
    const publishedReport = report(published.stdout, "published");
    expect(published.status, publishedReport).toBe(0);
    expect(publishedReport).toContain("Stage: published");
    expect(publishedReport).toContain("Browser checks: passed");
    expect(publishedReport).toContain("case-study-390.png");
    expect(contentHash(dir)).toBe(publishedBefore);

    // Exercise the absent optional-link branch in the featured stage.
    writeAuthoredRecord(dir, "signal-loom", { ...syntheticProject(), links: {} });
    expect(command("feature", "signal-loom", "--position", "2").status).toBe(0);
    const featuredBefore = contentHash(dir);
    const featured = command("verify", "signal-loom");
    const featuredReport = report(featured.stdout, "featured");
    expect(featured.status, featuredReport).toBe(0);
    expect(featuredReport).toContain("Stage: featured");
    for (const width of [390, 768, 1440]) expect(featuredReport).toContain(`wall-${width}.png`);
    expect(featuredReport).toContain("- [ ] Owner artwork approval");
    expect(contentHash(dir)).toBe(featuredBefore);

    // A valid build with a broken rendered destination must fail browser verification.
    const tileFile = join(dir, "src/components/showcase/identities/signal-loom/Tile.tsx");
    writeFileSync(tileFile, readFileSync(tileFile, "utf8").replace('href={`/work/${project.slug}`}', 'href="/work/telescope"'));
    const brokenBefore = contentHash(dir);
    const broken = command("verify", "signal-loom");
    expect(broken.status, broken.stdout).toBe(1);
    const failed = report(broken.stdout, "failed");
    expect(failed).toContain("Result: failed");
    expect(failed).toContain("playwright.log");
    expect(contentHash(dir)).toBe(brokenBefore);
  } finally {
    rmSync(dir, { recursive: true, force: true });
    expect(contentHash(process.cwd())).toBe(productionBefore);
  }
});
