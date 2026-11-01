// Regression test: simulates animation frames whose timestamps are older than performance.now()
// and fails if any money counter (#win, #bal, #bwn, #jpn) ever shows a negative number.
// Usage: BASE_URL=http://localhost:4399 node qa/negative-numbers.cjs
const { BASE, GAME_PATH, launch } = require('./_launch.cjs');
(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 420, height: 746 } });
  await p.addInitScript(() => {
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => raf((ts) => cb(ts - 600));
    window.__neg = [];
    addEventListener('DOMContentLoaded', () => ['#win', '#bal', '#bwn', '#jpn'].forEach((sel) => {
      const e = document.querySelector(sel); if (!e) return;
      new MutationObserver(() => { const t = e.textContent.trim(); if (t.startsWith('-')) window.__neg.push(sel + ' ' + t); }).observe(e, { childList: true, characterData: true, subtree: true });
    }));
  });
  const click = (s) => p.evaluate((s) => document.querySelector(s)?.click(), s);
  const idle = () => p.waitForFunction(() => !document.querySelector('#spin').classList.contains('busy'), null, { timeout: 120000 }).catch(() => {});
  await p.goto(BASE + GAME_PATH, { waitUntil: 'load' });
  await p.waitForTimeout(1200); await p.mouse.click(210, 400); await p.waitForTimeout(300);
  await click('.rail [data-go=play]'); await p.waitForTimeout(1500);
  await click('#demoBW'); await p.waitForTimeout(9000);
  for (let i = 0; i < 4; i++) { await p.evaluate(() => document.querySelector('#bw').click()); await p.waitForTimeout(400); }
  await idle();
  await click('#demoSC'); await p.waitForTimeout(15000);
  for (let i = 0; i < 6; i++) { await p.evaluate(() => { document.querySelector('#bw').click(); document.querySelector('#popup').click(); }); await p.waitForTimeout(500); }
  await idle();
  await click('#demoJP'); await p.waitForTimeout(23000);
  await p.evaluate(() => document.querySelector('#jpov')?.click()); await idle();
  const neg = await p.evaluate(() => window.__neg);
  console.log('negative displays:', neg.length, neg.slice(0, 5));
  await b.close(); process.exit(neg.length ? 1 : 0);
})();
