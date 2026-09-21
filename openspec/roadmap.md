# Roadmap de Mudanças — DeliveryIA

Roadmap incremental derivado de `docs/prd.md` e `docs/spec.md`, seguindo o ciclo `/opsx:propose` → `/opsx:apply` → verify → `/opsx:archive` para cada mudança. Nenhuma mudança tem tamanho/complexidade/risco maior que médio.

## Iterações

0. **`estrutura-inicial`** — status: **implementado e arquivado** (documentação retroativa do bootstrap técnico: Next.js, Clerk, Prisma/Supabase, Vitest/Playwright — commit `8088f2e`, anterior à inicialização do OpenSpec neste repositório).
1. **`catalogo-lojas-produtos`** — status: **implementado e arquivado**. Listagem de lojas e cardápio (RF01, UC01, UC02). Depende de (0).
2. **`carrinho-checkout`** — status: **implementado e arquivado**. Carrinho e finalização de pedido (RF04, UC03, UC04). Depende de (1).
3. **`acompanhamento-pedido`** — status: **implementado e arquivado**. Status do pedido (RF05, UC05). Depende de (2).
4. **`recomendacao-ia`** — status: **implementado e arquivado**. Recomendação por histórico (RF06, UC06). Depende de (1) e (2).
5. **`painel-lojista`** — status: draft. CRUD de cardápio + RBAC (RF07, RNF02, UC07). Depende de (1).

Cada `proposal.md` em `openspec/changes/<mudança>/` detalha escopo funcional, dependências, riscos e testes (unitários/integração/E2E) necessários, conforme exigido pelo roteiro — nenhuma mudança é considerada concluída sem os testes correspondentes.

Acompanhe o progresso com:

```
openspec view
openspec list --changes
```

## Pendências manuais (fora do escopo do agente)

Itens do roteiro "Fluxo de Delivery" que dependem de ações do usuário fora desta sessão (contas externas, UI de outra IDE ou serviços web interativos):

- **Credenciais em `.env`**: preencher `CONTEXT7_API_KEY`, `STITCH_API_KEY`, `VERCEL_API_TOKEN`, `SUPABASE_ACCESS_TOKEN`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_JWT_KEY` (ver `.env.example` para onde obter cada valor).
- **MCP Servers (Stitch, Context7)**: configuração em `mcp_config.json` ou UI do Antigravity (preencher com as respectivas API keys quando disponíveis).
- **Protótipos no Stitch**: exploração de telas via projeto Stitch — depende de login na conta Google/Stitch do usuário.
- **SonarQube**: arquivos `docker-compose.yml` e `sonar-project.properties` já criados no repositório. Para executar: rodar `docker compose up -d sonarqube`, acessar `http://localhost:9000`, criar o projeto `deliveryia` e disparar o scanner com o token gerado.
- **Deploy Vercel**: conectar o repositório e configurar variáveis de ambiente de produção.
