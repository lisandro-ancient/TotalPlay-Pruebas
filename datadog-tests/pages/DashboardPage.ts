import { Page, expect } from '@playwright/test';

export class DashboardPage {
  private dashboardItems = this.page.locator('div.grid a');

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async expectLoaded() {
    await expect(this.page.locator('div.grid')).toBeVisible();
  }

  async getDashboardCount() {
    return this.dashboardItems.count();
  }

  async navigateTo(path: string) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(3000);
  }
}
