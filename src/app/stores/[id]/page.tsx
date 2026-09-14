import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getStoreWithProducts } from "@/lib/stores";
import { Cart } from "./cart";

export default async function StorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth.protect();
  const { id } = await params;
  const store = await getStoreWithProducts(id);

  if (!store) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">{store.name}</h1>
      <p className="mt-1 text-foreground/70">
        {store.category} · ★ {store.rating.toFixed(1)}
      </p>

      {store.products.length === 0 ? (
        <p className="mt-6 rounded-lg border border-black/10 px-4 py-3 text-sm dark:border-white/10">
          Esta loja ainda não tem produtos no cardápio.
        </p>
      ) : (
        <Cart storeId={store.id} products={store.products} />
      )}
    </div>
  );
}
