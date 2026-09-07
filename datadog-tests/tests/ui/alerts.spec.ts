import { test, expect } from '@playwright/test';

test.describe('Alerts UI', () => {
  test('should navigate to alerts page', async ({ page }) => {
    await page.goto('/monitors/triggered');
    await expect(page).toHaveURL(/monitors/);
  });
});
