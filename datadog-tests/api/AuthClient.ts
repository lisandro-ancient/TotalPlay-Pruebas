import { APIRequestContext } from '@playwright/test';

const BASE_URL = process.env.DD_BASE_URL || 'https://totalplay-dev.ancient.mx';

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async login(email: string, password: string) {
    return this.request.post(`${BASE_URL}/api/auth/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: { email, password },
    });
  }
}
