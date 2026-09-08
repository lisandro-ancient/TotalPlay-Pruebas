import { test, expect } from '@playwright/test';
import { AuthClient } from '../../api/AuthClient';
import { credentials } from '../../fixtures/testData';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

test.describe('Users API', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const auth = new AuthClient(request);
    const response = await auth.login(credentials.username, credentials.password);
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });
    const body = JSON.parse(respText);
    token = body.data.accessToken;
  });

  test('Listar usuarios: responde 200 y devuelve lista de usuarios no vacía', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText = await response.text();
    await test.info().attach('response-body', { body: respText, contentType: 'application/json' });

    expect(response.status()).toBe(200);
    const body = JSON.parse(respText);
    expect(body.error).toBeNull();
    expect(body.data.users).toBeInstanceOf(Array);
    expect(body.data.total).toBeGreaterThan(0);
  });

  test('Listar usuarios: cada usuario tiene los campos esperados', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const respText2 = await response.text();
    await test.info().attach('response-body', { body: respText2, contentType: 'application/json' });
    const body = JSON.parse(respText2);
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

  test('Listar usuarios: no autorizado sin token (401)', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users`);
    expect(response.status()).toBe(401);
  });

  // USR-06 — Resetear contraseña (solo admin)
  test('Restablecer contraseña (admin): éxito (200)', async ({ request }) => {
    const createRes = await request.post(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { email: `usr06.${Date.now()}@example.com`, password: 'password123', firstName: 'Reset', lastName: 'User', role: 'admin' },
    });
    const createResText = await createRes.text();
    await test.info().attach('response-body', { body: createResText, contentType: 'application/json' });
    const { data: created } = JSON.parse(createResText);

    const response = await request.patch(`${BASE_URL}/api/users/${created.id}/reset-password`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.timestamp).toEqual(expect.any(Number));
  });

  test('Restablecer contraseña: 404 para usuario inexistente', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/users/00000000-0000-0000-0000-000000000000/reset-password`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.data).toBeNull();
    expect(body.error).toContain('00000000-0000-0000-0000-000000000000');
    expect(body.timestamp).toEqual(expect.any(Number));
  });

  test('Restablecer contraseña: 401 sin autenticación', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/users/00000000-0000-0000-0000-000000000000/reset-password`, {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(response.status()).toBe(401);
  });

  // USR-05 — Desactivar usuario
  test('Desactivar usuario: establece isActive a false (200)', async ({ request }) => {
    const createRes = await request.post(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { email: `usr05.${Date.now()}@example.com`, password: 'password123', firstName: 'Active', lastName: 'User', role: 'admin' },
    });
    const { data: created } = await createRes.json();

    const response = await request.patch(`${BASE_URL}/api/users/${created.id}/status`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { isActive: false },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.timestamp).toEqual(expect.any(Number));
    expect(body.data).toMatchObject({
      id: created.id,
      isActive: false,
    });
    expect(body.data.updatedAt).not.toBe(created.updatedAt);
  });

  test('Reactivar usuario: establece isActive a true (200)', async ({ request }) => {
    const createRes = await request.post(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { email: `usr05b.${Date.now()}@example.com`, password: 'password123', firstName: 'Inactive', lastName: 'User', role: 'admin' },
    });
    const { data: created } = await createRes.json();

    await request.patch(`${BASE_URL}/api/users/${created.id}/status`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { isActive: false },
    });

    const response = await request.patch(`${BASE_URL}/api/users/${created.id}/status`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { isActive: true },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.isActive).toBe(true);
    expect(body.error).toBeNull();
  });

  test('Cambiar estado de usuario: 404 para usuario inexistente', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/users/00000000-0000-0000-0000-000000000000/status`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { isActive: false },
    });
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.data).toBeNull();
    expect(body.error).toContain('00000000-0000-0000-0000-000000000000');
  });

  test('Cambiar estado de usuario: 401 sin autenticación', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/users/00000000-0000-0000-0000-000000000000/status`, {
      headers: { 'Content-Type': 'application/json' },
      data: { isActive: false },
    });
    expect(response.status()).toBe(401);
  });

  // USR-04 — Actualizar usuario
  test('Actualizar usuario: modifica campos y oculta contraseña (200)', async ({ request }) => {
    const createRes = await request.post(`${BASE_URL}/api/users`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { email: `usr04.${Date.now()}@example.com`, password: 'password123', firstName: 'Original', lastName: 'User', role: 'admin' },
    });
    const { data: created } = await createRes.json();

    const response = await request.patch(`${BASE_URL}/api/users/${created.id}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { firstName: 'Arielito Modificado', role: 'user' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.timestamp).toEqual(expect.any(Number));
    expect(body.data).toMatchObject({
      id: created.id,
      firstName: 'Arielito Modificado',
      role: 'user',
      email: created.email,
    });
    expect(body.data.updatedAt).not.toBe(created.updatedAt);
    expect(body.data).not.toHaveProperty('password');
  });

  // USR-04 — Negativo: id inexistente (404)
  test('Actualizar usuario: 404 para usuario inexistente', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/users/00000000-0000-0000-0000-000000000000`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      data: { firstName: 'Ghost' },
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.data).toBeNull();
    expect(body.error).toContain('00000000-0000-0000-0000-000000000000');
    expect(body.timestamp).toEqual(expect.any(Number));
  });

  // USR-04 — Negativo: sin token (401)
  test('Actualizar usuario: 401 sin autenticación', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/api/users/00000000-0000-0000-0000-000000000000`, {
      headers: { 'Content-Type': 'application/json' },
      data: { firstName: 'NoAuth' },
    });
    expect(response.status()).toBe(401);
  });

  // USR-01 — Crear usuario admin
  test('Crear usuario admin: devuelve 201 y objeto usuario', async ({ request }) => {
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

  // USR-03 — Listar usuarios (paginado)
  test('Listar usuarios (paginación): respeta page y limit', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users?page=1&limit=2`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.timestamp).toEqual(expect.any(Number));
    expect(body.data.users).toBeInstanceOf(Array);
    expect(body.data.users.length).toBeLessThanOrEqual(2);
    expect(body.data.total).toBeGreaterThan(0);
  });

  test('Listar usuarios (búsqueda): encuentra usuario que coincide con la consulta', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users?page=1&limit=10&search=Admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.timestamp).toEqual(expect.any(Number));
    expect(body.data.users.length).toBeGreaterThan(0);
    expect(body.data.total).toBe(1);
    expect(body.data.users[0]).toMatchObject({
      id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/),
      firstName: 'Admin',
    });
  });

  test('Listar usuarios (búsqueda): devuelve vacío cuando no hay coincidencias', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/users?page=1&limit=10&search=NonExistentUser999`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.error).toBeNull();
    expect(body.data.users).toHaveLength(0);
    expect(body.data.total).toBe(0);
  });

  // USR-02 — Email duplicado
  test('Crear usuario: 409 si el correo ya existe', async ({ request }) => {
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
  test('Crear usuario: 401 sin autenticación', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/users`, {
      headers: { 'Content-Type': 'application/json' },
      data: { email: 'noauth@example.com', password: 'password123', firstName: 'No', lastName: 'Auth', role: 'admin' },
    });
    expect(response.status()).toBe(401);
  });

  // USR-01 — Negativo: body inválido (400)
  test('Crear usuario: 400 por body inválido', async ({ request }) => {
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
