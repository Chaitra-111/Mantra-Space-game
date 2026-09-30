import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 1000));
  
  // Click start
  await page.click('text=START LEARNING').catch(e => console.log('Click failed', e.message));
  await new Promise(r => setTimeout(r, 1000));
  
  // Expose a function to evaluate canvas
  const canvasInfo = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'No canvas found';
    return { width: canvas.width, height: canvas.height };
  });
  console.log('Canvas:', canvasInfo);
  
  await browser.close();
})();
