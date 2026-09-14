export type OrderStatus =
  | "RECEIVED"
  | "PREPARING"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELED";

export const ORDER_STATUS_FLOW: readonly OrderStatus[] = [
  "RECEIVED",
  "PREPARING",
  "ON_THE_WAY",
  "DELIVERED",
] as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Pedido Recebido",
  PREPARING: "Em Preparo",
  ON_THE_WAY: "A Caminho",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  RECEIVED: "Seu pedido foi recebido pelo restaurante e aguarda confirmação.",
  PREPARING: "O restaurante está preparando os seus itens.",
  ON_THE_WAY: "O entregador já retirou seu pedido e está a caminho do seu endereço.",
  DELIVERED: "Pedido entregue com sucesso. Bom apetite!",
  CANCELED: "Este pedido foi cancelado.",
};

const VALID_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  RECEIVED: ["PREPARING", "CANCELED"],
  PREPARING: ["ON_THE_WAY", "CANCELED"],
  ON_THE_WAY: ["DELIVERED", "CANCELED"],
  DELIVERED: [],
  CANCELED: [],
};

export function canTransitionOrderStatus(
  current: OrderStatus,
  next: OrderStatus,
): boolean {
  if (current === next) {
    return true;
  }
  const allowed = VALID_TRANSITIONS[current] ?? [];
  return allowed.includes(next);
}

export function formatOrderStatus(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

export function getOrderStatusDescription(status: OrderStatus): string {
  return ORDER_STATUS_DESCRIPTIONS[status] ?? "";
}

export function getOrderStatusStep(status: OrderStatus): number {
  switch (status) {
    case "RECEIVED":
      return 0;
    case "PREPARING":
      return 1;
    case "ON_THE_WAY":
      return 2;
    case "DELIVERED":
      return 3;
    case "CANCELED":
      return -1;
    default:
      return 0;
  }
}
