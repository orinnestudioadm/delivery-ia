# DeliveryIA

Marketplace de delivery com recomendações por IA, construído com **Spec-Driven Development**: cada funcionalidade nasce como uma *change* do [OpenSpec](https://openspec.dev/), é implementada por agentes de IA, verificada com testes e só então arquivada nas especificações do projeto.

## Sumário

- [Visão geral](#visão-geral)
- [Stack tecnológica](#stack-tecnológica)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do ambiente](#configuração-do-ambiente)
- [Executando a aplicação](#executando-a-aplicação)
- [Testes](#testes)
- [Fluxo de mudanças (OpenSpec)](#fluxo-de-mudanças-openspec)
- [Documentação](#documentação)
- [Governança do agente de IA](#governança-do-agente-de-ia)

## Visão geral

O DeliveryIA conecta **clientes** a **lojas parceiras** e usa o histórico de pedidos para recomendar lojas relevantes. A definição do produto está em [docs/](./docs).

Estado do roadmap ([openspec/roadmap.md](./openspec/roadmap.md)):

| # | Change | Status |
|---|--------|--------|
| 0 | `estrutura-inicial` — Next.js, Clerk, Prisma, testes | arquivada |
| 1 | `catalogo-lojas-produtos` — lojas e cardápio | arquivada |
| 2 | `carrinho-checkout` — carrinho e pedido | arquivada |
| 3 | `acompanhamento-pedido` — status do pedido | arquivada |
| 4 | `recomendacao-ia` — recomendação por histórico | arquivada |
| 5 | `painel-lojista` — CRUD de cardápio + RBAC | arquivada |

## Stack tecnológica

- **Frontend e backend:** Next.js (App Router, Server Components e Server Actions), React, Tailwind CSS, TypeScript
- **Autenticação:** Clerk
- **Banco de dados:** Supabase (PostgreSQL) via Prisma ORM
- **Validação:** Zod
- **Testes:** Vitest (unitário e integração), Playwright (E2E)
- **Especificações:** OpenSpec
- **Deploy:** Vercel

## Estrutura do repositório

```text
.
├── .agents/skills/        # Skills do agente de IA
├── .claude/               # Comandos/skills do OpenSpec e agentes do Playwright (Claude Code)
├── .github/workflows/     # CI: lint, testes e Playwright
├── docs/                  # problem, prd, spec, architecture, design
├── openspec/
│   ├── config.yaml        # Contexto e regras do projeto para o OpenSpec
│   ├── roadmap.md         # Roadmap de mudanças
│   ├── changes/           # Changes em andamento e archive/
│   └── specs/             # Especificações vivas (uma pasta por capability)
├── prisma/schema.prisma   # Modelos de dados
├── specs/                 # Planos de teste E2E (Playwright)
├── src/
│   ├── app/               # Rotas (App Router)
│   └── lib/               # Camada de dados e regras de negócio
├── tests/
│   ├── unit/              # Vitest — funções puras
│   ├── integration/       # Vitest — camada de dados (Prisma mockado)
│   └── e2e/               # Playwright
├── AGENTS.md              # Regras e governança para agentes de IA
├── docker-compose.yml     # SonarQube (inspeção de código)
└── sonar-project.properties
```

## Pré-requisitos

- Node.js 22+ e npm
- Git
- Docker (opcional, para o SonarQube)
- Contas: GitHub, Vercel, Supabase e Clerk

## Configuração do ambiente

1. Copie `.env.example` para `.env` e preencha os valores (cada credencial indica onde obtê-la). O arquivo `.env` está no `.gitignore`.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Gere o cliente do Prisma e sincronize o schema com o banco:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

Sem as chaves do Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) a aplicação não inicia; sem `DATABASE_URL`/`DIRECT_URL` o Prisma não valida o schema.

## Executando a aplicação

```bash
npm run dev      # desenvolvimento em http://localhost:3000
npm run build    # build de produção
npm run start    # servidor de produção
```

## Testes

```bash
npm run lint         # ESLint
npm run test         # Vitest: unitários + integração
npx playwright test  # E2E (Playwright)
```

**E2E com Clerk.** O Playwright usa `@clerk/testing` (`tests/e2e/global.setup.ts` e `tests/e2e/support/auth.ts`). Para ativar a suíte, configure no `.env` as chaves do Clerk **e** um usuário de teste criado no dashboard do Clerk (instância de desenvolvimento, login por senha):

```dotenv
E2E_CLERK_USER_USERNAME=usuario-de-teste@example.com
E2E_CLERK_USER_PASSWORD=senha-do-usuario-de-teste
```

Sem essas credenciais os testes E2E são **ignorados (skipped)**, não executados. O plano de testes do login está em [specs/login-flow-test-plan.md](./specs/login-flow-test-plan.md) e a suíte correspondente em `tests/e2e/login-flow.spec.ts`. Os agentes `playwright-test-planner`, `-generator` e `-healer` estão em `.claude/agents/` (MCP em `.mcp.json`).

Os testes de integração mockam o Prisma; ainda não há teste contra um banco real.

**Painel do lojista.** `/store-admin` só abre para usuários com `publicMetadata.role = "STORE_OWNER"` no Clerk e uma `Store` associada (`Store.ownerId`). Não há tela para atribuir o papel ou criar a loja: configure-os manualmente (passos em [openspec/roadmap.md](./openspec/roadmap.md)).

## Fluxo de mudanças (OpenSpec)

Cada mudança segue o ciclo **propose → apply → verify → archive**:

```bash
openspec view                       # progresso geral
openspec list --changes             # changes em andamento
openspec validate <change>          # valida os artefatos
openspec archive <change> --yes     # arquiva e sincroniza as specs
```

No Claude Code, use os comandos `/opsx:explore`, `/opsx:propose`, `/opsx:apply` e `/opsx:archive`. Cada change arquivada guarda `proposal.md`, `design.md`, `specs/`, `tasks.md` e um `VERIFICATION.md` com os comandos executados e seus resultados.

## Documentação

- [Definição do problema](./docs/problem.md)
- [PRD — requisitos do produto](./docs/prd.md)
- [Especificação técnica e casos de uso](./docs/spec.md)
- [Arquitetura](./docs/architecture.md)
- [Design e UX](./docs/design.md)
- [Roadmap de mudanças](./openspec/roadmap.md)

## Governança do agente de IA

Comportamento, comandos seguros e regras de qualidade para agentes estão em [AGENTS.md](./AGENTS.md).
