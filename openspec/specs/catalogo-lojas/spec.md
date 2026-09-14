# catalogo-lojas Specification

## Purpose
Permite que o cliente autenticado descubra lojas parceiras ativas disponíveis na plataforma, como ponto de entrada da jornada de pedido.

## Requirements

### Requirement: Listagem de lojas ativas
O sistema SHALL exibir, para um cliente autenticado, a lista de lojas com status ativo, mostrando nome, categoria e avaliação de cada loja.

#### Scenario: Lojas ativas cadastradas
- **WHEN** o cliente autenticado acessa a página de lojas e existem lojas com status ativo cadastradas
- **THEN** o sistema exibe cada loja ativa com nome, categoria e avaliação

#### Scenario: Nenhuma loja cadastrada
- **WHEN** o cliente autenticado acessa a página de lojas e não existe nenhuma loja ativa cadastrada
- **THEN** o sistema exibe uma lista vazia com uma mensagem informando que não há lojas disponíveis

### Requirement: Acesso restrito a usuários autenticados
O sistema SHALL exigir autenticação para acessar a listagem de lojas.

#### Scenario: Usuário não autenticado
- **WHEN** um usuário não autenticado tenta acessar a página de lojas
- **THEN** o sistema redireciona para o fluxo de login do Clerk
