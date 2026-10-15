'use strict';
/*
 * Formalka Next: experience prototype (brief 15). Everything is scripted and in memory.
 * No network, no AI, no storage. Facts come from reference/citizenship (snapshot formalka@04057ef)
 * and are shown as labelled examples with their source link.
 */
const ICONS = /*__ICONS__*/ {};

/* ── Small helpers ─────────────────────────────────────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = (n, cls = '') => `<span class="icon ${cls}" aria-hidden="true">${ICONS[n] || ''}</span>`;
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const RM = matchMedia('(prefers-reduced-motion: reduce)');

// RUN changes on reset; FLOW changes when a new scripted flow starts. A stale timer or answer
// never resolves, so an abandoned flow simply stops.
let RUN = 0;
let FLOW = 0;
const sleep = (ms) => {
  const r = RUN, f = FLOW;
  return new Promise((res) => setTimeout(() => { if (r === RUN && f === FLOW) res(); }, RM.matches ? Math.min(ms, 160) : ms));
};

const DAYS = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const DS = ['nd', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'];
const MON = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
const pad = (n) => String(n).padStart(2, '0');
const hm = (d) => `${d.getHours()}:${pad(d.getMinutes())}`;
const dnum = (d) => `${pad(d.getDate())}.${pad(d.getMonth() + 1)}`;
const dshort = (d) => `${DS[d.getDay()]} ${dnum(d)}`;
const dday = (d) => `${DAYS[d.getDay()]} ${dnum(d)}`;
const dlong = (d) => `${DAYS[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`;
const dfull = (d) => `${dnum(d)}.${d.getFullYear()}`;
const at = (base, days, hh, mm = 0) => { const x = new Date(base); x.setDate(x.getDate() + days); x.setHours(hh, mm, 0, 0); return x; };
const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };
const sameDay = (a, b) => !!a && !!b && a.toDateString() === b.toDateString();

/* ── Sources (reference/citizenship, checked 2026-10-02, snapshot 2026-10-15) ── */
const SRC = {
  uznanie: { url: 'https://www.gov.pl/web/mswia/popros-o-uznanie-za-polskiego-obywatela', label: 'gov.pl, MSWiA: Poproś o uznanie za polskiego obywatela' },
  nadanie: { url: 'https://www.gov.pl/web/mswia/uzyskaj-polskie-obywatelstwo', label: 'gov.pl, MSWiA: Uzyskaj polskie obywatelstwo' },
  duty: { url: 'https://api.sejm.gov.pl/eli/acts/DU/2025/1154/text.pdf', label: 'ustawa o opłacie skarbowej, Dz.U. 2025 poz. 1154' },
  act: { url: 'https://api.sejm.gov.pl/eli/acts/DU/2025/1611/text.pdf', label: 'ustawa o obywatelstwie polskim, Dz.U. 2025 poz. 1611' },
  foreigners: { url: 'https://api.sejm.gov.pl/eli/acts/DU/2025/1079/text.pdf', label: 'ustawa o cudzoziemcach, Dz.U. 2025 poz. 1079' },
  aid: { url: 'https://www.gov.pl/web/nieodplatna-pomoc/nieodplatna-pomoc-prawna', label: 'Nieodpłatna pomoc prawna, gov.pl' },
};
const link = (k, text) => `<a href="${SRC[k].url}" target="_blank" rel="noopener">${text || SRC[k].label}</a>`;
const cite = (k) => `<p class="cite">${icon('info')}<span>Przykład z przewodnika Formalki, stan na 15.10.2026. Źródło: ${link(k)}</span></p>`;
const FEE = 1000; // reference/citizenship/procedure-recognition.yaml, fees.decision (stamp duty act)

const VOIV = ['dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie', 'łódzkie', 'małopolskie', 'mazowieckie', 'opolskie', 'podkarpackie', 'podlaskie', 'pomorskie', 'śląskie', 'świętokrzyskie', 'warmińsko-mazurskie', 'wielkopolskie', 'zachodniopomorskie'];
// "województwo pomorskie" → "wojewoda pomorski"
const voivode = (v) => 'wojewoda ' + v.replace(/kie$/, 'ki');

const WHO = {
  maciek: { name: 'Maciek', letter: 'M', role: 'asystent AI', cls: 'av-m' },
  asia: { name: 'Asia', letter: 'A', role: 'asystentka AI', cls: 'av-a' },
};
const avatar = (w, sm = false) => `<span class="avatar ${WHO[w].cls}${sm ? ' avatar-sm' : ''}" aria-hidden="true">${WHO[w].letter}</span>`;

let MID = 0;
function mark(cls = '') {
  const g = 'msh' + (++MID);
  return `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs>
<g class="sh sh1"><rect x="9" y="7" width="12" height="35" rx="2.5" style="fill:var(--mark-1)"/></g>
<g class="sh sh2"><rect x="9" y="22" width="22" height="9" rx="2.5" style="fill:var(--mark-2)"/><rect x="9" y="31" width="12" height="3.5" fill="url(#${g})"/></g>
<g class="sh sh3"><rect x="9" y="17" width="12" height="3.5" fill="url(#${g})"/><path d="M11.5 7H33l6 6v1.5a2.5 2.5 0 0 1-2.5 2.5h-25A2.5 2.5 0 0 1 9 14.5v-5A2.5 2.5 0 0 1 11.5 7Z" style="fill:var(--mark-3)"/><path d="M33 7v4.5a1.5 1.5 0 0 0 1.5 1.5H39Z" style="fill:var(--mark-fold)"/><path d="M33 7 39 13" stroke-width=".6" stroke-opacity=".5" style="stroke:var(--mark-1)"/></g></svg>`;
}

/* ── State ─────────────────────────────────────────────────────────────────── */
const START = new Date(2026, 9, 19, 18, 40); // simulated "now": Monday 19.10.2026, 18:40
let S;
let logEl, dockEl, lastSpeaker;

function fresh() {
  return {
    screen: 'splash', clock: new Date(START), cases: {}, order: [], active: null,
    view: 'focus', building: null, flow: null, lockTopic: false, highlight: null, travels: 0,
  };
}

function newObyw() {
  return {
    id: 'obyw', title: 'Obywatelstwo polskie', who: 'maciek', status: 'building', consent: false,
    f: { title: null, since: null, kind: null, group: null, lang: null, voiv: null },
    p: { form: false, photos: false, b1: false, trans: 'unknown', call: null, visit: null, morning: false, paid: false, filed: false, proof: false, returned: null, decisionBy: null },
    pending: null, preview: '', teczka: [], history: [], changed: new Set(), lastChange: '',
  };
}
function newKarta() {
  return {
    id: 'karta', title: 'Karta pobytu', who: 'asia', status: 'building', consent: false,
    f: { whose: null, voiv: null }, p: {}, pending: null, preview: '', teczka: [], history: [], changed: new Set(), lastChange: '',
  };
}
const C = () => S.cases[S.active];
const logAct = (c, text, by = 'you', extra = {}) => c.history.unshift({ t: new Date(S.clock), text, by, ...extra });

/* ── Levels: Milestones of a Case, computed from facts and progress ────────── */
const STATE = {
  unconfirmed: 'Niepotwierdzone',
  available: 'Do zrobienia teraz',
  parallel: 'Równolegle, możesz zacząć teraz',
  locked: 'Zablokowane',
  waiting: 'Czeka na urząd',
  returned: 'Urząd prosi o uzupełnienie',
  done: 'Załatwione przez Ciebie',
  confirmed: 'Potwierdzone dokumentem z urzędu',
  pruned: 'Odłożone',
};
const MK_ICON = { locked: 'lock-simple', waiting: 'hourglass-simple', returned: 'arrow-u-up-left', done: 'check', confirmed: 'checks', pruned: 'x', parallel: 'arrows-split' };
const mk = (state, extra = '') => `<span class="mk ${state} ${extra}" aria-hidden="true">${MK_ICON[state] ? icon(MK_ICON[state]) : ''}</span>`;

function levels(c) { return c.id === 'obyw' ? lvObyw(c) : lvKarta(c); }

function docsDone(c) {
  const { f, p } = c;
  return p.form && p.photos && (f.lang === 'yes' || p.b1) && p.trans !== 'unknown' && !p.returned;
}

