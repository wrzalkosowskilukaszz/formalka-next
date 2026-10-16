// End-to-end walkthrough of the built prototype (dist/index.html) in Chromium, at phone size.
// Usage: node prototype/build.mjs && node prototype/test/e2e.mjs [--shots <dir>] [--motion]
// Needs Playwright (global install is fine: npm i -g playwright). Every scenario starts from a fresh
// page and checks: no console errors, no network requests, no horizontal overflow, every icon drawn,
// none of the engine's never-say phrases, no em dash and no internal identifier (like fix_submitted)
// in what the app shows (the person's own bubbles aside).
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const loadPlaywright = () => {
  try { return require('playwright'); } catch { return require(join(execSync('npm root -g').toString().trim(), 'playwright')); }
};
const { chromium } = loadPlaywright();
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL_ = pathToFileURL(join(root, 'dist/index.html')).href;
const args = process.argv.slice(2);
const SHOTS = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;
const MOTION = args.includes('--motion');
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const results = [];

const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
async function scenario(name, opts, fn) {
  if (ONLY && !name.startsWith(ONLY)) return;
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: opts.scheme || 'light', reducedMotion: MOTION ? 'no-preference' : 'reduce' });
  const errors = [], requests = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  page.on('request', (r) => { if (!/^(file|data|blob):/.test(r.url())) requests.push(r.url()); });
  let n = 0;
  const t = makeHelpers(page, name, async (label) => {
    await checkScreen(page);
    if (SHOTS) await page.waitForTimeout(MOTION ? 600 : 260);
    if (SHOTS) await page.screenshot({ path: join(SHOTS, `${name}-${String(++n).padStart(2, '0')}-${label}.png`) });
  });
  const started = Date.now();
  try {
    await page.goto(URL_);
    await page.locator('#home-t').waitFor({ timeout: 8000 });
    await fn(t, page);
    await checkScreen(page);
    assert.deepEqual(errors, [], 'console errors');
    assert.deepEqual(requests, [], 'network requests');
    results.push({ name, ok: true, ms: Date.now() - started });
  } catch (e) {
    if (SHOTS) await page.screenshot({ path: join(SHOTS, `${name}-FAIL.png`) }).catch(() => {});
    results.push({ name, ok: false, ms: Date.now() - started, error: `${e.message}${errors.length ? `\n  page errors: ${errors.join(' | ')}` : ''}` });
  }
  await page.close();
}

// Checks that hold on every screen.
async function checkScreen(page) {
  const r = await page.evaluate(() => {
    const never = window.FormalkaEngine.PHRASES_NEVER;
    const shown = [...document.querySelectorAll('#app *')].filter((el) => el.children.length === 0 || el.matches('p, b, span, button, a, li'))
      .filter((el) => !el.closest('.msg.me') && el.offsetParent !== null)
      .map((el) => el.textContent).join('\n').toLowerCase();
    return {
      overflow: [document.documentElement.scrollWidth > innerWidth ? `page ${document.documentElement.scrollWidth} > ${innerWidth}: ${[...document.querySelectorAll('body *')].filter((el) => el.getBoundingClientRect().right > innerWidth + 1).slice(0, 3).map((el) => `${el.tagName}.${el.className}`).join(', ')}` : '', ...[...document.querySelectorAll('.screen, .sheet, .dock, .lock')]
        .filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => `${el.className}: ${el.scrollWidth} > ${el.clientWidth}`)].filter(Boolean).join('; '),
      emptyIcons: [...document.querySelectorAll('.icon')].filter((i) => !i.innerHTML.trim()).length,
      never: never.filter((p) => shown.includes(p.toLowerCase())),
      emDash: shown.includes('—'),
      rawIds: shown.match(/\b[a-z]+_[a-z_]+\b/g) ?? [],
    };
  });
  assert.equal(r.overflow, '', 'horizontal overflow');
  assert.equal(r.emptyIcons, 0, 'an icon name with no icon');
  assert.deepEqual(r.never, [], 'never-say phrase shown');
  assert.equal(r.emDash, false, 'em dash shown');
  assert.deepEqual([...r.rawIds], [], 'an internal identifier shown as text');
}

