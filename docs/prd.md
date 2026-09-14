# 2. Documento de Requisitos do Produto (PRD) - DeliveryIA

## 2.1 Visão Geral do Produto

O DeliveryIA é um marketplace de delivery full stack que conecta clientes a lojas parceiras (restaurantes e comércios locais), com uma camada de inteligência artificial responsável por recomendar produtos e estabelecimentos relevantes com base no histórico e contexto de cada cliente. O produto é entregue de forma incremental: autenticação → catálogo → carrinho/checkout → acompanhamento de pedido → recomendação por IA → painel do lojista.

## 2.2 Personas e Jornadas do Usuário

- **Persona 1 — Cliente**: pessoa que faz pedidos de comida/produtos com frequência, busca decidir rapidamente o que pedir e valoriza recomendações relevantes ao invés de navegar por catálogos extensos. Objetivo: encontrar algo bom para pedir em poucos cliques. Desafio: excesso de opções irrelevantes nos apps atuais.
- **Persona 2 — Lojista Parceiro**: dono ou gestor de um restaurante/comércio local que cadastra seu cardápio na plataforma e depende de recomendações e boa exposição para vender mais, sem orçamento para anúncios. Objetivo: gerenciar seu catálogo e receber pedidos. Desafio: baixa visibilidade em plataformas dominadas por grandes redes.
- **Jornada principal (Cliente)**: autenticar-se (Clerk) → visualizar lojas recomendadas/buscar lojas → abrir o cardápio de uma loja → adicionar produtos ao carrinho → finalizar o pedido (checkout) → acompanhar o status do pedido → receber recomendações personalizadas para o próximo pedido.
- **Jornada secundária (Lojista)**: autenticar-se com papel de lojista (RBAC) → acessar painel do lojista → cadastrar/editar produtos do cardápio → visualizar pedidos recebidos.

## 2.3 Requisitos Funcionais (RF)

- [RF01] Listagem e busca de lojas parceiras, com exibição de cardápio (produtos, preço, descrição) por loja.
- [RF02] Autenticação e gestão de perfil via Clerk, com papéis distintos para Cliente e Lojista (RBAC).
- [RF03] Operações CRUD principais (lojas, produtos, pedidos) persistidas via Supabase/Prisma.
- [RF04] Carrinho de compras e checkout, permitindo montar um pedido com múltiplos itens de uma mesma loja e confirmá-lo.
- [RF05] Acompanhamento do status do pedido (recebido → em preparo → a caminho → entregue) pelo cliente.
- [RF06] Recomendação de produtos e lojas por IA, baseada no histórico de pedidos do cliente autenticado.
- [RF07] Painel do lojista para cadastro e manutenção do próprio cardápio (CRUD de produtos restrito ao dono da loja).

## 2.4 Requisitos Não-Funcionais (RNF)

- [RNF01] Performance: tempo de resposta da API < 200ms para as rotas de listagem e cardápio.
- [RNF02] Segurança: RBAC (Cliente vs. Lojista) e proteção de rotas públicas/privadas via middleware do Clerk.
- [RNF03] Acessibilidade: conformidade com WCAG 2.1 AA nas telas de catálogo, carrinho e checkout.

## 2.5 Métricas de Sucesso (KPIs)

- Taxa de conversão: % de sessões que resultam em pedido finalizado.
- Tempo médio até o primeiro pedido após o login.
- Taxa de recompra (clientes que retornam para um novo pedido em até 30 dias).
- Ticket médio por pedido, com comparação entre pedidos com e sem interação com recomendações de IA.
