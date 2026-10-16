// Formalka Next, functional slice. Every question, level, state, fee, deadline, office and reminder on
// screen comes from FormalkaEngine (packages/case-engine): Formalka's verified content + blueprints.
// No AI and no network. The case lives on this device only (this browser's storage, ADR-N002); text the
// person typed is never kept, only what they confirmed. The tester strip simulates time.
'use strict';
const E = window.FormalkaEngine;
const ICONS = /*__ICONS__*/ {};
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const icon = (n) => `<span class="icon" aria-hidden="true">${ICONS[n] ?? ''}</span>`;
const cap = (t) => (t ? t[0].toUpperCase() + t.slice(1) : t);
// The part of the person's sentence around a phrase, so a short match ("na rok") reads in context.
const clause = (text, ev) => {
  const i = text.indexOf(ev); if (i < 0) return ev;
  const a = Math.max(...[...'.,;!?'].map((p) => text.lastIndexOf(p, i - 1))) + 1;
  const ends = [...'.,;!?'].map((p) => text.indexOf(p, i + ev.length)).filter((x) => x >= 0);
  return text.slice(a, ends.length ? Math.min(...ends) : text.length).trim();
};
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };

const STATE_PL = {
  unconfirmed: 'zależy od odpowiedzi', locked: 'zablokowany', available: 'możesz zacząć', in_progress: 'w toku',
  waiting_office: 'czekasz na urząd', returned: 'urząd prosi o uzupełnienie', done: 'zrobione',
};
const STATE_ICON = { locked: 'lock-simple', waiting_office: 'hourglass-simple', done: 'check', returned: 'arrow-u-up-left', unconfirmed: 'dots-three', available: 'arrow-up', in_progress: 'clock-counter-clockwise' };
const INTENTS = [
  { id: 'citizenship', words: ['obywatelstw', 'obywatelem', 'polski paszport', 'paszport polski'] },
  { id: 'residence-card', words: ['karta pobytu', 'karty pobytu', 'kartę pobytu', 'karte pobytu', 'pobyt czasowy', 'zezwolenie na pobyt'] },
  { id: 'address-registration', words: ['zameld', 'meldun', 'meldow'] },
  { id: 'language-certificate', words: ['certyfikat', 'egzamin z polskiego', 'b1', 'znajomości polskiego'] },
  { id: 'pesel', words: ['pesel'] },
];
const PLACES = [
  { teryt: '1465011', name: 'Warszawa', forms: ['Warszawa', 'Warszawie', 'Warszawy', 'Warszawę', 'Warszawą'] },
  { teryt: '1261011', name: 'Kraków', forms: ['Kraków', 'Krakowie', 'Krakowa', 'Krakowem'] },
  { teryt: '0264011', name: 'Wrocław', forms: ['Wrocław', 'Wrocławiu', 'Wrocławia', 'Wrocławiem'] },
  { teryt: '2261011', name: 'Gdańsk', forms: ['Gdańsk', 'Gdańsku', 'Gdańska', 'Gdańskiem'] },
]; // TERYT codes [ASSUMPTION: standard GUS codes]; only Warsaw and Kraków have municipal offices in the registry

const S = { cases: [], current: null, clock: { date: '2026-10-19', time: '10:00' }, delivered: new Set(), lock: [], home: true };
const nowStr = () => `${S.clock.date}T${S.clock.time}`;
const cur = () => S.cases.find((c) => c.id === S.current);
const plan = (c) => E.plan(c.bpId, c.state);

function newCase(bpId, from) {
  const bp = E.blueprint(bpId);
  const c = {
    id: `c${S.cases.length + 1}`, bpId, title: bp.title.pl, who: bp.caretaker.name,
    state: { facts: {}, tasks: {}, events: [], approved: false }, asked: 0, log: [], stage: 'intake',
    prefs: { ...E.DEFAULT_PREFS }, lastActivity: S.clock.date, tab: 'chat', focus: null, placeAsked: false,
  };
  S.cases.push(c); S.current = c.id; S.home = false;
  if (S.cases.length > 1) say(c, 'sys', `${c.who} dołącza do rozmowy.`);
  say(c, 'bot', E.msg.intro(c.who, c.title));
  if (from) say(c, 'sys', `Sprawa powiązana z: ${from}.`);
  say(c, 'sys', `Tworzymy Twoją sprawę: ${c.title}`);
  advance(c);
}
function say(c, who, text, extra = {}) { c.log.push({ who, text, ...extra }); }
function touch(c) { c.lastActivity = S.clock.date; }

// The next step of intake: a question, the route choice, the city, or the plan summary.
function advance(c) {
  const p = plan(c);
  if (c.stage === 'case' || c.stage === 'confirm') return;
  const q = E.nextQuestion(c.bpId, c.state, c.asked);
  if (q) { c.stage = 'intake'; c.pending = q.key; return; }
  c.pending = null;
  if (p.route.status === 'choice') { c.stage = 'choice'; return; }
  if (p.route.status === 'unsure' || p.route.status === 'none') {
    const proc = E.procedure(p.route.candidates[0].procedureId);
    say(c, 'bot', p.route.status === 'unsure'
      ? `Bez tych odpowiedzi nie ustalę drogi. ${proc?.handoff?.when?.pl ?? ''}`
      : 'Żadna droga z naszych źródeł nie pasuje do Twoich odpowiedzi. Tego nie poprowadzę krok po kroku.');
    c.stage = 'stuck'; return;
  }
  if (!c.placeAsked && p.levels.some((l) => l.office?.needsPlace)) { c.stage = 'place'; return; }
  c.stage = 'summary';
  say(c, 'bot', E.msg.planReady(p.unsure.length));
}

function answer(c, key, value, label) {
  c.state.facts[key] = value; c.asked++; touch(c);
  say(c, 'bot', E.fact(key)?.question.pl ?? key);
  say(c, 'me', label);
  advance(c); render();
}

