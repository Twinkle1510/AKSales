const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:5173/');
  
  // Wait for the sidebar to load and find the Payroll Desk tab
  await page.waitForSelector('.sidebar .menu-item, .sidebar button, .sidebar a', { timeout: 5000 }).catch(() => {});
  
  // Try clicking on the Payroll tab (assuming it has text 'Payroll Desk' or similar)
  const tabs = await page.$$('.sidebar div, .sidebar button, .sidebar a, .sidebar li');
  for (const tab of tabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text && text.includes('Payroll')) {
          await tab.click();
          break;
      }
  }
  
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'payroll_ui_screenshot.png' });
  await browser.close();
})();
