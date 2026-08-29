# 🚀 DeliveryIA Project

Projeto estruturado com base no **Fluxo de Delivery (Spec-Driven Development)**, utilizando stack moderna com Next.js, Clerk, Supabase, Prisma e automação de testes com Playwright.

---

## 📑 Sumário

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Executando a Aplicação](#executando-a-aplicação)
- [Testes](#testes)
- [Documentação Completa](#documentação-completa)

---

## 🌟 Visão Geral

Este repositório implementa um ciclo ágil e controlado de desenvolvimento orientado a especificações (Spec-Driven Development), garantindo governança com agentes de IA, cobertura de testes e entrega contínua.

> **Status atual:** este repositório contém o esqueleto técnico da stack (Next.js + Clerk + Prisma + Playwright) funcionando de ponta a ponta. Os documentos em `docs/problem.md`, `docs/prd.md` e `docs/spec.md` ainda são templates a preencher — as próximas funcionalidades de negócio devem ser guiadas por eles antes de serem implementadas.

Consulte a pasta [docs/](./docs) para os documentos de descoberta e produto:
- [Definição do Problema](./docs/problem.md)
- [PRD (Documento de Requisitos)](./docs/prd.md)
- [Especificação Técnica](./docs/spec.md)
- [Arquitetura](./docs/architecture.md)
- [Design e UX](./docs/design.md)

---

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide Icons
- **Backend / ORM:** Next.js API / NestJS, Prisma ORM
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** Clerk
- **Testes:** Playwright (E2E), Jest / Vitest (Unitários e Integração)
- **Deploy:** Vercel

---

## 📂 Estrutura do Repositório

`	ext
├── .agents/          # Skills e configurações do agente de IA
├── docs/             # Documentação de arquitetura, PRD, spec e design
│   ├── architecture.md
│   ├── design.md
│   ├── prd.md
│   ├── problem.md
│   └── spec.md
├── src/              # Código-fonte da aplicação (App Router, componentes, lib)
├── tests/            # Testes automatizados (E2E e unitários)
├── .env              # Variáveis de ambiente locais
├── .gitignore        # Arquivos ignorados pelo Git
├── AGENTS.md         # Regras de governança e comportamento do agente de IA
└── README.md         # Documentação principal
`

---

## ⚙️ Configuração do Ambiente

1. Configure as variáveis no arquivo \.env\.
2. Instale as dependências com \
pm install\.
3. Sincronize o banco de dados com \
px prisma db push\.

---

## ▶️ Executando a Aplicação

`ash
# Modo desenvolvimento
npm run dev

# Build de produção
npm run build
npm run start
`

---

## 🧪 Testes

`ash
# Executar testes unitários
npm run test

# Executar testes E2E com Playwright
npx playwright test
`

---

## 🤖 Governança do Agente de IA

As diretrizes de comportamento do agente, comandos seguros e regras de qualidade estão formalizadas em [AGENTS.md](./AGENTS.md).