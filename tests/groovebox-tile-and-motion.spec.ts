import { expect, test, type Page } from "@playwright/test";

const tile = (page: Page) => page.getByRole("link", { name: /elevated bpm/i });
const glows = (page: Page) => page.locator(".groovebox-tile__step-glow");

// Skip link, wordmark, 3 nav links, then the tile — tab stops before the card.
const TAB_STOPS_BEFORE_TILE = 10;

test("wall renders the groovebox faceplate tile from the content file", async ({
  page,
}) => {
  await page.goto("/");

  const wall = page.locator("#work");
  await expect(wall.getByRole("heading", { name: /project wall/i })).toBeVisible();

  const card = tile(page);
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute("href", "/work/elevated-bpm");

  // Faceplate: silkscreen name, 16 sequencer steps, 4 hardware pads.
  await expect(card.locator(".groovebox-tile__silkscreen")).toHaveText(
    /elevated bpm/i,
  );
  await expect(card.locator(".groovebox-tile__step")).toHaveCount(16);
  await expect(card.locator(".groovebox-tile__pads li")).toHaveCount(4);

  // The tile wears elevated-bpm's palette, not the chrome's raised ink.
  await expect(card).toHaveCSS("background-color", "rgb(12, 13, 15)");
  await expect(
    card.getByText(/playable from the first click/i),
  ).toBeVisible();

  await card.click();
  await expect(page).toHaveURL(/\/work\/elevated-bpm$/);
  await expect(
    page.getByRole("heading", { name: /elevated bpm/i, level: 1 }),
  ).toBeVisible();
});

test("ambient state idles by default", async ({ page }) => {
  await page.goto("/");

  await tile(page).scrollIntoViewIfNeeded();
  const litGlow = page
    .locator('.groovebox-tile__step[data-lit="true"] .groovebox-tile__step-glow')
    .first();
  await expect(litGlow).toHaveCSS("animation-name", "groove-ambient");
  await expect(litGlow).toHaveCSS("animation-play-state", "running");
});

test("hover triggers the crescendo", async ({ page }) => {
  await page.goto("/");

  const card = tile(page);
  await card.hover();

  await expect(glows(page).first()).toHaveCSS("animation-name", "groove-chase");
  await expect(glows(page).first()).toHaveCSS(
    "animation-play-state",
    "running",
  );
});

test("keyboard focus triggers the crescendo with a lime focus ring", async ({
  page,
}) => {
  await page.goto("/");

  const card = tile(page);
  for (let i = 0; i < TAB_STOPS_BEFORE_TILE; i += 1) {
    if (await card.evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press("Tab");
  }
  await expect(card).toBeFocused();

  await expect(glows(page).first()).toHaveCSS("animation-name", "groove-chase");
  await expect(card).toHaveCSS("outline-color", "rgb(198, 255, 0)");
});

test("reduced motion renders the deliberate static state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const card = tile(page);
  await expect(card).toBeVisible();
  await expect(card).toHaveAttribute("href", "/work/elevated-bpm");

  // No animation anywhere on the tile; the frozen art carries the identity.
  await expect(glows(page).first()).toHaveCSS("animation-name", "none");
  const litGlow = page
    .locator('.groovebox-tile__step[data-lit="true"] .groovebox-tile__step-glow')
    .first();
  await expect(litGlow).toHaveCSS("animation-name", "none");
  await expect(litGlow).toHaveCSS("opacity", "1");
});

test("ambient animation pauses off-screen and resumes on re-entry", async ({
  page,
}) => {
  await page.goto("/");

  const motion = page.locator(".tile-motion").first();
  const litGlow = page
    .locator('.groovebox-tile__step[data-lit="true"] .groovebox-tile__step-glow')
    .first();

  await motion.scrollIntoViewIfNeeded();
  await expect(motion).toHaveAttribute("data-in-view", "true");
  await expect(litGlow).toHaveCSS("animation-play-state", "running");

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(motion).toHaveAttribute("data-in-view", "false");
  await expect(litGlow).toHaveCSS("animation-play-state", "paused");

  await motion.scrollIntoViewIfNeeded();
  await expect(motion).toHaveAttribute("data-in-view", "true");
  await expect(litGlow).toHaveCSS("animation-play-state", "running");
});
