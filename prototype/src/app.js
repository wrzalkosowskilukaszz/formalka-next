'use strict';
/*
 * Formalka Next: experience prototype (brief 15), v2 "native app" (owner feedback 2026-10-16).
 * Everything is scripted and in memory. No network, no AI, no storage. Facts come from
 * reference/citizenship (snapshot formalka@04057ef), shown as labelled examples with sources.
 */
const ICONS = /*__ICONS__*/ {};

/* ── Helpers ───────────────────────────────────────────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = (n, cls = '') => `<span class="icon ${cls}" aria-hidden="true">${ICONS[n] || ''}</span>`;
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const tickSvg = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" pathLength="1"/></svg>';

// RUN changes on reset; FLOW when a new scripted flow starts. Stale timers and answers never
// resolve, so an abandoned flow simply stops.
let RUN = 0;
let FLOW = 0;
const sleep = (ms) => {
  const r = RUN, f = FLOW;
  return new Promise((res) => setTimeout(() => { if (r === RUN && f === FLOW) res(); }, RM.matches ? Math.min(ms, 160) : ms));
};
const later = (ms, fn) => { const r = RUN; setTimeout(() => { if (r === RUN) fn(); }, RM.matches ? 0 : ms); };

const DAYS = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const DS = ['nd', 'pon', 'wt', 'śr', 'czw', 'pt', 'sob'];
const MON = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
const MON_N = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
const MON_S = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
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
const FEE = 1000; // procedure-recognition.yaml, fees.decision (stamp duty act)

const VOIV = ['dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie', 'łódzkie', 'małopolskie', 'mazowieckie', 'opolskie', 'podkarpackie', 'podlaskie', 'pomorskie', 'śląskie', 'świętokrzyskie', 'warmińsko-mazurskie', 'wielkopolskie', 'zachodniopomorskie'];
const voivode = (v) => 'wojewoda ' + v.replace(/kie$/, 'ki');

const WHO = {
  maciek: { name: 'Maciek', gen: 'Maćka', letter: 'M', role: 'asystent AI', cls: 'av-m' },
  asia: { name: 'Asia', gen: 'Asi', letter: 'A', role: 'asystentka AI', cls: 'av-a' },
};
const avatar = (w, size = '', ai = false) => `<span class="avatar ${WHO[w].cls} ${size}" aria-hidden="true">${WHO[w].letter}${ai ? '<span class="ai">AI</span>' : ''}</span>`;

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
  return { screen: 'splash', clock: new Date(START), cases: {}, order: [], active: null, view: 'focus', mapList: false,
    building: null, flow: null, lockTopic: false, highlight: null, travels: 0, calSel: null, calMonth: null };
}
function newObyw() {
  return {
    id: 'obyw', title: 'Obywatelstwo polskie', icon: 'seal-check', who: 'maciek', status: 'building', consent: false, progress: 0,
    f: { title: null, since: null, kind: null, group: null, lang: null, voiv: null },
    p: { form: false, photos: false, b1: false, trans: 'unknown', call: null, visit: null, morning: false, paid: false, filed: false, proof: false, returned: null, decisionBy: null },
    pending: null, preview: '', teczka: [], history: [], changed: new Set(), lastChange: '',
  };
}
function newKarta() {
  return { id: 'karta', title: 'Karta pobytu', icon: 'identification-card', who: 'asia', status: 'building', consent: false, progress: 0,
    f: { whose: null, voiv: null }, p: {}, pending: null, preview: '', teczka: [], history: [], changed: new Set(), lastChange: '' };
}
const C = () => S.cases[S.active];
const logAct = (c, text, by = 'you', extra = {}) => c.history.unshift({ t: new Date(S.clock), text, by, ...extra });
const revoked = (c, kind) => c.history.some((x) => x.kind === kind && x.revoked);

/* ── Levels (Milestones) computed from facts and progress ──────────────────── */
const STATE = {
  unconfirmed: 'Niepotwierdzone', available: 'Do zrobienia teraz', parallel: 'Równolegle', locked: 'Zablokowane',
  waiting: 'Czeka na urząd', returned: 'Urząd prosi o uzupełnienie', done: 'Załatwione przez Ciebie',
  confirmed: 'Potwierdzone dokumentem', pruned: 'Odłożone',
};
const ST_ICON = { locked: 'lock-simple', waiting: 'hourglass-simple', returned: 'arrow-u-up-left', done: 'check', confirmed: 'checks', pruned: 'x', unconfirmed: 'question', parallel: 'arrows-split' };
const chip = (state, text) => `<span class="state-chip ${state}">${ST_ICON[state] ? icon(ST_ICON[state]) : ''}${esc(text || STATE[state])}</span>`;

function levels(c) { return c.id === 'obyw' ? lvObyw(c) : lvKarta(c); }
function docsDone(c) { const { f, p } = c; return p.form && p.photos && (f.lang === 'yes' || p.b1) && p.trans !== 'unknown' && !p.returned; }

function lvObyw(c) {
  const { f, p } = c;
  const b = c.status === 'building';
  const U = (s) => (b ? 'unconfirmed' : s);
  const L = [];
  if (f.title !== 'yes') {
    L.push({ id: 'rA', ic: 'signpost', short: 'Uznanie', title: 'Droga: uznanie przez wojewodę', state: 'unconfirmed', text: 'Możliwa droga, jeszcze nie wiemy, czy pasuje',
      detail: '<p>Dla osób z zezwoleniem na pobyt stały, zezwoleniem na pobyt rezydenta długoterminowego UE albo prawem stałego pobytu.</p>' + cite('uznanie') });
    L.push({ id: 'rB', ic: 'scroll', short: 'Nadanie', par: true, title: 'Droga: nadanie przez Prezydenta', state: 'unconfirmed', text: 'Możliwa droga, jeszcze nie wiemy, czy pasuje',
      detail: '<p>Prezydent RP nie jest związany żadnymi terminami. Od postanowienia nie można się odwołać.</p>' + cite('nadanie') });
  } else {
    L.push({ id: 'route', ic: 'signpost', short: 'Droga', title: 'Uznanie przez wojewodę', state: b ? 'unconfirmed' : 'done',
      text: b ? 'Pasuje do Twoich odpowiedzi' : 'Droga ustalona z Tobą',
      detail: `<p>Masz ${esc(f.kind || 'zezwolenie na pobyt stały')}${f.since ? ` od ${esc(f.since)} roku` : ''} (z Twojej odpowiedzi).${f.voiv ? ` Wniosek przyjmuje ${voivode(f.voiv)}.` : ''}</p>` + cite('uznanie') });
    L.push({ id: 'rB', ic: 'scroll', short: 'Nadanie', par: true, title: 'Nadanie przez Prezydenta', state: 'pruned', text: 'Odłożone, zostaje możliwe',
      detail: '<p>Masz pobyt stały, więc najpierw sprawdzamy uznanie przez wojewodę. Przy nadaniu Prezydent nie jest związany terminami, a od postanowienia nie można się odwołać.</p>' + cite('nadanie') });
  }
  const known = f.title === 'yes';
  const docTasks = [
    { id: 'form', label: 'Wniosek o uznanie za obywatela polskiego', sub: p.form ? 'Szkic jest w Teczce' : 'Wypełnisz go tutaj, na makiecie', done: p.form },
    { id: 'photos', label: 'Fotografie osób objętych wnioskiem', sub: 'Zdjęcia każdej osoby, której dotyczy wniosek', done: p.photos },
    { id: 'b1', label: 'Poświadczenie znajomości polskiego B1', sub: f.lang === 'yes' ? 'Masz (z Twojej odpowiedzi)' : 'Albo świadectwo szkoły w Polsce; szkoła policealna się nie liczy', done: f.lang === 'yes' || p.b1 },
    { id: 'trans', label: 'Tłumaczenia dokumentów w obcym języku', sub: p.trans === 'na' ? 'Nie dołączasz obcych dokumentów' : p.trans === 'done' ? 'Masz tłumaczenia' : 'Tylko jeśli je dołączasz: przysięgłe albo konsularne', done: p.trans !== 'unknown' },
  ];
  if (p.returned) docTasks.unshift({ id: 'fix', label: `Uzupełnij: ${p.returned}`, sub: 'Urząd poprosił o uzupełnienie', done: false });
  const allDocs = docsDone(c);
  L.push({ id: 'docs', ic: 'files', short: 'Dokumenty', title: 'Zbierz dokumenty', tasks: docTasks,
    state: U(p.returned ? 'returned' : allDocs ? 'done' : 'available'),
    text: p.returned ? 'Wracamy tu: urząd prosi o uzupełnienie. To poprawka, nie koniec sprawy' : allDocs ? 'Wszystko zaznaczone' : known ? `${docTasks.filter((t) => t.done).length} z ${docTasks.length} gotowe` : 'Lista zależy od drogi',
    detail: known ? `<ul class="open-list">${docTasks.map((t) => `<li>${t.done ? icon('check-circle-fill') : icon('file-text')}<span>${esc(t.label)}</span></li>`).join('')}</ul><p class="meta">Szczegóły podaje właściwy dla Ciebie urząd wojewódzki.</p>${cite('uznanie')}` : '<p>Lista zależy od drogi, którą ustalimy.</p>' });
  if (f.lang === 'no') {
    L.push({ id: 'b1lv', ic: 'student', short: 'B1', par: true, title: 'Zdobądź poświadczenie B1', state: U(p.b1 ? 'done' : 'parallel'), text: 'Potrzebne przed złożeniem wniosku',
      detail: '<p>Ustawa wymaga urzędowego poświadczenia znajomości polskiego co najmniej na poziomie B1 albo świadectwa szkoły w Polsce.</p>' + cite('act') });
  }
  L.push({ id: 'visit', ic: 'phone', short: 'Wizyta', par: true, userStep: true, title: 'Umów wizytę w urzędzie',
    state: U(p.visit ? 'done' : 'parallel'), text: p.visit ? `Termin od Ciebie: ${dshort(p.visit)}, ${hm(p.visit)}` : 'Twój krok praktyczny, równolegle',
    detail: `<p>To nie jest wymóg z przewodnika, tylko praktyczny krok. Przewodnik mówi: wniosek możesz złożyć osobiście albo wysłać pocztą do wojewody właściwego dla miejsca zamieszkania.</p>${cite('uznanie')}` });
  const payState = p.paid ? 'done' : allDocs ? 'available' : 'locked';
  L.push({ id: 'pay', ic: 'coins', short: 'Opłata', title: 'Zapłać opłatę skarbową', state: U(payState),
    reason: 'Najpierw zbierz dokumenty. Taka kolejność jest w przewodniku.',
    text: p.paid ? 'Oznaczone jako zapłacone' : payState === 'locked' && !b ? 'Najpierw zbierz dokumenty' : known ? `${FEE} zł, przykład z przewodnika` : 'Kwota zależy od drogi',
    detail: known ? `<div class="fee"><b>${FEE} zł</b><span>opłata skarbowa za decyzję o uznaniu</span></div><p>Numer konta jest na stronie urzędu wojewódzkiego.</p>${cite('duty')}` : '<p>Kwota zależy od drogi.</p>' });
  const b1ok = f.lang !== 'no' || p.b1;
  const fileState = p.proof ? 'confirmed' : p.filed ? 'done' : p.paid && b1ok ? 'available' : 'locked';
  L.push({ id: 'file', ic: 'stamp', short: 'Wniosek', title: 'Złóż wniosek u wojewody', state: U(fileState),
    reason: !b1ok ? 'Najpierw potrzebujesz poświadczenia B1.' : 'Najpierw zapłać opłatę skarbową.',
    text: p.proof ? 'Potwierdzenie złożenia w Teczce' : p.filed ? 'Oznaczone przez Ciebie' : fileState === 'locked' && !b ? (!b1ok ? 'Najpierw poświadczenie B1' : 'Najpierw opłata skarbowa') : 'Osobiście albo pocztą',
    detail: `<p>Osobiście albo pocztą, do wojewody właściwego dla Twojego miejsca zamieszkania${f.voiv ? ` (${voivode(f.voiv)})` : ''}.</p>${cite('uznanie')}` });
  L.push({ id: 'decision', ic: 'seal-check', short: 'Decyzja', title: 'Decyzja wojewody', state: U('waiting'),
    text: p.filed ? `Do ${dfull(p.decisionBy)}, termin może być wydłużony` : 'Zależy od urzędu, zaczyna się po złożeniu',
    detail: '<p>Wojewoda ma 6 miesięcy na wydanie decyzji. W uzasadnionych przypadkach termin może zostać wydłużony. Jeśli nie zgadzasz się z decyzją, odwołanie do MSWiA składasz na piśmie w ciągu 14 dni od jej otrzymania.</p>' + cite('uznanie') });
  return L;
}