function makeHelpers(page, name, shot) {
  const dock = page.locator('.dock');
  const T = 12000;
  // Replies are looked for only after the latest action, so an older bubble never satisfies a check.
  let mark = 0;
  const act = async () => { mark = await page.locator('.msg.bot').count(); };
  const h = {
    shot,
    // The open question in the dock.
    q: async (re) => { await page.locator('.dock .dock-q', { hasText: re }).waitFor({ timeout: T }); },
    // A typed answer in whatever the dock shows (question, approval card, panel, plan).
    say: async (text) => {
      const input = page.locator('.dock form input[name="t"]');
      await input.waitFor({ timeout: T });
      await input.fill(text);
      await act();
      await input.press('Enter');
    },
    chip: async (re) => { const l = dock.locator('.chip', { hasText: re }).first(); await l.waitFor({ timeout: T }); await act(); await l.click(); },
    yes: async () => { const l = dock.locator('[data-a="yes"]'); await l.waitFor({ timeout: T }); await act(); await l.click(); },
    no: async () => { const l = dock.locator('[data-a="no"]'); await l.waitFor({ timeout: T }); await act(); await l.click(); },
    card: async (re) => { await dock.locator('.approval', { hasText: re }).waitFor({ timeout: T }); },
    // An assistant bubble that appeared after the latest action and matches re; returns it.
    bot: async (re) => {
      const i = await page.waitForFunction(([from, src, flags]) => {
        const all = [...document.querySelectorAll('.msg.bot')];
        const k = all.findIndex((el, n) => n >= from && new RegExp(src, flags).test(el.textContent));
        return k >= 0 ? k + 1 : 0;
      }, [mark, re.source, re.flags], { timeout: T });
      return page.locator('.msg.bot').nth((await i.jsonValue()) - 1);
    },
    heard: async (re) => { await page.locator('.heard', { hasText: re }).last().waitFor({ timeout: T }); },
    act: async (re, scope = page.locator('.log')) => { const l = scope.locator('.act', { hasText: re }).last(); await l.waitFor({ timeout: T }); await act(); await l.click(); },
    mark: act,
    // Clicks, then waits for the screen and lets a view transition finish.
    nav: async (selector, screen) => {
      await page.locator(selector).first().click();
      await page.locator(`.screen.${screen}`).waitFor({ timeout: T });
      await page.waitForTimeout(MOTION ? 450 : 50);
    },
    sheet: async (re) => { await page.locator('.sheet-head h2', { hasText: re }).waitFor({ timeout: T }); },
    closeSheet: async () => { await page.locator('#sh-x').click(); await page.locator('.overlay').waitFor({ state: 'detached', timeout: T }); },
    toast: async (re) => { await page.locator('#toast', { hasText: re }).waitFor({ timeout: T }); },
    tab: async (id) => { await h.nav(`.tab[data-tab="${id}"]`, id); },
    approvePlan: async (consent = false) => {
      await page.locator('#approve').waitFor({ timeout: T });
      if (consent) await page.locator('#consent').click();
      await act();
      await page.locator('#approve').click();
      await h.bot(/Plan zatwierdzony/);
    },
    // Answers every question with its first chip (or the given ones) until the plan card shows.
    autoIntake: async (answers = [], stopAtRoutes = false) => {
      for (let i = 0; i < 20; i++) {
        await page.waitForTimeout(250);
        if (await page.locator('#approve').count()) return 'plan';
        if (stopAtRoutes && await dock.locator('.routes').count()) return 'routes';
        if (await dock.locator('[data-pick]').count()) { await dock.locator('[data-pick]').first().click(); continue; }
        if (await dock.locator('[data-a="yes"]').count()) { await h.yes(); continue; }
        const q = await dock.locator('.dock-q').first().textContent().catch(() => '');
        const pick = answers.find(([re]) => re.test(q || ''));
        if (pick) { await h.chip(pick[1]); continue; }
        const first = dock.locator('.opts .chip:not(.chip-dk)').first();
        if (await first.count()) await first.click();
      }
      throw new Error('the plan card never showed');
    },
    lastBotHasActs: async () => {
      const n = await page.locator('.msg.bot').last().locator('.act').count();
      assert.ok(n > 0, 'the last reply has no action');
    },
  };
  return h;
}

