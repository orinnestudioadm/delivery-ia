import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  StoreAdminForbiddenError,
  StoreAdminValidationError,
  createProduct,
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

// RNF-03: CRUD de produto do lojista exposto como REST versionado — a regra
// de posse/validação continua em src/lib/store-admin.ts.
export async function POST(request: Request) {
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

  try {
    const product = await createProduct(ctx.userId, ctx.store.id, readProductInput(body));
    revalidatePath("/store-admin");
    revalidatePath(`/stores/${ctx.store.id}`);
    return NextResponse.json({ id: product.id }, { status: 201 });
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
