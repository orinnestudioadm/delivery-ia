import { clerk } from "@clerk/testing/playwright";
import { expect, test } from "@playwright/test";
import { hasClerkKeys, signInAs } from "./support/auth";

// Suite derived from specs/painel-lojista-test-plan.md (scenarios 1-6, 8-9).
// Needs two Clerk users (a customer and a STORE_OWNER with a Store row, with
// at least one active product in it — see openspec/roadmap.md "Configurar o
// primeiro lojista"); it skips — never fails — until both are configured.
// Scenario 7 (cross-store isolation) is covered by
// tests/integration/store-admin.test.ts.

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
      // Three sequential round-trips through the real REST API + Supabase;
      // the default 30s budget is too tight under Next dev mode.
      test.setTimeout(60000);
      await page.goto("/store-admin");

      const newForm = page.locator("section", { has: page.getByRole("heading", { name: "Novo produto" }) });
      await newForm.getByLabel("Nome").fill(productName);
      await newForm.getByLabel("Descrição").fill("Criado pelo teste E2E");
      await newForm.getByLabel("Preço (R$)").fill("24,90");
      await newForm.getByRole("button", { name: "Adicionar produto" }).click();
      // Generous timeout: this round-trips through the real REST API and the
      // Supabase database, which runs noticeably slower than the mocked
      // integration tests under Next.js dev mode.
      await expect(newForm.getByText("Produto criado.")).toBeVisible({ timeout: 15000 });

      const item = page.getByRole("listitem").filter({ has: page.locator(`input[value="${productName}"]`) });
      await expect(item.getByText("Preço atual: R$ 24,90")).toBeVisible();

      await item.getByLabel("Preço (R$)").fill("29,90");
      await item.getByRole("button", { name: "Salvar alterações" }).click();
      await expect(item.getByText("Produto atualizado.")).toBeVisible({ timeout: 15000 });

      await item.getByRole("button", { name: `Remover ${productName}` }).click();
      await expect(page.locator(`input[value="${productName}"]`)).toHaveCount(0, { timeout: 15000 });
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

  // Outside the "lojista" describe (and its beforeEach that signs in as the
  // owner) because this scenario needs to switch sessions twice — a Clerk
  // dev-instance session switch right after another one throws "already
  // signed in", so it must start from the owner's beforeEach-less, truly
  // signed-out state.
  test("8. vê um pedido recebido e 9. avança o status", async ({ page }) => {
    // Seeds its own open order via the real checkout flow instead of
    // depending on external seed data: this suite runs against a real,
    // persistent Supabase database (not a fresh one per run), so a
    // pre-made order's status only survives the first run that advances
    // it past "Pedido Recebido".
    test.setTimeout(60000);
    await signInAs(page, customer.username!, customer.password!);
    await page.goto("/stores");
    await page.getByRole("link", { name: /Loja de Teste E2E/ }).click();
    await page.getByRole("button", { name: /Aumentar quantidade/ }).first().click();
    await page.getByRole("button", { name: "Finalizar pedido" }).click();
    await expect(page.getByText(/Pedido confirmado!/)).toBeVisible({ timeout: 15000 });
    // The panel only shows the id's last 6 characters (page.tsx: "#" + id.slice(-6)) —
    // captured now so the order can be located by a status-independent key,
    // since re-filtering by "Pedido Recebido" after it advances would match
    // a different (stale, leftover-from-another-run) order instead.
    const orderId = await page.locator("span.font-mono").textContent();
    const orderIdSuffix = `#${orderId!.slice(-6)}`;

    await page.goto("/");
    await clerk.signOut({ page });
    await page.waitForFunction(() => window.Clerk?.user == null);
    await signInAs(page, owner.username!, owner.password!);
    await page.goto("/store-admin");

    const ordersSection = page.locator("section", { has: page.getByRole("heading", { name: "Pedidos recebidos" }) });
    const order = ordersSection.getByRole("listitem").filter({ hasText: orderIdSuffix });
    await expect(order).toBeVisible({ timeout: 15000 });
    await expect(order.getByText("Pedido Recebido")).toBeVisible();

    // Asserts on the persisted status badge, not the "Status atualizado..."
    // toast: router.refresh() remounts OrderStatusForm as soon as it
    // resolves, which usually wipes the toast's local state before
    // Playwright's poll catches a visible frame — the badge text is the
    // stable, actually-meaningful outcome.
    await order.getByRole("button", { name: 'Avançar para "Em Preparo"' }).click();
    await expect(order.getByText("Em Preparo")).toBeVisible({ timeout: 15000 });

    await order.getByRole("button", { name: "Cancelar pedido" }).click();
    await expect(order.getByRole("button")).toHaveCount(0, { timeout: 15000 });
  });
});
