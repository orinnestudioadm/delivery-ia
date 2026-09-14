## 1. Camada de recomendação

- [x] 1.1 Criar `src/lib/recommendations.ts` com `rankStoresByHistory` (função pura) e `getRecommendedStores` (busca dados via Prisma/`listActiveStores`)

## 2. UI

- [x] 2.1 Adicionar seção "Recomendado para você" em `src/app/dashboard/page.tsx`, reaproveitando `getRecommendedStores`

## 3. Testes

- [x] 3.1 Testes unitários de `rankStoresByHistory` em `tests/unit/recommendations.test.ts`
- [x] 3.2 Teste de integração de `getRecommendedStores` em `tests/integration/recommendations.test.ts` (com histórico, sem histórico, sem `User` local)
- [x] 3.3 Teste E2E Playwright criado em `tests/e2e/recommendations.spec.ts` (`test.skip` — mesma limitação de credenciais Clerk, ver VERIFICATION.md)

## 4. Verificação

- [x] 4.1 `npm run lint`
- [x] 4.2 `npm run test`
- [x] 4.3 `npx prisma validate`
- [x] 4.4 `npm run build`