function lvObyw(c) {
  const { f, p } = c;
  const b = c.status === 'building';
  const U = (s) => (b ? 'unconfirmed' : s);
  const L = [];
  if (f.title !== 'yes') {
    L.push({ id: 'rA', short: 'Uznanie', title: 'Droga: uznanie przez wojewodę', state: 'unconfirmed', text: 'Możliwa droga, jeszcze nie wiemy, czy pasuje',
      detail: '<p>Dla osób z zezwoleniem na pobyt stały, zezwoleniem na pobyt rezydenta długoterminowego UE albo prawem stałego pobytu.</p>' + cite('uznanie') });
    L.push({ id: 'rB', short: 'Nadanie', par: true, title: 'Droga: nadanie przez Prezydenta', state: 'unconfirmed', text: 'Możliwa droga, jeszcze nie wiemy, czy pasuje',
      detail: '<p>Prezydent RP nie jest związany żadnymi terminami. Od postanowienia nie można się odwołać.</p>' + cite('nadanie') });
  } else {
    L.push({ id: 'route', short: 'Droga', title: 'Droga: uznanie przez wojewodę', state: b ? 'unconfirmed' : 'done',
      text: b ? 'Pasuje do Twoich odpowiedzi, czeka na zatwierdzenie planu' : 'Ustalona z Tobą przy zatwierdzeniu planu',
      detail: `<p>Masz ${esc(f.kind || 'zezwolenie na pobyt stały')}${f.since ? ` od ${esc(f.since)} roku` : ''} (z Twojej odpowiedzi).${f.voiv ? ` Wniosek przyjmuje ${voivode(f.voiv)}.` : ''}</p>` + cite('uznanie') });
    L.push({ id: 'rB', short: 'Nadanie', par: true, title: 'Nadanie przez Prezydenta', state: 'pruned', text: 'Odłożone, ta droga zostaje możliwa',
      detail: '<p>Masz pobyt stały, więc najpierw sprawdzamy uznanie przez wojewodę. Przy nadaniu Prezydent nie jest związany terminami, a od postanowienia nie można się odwołać.</p>' + cite('nadanie') });
  }
  const known = f.title === 'yes';
  // Documents
  const docTasks = [
    { id: 'form', label: 'Wniosek o uznanie za obywatela polskiego', sub: p.form ? 'Szkic jest w Teczce' : 'Wypełnisz go tutaj, na makiecie', done: p.form },
    { id: 'photos', label: 'Fotografie osób objętych wnioskiem', sub: 'Zdjęcia każdej osoby, której dotyczy wniosek', done: p.photos },
    { id: 'b1', label: 'Poświadczenie znajomości polskiego, co najmniej B1', sub: f.lang === 'yes' ? 'Masz (z Twojej odpowiedzi)' : 'Albo świadectwo szkoły w Polsce; świadectwo szkoły policealnej się nie liczy', done: f.lang === 'yes' || p.b1 },
    { id: 'trans', label: 'Tłumaczenia dokumentów w obcym języku', sub: p.trans === 'na' ? 'Nie dołączasz obcych dokumentów' : p.trans === 'done' ? 'Masz tłumaczenia' : 'Tylko jeśli je dołączasz: tłumaczenie przysięgłe albo konsularne', done: p.trans !== 'unknown' },
  ];
  if (p.returned) docTasks.unshift({ id: 'fix', label: `Uzupełnij: ${p.returned}`, sub: 'Urząd poprosił o uzupełnienie', done: false, fix: true });
  const allDocs = docsDone(c);
  L.push({ id: 'docs', short: 'Dokumenty', title: 'Zbierz dokumenty', tasks: docTasks,
    state: U(p.returned ? 'returned' : allDocs ? 'done' : 'available'),
    text: p.returned ? 'Wracamy tu, bo urząd prosi o uzupełnienie. To poprawka, nie koniec sprawy.' : allDocs ? 'Wszystko zaznaczone' : known ? 'Listę dokumentów podaje urząd wojewódzki' : 'Lista zależy od drogi',
    detail: known ? `<ul>${docTasks.map((t) => `<li>${esc(t.label)}</li>`).join('')}</ul><p>Szczegóły podaje właściwy dla Ciebie urząd wojewódzki.</p>${cite('uznanie')}` : '<p>Lista zależy od drogi, którą ustalimy.</p>' });
  if (f.lang === 'no') {
    L.push({ id: 'b1lv', short: 'B1', par: true, title: 'Zdobądź poświadczenie B1', state: U(p.b1 ? 'done' : 'parallel'), text: 'Potrzebne przed złożeniem wniosku',
      detail: '<p>Ustawa wymaga urzędowego poświadczenia znajomości polskiego co najmniej na poziomie B1 albo świadectwa szkoły w Polsce.</p>' + cite('act') });
  }
  L.push({ id: 'visit', short: 'Wizyta', par: true, title: 'Umów wizytę w urzędzie', userStep: true,
    state: U(p.visit ? 'done' : 'parallel'),
    text: p.visit ? `Termin od Ciebie: ${dday(p.visit)}, ${hm(p.visit)}` : 'Twój krok praktyczny, równolegle do dokumentów',
    detail: `<p>To nie jest wymóg z przewodnika, tylko praktyczny krok. Przewodnik mówi: wniosek możesz złożyć osobiście albo wysłać pocztą do wojewody właściwego dla miejsca zamieszkania.</p>${cite('uznanie')}` });
  const payState = p.paid ? 'done' : allDocs ? 'available' : 'locked';
  L.push({ id: 'pay', short: 'Opłata', title: 'Zapłać opłatę skarbową', state: U(payState),
    reason: 'Najpierw zbierz dokumenty. Taka kolejność jest w przewodniku.',
    text: payState === 'locked' && !b ? 'Najpierw zbierz dokumenty' : p.paid ? 'Oznaczone przez Ciebie jako zapłacone' : known ? `${FEE} zł, przykład z przewodnika` : 'Kwota zależy od drogi',
    detail: known ? `<div class="fee"><b>${FEE} zł</b><span>opłata skarbowa za decyzję o uznaniu</span></div><p>Numer konta jest na stronie urzędu wojewódzkiego.</p>${cite('duty')}` : '<p>Kwota zależy od drogi.</p>' });
  const b1ok = f.lang !== 'no' || p.b1;
  const fileState = p.proof ? 'confirmed' : p.filed ? 'done' : p.paid && b1ok ? 'available' : 'locked';
  L.push({ id: 'file', short: 'Wniosek', title: 'Złóż wniosek u wojewody', state: U(fileState),
    reason: !b1ok ? 'Najpierw potrzebujesz poświadczenia B1.' : 'Najpierw zapłać opłatę skarbową.',
    text: p.proof ? 'Masz potwierdzenie złożenia w Teczce' : p.filed ? 'Oznaczone przez Ciebie. Dodaj potwierdzenie, jeśli je masz' : fileState === 'locked' && !b ? (!b1ok ? 'Najpierw potrzebujesz poświadczenia B1' : 'Najpierw zapłać opłatę skarbową') : 'Osobiście albo pocztą',
    detail: `<p>Osobiście albo pocztą, do wojewody właściwego dla Twojego miejsca zamieszkania${f.voiv ? ` (${voivode(f.voiv)})` : ''}.</p>${cite('uznanie')}` });
  L.push({ id: 'decision', short: 'Decyzja', title: 'Decyzja wojewody', state: U('waiting'),
    text: p.filed ? `Do ${dfull(p.decisionBy)}, 6 miesięcy od złożenia. Termin może być wydłużony` : 'Ten poziom zależy od urzędu, nie od Ciebie. Zaczyna się po złożeniu wniosku',
    detail: '<p>Wojewoda ma 6 miesięcy na wydanie decyzji. W uzasadnionych przypadkach termin może zostać wydłużony. Jeśli nie zgadzasz się z decyzją, odwołanie do MSWiA składasz na piśmie w ciągu 14 dni od jej otrzymania.</p>' + cite('uznanie') });
  return L;
}

function lvKarta(c) {
  const sketch = '<p>Szkic. W tym prototypie nie ma zweryfikowanego przewodnika o karcie pobytu, więc nie podajemy dokumentów, opłat ani terminów.</p>';
  return [
    { id: 'k1', short: 'Rodzaj', title: 'Ustal, jakiego zezwolenia dotyczy sprawa', state: c.f.whose ? 'available' : 'unconfirmed', text: c.f.whose ? `Dotyczy: ${c.f.whose}` : 'Pierwsze pytanie', detail: sketch },
    { id: 'k2', short: 'Dokumenty', title: 'Dokumenty', state: 'unconfirmed', text: 'Czeka na przewodnik', detail: sketch },
    { id: 'k3', short: 'Wniosek', title: 'Wniosek', state: 'unconfirmed', text: c.f.voiv ? `Województwo ${c.f.voiv} (z innej sprawy, za Twoją zgodą)` : 'Czeka na przewodnik', detail: sketch },
    { id: 'k4', short: 'Decyzja', title: 'Decyzja', state: 'unconfirmed', text: 'Czeka na przewodnik', detail: sketch },
  ];
}

// The level the person should look at now (Focus view).
function currentLevel(c) {
  const L = levels(c);
  const main = L.filter((l) => !l.par && l.id !== 'route');
  return main.find((l) => ['returned', 'available'].includes(l.state)) || main.find((l) => l.state === 'waiting') || main[0];
}

/* ── Chat log and dock (persistent across screens) ─────────────────────────── */
function newChat() {
  logEl = h('<div class="log" role="log" aria-live="polite" aria-label="Rozmowa"></div>');
  dockEl = h('<div class="dock" aria-label="Pytanie i odpowiedź"></div>');
  lastSpeaker = null;
  logEl.addEventListener('click', onLogClick);
}
function scrollLog() { requestAnimationFrame(() => { logEl.scrollTop = logEl.scrollHeight; }); }

function addMsg(kind, html, who) {
  const frag = document.createDocumentFragment();
  if (kind === 'bot' && lastSpeaker !== who) {
    frag.append(h(`<div class="msg-name">${avatar(who, true)}<span>${WHO[who].name} · ${WHO[who].role}</span></div>`));
  }
  if (kind === 'sys') frag.append(h(`<p class="sys enter">${html}</p>`));
  else frag.append(h(`<div class="msg ${kind} enter">${html}</div>`));
  logEl.append(frag);
  lastSpeaker = kind === 'bot' ? who : kind;
  scrollLog();
}
async function say(who, html, wait = 420) {
  const t = h(`<div class="typing" role="status"><span class="sr">${WHO[who].name} odpowiada</span><i></i><i></i><i></i></div>`);
  if (lastSpeaker !== who) logEl.append(h(`<div class="msg-name">${avatar(who, true)}<span>${WHO[who].name} · ${WHO[who].role}</span></div>`));
  lastSpeaker = who;
  logEl.append(t); scrollLog();
  await sleep(wait);
  t.remove();
  addMsg('bot', html, who);
}
const me = (text) => addMsg('me', esc(text));
const sys = (text) => addMsg('sys', esc(text));

function askBar(prefill = '', placeholder = 'Napisz własnymi słowami', id = 'dock-t') {
  return `<form class="ask ask-sm" autocomplete="off"><label class="sr" for="${id}">Twoja odpowiedź</label>
    <input id="${id}" name="t" value="${esc(prefill)}" placeholder="${esc(placeholder)}" enterkeyhint="send">
    <button class="send" type="submit" aria-label="Wyślij">${icon('arrow-up')}</button></form>`;
}

// One question at a time in the dock. Answering moves the question and the answer up into the log.
function ask({ who = 'maciek', q, why, options = [], text = false, prefill = '', placeholder, dk = true, long = false }) {
  const r = RUN, f = FLOW;
  const opts = [...options];
  if (dk) opts.push({ label: 'Nie wiem', value: 'unknown', dk: true });
  return new Promise((res) => {
    dockEl.innerHTML = `${q ? `<p class="dock-q" id="dq" tabindex="-1">${q}</p>` : ''}${why ? `<p class="dock-why">${why}</p>` : ''}
      <div class="opts" role="group" ${q ? 'aria-labelledby="dq"' : 'aria-label="Odpowiedzi"'}>${opts.map((o, i) => `<button type="button" class="chip${long && !o.dk ? ' chip-long' : ''}${o.dk ? ' chip-dk' : ''}${o.tester ? ' chip-t' : ''}${o.small ? ' chip-sm' : ''}" data-i="${i}">${esc(o.label)}</button>`).join('')}</div>
      ${text ? askBar(prefill, placeholder) : ''}`;
    dockEl.classList.remove('enter'); void dockEl.offsetWidth; dockEl.classList.add('enter');
    const done = (value, label, extra = {}) => {
      if (r !== RUN || f !== FLOW) return;
      if (q) addMsg('bot', q, who);
      if (!extra.silent) me(label);
      dockEl.innerHTML = '';
      res({ value, label, ...extra });
    };
    dockEl.querySelectorAll('.chip').forEach((b) => { b.onclick = () => { const o = opts[+b.dataset.i]; done(o.value, o.label, { silent: !!o.tester }); }; });
    const form = dockEl.querySelector('form');
    if (form) form.onsubmit = (e) => { e.preventDefault(); const v = form.elements.t.value.trim(); if (v) done('text', v, { text: v }); };
    const dq = $('#dq', dockEl);
    if (dq && document.activeElement && document.activeElement !== document.body) dq.focus({ preventScroll: true });
    scrollLog();
  });
}

// A flow is one scripted sequence. Starting a new one abandons the previous one.
function runFlow(name, fn) {
  const id = ++FLOW, r = RUN;
  S.flow = name;
  return fn().then(() => { if (id === FLOW && r === RUN) { S.flow = null; idleDock(); } });
}