// ——— the case lives on this device (ADR-N002) ———
// This browser's storage only, never a server. Free text is never kept: the log keeps a placeholder, and
// the description's fragments (candidates) are dropped; only the facts the person confirmed remain.
const KEY = 'formalka-next-slice-v1';
function persist() {
  try {
    if (!S.cases.length) { localStorage.removeItem(KEY); return; }
    const cases = S.cases.map((c) => ({
      ...c, candidates: null, said: null, decided: null, stage: c.stage === 'confirm' ? 'intake' : c.stage,
      log: c.log.map((m) => (m.free ? { who: 'me', text: 'Twój opis (treści nie zapisujemy)', free: true } : m)),
    }));
    localStorage.setItem(KEY, JSON.stringify({ registry: E.registryVersion, cases, current: S.current, clock: S.clock, delivered: [...S.delivered], lock: S.lock }));
  } catch { /* storage blocked (private window, preview): the slice still works in memory */ }
}
function restore() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    if (!d?.cases?.length) return;
    if (d.registry !== E.registryVersion) { S.notice = 'Treści Formalki się zmieniły od Twojej ostatniej wizyty. W produkcie zobaczysz, co się zmieniło w planie, i zatwierdzisz zmiany. W wycinku zaczynamy od nowa.'; return; }
    Object.assign(S, { cases: d.cases, current: d.current, clock: d.clock, delivered: new Set(d.delivered), lock: d.lock, home: true });
    for (const c of S.cases) if (c.stage === 'intake') advance(c);
  } catch { /* unreadable: start empty */ }
}
function forget() {
  try { localStorage.removeItem(KEY); } catch { /* nothing stored */ }
  Object.assign(S, { cases: [], current: null, clock: { date: '2026-10-19', time: '10:00' }, delivered: new Set(), lock: [], home: true, forgetAsk: false });
}

