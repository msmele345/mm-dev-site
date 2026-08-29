import { expect, test } from "@playwright/test";

/**
 * The rail's selection is curated in `content/projects/rail.ts`, so these
 * assertions track the current selection deliberately: a change to RAIL_SLUGS
 * should fail here and be re-approved, not slip through unnoticed.
 */
const RAIL = [
  { slug: "screens", commits: "777", language: "TypeScript" },
  { slug: "feedback-listener", commits: "111", language: "Java" },
  { slug: "interstellar-exchange", commits: "555", language: "Java" },
  { slug: "buzzball", commits: "888", language: "TypeScript" },
] as const;

const REPOS: Record<string, string> = {
  screens: "https://github.com/msmele345/screens",
  "feedback-listener": "https://github.com/msmele345/feedback-listener",
  "interstellar-exchange": "https://github.com/msmele345/interstellar-exchange",
  buzzball: "https://github.com/msmele345/Buzzball",
};

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

  // Curated selection, not a dump of every public repo.
  const cards = rail.locator(".rail-card");
  await expect(cards).toHaveCount(RAIL.length);
  await expect(rail.getByText(/curated, not crawled/i)).toBeVisible();

  // Written entries that are not in the current selection stay off the page.
  await expect(rail.locator(".rail-card--livequotes")).toHaveCount(0);
  await expect(rail.locator(".rail-card--algorithm-cloud-processor")).toHaveCount(0);

  // Below the wall, above contact.
  const wallBox = await page.locator("#work").boundingBox();
  const railBox = await rail.boundingBox();
  const contactBox = await page.locator("#contact").boundingBox();
  expect(railBox!.y).toBeGreaterThan(wallBox!.y);
  expect(contactBox!.y).toBeGreaterThan(railBox!.y);

  // Visibly lighter weight than a chameleon tile. Measured as footprint rather
  // than height alone: the grid is auto-fit, so the column count — and with it
  // every card's height — moves with the viewport and the size of the
  // selection. Area carries the design intent without tracking that noise.
  const tileBox = (await page.locator("#work .tile-motion").first().boundingBox())!;
  const cardBox = (await cards.first().boundingBox())!;
  expect(cardBox.width * cardBox.height).toBeLessThan(
    (tileBox.width * tileBox.height) / 2,
  );
  expect(cardBox.height).toBeLessThan(tileBox.height * 0.7);
});

test("the rail shows its selection in the curated order", async ({ page }) => {
  await expect(page.locator("#more-projects .rail-card__title")).toHaveText(
    ["Screens", "Feedback Listener", "Interstellar Exchange", "Buzzball"].map(
      (title) => new RegExp(`^${title}`),
    ),
  );
});

test("rail repos carry their build-time GitHub stats", async ({ page }) => {
  for (const project of RAIL) {
    const stats = page.locator(`.rail-card--${project.slug} .enrichment`);

    await expect(stats).toBeVisible();
    await expect(stats).toContainText(`${project.commits} commits`);
    await expect(stats).toContainText("14 Feb 2026");
    await expect(stats).toContainText(project.language);
  }
});

test("every rail card links out to its repository", async ({ page }) => {
  for (const project of RAIL) {
    await expect(page.locator(`.rail-card--${project.slug} a`)).toHaveAttribute(
      "href",
      REPOS[project.slug],
    );
  }
});

test("the rail is keyboard-navigable in reading order", async ({ page }) => {
  const first = page.locator(`.rail-card--${RAIL[0].slug} a`);

  await first.focus();
  await expect(first).toBeFocused();
  await expect(first).toHaveCSS("outline-style", "solid");

  for (const project of RAIL.slice(1)) {
    await page.keyboard.press("Tab");
    await expect(page.locator(`.rail-card--${project.slug} a`)).toBeFocused();
  }
});

test("the rail reflows to a single column on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  const cards = page.locator("#more-projects .rail-card");
  const first = await cards.first().boundingBox();
  const second = await cards.nth(1).boundingBox();

  expect(second!.y).toBeGreaterThan(first!.y + first!.height - 1);
  // Compare against the document's own client width rather than the viewport:
  // a headed run's scrollbar narrows the page without any overflow existing.
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(0);
});
