import { expect, test } from "@playwright/test";
import type { ChildProcess } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { buildTransmissionApp, createTransmissionApp, runTransmissionBuild, serveTransmissionApp, writeEditorial } from "./support/transmission-app";
import { editorialWith, validEditorial } from "./support/transmission-editorial";

for (const [scenario, field, value, error] of [
  ["an executable Now Building destination", "nowBuilding.destination", "javascript:alert(1)", "must be a safe root-relative path or an absolute HTTPS URL"],
  ["a missing supporting sentence", "nowBuilding.supportingText", undefined, "must be a non-empty string"],
  ["a whitespace-only working title", "nextExperiment.headline", " \t\n ", "must be a non-empty string"],
  ["a wrong headline type", "nowBuilding.headline", 42, "must be a non-empty string"],
  ["a malformed editorial date", "updatedOn", "2026/09/30", "must be a real ISO calendar date (yyyy-mm-dd)"],
  ["an impossible editorial date", "updatedOn", "2026-02-31", "must be a real ISO calendar date (yyyy-mm-dd)"],
  ["a protocol-relative destination", "nowBuilding.destination", "//example.com/atlas", "must be a safe root-relative path or an absolute HTTPS URL"],
  ["a non-HTTPS external destination", "nowBuilding.destination", "http://example.com/atlas", "must be a safe root-relative path or an absolute HTTPS URL"],
  ["a Next Experiment destination", "nextExperiment.destination", "/work/telescope", "is forbidden because Next Experiment is non-interactive"],
] as const) {
  test(`the production build rejects ${scenario} with its field named`, async ({}, info) => {
    test.setTimeout(180_000);
    const dir = createTransmissionApp(editorialWith(field, value));
    try {
      const result = await runTransmissionBuild(dir);
      const expectedError = `Current Transmission ${field} ${error}`;
      writeFileSync(info.outputPath("build.log"), result.output);
      writeFileSync(info.outputPath("build-result.json"), JSON.stringify({ scenario, expectedError, ...result }, null, 2));
      expect(result.signal).toBeNull();
      expect(result.exitCode).toBe(1);
      expect(result.output).toContain(`Error: ${expectedError}`);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}

test("valid editorial edits and unchanged rebuilds reach the static homepage with an empty blog", async ({ page }, info) => {
  test.setTimeout(240_000);
  const dir = createTransmissionApp();
  let server: ChildProcess | undefined;
  const stopServer = async () => {
    const running = server;
    server = undefined;
    if (running && running.exitCode === null && running.signalCode === null) {
      const exited = new Promise((resolve) => running.once("exit", resolve));
      running.kill();
      await exited;
    }
  };
  try {
    const editorial = validEditorial();
    editorial.updatedOn = "2001-01-02";
    editorial.nowBuilding.destination = "https://offline.invalid/current-work";
    writeEditorial(dir, editorial);
    writeFileSync(info.outputPath("valid-initial-build.log"), await buildTransmissionApp(dir));
    server = await serveTransmissionApp(dir, 3024);

    await page.goto("http://127.0.0.1:3024/");
    const ledger = page.getByRole("region", { name: "Current Transmission" });
    await expect(ledger.getByText("UPDATED · 02 JAN 2001")).toBeVisible();
    await expect(ledger.locator("header time")).toHaveAttribute("datetime", "2001-01-02");
    await expect(ledger.getByRole("heading", { level: 3 })).toHaveText(["FIELD ATLAS", "FIRST DISPATCH PENDING", "SAIL SKETCHES"]);
    await expect(ledger.getByRole("article", { name: "FIELD ATLAS" }).locator("p").nth(1)).toHaveText("Mapping the next geography experiment.");
    await expect(ledger.getByRole("article", { name: "SAIL SKETCHES" }).locator("p").nth(1)).toHaveText("Considering an all-ages sailing prototype.");
    const initialLink = ledger.getByRole("link", { name: "FIELD ATLAS" });
    await expect(initialLink).toHaveAttribute("href", "https://offline.invalid/current-work");
    await page.route("https://offline.invalid/current-work", (route) => route.fulfill({ body: "Current work repository", contentType: "text/html" }));
    await initialLink.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("https://offline.invalid/current-work");

    await stopServer();
    editorial.updatedOn = "2000-02-29";
    editorial.nowBuilding.headline = "FIELD ATLAS — Mapping coastlines, islands, and surprising connections across the globe before the next survey";
    editorial.nowBuilding.supportingText = "A complete coastal survey preserves every island, estuary, and observation beyond this short homepage excerpt. ".repeat(8);
    editorial.nowBuilding.destination = "/work/telescope?view=build#notes";
    editorial.nextExperiment.headline = "SAIL SKETCHES — Exploring an all-ages sailing prototype across an open ocean of possible adventures";
    editorial.nextExperiment.supportingText = "Considering an all-ages sailing prototype with room for further sketches, experiments, and unexpected discoveries. ".repeat(8);
    writeEditorial(dir, editorial);
    writeFileSync(info.outputPath("valid-edited-build.log"), await buildTransmissionApp(dir));
    server = await serveTransmissionApp(dir, 3024);
    await page.goto("http://127.0.0.1:3024/");
    await expect(ledger.getByText("UPDATED · 29 FEB 2000")).toBeVisible();
    await expect(ledger.locator("header time")).toHaveAttribute("datetime", "2000-02-29");
    await expect(ledger.getByRole("heading", { level: 3 })).toHaveText([editorial.nowBuilding.headline, "FIRST DISPATCH PENDING", editorial.nextExperiment.headline]);
    const building = ledger.getByRole("article", { name: editorial.nowBuilding.headline });
    const experiment = ledger.getByRole("article", { name: editorial.nextExperiment.headline });
    expect(await building.locator("p").nth(1).textContent()).toBe(editorial.nowBuilding.supportingText);
    expect(await experiment.locator("p").nth(1).textContent()).toBe(editorial.nextExperiment.supportingText);
    await expect(experiment.getByText("IN CONCEPT", { exact: true })).toBeVisible();
    await expect(experiment.locator("a, button, input, [tabindex]")).toHaveCount(0);
    const dispatch = ledger.getByRole("article", { name: "FIRST DISPATCH PENDING" });
    await expect(dispatch.getByText("Field notes are being prepared.")).toBeVisible();
    await expect(dispatch.getByText("OFF AIR", { exact: true })).toBeVisible();
    await expect(dispatch.locator("a, button, input, [tabindex]")).toHaveCount(0);
    await expect(ledger.getByRole("link")).toHaveCount(1);
    const editedLink = building.getByRole("link", { name: editorial.nowBuilding.headline });
    await expect(editedLink).toHaveAttribute("href", "/work/telescope?view=build#notes");
    await editedLink.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL("http://127.0.0.1:3024/work/telescope?view=build#notes");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/telescope/i);

    await stopServer();
    // No editorial file write: a rebuild must not refresh the manual date.
    writeFileSync(info.outputPath("valid-unchanged-build.log"), await buildTransmissionApp(dir));
    server = await serveTransmissionApp(dir, 3024);
    await page.goto("http://127.0.0.1:3024/");
    await expect(ledger.getByText("UPDATED · 29 FEB 2000")).toBeVisible();
    await expect(ledger.locator("header time")).toHaveAttribute("datetime", "2000-02-29");
    await expect(ledger.getByRole("heading", { level: 3 })).toHaveText([editorial.nowBuilding.headline, "FIRST DISPATCH PENDING", editorial.nextExperiment.headline]);
    await expect(editedLink).toHaveAttribute("href", "/work/telescope?view=build#notes");
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => { (document.activeElement as HTMLElement | null)?.blur(); window.scrollTo({ top: 0, behavior: "instant" }); });
      await ledger.screenshot({ path: info.outputPath(`edited-ledger-${width}.png`), animations: "disabled", style: 'nav[aria-label="Primary"] { visibility: hidden; }' });
    }
  } finally {
    await stopServer();
    rmSync(dir, { recursive: true, force: true });
  }
});
