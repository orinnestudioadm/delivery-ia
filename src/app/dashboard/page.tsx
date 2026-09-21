import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { listOrdersForUser } from "@/lib/orders";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status";
import { getRecommendedStores } from "@/lib/recommendations";
import { isStoreOwner, parseRole } from "@/lib/roles";
import { formatCurrency } from "@/lib/format";
import { ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  await auth.protect();
  const user = await currentUser();
  const orders = user ? await listOrdersForUser(user.id) : [];
  const recommendedStores = user ? await getRecommendedStores(user.id) : [];
  const isOwner = user ? isStoreOwner(parseRole(user.publicMetadata)) : false;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-foreground/70">
            Olá, {user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "usuário"}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isOwner && (
            <Link
              href="/store-admin"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              Painel do lojista
            </Link>
          )}
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Ver Lojas
          </Link>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShoppingBag className="size-5" aria-hidden />
          Meus Pedidos
        </h2>

        {orders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-black/10 p-6 text-center dark:border-white/10">
            <p className="text-sm text-foreground/70">
              Você ainda não realizou nenhum pedido.
            </p>
            <Link
              href="/stores"
              className="mt-4 inline-block text-sm font-medium text-foreground underline hover:opacity-80"
            >
              Explorar restaurantes e lojas
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-black/5 rounded-xl border border-black/10 bg-white dark:divide-white/5 dark:border-white/10 dark:bg-zinc-950">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{order.storeName}</span>
                    <span className="text-xs text-foreground/50 font-mono">
                      #{order.id.slice(-6)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-foreground/60">
                    {order.itemCount} {order.itemCount === 1 ? "item" : "itens"} ·{" "}
                    {formatCurrency(order.totalInCents)} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === "DELIVERED"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : order.status === "CANCELED"
                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                        : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                  </span>
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
                  >
                    Acompanhar
                    <ArrowRight className="size-3" aria-hidden />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {recommendedStores.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="size-5" aria-hidden />
            Recomendado para você
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {recommendedStores.slice(0, 4).map((store) => (
              <Link
                key={store.id}
                href={`/stores/${store.id}`}
                className="flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
              >
                <span>
                  <span className="font-medium">{store.name}</span>{" "}
                  <span className="text-foreground/60">· {store.category}</span>
                </span>
                <span className="text-foreground/60">★ {store.rating.toFixed(1)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
