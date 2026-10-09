import { expect, type Locator, type Page, type TestInfo } from "@playwright/test";

// Includes the 56rem boundary, a small phone, tablet, and baseline desktop sizes.
const viewports = [
  { width: 320, height: 740 }, { width: 390, height: 844 },
  { width: 768, height: 1024 }, { width: 895, height: 900 },
  { width: 896, height: 900 }, { width: 1024, height: 900 },
  { width: 1440, height: 900 },
];

/** Measure the rendered reading surface, without inspecting component state. */
export async function checkTransmissionLayout(page: Page, info: TestInfo, state: string) {
  const ledger = page.getByRole("region", { name: "Current Transmission" });
  const measurements = [];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => document.fonts.ready);
    // Finish media-query layout (including the site's near-zero motion reset).
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    const signals = ledger.getByRole("article");
    await expect(signals).toHaveCount(3);
    const boxes = await signals.evaluateAll((articles) => articles.map((article) => {
      const box = article.getBoundingClientRect();
      const style = getComputedStyle(article);
      return {
        x: box.x, y: box.y, width: box.width, height: box.height,
        label: article.querySelector("p")!.textContent,
        topDivider: style.borderTopWidth, leftDivider: style.borderLeftWidth,
        topStyle: style.borderTopStyle, leftStyle: style.borderLeftStyle,
      };
    }));
    expect(boxes.map((box) => box.label)).toEqual(["Now Building", "Latest Dispatch", "Next Experiment"]);
    const wide = viewport.width >= 896;
    for (let index = 1; index < boxes.length; index++) {
      expect(Math.abs(boxes[index].width - boxes[0].width)).toBeLessThanOrEqual(1);
      if (wide) {
        expect(Math.abs(boxes[index].y - boxes[0].y)).toBeLessThanOrEqual(1);
        expect(boxes[index].x).toBeGreaterThanOrEqual(boxes[index - 1].x + boxes[index - 1].width - 1);
        expect(boxes[index].leftDivider, JSON.stringify({ viewport, boxes })).toBe("1px");
        expect(boxes[index].leftStyle).toBe("solid");
        expect(boxes[index].topDivider).toBe("0px");
      } else {
        expect(Math.abs(boxes[index].x - boxes[0].x)).toBeLessThanOrEqual(1);
        expect(boxes[index].y).toBeGreaterThanOrEqual(boxes[index - 1].y + boxes[index - 1].height - 1);
        expect(boxes[index].topDivider).toBe("1px");
        expect(boxes[index].topStyle).toBe("solid");
        expect(boxes[index].leftDivider).toBe("0px");
      }
    }
    const spacing = await signals.evaluateAll((articles) => articles.map((article) => {
      const label = article.querySelector("p")!.getBoundingClientRect();
      const heading = article.querySelector("h3")!;
      const range = document.createRange();
      range.selectNodeContents(heading);
      const text = range.getBoundingClientRect();
      const box = heading.getBoundingClientRect();
      const copy = article.querySelectorAll("p")[1].getBoundingClientRect();
      return { textTop: text.top, copyTop: copy.top, labelGap: text.top - label.bottom,
        copyGap: copy.top - box.bottom, singleLine: box.height < 40 };
    }));
    for (const item of spacing) {
      expect(Math.abs(item.labelGap - spacing[2].labelGap)).toBeLessThanOrEqual(1);
      expect(Math.abs(item.copyGap - spacing[2].copyGap)).toBeLessThanOrEqual(1);
      if (wide && item.singleLine && spacing[2].singleLine) {
        expect(Math.abs(item.textTop - spacing[2].textTop)).toBeLessThanOrEqual(1);
        expect(Math.abs(item.copyTop - spacing[2].copyTop)).toBeLessThanOrEqual(1);
      }
    }
    const ledgerBox = (await ledger.boundingBox())!;
    expect(boxes[0].x).toBeGreaterThan(ledgerBox.x);
    expect(boxes[2].x + boxes[2].width).toBeLessThan(ledgerBox.x + ledgerBox.width);
    if (!wide) expect(boxes[0].width).toBeGreaterThanOrEqual(ledgerBox.width - 2 * (boxes[0].x - ledgerBox.x) - 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    expect(await ledger.evaluate((section) => section.scrollWidth <= section.clientWidth)).toBe(true);
    for (const signal of await signals.all()) {
      const heading = signal.getByRole("heading", { level: 3 });
      expect(await heading.evaluate((element) => element.scrollHeight <= element.clientHeight + 1)).toBe(true);
      const copy = signal.locator("p").nth(1);
      const text = await copy.evaluate((element) => {
        const style = getComputedStyle(element);
        return { height: element.getBoundingClientRect().height, lineHeight: parseFloat(style.lineHeight), fontSize: parseFloat(style.fontSize) };
      });
      expect(text.height).toBeLessThanOrEqual(text.lineHeight * 2 + 1);
      expect(text.fontSize).toBeGreaterThanOrEqual(14);
      await expectSignalHitArea(signal);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    measurements.push({ viewport, layout: wide ? "columns" : "rows", signals: boxes, spacing });
    if ([390, 768, 895, 896, 1440].includes(viewport.width)) {
      await page.screenshot({ path: info.outputPath(`${state}-ledger-${viewport.width}.png`), fullPage: true, clip: ledgerBox });
      if ([390, 768, 1440].includes(viewport.width)) {
        await page.screenshot({ path: info.outputPath(`${state}-home-${viewport.width}.png`), fullPage: true });
      }
    }
  }
  await info.attach(`${state}-geometry`, { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
  return measurements;
}

export async function expectVisibleLinkFocus(page: Page, link: Locator) {
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("outline-color", "rgb(198, 255, 0)");
  await expect(link).toHaveCSS("outline-style", "solid");
  await expect(link).toHaveCSS("outline-width", "2px");
  // A usable rectangle can be observed mid-scroll. Wait for a stable viewport
  // before the next Tab can interrupt it and leave the focus target off-screen.
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    let previousY = window.scrollY;
    let stableFrames = 0;
    let frame: number;
    const timeout = window.setTimeout(() => {
      cancelAnimationFrame(frame);
      reject(new Error(`Viewport scroll did not settle at scrollY=${window.scrollY}`));
    }, 5_000);
    const check = () => {
      const currentY = window.scrollY;
      stableFrames = currentY === previousY ? stableFrames + 1 : 0;
      previousY = currentY;
      if (stableFrames >= 3) {
        clearTimeout(timeout);
        resolve();
      } else frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
  }));
  await expect.poll(async () => {
    const target = (await link.boundingBox())!;
    const header = (await page.getByRole("navigation", { name: "Primary" }).boundingBox())!;
    return target.y - header.y - header.height;
  }).toBeGreaterThanOrEqual(5);
  await expect(link).toBeInViewport();
}

