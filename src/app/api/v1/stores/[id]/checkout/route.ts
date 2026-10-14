import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { CheckoutError, createOrder } from "@/lib/orders";

// RNF-03: checkout é exposto como endpoint REST versionado, não como Server
// Action. A regra de negócio (recálculo de preço, validação) continua em
// src/lib/orders.ts — esta rota só traduz HTTP <-> domínio.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Autenticação necessária." }, { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Sessão inválida. Faça login novamente." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const { id: storeId } = await params;
  const items = (body as { items?: unknown } | null)?.items;

  try {
    const orderId = await createOrder(
      {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        name: user.firstName,
      },
      { storeId, items },
    );
    return NextResponse.json({ orderId });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
