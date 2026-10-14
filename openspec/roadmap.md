# Roadmap de Mudanças — DeliveryIA

Roadmap incremental derivado de `docs/prd.md` e `docs/spec.md`, seguindo o ciclo `/opsx:propose` → `/opsx:apply` → verify → `/opsx:archive` para cada mudança. Nenhuma mudança tem tamanho/complexidade/risco maior que médio.

## Iterações

0. **`estrutura-inicial`** — status: **implementado e arquivado** (documentação retroativa do bootstrap técnico: Next.js, Clerk, Prisma/Supabase, Vitest/Playwright — commit `8088f2e`, anterior à inicialização do OpenSpec neste repositório).
1. **`catalogo-lojas-produtos`** — status: **implementado e arquivado**. Listagem de lojas e cardápio (RF01, UC01, UC02). Depende de (0).
2. **`carrinho-checkout`** — status: **implementado e arquivado**. Carrinho e finalização de pedido (RF04, UC03, UC04). Depende de (1).
3. **`acompanhamento-pedido`** — status: **implementado e arquivado**. Status do pedido (RF05, UC05). Depende de (2).
4. **`recomendacao-ia`** — status: **implementado e arquivado**. Recomendação por histórico (RF06, UC06). Depende de (1) e (2).
5. **`painel-lojista`** — status: **implementado e arquivado**. CRUD de cardápio + RBAC (RF07, RNF02, UC07). Depende de (1). Papel `STORE_OWNER` via `publicMetadata.role` do Clerk; remoção de produto é *soft delete*.
6. **`api-rest-exposure`** — status: **implementado e arquivado**. Checkout e CRUD de produto do lojista expostos como API REST versionada em `/api/v1` (RNF-03), substituindo as Server Actions equivalentes. Depende de (2) e (5).
7. **`painel-lojista-pedidos`** — status: **implementado e arquivado**. Lojista vê os pedidos recebidos pela própria loja e atualiza o status (`PATCH /api/v1/store-admin/orders/{id}/status`), RF08/UC08. Depende de (3), (5) e (6). Fecha a Jornada 2 (lojista) ponta a ponta — as duas jornadas de negócio exigidas pelo regulamento estão completas.

Cada `proposal.md` em `openspec/changes/<mudança>/` detalha escopo funcional, dependências, riscos e testes (unitários/integração/E2E) necessários, conforme exigido pelo roteiro — nenhuma mudança é considerada concluída sem os testes correspondentes.

Acompanhe o progresso com:

```
openspec view
openspec list --changes
```

## Pendências manuais (fora do escopo do agente)

### Concluídas (2026-10-14)

- **Credenciais em `.env`**: Clerk, Supabase e `DATABASE_URL`/`DIRECT_URL` preenchidos. `CONTEXT7_API_KEY`, `STITCH_API_KEY`, `VERCEL_API_TOKEN`, `SUPABASE_ACCESS_TOKEN`, `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` e `CLERK_JWT_KEY` seguem em branco — nenhum é lido pelo código da aplicação (só o roteiro original os previa), não bloqueiam nada.
- **Deploy Vercel**: repositório conectado, variáveis de produção configuradas (as mesmas chaves de dev — ver README). Aplicação publicada e testada.
- **Testes E2E (Playwright + Clerk)**: ativados e executados de verdade pela primeira vez. Dois usuários de teste dedicados criados no Clerk (`E2E_CLERK_USER_*`/`E2E_CLERK_OWNER_*`, preenchidos no `.env` e como secrets do GitHub). Foi preciso desligar **"Challenge suspicious sign-ups"** e **"Device Trust"** no dashboard do Clerk (bloqueavam login automatizado) e corrigir três bugs nunca detectados por falta de execução real: token de teste não propagava para os workers paralelos (`playwright.config.ts` agora usa `globalSetup` de verdade em vez de uma "setup project"), um seletor de header casava com um link errado por correspondência frouxa de texto, e um teste que trocava de sessão cliente↔lojista quebrava por reaproveitar uma sessão já aberta. Resultado: **14/18 testes passam**; `checkout`, `stores`, `order-tracking` e `recommendations` seguem com `test.skip` fixo — seus seletores nunca foram validados contra a UI real e ainda podem ter o mesmo tipo de bug; validar um de cada vez com o agente `playwright-test-healer` antes de destravar.
- **Configurar o primeiro lojista (`painel-lojista`)**: feito para o usuário de teste E2E (`usuariolojista@gmail.com`, `publicMetadata.role = STORE_OWNER`, `Store` "Loja de Teste E2E" com um produto ativo). Para promover outra conta a lojista, repetir os mesmos dois passos (metadata no Clerk + linha em `Store` com `ownerId` apontando para o `User` local).
- **SonarQube → SonarCloud**: trocado de SonarQube local (Docker, nunca instalado nesta máquina) para **SonarCloud** (`sonarcloud.io`, projeto `orinnestudioadm_delivery-ia`), com "Automatic Analysis" desligado em favor da análise via CI. `vitest.config.ts` ganhou `@vitest/coverage-v8` para gerar `coverage/lcov.info` de verdade (antes a propriedade apontava para um arquivo que nunca existia). Job `sonar` no workflow do CI, gated pelo secret `SONAR_TOKEN` (já configurado).
- **CI/CD (GitHub Actions)**: estava falhando em todo push desde 21/set — causa raiz era uma dependência opcional do `sharp` (usado pelo Next.js) não gravada no `package-lock.json` neste ambiente Windows. Corrigido fixando `@emnapi/core`/`@emnapi/runtime` como devDependencies diretas. Todos os 3 jobs (lint/testes, E2E, SonarCloud) passam no momento desta edição.
- **Clerk de produção**: avaliado e descartado por decisão do usuário — instâncias de produção do Clerk exigem domínio próprio verificado por DNS, que o projeto não tem. A instância de desenvolvimento atende perfeitamente a um deploy de projeto acadêmico (limites de uso generosos; só exibe um aviso discreto de "Development mode" nos widgets do Clerk).

### Ainda pendentes

- **MCP Servers (Stitch, Context7)**: configuração em `mcp_config.json` ou UI do Antigravity (preencher com as respectivas API keys quando disponíveis).
- **Protótipos no Stitch**: exploração de telas via projeto Stitch — depende de login na conta Google/Stitch do usuário.
- **Destravar os 4 `test.skip` fixos restantes** (`checkout`, `stores`, `order-tracking`, `recommendations`): converter para o padrão condicional (`test.skip(!hasTestUser(), ...)`) e validar contra a UI real, um de cada vez, corrigindo seletores/timeouts como foi feito em `login-flow.spec.ts` e `store-admin.spec.ts`.