function lvKarta(c) {
  const sketch = '<p>Szkic. W tym prototypie nie ma zweryfikowanego przewodnika o karcie pobytu, więc nie podajemy dokumentów, opłat ani terminów.</p>';
  return [
    { id: 'k1', ic: 'question', short: 'Rodzaj', title: 'Ustal rodzaj zezwolenia', state: c.f.whose ? 'available' : 'unconfirmed', text: c.f.whose ? `Dotyczy: ${c.f.whose}` : 'Pierwsze pytanie', detail: sketch },
    { id: 'k2', ic: 'files', short: 'Dokumenty', title: 'Dokumenty', state: 'unconfirmed', text: 'Czeka na przewodnik', detail: sketch },
    { id: 'k3', ic: 'stamp', short: 'Wniosek', title: 'Wniosek', state: 'unconfirmed', text: c.f.voiv ? `Województwo ${c.f.voiv}, za Twoją zgodą` : 'Czeka na przewodnik', detail: sketch },
    { id: 'k4', ic: 'seal-check', short: 'Decyzja', title: 'Decyzja', state: 'unconfirmed', text: 'Czeka na przewodnik', detail: sketch },
  ];
}

function currentLevel(c) {
  const main = levels(c).filter((l) => !l.par && l.id !== 'route');
  return main.find((l) => ['returned', 'available'].includes(l.state)) || main.find((l) => l.state === 'waiting') || main[0];
}
function stepOf(c) {
  const main = levels(c).filter((l) => !l.par);
  const cur = currentLevel(c);
  return [main.findIndex((l) => l.id === cur.id) + 1, main.length];
}

/* ── Events (calendar) ─────────────────────────────────────────────────────── */
function events() {
  const E = [];
  for (const id of S.order) {
    const c = S.cases[id];
    if (!c.p) continue;
    if (c.p.call && !revoked(c, 'call')) E.push({ d: c.p.call, title: 'Zadzwoń do urzędu wojewódzkiego', sub: 'Przypomnienie. Wizyta nie jest zarezerwowana', ic: 'phone', c });
    if (c.p.visit) E.push({ d: c.p.visit, title: 'Wizyta w urzędzie wojewódzkim', sub: 'Termin od Ciebie', ic: 'buildings', c, visit: true });
    if (c.p.visit && c.p.morning && !revoked(c, 'morning')) E.push({ d: at(c.p.visit, 0, 7, 30), title: 'Co zabrać na wizytę', sub: `Przypomnienie od ${WHO[c.who].gen}`, ic: 'bell', c });
    if (c.p.decisionBy && !revoked(c, 'decision')) E.push({ d: c.p.decisionBy, title: 'Mija 6 miesięcy na decyzję', sub: `Przypomnienie od ${WHO[c.who].gen}`, ic: 'seal-check', c });
  }
  return E.sort((a, b) => a.d - b.d);
}

/* ── Chat log and dock ─────────────────────────────────────────────────────── */
function newChat() {
  logEl = h('<div class="log pad" role="log" aria-live="polite" aria-label="Rozmowa"></div>');
  dockEl = h('<div class="dock" aria-label="Pytanie i odpowiedź"></div>');
  lastSpeaker = null;
  logEl.addEventListener('click', onLogClick);
}
function scrollLog() { requestAnimationFrame(() => { logEl.scrollTo({ top: logEl.scrollHeight, behavior: RM.matches ? 'auto' : 'smooth' }); }); }
const nameRow = (who) => `<div class="msg-name">${avatar(who, 'sm')}<span>${WHO[who].name} · ${WHO[who].role}</span></div>`;

function addMsg(kind, html, who) {
  if (kind === 'bot' && lastSpeaker !== who) logEl.append(h(nameRow(who)));
  if (kind === 'sys') logEl.append(h(`<p class="sys plain enter">${html}</p>`));
  else if (kind === 'join') logEl.append(h(`<p class="sys enter">${avatar(who, 'sm')}${html}</p>`));
  else logEl.append(h(`<div class="msg ${kind} enter">${html}<span class="time">${hm(S.clock)}</span></div>`));
  lastSpeaker = kind === 'bot' ? who : kind;
  scrollLog();
}
async function say(who, html, wait = 480) {
  if (lastSpeaker !== who) logEl.append(h(nameRow(who)));
  lastSpeaker = who;
  const t = h(`<div class="typing" role="status"><span class="sr">${WHO[who].name} odpowiada</span><i></i><i></i><i></i></div>`);
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
function optHTML(o, i, long) {
  const cls = ['chip', long && !o.dk ? 'chip-card' : '', o.dk ? 'chip-dk' : '', o.tester ? 'chip-t' : '', o.small ? 'chip-sm' : '', o.day ? 'chip-day' : '', o.time ? 'chip-time' : ''].join(' ');
  const inner = o.day ? `<small>${esc(o.day[0])}</small><b>${esc(o.day[1])}</b><small>${esc(o.day[2])}</small>`
    : long && !o.dk ? `${icon(o.ic || 'caret-right')}<span>${esc(o.label)}</span>` : esc(o.label);
  return `<button type="button" class="${cls}" data-i="${i}" style="animation-delay:${i * 45}ms" ${o.day ? `aria-label="${esc(o.label)}"` : ''}>${inner}</button>`;
}

// One question at a time in the dock; answering sends question and answer up into the log.
function ask({ who = 'maciek', q, why, options = [], text = false, prefill = '', placeholder, dk = true, long = false, prog = null }) {
  const r = RUN, f = FLOW;
  const opts = [...options];
  if (dk) opts.push({ label: 'Nie wiem', value: 'unknown', dk: true });
  return new Promise((res) => {
    dockEl.innerHTML = `${prog != null ? `<p class="dock-step">${icon('map-trifold')}<span>Plan sprawy</span><span class="bar"><i style="width:${Math.round(prog * 100)}%"></i></span></p>` : ''}
      ${q ? `<p class="dock-q" id="dq" tabindex="-1">${q}</p>` : ''}${why ? `<p class="dock-why">${why}</p>` : ''}
      <div class="opts${long ? ' cards' : ''}" role="group" ${q ? 'aria-labelledby="dq"' : 'aria-label="Odpowiedzi"'}>${opts.map((o, i) => optHTML(o, i, long)).join('')}</div>
      ${text ? askBar(prefill, placeholder) : ''}`;
    dockEl.classList.remove('enter'); void dockEl.offsetWidth; dockEl.classList.add('enter');
    const done = (value, label, extra = {}) => {
      if (r !== RUN || f !== FLOW) return;
      if (q) addMsg('bot', q, who);
      if (!extra.silent) me(label);
      dockEl.innerHTML = '';
      res({ value, label, ...extra });
    };
    $$('.chip', dockEl).forEach((b) => { b.onclick = () => { const o = opts[+b.dataset.i]; b.classList.add('picked'); later(140, () => done(o.value, o.label, { silent: !!o.tester })); }; });
    const form = $('form', dockEl);
    if (form) form.onsubmit = (e) => { e.preventDefault(); const v = form.elements.t.value.trim(); if (v) done('text', v, { text: v }); };
    const dq = $('#dq', dockEl);
    if (dq && document.activeElement && document.activeElement !== document.body) dq.focus({ preventScroll: true });
    scrollLog();
  });
}

// A structured approval card (Muse): accept or reject, never a free-form chat answer.
function approve({ who = 'maciek', kicker = 'Do zatwierdzenia', ic = 'calendar-plus', title, sub, note, yes = 'Dodaj', no = 'Nie teraz' }) {
  const r = RUN, f = FLOW;
  return new Promise((res) => {
    dockEl.innerHTML = `<section class="approval" aria-labelledby="ap-t">
      <span class="ap-k">${icon('check-circle')}${esc(kicker)}</span>
      <div class="ap-body"><span class="tile-ic">${icon(ic)}</span><span class="tx"><b id="ap-t" tabindex="-1">${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</span></div>
      ${note ? `<p class="ap-note">${note}</p>` : ''}
      <div class="ap-act"><button type="button" class="btn btn-quiet" data-a="no">${esc(no)}</button><button type="button" class="btn btn-accent" data-a="yes">${esc(yes)}</button></div></section>`;
    dockEl.classList.remove('enter'); void dockEl.offsetWidth; dockEl.classList.add('enter');
    $$('[data-a]', dockEl).forEach((b) => { b.onclick = () => {
      if (r !== RUN || f !== FLOW) return;
      const ok = b.dataset.a === 'yes';
      addMsg('bot', `<div class="event"><span class="ev-ic">${icon(ic)}</span><span><b>${esc(title)}</b><span>${esc(sub || '')}</span></span></div>`, who);
      me(ok ? yes : no);
      dockEl.innerHTML = '';
      res(ok);
    }; });
    const t = $('#ap-t', dockEl);
    if (document.activeElement && document.activeElement !== document.body) t.focus({ preventScroll: true });
    scrollLog();
  });
}

function runFlow(name, fn) {
  const id = ++FLOW, r = RUN;
  S.flow = name;
  return fn().then(() => { if (id === FLOW && r === RUN) { S.flow = null; idleDock(); } });
}

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
  dockEl.innerHTML = `<div class="opts" aria-label="Podpowiedzi">${suggestions().map((t, i) => `<button type="button" class="chip chip-sm" style="animation-delay:${i * 45}ms" data-s="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    ${askBar('', `Napisz do ${WHO[who].gen}`)}`;
  $$('[data-s]', dockEl).forEach((b) => { b.onclick = () => free(b.dataset.s); });
  $('form', dockEl).onsubmit = (e) => { e.preventDefault(); const v = e.target.elements.t.value.trim(); if (v) free(v); };
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
  await say('maciek', `<p>Teraz: <b>${esc(l.title)}</b>. ${esc(l.text)}.</p><p><button class="btn btn-quiet btn-sm" data-act="focus" type="button">${icon('list-checks')} Pokaż, co teraz</button></p>`);
}
function onLogClick(e) {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  S.active = 'obyw';
  S.view = b.dataset.act === 'map' ? 'map' : 'focus';
  go('case', 'fwd');
}

