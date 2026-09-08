import { expect, APIResponse } from '@playwright/test';

async function readResponseBody(response: any) {
  try {
    if (response && typeof response.text === 'function') return await response.text();
    return JSON.stringify(response);
  } catch (e: any) {
    return `<unable to read body: ${e?.message ?? e}>`;
  }
}

export async function expectOk(response: APIResponse | any) {
  const status = typeof response?.status === 'function' ? response.status() : response?.status;
  const ok = typeof response?.ok === 'function' ? response.ok() : (typeof status === 'number' ? status >= 200 && status < 300 : false);
  if (ok) return;
  const body = await readResponseBody(response);
  expect(ok, `Expected OK response (2xx) but got status=${status}. Body: ${body}`).toBeTruthy();
}

export async function expectStatus(response: APIResponse | any, status: number) {
  const actual = typeof response?.status === 'function' ? response.status() : response?.status;
  if (actual === status) return;
  const body = await readResponseBody(response);
  expect(actual, `Expected status ${status} but got ${actual}. Body: ${body}`).toBe(status);
}
