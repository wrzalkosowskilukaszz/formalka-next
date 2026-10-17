// Runs the same two residence checks on any number of built pages (the current dist, or a saved copy of
// the published Artifact), so a stale shared link can be told apart from the current build.
// 1. Short stay: the fee totals the map and the Teczka show (two stamp duties are alternatives, never a sum).
// 2. Scenario res-08 (family from abroad, granted decision): the state of the card step.
// Usage: node audit/2026-10-17-correctness/compare-builds.mjs <page.html>...
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = (() => { try { return require('playwright'); } catch { return require(join(execSync('npm root -g').toString().trim(), 'playwright')); } })();
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

for (const file of process.argv.slice(2)) {
  const page = await b.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const net = [];
  page.on('request', (r) => { if (!/^(file|data|blob):/.test(r.url())) net.push(r.url()); });
  await page.goto(pathToFileURL(file).href);
  await page.locator('#home-t').waitFor({ timeout: 10000 });
  console.log(`== ${file}\nsha256 ${createHash('sha256').update(readFileSync(file)).digest('hex')}`);
  console.log(`engine ${await page.evaluate(() => window.FormalkaEngine.manifest.engine)}`);

  await page.locator('[data-type="residence-card"]').click();
  const dock = page.locator('.dock');
  for (let i = 0; i < 30 && !(await page.locator('#approve').count()); i++) {
    await page.waitForTimeout(200);
    const want = dock.locator('.chip', { hasText: /Krótki pobyt|^Warszawa$/ });
    if (await want.count()) { await want.first().click(); continue; }
    if (await dock.locator('[data-pick]').count()) { await dock.locator('[data-pick]').first().click(); continue; }
    if (await dock.locator('[data-a="yes"]').count()) { await dock.locator('[data-a="yes"]').first().click(); continue; }
    const c = dock.locator('.opts .chip:not(.chip-dk)');
    if (await c.count()) await c.first().click();
  }
  await page.locator('#approve').click();
  await page.waitForTimeout(500);
  const zl = async () => JSON.stringify((await page.locator('#app').innerText()).match(/[^\n]{0,30}\d+ zł[^\n]{0,40}/g) ?? []);
  await page.evaluate(() => { S.screen = 'case'; S.view = 'map'; render(); });
  await page.waitForTimeout(300);
  console.log(`short stay, Mapa, amounts shown: ${await zl()}`);
  await page.evaluate(() => { S.screen = 'teczka'; render(); });
  await page.waitForTimeout(300);
  console.log(`short stay, Teczka, amounts shown: ${await zl()}`);
  const scope = await page.evaluate(() => { S.screen = 'case'; S.view = 'focus'; render(); return document.querySelector('.scope-note')?.innerText.replace(/\s+/g, ' ').slice(0, 90) ?? '(none)'; });
  console.log(`residence scope note on Teraz: ${scope}`);

  const levels = await page.evaluate(() => {
    const st = { facts: { 'pobyt_czasowy.purpose': 'family_abroad' }, tasks: {}, events: [{ type: 'filing', date: '2026-07-01', by: 'user' }, { type: 'decision_delivered', date: '2026-10-14', outcome: 'granted', by: 'user' }] };
    return window.FormalkaEngine.plan('residence-card', st).levels.map((l) => `${l.id}:${l.state}${l.reason ? ` (${l.reason.text.pl})` : ''}`).join(', ');
  });
  console.log(`res-08 after a granted decision: ${levels}`);
  console.log(`network requests: ${net.length}\n`);
  await page.close();
}
await b.close();
