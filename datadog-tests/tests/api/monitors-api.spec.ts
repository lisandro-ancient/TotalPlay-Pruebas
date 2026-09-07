import { test } from '@playwright/test';
import { DatadogClient } from '../../api/DatadogClient';
import { expectOk } from '../../utils/assertions';
import { testMonitor } from '../../fixtures/testData';
import { API_BASE_URL } from '../../utils/config';

test.describe('Monitors API', () => {
  let client: DatadogClient;

  test.beforeEach(({ request }) => {
    client = new DatadogClient(request);
  });

  test.use({ baseURL: API_BASE_URL });

  test('should list monitors', async () => {
    const response = await client.getMonitors();
    await expectOk(response);
  });

  test('should create and delete a monitor', async () => {
    const create = await client.createMonitor(testMonitor);
    await expectOk(create);
    const { id } = await create.json();
    const del = await client.deleteMonitor(id);
    await expectOk(del);
  });
});