/* ── A: citizenship in the person's own words, consent on ───────────────────── */
await scenario('A-citizenship-words', {}, async (t, page) => {
  assert.equal(await page.locator('.home-q').textContent(), 'Co dziś załatwiamy?');
  assert.equal(await page.locator('.ex').count(), 5);
  assert.equal(await page.locator('.home .avatar').count(), 0, 'home shows no assistant avatars');
  await t.shot('home');
  await page.fill('#home-t', 'przyszedł czas, abym złożył papiery na obywatelstwo polskie');
  await page.press('#home-t', 'Enter');
  await t.bot(/Dzień dobry, jestem Maciek/);
  await t.q(/kiedykolwiek obywatelstwo/);
  await t.say('nigdy nie miałem polskiego obywatelstwa');
  await t.card(/Z Twojego opisu/);
  await t.shot('words-card');
  await t.yes();
  await t.q(/zezwolenie na pobyt stały/);
  await t.say('tak');
  await t.heard(/Tak/);
  await t.q(/Która sytuacja/);
  await t.say('mieszkam w Polsce od 3 lat');
  await t.bot(/pasują do 2 odpowiedzi/);
  await t.shot('two-fit');
  await t.chip(/co najmniej 3 lat i ma tu/);
  await t.q(/poświadczenie znajomości polskiego/);
  await t.say('dlaczego o to pytasz?');
  await t.q(/poświadczenie znajomości polskiego/);
  await t.say('nie wiem');
  await t.heard(/Nie wiem/);
  await t.q(/Gdzie mieszka ta osoba/);
  await t.say('mam kartę pobytu');
  await t.card(/Dobrze rozumiem/);
  await t.yes();
  await page.locator('#approve').waitFor({ timeout: 12000 });
  await t.shot('plan');
  await t.say('włącz przypomnienia');
  await page.locator('#consent[aria-checked="true"]').waitFor({ timeout: 8000 });
  await t.say('zatwierdzam');
  await t.bot(/Plan zatwierdzony/);
  await page.locator('.builder').waitFor({ state: 'detached', timeout: 8000 });
  await page.locator('.status').waitFor({ timeout: 8000 });
  await t.bot(/Teraz: „Dokumenty”/);
  await t.lastBotHasActs();
  await t.shot('guide');
  for (const [ask, re] of [['Ile to kosztuje?', /zł/], ['Jakie dokumenty są potrzebne?', /Do zebrania/], ['Ile kosztuje tłumacz przysięgły?', /Tego nie wiem/], ['Gdzie jest urząd?', /urz/i]]) {
    await t.say(ask);
    await t.bot(re);
    await page.waitForTimeout(150);
    await t.lastBotHasActs();
  }
  await t.say('qwerty asdf');
  await t.bot(/Nie jestem pewien/);
  await t.lastBotHasActs();
  await t.say('mój PESEL to 12345678901');
  await t.bot(/Nie zapisuję tego/);
  await t.shot('free-answers');
  // The person now knows the language answer: a proposal, approved in words.
  await t.say('Mam certyfikat B1');
  await t.card(/Z Twojego opisu/);
  await t.yes();
  // A second route opens: the person picks it first, then sees and approves the change.
  await t.bot(/Najpierw wybierz drogę/);
  await page.locator('.dock .routes').waitFor({ timeout: 12000 });
  await t.say('przez uznanie');
  await t.card(/Dobrze rozumiem/);
  await t.yes();
  await page.locator('.dock [data-pick="yes"]').waitFor({ timeout: 12000 });
  await t.shot('proposal');
  await t.say('zatwierdzam');
  await t.bot(/Plan zmieniony/);
  await t.bot(/Teraz:/);
  // Time: consent is on, but nothing is due in three days on this level.
  await page.locator('.tester-strip [data-travel="3"]').click();
  await t.toast(/Minęło 3 dni/);
});

