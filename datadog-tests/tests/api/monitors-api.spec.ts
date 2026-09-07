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
});