/* ── Idle dock: free text plus suggestions ─────────────────────────────────── */
function suggestions() {
  const c = S.cases.obyw;
  const s = [];
  if (c && c.status === 'active') s.push('Co mam teraz zrobić?', 'Ile kosztuje tłumacz przysięgły?');
  if (!S.cases.karta) s.push('Ogarnij mi temat karty pobytu');
  if (!c) s.push('Chcę złożyć papiery na obywatelstwo polskie');
  return s;
}
function idleDock() {
  if (!dockEl || S.flow) return;
  const who = S.active ? C().who : 'maciek';
  dockEl.innerHTML = `<div class="opts" aria-label="Podpowiedzi">${suggestions().map((t) => `<button type="button" class="chip chip-sm" data-s="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    ${askBar('', `Napisz do ${who === 'asia' ? 'Asi' : 'Maćka'}`)}`;
  dockEl.querySelectorAll('[data-s]').forEach((b) => { b.onclick = () => free(b.dataset.s); });
  dockEl.querySelector('form').onsubmit = (e) => { e.preventDefault(); const v = e.target.elements.t.value.trim(); if (v) free(v); };
}

function free(text) {
  const t = text.toLowerCase();
  me(text);
  if (/karta|karty|kartę|pobytu/.test(t) && !/obywatel/.test(t) && !S.cases.karta) return runFlow('karta', () => kartaIntake());
  if (/obywatel|papiery/.test(t) && !S.cases.obyw) return runFlow('obyw', () => obywIntake());
  return runFlow('free', async () => {
    const c = S.cases.obyw;
    if (/tłumacz|tlumacz|ile kosztuje|koszt/.test(t)) return answerUnknown();
    if (/adres|gdzie|telefon|numer|infolin/.test(t)) return answerAddress();
    if (/teraz|co mam|dalej|następ|nastep/.test(t) && c && c.status === 'active') return answerNow(c);
    await say(S.active ? C().who : 'maciek', 'W tym prototypie odpowiadam tylko na przygotowane pytania. Wybierz jedną z podpowiedzi poniżej.');
  });
}

// The honest failure moment (brief §4.10).
async function answerUnknown() {
  await say('maciek', `<p>Tego nie wiem z naszych źródeł. Ministerstwo pisze tylko, że koszt tłumaczenia zależy od stawki tłumacza. Nie zgaduję kwot.</p>
    <p>Oficjalna strona: ${link('uznanie', 'gov.pl, uznanie za obywatela polskiego')}. Numer infolinii jest na stronie Twojego urzędu wojewódzkiego; nie mam go w zweryfikowanych źródłach.</p>
    <p>Jeśli chcesz z kimś to omówić: ${link('aid')}.</p>`);
}
async function answerAddress() {
  await say('maciek', `<p>Adresu, godzin i numeru telefonu urzędu nie mam w zweryfikowanych źródłach, więc ich nie podam. Znajdziesz je na stronie urzędu wojewódzkiego.</p><p>Wiem z przewodnika tylko tyle: wniosek składasz do wojewody właściwego dla miejsca zamieszkania, osobiście albo pocztą.</p>${cite('uznanie')}`);
}
async function answerNow(c) {
  const l = currentLevel(c);
  await say('maciek', `<p>Teraz: <b>${esc(l.title)}</b>. ${esc(l.text)}.</p><p><button class="btn btn-quiet" data-act="focus" type="button">${icon('list-checks')} Pokaż, co teraz</button></p>`);
}

function onLogClick(e) {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const a = b.dataset.act;
  if (a === 'map') { S.active = 'obyw'; S.view = 'map'; go('case'); }
  if (a === 'focus') { S.active = 'obyw'; S.view = 'focus'; go('case'); }
  if (a === 'world') go('world');
}

/* ── Citizenship intake: route finding, live map, plan approval ────────────── */
function change(c, ids, text) {
  c.changed = new Set(ids);
  c.lastChange = text;
  refreshStrip(true);
}

async function obywIntake() {
  const c = S.cases.obyw = newObyw();
  if (!S.order.includes('obyw')) S.order.push('obyw');
  S.active = 'obyw'; S.building = 'obyw';
  change(c, ['rA', 'rB'], 'Na start dwie możliwe drogi. Sprawdzimy, która pasuje.');
  await say('maciek', 'Hej, jestem Maciek, asystent AI w Formalce. Nie jestem urzędnikiem ani prawnikiem. Pomogę Ci ogarnąć temat obywatelstwa.', 600);
  await say('maciek', 'Najpierw ustalmy drogę. Obywatelstwo polskie można dostać przez uznanie u wojewody albo przez nadanie przez Prezydenta. Pytam po kolei, a „Nie wiem” to też dobra odpowiedź.');

  // Q1: residence title. "Nie wiem" leads to a free-text answer that Maciek rephrases.
  let a = await ask({ q: 'Czy masz zezwolenie na pobyt stały, zezwolenie na pobyt rezydenta długoterminowego UE albo prawo stałego pobytu?',
    why: 'Uznanie przez wojewodę dotyczy osób z jednym z tych tytułów pobytowych.',
    options: [{ label: 'Tak', value: 'yes' }, { label: 'Nie', value: 'no' }] });
  if (a.value === 'unknown') {
    c.f.title = 'unknown';
    change(c, ['rA', 'rB'], 'Obie drogi zostają otwarte, dopóki tego nie ustalimy.');
    await say('maciek', 'Dobrze, zapytam inaczej. Jaki dokument pobytowy masz teraz i od kiedy? Napisz własnymi słowami, tak jak umiesz.');
    a = await resolveTitle(c);
  } else if (a.value === 'yes') {
    a = { value: 'yes', kind: 'zezwolenie na pobyt stały' };
  }
  if (a.value === 'no') {
    await say('maciek', 'Uznanie przez wojewodę dotyczy osób z pobytem stałym, zezwoleniem UE albo prawem stałego pobytu. Zostaje nadanie przez Prezydenta.');
    const x = await ask({ q: 'W tym prototypie pełną ścieżkę pokazujemy dla uznania. Przejść ją na przykładzie?', options: [{ label: 'Tak, pokaż przykład uznania', value: 'ok' }], dk: false });
    a = { value: 'yes', kind: x && 'zezwolenie na pobyt stały (przykład)' };
  }
  c.f.title = 'yes'; c.f.kind = a.kind || 'zezwolenie na pobyt stały'; c.f.since = a.since || c.f.since;
  change(c, ['route', 'rB', 'pay'], 'Droga: uznanie przez wojewodę. Nadanie przez Prezydenta odłożone, zostaje możliwe. Dodano opłatę: 1000 zł (przykład).');
  await say('maciek', 'Dzięki. To wskazuje na uznanie przez wojewodę. Zaznaczyłem to na mapie u góry.');

  // Q2: which group of the act.
  const g = await ask({ q: 'Która sytuacja jest najbliżej Twojej?', long: true,
    why: 'Ustawa wymienia kilka grup osób, które mogą zostać uznane za obywateli polskich. Każda ma inne warunki.',
    options: [
      { label: 'Mieszkam w Polsce na tym tytule nieprzerwanie od co najmniej 3 lat, mam stałe źródło dochodu i tytuł prawny do mieszkania', value: 'three_years' },
      { label: 'Od co najmniej 2 lat na tym tytule i od co najmniej 3 lat w małżeństwie z obywatelem polskim lub obywatelką polską', value: 'married' },
      { label: 'Pobyt stały dzięki polskiemu pochodzeniu albo Karcie Polaka, od co najmniej roku', value: 'polish_origin' },
      { label: 'Żadna z tych', value: 'none' },
    ] });
  c.f.group = g.value;
  if (g.value === 'three_years') {
    change(c, ['route'], 'Dodano warunki: 3 lata nieprzerwanego pobytu, stałe źródło dochodu, tytuł do mieszkania. Dochód i mieszkanie oznaczone do potwierdzenia.');
  } else if (g.value === 'none' || g.value === 'unknown') {
    await say('maciek', `Ustawa ma jeszcze inne grupy, na przykład osoby ze statusem uchodźcy albo po 10 latach legalnego pobytu. Pełna lista w oficjalnym brzmieniu: ${link('uznanie', 'gov.pl')}. Zaznaczam grupę jako niepotwierdzoną.`);
    change(c, ['route'], 'Grupa z ustawy: niepotwierdzona.');
  } else {
    change(c, ['route'], 'Dodano warunki Twojej grupy. Do potwierdzenia przy dokumentach.');
  }

  // Q3: Polish language.
  const l = await ask({ q: 'Masz urzędowe poświadczenie znajomości polskiego co najmniej B1 albo świadectwo szkoły w Polsce?',
    why: 'Ustawa wymaga potwierdzenia znajomości polskiego. Świadectwo szkoły policealnej się nie liczy.',
    options: [{ label: 'Tak', value: 'yes' }, { label: 'Nie', value: 'no' }] });
  c.f.lang = l.value;
  if (l.value === 'yes') change(c, ['docs'], 'Dokumenty: poświadczenie B1 masz, zaznaczone.');
  else if (l.value === 'no') change(c, ['b1lv', 'file'], 'Dodano poziom: poświadczenie B1. Złożenie wniosku czeka, aż je zdobędziesz.');
  else change(c, ['docs'], 'Poświadczenie B1: do sprawdzenia.');

  // Q4: office.
  const v = await ask({ q: 'W którym województwie mieszkasz?', why: 'Wniosek składasz do wojewody właściwego dla Twojego miejsca zamieszkania.',
    options: VOIV.map((x) => ({ label: x, value: x, small: true })) });
  if (v.value !== 'unknown') {
    c.f.voiv = v.value;
    change(c, ['file'], `Urząd: ${voivode(v.value)}.`);
    await say('maciek', `Twój wniosek przyjmuje ${voivode(v.value)}. Adresu i godzin urzędu nie mam w zweryfikowanych źródłach, więc ich nie podaję.`);
  } else {
    change(c, ['file'], 'Urząd: do ustalenia po województwie.');
  }

  await planApproval(c);
}

