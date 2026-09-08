import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

test.describe('API de Dashboards - DB-06 servicio-iptv / seis-servicios-iptv', () => {
  let token: string;

  // Helper: fetch with simple retry for 5xx, attach last body, return parsed JSON when possible
  async function fetchWithRetries(request: any, url: string, opts: any) {
    let lastText = '';
    let res: any;
    for (let attempt = 0; attempt < 3; attempt++) {
      res = await request.get(url, opts);
      const text = await res.text();
      lastText = text;
      await test.info().attach('response-body', { body: text, contentType: 'application/json' });
      if (!(res.status() >= 500 && res.status() < 600)) {
        try {
          return { response: res, text, json: JSON.parse(text) };
        } catch (e) {
          return { response: res, text, json: undefined };
        }
      }
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }
    return { response: res, text: lastText, json: undefined };
  }

  test.beforeAll(async ({ request }) => {
    const auth = new AuthClient(request);
    const response = await auth.login(credentials.username, credentials.password);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    const body = JSON.parse(respText);
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
    const { response, json: body, text } = await fetchWithRetries(request, `${BASE_URL}/api/dashboards/servicio-iptv`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status() >= 500 && response.status() < 600) throw new Error(`Server error ${response.status()} from servicio-iptv: ${text}`);
    expect(response.status()).toBe(200);
    expect(body).toBeDefined();

    const metrics = body.data.metrics || body.data || {};
    const present = expectedMetrics.filter((m) => Object.prototype.hasOwnProperty.call(metrics, m));
    expect(present.length).toBeGreaterThanOrEqual(5);
  });

  test('seis-servicios-iptv: 200 y contiene métricas esperadas', async ({ request }) => {
    const { response, json: body, text } = await fetchWithRetries(request, `${BASE_URL}/api/dashboards/seis-servicios-iptv`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status() >= 500 && response.status() < 600) throw new Error(`Server error ${response.status()} from seis-servicios-iptv: ${text}`);
    expect(response.status()).toBe(200);
    expect(body).toBeDefined();

    const metrics = body.data.metrics || body.data || {};
    const present = expectedMetrics.filter((m) => Object.prototype.hasOwnProperty.call(metrics, m));
    expect(present.length).toBeGreaterThanOrEqual(5);
  });

  test('servicio-iptv: 401 sin token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/servicio-iptv`);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    expect(response.status()).toBe(401);
  });

  test('seis-servicios-iptv: 401 sin token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/seis-servicios-iptv`);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    expect(response.status()).toBe(401);
  });
});
