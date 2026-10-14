# 6. Lean Canvas — DeliveryIA

Iteração 1 · Preenchido a partir de `docs/problem.md` e `docs/prd.md`. Segmento: marketplace de delivery de cidades médias (clientes e lojistas parceiros).

## Problema

**Top 3 problemas:**
1. Apps de delivery genéricos entregam catálogos extensos com curadoria pobre — o cliente rola por dezenas de opções irrelevantes até achar algo que queira pedir.
2. Pequenos comerciantes locais têm baixa visibilidade frente a grandes redes, sem orçamento para mídia paga.
3. Nenhuma recomendação é baseada no histórico real do cliente — a ordenação é só por distância/popularidade.

**Alternativas existentes:** apps de delivery genéricos (ordenação por distância/popularidade, sem personalização); grupos de WhatsApp de comerciantes locais; pedidos diretos por Instagram/telefone.

## Solução

**Top 3 características:**
1. Catálogo de lojas e cardápio com busca (`catalogo-lojas-produtos`).
2. Carrinho e checkout com preço sempre recalculado no servidor (`carrinho-checkout`).
3. Recomendação de lojas por histórico de pedidos, com fallback para as mais bem avaliadas (`recomendacao-ia`).

## Proposta única de valor

> "Recomendações que conhecem o que você realmente pede — não só o que está mais perto."

Marketplace de delivery que aprende do histórico de cada cliente para recomendar lojas e produtos relevantes, e que dá visibilidade orgânica a pequenos comerciantes locais sem depender de mídia paga.

## Vantagem competitiva

Histórico de pedidos acumulado por cliente — um dado proprietário que cresce com o uso e alimenta a recomendação — somado à relação direta com comerciantes locais que hoje não têm presença em nenhum marketplace.

## Segmento de clientes

- **Clientes:** consumidores de cidades médias que pedem comida/produtos com frequência e querem decidir rápido.
- **Lojistas parceiros:** restaurantes e pequenos comércios locais sem presença digital estruturada.

**Early adopters:** clientes que já usam apps de delivery genéricos mas reclamam do excesso de opções irrelevantes; lojistas que hoje só vendem por WhatsApp/Instagram.

## Canais

Acesso direto via navegador (web responsivo, RNF-01); divulgação pelos próprios lojistas parceiros aos seus clientes atuais (canal de baixo custo); indicação entre clientes.

## Métricas chave

Taxa de conversão (sessão → pedido finalizado); tempo médio até o primeiro pedido após o login; taxa de recompra em até 30 dias; % de pedidos originados de uma recomendação.

## Estrutura de custos

Hospedagem (Vercel), banco de dados gerenciado (Supabase), autenticação (Clerk), tempo de desenvolvimento do time.

## Fluxo de receitas

Comissão transacional sobre pedidos processados na plataforma — modelo usual de marketplaces de delivery. Não implementado nesta fase acadêmica do projeto; registrado aqui como hipótese de monetização validada apenas no nível do canvas, não no código.
