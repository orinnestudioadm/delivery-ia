"use client";

import { useActionState } from "react";
import type { ActionState } from "./types";

type ProductFormProps = {
  action: (previous: ActionState, formData: FormData) => Promise<ActionState>;
  idPrefix: string;
  submitLabel: string;
  defaults?: { name: string; description: string; price: string };
};

const inputClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/15";

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

export function ProductForm({ action, idPrefix, submitLabel, defaults }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

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
  action,
  productName,
}: {
  action: (previous: ActionState) => Promise<ActionState>;
  productName: string;
}) {
  const [state, formAction, isPending] = useActionState(action, null);

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
