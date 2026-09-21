## Context

O projeto começou com um bootstrap único (commit `8088f2e`) que já entregou a stack completa descrita em `docs/architecture.md`, antes de o OpenSpec ser inicializado neste repositório. Esta change existe apenas para dar rastreabilidade retroativa a essa entrega, sem alterar nenhum código.

## Goals / Non-Goals

**Goals:**
- Registrar formalmente, como uma capability do OpenSpec, a base técnica sobre a qual todas as mudanças de negócio (`catalogo-lojas-produtos`, `carrinho-checkout`, `acompanhamento-pedido`, `recomendacao-ia`, `painel-lojista`) foram construídas.
- Permitir que `openspec view`/`openspec list --specs` reflitam o projeto completo, incluindo a fundação técnica.

**Non-Goals:**
- Reimplementar ou alterar qualquer parte do esqueleto técnico — ele já está em produção de código (commit `8088f2e`) e validado pelas mudanças subsequentes.

## Decisions

- Esta change não segue o ciclo "propose antes do apply" como as demais — o "apply" já aconteceu (fora do OpenSpec, no commit inicial). Ela é criada com todos os artefatos completos de uma vez e arquivada imediatamente após validação, funcionando como um registro histórico.

## Risks / Trade-offs

- Nenhum — é puramente documental.
