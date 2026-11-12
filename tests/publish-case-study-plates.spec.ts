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
}
