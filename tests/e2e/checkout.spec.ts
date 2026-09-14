import { test, expect } from "@playwright/test";

// Requires a signed-in Clerk session, same limitation as tests/e2e/stores.spec.ts
// (see openspec/roadmap.md "Pendências manuais").
test.skip(
  "authenticated customer adds products to the cart and completes checkout",
  async ({ page }) => {
    await page.goto("/stores");
    await page.getByRole("link").first().click();

    await page.getByRole("button", { name: /Aumentar quantidade/ }).first().click();
    await page.getByRole("button", { name: "Finalizar pedido" }).click();

    await expect(page.getByText(/Pedido confirmado!/)).toBeVisible();
  },
);
