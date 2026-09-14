import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    order: {
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { prisma } from "../../src/lib/prisma";
import {
  getOrderForUser,
  updateOrderStatus,
  listOrdersForUser,
  OrderForbiddenError,
  OrderNotFoundError,
  InvalidStatusTransitionError,
} from "../../src/lib/orders";

const orderFindUnique = prisma.order.findUnique as unknown as ReturnType<typeof vi.fn>;
const orderUpdate = prisma.order.update as unknown as ReturnType<typeof vi.fn>;
const orderFindMany = prisma.order.findMany as unknown as ReturnType<typeof vi.fn>;
const userFindUnique = prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  orderFindUnique.mockReset();
  orderUpdate.mockReset();
  orderFindMany.mockReset();
  userFindUnique.mockReset();
});

describe("Order tracking & authorization (getOrderForUser)", () => {
  it("returns order tracking details when the authenticated user is the owner", async () => {
    orderFindUnique.mockResolvedValue({
      id: "ord_123",
      storeId: "store_1",
      userId: "user_1",
      totalInCents: 3500,
      status: "RECEIVED",
      createdAt: new Date("2026-09-14T12:00:00Z"),
      updatedAt: new Date("2026-09-14T12:00:00Z"),
      store: {
        id: "store_1",
        name: "Pizzaria Bella",
        category: "Pizza",
      },
      items: [
        {
          id: "item_1",
          productId: "prod_1",
          quantity: 1,
          unitPriceInCents: 3500,
          product: {
            id: "prod_1",
            name: "Pizza Margherita",
            description: "Molho, mussarela e manjericão",
          },
        },
      ],
      user: {
        id: "user_1",
        clerkId: "clerk_user_1",
      },
    });

    const result = await getOrderForUser("clerk_user_1", "ord_123");

    expect(result.id).toBe("ord_123");
    expect(result.storeName).toBe("Pizzaria Bella");
    expect(result.status).toBe("RECEIVED");
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.productName).toBe("Pizza Margherita");
    expect(result.totalInCents).toBe(3500);
  });

  it("throws OrderNotFoundError when the order does not exist", async () => {
    orderFindUnique.mockResolvedValue(null);

    await expect(getOrderForUser("clerk_user_1", "missing_order")).rejects.toThrow(
      OrderNotFoundError,
    );
  });

  it("throws OrderForbiddenError (403) when user is not the order owner", async () => {
    orderFindUnique.mockResolvedValue({
      id: "ord_123",
      storeId: "store_1",
      userId: "user_owner",
      totalInCents: 3500,
      status: "RECEIVED",
      user: {
        id: "user_owner",
        clerkId: "clerk_owner_id",
      },
      store: { name: "Pizzaria Bella" },
      items: [],
    });

    await expect(getOrderForUser("clerk_attacker_id", "ord_123")).rejects.toThrow(
      OrderForbiddenError,
    );
  });
});

describe("Order status transitions (updateOrderStatus)", () => {
  it("successfully updates status on valid transition", async () => {
    orderFindUnique.mockResolvedValue({
      id: "ord_123",
      status: "RECEIVED",
    });
    orderUpdate.mockResolvedValue({
      id: "ord_123",
      status: "PREPARING",
      updatedAt: new Date(),
    });

    const updated = await updateOrderStatus("ord_123", "PREPARING");

    expect(updated.status).toBe("PREPARING");
    expect(orderUpdate).toHaveBeenCalledWith({
      where: { id: "ord_123" },
      data: { status: "PREPARING" },
      select: { id: true, status: true, updatedAt: true },
    });
  });

  it("rejects invalid status skips with InvalidStatusTransitionError", async () => {
    orderFindUnique.mockResolvedValue({
      id: "ord_123",
      status: "RECEIVED",
    });

    await expect(updateOrderStatus("ord_123", "DELIVERED")).rejects.toThrow(
      InvalidStatusTransitionError,
    );
    expect(orderUpdate).not.toHaveBeenCalled();
  });

  it("throws OrderNotFoundError if order to update does not exist", async () => {
    orderFindUnique.mockResolvedValue(null);

    await expect(updateOrderStatus("missing_ord", "PREPARING")).rejects.toThrow(
      OrderNotFoundError,
    );
  });
});

describe("listOrdersForUser", () => {
  it("returns empty array if user not found in local db", async () => {
    userFindUnique.mockResolvedValue(null);

    const orders = await listOrdersForUser("unknown_clerk_id");
    expect(orders).toEqual([]);
  });

  it("returns user orders with item counts and statuses", async () => {
    userFindUnique.mockResolvedValue({ id: "local_user_1" });
    orderFindMany.mockResolvedValue([
      {
        id: "ord_1",
        totalInCents: 2000,
        status: "DELIVERED",
        createdAt: new Date(),
        store: { id: "s1", name: "Burgers" },
        items: [{ quantity: 2 }, { quantity: 1 }],
      },
    ]);

    const orders = await listOrdersForUser("clerk_1");
    expect(orders).toHaveLength(1);
    expect(orders[0]?.storeName).toBe("Burgers");
    expect(orders[0]?.itemCount).toBe(3);
    expect(orders[0]?.status).toBe("DELIVERED");
  });
});
