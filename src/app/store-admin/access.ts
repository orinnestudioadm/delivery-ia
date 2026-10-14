import { auth, currentUser } from "@clerk/nextjs/server";
import { isStoreOwner, parseRole } from "@/lib/roles";
import { getOwnedStoreWithProducts } from "@/lib/store-admin";
import { upsertLocalUser } from "@/lib/users";

type OwnedStore = NonNullable<Awaited<ReturnType<typeof getOwnedStoreWithProducts>>>;
type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

export type StoreOwnerContext =
  | { status: "forbidden" }
  | { status: "no-store" }
  | { status: "ok"; userId: string; store: OwnedStore };

export type StoreOwnerApiContext = StoreOwnerContext | { status: "unauthenticated" };

// Shared by the page and the API variant below: the role is always read
// from Clerk (never trusted from the client or the local mirror), and the
// store is always the one owned by the resolved local user.
async function buildStoreOwnerContext(user: ClerkUser): Promise<StoreOwnerContext> {
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

// Used by the /store-admin page: auth.protect() redirects to sign-in when
// there is no session, which is the right behavior for a page render.
export async function resolveStoreOwnerContext(): Promise<StoreOwnerContext> {
  await auth.protect();
  const user = await currentUser();
  if (!user) {
    return { status: "forbidden" };
  }
  return buildStoreOwnerContext(user);
}

// Used by the /api/v1/store-admin/** routes: a redirect would be wrong for
// a JSON API, so this returns an explicit "unauthenticated" status instead
// and lets the route handler map it to a 401 response.
export async function resolveStoreOwnerApiContext(): Promise<StoreOwnerApiContext> {
  const { userId } = await auth();
  if (!userId) {
    return { status: "unauthenticated" };
  }
  const user = await currentUser();
  if (!user) {
    return { status: "unauthenticated" };
  }
  return buildStoreOwnerContext(user);
}
