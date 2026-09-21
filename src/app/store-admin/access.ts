import { auth, currentUser } from "@clerk/nextjs/server";
import { isStoreOwner, parseRole } from "@/lib/roles";
import { getOwnedStoreWithProducts } from "@/lib/store-admin";
import { upsertLocalUser } from "@/lib/users";

type OwnedStore = NonNullable<Awaited<ReturnType<typeof getOwnedStoreWithProducts>>>;

export type StoreOwnerContext =
  | { status: "forbidden" }
  | { status: "no-store" }
  | { status: "ok"; userId: string; store: OwnedStore };

// Single entry point for every store-admin page and Server Action: the role is
// always read from Clerk (never trusted from the client or the local mirror),
// and the store is always the one owned by the resolved local user.
export async function resolveStoreOwnerContext(): Promise<StoreOwnerContext> {
  await auth.protect();
  const user = await currentUser();
  if (!user) {
    return { status: "forbidden" };
  }

  const role = parseRole(user.publicMetadata);
  if (!isStoreOwner(role)) {
    return { status: "forbidden" };
  }

  const localUser = await upsertLocalUser({
    clerkId: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? "",
    name: user.firstName,
    role,
  });

  const store = await getOwnedStoreWithProducts(localUser.id);
  if (!store) {
    return { status: "no-store" };
  }

  return { status: "ok", userId: localUser.id, store };
}
