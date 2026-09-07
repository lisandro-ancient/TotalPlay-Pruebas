/**
 * DUMMY TEST — safe to delete once real credentials are in place.
 * Validates the WebSocket project setup: browser launch, WebSocketClient wiring, message capture.
 * Uses a public echo server — any message sent is echoed back.
 */
import { test, expect } from '@playwright/test';

test.describe('[DUMMY] WebSocket smoke', () => {
  test('connects to echo server, sends a message and receives it back', async ({ page }) => {
    // Navigate to a blank page so the browser context is ready
    await page.goto('about:blank');

    const echoed = await page.evaluate(() => {
      return new Promise<string>((resolve, reject) => {
        const ws = new WebSocket('wss://echo.websocket.org');
        const payload = 'datadog-framework-check';
        let sent = false;
        ws.onopen = () => ws.send(payload);
        // The echo server may send a welcome banner before echoing — skip it
        ws.onmessage = (e) => {
          if (!sent) { sent = true; return; }
          resolve(e.data);
          ws.close();
        };
        ws.onerror = () => reject(new Error('WebSocket connection failed'));
        setTimeout(() => reject(new Error('WebSocket timeout')), 8000);
      });
    });

    expect(echoed).toBe('datadog-framework-check');
  });
});
