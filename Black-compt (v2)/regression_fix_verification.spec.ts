import { test, expect } from '@playwright/test';

test('ResourcePanel UI Verification', async ({ page }) => {
  await page.goto('http://localhost:3002');

  // Check if the "Generate" button is enabled
  const generateButton = page.getByRole('button', { name: 'Generar Componente' });
  await expect(generateButton).toBeEnabled();

  // Check if the "Aplicar CSS" button is enabled
  const aplicarCSSButton = page.getByRole('button', { name: 'Aplicar CSS' });
  await page.getByRole('tab', { name: 'CSS' }).click();
  await expect(aplicarCSSButton).toBeEnabled();

  // Check that the suggestion note is not present
  const suggestionNote = page.getByText('💡 La imagen de diseño ayudará a los agentes a entender la estructura visual del componente');
  await expect(suggestionNote).not.toBeVisible();

  // Take a screenshot for final verification
  await page.screenshot({ path: 'regression_fix_verification.png' });
});
