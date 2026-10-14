import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../src/app/store-admin/access", () => ({
  resolveStoreOwnerApiContext: vi.fn(),
}));
vi.mock("../../src/lib/orders", () => ({
  InvalidStatusTransitionError: class InvalidStatusTransitionError extends Error {},
  OrderForbiddenError: class OrderForbiddenError extends Error {},
  updateOrderStatusForStore: vi.fn(),
}));

import { resolveStoreOwnerApiContext } from "../../src/app/store-admin/access";
import {
  InvalidStatusTransitionError,
  OrderForbiddenError,
  updateOrderStatusForStore,
} from "../../src/lib/orders";
import { PATCH } from "../../src/app/api/v1/store-admin/orders/[id]/status/route";

const mockedResolveContext = vi.mocked(resolveStoreOwnerApiContext);
const mockedUpdateStatus = vi.mocked(updateOrderStatusForStore);

const okContext = {
  status: "ok" as const,
  userId: "owner-1",
  store: { id: "s1" } as never,
};
const idParams = { params: Promise.resolve({ id: "order-1" }) };

function patchRequest(body: unknown) {
  return new Request("http://localhost/api/v1/store-admin/orders/order-1/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  mockedResolveContext.mockReset();
  mockedUpdateStatus.mockReset();
});

describe("PATCH /api/v1/store-admin/orders/[id]/status", () => {
  it("returns 401 when unauthenticated", async () => {
    mockedResolveContext.mockResolvedValue({ status: "unauthenticated" });

    const res = await PATCH(patchRequest({ status: "PREPARING" }), idParams);

    expect(res.status).toBe(401);
    expect(mockedUpdateStatus).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid status value", async () => {
    mockedResolveContext.mockResolvedValue(okContext);

    const res = await PATCH(patchRequest({ status: "NOT_A_REAL_STATUS" }), idParams);

    expect(res.status).toBe(400);
    expect(mockedUpdateStatus).not.toHaveBeenCalled();
  });

  it("returns 200 and the new status on success", async () => {
    mockedResolveContext.mockResolvedValue(okContext);
    mockedUpdateStatus.mockResolvedValue({ id: "order-1", status: "PREPARING" } as never);

    const res = await PATCH(patchRequest({ status: "PREPARING" }), idParams);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ id: "order-1", status: "PREPARING" });
    expect(mockedUpdateStatus).toHaveBeenCalledWith("s1", "order-1", "PREPARING");
  });

  it("returns 403 for an order that does not belong to the store", async () => {
    mockedResolveContext.mockResolvedValue(okContext);
    mockedUpdateStatus.mockRejectedValue(
      new OrderForbiddenError("Você não tem permissão para alterar este pedido."),
    );

    const res = await PATCH(patchRequest({ status: "PREPARING" }), idParams);

    expect(res.status).toBe(403);
  });

  it("returns 400 for an illegal status transition", async () => {
    mockedResolveContext.mockResolvedValue(okContext);
    mockedUpdateStatus.mockRejectedValue(
      new InvalidStatusTransitionError("Transição de status inválida."),
    );

    const res = await PATCH(patchRequest({ status: "DELIVERED" }), idParams);

    expect(res.status).toBe(400);
  });
});
