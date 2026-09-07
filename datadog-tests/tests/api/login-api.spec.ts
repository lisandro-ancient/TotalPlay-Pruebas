import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';

test.describe('Auth API - Login', () => {
  test('POST /api/auth/login returns 200 with valid credentials', async ({ request }) => {
    const client = new AuthClient(request);
    const response = await client.login(credentials.username, credentials.password);

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.timestamp).toEqual(expect.any(Number));
    expect(body.data).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      passwordChangeRequired: expect.any(Boolean),
    });
    expect(body.data.accessToken.length).toBeGreaterThan(0);
    expect(body.data.refreshToken.length).toBeGreaterThan(0);
  });

  test('POST /api/auth/login returns JWT with correct claims', async ({ request }) => {
    const client = new AuthClient(request);
    const response = await client.login(credentials.username, credentials.password);

    const body = await response.json();
    const payload = JSON.parse(Buffer.from(body.data.accessToken.split('.')[1], 'base64').toString());

    expect(payload.email).toBe(credentials.username);
    expect(payload.role).toBe('admin');
    expect(payload.sub).toEqual(expect.any(String));
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });

  test('POST /api/auth/login returns error with invalid credentials', async ({ request }) => {
    const client = new AuthClient(request);
    const response = await client.login('wrong@totalplay.com', 'wrongpassword');

    expect(response.status()).toBe(500);

    const body = await response.json();
    expect(body.data).toBeNull();
    expect(body.error).toBe('Internal server error');
    expect(body.timestamp).toEqual(expect.any(Number));
  });

  test('POST /api/auth/login returns error with empty credentials', async ({ request }) => {
    const client = new AuthClient(request);
    const response = await client.login('', '');

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.data).toBeNull();
    expect(body.error).toBe('Bad Request Exception');
    expect(body.timestamp).toEqual(expect.any(Number));
  });
});
