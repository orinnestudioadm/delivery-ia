import { describe, expect, it, vi, beforeEach } from "vitest";

// Same rationale as the other integration tests: no DATABASE_URL in this
// environment, so Prisma is mocked to exercise the ownership and validation
// contract of the store-admin data layer.
vi.mock("../../src/lib/prisma", () => ({
  prisma: {
    store: { findFirst: vi.fn() },
    product: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  },
}));

import { prisma } from "../../src/lib/prisma";
import {
  StoreAdminForbiddenError,
  StoreAdminValidationError,
  createProduct,
  getOwnedStoreWithProducts,
  removeProduct,
  updateProduct,
} from "../../src/lib/store-admin";

const storeFindFirst = prisma.store.findFirst as unknown as ReturnType<typeof vi.fn>;
const productFindFirst = prisma.product.findFirst as unknown as ReturnType<typeof vi.fn>;
const productCreate = prisma.product.create as unknown as ReturnType<typeof vi.fn>;
const productUpdate = prisma.product.update as unknown as ReturnType<typeof vi.fn>;

const validInput = { name: "X-Burger", description: "Pão, carne e queijo", price: "24,90" };

beforeEach(() => {
  storeFindFirst.mockReset();
  productFindFirst.mockReset();
  productCreate.mockReset();
  productUpdate.mockReset();
});

describe("getOwnedStoreWithProducts", () => {
  it("queries the store by owner and only returns active products", async () => {
    storeFindFirst.mockResolvedValue({ id: "s1", name: "Loja", category: "Lanches", products: [] });

    await getOwnedStoreWithProducts("owner-1");

    expect(storeFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { ownerId: "owner-1" },
        select: expect.objectContaining({
          products: expect.objectContaining({ where: { isActive: true } }),
        }),
      }),
    );
  });
});

describe("createProduct", () => {
  it("creates an active product in the owner's store with the price in cents", async () => {
    storeFindFirst.mockResolvedValue({ id: "s1" });
    productCreate.mockResolvedValue({ id: "p1" });

    await createProduct("owner-1", "s1", validInput);

    expect(storeFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "s1", ownerId: "owner-1" } }),
    );
    expect(productCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: "X-Burger", description: "Pão, carne e queijo", priceInCents: 2490, storeId: "s1" },
      }),
    );
  });

  it("rejects an empty name without touching the database", async () => {
    await expect(createProduct("owner-1", "s1", { ...validInput, name: "  " })).rejects.toThrow(
      StoreAdminValidationError,
    );
    expect(storeFindFirst).not.toHaveBeenCalled();
    expect(productCreate).not.toHaveBeenCalled();
  });

  it.each(["0", "0,00", "-3", "abc", ""])("rejects the invalid price %j", async (price) => {
    await expect(createProduct("owner-1", "s1", { ...validInput, price })).rejects.toThrow(
      StoreAdminValidationError,
    );
    expect(productCreate).not.toHaveBeenCalled();
  });

  it("rejects creating a product in a store the user does not own", async () => {
    storeFindFirst.mockResolvedValue(null);

    await expect(createProduct("owner-1", "other-store", validInput)).rejects.toThrow(
      StoreAdminForbiddenError,
    );
    expect(productCreate).not.toHaveBeenCalled();
  });
});

describe("updateProduct", () => {
  it("updates a product that belongs to the owner's store", async () => {
    productFindFirst.mockResolvedValue({ id: "p1" });
    productUpdate.mockResolvedValue({ id: "p1" });

    await updateProduct("owner-1", "p1", validInput);

    expect(productFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "p1", isActive: true, store: { ownerId: "owner-1" } } }),
    );
    expect(productUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "p1" },
        data: { name: "X-Burger", description: "Pão, carne e queijo", priceInCents: 2490 },
      }),
    );
  });

  it("rejects editing a product from another store (403) without updating it", async () => {
    productFindFirst.mockResolvedValue(null);

    await expect(updateProduct("owner-1", "foreign-product", validInput)).rejects.toThrow(
      StoreAdminForbiddenError,
    );
    expect(productUpdate).not.toHaveBeenCalled();
  });

  it("validates input before checking ownership", async () => {
    await expect(updateProduct("owner-1", "p1", { ...validInput, price: "0" })).rejects.toThrow(
      StoreAdminValidationError,
    );
    expect(productFindFirst).not.toHaveBeenCalled();
  });
});

describe("removeProduct", () => {
  it("soft-deletes the product instead of deleting the row", async () => {
    productFindFirst.mockResolvedValue({ id: "p1" });
    productUpdate.mockResolvedValue({ id: "p1" });

    await removeProduct("owner-1", "p1");

    expect(productUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "p1" }, data: { isActive: false } }),
    );
  });

  it("rejects removing a product from another store (403)", async () => {
    productFindFirst.mockResolvedValue(null);

    await expect(removeProduct("owner-1", "foreign-product")).rejects.toThrow(
      StoreAdminForbiddenError,
    );
    expect(productUpdate).not.toHaveBeenCalled();
  });
});
