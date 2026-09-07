import { APIRequestContext } from '@playwright/test';
import { API_KEY, APP_KEY } from '../utils/config';

export class DatadogClient {
  private headers = {
    'DD-API-KEY': API_KEY,
    'DD-APPLICATION-KEY': APP_KEY,
    'Content-Type': 'application/json',
  };

  constructor(private request: APIRequestContext) {}

  async getMonitors() {
    return this.request.get('/api/v1/monitor', { headers: this.headers });
  }

  async createMonitor(body: object) {
    return this.request.post('/api/v1/monitor', { headers: this.headers, data: body });
  }

  async deleteMonitor(id: number) {
    return this.request.delete(`/api/v1/monitor/${id}`, { headers: this.headers });
  }

  async getDashboards() {
    return this.request.get('/api/v1/dashboard', { headers: this.headers });
  }

  async createDashboard(body: object) {
    return this.request.post('/api/v1/dashboard', { headers: this.headers, data: body });
  }

  async deleteDashboard(id: string) {
    return this.request.delete(`/api/v1/dashboard/${id}`, { headers: this.headers });
  }
}