/* ── World builder: the case grows on screen while Maciek asks ─────────────── */
let builderEl = null;
const BN = new Map();
const BN_STATE = new Map();
function makeBuilder(c) {
  BN.clear(); BN_STATE.clear();
  builderEl = h(`<section class="builder" aria-label="Twoja sprawa buduje się na żywo">
    <div class="b-top"><span class="glass-ic">${icon(c.icon)}</span><span class="tx"><small>Tworzymy Twoją sprawę</small><b>${esc(c.title)}</b></span>
      <span class="ring" role="img" aria-label="Plan gotowy w 0%"><svg viewBox="0 0 46 46"><circle class="bg" cx="23" cy="23" r="19" fill="none" stroke-width="5"/><circle class="fg" cx="23" cy="23" r="19" fill="none" stroke-width="5" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg><span>0%</span></span></div>
    <div class="b-stage"><div class="b-canvas"><svg aria-hidden="true"></svg></div></div>
    <p class="b-cap" aria-live="polite"></p></section>`);
}
function smooth(pts) {
  if (!pts.length) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  return d;
}
function smoothV(pts) {
  if (!pts.length) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const my = (y0 + y1) / 2;
    d += ` C${x0},${my} ${x1},${my} ${x1},${y1}`;
  }
  return d;
}
function updateBuilder(c, animate = true) {
  if (!builderEl || !builderEl.isConnected) return;
  const L = levels(c);
  const stage = $('.b-stage', builderEl), canvas = $('.b-canvas', builderEl), svg = $('svg', canvas);
  const colW = 76, padX = 46;
  const width = Math.max(stage.clientWidth, padX * 2 + (L.length - 1) * colW);
  canvas.style.width = `${width}px`;
  const pos = new Map();
  let mainI = 0;
  L.forEach((l, i) => {
    const x = padX + i * colW;
    const y = l.par ? 72 : (mainI++ % 2 ? 34 : 50);
    pos.set(l.id, [x, y]);
  });
  // The main road is solid; side roads are dashed from the last main node before them.
  const main = L.filter((l) => !l.par).map((l) => pos.get(l.id));
  let branches = '';
  let anchor = null;
  L.forEach((l) => { if (!l.par) anchor = pos.get(l.id); else if (anchor) branches += `<path class="b-line dash" d="${smooth([anchor, pos.get(l.id)])}"/>`; });
  svg.innerHTML = `${branches}<path class="b-line${animate ? ' draw' : ''}" pathLength="1" d="${smooth(main)}"/>`;
  let newCount = 0;
  const seen = new Set();
  L.forEach((l) => {
    seen.add(l.id);
    let el = BN.get(l.id);
    const [x, y] = pos.get(l.id);
    const tag = l.state === 'unconfirmed' ? '?' : ST_ICON[l.state] && l.state !== 'parallel' ? icon(ST_ICON[l.state]) : '';
    const html = `<span class="disc">${icon(l.ic)}${tag ? `<span class="tag">${tag}</span>` : ''}</span><label>${esc(l.short)}</label><span class="sr">${esc(l.title)}: ${STATE[l.state]}</span>`;
    const isNew = !el;
    if (isNew) {
      el = h('<div class="bn"></div>');
      el.style.transform = `translate(${x}px, ${y + 30}px)`;
      canvas.append(el);
      BN.set(l.id, el);
    }
    const prev = BN_STATE.get(l.id);
    el.innerHTML = html;
    el.className = `bn ${l.state}`;
    if (animate && isNew) { el.classList.add('is-new'); el.style.animationDelay = `${newCount++ * 110}ms`; }
    if (animate && c.changed.has(l.id) && !isNew) el.classList.add('is-changed');
    if (animate && prev && prev !== 'pruned' && l.state === 'pruned') el.classList.add('is-pruned-now');
    BN_STATE.set(l.id, l.state);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transform = `translate(${x}px, ${y}px)`; }));
    later(1400, () => el.classList.remove('is-new', 'is-changed', 'is-pruned-now'));
  });
  for (const [id, el] of BN) if (!seen.has(id)) { el.remove(); BN.delete(id); }
  const pct = Math.round(c.progress * 100);
  $('.ring .fg', builderEl).style.strokeDashoffset = String(1 - c.progress);
  $('.ring span', builderEl).textContent = `${pct}%`;
  $('.ring', builderEl).setAttribute('aria-label', `Plan gotowy w ${pct}%`);
  const cap = $('.b-cap', builderEl);
  const capHtml = `${icon('map-trifold')}<span>${esc(c.lastChange)}</span>`;
  if (cap.dataset.t !== c.lastChange) { cap.dataset.t = c.lastChange; cap.innerHTML = capHtml; if (animate) { cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap'); } }
  const first = L.find((l) => c.changed.has(l.id));
  if (first) { const [x] = pos.get(first.id); stage.scrollTo({ left: Math.max(0, x - stage.clientWidth / 2), behavior: RM.matches ? 'auto' : 'smooth' }); }
}

function change(c, ids, text, progress) {
  c.changed = new Set(ids);
  c.lastChange = text;
  if (progress != null) c.progress = progress;
  updateBuilder(c, true);
}

/* ── Path map: Milestones as game levels ───────────────────────────────────── */
function pathMap(c) {
  const L = levels(c);
  const cur = c.status === 'active' ? currentLevel(c).id : null;
  const hl = S.highlight || [];
  const XM = [44, 58, 44, 58], XP = 118;
  let y = 46, mi = 0;
  const P = L.map((l) => {
    const p = l.par ? { x: XP, y: y - 4 } : { x: XM[mi++ % XM.length], y };
    y += l.par ? 90 : 108;
    return p;
  });
  const H = y - 30;
  const mainPts = L.map((l, i) => [l, P[i]]).filter(([l]) => !l.par).map(([, p]) => [p.x, p.y]);
  let branches = '', anchor = null;
  L.forEach((l, i) => { if (!l.par) anchor = [P[i].x, P[i].y]; else if (anchor) branches += `<path class="p-branch" d="M${anchor[0]},${anchor[1]} C${anchor[0]},${P[i].y} ${P[i].x - 40},${P[i].y} ${P[i].x},${P[i].y}"/>`; });
  const nodes = L.map((l, i) => {
    const here = cur === l.id;
    const st = ST_ICON[l.state] && !['parallel', 'unconfirmed'].includes(l.state) ? `<span class="st">${icon(ST_ICON[l.state])}</span>` : '';
    return `<li><button type="button" class="pn ${l.state}${l.par ? ' par' : ''}${here ? ' here' : ''}${hl.includes(l.id) ? ' highlight' : ''}" data-lv="${l.id}"
        style="left:${P[i].x}px;top:${P[i].y - (l.par ? 21 : 26)}px;width:calc(100% - ${P[i].x}px);animation-delay:${i * 90}ms"
        aria-label="${esc(l.title)}. ${STATE[l.state]}. ${esc(l.text)}">
      <span class="disc">${icon(l.ic)}${st}${here ? `<span class="who">${avatar(c.who, 'sm')}</span>` : ''}</span>
      <span class="lab"><b>${esc(l.title)}</b>${chip(l.state, l.par && l.state === 'parallel' ? (l.userStep ? 'Równolegle, Twój krok' : 'Równolegle') : null)}<span>${esc(l.text)}</span></span>
    </button></li>`;
  }).join('');
  return `<div class="pmap" style="height:${H}px">
      <svg height="${H}" aria-hidden="true"><path class="p-spine-bg" d="${smoothV(mainPts)}"/>${branches}<path class="p-spine draw" pathLength="1" d="${smoothV(mainPts)}"/></svg>
      <ol aria-label="Mapa sprawy, poziomy po kolei">${nodes}</ol></div>`;
}
function listMap(c) {
  return `<ol class="list" aria-label="Mapa sprawy jako lista">${levels(c).map((l) => `<li><button type="button" class="lrow${l.par ? ' par' : ''}" data-lv="${l.id}">
    <span class="tile-ic">${icon(l.ic)}</span><span class="tx"><b>${esc(l.title)}</b>${chip(l.state)}<span>${esc(l.text)}</span></span>${icon('caret-right')}</button></li>`).join('')}</ol>`;
}
const legend = () => `<ul class="legend" aria-label="Legenda stanów">${['available', 'parallel', 'locked', 'waiting', 'unconfirmed', 'returned', 'done', 'confirmed'].map((s) => `<li>${chip(s)}</li>`).join('')}</ul>`;

/* ── Shell: navigation, tabs, layers ───────────────────────────────────────── */
const TABS = [
  { id: 'world', label: 'Start', ic: 'house', on: 'house-fill' },
  { id: 'calendar', label: 'Kalendarz', ic: 'calendar-dots', on: 'calendar-dots-fill' },
  { id: 'chat', label: 'Czat', ic: 'chat-circle-dots', on: 'chat-circle-dots-fill' },
  { id: 'teczka', label: 'Teczka', ic: 'folder-simple', on: 'folder-simple-fill' },
];
const TAB_OF = { world: 'world', case: 'world', calendar: 'calendar', teczka: 'teczka' };
function renderTabs() {
  const nav = $('#tabbar');
  const show = TAB_OF[S.screen] && S.order.some((id) => S.cases[id].status !== 'building');
  $('#app').classList.toggle('has-tabs', !!show);
  if (!show) { nav.innerHTML = ''; return; }
  const cur = TAB_OF[S.screen];
  const unread = S.order.some((id) => S.cases[id].preview);
  nav.innerHTML = `<div class="tabs">${TABS.map((t) => `<button type="button" class="tab" data-tab="${t.id}" ${t.id === cur ? 'aria-current="page"' : ''} aria-label="${t.label}">
    ${icon(t.id === cur ? t.on : t.ic)}<span class="lbl">${t.label}</span>${t.id === 'chat' && unread ? '<span class="dot-badge"></span>' : ''}</button>`).join('')}</div>`;
  $$('.tab', nav).forEach((b) => { b.onclick = () => {
    const t = b.dataset.tab;
    if (t === 'chat') { go('chat', 'fwd'); return; }
    if (S.screen === t) return;
    go(t, 'tab');
  }; });
}

function render() {
  const stage = $('#stage');
  stage.innerHTML = '';
  stage.append(SCREENS[S.screen]());
  renderTabs();
  renderClock();
}
function go(screen, dir = 'tab') {
  const swap = () => { S.screen = screen; render(); };
  document.documentElement.dataset.nav = dir;
  if (document.startViewTransition && !RM.matches) {
    try { document.startViewTransition(swap); return; } catch (e) { /* fall through */ }
  }
  swap();
}
function renderClock() {
  const txt = `${dshort(S.clock)}, ${hm(S.clock)}`;
  $('#clock').innerHTML = `<b>Tester</b> · ${txt}`;
  $('#tp-clock').textContent = txt;
  $('#sb-time').textContent = hm(S.clock);
  const ready = S.cases.obyw && S.cases.obyw.status === 'active';
  ['#t-forward', '#tp-forward'].forEach((s) => $(s).setAttribute('aria-disabled', String(!ready)));
}
let toastTimer;
function toast(text, ic = 'check-circle-fill') {
  const t = $('#toast');
  t.innerHTML = `${icon(ic)}<span>${esc(text)}</span>`;
  t.classList.remove('enter'); void t.offsetWidth; t.classList.add('enter');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.innerHTML = ''; }, 3400);
}
function closeLayer() {
  const l = $('#layer');
  const top = l.firstElementChild;
  if (!top) return;
  if (RM.matches) { l.innerHTML = ''; return; }
  top.classList.add('closing');
  setTimeout(() => { if (top.parentNode === l) top.remove(); }, 230);
}

// A bottom sheet with a grabber; drag it down to close.
function sheet(title, body, wire) {
  const layer = $('#layer');
  layer.innerHTML = `<div class="overlay" id="ov"><div class="sheet pad" role="dialog" aria-modal="true" aria-labelledby="sh-h">
    <div class="grab" aria-hidden="true"><i></i></div>
    <div class="sheet-head"><h2 id="sh-h">${title}</h2><button type="button" class="circle-btn flat" id="sh-x" aria-label="Zamknij">${icon('x')}</button></div>
    <div class="sheet-body">${body}</div></div></div>`;
  const ov = $('#ov', layer), sh = $('.sheet', layer);
  $('#sh-x', layer).onclick = closeLayer;
  ov.onclick = (e) => { if (e.target === ov) closeLayer(); };
  let y0 = null, dy = 0;
  $$('.grab, .sheet-head', sh).forEach((g) => {
    g.onpointerdown = (e) => { if (e.target.closest('button')) return; y0 = e.clientY; dy = 0; g.setPointerCapture(e.pointerId); sh.style.transition = 'none'; };
    g.onpointermove = (e) => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); sh.style.transform = `translateY(${dy}px)`; };
    g.onpointerup = () => { if (y0 == null) return; y0 = null; sh.style.transition = 'transform 260ms var(--ease)'; if (dy > 110) closeLayer(); else sh.style.transform = ''; };
  });
  if (wire) wire(sh);
  $('#sh-x', layer).focus();
}

/* ── Citizenship intake ────────────────────────────────────────────────────── */
async function obywIntake() {
  const c = S.cases.obyw = newObyw();
  if (!S.order.includes('obyw')) S.order.push('obyw');
  S.active = 'obyw'; S.building = 'obyw';
  makeBuilder(c);
  mountBuilder();
  await sleep(450);
  change(c, ['rA', 'rB'], 'Na start dwie możliwe drogi. Sprawdzimy, która pasuje.', 0.08);
  await say('maciek', 'Hej, jestem Maciek, asystent AI w Formalce. Nie jestem urzędnikiem ani prawnikiem. Pomogę Ci ogarnąć temat obywatelstwa.', 650);
  await say('maciek', 'U góry buduje się Twoja sprawa. Najpierw ustalmy drogę: uznanie u wojewody albo nadanie przez Prezydenta. Pytam po kolei, a „Nie wiem” to też dobra odpowiedź.');

  let a = await ask({ prog: c.progress, q: 'Czy masz zezwolenie na pobyt stały, zezwolenie na pobyt rezydenta długoterminowego UE albo prawo stałego pobytu?',
    why: 'Uznanie przez wojewodę dotyczy osób z jednym z tych tytułów pobytowych.',
    options: [{ label: 'Tak', value: 'yes' }, { label: 'Nie', value: 'no' }] });
  if (a.value === 'unknown') {
    c.f.title = 'unknown';
    change(c, ['rA', 'rB'], 'Obie drogi zostają otwarte, dopóki tego nie ustalimy.', 0.14);
    await say('maciek', 'Dobrze, zapytam inaczej. Jaki dokument pobytowy masz teraz i od kiedy? Napisz własnymi słowami, tak jak umiesz.');
    a = await resolveTitle(c);
  } else if (a.value === 'yes') a = { value: 'yes', kind: 'zezwolenie na pobyt stały' };
  if (a.value === 'no') {
    await say('maciek', 'Uznanie przez wojewodę dotyczy osób z pobytem stałym, zezwoleniem UE albo prawem stałego pobytu. Zostaje nadanie przez Prezydenta.');
    await ask({ q: 'W tym prototypie pełną ścieżkę pokazujemy dla uznania. Przejść ją na przykładzie?', options: [{ label: 'Tak, pokaż przykład uznania', value: 'ok' }], dk: false });
    a = { value: 'yes', kind: 'zezwolenie na pobyt stały (przykład)' };
  }
  c.f.title = 'yes'; c.f.kind = a.kind || 'zezwolenie na pobyt stały'; c.f.since = a.since || c.f.since;
  change(c, ['route', 'rB', 'docs', 'pay', 'file', 'decision'], 'Droga: uznanie przez wojewodę. Nadanie przez Prezydenta odłożone, zostaje możliwe.', 0.38);
  await say('maciek', 'Dzięki. To wskazuje na uznanie przez wojewodę. Zobacz u góry: droga się wyklarowała, a za nią pojawiły się kolejne poziomy.');

  const g = await ask({ prog: c.progress, q: 'Która sytuacja jest najbliżej Twojej?', long: true,
    why: 'Ustawa wymienia kilka grup osób, które mogą zostać uznane za obywateli polskich. Każda ma inne warunki.',
    options: [
      { label: 'Mieszkam w Polsce na tym tytule nieprzerwanie od co najmniej 3 lat, mam stałe źródło dochodu i tytuł prawny do mieszkania', value: 'three_years', ic: 'house' },
      { label: 'Od co najmniej 2 lat na tym tytule i od co najmniej 3 lat w małżeństwie z obywatelem polskim lub obywatelką polską', value: 'married', ic: 'user' },
      { label: 'Pobyt stały dzięki polskiemu pochodzeniu albo Karcie Polaka, od co najmniej roku', value: 'polish_origin', ic: 'identification-card' },
      { label: 'Żadna z tych', value: 'none', ic: 'question' },
    ] });
  c.f.group = g.value;
  if (g.value === 'three_years') change(c, ['route'], 'Warunki: 3 lata pobytu, stałe źródło dochodu, tytuł do mieszkania. Dochód i mieszkanie do potwierdzenia.', 0.56);
  else if (g.value === 'none' || g.value === 'unknown') {
    await say('maciek', `Ustawa ma jeszcze inne grupy, na przykład osoby ze statusem uchodźcy albo po 10 latach legalnego pobytu. Pełna lista w oficjalnym brzmieniu: ${link('uznanie', 'gov.pl')}. Zaznaczam grupę jako niepotwierdzoną.`);
    change(c, ['route'], 'Grupa z ustawy: niepotwierdzona.', 0.5);
  } else change(c, ['route'], 'Dodano warunki Twojej grupy. Do potwierdzenia przy dokumentach.', 0.56);

  const l = await ask({ prog: c.progress, q: 'Masz urzędowe poświadczenie znajomości polskiego co najmniej B1 albo świadectwo szkoły w Polsce?',
    why: 'Ustawa wymaga potwierdzenia znajomości polskiego. Świadectwo szkoły policealnej się nie liczy.',
    options: [{ label: 'Tak', value: 'yes' }, { label: 'Nie', value: 'no' }] });
  c.f.lang = l.value;
  if (l.value === 'yes') change(c, ['docs'], 'Dokumenty: poświadczenie B1 masz, odhaczone.', 0.74);
  else if (l.value === 'no') change(c, ['b1lv', 'file'], 'Nowy poziom: poświadczenie B1. Złożenie wniosku czeka, aż je zdobędziesz.', 0.74);
  else change(c, ['docs'], 'Poświadczenie B1: do sprawdzenia.', 0.7);

  const v = await ask({ prog: c.progress, q: 'W którym województwie mieszkasz?', why: 'Wniosek składasz do wojewody właściwego dla Twojego miejsca zamieszkania.',
    options: VOIV.map((x) => ({ label: x, value: x, small: true })) });
  if (v.value !== 'unknown') {
    c.f.voiv = v.value;
    change(c, ['file'], `Urząd: ${voivode(v.value)}.`, 0.92);
    await say('maciek', `Twój wniosek przyjmuje ${voivode(v.value)}. Adresu i godzin urzędu nie mam w zweryfikowanych źródłach, więc ich nie podaję.`);
  } else change(c, ['file'], 'Urząd: do ustalenia po województwie.', 0.88);
  await planApproval(c);
}

