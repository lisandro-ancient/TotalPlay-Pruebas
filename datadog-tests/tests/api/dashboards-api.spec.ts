import { test } from '@playwright/test';
import { DatadogClient } from '../../api/DatadogClient';
import { expectOk } from '../../utils/assertions';
import { testDashboard } from '../../fixtures/testData';
import { API_BASE_URL } from '../../utils/config';

test.describe('Dashboards API', () => {
  let client: DatadogClient;

  test.beforeEach(({ request }) => {
    client = new DatadogClient(request);
  });

  test.use({ baseURL: API_BASE_URL });

  test('should list dashboards', async () => {
    const response = await client.getDashboards();
    await expectOk(response);
  });

  test('should create and delete a dashboard', async () => {
    const create = await client.createDashboard(testDashboard);
    await expectOk(create);
    const { id } = await create.json();
    const del = await client.deleteDashboard(id);
    await expectOk(del);
  });
});
