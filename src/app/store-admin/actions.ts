"use server";

import { revalidatePath } from "next/cache";
import {
  StoreAdminForbiddenError,
  StoreAdminValidationError,
  createProduct,
  removeProduct,
  updateProduct,
  type ProductInput,
} from "@/lib/store-admin";
import { resolveStoreOwnerContext } from "./access";
import type { ActionState } from "./types";

function readProductInput(formData: FormData): ProductInput {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
  };
}

// Runs a mutation as the authenticated store owner and maps the expected
// domain errors to a message the form can display.
async function runAsStoreOwner(
  mutation: (ctx: { userId: string; storeId: string }) => Promise<unknown>,
  successMessage: string,
): Promise<ActionState> {
  const ctx = await resolveStoreOwnerContext();
  if (ctx.status !== "ok") {
    return { error: "Acesso restrito a lojistas com uma loja associada." };
  }

  try {
    await mutation({ userId: ctx.userId, storeId: ctx.store.id });
  } catch (error) {
    if (error instanceof StoreAdminValidationError || error instanceof StoreAdminForbiddenError) {
      return { error: error.message };
    }
    throw error;
  }

  revalidatePath("/store-admin");
  revalidatePath(`/stores/${ctx.store.id}`);
  return { success: successMessage };
}

export async function createProductAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const input = readProductInput(formData);
  return runAsStoreOwner(
    ({ userId, storeId }) => createProduct(userId, storeId, input),
    "Produto criado.",
  );
}

export async function updateProductAction(
  productId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const input = readProductInput(formData);
  return runAsStoreOwner(
    ({ userId }) => updateProduct(userId, productId, input),
    "Produto atualizado.",
  );
}

// useActionState also passes the previous state, which removal does not need.
export async function removeProductAction(productId: string): Promise<ActionState> {
  return runAsStoreOwner(
    ({ userId }) => removeProduct(userId, productId),
    "Produto removido.",
  );
}
