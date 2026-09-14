## Context

Depois de `catalogo-lojas-produtos`, o cliente já navega pelo cardápio (`src/app/stores/[id]/page.tsx`, `src/lib/stores.ts`). Ainda não existe nenhum registro de `User` local criado a partir do Clerk fora do schema — não há webhook de sincronização. Esta é a primeira operação de escrita do domínio de negócio.

## Goals / Non-Goals

**Goals:**
- Garantir que o preço cobrado no pedido venha sempre do servidor, nunca do valor enviado pelo client.
- Criar o `User` local sob demanda (upsert por `clerkId`) no momento do checkout, já que ainda não existe sincronização via webhook do Clerk.
- Manter o carrinho como estado client-side efêmero (sem persistência entre sessões).

**Non-Goals:**
- Página de acompanhamento de status do pedido (fica para `acompanhamento-pedido`).
- Sincronização de usuários via webhook do Clerk — o upsert on-demand no checkout é suficiente por ora.
- Cupons, frete ou múltiplas formas de pagamento.

## Decisions

- `Order`/`OrderItem` armazenam `unitPriceInCents` como snapshot do preço no momento da compra, preservando o histórico mesmo que o preço do produto mude depois.
- A validação de "todos os itens pertencem à loja informada" acontece na camada de dados (`src/lib/orders.ts`), não apenas na UI — o client não é uma fonte confiável.
- O upsert de `User` por `clerkId` fica em `src/lib/users.ts`, reaproveitável por futuras mudanças (ex.: `painel-lojista`).
- O carrinho é um Client Component (`src/app/stores/[id]/cart.tsx`) que recebe os produtos já carregados pelo Server Component da página; a Server Action de checkout recebe apenas `productId` + `quantity` (nunca preço) e recalcula tudo no servidor.

## Risks / Trade-offs

- Sem webhook do Clerk, o upsert de usuário só acontece na primeira ação de escrita (checkout) — aceitável agora, mas deve ser revisitado se outra mudança precisar do `User` local antes do primeiro pedido.
- Carrinho sem persistência: atualizar a página perde o carrinho — trade-off aceito para manter esta mudança de risco baixo/médio.
