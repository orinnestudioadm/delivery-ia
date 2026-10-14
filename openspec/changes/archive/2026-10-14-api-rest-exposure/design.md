## Context

`docs/architecture.md` sempre deixou as duas opções em aberto ("Backend/API: ... Next.js Server Actions / Route Handlers"), e as mudanças `carrinho-checkout` e `painel-lojista` escolheram Server Actions por simplicidade. A rubrica da disciplina fechou essa escolha: RNF-03 exige exposição exclusivamente via API RESTful sobre HTTP/HTTPS.

## Goals / Non-Goals

**Goals:**
- Expor as duas operações de escrita do domínio (checkout, CRUD de produto) como endpoints REST versionados, com contrato JSON e códigos de status HTTP convencionais.
- Não duplicar regra de negócio: os Route Handlers chamam exatamente as mesmas funções de `src/lib/orders.ts` e `src/lib/store-admin.ts` que as Server Actions chamavam.
- Manter a UX atual (mesmos formulários, mesmo feedback de erro/sucesso).

**Non-Goals:**
- Reescrever as páginas de leitura (lojas, cardápio, dashboard, pedido) como consumidoras da própria API REST. Em uma aplicação Next.js full-stack, o Server Component que renderiza a página **é** o servidor — chamá-lo de "funcionalidade exposta" e forçá-lo a dar uma volta por HTTP nele mesmo não atende a nenhuma necessidade real de interoperabilidade; a leitura continua direta via `src/lib/*` nos Server Components, como o resto do projeto já faz.
- Autenticação por token para consumidores externos (ex.: API key) — fora do escopo desta change; a API REST ainda depende da sessão do Clerk no navegador.

## Decisions

- **Prefixo de rota**: `/api/v1`, usando o valor já reservado em `.env.example` (`GLOBAL_PREFIX=api/v1`) desde o bootstrap do projeto.
- **Autenticação em Route Handler**: `auth.protect()` (usado nas páginas) redireciona para `/sign-in` quando não há sessão — comportamento errado para uma API JSON. Os Route Handlers usam `const { userId } = await auth()` e retornam `401` explicitamente quando `userId` é nulo.
- **Reuso do contexto do lojista**: `src/app/store-admin/access.ts` ganhou `resolveStoreOwnerApiContext()`, que compartilha a resolução de papel/loja (`buildStoreOwnerContext`) com `resolveStoreOwnerContext()` (usada pela página), mas sem o redirecionamento do `auth.protect()`.
- **Preço nunca confiado no cliente**: inalterado — `createOrder` e `createProduct`/`updateProduct` continuam validando e recalculando no servidor; os Route Handlers só repassam o corpo da requisição.
- **Revalidação de cache**: como a mutação não acontece mais dentro do ciclo de renderização da página (é uma chamada `fetch` separada do componente cliente), o Route Handler chama `revalidatePath` e o componente cliente chama `router.refresh()` após sucesso, para a lista renderizada no servidor refletir a mudança.

## Risks / Trade-offs

- Perda da progressive enhancement nativa das Server Actions (formulário funciona sem JS) — aceito, já que a aplicação já depende de JavaScript no cliente para carrinho e outras interações.
- Duas formas de "ação de formulário" convivendo no código (REST aqui, nenhuma Server Action restante nos fluxos de escrita) — mitigado removendo as Server Actions equivalentes nesta mesma change, para não deixar os dois padrões coexistindo sem necessidade.
