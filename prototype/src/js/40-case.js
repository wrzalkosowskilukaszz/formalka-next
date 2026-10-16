/* ── Case screens and actions, all over the engine's plan ───────────────────── */
const FORMABLE = /wniosek|formularz/i;
const isFormable = (t) => FORMABLE.test(t.title.pl) || FORMABLE.test(t.officialName || '');
// Events the person records. The blueprint names most; these are the app's own (visits, calls, the fix).
const EVENT_NAMES = { fix_submitted: 'Uzupełnienie wysłane do urzędu', visit_planned: 'Wizyta w urzędzie', call_planned: 'Telefon do urzędu' };
const eventLabel = (c, type) => E.blueprint(c.bpId).events?.[type]?.label?.pl ?? EVENT_NAMES[type] ?? type;

/* Calendar entries: what the assistant will do (agenda), visits from the person, own reminders. */
const AGENDA_TITLE = {
  call_reminder: 'Zadzwoń do urzędu', visit_prep: 'Przygotowanie do wizyty', visit_morning: 'Dziś wizyta w urzędzie',
  follow_up: 'Jak poszło w urzędzie?', deadline_warning: 'Zbliża się termin', deadline_today: 'Dziś mija termin',
  office_deadline_passed: 'Minął czas urzędu na odpowiedź', nudge: 'Przypomnienie o sprawie', rule_change: 'Zmiana w źródłach',
};
const AGENDA_ICON = { call_reminder: 'phone', visit_prep: 'list-checks', visit_morning: 'buildings', follow_up: 'chat-circle-dots', deadline_warning: 'hourglass-simple', deadline_today: 'warning-circle', office_deadline_passed: 'hourglass-simple', nudge: 'bell', rule_change: 'info' };
function agendaFor(c, now = S.clock) {
  if (!c.state.approved) return [];
  return E.agenda({ caseId: c.id, blueprintId: c.bpId, plan: plan(c), state: c.state, prefs: c.prefs, now, lastActivity: c.lastActivity, persona: personaOf(c) });
}
function entries() {
  const out = [];
  for (const c of S.cases) {
    for (const it of agendaFor(c)) {
      out.push({ at: it.fireAt, title: AGENDA_TITLE[it.kind] || it.message.pl.split('\n')[0], ic: AGENDA_ICON[it.kind] || 'bell', c,
        sub: `${c.who} przypomni${it.channel === 'notification' ? ', powiadomienie' : ', w aplikacji'}` });
    }
    for (const ev of c.state.events.filter((e) => e.type === 'visit_planned')) {
      out.push({ at: `${ev.date}T${ev.time}`, title: 'Wizyta w urzędzie', sub: 'Termin od Ciebie, nie z systemu urzędu', ic: 'buildings', c, visit: true });
    }
    for (const d of c.deliveredLog) out.push({ ...d, c, past: true });
  }
  for (const r of S.custom) out.push({ at: r.at, title: r.title, sub: 'Twoje przypomnienie', ic: 'bell', c: caseById(r.c), custom: r.id });
  return out.sort((a, b) => a.at.localeCompare(b.at));
}

/* ── Start (World) ─────────────────────────────────────────────────────────── */
function worldScreen() {
  if (!S.cases.length) return SCREENS.home();
  const all = entries();
  const today = all.filter((e) => e.at.slice(0, 10) === S.clock.date && !e.past);
  const actionable = S.cases.filter((c) => c.state.approved && ACTIVE.includes(currentLevel(plan(c)).state)).length;
  const n = today.length + actionable;
  const next = all.find((e) => !e.past && e.at >= stamp(S.clock));
  const approved = S.cases.filter((c) => c.state.approved);
  const el = h(`<section class="screen world"><div class="scroll pad"><div class="stack">
    <div class="greet">${mark()}<span class="tx"><small>${dlong(S.clock.date)}</small><b>Dzień dobry</b></span>
      <button type="button" class="circle-btn" id="w-hist" aria-label="Historia i działania asystentów">${icon('bell')}${S.cases.some((c) => c.history.some((x) => x.by !== 'you')) ? '<span class="dot-badge"></span>' : ''}</button>
      <button type="button" class="circle-btn" id="w-new" aria-label="Nowa sprawa">${icon('plus')}</button></div>
    <h1 class="headline">${n ? `Masz dziś <span class="hl">${n} ${plural(n, 'zadanie', 'zadania', 'zadań')}</span>` : 'Na dziś <span class="hl">spokój</span>'}</h1>
    ${approved.length ? heroCard(approved[0]) : ''}
    <section class="sec" aria-label="Ten tydzień">${weekStrip(all)}</section>
    ${next ? `<section class="sec"><div class="sec-head"><h2 class="sec-h">Najbliższe</h2><button type="button" class="btn btn-ghost" data-go="calendar">Kalendarz ${icon('caret-right')}</button></div>${apptCard(next)}</section>` : ''}
    <section class="sec"><div class="sec-head"><h2 class="sec-h">Twoje sprawy</h2></div>
      <ul class="list">${S.cases.map(caseRow).join('')}</ul></section>
  </div></div></section>`);
  $$('[data-case]', el).forEach((b) => { b.onclick = () => openCase(b.dataset.case); });
  $$('[data-go]', el).forEach((b) => { b.onclick = () => go(b.dataset.go, 'tab'); });
  $$('[data-chat]', el).forEach((b) => { b.onclick = () => { S.active = b.dataset.chat; go('chat', 'fwd'); }; });
  $('#w-hist', el).onclick = () => openHistory(C() || approved[0] || S.cases[0]);
  $('#w-new', el).onclick = () => go('home', 'fwd');
  wireActions(el);
  return el;
}
function openCase(id) {
  const c = caseById(id);
  if (!c) return;
  S.active = id;
  if (!c.state.approved) { go('chat', 'fwd'); if (S.building !== c.id || !S.flow) runFlow('intake', () => resumeIntake(c)); return; }
  S.view = 'focus'; c.focus = null;
  go('case', 'fwd');
}
function heroCard(c) {
  const p = plan(c);
  const cur = currentLevel(p);
  const [i, n] = stepOf(p);
  const mini = p.levels.map((l, k) => `${k ? `<i class="${p.levels[k - 1].state === 'done' ? 'on' : ''}"></i>` : ''}<span class="md ${l.state}${l.id === cur.id ? ' here' : ''}"></span>`).join('');
  const open = cur.state === 'locked' || cur.state === 'unconfirmed' ? null : cur.tasks.find((t) => !isDone(t));
  let action;
  if (open && isFormable(open)) action = `<button type="button" class="btn btn-white btn-knob btn-block press" data-form="${c.id}|${esc(open.id)}"><span class="knob">${icon('file-text')}</span>Wypełnij (makieta)</button>`;
  else if (open) action = `<p class="kick">Następne zadanie</p><p class="hero-task">${esc(cap(open.title.pl))}</p>${swipeHTML(`${c.id}|${open.id}`, 'Przesuń: mam to')}`;
  else action = `<button type="button" class="btn btn-white btn-knob btn-block press" data-case="${c.id}"><span class="knob">${icon('arrow-right')}</span>Otwórz sprawę</button>`;
  return `<article class="hero" aria-label="Sprawa ${esc(c.title)}">
    <div class="hero-top"><span class="glass-ic">${icon(c.icon)}</span><span class="tx"><small>Poziom ${i} z ${n}</small><b>${esc(c.title)}</b></span>
      <button type="button" class="circle-btn" data-chat="${c.id}" aria-label="Napisz do ${esc(who(c.who).gen)}">${avatar(c.who, 'sm')}${c.preview ? '<span class="dot-badge"></span>' : ''}</button></div>
    <div class="mini-route" aria-hidden="true">${mini}</div>
    <div><p class="kick">Teraz · ${esc(STATE[cur.state])}</p><h2>${esc(cur.title.pl)}</h2></div>
    <p>${esc(levelLine(cur))}</p>${action}</article>`;
}
function swipeHTML(id, label) {
  return `<div class="swipe" data-swipe="${esc(id)}"><span class="fill"></span><span class="lbl">${esc(label)}</span><button type="button" class="knob" aria-label="${esc(label.replace('Przesuń: ', 'Oznacz: '))}">${icon('arrow-right')}</button></div>`;
}
function weekStrip(all) {
  const mon = isoAdd(S.clock.date, -((wd(S.clock.date) + 6) % 7));
  return `<div class="week">${[0, 1, 2, 3, 4, 5, 6].map((k) => { const d = isoAdd(mon, k); const has = all.some((e) => e.at.slice(0, 10) === d && !e.past);
    return `<div class="d${d === S.clock.date ? ' today' : ''}">${DS[wd(d)]}<b>${Number(d.slice(8))}</b>${has ? '<i></i><span class="sr">wpis w kalendarzu</span>' : ''}</div>`; }).join('')}</div>`;
}
function apptCard(e) {
  return `<article class="appt"><div class="appt-top"><span class="tile-ic">${icon(e.ic)}</span><span class="tx"><b>${esc(e.title)}</b><span>${esc(e.c ? e.c.title : 'Bez sprawy')}</span>
      <span class="appt-status">${icon(e.visit ? 'check-circle' : 'bell')} ${esc(e.sub)}</span></span></div>
    <div class="appt-row"><div><span class="sq">${icon('calendar-blank')}</span><span><small>Data</small><b>${dday(e.at.slice(0, 10))}</b></span></div>
      <div><span class="sq">${icon('clock')}</span><span><small>Godzina</small><b>${hm(e.at.slice(11, 16))}</b></span></div></div></article>`;
}
function caseRow(c) {
  const p = plan(c);
  const next = c.stuck ? 'Nie poprowadzę krok po kroku: brak drogi w źródłach'
    : !c.state.approved ? (S.building === c.id ? 'Tworzymy plan' : 'Plan czeka na Twoje odpowiedzi')
      : `Teraz: ${currentLevel(p).title.pl}`;
  return `<li><button type="button" class="crow press" data-case="${c.id}"><span class="tile-ic">${icon(c.icon)}</span>
    <span class="tx"><b>${esc(c.title)}</b><span>${esc(next)}${forOther(c) ? ' · dla kogoś innego' : ''}</span></span>${avatar(c.who, 'sm')}${icon('caret-right', 'chev')}</button></li>`;
}

