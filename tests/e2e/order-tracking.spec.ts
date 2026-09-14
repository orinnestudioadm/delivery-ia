import { test, expect } from "@playwright/test";

// Requires a signed-in Clerk session, same limitation as tests/e2e/stores.spec.ts
// (see openspec/roadmap.md "Pendências manuais").
test.skip(
  "authenticated customer accesses their order tracking page and views status",
  async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    // Navigate to recent order
    const orderLink = page.getByRole("link", { name: /Acompanhar/ }).first();
    await expect(orderLink).toBeVisible();
    await orderLink.click();

    // Verify order tracking page content
    await expect(
      page.getByRole("heading", { name: "Acompanhamento do Pedido" }),
    ).toBeVisible();
    await expect(page.getByText(/Status do Pedido/i)).toBeVisible();
    await expect(page.getByText(/Itens do Pedido/i)).toBeVisible();
  },
);