async function resolveTitle(c) {
  let tries = 0;
  for (;;) {
    const a = await ask({ text: true, prefill: tries === 0 ? 'mam kartę pobytu, pobyt stały od 2021' : '', placeholder: 'Na przykład: mam kartę pobytu, ...', options: [] });
    tries++;
    if (a.value === 'unknown') {
      const o = await ask({ q: 'Nic nie szkodzi. Który opis jest najbliżej?', options: [
        { label: 'Pobyt stały', value: 'yes' }, { label: 'Rezydent długoterminowy UE', value: 'eu' },
        { label: 'Pobyt czasowy albo wiza', value: 'no' }] });
      if (o.value === 'unknown') { await say('maciek', 'Zostawiam to jako niepotwierdzone. Na karcie pobytu jest napisane, jakie to zezwolenie. Na razie pokażę przykład drogi przez uznanie.'); return { value: 'yes', kind: 'zezwolenie na pobyt stały (do potwierdzenia)' }; }
      if (o.value === 'no') return { value: 'no' };
      return { value: 'yes', kind: o.value === 'eu' ? 'zezwolenie na pobyt rezydenta długoterminowego UE' : 'zezwolenie na pobyt stały' };
    }
    const t = a.text.toLowerCase();
    const year = (t.match(/(19|20)\d\d/) || [])[0] || null;
    let guess = null;
    if (/sta[łl]|rezydent|d[łl]ugoterm|\bue\b|unii/.test(t)) guess = 'yes';
    else if (/czasow|wiz|bezwiz/.test(t)) guess = 'no';
    if (guess === 'yes') {
      const kind = /rezydent|d[łl]ugoterm|\bue\b|unii/.test(t) ? 'zezwolenie na pobyt rezydenta długoterminowego UE' : 'zezwolenie na pobyt stały';
      const ok = await ask({ q: `Rozumiem to tak: masz ${kind}${year ? `, od ${year} roku` : ''}. Dobrze rozumiem?`,
        options: [{ label: 'Tak, dobrze', value: 'ok' }, { label: 'Nie, poprawię', value: 'fix' }], dk: false });
      if (ok.value === 'ok') { c.f.since = year; return { value: 'yes', kind, since: year }; }
      await say('maciek', 'Jasne. Napisz jeszcze raz, jaki to dokument.');
      continue;
    }
    if (guess === 'no') {
      const ok = await ask({ q: 'Rozumiem to tak: masz pobyt czasowy albo wizę. Dobrze rozumiem?',
        options: [{ label: 'Tak, dobrze', value: 'ok' }, { label: 'Nie, poprawię', value: 'fix' }], dk: false });
      if (ok.value === 'ok') return { value: 'no' };
      continue;
    }
    const o = await ask({ q: 'Nie jestem pewien, co to znaczy. Który opis jest najbliżej?', options: [
      { label: 'Pobyt stały', value: 'yes' }, { label: 'Rezydent długoterminowy UE', value: 'eu' },
      { label: 'Pobyt czasowy albo wiza', value: 'no' }] });
    if (o.value === 'no') return { value: 'no' };
    if (o.value !== 'unknown') return { value: 'yes', kind: o.value === 'eu' ? 'zezwolenie na pobyt rezydenta długoterminowego UE' : 'zezwolenie na pobyt stały', since: year };
  }
}

function openItems(c) {
  const items = [];
  if (c.f.group === 'three_years') items.push('Stałe i regularne źródło dochodu oraz tytuł prawny do mieszkania w Polsce.');
  else items.push('Do której grupy z ustawy należysz.');
  items.push('Przerwy w pobycie: żadna nie dłuższa niż 6 miesięcy, wszystkie razem do 10 miesięcy.');
  if (c.f.lang === 'unknown') items.push('Czy masz poświadczenie B1.');
  if (c.f.title === 'unknown') items.push('Rodzaj Twojego zezwolenia.');
  return items;
}

async function planApproval(c) {
  const open = openItems(c);
  const n = open.length;
  const word = n === 2 ? 'Dwie kwestie wymagają' : n === 3 ? 'Trzy kwestie wymagają' : `${n} kwestie wymagają`;
  await say('maciek', `Mam wystarczająco dużo informacji, żeby przygotować pierwszy plan. ${word} jeszcze potwierdzenia, zaznaczyłem je na mapie.`, 700);
  const r = RUN, fl = FLOW;
  await new Promise((res) => {
    dockEl.innerHTML = `<section class="plan" aria-labelledby="plan-h" style="display:flex;flex-direction:column;gap:var(--s4)">
      <h2 id="plan-h" class="dock-q" tabindex="-1">Twój pierwszy plan</h2>
      <ul class="list">
        <li class="row">${icon('check')}<span class="tx"><b>Droga: uznanie za obywatela polskiego przez wojewodę</b><span>${esc(c.f.kind)}${c.f.since ? `, od ${esc(c.f.since)}` : ''} (z Twojej odpowiedzi)${c.f.voiv ? `. Urząd: ${voivode(c.f.voiv)}` : ''}</span></span></li>
        <li class="row">${icon('warning-circle')}<span class="tx"><b>Do potwierdzenia (${n})</b><span>${open.map(esc).join('<br>')}</span></span></li>
        <li class="row">${icon('file-text')}<span class="tx"><b>${FEE} zł opłaty skarbowej, decyzja do 6 miesięcy</b><span>Przykład z przewodnika Formalki, stan na 15.10.2026. ${link('duty', 'Opłata')} · ${link('uznanie', 'termin')}</span></span></li>
      </ul>
      <div class="switch-row">
        <button type="button" class="switch" role="switch" aria-checked="false" id="consent" aria-labelledby="consent-l"></button>
        <span class="switch-label" id="consent-l"><b>Maciek może sam dodawać przypomnienia i wpisy w kalendarzu do tej sprawy</b>
        Każde działanie zobaczysz w historii sprawy i możesz je cofnąć. Najwyżej jedno powiadomienie dziennie, cisza nocna od 22:00 do 7:00.</span>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-primary btn-block" id="approve">Zatwierdzam plan</button>
        <button type="button" class="btn btn-text" id="planmap">${icon('map-trifold')} Zobacz mapę przed zatwierdzeniem</button>
        <button type="button" class="btn btn-text" id="redo">Popraw odpowiedzi</button>
      </div></section>`;
    dockEl.classList.remove('enter'); void dockEl.offsetWidth; dockEl.classList.add('enter');
    const sw = $('#consent', dockEl);
    sw.onclick = () => sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    $('#planmap', dockEl).onclick = () => openSheet('map');
    $('#redo', dockEl).onclick = () => {
      if (r !== RUN || fl !== FLOW) return;
      dockEl.innerHTML = ''; me('Popraw odpowiedzi');
      delete S.cases.obyw; S.order = S.order.filter((x) => x !== 'obyw');
      runFlow('obyw', async () => { await say('maciek', 'Dobrze, zacznijmy od nowa. W prototypie poprawianie oznacza nową rozmowę.'); await obywIntake(); });
    };
    $('#approve', dockEl).onclick = () => {
      if (r !== RUN || fl !== FLOW) return;
      c.consent = sw.getAttribute('aria-checked') === 'true';
      dockEl.innerHTML = '';
      me(c.consent ? 'Zatwierdzam plan. Maciek może sam dodawać przypomnienia.' : 'Zatwierdzam plan.');
      res();
    };
    scrollLog();
  });
  c.status = 'active'; S.building = null; c.changed = new Set();
  logAct(c, 'Plan zatwierdzony: uznanie przez wojewodę');
  if (c.consent) logAct(c, 'Zgoda: Maciek może sam dodawać przypomnienia i wpisy w kalendarzu do tej sprawy');
  refreshStrip();
  await say('maciek', 'Plan zatwierdzony, sprawa jest aktywna. Zaczynamy od dokumentów. Ja zostaję na dole ekranu, gdybyś chciał albo chciała coś dopytać.');
  await sleep(700);
  S.view = 'focus';
  go('case');
}

/* ── After the form: the calendar moment (brief §3.7, §4.8) ────────────────── */
async function callFlow(c) {
  c.pending = null; c.preview = '';
  await say('maciek', 'Wniosek, na razie szkic, jest w Teczce. Równolegle możesz umówić wizytę w urzędzie wojewódzkim.');
  await say('maciek', 'Nie mogę zarezerwować wizyty za Ciebie. Mogę dodać przypomnienie, żeby zadzwonić do urzędu i zapytać o termin.');
  const d1 = at(S.clock, 1, 12), d2 = at(S.clock, 2, 12);
  const d = await ask({ q: 'Na który dzień przypomnienie?', options: [
    { label: `Jutro, ${dday(d1)}`, value: 1 }, { label: dday(d2), value: 2 }, { label: 'Nie teraz', value: 0 }], dk: false });
  if (!d.value) {
    await say('maciek', 'Dobrze. Wizyta zostaje na mapie jako krok do zrobienia. Możesz wrócić do tego w każdej chwili.');
    return;
  }
  const hh = await ask({ q: 'O której?', options: [{ label: '9:00', value: 9 }, { label: '12:00', value: 12 }, { label: '15:00', value: 15 }], dk: false });
  const when = at(S.clock, d.value, hh.value);
  const ok = await ask({ q: `Dodać przypomnienie na ${DAYS[when.getDay()]} ${hm(when)}, żeby zadzwonić do urzędu?`,
    options: [{ label: 'Dodaj', value: 'yes' }, { label: 'Nie dodawaj', value: 'no' }], dk: false });
  if (ok.value !== 'yes') { await say('maciek', 'Nie dodaję. Krok zostaje na mapie.'); return; }
  c.p.call = when;
  logAct(c, `Przypomnienie: zadzwoń do urzędu, ${dday(when)}, ${hm(when)}`, 'you', { revocable: true, kind: 'call' });
  await say('maciek', `<p>Gotowe. Przypomnienie dodane. Wizyta nie jest jeszcze zarezerwowana.</p>
    <div class="event">${icon('calendar-plus')}<span><b>Zadzwoń do urzędu wojewódzkiego</b>${dday(when)}, ${hm(when)}<br><span class="meta">W prototypie to symulacja, nic nie trafia do kalendarza telefonu.</span></span></div>`);
  await say('maciek', `<p>Co przygotować na wizytę, według przewodnika:</p>
    <ul><li>wniosek o uznanie za obywatela polskiego (wzór jest na stronie ministerstwa, Twój szkic jest w Teczce),</li>
    <li>fotografie osób objętych wnioskiem,</li>
    <li>poświadczenie znajomości polskiego co najmniej B1 albo świadectwo szkoły w Polsce,</li>
    <li>tłumaczenia przysięgłe albo konsularne dokumentów w obcym języku, jeśli je dołączasz,</li>
    <li>opłata skarbowa ${FEE} zł; numer konta jest na stronie urzędu wojewódzkiego.</li></ul>
    <p>Pełną listę podaje Twój urząd wojewódzki. Sprawdź ją przed wizytą.</p>${cite('uznanie')}`, 800);
  await say('maciek', 'Numer telefonu urzędu jest na jego stronie. Nie podaję go, bo nie mam go w zweryfikowanych źródłach.');
  const v = await ask({ q: 'Gdy umówisz wizytę, wpisz mi jej termin. Rano tego dnia napiszę, co zabrać.',
    options: [{ label: 'Mam już termin', value: 'yes' }, { label: 'Później', value: 'later' }], dk: false });
  if (v.value !== 'yes') { await say('maciek', 'Jasne. Gdy zadzwoni przypomnienie, wrócimy do tego.'); toast('Tester: możesz teraz przewinąć czas o 3 dni.'); return; }
  await setVisit(c);
  toast('Tester: możesz teraz przewinąć czas o 3 dni.');
}

