import { clerk } from "@clerk/testing/playwright";
import { expect, test } from "@playwright/test";
import { hasClerkKeys, hasTestUser, signInAsTestUser } from "./support/auth";

// Suite derived from specs/login-flow-test-plan.md.
// Skips (never fails) while the Clerk credentials are not configured; it
// activates by itself once .env has the Clerk keys and the E2E user.

test.describe("Fluxo de login com Clerk", () => {
  test.describe("visitante", () => {
    test.skip(!hasClerkKeys(), "Clerk keys not configured");

    test("1. é redirecionado ao login ao acessar rota protegida", async ({ page }) => {
      await page.goto("/dashboard");

      await expect(page).toHaveURL(/sign-in/);
      await expect(page).not.toHaveURL(/\/dashboard(\?|$)/);
    });

    test("2. página de login exibe o formulário do Clerk", async ({ page }) => {
      await page.goto("/sign-in");

      await expect(page.getByRole("textbox").first()).toBeVisible();
      await expect(page.getByRole("button", { name: /continu/i })).toBeVisible();
    });

    test("3. header mostra Entrar e esconde Dashboard", async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Dashboard" })).toHaveCount(0);
    });
  });

  test.describe("usuário autenticado", () => {
    test.skip(!hasTestUser(), "E2E Clerk test user not configured");

    test.beforeEach(async ({ page }) => {
      await signInAsTestUser(page);
    });

    test("4. login com credenciais válidas leva ao dashboard", async ({ page }) => {
      await page.goto("/dashboard");

      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
      await expect(page.getByText(/Olá,/)).toBeVisible();
    });

    test("5. header reflete a sessão autenticada", async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Entrar" })).toHaveCount(0);
    });

    test("6. acessa outra rota protegida (/stores)", async ({ page }) => {
      await page.goto("/stores");

      await expect(page).toHaveURL(/\/stores/);
      await expect(page.getByRole("heading", { name: "Lojas" })).toBeVisible();
    });

    test("7. logout devolve o usuário ao estado de visitante", async ({ page }) => {
      await page.goto("/");
      await clerk.signOut({ page });

      await page.goto("/dashboard");
      await expect(page).toHaveURL(/sign-in/);

      await page.goto("/");
      await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
    });
  });
});