async function resolveTitle(c) {
  let tries = 0;
  for (;;) {
    const a = await ask({ text: true, prefill: tries === 0 ? 'mam kartę pobytu, pobyt stały od 2021' : '', placeholder: 'Na przykład: mam kartę pobytu, ...', options: [] });
    tries++;
    if (a.value === 'unknown') {
      const o = await ask({ q: 'Nic nie szkodzi. Który opis jest najbliżej?', options: [{ label: 'Pobyt stały', value: 'yes' }, { label: 'Rezydent długoterminowy UE', value: 'eu' }, { label: 'Pobyt czasowy albo wiza', value: 'no' }] });
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
      const ok = await ask({ q: `Rozumiem to tak: masz ${kind}${year ? `, od ${year} roku` : ''}. Dobrze rozumiem?`, options: [{ label: 'Tak, dobrze', value: 'ok' }, { label: 'Nie, poprawię', value: 'fix' }], dk: false });
      if (ok.value === 'ok') { c.f.since = year; return { value: 'yes', kind, since: year }; }
      await say('maciek', 'Jasne. Napisz jeszcze raz, jaki to dokument.');
      continue;
    }
    if (guess === 'no') {
      const ok = await ask({ q: 'Rozumiem to tak: masz pobyt czasowy albo wizę. Dobrze rozumiem?', options: [{ label: 'Tak, dobrze', value: 'ok' }, { label: 'Nie, poprawię', value: 'fix' }], dk: false });
      if (ok.value === 'ok') return { value: 'no' };
      continue;
    }
    const o = await ask({ q: 'Nie jestem pewien, co to znaczy. Który opis jest najbliżej?', options: [{ label: 'Pobyt stały', value: 'yes' }, { label: 'Rezydent długoterminowy UE', value: 'eu' }, { label: 'Pobyt czasowy albo wiza', value: 'no' }] });
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
  change(c, [], 'Pierwszy plan gotowy. Czeka na Twoje zatwierdzenie.', 1);
  await say('maciek', `Mam wystarczająco dużo informacji, żeby przygotować pierwszy plan. ${word} jeszcze potwierdzenia, zaznaczyłem je na mapie znakiem zapytania.`, 700);
  const r = RUN, fl = FLOW;
  await new Promise((res) => {
    dockEl.innerHTML = `<section aria-labelledby="plan-h" style="display:flex;flex-direction:column;gap:var(--s4)">
      <h2 id="plan-h" class="dock-q" tabindex="-1">Twój pierwszy plan</h2>
      <ul class="list">
        <li class="row"><span class="sq">${icon('signpost')}</span><span class="tx"><b>Uznanie za obywatela polskiego przez wojewodę</b><span class="meta">${esc(c.f.kind)}${c.f.since ? `, od ${esc(c.f.since)}` : ''} (z Twojej odpowiedzi)${c.f.voiv ? `. Urząd: ${voivode(c.f.voiv)}` : ''}</span></span></li>
        <li class="row"><span class="sq">${icon('question')}</span><span class="tx"><b>Do potwierdzenia (${n})</b><span class="meta">${open.map(esc).join('<br>')}</span></span></li>
        <li class="row"><span class="sq">${icon('coins')}</span><span class="tx"><b>${FEE} zł opłaty, decyzja do 6 miesięcy</b><span class="meta">Przykład z przewodnika Formalki, stan na 15.10.2026. ${link('duty', 'Opłata')} · ${link('uznanie', 'termin')}</span></span></li>
      </ul>
      <div class="switch-row">
        <button type="button" class="switch" role="switch" aria-checked="false" id="consent" aria-labelledby="consent-l"></button>
        <span class="switch-label" id="consent-l"><b>Maciek może sam dodawać przypomnienia i wpisy w kalendarzu do tej sprawy</b>
        Każde działanie zobaczysz w historii sprawy i możesz je cofnąć. Najwyżej jedno powiadomienie dziennie, cisza nocna od 22:00 do 7:00.</span>
      </div>
      <button type="button" class="btn btn-accent btn-block btn-knob press" id="approve"><span class="knob">${icon('check')}</span>Zatwierdzam plan</button>
      <div style="display:flex;justify-content:space-between">
        <button type="button" class="btn btn-ghost" id="planmap">${icon('map-trifold')} Zobacz mapę</button>
        <button type="button" class="btn btn-ghost" id="redo">Popraw odpowiedzi</button>
      </div></section>`;
    dockEl.classList.remove('enter'); void dockEl.offsetWidth; dockEl.classList.add('enter');
    const sw = $('#consent', dockEl);
    sw.onclick = () => sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    $('#planmap', dockEl).onclick = () => openMapSheet(c);
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
  c.status = 'active'; S.building = null; c.changed = new Set(['route', 'docs', 'visit', 'pay', 'file', 'decision']);
  logAct(c, 'Plan zatwierdzony: uznanie przez wojewodę');
  if (c.consent) logAct(c, 'Zgoda: Maciek może sam dodawać przypomnienia i wpisy w kalendarzu do tej sprawy');
  c.lastChange = 'Sprawa aktywna. Pierwszy poziom: zbierz dokumenty.';
  updateBuilder(c, true);
  await say('maciek', 'Plan zatwierdzony, sprawa jest aktywna. Zaczynamy od dokumentów. Jestem w zakładce Czat, gdybyś chciał albo chciała coś dopytać.');
  await sleep(1100);
  S.view = 'focus';
  go('case', 'fwd');
}

/* ── The calendar moment (brief §3.7, §4.8) ────────────────────────────────── */
const dayOpt = (d, value) => ({ label: dday(d), value, day: [DS[d.getDay()], String(d.getDate()), MON_S[d.getMonth()]] });
async function callFlow(c) {
  c.pending = null; c.preview = '';
  await say('maciek', 'Wniosek, na razie szkic, jest w Teczce. Równolegle możesz umówić wizytę w urzędzie wojewódzkim.');
  await say('maciek', 'Nie mogę zarezerwować wizyty za Ciebie. Mogę dodać przypomnienie, żeby zadzwonić do urzędu i zapytać o termin.');
  const d1 = at(S.clock, 1, 12), d2 = at(S.clock, 2, 12);
  const d = await ask({ q: 'Na który dzień przypomnienie?', options: [dayOpt(d1, 1), dayOpt(d2, 2), { label: 'Nie teraz', value: 0 }], dk: false });
  if (!d.value) { await say('maciek', 'Dobrze. Wizyta zostaje na mapie jako krok do zrobienia.'); return; }
  const hh = await ask({ q: 'O której?', options: [{ label: '9:00', value: 9, time: true }, { label: '12:00', value: 12, time: true }, { label: '15:00', value: 15, time: true }], dk: false });
  const when = at(S.clock, d.value, hh.value);
  const ok = await approve({ title: 'Zadzwoń do urzędu wojewódzkiego', sub: `Przypomnienie: ${dday(when)}, ${hm(when)}`, note: 'To tylko przypomnienie. Wizyty nie rezerwuję, bo nie mogę.', yes: 'Dodaj', no: 'Nie dodawaj' });
  if (!ok) { await say('maciek', 'Nie dodaję. Krok zostaje na mapie.'); return; }
  c.p.call = when;
  logAct(c, `Przypomnienie: zadzwoń do urzędu, ${dday(when)}, ${hm(when)}`, 'you', { revocable: true, kind: 'call' });
  await say('maciek', `<p>Gotowe. Przypomnienie dodane. Wizyta nie jest jeszcze zarezerwowana.</p>
    <div class="event"><span class="ev-ic">${icon('calendar-plus')}</span><span><b>Zadzwoń do urzędu wojewódzkiego</b><span>${dday(when)}, ${hm(when)}</span></span></div>
    <p class="meta">W prototypie to symulacja: wpis jest w zakładce Kalendarz, nie w kalendarzu telefonu.</p>`);
  await say('maciek', `<p>Co przygotować na wizytę, według przewodnika:</p>
    <ul><li>wniosek o uznanie za obywatela polskiego (wzór jest na stronie ministerstwa, Twój szkic jest w Teczce),</li>
    <li>fotografie osób objętych wnioskiem,</li>
    <li>poświadczenie znajomości polskiego co najmniej B1 albo świadectwo szkoły w Polsce,</li>
    <li>tłumaczenia przysięgłe albo konsularne dokumentów w obcym języku, jeśli je dołączasz,</li>
    <li>opłata skarbowa ${FEE} zł; numer konta jest na stronie urzędu wojewódzkiego.</li></ul>
    <p>Pełną listę podaje Twój urząd wojewódzki. Sprawdź ją przed wizytą.</p>${cite('uznanie')}`, 800);
  await say('maciek', 'Numer telefonu urzędu jest na jego stronie. Nie podaję go, bo nie mam go w zweryfikowanych źródłach.');
  const v = await ask({ q: 'Gdy umówisz wizytę, wpisz mi jej termin. Rano tego dnia napiszę, co zabrać.', options: [{ label: 'Mam już termin', value: 'yes' }, { label: 'Później', value: 'later' }], dk: false });
  if (v.value !== 'yes') { await say('maciek', 'Jasne. Gdy zadzwoni przypomnienie, wrócimy do tego.'); toast('Tester: możesz teraz przewinąć czas o 3 dni.', 'fast-forward'); return; }
  await setVisit(c);
  toast('Tester: możesz teraz przewinąć czas o 3 dni.', 'fast-forward');
}

async function setVisit(c, sameDayOnly = false) {
  const day = sameDayOnly ? at(S.clock, 0, 9) : at(S.clock, 3, 9);
  const t = await ask({ q: `Wizyta: ${dday(day)}. O której?`, why: sameDayOnly ? '' : 'W prototypie jest tylko ten dzień, żeby przewijanie czasu o 3 dni do niego trafiło.',
    options: [{ label: '9:00', value: [9, 0], time: true }, { label: '10:30', value: [10, 30], time: true }, { label: '13:00', value: [13, 0], time: true }], dk: false });
  c.p.visit = at(day, 0, t.value[0], t.value[1]);
  logAct(c, `Wizyta w urzędzie: ${dday(c.p.visit)}, ${hm(c.p.visit)} (termin od Ciebie)`);
  await say('maciek', `<p>Wpisane. To termin od Ciebie, nie z systemu urzędu.</p><div class="event"><span class="ev-ic">${icon('buildings')}</span><span><b>Wizyta w urzędzie wojewódzkim</b><span>${dday(c.p.visit)}, ${hm(c.p.visit)}</span></span></div>`);
  const morning = at(c.p.visit, 0, 7, 30);
  if (c.consent) {
    c.p.morning = true;
    logAct(c, `Przypomnienie rano w dniu wizyty, ${hm(morning)}, z listą rzeczy`, 'maciek', { revocable: true, kind: 'morning' });
    await say('maciek', `Dodałem też przypomnienie na rano w dniu wizyty, ${hm(morning)}, z listą rzeczy. Masz włączoną moją pomoc z wyprzedzeniem; możesz to cofnąć w historii sprawy.`);
  } else {
    const m = await approve({ ic: 'bell', title: 'Co zabrać na wizytę', sub: `Przypomnienie: ${dday(morning)}, ${hm(morning)}`, yes: 'Dodaj', no: 'Nie' });
    if (m) { c.p.morning = true; logAct(c, `Przypomnienie rano w dniu wizyty, ${hm(morning)}`, 'you', { revocable: true, kind: 'morning' }); await say('maciek', 'Gotowe. Przypomnienie dodane.'); }
  }
}

/* ── Time travel: Maciek writes first (brief §2.10, §4.9) ──────────────────── */
function travel() {
  const c = S.cases.obyw;
  if (!c || c.status !== 'active') { toast('Najpierw zatwierdź plan sprawy obywatelstwa.', 'info'); return; }
  $('#layer').innerHTML = '';
  const from = new Date(S.clock);
  S.clock = at(S.clock, 3, 7, 30);
  S.travels++;
  renderClock();
  const notes = [];
  if (c.p.call && c.p.call > from && c.p.call <= S.clock && !revoked(c, 'call')) notes.push({ past: true, time: `${DS[c.p.call.getDay()]} ${hm(c.p.call)}`, title: 'Zadzwoń do urzędu wojewódzkiego', flow: null });
  const visitToday = sameDay(c.p.visit, S.clock);
  if (S.travels === 1) notes.push({ time: hm(S.clock), title: visitToday ? 'Dziś wizyta w urzędzie. Sprawdź, co zabrać.' : 'Minęły 3 dni. Wizyta w urzędzie wciąż do umówienia.', flow: 'visit' });
  else if (!c.p.filed) notes.push({ time: hm(S.clock), title: 'Masz dziś jedno zadanie w sprawie.', flow: 'now' });
  showLock(notes);
}

function showLock(notes) {
  $('#toast').innerHTML = '';
  const layer = $('#layer');
  const draw = () => {
    layer.innerHTML = `<div class="lock pad" role="dialog" aria-modal="true" aria-label="Symulowany ekran blokady telefonu"><div class="lock-in">
      <p class="lock-date">${dlong(S.clock)}</p><p class="lock-time">${hm(S.clock)}</p>
      <div class="notes">${notes.length ? notes.map((n, i) => `<button type="button" class="note${n.past ? ' past' : ''}" data-i="${i}">
        <span class="app">${mark()}</span><span class="tx"><small><span>Formalka</span><span>${esc(n.time)}</span></small>
        ${S.lockTopic ? `<b>Wiadomość od Maciek · Obywatelstwo</b><span>${esc(n.title)}</span>` : `<b>Maciek: masz ${n.past ? 'jedno zadanie' : 'dziś jedno zadanie'}</b><span>Otwórz, żeby zobaczyć szczegóły.</span>`}</span></button>`).join('')
        : '<p class="lock-empty">Brak powiadomień. Maciek pisze tylko wtedy, gdy jest coś do zrobienia.</p>'}</div>
      <p class="lock-meta">Temat sprawy na ekranie blokady: ${S.lockTopic ? 'widoczny' : 'ukryty (domyślnie)'}<br><button type="button" id="lock-topic">${S.lockTopic ? 'Ukryj temat' : 'Pokaż temat'}</button><br>
      Najwyżej jedno powiadomienie dziennie w sprawie, cisza nocna od 22:00 do 7:00. Symulacja, telefon nic nie dostaje.</p>
      ${notes.length ? '' : '<button type="button" class="btn btn-white" id="lock-open">Otwórz aplikację</button>'}</div></div>`;
    $('#lock-topic', layer).onclick = () => { S.lockTopic = !S.lockTopic; draw(); $('#lock-topic', layer).focus(); };
    $$('.note', layer).forEach((b) => { b.onclick = () => openFromLock(notes[+b.dataset.i].flow || notes[notes.length - 1].flow); });
    const o = $('#lock-open', layer); if (o) o.onclick = () => unlock(() => go('world', 'none'));
  };
  draw();
  ($('.note:last-child', layer) || $('#lock-open', layer))?.focus();
}
function unlock(then) {
  const lk = $('.lock');
  if (!lk || RM.matches) { $('#layer').innerHTML = ''; then(); return; }
  lk.classList.add('unlock');
  then();
  setTimeout(() => { if (lk.parentNode) lk.remove(); }, 520);
}
function openFromLock(flow) {
  S.active = 'obyw';
  unlock(() => {
    S.screen = 'chat'; render();
    if (flow === 'visit') runFlow('visit', () => visitDay(S.cases.obyw));
    else if (flow === 'now') runFlow('now', () => answerNow(S.cases.obyw));
  });
}

async function visitDay(c) {
  if (!sameDay(c.p.visit, S.clock)) {
    await say('maciek', `Dzień dobry. ${c.p.call ? `Przypomnienie o telefonie do urzędu było: ${dday(c.p.call)}, ${hm(c.p.call)}.` : 'Wizyta w urzędzie jest jeszcze do umówienia.'}`, 500);
    const a = await ask({ q: 'Udało się umówić wizytę?', options: [{ label: 'Tak, mam termin na dziś', value: 'today' }, { label: 'Jeszcze nie', value: 'no' }] });
    if (a.value !== 'today') { await say('maciek', 'Rozumiem. Wizyta zostaje na mapie jako krok do zrobienia.'); await newCallReminder(c); return; }
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
  const o = await ask({ q: 'Jak poszło w urzędzie?', long: true, options: [
    { label: 'Wniosek złożony', value: 'filed', ic: 'check-circle' },
    { label: 'Urząd prosi o uzupełnienie', value: 'returned', ic: 'arrow-u-up-left' },
    { label: 'Nie udało się, wizyta przełożona', value: 'moved', ic: 'calendar-dots' }] });
  if (o.value === 'filed') return outcomeFiled(c);
  if (o.value === 'returned') return outcomeReturned(c);
  if (o.value === 'moved') return outcomeMoved(c);
  await say('maciek', 'Rozumiem. Jeśli dostałeś albo dostałaś jakieś pismo z urzędu, dodaj je do Teczki, żeby nie zgubić terminu. Mapa zostaje bez zmian, dopóki nie będzie jasne, co się stało.');
}
async function outcomeFiled(c) {
  c.p.filed = true; c.p.paid = true; c.p.decisionBy = addMonths(S.clock, 6);
  logAct(c, 'Wniosek oznaczony jako złożony (oznaczone przez Ciebie)');
  S.highlight = ['file', 'decision'];
  await say('maciek', `<p>Zapisane jako zrobione przez Ciebie. Teraz czekasz na urząd: wojewoda ma 6 miesięcy od wpływu wniosku, czyli do ${dfull(c.p.decisionBy)}. Termin może zostać wydłużony.</p>${cite('uznanie')}`);
  const p = await ask({ q: 'Masz potwierdzenie złożenia? Jeśli dodasz jego zdjęcie do Teczki, oznaczę ten poziom jako potwierdzony dokumentem.', options: [{ label: 'Dodaj zdjęcie (symulacja)', value: 'yes' }, { label: 'Później', value: 'no' }], dk: false });
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
  const m = await ask({ q: 'Czego brakuje według urzędu?', options: [{ label: 'Tłumaczenia dokumentu', value: 'tłumaczenie dokumentu' }, { label: 'Fotografii', value: 'fotografie' }, { label: 'Czegoś innego', value: 'brak wskazany przez urząd' }] });
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
  const a = await approve({ ic: 'phone', title: 'Zadzwoń do urzędu wojewódzkiego', sub: `Przypomnienie: jutro, ${dday(when)}, ${hm(when)}`, note: 'To tylko przypomnienie. Wizyta nie jest zarezerwowana.' });
  if (a) {
    c.p.call = when;
    logAct(c, `Przypomnienie: zadzwoń do urzędu, ${dday(when)}, ${hm(when)}`, 'you', { revocable: true, kind: 'call' });
    await say('maciek', 'Gotowe. Przypomnienie dodane. Wizyta nie jest jeszcze zarezerwowana.');
  }
}
async function mapButton() {
  await say('maciek', `<p>Zaktualizowałem mapę sprawy.</p><p><button class="btn btn-accent btn-sm" type="button" data-act="map">${icon('map-trifold')} Zobacz mapę</button></p>`, 300);
}

/* ── Second case: residence card with Asia (brief §4.11) ───────────────────── */
async function kartaIntake() {
  const k = S.cases.karta = newKarta();
  if (!S.order.includes('karta')) S.order.push('karta');
  S.active = 'karta'; S.building = 'karta';
  makeBuilder(k);
  if (S.screen !== 'chat') go('chat', 'fwd'); else rerenderChat();
  await sleep(400);
  addMsg('join', 'Asia dołączyła do chatu', 'asia');
  change(k, ['k1', 'k2', 'k3', 'k4'], 'Szkic sprawy. Poziomy niepotwierdzone.', 0.15);
  const o = S.cases.obyw;
  await say('asia', `Cześć, jestem Asia, asystentka AI w Formalce. Zajmę się kartą pobytu.${o ? ' Maciek dalej prowadzi Twoje obywatelstwo.' : ''}`, 650);
  const w = await ask({ who: 'asia', prog: k.progress, q: 'Czyjej karty pobytu dotyczy sprawa?', options: [{ label: 'Mojej', value: 'Twojej karty' }, { label: 'Kogoś z mojej rodziny', value: 'karty kogoś z rodziny' }] });
  k.f.whose = w.value === 'unknown' ? 'do ustalenia' : w.value;
  change(k, ['k1'], `Rodzaj sprawy: ${k.f.whose}.`, 0.45);
  if (o && o.f.voiv) {
    const r = await approve({ who: 'asia', kicker: 'Zgoda na użycie informacji', ic: 'map-pin', title: `Województwo ${o.f.voiv}`, sub: 'Ze sprawy „Obywatelstwo polskie”', note: 'Bez Twojej zgody sprawy nie dzielą się informacjami.', yes: 'Tak, użyj', no: 'Nie' });
    if (r) {
      k.f.voiv = o.f.voiv;
      logAct(k, `Użyto informacji ze sprawy „Obywatelstwo polskie”: województwo ${o.f.voiv} (za Twoją zgodą)`);
      change(k, ['k3'], `Województwo ${o.f.voiv}, ze sprawy obywatelstwa, za Twoją zgodą.`, 0.6);
    }
  }
  await say('asia', 'Tu muszę się zatrzymać. W tym prototypie nie ma zweryfikowanego przewodnika o karcie pobytu, więc nie podam dokumentów, opłat ani terminów. Na mapie zostawiam szkic; wszystkie kroki są niepotwierdzone.', 700);
  const add = await ask({ who: 'asia', q: 'Dodać sprawę do Twoich spraw jako szkic?', options: [{ label: 'Dodaj jako szkic', value: 'add' }, { label: 'Nie teraz', value: 'no' }], dk: false });
  S.building = null;
  if (add.value === 'add') {
    k.status = 'draft';
    logAct(k, 'Sprawa dodana jako szkic');
    await say('asia', 'Dodane. Obie sprawy są teraz na ekranie Start.');
    await sleep(800);
    S.active = S.cases.obyw ? 'obyw' : 'karta';
    go('world', 'back');
  } else {
    delete S.cases.karta; S.order = S.order.filter((x) => x !== 'karta');
    S.active = S.cases.obyw ? 'obyw' : null;
    rerenderChat();
    await say('asia', 'Dobrze, nic nie zapisuję.');
  }
}

/* Three-layer status under the chat header (Muse): now, the process, the detail. */
function drawStatus(slot) {
  const c = S.cases.obyw;
  if (!slot || !c || c.status !== 'active' || S.building) { if (slot) slot.innerHTML = ''; return; }
  const cur = currentLevel(c);
  const [i, n] = stepOf(c);
  const next = events().find((e) => e.d >= S.clock);
  const auto = c.history.filter((x) => x.by !== 'you' && !x.revoked).length;
  const lvl = S.statusL || 1;
  slot.innerHTML = `<section class="status" data-l="${lvl}" aria-label="Status sprawy">
    <button type="button" id="st-t" aria-expanded="${lvl > 1}"><span class="live" aria-hidden="true"></span><span class="tx"><b>Teraz:</b> ${esc(cur.title)}</span>${icon('caret-down')}</button>
    ${lvl > 1 ? `<ul class="lay">
      <li>${icon('map-trifold')}<span>Poziom ${i} z ${n}: ${esc(cur.text)}.</span></li>
      <li>${icon('calendar-dots')}<span>${next ? `Następne: ${esc(next.title)}, ${dshort(next.d)} ${hm(next.d)}` : 'Brak wpisów w kalendarzu.'}</span></li>
      <li>${icon('bell')}<span>Pomoc z wyprzedzeniem: ${c.consent ? `włączona, działania Maćka: ${auto}` : 'wyłączona, Maciek pyta przed każdym przypomnieniem'}.</span></li>
      ${lvl < 3 ? '<button type="button" class="more" id="st-more">Pokaż szczegóły i źródła</button>' : ''}</ul>` : ''}
    ${lvl > 2 ? `<ul class="lay">
      <li>${icon('signpost')}<span>Droga: uznanie przez wojewodę${c.f.voiv ? `, ${voivode(c.f.voiv)}` : ''}. Fakty: ${esc(c.f.kind)}${c.f.since ? ` od ${esc(c.f.since)}` : ''}.</span></li>
      <li>${icon('info')}<span>Opłaty, dokumenty i terminy tylko z przewodnika Formalki, stan na 15.10.2026: ${link('uznanie', 'gov.pl')}, ${link('duty', 'opłata skarbowa')}.</span></li>
      <li>${icon('clock-counter-clockwise')}<span>Pełny dziennik działań: dotknij awatara u góry.</span></li></ul>` : ''}
  </section>`;
  $('#st-t', slot).onclick = () => { S.statusL = lvl > 1 ? 1 : 2; drawStatus(slot); };
  const m = $('#st-more', slot); if (m) m.onclick = () => { S.statusL = 3; drawStatus(slot); };
}

/* ── Screens ───────────────────────────────────────────────────────────────── */
function mountBuilder() {
  const slot = $('.builder-slot');
  if (!slot) return;
  const c = S.building && S.cases[S.building];
  if (!c || !builderEl) { slot.innerHTML = ''; return; }
  if (builderEl.parentNode !== slot) slot.append(builderEl);
  requestAnimationFrame(() => updateBuilder(c, false));
}
function rerenderChat() { if (S.screen === 'chat') render(); }

const SCREENS = {
  splash() {
    const el = h(`<section class="screen splash" aria-label="Formalka">${mark('splash-mark')}<p class="splash-word">formalka</p><p class="splash-sub">Twoje sprawy urzędowe w jednym miejscu</p></section>`);
    el.onclick = () => go('home', 'none');
    return el;
  },
  home() {
    const el = h(`<section class="screen home pad">
      <div class="brandrow">${mark()}<span class="word">formalka</span><span class="tag">prototyp, dane przykładowe</span></div>
      <div class="home-hero"><h1 class="home-q">Co dziś <span class="hl">załatwiamy</span>?</h1>
        <p class="home-lead">Napisz, co masz do załatwienia w urzędzie. Asystent AI zbuduje z Tobą plan i sam przypomni, co dalej.</p></div>
      <form class="ask" id="home-ask" autocomplete="off"><label class="sr" for="home-t">Co dziś załatwiamy?</label>
        <input id="home-t" name="t" placeholder="Na przykład: obywatelstwo, karta pobytu" enterkeyhint="send">
        <button class="send" type="submit" aria-label="Wyślij">${icon('arrow-up')}</button></form>
      <div class="examples"><p>Albo dotknij przykładu:</p><div class="opts cards">
        <button type="button" class="chip chip-card" data-ex="przyszedł czas, abym złożył papiery na obywatelstwo polskie">${icon('seal-check')}<span>przyszedł czas, abym złożył papiery na obywatelstwo polskie</span></button>
        <button type="button" class="chip chip-card" data-ex="Ogarnij mi temat karty pobytu">${icon('identification-card')}<span>Ogarnij mi temat karty pobytu</span></button></div></div>
      <p class="home-foot">Formalka to niezależna usługa, nie urząd. Asystenci to AI. W prototypie nic nie wychodzi z telefonu.</p></section>`);
    const input = $('#home-t', el);
    $$('[data-ex]', el).forEach((b) => { b.onclick = () => { input.value = b.dataset.ex; input.focus(); }; });
    $('#home-ask', el).onsubmit = (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) { input.focus(); return; }
      const t = v.toLowerCase();
      if (/obywatel|papiery/.test(t)) { me(v); go('chat', 'fwd'); runFlow('obyw', () => obywIntake()); }
      else if (/karta|karty|kartę|pobyt/.test(t)) { me(v); go('chat', 'fwd'); runFlow('karta', () => kartaIntake()); }
      else toast('W prototypie są dwie sprawy: obywatelstwo i karta pobytu. Dotknij przykładu.', 'info');
    };
    return el;
  },
  chat() {
    const ids = S.order.length ? [...new Set(S.order.map((id) => S.cases[id].who))] : ['maciek'];
    const both = ids.length > 1;
    const canBack = S.order.some((id) => S.cases[id].status !== 'building');
    const el = h(`<section class="screen chat">
      <header class="appbar pad">${canBack ? `<button type="button" class="circle-btn" id="chat-back" aria-label="Wróć">${icon('arrow-left')}</button>` : ''}
        <button type="button" class="av-btn" id="chat-av" aria-label="Dziennik działań asystenta"><span class="avatars">${ids.map((w) => avatar(w, '', !both)).join('')}</span></button>
        <span class="ttl"><b>${both ? 'Maciek i Asia' : WHO[ids[0]].name}</b><span>${both ? 'asystenci AI, nie urzędnicy' : `${WHO[ids[0]].role}, nie urzędnik`}</span></span>
      </header><div class="status-slot pad"></div><div class="builder-slot pad"></div></section>`);
    el.append(logEl);
    const dw = h('<div class="pad" style="display:flex;flex-direction:column"></div>');
    dw.append(dockEl);
    el.append(dw);
    const b = $('#chat-back', el);
    if (b) b.onclick = () => { const c = S.active && C(); if (c && c.status === 'active') { S.view = 'focus'; go('case', 'back'); } else go('world', 'back'); };
    requestAnimationFrame(mountBuilder);
    $('#chat-av', el).onclick = () => { const cc = (S.active && C()) || S.cases[S.order[0]]; if (cc) openHistory(cc); };
    drawStatus($('.status-slot', el));
    const c = S.active && C();
    if (c && c.pending && !S.flow) runFlow(c.pending, () => callFlow(c));
    else if (!S.flow && !dockEl.childElementCount) idleDock();
    S.order.forEach((id) => { if (!S.cases[id].pending) S.cases[id].preview = ''; });
    scrollLog();
    return el;
  },
  world() { return worldScreen(); },
  case() { return caseScreen(); },
  calendar() { return calendarScreen(); },
  teczka() { return teczkaScreen(); },
};

function worldScreen() {
  const ev = events();
  const nowEv = ev.filter((e) => e.d >= S.clock);
  const todayN = ev.filter((e) => sameDay(e.d, S.clock)).length;
  const o = S.cases.obyw;
  const todo = (o && o.status === 'active' && !o.p.filed ? 1 : 0) + todayN;
  const el = h(`<section class="screen world"><div class="scroll pad"><div class="stack">
    <div class="greet">${mark()}<span class="tx"><small>${dlong(S.clock)}</small><b>Dzień dobry</b></span>
      <button type="button" class="circle-btn" id="w-bell" aria-label="Historia działań asystentów">${icon('bell')}${S.order.some((id) => S.cases[id].history.some((x) => x.by !== 'you')) ? '<span class="dot-badge"></span>' : ''}</button>
      <button type="button" class="circle-btn" id="w-new" aria-label="Nowa sprawa">${icon('plus')}</button></div>
    <h1 class="headline">${todo ? `Masz dziś <span class="hl">${todo === 1 ? '1 zadanie' : `${todo} zadania`}</span>` : 'Na dziś <span class="hl">spokój</span>'}</h1>
    ${S.order.map((id) => S.cases[id]).filter((c) => c.status === 'active').map(heroCard).join('')}
    <section class="sec" aria-label="Ten tydzień">${weekStrip(ev)}</section>
    ${nowEv[0] ? `<section class="sec"><div class="sec-head"><h2 class="sec-h">Najbliższe</h2><button type="button" class="btn btn-ghost" data-go="calendar">Kalendarz ${icon('caret-right')}</button></div>${apptCard(nowEv[0])}</section>` : ''}
    <section class="sec"><div class="sec-head"><h2 class="sec-h">Twoje sprawy</h2></div>
      <ul class="list">${S.order.map((id) => caseRow(S.cases[id])).join('')}</ul></section>
  </div></div></section>`);
  $$('[data-case]', el).forEach((b) => { b.onclick = () => { S.active = b.dataset.case; S.view = 'focus'; go('case', 'fwd'); }; });
  $$('[data-go]', el).forEach((b) => { b.onclick = () => go(b.dataset.go, 'tab'); });
  $$('[data-chat]', el).forEach((b) => { b.onclick = () => { S.active = b.dataset.chat; go('chat', 'fwd'); }; });
  $('#w-bell', el).onclick = () => { S.active = S.active || S.order[0]; openHistory(C()); };
  $('#w-new', el).onclick = () => go('chat', 'fwd');
  wireHero(el);
  return el;
}

function heroCard(c) {
  const cur = currentLevel(c);
  const [i, n] = stepOf(c);
  const L = levels(c).filter((l) => !l.par);
  const mini = L.map((l, k) => `${k ? `<i class="${['done', 'confirmed'].includes(L[k - 1].state) ? 'on' : ''}"></i>` : ''}<span class="md ${l.state}${l.id === cur.id ? ' here' : ''}"></span>`).join('');
  let action;
  const firstOpen = cur.tasks && cur.tasks.find((t) => !t.done);
  if (cur.id === 'docs' && firstOpen && firstOpen.id === 'form') action = `<button type="button" class="btn btn-white btn-knob btn-block press" data-form="${c.id}"><span class="knob">${icon('file-text')}</span>Wypełnij wniosek</button>`;
  else if (cur.id === 'docs' && firstOpen && firstOpen.id === 'photos') action = swipeHTML(`photos:${c.id}`, 'Przesuń: mam fotografie');
  else if (cur.id === 'pay') action = swipeHTML(`pay:${c.id}`, `Przesuń: zapłacone, ${FEE} zł`);
  else action = `<button type="button" class="btn btn-white btn-knob btn-block press" data-case="${c.id}"><span class="knob">${icon('arrow-right')}</span>Otwórz sprawę</button>`;
  return `<article class="hero" aria-label="Sprawa ${esc(c.title)}">
    <div class="hero-top"><span class="glass-ic">${icon(c.icon)}</span><span class="tx"><small>Sprawa · poziom ${i} z ${n}</small><b>${esc(c.title)}</b></span>
      <button type="button" class="circle-btn" data-chat="${c.id}" aria-label="Napisz do ${WHO[c.who].gen}">${avatar(c.who, 'sm')}${c.preview ? '<span class="dot-badge"></span>' : ''}</button></div>
    <div class="mini-route" aria-hidden="true">${mini}</div>
    <div><p class="kick">Teraz</p><h2>${esc(cur.title)}</h2></div>
    <p>${esc(cur.text)}.</p>
    ${action}
  </article>`;
}
function swipeHTML(id, label) {
  return `<div class="swipe" data-swipe="${id}"><span class="fill"></span><span class="lbl">${esc(label)}</span><button type="button" class="knob" aria-label="${esc(label.replace('Przesuń: ', 'Oznacz: '))}">${icon('arrow-right')}</button></div>`;
}
function wireHero(root) {
  $$('[data-form]', root).forEach((b) => { b.onclick = () => openForm(S.cases[b.dataset.form]); });
  $$('.swipe', root).forEach((sw) => {
    const knob = $('.knob', sw), fill = $('.fill', sw);
    let x0 = null, dx = 0, max = 0, moved = false, doneOnce = false;
    const finish = () => {
      if (doneOnce) return; doneOnce = true;
      sw.classList.add('snap', 'ok');
      knob.style.transform = `translateX(${sw.clientWidth - 60}px)`; fill.style.width = '100%';
      knob.innerHTML = icon('check'); $('.lbl', sw).textContent = 'Zrobione';
      const [what, id] = sw.dataset.swipe.split(':');
      const c = S.cases[id];
      later(650, () => {
        if (what === 'photos') { c.p.photos = true; logAct(c, 'Fotografie: masz'); toast('Fotografie odhaczone.'); }
        if (what === 'pay') { c.p.paid = true; logAct(c, `Opłata skarbowa ${FEE} zł oznaczona jako zapłacona`); toast('Opłata oznaczona. Złożenie wniosku odblokowane.', 'lock-simple'); }
        afterProgress(c);
      });
    };
    knob.onpointerdown = (e) => { x0 = e.clientX; dx = 0; moved = false; max = sw.clientWidth - 60; knob.setPointerCapture(e.pointerId); sw.classList.remove('snap'); };
    knob.onpointermove = (e) => { if (x0 == null) return; dx = Math.max(0, Math.min(max, e.clientX - x0)); if (dx > 6) moved = true; knob.style.transform = `translateX(${dx}px)`; fill.style.width = `${dx + 60}px`; };
    knob.onpointerup = () => { if (x0 == null) return; x0 = null; if (!moved || dx > max * 0.75) finish(); else { sw.classList.add('snap'); knob.style.transform = ''; fill.style.width = ''; } };
    knob.onclick = (e) => { if (e.detail === 0) finish(); };
  });
}
function weekStrip(ev) {
  const d0 = new Date(S.clock); d0.setHours(0, 0, 0, 0); d0.setDate(d0.getDate() - ((d0.getDay() + 6) % 7));
  return `<div class="week">${[...Array(7)].map((_, i) => { const d = at(d0, i, 12); const has = ev.some((e) => sameDay(e.d, d)); return `<div class="d${sameDay(d, S.clock) ? ' today' : ''}">${DS[d.getDay()]}<b>${d.getDate()}</b>${has ? '<i></i><span class="sr">wydarzenie</span>' : ''}</div>`; }).join('')}</div>`;
}
function apptCard(e) {
  return `<article class="appt"><div class="appt-top"><span class="tile-ic">${icon(e.ic)}</span><span class="tx"><b>${esc(e.title)}</b><span>${esc(e.c.title)}</span>
      <span class="appt-status">${icon(e.visit ? 'check-circle' : 'bell')} ${esc(e.sub)}</span></span></div>
    <div class="appt-row"><div><span class="sq">${icon('calendar-blank')}</span><span><small>Data</small><b>${dday(e.d)}</b></span></div>
      <div><span class="sq">${icon('clock')}</span><span><small>Godzina</small><b>${hm(e.d)}</b></span></div></div></article>`;
}
function caseRow(c) {
  const cur = c.status === 'active' ? currentLevel(c) : null;
  const next = c.status === 'draft' ? 'Szkic: czeka na zweryfikowany przewodnik' : c.status === 'building' ? 'Tworzymy plan' : `Teraz: ${cur.title}`;
  return `<li><button type="button" class="crow press" data-case="${c.id}"><span class="tile-ic">${icon(c.icon)}</span>
    <span class="tx"><b>${esc(c.title)}</b><span>${esc(next)}</span></span>${avatar(c.who, 'sm')}${icon('caret-right', 'chev')}</button></li>`;
}

function caseScreen() {
  const c = C();
  const el = h(`<section class="screen case">
    <header class="appbar pad"><button type="button" class="circle-btn" id="to-world" aria-label="Wróć do Start">${icon('arrow-left')}</button>
      <span class="ttl"><b>${esc(c.title)}</b><span>Prowadzi ${WHO[c.who].name}, ${WHO[c.who].role}</span></span>
      <button type="button" class="circle-btn" id="o-hist" aria-label="Historia sprawy">${icon('clock-counter-clockwise')}</button>
      <button type="button" class="circle-btn" id="o-chat" aria-label="Napisz do ${WHO[c.who].gen}">${avatar(c.who, 'sm')}${c.preview ? '<span class="dot-badge"></span>' : ''}</button></header>
    <div class="pad" style="padding-block:var(--s2)"><div class="seg" role="group" aria-label="Widok sprawy" data-v="${S.view}"><span class="thumb"></span>
      <button type="button" data-v="focus" aria-pressed="${S.view === 'focus'}">${icon('list-checks')} Teraz</button>
      <button type="button" data-v="map" aria-pressed="${S.view === 'map'}">${icon('map-trifold')} Mapa</button></div></div>
    <div class="scroll pad" id="case-body"></div></section>`);
  $('#to-world', el).onclick = () => go('world', 'back');
  $('#o-hist', el).onclick = () => openHistory(c);
  $('#o-chat', el).onclick = () => go('chat', 'fwd');
  $$('.seg [data-v]', el).forEach((b) => { b.onclick = () => { S.view = b.dataset.v; drawCase(); }; });
  drawCase(el);
  return el;
}
function drawCase(root = document) {
  const body = $('#case-body', root);
  if (!body) return;
  const c = C();
  const seg = $('.seg', root);
  if (seg) { seg.dataset.v = S.view; $$('[data-v]', seg).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === S.view))); }
  body.innerHTML = `<div class="stack">${S.view === 'map' ? mapView(c) : focusView(c)}</div>`;
  wireCase(body, c);
  body.scrollTop = 0;
  if (S.highlight) {
    later(600, () => { const hl = $('.pn.highlight'); if (hl) hl.scrollIntoView({ block: 'center', behavior: RM.matches ? 'auto' : 'smooth' }); });
    S.highlight = null;
  }
}
function mapView(c) {
  return `<div class="map-head"><h2 class="sec-h">Mapa sprawy</h2><div style="display:flex;gap:4px">
      <button type="button" class="btn btn-ghost" id="map-mode">${icon(S.mapList ? 'map-trifold' : 'list-checks')} ${S.mapList ? 'Mapa' : 'Lista'}</button>
      <button type="button" class="circle-btn flat" id="map-help" aria-label="Legenda">${icon('question')}</button></div></div>
    <p class="meta">Każdy poziom to etap Twojej sprawy. Kłódka znaczy, że przewodnik wymaga wcześniej innego kroku. Dotknij poziomu, żeby zobaczyć szczegóły.</p>
    ${S.mapList ? listMap(c) : pathMap(c)}`;
}
function taskRow(c, t) {
  if (t.id === 'form') {
    return `<li><button type="button" class="task press${t.done ? ' is-done' : ''}" data-task="form"><span class="tick">${tickSvg}</span>
      <span class="tx"><span>${esc(t.label)}</span><small>${esc(t.sub)}</small></span>${t.done ? icon('folder-simple', 'chev') : '<span class="go-pill">Wypełnij</span>'}</button></li>`;
  }
  if (t.id === 'trans' && !t.done) {
    return `<li><div class="task"><span class="tick">${tickSvg}</span><span class="tx"><span>${esc(t.label)}</span><small>${esc(t.sub)}</small></span></div>
      <div class="task-actions" style="margin-top:var(--s2)"><button type="button" class="chip chip-sm" data-trans="na">Nie dołączam obcych</button><button type="button" class="chip chip-sm" data-trans="done">Mam tłumaczenia</button></div></li>`;
  }
  const fixed = t.id === 'b1' && c.f.lang === 'yes';
  return `<li><button type="button" class="task press${t.done ? ' is-done' : ''}" data-task="${t.id}" aria-pressed="${!!t.done}" ${fixed ? 'disabled' : ''}><span class="tick">${tickSvg}</span>
    <span class="tx"><span>${esc(t.label)}</span><small>${esc(t.sub)}</small></span></button></li>`;
}
function focusView(c) {
  if (c.id === 'karta') {
    return `<article class="hero"><div class="hero-top"><span class="glass-ic">${icon(c.icon)}</span><span class="tx"><small>Szkic</small><b>${esc(c.title)}</b></span></div>
      <h2>Czeka na zweryfikowany przewodnik</h2><p>W tym prototypie nie ma przewodnika o karcie pobytu, więc Asia nie podaje dokumentów, opłat ani terminów. Kroki na mapie są niepotwierdzone.</p></article>
      ${c.f.voiv ? `<p class="meta">Województwo ${esc(c.f.voiv)} pochodzi ze sprawy obywatelstwa, za Twoją zgodą.</p>` : ''}`;
  }
  const L = levels(c);
  const cur = currentLevel(c);
  const [i, n] = stepOf(c);
  let inHero = '', below = '';
  if (cur.id === 'docs') {
    const done = cur.tasks.filter((t) => t.done).length;
    inHero = `<div class="mini-route" aria-hidden="true">${cur.tasks.map((t, k) => `${k ? `<i class="${cur.tasks[k - 1].done ? 'on' : ''}"></i>` : ''}<span class="md ${t.done ? 'done' : ''}"></span>`).join('')}</div><p>${done} z ${cur.tasks.length} gotowe. Pełną listę podaje Twój urząd wojewódzki.</p>`;
    below = `<section class="sec"><h2 class="sec-h">Zadania</h2><ul class="list">${cur.tasks.map((t) => taskRow(c, t)).join('')}</ul>${cite('uznanie')}</section>`;
  } else if (cur.id === 'pay') {
    inHero = `<div class="fee"><b>${FEE} zł</b><span>opłata skarbowa za decyzję o uznaniu</span></div><p>Numer konta jest na stronie urzędu wojewódzkiego. Zapłać przed złożeniem wniosku.</p>${swipeHTML(`pay:${c.id}`, `Przesuń: zapłacone, ${FEE} zł`)}${cite('duty')}`;
  } else if (cur.id === 'file') {
    inHero = `<p>Osobiście albo pocztą, do wojewody właściwego dla Twojego miejsca zamieszkania.${c.p.visit ? ` Twoja wizyta: ${dday(c.p.visit)}, ${hm(c.p.visit)}.` : ''} Po wizycie Maciek zapyta, jak poszło.</p>${cite('uznanie')}`;
  } else if (cur.id === 'decision') {
    inHero = `<p>${esc(cur.text)}. To nie zależy od Ciebie; Maciek nie będzie pisać bez powodu.</p>${cite('uznanie')}`;
  }
  const par = L.filter((l) => l.par && l.id !== 'rB');
  const side = par.map((l) => {
    if (l.id === 'visit') {
      const ev = events().find((e) => e.c === c && (e.visit || e.ic === 'phone'));
      return ev ? apptCard(ev) : `<article class="card"><div class="appt-top"><span class="tile-ic">${icon('phone')}</span><span class="tx"><b>${esc(l.title)}</b><span>Twój krok praktyczny, nie wymóg z przewodnika</span></span></div>
        <button type="button" class="btn btn-primary btn-knob press" id="plan-call"><span class="knob">${icon('bell')}</span>Ustaw przypomnienie z Maćkiem</button></article>`;
    }
    return `<article class="card"><div class="appt-top"><span class="tile-ic">${icon(l.ic)}</span><span class="tx"><b>${esc(l.title)}</b><span>${esc(l.text)}</span></span></div>${chip(l.state)}</article>`;
  }).join('');
  return `${c.preview ? `<button type="button" class="maciek-banner" id="m-banner">${avatar(c.who)}<span class="tx"><b>Nowa wiadomość od ${WHO[c.who].gen}</b>${esc(c.preview.replace(/^Maciek: /, ''))}</span>${icon('caret-right', 'chev')}</button>` : ''}
    <article class="hero" aria-labelledby="now-h"><div class="hero-top"><span class="glass-ic">${icon(cur.ic)}</span><span class="tx"><small>Co teraz · poziom ${i} z ${n}</small><b>${esc(STATE[cur.state])}</b></span></div>
      <h2 id="now-h">${esc(cur.title)}</h2>${inHero}</article>
    ${below}
    ${side ? `<section class="sec"><h2 class="sec-h">Równolegle</h2>${side}</section>` : ''}
    <section class="card"><h3>Do potwierdzenia</h3><ul class="open-list">${openItems(c).map((t) => `<li><span class="q">?</span><span>${esc(t)}</span></li>`).join('')}</ul>${cite('foreigners')}</section>
    <button type="button" class="btn btn-quiet btn-block press" data-v2="map">${icon('map-trifold')} Zobacz całą mapę sprawy</button>`;
}

