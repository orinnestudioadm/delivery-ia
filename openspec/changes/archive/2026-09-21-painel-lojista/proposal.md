## Why

Até aqui a plataforma só atende a persona Cliente. A persona Lojista Parceiro (`docs/prd.md`) precisa de um painel para manter seu próprio cardápio, o que exige introduzir papéis (RBAC) pela primeira vez (RNF02, UC07).

## What Changes

- Adiciona um papel de usuário (`role`: `CUSTOMER` | `STORE_OWNER`) ao modelo `User`, sincronizado a partir de metadata do Clerk.
- Adiciona o painel `/store-admin` (protegido para `STORE_OWNER`) com CRUD de produtos restrito à loja do próprio lojista.

## Capabilities

### New Capabilities
- `painel-lojista`: CRUD de produtos do cardápio restrito ao dono da loja.

### Modified Capabilities
- `catalogo-produtos`: os produtos passam a poder ser criados/editados/removidos pelo lojista dono, não apenas lidos pelo cliente.

## Impact

- **Afetados**: `prisma/schema.prisma` (campo `role` em `User`), middleware de proteção de rota (RBAC), nova área `src/app/store-admin/**`.
- **Dependências**: depende de `catalogo-lojas-produtos` (modelos `Store`/`Product`).

## Escopo Funcional

- Criar, editar e remover produtos da própria loja (UC07, fluxo principal).
- Bloquear edição de produtos de outra loja (403) (UC07, fluxo de exceção).

## Dependências

- Requer `catalogo-lojas-produtos` arquivado.
- O papel `STORE_OWNER` é atribuído via `publicMetadata.role` no Clerk — decisão registrada em `design.md`.

## Riscos

- Médio: primeira introdução de RBAC no projeto — exige revisão cuidadosa de todas as rotas para garantir que a checagem de papel é aplicada de forma consistente (RNF02).

## Execução de Linter Necessária

- `npm run lint` sobre `src/app/store-admin/**` e o middleware atualizado.

## Testes Unitários Necessários

- Função de verificação de papel/posse (usuário é dono da loja do produto sendo editado).

## Testes de Integração Necessários

- CRUD de produto pelo dono da loja; rejeição de CRUD por usuário sem papel `STORE_OWNER` ou dono de outra loja.

## Testes E2E Necessários

- Playwright: lojista autenticado cria um produto no painel e o vê refletido no cardápio público (UC07).
