import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';
import { printResponse } from '../../utils/assertions';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

test.describe('API de Autenticación - Perfil', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const auth = new AuthClient(request);
    const response = await auth.login(credentials.username, credentials.password);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'auth-me response');
    await printResponse(respText, 'login response');
    const body = JSON.parse(respText);
    token = body.data.accessToken;
  });

  test('Obtener perfil: responde 200 y devuelve usuario autenticado', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'auth-me timestamps response');

    expect(response.status()).toBe(200);
    const body = JSON.parse(respText);

    // AUTH-05 — Obtener perfil (Me)
    expect(body.error).toBeNull();
    expect(body.timestamp).toEqual(expect.any(Number));
    expect(body.data).toMatchObject({
      id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
      email: credentials.username,
      firstName: expect.any(String),
      lastName: expect.any(String),
      role: 'admin',
      createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    });
  });

  test('Obtener perfil: timestamps válidos', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'auth-me unauthorized response');
    const body = JSON.parse(respText);
    expect(body.timestamp).toEqual(expect.any(Number));
    expect(new Date(body.data.createdAt).getTime()).toBeLessThan(Date.now());
    expect(new Date(body.data.updatedAt).getTime()).toBeLessThan(Date.now());
  });

  test('Obtener perfil: 401 sin token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'change-password success response');
    expect(response.status()).toBe(401);
  });

  // AUTH-06 — Cambio de contraseña
  test('Cambiar contraseña: éxito con contraseña actual correcta (200)', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/auth/change-password`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { currentPassword: credentials.password, newPassword: credentials.password },
    });
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'change-password wrong current response');

    expect(response.status()).toBe(200);
    const body = JSON.parse(respText);
    expect(body.error).toBeNull();
    expect(body.timestamp).toEqual(expect.any(Number));
  });

  // AUTH-06 — Negativo: contraseña actual incorrecta
  test('Cambiar contraseña: 401 con contraseña actual incorrecta', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/auth/change-password`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { currentPassword: 'WrongPassword!', newPassword: credentials.password },
    });
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });

    expect(response.status()).toBe(401);
    const body = JSON.parse(respText);
    expect(body.data).toBeNull();
    expect(body.error).toBe('Incorrect current password.');
    expect(body.timestamp).toEqual(expect.any(Number));
  });
});
