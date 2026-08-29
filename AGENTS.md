# AGENTS.md - Governança, Comportamento e Diretrizes do Agente

Este arquivo define os padrões de comportamento, governança, stack tecnológica e regras operacionais para qualquer agente de IA (Antigravity, Claude Code, Cursor, Codex, Opencode) atuando no **DeliveryIA Project**.

---

## 1. Comportamento e Princípios Gerais

- **Ciclo Planejar/Executar (Research -> Plan -> Implement):**
  - **Pesquisa (Research):** Ler documentos em \docs/*\, entender o código existente e inspecionar dependências antes de modificar código.
  - **Planejamento (Plan):** Propor planos estruturados para alterações arquiteturais ou novos fluxos.
  - **Implementação (Implement):** Executar modificações atômicas, mantendo integridade de testes e padrões de código.
- **Context7 MCP:** Sempre que houver dúvidas sobre versões recentes de bibliotecas ou APIs (Next.js, Clerk, Supabase, Prisma, Playwright), consulte o Context7 MCP para obter documentação atualizada.
- **Integridade de Documentação:** Preserve comentários e documentações existentes não relacionados às mudanças solicitadas.

---

## 2. Stack Tecnológica

- **Frontend:** Next.js (App Router), React, Tailwind CSS, TypeScript.
- **Autenticação:** Clerk (\@clerk/nextjs\).
- **Banco de Dados & ORM:** Supabase (PostgreSQL), Prisma ORM (\@prisma/client\).
- **Testes:** Playwright (E2E), Jest / Vitest (Unit / Integration).
- **Infra & Deploy:** Vercel, Docker.

---

## 3. Governança e Autonomia no Terminal

### Ações Autônomas Permitidas
- Leitura e busca de arquivos no repositório.
- Criação e edição de arquivos de código, testes e documentação no escopo da tarefa.
- Execução de comandos de checagem: \
pm test\, \
px playwright test\, \
pm run lint\, \
px prisma validate\, \
px prisma generate\.
- Instalação de dependências acordadas: \
pm install <pacote>\.

### Ações Que Exigem Confirmação do Usuário
- Execução de migrações destrutivas no banco de dados (\prisma migrate reset\, \DROP TABLE\).
- Exclusão de múltiplos arquivos ou diretórios inteiros.
- Comandos que alterem branches remotas no Git (\git push --force\).

---

## 4. Comandos Principais do Projeto

- **Setup & Dependências:** \
pm install\
- **Banco de Dados:**
  - Gerar cliente: \
px prisma generate\
  - Sincronizar schema (dev): \
px prisma db push\
  - Criar migration: \
px prisma migrate dev --name <nome>\
- **Build & Execução:**
  - Modo dev: \
pm run dev\
  - Build produção: \
pm run build\
- **Qualidade & Testes:**
  - Linter: \
pm run lint\
  - Testes unitários: \
pm run test\
  - Testes E2E: \
px playwright test\

---

## 5. Regras de Qualidade, Testes e Logging

- **Testes Obrigatórios:** Toda nova funcionalidade ou correção de bug deve vir acompanhada do respectivo caso de teste (Unitário, Integração ou E2E Playwright).
- **TypeScript Estrito:** Não utilizar \ny\ implícito. Definir interfaces e tipos claros com validação Zod para I/O.
- **Logging:** Usar logs estruturados com níveis apropriados (\debug\, \info\, \warn\, \error\). Nunca logar tokens sensíveis ou chaves de API.

---

## 6. Referências da Documentação

Consulte os arquivos na pasta \docs/\ para especificações detalhadas:
- [docs/problem.md](./docs/problem.md)
- [docs/prd.md](./docs/prd.md)
- [docs/spec.md](./docs/spec.md)
- [docs/architecture.md](./docs/architecture.md)
- [docs/design.md](./docs/design.md)

---

## 7. Aprendizado Contínuo e Reflexão

Ao final de cada tarefa complexa ou sessão:
1. Reflita sobre o que foi executado e eventuais atritos ocorridos no fluxo.
2. Sugira melhorias para este arquivo \AGENTS.md\ ou para os scripts de automação.
3. Mantenha os documentos em \docs/\ atualizados com o estado real da aplicação.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
