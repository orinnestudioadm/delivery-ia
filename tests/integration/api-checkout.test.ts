import { describe, expect, it, vi, beforeEach } from "vitest";

// Same rationale as the other integration tests: exercise the route handler
// with Clerk and the domain layer mocked, since there is no live Clerk/DB
// in this environment.
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
  currentUser: vi.fn(),
}));
vi.mock("../../src/lib/orders", () => ({
  CheckoutError: class CheckoutError extends Error {},
  createOrder: vi.fn(),
}));

import { auth, currentUser } from "@clerk/nextjs/server";
import { CheckoutError, createOrder } from "../../src/lib/orders";
import { POST } from "../../src/app/api/v1/stores/[id]/checkout/route";

const mockedAuth = vi.mocked(auth);
const mockedCurrentUser = vi.mocked(currentUser);
const mockedCreateOrder = vi.mocked(createOrder);

function makeRequest(body: unknown) {
  return new Request("http://localhost/api/v1/stores/s1/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const params = { params: Promise.resolve({ id: "s1" }) };
const clerkUser = {
  id: "clerk_1",
  emailAddresses: [{ emailAddress: "cliente@example.com" }],
  firstName: "Cliente",
  // minimal shape for the parts the route handler reads
} as unknown as Awaited<ReturnType<typeof currentUser>>;

beforeEach(() => {
  mockedAuth.mockReset();
  mockedCurrentUser.mockReset();
  mockedCreateOrder.mockReset();
});

describe("POST /api/v1/stores/[id]/checkout", () => {
  it("returns 401 when there is no Clerk session", async () => {
    mockedAuth.mockResolvedValue({ userId: null } as Awaited<ReturnType<typeof auth>>);

    const res = await POST(makeRequest({ items: [] }), params);

    expect(res.status).toBe(401);
    expect(mockedCreateOrder).not.toHaveBeenCalled();
  });

  it("returns 200 and the orderId on success", async () => {
    mockedAuth.mockResolvedValue({ userId: "clerk_1" } as Awaited<ReturnType<typeof auth>>);
    mockedCurrentUser.mockResolvedValue(clerkUser);
    mockedCreateOrder.mockResolvedValue("order-1");

    const res = await POST(makeRequest({ items: [{ productId: "p1", quantity: 1 }] }), params);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ orderId: "order-1" });
    expect(mockedCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({ id: "clerk_1", email: "cliente@example.com" }),
      { storeId: "s1", items: [{ productId: "p1", quantity: 1 }] },
    );
  });

  it("returns 400 when the domain layer rejects the checkout", async () => {
    mockedAuth.mockResolvedValue({ userId: "clerk_1" } as Awaited<ReturnType<typeof auth>>);
    mockedCurrentUser.mockResolvedValue(clerkUser);
    mockedCreateOrder.mockRejectedValue(new CheckoutError("Carrinho inválido ou vazio."));

    const res = await POST(makeRequest({ items: [] }), params);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toMatch(/Carrinho inválido/);
  });

  it("returns 400 for a malformed JSON body", async () => {
    mockedAuth.mockResolvedValue({ userId: "clerk_1" } as Awaited<ReturnType<typeof auth>>);
    mockedCurrentUser.mockResolvedValue(clerkUser);

    const badRequest = new Request("http://localhost/api/v1/stores/s1/checkout", {
      method: "POST",
      body: "{not json",
    });
    const res = await POST(badRequest, params);

    expect(res.status).toBe(400);
    expect(mockedCreateOrder).not.toHaveBeenCalled();
  });
});
