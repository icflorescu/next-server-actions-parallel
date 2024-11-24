import { expect, test } from '@playwright/test';

test('execute server actions in parallel', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByTestId('run-parallel').click();
  expect(parseInt((await page.getByTestId('time').textContent()) || '')).toBeLessThan(1000);
  expect(await page.getByTestId('results').textContent()).toBe('[1,2,3,4,5,6]');
});
