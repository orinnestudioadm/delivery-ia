## Why

O cliente autenticado hoje só vê um dashboard vazio (`src/app/dashboard/page.tsx`). Não existe nenhuma forma de descobrir lojas parceiras ou seus produtos, o que é a base de qualquer fluxo de pedido (RF01 em `docs/prd.md`, UC01/UC02 em `docs/spec.md`).

## What Changes

- Introduz os modelos `Store` e `Product` no Prisma, relacionados a `User` (dono da loja).
- Adiciona listagem de lojas ativas (`/stores`) e página de cardápio por loja (`/stores/[id]`).
- Adiciona camada de dados (`src/lib/stores.ts`) para consulta via Prisma, com validação de entrada via Zod.

## Capabilities

### New Capabilities
- `catalogo-lojas`: listagem e busca de lojas parceiras ativas.
- `catalogo-produtos`: exibição do cardápio (produtos) de uma loja específica.

## Impact

- **Afetados**: `prisma/schema.prisma` (novos modelos), `src/app/stores/**` (novo), `src/lib/stores.ts` (novo).
- **Dependências**: autenticação Clerk já implementada (`src/app/dashboard/page.tsx` como referência de Server Component protegido); `src/lib/prisma.ts` existente.
- **Riscco**: médio-baixo — schema novo sem migração de dados existentes; superfície de UI nova e isolada, sem alterar fluxos já existentes.

## Escopo Funcional

- Listagem de lojas ativas com nome, categoria e avaliação (RF01).
- Página de cardápio de uma loja com nome, preço e descrição dos produtos (RF01, UC02).
- Nenhuma escrita de dados nesta mudança (somente leitura) — carrinho/checkout ficam para a próxima mudança (`carrinho-checkout`).

## Dependências

- Requer `DATABASE_URL`/`DIRECT_URL` configurados (Supabase) e `npx prisma db push` executado para que os novos modelos existam no banco.
- Reaproveita o padrão de Server Component protegido por `auth.protect()` já usado no dashboard.

## Riscos

- Baixo: mudança aditiva ao schema (novos modelos, sem alterar `User`).
- Médio: ausência de dados de seed pode deixar a listagem vazia em ambientes novos — mitigado com um script de seed opcional.

## Execução de Linter Necessária

- `npm run lint` sobre os novos arquivos em `src/app/stores/**` e `src/lib/stores.ts`.

## Testes Unitários Necessários

- Funções de `src/lib/stores.ts` (parsing/validação Zod e formatação de preço), ao lado de `tests/unit/format.test.ts`.

## Testes de Integração Necessários

- Consulta de listagem de lojas e de cardápio via Prisma (camada de dados), cobrindo o caso de loja inexistente/inativa.

## Testes E2E Necessários

- Playwright: cliente autenticado acessa `/stores`, abre uma loja e visualiza o cardápio (UC01, UC02), ao lado de `tests/e2e/home.spec.ts`.
