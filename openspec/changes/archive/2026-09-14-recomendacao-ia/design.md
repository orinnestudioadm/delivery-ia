## Context

O dashboard (`src/app/dashboard/page.tsx`) já lista os pedidos do cliente (`listOrdersForUser` em `src/lib/orders.ts`) e o catálogo de lojas já existe (`listActiveStores` em `src/lib/stores.ts`). Esta mudança combina os dois para gerar uma recomendação simples, sem introduzir um provedor de IA externo.

## Goals / Non-Goals

**Goals:**
- Priorizar lojas/categorias que o cliente já pediu, com fallback determinístico (melhor avaliação) quando não há histórico.
- Manter a lógica de ranking como uma função pura e testável, separada da busca de dados no Prisma.
- Exibir a recomendação no dashboard, ao lado da lista de pedidos já existente.

**Non-Goals:**
- Integração com um modelo de ML ou serviço de IA externo — fica como evolução futura, sem mudar a assinatura pública de `getRecommendedStores`.
- Recomendação de produtos individuais (apenas lojas nesta mudança) — o RF06/UC06 fala de "produtos e lojas", mas o histórico disponível hoje é por pedido/loja; recomendação de produtos específicos fica para uma iteração futura quando houver mais dados de itens pedidos.

## Decisions

- `rankStoresByHistory(stores, history)` é uma função pura em `src/lib/recommendations.ts`: sem histórico, ordena por `rating` desc (mesmo critério padrão de `listActiveStores`); com histórico, pontua cada loja por (peso de categoria já pedida × 10) + (peso de loja já pedida × 5) + `rating`, e ordena por essa pontuação.
- `getRecommendedStores(clerkUserId)` busca as lojas ativas e o histórico de pedidos do cliente (loja + categoria de cada pedido) e aplica `rankStoresByHistory`. Se o `clerkId` não tiver `User` local ainda (nunca fez checkout), o histórico é tratado como vazio — cai no fallback.
- A seção "Recomendado para você" é adicionada ao dashboard existente, reaproveitando o padrão visual já usado para a lista de pedidos.

## Risks / Trade-offs

- Em bases pequenas (poucas lojas/categorias), o ranking por histórico pode não parecer muito diferente do fallback — aceito, já que o objetivo desta mudança é o mecanismo, não a qualidade do modelo.
- Sem sincronização de usuário via webhook, um cliente que nunca fez checkout não tem `User` local — tratado explicitamente como "sem histórico" em vez de erro.
