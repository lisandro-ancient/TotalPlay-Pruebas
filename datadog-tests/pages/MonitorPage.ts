import { Page, expect } from '@playwright/test';

export class MonitorPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/monitors/manage');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/monitors/);
  }
}
