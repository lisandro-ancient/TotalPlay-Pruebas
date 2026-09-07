import { defineConfig, devices } from '@playwright/test';
import { BASE_URL, API_BASE_URL } from './utils/config';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  fullyParallel: true,
  retries: 2,
  timeout: 60000,
  workers: 2,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true,
    }],
    ['list'],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'auth.json',
        video: {
          mode: 'retain-on-failure',
          size: { width: 1280, height: 720 },
        },
        screenshot: 'only-on-failure',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
    },
    {
      name: 'websocket',
      testDir: './tests/websocket',
    },
  ],
});
