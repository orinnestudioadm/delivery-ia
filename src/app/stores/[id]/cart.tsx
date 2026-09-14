"use client";

import { useMemo, useState, useTransition } from "react";
import { formatCurrency } from "@/lib/format";
import { calculateCartTotal } from "@/lib/cart";
import { checkoutAction } from "./actions";

type Product = {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
};

export function Cart({ storeId, products }: { storeId: string; products: Product[] }) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ orderId: string } | { error: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const total = useMemo(() => {
    return calculateCartTotal(
      products.map((product) => ({
        productId: product.id,
        storeId,
        unitPriceInCents: product.priceInCents,
        quantity: quantities[product.id] ?? 0,
      })),
    );
  }, [products, quantities, storeId]);

  const hasItems = total > 0;

  function setQuantity(productId: string, quantity: number) {
    setResult(null);
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(0, quantity) }));
  }

  function handleCheckout() {
    const items = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    startTransition(async () => {
      const response = await checkoutAction(storeId, items);
      setResult(response);
      if ("orderId" in response) {
        setQuantities({});
      }
    });
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-lg border border-black/10 px-4 py-3 text-sm dark:border-white/10"
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">{product.name}</span>
            <span>{formatCurrency(product.priceInCents)}</span>
          </div>
          <p className="mt-1 text-foreground/70">{product.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              aria-label={`Diminuir quantidade de ${product.name}`}
              className="rounded border border-black/10 px-2 py-1 dark:border-white/10"
              onClick={() => setQuantity(product.id, (quantities[product.id] ?? 0) - 1)}
            >
              -
            </button>
            <span data-testid={`quantity-${product.id}`}>{quantities[product.id] ?? 0}</span>
            <button
              type="button"
              aria-label={`Aumentar quantidade de ${product.name}`}
              className="rounded border border-black/10 px-2 py-1 dark:border-white/10"
              onClick={() => setQuantity(product.id, (quantities[product.id] ?? 0) + 1)}
            >
              +
            </button>
          </div>
        </div>
      ))}

      <div className="mt-2 flex items-center justify-between rounded-lg border border-black/10 px-4 py-3 text-sm dark:border-white/10">
        <span className="font-medium">Total do carrinho</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <button
        type="button"
        disabled={!hasItems || isPending}
        onClick={handleCheckout}
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
      >
        {isPending ? "Enviando..." : "Finalizar pedido"}
      </button>

      {result && "orderId" in result && (
        <div className="flex flex-col items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-sm text-green-700 dark:text-green-400">
          <p className="font-medium">
            Pedido confirmado! Identificador: <span className="font-mono">{result.orderId}</span>
          </p>
          <a
            href={`/orders/${result.orderId}`}
            className="inline-flex items-center rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90"
          >
            Acompanhar pedido →
          </a>
        </div>
      )}
      {result && "error" in result && (
        <p className="rounded-lg border border-red-500/40 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {result.error}
        </p>
      )}
    </div>
  );
}