function wireCase(root, c) {
  $$('[data-lv]', root).forEach((b) => { b.onclick = () => openLevel(c, b.dataset.lv); });
  $$('[data-v2]', root).forEach((b) => { b.onclick = () => { S.view = b.dataset.v2; drawCase(); }; });
  const mm = $('#map-mode', root); if (mm) mm.onclick = () => { S.mapList = !S.mapList; drawCase(); };
  const mh = $('#map-help', root); if (mh) mh.onclick = () => sheet('Stany poziomów', `${legend()}<p class="meta">Gra tylko porządkuje sprawę: nie ma punktów ani odznak. Kłódki są tylko tam, gdzie przewodnik wymaga kolejności.</p>`);
  const mb = $('#m-banner', root); if (mb) mb.onclick = () => go('chat', 'fwd');
  $$('[data-task]', root).forEach((b) => {
    b.onclick = () => {
      const id = b.dataset.task;
      if (id === 'form') { if (!c.p.form) openForm(c); else go('teczka', 'tab'); return; }
      if (id === 'fix') { c.p.returned = null; logAct(c, 'Brak uzupełniony (oznaczone przez Ciebie)'); }
      if (id === 'photos') { c.p.photos = !c.p.photos; if (c.p.photos) logAct(c, 'Fotografie: masz'); }
      if (id === 'b1') c.p.b1 = !c.p.b1;
      b.classList.toggle('is-done');
      later(420, () => afterProgress(c));
    };
  });
  $$('[data-trans]', root).forEach((b) => { b.onclick = () => { c.p.trans = b.dataset.trans; logAct(c, b.dataset.trans === 'na' ? 'Tłumaczenia: nie dołączasz obcych dokumentów' : 'Tłumaczenia: masz'); afterProgress(c); }; });
  const pc = $('#plan-call', root); if (pc) pc.onclick = () => { c.pending = 'call'; go('chat', 'fwd'); };
  wireHero(root);
}
function afterProgress(c) {
  const before = c._docs;
  c._docs = docsDone(c);
  if (!before && c._docs) toast('Dokumenty zebrane. Odblokowane: opłata skarbowa.', 'lock-simple');
  render();
}

