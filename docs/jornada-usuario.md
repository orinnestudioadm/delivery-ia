
# 8. Jornada do Usuário — DeliveryIA

Duas jornadas ponta a ponta, uma por persona (`docs/personas.md`). Cada etapa referencia o caso de uso (`docs/spec.md`) e a tela/rota que o implementa.

## Jornada 1 — Mariana (Cliente): da descoberta ao pedido entregue

| Etapa | O que ela faz | Pensa / sente | Caso de uso | Rota |
|---|---|---|---|---|
| 1. Chega ao app | Abre o DeliveryIA e faz login | "Espero não ter que procurar muito" | Autenticação (estrutura inicial) | `/sign-in` |
| 2. Descobre | Vê a seção "Recomendado para você" no dashboard | "Ah, já tem algo que parece com o que eu gosto" | UC06 | `/dashboard` |
| 3. Explora o cardápio | Abre a loja recomendada e vê os produtos | "Dá pra ver preço e descrição rápido" | UC01, UC02 | `/stores`, `/stores/[id]` |
| 4. Monta o pedido | Adiciona itens ao carrinho, só dentro da mesma loja | "O total atualiza na hora, não preciso calcular" | UC03 | `/stores/[id]` |
| 5. Confirma | Finaliza o pedido (checkout) | "Confio que o preço é esse mesmo" | UC04 | `POST /api/v1/stores/[id]/checkout` |
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
| 6. Recebe o pedido | Vê o pedido na seção "Pedidos recebidos" do painel | "Chegou um pedido novo" | UC08 | `/store-admin` |
| 7. Atualiza o status | Avança o pedido (Recebido → Em Preparo → A Caminho → Entregue) ou cancela | "O cliente já vê isso do lado dele" | UC08 | `PATCH /api/v1/store-admin/orders/[id]/status` |

**Status de implementação:** etapas 1–7 implementadas e testadas (`painel-lojista`, `api-rest-exposure` e `painel-lojista-pedidos`, todas arquivadas). Esta é a segunda jornada ponta a ponta completa do projeto — começa no cadastro do cardápio e termina no recebimento e andamento do pedido, fechando a lacuna que existia nesta jornada.
