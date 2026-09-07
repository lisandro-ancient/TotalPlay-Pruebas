import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { credentials } from '../../fixtures/testData';

test.describe('Login', () => {
  test('lands on the Totalplay login page', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    await page.goto('https://totalplay-dev.ancient.mx/login');

    await expect(page).toHaveURL(/totalplay-dev\.ancient\.mx\/login/);

    const logo = page.locator('div.logo[aria-label="Total Play"]');
    await expect(logo).toBeVisible();
    await expect(page.locator('h1')).toHaveText('Iniciar sesión');
    await expect(page.locator('p.subtitle')).toHaveText('Videowall NOC · Análisis de negocio');

    await page.screenshot({ path: 'test-results/login-ui.png' });
    await context.close();
  });

  test('should login and logout successfully', async ({ browser }) => {
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await expect(page.locator('div.grid')).toBeVisible();

    await loginPage.logout();
    await loginPage.expectOnLoginPage();

    await context.close();
  });
});