function openLevel(c, id) {
  const l = levels(c).find((x) => x.id === id);
  if (!l) return;
  const cur = c.status === 'active' && currentLevel(c).id === id;
  sheet(esc(l.title), `<div style="display:flex;gap:var(--s3);align-items:center"><span class="tile-ic">${icon(l.ic)}</span>${chip(l.state)}</div>
    ${l.state === 'locked' ? `<p class="mock-note">${icon('lock-simple')}<span>${esc(l.reason)}</span></p>` : ''}
    ${l.userStep ? '<p class="meta">Twój krok praktyczny, nie wymóg z przewodnika.</p>' : ''}
    <p>${esc(l.text)}.</p>${l.detail || ''}
    ${cur ? '<button type="button" class="btn btn-accent btn-block" id="lv-go">Przejdź do zadań</button>' : ''}`, (sh) => {
    const g = $('#lv-go', sh); if (g) g.onclick = () => { closeLayer(); S.view = 'focus'; drawCase(); };
  });
}
function openMapSheet(c) {
  sheet(`Mapa: ${esc(c.title)}`, pathMap(c), (sh) => { $$('[data-lv]', sh).forEach((b) => { b.onclick = () => openLevel(c, b.dataset.lv); }); });
}
function openHistory(c) {
  if (!c) return;
  const body = () => `<div class="switch-row"><button type="button" class="switch" role="switch" aria-checked="${c.consent}" id="h-consent" aria-labelledby="h-consent-l"></button>
    <span class="switch-label" id="h-consent-l"><b>Pomoc z wyprzedzeniem</b>${WHO[c.who].name} ${c.consent ? 'może sam dodawać przypomnienia i wpisy w kalendarzu do tej sprawy.' : 'pyta przed każdym przypomnieniem.'}</span></div>
    <ul class="list">${c.history.map((e, i) => `<li class="row${e.revoked ? ' revoked' : ''}"><span class="sq">${e.by === 'you' ? icon('user') : avatar(c.who, 'sm')}</span><span class="tx"><b>${esc(e.text)}</b><span class="meta">${e.by === 'you' ? 'Ty' : `${WHO[c.who].name}, sam, bo masz włączoną pomoc z wyprzedzeniem`} · ${dshort(e.t)} ${hm(e.t)}${e.revoked ? ' · cofnięte' : ''}</span></span>${e.revocable && !e.revoked ? `<button type="button" class="btn btn-quiet btn-sm" data-undo="${i}">Cofnij</button>` : ''}</li>`).join('')}</ul>`;
  const wire = (sh) => {
    $('#h-consent', sh).onclick = () => { c.consent = !c.consent; logAct(c, c.consent ? 'Pomoc z wyprzedzeniem włączona' : 'Pomoc z wyprzedzeniem wyłączona'); $('.sheet-body', sh).innerHTML = body(); wire(sh); };
    $$('[data-undo]', sh).forEach((b) => { b.onclick = () => {
      const e = c.history[+b.dataset.undo];
      e.revoked = true;
      if (e.kind === 'morning') c.p.morning = false;
      if (e.kind === 'call') c.p.call = null;
      toast('Cofnięte. Przypomnienie usunięte (symulacja).', 'arrow-counter-clockwise');
      $('.sheet-body', sh).innerHTML = body(); wire(sh);
    }; });
  };
  sheet(`Historia: ${esc(c.title)}`, body(), wire);
}

