import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  await auth.protect();
  const user = await currentUser();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-foreground/70">
        Rota protegida por verificação de autenticação no próprio Server
        Component — só é acessível com sessão autenticada.
      </p>
      <p className="mt-6 rounded-lg border border-black/10 px-4 py-3 text-sm dark:border-white/10">
        Olá, {user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "usuário"}.
      </p>
    </div>
  );
}
