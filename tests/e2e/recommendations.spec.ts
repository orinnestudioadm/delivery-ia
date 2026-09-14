import { test, expect } from "@playwright/test";

// Requires a signed-in Clerk session, same limitation as the other E2E specs
// in this suite (see openspec/roadmap.md "Pendências manuais").
test.skip(
  "authenticated customer sees a recommended stores section on the dashboard",
  async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByRole("heading", { name: "Recomendado para você" })).toBeVisible();
  },
);
