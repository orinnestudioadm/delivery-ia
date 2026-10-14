# 10. Modelos C4 — DeliveryIA

Contexto, contêineres, componentes, classes (modelo de domínio) e implantação, em Mermaid. Reflete o código real em `src/` e `prisma/schema.prisma` nesta data — não um desenho aspiracional.

## 10.1 Diagrama de Contexto

```mermaid
C4Context
    title DeliveryIA — Contexto do sistema

    Person(cliente, "Cliente", "Pede comida/produtos e acompanha o pedido")
    Person(lojista, "Lojista Parceiro", "Mantém o cardápio da própria loja")

    System(deliveryia, "DeliveryIA", "Marketplace de delivery com recomendação por histórico")

    System_Ext(clerk, "Clerk", "Autenticação e papéis de usuário (Cliente / Lojista)")
    System_Ext(supabase, "Supabase", "PostgreSQL gerenciado")

    Rel(cliente, deliveryia, "Navega, pede e acompanha", "HTTPS")
    Rel(lojista, deliveryia, "Gerencia o cardápio", "HTTPS")
    Rel(deliveryia, clerk, "Autentica sessão e lê papel do usuário", "HTTPS/API")
    Rel(deliveryia, supabase, "Lê e grava dados via Prisma", "TCP/TLS")
```

## 10.2 Diagrama de Contêineres

```mermaid
C4Container
    title DeliveryIA — Contêineres

    Person(cliente, "Cliente")
    Person(lojista, "Lojista Parceiro")

    System_Boundary(deliveryia, "DeliveryIA") {
        Container(web, "Aplicação Next.js", "Next.js 16 (App Router), TypeScript", "Server Components, Server Actions e rotas REST sob /api/v1; serve HTML e expõe a API")
        ContainerDb(db, "Banco de dados", "PostgreSQL (Supabase)", "Usuários, lojas, produtos, pedidos, itens de pedido")
    }

    System_Ext(clerk, "Clerk", "Autenticação / RBAC")

    Rel(cliente, web, "HTTPS")
    Rel(lojista, web, "HTTPS")
    Rel(web, clerk, "Valida sessão, lê publicMetadata.role", "HTTPS/API")
    Rel(web, db, "Prisma Client", "TCP/TLS")
```

## 10.3 Diagrama de Componentes (dentro do contêiner Next.js)

```mermaid
C4Component
    title DeliveryIA — Componentes da aplicação Next.js

    Container_Boundary(web, "Aplicação Next.js") {
        Component(pages, "Páginas (Server Components)", "src/app/**/page.tsx", "Dashboard, lojas, cardápio, pedido, painel do lojista — leitura via camada de dados")
        Component(api, "API REST (/api/v1)", "Route Handlers", "Endpoints versionados para checkout e CRUD de produto do lojista (RNF-03)")
        Component(access, "Controle de acesso", "src/app/store-admin/access.ts, src/lib/roles.ts", "Resolve papel via Clerk e contexto do lojista autenticado")
        Component(dataLayer, "Camada de dados", "src/lib/stores.ts, orders.ts, store-admin.ts, recommendations.ts, cart.ts, price.ts, order-status.ts", "Regras de negócio e validação Zod, isoladas do transporte HTTP")
        ComponentDb(prismaClient, "Prisma Client", "src/lib/prisma.ts", "Acesso tipado ao PostgreSQL")
    }

    System_Ext(clerk, "Clerk")
    ContainerDb(db, "PostgreSQL (Supabase)")

    Rel(pages, dataLayer, "Chama diretamente (SSR)")
    Rel(api, dataLayer, "Chama as mesmas funções de domínio")
    Rel(api, access, "Verifica papel antes de mutar")
    Rel(pages, clerk, "auth.protect() / currentUser()")
    Rel(dataLayer, prismaClient, "Consulta/grava")
    Rel(prismaClient, db, "SQL via pool")
```

## 10.4 Diagrama de Classes (modelo de domínio)

```mermaid
classDiagram
    class User {
        +String id
        +String clerkId
        +String email
        +String? name
        +UserRole role
    }
    class Store {
        +String id
        +String name
        +String category
        +Float rating
        +Boolean isActive
        +String ownerId
    }
    class Product {
        +String id
        +String name
        +String description
        +Int priceInCents
        +Boolean isActive
        +String storeId
    }
    class Order {
        +String id
        +String userId
        +String storeId
        +Int totalInCents
        +OrderStatus status
        +DateTime createdAt
    }
    class OrderItem {
        +String id
        +String orderId
        +String productId
        +Int quantity
        +Int unitPriceInCents
    }
    class UserRole {
        <<enumeration>>
        CUSTOMER
        STORE_OWNER
    }
    class OrderStatus {
        <<enumeration>>
        RECEIVED
        PREPARING
        ON_THE_WAY
        DELIVERED
        CANCELED
    }

    User "1" --> "0..*" Store : owns (ownerId)
    User "1" --> "0..*" Order : places
    Store "1" --> "0..*" Product : lists
    Store "1" --> "0..*" Order : receives
    Order "1" --> "1..*" OrderItem : contains
    Product "1" --> "0..*" OrderItem : referenced by
    User ..> UserRole
    Order ..> OrderStatus
```

> `OrderItem.unitPriceInCents` é um *snapshot* do preço no momento da compra (decisão registrada em `openspec/changes/archive/.../carrinho-checkout/design.md`), por isso não há uma referência viva a `Product.priceInCents`.

## 10.5 Diagrama de Implantação

```mermaid
C4Deployment
    title DeliveryIA — Implantação

    Deployment_Node(browser, "Navegador do usuário", "Cliente/Lojista") {
        Container(spa, "DeliveryIA (renderizado)", "HTML/CSS/JS")
    }

    Deployment_Node(vercelEdge, "Vercel", "Plataforma de hospedagem") {
        Deployment_Node(vercelRuntime, "Runtime Next.js", "Node.js") {
            Container(app, "Aplicação Next.js", "App Router + API REST /api/v1")
        }
    }

    Deployment_Node(clerkCloud, "Clerk Cloud", "SaaS") {
        Container(clerkSvc, "Serviço de autenticação", "API Clerk")
    }

    Deployment_Node(supabaseCloud, "Supabase", "SaaS") {
        Deployment_Node(pg, "PostgreSQL gerenciado") {
            ContainerDb(dbInst, "Banco DeliveryIA")
        }
    }

    Rel(spa, app, "HTTPS")
    Rel(app, clerkSvc, "HTTPS/API")
    Rel(app, dbInst, "TLS (pooled connection, Prisma)")
```

## Status de publicação

Este diagrama de implantação descreve a topologia **alvo** (Vercel + Supabase + Clerk), consistente com `docs/architecture.md`. A publicação efetiva em produção — com endereço e credenciais de acesso — depende das contas e tokens listados em `openspec/roadmap.md` → "Pendências manuais", ainda não fornecidos.
