import { prisma } from "./prisma";

// No Clerk webhook is wired up yet, so the local User row is created lazily
// on the first write operation (checkout) rather than on sign-up.
export async function upsertLocalUser(input: {
  clerkId: string;
  email: string;
  name?: string | null;
}) {
  return prisma.user.upsert({
    where: { clerkId: input.clerkId },
    update: { email: input.email, name: input.name ?? undefined },
    create: { clerkId: input.clerkId, email: input.email, name: input.name ?? undefined },
  });
}
