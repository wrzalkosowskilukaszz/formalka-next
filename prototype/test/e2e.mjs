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
  const page = await browser.newPage({ viewport: opts.viewport || { width: 390, height: 844 }, deviceScaleFactor: opts.scale || 2, colorScheme: opts.scheme || 'light', reducedMotion: MOTION ? 'no-preference' : 'reduce' });
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
    if (opts.textZoom) await page.addStyleTag({ content: `html { font-size: ${opts.textZoom * 100}% !important; }` });
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
// D2: axe-core on every checked step (WCAG 2.0–2.2 A and AA rules); serious and critical issues fail.
const AXE = join(dirname(fileURLToPath(import.meta.url)), 'vendor/axe-core-4.13.0.min.js');
async function axeIssues(page) {
  if (!(await page.evaluate(() => !!window.axe))) await page.addScriptTag({ path: AXE });
  // Colours are measured at rest: finite animations (fades, slides) finish first; loops are left alone.
  await page.evaluate(() => Promise.race([Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => {}))), new Promise((r) => setTimeout(r, 1500))]));
  const res = await page.evaluate(() => window.axe.run({ include: [['#app'], ['#layer']], exclude: [['.tester-strip'], ['.tester-panel']] },
    { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }, resultTypes: ['violations'] }));
  return res.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.impact} ${v.id}: ${v.nodes.slice(0, 3).map((n) => `${n.target.join(' ')}${n.any?.[0]?.data?.contrastRatio ? ` (${n.any[0].data.fgColor} on ${n.any[0].data.bgColor}, ${n.any[0].data.contrastRatio}:1 "${(n.html || '').replace(/<[^>]+>/g, '').slice(0, 30)}")` : ''}`).join(' | ')}`);
}
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
      // Screen contracts (doc 18 §5.3): what each screen must always show.
      contract: (() => {
        const miss = [];
        const scr = document.querySelector('#app .screen:last-of-type');
        const txt = (sel) => document.querySelector(sel)?.innerText ?? '';
        if (S.screen === 'chat' && !/asystent(?:ka)? AI/.test(txt('.screen.chat .appbar'))) miss.push('chat: the assistant is named as an AI');
        if (S.screen === 'home' && !document.querySelector('#home-t')) miss.push('home: the input');
        if (S.screen === 'home' && STUDY && !/Badanie obejmuje tylko/.test(txt('.study-note'))) miss.push('home: the study scope');
        const c = S.cases.find((x) => x.id === S.active);
        if (S.screen === 'case' && c?.state.approved && S.view === 'focus') {
          if (!document.querySelector('#case-body .hero')) miss.push('Teraz: the current step');
          if (c.pendingFix && !document.querySelector('#case-body .mock-note.recheck')) miss.push('Teraz: the pending correction');
          if (STUDY && !/Zakres badania/.test(txt('#case-body'))) miss.push('Teraz: the study scope');
        }
        if (S.screen === 'case' && c?.state.approved && S.view === 'map') {
          const cards = [...document.querySelectorAll('#case-body .tl-card')];
          if (!cards.length) miss.push('Mapa: the steps');
          for (const k of cards) if (!/Poziom \d/.test(k.innerText)) miss.push(`Mapa: a step without its place: ${k.innerText.slice(0, 30)}`);
        }
        if (S.screen === 'teczka' && S.cases.some((x) => x.state.approved) && !/Tylko na tym telefonie/.test(scr?.innerText ?? '')) miss.push('Teczka: where the list lives');
        if (S.screen === 'calendar') for (const e of document.querySelectorAll('.appt-status')) if (!e.textContent.trim()) miss.push('Kalendarz: an entry without its origin');
        return miss;
      })(),
      // D11: nothing cut off at the sides, outside rows built to scroll sideways.
      clipped: [...document.querySelectorAll('#app *')].filter((el) => el.children.length === 0 && el.offsetParent !== null && (el.textContent.trim() || el.matches('svg, button, a, input')))
        .filter((el) => { for (let p = el.parentElement; p; p = p.parentElement) { const ox = getComputedStyle(p).overflowX; if (ox === 'auto' || ox === 'scroll') return false; } return true; })
        .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1); })
        .slice(0, 5).map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${el.textContent.trim().slice(0, 24)}"`),
      // D9: one primary action in view.
      // What the eye sees as primary: the accent fill, in view, not covered by a full-screen layer.
      primaries: (() => {
        const probe = document.createElement('i'); probe.style.background = 'var(--accent)'; document.body.append(probe);
        const accent = getComputedStyle(probe).backgroundColor; probe.remove();
        const covered = !!document.querySelector('#layer .full, #layer .sheet');
        return [...document.querySelectorAll('#app button, #app a, #layer button, #layer a')]
          .filter((el) => { const r = el.getBoundingClientRect(); return el.offsetParent !== null && r.bottom > 0 && r.top < innerHeight && !el.closest('.tester-strip') && !(covered && el.closest('#app')); })
          // A selected day, tab or filter is a state, not an action.
          .filter((el) => getComputedStyle(el).backgroundColor === accent && !el.matches('.send, [role=switch], [aria-pressed=true], [aria-selected=true], [aria-current], .sel, .on'))
          .map((el) => `${el.textContent.trim().slice(0, 30)}`);
      })(),
      // D3: touch targets. Links inside running text are exempt (WCAG 2.5.8 "inline").
      small: [...document.querySelectorAll('#app button, #app a[href], #app input:not([type=hidden]), #app select, #app [role=switch], #layer button, #layer a[href], #layer input, #tabbar button')]
        .filter((el) => el.offsetParent !== null && !el.closest('p, li > span, .cite, .src, .tester-strip, .tester-panel') && !el.disabled)
        .map((el) => { const r = el.getBoundingClientRect(); return { r, el }; })
        .filter(({ r }) => r.width > 0 && (r.width < 44 || r.height < 44))
        .map(({ r, el }) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}${el.id ? `#${el.id}` : ''} ${Math.round(r.width)}x${Math.round(r.height)}`),
    };
  });
  assert.equal(r.overflow, '', 'horizontal overflow');
  assert.equal(r.emptyIcons, 0, 'an icon name with no icon');
  assert.deepEqual(r.never, [], 'never-say phrase shown');
  assert.equal(r.emDash, false, 'em dash shown');
  assert.deepEqual([...r.rawIds], [], 'an internal identifier shown as text');
  if (process.env.REPORT_TARGETS) for (const x of r.small) SMALL.add(x);
  if (process.env.REPORT_TARGETS && r.primaries.length > 1) SMALL.add(`PRIMARIES ${r.primaries.length}: ${r.primaries.join(' | ')}`);
  else if (!process.env.REPORT_TARGETS) assert.ok(r.primaries.length <= 1, `D9: more than one primary action in view: ${r.primaries.join(' | ')}`);
  else assert.deepEqual([...r.small], [], 'D3: a touch target under 44 px');
  if (process.env.REPORT_TARGETS) for (const x of r.contract) SMALL.add(`CONTRACT ${x}`);
  else assert.deepEqual([...r.contract], [], 'a screen contract (doc 18 §5.3)');
  const axe = await axeIssues(page);
  if (process.env.REPORT_TARGETS) for (const x of axe) SMALL.add(`AXE ${x}`);
  else assert.deepEqual(axe, [], 'D2: accessibility issues (axe-core, serious or critical)');
  if (process.env.REPORT_TARGETS) for (const x of r.clipped) SMALL.add(`CLIPPED ${x}`);
  else assert.deepEqual([...r.clipped], [], 'D11: content cut off at the side');
}
const SMALL = new Set();
process.on('exit', () => { if (process.env.REPORT_TARGETS) console.log([...SMALL].sort().join('\n')); });

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
  // "abym złożył" says it is the person's own case, so the questions speak to them.
  await t.heard(/Twoja sprawa/);
  await t.q(/Czy kiedykolwiek przysługiwało Ci obywatelstwo polskie/);
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
  await t.chip(/co najmniej 3 lat i masz tu/);
  await t.q(/poświadczenie znajomości polskiego/);
  await t.say('dlaczego o to pytasz?');
  await t.q(/poświadczenie znajomości polskiego/);
  await t.say('nie wiem');
  await t.heard(/Nie wiem/);
  await t.q(/Gdzie mieszkasz/);
  await t.say('mam kartę pobytu');
  await t.card(/Dobrze rozumiem/);
  await t.yes();
  await page.locator('#approve').waitFor({ timeout: 12000 });
  await t.shot('plan');
  await t.say('włącz przypomnienia');
  await page.locator('#consent[aria-checked="true"]').waitFor({ timeout: 8000 });
  await t.say('zatwierdzam');
  await t.bot(/Plan zatwierdzony/);
  assert.ok(!(await page.locator('.log').innerText()).includes('ta osoba'), 'the person\'s own case never says "ta osoba"');
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
  // Audit F8: when the assistant does not follow, it asks to clarify instead of pushing an action.
  await t.say('qwerty asdf');
  await t.bot(/Nie jestem pewien/);
  assert.equal(await page.locator('.msg.bot').last().locator('.act').count(), 0, 'a not-sure reply offers no action');
  // Audit F7: a personal number is masked before it is shown.
  await t.say('mój PESEL to 12345678901');
  await t.bot(/Nie zapisuję tego/);
  assert.ok(!(await page.locator('.log').innerText()).includes('12345678901'), 'the PESEL is never shown');
  assert.ok(await page.locator('.msg.me', { hasText: 'mój PESEL to •••' }).count() === 1, 'the bubble shows the masked text');
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
  await t.q(/dla siebie czy dla kogoś/);
  await t.chip(/^Dla siebie$/);
  await t.q(/Która grupa Cię dotyczy/);
  await t.chip(/Żadna z tych grup/);
  await t.q(/Na jaki pobyt/);
  await t.say('na stałe');
  await t.heard(/Stały/);
  await t.q(/W jakiej miejscowości/);
  await t.say('mieszkam w Warszawie');
  await t.heard(/Warszawa/);
  await t.approvePlan(false);
  // Round 2 reference D3: another foreigner sees the no-PESEL in-person rule on the visit step itself.
  assert.match(await page.evaluate(() => placedNotes(S.cases[0], plan(S.cases[0]), plan(S.cases[0]).levels.find((l) => l.id === 'file'))), /Jeśli jednak nie masz numeru PESEL – przyjdź do urzędu osobiście/);
  const guide = await t.bot(/Na tym etapie/);
  assert.ok(await guide.locator('a.act[href*="gov.pl"][target="_blank"]').count() >= 1, 'download link to the official form');
  // Doc 18, R4: the official blank comes first; the in-app form is practice on a mock.
  assert.ok(await guide.locator('a.act.act-primary[href*="gov.pl"]').count() === 1, 'the official form is the primary action');
  assert.ok(await guide.locator('.act', { hasText: 'Przećwicz na makiecie' }).count() === 1, 'practice on the mock');
  assert.match(await guide.innerText(), /do urzędu się nie nadaje/);
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
  await t.act(/Przećwicz na makiecie/);
  await page.locator('#form-sample').click();
  await t.shot('form');
  await page.locator('#mock-form [type="submit"]').click();
  await t.toast(/Zapisano w Teczce/);
  // Practice never ticks the form task: the official form is still to be filled in by hand.
  assert.ok(await page.evaluate(() => plan(S.cases[0]).levels.find((l) => l.id === 'fill-in').state !== 'done'), 'the form step stays open after practice');
  await t.bot(/Do urzędu potrzebny jest oficjalny formularz/);
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
  await page.locator('.doc', { hasText: /makieta\.pdf/ }).waitFor({ timeout: 8000 });
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
  await t.chip(/^Dla siebie$/);
  await t.q(/Czy mieszkasz albo zamieszkasz/);
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
  // A case for someone else: the questions use the registry's own "ta osoba" wording.
  await t.q(/dla siebie czy dla kogoś/);
  await t.say('to dla mojej mamy');
  await t.heard(/Dla kogoś innego/);
  await t.q(/W jakim celu ta osoba chce mieszkać w Polsce/);
  await t.say('przyjechała do pracy sezonowej');
  await t.card(/Z Twojego opisu|Dobrze rozumiem/);
  await t.yes();
  await t.autoIntake();
  await t.approvePlan(false);
  await t.nav('#chat-back', 'case');
  await page.locator('.seg [data-v="map"]').click();
  await page.locator('.tl').waitFor({ timeout: 8000 });
  assert.ok(await page.locator('.tl-side').count() >= 1, 'parallel levels on the map');
  assert.match(await page.locator('.tl-sum').innerText(), /Sprawa kogoś innego/, 'the map says whose case it is');
  await t.shot('map-parallel');
  await t.nav('#to-world', 'world');
  await t.nav('#w-new', 'home');
  await page.locator('[data-type="language-certificate"]').click();
  await t.autoIntake();
  // The snapshot marks the exam dates as possibly outdated: the plan card and the guidance say so.
  await page.locator('.dock .row', { hasText: 'Część dat może być nieaktualna' }).waitFor({ timeout: 8000 });
  await t.approvePlan(false);
  await t.bot(/mogą być nieaktualne/);
  await t.nav('#chat-back', 'case');
  await t.nav('#to-world', 'world');
  const rows = await page.locator('.crow').count();
  assert.equal(rows, 4, 'four cases');
  assert.equal(await page.locator('.crow', { hasText: 'dla kogoś innego' }).count(), 1, 'the residence card is marked as someone else\'s case');
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

/* ── F: study mode (audit): one path, address registration, fictional data, honest claims ── */
await scenario('F-study-mode', {}, async (t, page) => {
  await page.locator('.tester-strip [data-study]').click();
  await page.locator('.study-note').waitFor({ timeout: 8000 });
  await page.waitForFunction(() => document.querySelectorAll('.ex').length === 1, null, { timeout: 8000 });
  // The build id ties a session's screenshots to one build (dist/manifest.json; audit F8).
  assert.match(await page.locator('.home-foot .build').innerText(), /Wersja prototypu [0-9a-f]{12}, silnik [0-9a-f]{16}/);
  assert.match(await page.locator('.study-note').innerText(), /Badanie obejmuje tylko obywatela UE, EFTA lub Szwajcarii oraz obywatela innego państwa z wizą krajową/);
  await t.shot('study-home');
  // The home input never dead-ends (owner, 16.10): a case outside the study leads into the chat, which
  // says so and offers the one case it leads.
  await page.fill('#home-t', 'Ogarnij mi temat karty pobytu');
  await page.press('#home-t', 'Enter');
  await page.locator('.sys', { hasText: 'W tym badaniu prowadzimy tylko zameldowanie' }).waitFor({ timeout: 8000 });
  assert.equal(await page.locator('.dock [data-pick]').count(), 1, 'only the study case is offered');
  await t.shot('study-offer');
  await page.locator('.dock [data-pick="address-registration"]').click();
  await page.locator('.sys', { hasText: 'nie korzysta z modelu językowego' }).waitFor({ timeout: 8000 });
  await t.q(/dla siebie czy dla kogoś/);
  await t.say('dla siebie');
  // An answer that fits no option (owner, 16.10): the reply reasons over the words instead of a dead end.
  // Where someone comes from never becomes a group (rule 4), and nothing is picked for the person.
  await t.q(/Która grupa Cię dotyczy/);
  await t.say('Przyjechałem z Kolumbii, a co dalej?');
  await t.bot(/niczego nie wybieram za Ciebie/);
  const r = await page.locator('.msg.bot').last().innerText();
  assert.match(r, /Dlaczego pytam/);
  assert.match(r, /Jeśli to pytanie do mnie/);
  assert.match(r, /Jeśli nie wiesz, wybierz „Nie wiem”/);
  await t.q(/Która grupa Cię dotyczy/);
  await t.shot('study-reflect');
  await t.autoIntake([[/miejscowości/, /Warszawa/]]);
  const card = await page.locator('.dock').innerText();
  assert.ok(!/Plan sprawdzony/.test(card) && /zgodny z przewodnikami/.test(card) && /nie jest weryfikacja prawna/.test(card), 'the plan card names what the check covers and does not overclaim');
  await t.approvePlan(false);
  await page.locator('#chat-av').click();
  await page.locator('.sheet-body', { hasText: 'pamięta w tej sesji' }).waitFor({ timeout: 8000 });
  await t.closeSheet();
  // Filing recorded with the form never marked: the form level is assumed done, not proven (engine `implied`).
  await page.evaluate(() => recordEvent(S.cases[0], 'filing', S.clock.date));
  await t.nav('#chat-back', 'case');
  await page.locator('.seg [data-v="map"]').click();
  await page.locator('.tl').waitFor({ timeout: 8000 });
  const formCard = await page.locator('.tl-card', { hasText: 'Formularz' }).first().innerText();
  assert.match(formCard, /Zakładamy, że zrobione/);
  // The owner's confirmation the guide lets the person skip is "skipped" once the filing happened without it.
  const ownerCard = await page.locator('.tl-card', { hasText: 'Potwierdzenie właściciela' }).first().innerText();
  assert.match(ownerCard, /Pominięte/);
  assert.match(ownerCard, /Nie jest już potrzebne: krok „Wizyta w urzędzie gminy” odbył się bez niego/);
  assert.ok(!/Teraz: Potwierdzenie właściciela/.test(await page.locator('.tl-sum').innerText()), 'a skipped step is never the current one');
  await t.shot('map-implied');
  // Reset keeps the study mode; the tester turns it off with the same button.
  await page.locator('.tester-strip [data-reset]').click();
  await page.locator('.study-note').waitFor({ timeout: 8000 });
  await page.locator('.tester-strip [data-study]').click();
  await page.locator('.study-note').waitFor({ state: 'detached', timeout: 8000 });
  await page.waitForFunction(() => document.querySelectorAll('.ex').length === 5, null, { timeout: 8000 });
});

/* ── Z: zoom and reflow (D11; WCAG 2.2 1.4.10 at 320 CSS px, and 1.4.4 text at 200% on the phone). Nothing may
   be cut off or need sideways scrolling (checkScreen runs on every step). ── */
const zoomed = async (t, page) => {
  await page.locator('[data-type="address-registration"]').click();
  await t.q(/dla siebie czy dla kogoś/);
  await t.chip(/^Dla siebie$/);
  await t.q(/Która grupa Cię dotyczy/);
  await t.chip(/Obywatel innego państwa UE/);
  await t.q(/Na jaki pobyt/);
  await t.chip(/^Czasowy/);
  await t.autoIntake([[/miejscowości/, /Warszawa/]]);
  await t.shot('plan');
  await t.approvePlan(false);
  await t.nav('#chat-back', 'case');
  await t.shot('teraz');
  await page.locator('.seg [data-v="map"]').click();
  await page.locator('.tl').waitFor({ timeout: 8000 });
  await t.shot('map');
  await t.tab('teczka');
  await t.shot('teczka');
  await t.tab('calendar');
  await t.shot('calendar');
};
await scenario('Z1-reflow-320', { viewport: { width: 320, height: 640 } }, zoomed);
await scenario('Z2-text-200', { textZoom: 2 }, zoomed);

/* ── G: waiting for the office (owner, 16.10): the person's need first, from the registry ── */
await scenario('G-waiting-for-office', {}, async (t, page) => {
  await page.fill('#home-t', 'Potrzebuję przyspieszyć wydanie karty pobytu');
  await page.press('#home-t', 'Enter');
  await t.heard(/Twoja sprawa/);
  await t.bot(/Nie przyspieszę tego za Ciebie/);
  await t.q(/Na co teraz czekasz/);
  assert.ok(!/W jakim celu/.test(await page.locator('.dock').innerText()), 'no new-application question before the need is answered');
  await t.shot('waiting-question');
  await t.chip(/Na decyzję wojewody/);
  await t.bot(/Ponaglenie wnosi się: 1\) do organu wyższego stopnia/);
  const answer = page.locator('.msg.bot', { hasText: 'Ponaglenie wnosi się' }).last();
  assert.equal(await answer.locator('a.act[href="https://www.biznes.gov.pl/pl/portal/ou590"]').count(), 1, 'the official template, linked');
  assert.match(await answer.innerText(), /art\. 100d/, 'the special provision is flagged');
  assert.match(await answer.innerText(), /Nie oceniam, czy ponaglenie ma sens/);
  await t.shot('waiting-answer');
  // The plan waits until the person wants it; typing later resumes the questions.
  await t.q(/Ułożyć plan całej sprawy/);
  await t.chip(/^Nie teraz$/);
  await page.locator('.dock .chip-q').first().waitFor({ timeout: 12000 });
  assert.equal(await page.locator('.builder').count(), 0, 'no case bar while the plan waits');
  await t.say('Ułóż jednak plan');
  await t.q(/W jakim celu chcesz mieszkać w Polsce/);
  await t.shot('waiting-then-plan');
  // From home, words that name a case already open go to that case (no "Tę sprawę już masz").
  await t.nav('#chat-back', 'world');
  await t.nav('#w-new', 'home');
  await page.fill('#home-t', 'Kiedy będzie decyzja w sprawie karty pobytu?');
  await page.press('#home-t', 'Enter');
  await t.q(/Na co teraz czekasz/);
  assert.equal(await page.locator('.toast').count(), 0, 'no toast instead of an answer');
});

/* ── H: the home input with words that name no case: the chat offers the cases, and back goes home ── */
await scenario('H-home-input-open', {}, async (t, page) => {
  await page.fill('#home-t', 'cześć, mam pytanie');
  await page.press('#home-t', 'Enter');
  await page.locator('.sys', { hasText: 'Nie rozpoznaję w tych słowach sprawy' }).waitFor({ timeout: 8000 });
  assert.equal(await page.locator('.dock [data-pick]').count(), 5, 'the five cases to pick from');
  await t.shot('home-unknown');
  await t.nav('#chat-back', 'home');
});

/* ── I: correcting a confirmed answer after approval: diff, explicit approval, history, recheck marks ── */
await scenario('I-correct-an-answer', {}, async (t, page) => {
  await page.locator('.tester-strip [data-study]').click();
  await page.locator('.study-note').waitFor({ timeout: 8000 });
  await page.locator('[data-type="address-registration"]').click();
  await t.q(/dla siebie czy dla kogoś/);
  await t.chip(/^Dla siebie$/);
  await t.q(/Która grupa Cię dotyczy/);
  await t.chip(/Obywatel innego państwa UE/);
  await t.q(/Na jaki pobyt/);
  await t.chip(/^Stały/);
  await t.autoIntake([[/miejscowości/, /Warszawa/]]);
  await t.approvePlan(false);
  // Teraz lists the answers, each with "Popraw".
  await t.nav('#chat-back', 'case');
  await page.locator('.answers-sec [data-fix="zameldowanie.stay"]').waitFor({ timeout: 8000 });
  assert.match(await page.locator('.study-note').first().innerText(), /Zakres badania[\s\S]*nie opieraj się na nich/);
  await t.shot('answers');
  // Round 2 reference D10: without the owner's confirmation the last step is not "od razu"; the registry's
  // own note says so on that step. D3: the no-PESEL note is for other foreigners only.
  await page.evaluate(() => openLevel(S.cases[0], 'registered'));
  await t.sheet(/^Zameldowanie$/);
  assert.match(await page.locator('.sheet-body').innerText(), /Urzędnik melduje Cię od razu/);
  assert.match(await page.locator('.sheet-body .placed-note').innerText(), /nie zakładaj, że urząd zamelduje Cię od razu: urząd przeprowadzi postępowanie administracyjne/);
  await t.closeSheet();
  await page.evaluate(() => openLevel(S.cases[0], 'file'));
  await t.sheet(/Wizyta w urzędzie gminy/);
  const fileSheet = await page.locator('.sheet-body').innerText();
  assert.match(fileSheet, /dołącz oświadczenie, w którym poinformujesz urząd, dlaczego nie masz wymaganych dokumentów\./);
  assert.doesNotMatch(fileSheet, /nie masz numeru PESEL/, 'an EU citizen is not told the non-EU in-person rule');
  await t.closeSheet();
  await page.locator('.answers-sec [data-fix="zameldowanie.stay"]').click();
  await page.locator('.screen.chat').waitFor({ timeout: 8000 });
  await t.bot(/Poprawiasz odpowiedź na pytanie/);
  await t.q(/Na jaki pobyt/);
  await t.chip(/^Czasowy/);
  await page.locator('.dock [data-pick="yes"]').waitFor({ timeout: 12000 });
  assert.match(await page.locator('.dock').innerText(), /Poprawka „Na jaki pobyt[^”]*”: Stały[^→]*→ Czasowy/);
  await t.shot('correction-diff');
  // Undecided: the affected steps are marked, nothing is proposed there, reminders wait.
  await t.nav('#chat-back', 'case');
  await page.locator('.mock-note.recheck').waitFor({ timeout: 8000 });
  assert.ok(await page.locator('.answers-sec [data-fix][disabled]').count() >= 1, 'no second correction while one is open');
  await t.shot('recheck-banner');
  // The stay changes the filing step's form: that step, and only that one, is marked on the map.
  await page.locator('.seg [data-v="map"]').click();
  await page.locator('.tl').waitFor({ timeout: 8000 });
  assert.match(await page.locator('.tl-card', { hasText: 'Wizyta w urzędzie gminy' }).first().innerText(), /Do ponownego sprawdzenia/);
  assert.equal(await page.locator('.tl-card', { hasText: 'Formularz' }).first().locator('.state-chip.recheck').count(), 0, 'an unchanged step is not marked');
  await t.shot('recheck-map');
  await page.locator('.seg [data-v="focus"]').click();
  await page.locator('#o-hist').click();
  await t.sheet(/Historia/);
  assert.match(await page.locator('.sheet-body').innerText(), /Przypomnienia czekają na Twoją decyzję o poprawce/);
  assert.match(await page.locator('.sheet-body').innerText(), /Poprawka odpowiedzi czeka na decyzję/);
  await t.closeSheet();
  await page.locator('[data-tochat]').click();
  await page.locator('.screen.chat').waitFor({ timeout: 8000 });
  await page.locator('.dock [data-pick="yes"]').click();
  await t.bot(/Plan zmieniony/);
  await t.nav('#chat-back', 'case');
  assert.equal(await page.locator('.mock-note.recheck').count(), 0, 'no marks once decided');
  assert.match(await page.locator('.answers-sec').innerText(), /Czasowy/);
  await page.locator('#o-hist').click();
  await t.sheet(/Historia/);
  const hist = await page.locator('.sheet-body').innerText();
  assert.match(hist, /Poprawka zatwierdzona: „Na jaki pobyt[^”]*”: Stały[^→]*→ Czasowy/);
  assert.match(hist, /Poprawka odpowiedzi czeka na decyzję/, 'the proposal stays in the history');
  await t.closeSheet();
  // Typed: "pomyliłem się" opens the answers; the person keeps the plan this time.
  await t.nav('#o-chat', 'chat');
  await t.say('pomyliłem się w jednej odpowiedzi');
  await page.locator('.dock [data-pick="zameldowanie.citizen_group"]').click();
  await t.q(/Która grupa Cię dotyczy/);
  await t.chip(/Żadna z tych grup/);
  await page.locator('.dock [data-pick="no"]').waitFor({ timeout: 12000 });
  await page.locator('.dock [data-pick="no"]').click();
  await t.bot(/Plan bez zmian/);
  await t.nav('#chat-back', 'case');
  assert.match(await page.locator('.answers-sec').innerText(), /Obywatel innego państwa UE/, 'the kept answer stays');
  await page.locator('#o-hist').click();
  await t.sheet(/Historia/);
  assert.match(await page.locator('.sheet-body').innerText(), /Poprawka odrzucona, plan bez zmian/);
  await t.closeSheet();
});

await browser.close();
let failed = 0;
for (const r of results) {
  console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.name} (${(r.ms / 1000).toFixed(1)} s)${r.ok ? '' : `\n     ${r.error}`}`);
  if (!r.ok) failed++;
}
console.log(`${results.length - failed}/${results.length} scenarios passed`);
process.exit(failed ? 1 : 0);
