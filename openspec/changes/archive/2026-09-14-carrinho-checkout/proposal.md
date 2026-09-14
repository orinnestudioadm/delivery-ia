## Why

Com o catálogo de lojas e produtos disponível (`catalogo-lojas-produtos`), o cliente ainda não consegue montar um pedido. Este é o próximo passo natural da jornada principal descrita em `docs/prd.md` (RF04, UC03/UC04).

## What Changes

- Introduz os modelos `Order` e `OrderItem` no Prisma, relacionados a `User` e `Store`/`Product`.
- Adiciona um carrinho client-side (estado local por sessão) restrito a produtos de uma única loja.
- Adiciona a rota/Server Action de checkout que cria o pedido e seus itens no banco.

## Capabilities

### New Capabilities
- `carrinho`: composição de um pedido com itens de uma mesma loja antes da confirmação.
- `checkout`: criação do pedido (`Order` + `OrderItem`) a partir do carrinho.

## Impact

- **Afetados**: `prisma/schema.prisma` (novos modelos `Order`/`OrderItem`), novo componente de carrinho em `src/app/stores/[id]/**`, nova Server Action de checkout.
- **Dependências**: depende da mudança `catalogo-lojas-produtos` (modelos `Store`/`Product` e páginas de cardápio).

## Escopo Funcional

- Adicionar/remover itens do carrinho, validando que pertencem à mesma loja (UC03).
- Confirmar pedido (checkout), persistindo `Order` e `OrderItem`, com resposta 200 e id do pedido (UC04).
- Tratamento de erro para carrinho vazio ou produto inexistente (400) e para pedido de outro usuário (401/403).

## Dependências

- Requer a mudança `catalogo-lojas-produtos` arquivada (modelos `Store`/`Product` disponíveis).

## Riscos

- Médio: primeira operação de escrita no domínio de pedidos — exige validação cuidadosa (Zod) para evitar pedidos inconsistentes (itens de lojas diferentes, quantidades inválidas).

## Execução de Linter Necessária

- `npm run lint` sobre a nova Server Action e componentes de carrinho.

## Testes Unitários Necessários

- Cálculo do total do carrinho e validação de "mesma loja" como função pura.

## Testes de Integração Necessários

- Server Action de checkout: criação de pedido válido, rejeição de carrinho vazio, rejeição de itens de lojas distintas.

## Testes E2E Necessários

- Playwright: cliente adiciona produtos ao carrinho e finaliza o pedido, validando a mensagem de confirmação (UC03, UC04).
