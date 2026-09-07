import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

test.describe('Auth Me API', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const auth = new AuthClient(request);
    const response = await auth.login(credentials.username, credentials.password);
    const body = await response.json();
    token = body.data.accessToken;
  });

  test('GET /api/auth/me returns 200 with authenticated user', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

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

  test('GET /api/auth/me returns correct timestamps', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.json();
    expect(body.timestamp).toEqual(expect.any(Number));
    expect(new Date(body.data.createdAt).getTime()).toBeLessThan(Date.now());
    expect(new Date(body.data.updatedAt).getTime()).toBeLessThan(Date.now());
  });

  test('GET /api/auth/me returns 401 without token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/auth/me`);
    expect(response.status()).toBe(401);
  });
});
