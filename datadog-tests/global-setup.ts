import { chromium } from '@playwright/test';
import { credentials } from './fixtures/testData';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE_URL}/account/login`, { timeout: 60000 });
  await page.fill('#login-email', credentials.username);
  await page.fill('#login-password', credentials.password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 60000 });

  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
}