async function setVisit(c, sameDayOnly = false) {
  const day = sameDayOnly ? at(S.clock, 0, 9) : at(S.clock, 3, 9);
  const t = await ask({ q: `Wizyta ${dday(day)}. O której?`, why: sameDayOnly ? '' : 'W prototypie można wybrać tylko ten dzień, żeby przewijanie czasu o 3 dni do niego trafiło.',
    options: [{ label: '9:00', value: [9, 0] }, { label: '10:30', value: [10, 30] }, { label: '13:00', value: [13, 0] }], dk: false });
  c.p.visit = at(day, 0, t.value[0], t.value[1]);
  logAct(c, `Wizyta w urzędzie: ${dday(c.p.visit)}, ${hm(c.p.visit)} (termin od Ciebie)`);
  await say('maciek', `Wpisane: wizyta ${dday(c.p.visit)}, ${hm(c.p.visit)}. To termin od Ciebie, nie z systemu urzędu.`);
  const morning = at(c.p.visit, 0, 7, 30);
  if (c.consent) {
    c.p.morning = true;
    logAct(c, `Przypomnienie rano w dniu wizyty, ${hm(morning)}, z listą rzeczy`, 'maciek', { revocable: true, kind: 'morning' });
    await say('maciek', `Dodałem też przypomnienie na rano w dniu wizyty, ${hm(morning)}, z listą rzeczy. Masz włączoną moją pomoc z wyprzedzeniem; możesz to cofnąć w historii sprawy.`);
  } else {
    const m = await ask({ q: `Dodać przypomnienie na rano w dniu wizyty, ${hm(morning)}?`, options: [{ label: 'Dodaj', value: 'yes' }, { label: 'Nie', value: 'no' }], dk: false });
    if (m.value === 'yes') {
      c.p.morning = true;
      logAct(c, `Przypomnienie rano w dniu wizyty, ${hm(morning)}`, 'you', { revocable: true, kind: 'morning' });
      await say('maciek', 'Gotowe. Przypomnienie dodane.');
    }
  }
}

/* ── Time travel: Maciek writes first (brief §2.10, §4.9) ──────────────────── */
function travel() {
  const c = S.cases.obyw;
  if (!c || c.status !== 'active') { toast('Najpierw zatwierdź plan sprawy obywatelstwa.'); return; }
  closeLayer();
  const from = new Date(S.clock);
  S.clock = at(S.clock, 3, 7, 30);
  S.travels++;
  renderClock();
  const notes = [];
  const today = S.clock;
  if (c.p.call && c.p.call > from && c.p.call <= today && !revoked(c, 'call')) {
    notes.push({ past: true, time: `${DS[c.p.call.getDay()]} ${hm(c.p.call)}`, title: 'Zadzwoń do urzędu wojewódzkiego', flow: null });
  }
  const visitToday = sameDay(c.p.visit, today);
  if (S.travels === 1 && (visitToday || c.p.call)) {
    notes.push({ time: hm(today), title: visitToday ? 'Dziś wizyta w urzędzie. Sprawdź, co zabrać.' : 'Udało się umówić wizytę w urzędzie?', flow: 'visit' });
  } else if (c.p.filed && S.travels > 1) {
    // Nothing to do: Maciek stays quiet.
  } else if (S.travels > 1 && !c.p.filed) {
    notes.push({ time: hm(today), title: 'Masz dziś jedno zadanie w sprawie.', flow: 'now' });
  } else {
    notes.push({ time: hm(today), title: 'Minęły 3 dni. Wizyta w urzędzie wciąż do umówienia.', flow: 'visit' });
  }
  showLock(notes);
}
function revoked(c, kind) { return c.history.some((h) => h.kind === kind && h.revoked); }

function showLock(notes) {
  $('#toast').textContent = '';
  const layer = $('#layer');
  const draw = () => {
    layer.innerHTML = `<div class="lock" role="dialog" aria-modal="true" aria-label="Symulowany ekran blokady telefonu">
      <div class="lock-in">
        <p class="lock-date">${dlong(S.clock)}</p>
        <p class="lock-time">${hm(S.clock)}</p>
        <div class="notes">${notes.length ? notes.map((n, i) => `<button type="button" class="note${n.past ? ' past' : ''}" data-i="${i}">
          <span class="app">${mark()}</span>
          <span class="tx"><small><span>Formalka</span><span>${esc(n.time)}</span></small>
          ${S.lockTopic ? `<b>Wiadomość od Maciek · Obywatelstwo</b><span>${esc(n.title)}</span>` : `<b>Maciek: masz ${n.past ? 'jedno zadanie' : 'dziś jedno zadanie'}</b><span>Otwórz, żeby zobaczyć szczegóły.</span>`}</span>
        </button>`).join('') : '<p class="lock-empty">Brak powiadomień. Maciek pisze tylko wtedy, gdy jest coś do zrobienia.</p>'}</div>
        <p class="lock-meta">Temat sprawy na ekranie blokady: ${S.lockTopic ? 'widoczny' : 'ukryty (domyślnie)'}. <button type="button" id="lock-topic">${S.lockTopic ? 'Ukryj temat' : 'Pokaż temat'}</button><br>
        Najwyżej jedno powiadomienie dziennie w sprawie, cisza nocna od 22:00 do 7:00. Symulacja, telefon nic nie dostaje.</p>
        ${notes.length ? '' : '<button type="button" class="btn btn-quiet" id="lock-open">Otwórz aplikację</button>'}
      </div></div>`;
    $('#lock-topic', layer).onclick = () => { S.lockTopic = !S.lockTopic; draw(); $('#lock-topic', layer).focus(); };
    layer.querySelectorAll('.note').forEach((b) => { b.onclick = () => { const n = notes[+b.dataset.i]; openFromLock(n.flow || notes[notes.length - 1].flow); }; });
    const o = $('#lock-open', layer); if (o) o.onclick = () => { closeLayer(); go('case'); };
  };
  draw();
  ($('.note:last-child', layer) || $('#lock-open', layer))?.focus();
}

function openFromLock(flow) {
  closeLayer();
  S.active = 'obyw';
  go('chat');
  if (flow === 'visit') runFlow('visit', () => visitDay(S.cases.obyw));
  else if (flow === 'now') runFlow('now', () => answerNow(S.cases.obyw));
}

async function visitDay(c) {
  if (!sameDay(c.p.visit, S.clock)) {
    await say('maciek', `Dzień dobry. ${c.p.call ? `Przypomnienie o telefonie do urzędu było: ${dday(c.p.call)}, ${hm(c.p.call)}.` : 'Wizyta w urzędzie jest jeszcze do umówienia.'}`, 500);
    const a = await ask({ q: 'Udało się umówić wizytę?', options: [{ label: 'Tak, mam termin na dziś', value: 'today' }, { label: 'Jeszcze nie', value: 'no' }] });
    if (a.value !== 'today') {
      await say('maciek', 'Rozumiem. Wizyta zostaje na mapie jako krok do zrobienia.');
      await newCallReminder(c);
      return;
    }
    await setVisit(c, true);
  }
  const b1 = c.f.lang === 'yes' || c.p.b1;
  await say('maciek', `<p>Dzień dobry. Dziś o ${hm(c.p.visit)} masz wizytę w urzędzie wojewódzkim. Termin pochodzi od Ciebie.</p>
    <p>Weź, według przewodnika:</p>
    <ul><li>wniosek o uznanie za obywatela polskiego; Twój szkic jest w Teczce, wzór jest na stronie ministerstwa,</li>
    <li>fotografie osób objętych wnioskiem${c.p.photos ? ' (zaznaczone, że masz)' : ''},</li>
    <li>poświadczenie znajomości polskiego B1${b1 ? ' (masz)' : ' (jeszcze go nie masz)'},</li>
    <li>tłumaczenia dokumentów w obcym języku, jeśli je dołączasz.</li></ul>
    <p>Opłata skarbowa ${FEE} zł: ${c.p.paid ? 'oznaczona jako zapłacona.' : 'jeszcze nie oznaczona jako zapłacona. W przewodniku płacisz ją przed złożeniem wniosku; numer konta jest na stronie urzędu wojewódzkiego.'}</p>
    <p>Adres: nie mam go w zweryfikowanych źródłach. Sprawdź go na stronie urzędu wojewódzkiego.</p>${cite('uznanie')}`, 700);
  await say('maciek', 'Zapytam Cię po wizycie, jak poszło.');
  await ask({ options: [{ label: 'Przewiń do 14:00', value: 'go', tester: true }], dk: false });
  S.clock = at(S.clock, 0, 14); renderClock();
  sys('14:00 · bez powiadomienia, bo dziś było już jedno');
  const o = await ask({ q: 'Jak poszło w urzędzie?', options: [
    { label: 'Wniosek złożony', value: 'filed' },
    { label: 'Urząd prosi o uzupełnienie', value: 'returned' },
    { label: 'Nie udało się, wizyta przełożona', value: 'moved' }] });
  if (o.value === 'filed') return outcomeFiled(c);
  if (o.value === 'returned') return outcomeReturned(c);
  if (o.value === 'moved') return outcomeMoved(c);
  await say('maciek', 'Rozumiem. Jeśli dostałeś albo dostałaś jakieś pismo z urzędu, dodaj je do Teczki, żeby nie zgubić terminu. Mapa zostaje bez zmian, dopóki nie będzie jasne, co się stało.');
}

async function outcomeFiled(c) {
  c.p.filed = true; c.p.paid = true;
  c.p.decisionBy = addMonths(S.clock, 6);
  logAct(c, 'Wniosek oznaczony jako złożony (oznaczone przez Ciebie)');
  S.highlight = ['file', 'decision'];
  await say('maciek', `<p>Zapisane jako zrobione przez Ciebie. Teraz czekasz na urząd: wojewoda ma 6 miesięcy od wpływu wniosku, czyli do ${dfull(c.p.decisionBy)}. Termin może zostać wydłużony.</p>${cite('uznanie')}`);
  const p = await ask({ q: 'Masz potwierdzenie złożenia? Jeśli dodasz jego zdjęcie do Teczki, oznaczę ten poziom jako potwierdzony dokumentem.',
    options: [{ label: 'Dodaj zdjęcie (symulacja)', value: 'yes' }, { label: 'Później', value: 'no' }], dk: false });
  if (p.value === 'yes') {
    c.p.proof = true;
    c.teczka.unshift({ name: 'potwierdzenie-zlozenia.jpg', kind: 'Zdjęcie, symulacja', t: new Date(S.clock), icon: 'image' });
    logAct(c, 'Dodano potwierdzenie złożenia do Teczki');
    await say('maciek', 'Dodane. Poziom „Złóż wniosek” jest teraz potwierdzony dokumentem.');
  }
  if (c.consent) {
    logAct(c, `Przypomnienie: ${dfull(c.p.decisionBy)}, mija 6 miesięcy na decyzję`, 'maciek', { revocable: true, kind: 'decision' });
    await say('maciek', `Dodałem przypomnienie na ${dfull(c.p.decisionBy)}. Wtedy zapytam, czy przyszła decyzja. Do tego czasu nie będę pisać bez powodu.`);
  }
  await mapButton();
}
async function outcomeReturned(c) {
  const m = await ask({ q: 'Czego brakuje według urzędu?', options: [
    { label: 'Tłumaczenia dokumentu', value: 'tłumaczenie dokumentu' }, { label: 'Fotografii', value: 'fotografie' }, { label: 'Czegoś innego', value: 'brak wskazany przez urząd' }] });
  c.p.returned = m.value === 'unknown' ? 'brak wskazany przez urząd' : m.value;
  logAct(c, `Urząd prosi o uzupełnienie: ${c.p.returned}`);
  S.highlight = ['docs'];
  await say('maciek', 'Wracamy do poziomu „Zbierz dokumenty” i dopisuję tam brak. To poprawka, nie koniec sprawy: reszta planu zostaje. Jeśli urząd dał Ci pismo z terminem, dodaj je do Teczki, żeby termin nie zginął.');
  await mapButton();
}
async function outcomeMoved(c) {
  c.p.visit = null; c.p.morning = false;
  logAct(c, 'Wizyta przełożona, krok wraca do zrobienia');
  S.highlight = ['visit'];
  await say('maciek', 'Rozumiem, to się zdarza. Krok „Umów wizytę” wraca na mapę jako do zrobienia.');
  await newCallReminder(c);
  await mapButton();
}
async function newCallReminder(c) {
  const when = at(S.clock, 1, 12);
  const a = await ask({ q: `Dodać przypomnienie o telefonie do urzędu na jutro, ${hm(when)}?`, options: [{ label: 'Dodaj', value: 'yes' }, { label: 'Nie teraz', value: 'no' }], dk: false });
  if (a.value === 'yes') {
    c.p.call = when;
    logAct(c, `Przypomnienie: zadzwoń do urzędu, ${dday(when)}, ${hm(when)}`, 'you', { revocable: true, kind: 'call' });
    await say('maciek', 'Gotowe. Przypomnienie dodane. Wizyta nie jest jeszcze zarezerwowana.');
  }
}
async function mapButton() {
  await say('maciek', `<p>Zaktualizowałem mapę sprawy.</p><p><button class="btn btn-quiet" type="button" data-act="map">${icon('map-trifold')} Zobacz mapę</button></p>`, 300);
}