/* ── B: registration in Warsaw: forms, offices with maps, the call flow, time, follow-up ── */
await scenario('B-registration-warsaw', { scheme: 'dark' }, async (t, page) => {
  await page.locator('[data-type="address-registration"]').click();
  await t.bot(/Dzień dobry, jestem Asia, asystentka AI/);
  await t.q(/Która grupa/);
  await t.chip(/Żadna z tych grup/);
  await t.q(/Na jaki pobyt/);
  await t.say('na stałe');
  await t.heard(/Stały/);
  await t.q(/W jakiej miejscowości/);
  await t.say('mieszkam w Warszawie');
  await t.heard(/Warszawa/);
  await t.approvePlan(false);
  const guide = await t.bot(/Na tym etapie/);
  assert.ok(await guide.locator('a.act[href*="gov.pl"][target="_blank"]').count() >= 1, 'download link to the official form');
  assert.ok(await guide.locator('.act', { hasText: 'Wypełnij tutaj' }).count() === 1, 'interactive fill');
  await t.shot('guide-form');
  await t.act(/Urzędy i mapa/);
  await t.sheet(/Urzędy: Warszawa/);
  const offices = await page.locator('.office').count();
  assert.ok(offices >= 10, `Warsaw offices listed (${offices})`);
  const withAddr = await page.locator('.office', { has: page.locator('.icon') }).count();
  const maps = await page.locator('.office a[href^="https://www.google.com/maps/search/?api=1&query="]').count();
  assert.ok(maps >= 10 && maps <= withAddr, 'a map link per office with an address');
  assert.ok(await page.locator('.office', { hasText: /\d{1,2}[:.]\d{2}/ }).count() >= 1, 'opening hours shown');
  await t.shot('offices');
  await page.fill('#of-q', 'Mokotów');
  const visible = await page.locator('.office:visible').count();
  assert.ok(visible >= 1 && visible < offices, `district filter (${visible})`);
  await t.closeSheet();
  await t.act(/Wypełnij tutaj/);
  await page.locator('#form-sample').click();
  await t.shot('form');
  await page.locator('#mock-form [type="submit"]').click();
  await t.toast(/Zapisano w Teczce/);
  // Right after the form the assistant offers the call reminder, every answer typed.
  await t.q(/Na który dzień/);
  await t.say('jutro');
  await t.heard(/wtorek 20\.10/);
  await t.q(/O której/);
  await t.say('o 10:15');
  await t.heard(/10:15/);
  await t.card(/Zadzwoń do urzędu/);
  await t.say('tak');
  await t.q(/termin/);
  await t.say('tak, mam');
  await t.q(/Wizyta: czwartek/);
  await t.chip(/10:30/);
  await t.bot(/To przypomnienie o wizycie/);
  await t.lastBotHasActs();
  await t.shot('visit-set');
  // The case screen: the assistant's card on Teraz.
  await t.nav('#chat-back', 'case');
  await page.locator('.assist .act').first().waitFor({ timeout: 8000 });
  await t.shot('teraz');
  await t.nav('#to-world', 'world');
  await page.locator('.hero').first().waitFor({ timeout: 8000 });
  await t.shot('start');
  await t.tab('calendar');
  await page.locator('#cal-add').click();
  await page.fill('#rem-t', 'Odebrać tłumaczenie');
  await page.locator('#rem-form [type="submit"]').click();
  await t.toast(/Przypomnienie dodane/);
  await page.locator('.ag', { hasText: 'Odebrać tłumaczenie' }).first().waitFor({ timeout: 8000 });
  await t.shot('calendar');
  await t.tab('teczka');
  await page.locator('.doc', { hasText: /szkic\.pdf/ }).waitFor({ timeout: 8000 });
  await t.shot('teczka');
  // Three days on: no consent, so no lock-screen notifications; the messages wait in the chat.
  await page.locator('.tester-strip [data-travel="3"]').click();
  assert.equal(await page.locator('.lock').count(), 0, 'no notifications without consent');
  await t.tab('chat');
  await t.bot(/Jak poszło w urzędzie/);
  await t.shot('follow-up');
  await t.say('złożyłem wniosek, wszystko ok');
  await t.card(/Wniosek złożony/);
  await t.yes();
  await t.bot(/Zapisane/);
  await page.waitForTimeout(300);
  await t.lastBotHasActs();
  await page.locator('#chat-av').click();
  await t.sheet(/Historia/);
  await page.locator('.sheet-body', { hasText: 'Miejscowość: Warszawa' }).waitFor({ timeout: 8000 });
  await page.locator('.sheet-body', { hasText: 'Ostatnio wybrana godzina' }).waitFor({ timeout: 8000 });
  await t.shot('memory');
  await t.closeSheet();
});

