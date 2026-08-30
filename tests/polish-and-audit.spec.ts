import { expect, test } from "@playwright/test";

/**
 * Issue 09 — the pre-launch pass across every finished surface.
 *
 * The other specs each prove one slice works. This one asserts the properties
 * that have to hold *everywhere* — no horizontal scroll, one landmark set, a
 * reachable focus ring under the sticky header, no motion under
 * prefers-reduced-motion — so a later slice cannot quietly regress them on a
 * surface its own spec never looks at.
 *
 * Findings, fixes, and the explicit waivers live in `docs/audit/09-polish-and-audit.md`.
 */

const LIME = "rgb(198, 255, 0)";

/** One representative of every page type the site ships. */
const SURFACES = [
  { label: "home", path: "/" },
  { label: "case study", path: "/work/elevated-bpm" },
  { label: "blog index", path: "/blog" },
  { label: "post", path: "/blog/shipping-a-groovebox-that-teaches-techno" },
] as const;

/** Smallest phone still in the wild, through to a wide desktop. */
const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1536];

const WALL_TILES = [
  "elevated-bpm",
  "terminal-one",
  "telescope",
  "sound-city",
] as const;

test.describe("responsive", () => {
  for (const { label, path } of SURFACES) {
    test(`${label} never scrolls sideways, 320px to 1536px`, async ({ page }) => {
      await page.goto(path);

      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        // Layout settles across the clamp()/grid breakpoints before measuring.
        await page.evaluate(
          () => new Promise((resolve) => requestAnimationFrame(resolve)),
        );

        const overflow = await page.evaluate(() => {
          const root = document.documentElement;
          const widest = [...document.querySelectorAll<HTMLElement>("body *")]
            .map((el) => ({
              el: el.tagName.toLowerCase() + (el.className ? `.${String(el.className).split(" ")[0]}` : ""),
              right: Math.round(el.getBoundingClientRect().right),
            }))
            .filter((entry) => entry.right > root.clientWidth + 1)
            .slice(0, 5);
          return {
            scrollWidth: root.scrollWidth,
            clientWidth: root.clientWidth,
            widest,
          };
        });

        expect(
          overflow.scrollWidth,
          `${label} at ${width}px overflows: ${JSON.stringify(overflow.widest)}`,
        ).toBeLessThanOrEqual(overflow.clientWidth + 1);
      }
    });
  }
});

test.describe("landmarks and headings", () => {
  for (const { label, path } of SURFACES) {
    test(`${label} carries one landmark set and a gapless heading order`, async ({
      page,
    }) => {
      await page.goto(path);

      await expect(page.getByRole("banner")).toHaveCount(1);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
      await expect(page.getByRole("navigation", { name: "Primary" })).toHaveCount(1);
      await expect(page.getByRole("link", { name: "Skip to content" })).toHaveCount(1);

      const levels = await page.evaluate(() =>
        [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
          .filter((el) => !el.closest("[aria-hidden='true']"))
          .map((el) => Number(el.tagName[1])),
      );

      expect(levels.filter((level) => level === 1), `${label} h1 count`).toHaveLength(1);
      expect(levels[0], `${label} starts at h1`).toBe(1);
      for (let i = 1; i < levels.length; i += 1) {
        expect(
          levels[i] - levels[i - 1],
          `${label} skips a heading level at index ${i} (${levels.join(",")})`,
        ).toBeLessThanOrEqual(1);
      }
    });
  }
});

test.describe("motion", () => {
  for (const { label, path } of SURFACES) {
    test(`${label} runs no animation under prefers-reduced-motion`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      // Scroll the whole page so every IntersectionObserver has fired and any
      // below-the-fold surface has had its chance to start animating.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y);
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
        window.scrollTo(0, 0);
      });

      await expect
        .poll(
          async () =>
            page.evaluate(() =>
              document
                .getAnimations()
                .filter((animation) => animation.playState === "running")
                .map((animation) =>
                  animation instanceof CSSAnimation
                    ? animation.animationName
                    : animation.constructor.name,
                ),
            ),
          { message: `${label} still animates under reduced motion` },
        )
        .toEqual([]);
    });
  }

  test("every wall tile animates only transform and opacity", async ({ page }) => {
    await page.goto("/");

    const properties = await page.evaluate(() => {
      const names = new Set<string>();
      for (const sheet of [...document.styleSheets]) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of [...rules]) {
          if (!(rule instanceof CSSKeyframesRule)) continue;
          for (const frame of [...rule.cssRules] as CSSKeyframeRule[]) {
            for (const property of [...frame.style]) names.add(property);
          }
        }
      }
      return [...names];
    });

    expect(properties.sort()).toEqual(["opacity", "transform"]);
  });
});

