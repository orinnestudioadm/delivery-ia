import { test, expect } from "@playwright/test";

test("home page shows the DeliveryIA heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "DeliveryIA" })).toBeVisible();
});
