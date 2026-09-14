## 1. Modelagem de Dados e Schema

- [x] 1.1 Adicionar enum `OrderStatus` (`RECEIVED`, `PREPARING`, `ON_THE_WAY`, `DELIVERED`, `CANCELED`) e campo `status` no modelo `Order` em `prisma/schema.prisma`
- [x] 1.2 Executar `npx prisma validate` e `npx prisma generate`

## 2. Lógica de Domínio & Máquina de Estados

- [x] 2.1 Criar `src/lib/order-status.ts` com validação pura de transições (`canTransitionOrderStatus`), labels e etapas visuais
- [x] 2.2 Expandir `src/lib/orders.ts` com `getOrderForUser`, `updateOrderStatus`, `listOrdersForUser` e tratamento de erros de autorização (`OrderForbiddenError`)

## 3. Interface de Acompanhamento (UI)

- [x] 3.1 Criar página `src/app/orders/[id]/page.tsx` com timeline de status, resumo do pedido e detalhes dos produtos
- [x] 3.2 Atualizar `src/app/stores/[id]/cart.tsx` para incluir link direto para `/orders/[id]` após confirmação do pedido
- [x] 3.3 Atualizar `src/app/dashboard/page.tsx` com listagem de pedidos recentes do usuário

## 4. Testes

- [x] 4.1 Criar testes unitários para a máquina de estados em `tests/unit/order-status.test.ts`
- [x] 4.2 Criar testes de integração para consulta e autorização de pedidos em `tests/integration/order-tracking.test.ts`
- [x] 4.3 Atualizar/adicionar teste E2E Playwright em `tests/e2e/order-tracking.spec.ts`

## 5. Verificação & Arquivamento

- [x] 5.1 `npm run lint`
- [x] 5.2 `npm run test`
- [x] 5.3 `npx prisma validate`
- [x] 5.4 `npm run build`
- [x] 5.5 Gerar `VERIFICATION.md` e arquivar mudança no OpenSpec
