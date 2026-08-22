import { expect, test } from "@playwright/test";

test("home introduces Mitch Mele in the site chrome", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Mitch Mele/i);
  await expect(page.getByRole("heading", { name: "MITCH MELE" })).toBeVisible();
  await expect(page.getByText("Site under construction")).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(8, 9, 11)");
  await expect(page.getByText("Site under construction")).toHaveCSS(
    "color",
    "rgb(198, 255, 0)",
  );
  await expect(
    page.getByText("A new home for things made late, solved carefully, and shipped with intent."),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
});
