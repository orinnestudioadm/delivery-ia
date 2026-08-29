# 4. Arquitetura do Sistema (Architecture) - DeliveryIA

## 4.1 Visão Geral da Arquitetura
- **Frontend**: Next.js (App Router), React, Tailwind CSS.
- **Backend / API**: NestJS / Fastify / Next.js Server Actions / Route Handlers.
- **Autenticação**: Clerk (JWT / JWKS).
- **Banco de Dados & Storage**: Supabase (PostgreSQL + Prisma ORM).
- **Hospedagem & Deploy**: Vercel.
- **Automação de Testes**: Playwright (E2E) e Jest/Vitest (Unitário/Integração).

## 4.2 Diagrama de Componentes
`mermaid
graph TD
    Client[Cliente / Navegador] -->|HTTPS| Frontend[Next.js Frontend]
    Frontend -->|Auth Token| Clerk[Clerk Auth Provider]
    Frontend -->|REST API / RPC| Backend[Backend API / Next Server]
    Backend -->|Prisma Client| Supabase[(Supabase / PostgreSQL)]
`

## 4.3 Padrões de Segurança e Integração
- Validação de entrada com Zod.
- Proteção de rotas com middleware de autenticação Clerk.
- Conexão segura com banco via Pooling Supabase / Prisma.