// ——— time ———
function travel(days) {
  const before = { ...S.clock };
  const d = new Date(`${S.clock.date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + days);
  S.clock = { date: d.toISOString().slice(0, 10), time: S.clock.time };
  const until = nowStr();
  for (const c of S.cases) {
    if (!c.state.approved) continue;
    const items = E.agenda({ caseId: c.id, blueprintId: c.bpId, plan: plan(c), state: c.state, prefs: c.prefs, now: before, lastActivity: c.lastActivity });
    for (const it of items.filter((i) => i.fireAt <= until && !S.delivered.has(i.id))) {
      S.delivered.add(it.id);
      say(c, 'bot', it.message.pl, { answers: it.answers, item: it.id, when: it.fireAt });
      if (it.channel === 'notification') S.lock.push({ caseId: c.id, text: it.lockScreen, when: it.fireAt });
    }
  }
  render();
}

function followUp(c, itemId, answerId) {
  const levelId = itemId.split('|')[2].split('@')[0];
  const p = plan(c); const lv = p.levels.find((l) => l.id === levelId);
  const label = E.msg.followUpAnswers.find((a) => a.id === answerId)?.label;
  say(c, 'me', label); touch(c);
  if (answerId === 'filed' && lv?.completesWith) {
    c.state.events.push({ type: lv.completesWith, date: S.clock.date, by: 'user' });
    const ev = E.blueprint(c.bpId).events[lv.completesWith];
    say(c, 'bot', `Zapisane: ${ev.label.pl} — ${E.dayPl(S.clock.date)}. Plan zaktualizowany.`);
  } else if (answerId === 'missing') say(c, 'bot', 'Rozumiem. Lista dokumentów jest w planie; sprawdźmy, czego brakowało, i zaplanuj nowy termin.');
  else say(c, 'bot', 'Trudno. Zaplanuj nowy termin, a przypomnę o nim.');
  c.answered = { ...(c.answered ?? {}), [itemId]: true };
  render();
}

// ——— rendering ———
function render() {
  renderTester();
  if (!S.home) $('#notice').hidden = true;
  const st = $('#stage');
  st.onclick = st.onsubmit = st.onchange = null; // a view's handlers never outlive it
  if (S.home || !cur()) { st.innerHTML = homeView(); wireHome(); }
  else { st.innerHTML = caseView(cur()); wireCase(cur()); }
  renderLock();
  persist();
}

function renderTester() {
  $('.tester').innerHTML = `<span class="clock">${icon('clock-counter-clockwise')} ${esc(E.dayPl(S.clock.date))}, ${S.clock.time}</span>
    <button class="tbtn" data-t="1">+1 dzień</button><button class="tbtn" data-t="3">+3 dni</button><button class="tbtn" data-t="7">+7 dni</button>
    <button class="tbtn" data-t="reset" aria-label="Reset">${icon('arrow-counter-clockwise')}</button>`;
  $('.tester').onclick = (e) => {
    const b = e.target.closest('[data-t]'); if (!b) return;
    if (b.dataset.t === 'reset') { forget(); render(); return; }
    travel(Number(b.dataset.t));
  };
}

function homeView() {
  const list = S.cases.map((c) => {
    const p = plan(c);
    const next = p.levels.find((l) => l.order > 0 && ['returned', 'in_progress', 'available', 'waiting_office'].includes(l.state));
    return `<button class="card opt" data-open="${c.id}" style="width:100%"><strong>${esc(c.title)}</strong> <span class="who">${esc(c.who)} · asystent AI</span>
      <div class="reason">${next ? `${esc(next.title.pl)}: ${STATE_PL[next.state]}` : 'Plan w przygotowaniu'}</div></button>`;
  }).join('');
  return `<section class="start">
      <div class="mark">${icon('file-text')}</div>
      <h1>${S.cases.length ? 'Twoje sprawy' : 'Co dziś załatwiamy?'}</h1>
      <form class="pill" id="goal"><input id="goal-in" placeholder="Np. mam pobyt stały i B1, chcę obywatelstwo" aria-label="Co dziś załatwiamy?" autocomplete="off"><button class="send" aria-label="Wyślij">${icon('arrow-up')}</button></form>
      <p class="note">Możesz opisać sytuację własnymi słowami. Nie podawaj imienia, numerów dokumentów ani adresu.</p>
      ${S.pick ? `<div class="card"><p class="q">Twój opis pasuje do kilku spraw. Którą zaczynamy?</p>
        <div class="opts">${S.pick.ids.map((id) => `<button class="opt" data-pick="${id}">${esc(E.blueprint(id).title.pl)}</button>`).join('')}</div></div>` : ''}
      <div class="chips">${INTENTS.map((i) => `<button class="chip" data-intent="${i.id}">${esc(E.blueprint(i.id).title.pl)}</button>`).join('')}</div>
      <p class="note">Działający wycinek: każdy krok liczy silnik ze sprawdzonych treści Formalki (${esc(E.registryVersion)}). Kwoty i terminy to przykłady z przewodników, stan na 15.10.2026. Bez AI i bez sieci.</p>
      ${S.notice ? `<p class="note">${esc(S.notice)}</p>` : ''}
    </section>${list ? `<div>${list}</div>
      <div class="card"><p class="reason">Twoje sprawy są zapisane tylko w tej przeglądarce, na tym urządzeniu. Nie zapisujemy tego, co piszesz własnymi słowami, tylko to, co potwierdzisz.</p>
        ${S.forgetAsk ? `<p class="q">Usunąć wszystkie sprawy z tego urządzenia? Tego nie da się cofnąć.</p><div class="row"><button class="btn" data-forget="yes">Usuń</button><button class="btn ghost" data-forget="no">Anuluj</button></div>`
          : `<div class="row"><button class="btn ghost" data-forget="ask">Usuń sprawy z tego urządzenia</button></div>`}</div>` : ''}`;
}
function wireHome() {
  $('#goal').onsubmit = (e) => { e.preventDefault(); startFromText($('#goal-in').value); };
  for (const b of document.querySelectorAll('[data-intent]')) b.onclick = () => { newCase(b.dataset.intent); render(); };
  for (const b of document.querySelectorAll('[data-open]')) b.onclick = () => { S.current = b.dataset.open; S.home = false; render(); };
  for (const b of document.querySelectorAll('[data-pick]')) b.onclick = () => startCase(b.dataset.pick, S.pick.text);
  for (const b of document.querySelectorAll('[data-forget]')) b.onclick = () => {
    if (b.dataset.forget === 'yes') forget(); else S.forgetAsk = b.dataset.forget === 'ask';
    render();
  };
}
// Which cases the words name. A case that is part of another named case's map (the language certificate
// is a level of citizenship) gives way to it. Several separate cases ("zameldować się na pobyt czasowy"
// names address registration and the residence permit): the person picks; the app never guesses.
const partsOf = (id) => Object.values(E.blueprint(id).fulfillable ?? {}).flatMap((f) => Object.values(f).map((x) => x.blueprint));
function intentsIn(text) {
  const ids = INTENTS.filter((i) => i.words.some((w) => text.toLowerCase().includes(w))).map((i) => i.id);
  return ids.filter((id) => !ids.some((other) => other !== id && partsOf(other).includes(id)));
}
function startCase(id, text) {
  S.pick = null; newCase(id); const c = cur(); c.log.splice(c.log.length - 2, 0, { who: 'me', text, free: true });
  offerIntake(c, text); render();
}
function startFromText(text) {
  const ids = intentsIn(text);
  if (ids.length === 1) { startCase(ids[0], text); return; }
  if (ids.length > 1) { S.pick = { text, ids }; render(); return; }
  const n = $('#notice'); n.textContent = 'Tej sprawy nie prowadzimy jeszcze krok po kroku. W wycinku są: obywatelstwo, karta pobytu, zameldowanie, PESEL i certyfikat z polskiego.'; n.hidden = false;
}

// The person's words, read on the device: proposals only, confirmed one by one (FormalkaEngine.intake).
// The city is proposed the same way, only to show the office.
function offerIntake(c, text) {
  const cands = [...E.intake(c.bpId, text, c.state).candidates];
  const pc = c.state.place ? null : E.placeCandidate(text, PLACES);
  if (pc) cands.push({ fact: 'place', value: pc.place.teryt, evidence: pc.evidence, place: pc.place });
  if (!cands.length) return false;
  c.candidates = cands; c.decided = {}; c.said = text; c.stage = 'confirm'; c.pending = null;
  return true;
}

function caseView(c) {
  const p = plan(c); const v = E.validate(p, c.state);
  const tabs = [['chat', 'Rozmowa'], ['map', 'Mapa'], ['folder', 'Teczka'], ...(c.state.approved ? [['now', 'Teraz'], ['acts', `${c.who} działa`]] : [])];
  if (!tabs.some(([k]) => k === c.tab)) c.tab = 'chat';
  return `<div class="head"><button class="back" data-home aria-label="Twoje sprawy">${icon('arrow-left')}</button>
      <h2>${esc(c.title)}</h2><span class="who">${esc(c.who)} · asystent AI</span></div>
    <div class="row" style="margin-top:0"><span class="badge ${v.ok ? 'ok' : 'bad'}">${v.ok ? `${icon('check')} Plan sprawdzony: każdy element ma źródło` : `Plan nie przeszedł kontroli (${v.violations.length})`}</span>
      <span class="when">${p.status === 'active' ? 'aktywny' : 'projekt planu'}</span></div>
    <div class="strip" aria-label="Mapa w skrócie">${p.levels.map((l) => `<span class="node" data-s="${l.state}" title="${esc(STATE_PL[l.state])}">${icon(STATE_ICON[l.state])} ${esc(l.title.pl)}</span>`).join('')}</div>
    <div class="tabs" role="tablist">${tabs.map(([k, n]) => `<button class="tab" role="tab" data-tab="${k}" aria-selected="${c.tab === k}">${esc(n)}</button>`).join('')}</div>
    ${c.tab === 'chat' ? chatView(c, p) : c.tab === 'map' ? mapView(c, p) : c.tab === 'folder' ? folderView(c, p) : c.tab === 'now' ? nowView(c, p) : actsView(c, p)}`;
}

function chatView(c, p) {
  const log = c.log.map((m) => `<div class="msg ${m.who === 'me' ? 'me' : m.who === 'sys' ? 'sys' : ''}">${m.who === 'bot' ? `<span class="from">${esc(c.who)} · asystent AI${m.when ? ` · ${esc(m.when.replace('T', ' '))}` : ''}</span>` : ''}${esc(m.text)}
      ${m.answers && !c.answered?.[m.item] ? `<div class="row">${m.answers.map((a) => `<button class="mini" data-fu="${esc(m.item)}" data-a="${a.id}">${esc(a.label)}</button>`).join('')}</div>` : ''}</div>`).join('');
  return `<div class="log">${log}</div>${dock(c, p)}`;
}

function dock(c, p) {
  if (c.stage === 'confirm') {
    const rows = c.candidates.map((x) => {
      const f = x.fact === 'place' ? { question: { pl: 'W jakiej miejscowości mieszkasz? (tylko po to, by wskazać urząd)' } } : E.fact(x.fact);
      const o = x.fact === 'place' ? { label: { pl: x.place.name } } : f.options.find((y) => y.value === x.value);
      const d = c.decided[x.fact];
      return `<div class="cand"><blockquote>„${esc(clause(c.said, x.evidence))}”</blockquote>
        <p><strong>${esc(f.question.pl)}</strong><br>${esc(o.label.pl)}</p>
        ${d === undefined ? `<div class="row"><button class="mini" data-cand="${esc(x.fact)}" data-ok="1">${icon('check')} Tak, zgadza się</button><button class="mini" data-cand="${esc(x.fact)}" data-ok="0">Nie</button></div>`
          : `<p class="reason">${d ? `${icon('check')} Potwierdzone` : 'Zapytam o to osobno'}</p>`}</div>`;
    }).join('');
    return `<div class="card"><p class="q">Z Twojego opisu rozumiem tyle:</p>
      <p class="reason">Sprawdź każdą rzecz. Do planu trafi tylko to, co potwierdzisz. Opis zostaje na Twoim telefonie.</p>${rows}</div>`;
  }
  if (c.stage === 'intake' && c.pending) {
    const f = E.fact(c.pending);
    return `<div class="card"><p class="q">${esc(f.question.pl)}</p>
      <div class="opts">${(f.options ?? []).map((o) => `<button class="opt" data-ans="${esc(o.value)}" data-label="${esc(o.label.pl)}">${esc(o.label.pl)}</button>`).join('')}
      <button class="opt dk" data-ans="__unknown__" data-label="Nie wiem">Nie wiem</button></div>
      ${f.whyWeAsk ? `<details><summary>Dlaczego pytamy?</summary><p>${esc(f.whyWeAsk.pl)}</p></details>` : ''}</div>
      <form class="pill" id="ask"><input id="ask-in" placeholder="Albo napisz własnymi słowami" aria-label="Albo napisz własnymi słowami" autocomplete="off"><button class="send" aria-label="Wyślij">${icon('arrow-up')}</button></form>`;
  }
  if (c.stage === 'choice') {
    const cards = p.route.candidates.filter((x) => x.outcome === 'applies' || x.outcome === 'reachable').map((x) => {
      const proc = E.procedure(x.procedureId);
      const fees = proc.fees.map((f) => `${f.amountPln.value} zł`).join(', ');
      const important = (proc.pitfalls ?? []).filter((pt) => pt.important).slice(0, 2).map((pt) => `<li>${esc(pt.statement.value.pl)}</li>`).join('');
      return `<div class="card"><h3>${esc(proc.title.pl)}</h3>
        ${x.outcome === 'reachable' ? `<p class="reason">${icon('lock-simple')} ${esc(x.via[0].label.pl)}</p>` : ''}
        ${proc.summary?.pl ? `<p class="reason">${esc(proc.summary.pl)}</p>` : ''}
        ${fees ? `<p class="reason">Opłaty (przykład z przewodnika): ${esc(fees)}</p>` : ''}
        ${important ? `<ul class="reason">${important}</ul>` : ''}
        <button class="btn" data-route="${x.procedureId}">Wybieram tę drogę</button></div>`;
    }).join('');
    return `<div class="msg sys">Pasuje więcej niż jedna droga. Wybór należy do Ciebie. Oto różnice z oficjalnych źródeł:</div>${cards}`;
  }
  if (c.stage === 'place') {
    return `<div class="card"><p class="q">W jakiej miejscowości mieszkasz? Pokażę urząd z naszych źródeł.</p>
      <div class="opts">${PLACES.map((pl) => `<button class="opt" data-place="${pl.teryt}">${esc(pl.name)}</button>`).join('')}
      <button class="opt dk" data-place="">Inna miejscowość albo wolę nie podawać</button></div>
      <details><summary>Dlaczego pytamy?</summary><p>Tylko po to, by wskazać urząd. Miejscowość zostaje na Twoim telefonie.</p></details></div>`;
  }
  if (c.stage === 'summary') {
    const assumptions = p.assumptions.map((a) => {
      const f = E.fact(a.fact); const o = f?.options?.find((x) => x.value === a.value);
      return `<dt>${esc(f?.question.pl ?? a.fact)}</dt><dd>${esc(o?.label.pl ?? String(a.value))}</dd>`;
    }).join('');
    const unsure = p.unsure.map((u) => `<li>${esc(E.fact(u.fact)?.question.pl ?? u.fact)} (odpowiedź: „Nie wiem”)</li>`).join('');
    const route = p.route.procedureId ? E.procedure(p.route.procedureId).title.pl : '';
    return `<div class="card"><h3>Pierwszy plan: ${esc(route)}</h3>
      <dl class="kv">${assumptions}</dl>
      ${c.state.place ? `<p class="reason">Miejscowość: ${esc(c.state.place.name)}</p>` : ''}
      ${unsure ? `<p class="reason">Do potwierdzenia:</p><ul class="reason">${unsure}</ul>` : ''}
      ${notesHtml(p.levels[0].notes.filter((n) => n.important), 3)}
      <label class="row"><input type="checkbox" id="consent" ${c.prefs.consent ? 'checked' : ''}> ${esc(c.who)} może sam dodawać przypomnienia i wpisy w kalendarzu do tej sprawy</label>
      <div class="row"><button class="btn" data-approve>Zatwierdzam plan</button><button class="btn ghost" data-tab="map">Zobacz mapę</button></div></div>`;
  }
  if (c.stage === 'stuck') return `${notesHtml(p.levels[0].notes)}${(E.blueprint(c.bpId).related ?? []).map((r) => `<div class="row"><button class="btn ghost" data-cross="${esc(r.blueprint)}">${icon('arrow-square-out')} ${esc(r.label.pl)}</button></div>`).join('')}<form class="pill" id="ask"><input id="ask-in" placeholder="Napisz do: ${esc(c.who)}" autocomplete="off"><button class="send" aria-label="Wyślij">${icon('arrow-up')}</button></form>`;
  return `<form class="pill" id="ask"><input id="ask-in" placeholder="Napisz do: ${esc(c.who)}" autocomplete="off"><button class="send" aria-label="Wyślij">${icon('arrow-up')}</button></form>`;
}

function mapView(c, p) {
  const lv = p.levels.map((l) => {
    const done = l.tasks.filter((t) => t.status === 'done' || t.status === 'not_needed').length;
    const due = l.deadlines.filter((d) => d.due).map((d) => `${d.role === 'office' ? 'urząd ma czas' : 'termin'} ${E.dueRangePl(d.due.earliest, d.due.latest)}`).join('; ');
    return `<li class="card" style="list-style:none"><div class="row" style="margin-top:0"><span class="state">${icon(STATE_ICON[l.state])} ${esc(STATE_PL[l.state])}</span>
        ${l.parallelWith.length ? `<span class="when">${icon('arrows-split')} równolegle z: ${esc(l.parallelWith.map((id) => p.levels.find((x) => x.id === id)?.title.pl).join(', '))}</span>` : ''}</div>
      <h3>${esc(l.title.pl)}</h3>
      ${l.reason ? `<p class="reason">${esc(l.reason.text.pl)}</p>` : ''}
      ${l.tasks.length ? `<p class="when">${done}/${l.tasks.length} zadań</p>` : ''}
      ${due ? `<p class="when">${esc(due)}</p>` : ''}
      ${c.state.approved && l.order > 0 && l.state !== 'unconfirmed' ? `<button class="mini" data-focus="${l.id}">Otwórz</button>` : ''}</li>`;
  }).join('');
  return `<ol style="padding:0">${lv}</ol><p class="legend">${Object.entries(STATE_PL).map(([k, n]) => `<span>${icon(STATE_ICON[k])} ${esc(n)}</span>`).join('')}</p>
    <p class="note">Kłódka pojawia się tylko tam, gdzie kolejność wynika z procedury. Zablokowany poziom zawsze można otworzyć i przeczytać.</p>`;
}

function focusLevel(c, p) {
  const f = c.focus && p.levels.find((l) => l.id === c.focus);
  return f ?? p.levels.find((l) => l.order > 0 && ['returned', 'in_progress', 'available'].includes(l.state))
    ?? p.levels.find((l) => l.state === 'waiting_office') ?? p.levels.at(-1);
}

// Teczka: every document of the case in one list, with its status, its "albo" alternatives and source,
// plus what has happened so far. Documents can be gathered while their level is locked (the lock guards
// the step, e.g. the visit, not the gathering). A checklist only: no files are uploaded or stored (ADR-0009).
function folderView(c, p) {
  const bp = E.blueprint(c.bpId);
  const docs = p.levels.flatMap((l) => l.tasks.filter((t) => t.kind === 'document').map((t) => ({ t, l })));
  const ok = (t) => t.status === 'done' || t.status === 'not_needed';
  const groups = [];
  for (const d of docs) {
    const g = groups.find((x) => x.some((y) => y.t.alternatives?.includes(d.t.id) || d.t.alternatives?.includes(y.t.id)));
    if (g) g.push(d); else groups.push([d]);
  }
  const ready = groups.filter((g) => g.some((d) => ok(d.t))).length;
  const rows = groups.map((g) => {
    const doneHere = g.some((d) => ok(d.t));
    const items = g.map(({ t, l }) => `<div class="t">${esc(cap(t.title.pl))}${t.outcome === 'unknown' ? ' <span class="maybe">sprawdź, czy Cię dotyczy</span>' : ''}
        <div class="when">${esc(l.title.pl)}${t.quotes?.length ? ` · <a href="${esc(t.quotes[0].page)}" target="_blank" rel="noopener noreferrer">${esc(host(t.quotes[0].page))}</a>` : ''}</div>
        ${doneHere || l.state === 'unconfirmed' ? '' : `<div class="row"><button class="mini" data-task="${esc(t.id)}" data-st="done">Mam</button>${t.outcome === 'unknown' ? `<button class="mini" data-task="${esc(t.id)}" data-st="not_needed">Nie dotyczy</button>` : ''}</div>`}</div>`).join('<div class="albo">albo</div>');
    return `<div class="task doc ${doneHere ? 'done' : ''}">${items}${doneHere ? `<p class="reason">${icon('check')} ${g.find((d) => d.t.status === 'done') ? 'Masz' : 'Nie dotyczy'}</p>` : ''}</div>`;
  }).join('');
  const fees = p.levels.flatMap((l) => l.fees).filter((f) => !f.optional && f.outcome !== 'unknown' && f.exemption?.outcome !== 'applies');
  const total = fees.reduce((n, f) => n + f.amountPln, 0);
  const history = [...c.state.events].sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => `<li>${esc(E.dayPl(e.date))}: ${esc(bp.events[e.type]?.label.pl ?? e.type)}${e.outcome ? ` (${esc(e.outcome === 'refused' ? 'odmowa' : e.outcome === 'granted' ? 'pozytywna' : e.outcome)})` : ''}</li>`).join('');
  return `<div class="card"><h3>Teczka</h3>
      <p class="reason">${docs.length ? `Gotowe: ${ready} z ${groups.length}. ` : ''}To lista do odhaczania. Niczego tu nie wgrywasz; dokumenty zostają u Ciebie.</p>
      ${rows || '<p class="reason">Ta sprawa nie wymaga dokumentów albo zależą one od odpowiedzi.</p>'}
      ${total ? `<p class="reason">Opłaty w tej sprawie (przykład z przewodnika): <strong>${total} zł</strong></p>` : ''}</div>
    ${history ? `<div class="card"><h3>Historia sprawy</h3><ul class="reason">${history}</ul></div>` : ''}`;
}

function nowView(c, p) {
  const l = focusLevel(c, p); const bp = E.blueprint(c.bpId);
  const src = (quotes) => quotes?.length ? `<details><summary>Źródło</summary><blockquote>${esc(quotes[0].text)}</blockquote><a href="${esc(quotes[0].page)}" target="_blank" rel="noopener noreferrer">${esc(host(quotes[0].page))}</a></details>` : '';
  const tasks = l.tasks.map((t, i) => `${i > 0 && t.alternatives?.includes(l.tasks[i - 1].id) ? '<div class="albo">albo</div>' : ''}<div class="task ${t.status === 'done' || t.status === 'not_needed' ? 'done' : ''}">
      <div class="t">${esc(cap(t.title.pl))}${t.outcome === 'unknown' ? ' <span class="maybe">sprawdź, czy Cię dotyczy</span>' : ''}
        ${t.officialName && t.officialName !== t.title.pl ? `<div class="when">Nazwa urzędowa: ${esc(t.officialName)}</div>` : ''}
        ${t.crossCase ? `<div class="row"><button class="mini" data-cross="${esc(t.crossCase.blueprint)}">${icon('arrow-square-out')} ${esc(t.crossCase.label.pl)}</button></div>` : ''}
        ${src(t.quotes)}</div>
      ${l.state === 'locked' || l.state === 'unconfirmed' ? '' : `<div class="row" style="margin-top:0"><button class="mini" data-task="${esc(t.id)}" data-st="done">Zrobione</button>${t.outcome === 'unknown' || t.alternatives ? `<button class="mini" data-task="${esc(t.id)}" data-st="not_needed">${t.alternatives ? 'Mam to drugie' : 'Nie dotyczy'}</button>` : ''}</div>`}</div>`).join('');
  const fees = l.fees.map((f) => `<div class="task"><div class="t">${esc(f.purpose.pl)}: <strong>${f.exemption?.outcome === 'applies' ? 'zwolnienie' : `${f.amountPln} zł`}</strong>${f.optional ? ' (opcjonalnie)' : ''}${f.outcome === 'unknown' ? ' <span class="maybe">zależy od odpowiedzi</span>' : ''}${src(f.quotes)}</div></div>`).join('');
  const deadlines = l.deadlines.map((d) => {
    const ev = bp.events[d.from];
    return `<div class="task"><div class="t">${esc(d.description.pl)}
      ${d.due ? `<div><strong>${d.role === 'office' ? 'Urząd ma czas' : 'Termin'} ${esc(E.dueRangePl(d.due.earliest, d.due.latest))}</strong></div>`
        : `<form class="row" data-event="${esc(d.from)}"><span class="when">Liczy się od: ${esc(ev?.label.pl ?? d.from)}</span><input type="date" value="${S.clock.date}" required><button class="mini">Zapisz datę</button></form>`}
      ${d.outcome === 'unknown' ? '<span class="maybe">może Cię nie dotyczyć: zależy od odpowiedzi</span>' : ''}${src(d.quotes)}</div></div>`;
  }).join('');
  const office = l.office ? officeHtml(c, l.office) : '';
  const done = l.completesWith ? eventForm(bp, l.completesWith, `Zapisz: ${bp.events[l.completesWith].label.pl}`) : '';
  const returns = l.deadlines.some((d) => bp.deadlines[d.id]?.returns) && l.state !== 'returned' && c.state.events.some((e) => e.type === 'filing')
    ? eventForm(bp, 'request_delivered', 'Dostałeś wezwanie do uzupełnienia? Zapisz datę doręczenia') : '';
  const fixed = l.state === 'returned' ? `<div class="row"><button class="btn" data-fixed>Uzupełnione i wysłane</button></div>` : '';
  const plans = l.office || l.completesWith ? `<div class="row"><button class="mini" data-visit="${l.id}">${icon('calendar-check')} Mam umówioną wizytę</button><button class="mini" data-call="${l.id}">${icon('bell-simple')} Przypomnij, żeby zadzwonić</button></div>` : '';
  const others = l.parallelWith.map((id) => p.levels.find((x) => x.id === id)).filter(Boolean)
    .map((x) => `<button class="mini" data-focus="${x.id}">${esc(x.title.pl)}</button>`).join('');
  return `<div class="card"><div class="row" style="margin-top:0"><span class="state">${icon(STATE_ICON[l.state])} ${esc(STATE_PL[l.state])}</span></div>
      <h3>${esc(l.title.pl)}</h3>${l.reason ? `<p class="reason">${esc(l.reason.text.pl)}</p>` : ''}
      ${tasks}${fees}${deadlines}${office}${done}${returns}${fixed}${plans}${notesHtml(l.notes)}</div>
    ${others ? `<div class="card"><p class="reason">Równolegle możesz zająć się:</p><div class="row">${others}</div></div>` : ''}`;
}
function notesHtml(notes, max = 6) {
  if (!notes?.length) return '';
  const src = (q) => q?.length ? ` <details><summary>Źródło</summary><blockquote>${esc(q[0].text)}</blockquote><a href="${esc(q[0].page)}" target="_blank" rel="noopener noreferrer">${esc(host(q[0].page))}</a></details>` : '';
  return `<div class="notes"><p class="when">${icon('warning-circle')} Warto wiedzieć</p><ul>${notes.slice(0, max).map((n) => `<li class="${n.important ? 'imp' : ''}">${esc(n.statement.value.pl)}${src(n.statement.quotes)}</li>`).join('')}</ul>${notes.length > max ? `<p class="when">I jeszcze ${notes.length - max} w przewodniku.</p>` : ''}</div>`;
}
function eventForm(bp, type, label) {
  const outs = bp.events[type]?.outcomes;
  return `<form class="row" data-event="${esc(type)}"><span class="when">${esc(label)}</span><input type="date" value="${S.clock.date}" required>
    ${outs ? `<select aria-label="Wynik">${outs.map((o) => `<option value="${o}">${o === 'granted' ? 'pozytywna' : o === 'refused' ? 'odmowa' : esc(o)}</option>`).join('')}</select>` : ''}<button class="mini">Zapisz</button></form>`;
}
function officeHtml(c, o) {
  if (o.needsPlace) return `<p class="reason">${icon('map-trifold')} Podaj miejscowość, a pokażę urząd z naszych źródeł. <button class="mini" data-askplace>Podaj</button></p>`;
  if (o.noneForPlace) return `<p class="reason">${icon('info')} ${esc(E.msg.officeUnknown())}</p>`;
  const list = o.offices.slice(0, 4).map((x) => `<li>${esc(x.name.pl)}${x.address ? `, ${esc(x.address.value)}` : ''}${x.openingHours ? `<div class="when">${esc(x.openingHours.value)}</div>` : ''}${x.website ? ` <a href="${esc(x.website)}" target="_blank" rel="noopener noreferrer">strona urzędu</a>` : ''}</li>`).join('');
  const booking = [...new Set(o.offices.map((x) => x.booking).filter(Boolean))];
  return `<div class="task"><div class="t">${icon('map-trifold')} Gdzie: ${o.offices.length > 4 ? `${o.offices.length} urzędów dla miejscowości ${esc(c.state.place?.name)}, np.:` : ''}
    <ul class="reason">${list}</ul>${booking.length === 1 ? `<a href="${esc(booking[0])}" target="_blank" rel="noopener noreferrer">Rezerwacja wizyty</a>` : ''}</div></div>`;
}

function actsView(c, p) {
  const items = E.agenda({ caseId: c.id, blueprintId: c.bpId, plan: p, state: c.state, prefs: c.prefs, now: S.clock, lastActivity: c.lastActivity });
  const list = items.map((i) => `<li><div class="when">${esc(i.fireAt.replace('T', ' '))} · ${i.channel === 'notification' ? `${icon('bell-simple')} powiadomienie` : 'w aplikacji'}</div>
      <div>${esc(i.message.pl.split('\n')[0])}</div>${i.channel === 'notification' ? `<div class="when">Ekran blokady: „${esc(i.lockScreen)}”</div>` : ''}</li>`).join('');
  return `<div class="card"><label class="row" style="margin-top:0"><input type="checkbox" id="consent2" ${c.prefs.consent ? 'checked' : ''}> ${esc(c.who)} może sam dodawać przypomnienia i wpisy w kalendarzu</label>
      <label class="row"><input type="checkbox" id="detail" ${c.prefs.lockScreenDetail ? 'checked' : ''}> Pokazuj temat sprawy na ekranie blokady</label>
      <p class="note">Bez zgody wszystko zostaje w aplikacji. Najwyżej jedno powiadomienie dziennie na sprawę, nic między 20:00 a 08:00.</p></div>
    <div class="card"><h3>Co ${esc(c.who)} zrobi sam</h3>${list ? `<ul class="agenda">${list}</ul>` : '<p class="reason">Na razie nic: zapisz datę, od której liczy się termin, albo zaplanuj wizytę.</p>'}
      <p class="note">Użyj „+1 dzień” / „+3 dni” u góry, żeby zobaczyć, jak to działa.</p></div>`;
}

function renderLock() {
  const layer = $('#layer');
  if (!S.lock.length) { layer.innerHTML = ''; return; }
  layer.innerHTML = `<div class="lock" role="dialog" aria-label="Ekran blokady (symulacja)"><div><div class="time">${S.clock.time}</div>
    ${S.lock.map((n, i) => `<button class="notif" data-lock="${i}"><strong>Formalka</strong> · ${esc(n.when.replace('T', ' '))}<br>${esc(n.text)}</button>`).join('')}
    <button class="notif" data-lock="close" style="text-align:center">Zamknij</button></div></div>`;
  layer.onclick = (e) => {
    const b = e.target.closest('[data-lock]'); if (!b) return;
    if (b.dataset.lock !== 'close') { const n = S.lock[Number(b.dataset.lock)]; S.current = n.caseId; S.home = false; const c = cur(); c.tab = 'chat'; }
    S.lock = []; render();
  };
}

function wireCase(c) {
  const st = $('#stage');
  st.onclick = (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.home !== undefined) { S.home = true; render(); return; }
    if (t.dataset.tab) { c.tab = t.dataset.tab; render(); return; }
    if (t.dataset.ans) { answer(c, c.pending, t.dataset.ans, t.dataset.label); return; }
    if (t.dataset.cand) {
      c.decided[t.dataset.cand] = t.dataset.ok === '1'; touch(c);
      if (c.candidates.every((x) => c.decided[x.fact] !== undefined)) {
        const yes = c.candidates.filter((x) => c.decided[x.fact]).map((x) => x.fact);
        c.state = E.confirmCandidates(c.state, c.candidates.filter((x) => x.fact !== 'place'), yes);
        const pl = c.candidates.find((x) => x.fact === 'place' && c.decided.place);
        if (pl) { c.state.place = pl.place; c.placeAsked = true; }
        say(c, 'bot', yes.length ? `Dziękuję. Potwierdzone z Twojego opisu: ${yes.length}. Zapytam tylko o resztę.` : 'Dobrze, zapytam o wszystko po kolei.');
        c.candidates = null; c.said = null; c.stage = 'intake'; advance(c);
      }
      render(); return;
    }
    if (t.dataset.route) { c.state.routeChoice = t.dataset.route; say(c, 'me', `Wybieram: ${E.procedure(t.dataset.route).title.pl}`); touch(c); advance(c); render(); return; }
    if (t.dataset.place !== undefined) {
      const pl = PLACES.find((x) => x.teryt === t.dataset.place);
      if (pl) c.state.place = pl; c.placeAsked = true; say(c, 'bot', 'W jakiej miejscowości mieszkasz?'); say(c, 'me', pl ? pl.name : 'Wolę nie podawać'); touch(c);
      if (c.stage !== 'case') advance(c); render(); return;
    }
    if (t.dataset.askplace !== undefined) { c.stage = 'place'; c.tab = 'chat'; render(); return; }
    if (t.dataset.approve !== undefined) {
      c.prefs.consent = $('#consent')?.checked ?? c.prefs.consent; c.state.approved = true; c.stage = 'case'; c.tab = 'now'; touch(c);
      say(c, 'sys', `Plan zatwierdzony ${E.dayPl(S.clock.date)}.${c.prefs.consent ? ` ${c.who} będzie sam dodawać przypomnienia.` : ''}`); render(); return;
    }
    if (t.dataset.focus) { c.focus = t.dataset.focus; c.tab = 'now'; render(); return; }
    if (t.dataset.task) { c.state.tasks[t.dataset.task] = t.dataset.st; touch(c); render(); return; }
    if (t.dataset.cross) { const from = c.title; const id = t.dataset.cross; const ex = S.cases.find((x) => x.bpId === id); if (ex) { S.current = ex.id; } else newCase(id, from); render(); return; }
    if (t.dataset.fixed !== undefined) { c.state.events.push({ type: 'fix_submitted', date: S.clock.date, by: 'user' }); touch(c); render(); return; }
    if (t.dataset.fu) { followUp(c, t.dataset.fu, t.dataset.a); return; }
    if (t.dataset.visit || t.dataset.call) { planTime(c, t.dataset.visit ? 'visit' : 'call', t.dataset.visit || t.dataset.call); return; }
  };
  st.onsubmit = (e) => {
    e.preventDefault();
    const f = e.target;
    if (f.id === 'ask') {
      const text = $('#ask-in').value.trim(); if (!text) return;
      say(c, 'me', text, { free: true }); touch(c);
      // Another case only when the words name exactly one other case and not this one.
      const ids = intentsIn(text);
      if (ids.length === 1 && ids[0] !== c.bpId) { newCase(ids[0], c.title); offerIntake(cur(), text); render(); return; }
      // Before approval, more of the person's words can still answer questions (after it, a change is a replan: ADR-N003).
      if (c.stage !== 'case' && c.stage !== 'confirm' && offerIntake(c, text)) { render(); return; }
      say(c, 'bot', 'W tym wycinku odpowiadam tylko tym, co jest w planie (zadania, opłaty, terminy, urzędy, każde ze źródłem). Rozmowa z AI dojdzie w fazie 4.');
      render(); return;
    }
    if (f.dataset.event) {
      const date = f.querySelector('input[type=date]').value; const outcome = f.querySelector('select')?.value;
      c.state.events.push({ type: f.dataset.event, date, by: 'user', ...(outcome ? { outcome } : {}) }); touch(c);
      const ev = E.blueprint(c.bpId).events[f.dataset.event];
      say(c, 'sys', `Zapisane: ${ev?.label.pl ?? f.dataset.event} — ${E.dayPl(date)}.`);
      render();
    }
  };
  st.onchange = (e) => {
    if (e.target.id === 'consent' || e.target.id === 'consent2') c.prefs.consent = e.target.checked;
    if (e.target.id === 'detail') c.prefs.lockScreenDetail = e.target.checked;
    if (e.target.id === 'consent2' || e.target.id === 'detail') render();
  };
}

function planTime(c, kind, levelId) {
  const layer = $('#layer');
  const days = [1, 2, 3, 4, 5].map((n) => { const d = new Date(`${S.clock.date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); });
  layer.innerHTML = `<div class="lock" role="dialog" aria-label="${kind === 'visit' ? 'Wizyta' : 'Przypomnienie'}"><form class="card" id="pt" style="width:min(26rem,92vw)">
    <p class="q">${kind === 'visit' ? 'Kiedy masz umówioną wizytę?' : esc(E.msg.cannotBook())}</p>
    <div class="row"><select id="pt-d">${days.map((d) => `<option value="${d}">${esc(E.dayPl(d))}</option>`).join('')}</select>
    <select id="pt-t">${['09:00', '10:00', '12:00', '14:00', '16:00'].map((t) => `<option>${t}</option>`).join('')}</select></div>
    <div class="row"><button class="btn">${kind === 'visit' ? 'Zapisz wizytę' : 'Dodaj przypomnienie'}</button><button class="btn ghost" type="button" id="pt-x">Anuluj</button></div></form></div>`;
  $('#pt-x').onclick = () => { layer.innerHTML = ''; };
  $('#pt').onsubmit = (e) => {
    e.preventDefault();
    const date = $('#pt-d').value, time = $('#pt-t').value;
    c.state.events.push({ type: kind === 'visit' ? 'visit_planned' : 'call_planned', date, time, level: levelId, by: 'user' }); touch(c);
    say(c, 'bot', E.msg.reminderAdded(date, time, kind));
    layer.innerHTML = ''; render();
  };
}

restore();
render();