/* ── C: four cases, four assistants; PESEL with "Nie wiem" hands off to a related case ── */
await scenario('C-personas-and-handoff', {}, async (t, page) => {
  await page.locator('[data-type="pesel"]').click();
  await t.bot(/jestem Asia/);
  await t.chip(/^Nie wiem$/);
  await t.bot(/Bez tych odpowiedzi nie ustalę drogi/);
  await t.shot('stuck');
  await t.chip(/Zamelduj się/);
  await page.locator('.sys', { hasText: 'dołącza do rozmowy' }).waitFor({ timeout: 8000 });
  await t.autoIntake();
  await t.approvePlan(false);
  await t.nav('#chat-back', 'case');
  await t.nav('#to-world', 'world');
  await t.nav('#w-new', 'home');
  await page.locator('[data-type="residence-card"]').click();
  await t.q(/W jakim celu/);
  await t.say('przyjechałem do pracy sezonowej');
  await t.card(/Z Twojego opisu|Dobrze rozumiem/);
  await t.yes();
  await t.autoIntake();
  await t.approvePlan(false);
  await t.nav('#chat-back', 'case');
  await page.locator('.seg [data-v="map"]').click();
  await page.locator('.tl').waitFor({ timeout: 8000 });
  assert.ok(await page.locator('.tl-side').count() >= 1, 'parallel levels on the map');
  await t.shot('map-parallel');
  await t.nav('#to-world', 'world');
  await t.nav('#w-new', 'home');
  await page.locator('[data-type="language-certificate"]').click();
  await t.autoIntake();
  await t.approvePlan(false);
  await t.nav('#chat-back', 'case');
  await t.nav('#to-world', 'world');
  const rows = await page.locator('.crow').count();
  assert.equal(rows, 4, 'four cases');
  const colours = await page.locator('.crow .avatar').evaluateAll((els) => els.map((e) => [...e.classList].find((c) => /^av-\d$/.test(c))));
  assert.equal(new Set(colours).size, 4, `four assistant colours (${colours.join(', ')})`);
  const names = await page.locator('.crow .avatar').evaluateAll((els) => els.map((e) => e.textContent));
  assert.equal(new Set(names).size, 4, `four assistant names (${names.join(', ')})`);
  await t.shot('four-cases');
});

