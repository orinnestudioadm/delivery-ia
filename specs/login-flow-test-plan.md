# Plano de testes — Fluxo de login com Clerk

Formato do agente `playwright-test-planner` (`.claude/agents/playwright-test-planner.md`).
Especificação de origem: `openspec/specs/estrutura-inicial/spec.md` (requisito "Autenticação de usuários via Clerk").
Arquivo de casos de teste correspondente: `tests/e2e/login-flow.spec.ts`.

> Nota de processo: o agente planner explora o app rodando no navegador, o que exige chaves Clerk válidas
> (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY`). Como elas ainda não estão configuradas neste
> ambiente, este plano foi escrito a partir da especificação e do código (`src/app/layout.tsx`,
> `src/app/sign-in/`, `src/app/dashboard/page.tsx`), no mesmo formato que o agente produz. Reexecute o planner
> após configurar as credenciais para validar os passos contra a interface real.

## Visão geral da aplicação

DeliveryIA é um marketplace de delivery (Next.js App Router + Clerk). O header mostra o botão **Entrar** para
visitantes e o link **Dashboard** + `UserButton` para usuários autenticados. `/dashboard`, `/stores`,
`/stores/[id]` e `/orders/[id]` são protegidos por `auth.protect()`.

## Pré-condições e dados de teste

- Estado inicial sempre "visitante" (sem sessão).
- Cenários 4–7 exigem um usuário de teste na instância de desenvolvimento do Clerk, informado por
  `E2E_CLERK_USER_USERNAME` e `E2E_CLERK_USER_PASSWORD` (login por senha, sem MFA).
- Cenários sem usuário de teste ainda exigem as chaves Clerk para o servidor Next.js subir.

## Cenários

### 1. Visitante é redirecionado ao login ao acessar rota protegida
**Passos:**
1. Sem sessão, abrir `/dashboard`.

**Resultado esperado:**
- O navegador não permanece em `/dashboard`.
- A URL final é a página de login do Clerk (contém `/sign-in`).

### 2. Página de login exibe o formulário do Clerk
**Passos:**
1. Abrir `/sign-in`.

**Resultado esperado:**
- O campo de identificador (e-mail/usuário) do Clerk é exibido.
- O botão "Continue"/"Continuar" do Clerk é exibido.

### 3. Header mostra "Entrar" para visitante
**Passos:**
1. Abrir `/`.

**Resultado esperado:**
- O botão "Entrar" está visível no header.
- O link "Dashboard" não está visível.

### 4. Login com credenciais válidas
**Passos:**
1. Abrir `/` e autenticar o usuário de teste via `clerk.signIn` (estratégia `password`).
2. Abrir `/dashboard`.

**Resultado esperado:**
- A URL permanece em `/dashboard`.
- O heading "Dashboard" está visível e a saudação "Olá, …" aparece.

### 5. Header reflete a sessão autenticada
**Passos:**
1. Autenticar o usuário de teste.
2. Abrir `/`.

**Resultado esperado:**
- O link "Dashboard" está visível no header.
- O botão "Entrar" não está visível.

### 6. Usuário autenticado acessa outra rota protegida
**Passos:**
1. Autenticar o usuário de teste.
2. Abrir `/stores`.

**Resultado esperado:**
- A URL permanece em `/stores`.
- O heading "Lojas" está visível.

### 7. Logout devolve o usuário ao estado de visitante
**Passos:**
1. Autenticar o usuário de teste e abrir `/`.
2. Executar `clerk.signOut`.
3. Abrir `/dashboard`.

**Resultado esperado:**
- O usuário é redirecionado ao login (contém `/sign-in`).
- Ao voltar para `/`, o botão "Entrar" volta a ser exibido.

## Fora de escopo deste plano

- Cadastro de novos usuários (`/sign-up`), recuperação de senha e MFA (fluxos gerenciados pelo Clerk).
- Regras de autorização por papel (RBAC), que chegam com a mudança `painel-lojista`.