/* ── Second case: residence card with Asia (brief §4.11) ───────────────────── */
async function kartaIntake() {
  const k = S.cases.karta = newKarta();
  if (!S.order.includes('karta')) S.order.push('karta');
  S.active = 'karta'; S.building = 'karta';
  if (S.screen !== 'chat') go('chat');
  else rerenderChatHead();
  sys('Asia dołączyła do chatu');
  change(k, ['k1', 'k2', 'k3', 'k4'], 'Szkic sprawy. Poziomy niepotwierdzone.');
  const o = S.cases.obyw;
  await say('asia', `Cześć, jestem Asia, asystentka AI w Formalce. Zajmę się kartą pobytu.${o ? ' Maciek dalej prowadzi Twoje obywatelstwo.' : ''}`, 600);
  const w = await ask({ who: 'asia', q: 'Czyjej karty pobytu dotyczy sprawa?', options: [{ label: 'Mojej', value: 'Twojej karty' }, { label: 'Kogoś z mojej rodziny', value: 'karty kogoś z rodziny' }] });
  k.f.whose = w.value === 'unknown' ? 'do ustalenia' : w.value;
  change(k, ['k1'], `Rodzaj sprawy: ${k.f.whose}.`);
  if (o && o.f.voiv) {
    const r = await ask({ who: 'asia', q: `W sprawie „Obywatelstwo polskie” masz zapisane województwo ${o.f.voiv}. Mogę go użyć tutaj?`,
      why: 'Bez Twojej zgody sprawy nie dzielą się informacjami.',
      options: [{ label: 'Tak, użyj', value: 'yes' }, { label: 'Nie, podam osobno', value: 'no' }], dk: false });
    if (r.value === 'yes') {
      k.f.voiv = o.f.voiv;
      logAct(k, `Użyto informacji ze sprawy „Obywatelstwo polskie”: województwo ${o.f.voiv} (za Twoją zgodą)`);
      change(k, ['k3'], `Województwo ${o.f.voiv}, ze sprawy obywatelstwa, za Twoją zgodą.`);
    }
  }
  await say('asia', 'Tu muszę się zatrzymać. W tym prototypie nie ma zweryfikowanego przewodnika o karcie pobytu, więc nie podam dokumentów, opłat ani terminów. Na mapie zostawiam szkic; wszystkie kroki są niepotwierdzone.', 700);
  const add = await ask({ who: 'asia', q: 'Dodać sprawę do Twoich spraw jako szkic?', options: [{ label: 'Dodaj jako szkic', value: 'add' }, { label: 'Nie teraz', value: 'no' }], dk: false });
  S.building = null;
  if (add.value === 'add') {
    k.status = 'draft';
    logAct(k, 'Sprawa dodana jako szkic');
    await say('asia', 'Dodane. Obie sprawy są teraz w widoku „Twoje sprawy”.');
    await sleep(600);
    S.active = S.cases.obyw ? 'obyw' : 'karta';
    go('world');
  } else {
    delete S.cases.karta; S.order = S.order.filter((x) => x !== 'karta');
    S.active = S.cases.obyw ? 'obyw' : null;
    refreshStrip();
    await say('asia', 'Dobrze, nic nie zapisuję.');
  }
}

/* ── Screens ───────────────────────────────────────────────────────────────── */
const SCREENS = {
  splash() {
    const el = h(`<section class="screen splash" aria-label="Formalka">${mark('splash-mark')}
      <p class="splash-word">formalka</p><p class="splash-sub">Next · prototyp do testów</p></section>`);
    el.onclick = () => go('home');
    return el;
  },
  home() {
    const el = h(`<section class="screen home">
      <div class="brandrow">${mark()}<span class="word">formalka</span><span class="tag">prototyp, dane przykładowe</span></div>
      <div class="home-hero"><h1 class="home-q">Co dziś załatwiamy?</h1>
        <p class="home-lead">Napisz, co masz do załatwienia w urzędzie. Asystent AI ułoży plan i sam przypomni, co dalej.</p></div>
      <form class="ask" id="home-ask" autocomplete="off"><label class="sr" for="home-t">Co dziś załatwiamy?</label>
        <input id="home-t" name="t" placeholder="Na przykład: obywatelstwo, karta pobytu" enterkeyhint="send">
        <button class="send" type="submit" aria-label="Wyślij">${icon('arrow-up')}</button></form>
      <div class="examples"><p>Możesz dotknąć przykładu:</p><div class="opts">
        <button type="button" class="chip" data-ex="przyszedł czas, abym złożył papiery na obywatelstwo polskie">przyszedł czas, abym złożył papiery na obywatelstwo polskie</button>
        <button type="button" class="chip" data-ex="Ogarnij mi temat karty pobytu">Ogarnij mi temat karty pobytu</button></div></div>
      <p class="home-foot">Formalka to niezależna usługa, nie urząd. Asystenci to AI. W prototypie nic nie wychodzi z telefonu.</p></section>`);
    const input = $('#home-t', el);
    el.querySelectorAll('[data-ex]').forEach((b) => { b.onclick = () => { input.value = b.dataset.ex; input.focus(); }; });
    $('#home-ask', el).onsubmit = (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) { input.focus(); return; }
      const t = v.toLowerCase();
      if (/obywatel|papiery/.test(t)) { me(v); go('chat'); runFlow('obyw', () => obywIntake()); }
      else if (/karta|karty|kartę|pobyt/.test(t)) { me(v); go('chat'); runFlow('karta', () => kartaIntake()); }
      else toast('W prototypie są dwie sprawy: obywatelstwo i karta pobytu. Dotknij przykładu.');
    };
    return el;
  },
  chat() {
    const el = h(`<section class="screen chat"><header class="chat-head"></header><div class="strip-slot"></div></section>`);
    el.append(logEl, dockEl);
    fillChatHead($('.chat-head', el));
    renderStrip($('.strip-slot', el));
    const c = S.active && C();
    if (c && c.pending && !S.flow) { const p = c.pending; runFlow(p, () => callFlow(c)); }
    else if (!S.flow && !dockEl.childElementCount) idleDock();
    scrollLog();
    return el;
  },
  case() {
    const c = C();
    const el = h(`<section class="screen case">
      <header class="case-head">
        <div class="case-bar">
          <button type="button" class="back" id="to-world">${icon('arrow-left')} Twoje sprawy</button><span class="sp"></span>
          <button type="button" class="icon-btn" id="o-teczka" aria-label="Teczka, ${c.teczka.length} dokumentów">${icon('folder-simple')}${c.teczka.length ? `<span class="badge" aria-hidden="true">${c.teczka.length}</span>` : ''}</button>
          <button type="button" class="icon-btn" id="o-hist" aria-label="Historia sprawy">${icon('clock-counter-clockwise')}</button>
        </div>
        <div><h1 class="case-title">${esc(c.title)}</h1>
        <p class="case-sub">${avatar(c.who, true)} Prowadzi ${WHO[c.who].name}, ${WHO[c.who].role}</p></div>
        <div class="seg" role="group" aria-label="Widok sprawy">
          <button type="button" data-v="focus" aria-pressed="${S.view === 'focus'}">${icon('list-checks')} Teraz</button>
          <button type="button" data-v="map" aria-pressed="${S.view === 'map'}">${icon('map-trifold')} Mapa</button>
        </div>
      </header>
      <div class="case-body" id="case-body"></div>
      <div class="mbar-wrap"><button type="button" class="mbar" id="mbar">${avatar(c.who)}<span class="tx"><b>Napisz do ${c.who === 'asia' ? 'Asi' : 'Maćka'}</b>
        <span class="${c.preview ? 'unread' : ''}">${c.preview ? esc(c.preview) : `${WHO[c.who].role}, odpowiada od razu`}</span></span>${c.preview ? '<span class="dot" aria-hidden="true"></span><span class="sr">Nowa wiadomość</span>' : ''}</button></div>
    </section>`);
    $('#to-world', el).onclick = () => go('world');
    $('#o-teczka', el).onclick = () => openSheet('teczka');
    $('#o-hist', el).onclick = () => openSheet('hist');
    $('#mbar', el).onclick = () => go('chat');
    el.querySelectorAll('[data-v]').forEach((b) => { b.onclick = () => { S.view = b.dataset.v; drawCase(); }; });
    requestAnimationFrame(() => drawCase());
    return el;
  },
  world() {
    const el = h(`<section class="screen world">
      <div class="world-head"><div class="brandrow">${mark()}<span class="word">formalka</span></div>
        <h1>Twoje sprawy</h1><p class="meta">Wszystko, co prowadzą Twoi asystenci AI. Sprawy są tylko na tym telefonie.</p></div>
      <div class="case-body"><ul class="cases">${S.order.map((id) => caseRow(S.cases[id])).join('')}</ul></div>
      <div class="mbar-wrap"><form class="ask ask-sm" id="world-ask" autocomplete="off"><label class="sr" for="world-t">Co jeszcze załatwiamy?</label>
        <input id="world-t" name="t" placeholder="Co jeszcze załatwiamy?" enterkeyhint="send"><button class="send" type="submit" aria-label="Wyślij">${icon('arrow-up')}</button></form></div>
    </section>`);
    el.querySelectorAll('[data-case]').forEach((b) => { b.onclick = () => { S.active = b.dataset.case; S.view = 'focus'; go('case'); }; });
    $('#world-ask', el).onsubmit = (e) => {
      e.preventDefault();
      const v = e.target.elements.t.value.trim();
      if (!v) return;
      go('chat'); free(v);
    };
    return el;
  },
};

