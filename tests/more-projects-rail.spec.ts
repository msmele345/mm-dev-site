import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("the rail sits below the project wall as a curated, lighter tier", async ({
  page,
}) => {
  const rail = page.locator("#more-projects");

  await expect(
    rail.getByRole("heading", { name: /more projects/i, level: 2 }),
  ).toBeVisible();

  // Curated, not a dump of every public repo.
  const cards = rail.locator(".rail-card");
  await expect(cards).toHaveCount(6);

  // Below the wall, above contact.
  const wallBox = await page.locator("#work").boundingBox();
  const railBox = await rail.boundingBox();
  const contactBox = await page.locator("#contact").boundingBox();
  expect(railBox!.y).toBeGreaterThan(wallBox!.y);
  expect(contactBox!.y).toBeGreaterThan(railBox!.y);

  // Visibly lighter weight: a rail card is far shorter than a chameleon tile.
  const tileBox = await page.locator("#work .tile-motion").first().boundingBox();
  const cardBox = await cards.first().boundingBox();
  expect(cardBox!.height).toBeLessThan(tileBox!.height / 2);
});

test("scholar renders from curated content alone, with no remote and no stats", async ({
  page,
}) => {
  const scholar = page.locator(".rail-card--scholar");

  await expect(scholar).toBeVisible();
  await expect(scholar.getByText(/azure ai-103 and az-400 study/i)).toBeVisible();
  await expect(scholar.getByRole("link")).toHaveCount(0);
  await expect(scholar.locator(".enrichment")).toHaveCount(0);
  await expect(scholar.getByText(/not published/i)).toBeVisible();
});

test("rail repos carry their build-time GitHub stats", async ({ page }) => {
  const enriched = [
    { slug: "interstellar-exchange", commits: "555", language: "Java" },
    { slug: "algorithm-cloud-processor", commits: "666", language: "Kotlin" },
    { slug: "livequotes", commits: "999", language: "Java" },
    { slug: "screens", commits: "777", language: "TypeScript" },
    { slug: "buzzball", commits: "888", language: "TypeScript" },
  ] as const;

  for (const project of enriched) {
    const card = page.locator(`.rail-card--${project.slug}`);
    const stats = card.locator(".enrichment");

    await expect(stats).toBeVisible();
    await expect(stats).toContainText(`${project.commits} commits`);
    await expect(stats).toContainText("14 Feb 2026");
    await expect(stats).toContainText(project.language);
  }
});

test("every rail card with a remote links to its repository", async ({ page }) => {
  const links = {
    "interstellar-exchange": "https://github.com/msmele345/interstellar-exchange",
    "algorithm-cloud-processor":
      "https://github.com/msmele345/algorithm-cloud-processor",
    livequotes: "https://github.com/msmele345/livequotes",
    screens: "https://github.com/msmele345/screens",
    buzzball: "https://github.com/msmele345/Buzzball",
  } as const;

  for (const [slug, href] of Object.entries(links)) {
    await expect(page.locator(`.rail-card--${slug} a`)).toHaveAttribute(
      "href",
      href,
    );
  }
});

test("the rail is keyboard-navigable in reading order", async ({ page }) => {
  const first = page.locator(".rail-card--interstellar-exchange a");

  await first.focus();
  await expect(first).toBeFocused();
  await expect(first).toHaveCSS("outline-style", "solid");

  await page.keyboard.press("Tab");
  await expect(page.locator(".rail-card--algorithm-cloud-processor a")).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.locator(".rail-card--livequotes a")).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(page.locator(".rail-card--screens a")).toBeFocused();
});

test("the rail reflows to a single column on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  const cards = page.locator("#more-projects .rail-card");
  const first = await cards.first().boundingBox();
  const second = await cards.nth(1).boundingBox();

  expect(second!.y).toBeGreaterThan(first!.y + first!.height - 1);
  await expect(page.locator("body")).toHaveJSProperty("scrollWidth", 390);
});
