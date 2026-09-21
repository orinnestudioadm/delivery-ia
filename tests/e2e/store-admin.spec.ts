import { expect, test } from "@playwright/test";
import { hasClerkKeys, signInAs } from "./support/auth";

// Suite derived from specs/painel-lojista-test-plan.md (scenarios 1-6).
// Needs two Clerk users (a customer and a STORE_OWNER with a Store row); it
// skips — never fails — until both are configured. Scenario 7 (cross-store
// isolation) is covered by tests/integration/store-admin.test.ts.

const owner = {
  username: process.env.E2E_CLERK_OWNER_USERNAME,
  password: process.env.E2E_CLERK_OWNER_PASSWORD,
};
const customer = {
  username: process.env.E2E_CLERK_USER_USERNAME,
  password: process.env.E2E_CLERK_USER_PASSWORD,
};

const productName = `Produto E2E ${Date.now()}`;

test.describe("Painel do lojista", () => {
  test.skip(
    !hasClerkKeys() || !owner.username || !owner.password || !customer.username || !customer.password,
    "Clerk keys and the customer + store-owner E2E users are not configured",
  );

  test("1. cliente não acessa o painel", async ({ page }) => {
    await signInAs(page, customer.username!, customer.password!);

    await page.goto("/dashboard");
    await expect(page.getByRole("link", { name: "Painel do lojista" })).toHaveCount(0);

    await page.goto("/store-admin");
    await expect(page.getByRole("heading", { name: "Acesso restrito" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Adicionar produto" })).toHaveCount(0);
  });

  test.describe("lojista", () => {
    test.beforeEach(async ({ page }) => {
      await signInAs(page, owner.username!, owner.password!);
    });

    test("2. vê o painel da própria loja", async ({ page }) => {
      await page.goto("/dashboard");
      await page.getByRole("link", { name: "Painel do lojista" }).click();

      await expect(page).toHaveURL(/\/store-admin/);
      await expect(page.getByRole("heading", { name: "Painel do lojista" })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Novo produto" })).toBeVisible();
    });

    test("3. cria, 5. edita e 6. remove um produto", async ({ page }) => {
      await page.goto("/store-admin");

      const newForm = page.locator("section", { has: page.getByRole("heading", { name: "Novo produto" }) });
      await newForm.getByLabel("Nome").fill(productName);
      await newForm.getByLabel("Descrição").fill("Criado pelo teste E2E");
      await newForm.getByLabel("Preço (R$)").fill("24,90");
      await newForm.getByRole("button", { name: "Adicionar produto" }).click();
      await expect(newForm.getByText("Produto criado.")).toBeVisible();

      const item = page.getByRole("listitem").filter({ has: page.locator(`input[value="${productName}"]`) });
      await expect(item.getByText("Preço atual: R$ 24,90")).toBeVisible();

      await item.getByLabel("Preço (R$)").fill("29,90");
      await item.getByRole("button", { name: "Salvar alterações" }).click();
      await expect(item.getByText("Produto atualizado.")).toBeVisible();

      await item.getByRole("button", { name: `Remover ${productName}` }).click();
      await expect(page.locator(`input[value="${productName}"]`)).toHaveCount(0);
    });

    test("4. rejeita produto com preço inválido", async ({ page }) => {
      await page.goto("/store-admin");

      const newForm = page.locator("section", { has: page.getByRole("heading", { name: "Novo produto" }) });
      await newForm.getByLabel("Nome").fill(`${productName} inválido`);
      await newForm.getByLabel("Preço (R$)").fill("0");
      await newForm.getByRole("button", { name: "Adicionar produto" }).click();

      await expect(newForm.getByRole("alert")).toContainText("preço válido");
    });
  });
});
