import { test, expect } from "@playwright/test";

// Requires a signed-in Clerk session (see docs/architecture.md and
// openspec/roadmap.md "Pendências manuais" for the Clerk test-token setup
// still pending). Once credentials are configured, sign in before each test
// (e.g. via the Clerk testing helpers) instead of visiting /stores directly.
test.skip(
  "authenticated customer can browse stores and open a menu",
  async ({ page }) => {
    await page.goto("/stores");
    await expect(page.getByRole("heading", { name: "Lojas" })).toBeVisible();

    const firstStore = page.getByRole("link").first();
    await firstStore.click();

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  },
);
