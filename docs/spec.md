# 3. Especificação Técnica e Casos de Uso (Spec) - DeliveryIA

## 3.1 Escopo da Especificação (Spec-Driven Development)

Esta especificação detalha os casos de uso, fluxos de dados e contratos necessários para implementar os requisitos funcionais definidos em `docs/prd.md`, seguindo a arquitetura descrita em `docs/architecture.md` (Next.js + Clerk + Prisma/Supabase). Cada mudança incremental do roadmap (`openspec/roadmap.md`) deve referenciar os casos de uso abaixo.

## 3.2 Casos de Uso e Cenários

### UC01: Listar lojas parceiras
- **Ator**: Cliente autenticado
- **Pré-condições**: Usuário logado
- **Fluxo Principal**:
  1. O cliente acessa a página de lojas.
  2. O sistema busca as lojas ativas no Supabase via Prisma.
  3. O sistema exibe a lista de lojas com nome, categoria e avaliação.
- **Fluxo de Exceção**:
  - Nenhuma loja cadastrada retorna uma lista vazia com mensagem apropriada.

### UC02: Visualizar cardápio de uma loja
- **Ator**: Cliente autenticado
- **Pré-condições**: Usuário logado; loja existente
- **Fluxo Principal**:
  1. O cliente seleciona uma loja na listagem.
  2. O sistema busca os produtos da loja.
  3. O sistema exibe o cardápio com nome, preço e descrição de cada produto.
- **Fluxo de Exceção**:
  - Loja inexistente ou inativa retorna 404.

### UC03: Adicionar produto ao carrinho
- **Ator**: Cliente autenticado
- **Pré-condições**: Usuário logado; cardápio carregado
- **Fluxo Principal**:
  1. O cliente adiciona um ou mais produtos de uma mesma loja ao carrinho.
  2. O sistema valida que todos os itens pertencem à mesma loja.
  3. O sistema atualiza o total do carrinho.
- **Fluxo de Exceção**:
  - Tentativa de misturar produtos de lojas diferentes retorna erro de validação.

### UC04: Finalizar pedido (checkout)
- **Ator**: Cliente autenticado
- **Pré-condições**: Carrinho com ao menos um item
- **Fluxo Principal**:
  1. O cliente confirma o pedido a partir do carrinho.
  2. O sistema valida os parâmetros do pedido (itens, quantidades, loja).
  3. O backend cria o pedido e os itens associados no Supabase.
  4. Resposta com status 200 OK e identificador do pedido.
- **Fluxo de Exceção**:
  - Dados inválidos (carrinho vazio, produto inexistente) retornam 400 Bad Request.
  - Falha de autorização (pedido de outro usuário) retorna 401/403.

### UC05: Acompanhar status do pedido
- **Ator**: Cliente autenticado
- **Pré-condições**: Pedido criado
- **Fluxo Principal**:
  1. O cliente acessa a página de acompanhamento do pedido.
  2. O sistema retorna o status atual (recebido, em preparo, a caminho, entregue).
- **Fluxo de Exceção**:
  - Pedido de outro cliente retorna 403.

### UC06: Receber recomendações de produtos/lojas
- **Ator**: Cliente autenticado
- **Pré-condições**: Cliente com histórico de pedidos (ou perfil novo, com recomendações padrão)
- **Fluxo Principal**:
  1. O cliente acessa a página inicial autenticada.
  2. O sistema calcula recomendações com base no histórico de pedidos do cliente.
  3. O sistema exibe lojas/produtos recomendados.
- **Fluxo de Exceção**:
  - Cliente sem histórico recebe recomendações padrão (ex.: lojas mais bem avaliadas).

### UC07: Gerenciar cardápio (painel do lojista)
- **Ator**: Lojista autenticado (papel `STORE_OWNER`)
- **Pré-condições**: Usuário logado com papel de lojista; loja associada ao usuário
- **Fluxo Principal**:
  1. O lojista acessa o painel de gestão de cardápio.
  2. O lojista cria, edita ou remove produtos da própria loja.
  3. O sistema persiste as alterações via Prisma.
- **Fluxo de Exceção**:
  - Tentativa de editar produto de outra loja retorna 403.

## 3.3 Casos de Teste (Playwright / Unitários)

- **E2E (Playwright)**: jornada completa do cliente — login → listar lojas → abrir cardápio → adicionar ao carrinho → checkout → acompanhar status (UC01–UC05); jornada do lojista — login → painel → CRUD de produto (UC07).
- **Testes de integração**: endpoints/Server Actions de listagem de lojas, cardápio, criação de pedido e recomendação, validando contratos de entrada/saída (Zod) e códigos de status HTTP.
- **Testes unitários**: funções puras de formatação, cálculo de total do carrinho e regras de recomendação (ex.: ordenação por relevância).
