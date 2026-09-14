import { prisma } from "./prisma";
import { listActiveStores, type StoreSummary } from "./stores";

export type OrderHistoryEntry = {
  storeId: string;
  category: string;
};

const CATEGORY_MATCH_WEIGHT = 10;
const STORE_MATCH_WEIGHT = 5;

export function rankStoresByHistory(
  stores: StoreSummary[],
  history: OrderHistoryEntry[],
): StoreSummary[] {
  if (history.length === 0) {
    return [...stores].sort((a, b) => b.rating - a.rating);
  }

  const categoryCounts = new Map<string, number>();
  const storeCounts = new Map<string, number>();
  for (const entry of history) {
    categoryCounts.set(entry.category, (categoryCounts.get(entry.category) ?? 0) + 1);
    storeCounts.set(entry.storeId, (storeCounts.get(entry.storeId) ?? 0) + 1);
  }

  function score(store: StoreSummary): number {
    const categoryScore = (categoryCounts.get(store.category) ?? 0) * CATEGORY_MATCH_WEIGHT;
    const storeScore = (storeCounts.get(store.id) ?? 0) * STORE_MATCH_WEIGHT;
    return categoryScore + storeScore + store.rating;
  }

  return [...stores].sort((a, b) => score(b) - score(a));
}

export async function getRecommendedStores(clerkUserId: string): Promise<StoreSummary[]> {
  const stores = await listActiveStores();

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUserId },
    select: { id: true },
  });
  if (!user) {
    return rankStoresByHistory(stores, []);
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    select: { store: { select: { id: true, category: true } } },
  });
  const history = orders.map((order) => ({
    storeId: order.store.id,
    category: order.store.category,
  }));

  return rankStoresByHistory(stores, history);
}
