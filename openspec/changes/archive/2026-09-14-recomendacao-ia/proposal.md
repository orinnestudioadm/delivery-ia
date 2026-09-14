## Why

O diferencial do DeliveryIA frente a apps de delivery genéricos é a recomendação personalizada (`docs/problem.md`, RF06 em `docs/prd.md`, UC06 em `docs/spec.md`). Com catálogo e histórico de pedidos disponíveis, já é possível calcular recomendações simples baseadas em comportamento.

## What Changes

- Adiciona uma função de recomendação (`src/lib/recommendations.ts`) que ordena lojas/produtos por relevância a partir do histórico de pedidos do cliente (ex.: lojas/categorias mais pedidas), com fallback para lojas mais bem avaliadas quando não há histórico.
- Exibe uma seção "Recomendado para você" na página inicial autenticada.

## Capabilities

### New Capabilities
- `recomendacao-ia`: cálculo e exibição de lojas/produtos recomendados por cliente.

## Impact

- **Afetados**: novo `src/lib/recommendations.ts`, alteração de `src/app/page.tsx` (ou nova rota autenticada) para exibir a seção.
- **Dependências**: depende de `catalogo-lojas-produtos` (dados de loja/produto) e `carrinho-checkout` (histórico de pedidos).

## Escopo Funcional

- Calcular recomendações a partir do histórico de pedidos (UC06, fluxo principal).
- Fallback para lojas mais bem avaliadas quando o cliente não tem histórico (UC06, fluxo de exceção).
- Esta mudança não integra um provedor de IA externo — a "recomendação por IA" é implementada como um algoritmo de ranking determinístico baseado em histórico, deixando a porta aberta para trocar por um modelo/serviço externo depois sem mudar a interface pública da função.

## Dependências

- Requer `catalogo-lojas-produtos` e `carrinho-checkout` arquivados (dados de loja/produto/pedido).

## Riscos

- Médio: lógica de ranking pode gerar resultados vazios/estranhos em bases pequenas — mitigado com o fallback padrão e testes unitários cobrindo os dois caminhos.

## Execução de Linter Necessária

- `npm run lint` sobre `src/lib/recommendations.ts` e o componente de exibição.

## Testes Unitários Necessários

- Ranking com histórico (ordenação correta) e fallback sem histórico.

## Testes de Integração Necessários

- Geração de recomendações a partir de dados reais de pedidos/lojas via Prisma (dataset de teste).

## Testes E2E Necessários

- Playwright: cliente com pedidos anteriores vê a seção "Recomendado para você" preenchida na página inicial (UC06).
