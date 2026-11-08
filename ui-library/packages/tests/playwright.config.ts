import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }]],
  // The Storybook dev server compiles story modules lazily; under parallel
  // workers a cold story's first load can exceed the 30s default test budget.
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:6006",
    trace: "on-first-retry",
    // The Storybook dev server compiles story modules lazily; under parallel
    // workers a cold iframe's `load` event can exceed Playwright's default 30s.
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm --filter @tu-ui/storybook dev",
    url: "http://localhost:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
