import { describe, expect, it } from "vitest";
import { isStoreOwner, parseRole } from "../../src/lib/roles";

describe("parseRole", () => {
  it("returns STORE_OWNER only for an explicit STORE_OWNER role", () => {
    expect(parseRole({ role: "STORE_OWNER" })).toBe("STORE_OWNER");
  });

  it("defaults to CUSTOMER when the role is missing", () => {
    expect(parseRole({})).toBe("CUSTOMER");
    expect(parseRole(undefined)).toBe("CUSTOMER");
    expect(parseRole(null)).toBe("CUSTOMER");
  });

  it("never grants elevated access for unknown or malformed values", () => {
    expect(parseRole({ role: "ADMIN" })).toBe("CUSTOMER");
    expect(parseRole({ role: "store_owner" })).toBe("CUSTOMER");
    expect(parseRole({ role: ["STORE_OWNER"] })).toBe("CUSTOMER");
    expect(parseRole("STORE_OWNER")).toBe("CUSTOMER");
  });
});

describe("isStoreOwner", () => {
  it("is true only for STORE_OWNER", () => {
    expect(isStoreOwner("STORE_OWNER")).toBe(true);
    expect(isStoreOwner("CUSTOMER")).toBe(false);
  });
});
