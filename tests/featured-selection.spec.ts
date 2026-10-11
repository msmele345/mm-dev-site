import { expect, test } from "@playwright/test";
import { rmSync } from "node:fs";
import type { ChildProcess } from "node:child_process";
import { createShowcaseApp, writeFeaturedSelection } from "./support/showcase-app";
import { buildTransmissionApp, serveTransmissionApp } from "./support/transmission-app";

test("removing selections leaves one numbered project and an honest singular count", async ({ page }) => {
  test.setTimeout(180_000);
  const dir = createShowcaseApp();
  let server: ChildProcess | undefined;
  try {
    writeFeaturedSelection(dir, ["telescope"]);
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3031);
    await page.goto("http://127.0.0.1:3031/");
    const wall = page.getByRole("region", { name: "Project wall" });
    await expect(wall.locator(".project-wall__bar p")).toHaveText("1 featured project");
    await expect(wall.getByRole("link")).toHaveCount(1);
    await expect(wall.getByRole("link")).toHaveAttribute("href", "/work/telescope");
    await expect(wall.locator(".telescope-tile__index")).toHaveText("01");
    const response = await page.goto("http://127.0.0.1:3031/work/elevated-bpm");
    expect(response?.status()).toBe(200);
  } finally {
    if (server && server.exitCode === null) {
      const exited = new Promise((resolve) => server!.once("exit", resolve));
      server.kill();
      await exited;
    }
    rmSync(dir, { recursive: true, force: true });
  }
});

test("empty selection preserves Work navigation without cards or motion wrappers", async ({ page }) => {
  test.setTimeout(180_000);
  const dir = createShowcaseApp();
  let server: ChildProcess | undefined;
  try {
    writeFeaturedSelection(dir, []);
    await buildTransmissionApp(dir);
    server = await serveTransmissionApp(dir, 3031);
    await page.goto("http://127.0.0.1:3031/");
    const wall = page.getByRole("region", { name: "Project wall" });
    await expect(wall.locator(".project-wall__bar p")).toHaveText("0 featured projects");
    await expect(wall.getByText("No featured projects right now.")).toBeVisible();
    await expect(wall.locator("ul, li, .tile-motion")).toHaveCount(0);
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work", exact: true }).click();
    await expect(page).toHaveURL("http://127.0.0.1:3031/#work");
    await expect(wall.getByRole("heading", { name: "Project wall" })).toBeInViewport();
  } finally {
    if (server && server.exitCode === null) {
      const exited = new Promise((resolve) => server!.once("exit", resolve));
      server.kill();
      await exited;
    }
    rmSync(dir, { recursive: true, force: true });
  }
});
