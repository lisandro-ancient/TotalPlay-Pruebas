import { test, expect } from '@playwright/test';
import { WebSocketClient } from '../../websocket/WebSocketClient';
import { WS_URL } from '../../utils/config';

test.describe('WebSocket Events', () => {
  test('should connect and receive messages', async ({ page }) => {
    const ws = new WebSocketClient();
    await ws.connect(page, WS_URL);
    await page.waitForTimeout(2000);
    const messages = await ws.getMessages(page);
    expect(Array.isArray(messages)).toBeTruthy();
    await ws.close(page);
  });
});
