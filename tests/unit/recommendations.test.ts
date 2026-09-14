import { describe, expect, it } from "vitest";
import { rankStoresByHistory } from "../../src/lib/recommendations";
import type { StoreSummary } from "../../src/lib/stores";

const stores: StoreSummary[] = [
  { id: "s1", name: "Loja Japonesa", category: "Japonesa", rating: 4.0 },
  { id: "s2", name: "Loja Italiana", category: "Italiana", rating: 4.8 },
  { id: "s3", name: "Loja Brasileira", category: "Brasileira", rating: 4.5 },
];

describe("rankStoresByHistory", () => {
  it("falls back to rating order when there is no order history", () => {
    const result = rankStoresByHistory(stores, []);
    expect(result.map((s) => s.id)).toEqual(["s2", "s3", "s1"]);
  });

  it("prioritizes stores/categories the customer has ordered from before", () => {
    const result = rankStoresByHistory(stores, [
      { storeId: "s1", category: "Japonesa" },
      { storeId: "s1", category: "Japonesa" },
    ]);

    expect(result[0].id).toBe("s1");
  });

  it("weighs category matches even for a different store in the same category", () => {
    const storesWithSameCategory: StoreSummary[] = [
      { id: "s1", name: "Sushi A", category: "Japonesa", rating: 3.0 },
      { id: "s2", name: "Sushi B", category: "Japonesa", rating: 3.0 },
      { id: "s3", name: "Pizza", category: "Italiana", rating: 4.9 },
    ];

    const result = rankStoresByHistory(storesWithSameCategory, [
      { storeId: "s1", category: "Japonesa" },
    ]);

    expect(result[0].category).toBe("Japonesa");
  });
});
