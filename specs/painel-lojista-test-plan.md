# Plano de testes — Painel do lojista

Formato do agente `playwright-test-planner` (`.claude/agents/playwright-test-planner.md`).
Especificação de origem: `openspec/specs/painel-lojista/spec.md` (após o arquivamento; antes disso, `openspec/changes/painel-lojista/specs/`).
Suíte correspondente: `tests/e2e/store-admin.spec.ts`.

> Nota de processo: como no plano de login, este plano foi escrito a partir da spec e do código
> (`src/app/store-admin/`), porque o agente planner precisa do app rodando com chaves Clerk válidas.

## Pré-condições e dados de teste

- Dois usuários na instância de desenvolvimento do Clerk, ambos com login por senha e sem MFA:
  - **Lojista:** `publicMetadata` = `{ "role": "STORE_OWNER" }`, com uma linha em `Store` cujo `ownerId` é o `User` local desse usuário (o `User` local é criado no primeiro acesso ao painel).
  - **Cliente:** sem `publicMetadata.role`.
- Credenciais informadas por `E2E_CLERK_OWNER_USERNAME`/`E2E_CLERK_OWNER_PASSWORD` e `E2E_CLERK_USER_USERNAME`/`E2E_CLERK_USER_PASSWORD`.
- Loja do lojista sem produtos ativos no início de cada execução (ou com nomes de produto únicos por execução).

## Cenários

### 1. Cliente não acessa o painel
**Passos:** autenticar o cliente e abrir `/store-admin`.
**Esperado:** heading "Acesso restrito"; nenhum formulário de produto; o dashboard do cliente não mostra o link "Painel do lojista".

### 2. Lojista vê o painel da própria loja
**Passos:** autenticar o lojista e abrir `/dashboard`, clicar em "Painel do lojista".
**Esperado:** URL `/store-admin`; heading "Painel do lojista" com o nome da loja; formulário "Novo produto".

### 3. Criar produto válido
**Passos:** preencher Nome, Descrição e Preço (`24,90`) e enviar "Adicionar produto".
**Esperado:** mensagem "Produto criado."; o produto aparece na lista do cardápio com "Preço atual: R$ 24,90" e no cardápio público `/stores/[id]`.

### 4. Criar produto inválido
**Passos:** enviar com o preço `0` (e, em outro envio, com nome vazio).
**Esperado:** mensagem de erro de validação; nenhum produto novo na lista.

### 5. Editar produto
**Passos:** alterar o preço de um produto existente para `29,90` e enviar "Salvar alterações".
**Esperado:** mensagem "Produto atualizado."; "Preço atual: R$ 29,90".

### 6. Remover produto
**Passos:** clicar em "Remover" em um produto.
**Esperado:** mensagem "Produto removido."; o produto some do painel e do cardápio público.

### 7. Isolamento entre lojas
**Passos:** com o lojista autenticado, enviar uma edição para o `id` de um produto de outra loja (Server Action forjada).
**Esperado:** erro de autorização; o produto da outra loja permanece inalterado. (Coberto em profundidade pelo teste de integração `tests/integration/store-admin.test.ts`; no E2E fica como verificação manual assistida.)

## Fora de escopo

- Visualização de pedidos recebidos pelo lojista, criação de lojas e atribuição do papel pela aplicação.
