## Context

`src/lib/order-status.ts` já modela a máquina de estados do pedido (`acompanhamento-pedido`) e `src/app/store-admin/access.ts` já resolve o contexto do lojista autenticado e sua loja (`painel-lojista`). Faltava só ligar os dois: nenhuma consulta de pedido era escopada por loja, e não havia como o lojista mudar o status por fora do admin do banco.

## Goals / Non-Goals

**Goals:**
- Reaproveitar `canTransitionOrderStatus` sem duplicar a regra de transição.
- Escopar toda consulta/mutação à loja do lojista autenticado — nunca a um `storeId` vindo do cliente.
- Seguir o mesmo padrão REST (`resolveStoreOwnerApiContext`, status 401/403/400) já estabelecido em `api-rest-exposure`.

**Non-Goals:**
- Notificar o cliente quando o status muda (e-mail, push) — fora do escopo.
- Permitir que o lojista edite itens/valor do pedido — só o status.

## Decisions

- **`PATCH`, não `PUT`**: a requisição só altera um campo (`status`), não substitui o recurso inteiro — uso correto do verbo HTTP, coerente com a exigência de API RESTful (RNF-03).
- **Isolamento por loja via query, não por `ownerId` solto**: `updateOrderStatusForStore(storeId, orderId, nextStatus)` busca o pedido com `where: { id: orderId, storeId }` — um pedido de outra loja simplesmente não é encontrado (mesmo padrão de `assertOwnsProduct` em `src/lib/store-admin.ts`), em vez de buscar o pedido primeiro e comparar depois (evita vazar que o pedido existe em outro lugar).
- **`getNextOrderStatusOptions` exportada** em vez de duplicar o mapa de transições na UI: a tela de pedidos deriva os botões de ação diretamente da mesma fonte de verdade que valida a transição no servidor.
- **Nome do cliente com fallback**: `listOrdersForStore` usa `user.name ?? user.email`, já que `User.name` é opcional (vem do Clerk, nem sempre preenchido).

## Risks / Trade-offs

- Sem paginação na lista de pedidos — aceitável no volume atual do projeto acadêmico; revisitar se o volume de pedidos por loja crescer.
