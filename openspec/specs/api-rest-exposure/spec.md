# api-rest-exposure Specification

## Purpose
Define o contrato HTTP das operações de escrita do domínio (checkout, CRUD de produto do lojista), expostas como API REST versionada, em atendimento ao requisito de interoperabilidade do projeto.

## Requirements

### Requirement: Checkout via API REST
O sistema SHALL expor a criação de pedido como `POST /api/v1/stores/{id}/checkout`, autenticado por sessão do Clerk, retornando o identificador do pedido em caso de sucesso.

#### Scenario: Checkout bem-sucedido
- **WHEN** um cliente autenticado envia `POST /api/v1/stores/{id}/checkout` com um corpo válido
- **THEN** o sistema responde `200` com o identificador do pedido criado

#### Scenario: Checkout sem sessão
- **WHEN** uma requisição sem sessão do Clerk é enviada a `POST /api/v1/stores/{id}/checkout`
- **THEN** o sistema responde `401`, sem criar nenhum pedido

#### Scenario: Checkout com dados inválidos
- **WHEN** um cliente autenticado envia um carrinho vazio ou um item que não pertence à loja informada
- **THEN** o sistema responde `400` com uma mensagem de erro, sem criar nenhum pedido

### Requirement: CRUD de produto do lojista via API REST
O sistema SHALL expor a criação, edição e remoção de produto do lojista como `POST`, `PUT` e `DELETE` em `/api/v1/store-admin/products`, restrito ao usuário autenticado com papel `STORE_OWNER` e dono da loja do produto.

#### Scenario: Criação bem-sucedida
- **WHEN** um lojista autenticado envia `POST /api/v1/store-admin/products` com dados válidos
- **THEN** o sistema responde `201` com o identificador do produto criado

#### Scenario: Acesso sem papel de lojista
- **WHEN** um usuário autenticado sem o papel `STORE_OWNER` chama qualquer rota de `/api/v1/store-admin/products`
- **THEN** o sistema responde `403`, sem alterar nenhum produto

#### Scenario: Acesso sem sessão
- **WHEN** uma requisição sem sessão do Clerk é enviada a qualquer rota de `/api/v1/store-admin/products`
- **THEN** o sistema responde `401`

#### Scenario: Edição ou remoção de produto de outra loja
- **WHEN** um lojista autenticado chama `PUT` ou `DELETE` para um produto que não pertence à sua loja
- **THEN** o sistema responde `403`, sem alterar o produto
