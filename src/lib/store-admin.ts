import { z } from "zod";
import { prisma } from "./prisma";
import { parsePriceToCents } from "./price";

export class StoreAdminValidationError extends Error {}
export class StoreAdminForbiddenError extends Error {}

const productFieldsSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do produto.").max(80, "O nome pode ter no máximo 80 caracteres."),
  description: z.string().trim().max(300, "A descrição pode ter no máximo 300 caracteres."),
  price: z.string().transform((value, ctx) => {
    const cents = parsePriceToCents(value);
    if (cents === null) {
      ctx.addIssue({ code: "custom", message: "Informe um preço válido maior que zero (ex.: 12,90)." });
      return z.NEVER;
    }
    return cents;
  }),
});

export type ProductInput = { name: string; description: string; price: string };

function parseProductInput(raw: ProductInput) {
  const parsed = productFieldsSchema.safeParse(raw);
  if (!parsed.success) {
    throw new StoreAdminValidationError(parsed.error.issues[0].message);
  }
  return {
    name: parsed.data.name,
    description: parsed.data.description,
    priceInCents: parsed.data.price,
  };
}

// A lojista manages one store: the first one they own (by creation date).
export async function getOwnedStoreWithProducts(ownerId: string) {
  return prisma.store.findFirst({
    where: { ownerId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, description: true, priceInCents: true },
      },
    },
  });
}

export async function createProduct(ownerId: string, storeId: string, raw: ProductInput) {
  const data = parseProductInput(raw);

  const store = await prisma.store.findFirst({
    where: { id: storeId, ownerId },
    select: { id: true },
  });
  if (!store) {
    throw new StoreAdminForbiddenError("Você não tem permissão para alterar esta loja.");
  }

  return prisma.product.create({
    data: { ...data, storeId: store.id },
    select: { id: true },
  });
}

// The ownership check is part of the query itself (store.ownerId), so a
// product from another store is indistinguishable from a missing one.
async function assertOwnsProduct(ownerId: string, productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true, store: { ownerId } },
    select: { id: true },
  });
  if (!product) {
    throw new StoreAdminForbiddenError("Você não tem permissão para alterar este produto.");
  }
}

export async function updateProduct(ownerId: string, productId: string, raw: ProductInput) {
  const data = parseProductInput(raw);
  await assertOwnsProduct(ownerId, productId);

  return prisma.product.update({
    where: { id: productId },
    data,
    select: { id: true },
  });
}

// Soft delete: OrderItem references Product, so a hard delete would break
// (or erase) historical orders. The public menu already filters isActive.
export async function removeProduct(ownerId: string, productId: string) {
  await assertOwnsProduct(ownerId, productId);

  return prisma.product.update({
    where: { id: productId },
    data: { isActive: false },
    select: { id: true },
  });
}
