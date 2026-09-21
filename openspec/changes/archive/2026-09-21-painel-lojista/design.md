## Context

Até aqui só existe a persona Cliente. `Store.ownerId` já foi modelado em `catalogo-lojas-produtos` justamente para esta change, e o `User` local é criado sob demanda por `upsertLocalUser` (`src/lib/users.ts`), sem webhook do Clerk. O padrão de rota privada é Server Component com `auth.protect()`, e a camada de dados fica em `src/lib/*.ts` com validação Zod.

## Goals / Non-Goals

**Goals:**
- Introduzir RBAC mínimo (`CUSTOMER` | `STORE_OWNER`) sem depender de webhook.
- Painel `/store-admin` com CRUD de produtos restrito à loja do próprio lojista.
- Autorização decidida no servidor (Server Actions e camada de dados), nunca só na UI.

**Non-Goals:**
- Criação/edição de lojas e atribuição do papel pela aplicação (o papel é atribuído no dashboard do Clerk; a loja é associada ao usuário fora desta change).
- Lojista com várias lojas: o painel usa a primeira loja do usuário (ordenada por criação).
- Visualização de pedidos recebidos pelo lojista (citada na jornada secundária do PRD, fica para uma change futura).
- Upload de imagem de produto.

## Decisions

- **Fonte do papel**: `publicMetadata.role` do usuário no Clerk (`"STORE_OWNER"`). Qualquer outro valor ou ausência vale `CUSTOMER`. `publicMetadata` só é editável pelo backend/dashboard do Clerk, não pelo próprio usuário. O papel é lido do Clerk a cada requisição e espelhado em `User.role` por `upsertLocalUser`, então o espelho nunca é a fonte de autorização.
- **Remoção = desativação** (`isActive = false`): `OrderItem` referencia `Product` sem cascade, então um `DELETE` falharia (ou apagaria histórico) para produtos já pedidos. O cardápio público já filtra `isActive: true` (`getStoreWithProducts`), então a desativação some do catálogo sem tocar em `catalogo-produtos`.
- **Isolamento**: toda mutação recebe o `id` local do lojista e faz `product.store.ownerId === userId` na própria consulta (`where: { id, store: { ownerId } }`); sem correspondência, lança `StoreAdminForbiddenError`. Um produto inexistente e o de outra loja são tratados como o mesmo caso (não vaza existência).
- **Preço**: o formulário recebe reais (ex.: `12,90`) e um utilitário puro converte para centavos inteiros; valores inválidos, zero ou negativos são rejeitados.
- **UI**: formulários com Server Actions e `useActionState` para exibir erros de validação/autorização.
- **Acesso negado**: a página renderiza uma mensagem de acesso restrito (sem `forbidden()`, que exige a flag experimental `authInterrupts`).

## Risks / Trade-offs

- Sem interface para atribuir o papel/loja, o primeiro lojista precisa ser configurado manualmente (Clerk + linha em `Store`); documentado no README.
- `publicMetadata` no Clerk precisa refletir o papel; se o token de sessão estiver desatualizado, o papel novo só vale após `currentUser()` refletir a mudança — por isso lemos via `currentUser()` (API) e não via claims do JWT.
- Soft delete deixa produtos inativos acumulando; aceitável no volume atual.
