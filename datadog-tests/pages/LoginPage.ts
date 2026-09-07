import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/account/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('#login-email', username);
    await this.page.fill('#login-password', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL((url) => !url.pathname.includes('/login'));
  }

  async logout() {
    await this.page.click('button[aria-label="Menú de la sesión"]');
    await this.page.click('button.leave');
    await this.page.waitForURL((url) => url.pathname.includes('/login'));
  }

  async expectOnLoginPage() {
    await expect(this.page.locator('h1')).toHaveText('Iniciar sesión');
  }
}