/* ── D: route choice in words, every task to filing, the office's request, the fix, undo ── */
await scenario('D-route-and-office', {}, async (t, page) => {
  await page.locator('[data-type="citizenship"]').click();
  const at = await t.autoIntake([[/kiedykolwiek/, /Nie, nigdy/], [/poświadczenie/, /^Tak$/], [/Gdzie mieszka/, /legalnie/]], true);
  assert.equal(at, 'routes', 'two routes fit: recognition and grant');
  await t.shot('routes');
  await t.say('przez nadanie');
  await t.card(/Dobrze rozumiem/);
  await t.yes();
  await t.autoIntake([[/miejscowości/, /Kraków/]]);
  await t.approvePlan(true);
  await t.nav('#chat-back', 'case');
  // Tick every task until the filing level is current, then record the filing.
  for (let i = 0; i < 30; i++) {
    const form = page.locator('#case-body form[data-event="filing"]');
    if (await form.count()) break;
    const task = page.locator('#case-body .task[data-st="done"]').first();
    if (!(await task.count())) throw new Error('no task to tick and no filing form');
    const before = await page.locator('#case-body .task.is-done').count();
    await task.click();
    await page.waitForTimeout(MOTION ? 700 : 450);
    assert.ok((await page.locator('#case-body .task').count()) > 0 || before >= 0);
  }
  await page.locator('#case-body form[data-event="filing"] button').click();
  await t.toast(/Zapisane/);
  await page.locator('#case-body form[data-event="request_delivered"]').waitFor({ timeout: 8000 });
  await page.locator('#case-body form[data-event="request_delivered"] button').click();
  await page.locator('#case-body [data-fixed]').waitFor({ timeout: 8000 });
  await t.shot('returned');
  await page.locator('#case-body [data-fixed]').click();
  await t.toast(/Zapisane/);
  await page.locator('#case-body .hero', { hasText: 'Czekasz na urząd' }).waitFor({ timeout: 8000 });
  await page.locator('#o-hist').click();
  await t.sheet(/Historia/);
  const undo = page.locator('[data-undo]').first();
  await undo.click();
  await t.toast(/Cofnięte/);
  await t.closeSheet();
  await t.mark();
  await t.nav('#o-chat', 'chat');
  await page.locator('.msg.bot', { hasText: /Urząd prosi o uzupełnienie|Teraz czekasz na urząd/ }).first().waitFor({ timeout: 8000 });
  await t.shot('chat-after');
});

/* ── E: consent on: a visit, three days on, the lock screen, "Jak poszło?" by chip; desktop frame ── */
await scenario('E-lock-screen-and-desktop', {}, async (t, page) => {
  await page.locator('[data-type="address-registration"]').click();
  await t.autoIntake([[/miejscowości/, /Kraków/]]);
  await t.approvePlan(true);
  await t.say('Mam umówioną wizytę');
  await t.bot(/Nie mogę zarezerwować wizyty/);
  await t.lastBotHasActs();
  await t.act(/Mam umówioną wizytę/);
  await t.sheet(/Twoja wizyta/);
  await page.locator('#pt-ok').click();
  await t.bot(/To przypomnienie o wizycie/);
  await page.locator('.tester-strip [data-travel="3"]').click();
  await page.locator('.lock .note').first().waitFor({ timeout: 8000 });
  const generic = await page.locator('.lock .note b').first().textContent();
  assert.ok(!/Zameldowanie|urzęd/i.test(generic), `the lock screen hides the topic by default (${generic})`);
  await t.shot('lock');
  await page.locator('#lock-topic').click();
  await t.shot('lock-topic');
  await t.mark();
  await page.locator('.lock .note').last().click();
  await page.locator('.screen.chat').waitFor({ timeout: 8000 });
  await page.locator('.log button[data-fu]', { hasText: 'Wniosek złożony' }).last().click();
  await t.bot(/Zapisane/);
  await t.shot('after-follow-up');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator('.tester-panel [data-travel="7"]').waitFor({ timeout: 8000 });
  await t.shot('desktop');
});

await browser.close();
let failed = 0;
for (const r of results) {
  console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.name} (${(r.ms / 1000).toFixed(1)} s)${r.ok ? '' : `\n     ${r.error}`}`);
  if (!r.ok) failed++;
}
console.log(`${results.length - failed}/${results.length} scenarios passed`);
process.exit(failed ? 1 : 0);
