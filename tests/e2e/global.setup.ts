import { clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";
import { hasClerkKeys } from "./support/auth";

// Fetches a Clerk testing token (bypasses bot protection in dev instances)
// and exposes it to every test via environment variables.
// Skipped — not failed — while the Clerk keys are not configured, so the
// suite degrades to "skipped" instead of breaking on a fresh clone.
setup.skip(!hasClerkKeys(), "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY not configured");

setup("configure Clerk testing token", async () => {
  await clerkSetup();
});
