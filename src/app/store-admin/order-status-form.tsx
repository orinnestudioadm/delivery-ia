"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status";
import type { ActionState } from "./types";

// Calls the REST endpoint directly (RNF-03) — see
// src/app/api/v1/store-admin/orders/[id]/status/route.ts.
async function submitStatusChange(
  orderId: string,
  nextStatus: OrderStatus,
): Promise<ActionState> {
  const res = await fetch(`/api/v1/store-admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: nextStatus }),
  });
  const body = (await res.json().catch(() => ({}))) as { error?: string };

  if (!res.ok) {
    return { error: body.error ?? "Não foi possível atualizar o status." };
  }
  return { success: `Status atualizado para "${ORDER_STATUS_LABELS[nextStatus]}".` };
}

export function OrderStatusForm({
  orderId,
  nextStatus,
  variant = "default",
}: {
  orderId: string;
  nextStatus: OrderStatus;
  variant?: "default" | "danger";
}) {
  const router = useRouter();
  const action = submitStatusChange.bind(null, orderId, nextStatus);
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  const label =
    nextStatus === "CANCELED" ? "Cancelar pedido" : `Avançar para "${ORDER_STATUS_LABELS[nextStatus]}"`;
  const className =
    variant === "danger"
      ? "rounded-full border border-red-500/40 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 disabled:opacity-40 dark:text-red-400"
      : "rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-40";

  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <button type="submit" disabled={isPending} className={className}>
        {isPending ? "Enviando..." : label}
      </button>
      {state?.error && (
        <span role="alert" className="text-xs text-red-600 dark:text-red-400">
          {state.error}
        </span>
      )}
    </form>
  );
}
