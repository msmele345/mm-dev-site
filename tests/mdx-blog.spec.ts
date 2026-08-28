import { expect, test } from "@playwright/test";

const POST_TITLE = "Shipping a groovebox that teaches techno";
const POST_SUMMARY =
  "What it took to turn elevated-bpm's concept doc into a playable groovebox — and what the sequencer taught me about scheduling audio on the web.";
const POST_SLUG = "shipping-a-groovebox-that-teaches-techno";
const POST_DATE = "2026-08-27";

test.describe("blog index", () => {
  test("lists the seed post with title, date, and summary", async ({ page }) => {
    await page.goto("/blog");

    await expect(page.getByRole("heading", { name: "Blog", level: 1 })).toBeVisible();

    const list = page.getByRole("list", { name: /posts/i });
    const postLink = list.getByRole("link", { name: new RegExp(POST_TITLE, "i") });
    await expect(postLink).toHaveAttribute("href", `/blog/${POST_SLUG}`);
    await expect(list.getByText("27 Aug 2026")).toBeVisible();
    await expect(list.getByText(/scheduling audio on the web/)).toBeVisible();
    await expect(list.getByText("elevated-bpm", { exact: true })).toBeVisible();
  });

  test("keeps the ink-black chrome", async ({ page }) => {
    await page.goto("/blog");

    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(8, 9, 11)");
  });
});

test.describe("post page", () => {
  test("renders the seed post with its metadata", async ({ page }) => {
    await page.goto(`/blog/${POST_SLUG}`);

    await expect(
      page.getByRole("heading", { name: POST_TITLE, level: 1 }),
    ).toBeVisible();
    await expect(page.getByText("27 Aug 2026")).toBeVisible();
    await expect(page.getByLabel("Tags")).toBeVisible();
    await expect(
      page.getByRole("list", { name: "Tags" }).getByText("elevated-bpm"),
    ).toBeVisible();
  });

  test("links the seed post to the Elevated BPM repository", async ({ page }) => {
    await page.goto(`/blog/${POST_SLUG}`);

    await expect(
      page.getByRole("link", { name: "elevated-bpm", exact: true }),
    ).toHaveAttribute("href", "https://github.com/msmele345/elevated-bpm");
  });

  test("carries correct document metadata", async ({ page }) => {
    await page.goto(`/blog/${POST_SLUG}`);

    await expect(page).toHaveTitle(new RegExp(POST_TITLE, "i"));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      POST_SUMMARY,
    );
    await expect(
      page.locator('meta[property="article:published_time"]'),
    ).toHaveAttribute("content", POST_DATE);
  });

  test("styles code blocks with syntax highlighting", async ({ page }) => {
    await page.goto(`/blog/${POST_SLUG}`);

    const block = page.locator("[data-rehype-pretty-code-figure] pre");
    await expect(block).toBeVisible();

    const token = block.locator("span[data-line] span, code span").first();
    await expect(token).toHaveCSS("color", /rgb/);
    await expect(token).not.toHaveCSS("color", "rgb(255, 255, 255)");
  });

  test("exposes the blog palette as design tokens", async ({ page }) => {
    await page.goto(`/blog/${POST_SLUG}`);

    const tokenNames = [
      "--color-lime-border",
      "--color-lime-border-soft",
      "--color-reading-copy",
      "--color-code-panel",
      "--color-paper-highlight-soft",
      "--color-paper-highlight",
      "--color-shadow",
      "--color-sequencer-step",
      "--color-sequencer-beat",
      "--color-playhead",
    ];
    const palette = await page.locator(":root").evaluate((root, names) => {
      const styles = getComputedStyle(root);
      return names.map((name) => styles.getPropertyValue(name).trim());
    }, tokenNames);

    expect(palette).toEqual([
      "#c6ff0073",
      "#c6ff004d",
      "#f5f3eddb",
      "#0b0c0e",
      "#ffffff1a",
      "#ffffff1f",
      "#00000073",
      "#2e3236",
      "#3a3f44",
      "#f5f3eda6",
    ]);
  });

  test("runs the interactive embed", async ({ page }) => {
    await page.goto(`/blog/${POST_SLUG}`);

    const embed = page.getByRole("group", { name: /mini sequencer/i });
    await expect(embed).toBeVisible();

    // Steps toggle on and off (step 2 kick starts unlit).
    const step = embed.getByRole("button", { name: /step 2, kick/i });
    await expect(step).toHaveAttribute("aria-pressed", "false");
    await step.click();
    await expect(step).toHaveAttribute("aria-pressed", "true");
    await step.click();
    await expect(step).toHaveAttribute("aria-pressed", "false");

    // Transport runs and the playhead moves.
    await embed.getByRole("button", { name: /play/i }).click();
    await expect(embed.getByRole("button", { name: /stop/i })).toBeFocused();
    // Give the look-ahead clock time to queue a future visual update.
    await page.waitForTimeout(240);
    // Both lanes share the current column; one match is proof enough.
    await expect(embed.locator("[data-current='true']").first()).toBeVisible();

    await embed.getByRole("button", { name: /stop/i }).click();
    await expect(embed.getByRole("button", { name: /play/i })).toBeFocused();
    await expect(embed.locator("[data-current='true']")).toHaveCount(0);
    await page.waitForTimeout(200);
    await expect(embed.locator("[data-current='true']")).toHaveCount(0);
  });
});
