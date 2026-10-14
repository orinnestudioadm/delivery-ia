import Link from "next/link";
import { formatCentsForInput } from "@/lib/price";
import { formatCurrency } from "@/lib/format";
import { listOrdersForStore } from "@/lib/orders";
import { ORDER_STATUS_LABELS, getNextOrderStatusOptions } from "@/lib/order-status";
import { resolveStoreOwnerContext } from "./access";
import { ProductForm, RemoveProductForm } from "./product-form";
import { OrderStatusForm } from "./order-status-form";

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-foreground/70">{children}</p>
      <Link href="/dashboard" className="mt-6 inline-block text-sm font-medium underline">
        Voltar ao dashboard
      </Link>
    </div>
  );
}

export default async function StoreAdminPage() {
  const ctx = await resolveStoreOwnerContext();

  if (ctx.status === "forbidden") {
    return (
      <Notice title="Acesso restrito">
        Esta área é exclusiva para lojistas parceiros.
      </Notice>
    );
  }

  if (ctx.status === "no-store") {
    return (
      <Notice title="Painel do lojista">
        Nenhuma loja está associada à sua conta. Fale com o suporte para vincular sua loja.
      </Notice>
    );
  }

  const { store } = ctx;
  const orders = await listOrdersForStore(store.id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Painel do lojista</h1>
      <p className="mt-1 text-foreground/70">
        {store.name} · {store.category}
      </p>

      <section
        aria-labelledby="new-product"
        className="mt-8 rounded-xl border border-black/10 p-5 dark:border-white/10"
      >
        <h2 id="new-product" className="text-lg font-semibold">
          Novo produto
        </h2>
        <div className="mt-4">
          <ProductForm mode="create" idPrefix="new" submitLabel="Adicionar produto" />
        </div>
      </section>

      <section aria-labelledby="orders" className="mt-10">
        <h2 id="orders" className="text-lg font-semibold">
          Pedidos recebidos
        </h2>

        {orders.length === 0 ? (
          <p className="mt-4 rounded-xl border border-black/10 p-5 text-sm text-foreground/70 dark:border-white/10">
            Sua loja ainda não recebeu nenhum pedido.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-col gap-2 rounded-xl border border-black/10 p-4 text-sm dark:border-white/10 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.customerName}</span>
                    <span className="font-mono text-xs text-foreground/50">#{order.id.slice(-6)}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-foreground/60">
                    {order.itemCount} {order.itemCount === 1 ? "item" : "itens"} ·{" "}
                    {formatCurrency(order.totalInCents)} · {ORDER_STATUS_LABELS[order.status]}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {getNextOrderStatusOptions(order.status).map((next) => (
                    <OrderStatusForm
                      key={next}
                      orderId={order.id}
                      nextStatus={next}
                      variant={next === "CANCELED" ? "danger" : "default"}
                    />
                  ))}
                  {getNextOrderStatusOptions(order.status).length === 0 && (
                    <span className="text-xs text-foreground/50">Pedido finalizado</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="menu" className="mt-10">
        <h2 id="menu" className="text-lg font-semibold">
          Cardápio
        </h2>

        {store.products.length === 0 ? (
          <p className="mt-4 rounded-xl border border-black/10 p-5 text-sm text-foreground/70 dark:border-white/10">
            Sua loja ainda não tem produtos ativos.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {store.products.map((product) => (
              <li
                key={product.id}
                className="rounded-xl border border-black/10 p-5 dark:border-white/10"
              >
                <p className="mb-3 text-sm text-foreground/60">
                  Preço atual: {formatCurrency(product.priceInCents)}
                </p>
                <ProductForm
                  mode="edit"
                  productId={product.id}
                  idPrefix={`product-${product.id}`}
                  submitLabel="Salvar alterações"
                  defaults={{
                    name: product.name,
                    description: product.description,
                    price: formatCentsForInput(product.priceInCents),
                  }}
                />
                <div className="mt-3 border-t border-black/10 pt-3 dark:border-white/10">
                  <RemoveProductForm productId={product.id} productName={product.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
