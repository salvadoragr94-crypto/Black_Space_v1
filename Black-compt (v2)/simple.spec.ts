import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('http://localhost:3002/');
  const title = await page.title();
  expect(title).toBe('Vite + React + TS');
});
