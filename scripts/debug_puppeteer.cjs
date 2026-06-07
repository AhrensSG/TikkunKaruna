const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('PAGE_ERROR:', err.message));
  await page.goto('http://localhost:3000/reservar/2ed8b153-b0c7-42a9-85b3-f99e3759db3f', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  const calendarDays = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.map((b, i) => ({
      idx: i,
      text: b.textContent.trim(),
      disabled: b.disabled,
    })).filter(d => /^\d{1,2}$/.test(d.text) && !isNaN(parseInt(d.text)));
  });
  console.log('CALENDAR DAYS:');
  console.log(JSON.stringify(calendarDays));
  // Click day 10 (Wednesday)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const day = btns.find(b => b.textContent.trim() === '10' && !b.disabled);
    if (day) day.click();
  });
  await new Promise(r => setTimeout(r, 3000));
  await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1000));
  const text = await page.evaluate(() => document.body.innerText);
  console.log('AFTER CLICK:');
  if (text.includes('10:00')) console.log('✅ Slots visible');
  else console.log('❌ No slots');
  if (text.includes('Dom')) console.log('✅ Sunday header present');
  else console.log('❌ No Sunday header');
  await browser.close();
})();
