import { test } from '@playwright/test';
import { MonitorPage } from '../../pages/MonitorPage';

test.describe('Monitors UI', () => {
  test('should load monitors list', async ({ page }) => {
    const monitorPage = new MonitorPage(page);
    await monitorPage.goto();
    await monitorPage.expectLoaded();
  });
});