function caseRow(c) {
  const L = levels(c);
  const cur = c.status === 'active' ? currentLevel(c) : null;
  const next = c.status === 'draft' ? 'Szkic: czeka na zweryfikowany przewodnik' : c.status === 'building' ? 'Tworzymy plan' : `Teraz: ${cur.title}. ${cur.text}`;
  const mini = L.filter((l) => !l.par).map((l) => mk(l.state)).join('<i></i>');
  return `<li><button type="button" class="case-row" data-case="${c.id}">
    <span class="top">${avatar(c.who)}<span class="tx"><b>${esc(c.title)}</b><span>${WHO[c.who].name}, ${WHO[c.who].role}${c.status === 'draft' ? ' · szkic' : ''}</span></span></span>
    <span class="mini" aria-hidden="true">${mini}</span>
    <span class="next">${esc(next)}</span></button></li>`;
}

function fillChatHead(head) {
  const ids = S.order.length ? S.order.map((id) => S.cases[id].who) : ['maciek'];
  const both = ids.includes('maciek') && ids.includes('asia');
  const canBack = S.order.some((id) => S.cases[id].status !== 'building');
  head.innerHTML = `${canBack ? `<button type="button" class="icon-btn" id="chat-back" aria-label="Wróć do sprawy">${icon('arrow-left')}</button>` : ''}
    <span class="avatars">${[...new Set(ids)].map((w) => avatar(w)).join('')}</span>
    <span class="who"><b>${both ? 'Maciek i Asia' : WHO[ids[0]].name}</b><span>${both ? 'asystenci AI, nie urzędnicy' : `${WHO[ids[0]].role}, nie urzędnik`}</span></span>`;
  const b = $('#chat-back', head);
  if (b) b.onclick = () => {
    const c = S.active && C();
    if (c && c.status === 'active') { S.view = 'focus'; go('case'); } else go('world');
  };
}
function rerenderChatHead() { const hd = $('.chat-head'); if (hd) fillChatHead(hd); }

function renderStrip(slot, flash = false) {
  if (!slot) return;
  const c = S.building && S.cases[S.building];
  if (!c) { slot.innerHTML = ''; return; }
  const L = levels(c);
  slot.innerHTML = `<div class="strip" aria-label="Mapa sprawy na żywo">
    <div class="strip-top"><p class="strip-title">Tworzymy Twoją sprawę: ${esc(c.title)}<span>Kroki z przerywaną linią są niepotwierdzone</span></p>
      <button type="button" class="btn btn-text" id="strip-map">${icon('map-trifold')} Mapa</button></div>
    <ol class="route-h">${L.map((l) => `<li class="${l.par ? 'par' : ''} ${l.state === 'pruned' ? 'pruned' : ''}">${mk(l.state, c.changed.has(l.id) ? 'changed' : '')}<span>${esc(l.short)}</span><span class="sr">${esc(l.title)}: ${STATE[l.state]}</span></li>`).join('')}</ol>
    <p class="strip-change${flash ? ' flash' : ''}" aria-live="polite">${esc(c.lastChange)}</p></div>`;
  $('#strip-map', slot).onclick = () => openSheet('map');
}
function refreshStrip(flash = false) { renderStrip($('.strip-slot'), flash); rerenderChatHead(); }

/* Case body: Focus or Map */
function drawCase() {
  const body = $('#case-body');
  if (!body) return;
  const c = C();
  document.querySelectorAll('.seg [data-v]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === S.view)));
  body.innerHTML = S.view === 'map' ? mapView(c) : focusView(c);
  wireCase(body, c);
  if (S.highlight) {
    const first = body.querySelector('.lv.highlight');
    if (first) first.scrollIntoView({ block: 'center', behavior: RM.matches ? 'auto' : 'smooth' });
    S.highlight = null;
  }
}

function taskRow(c, t, primary) {
  if (t.id === 'form') {
    return `<li><button type="button" class="task${t.done ? ' is-done' : ''}" data-task="form"><span class="tick">${icon('check')}</span>
      <span class="tx"><span>${esc(t.label)}</span><small>${esc(t.sub)}</small></span>${t.done ? icon('folder-simple', 'go') : `<span class="btn ${primary ? 'btn-primary' : 'btn-quiet'}" style="min-height:36px;padding-inline:var(--s3)">Wypełnij</span>`}</button></li>`;
  }
  if (t.id === 'trans' && !t.done) {
    return `<li><div class="task" style="flex-wrap:wrap"><span class="tick">${icon('check')}</span><span class="tx"><span>${esc(t.label)}</span><small>${esc(t.sub)}</small></span></div>
      <div class="task-actions" style="margin-top:var(--s2)"><button type="button" class="chip chip-sm" data-trans="na">Nie dołączam obcych dokumentów</button><button type="button" class="chip chip-sm" data-trans="done">Mam tłumaczenia</button></div></li>`;
  }
  const fixed = t.id === 'b1' && c.f.lang === 'yes';
  return `<li><button type="button" class="task${t.done ? ' is-done' : ''}" data-task="${t.id}" aria-pressed="${!!t.done}" ${fixed ? 'disabled' : ''}><span class="tick">${icon('check')}</span>
    <span class="tx"><span>${esc(t.label)}</span><small>${esc(t.sub)}</small></span></button></li>`;
}

function focusView(c) {
  if (c.id === 'karta') {
    return `<section class="now"><p class="kicker">Szkic</p><h2>Czeka na zweryfikowany przewodnik</h2>
      <p>W tym prototypie nie ma przewodnika o karcie pobytu, więc Asia nie podaje dokumentów, opłat ani terminów. Kroki na mapie są niepotwierdzone.</p></section>
      ${c.f.voiv ? `<p class="meta">Województwo ${esc(c.f.voiv)} pochodzi ze sprawy obywatelstwa, za Twoją zgodą.</p>` : ''}`;
  }
  const L = levels(c);
  const cur = currentLevel(c);
  let main = '';
  if (cur.id === 'docs') {
    const firstOpen = cur.tasks.find((t) => !t.done);
    main = `<ul class="tasks">${cur.tasks.map((t) => taskRow(c, t, firstOpen && firstOpen.id === t.id && t.id === 'form')).join('')}</ul>
      <p class="meta">Pełną listę podaje Twój urząd wojewódzki.</p>${cite('uznanie')}`;
  } else if (cur.id === 'pay') {
    main = `<div class="fee"><b>${FEE} zł</b><span>opłata skarbowa za decyzję o uznaniu</span></div>
      <p>Numer konta jest na stronie urzędu wojewódzkiego. Zapłać przed złożeniem wniosku.</p>
      <button type="button" class="btn btn-primary btn-block" id="paid">Oznacz jako zapłacone</button>${cite('duty')}`;
  } else if (cur.id === 'file') {
    main = `<p>Osobiście albo pocztą, do wojewody właściwego dla Twojego miejsca zamieszkania.${c.p.visit ? ` Twoja wizyta: ${dday(c.p.visit)}, ${hm(c.p.visit)}.` : ''}</p>
      <p class="meta">Po wizycie Maciek zapyta, jak poszło.</p>${cite('uznanie')}`;
  } else if (cur.id === 'decision') {
    main = `<p>${esc(cur.text)}.</p><p class="meta">To nie zależy od Ciebie. Maciek nie będzie pisać bez powodu.</p>${cite('uznanie')}`;
  }
  const par = L.filter((l) => l.par && !['rB'].includes(l.id));
  const side = par.map((l) => {
    if (l.id === 'visit') {
      const callSet = c.p.call && !revoked(c, 'call');
      return `<div class="side-card"><p class="state-line">${mk(l.state)} ${esc(STATE[l.state])}</p><h3>${esc(l.title)}</h3>
        <p class="note-user">Twój krok praktyczny, nie wymóg z przewodnika.</p>
        ${c.p.visit ? `<div class="event">${icon('calendar-check')}<span><b>Wizyta w urzędzie wojewódzkim</b>${dday(c.p.visit)}, ${hm(c.p.visit)} · termin od Ciebie</span></div>`
          : callSet ? `<div class="event">${icon('bell-simple')}<span><b>Przypomnienie: zadzwoń do urzędu</b>${dday(c.p.call)}, ${hm(c.p.call)}<br><span class="meta">Wizyta nie jest jeszcze zarezerwowana.</span></span></div>`
          : `<button type="button" class="btn btn-quiet" id="plan-call">${icon('bell-simple')} Ustaw przypomnienie z Maćkiem</button>`}
      </div>`;
    }
    return `<div class="side-card"><p class="state-line">${mk(l.state)} ${esc(STATE[l.state])}</p><h3>${esc(l.title)}</h3><p class="note-user">${esc(l.text)}</p></div>`;
  }).join('');
  const open = openItems(c);
  return `<section class="now" aria-labelledby="now-h"><p class="kicker">Co teraz</p><h2 id="now-h">${esc(cur.title)}</h2>
      <p class="state-line">${mk(cur.state, 'here')} ${esc(STATE[cur.state])}${cur.state === 'returned' ? '' : ''}</p>${main}</section>
    ${side ? `<section class="side" aria-label="Równolegle"><p class="kicker">Równolegle</p>${side}</section>` : ''}
    <section class="open"><h3>Do potwierdzenia</h3><ul>${open.map((t) => `<li>${mk('unconfirmed')}<span>${esc(t)}</span></li>`).join('')}</ul>
      ${cite('foreigners')}</section>
    <button type="button" class="btn btn-text" data-v2="map">${icon('map-trifold')} Zobacz całą mapę sprawy</button>`;
}

function mapView(c, readOnly = false) {
  const L = levels(c);
  const hl = S.highlight || [];
  return `<p class="meta">Wszystko zależy od sprawy. Kłódka pokazuje, co trzeba zrobić wcześniej; to kolejność z przewodnika. Dotknij poziomu, żeby zobaczyć szczegóły.</p>
    <ol class="map" aria-label="Mapa sprawy jako lista poziomów">${L.map((l) => `<li class="lv${l.par ? ' par' : ''}${l.state === 'pruned' ? ' pruned' : ''}${hl.includes(l.id) ? ' highlight' : ''}">
      ${mk(l.state, c.status === 'active' && currentLevel(c).id === l.id ? 'here' : '')}
      <div><button type="button" class="lv-head" aria-expanded="false" data-lv="${l.id}">
        <span class="t">${esc(l.title)}${icon('caret-down')}</span>
        <span class="s">${esc(STATE[l.state])}${l.par && l.state !== 'pruned' ? ' · równolegle' : ''}. ${esc(l.text)}</span></button>
      </div>
      <div class="lv-detail" hidden>${l.state === 'locked' ? `<p class="reason">${icon('lock-simple')}<span>${esc(l.reason)}</span></p>` : ''}${l.userStep ? '<p class="note-user">Twój krok praktyczny, nie wymóg z przewodnika.</p>' : ''}${l.detail || ''}</div>
    </li>`).join('')}</ol>
    <ul class="legend" aria-label="Legenda stanów">
      ${['unconfirmed', 'available', 'locked', 'parallel', 'waiting', 'returned', 'done', 'confirmed'].map((s) => `<li>${mk(s)}<span>${STATE[s].replace(', możesz zacząć teraz', '')}</span></li>`).join('')}
    </ul>`;
}

function wireCase(root, c) {
  root.querySelectorAll('.lv-head').forEach((b) => {
    b.onclick = () => {
      const d = b.closest('.lv').querySelector('.lv-detail');
      const open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', String(!open));
      d.hidden = open;
    };
  });
  root.querySelectorAll('[data-v2]').forEach((b) => { b.onclick = () => { S.view = b.dataset.v2; drawCase(); $('#case-body').scrollTop = 0; }; });
  root.querySelectorAll('[data-task]').forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.task;
      if (id === 'form') { if (!c.p.form) openForm(c); else openSheet('teczka'); return; }
      if (id === 'fix') { c.p.returned = null; logAct(c, 'Brak uzupełniony (oznaczone przez Ciebie)'); }
      if (id === 'photos') { c.p.photos = !c.p.photos; if (c.p.photos) logAct(c, 'Fotografie: masz'); }
      if (id === 'b1') { c.p.b1 = !c.p.b1; }
      afterProgress(c);
    };
  });
  root.querySelectorAll('[data-trans]').forEach((b) => { b.onclick = () => { c.p.trans = b.dataset.trans; logAct(c, b.dataset.trans === 'na' ? 'Tłumaczenia: nie dołączasz obcych dokumentów' : 'Tłumaczenia: masz'); afterProgress(c); }; });
  const paid = $('#paid', root);
  if (paid) paid.onclick = () => { c.p.paid = true; logAct(c, `Opłata skarbowa ${FEE} zł oznaczona jako zapłacona`); toast('Oznaczone jako zapłacone. Złożenie wniosku jest odblokowane.'); afterProgress(c); };
  const pc = $('#plan-call', root);
  if (pc) pc.onclick = () => { c.pending = 'call'; go('chat'); };
}

