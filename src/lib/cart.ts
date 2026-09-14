export type CartLine = {
  productId: string;
  storeId: string;
  unitPriceInCents: number;
  quantity: number;
};

export function calculateCartTotal(lines: CartLine[]): number {
  return lines.reduce((total, line) => total + line.unitPriceInCents * line.quantity, 0);
}

export function ensureSameStore(lines: CartLine[]): boolean {
  if (lines.length === 0) {
    return true;
  }
  const [{ storeId }] = lines;
  return lines.every((line) => line.storeId === storeId);
}
