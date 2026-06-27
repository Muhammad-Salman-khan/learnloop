import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for ai-powered-lms-new.
 *
 * Run: `pnpm test:e2e`
 * UI:  `pnpm test:e2e:ui`
 *
 * Conventions enforced (see AGENTS.md → Testing & CI):
 *  - Chromium only by default.
 *  - Dedicated E2E port (3100), never collides with `pnpm dev` on 3000.
 *  - dotenv-cli loads .env.local into the dev server.
 *  - Storage state files in `e2e/.auth/` — one per role — produced by the
 *    `setup` project, which depends on `e2e/auth.setup.ts`.
 *
 * Skip-mode: touching `.e2e-skip-auth` (a sentinel file) makes the setup
 * project empty. Why a file flag instead of an env var? Because the dev
 * runner can be triggered from a CI script that may strip env vars; a
 * sentinel file is unambiguous. Create it with `touch .e2e-skip-auth`,
 * delete it with `rm .e2e-skip-auth`.
 */
import { existsSync } from "node:fs";
const skipAuthSetup = existsSync(".e2e-skip-auth");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "list" : "list",

  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3100",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // Run first — writes e2e/.auth/<role>.json for every fixture role.
    // Skipped (empty test list) when `.e2e-skip-auth` exists.
    {
      name: "setup",
      testMatch: skipAuthSetup ? /__NEVER__/ : /auth\.setup\.ts/,
    },

    // Public, unauthenticated.
    {
      name: "public",
      testMatch: /auth\.spec\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"] },
    },
    // Each role carries its own storage state; specs opt in via project.
    {
      name: "student",
      testMatch: /(dashboard-student|forms)\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/student.json",
      },
    },
    {
      name: "teacher",
      testMatch: /dashboard-teacher\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/teacher.json",
      },
    },
    {
      name: "admin",
      testMatch: /dashboard-admin\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/admin.json",
      },
    },
    {
      name: "superadmin",
      testMatch: /dashboard-superadmin\.spec\.ts/,
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/superAdmin.json",
      },
    },
  ],

  webServer: {
    // dotenv-cli injects .env.local into Next.js so DATABASE_URL is available.
    command: "pnpm exec dotenv -e .env.local -- pnpm next dev -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
