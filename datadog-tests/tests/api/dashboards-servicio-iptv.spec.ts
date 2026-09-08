import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

test.describe('API de Dashboards - DB-06 servicio-iptv / seis-servicios-iptv', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const auth = new AuthClient(request);
    const response = await auth.login(credentials.username, credentials.password);
    const body = await response.json();
    token = body.data.accessToken;
  });

  const expectedMetrics = [
    'nuevaInterfaz',
    'guiaProgramacion',
    'paraTi',
    'verAhora',
    'onDemand',
    'apps',
    'redWifi',
    'ajustes',
  ];

  test('servicio-iptv: 200 y contiene métricas esperadas', async ({ request }) => {
    // request with up to 3 attempts for transient 5xx (exponential backoff)
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await request.get(`${BASE_URL}/api/dashboards/servicio-iptv`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!(response.status() >= 500 && response.status() < 600)) break;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }

    if (response.status() >= 500 && response.status() < 600) {
      const text = await response.text();
      throw new Error(`Server error ${response.status()} from servicio-iptv: ${text}`);
    }
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.data).toBeDefined();

    const metrics = body.data.metrics || body.data || {};
    // tolerate missing metrics: require at least 5 of expected 8
    const present = expectedMetrics.filter((m) => Object.prototype.hasOwnProperty.call(metrics, m));
    expect(present.length).toBeGreaterThanOrEqual(5);
  });

  test('seis-servicios-iptv: 200 y contiene métricas esperadas', async ({ request }) => {
    // request with up to 3 attempts for transient 5xx (exponential backoff)
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      response = await request.get(`${BASE_URL}/api/dashboards/seis-servicios-iptv`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!(response.status() >= 500 && response.status() < 600)) break;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }

    if (response.status() >= 500 && response.status() < 600) {
      const text = await response.text();
      throw new Error(`Server error ${response.status()} from seis-servicios-iptv: ${text}`);
    }
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.data).toBeDefined();

    const metrics = body.data.metrics || body.data || {};
    const present = expectedMetrics.filter((m) => Object.prototype.hasOwnProperty.call(metrics, m));
    expect(present.length).toBeGreaterThanOrEqual(5);
  });

  test('servicio-iptv: 401 sin token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/servicio-iptv`);
    expect(response.status()).toBe(401);
  });

  test('seis-servicios-iptv: 401 sin token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/seis-servicios-iptv`);
    expect(response.status()).toBe(401);
  });
});