/* ── One case: Teraz (focus) and Mapa ──────────────────────────────────────── */
function caseScreen() {
  const c = C();
  if (!c) return worldScreen();
  const el = h(`<section class="screen case">
    <header class="appbar pad"><button type="button" class="circle-btn" id="to-world" aria-label="Wróć do Start">${icon('arrow-left')}</button>
      <span class="ttl"><b>${esc(c.title)}</b><span>Prowadzi ${esc(c.who)}, ${esc(who(c.who).role)}${forOther(c) ? ' · sprawa kogoś innego' : ''}</span></span>
      <button type="button" class="circle-btn" id="o-hist" aria-label="Historia sprawy">${icon('clock-counter-clockwise')}</button>
      <button type="button" class="circle-btn" id="o-chat" aria-label="Napisz do ${esc(who(c.who).gen)}">${avatar(c.who, 'sm')}${c.preview ? '<span class="dot-badge"></span>' : ''}</button></header>
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
  const c = C();
  if (!body || !c) return;
  const seg = $('.seg', root);
  if (seg) { seg.dataset.v = S.view; $$('[data-v]', seg).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === S.view))); }
  body.innerHTML = `<div class="stack">${S.view === 'map' ? mapView(c) : focusView(c)}</div>`;
  wireActions(body, c);
  body.scrollTop = 0;
  if (S.highlight) {
    later(500, () => { const hl = $('.highlight'); if (hl) hl.scrollIntoView({ block: 'center', behavior: RM.matches ? 'auto' : 'smooth' }); });
    S.highlight = null;
  }
}
// A "returns" deadline (the office asks for missing items) matters only once the office has asked.
const isReturnsDeadline = (c, d) => !!E.blueprint(c.bpId).deadlines?.[d.id]?.returns;
const shownDeadlines = (c, l) => l.deadlines.filter((d) => d.due || !isReturnsDeadline(c, d));
// The office can send the case back for missing items: a "returns" deadline, once the filing is recorded.
const canReturn = (c, p) => c.state.events.some((e) => e.type === 'filing')
  && p.levels.some((l) => l.deadlines.some((d) => E.blueprint(c.bpId).deadlines?.[d.id]?.returns));
function focusLevel(c, p) { return (c.focus && p.levels.find((l) => l.id === c.focus)) || currentLevel(p); }

function taskRow(c, l, t, i) {
  const readOnly = l.state === 'locked' || l.state === 'unconfirmed';
  const albo = i > 0 && t.alternatives?.includes(l.tasks[i - 1].id) ? '<li class="albo" aria-hidden="true">albo</li>' : '';
  const meta = [t.officialName && t.officialName !== t.title.pl ? `Nazwa urzędowa: ${t.officialName}` : '', t.description?.pl || ''].filter(Boolean).join('. ');
  const extra = [];
  if (!readOnly && !isDone(t) && isFormable(t)) extra.push(`<button type="button" class="chip chip-sm" data-form="${c.id}|${esc(t.id)}">${icon('file-text')} Wypełnij (makieta)</button>`);
  if (!readOnly && !isDone(t) && (t.outcome === 'unknown' || t.alternatives)) extra.push(`<button type="button" class="chip chip-sm" data-task="${esc(t.id)}" data-st="not_needed">${t.alternatives ? 'Mam to drugie' : 'Nie dotyczy'}</button>`);
  if (t.crossCase?.blueprint) extra.push(`<button type="button" class="chip chip-sm" data-crosscase="${esc(t.crossCase.blueprint)}">${icon('arrow-square-out')} ${esc(t.crossCase.label.pl)}</button>`);
  return `${albo}<li><button type="button" class="task press${isDone(t) ? ' is-done' : ''}" ${readOnly ? 'disabled' : `data-task="${esc(t.id)}" data-st="${isDone(t) ? 'todo' : 'done'}"`} aria-pressed="${isDone(t)}">
      <span class="tick">${tickSvg}</span><span class="tx"><span>${esc(cap(t.title.pl))}${t.outcome === 'unknown' ? ' <em class="maybe">sprawdź, czy Cię dotyczy</em>' : ''}</span>
      ${t.onlyIf ? `<small>${esc(t.onlyIf.pl)}</small>` : ''}${meta ? `<small>${esc(meta)}</small>` : ''}${t.status === 'not_needed' ? '<small>Nie dotyczy albo masz dokument zamienny</small>' : ''}</span></button>
    ${extra.length || t.quotes?.length ? `<div class="task-actions">${extra.join('')}${t.quotes?.length ? `<span class="src">${icon('info')} ${srcLink(t.quotes)}</span>` : ''}</div>` : ''}</li>`;
}
// Audit F3: an exemption the facts don't establish is named, never granted; the full amount stays.
const maybeExempt = (f) => `Przewodnik przewiduje też zwolnienie z opłaty: „${f.exemption.statement.value.pl}”. Z Twoich odpowiedzi to nie wynika, więc liczę pełną kwotę.`;
function feeRow(f) {
  const amount = f.exemption?.outcome === 'applies' ? 'zwolnienie' : `${f.amountPln} zł`;
  return `<article class="card fee-card"><div class="fee"><b>${esc(amount)}</b><span>${esc(f.purpose.pl)}${f.optional ? ' (opcjonalnie)' : ''}${f.outcome === 'unknown' ? ' · zależy od odpowiedzi' : ''}</span></div>${f.exemption?.outcome === 'unknown' ? `<p class="meta">${esc(maybeExempt(f))}</p>` : ''}${cite(f.quotes)}</article>`;
}
function deadlineRow(c, d) {
  const due = d.due ? `<b>${d.role === 'office' ? 'Urząd ma czas' : 'Termin'} ${esc(dueRange(d.due))}</b>` : '';
  const form = d.due ? '' : eventForm(c, d.from, `Liczy się od: ${eventLabel(c, d.from)}. Zapisz datę`);
  return `<article class="card"><p>${esc(d.description.pl)}</p>${due}${form}${d.outcome === 'unknown' ? '<p class="meta">Może Cię nie dotyczyć: zależy od odpowiedzi.</p>' : ''}${cite(d.quotes, 'Termin z przewodnika Formalki.')}</article>`;
}
function eventForm(c, type, label) {
  const outs = E.blueprint(c.bpId).events?.[type]?.outcomes;
  return `<form class="evform" data-event="${esc(type)}"><label class="meta" for="ev-${esc(type)}">${esc(label)}</label>
    <div class="evrow"><input id="ev-${esc(type)}" type="date" value="${S.clock.date}" required>
    ${outs ? `<select aria-label="Wynik">${outs.map((o) => `<option value="${esc(o)}">${o === 'granted' ? 'pozytywna' : o === 'refused' ? 'odmowa' : esc(o)}</option>`).join('')}</select>` : ''}
    <button class="btn btn-quiet btn-sm">Zapisz</button></div></form>`;
}
function officeHtml(o, c) {
  if (!o) return '';
  if (o.needsPlace) return `<p>Podaj miejscowość, a pokażę urząd z naszych źródeł. <button type="button" class="btn btn-ghost btn-sm" data-askplace="${c.id}">Podaj miejscowość</button></p>`;
  if (o.noneForPlace || !o.offices?.length) return `<p>${esc(E.msg.officeUnknown())}</p>`;
  const list = o.offices.slice(0, 3).map((x) => `<li><b>${esc(x.name.pl)}</b>${x.address ? `<span>${esc(x.address.value)}</span>` : ''}${x.openingHours ? `<span>${esc(x.openingHours.value)}</span>` : ''}
    ${x.website ? `<a href="${esc(x.website)}" target="_blank" rel="noopener noreferrer">Strona urzędu</a>` : ''}${x.booking ? ` · <a href="${esc(x.booking)}" target="_blank" rel="noopener noreferrer">Rezerwacja wizyty</a>` : ''}</li>`).join('');
  return `<ul class="offices">${list}</ul>${o.offices.length > 3 ? `<p class="meta">I jeszcze ${o.offices.length - 3} w tej miejscowości.</p>` : ''}`;
}
function notesHtml(notes, max = 3) {
  if (!notes?.length) return '';
  return `<details class="card notes"><summary>${icon('warning-circle')} Warto wiedzieć (${notes.length})</summary><ul class="bul">${notes.slice(0, max).map((n) => `<li>${esc(n.statement.value.pl)} ${n.statement.quotes?.length ? `<span class="src">${srcLink(n.statement.quotes)}</span>` : ''}</li>`).join('')}</ul>${notes.length > max ? `<p class="meta">Pozostałe w przewodniku Formalki.</p>` : ''}</details>`;
}

function focusView(c) {
  const p = plan(c);
  const l = focusLevel(c, p);
  const cur = currentLevel(p);
  const [i, n] = [p.levels.findIndex((x) => x.id === l.id) + 1, p.levels.length];
  const inHero = [];
  if (l.tasks.length) inHero.push(`<div class="mini-route" aria-hidden="true">${l.tasks.map((t, k) => `${k ? `<i class="${isDone(l.tasks[k - 1]) ? 'on' : ''}"></i>` : ''}<span class="md ${isDone(t) ? 'done' : ''}"></span>`).join('')}</div>`);
  inHero.push(`<p>${esc(levelLine(l))}</p>`);
  if (l.id !== cur.id) inHero.push(`<button type="button" class="btn btn-ghost-w btn-sm" data-focuslv="">Wróć do „${esc(cur.title.pl)}”</button>`);
  const sections = [];
  const stale = staleOf(p);
  if (stale) sections.push(`<p class="mock-note stale">${icon('warning-circle')}<span>${esc(stale.text)} <a href="${esc(stale.url)}" target="_blank" rel="noopener noreferrer">${esc(stale.label)}</a></span></p>`);
  if (l.tasks.length) sections.push(`<section class="sec"><h2 class="sec-h">Zadania</h2><ul class="list">${l.tasks.map((t, k) => taskRow(c, l, t, k)).join('')}</ul></section>`);
  if (l.fees.length) sections.push(`<section class="sec"><h2 class="sec-h">Opłaty</h2>${l.fees.map(feeRow).join('')}</section>`);
  const dls = shownDeadlines(c, l);
  if (dls.length) sections.push(`<section class="sec"><h2 class="sec-h">Terminy</h2>${dls.map((d) => deadlineRow(c, d)).join('')}</section>`);
  if (l.office) sections.push(`<section class="sec"><h2 class="sec-h">Gdzie</h2><article class="card">${officeHtml(l.office, c)}</article></section>`);
  const actions = [];
  if (c.state.approved && l.state !== 'unconfirmed' && l.state !== 'done' && (l.office || l.completesWith)) {
    const ev = c.state.events.find((e) => e.type === 'visit_planned' && e.level === l.id);
    actions.push(ev ? apptCard({ at: `${ev.date}T${ev.time}`, title: 'Wizyta w urzędzie', sub: 'Termin od Ciebie, nie z systemu urzędu', ic: 'buildings', c, visit: true })
      : `<div class="ap-act"><button type="button" class="btn btn-quiet" data-plan="visit|${l.id}">${icon('calendar-check')} Mam umówioną wizytę</button><button type="button" class="btn btn-quiet" data-plan="call|${l.id}">${icon('phone')} Przypomnij o telefonie</button></div>`);
  }
  if (l.completesWith && l.state !== 'done' && l.state !== 'locked' && l.state !== 'unconfirmed') actions.push(`<article class="card">${eventForm(c, l.completesWith, `Gdy to się stanie: ${eventLabel(c, l.completesWith)}`)}</article>`);
  const returns = l.id === cur.id && l.state === 'waiting_office' && canReturn(c, p);
  if (returns) actions.push(`<article class="card">${eventForm(c, 'request_delivered', 'Urząd prosi o uzupełnienie? Zapisz datę doręczenia pisma')}</article>`);
  if (l.state === 'returned') actions.push(`<button type="button" class="btn btn-accent btn-block" data-fixed="">${icon('check')} Uzupełnione i wysłane</button>`);
  if (actions.length) sections.push(`<section class="sec"><h2 class="sec-h">Twoje kroki</h2>${actions.join('')}</section>`);
  const par = l.parallelWith.map((id) => p.levels.find((x) => x.id === id)).filter(Boolean);
  if (par.length) sections.push(`<section class="sec"><h2 class="sec-h">Równolegle</h2>${par.map((x) => `<button type="button" class="tl-side" data-focuslv="${x.id}"><span class="tile-ic sm">${icon(levelIcon(x))}</span><span class="tx"><small>Możesz równolegle</small><b>${esc(x.title.pl)}</b><span>${esc(levelLine(x))}</span></span>${icon('caret-right', 'chev')}</button>`).join('')}</section>`);
  if (p.unsure.length) sections.push(`<section class="card"><h3>Do potwierdzenia</h3><ul class="open-list">${p.unsure.map((u) => `<li><span class="q">?</span><span>${esc(factOf(c, u.fact)?.question.pl ?? u.fact)}</span></li>`).join('')}</ul></section>`);
  if (l.notes?.length) sections.push(notesHtml(l.notes));
  const gd = l.id === cur.id && c.state.approved ? guidance(c) : null;
  const card = gd && gd.actions.length ? `<section class="assist" aria-label="${esc(c.who)} proponuje"><div class="assist-h">${avatar(c.who, 'sm', true)}<b>${esc(c.who)} proponuje</b></div>
    <p class="assist-t">${esc(gd.lines[1] || gd.lines[0])}</p>${actsHTML(c, gd.actions.slice(0, 4))}</section>` : '';
  return `${c.preview ? `<button type="button" class="maciek-banner" id="m-banner">${avatar(c.who)}<span class="tx"><b>Nowa wiadomość od ${esc(who(c.who).gen)}</b>${esc(c.preview)}</span>${icon('caret-right', 'chev')}</button>` : ''}
    <article class="hero" aria-labelledby="now-h"><div class="hero-top"><span class="glass-ic">${icon(levelIcon(l))}</span><span class="tx"><small>${l.id === cur.id ? 'Co teraz' : 'Poziom'} · ${i} z ${n}</small>${STATE[l.state] !== l.title.pl ? `<b>${esc(STATE[l.state])}</b>` : ''}</span></div>
      <h2 id="now-h">${esc(l.title.pl)}</h2>${inHero.join('')}</article>
    ${card}${sections.join('')}
    <button type="button" class="btn btn-quiet btn-block press" data-v2="map">${icon('map-trifold')} Zobacz całą mapę sprawy</button>`;
}

// The map as a timeline: a summary, then one card per level; parallel levels nest under their row.
function timeline(c, sheetMode = false) {
  const p = plan(c);
  const cur = c.state.approved ? currentLevel(p).id : null;
  const groups = levelGroups(p);
  const doneN = p.levels.filter((l) => l.state === 'done').length;
  const hl = S.highlight || [];
  const curIdx = Math.max(0, groups.findIndex((g) => [g.main, ...g.side].some((l) => l.id === cur)));
  const prog = groups.length > 1 ? Math.round((curIdx / (groups.length - 1)) * 100) : 0;
  const node = (l) => `<span class="tl-node ${l.implied ? 'implied' : l.state}${l.id === cur ? ' here' : ''}" aria-hidden="true">${icon(l.id === cur || l.implied ? levelIcon(l) : l.state === 'done' ? 'check' : ST_ICON[l.state] && l.state !== 'unconfirmed' ? ST_ICON[l.state] : levelIcon(l))}</span>`;
  const side = (l) => `<button type="button" class="tl-side ${l.state}${hl.includes(l.id) ? ' highlight' : ''}" data-lv="${l.id}">
      <span class="tile-ic sm">${icon(levelIcon(l))}</span><span class="tx"><small>Równolegle</small><b>${esc(l.title.pl)}</b><span>${esc(levelLine(l))}</span></span>${icon('caret-right', 'chev')}</button>`;
  const card = (l, k) => {
    if (l.id === cur) {
      const done = l.tasks.filter(isDone).length;
      return `<div class="tl-card now${hl.includes(l.id) ? ' highlight' : ''}"><span class="k">Poziom ${k} · teraz</span><b>${esc(l.title.pl)}</b><p>${esc(levelLine(l))}</p>
        ${l.tasks.length ? `<span class="prog" aria-hidden="true"><i style="width:${Math.round((done / l.tasks.length) * 100)}%"></i></span>` : ''}
        <span class="tl-act">${sheetMode ? '' : `<button type="button" class="btn btn-white btn-sm" data-focuslv="${l.id}">Przejdź do zadań</button>`}<button type="button" class="btn btn-ghost-w btn-sm" data-lv="${l.id}">Szczegóły</button></span></div>`;
    }
    return `<button type="button" class="tl-card ${l.state}${hl.includes(l.id) ? ' highlight' : ''}" data-lv="${l.id}"><span class="k">Poziom ${k}</span>
      <b>${esc(l.title.pl)}</b>${stateChip(l)}<span class="tl-text">${l.state === 'locked' ? icon('lock-simple') : ''}${esc(levelLine(l))}</span></button>`;
  };
  const fees = p.levels.flatMap((l) => l.fees).filter((f) => !f.optional && f.outcome === 'applies' && f.exemption?.outcome !== 'applies');
  const total = fees.reduce((s, f) => s + f.amountPln, 0);
  const office = p.levels.map((l) => l.office).find((o) => o?.offices?.length);
  const facts = [total ? `${icon('coins')}${total} zł opłat` : '', office ? `${icon('buildings')}${esc(office.offices[0].name.pl)}` : '', p.route.procedureId ? `${icon('signpost')}${esc(routeTitle(p))}` : ''].filter(Boolean);
  return `<section class="tl-sum">
      <span class="ring lg" role="img" aria-label="Zrobione poziomy: ${doneN} z ${p.levels.length}"><svg viewBox="0 0 64 64"><circle class="bg" cx="32" cy="32" r="27" fill="none" stroke-width="6"/><circle class="fg" cx="32" cy="32" r="27" fill="none" stroke-width="6" pathLength="1" stroke-dasharray="1" style="stroke-dashoffset:${1 - doneN / p.levels.length}"/></svg><span>${doneN}/${p.levels.length}</span></span>
      <span class="tx"><small>${c.state.approved ? 'Twoja sprawa' : 'Plan w budowie'}</small><b>${esc(c.title)}</b><span>${cur ? `Teraz: ${esc(p.levels.find((l) => l.id === cur).title.pl)}` : 'Poziomy z przerywaną linią zależą od odpowiedzi'}</span></span>
    </section>
    ${facts.length ? `<div class="facts">${facts.map((f) => `<span>${f}</span>`).join('')}</div>` : ''}
    <ol class="tl" style="--prog:${prog}%" aria-label="Poziomy sprawy po kolei">${groups.map((g, k) => `<li class="tl-item" style="animation-delay:${k * 70}ms">${node(g.main)}<div class="tl-body">${card(g.main, k + 1)}${g.side.map(side).join('')}</div></li>`).join('')}</ol>
    <p class="meta">Kłódka pojawia się tylko tam, gdzie kolejność wynika z procedury. Każdy poziom można otworzyć i przeczytać. Kwoty i terminy to przykłady z przewodników Formalki (${esc(E.registryVersion)}).</p>`;
}
function mapView(c) {
  return `${timeline(c)}<button type="button" class="btn btn-ghost" id="map-help">${icon('question')} Co znaczą stany poziomów</button>`;
}
const legend = () => `<ul class="legend" aria-label="Legenda stanów">${['available', 'in_progress', 'locked', 'waiting_office', 'unconfirmed', 'returned', 'done'].map((s) => `<li>${chip(s)}</li>`).join('')}</ul>`;

function openLevel(c, id) {
  const p = plan(c);
  const l = p.levels.find((x) => x.id === id);
  if (!l) return;
  const canGo = c.state.approved && l.order > 0 && l.state !== 'unconfirmed';
  sheet(l.title.pl, `<div style="display:flex;gap:var(--s3);align-items:center"><span class="tile-ic">${icon(levelIcon(l))}</span>${stateChip(l)}</div>
    ${l.reason ? `<p class="mock-note">${icon(l.state === 'locked' ? 'lock-simple' : 'info')}<span>${esc(l.reason.text.pl)}</span></p>` : ''}
    <p>${esc(levelLine(l))}.</p>
    ${l.tasks.length ? `<section class="sec"><h3 class="sec-h">Zadania</h3><ul class="bul">${l.tasks.map((t) => `<li>${esc(cap(t.title.pl))}${isDone(t) ? ' (gotowe)' : ''}</li>`).join('')}</ul></section>` : ''}
    ${l.fees.map(feeRow).join('')}${shownDeadlines(c, l).map((d) => `<article class="card"><p>${esc(d.description.pl)}</p>${d.due ? `<b>${esc(dueRange(d.due))}</b>` : `<p class="meta">Liczy się od: ${esc(eventLabel(c, d.from))}</p>`}${cite(d.quotes, 'Termin z przewodnika Formalki.')}</article>`).join('')}
    ${l.office ? `<article class="card">${officeHtml(l.office, c)}</article>` : ''}${notesHtml(l.notes, 6)}
    ${canGo ? `<button type="button" class="btn btn-accent btn-block" id="lv-go">Przejdź do tego poziomu</button>` : ''}`, (sh) => {
    const g = $('#lv-go', sh); if (g) g.onclick = () => { closeLayer(); c.focus = id; S.view = 'focus'; S.active = c.id; if (S.screen === 'case') drawCase(); else go('case', 'fwd'); };
    wireActions(sh, c);
  });
}
function openMapSheet(c) {
  sheet('Mapa sprawy', `<div class="stack" style="padding-block:0">${timeline(c, true)}</div>`, (sh) => {
    $$('[data-lv]', sh).forEach((b) => { b.onclick = () => openLevel(c, b.dataset.lv); });
  });
}

/* ── History and what the assistant will do by itself ─────────────────────── */
function openHistory(c) {
  if (!c) return;
  const body = () => {
    const upcoming = agendaFor(c).slice(0, 6);
    return `<div class="switch-row"><button type="button" class="switch" role="switch" aria-checked="${c.prefs.consent}" id="h-consent" aria-labelledby="h-consent-l"></button>
      <span class="switch-label" id="h-consent-l"><b>Pomoc z wyprzedzeniem</b>${esc(c.who)} ${c.prefs.consent ? `może ${who(c.who).sam} dodawać przypomnienia i wpisy w kalendarzu do tej sprawy.` : 'nie wysyła powiadomień; przypomnienia zostają w aplikacji.'}</span></div>
    <div class="switch-row"><button type="button" class="switch" role="switch" aria-checked="${c.prefs.lockScreenDetail}" id="h-detail" aria-labelledby="h-detail-l"></button>
      <span class="switch-label" id="h-detail-l"><b>Temat sprawy na ekranie blokady</b>${c.prefs.lockScreenDetail ? 'Widoczny.' : 'Ukryty (domyślnie): na ekranie blokady tylko ogólny tekst.'}</span></div>
    <section class="sec"><h3 class="sec-h">Co ${esc(c.who)} zrobi ${who(c.who).sam}</h3>${upcoming.length ? `<ul class="agenda">${upcoming.map((it) => `<li class="ag"><span class="tile-ic">${icon(AGENDA_ICON[it.kind] || 'bell')}</span><span class="tx"><b>${esc(AGENDA_TITLE[it.kind] || it.kind)}</b><span>${it.channel === 'notification' ? 'Powiadomienie' : 'W aplikacji'} · ${dshort(it.fireAt.slice(0, 10))}</span></span><span class="time">${hm(it.fireAt.slice(11, 16))}</span></li>`).join('')}</ul>` : '<p class="meta">Na razie nic. Zapisz datę, od której liczy się termin, albo zaplanuj wizytę.</p>'}</section>
    <section class="sec"><h3 class="sec-h">Co ${esc(c.who)} pamięta w tej sesji</h3>${c.memory.length ? `<ul class="bul">${c.memory.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>` : '<p class="meta">Na razie nic poza odpowiedziami w planie.</p>'}
      <p class="meta">Tylko na tym telefonie i tylko do odświeżenia strony albo resetu: prototyp niczego nie zapisuje na stałe. Nic z tego nie jest nigdzie wysyłane.</p></section>
    <section class="sec"><h3 class="sec-h">Historia</h3><ul class="list">${c.history.map((e, i) => `<li class="row${e.revoked ? ' revoked' : ''}"><span class="sq">${e.by === 'you' ? icon('user') : avatar(c.who, 'sm')}</span><span class="tx"><b>${esc(e.text)}</b><span class="meta">${e.by === 'you' ? 'Ty' : esc(c.who)} · ${dshort(e.at.slice(0, 10))} ${hm(e.at.slice(11, 16))}${e.revoked ? ' · cofnięte' : ''}</span></span>${e.event && !e.revoked ? `<button type="button" class="btn btn-quiet btn-sm" data-undo="${i}">Cofnij</button>` : ''}</li>`).join('')}</ul></section>`;
  };
  const wire = (sh) => {
    $('#h-consent', sh).onclick = () => { c.prefs.consent = !c.prefs.consent; logAct(c, c.prefs.consent ? 'Pomoc z wyprzedzeniem włączona' : 'Pomoc z wyprzedzeniem wyłączona'); $('.sheet-body', sh).innerHTML = body(); wire(sh); };
    $('#h-detail', sh).onclick = () => { c.prefs.lockScreenDetail = !c.prefs.lockScreenDetail; $('.sheet-body', sh).innerHTML = body(); wire(sh); };
    $$('[data-undo]', sh).forEach((b) => { b.onclick = () => {
      const e = c.history[+b.dataset.undo];
      e.revoked = true;
      c.state.events = c.state.events.filter((x) => x.id !== e.event);
      toast('Cofnięte. Przypomnienia z tym związane znikają.', 'arrow-counter-clockwise');
      $('.sheet-body', sh).innerHTML = body(); wire(sh);
      if (S.screen !== 'chat') render();
    }; });
  };
  sheet(`Historia: ${c.title}`, body(), wire);
}

/* ── Calendar ──────────────────────────────────────────────────────────────── */
function calendarScreen() {
  const all = entries();
  const [y, m] = (S.calMonth || S.clock.date).split('-').map(Number);
  const sel = S.calSel || S.clock.date;
  const first = isoOf(y, m - 1, 1);
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const lead = (wd(first) + 6) % 7;
  const cells = [];
  for (let k = 0; k < lead; k++) cells.push('<span class="mday empty"></span>');
  for (let d = 1; d <= days; d++) {
    const iso = isoOf(y, m - 1, d);
    const n = all.filter((e) => e.at.slice(0, 10) === iso).length;
    cells.push(`<button type="button" class="mday${iso === S.clock.date ? ' today' : ''}${n ? ' has' : ''}${iso === sel ? ' sel' : ''}" data-d="${iso}" aria-label="${d} ${MON_G[m - 1]}${n ? `, wpisów: ${n}` : ''}">${d}${n > 1 ? `<span class="n">${n}</span>` : ''}</button>`);
  }
  const dayE = all.filter((e) => e.at.slice(0, 10) === sel);
  const later_ = all.filter((e) => !e.past && e.at.slice(0, 10) > sel).slice(0, 8);
  const row = (e, i) => `<li class="ag${e.past ? ' past' : ''}" style="animation-delay:${i * 50}ms"><span class="tile-ic">${icon(e.ic)}</span><span class="tx"><b>${esc(e.title)}</b><span>${esc(e.sub)}${e.c ? ` · ${esc(e.c.title)}` : ''} · ${dshort(e.at.slice(0, 10))}</span></span><span class="time">${hm(e.at.slice(11, 16))}</span>${e.custom ? `<button type="button" class="circle-btn flat sm" data-del="${e.custom}" aria-label="Usuń przypomnienie ${esc(e.title)}">${icon('x')}</button>` : ''}</li>`;
  const el = h(`<section class="screen calendar"><div class="scroll pad"><div class="stack">
    <div class="greet"><span class="tx"><small>Wszystkie sprawy</small><b class="page-title">Kalendarz</b></span><button type="button" class="circle-btn" id="cal-add" aria-label="Dodaj przypomnienie">${icon('plus')}</button></div>
    <div class="month"><div class="month-head"><button type="button" class="circle-btn flat" id="m-prev" aria-label="Poprzedni miesiąc">${icon('caret-left')}</button><b>${MON_N[m - 1]} ${y}</b><button type="button" class="circle-btn flat" id="m-next" aria-label="Następny miesiąc">${icon('caret-right')}</button></div>
      <div class="mgrid">${['P', 'W', 'Ś', 'C', 'P', 'S', 'N'].map((w) => `<span class="wd" aria-hidden="true">${w}</span>`).join('')}${cells.join('')}</div></div>
    <section class="sec"><div class="sec-head"><h2 class="sec-h">${sel === S.clock.date ? 'Dziś' : esc(dday(sel))}</h2><span class="meta">wpisy: ${dayE.length}</span></div>
      ${dayE.length ? `<ul class="agenda">${dayE.map(row).join('')}</ul>` : '<p class="meta">Nic na ten dzień.</p>'}
      <button type="button" class="btn btn-quiet btn-block press" id="cal-add2">${icon('plus')} Dodaj przypomnienie${sel === S.clock.date ? ' na dziś' : `: ${esc(dshort(sel))}`}</button></section>
    ${later_.length ? `<section class="sec"><h2 class="sec-h">Później</h2><ul class="agenda">${later_.map(row).join('')}</ul></section>` : ''}
    <p class="meta">Wpisy asystenta pochodzą z planu sprawy (dni wolne i godziny ciszy liczy silnik). Twoje przypomnienia dodajesz plusem. W prototypie nic nie trafia do kalendarza telefonu.</p>
  </div></div></section>`);
  $$('[data-d]', el).forEach((b) => { b.onclick = () => { S.calSel = b.dataset.d; render(); }; });
  $('#m-prev', el).onclick = () => { S.calMonth = isoOf(m === 1 ? y - 1 : y, (m + 10) % 12, 1); render(); };
  $('#m-next', el).onclick = () => { S.calMonth = isoOf(m === 12 ? y + 1 : y, m % 12, 1); render(); };
  $('#cal-add', el).onclick = () => addReminder(sel);
  $('#cal-add2', el).onclick = () => addReminder(sel);
  $$('[data-del]', el).forEach((b) => { b.onclick = () => { S.custom = S.custom.filter((x) => x.id !== b.dataset.del); toast('Przypomnienie usunięte.', 'arrow-counter-clockwise'); render(); }; });
  return el;
}
// The person's own reminder: what, which case, which day, what time.
function addReminder(sel) {
  const days = [...Array(14)].map((_, i) => isoAdd(S.clock.date, i));
  let pick = Math.max(0, days.indexOf(sel));
  let cs = C()?.id || S.cases[0]?.id || '';
  sheet('Nowe przypomnienie', `<form id="rem-form" class="stack" style="padding-block:0;gap:var(--s4)" novalidate>
      <div class="field"><label for="rem-t">Co przypomnieć</label><input id="rem-t" name="t" placeholder="Na przykład: odebrać tłumaczenie" autocomplete="off" maxlength="80"><span class="err" hidden>Wpisz, o czym przypomnieć.</span></div>
      <div class="field"><span class="flabel">Sprawa</span><div class="opts" id="rem-c">${[...S.cases.map((c) => [c.id, c.title]), ['', 'Bez sprawy']].map(([id, t]) => `<button type="button" class="chip chip-sm${id === cs ? ' picked' : ''}" data-c="${id}" aria-pressed="${id === cs}">${esc(t)}</button>`).join('')}</div></div>
      <div class="field"><span class="flabel">Dzień</span><div class="days" id="rem-d">${days.map((d, i) => `<button type="button" class="chip chip-day${i === pick ? ' picked' : ''}" data-i="${i}" aria-pressed="${i === pick}" aria-label="${esc(dday(d))}"><small>${DS[wd(d)]}</small><b>${Number(d.slice(8))}</b><small>${MON_S[Number(d.slice(5, 7)) - 1]}</small></button>`).join('')}</div></div>
      <div class="field"><label for="rem-h">Godzina</label><input id="rem-h" name="h" type="time" value="09:00" required></div>
      <p class="meta">W prototypie to symulacja: wpis pojawi się w zakładce Kalendarz, nie w kalendarzu telefonu.</p>
      <button type="submit" class="btn btn-accent btn-block btn-knob press"><span class="knob">${icon('bell')}</span>Dodaj przypomnienie</button></form>`, (sh) => {
    const pickIn = (wrap, attr, cb) => $$(`[data-${attr}]`, wrap).forEach((b) => { b.onclick = () => { $$('.chip', wrap).forEach((x) => { x.classList.remove('picked'); x.setAttribute('aria-pressed', 'false'); }); b.classList.add('picked'); b.setAttribute('aria-pressed', 'true'); cb(b.dataset[attr]); }; });
    pickIn($('#rem-c', sh), 'c', (v) => { cs = v; });
    pickIn($('#rem-d', sh), 'i', (v) => { pick = +v; });
    $('#rem-d .picked', sh)?.scrollIntoView({ inline: 'center', block: 'nearest' });
    $('#rem-form', sh).onsubmit = (e) => {
      e.preventDefault();
      const t = $('#rem-t', sh).value.trim();
      if (!t) { $('.err', sh).hidden = false; $('#rem-t', sh).focus(); return; }
      const time = /^\d\d:\d\d$/.test($('#rem-h', sh).value) ? $('#rem-h', sh).value : '09:00';
      const at = `${days[pick]}T${time}`;
      S.custom.push({ id: `r${++S.seq}`, title: t, at, c: cs || null });
      const c = caseById(cs);
      if (c) logAct(c, `Twoje przypomnienie: ${t}, ${dday(days[pick])}, ${hm(time)}`);
      S.calSel = days[pick]; S.calMonth = days[pick];
      closeLayer();
      toast(`Przypomnienie dodane: ${dshort(days[pick])}, ${hm(time)}`, 'bell');
      if (S.screen === 'calendar') render();
    };
    $('#rem-t', sh).focus();
  });
}

/* ── Teczka: the documents of each case as one checklist, plus saved drafts ── */
function teczkaScreen() {
  const sections = S.cases.filter((c) => c.state.approved || c.files.length).map((c) => {
    const p = plan(c);
    const docs = p.levels.flatMap((l) => l.tasks.filter((t) => t.kind === 'document').map((t) => ({ t, l })));
    const groups = [];
    for (const d of docs) {
      const g = groups.find((x) => x.some((y) => y.t.alternatives?.includes(d.t.id) || d.t.alternatives?.includes(y.t.id)));
      if (g) g.push(d); else groups.push([d]);
    }
    const ready = groups.filter((g) => g.some((d) => isDone(d.t))).length;
    const fees = p.levels.flatMap((l) => l.fees).filter((f) => !f.optional && f.outcome === 'applies' && f.exemption?.outcome !== 'applies');
    const total = fees.reduce((s, f) => s + f.amountPln, 0);
    const rows = groups.map((g) => `<li class="doc-row${g.some((d) => isDone(d.t)) ? ' ok' : ''}">${g.map(({ t, l }, k) => `${k ? '<span class="albo">albo</span>' : ''}<span class="dr"><span class="tx"><b>${esc(cap(t.title.pl))}</b><span class="meta">${esc(l.title.pl)}${t.quotes?.length ? ` · ${srcLink(t.quotes)}` : ''}</span></span>
        ${l.state === 'unconfirmed' ? '' : `<button type="button" class="chip chip-sm${isDone(t) ? ' picked' : ''}" data-task="${esc(t.id)}" data-case="${c.id}" data-st="${isDone(t) ? 'todo' : 'done'}" aria-pressed="${isDone(t)}">${isDone(t) ? 'Mam' : 'Mam?'}</button>`}</span>`).join('')}</li>`).join('');
    return `<section class="sec teczka-case"><div class="sec-head"><h2 class="sec-h">${esc(c.title)}</h2><span class="meta">${groups.length ? `gotowe ${ready} z ${groups.length}` : ''}</span></div>
      ${c.files.length ? `<div class="docs">${c.files.map((f, i) => `<button type="button" class="doc press" data-file="${c.id}|${i}"><span class="tile-ic">${icon(f.icon)}</span><b>${esc(f.name)}</b><span>${esc(f.kind)}<br>${dshort(f.at.slice(0, 10))}</span></button>`).join('')}</div>` : ''}
      ${rows ? `<ul class="doc-list">${rows}</ul>` : '<p class="meta">Ta sprawa nie wymaga dokumentów albo zależą one od odpowiedzi.</p>'}
      ${total ? `<p class="meta">Opłaty w tej sprawie: <b>${total} zł</b> (przykład z przewodnika).</p>` : ''}</section>`;
  }).join('');
  const el = h(`<section class="screen teczka"><div class="scroll pad"><div class="stack">
    <div class="greet"><span class="tx"><small>Tylko na tym telefonie</small><b class="page-title">Teczka</b></span></div>
    ${sections || `<div class="empty-state"><span class="tile-ic">${icon('folder-simple')}</span><b>Teczka jest pusta</b><p class="meta">Po zatwierdzeniu planu zobaczysz tu listę dokumentów do sprawy.</p></div>`}
    <p class="meta">To lista do odhaczania. Niczego nie wgrywasz; dokumenty zostają u Ciebie. W prototypie Teczka znika po resecie.</p></div></div></section>`);
  wireActions(el);
  $$('[data-file]', el).forEach((b) => { b.onclick = () => { const [cid, i] = b.dataset.file.split('|'); const f = caseById(cid).files[+i]; sheet(f.name, `<p class="meta">${esc(f.kind)}</p><ul class="list">${f.fields.map(([k, v]) => `<li class="row"><span class="tx"><span class="meta">${esc(k)}</span><b>${esc(v)}</b></span></li>`).join('')}</ul>`); }; });
  return el;
}

/* ── Actions shared by Start, Teraz, Teczka and sheets ─────────────────────── */
function setTask(c, id, st) {
  if (st === 'todo') delete c.state.tasks[id]; else c.state.tasks[id] = st;
  touch(c);
  const t = plan(c).levels.flatMap((l) => l.tasks).find((x) => x.id === id);
  if (t && st !== 'todo') logAct(c, `${st === 'done' ? 'Masz' : 'Nie dotyczy'}: ${cap(t.title.pl)}`);
}
function recordEvent(c, type, date, outcome) {
  const before = plan(c);
  const ev = { id: `e${++S.seq}`, type, date, by: 'user', ...(outcome ? { outcome } : {}) };
  c.state.events.push(ev);
  touch(c);
  logAct(c, `${eventLabel(c, type)}: ${dday(date)}`, { event: ev.id });
  const ch = mapChange(before, plan(c));
  const cur = currentLevel(plan(c));
  toast(`Zapisane. Teraz: ${cur.title.pl}`, 'check-circle-fill');
  S.highlight = ch.ids;
}
function wireActions(root, ctx = null) {
  const caseOf = (b) => ctx || caseById(b.dataset.case) || C();
  $$('[data-task]', root).forEach((b) => { b.onclick = () => { const c = caseOf(b); b.classList.toggle('is-done'); setTask(c, b.dataset.task, b.dataset.st); later(380, () => afterChange(c)); }; });
  $$('[data-form]', root).forEach((b) => { b.onclick = () => { const [cid, tid] = b.dataset.form.split('|'); openForm(caseById(cid), tid); }; });
  $$('[data-crosscase]', root).forEach((b) => { b.onclick = () => { const id = b.dataset.crosscase; const ex = S.cases.find((x) => x.bpId === id); if (ex) openCase(ex.id); else runFlow('case', () => startCase(id)); }; });
  $$('[data-focuslv]', root).forEach((b) => { b.onclick = () => { const c = caseOf(b); c.focus = b.dataset.focuslv || null; S.view = 'focus'; closeLayer(); drawCase(); }; });
  $$('[data-lv]', root).forEach((b) => { b.onclick = () => openLevel(caseOf(b), b.dataset.lv); });
  $$('[data-v2]', root).forEach((b) => { b.onclick = () => { S.view = b.dataset.v2; drawCase(); }; });
  $$('[data-plan]', root).forEach((b) => { b.onclick = () => { const [kind, lv] = b.dataset.plan.split('|'); planTime(caseOf(b), kind, lv); }; });
  $$('[data-askplace]', root).forEach((b) => { b.onclick = () => pickPlace(caseById(b.dataset.askplace)); });
  $$('[data-fixed]', root).forEach((b) => { b.onclick = () => { const c = caseOf(b); recordEvent(c, 'fix_submitted', S.clock.date); afterChange(c); }; });
  $$('form[data-event]', root).forEach((f) => { f.onsubmit = (e) => {
    e.preventDefault();
    const date = $('input[type=date]', f).value;
    if (!/^\d{4}-\d\d-\d\d$/.test(date)) { $('input[type=date]', f).focus(); return; }
    const c = caseOf(f);
    recordEvent(c, f.dataset.event, date, $('select', f)?.value);
    closeLayer();
    afterChange(c);
  }; });
  $$('[data-do]', root).forEach((b) => { b.onclick = () => doAction(b.dataset.do); });
  const mh = $('#map-help', root); if (mh) mh.onclick = () => sheet('Stany poziomów', `${legend()}<p class="meta">Gra tylko porządkuje sprawę: nie ma punktów ani odznak. Kłódki są tylko tam, gdzie przewodnik wymaga kolejności.</p>`);
  const mb = $('#m-banner', root); if (mb) mb.onclick = () => go('chat', 'fwd');
  wireSwipes(root);
}
// After any change from a screen: the assistant notes a new step in the chat, then the screen redraws.
function afterChange(c = C()) {
  if (c) postGuide(c);
  if (S.screen === 'case') drawCase();
  else if (S.screen !== 'chat') render();
  else {
    drawStatus($('.status-slot'));
    if (c?.pending === 'call' && !S.flow) runFlow('call', () => callFlow(c)); else idleDock();
  }
}
function wireSwipes(root) {
  $$('.swipe', root).forEach((sw) => {
    const knob = $('.knob', sw), fill = $('.fill', sw);
    let x0 = null, dx = 0, max = 0, moved = false, doneOnce = false;
    const finish = () => {
      if (doneOnce) return; doneOnce = true;
      sw.classList.add('snap', 'ok');
      knob.style.transform = `translateX(${sw.clientWidth - 60}px)`; fill.style.width = '100%';
      knob.innerHTML = icon('check'); $('.lbl', sw).textContent = 'Zrobione';
      const [cid, tid] = sw.dataset.swipe.split('|');
      later(650, () => { const c = caseById(cid); setTask(c, tid, 'done'); toast('Odhaczone.'); afterChange(c); });
    };
    knob.onpointerdown = (e) => { x0 = e.clientX; dx = 0; moved = false; max = sw.clientWidth - 60; knob.setPointerCapture(e.pointerId); sw.classList.remove('snap'); };
    knob.onpointermove = (e) => { if (x0 == null) return; dx = Math.max(0, Math.min(max, e.clientX - x0)); if (dx > 6) moved = true; knob.style.transform = `translateX(${dx}px)`; fill.style.width = `${dx + 60}px`; };
    knob.onpointerup = () => { if (x0 == null) return; x0 = null; if (!moved || dx > max * 0.75) finish(); else { sw.classList.add('snap'); knob.style.transform = ''; fill.style.width = ''; } };
    knob.onclick = (e) => { if (e.detail === 0) finish(); };
  });
}
function pickPlace(c) {
  sheet('Twoja miejscowość', `<p class="meta">Tylko po to, by wskazać urząd. Miejscowość zostaje na Twoim telefonie.</p>
    <div class="opts">${PLACES.map((x) => `<button type="button" class="chip" data-pl="${x.teryt}">${esc(x.name)}</button>`).join('')}<button type="button" class="chip chip-dk" data-pl="">Inna albo wolę nie podawać</button></div>`, (sh) => {
    $$('[data-pl]', sh).forEach((b) => { b.onclick = () => {
      const pl = PLACES.find((x) => x.teryt === b.dataset.pl);
      c.placeAsked = true;
      if (pl) { c.state.place = { teryt: pl.teryt, name: pl.name }; logAct(c, `Miejscowość: ${pl.name}`); }
      closeLayer(); afterChange(c);
    }; });
  });
}

// A planned visit or a call reminder: day and hour, then an approval card. Never a booking claim.
function planTime(c, kind, levelId) {
  const days = [1, 2, 3, 4, 5].map((n) => isoAdd(S.clock.date, n));
  let pick = kind === 'visit' ? 2 : 0;
  const times = hours(['09:00', '10:30', '12:00', '14:00', '16:00']);
  let time = S.learned.hour || (kind === 'visit' ? '10:30' : '12:00');
  sheet(kind === 'visit' ? 'Twoja wizyta w urzędzie' : 'Przypomnienie o telefonie', `<p class="meta">${kind === 'visit' ? 'Wpisz termin, który masz umówiony. Ja go nie rezerwuję.' : esc(E.msg.cannotBook())}</p>
    <div class="field"><span class="flabel">Dzień</span><div class="days" id="pt-d">${days.map((d, i) => `<button type="button" class="chip chip-day${i === pick ? ' picked' : ''}" data-i="${i}" aria-pressed="${i === pick}" aria-label="${esc(dday(d))}"><small>${DS[wd(d)]}</small><b>${Number(d.slice(8))}</b><small>${MON_S[Number(d.slice(5, 7)) - 1]}</small></button>`).join('')}</div></div>
    <div class="field"><span class="flabel">Godzina${S.learned.hour ? `<small> · podpowiadam ${hm(S.learned.hour)}, jak ostatnio</small>` : ''}</span><div class="opts" id="pt-t">${times.map((t) => `<button type="button" class="chip chip-time${t === time ? ' picked' : ''}" data-t="${t}" aria-pressed="${t === time}">${hm(t)}</button>`).join('')}</div></div>
    <button type="button" class="btn btn-accent btn-block btn-knob press" id="pt-ok"><span class="knob">${icon(kind === 'visit' ? 'calendar-check' : 'bell')}</span>${kind === 'visit' ? 'Zapisz wizytę' : 'Dodaj przypomnienie'}</button>`, (sh) => {
    const pickIn = (wrap, attr, cb) => $$(`[data-${attr}]`, wrap).forEach((b) => { b.onclick = () => { $$('.chip', wrap).forEach((x) => { x.classList.remove('picked'); x.setAttribute('aria-pressed', 'false'); }); b.classList.add('picked'); b.setAttribute('aria-pressed', 'true'); cb(b.dataset[attr]); }; });
    pickIn($('#pt-d', sh), 'i', (v) => { pick = +v; });
    pickIn($('#pt-t', sh), 't', (v) => { time = v; });
    $('#pt-ok', sh).onclick = () => {
      const date = days[pick];
      const ev = { id: `e${++S.seq}`, type: kind === 'visit' ? 'visit_planned' : 'call_planned', date, time, level: levelId, by: 'user' };
      c.state.events.push(ev); touch(c);
      logAct(c, kind === 'visit' ? `Wizyta w urzędzie: ${dday(date)}, ${hm(time)} (termin od Ciebie)` : `Przypomnienie o telefonie: ${dday(date)}, ${hm(time)}`, { event: ev.id });
      learnHour(c, time);
      closeLayer();
      const lv = plan(c).levels.find((l) => l.id === levelId);
      const A = [{ kind: 'teczka', label: 'Co zabrać: Teczka', ic: 'folder-simple' }];
      if (lv?.office?.offices?.length) A.unshift({ kind: 'offices', levelId, label: kind === 'visit' ? 'Adres i mapa' : 'Urzędy i godziny', ic: 'map-pin' });
      addMsg('bot', `<p>${esc(E.msg.reminderAdded(date, time, kind))}</p>${actsHTML(c, A)}`, c);
      toast(kind === 'visit' ? 'Wizyta zapisana. Tester: możesz przewinąć czas.' : 'Przypomnienie dodane. Wizyta nie jest zarezerwowana.', kind === 'visit' ? 'calendar-check' : 'bell');
      afterChange(c);
    };
  });
}

// After the form: the assistant offers the call reminder in the chat (brief §2.8, §3.7).
async function callFlow(c) {
  c.pending = null; c.preview = '';
  const p = plan(c);
  const l = p.levels.find((x) => x.state !== 'done' && (x.office || x.completesWith));
  if (!l) return;
  await say(c, `Wniosek, na razie szkic z makiety, jest w Teczce. Następny krok w urzędzie: „${esc(l.title.pl)}”.`);
  await say(c, esc(E.msg.cannotBook()));
  const days = [1, 2].map((n) => isoAdd(S.clock.date, n));
  const d = await ask({ c, q: 'Na który dzień przypomnienie?', dk: false, anyWhen: 'day', placeholder: 'Albo napisz, na przykład: w środę',
    options: [...days.map((x) => ({ label: dday(x), value: x, day: [DS[wd(x)], String(Number(x.slice(8))), MON_S[Number(x.slice(5, 7)) - 1]] })), { label: 'Nie teraz', value: '', no: true }] });
  const later_ = [{ kind: 'call', levelId: l.id, label: 'Przypomnij o telefonie', ic: 'phone' }, { kind: 'visit', levelId: l.id, label: 'Mam umówioną wizytę', ic: 'calendar-check' }];
  if (!d.value) { await say(c, `<p>Dobrze. Wrócisz do tego, kiedy zechcesz.</p>${actsHTML(c, later_)}`); return; }
  const t = await ask({ c, q: 'O której?', dk: false, anyWhen: 'time', placeholder: 'Albo napisz, na przykład: o 10:30', options: hours(['09:00', '12:00', '15:00']).map((x) => ({ label: hm(x), value: x, time: true })) });
  const ok = await approve({ c, ic: 'phone', title: 'Zadzwoń do urzędu', sub: `Przypomnienie: ${dday(d.value)}, ${hm(t.value)}`, note: 'To tylko przypomnienie. Wizyty nie rezerwuję, bo nie mogę.', yes: 'Dodaj', no: 'Nie dodawaj' });
  if (!ok) { await say(c, `<p>Nie dodaję. Krok zostaje w planie.</p>${actsHTML(c, later_)}`); return; }
  const ev = { id: `e${++S.seq}`, type: 'call_planned', date: d.value, time: t.value, level: l.id, by: 'user' };
  c.state.events.push(ev); touch(c);
  logAct(c, `Przypomnienie o telefonie: ${dday(d.value)}, ${hm(t.value)}`, { event: ev.id });
  learnHour(c, t.value);
  await say(c, esc(E.msg.reminderAdded(d.value, t.value, 'call')));
  const v = await ask({ c, q: 'Gdy umówisz wizytę, wpisz mi jej termin. Przypomnę, co zabrać.', dk: false, options: [{ label: 'Mam już termin', value: 'yes', yes: true }, { label: 'Później', value: '', no: true }] });
  if (!v.value) { await say(c, `<p>Dobrze. Gdy będziesz mieć termin, wpisz go tutaj.</p>${actsHTML(c, [later_[1]])}`); toast('Tester: możesz przewinąć czas.', 'fast-forward'); return; }
  const vd = isoAdd(S.clock.date, 3);
  const vt = await ask({ c, q: `Wizyta: ${dday(vd)}. O której?`, why: 'W prototypie jest tylko ten dzień, żeby przewinięcie czasu o 3 dni na niego trafiło.', dk: false, anyWhen: 'time',
    placeholder: 'Albo napisz, na przykład: o 11', options: hours(['09:00', '10:30', '13:00']).map((x) => ({ label: hm(x), value: x, time: true })) });
  learnHour(c, vt.value);
  const vev = { id: `e${++S.seq}`, type: 'visit_planned', date: vd, time: vt.value, level: l.id, by: 'user' };
  c.state.events.push(vev);
  logAct(c, `Wizyta w urzędzie: ${dday(vd)}, ${hm(vt.value)} (termin od Ciebie)`, { event: vev.id });
  const A = [{ kind: 'teczka', label: 'Co zabrać: Teczka', ic: 'folder-simple', primary: true }];
  if (l.office?.offices?.length) A.push({ kind: 'offices', levelId: l.id, label: 'Adres i mapa', ic: 'map-pin' });
  A.push({ kind: 'calendar', label: 'Kalendarz', ic: 'calendar-dots' });
  await say(c, `<p>${esc(E.msg.reminderAdded(vd, vt.value, 'visit'))}</p>${c.prefs.consent ? `<p>Mam Twoją zgodę, więc ${who(c.who).sam} dodam przypomnienia przed wizytą. Zobaczysz je w Kalendarzu i w historii sprawy.</p>` : ''}${actsHTML(c, A)}`);
  toast('Tester: możesz teraz przewinąć czas o 3 dni.', 'fast-forward');
}

/* ── Official form, as a labelled mock (real PDF filling is proven in spike S3) ── */
function openForm(c, taskId) {
  const t = plan(c).levels.flatMap((l) => l.tasks).find((x) => x.id === taskId);
  if (!c || !t) return;
  const p = plan(c);
  const answers = p.assumptions.map((a) => { const f = factOf(c, a.fact); return [f?.question.pl ?? a.fact, f?.options?.find((o) => o.value === a.value)?.label.pl ?? String(a.value)]; });
  const layer = $('#layer');
  layer.innerHTML = `<div class="full" role="dialog" aria-modal="true" aria-labelledby="form-h">
    <header class="appbar pad"><button type="button" class="circle-btn" id="form-close" aria-label="Zamknij">${icon('x')}</button><span class="ttl"><b id="form-h">${esc(t.officialName || cap(t.title.pl))}</b><span>Makieta formularza</span></span></header>
    <div class="scroll pad"><div class="stack">
    <p class="mock-note">${icon('info')}<span><b>Makieta, nie oficjalny formularz.</b> ${esc(t.description?.pl || '')} Wypełnianie prawdziwych PDF sprawdzamy osobno (spike S3). Wpisuj dane przykładowe.${t.quotes?.length ? ` Źródło: ${srcLink(t.quotes)}.` : ''}</span></p>
    <form id="mock-form" novalidate style="display:flex;flex-direction:column;gap:var(--s4)">
      <section class="form-sec"><h2>Dane osoby</h2>
        <div class="field"><label for="f-name">Imię</label><input id="f-name" name="name" autocomplete="off"><span class="err" hidden>Wpisz imię.</span></div>
        <div class="field"><label for="f-sur">Nazwisko</label><input id="f-sur" name="sur" autocomplete="off"><span class="err" hidden>Wpisz nazwisko.</span></div>
        <div class="field"><label for="f-birth">Data urodzenia</label><input id="f-birth" name="birth" inputmode="numeric" placeholder="dd.mm.rrrr" autocomplete="off"></div></section>
      ${answers.length ? `<section class="form-sec"><h2>Z Twoich odpowiedzi</h2><ul class="answers-list">${answers.map(([q, a]) => `<li><span class="meta">${esc(q)}</span><b>${esc(a)}</b></li>`).join('')}</ul><span class="from">${icon('chat-circle-dots')} Przepisane z rozmowy.</span></section>` : ''}
      <button type="button" class="btn btn-quiet" id="form-sample">Wypełnij przykładowymi danymi</button>
      <button type="submit" class="btn btn-accent btn-knob press"><span class="knob">${icon('folder-simple')}</span>Zapisz szkic PDF w Teczce</button>
      <p class="meta">Teczka jest tylko na tym telefonie. W prototypie znika po resecie.</p>
    </form></div></div></div>`;
  $('#form-close', layer).onclick = closeLayer;
  $('#form-sample', layer).onclick = () => { const f = $('#mock-form', layer).elements; f.name.value = 'Alex'; f.sur.value = 'Przykładowy'; f.birth.value = '01.01.1990'; };
  $('#mock-form', layer).onsubmit = (e) => {
    e.preventDefault();
    const f = e.target.elements;
    let bad = null;
    ['name', 'sur'].forEach((n) => { const err = f[n].parentElement.querySelector('.err'); const miss = !f[n].value.trim(); err.hidden = !miss; f[n].setAttribute('aria-invalid', String(miss)); if (miss && !bad) bad = f[n]; });
    if (bad) { bad.focus(); return; }
    setTask(c, t.id, 'done');
    const lv = plan(c).levels.find((x) => x.tasks.some((y) => y.id === t.id));
    const fileName = `${norm(t.officialName || lv?.title.pl || 'wniosek').split(' ').slice(0, 3).join('-')}-szkic.pdf`;
    c.files = c.files.filter((x) => x.name !== fileName);
    c.files.unshift({ name: fileName, kind: 'Szkic z makiety, nie oficjalny wniosek', at: stamp(S.clock), icon: 'file-text',
      fields: [['Formularz', t.officialName || t.title.pl], ['Imię i nazwisko', `${f.name.value.trim()} ${f.sur.value.trim()}`], ...answers.slice(0, 3)] });
    logAct(c, 'Szkic wniosku zapisany w Teczce');
    if (!c.state.events.some((x) => x.type === 'call_planned' || x.type === 'visit_planned')) {
      c.pending = 'call';
      c.preview = 'Wniosek jest w Teczce. Ustawić przypomnienie o telefonie do urzędu?';
    }
    $('.full', layer).append(h(`<div class="saving" aria-hidden="true"><span class="fly">${icon('file-text')}</span></div>`));
    later(1000, () => { layer.innerHTML = ''; toast(`Zapisano w Teczce: ${fileName}`, 'folder-simple-fill'); afterChange(c); });
  };
  $('#f-name', layer).focus();
}
