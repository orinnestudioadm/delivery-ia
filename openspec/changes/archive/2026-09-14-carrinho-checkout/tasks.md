## 1. Modelagem de dados

- [x] 1.1 Adicionar modelos `Order` e `OrderItem` em `prisma/schema.prisma`
- [x] 1.2 Rodar `npx prisma validate` e `npx prisma generate`

## 2. Sincronização de usuário

- [x] 2.1 Criar `src/lib/users.ts` com `upsertLocalUser` (upsert por `clerkId`)

## 3. Camada de dados de pedidos

- [x] 3.1 Criar `src/lib/cart.ts` com `calculateCartTotal` e `ensureSameStore` (funções puras)
- [x] 3.2 Criar `src/lib/orders.ts` com `createOrder` (validação Zod, preços recalculados no servidor, rejeição de itens de loja diferente/carrinho vazio)

## 4. Carrinho e checkout (UI)

- [x] 4.1 Criar `src/app/stores/[id]/cart.tsx` (Client Component com estado local de quantidades)
- [x] 4.2 Criar Server Action `src/app/stores/[id]/actions.ts` (`checkoutAction`)
- [x] 4.3 Integrar `Cart` na página `src/app/stores/[id]/page.tsx`, substituindo a listagem estática

## 5. Testes

- [x] 5.1 Testes unitários de `calculateCartTotal` e `ensureSameStore` em `tests/unit/cart.test.ts`
- [x] 5.2 Teste de integração de `createOrder` (sucesso, carrinho vazio, loja inexistente, item de loja diferente) em `tests/integration/orders.test.ts`
- [x] 5.3 Teste E2E Playwright criado em `tests/e2e/checkout.spec.ts` (`test.skip` — mesma limitação de credenciais Clerk, ver VERIFICATION.md)

## 6. Verificação

- [x] 6.1 `npm run lint`
- [x] 6.2 `npm run test`
- [x] 6.3 `npx prisma validate`
- [x] 6.4 `npm run build`
