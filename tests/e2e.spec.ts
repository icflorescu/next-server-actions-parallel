import { expect, test } from '@playwright/test';

test('execute server actions in parallel', async ({ page }) => {
  await page.goto('http://localhost:3000/?test-mode=true');

  await page.getByTestId('test').click();
  const results = await page.getByTestId('results-content').textContent();
  const executionTime = Number(await page.getByTestId('results-execution-time').textContent());
  expect(results).toBe(JSON.stringify([{ n: 1 }, { n: 2 }, { n: 3 }]));
  expect(executionTime).toBeLessThan(1000);
});
