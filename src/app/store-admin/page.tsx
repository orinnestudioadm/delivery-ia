import Link from "next/link";
import { formatCentsForInput } from "@/lib/price";
import { formatCurrency } from "@/lib/format";
import { resolveStoreOwnerContext } from "./access";
import {
  createProductAction,
  removeProductAction,
  updateProductAction,
} from "./actions";
import { ProductForm, RemoveProductForm } from "./product-form";

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
          <ProductForm action={createProductAction} idPrefix="new" submitLabel="Adicionar produto" />
        </div>
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
                  action={updateProductAction.bind(null, product.id)}
                  idPrefix={`product-${product.id}`}
                  submitLabel="Salvar alterações"
                  defaults={{
                    name: product.name,
                    description: product.description,
                    price: formatCentsForInput(product.priceInCents),
                  }}
                />
                <div className="mt-3 border-t border-black/10 pt-3 dark:border-white/10">
                  <RemoveProductForm
                    action={removeProductAction.bind(null, product.id)}
                    productName={product.name}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
