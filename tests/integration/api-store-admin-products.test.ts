import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../../src/app/store-admin/access", () => ({
  resolveStoreOwnerApiContext: vi.fn(),
}));
vi.mock("../../src/lib/store-admin", () => ({
  StoreAdminForbiddenError: class StoreAdminForbiddenError extends Error {},
  StoreAdminValidationError: class StoreAdminValidationError extends Error {},
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  removeProduct: vi.fn(),
}));

import { resolveStoreOwnerApiContext } from "../../src/app/store-admin/access";
import {
  StoreAdminForbiddenError,
  StoreAdminValidationError,
  createProduct,
  removeProduct,
  updateProduct,
} from "../../src/lib/store-admin";
import { POST } from "../../src/app/api/v1/store-admin/products/route";
import { DELETE, PUT } from "../../src/app/api/v1/store-admin/products/[id]/route";

const mockedResolveContext = vi.mocked(resolveStoreOwnerApiContext);
const mockedCreateProduct = vi.mocked(createProduct);
const mockedUpdateProduct = vi.mocked(updateProduct);
const mockedRemoveProduct = vi.mocked(removeProduct);

const okContext = {
  status: "ok" as const,
  userId: "owner-1",
  store: { id: "s1" } as never,
};

function jsonRequest(method: string, body: unknown) {
  return new Request("http://localhost/api/v1/store-admin/products", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const idParams = { params: Promise.resolve({ id: "p1" }) };

beforeEach(() => {
  mockedResolveContext.mockReset();
  mockedCreateProduct.mockReset();
  mockedUpdateProduct.mockReset();
  mockedRemoveProduct.mockReset();
});

describe("POST /api/v1/store-admin/products", () => {
  it("returns 401 when unauthenticated", async () => {
    mockedResolveContext.mockResolvedValue({ status: "unauthenticated" });

    const res = await POST(jsonRequest("POST", { name: "X", description: "Y", price: "9,90" }));

    expect(res.status).toBe(401);
    expect(mockedCreateProduct).not.toHaveBeenCalled();
  });

  it("returns 403 when the user is not a store owner", async () => {
    mockedResolveContext.mockResolvedValue({ status: "forbidden" });

    const res = await POST(jsonRequest("POST", { name: "X", description: "Y", price: "9,90" }));

    expect(res.status).toBe(403);
  });

  it("returns 201 and the product id on success", async () => {
    mockedResolveContext.mockResolvedValue(okContext);
    mockedCreateProduct.mockResolvedValue({ id: "p1" });

    const res = await POST(jsonRequest("POST", { name: "X-Burger", description: "", price: "24,90" }));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body).toEqual({ id: "p1" });
    expect(mockedCreateProduct).toHaveBeenCalledWith("owner-1", "s1", {
      name: "X-Burger",
      description: "",
      price: "24,90",
    });
  });

  it("returns 400 when the domain layer rejects invalid input", async () => {
    mockedResolveContext.mockResolvedValue(okContext);
    mockedCreateProduct.mockRejectedValue(new StoreAdminValidationError("Informe um preço válido."));

    const res = await POST(jsonRequest("POST", { name: "X", description: "", price: "0" }));

    expect(res.status).toBe(400);
  });
});

describe("PUT /api/v1/store-admin/products/[id]", () => {
  it("returns 200 on success", async () => {
    mockedResolveContext.mockResolvedValue(okContext);
    mockedUpdateProduct.mockResolvedValue({ id: "p1" });

    const res = await PUT(jsonRequest("PUT", { name: "X", description: "", price: "29,90" }), idParams);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ id: "p1" });
  });

  it("returns 403 when editing a product from another store", async () => {
    mockedResolveContext.mockResolvedValue(okContext);
    mockedUpdateProduct.mockRejectedValue(
      new StoreAdminForbiddenError("Você não tem permissão para alterar este produto."),
    );

    const res = await PUT(jsonRequest("PUT", { name: "X", description: "", price: "29,90" }), idParams);

    expect(res.status).toBe(403);
  });
});

describe("DELETE /api/v1/store-admin/products/[id]", () => {
  it("returns 200 on success", async () => {
    mockedResolveContext.mockResolvedValue(okContext);
    mockedRemoveProduct.mockResolvedValue({ id: "p1" });

    const res = await DELETE(new Request("http://localhost/x", { method: "DELETE" }), idParams);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ id: "p1" });
  });

  it("returns 401 when unauthenticated", async () => {
    mockedResolveContext.mockResolvedValue({ status: "unauthenticated" });

    const res = await DELETE(new Request("http://localhost/x", { method: "DELETE" }), idParams);

    expect(res.status).toBe(401);
    expect(mockedRemoveProduct).not.toHaveBeenCalled();
  });
});
