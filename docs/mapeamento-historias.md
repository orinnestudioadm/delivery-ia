# 9. Mapeamento de Histórias (Story Mapping) — DeliveryIA

Backbone (atividades do usuário, eixo horizontal) × releases do roadmap (eixo vertical), no formato de Jeff Patton. O backbone segue as duas jornadas de `docs/jornada-usuario.md`; cada célula referencia a change do OpenSpec (`openspec/roadmap.md`) que a implementou — ou "pendente" quando ainda não existe.

## Backbone (atividades do usuário)

`Autenticar` → `Descobrir loja` → `Montar pedido` → `Acompanhar pedido` → `Receber recomendação` → `Gerenciar cardápio (lojista)` → `Gerenciar pedidos recebidos (lojista)`

## Mapa

| Release | Autenticar | Descobrir loja | Montar pedido | Acompanhar pedido | Receber recomendação | Gerenciar cardápio | Gerenciar pedidos (lojista) |
|---|---|---|---|---|---|---|---|
| **R0 — Esqueleto** (`estrutura-inicial`) | Login/logout via Clerk, rota protegida de exemplo | — | — | — | — | — | — |
| **R1 — Catálogo** (`catalogo-lojas-produtos`) | — | Listar lojas ativas; ver cardápio de uma loja | — | — | — | — | — |
| **R2 — Pedido** (`carrinho-checkout`) | — | — | Montar carrinho (mesma loja); confirmar pedido com preço validado no servidor | — | — | — | — |
| **R3 — Status** (`acompanhamento-pedido`) | — | — | — | Ver status do próprio pedido; histórico em "Meus Pedidos" | — | — | — |
| **R4 — Recomendação** (`recomendacao-ia`) | — | — | — | — | Seção "Recomendado para você" por histórico, com fallback por avaliação | — | — |
| **R5 — Lojista** (`painel-lojista`) | Papel `STORE_OWNER` via Clerk | — | — | — | — | Criar, editar e remover produto da própria loja | — |
| **R6 — Pedidos do lojista** (pendente) | — | — | — | — | — | — | Ver pedidos recebidos; atualizar status (hoje só modelado em `order-status.ts`, sem UI para o lojista) |

## Release mínima viável (linha de corte)

A linha de corte do MVP, para efeito de "walking skeleton" citado no slide de IaC, fica entre **R0 e R1**: a partir daí o cliente já consegue completar a Jornada 1 inteira (R0→R4). A Jornada 2 (lojista) só fecha com **R6**, ainda não implementada — é a lacuna já registrada em `docs/jornada-usuario.md`.

## Rastreabilidade

Cada coluna preenchida nesta tabela tem: proposta (`proposal.md`), design, especificação delta e tarefas em `openspec/changes/archive/<data>-<mudança>/`, com relatório de verificação (`VERIFICATION.md`) e cobertura de testes correspondente — nenhuma célula do mapa foi marcada como entregue sem o teste equivalente, conforme exigido pelo roteiro e por `AGENTS.md` §6.