function calendarScreen() {
  const ev = events();
  const base = S.calMonth || new Date(S.clock.getFullYear(), S.clock.getMonth(), 1);
  const sel = S.calSel || new Date(S.clock);
  const first = new Date(base.getFullYear(), base.getMonth(), 1);
  const days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const cells = [];
  for (let k = 0; k < lead; k++) cells.push('<span class="mday empty"></span>');
  for (let d = 1; d <= days; d++) {
    const dt = new Date(base.getFullYear(), base.getMonth(), d, 12);
    const n = ev.filter((e) => sameDay(e.d, dt)).length;
    cells.push(`<button type="button" class="mday${sameDay(dt, S.clock) ? ' today' : ''}${n ? ' has' : ''}${sameDay(dt, sel) ? ' sel' : ''}" data-d="${d}" aria-label="${d} ${MON[base.getMonth()]}${n ? `, wpisów: ${n}` : ''}">${d}${n > 1 ? `<span class="n">${n}</span>` : ''}</button>`);
  }
  const dayEv = ev.filter((e) => sameDay(e.d, sel));
  const upcoming = ev.filter((e) => e.d >= S.clock && !sameDay(e.d, sel));
  const row = (e, i) => `<li class="ag" style="animation-delay:${i * 60}ms"><span class="tile-ic">${icon(e.ic)}</span><span class="tx"><b>${esc(e.title)}</b><span>${esc(e.sub)} · ${dshort(e.d)}</span></span><span class="time">${hm(e.d)}</span></li>`;
  const el = h(`<section class="screen calendar"><div class="scroll pad"><div class="stack">
    <div class="greet"><span class="tx"><small>Wszystkie sprawy</small><b class="page-title">Kalendarz</b></span></div>
    <div class="month"><div class="month-head"><button type="button" class="circle-btn flat" id="m-prev" aria-label="Poprzedni miesiąc">${icon('caret-left')}</button><b>${MON_N[base.getMonth()]} ${base.getFullYear()}</b><button type="button" class="circle-btn flat" id="m-next" aria-label="Następny miesiąc">${icon('caret-right')}</button></div>
      <div class="mgrid">${['P', 'W', 'Ś', 'C', 'P', 'S', 'N'].map((w) => `<span class="wd" aria-hidden="true">${w}</span>`).join('')}${cells.join('')}</div></div>
    <section class="sec"><div class="sec-head"><h2 class="sec-h">${sameDay(sel, S.clock) ? 'Dziś' : dday(sel)}</h2><span class="meta">wpisy: ${dayEv.length}</span></div>
      ${dayEv.length ? `<ul class="agenda">${dayEv.map(row).join('')}</ul>` : '<p class="meta">Nic na ten dzień.</p>'}</section>
    ${upcoming.length ? `<section class="sec"><h2 class="sec-h">Później</h2><ul class="agenda">${upcoming.map(row).join('')}</ul></section>` : ''}
    <p class="meta">Wpisy dodajesz Ty albo asystent, gdy ma Twoją zgodę. W prototypie nic nie trafia do kalendarza telefonu.</p>
  </div></div></section>`);
  $$('[data-d]', el).forEach((b) => { b.onclick = () => { S.calSel = new Date(base.getFullYear(), base.getMonth(), +b.dataset.d, 12); render(); }; });
  $('#m-prev', el).onclick = () => { S.calMonth = new Date(base.getFullYear(), base.getMonth() - 1, 1); render(); };
  $('#m-next', el).onclick = () => { S.calMonth = new Date(base.getFullYear(), base.getMonth() + 1, 1); render(); };
  return el;
}

