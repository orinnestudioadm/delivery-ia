import { prisma } from "./prisma";
import type { UserRole } from "./roles";

// No Clerk webhook is wired up yet, so the local User row is created lazily
// on the first write operation (checkout) or on the first store-admin visit
// rather than on sign-up.
export async function upsertLocalUser(input: {
  clerkId: string;
  email: string;
  name?: string | null;
  role?: UserRole;
}) {
  return prisma.user.upsert({
    where: { clerkId: input.clerkId },
    update: { email: input.email, name: input.name ?? undefined, role: input.role },
    create: {
      clerkId: input.clerkId,
      email: input.email,
      name: input.name ?? undefined,
      role: input.role,
    },
  });
}
