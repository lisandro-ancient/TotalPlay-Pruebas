import { Page } from '@playwright/test';
import { URL } from 'url';

const ALLOWED_WS_HOSTS = ['app.datadoghq.com', 'app.datadoghq.eu'];

function validateWsUrl(url: string): void {
  const parsed = new URL(url);
  if (!['ws:', 'wss:'].includes(parsed.protocol)) {
    throw new Error(`Invalid WebSocket protocol: ${parsed.protocol}`);
  }
  if (!ALLOWED_WS_HOSTS.includes(parsed.hostname)) {
    throw new Error(`WebSocket host not allowed: ${parsed.hostname}`);
  }
}

export class WebSocketClient {
  async connect(page: Page, url: string): Promise<void> {
    validateWsUrl(url);
    await page.evaluate((wsUrl) => {
      (window as any).__ws = new WebSocket(wsUrl);
      (window as any).__wsMessages = [];
      (window as any).__ws.onmessage = (e: MessageEvent) => {
        (window as any).__wsMessages.push(e.data);
      };
    }, url);
  }

  async getMessages(page: Page): Promise<string[]> {
    return page.evaluate(() => (window as any).__wsMessages ?? []);
  }

  async close(page: Page): Promise<void> {
    await page.evaluate(() => (window as any).__ws?.close());
  }
}
