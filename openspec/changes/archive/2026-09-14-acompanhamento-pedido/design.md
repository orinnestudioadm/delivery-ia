## Context

Com `catalogo-lojas-produtos` e `carrinho-checkout` implementados e arquivados, o fluxo de pedidos já cria instâncias de `Order` com itens e cálculo de preços garantido no servidor. Falta ao cliente a capacidade de rastrear a evolução do status do seu pedido (`docs/prd.md` RF05 e `docs/spec.md` UC05).

## Goals / Non-Goals

**Goals:**
- Permitir que o cliente acompanhe em tempo real ou sob demanda o status do seu pedido (`RECEIVED`, `PREPARING`, `ON_THE_WAY`, `DELIVERED`, `CANCELED`).
- Garantir segurança de acesso: apenas o usuário dono do pedido pode visualizar os detalhes e o status (retorno 403 Forbidden para acessos de terceiros).
- Implementar uma máquina de estados pura para gerenciar as transições de status válidas do pedido.
- Exibir interface visual clara com indicador de etapas / timeline do pedido.

**Non-Goals:**
- Painel visual completo do lojista (escopo da mudança `painel-lojista`).
- Notificações push ou WebSockets de mensageria externa (SSE / Webhooks ficam para iterações futuras).

## Decisions

- **Enum de Status no Prisma**: `OrderStatus` com os valores `RECEIVED`, `PREPARING`, `ON_THE_WAY`, `DELIVERED`, `CANCELED`.
- **Máquina de Estados Pura**: `src/lib/order-status.ts` contendo `canTransitionOrderStatus`, labels amigáveis e índices das etapas para renderização de timeline.
- **Camada de Serviço Segura**: `src/lib/orders.ts` expõe `getOrderForUser` (validação de propriedade do pedido contra o usuário Clerk) e `updateOrderStatus` (validação de transição de estado).
- **UI Next.js App Router**: Página `src/app/orders/[id]/page.tsx` protegida por autenticação Clerk (`auth.protect()`), com renderização de stepper visual, lista de itens, valores totais e dados da loja.

## Risks / Trade-offs

- **Risco de Acesso Indevido**: Mitigado pela checagem estrita de propriedade do pedido (`order.userId === localUser.id`) antes de retornar os dados.
