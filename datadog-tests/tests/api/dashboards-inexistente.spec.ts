import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';
import { printResponse } from '../../utils/assertions';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

test.describe('API de Dashboards - DB-07 dashboard inexistente', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const auth = new AuthClient(request);
    const response = await auth.login(credentials.username, credentials.password);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'login response');
    const body = JSON.parse(respText);
    token = body.data.accessToken;
  });

  test('Dashboard inexistente: 400 y error indicando dashboard no encontrado', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/dashboard-inexistente?timeRange=1h`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'dashboard-inexistente response');

    expect(response.status()).toBe(400);
    const body = JSON.parse(respText);
    expect(body.data).toBeNull();
    expect(body.error).toBeDefined();
    // Mensaje de error debe indicar que no fue encontrado o que el path es inválido
    expect(
      typeof body.error === 'string' && (body.error.includes('no encontrado') || body.error.includes('not found') || body.error.includes('invalid'))
    ).toBe(true);
  });

  test('Dashboard inexistente: 401 sin token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/dashboard-inexistente?timeRange=1h`);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'dashboard-inexistente unauthorized response');
    expect(response.status()).toBe(401);
  });
});
