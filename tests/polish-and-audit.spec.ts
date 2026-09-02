import { expect, test, type Page } from "@playwright/test";

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

        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        if (scrollWidth <= clientWidth + 1) continue;

        // Only now is a full-document rect sweep worth its cost. Both edges:
        // an absolutely positioned decoration at a negative offset widens the
        // document without any element's right edge crossing the viewport.
        const culprits = await page.evaluate(() => {
          const root = document.documentElement;
          return [...document.querySelectorAll<HTMLElement>("body *")]
            .map((el) => {
              const box = el.getBoundingClientRect();
              return {
                el:
                  el.tagName.toLowerCase() +
                  (el.className ? `.${String(el.className).split(" ")[0]}` : ""),
                left: Math.round(box.left),
                right: Math.round(box.right),
              };
            })
            .filter(
              (entry) => entry.right > root.clientWidth + 1 || entry.left < -1,
            )
            .slice(0, 5);
        });

        expect(
          scrollWidth,
          `${label} at ${width}px overflows: ${JSON.stringify(culprits)}`,
        ).toBeLessThanOrEqual(clientWidth + 1);
      }
    });
  }

  /**
   * Every case study, not just the representative one: the hero type scale is
   * shared but the faces are not, and it was the two non-condensed faces
   * (Chakra Petch, mono) that overran a 320px screen.
   */
  test("every case-study hero fits the narrowest phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });

    for (const slug of WALL_TILES) {
      await page.goto(`/work/${slug}`);
      const measured = await page.evaluate(() => {
        const root = document.documentElement;
        const h1 = document.querySelector("h1")!;
        return {
          scrollWidth: root.scrollWidth,
          clientWidth: root.clientWidth,
          headingOverflow: h1.scrollWidth - h1.clientWidth,
        };
      });

      expect(measured.scrollWidth, `${slug} document`).toBeLessThanOrEqual(
        measured.clientWidth + 1,
      );
      expect(measured.headingOverflow, `${slug} hero type`).toBeLessThanOrEqual(1);
    }
  });
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

      /* Not `playState === "running"`: below-the-fold motion is *paused* by
         the off-screen observer and the reduced-motion reset *finishes*
         animations instantly, and both states are filtered out by a
         playState check — so that assertion could only ever see the first
         viewport. An animation's active duration is independent of both. */
      await expect
        .poll(
          async () =>
            page.evaluate(() =>
              document
                .getAnimations()
                .map((animation) => ({
                  name:
                    animation instanceof CSSAnimation
                      ? animation.animationName
                      : animation.constructor.name,
                  duration: Number(
                    animation.effect?.getComputedTiming().duration ?? 0,
                  ),
                }))
                .filter((animation) => animation.duration > 1)
                .map((animation) => `${animation.name} (${animation.duration}ms)`),
            ),
          { message: `${label} still animates under reduced motion` },
        )
        .toEqual([]);
    });
  }

  test("every wall tile animates only transform and opacity", async ({ page }) => {
    await page.goto("/");
    // Both motion states, so crescendo-only keyframes are covered too.
    for (const slug of WALL_TILES) {
      await page.locator(`[data-tile-slug="${slug}"]`).getByRole("link").hover();
    }

    const measured = await page.evaluate(() => {
      /* Only the keyframes the wall actually references — asserting over every
         stylesheet would fail the site's audit for a dev-overlay spinner and
         would silently skip any cross-origin sheet it could not read. */
      const used = new Set<string>();
      for (const el of document.querySelectorAll(".project-wall [data-anim]")) {
        for (const name of getComputedStyle(el).animationName.split(",")) {
          const trimmed = name.trim();
          if (trimmed && trimmed !== "none") used.add(trimmed);
        }
      }

      const properties = new Set<string>();
      const found = new Set<string>();
      for (const sheet of [...document.styleSheets]) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of [...rules]) {
          if (!(rule instanceof CSSKeyframesRule) || !used.has(rule.name)) continue;
          found.add(rule.name);
          for (const frame of [...rule.cssRules] as CSSKeyframeRule[]) {
            for (const property of [...frame.style]) properties.add(property);
          }
        }
      }
      return {
        used: [...used].sort(),
        found: [...found].sort(),
        properties: [...properties].sort(),
      };
    });

    // Every referenced keyframe was readable — no silent skip.
    expect(measured.found, "unreadable keyframes").toEqual(measured.used);
    expect(measured.used.length).toBeGreaterThan(3);
    expect(measured.properties).toEqual(["opacity", "transform"]);
  });
});

/** Has Tab wrapped back around to the skip link? */
async function isFirstStopFocused(page: Page): Promise<boolean> {
  return page.evaluate(
    () => document.activeElement?.classList.contains("site-header__skip") ?? false,
  );
}

/* Focusing an off-screen element makes the browser scroll it into view, and
   `scroll-behavior: smooth` on `html` (globals.css) animates that over ~300ms.
   A rect read straight after a Tab is therefore mid-flight: the element is
   still above the fold and reads as parked under the header. That is what the
   element lands *on the way to*, not where it comes to rest, so this test
   takes the animation out rather than waiting it out — a wait long enough to
   be safe on a loaded CI runner is a guess, and the guess is what broke.
   `auto` is the site's own reduced-motion value, and it changes when the
   scroll finishes, never where it stops. */
async function stopSmoothScrolling(page: Page): Promise<void> {
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
}

/** One frame, so an instant scroll is reflected in the rect we then read. */
async function nextFrame(page: Page): Promise<void> {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => resolve(null))),
  );
}