function afterProgress(c) {
  const before = c._docs;
  c._docs = docsDone(c);
  if (!before && c._docs) toast('Dokumenty zebrane. Odblokowane: opłata skarbowa.');
  drawCase();
}

/* ── Form mock → Teczka (brief §4.7) ───────────────────────────────────────── */
function openForm(c) {
  const layer = $('#layer');
  layer.innerHTML = `<div class="full" role="dialog" aria-modal="true" aria-labelledby="form-h"><div class="full-in">
    <div class="case-bar"><button type="button" class="back" id="form-close">${icon('x')} Zamknij</button></div>
    <h1 class="form-title" id="form-h">Wniosek o uznanie za obywatela polskiego</h1>
    <p class="mock-note">${icon('info')}<span><b>Makieta, nie oficjalny formularz.</b> Wzór wniosku jest na stronie ministerstwa (${link('uznanie', 'gov.pl')}). Wypełnianie prawdziwych PDF sprawdzamy osobno. Wpisuj dane przykładowe.</span></p>
    <form id="mock-form" novalidate style="display:flex;flex-direction:column;gap:var(--s4)">
      <section class="form-sec"><h2>Dane osoby</h2>
        <div class="field"><label for="f-name">Imię</label><input id="f-name" name="name" autocomplete="off"><span class="err" hidden>Wpisz imię.</span></div>
        <div class="field"><label for="f-sur">Nazwisko</label><input id="f-sur" name="sur" autocomplete="off"><span class="err" hidden>Wpisz nazwisko.</span></div>
        <div class="field"><label for="f-birth">Data urodzenia</label><input id="f-birth" name="birth" inputmode="numeric" placeholder="dd.mm.rrrr" autocomplete="off"></div>
        <div class="field"><label for="f-cit">Obecne obywatelstwo</label><input id="f-cit" name="cit" autocomplete="off"></div>
      </section>
      <section class="form-sec"><h2>Pobyt w Polsce</h2>
        <div class="field"><label for="f-title">Podstawa pobytu</label><input id="f-title" name="title" value="${esc(c.f.kind || '')}${c.f.since ? `, od ${esc(c.f.since)}` : ''}"><span class="from">Z Twoich odpowiedzi dla Maćka. Możesz poprawić.</span></div>
        <div class="field"><label for="f-voiv">Województwo</label><input id="f-voiv" name="voiv" value="${esc(c.f.voiv || '')}"><span class="from">Z Twoich odpowiedzi dla Maćka.</span></div>
      </section>
      <div class="form-actions">
        <button type="button" class="btn btn-quiet" id="form-sample">Wypełnij przykładowymi danymi</button>
        <button type="submit" class="btn btn-primary">Zapisz PDF do Teczki</button>
        <p class="meta">Teczka jest tylko na tym telefonie. W prototypie znika po resecie.</p>
      </div>
    </form></div></div>`;
  $('#form-close', layer).onclick = closeLayer;
  $('#form-sample', layer).onclick = () => {
    const f = $('#mock-form', layer).elements;
    f.name.value = 'Alex'; f.sur.value = 'Przykładowy'; f.birth.value = '01.01.1990'; f.cit.value = 'przykładowe państwo';
  };
  $('#mock-form', layer).onsubmit = (e) => {
    e.preventDefault();
    const f = e.target.elements;
    let bad = null;
    ['name', 'sur'].forEach((n) => { const err = f[n].parentElement.querySelector('.err'); const miss = !f[n].value.trim(); err.hidden = !miss; f[n].setAttribute('aria-invalid', String(miss)); if (miss && !bad) bad = f[n]; });
    if (bad) { bad.focus(); return; }
    c.p.form = true;
    c.teczka.unshift({ name: 'wniosek-uznanie-szkic.pdf', kind: 'Szkic z makiety, nie oficjalny wniosek', t: new Date(S.clock), icon: 'file-text',
      fields: [['Imię i nazwisko', `${f.name.value} ${f.sur.value}`], ['Podstawa pobytu', f.title.value], ['Województwo', f.voiv.value]] });
    logAct(c, 'Szkic wniosku zapisany w Teczce');
    c.pending = 'call';
    c.preview = 'Maciek: Wniosek jest w Teczce. Ustawić przypomnienie o telefonie do urzędu?';
    closeLayer();
    toast('Zapisano w Teczce: wniosek-uznanie-szkic.pdf');
    afterProgress(c);
    go('case');
  };
  $('#f-name', layer).focus();
}

/* ── Sheets: map preview, Teczka, history ──────────────────────────────────── */
function openSheet(kind) {
  const c = C();
  const layer = $('#layer');
  let title = '', body = '';
  if (kind === 'map') { title = `Mapa: ${c.title}`; body = mapView(c, true); }
  if (kind === 'teczka') {
    title = 'Teczka';
    body = `<p class="meta">Dokumenty tej sprawy. Są tylko na tym telefonie.</p>${c.teczka.length ? `<ul class="list">${c.teczka.map((d) => `<li class="row">${icon(d.icon)}<span class="tx"><b>${esc(d.name)}</b><span>${esc(d.kind)} · ${dshort(d.t)}</span>${d.fields ? d.fields.map(([k, v]) => `<span class="meta">${esc(k)}: ${esc(v)}</span>`).join('') : ''}</span></li>`).join('')}</ul>` : '<p>Teczka jest pusta. Wypełniony wniosek trafi tutaj.</p>'}`;
  }
  if (kind === 'hist') {
    title = 'Historia sprawy';
    body = `<div class="switch-row"><button type="button" class="switch" role="switch" aria-checked="${c.consent}" id="h-consent" aria-labelledby="h-consent-l"></button>
      <span class="switch-label" id="h-consent-l"><b>Pomoc z wyprzedzeniem</b>${WHO[c.who].name} ${c.consent ? 'może sam dodawać przypomnienia i wpisy w kalendarzu do tej sprawy.' : 'pyta przed każdym przypomnieniem.'}</span></div>
      <ul class="list">${c.history.map((e, i) => `<li class="row${e.revoked ? ' revoked' : ''}">${icon(e.by === 'you' ? 'check' : 'bell-simple')}<span class="tx"><b>${esc(e.text)}</b><span class="meta">${e.by === 'you' ? 'Ty' : `${WHO[c.who].name}, sam, bo masz włączoną pomoc z wyprzedzeniem`} · ${dshort(e.t)} ${hm(e.t)}${e.revoked ? ' · cofnięte' : ''}</span></span>${e.revocable && !e.revoked ? `<button type="button" class="btn btn-quiet" data-undo="${i}">Cofnij</button>` : ''}</li>`).join('')}</ul>`;
  }
  layer.innerHTML = `<div class="overlay" id="ov"><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sh-h">
    <div class="sheet-head"><h2 id="sh-h">${esc(title)}</h2><button type="button" class="icon-btn" id="sh-x" aria-label="Zamknij">${icon('x')}</button></div>
    <div class="sheet-body" style="display:flex;flex-direction:column;gap:var(--s4)">${body}</div></div></div>`;
  $('#sh-x', layer).onclick = closeLayer;
  $('#ov', layer).onclick = (e) => { if (e.target.id === 'ov') closeLayer(); };
  wireCase(layer, c);
  const sw = $('#h-consent', layer);
  if (sw) sw.onclick = () => { c.consent = !c.consent; logAct(c, c.consent ? 'Pomoc z wyprzedzeniem włączona' : 'Pomoc z wyprzedzeniem wyłączona'); openSheet('hist'); $('#h-consent').focus(); };
  layer.querySelectorAll('[data-undo]').forEach((b) => {
    b.onclick = () => {
      const e = c.history[+b.dataset.undo];
      e.revoked = true;
      if (e.kind === 'morning') c.p.morning = false;
      if (e.kind === 'call') c.p.call = null;
      toast('Cofnięte. Przypomnienie usunięte (symulacja).');
      openSheet('hist');
    };
  });
  $('#sh-x', layer).focus();
}
function closeLayer() { $('#layer').innerHTML = ''; }

/* ── Shell ─────────────────────────────────────────────────────────────────── */
function render() {
  const stage = $('#stage');
  stage.innerHTML = '';
  stage.append(SCREENS[S.screen]());
  renderClock();
}
function go(screen) {
  const swap = () => { S.screen = screen; render(); };
  if (document.startViewTransition && !RM.matches) {
    try { document.startViewTransition(swap); return; } catch (e) { /* fall through */ }
  }
  swap();
}
function renderClock() {
  $('#clock').innerHTML = `<b>Tester</b> · ${dshort(S.clock)}, ${hm(S.clock)}`;
  const fwd = $('#t-forward');
  const ready = S.cases.obyw && S.cases.obyw.status === 'active';
  fwd.setAttribute('aria-disabled', String(!ready));
}
let toastTimer;
function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.remove('enter'); void t.offsetWidth; t.classList.add('enter');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.textContent = ''; }, 3600);
}

function reset() {
  RUN++; FLOW++;
  S = fresh();
  newChat();
  closeLayer();
  $('#toast').textContent = '';
  render();
  setTimeout(() => { if (S.screen === 'splash') go('home'); }, RM.matches ? 700 : 1500);
}

$('#t-forward').innerHTML = `${icon('fast-forward')} Przewiń o 3 dni`;
$('#t-forward').setAttribute('aria-label', 'Przewiń czas o 3 dni');
$('#t-forward').onclick = travel;
$('#t-reset').innerHTML = icon('arrow-counter-clockwise');
$('#t-reset').onclick = reset;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#layer').firstElementChild && !$('.lock')) closeLayer(); });
document.documentElement.lang = 'pl';
reset();