test.describe("keyboard", () => {
  test("the whole home page is reachable by Tab, crescendo included", async ({
    page,
  }) => {
    await page.goto("/");

    const order: string[] = [];
    // Generous cap: enough to cross the page, small enough to fail fast if the
    // focus order ever loops.
    for (let i = 0; i < 40; i += 1) {
      await page.keyboard.press("Tab");
      const id = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement | null;
        if (!active || active === document.body) return null;
        const tile = active.closest<HTMLElement>("[data-tile-slug]");
        if (tile) return `tile:${tile.dataset.tileSlug}`;
        const card = active.closest<HTMLElement>(".rail-card");
        if (card) return `rail:${card.className.replace("rail-card rail-card--", "")}`;
        const region = active.closest(".site-header")
          ? "header"
          : active.closest("#contact")
            ? "contact"
            : active.closest(".site-footer")
              ? "footer"
              : "page";
        return `${region}:${active.textContent?.trim().slice(0, 24)}`;
      });
      if (id) order.push(id);
    }

    // Chrome first, then the wall, then the rail, then contact, then the footer.
    expect(order[0]).toMatch(/^header:Skip to content/);
    for (const slug of WALL_TILES) {
      expect(order, `tab order misses ${slug}`).toContain(`tile:${slug}`);
    }
    expect(order.some((entry) => entry.startsWith("rail:"))).toBe(true);
    expect(order.some((entry) => entry.startsWith("contact:"))).toBe(true);
    expect(order.some((entry) => entry.startsWith("footer:"))).toBe(true);

    const wallStart = order.findIndex((entry) => entry.startsWith("tile:"));
    const railStart = order.findIndex((entry) => entry.startsWith("rail:"));
    const contactStart = order.findIndex((entry) => entry.startsWith("contact:"));
    const footerStart = order.findIndex((entry) => entry.startsWith("footer:"));
    expect(wallStart).toBeLessThan(railStart);
    expect(railStart).toBeLessThan(contactStart);
    expect(contactStart).toBeLessThan(footerStart);
  });

  test("focusing a tile by keyboard crescendos it and rings it in lime", async ({
    page,
  }) => {
    await page.goto("/");

    for (const slug of WALL_TILES) {
      const motion = page.locator(`[data-tile-slug="${slug}"]`);
      const link = motion.getByRole("link");
      await link.focus();

      await expect(link).toHaveCSS("outline-color", LIME);
      await expect(link).toHaveCSS("outline-style", "solid");
      await expect(motion).toHaveAttribute("data-crescendo", "true");
      // Single-crescendo rule, re-asserted through the keyboard path.
      await expect(page.locator('.tile-motion[data-crescendo="true"]')).toHaveCount(1);
    }
  });

  for (const { label, path } of SURFACES) {
    test(`${label} never parks focus under the sticky header`, async ({ page }) => {
      await page.goto(path);
      const headerBottom = await page.evaluate(
        () => document.querySelector(".site-header")!.getBoundingClientRect().bottom,
      );

      for (let i = 0; i < 40; i += 1) {
        await page.keyboard.press("Tab");
        const focused = await page.evaluate(() => {
          const active = document.activeElement as HTMLElement | null;
          if (!active || active === document.body) return null;
          if (active.closest(".site-header")) return null;
          const box = active.getBoundingClientRect();
          return {
            name: active.textContent?.trim().slice(0, 32) ?? active.tagName,
            top: box.top,
            height: box.height,
          };
        });
        if (!focused) continue;
        // The element may be taller than the viewport (a tile at 320px); what
        // matters is that its top edge is not tucked behind the sticky bar.
        expect(
          focused.top,
          `${label}: "${focused.name}" sits under the sticky header`,
        ).toBeGreaterThanOrEqual(headerBottom - 1);
      }
    });
  }
});

test.describe("images", () => {
  test("every case-study plate is described and reserves its space", async ({
    page,
  }) => {
    for (const slug of WALL_TILES) {
      await page.goto(`/work/${slug}`);
      const plates = page.locator(".case__shots img");
      const count = await plates.count();
      expect(count, `${slug} has plates`).toBeGreaterThan(0);

      for (let i = 0; i < count; i += 1) {
        const plate = plates.nth(i);
        const alt = await plate.getAttribute("alt");
        expect(alt?.trim(), `${slug} plate ${i} alt`).toBeTruthy();
        // Explicit intrinsic size — no layout shift when the plate decodes.
        await expect(plate).toHaveAttribute("width", /\d+/);
        await expect(plate).toHaveAttribute("height", /\d+/);
        // Below the fold on every case study.
        await expect(plate).toHaveAttribute("loading", "lazy");
      }
    }
  });
});

