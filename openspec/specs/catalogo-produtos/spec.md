# catalogo-produtos Specification

## Purpose
Permite que o cliente autenticado visualize o cardápio (produtos) de uma loja específica antes de decidir o que pedir.

## Requirements

### Requirement: Exibição do cardápio de uma loja
O sistema SHALL exibir, para um cliente autenticado, os produtos ativos de uma loja existente, mostrando nome, preço e descrição de cada produto.

#### Scenario: Loja existente com produtos
- **WHEN** o cliente autenticado abre uma loja ativa que possui produtos cadastrados
- **THEN** o sistema exibe cada produto com nome, preço e descrição

#### Scenario: Loja inexistente ou inativa
- **WHEN** o cliente autenticado tenta abrir uma loja que não existe ou está inativa
- **THEN** o sistema retorna um erro 404
