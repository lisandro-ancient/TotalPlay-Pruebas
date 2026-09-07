import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

test.describe('Users API', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const auth = new AuthClient(request);
    const response = await auth.login(credentials.username, credentials.password);
    const body = await response.json();
    token = body.data.accessToken;
  });

  test('GET /api/users returns 200 with user list', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.data.users).toBeInstanceOf(Array);
    expect(body.data.total).toBeGreaterThan(0);
  });

  test('GET /api/users returns user with correct shape', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const body = await response.json();
    const user = body.data.users[0];
    expect(user).toMatchObject({
      id: expect.any(String),
      email: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      role: expect.any(String),
      isActive: expect.any(Boolean),
    });
  });

  test('GET /api/users returns 401 without token', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users`);
    expect(response.status()).toBe(401);
  });

  // USR-01 — Crear usuario admin
  test('POST /api/users creates a new admin user', async ({ request }) => {
    const uniqueEmail = `usr01.${Date.now()}@example.com`;
    const response = await request.post(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { email: uniqueEmail, password: 'password123', firstName: 'Nuevo', lastName: 'Usuario', role: 'admin' },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.timestamp).toEqual(expect.any(Number));
    expect(body.data).toMatchObject({
      id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
      email: uniqueEmail,
      firstName: 'Nuevo',
      lastName: 'Usuario',
      role: 'admin',
      isActive: true,
    });
    expect(body.data).not.toHaveProperty('password');
  });

  // USR-02 — Email duplicado
  test('POST /api/users returns 409 for duplicate email', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { email: credentials.username, password: 'password123', firstName: 'Nuevo', lastName: 'Usuario', role: 'admin' },
    });

    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.data).toBeNull();
    expect(body.error).toContain(credentials.username);
    expect(body.timestamp).toEqual(expect.any(Number));
  });

  // USR-01 — Negativo: sin token (401)
  test('POST /api/users returns 401 without token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/users`, {
      headers: { 'Content-Type': 'application/json' },
      data: { email: 'noauth@example.com', password: 'password123', firstName: 'No', lastName: 'Auth', role: 'admin' },
    });
    expect(response.status()).toBe(401);
  });

  // USR-01 — Negativo: body inválido (400)
  test('POST /api/users returns 400 with invalid body', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { email: '', password: '', firstName: '', lastName: '', role: '' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.data).toBeNull();
    expect(body.error).toBe('Bad Request Exception');
  });
});
