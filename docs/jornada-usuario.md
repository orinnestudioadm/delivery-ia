
# 8. Jornada do Usuário — DeliveryIA

Duas jornadas ponta a ponta, uma por persona (`docs/personas.md`). Cada etapa referencia o caso de uso (`docs/spec.md`) e a tela/rota que o implementa.

## Jornada 1 — Mariana (Cliente): da descoberta ao pedido entregue

| Etapa | O que ela faz | Pensa / sente | Caso de uso | Rota |
|---|---|---|---|---|
| 1. Chega ao app | Abre o DeliveryIA e faz login | "Espero não ter que procurar muito" | Autenticação (estrutura inicial) | `/sign-in` |
| 2. Descobre | Vê a seção "Recomendado para você" no dashboard | "Ah, já tem algo que parece com o que eu gosto" | UC06 | `/dashboard` |
| 3. Explora o cardápio | Abre a loja recomendada e vê os produtos | "Dá pra ver preço e descrição rápido" | UC01, UC02 | `/stores`, `/stores/[id]` |
| 4. Monta o pedido | Adiciona itens ao carrinho, só dentro da mesma loja | "O total atualiza na hora, não preciso calcular" | UC03 | `/stores/[id]` |
| 5. Confirma | Finaliza o pedido (checkout) | "Confio que o preço é esse mesmo" | UC04 | `/stores/[id]` (Server Action) |
| 6. Acompanha | Vê o status mudar de Recebido → Em Preparo → A Caminho → Entregue | "Não preciso ligar pra saber onde está" | UC05 | `/orders/[id]` |
| 7. Volta | Pedido entregue aparece no histórico ("Meus Pedidos"); próxima visita já traz recomendação ajustada por esse histórico | "Da próxima vez já vai saber o que eu pedi" | UC06 | `/dashboard` |

**Status de implementação:** etapas 1–7 implementadas e testadas (changes `estrutura-inicial`, `catalogo-lojas-produtos`, `carrinho-checkout`, `acompanhamento-pedido`, `recomendacao-ia`, todas arquivadas). Esta é a jornada ponta a ponta completa usada como primeiro fluxo de negócio do projeto (começa na descoberta, termina com o pedido entregue e realimentando a recomendação).

## Jornada 2 — Carlos (Lojista): do cadastro do cardápio ao pedido recebido

| Etapa | O que ele faz | Pensa / sente | Caso de uso | Rota |
|---|---|---|---|---|
| 1. Chega ao app | Faz login com a conta configurada como lojista | "Espero que seja mais simples que o caderno" | Autenticação (estrutura inicial) | `/sign-in` |
| 2. Acessa o painel | Vê o link "Painel do lojista" no dashboard e entra | "Esse aqui já é só meu" | UC07 | `/dashboard` → `/store-admin` |
| 3. Cadastra produto | Preenche nome, descrição e preço de um item do cardápio | "Não precisei de ajuda de ninguém pra isso" | UC07 | `/store-admin` |
| 4. Mantém o cardápio | Edita preço ou remove um item que saiu de linha | "Some do cardápio público na hora" | UC07 | `/store-admin` |
| 5. Produto aparece para o cliente | O cardápio atualizado passa a ser visível em `/stores/[id]` | — | UC02 | `/stores/[id]` |
| 6. Recebe o pedido | *(lacuna — ver abaixo)* | — | — | — |

**Status de implementação:** etapas 1–5 implementadas e testadas (`painel-lojista`, arquivada). **A etapa 6 não existe ainda** — o lojista não tem hoje nenhuma tela para ver os pedidos recebidos pela própria loja. Isso significa que a jornada do Carlos **não é ponta a ponta completa** no sentido exigido pela rubrica ("fluxo de negócio ponta-a-ponta... na visão do" ator); ela termina no cardápio publicado, não no recebimento do pedido.

## Lacuna identificada e proposta de próximo passo

Para que o projeto tenha os **dois fluxos de negócio ponta-a-ponta completos** exigidos pelos Requisitos Funcionais do regulamento, falta uma change `painel-lojista-pedidos` (ainda não criada em `openspec/roadmap.md`) cobrindo: listagem de pedidos recebidos pela loja do lojista autenticado e, no mínimo, a transição de status já modelada em `src/lib/order-status.ts` (`RECEIVED → PREPARING → ON_THE_WAY → DELIVERED`) acionada pelo lojista em vez de manual. Sem essa change, o fluxo 1 (Mariana) está completo; o fluxo 2 (Carlos) está parcial.
