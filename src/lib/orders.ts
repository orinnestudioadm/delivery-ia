import { z } from "zod";
import { prisma } from "./prisma";
import { upsertLocalUser } from "./users";
import { canTransitionOrderStatus, type OrderStatus } from "./order-status";

const checkoutInputSchema = z.object({
  storeId: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export class CheckoutError extends Error {}
export class OrderNotFoundError extends Error {}
export class OrderForbiddenError extends Error {}
export class InvalidStatusTransitionError extends Error {}

export async function createOrder(
  clerkUser: { id: string; email: string; name?: string | null },
  rawInput: unknown,
): Promise<string> {
  const parsed = checkoutInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new CheckoutError("Carrinho inválido ou vazio.");
  }
  const { storeId, items } = parsed.data;

  const store = await prisma.store.findFirst({
    where: { id: storeId, isActive: true },
    select: {
      id: true,
      products: {
        where: { isActive: true },
        select: { id: true, priceInCents: true },
      },
    },
  });
  if (!store) {
    throw new CheckoutError("Loja não encontrada ou inativa.");
  }

  const priceByProductId = new Map(store.products.map((p) => [p.id, p.priceInCents]));
  const orderItems = items.map((item) => {
    const unitPriceInCents = priceByProductId.get(item.productId);
    if (unitPriceInCents === undefined) {
      throw new CheckoutError(
        "Um ou mais produtos não pertencem a esta loja ou não estão mais disponíveis.",
      );
    }
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPriceInCents,
    };
  });

  const totalInCents = orderItems.reduce(
    (total, item) => total + item.unitPriceInCents * item.quantity,
    0,
  );

  const user = await upsertLocalUser({
    clerkId: clerkUser.id,
    email: clerkUser.email,
    name: clerkUser.name,
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      storeId: store.id,
      totalInCents,
      status: "RECEIVED",
      items: { create: orderItems },
    },
    select: { id: true },
  });

  return order.id;
}

export async function getOrderForUser(clerkUserId: string, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      store: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          clerkId: true,
        },
      },
    },
  });

  if (!order) {
    throw new OrderNotFoundError("Pedido não encontrado.");
  }

  if (order.user.clerkId !== clerkUserId) {
    throw new OrderForbiddenError("Acesso não autorizado a este pedido.");
  }

  return {
    id: order.id,
    storeId: order.storeId,
    storeName: order.store.name,
    storeCategory: order.store.category,
    status: order.status as OrderStatus,
    totalInCents: order.totalInCents,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      productDescription: item.product.description,
      quantity: item.quantity,
      unitPriceInCents: item.unitPriceInCents,
    })),
  };
}

export async function updateOrderStatus(orderId: string, nextStatus: OrderStatus) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true },
  });

  if (!order) {
    throw new OrderNotFoundError("Pedido não encontrado.");
  }

  const currentStatus = order.status as OrderStatus;
  if (!canTransitionOrderStatus(currentStatus, nextStatus)) {
    throw new InvalidStatusTransitionError(
      `Transição de status inválida: de ${currentStatus} para ${nextStatus}.`,
    );
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: nextStatus },
    select: { id: true, status: true, updatedAt: true },
  });
}

export async function listOrdersForUser(clerkUserId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });

  if (!user) {
    return [];
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      store: {
        select: {
          id: true,
          name: true,
        },
      },
      items: {
        select: {
          quantity: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    storeName: order.store.name,
    totalInCents: order.totalInCents,
    status: order.status as OrderStatus,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: order.createdAt,
  }));
}
