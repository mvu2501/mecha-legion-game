// Plays the Mecha Legion game through every screen and demo button, and reports
// 404/4xx responses, console errors and the list of assets actually loaded.
// Usage: BASE_URL=http://localhost:4399 node qa/playthrough.cjs   (serve dist/ first)
const { BASE, GAME_PATH, OUT, launch } = require('./_launch.cjs');
const fs = require('fs');
(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 420, height: 746 } });
  const bad = new Set(), used = new Set(), errs = [];
  p.on('response', (r) => { if (r.status() >= 400) bad.add(r.status() + ' ' + r.url()); });
  p.on('requestfinished', (r) => { const i = r.url().indexOf('/assets/'); if (i >= 0) used.add(decodeURIComponent(r.url().slice(i + 8))); });
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  const click = (s) => p.evaluate((s) => document.querySelector(s)?.click(), s);
  const idle = () => p.waitForFunction(() => !document.querySelector('#spin').classList.contains('busy'), null, { timeout: 120000 }).catch(() => {});
  await p.goto(BASE + GAME_PATH, { waitUntil: 'load' });
  await p.waitForTimeout(1500); await p.mouse.click(210, 400); await p.waitForTimeout(500);
  await click('.rail [data-go=select]'); await p.waitForTimeout(800);
  await click('.rail [data-go=play]'); await p.waitForTimeout(1500);
  for (const m of ['pay', 'rule', 'hist']) { await click('#menuBtn'); await p.waitForTimeout(300); await click(`.mi[data-m=${m}]`); await p.waitForTimeout(500); await p.keyboard.press('Escape'); await p.waitForTimeout(300); }
  await click('#spin'); await idle();
  await click('#demoBW'); await p.waitForTimeout(9000);
  for (let i = 0; i < 4; i++) { await p.evaluate(() => document.querySelector('#bw').click()); await p.waitForTimeout(300); }
  await idle();
  await click('#demoSC'); await p.waitForTimeout(15000);
  for (let i = 0; i < 6; i++) { await p.evaluate(() => { document.querySelector('#bw').click(); document.querySelector('#popup').click(); }); await p.waitForTimeout(500); }
  await idle();
  await click('#demoJP'); await p.waitForTimeout(23000);
  await p.evaluate(() => document.querySelector('#jpov')?.click()); await p.waitForTimeout(3000);
  fs.writeFileSync(OUT + '/assets-used.txt', [...used].sort().join('\n'));
  console.log('assets loaded:', used.size, '| bad responses:', [...bad], '| console errors:', errs);
  await b.close();
  process.exit(bad.size || errs.length ? 1 : 0);
})();
