import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  retries: 0,
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:3000',
  },
  workers: 1,
  projects: [
    {
      name: 'e2e',
      testMatch: /e2e\/.*\.spec\.ts/,
      use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
