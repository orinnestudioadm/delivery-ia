import { defineConfig, devices } from "@playwright/test";
import { hasClerkKeys } from "./tests/e2e/support/auth";

// Playwright runs outside Next.js, so .env is not loaded automatically.
// The Clerk testing helpers read CLERK_SECRET_KEY / the publishable key from
// process.env, so load .env here (no-op when the file is missing, e.g. in CI
// where the values come from repository secrets).
try {
  process.loadEnvFile(".env");
} catch {
  // .env not present — rely on the environment.
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    // Fetches a Clerk testing token once, before the browser projects run.
    { name: "setup", testMatch: /global\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
  // Next.js cannot boot without valid Clerk keys, so only start it when they
  // exist; otherwise the E2E tests skip instead of hanging on the server.
  webServer: hasClerkKeys()
    ? {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
});
