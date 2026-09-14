import { describe, expect, it } from "vitest";
import { calculateCartTotal, ensureSameStore } from "../../src/lib/cart";

describe("calculateCartTotal", () => {
  it("sums unit price times quantity across lines", () => {
    const total = calculateCartTotal([
      { productId: "p1", storeId: "s1", unitPriceInCents: 1000, quantity: 2 },
      { productId: "p2", storeId: "s1", unitPriceInCents: 500, quantity: 1 },
    ]);
    expect(total).toBe(2500);
  });

  it("returns 0 for an empty cart", () => {
    expect(calculateCartTotal([])).toBe(0);
  });
});

describe("ensureSameStore", () => {
  it("returns true for an empty cart", () => {
    expect(ensureSameStore([])).toBe(true);
  });

  it("returns true when every line belongs to the same store", () => {
    const result = ensureSameStore([
      { productId: "p1", storeId: "s1", unitPriceInCents: 1000, quantity: 1 },
      { productId: "p2", storeId: "s1", unitPriceInCents: 500, quantity: 1 },
    ]);
    expect(result).toBe(true);
  });

  it("returns false when lines belong to different stores", () => {
    const result = ensureSameStore([
      { productId: "p1", storeId: "s1", unitPriceInCents: 1000, quantity: 1 },
      { productId: "p2", storeId: "s2", unitPriceInCents: 500, quantity: 1 },
    ]);
    expect(result).toBe(false);
  });
});
