"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "./types";

type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  idPrefix: string;
  submitLabel: string;
  defaults?: { name: string; description: string; price: string };
};

const inputClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/15";

// Calls the REST endpoint directly (RNF-03) — no Server Action involved.
// Next.js only lets Server Actions cross the server/client boundary as
// props, so this function has to live in the client component itself.
async function submitProduct(
  mode: "create" | "edit",
  productId: string | undefined,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const payload = {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
  };
  const url = mode === "create" ? "/api/v1/store-admin/products" : `/api/v1/store-admin/products/${productId}`;

  const res = await fetch(url, {
    method: mode === "create" ? "POST" : "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string };

  if (!res.ok) {
    return { error: body.error ?? "Não foi possível salvar o produto." };
  }
  return { success: mode === "create" ? "Produto criado." : "Produto atualizado." };
}

// useActionState also passes the previous state, which removal does not need.
async function submitRemoval(productId: string): Promise<ActionState> {
  const res = await fetch(`/api/v1/store-admin/products/${productId}`, { method: "DELETE" });
  const body = (await res.json().catch(() => ({}))) as { error?: string };

  if (!res.ok) {
    return { error: body.error ?? "Não foi possível remover o produto." };
  }
  return { success: "Produto removido." };
}

function Feedback({ state }: { state: ActionState }) {
  if (state?.error) {
    return (
      <p role="alert" className="text-sm text-red-600 dark:text-red-400">
        {state.error}
      </p>
    );
  }
  if (state?.success) {
    return (
      <p role="status" className="text-sm text-green-700 dark:text-green-400">
        {state.success}
      </p>
    );
  }
  return null;
}

export function ProductForm({ mode, productId, idPrefix, submitLabel, defaults }: ProductFormProps) {
  const router = useRouter();
  const action = submitProduct.bind(null, mode, productId);
  const [state, formAction, isPending] = useActionState(action, null);

  // The list rendered by the page is server-fetched; refresh it after a
  // successful REST mutation so it reflects the new data.
  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="grid gap-3">
      <div className="grid gap-1">
        <label htmlFor={`${idPrefix}-name`} className="text-sm font-medium">
          Nome
        </label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          required
          maxLength={80}
          defaultValue={defaults?.name}
          className={inputClass}
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor={`${idPrefix}-description`} className="text-sm font-medium">
          Descrição
        </label>
        <textarea
          id={`${idPrefix}-description`}
          name="description"
          rows={2}
          maxLength={300}
          defaultValue={defaults?.description}
          className={inputClass}
        />
      </div>
      <div className="grid gap-1">
        <label htmlFor={`${idPrefix}-price`} className="text-sm font-medium">
          Preço (R$)
        </label>
        <input
          id={`${idPrefix}-price`}
          name="price"
          required
          inputMode="decimal"
          placeholder="12,90"
          defaultValue={defaults?.price}
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
        >
          {isPending ? "Salvando..." : submitLabel}
        </button>
        <Feedback state={state} />
      </div>
    </form>
  );
}

export function RemoveProductForm({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const action = submitRemoval.bind(null, productId);
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex items-center gap-3">
      <button
        type="submit"
        disabled={isPending}
        aria-label={`Remover ${productName}`}
        className="rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-600 hover:bg-red-500/10 disabled:opacity-40 dark:text-red-400"
      >
        {isPending ? "Removendo..." : "Remover"}
      </button>
      <Feedback state={state} />
    </form>
  );
}
