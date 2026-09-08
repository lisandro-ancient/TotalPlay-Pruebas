import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

test.describe('API de Dashboards - analisis-negocio (DB-05)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const auth = new AuthClient(request);
    const response = await auth.login(credentials.username, credentials.password);
    const body = await response.json();
    token = body.data.accessToken;
  });

  test('Dashboard analisis-negocio: 200 y tolera campos null/arrays vacíos', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/analisis-negocio`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });

    expect(response.status()).toBe(200);
    const body = JSON.parse(respText);
    expect(body.error).toBeNull();
    expect(body.data).toBeDefined();

    const mp = body.data.marketplace;
    expect(mp).toBeDefined();

    // visitas: número
    expect(typeof mp.visitas).toBe('number');

    // pedidos/ventas pueden ser null o número
    expect(mp).toHaveProperty('pedidos');
    expect(mp.pedidos === null || typeof mp.pedidos === 'number').toBe(true);

    expect(mp).toHaveProperty('ventas');
    expect(mp.ventas === null || typeof mp.ventas === 'number').toBe(true);

    // conversion: número
    expect(typeof mp.conversion).toBe('number');

    // tendenciaHoy: array de objetos { time:number, value:number }
    expect(Array.isArray(mp.tendenciaHoy)).toBe(true);
    if (mp.tendenciaHoy.length > 0) {
      const item = mp.tendenciaHoy[0];
      expect(typeof item.time).toBe('number');
      expect(typeof item.value).toBe('number');
    }

    // tendenciaPromedio: puede ser array vacío
    expect(Array.isArray(mp.tendenciaPromedio)).toBe(true);
  });

  test('Dashboard analisis-negocio: 401 sin token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/analisis-negocio`);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    expect(response.status()).toBe(401);
  });
});