test.describe("contrast", () => {
  /**
   * Every visible string on a tile has to clear WCAG AA (4.5:1) against what
   * is actually behind it — the faceplate's silkscreen labels included. They
   * sit on a hardware gradient, so the test reads the gradient's own tokens
   * rather than guessing at a background colour.
   */
  test("faceplate silkscreen clears AA on the hardware it is printed on", async ({
    page,
  }) => {
    for (const path of ["/", "/work/elevated-bpm"]) {
      await page.goto(path);
      const selectors =
        path === "/"
          ? [".groovebox-tile__brand", ".groovebox-tile__pads li"]
          : [".faceplate__brand", ".faceplate__pads li"];

      for (const selector of selectors) {
        const measured = await page.locator(selector).first().evaluate((el) => {
          /* Paint each colour into a 1x1 canvas and read the pixel back: the
             label is a color-mix() and the hardware stops are custom
             properties, and neither resolves to plain rgb() in every engine. */
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1;
          const context = canvas.getContext("2d")!;
          const resolve = (value: string): [number, number, number] | null => {
            if (!value.trim()) return null;
            context.clearRect(0, 0, 1, 1);
            context.fillStyle = "#000";
            context.fillStyle = value;
            context.fillRect(0, 0, 1, 1);
            const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
            return [r, g, b];
          };
          const root = getComputedStyle(document.documentElement);
          return {
            color: resolve(getComputedStyle(el).color),
            hardware: ["--hw-face-top", "--hw-pad-top"].map((token) => ({
              token,
              rgb: resolve(root.getPropertyValue(token)),
            })),
          };
        });

        expect(measured.color, `${path} ${selector}: unreadable colour`).not.toBeNull();
        for (const { token, rgb } of measured.hardware) {
          expect(rgb, `${path} ${selector}: ${token} missing`).not.toBeNull();
          expect(
            contrast(measured.color!, rgb!),
            `${path} ${selector} on ${token}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  });
});

test.describe("code", () => {
  /**
   * Syntax-highlighting themes are chosen for looks, not for contrast, and
   * Shiki writes each token colour inline — so the only way this stays honest
   * across a theme change is to measure every rendered token.
   */
  test("every code token clears AA on the code panel", async ({ page }) => {
    await page.goto("/blog/shipping-a-groovebox-that-teaches-techno");

    const tokens = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      const resolve = (value: string): [number, number, number] => {
        context.fillStyle = "#000";
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
        return [r, g, b];
      };

      const figure = document.querySelector<HTMLElement>(
        "[data-rehype-pretty-code-figure]",
      )!;
      const panel = resolve(getComputedStyle(figure).backgroundColor);
      const seen = new Map<string, { rgb: [number, number, number]; text: string }>();
      for (const span of figure.querySelectorAll<HTMLElement>("code span")) {
        const text = span.textContent ?? "";
        if (!text.trim()) continue;
        const color = getComputedStyle(span).color;
        if (!seen.has(color)) seen.set(color, { rgb: resolve(color), text: text.trim().slice(0, 24) });
      }
      return { panel, tokens: [...seen.entries()].map(([color, v]) => ({ color, ...v })) };
    });

    expect(tokens.tokens.length).toBeGreaterThan(3);
    for (const token of tokens.tokens) {
      expect(
        contrast(token.rgb, tokens.panel),
        `code token ${token.color} ("${token.text}")`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});

test.describe("touch", () => {
  test("wall tiles and the sequencer opt out of the double-tap zoom delay", async ({
    page,
  }) => {
    await page.goto("/");
    for (const slug of WALL_TILES) {
      const link = page.locator(`[data-tile-slug="${slug}"]`).getByRole("link");
      await expect(link).toHaveCSS("touch-action", "manipulation");
    }

    await page.goto("/blog/shipping-a-groovebox-that-teaches-techno");
    await expect(page.locator(".embed-sequencer__step").first()).toHaveCSS(
      "touch-action",
      "manipulation",
    );
    await expect(page.locator(".embed-sequencer__transport")).toHaveCSS(
      "touch-action",
      "manipulation",
    );
  });
});

test.describe("chrome metadata", () => {
  test("the browser UI is told the page is ink-black", async ({ page }) => {
    await page.goto("/");
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor).toHaveCount(1);
    const declared = (await themeColor.getAttribute("content"))!;
    const painted = await page.evaluate(
      () => getComputedStyle(document.documentElement).backgroundColor,
    );
    expect(contrast(declared, painted)).toBeLessThan(1.1);
  });
});

/** ── colour maths (WCAG 2.x relative luminance) ── */

type Rgb = [number, number, number];

function parseColor(value: string | Rgb): Rgb {
  if (Array.isArray(value)) return value;
  const trimmed = value.trim();
  const channels = trimmed.match(/-?[\d.]+/g);
  if (trimmed.startsWith("rgb") && channels) {
    return [Number(channels[0]), Number(channels[1]), Number(channels[2])];
  }
  const hex = trimmed.replace("#", "");
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as Rgb;
}

function luminance(color: string | Rgb): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = parseColor(color);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(foreground: string | Rgb, background: string | Rgb): number {
  const a = luminance(foreground);
  const b = luminance(background);
  const [high, low] = a > b ? [a, b] : [b, a];
  return (high + 0.05) / (low + 0.05);
}
