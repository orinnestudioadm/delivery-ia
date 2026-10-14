## Why

A jornada do lojista (`docs/jornada-usuario.md`) parava no cardápio publicado — o lojista não tinha nenhuma tela para ver os pedidos recebidos pela própria loja. Isso deixava a segunda jornada de negócio incompleta, enquanto o Regulamento da Disciplina exige pelo menos dois fluxos de negócio ponta a ponta. Esta mudança fecha essa lacuna, já registrada como pendência em `openspec/roadmap.md`.

## What Changes

- Adiciona ao painel do lojista (`/store-admin`) uma seção "Pedidos recebidos": lista os pedidos da própria loja (cliente, itens, total, status) e permite avançar o status (`RECEIVED → PREPARING → ON_THE_WAY → DELIVERED`, ou cancelar) — reaproveitando a máquina de estados já existente em `src/lib/order-status.ts`.
- Adiciona `PATCH /api/v1/store-admin/orders/{id}/status`, seguindo o mesmo padrão de API REST versionada da mudança `api-rest-exposure` (RNF-03). `PATCH`, não `PUT`, porque só o campo `status` é alterado.
- Adiciona `listOrdersForStore` e `updateOrderStatusForStore` em `src/lib/orders.ts`, escopados à loja do lojista autenticado.

## Capabilities

### New Capabilities
- `painel-lojista-pedidos`: visualização e atualização de status dos pedidos recebidos por uma loja, pelo lojista dono.

## Impact

- **Afetados**: `src/lib/orders.ts` (duas funções novas), `src/lib/order-status.ts` (`getNextOrderStatusOptions`), `src/app/api/v1/store-admin/orders/[id]/status/route.ts` (novo), `src/app/store-admin/page.tsx`, `src/app/store-admin/order-status-form.tsx` (novo).
- **Dependências**: depende de `acompanhamento-pedido` (modelo de status) e `painel-lojista`/`api-rest-exposure` (contexto de lojista e padrão REST) já arquivados.
- **Risco**: baixo — reaproveita a máquina de estados e o padrão de autorização já existentes; não altera schema.

## Escopo Funcional

- Lojista autenticado vê os pedidos recebidos pela própria loja, com status atual.
- Lojista avança o status do pedido respeitando as transições válidas já modeladas (sem pular etapas); pode cancelar um pedido não finalizado.
- Pedido de outra loja é tratado como inexistente para o lojista (não revela se existe em outra loja).

## Dependências

- Requer `acompanhamento-pedido` e `painel-lojista`/`api-rest-exposure` arquivados.

## Riscos

- Baixo: a regra de transição de status já era testada (`acompanhamento-pedido`); esta change só adiciona o escopo por loja e a superfície HTTP/UI.

## Execução de Linter Necessária

- `npm run lint` sobre `src/lib/orders.ts`, `src/lib/order-status.ts`, `src/app/api/v1/store-admin/orders/**`, `src/app/store-admin/**`.

## Testes Unitários Necessários

- `getNextOrderStatusOptions`: opções corretas por status, inclusive consistência com `canTransitionOrderStatus`.

## Testes de Integração Necessários

- `listOrdersForStore` (resumo correto, nome do cliente com fallback para e-mail) e `updateOrderStatusForStore` (sucesso, pedido de outra loja, transição ilegal).
- Rota `PATCH /api/v1/store-admin/orders/{id}/status`: sucesso, 401, 400 (status inválido / transição ilegal), 403 (pedido de outra loja).

## Testes E2E Necessários

- Fica como `test.skip` pela mesma limitação de credenciais Clerk já documentada em `openspec/roadmap.md`; não há E2E novo nesta change (o plano de teste do painel do lojista já cobre a jornada manualmente quando as credenciais existirem).
