## Purpose
Permite que o lojista parceiro visualize os pedidos recebidos pela própria loja e atualize o status de cada um, fechando a jornada de negócio do lojista (cadastro do cardápio → recebimento e andamento do pedido).

## ADDED Requirements

### Requirement: Listagem de pedidos da própria loja
O sistema SHALL exibir, para o lojista autenticado, os pedidos recebidos pela própria loja, com nome do cliente, itens, total e status atual.

#### Scenario: Loja com pedidos recebidos
- **WHEN** um lojista autenticado com pedidos na própria loja acessa o painel do lojista
- **THEN** o sistema exibe cada pedido com cliente, total e status

#### Scenario: Loja sem pedidos
- **WHEN** um lojista autenticado acessa o painel e a própria loja não tem nenhum pedido
- **THEN** o sistema exibe uma mensagem informando que não há pedidos, sem erro

### Requirement: Atualização de status restrita à própria loja
O sistema SHALL permitir que o lojista avance o status de um pedido da própria loja, respeitando a mesma máquina de transições usada no acompanhamento do cliente, e SHALL rejeitar a tentativa sobre um pedido de outra loja.

#### Scenario: Avanço de status válido
- **WHEN** o lojista solicita a transição de um pedido da própria loja para o próximo status válido (ex.: de "Recebido" para "Em Preparo")
- **THEN** o sistema atualiza o status do pedido

#### Scenario: Transição inválida
- **WHEN** o lojista solicita uma transição que pula etapas (ex.: de "Recebido" direto para "Entregue")
- **THEN** o sistema rejeita a operação com erro de validação, sem alterar o status

#### Scenario: Pedido de outra loja
- **WHEN** um lojista autenticado tenta atualizar o status de um pedido que pertence a outra loja
- **THEN** o sistema rejeita a operação com erro de autorização, sem alterar o pedido