export async function expectStaticTransmission(ledger: Locator) {
  // Pseudo-elements can carry a blinking/pulsing status even if the text is static.
  const moving = await ledger.evaluate((section) => [section, ...section.querySelectorAll("*")].flatMap((element) =>
    [null, "::before", "::after"].filter((pseudo) => {
      const style = getComputedStyle(element, pseudo);
      return style.animationName !== "none";
    }),
  ).length);
  expect(moving).toBe(0);
  expect(await ledger.evaluate((section) => section.getAnimations({ subtree: true }).filter((animation) => animation.playState === "running").length)).toBe(0);
}

/** Hit-test the surface, including padding and copy, rather than the text box. */
export async function expectSignalHitArea(signal: Locator) {
  // Center the surface away from sticky navigation and the development toolbar.
  await signal.evaluate((article) => article.scrollIntoView({ block: "center", behavior: "instant" }));
  const result = await signal.evaluate((article) => {
    const box = article.getBoundingClientRect();
    const link = article.querySelector("a");
    const hits = [];
    for (const x of [box.left + 2, box.left + box.width / 2, box.right - 2]) {
      for (const y of [box.top + 2, box.top + box.height / 2, box.bottom - 2]) {
        const hit = document.elementFromPoint(x, y);
        hits.push({ matches: hit?.closest("a") === link, x, y, hit: hit?.outerHTML.slice(0, 160) });
      }
    }
    const style = getComputedStyle(article);
    const divider = parseFloat(style.borderLeftWidth) ? [Math.floor(box.left), box.top + box.height / 2]
      : parseFloat(style.borderTopWidth) ? [box.left + box.width / 2, Math.floor(box.top)] : null;
    return { width: box.width, height: box.height, hits,
      dividerHasLink: divider ? !!document.elementFromPoint(...divider as [number, number])?.closest("a") : false };
  });
  expect(result.width).toBeGreaterThanOrEqual(44);
  expect(result.height).toBeGreaterThanOrEqual(44);
  expect(result.hits.every((hit) => hit.matches), JSON.stringify(result)).toBe(true);
  expect(result.dividerHasLink).toBe(false);
}
