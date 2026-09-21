import { clerk } from "@clerk/testing/playwright";
import type { Page } from "@playwright/test";

const PLACEHOLDER = /placeholder/i;

function isSet(value: string | undefined): value is string {
  return !!value && !PLACEHOLDER.test(value);
}

// True when the Clerk dev-instance keys required by @clerk/testing exist.
export function hasClerkKeys(): boolean {
  return (
    isSet(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    isSet(process.env.CLERK_SECRET_KEY)
  );
}

// True when a dedicated E2E user (created in the Clerk dashboard) is configured.
export function hasTestUser(): boolean {
  return (
    hasClerkKeys() &&
    isSet(process.env.E2E_CLERK_USER_USERNAME) &&
    isSet(process.env.E2E_CLERK_USER_PASSWORD)
  );
}

// Signs in a user through Clerk's testing helper (password strategy, no MFA).
// clerk.signIn requires an unprotected page that loads Clerk to be open first.
export async function signInAs(page: Page, identifier: string, password: string): Promise<void> {
  await page.goto("/");
  await clerk.signIn({
    page,
    signInParams: { strategy: "password", identifier, password },
  });
}

// Signs in the dedicated E2E customer user.
export async function signInAsTestUser(page: Page): Promise<void> {
  await signInAs(page, process.env.E2E_CLERK_USER_USERNAME!, process.env.E2E_CLERK_USER_PASSWORD!);
}
