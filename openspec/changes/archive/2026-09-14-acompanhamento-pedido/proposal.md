## Why

Depois de finalizar um pedido (`carrinho-checkout`), o cliente precisa saber o que está acontecendo com ele. `docs/prd.md` RF05 e `docs/spec.md` UC05 cobrem esse acompanhamento.

## What Changes

- Adiciona um campo de status ao modelo `Order` (`RECEIVED`, `PREPARING`, `ON_THE_WAY`, `DELIVERED`).
- Adiciona a página `/orders/[id]` para o cliente visualizar o status do próprio pedido.
- Adiciona endpoint/Server Action para atualização de status (uso interno/lojista, sem UI de lojista nesta mudança).

## Capabilities

### New Capabilities
- `acompanhamento-pedido`: consulta do status de um pedido pelo cliente dono do pedido.

### Modified Capabilities
- `checkout`: o `Order` criado em `carrinho-checkout` passa a incluir um status inicial (`RECEIVED`).

## Impact

- **Afetados**: `prisma/schema.prisma` (enum de status em `Order`), nova página `src/app/orders/[id]/page.tsx`.
- **Dependências**: depende de `carrinho-checkout` (modelo `Order`).

## Escopo Funcional

- Exibir o status atual do pedido para o cliente dono (UC05).
- Impedir que um cliente veja o pedido de outro (403).

## Dependências

- Requer a mudança `carrinho-checkout` arquivada.

## Riscos

- Baixo: leitura adicional sobre um modelo já existente, mais uma migração de enum aditiva.

## Execução de Linter Necessária

- `npm run lint` sobre `src/app/orders/**`.

## Testes Unitários Necessários

- Transições válidas de status (função pura de máquina de estados simples).

## Testes de Integração Necessários

- Consulta de status por dono do pedido; rejeição de acesso por não-dono (403).

## Testes E2E Necessários

- Playwright: após finalizar um pedido, o cliente acessa a página de acompanhamento e vê o status inicial (UC05).
