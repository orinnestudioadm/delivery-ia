## Context

O projeto tem hoje apenas o modelo `User` no Prisma (espelhando o usuário do Clerk) e uma rota protegida de exemplo (`src/app/dashboard/page.tsx`) usando `auth.protect()` em um Server Component. Não há camada de dados além de `src/lib/prisma.ts`. Esta mudança introduz o primeiro domínio de negócio real (lojas e produtos).

## Goals / Non-Goals

**Goals:**
- Modelar `Store` e `Product` de forma simples e extensível para as próximas mudanças (carrinho, pedidos, RBAC do lojista).
- Reaproveitar o padrão já existente de Server Component protegido por Clerk.
- Manter a mudança somente-leitura (sem UI de escrita) para reduzir risco.

**Non-Goals:**
- Carrinho, checkout e pedidos (ficam para `carrinho-checkout`).
- Papéis de usuário / RBAC de lojista (fica para `painel-lojista`).
- Seed de dados de produção — apenas um script opcional de seed para desenvolvimento local.

## Decisions

- `Store` tem um campo `ownerId` (referência a `User.id`) desde já, mesmo sem UI de gestão nesta mudança, para evitar uma migração de schema disruptiva quando `painel-lojista` for implementado.
- `Product` referencia `Store` com `onDelete: Cascade` — produtos não fazem sentido sem a loja.
- Preço é armazenado como `Int` em centavos (evita problemas de ponto flutuante), formatado na camada de apresentação com uma função utilitária em `src/lib/format.ts` (já existe utilitário de formatação nesse arquivo).
- Consulta de dados centralizada em `src/lib/stores.ts` (funções `listActiveStores` e `getStoreWithProducts`), validando o formato do `id` de rota com Zod antes de consultar o Prisma.

## Risks / Trade-offs

- Sem dados reais em ambientes novos, a listagem fica vazia — mitigado com um script de seed (`prisma/seed.ts`) opcional para desenvolvimento.
- Modelar `ownerId` antes de existir o papel de lojista é uma antecipação de schema; o trade-off é aceito para evitar duas migrações separadas no mesmo campo.
