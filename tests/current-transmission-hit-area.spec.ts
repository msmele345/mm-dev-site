import { expect, test } from "@playwright/test";
import { liveTransmission } from "./support/transmission-editorial";

const { nowBuilding, nextExperiment, dispatch } = liveTransmission();
test.use({ hasTouch: true });

for (const width of [390, 768, 895, 896, 1440]) {
  test(`signal surfaces activate their destinations at ${width}px`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    if (!nowBuilding.destination.startsWith("/")) {
      await context.route(nowBuilding.destination, (route) => route.fulfill({ body: "Repository destination" }));
    }
    for (const [name, destination] of [[nowBuilding.headline, nowBuilding.destination], [dispatch.title, dispatch.route]]) {
      // Padding, supporting copy, and footer all activate the headline's link.
      for (const surface of ["padding", "copy", "footer"]) {
        await page.goto("/");
        const signal = page.getByRole("article", { name, exact: true });
        await signal.scrollIntoViewIfNeeded();
        const box = (await signal.boundingBox())!;
        const textBox = surface === "padding" ? null : (await signal.locator("p").nth(surface === "copy" ? 1 : 2).boundingBox())!;
        const x = textBox ? textBox.x + 3 : box.x + box.width - 3;
        const y = textBox ? textBox.y + textBox.height / 2 : box.y + 3;
        const popupPromise = destination.startsWith("/") ? null : page.waitForEvent("popup");
        if (width === 390) await page.touchscreen.tap(x, y);
        else await page.mouse.click(x, y);
        if (popupPromise) {
          const popup = await popupPromise;
          await expect(popup).toHaveURL(destination);
          await popup.close();
          await expect(page).toHaveURL("/");
        } else await expect(page).toHaveURL(destination);
      }
    }
    await page.goto("/");
    const concept = page.getByRole("article", { name: nextExperiment.headline });
    await concept.click();
    await expect(page).toHaveURL("/");
    await expect(concept.getByRole("link")).toHaveCount(0);
  });
}
