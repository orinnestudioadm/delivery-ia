import { describe, expect, it, vi, beforeEach } from "vitest";

// Same rationale as the other integration tests: no DATABASE_URL in this
// environment, so Prisma is mocked to exercise getRecommendedStores' contract.
vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    store: { findMany: vi.fn() },
    user: { findUnique: vi.fn() },
    order: { findMany: vi.fn() },
  },
}));

import { prisma } from "../../src/lib/prisma";
import { getRecommendedStores } from "../../src/lib/recommendations";

const storeFindMany = prisma.store.findMany as unknown as ReturnType<typeof vi.fn>;
const userFindUnique = prisma.user.findUnique as unknown as ReturnType<typeof vi.fn>;
const orderFindMany = prisma.order.findMany as unknown as ReturnType<typeof vi.fn>;

const activeStores = [
  { id: "s1", name: "Loja Japonesa", category: "Japonesa", rating: 4.0 },
  { id: "s2", name: "Loja Italiana", category: "Italiana", rating: 4.8 },
];

beforeEach(() => {
  storeFindMany.mockReset();
  userFindUnique.mockReset();
  orderFindMany.mockReset();
  storeFindMany.mockResolvedValue(activeStores);
});

describe("getRecommendedStores", () => {
  it("falls back to rating order when the customer has no local user yet", async () => {
    userFindUnique.mockResolvedValue(null);

    const result = await getRecommendedStores("clerk_new_user");

    expect(orderFindMany).not.toHaveBeenCalled();
    expect(result.map((s) => s.id)).toEqual(["s2", "s1"]);
  });

  it("falls back to rating order when the customer has no order history", async () => {
    userFindUnique.mockResolvedValue({ id: "local-user-1" });
    orderFindMany.mockResolvedValue([]);

    const result = await getRecommendedStores("clerk_1");

    expect(result.map((s) => s.id)).toEqual(["s2", "s1"]);
  });

  it("prioritizes the store/category the customer has ordered from before", async () => {
    userFindUnique.mockResolvedValue({ id: "local-user-1" });
    orderFindMany.mockResolvedValue([
      { store: { id: "s1", category: "Japonesa" } },
      { store: { id: "s1", category: "Japonesa" } },
    ]);

    const result = await getRecommendedStores("clerk_1");

    expect(result[0].id).toBe("s1");
  });
});
