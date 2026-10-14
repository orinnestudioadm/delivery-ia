# Relatório de Verificação — api-rest-exposure

## Comandos executados

| Comando | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ Sem erros |
| `npm run lint` | ✅ Sem erros/avisos |
| `npm run test` (Vitest — unit + integration) | ✅ 13 arquivos, **73 testes**, todos passando (12 novos: `api-checkout.test.ts`, `api-store-admin-products.test.ts`) |
| `npx prisma validate` | ✅ Schema válido (sem alterações de schema nesta change) |
| `npm run build` | ✅ Build de produção concluído; rotas `/api/v1/stores/[id]/checkout`, `/api/v1/store-admin/products`, `/api/v1/store-admin/products/[id]` presentes no output |

## Correção feita durante a verificação

`vitest.config.ts` não resolvia o alias `@/*` (só existia em `tsconfig.json`), então os testes que importam os Route Handlers diretamente falhavam com "Cannot find package '@/lib/orders'". Adicionado `resolve.alias` espelhando o `tsconfig.json`. Sem essa correção, nenhum teste desta change rodaria — registrado aqui para não passar despercebido.

## Cobertura de testes por cenário da spec

- **Checkout bem-sucedido / sem sessão / dados inválidos**: `tests/integration/api-checkout.test.ts` (4 casos, incluindo corpo JSON malformado).
- **CRUD de produto — sucesso / sem sessão / sem papel de lojista / produto de outra loja**: `tests/integration/api-store-admin-products.test.ts` (7 casos cobrindo POST, PUT e DELETE).

## O que não foi (e não precisa ser) testado aqui

As páginas de leitura (lojas, cardápio, dashboard, pedido) continuam chamando a camada de dados diretamente nos Server Components — decisão registrada em `design.md`. Os testes E2E (`checkout.spec.ts`, `store-admin.spec.ts`) continuam `test.skip` pela mesma limitação de credenciais Clerk já registrada nas mudanças anteriores; o comportamento esperado neles não muda, só o transporte por baixo da UI.

## Conclusão

RNF-03 (exposição exclusiva via API RESTful) atendido para as duas operações de escrita do domínio. Lint, typecheck, testes e build verdes.
