## Purpose
Permite que o lojista parceiro (papel `STORE_OWNER`) mantenha o cardápio da própria loja, criando, editando e removendo produtos, sem acesso ao cardápio de outras lojas.

## ADDED Requirements

### Requirement: Acesso restrito ao papel de lojista
O sistema SHALL permitir o acesso ao painel `/store-admin` somente a usuários autenticados com o papel `STORE_OWNER` que possuam uma loja associada.

#### Scenario: Lojista acessa o painel
- **WHEN** um usuário autenticado com papel `STORE_OWNER` e uma loja associada acessa o painel do lojista
- **THEN** o sistema exibe os produtos da loja desse lojista

#### Scenario: Cliente tenta acessar o painel
- **WHEN** um usuário autenticado sem o papel `STORE_OWNER` acessa o painel do lojista
- **THEN** o sistema nega o acesso e exibe uma mensagem de acesso restrito, sem listar nenhum dado de loja

#### Scenario: Lojista sem loja associada
- **WHEN** um usuário com papel `STORE_OWNER` que não possui nenhuma loja acessa o painel do lojista
- **THEN** o sistema informa que não há loja associada e não exibe formulários de produto

### Requirement: Gestão de produtos da própria loja
O sistema SHALL permitir que o lojista crie, edite e remova produtos da própria loja, validando nome, descrição e preço no servidor.

#### Scenario: Criar produto válido
- **WHEN** o lojista envia o formulário de novo produto com nome, descrição e preço válidos
- **THEN** o sistema cria o produto ativo na loja do lojista

#### Scenario: Criar produto inválido
- **WHEN** o lojista envia o formulário com nome vazio ou preço menor ou igual a zero
- **THEN** o sistema rejeita a operação com um erro de validação, sem criar o produto

#### Scenario: Editar produto da própria loja
- **WHEN** o lojista altera nome, descrição ou preço de um produto da própria loja
- **THEN** o sistema atualiza o produto

#### Scenario: Remover produto da própria loja
- **WHEN** o lojista remove um produto da própria loja
- **THEN** o sistema desativa o produto, preservando os pedidos que já o referenciam

### Requirement: Isolamento entre lojas
O sistema SHALL rejeitar qualquer tentativa de editar ou remover um produto que pertença à loja de outro lojista.

#### Scenario: Editar produto de outra loja
- **WHEN** um lojista envia uma edição ou remoção para um produto de outra loja
- **THEN** o sistema rejeita a operação com erro de autorização (403), sem alterar o produto
