## Purpose
Permite que o cliente consulte o status atual do seu pedido e acompanhe a evolução das etapas (Recebido, Em Preparo, A Caminho, Entregue), com garantia de controle de acesso restrito ao proprietário do pedido.

## ADDED Requirements

### Requirement: Consulta de Status do Pedido pelo Dono
O sistema SHALL exibir os detalhes e o status atual do pedido para o cliente autenticado que realizou a compra.

#### Scenario: Cliente consulta o próprio pedido
- **WHEN** o cliente autenticado acessa a rota `/orders/[id]` de um pedido criado por ele
- **THEN** o sistema exibe os detalhes do pedido, os itens comprados, o total e a etapa atual do status

#### Scenario: Acesso a pedido inexistente
- **WHEN** o cliente tenta acessar `/orders/[id]` com um identificador de pedido inexistente
- **THEN** o sistema responde com 404 Not Found

### Requirement: Bloqueio de Acesso por Usuário Não Proprietário
O sistema SHALL rejeitar com 403 Forbidden qualquer tentativa de consulta a um pedido realizada por um usuário que não seja o autor do pedido.

#### Scenario: Consulta de pedido pertencente a outro cliente
- **WHEN** o usuário autenticado "A" tenta acessar os dados de um pedido criado pelo usuário "B"
- **THEN** o sistema bloqueia a consulta e retorna 403 Forbidden

### Requirement: Transição Válida de Status do Pedido
O sistema SHALL permitir transições de status apenas de acordo com o fluxo operacional da máquina de estados (`RECEIVED` → `PREPARING` → `ON_THE_WAY` → `DELIVERED`, ou cancelamento antes da entrega).

#### Scenario: Transição sequencial permitida
- **WHEN** o status é atualizado de `RECEIVED` para `PREPARING`
- **THEN** a atualização é realizada com sucesso

#### Scenario: Transição inválida bloqueada
- **WHEN** tenta-se atualizar o status de `RECEIVED` diretamente para `DELIVERED` ou de `DELIVERED` para `PREPARING`
- **THEN** a operação é rejeitada com erro de transição inválida
