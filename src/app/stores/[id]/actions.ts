"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { CheckoutError, createOrder } from "@/lib/orders";

export type CheckoutResult = { orderId: string } | { error: string };

export async function checkoutAction(
  storeId: string,
  items: { productId: string; quantity: number }[],
): Promise<CheckoutResult> {
  await auth.protect();
  const user = await currentUser();
  if (!user) {
    return { error: "Sessão inválida. Faça login novamente." };
  }

  try {
    const orderId = await createOrder(
      {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        name: user.firstName,
      },
      { storeId, items },
    );
    return { orderId };
  } catch (error) {
    if (error instanceof CheckoutError) {
      return { error: error.message };
    }
    throw error;
  }
}
