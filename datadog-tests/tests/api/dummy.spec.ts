/**
 * DUMMY TEST — safe to delete once real credentials are in place.
 * Validates the API project setup: APIRequestContext, response assertions, DatadogClient wiring.
 */
import { test, expect } from '@playwright/test';
import { expectOk, expectStatus } from '../../utils/assertions';

test.describe('[DUMMY] API smoke', () => {
  test.use({ baseURL: 'https://jsonplaceholder.typicode.com' });

  test('GET /todos/1 returns 200 with expected shape', async ({ request }) => {
    const response = await request.get('/todos/1');

    await expectOk(response);
    await expectStatus(response, 200);

    const body = await response.json();
    expect(body).toMatchObject({
      id: 1,
      title: expect.any(String),
      completed: expect.any(Boolean),
    });
  });
});
