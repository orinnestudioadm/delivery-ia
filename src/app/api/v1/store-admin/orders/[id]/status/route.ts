import { NextResponse } from "next/server";
import {
  InvalidStatusTransitionError,
  OrderForbiddenError,
  updateOrderStatusForStore,
} from "@/lib/orders";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status";
import { resolveStoreOwnerApiContext } from "@/app/store-admin/access";

function statusForContext(status: "unauthenticated" | "forbidden" | "no-store"): number {
  return status === "unauthenticated" ? 401 : 403;
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && value in ORDER_STATUS_LABELS;
}

// PATCH, não PUT: só o campo status é alterado, não o pedido inteiro.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await resolveStoreOwnerApiContext();
  if (ctx.status !== "ok") {
    return NextResponse.json(
      { error: "Acesso restrito a lojistas com uma loja associada." },
      { status: statusForContext(ctx.status) },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const nextStatus = (body as { status?: unknown } | null)?.status;
  if (!isOrderStatus(nextStatus)) {
    return NextResponse.json({ error: "Status informado é inválido." }, { status: 400 });
  }

  const { id: orderId } = await params;

  try {
    const order = await updateOrderStatusForStore(ctx.store.id, orderId, nextStatus);
    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    if (error instanceof OrderForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof InvalidStatusTransitionError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
