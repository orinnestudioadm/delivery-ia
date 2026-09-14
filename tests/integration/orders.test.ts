import { describe, expect, it, vi, beforeEach } from "vitest";

// Same rationale as tests/integration/stores.test.ts: DATABASE_URL is not
// provisioned in this environment, so Prisma is mocked to exercise
// createOrder's validation and price-recalculation contract.
vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    store: { findFirst: vi.fn() },
    order: { create: vi.fn() },
    user: { upsert: vi.fn() },
  },
}));

import { prisma } from "../../src/lib/prisma";
import { CheckoutError, createOrder } from "../../src/lib/orders";

const storeFindFirst = prisma.store.findFirst as unknown as ReturnType<typeof vi.fn>;
const orderCreate = prisma.order.create as unknown as ReturnType<typeof vi.fn>;
const userUpsert = prisma.user.upsert as unknown as ReturnType<typeof vi.fn>;

const clerkUser = { id: "clerk_1", email: "cliente@example.com", name: "Cliente" };

beforeEach(() => {
  storeFindFirst.mockReset();
  orderCreate.mockReset();
  userUpsert.mockReset();
  userUpsert.mockResolvedValue({ id: "local-user-1" });
});

describe("createOrder", () => {
  it("rejects an empty cart without touching the database", async () => {
    await expect(createOrder(clerkUser, { storeId: "s1", items: [] })).rejects.toThrow(
      CheckoutError,
    );
    expect(storeFindFirst).not.toHaveBeenCalled();
  });

  it("rejects a store that does not exist or is inactive", async () => {
    storeFindFirst.mockResolvedValue(null);

    await expect(
      createOrder(clerkUser, { storeId: "missing", items: [{ productId: "p1", quantity: 1 }] }),
    ).rejects.toThrow(CheckoutError);
  });

  it("rejects a product that does not belong to the given store", async () => {
    storeFindFirst.mockResolvedValue({
      id: "s1",
      products: [{ id: "p1", priceInCents: 1000 }],
    });

    await expect(
      createOrder(clerkUser, {
        storeId: "s1",
        items: [{ productId: "other-store-product", quantity: 1 }],
      }),
    ).rejects.toThrow(CheckoutError);
    expect(orderCreate).not.toHaveBeenCalled();
  });

  it("recalculates the total from server-side prices and creates the order", async () => {
    storeFindFirst.mockResolvedValue({
      id: "s1",
      products: [
        { id: "p1", priceInCents: 1000 },
        { id: "p2", priceInCents: 500 },
      ],
    });
    orderCreate.mockResolvedValue({ id: "order-1" });

    const orderId = await createOrder(clerkUser, {
      storeId: "s1",
      items: [
        { productId: "p1", quantity: 2 },
        { productId: "p2", quantity: 1 },
      ],
    });

    expect(orderId).toBe("order-1");
    expect(orderCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: "local-user-1",
          storeId: "s1",
          totalInCents: 2500,
        }),
      }),
    );
  });
});
