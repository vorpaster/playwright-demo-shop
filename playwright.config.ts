import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for SauceDemo E2E tests.
 *
 * Design decisions:
 * - Single baseURL so tests stay portable (CI vs local)
 * - 2 retries on CI only — avoids masking real failures locally
 * - HTML + list reporters: HTML for detailed post-run review, list for readable CI output
 * - Screenshot and video only on failure — keeps artifacts lean
 * - Chromium only for this assignment; a real project would add Firefox + WebKit
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
