## Purpose
Permite que o cliente componha, no client-side, uma lista de produtos de uma mesma loja com suas quantidades antes de confirmar o pedido.

## ADDED Requirements

### Requirement: Composição do carrinho por loja
O sistema SHALL permitir que o cliente ajuste a quantidade de produtos do cardápio de uma loja, exibindo o total calculado a cada alteração.

#### Scenario: Cliente adiciona produtos ao carrinho
- **WHEN** o cliente ajusta a quantidade de um ou mais produtos do cardápio de uma loja
- **THEN** o sistema atualiza o total do carrinho refletindo a soma dos itens selecionados

#### Scenario: Cliente zera a quantidade de um produto
- **WHEN** o cliente reduz a quantidade de um produto no carrinho para zero
- **THEN** o sistema remove o produto do total do carrinho
