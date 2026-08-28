import { expect, test } from "@playwright/test";

test("terminal-one publishes its sourced case study", async ({ page }) => {
  const response = await page.goto("/work/terminal-one");

  expect(response?.status()).toBe(200);
  const main = page.getByRole("main");
  await expect(
    main.getByRole("heading", { name: "Terminal One", level: 1 }),
  ).toBeVisible();
  await expect(main.getByText(/deterministic recommendation engine/i)).toBeVisible();
  await expect(main.getByRole("img", { name: /portfolio console/i })).toBeVisible();
  await expect(main.getByRole("listitem").filter({ hasText: /^Spring Boot$/ })).toBeVisible();
  await expect(main.getByRole("link", { name: /repository/i })).toHaveAttribute(
    "href",
    "https://github.com/msmele345/terminal-one",
  );
  await expect(main.getByText(/draft copy/i)).toBeVisible();
});

test("telescope publishes its sourced case study", async ({ page }) => {
  const response = await page.goto("/work/telescope");

  expect(response?.status()).toBe(200);
  const main = page.getByRole("main");
  await expect(
    main.getByRole("heading", { name: "Telescope", level: 1 }),
  ).toBeVisible();
  await expect(main.getByText(/9,000 real stars/i)).toBeVisible();
  await expect(main.getByRole("img", { name: /local night sky/i })).toBeVisible();
  await expect(main.getByRole("listitem").filter({ hasText: /^Three.js$/ })).toBeVisible();
  await expect(main.getByRole("link", { name: /repository/i })).toHaveAttribute(
    "href",
    "https://github.com/msmele345/telescope",
  );
  await expect(main.getByRole("link", { name: /live demo/i })).toHaveAttribute(
    "href",
    "https://telescope.vercel.app",
  );
  await expect(main.getByText(/draft copy/i)).toBeVisible();
});

test("sound-city publishes its sourced case study", async ({ page }) => {
  const response = await page.goto("/work/sound-city");

  expect(response?.status()).toBe(200);
  const main = page.getByRole("main");
  await expect(
    main.getByRole("heading", { name: "Sound City", level: 1 }),
  ).toBeVisible();
  await expect(main.getByText(/source-verified chicago event data/i)).toBeVisible();
  await expect(main.getByRole("img", { name: /event review queue/i })).toBeVisible();
  await expect(main.getByRole("listitem").filter({ hasText: /^Drizzle ORM$/ })).toBeVisible();
  await expect(main.getByRole("link", { name: /repository/i })).toHaveAttribute(
    "href",
    "https://github.com/msmele345/sound-city",
  );
  await expect(main.getByRole("link", { name: /live demo/i })).toHaveAttribute(
    "href",
    "https://sound-city.vercel.app",
  );
  await expect(main.getByText(/draft copy/i)).toBeVisible();
});

test("each case study carries its project identity into the hero", async ({ page }) => {
  const identities = [
    { slug: "terminal-one", motif: ".case-motif--terminal", color: "rgb(215, 255, 227)" },
    { slug: "telescope", motif: ".case-motif--telescope", color: "rgb(238, 246, 255)" },
    { slug: "sound-city", motif: ".case-motif--sound-city", color: "rgb(241, 238, 232)" },
  ] as const;

  for (const identity of identities) {
    await page.goto(`/work/${identity.slug}`);
    await expect(page.locator(`article.case--${identity.slug}`)).toBeVisible();
    await expect(page.locator(identity.motif)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
      "color",
      identity.color,
    );
  }
});

test("the project wall presents all four chameleon tiles", async ({ page }) => {
  await page.goto("/");

  const wall = page.locator("#work");
  await expect(wall.locator(".tile-motion")).toHaveCount(4);

  const terminal = wall.getByRole("link", { name: /terminal one/i });
  await expect(terminal).toHaveAttribute("href", "/work/terminal-one");
  await expect(terminal.locator(".terminal-tile__ticker")).toBeVisible();

  const telescope = wall.getByRole("link", { name: /telescope/i });
  await expect(telescope).toHaveAttribute("href", "/work/telescope");
  await expect(telescope.locator(".telescope-tile__star")).toHaveCount(12);

  const soundCity = wall.getByRole("link", { name: /sound city/i });
  await expect(soundCity).toHaveAttribute("href", "/work/sound-city");
  await expect(soundCity.locator(".sound-city-tile__tonight")).toHaveText("TONIGHT");
});

