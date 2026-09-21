## 1. Modelagem de dados

- [x] 1.1 Adicionar enum `UserRole` e campo `User.role` (default `CUSTOMER`) em `prisma/schema.prisma`
- [x] 1.2 Rodar `npx prisma validate` e `npx prisma generate`

## 2. Camada de autorização e dados

- [x] 2.1 Criar `src/lib/roles.ts` (`parseRole`, `isStoreOwner`) — funções puras
- [x] 2.2 Estender `upsertLocalUser` para espelhar o papel em `User.role`
- [x] 2.3 Criar `src/lib/price.ts` (`parsePriceToCents`) — função pura
- [x] 2.4 Criar `src/lib/store-admin.ts` (`getOwnedStoreWithProducts`, `createProduct`, `updateProduct`, `removeProduct`) com Zod e checagem de posse

## 3. UI e Server Actions

- [x] 3.1 Criar `src/app/store-admin/access.ts` (`requireStoreOwnerContext`) resolvendo Clerk → papel → usuário local → loja
- [x] 3.2 Criar `src/app/store-admin/actions.ts` (criar, editar, remover) com `revalidatePath`
- [x] 3.3 Criar `src/app/store-admin/page.tsx` e `product-form.tsx`
- [x] 3.4 Exibir link "Painel do lojista" no dashboard apenas para `STORE_OWNER`

## 4. Testes

- [x] 4.1 Testes unitários de `roles.ts` e `price.ts`
- [x] 4.2 Teste de integração de `store-admin.ts` (sucesso, validação, isolamento entre lojas, produto inexistente) com Prisma mockado
- [x] 4.3 Plano de teste (`specs/painel-lojista-test-plan.md`) e E2E `tests/e2e/store-admin.spec.ts` (ignorado sem credenciais e loja de teste)

## 5. Verificação

- [x] 5.1 `npm run lint`
- [x] 5.2 `npm run test`
- [x] 5.3 `npx prisma validate`
- [x] 5.4 `npm run build`
