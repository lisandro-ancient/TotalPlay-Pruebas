import { expect, APIResponse } from '@playwright/test';

export async function expectOk(response: APIResponse) {
  expect(response.ok()).toBeTruthy();
}

export async function expectStatus(response: APIResponse, status: number) {
  expect(response.status()).toBe(status);
}
