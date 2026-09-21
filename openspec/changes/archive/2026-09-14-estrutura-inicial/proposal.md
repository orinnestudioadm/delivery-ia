## Why

Esta change documenta, de forma retroativa, o esqueleto técnico que foi implementado no commit `8088f2e` ("Bootstrap DeliveryIA app skeleton"), **antes** do OpenSpec ter sido inicializado neste repositório. O roteiro "Fluxo de Delivery" recomenda que "a estrutura inicial do projeto e o mecanismo de autenticação estejam entre as primeiras entregas" — o objetivo aqui é registrar essa entrega no histórico de mudanças do OpenSpec, para rastreabilidade completa do processo de Spec-Driven Development, ainda que a implementação já existisse antes desta formalização.

## What Changes

- Formaliza como capability `estrutura-inicial` o scaffolding técnico já existente: projeto Next.js (App Router) com Tailwind, autenticação Clerk (middleware + rotas protegidas), schema Prisma inicial (`User`) apontando para Supabase Postgres, e setup de testes (Vitest + Playwright).
- Não introduz código novo — apenas os artefatos de especificação (`proposal.md`, `design.md`, `specs/`, `tasks.md`) descrevendo o que já está implementado e verificado.

## Capabilities

### New Capabilities
- `estrutura-inicial`: esqueleto técnico do projeto (Next.js, autenticação Clerk, Prisma/Supabase, Vitest/Playwright) que serve de base para todas as demais mudanças do roadmap.

## Impact

- **Afetados**: nenhum arquivo de código novo; documentação apenas (`openspec/changes/estrutura-inicial/**`).
- **Dependências**: nenhuma — é a base para `catalogo-lojas-produtos`, `carrinho-checkout`, `acompanhamento-pedido`, `recomendacao-ia` e `painel-lojista`.
- **Risco**: nenhum (change documental, sem alteração de código).

## Escopo Funcional

- Projeto Next.js 16 (App Router) com Tailwind CSS e TypeScript estrito.
- Autenticação via Clerk: middleware (`src/proxy.ts`) protegendo rotas, páginas de sign-in/sign-up, e um exemplo de rota protegida (`/dashboard`) usando `auth.protect()` em Server Component.
- Modelo `User` no Prisma espelhando o usuário do Clerk (`clerkId` único), com `prisma/schema.prisma` apontando para Supabase Postgres via `DATABASE_URL`/`DIRECT_URL`.
- Rota de health check (`/api/health`).
- Setup de testes: Vitest para unitários (`tests/unit/`) e Playwright para E2E (`tests/e2e/`), com um teste de cada tipo já presente.
- Documentação inicial: `README.md`, `AGENTS.md`, `.env.example`, e os templates em `docs/*.md` (posteriormente preenchidos nas mudanças de negócio).

## Dependências

- Nenhuma. É o ponto de partida do roadmap (`openspec/roadmap.md`).

## Riscos

- Nenhum risco de implementação (change documental). O único risco histórico já mitigado: ausência de credenciais reais (Clerk/Supabase) limita a execução de `npx playwright test` e `npx prisma db push` neste ambiente — documentado como pendência manual desde a primeira mudança de negócio.

## Execução de Linter Necessária

- `npm run lint` (já validado — sem erros).

## Testes Unitários Necessários

- `tests/unit/format.test.ts` (já existente desde o bootstrap).

## Testes de Integração Necessários

- Não aplicável nesta camada — não há regras de negócio no esqueleto técnico.

## Testes E2E Necessários

- `tests/e2e/home.spec.ts` (já existente desde o bootstrap, cobrindo o carregamento da home).
