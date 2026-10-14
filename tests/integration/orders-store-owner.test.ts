import { describe, expect, it, vi, beforeEach } from "vitest";

// Same rationale as the other integration tests: no DATABASE_URL in this
// environment, so Prisma is mocked to exercise the lojista-scoped order
// queries (listOrdersForStore, updateOrderStatusForStore).
vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    order: { findMany: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
  },
}));

import { prisma } from "../../src/lib/prisma";
import {
  InvalidStatusTransitionError,
  OrderForbiddenError,
  listOrdersForStore,
  updateOrderStatusForStore,
} from "../../src/lib/orders";

const findMany = prisma.order.findMany as unknown as ReturnType<typeof vi.fn>;
const findFirst = prisma.order.findFirst as unknown as ReturnType<typeof vi.fn>;
const update = prisma.order.update as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  findMany.mockReset();
  findFirst.mockReset();
  update.mockReset();
});

describe("listOrdersForStore", () => {
  it("queries orders scoped to the given store and summarizes them", async () => {
    findMany.mockResolvedValue([
      {
        id: "order-1",
        totalInCents: 2500,
        status: "RECEIVED",
        createdAt: new Date("2026-01-01"),
        user: { name: "Mariana", email: "mariana@example.com" },
        items: [{ quantity: 2 }, { quantity: 1 }],
      },
    ]);

    const result = await listOrdersForStore("s1");

    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { storeId: "s1" } }));
    expect(result).toEqual([
      {
        id: "order-1",
        customerName: "Mariana",
        totalInCents: 2500,
        status: "RECEIVED",
        itemCount: 3,
        createdAt: new Date("2026-01-01"),
      },
    ]);
  });

  it("falls back to the customer email when the name is missing", async () => {
    findMany.mockResolvedValue([
      {
        id: "order-1",
        totalInCents: 1000,
        status: "RECEIVED",
        createdAt: new Date(),
        user: { name: null, email: "sem-nome@example.com" },
        items: [],
      },
    ]);

    const [result] = await listOrdersForStore("s1");

    expect(result.customerName).toBe("sem-nome@example.com");
  });
});

describe("updateOrderStatusForStore", () => {
  it("advances the status of an order that belongs to the store", async () => {
    findFirst.mockResolvedValue({ id: "order-1", status: "RECEIVED" });
    update.mockResolvedValue({ id: "order-1", status: "PREPARING", updatedAt: new Date() });

    const result = await updateOrderStatusForStore("s1", "order-1", "PREPARING");

    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "order-1", storeId: "s1" } }),
    );
    expect(result.status).toBe("PREPARING");
  });

  it("rejects an order that does not belong to the store (403-worthy)", async () => {
    findFirst.mockResolvedValue(null);

    await expect(updateOrderStatusForStore("s1", "foreign-order", "PREPARING")).rejects.toThrow(
      OrderForbiddenError,
    );
    expect(update).not.toHaveBeenCalled();
  });

  it("rejects an illegal status transition", async () => {
    findFirst.mockResolvedValue({ id: "order-1", status: "DELIVERED" });

    await expect(updateOrderStatusForStore("s1", "order-1", "PREPARING")).rejects.toThrow(
      InvalidStatusTransitionError,
    );
    expect(update).not.toHaveBeenCalled();
  });
});
