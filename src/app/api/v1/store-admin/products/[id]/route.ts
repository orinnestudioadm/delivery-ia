import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  StoreAdminForbiddenError,
  StoreAdminValidationError,
  removeProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/store-admin";
import { resolveStoreOwnerApiContext } from "@/app/store-admin/access";

function statusForContext(status: "unauthenticated" | "forbidden" | "no-store"): number {
  return status === "unauthenticated" ? 401 : 403;
}

function readProductInput(body: unknown): ProductInput {
  const record = (body ?? {}) as Record<string, unknown>;
  return {
    name: String(record.name ?? ""),
    description: String(record.description ?? ""),
    price: String(record.price ?? ""),
  };
}

export async function PUT(
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

  const { id: productId } = await params;

  try {
    const product = await updateProduct(ctx.userId, productId, readProductInput(body));
    revalidatePath("/store-admin");
    revalidatePath(`/stores/${ctx.store.id}`);
    return NextResponse.json({ id: product.id });
  } catch (error) {
    if (error instanceof StoreAdminValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof StoreAdminForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ctx = await resolveStoreOwnerApiContext();
  if (ctx.status !== "ok") {
    return NextResponse.json(
      { error: "Acesso restrito a lojistas com uma loja associada." },
      { status: statusForContext(ctx.status) },
    );
  }

  const { id: productId } = await params;

  try {
    const product = await removeProduct(ctx.userId, productId);
    revalidatePath("/store-admin");
    revalidatePath(`/stores/${ctx.store.id}`);
    return NextResponse.json({ id: product.id });
  } catch (error) {
    if (error instanceof StoreAdminForbiddenError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
