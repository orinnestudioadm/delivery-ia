## Purpose
Fornece a base técnica (autenticação, persistência e testes) sobre a qual as demais capabilities do DeliveryIA são construídas.

## ADDED Requirements

### Requirement: Autenticação de usuários via Clerk
O sistema SHALL exigir autenticação via Clerk para acessar rotas privadas, redirecionando usuários não autenticados para o fluxo de login.

#### Scenario: Acesso a uma rota protegida sem sessão
- **WHEN** um usuário não autenticado tenta acessar uma rota protegida (ex.: `/dashboard`)
- **THEN** o sistema redireciona para o fluxo de login do Clerk

### Requirement: Persistência via Prisma/Supabase
O sistema SHALL persistir os dados de domínio via Prisma ORM contra um banco Postgres (Supabase), com um modelo `User` espelhando o usuário autenticado do Clerk.

#### Scenario: Schema Prisma válido
- **WHEN** o schema Prisma é validado (`npx prisma validate`)
- **THEN** a validação é bem-sucedida, confirmando a configuração do datasource e dos modelos

### Requirement: Automação de testes
O sistema SHALL contar com suíte de testes unitários (Vitest) e E2E (Playwright) executáveis via `npm run test` e `npx playwright test`, respectivamente.

#### Scenario: Execução da suíte de testes unitários
- **WHEN** `npm run test` é executado
- **THEN** todos os testes unitários e de integração passam
