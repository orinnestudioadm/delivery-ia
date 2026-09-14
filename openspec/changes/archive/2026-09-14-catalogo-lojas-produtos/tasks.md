## 1. Modelagem de dados

- [x] 1.1 Adicionar modelos `Store` e `Product` em `prisma/schema.prisma`
- [x] 1.2 Rodar `npx prisma validate` e `npx prisma generate`

## 2. Camada de dados

- [x] 2.1 Criar `src/lib/stores.ts` com `listActiveStores()` e `getStoreWithProducts(id)`
- [x] 2.2 Validar o parâmetro `id` com Zod antes de consultar o Prisma

## 3. UI

- [x] 3.1 Criar `src/app/stores/page.tsx` (listagem, Server Component protegido)
- [x] 3.2 Criar `src/app/stores/[id]/page.tsx` (cardápio, Server Component protegido, 404 se loja não existir/inativa)
- [x] 3.3 Adicionar link para `/stores` a partir do dashboard

## 4. Testes

- [x] 4.1 Teste unitário de formatação de preço em `tests/unit/` (já existia, reaproveitado)
- [x] 4.2 Teste de integração da camada de dados (`listActiveStores`, `getStoreWithProducts`) em `tests/integration/stores.test.ts`
- [x] 4.3 Teste E2E Playwright criado em `tests/e2e/stores.spec.ts` (marcado `test.skip` — ver VERIFICATION.md)

## 5. Verificação

- [x] 5.1 `npm run lint`
- [x] 5.2 `npm run test`
- [x] 5.3 `npx prisma validate`
- [x] 5.4 `npx playwright test` (bloqueado — ver VERIFICATION.md)
