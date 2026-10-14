import { clerkSetup } from "@clerk/testing/playwright";
import { hasClerkKeys } from "./support/auth";

// Runs once in the main Playwright process, before any worker is spawned —
// the testing token it fetches is written to process.env, which child
// worker processes inherit at spawn time. This only works as a real
// globalSetup export (playwright.config.ts's `globalSetup`); a Playwright
// "setup project" test runs inside its own worker process instead, so the
// token it sets never reaches the sibling workers that run the real specs
// (fullyParallel distributes them across separate processes), which is why
// sign-in only worked for whichever test happened to share that worker.
export default async function globalSetup() {
  if (!hasClerkKeys()) {
    return;
  }
  await clerkSetup();
}
