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

export async function printResponse(responseOrText: any, label = 'response-body') {
  let text: string;
  if (typeof responseOrText === 'string') {
    text = responseOrText;
  } else if (responseOrText && typeof responseOrText.text === 'function') {
    try {
      text = await responseOrText.text();
    } catch (e: any) {
      text = `<unable to read body: ${e?.message ?? e}>`;
    }
  } else {
    try {
      text = JSON.stringify(responseOrText);
    } catch {
      text = String(responseOrText);
    }
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }

  const out = { label, body: parsed };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(out, null, 2));
  return text;
}
