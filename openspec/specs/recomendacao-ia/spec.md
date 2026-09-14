# recomendacao-ia Specification

## Purpose
Permite que o cliente autenticado veja lojas recomendadas com base no seu histórico de pedidos, ou em lojas bem avaliadas quando ainda não tem histórico.

## Requirements

### Requirement: Recomendação por histórico de pedidos
O sistema SHALL ordenar as lojas ativas exibidas na seção de recomendação priorizando lojas e categorias que o cliente já pediu anteriormente.

#### Scenario: Cliente com histórico de pedidos
- **WHEN** um cliente autenticado com pedidos anteriores acessa o dashboard
- **THEN** o sistema exibe as lojas recomendadas priorizando as lojas e categorias mais pedidas por esse cliente

### Requirement: Fallback sem histórico
O sistema SHALL exibir as lojas ativas mais bem avaliadas como recomendação quando o cliente não tem nenhum pedido anterior.

#### Scenario: Cliente sem histórico de pedidos
- **WHEN** um cliente autenticado sem nenhum pedido anterior acessa o dashboard
- **THEN** o sistema exibe as lojas ativas ordenadas por avaliação, da maior para a menor
