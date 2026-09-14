import { z } from "zod";
import { prisma } from "./prisma";

const storeIdSchema = z.string().min(1);

export type StoreSummary = {
  id: string;
  name: string;
  category: string;
  rating: number;
};

export type StoreWithProducts = StoreSummary & {
  products: {
    id: string;
    name: string;
    description: string;
    priceInCents: number;
  }[];
};

export async function listActiveStores(): Promise<StoreSummary[]> {
  const stores = await prisma.store.findMany({
    where: { isActive: true },
    orderBy: { rating: "desc" },
    select: { id: true, name: true, category: true, rating: true },
  });

  return stores;
}

export async function getStoreWithProducts(
  rawId: string,
): Promise<StoreWithProducts | null> {
  const parsed = storeIdSchema.safeParse(rawId);
  if (!parsed.success) {
    return null;
  }

  const store = await prisma.store.findFirst({
    where: { id: parsed.data, isActive: true },
    select: {
      id: true,
      name: true,
      category: true,
      rating: true,
      products: {
        where: { isActive: true },
        select: { id: true, name: true, description: true, priceInCents: true },
      },
    },
  });

  return store;
}
