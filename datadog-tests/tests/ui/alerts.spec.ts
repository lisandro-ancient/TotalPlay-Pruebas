import { test, expect } from '@playwright/test';

test.describe('Alerts UI', () => {
  test('should navigate to alerts page', async ({ page }) => {
    await page.goto('/monitors/triggered', { waitUntil: 'networkidle' });
    try {
      await page.waitForURL(/monitors/, { timeout: 20000 });
    } catch (e) {
      // attach debug artifacts for investigation
      const screenshot = await page.screenshot();
      await test.info().attach('screenshot-on-failure', { body: screenshot, contentType: 'image/png' });
      const html = await page.content();
      await test.info().attach('page-html-on-failure', { body: html, contentType: 'text/html' });
      throw e;
    }
    await expect(page).toHaveURL(/monitors/);
  });
});
