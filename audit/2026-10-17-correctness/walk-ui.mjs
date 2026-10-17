// Drives the built prototype (prototype/dist/index.html) in Chromium along many answer paths per case, not
// the e2e test's fixed ones: first, last, "Nie wiem" and seeded random answers. After each plan it visits
// Teraz, Mapa (every step's sheet), Teczka, Kalendarz and Start, moves the clock, then records each step's
// completing event (both decision outcomes) and visits the screens again. It also runs all five cases at
// once. It looks only for critical faults: a page error, a console error, a network request, broken text
// (undefined, NaN, [object Object], Invalid Date), an intake that ends with no plan and no reason, a plan that cannot be
// approved, and alternative stamp duties shown added up or joined with "+" (residence COMPARISON D21).
// Usage: node prototype/build.mjs && node audit/2026-10-17-correctness/walk-ui.mjs [--paths N]
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = (() => { try { return require('playwright'); } catch { return require(join(execSync('npm root -g').toString().trim(), 'playwright')); } })();
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const URL_ = pathToFileURL(join(root, 'prototype/dist/index.html')).href;
const args = process.argv.slice(2);
const PATHS = args.includes('--paths') ? +args[args.indexOf('--paths') + 1] : 6;
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const faults = [];
const log = [];
const T = 8000;

// A small seeded generator, so a failing path can be run again.
const rng = (seed) => () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);

async function newPage() {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const errs = [];
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(`console: ${m.text()}`); });
  page.on('request', (r) => { if (!/^(file|data|blob):/.test(r.url())) errs.push(`network: ${r.url()}`); });
  await page.goto(URL_);
  await page.locator('#home-t').waitFor({ timeout: T });
  return { page, errs };
}

// What the screen shows, checked for broken text and for added-up alternative duties.
async function look(page, errs, where) {
  const r = await page.evaluate(() => {
    const shown = [...document.querySelectorAll('#app *, #layer *')].filter((el) => el.children.length === 0 && el.offsetParent !== null && !el.closest('.msg.me'))
      .map((el) => el.textContent).join('\n');
    const bad = shown.match(/.{0,40}(\bundefined\b|\bNaN\b|\[object Object\]|Invalid Date|\bnull\b).{0,40}/g) ?? [];
    // Every approved case whose plan holds two stamp duties: no screen may show their sum.
    const sums = [];
    for (const c of S.cases) {
      const p = E.plan(c.bpId, c.state);
      const fees = p.levels.flatMap((l) => l.fees).filter((f) => !f.optional && f.outcome === 'applies' && f.exemption?.outcome !== 'applies');
      const duties = fees.filter((f) => /^Opłata skarbowa/.test(f.purpose.pl));
      if (duties.length > 1) {
        const total = fees.reduce((s, f) => s + f.amountPln, 0);
        const dutySum = duties.reduce((s, f) => s + f.amountPln, 0);
        for (const n of new Set([total, dutySum])) if (new RegExp(`(^|\\D)${n}\\s?zł`).test(shown)) sums.push(`${c.bpId}: ${n} zł shown (${duties.map((d) => d.amountPln).join(' + ')})`);
        // Or the duties joined with "+", which reads as paying both.
        for (const a of duties) for (const b of duties) if (a !== b && new RegExp(`(^|\\D)${a.amountPln} zł \\+ ${b.amountPln} zł`).test(shown)) sums.push(`${c.bpId}: "${a.amountPln} zł + ${b.amountPln} zł" shown`);
      }
    }
    return { bad, sums, screen: S.screen, view: S.view };
  });
  for (const b of r.bad) faults.push(`${where} [${r.screen}/${r.view}]: broken text "${b.trim()}"`);
  for (const s of r.sums) faults.push(`${where} [${r.screen}/${r.view}]: alternative duties added up: ${s}`);
  while (errs.length) faults.push(`${where} [${r.screen}]: ${errs.shift()}`);
}

// Answers the intake with a strategy until the plan card shows; returns how it ended.
async function intake(page, pick) {
  const dock = page.locator('.dock');
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(120);
    if (await page.locator('#approve').count()) return 'plan';
    // "Nie wiem" or no fitting route: the case stops with a handoff (e2e C); that is an end, not a fault.
    if (await dock.locator('.chip', { hasText: /^Wróć do Startu$/ }).count()) {
      const said = await page.locator('.msg.bot').evaluateAll((els) => els.slice(-3).map((e) => e.innerText).join(' '));
      return /Bez tych odpowiedzi nie ustalę drogi|Żadna droga z naszych źródeł/.test(said) ? 'handoff' : 'back-home-without-reason';
    }
    const picks = dock.locator('[data-pick]');
    if (await picks.count()) {
      // Route cards, the case picker or a correction: the strategy chooses among them.
      const n = await picks.count();
      const yes = dock.locator('[data-pick="yes"]');
      if (await yes.count()) await yes.first().click(); else await picks.nth(pick(n)).click();
      continue;
    }
    if (await dock.locator('[data-a="yes"]').count()) { await dock.locator('[data-a="yes"]').first().click(); continue; }
    const chips = dock.locator('.opts .chip');
    const n = await chips.count();
    // The stop's chips can appear between the check above and this one: never pick "Wróć do Startu" by chance.
    if (n && (await chips.allInnerTexts()).some((x) => x.trim() === 'Wróć do Startu')) continue;
    if (n) { await chips.nth(pick(n)).click(); continue; }
    const input = dock.locator('form input[name="t"]');
    if (await input.count() && i > 30) return 'stuck-on-input';
  }
  return 'no-plan';
}

