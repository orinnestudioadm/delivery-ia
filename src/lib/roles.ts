export type UserRole = "CUSTOMER" | "STORE_OWNER";

// Reads the role from Clerk's publicMetadata (only editable by the backend or
// the Clerk dashboard). Anything other than an explicit STORE_OWNER is a
// CUSTOMER, so a missing or malformed value never grants elevated access.
export function parseRole(publicMetadata: unknown): UserRole {
  if (
    typeof publicMetadata === "object" &&
    publicMetadata !== null &&
    (publicMetadata as { role?: unknown }).role === "STORE_OWNER"
  ) {
    return "STORE_OWNER";
  }
  return "CUSTOMER";
}

export function isStoreOwner(role: UserRole): boolean {
  return role === "STORE_OWNER";
}
