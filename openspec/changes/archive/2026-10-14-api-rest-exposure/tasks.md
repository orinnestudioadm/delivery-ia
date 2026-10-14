## 1. Contexto de autorização para API

- [x] 1.1 Extrair `buildStoreOwnerContext` compartilhado em `src/app/store-admin/access.ts`
- [x] 1.2 Criar `resolveStoreOwnerApiContext()` (sem `auth.protect()`, com status `unauthenticated`)

## 2. Route Handlers

- [x] 2.1 `POST /api/v1/stores/[id]/checkout`
- [x] 2.2 `POST /api/v1/store-admin/products`
- [x] 2.3 `PUT` e `DELETE /api/v1/store-admin/products/[id]`

## 3. Clientes (componentes React)

- [x] 3.1 `cart.tsx` chama o endpoint de checkout via `fetch`
- [x] 3.2 `product-form.tsx` chama os endpoints de produto via `fetch`, com `router.refresh()` após sucesso
- [x] 3.3 Remover `src/app/stores/[id]/actions.ts` e `src/app/store-admin/actions.ts`

## 4. Testes

- [x] 4.1 Configurar alias `@/*` em `vitest.config.ts` (necessário para importar os Route Handlers nos testes)
- [x] 4.2 Testes de integração do endpoint de checkout (sucesso, 401, 400, corpo inválido)
- [x] 4.3 Testes de integração do CRUD de produto (sucesso, 401, 403, produto de outra loja)

## 5. Verificação

- [x] 5.1 `npx tsc --noEmit`
- [x] 5.2 `npm run lint`
- [x] 5.3 `npm run test`
- [x] 5.4 `npx prisma validate`
- [x] 5.5 `npm run build`
