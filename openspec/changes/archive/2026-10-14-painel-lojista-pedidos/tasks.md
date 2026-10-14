## 1. Camada de dados

- [x] 1.1 `listOrdersForStore(storeId)` em `src/lib/orders.ts`
- [x] 1.2 `updateOrderStatusForStore(storeId, orderId, nextStatus)` em `src/lib/orders.ts`
- [x] 1.3 `getNextOrderStatusOptions(current)` em `src/lib/order-status.ts`

## 2. API REST

- [x] 2.1 `PATCH /api/v1/store-admin/orders/[id]/status`

## 3. UI

- [x] 3.1 Seção "Pedidos recebidos" em `src/app/store-admin/page.tsx`
- [x] 3.2 `OrderStatusForm` (client) chamando o endpoint via `fetch` + `router.refresh()`

## 4. Testes

- [x] 4.1 Unitário: `getNextOrderStatusOptions` (inclusive consistência com `canTransitionOrderStatus`)
- [x] 4.2 Integração: `listOrdersForStore` e `updateOrderStatusForStore`
- [x] 4.3 Integração: rota `PATCH /api/v1/store-admin/orders/[id]/status`

## 5. Verificação

- [x] 5.1 `npx tsc --noEmit`
- [x] 5.2 `npm run lint`
- [x] 5.3 `npm run test`
- [x] 5.4 `npx prisma validate`
- [x] 5.5 `npm run build`

## 6. Documentação

- [x] 6.1 Atualizar `docs/prd.md` (RF08) e `docs/spec.md` (UC08)
- [x] 6.2 Atualizar `docs/jornada-usuario.md` (etapa 6 da Jornada 2) e `docs/mapeamento-historias.md` (linha R6)
