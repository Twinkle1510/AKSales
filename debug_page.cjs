const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching puppeteer...");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));

  console.log("Navigating...");
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  console.log("BODY HTML LENGTH:", bodyHTML.length);
  if (bodyHTML.length < 500) {
      console.log("BODY HTML:", bodyHTML);
  }
  
  await browser.close();
  console.log("Done.");
})();
