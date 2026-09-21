import { test, expect } from "@playwright/test";
import { hasClerkKeys } from "./support/auth";

test.skip(!hasClerkKeys(), "Clerk keys not configured — the app cannot boot");

test("home page shows the DeliveryIA heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "DeliveryIA" })).toBeVisible();
});
