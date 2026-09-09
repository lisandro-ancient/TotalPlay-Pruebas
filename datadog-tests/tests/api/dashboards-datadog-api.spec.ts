import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';
import { printResponse } from '../../utils/assertions';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

test.describe('API de Dashboards', () => {
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

  // DB-01 — Dashboard "app-clientes"
  test('Dashboard app-clientes: responde 200 y devuelve métricas válidas', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/app-clientes?timeRange=4h`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'app-clientes metrics response');

    expect(response.status()).toBe(200);
    const body = JSON.parse(respText);
    expect(body.error).toBeNull();
    expect(body.timestamp).toEqual(expect.any(Number));
    expect(body.data.source).toBe('datadog');
    expect(body.data.dashboardId).toBe('vz6-cm5-bst');
    expect(body.data.range.key).toBe('4h');
    expect(body.data.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(body.data.refreshIntervalSeconds).toEqual(expect.any(Number));
    expect(body.data.staleAfterSeconds).toEqual(expect.any(Number));
  });

  // DB-01 — Validar shape de métricas
  test('Dashboard app-clientes: métricas con estructura correcta', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/app-clientes?timeRange=4h`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText2 = await response.text();
    await test.info().attach('response-body', { body: respText2, contentType: 'application/json' });
    await printResponse(respText2, 'app-clientes metrics shape response');
    const { data } = JSON.parse(respText2);
    const { metrics } = data;

    for (const key of ['availability', 'transactions2xx', 'errors4xx', 'errors5xx', 'responseSeconds']) {
      expect(metrics).toHaveProperty(key);
      expect(typeof metrics[key].value).toBe('number');
      expect(['ok', 'warn', 'critical']).toContain(metrics[key].status);
    }
  });

  // DB-01 — Resiliencia: delta/trend pueden ser null sin romper el 200
  test('Dashboard app-clientes: tolera campos delta nulos sin romper la respuesta', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/app-clientes?timeRange=4h`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText3 = await response.text();
    await test.info().attach('response-body', { body: respText3, contentType: 'application/json' });
    await printResponse(respText3, 'app-clientes resilient deltas response');

    expect(response.status()).toBe(200);
    const { data } = JSON.parse(respText3);
    const { metrics } = data;

    for (const key of Object.keys(metrics)) {
      const metric = metrics[key];
      expect(metric).toHaveProperty('value');
      expect(metric).toHaveProperty('status');
      if ('delta' in metric) expect(metric.delta === null || typeof metric.delta === 'number').toBe(true);
      if ('deltaPercent' in metric) expect(metric.deltaPercent === null || typeof metric.deltaPercent === 'number').toBe(true);
    }
  });

  // DB-01 — Negativo: sin token (401)
  test('Dashboard app-clientes: 401 sin token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/app-clientes?timeRange=4h`);
    const respText4 = await response.text();
    await test.info().attach('response-body', { body: respText4, contentType: 'application/json' });
    await printResponse(respText4, 'app-clientes unauthorized response');
    expect(response.status()).toBe(401);
  });

  // DB-01 — Negativo: dashboard inexistente (400)
  test('Dashboard: 400 para dashboard inexistente', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/non-existent?timeRange=4h`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText5 = await response.text();
    await test.info().attach('response-body', { body: respText5, contentType: 'application/json' });
    await printResponse(respText5, 'non-existent dashboard response');

    expect(response.status()).toBe(400);
    const body = JSON.parse(respText5);
    expect(body.data).toBeNull();
    expect(body.error).toContain('no encontrado');
    expect(body.timestamp).toEqual(expect.any(Number));
  });
});
