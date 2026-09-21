import { test, expect } from "@playwright/test";
import { hasClerkKeys } from "./support/auth";

// Seed file used by the Playwright agents (planner/generator/healer) to
// bootstrap the page before exploring or generating tests.
test.skip(!hasClerkKeys(), "Clerk keys not configured — the app cannot boot");

test.describe("Seed", () => {
  test("seed", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/DeliveryIA/);
  });
});