test.describe("keyboard", () => {
  test("the whole home page is reachable by Tab, crescendo included", async ({
    page,
  }) => {
    await page.goto("/");

    const order: string[] = [];
    /* Tab until focus wraps back to the first stop, so a rail rotation or an
       extra contact link cannot push the footer past a hard-coded budget.
       The cap is only a runaway guard, not the expected length. */
    for (let i = 0; i < 200; i += 1) {
      await page.keyboard.press("Tab");
      if (order.length > 1 && (await isFirstStopFocused(page))) break;
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
      await stopSmoothScrolling(page);
      const headerBottom = await page.evaluate(
        () => document.querySelector(".site-header")!.getBoundingClientRect().bottom,
      );

      /* Stop once focus wraps, so a short page is not walked three times
         over — the repeat stops assert nothing new and drag the run out. */
      for (let i = 0; i < 60; i += 1) {
        await page.keyboard.press("Tab");
        if (i > 0 && (await isFirstStopFocused(page))) break;
        await nextFrame(page);
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
        const panelToken = path === "/" ? "--tile-panel" : "--case-panel";
        const measured = await page.locator(selector).first().evaluate(
          (el, panelToken) => {
            const canvas = document.createElement("canvas");
            canvas.width = canvas.height = 1;
            const context = canvas.getContext("2d")!;
            /* Composite `value` over `ground` and read the pixel back. Paint
               the ground first rather than reading RGB off a transparent
               canvas: several of the site's own colours are translucent
               (--color-mute is 55%), and dropping the alpha channel would
               score them as opaque and overstate their contrast. The label is
               a color-mix() and the stops are custom properties, so neither
               resolves to plain rgb() in every engine either. */
            const resolve = (
              value: string,
              ground: string,
            ): [number, number, number] | null => {
              if (!value.trim()) return null;
              context.clearRect(0, 0, 1, 1);
              context.fillStyle = ground;
              context.fillRect(0, 0, 1, 1);
              context.fillStyle = value;
              context.fillRect(0, 0, 1, 1);
              const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
              return a === 255 ? [r, g, b] : null;
            };

            const root = getComputedStyle(document.documentElement);
            const ink = root.getPropertyValue("--color-ink").trim() || "#000";
            /* The 42% mid-stop is the one that carries the project's own
               palette, so it is the stop a new palette can break. */
            const stops = ["--hw-face-top", "--hw-pad-top", panelToken].map(
              (token) => {
                const declared =
                  token === panelToken
                    ? getComputedStyle(el).getPropertyValue(token)
                    : root.getPropertyValue(token);
                return { token, rgb: resolve(declared, ink) };
              },
            );

            return {
              color: getComputedStyle(el).color,
              stops: stops.map(({ token, rgb }) => ({
                token,
                rgb,
                // The label composites over the stop it is printed on.
                over: rgb
                  ? resolve(getComputedStyle(el).color, `rgb(${rgb.join(",")})`)
                  : null,
              })),
            };
          },
          panelToken,
        );

        for (const { token, rgb, over } of measured.stops) {
          expect(rgb, `${path} ${selector}: ${token} unreadable`).not.toBeNull();
          expect(over, `${path} ${selector}: colour unreadable`).not.toBeNull();
          expect(
            contrast(over!, rgb!),
            `${path} ${selector} (${measured.color}) on ${token}`,
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

    const measured = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const context = canvas.getContext("2d")!;
      /* Clear before every paint and composite over a named ground: without
         the clear, a translucent token would composite over whichever token
         was measured before it, making the result depend on document order. */
      const resolve = (
        value: string,
        ground: string,
      ): [number, number, number] | null => {
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = ground;
        context.fillRect(0, 0, 1, 1);
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
        return a === 255 ? [r, g, b] : null;
      };

      const ink =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-ink")
          .trim() || "#000";

      // Every fenced block on the page, not just the first.
      const out: {
        color: string;
        text: string;
        rgb: [number, number, number] | null;
        panel: [number, number, number] | null;
      }[] = [];
      const figures = document.querySelectorAll<HTMLElement>(
        "[data-rehype-pretty-code-figure]",
      );
      for (const figure of figures) {
        const panel = resolve(getComputedStyle(figure).backgroundColor, ink);
        const seen = new Set<string>();
        for (const span of figure.querySelectorAll<HTMLElement>("code span")) {
          if (!(span.textContent ?? "").trim()) continue;
          const color = getComputedStyle(span).color;
          if (seen.has(color)) continue;
          seen.add(color);
          out.push({
            color,
            text: (span.textContent ?? "").trim().slice(0, 24),
            rgb: panel ? resolve(color, `rgb(${panel.join(",")})`) : null,
            panel,
          });
        }
      }
      return { figures: figures.length, tokens: out };
    });

    expect(measured.figures, "no fenced code on the post").toBeGreaterThan(0);
    expect(measured.tokens.length).toBeGreaterThan(3);
    for (const token of measured.tokens) {
      expect(token.panel, "code panel unreadable").not.toBeNull();
      expect(token.rgb, `code token ${token.color} unreadable`).not.toBeNull();
      expect(
        contrast(token.rgb!, token.panel!),
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
    // A transparent root parses to black, which is within 1.06:1 of the ink —
    // close enough to pass by accident while the page paints nothing.
    expect(painted, "root paints no background").not.toMatch(/^rgba\(.*,\s*0\)$/);
    expect(painted).not.toBe("transparent");
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
