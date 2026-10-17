// Starts a case in the built prototype, clicks the chips that match each pattern in turn, then prints the last
// chat messages and the dock: a quick way to show one path as text.
// Usage: node audit/2026-10-17-correctness/peek.mjs <case id> '<chip regex>'...   (e.g. pesel '^Dla siebie$' '^Nie wiem$')
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = (() => { try { return require('playwright'); } catch { return require(join(execSync('npm root -g').toString().trim(), 'playwright')); } })();
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const [bp, ...answers] = process.argv.slice(2);
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await b.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
await page.goto(pathToFileURL(join(root, 'prototype/dist/index.html')).href);
await page.locator('#home-t').waitFor();
await page.locator(`[data-type="${bp}"]`).click();
for (const a of answers) {
  const el = page.locator('.dock .chip, .dock [data-pick]', { hasText: new RegExp(a) }).first();
  await el.waitFor({ timeout: 8000 });
  console.log(`> ${(await el.innerText()).trim()}`);
  await el.click();
  await page.waitForTimeout(300);
}
await page.waitForTimeout(400);
for (const m of await page.locator('.log > *').evaluateAll((els) => els.slice(-4).map((e) => `[${e.className.replace(/ enter/, '')}] ${e.innerText.replace(/\s+/g, ' ')}`))) console.log(m);
console.log(`[dock] ${(await page.locator('.dock').innerText().catch(() => '(none)')).replace(/\s+/g, ' ')}`);
await b.close();
