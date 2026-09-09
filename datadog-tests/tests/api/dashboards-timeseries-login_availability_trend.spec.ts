import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';
import { printResponse } from '../../utils/assertions';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

test.describe('API de Dashboards - DB-08 timeseries login_availability_trend', () => {
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

  test('login_availability_trend: 200 y devuelve serie temporal para timeWindow=1d', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/timeseries/login_availability_trend?timeWindow=1d`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'login_availability_trend response');

    expect(response.status()).toBe(200);
    const body = JSON.parse(respText);
    expect(body.error).toBeNull();

    // Aceptar varias formas de respuesta: arreglo directo o en body.data u otros campos comunes
    let series: any = undefined;
    if (Array.isArray(body)) series = body;
    else if (body && Array.isArray(body.data)) series = body.data;
    else if (body && body.data && Array.isArray(body.data.series)) series = body.data.series;
    else if (body && body.data && Array.isArray(body.data.values)) series = body.data.values;

    expect(series).toBeDefined();
    expect(Array.isArray(series)).toBe(true);

    if (series.length > 0) {
      const item = series[0];
      // cada punto debería contener al menos un timestamp y/o un valor numérico
      expect(
        (item && typeof item.time === 'number') || (item && typeof item.timestamp === 'number') || (item && typeof item.value === 'number')
      ).toBe(true);
    }
  });

  test('login_availability_trend: 401 sin token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/dashboards/timeseries/login_availability_trend?timeWindow=1d`);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'login_availability_trend unauthorized response');
    expect(response.status()).toBe(401);
  });
});
