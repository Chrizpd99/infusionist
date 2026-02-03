import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'https://studious-funicular-4rjr7qvjrpwc5gqx-5000.app.github.dev',
    trace: 'on-first-retry',
  },
  webServer: undefined,
});
