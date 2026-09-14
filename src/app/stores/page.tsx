import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { listActiveStores } from "@/lib/stores";

export default async function StoresPage() {
  await auth.protect();
  const stores = await listActiveStores();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Lojas</h1>
      <p className="mt-2 text-foreground/70">
        Escolha uma loja parceira para ver o cardápio.
      </p>

      {stores.length === 0 ? (
        <p className="mt-6 rounded-lg border border-black/10 px-4 py-3 text-sm dark:border-white/10">
          Nenhuma loja disponível no momento.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {stores.map((store) => (
            <li key={store.id}>
              <Link
                href={`/stores/${store.id}`}
                className="flex items-center justify-between rounded-lg border border-black/10 px-4 py-3 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
              >
                <span>
                  <span className="font-medium">{store.name}</span>{" "}
                  <span className="text-foreground/60">· {store.category}</span>
                </span>
                <span className="text-foreground/60">★ {store.rating.toFixed(1)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
