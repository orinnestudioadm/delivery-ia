# checkout Specification

## Purpose
Permite que o cliente confirme o pedido montado no carrinho, criando o registro do pedido e seus itens a partir de dados validados no servidor.

## Requirements

### Requirement: Criação do pedido a partir do carrinho
O sistema SHALL criar um pedido (com seus itens) a partir do carrinho do cliente autenticado, calculando os preços a partir dos dados atuais dos produtos no servidor, sem confiar no preço enviado pelo cliente.

#### Scenario: Checkout com itens válidos
- **WHEN** o cliente confirma o pedido com um carrinho contendo ao menos um item de produtos ativos de uma loja ativa
- **THEN** o sistema cria o pedido e retorna o identificador do pedido criado

#### Scenario: Checkout com carrinho vazio
- **WHEN** o cliente tenta confirmar o pedido sem nenhum item no carrinho
- **THEN** o sistema rejeita a operação com um erro de validação, sem criar o pedido

### Requirement: Rejeição de itens de lojas diferentes
O sistema SHALL rejeitar uma tentativa de checkout cujos itens não pertençam todos à loja informada.

#### Scenario: Itens de lojas diferentes
- **WHEN** o cliente envia um checkout contendo um produto que não pertence à loja informada
- **THEN** o sistema rejeita a operação com um erro de validação, sem criar o pedido
