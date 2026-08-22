import { expect, test } from "@playwright/test";

const LIME = "rgb(198, 255, 0)";
const INK = "rgb(8, 9, 11)";

test("home carries the site metadata", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Mitch Mele/i);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /.{20,}/,
  );
});

test("nav carries the wordmark and primary links", async ({ page }) => {
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav).toBeVisible();

  const wordmark = nav.getByRole("link", { name: "Mitch Mele — home" });
  await expect(wordmark).toBeVisible();
  await expect(wordmark).toHaveAttribute("href", "/");
  await expect(wordmark).toHaveCSS("font-family", /Bebas Neue/);

  await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/#work");
  await expect(nav.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  await expect(nav.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/#contact");
});

test("hero introduces Mitch with personality", async ({ page }) => {
  await page.goto("/");

  const heading = page.getByRole("heading", { name: "MITCH MELE", level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("font-family", /Bebas Neue/);

  const main = page.getByRole("main");
  await expect(
    main.getByText(/Built after dark\. Shipped with intent\./),
  ).toBeVisible();
  await expect(main.getByText(/elevated bpm/i)).toBeVisible();
});

test("contact links to GitHub and email in lime", async ({ page }) => {
  await page.goto("/");

  const section = page.locator("#contact");
  await expect(
    section.getByRole("heading", { name: "Contact" }),
  ).toBeVisible();

  const github = section.getByRole("link", { name: /GitHub/ });
  await expect(github).toHaveAttribute("href", "https://github.com/msmele345");
  await expect(github).toHaveCSS("color", LIME);

  const email = section.getByRole("link", { name: /Email/ });
  await expect(email).toHaveAttribute("href", "mailto:mitchmeledev@proton.me");
  await expect(email).toHaveCSS("color", LIME);
});

test("footer closes the page", async ({ page }) => {
  await page.goto("/");

  const footer = page.getByRole("contentinfo");
  await expect(footer).toBeVisible();
  await expect(footer.getByText("Chicago")).toBeVisible();
  await expect(footer).toHaveCSS("background-color", INK);
});

test("keyboard navigation shows lime focus rings", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 800));

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeVisible();

  await page.keyboard.press("Tab");
  const wordmark = page.getByRole("link", { name: "Mitch Mele — home" });
  await expect(wordmark).toBeFocused();
  await expect(wordmark).toHaveCSS("outline-color", LIME);

  const nav = page.getByRole("navigation", { name: "Primary" });
  const headerBottom = () =>
    nav.boundingBox().then((b) => b!.y + b!.height);
  await page.keyboard.press("Tab");
  await expect(nav.getByRole("link", { name: "Work" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(nav.getByRole("link", { name: "Blog" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(nav.getByRole("link", { name: "Contact" })).toBeFocused();

  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.keyboard.press("Enter");
  const main = page.getByRole("main");
  await expect(main).toBeFocused();
  await expect(main).toHaveCSS("outline-color", LIME);
  // Smooth scroll is async; wait for main's top edge to land at/below the header.
  await expect
    .poll(async () => (await main.boundingBox())!.y - (await headerBottom()), {
      timeout: 10000,
    })
    .toBeGreaterThanOrEqual(-1);
});

test("blog link resolves to a real page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Blog" }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(page.getByRole("heading", { name: /Blog/i, level: 1 })).toBeVisible();
});

test("mobile layout keeps every chrome piece in view", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link", { name: "Contact" })).toBeInViewport();
  await expect(page.getByRole("heading", { name: "MITCH MELE", level: 1 })).toBeInViewport();
  await expect(page.locator("#contact")).toBeAttached();
  await expect(page.getByRole("contentinfo")).toBeAttached();
});
