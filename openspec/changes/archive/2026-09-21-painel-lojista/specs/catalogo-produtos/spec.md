## ADDED Requirements

### Requirement: Produtos removidos não aparecem no cardápio
O sistema SHALL ocultar do cardápio exibido ao cliente os produtos desativados pelo lojista.

#### Scenario: Produto removido pelo lojista
- **WHEN** o lojista remove um produto e um cliente abre o cardápio da loja
- **THEN** o cardápio não exibe o produto removido