test("ambient tiles hand off a single crescendo", async ({ page }) => {
  await page.goto("/");

  const terminal = page.getByRole("link", { name: /terminal one/i });
  const telescope = page.getByRole("link", { name: /telescope/i });
  const soundCity = page.getByRole("link", { name: /sound city/i });

  await expect(terminal.locator(".terminal-tile__ticker")).toHaveCSS(
    "animation-name",
    "terminal-tape",
  );
  await expect(telescope.locator(".telescope-tile__star").first()).toHaveCSS(
    "animation-name",
    "sky-twinkle",
  );
  await expect(soundCity.locator(".sound-city-tile__meter span").first()).toHaveCSS(
    "animation-name",
    "club-idle",
  );

  await terminal.hover();
  await expect(terminal.locator(".terminal-tile__reels span").first()).toHaveCSS(
    "animation-name",
    "terminal-reel",
  );
  await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);

  await telescope.hover();
  await expect(telescope.locator(".telescope-tile__line").first()).toHaveCSS(
    "animation-name",
    "constellation-draw",
  );
  await expect(terminal.locator("..")).toHaveAttribute("data-crescendo", "false");
  await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);

  await soundCity.hover();
  await expect(soundCity.locator(".sound-city-tile__tonight")).toHaveCSS(
    "animation-name",
    "flyer-crescendo",
  );
  await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);
});

test("reduced motion freezes all four tiles into deliberate static art", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  for (const slug of ["terminal-one", "telescope", "sound-city"]) {
    const tile = page.locator(`[data-tile-slug="${slug}"]`);
    const animatedParts = tile.locator("[data-anim]");
    await expect(animatedParts.first()).toHaveCSS("animation-name", "none");
    expect(await animatedParts.count()).toBeGreaterThan(0);
  }

  await expect(page.locator(".telescope-tile__line").first()).toHaveCSS(
    "opacity",
    "0.75",
  );
  await expect(page.locator(".sound-city-tile__tonight")).toBeVisible();
  await expect(page.locator(".terminal-tile__score")).toHaveText("87.4");
});

test("github enrichment appears on every new tile and case study", async ({ page }) => {
  const projects = [
    { slug: "terminal-one", name: /terminal one/i, commits: "321" },
    { slug: "telescope", name: /telescope/i, commits: "222" },
    { slug: "sound-city", name: /sound city/i, commits: "444" },
  ] as const;

  await page.goto("/");
  for (const project of projects) {
    const tile = page.getByRole("link", { name: project.name });
    await expect(tile.locator(".enrichment--tile")).toContainText(
      `${project.commits} commits`,
    );
  }

  for (const project of projects) {
    await page.goto(`/work/${project.slug}`);
    await expect(page.locator(".enrichment--case dd").first()).toHaveText(
      project.commits,
    );
  }
});

test("each new case study includes a reviewable screenshot set", async ({ page }) => {
  for (const slug of ["terminal-one", "telescope", "sound-city"]) {
    await page.goto(`/work/${slug}`);
    await expect(page.locator(".case__shots img")).toHaveCount(2);
    await expect(page.locator(".case__shots figcaption")).toHaveCount(2);
  }
});

test("tap-and-hold owns the mobile crescendo and off-screen motion pauses", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(widths.content).toBe(widths.viewport);

  const motion = page.locator('[data-tile-slug="sound-city"]');
  const tile = page.getByRole("link", { name: /sound city/i });
  const meter = tile.locator(".sound-city-tile__meter span").first();
  await motion.scrollIntoViewIfNeeded();
  await expect(motion).toHaveAttribute("data-in-view", "true");
  await expect(meter).toHaveCSS("animation-play-state", "running");

  await tile.dispatchEvent("pointerdown", { pointerType: "touch" });
  await expect(motion).toHaveAttribute("data-crescendo", "true");
  await tile.dispatchEvent("pointerup", { pointerType: "touch" });
  await expect(motion).toHaveAttribute("data-crescendo", "false");

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(motion).toHaveAttribute("data-in-view", "false");
  await expect(meter).toHaveCSS("animation-play-state", "paused");
});
