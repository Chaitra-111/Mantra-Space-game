import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 1000));
  
  // Press Enter to launch
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1000));
  
  // Expose a function to evaluate canvas
  const canvasInfo = await page.evaluate(() => {
    return 'Game started';
  });
  console.log('Done');
  
  await browser.close();
})();