async function playForward(page, errs, where, outcome) {
  for (let round = 0; round < 14; round++) {
    const step = await page.evaluate((outcome) => {
      const c = S.cases.find((x) => x.id === S.active) ?? S.cases[0];
      const p = E.plan(c.bpId, c.state);
      const open = p.levels.filter((l) => ['available', 'in_progress', 'returned', 'waiting_office'].includes(l.state));
      if (!open.length) return null;
      for (const l of open) for (const t of l.tasks) c.state.tasks[t.id] = 'done';
      const l = open.find((x) => x.completesWith && !c.state.events.some((e) => e.type === x.completesWith));
      if (!l) { render(); return `${open.map((x) => x.id).join(',')}: tasks only`; }
      const outs = E.blueprint(c.bpId).events?.[l.completesWith]?.outcomes;
      S.clock = { date: isoAdd(S.clock.date, 3), time: S.clock.time };
      recordEvent(c, l.completesWith, S.clock.date, outs ? (outs.includes(outcome) ? outcome : outs[0]) : undefined);
      afterChange(c);
      return `${l.id} > ${l.completesWith}`;
    }, outcome).catch((e) => { faults.push(`${where}: play throws ${e.message}`); return null; });
    if (!step) break;
    await page.waitForTimeout(80);
    await look(page, errs, `${where} play ${step}`);
    if (/tasks only/.test(step)) break;
  }
}

async function visitAll(page, errs, where) {
  const tab = async (id) => { const b = page.locator(`.tab[data-tab="${id}"]`); if (await b.count()) { await b.click(); await page.waitForTimeout(80); await look(page, errs, `${where} tab ${id}`); } };
  for (const v of ['focus', 'map']) {
    await page.evaluate((v) => { S.screen = 'case'; S.view = v; render(); }, v);
    await page.waitForTimeout(60);
    await look(page, errs, `${where} ${v}`);
  }
  const ids = await page.evaluate(() => { const c = S.cases.find((x) => x.id === S.active) ?? S.cases[0]; return E.plan(c.bpId, c.state).levels.map((l) => l.id); });
  for (const id of ids) {
    await page.evaluate((id) => openLevel(S.cases.find((x) => x.id === S.active) ?? S.cases[0], id), id).catch((e) => faults.push(`${where}: openLevel ${id} throws ${e.message}`));
    await page.waitForTimeout(40);
    await look(page, errs, `${where} sheet ${id}`);
    if (await page.locator('#sh-x').count()) await page.locator('#sh-x').click();
  }
  for (const t of ['teczka', 'calendar', 'world', 'chat']) await tab(t);
}

const BPS = ['address-registration', 'pesel', 'citizenship', 'language-certificate', 'residence-card'];
let runs = 0;
for (const bp of BPS) {
  const strategies = [['first', () => 0], ['last', (n) => n - 1]];
  for (let k = 0; k < PATHS; k++) { const r = rng(1000 + k * 7 + bp.length); strategies.push([`random${k}`, (n) => Math.floor(r() * n)]); }
  for (const [name, pick] of strategies) {
    const where = `${bp}/${name}`;
    const { page, errs } = await newPage();
    try {
      await page.locator(`[data-type="${bp}"]`).click();
      const end = await intake(page, pick);
      await look(page, errs, `${where} intake`);
      if (end === 'handoff') { log.push(`${where}: no plan; the case says why and hands off`); continue; }
      if (end !== 'plan') { faults.push(`${where}: intake ended without a plan (${end})`); continue; }
      if (await page.locator('#approve[disabled]').count()) { faults.push(`${where}: the plan cannot be approved (validator)`); continue; }
      await page.locator('#approve').click();
      await page.locator('.msg.bot', { hasText: 'Plan zatwierdzony' }).waitFor({ timeout: T });
      await visitAll(page, errs, where);
      await page.evaluate(() => travel(7));
      await page.waitForTimeout(100);
      if (await page.locator('.lock').count()) await page.locator('.lock').click().catch(() => {});
      await look(page, errs, `${where} +7 days`);
      await playForward(page, errs, where, name === 'last' ? 'refused' : 'granted');
      await visitAll(page, errs, `${where} after play`);
      runs++;
    } catch (e) {
      faults.push(`${where}: ${e.message.split('\n')[0]}`);
    } finally {
      await look(page, errs, `${where} end`).catch(() => {});
      await page.close();
    }
  }
}

// All five cases open at once, each with its first answers, then every screen.
{
  const { page, errs } = await newPage();
  try {
    for (const bp of BPS) {
      await page.evaluate(() => { S.screen = 'home'; render(); });
      await page.locator(`[data-type="${bp}"]`).click();
      if ((await intake(page, () => 0)) === 'plan') {
        await page.locator('#approve').click();
        await page.locator('.msg.bot', { hasText: 'Plan zatwierdzony' }).last().waitFor({ timeout: T });
      }
    }
    const n = await page.evaluate(() => S.cases.length);
    if (n !== 5) faults.push(`five cases: ${n} open`);
    await visitAll(page, errs, 'five cases');
    await page.evaluate(() => travel(7));
    await page.waitForTimeout(150);
    await look(page, errs, 'five cases +7 days');
    runs++;
  } catch (e) { faults.push(`five cases: ${e.message.split('\n')[0]}`); }
  await page.close();
}

await browser.close();
console.log(`${runs} runs played to the end`);
for (const l of log) console.log(`  ${l}`);
const uniq = [...new Set(faults)];
console.log(`\n${uniq.length} distinct faults`);
for (const f of uniq) console.log(`- ${f}`);
process.exit(uniq.length ? 1 : 0);
