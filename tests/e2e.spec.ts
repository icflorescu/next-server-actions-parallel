import { expect, test } from '@playwright/test';

test('execute server actions in parallel', async ({ page }) => {
  const invocations = 5;
  const duration = 500;
  await page.goto('http://localhost:3000/?is-testing=true');
  await page.getByTestId('invocations').fill(invocations.toString());
  await page.getByTestId('duration').fill(duration.toString());
  await page.getByTestId('test').click();
  const results = await page.getByTestId('results-content').textContent();
  const executionTime = Number(await page.getByTestId('results-execution-time').textContent());
  expect(results).toBe(JSON.stringify(Array.from({ length: invocations }, (_, i) => ({ n: i + 1 }))));
  expect(executionTime).toBeLessThan(duration * invocations);
});
