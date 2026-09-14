import { describe, expect, it } from "vitest";
import {
  canTransitionOrderStatus,
  formatOrderStatus,
  getOrderStatusDescription,
  getOrderStatusStep,
} from "../../src/lib/order-status";

describe("order-status state machine", () => {
  describe("canTransitionOrderStatus", () => {
    it("allows standard sequential transitions", () => {
      expect(canTransitionOrderStatus("RECEIVED", "PREPARING")).toBe(true);
      expect(canTransitionOrderStatus("PREPARING", "ON_THE_WAY")).toBe(true);
      expect(canTransitionOrderStatus("ON_THE_WAY", "DELIVERED")).toBe(true);
    });

    it("allows staying in the same status (idempotency)", () => {
      expect(canTransitionOrderStatus("RECEIVED", "RECEIVED")).toBe(true);
      expect(canTransitionOrderStatus("PREPARING", "PREPARING")).toBe(true);
      expect(canTransitionOrderStatus("ON_THE_WAY", "ON_THE_WAY")).toBe(true);
      expect(canTransitionOrderStatus("DELIVERED", "DELIVERED")).toBe(true);
      expect(canTransitionOrderStatus("CANCELED", "CANCELED")).toBe(true);
    });

    it("allows cancellation prior to delivery", () => {
      expect(canTransitionOrderStatus("RECEIVED", "CANCELED")).toBe(true);
      expect(canTransitionOrderStatus("PREPARING", "CANCELED")).toBe(true);
      expect(canTransitionOrderStatus("ON_THE_WAY", "CANCELED")).toBe(true);
    });

    it("blocks illegal status skips or backwards transitions", () => {
      expect(canTransitionOrderStatus("RECEIVED", "DELIVERED")).toBe(false);
      expect(canTransitionOrderStatus("RECEIVED", "ON_THE_WAY")).toBe(false);
      expect(canTransitionOrderStatus("DELIVERED", "PREPARING")).toBe(false);
      expect(canTransitionOrderStatus("DELIVERED", "CANCELED")).toBe(false);
      expect(canTransitionOrderStatus("CANCELED", "PREPARING")).toBe(false);
      expect(canTransitionOrderStatus("CANCELED", "DELIVERED")).toBe(false);
    });
  });

  describe("formatOrderStatus and helpers", () => {
    it("formats all order statuses to human-friendly Portuguese labels", () => {
      expect(formatOrderStatus("RECEIVED")).toBe("Pedido Recebido");
      expect(formatOrderStatus("PREPARING")).toBe("Em Preparo");
      expect(formatOrderStatus("ON_THE_WAY")).toBe("A Caminho");
      expect(formatOrderStatus("DELIVERED")).toBe("Entregue");
      expect(formatOrderStatus("CANCELED")).toBe("Cancelado");
    });

    it("provides valid non-empty descriptions for all statuses", () => {
      expect(getOrderStatusDescription("RECEIVED").length).toBeGreaterThan(0);
      expect(getOrderStatusDescription("PREPARING").length).toBeGreaterThan(0);
      expect(getOrderStatusDescription("ON_THE_WAY").length).toBeGreaterThan(0);
      expect(getOrderStatusDescription("DELIVERED").length).toBeGreaterThan(0);
      expect(getOrderStatusDescription("CANCELED").length).toBeGreaterThan(0);
    });

    it("calculates progress steps correctly", () => {
      expect(getOrderStatusStep("RECEIVED")).toBe(0);
      expect(getOrderStatusStep("PREPARING")).toBe(1);
      expect(getOrderStatusStep("ON_THE_WAY")).toBe(2);
      expect(getOrderStatusStep("DELIVERED")).toBe(3);
      expect(getOrderStatusStep("CANCELED")).toBe(-1);
    });
  });
});
