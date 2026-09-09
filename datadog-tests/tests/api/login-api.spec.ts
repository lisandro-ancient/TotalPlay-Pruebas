import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';
import { printResponse } from '../../utils/assertions';

test.describe('API de Autenticación - Inicio de sesión', () => {
  test('Iniciar sesión: credenciales válidas devuelve 201 y tokens', async ({ request }) => {
    const client = new AuthClient(request);
    const response = await client.login(credentials.username, credentials.password);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    await printResponse(respText, 'login success response');

    expect(response.status()).toBe(201);

    const body = JSON.parse(respText);
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

  test('Iniciar sesión: el JWT contiene las reclamaciones esperadas', async ({ request }) => {
    const client = new AuthClient(request);
    const response = await client.login(credentials.username, credentials.password);
    const respText2 = await response.text();
    await test.info().attach('response-body', { body: respText2, contentType: 'application/json' });
    await printResponse(respText2, 'login jwt payload response');
    const body = JSON.parse(respText2);
    const payload = JSON.parse(Buffer.from(body.data.accessToken.split('.')[1], 'base64').toString());

    expect(payload.email).toBe(credentials.username);
    expect(payload.role).toBe('admin');
    expect(payload.sub).toEqual(expect.any(String));
    expect(payload.exp).toBeGreaterThan(payload.iat);
  });

  test('Iniciar sesión: credenciales inválidas devuelve 500 y mensaje de error', async ({ request }) => {
    const client = new AuthClient(request);
    const response = await client.login('wrong@totalplay.com', 'wrongpassword');
    const respText3 = await response.text();
    await test.info().attach('response-body', { body: respText3, contentType: 'application/json' });
    await printResponse(respText3, 'login invalid credentials response');

    expect(response.status()).toBe(500);

    const body = JSON.parse(respText3);
    expect(body.data).toBeNull();
    expect(body.error).toBe('Internal server error');
    expect(body.timestamp).toEqual(expect.any(Number));
  });

  test('Iniciar sesión: credenciales vacías devuelve 400 (Bad Request)', async ({ request }) => {
    const client = new AuthClient(request);
    const response = await client.login('', '');
    const respText4 = await response.text();
    await test.info().attach('response-body', { body: respText4, contentType: 'application/json' });
    await printResponse(respText4, 'login empty credentials response');

    expect(response.status()).toBe(400);

    const body = JSON.parse(respText4);
    expect(body.data).toBeNull();
    expect(body.error).toBe('Bad Request Exception');
    expect(body.timestamp).toEqual(expect.any(Number));
  });
});
