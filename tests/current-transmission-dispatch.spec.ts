import { expect, test } from "@playwright/test";
import type { ChildProcess } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildTransmissionApp, createTransmissionApp, serveTransmissionApp } from "./support/transmission-app";
import { updatedLabel, validEditorial } from "./support/transmission-editorial";

const fixture = validEditorial();

function writePost(dir: string, post: { slug: string; title: string; date: string; summary: string; body: string }) {
  writeFileSync(join(dir, "src/content/blog", `${post.slug}.mdx`), `---
title: ${JSON.stringify(post.title)}
date: ${JSON.stringify(post.date)}
summary: ${JSON.stringify(post.summary)}
tags: [field-notes]
---

${post.body}
`);
}

test.describe("Latest Dispatch from isolated published posts", () => {
  test.describe.configure({ mode: "serial" });
  let dir: string;
  let server: ChildProcess;

  test.beforeAll(async () => {
    test.setTimeout(180_000);
    dir = createTransmissionApp(fixture);
    // Titles and creation order disagree with slug order. Future dates remain
    // published under the existing catalogue semantics; there is no scheduling.
    writePost(dir, {
      slug: "y-same-day", title: "Antenna field notes", date: "2099-04-02",
      summary: "Listening for patterns across the globe.",
      body: "## The full field report\n\nThe antenna report includes every observation beyond its homepage summary.\n\n## Closing observations\n\nA final observation from the complete report.",
    });
    writePost(dir, {
      slug: "z-older", title: "Older field notes", date: "2098-12-30",
      summary: "An older report has a higher slug but an earlier date.", body: "An older complete report.",
    });
    writePost(dir, {
      slug: "b-same-day", title: "Zebra field notes", date: "2099-04-02",
      summary: "Another report on the same calendar day.", body: "The other complete report.",
    });
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3022);
  });

  test.afterAll(async () => {
    server?.kill();
    if (server && server.exitCode === null) await new Promise((resolve) => server.once("exit", resolve));
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  test("uses the blog's date and descending-slug tie order and links to the complete article", async ({ page }) => {
    await page.goto("http://127.0.0.1:3022/");
    const ledger = page.getByRole("region", { name: "Current Transmission" });
    await expect(ledger.getByRole("heading", { level: 3 })).toHaveText([fixture.nowBuilding.headline, "Antenna field notes", fixture.nextExperiment.headline]);
    const dispatch = ledger.getByRole("article", { name: "Antenna field notes" });
    await expect(dispatch.getByText("Listening for patterns across the globe.")).toBeVisible();
    await expect(dispatch.locator("time")).toHaveText("2 Apr 2099");
    await expect(dispatch.locator("time")).toHaveAttribute("datetime", "2099-04-02");
    const link = dispatch.getByRole("link", { name: "Antenna field notes" });
    await expect(link).toHaveAttribute("href", "/blog/y-same-day");
    await link.click();
    await expect(page).toHaveURL("http://127.0.0.1:3022/blog/y-same-day");
    await expect(page.getByRole("heading", { name: "Antenna field notes", level: 1 })).toBeVisible();
    await expect(page.getByText("The antenna report includes every observation beyond its homepage summary.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Closing observations" })).toBeVisible();
    await expect(page.getByText("A final observation from the complete report.")).toBeVisible();
    await page.goto("http://127.0.0.1:3022/blog");
    const posts = page.getByRole("list", { name: "Posts", exact: true });
    await expect(posts.getByRole("link")).toHaveText(["Antenna field notes", "Zebra field notes", "Older field notes"]);
  });

  test("adding a newer post and rebuilding updates only the dispatch", async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto("http://127.0.0.1:3022/");
    const ledger = page.getByRole("region", { name: "Current Transmission" });
    const building = ledger.getByRole("article", { name: fixture.nowBuilding.headline });
    const experiment = ledger.getByRole("article", { name: fixture.nextExperiment.headline });
    const buildingBefore = await building.innerText();
    const experimentBefore = await experiment.innerText();
    const headerBefore = await ledger.locator("header").innerText();
    await expect(ledger.getByRole("heading", { name: "Antenna field notes" })).toBeVisible();

    server.kill();
    await new Promise((resolve) => server.once("exit", resolve));
    writePost(dir, {
      slug: "a-newer", title: "Fresh field notes", date: "2100-01-02",
      summary: "A new dispatch arrives without an editorial ledger edit.",
      body: "## The new complete report\n\nEvery detail of the new report is still available in the article.",
    });
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3022);

    await page.goto("http://127.0.0.1:3022/");
    await expect(ledger.getByRole("heading", { level: 3 })).toHaveText([fixture.nowBuilding.headline, "Fresh field notes", fixture.nextExperiment.headline]);
    const dispatch = ledger.getByRole("article", { name: "Fresh field notes" });
    await expect(dispatch.getByText("A new dispatch arrives without an editorial ledger edit.")).toBeVisible();
    await expect(dispatch.locator("time")).toHaveText("2 Jan 2100");
    await expect(dispatch.locator("time")).toHaveAttribute("datetime", "2100-01-02");
    const link = dispatch.getByRole("link", { name: "Fresh field notes" });
    await expect(link).toHaveAttribute("href", "/blog/a-newer");
    await expect(ledger.getByText("Antenna field notes")).toHaveCount(0);
    expect(await building.innerText()).toBe(buildingBefore);
    expect(await experiment.innerText()).toBe(experimentBefore);
    expect(await ledger.locator("header").innerText()).toBe(headerBefore);
    await expect(ledger.getByText(updatedLabel(fixture.updatedOn))).toBeVisible();
    await expect(ledger.locator("header time")).toHaveAttribute("datetime", fixture.updatedOn);
    await expect(building.getByRole("link")).toHaveAttribute("href", fixture.nowBuilding.destination);
    await expect(experiment.locator("a, button, input, [tabindex]")).toHaveCount(0);
    await link.click();
    await expect(page).toHaveURL("http://127.0.0.1:3022/blog/a-newer");
    await expect(page.getByText("Every detail of the new report is still available in the article.")).toBeVisible();
    await page.goto("http://127.0.0.1:3022/blog");
    await expect(page.getByRole("list", { name: "Posts", exact: true }).getByRole("link").first()).toHaveText("Fresh field notes");
  });
});
