const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3002');
  await page.screenshot({ path: 'manual_verification.png' });
  await browser.close();
})();
