## Why

A rubrica da disciplina (RNF-03 — Interoperabilidade) exige que a solução "exponha suas funcionalidades exclusivamente por meio de APIs RESTful, utilizando os protocolos HTTP/HTTPS". As duas operações de escrita do domínio — checkout (`carrinho-checkout`) e CRUD de produto do lojista (`painel-lojista`) — eram implementadas como Server Actions do Next.js: funcionam sobre HTTP, mas não como uma API REST convencional (sem rota de recurso versionada, sem verbos HTTP explícitos, sem contrato JSON documentado).

## What Changes

- Adiciona endpoints REST versionados sob `/api/v1`, usando o prefixo já reservado em `.env.example` (`GLOBAL_PREFIX=api/v1`):
  - `POST /api/v1/stores/{id}/checkout`
  - `POST /api/v1/store-admin/products`
  - `PUT /api/v1/store-admin/products/{id}`
  - `DELETE /api/v1/store-admin/products/{id}`
- Remove as Server Actions equivalentes (`src/app/stores/[id]/actions.ts`, `src/app/store-admin/actions.ts`); os componentes cliente passam a chamar os endpoints via `fetch`.
- A regra de negócio não muda — continua em `src/lib/orders.ts` e `src/lib/store-admin.ts`; os Route Handlers só traduzem HTTP ↔ domínio (parsing do corpo, status code, autenticação).

## Capabilities

### New Capabilities
- `api-rest-exposure`: contrato REST para checkout e para o CRUD de produto do lojista.

Os requisitos já publicados de `checkout` e `painel-lojista` (criação do pedido, CRUD de produto) não mudam de comportamento — só de transporte — por isso não há delta nessas capabilities; o contrato HTTP novo fica isolado em `api-rest-exposure`.

## Impact

- **Afetados**: `src/app/api/v1/**` (novo), `src/app/stores/[id]/cart.tsx`, `src/app/store-admin/product-form.tsx`, `src/app/store-admin/page.tsx`, `src/app/store-admin/access.ts` (nova função `resolveStoreOwnerApiContext`), `vitest.config.ts` (alias `@/*` necessário para os testes importarem os Route Handlers).
- **Dependências**: depende de `carrinho-checkout` e `painel-lojista` já arquivados.
- **Risco**: baixo-médio — muda o transporte, não a regra de negócio; a cobertura de testes de `src/lib/orders.ts` e `src/lib/store-admin.ts` já existente continua válida, e esta change adiciona testes específicos dos Route Handlers (status HTTP, autenticação).

## Escopo Funcional

- Checkout e CRUD de produto do lojista acessíveis por HTTP com verbos e códigos de status convencionais (200/201 sucesso, 400 validação, 401 não autenticado, 403 sem permissão).
- Leitura de páginas renderizadas no servidor (lojas, cardápio, dashboard, pedido) continua chamando a camada de dados diretamente nos Server Components — decisão registrada em `design.md`, não é uma "funcionalidade" exposta a um consumidor externo, é a própria renderização da UI.

## Dependências

- Requer `carrinho-checkout` e `painel-lojista` arquivados.

## Riscos

- Baixo-médio: é uma troca de transporte sobre lógica já testada; o principal risco é divergência de contrato entre o `fetch` do cliente e o Route Handler, mitigada pelos testes de integração desta change.

## Execução de Linter Necessária

- `npm run lint` sobre `src/app/api/v1/**`, `src/app/stores/[id]/cart.tsx`, `src/app/store-admin/**`.

## Testes Unitários Necessários

- Não há lógica nova de função pura nesta change (os Route Handlers delegam para `src/lib/*`, já cobertos).

## Testes de Integração Necessários

- Route Handlers de checkout e de CRUD de produto do lojista: sucesso, 401 (sem sessão), 403 (sem papel de lojista / produto de outra loja), 400 (corpo inválido / validação).

## Testes E2E Necessários

- Os E2E já existentes (`tests/e2e/checkout.spec.ts`, `tests/e2e/store-admin.spec.ts`) continuam cobrindo o fluxo pela UI; não mudam de comportamento esperado, só o transporte por baixo. Permanecem `test.skip` pela mesma limitação de credenciais Clerk já documentada.
