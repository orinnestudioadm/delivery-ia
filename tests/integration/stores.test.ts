import { describe, expect, it, vi, beforeEach } from "vitest";

// DATABASE_URL is not provisioned in this environment (see openspec/roadmap.md
// "Pendências manuais"), so the Prisma client is mocked here to exercise the
// listActiveStores/getStoreWithProducts contract (Zod validation + query
// shape) without a live Postgres connection.
vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    store: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

import { prisma } from "../../src/lib/prisma";
import { listActiveStores, getStoreWithProducts } from "../../src/lib/stores";

const findMany = prisma.store.findMany as unknown as ReturnType<typeof vi.fn>;
const findFirst = prisma.store.findFirst as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  findMany.mockReset();
  findFirst.mockReset();
});

describe("listActiveStores", () => {
  it("queries only active stores ordered by rating", async () => {
    findMany.mockResolvedValue([
      { id: "s1", name: "Loja 1", category: "Comida", rating: 4.5 },
    ]);

    const result = await listActiveStores();

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isActive: true } }),
    );
    expect(result).toEqual([
      { id: "s1", name: "Loja 1", category: "Comida", rating: 4.5 },
    ]);
  });
});

describe("getStoreWithProducts", () => {
  it("returns null without querying the database for an invalid id", async () => {
    const result = await getStoreWithProducts("");

    expect(result).toBeNull();
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("returns the store with its active products for a valid id", async () => {
    findFirst.mockResolvedValue({
      id: "s1",
      name: "Loja 1",
      category: "Comida",
      rating: 4.5,
      products: [
        { id: "p1", name: "Produto 1", description: "Descrição", priceInCents: 1990 },
      ],
    });

    const result = await getStoreWithProducts("s1");

    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "s1", isActive: true } }),
    );
    expect(result?.products).toHaveLength(1);
  });

  it("returns null when the store does not exist or is inactive", async () => {
    findFirst.mockResolvedValue(null);

    const result = await getStoreWithProducts("missing");

    expect(result).toBeNull();
  });
});
