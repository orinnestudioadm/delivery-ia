import Link from "next/link";
import { notFound } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getOrderForUser,
  OrderForbiddenError,
  OrderNotFoundError,
} from "@/lib/orders";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  getOrderStatusDescription,
  getOrderStatusStep,
  type OrderStatus,
} from "@/lib/order-status";
import { formatCurrency } from "@/lib/format";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Store as StoreIcon,
  Truck,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const STEP_ICONS = [Clock, Package, Truck, CheckCircle2];

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth.protect();
  const user = await currentUser();
  if (!user) {
    notFound();
  }

  const { id } = await params;

  let order;
  let isForbidden = false;

  try {
    order = await getOrderForUser(user.id, id);
  } catch (error) {
    if (error instanceof OrderForbiddenError) {
      isForbidden = true;
    } else if (error instanceof OrderNotFoundError) {
      notFound();
    } else {
      throw error;
    }
  }

  if (isForbidden || !order) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center dark:border-red-500/30">
          <AlertTriangle className="mx-auto size-10 text-red-500" aria-hidden />
          <h1 className="mt-3 text-xl font-semibold text-red-600 dark:text-red-400">
            Acesso Não Autorizado (403)
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            Você não tem permissão para visualizar este pedido ou ele pertence a outro usuário.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = getOrderStatusStep(order.status);
  const isCanceled = order.status === "CANCELED";

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Voltar aos meus pedidos
        </Link>
        <span className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-mono text-foreground/70 dark:bg-white/5">
          Pedido #{order.id.slice(-8)}
        </span>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Acompanhamento do Pedido</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/70">
              <StoreIcon className="size-4" aria-hidden />
              <span>{order.storeName}</span>
              <span>·</span>
              <span className="capitalize">{order.storeCategory}</span>
            </p>
          </div>
          <div className="text-sm sm:text-right">
            <span className="text-xs text-foreground/60">Data do pedido</span>
            <p className="font-medium">
              {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="mt-8 rounded-xl border border-black/5 bg-zinc-50 p-6 dark:border-white/5 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
              Status do Pedido
            </h2>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                isCanceled
                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : order.status === "DELIVERED"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
              }`}
            >
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </div>

          <p className="mt-2 text-sm text-foreground/80">
            {getOrderStatusDescription(order.status)}
          </p>

          {isCanceled ? (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
              <XCircle className="size-5 shrink-0" aria-hidden />
              <span>Este pedido foi cancelado e não receberá mais atualizações de entrega.</span>
            </div>
          ) : (
            <div className="mt-8">
              <div className="relative flex items-center justify-between">
                {/* Connecting progress line */}
                <div
                  className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-zinc-200 dark:bg-zinc-800"
                  aria-hidden
                />
                <div
                  className="absolute left-0 top-1/2 h-1 -translate-y-1/2 bg-foreground transition-all duration-500"
                  style={{
                    width: `${(Math.max(0, currentStep) / (ORDER_STATUS_FLOW.length - 1)) * 100}%`,
                  }}
                  aria-hidden
                />

                {/* Steps */}
                {ORDER_STATUS_FLOW.map((statusStep, index) => {
                  const Icon = STEP_ICONS[index] ?? CheckCircle2;
                  const isCompleted = currentStep >= index;
                  const isCurrent = currentStep === index;

                  return (
                    <div
                      key={statusStep}
                      className="relative z-10 flex flex-col items-center gap-2"
                    >
                      <div
                        className={`flex size-10 items-center justify-center rounded-full border-2 transition-all ${
                          isCurrent
                            ? "border-foreground bg-foreground text-background ring-4 ring-foreground/20"
                            : isCompleted
                            ? "border-foreground bg-foreground text-background"
                            : "border-zinc-300 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
                        }`}
                      >
                        <Icon className="size-4" aria-hidden />
                      </div>
                      <span
                        className={`text-xs text-center font-medium ${
                          isCurrent
                            ? "text-foreground font-semibold"
                            : isCompleted
                            ? "text-foreground/80"
                            : "text-foreground/40"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[statusStep as OrderStatus]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="mt-8">
          <h2 className="text-base font-semibold">Itens do Pedido</h2>
          <div className="mt-3 divide-y divide-black/5 rounded-xl border border-black/10 dark:divide-white/5 dark:border-white/10">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 text-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.quantity}x</span>
                    <span className="font-medium">{item.productName}</span>
                  </div>
                  {item.productDescription && (
                    <p className="mt-0.5 text-xs text-foreground/60">
                      {item.productDescription}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-medium">
                    {formatCurrency(item.unitPriceInCents * item.quantity)}
                  </span>
                  {item.quantity > 1 && (
                    <p className="text-xs text-foreground/60">
                      {item.quantity} × {formatCurrency(item.unitPriceInCents)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-foreground/5 p-4 dark:bg-white/5">
            <span className="text-base font-semibold">Valor Total</span>
            <span className="text-lg font-bold">
              {formatCurrency(order.totalInCents)}
            </span>
          </div>
        </div>

        {/* Actions / Navigation */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href={`/stores/${order.storeId}`}
            className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5"
          >
            Ver cardápio da loja
          </Link>
          <Link
            href="/stores"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            Fazer outro pedido
          </Link>
        </div>
      </div>
    </div>
  );
}
