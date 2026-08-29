import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight">DeliveryIA</h1>
      <p className="text-base text-foreground/70">
        Projeto estruturado com base no Fluxo de Delivery (Spec-Driven
        Development). Este esqueleto técnico já traz Next.js, Clerk, Prisma e
        Playwright configurados — os requisitos de produto em{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">
          docs/prd.md
        </code>{" "}
        e{" "}
        <code className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">
          docs/spec.md
        </code>{" "}
        ainda precisam ser preenchidos para orientar as próximas
        funcionalidades.
      </p>
      <Link
        href="/dashboard"
        className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Ir para o dashboard
      </Link>
    </div>
  );
}
