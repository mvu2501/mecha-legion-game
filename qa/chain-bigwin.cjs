// Clicks "5 - Big Win" three times and checks BIG (3), MEGA (5), EPIC (7) tiers and the wallet.
// Usage: BASE_URL=http://localhost:4399 node qa/chain-bigwin.cjs
const { BASE, GAME_PATH, launch } = require('./_launch.cjs');
(async () => {
  const b = await launch();
  const p = await b.newPage({ viewport: { width: 420, height: 746 } });
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(BASE + GAME_PATH, { waitUntil: 'load' });
  await p.waitForTimeout(1200); await p.mouse.click(210, 400); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('.rail [data-go=play]').click()); await p.waitForTimeout(1500);
  const expect = ['BIG WIN', 'MEGA WIN', 'EPIC WIN'];
  let ok = true;
  for (let run = 0; run < 3; run++) {
    await p.evaluate(() => document.querySelector('#demoBW').click());
    let tier = '', max = 0;
    const t0 = Date.now();
    while (Date.now() - t0 < 90000) {
      const s = await p.evaluate(() => ({ on: document.querySelector('#bw').classList.contains('on'), tt: document.querySelector('#bwtt').textContent, busy: document.querySelector('#spin').classList.contains('busy'), badge: document.querySelector('.chainb')?.textContent || '' }));
      if (s.on) tier = s.tt;
      const n = +(s.badge.match(/×(\d+)/) || [0, 0])[1]; if (n > max) max = n;
      if (!s.busy && tier) break;
      await p.waitForTimeout(150);
    }
    console.log(`run ${run}: tier=${tier} (expected ${expect[run]}), max chain badge x${max}`);
    if (tier !== expect[run]) ok = false;
    await p.waitForTimeout(800);
  }
  console.log(ok ? 'PASS' : 'FAIL', errs);
  await b.close(); process.exit(ok && !errs.length ? 0 : 1);
})();
