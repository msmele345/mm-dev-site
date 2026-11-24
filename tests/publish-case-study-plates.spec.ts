import { expect, test } from "@playwright/test";

const featured = ["elevated-bpm", "terminal-one", "telescope", "sound-city"] as const;

for (const slug of featured) {
  test(`${slug} plates read as finished images, not author instructions`, async ({ page }) => {
    await page.goto(`/work/${slug}`);

    const shots = page.locator(".case__shots");
    await expect(shots.locator("img")).toHaveCount(2);
    await expect(shots).not.toContainText(/replace with a live capture/i);
    await expect(shots).not.toContainText(/draft plate/i);

    for (const img of await shots.locator("img").all()) {
      await expect(img).not.toHaveAttribute("alt", /draft plate/i);
    }
  });

  test(`${slug} is published without the draft-copy banner`, async ({ page }) => {
    await page.goto(`/work/${slug}`);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Draft copy — pending review")).toHaveCount(0);
  });
}

test("terminal-one console plate draws a slot-machine lever, not a labeled button", async ({ page, request }) => {
  const res = await request.get("/projects/terminal-one/console.svg");
  expect(res.ok()).toBe(true);
  const svg = await res.text();

  expect(svg).not.toContain("PULL LEVER");
  expect(svg).toMatch(/<g[^>]*id="lever"/);
  expect(svg).toMatch(/id="lever-knob"/);
  expect(svg).toMatch(/id="lever-shaft"/);

  await page.goto("/work/terminal-one");
  await expect(page.locator(".case__shots img").first()).toHaveAttribute("alt", /slot-machine lever/i);
});