function teczkaScreen() {
  const docs = S.order.flatMap((id) => S.cases[id].teczka.map((d) => ({ ...d, c: S.cases[id] })));
  const el = h(`<section class="screen teczka"><div class="scroll pad"><div class="stack">
    <div class="greet"><span class="tx"><small>Tylko na tym telefonie</small><b class="page-title">Teczka</b></span></div>
    ${docs.length ? `<div class="docs">${docs.map((d, i) => `<button type="button" class="doc press" data-doc="${i}" style="animation-delay:${i * 70}ms"><span class="tile-ic">${icon(d.icon)}</span><b>${esc(d.name)}</b><span>${esc(d.kind)}<br>${esc(d.c.title)} · ${dshort(d.t)}</span></button>`).join('')}</div>`
      : `<div class="empty-state"><span class="tile-ic">${icon('folder-simple')}</span><b>Teczka jest pusta</b><p class="meta">Wypełniony wniosek i zdjęcia potwierdzeń trafią tutaj.</p></div>`}
    <p class="meta">W prototypie Teczka znika po resecie.</p></div></div></section>`);
  $$('[data-doc]', el).forEach((b) => { b.onclick = () => { const d = docs[+b.dataset.doc]; sheet(esc(d.name), `<p class="meta">${esc(d.kind)} · ${esc(d.c.title)}</p>${d.fields ? `<ul class="list">${d.fields.map(([k, v]) => `<li class="row"><span class="tx"><span class="meta">${esc(k)}</span><b>${esc(v)}</b></span></li>`).join('')}</ul>` : ''}`); }; });
  return el;
}

/* ── Form mock → Teczka (brief §4.7) ───────────────────────────────────────── */
function openForm(c) {
  const layer = $('#layer');
  layer.innerHTML = `<div class="full" role="dialog" aria-modal="true" aria-labelledby="form-h">
    <header class="appbar pad"><button type="button" class="circle-btn" id="form-close" aria-label="Zamknij">${icon('x')}</button><span class="ttl"><b id="form-h">Wniosek o uznanie</b><span>Makieta formularza</span></span></header>
    <div class="scroll pad"><div class="stack">
    <p class="mock-note">${icon('info')}<span><b>Makieta, nie oficjalny formularz.</b> Wzór wniosku jest na stronie ministerstwa (${link('uznanie', 'gov.pl')}). Wypełnianie prawdziwych PDF sprawdzamy osobno. Wpisuj dane przykładowe.</span></p>
    <form id="mock-form" novalidate style="display:flex;flex-direction:column;gap:var(--s4)">
      <section class="form-sec"><h2>Dane osoby</h2>
        <div class="field"><label for="f-name">Imię</label><input id="f-name" name="name" autocomplete="off"><span class="err" hidden>Wpisz imię.</span></div>
        <div class="field"><label for="f-sur">Nazwisko</label><input id="f-sur" name="sur" autocomplete="off"><span class="err" hidden>Wpisz nazwisko.</span></div>
        <div class="field"><label for="f-birth">Data urodzenia</label><input id="f-birth" name="birth" inputmode="numeric" placeholder="dd.mm.rrrr" autocomplete="off"></div>
        <div class="field"><label for="f-cit">Obecne obywatelstwo</label><input id="f-cit" name="cit" autocomplete="off"></div></section>
      <section class="form-sec"><h2>Pobyt w Polsce</h2>
        <div class="field"><label for="f-title">Podstawa pobytu</label><input id="f-title" name="title" value="${esc(c.f.kind || '')}${c.f.since ? `, od ${esc(c.f.since)}` : ''}"><span class="from">${icon('chat-circle-dots')} Z Twoich odpowiedzi dla Maćka. Możesz poprawić.</span></div>
        <div class="field"><label for="f-voiv">Województwo</label><input id="f-voiv" name="voiv" value="${esc(c.f.voiv || '')}"><span class="from">${icon('chat-circle-dots')} Z Twoich odpowiedzi dla Maćka.</span></div></section>
      <button type="button" class="btn btn-quiet" id="form-sample">Wypełnij przykładowymi danymi</button>
      <button type="submit" class="btn btn-accent btn-knob press"><span class="knob">${icon('folder-simple')}</span>Zapisz PDF do Teczki</button>
      <p class="meta">Teczka jest tylko na tym telefonie. W prototypie znika po resecie.</p>
    </form></div></div></div>`;
  $('#form-close', layer).onclick = closeLayer;
  $('#form-sample', layer).onclick = () => { const f = $('#mock-form', layer).elements; f.name.value = 'Alex'; f.sur.value = 'Przykładowy'; f.birth.value = '01.01.1990'; f.cit.value = 'przykładowe państwo'; };
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
    $('.full', layer).append(h(`<div class="saving" aria-hidden="true"><span class="fly">${icon('file-text')}</span></div>`));
    later(1000, () => { layer.innerHTML = ''; toast('Zapisano w Teczce: wniosek-uznanie-szkic.pdf', 'folder-simple-fill'); afterProgress(c); });
  };
  $('#f-name', layer).focus();
}

/* ── Boot ──────────────────────────────────────────────────────────────────── */
function reset() {
  RUN++; FLOW++;
  S = fresh();
  newChat();
  builderEl = null;
  $('#layer').innerHTML = '';
  $('#toast').innerHTML = '';
  render();
  later(1700, () => { if (S.screen === 'splash') { const sp = $('.splash'); if (sp) sp.classList.add('out'); later(380, () => go('home', 'none')); } });
}
[['#t-forward', 'Przewiń o 3 dni'], ['#tp-forward', 'Przewiń czas o 3 dni']].forEach(([s, t]) => { $(s).innerHTML = `${icon('fast-forward')} ${t}`; $(s).setAttribute('aria-label', 'Przewiń czas o 3 dni'); $(s).onclick = travel; });
$('#t-reset').innerHTML = icon('arrow-counter-clockwise');
$('#tp-reset').innerHTML = `${icon('arrow-counter-clockwise')} Reset prototypu`;
$('#t-reset').onclick = reset;
$('#tp-reset').onclick = reset;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#layer').firstElementChild && !$('.lock')) closeLayer(); });
document.documentElement.lang = 'pl';
reset();
