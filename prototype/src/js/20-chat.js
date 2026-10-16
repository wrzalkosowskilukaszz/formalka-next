/* ── The conversation: one log for all cases, a dock with one question at a time ── */
let logEl, dockEl, lastSpeaker, lastTime;
function newChat() {
  logEl = h('<div class="log pad" role="log" aria-live="polite" aria-label="Rozmowa"></div>');
  dockEl = h('<div class="dock" aria-label="Pytanie i odpowiedź"></div>');
  lastSpeaker = null;
  lastTime = null;
  logEl.addEventListener('click', onLogClick);
  dockEl.addEventListener('click', (e) => { const b = e.target.closest('[data-do]'); if (b) doAction(b.dataset.do); });
}
function scrollLog() { requestAnimationFrame(() => logEl.scrollTo({ top: logEl.scrollHeight, behavior: RM.matches ? 'auto' : 'smooth' })); }
const speakerKey = (c) => `${c.who}|${c.id}`;
const nameRow = (c) => `<div class="msg-name">${avatar(c.who, 'sm')}<span>${esc(c.who)} · ${esc(who(c.who).role)} · ${esc(c.title)}</span></div>`;
// Less at once (owner, 16.10): with one assistant the header already names it, so a name row appears
// only once several assistants share the conversation; and a time only when the minute changes.
function markSpeaker(c) {
  if (lastSpeaker !== speakerKey(c) && S.cases.length > 1) logEl.append(h(nameRow(c)));
  lastSpeaker = speakerKey(c);
}
function timeTag(time) {
  if (time === lastTime) return '';
  lastTime = time;
  return `<span class="time">${hm(time)}</span>`;
}

function addMsg(kind, html, c = null, time = S.clock.time) {
  if (kind === 'bot') markSpeaker(c);
  if (kind === 'sys') logEl.append(h(`<p class="sys plain enter">${html}</p>`));
  else if (kind === 'join') logEl.append(h(`<p class="sys enter">${avatar(c.who, 'sm')}${html}</p>`));
  else logEl.append(h(`<div class="msg ${kind} enter">${html}${timeTag(time)}</div>`));
  lastSpeaker = kind === 'bot' ? speakerKey(c) : kind;
  scrollLog();
}
// Engine text is plain; line breaks become paragraphs and "• " lines become a list.
function textHtml(t) {
  const lines = String(t).split('\n');
  let out = '', list = [];
  const flush = () => { if (list.length) { out += `<ul>${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`; list = []; } };
  for (const line of lines) {
    if (line.startsWith('• ')) list.push(line.slice(2));
    else { flush(); if (line.trim()) out += `<p>${esc(line)}</p>`; }
  }
  flush();
  return out;
}
async function say(c, html, wait = 420) {
  markSpeaker(c);
  const t = h(`<div class="typing" role="status"><span class="sr">${esc(c.who)} odpowiada</span><i></i><i></i><i></i></div>`);
  logEl.append(t); scrollLog();
  await sleep(wait);
  t.remove();
  addMsg('bot', html, c);
}
const me = (text) => addMsg('me', echoed(text));
const sys = (text) => addMsg('sys', esc(text));
const mapNote = (text) => {
  logEl.append(h(`<button type="button" class="mapnote enter" data-act="mapsheet">${icon('map-trifold')}<span><b>Mapa sprawy</b>${esc(text)}</span></button>`));
  lastSpeaker = 'note';
  scrollLog();
};

function askBar(placeholder = 'Napisz własnymi słowami', id = 'dock-t') {
  return `<form class="ask ask-sm" autocomplete="off"><label class="sr" for="${id}">${esc(placeholder)}</label>
    <input id="${id}" name="t" placeholder="${esc(placeholder)}" enterkeyhint="send">
    <button class="send" type="submit" aria-label="Wyślij">${icon('arrow-up')}</button></form>`;
}
const UNKNOWN_CHOICE = '__dk__';
function optHTML(o, i, long) {
  const cls = ['chip', long && !o.dk ? 'chip-card' : '', o.dk ? 'chip-dk' : '', o.tester ? 'chip-t' : '', o.small ? 'chip-sm' : '', o.day ? 'chip-day' : '', o.time ? 'chip-time' : ''].join(' ');
  const inner = o.day ? `<small>${esc(o.day[0])}</small><b>${esc(o.day[1])}</b><small>${esc(o.day[2])}</small>`
    : long && !o.dk ? `${icon(o.ic || 'caret-right')}<span>${esc(o.label)}</span>` : esc(o.label);
  return `<button type="button" class="${cls}" data-i="${i}" style="animation-delay:${i * 40}ms" ${o.day ? `aria-label="${esc(o.label)}"` : ''}>${inner}</button>`;
}
function showDock(html) {
  dockEl.innerHTML = html;
  dockEl.classList.remove('enter'); void dockEl.offsetWidth; dockEl.classList.add('enter');
  const t = $('[data-focus]', dockEl);
  if (t && document.activeElement && document.activeElement !== document.body) t.focus({ preventScroll: true });
  scrollLog();
}
// Guards a dock answer: a click from an abandoned flow or before a reset does nothing.
function guard() { const r = RUN, f = FLOW; return () => r === RUN && f === FLOW; }

// One question at a time in the dock; every question also takes a typed answer, read on the device
// (35-understand.js). Answering moves the question and the answer into the log.
async function ask(o) {
  const opts = { dk: true, text: true, ...o };
  const options = [...(opts.options ?? [])];
  if (opts.dk) options.push({ label: 'Nie wiem', value: UNKNOWN_CHOICE, dk: true });
  for (;;) {
    const a = await askOnce({ ...opts, options, dk: false });
    if (!a.typed) return a;
    const r = await understand({ ...opts, options }, a.typed);
    if (r) return r;
  }
}
// Shows the question once; resolves with the option picked, or { typed } with the person's words.
// One progress indicator: the case bar above the chat (the dock no longer repeats it).
function askOnce({ c, q, why, options = [], text = true, placeholder = 'Albo napisz własnymi słowami', long = false }) {
  const ok = guard();
  return new Promise((res) => {
    showDock(`${q ? `<p class="dock-q${q.length > 70 ? ' long' : ''}" id="dq" tabindex="-1" data-focus>${esc(q)}</p>` : ''}
      ${why ? `<details class="dock-why"><summary>Dlaczego pytamy?</summary><p>${esc(why)}</p></details>` : ''}
      <div class="opts${long ? ' cards' : ''}" role="group" ${q ? 'aria-labelledby="dq"' : 'aria-label="Odpowiedzi"'}>${options.map((x, i) => optHTML(x, i, long)).join('')}</div>
      ${text ? askBar(placeholder) : ''}`);
    let done = false;
    const finish = (r, label) => {
      if (done || !ok()) return;
      done = true;
      if (q && c) addMsg('bot', esc(q), c);
      if (label != null) me(label);
      dockEl.innerHTML = '';
      res(r);
    };
    $$('.chip', dockEl).forEach((b) => { b.onclick = () => { const x = options[+b.dataset.i]; b.classList.add('picked'); later(130, () => finish({ value: x.value, label: x.label }, x.tester ? null : x.label)); }; });
    const form = $('form', dockEl);
    if (form) form.onsubmit = (e) => { e.preventDefault(); const v = form.elements.t.value.trim(); if (v) finish({ typed: v }, v); };
  });
}

// A structured approval card (after Muse): accept or reject, by button or in words ("tak", "nie teraz").
function approve({ c, kicker = 'Do zatwierdzenia', ic = 'calendar-plus', title, sub, note, yes = 'Dodaj', no = 'Nie teraz', echo = true }) {
  const ok = guard();
  return new Promise((res) => {
    showDock(`<section class="approval" aria-labelledby="ap-t">
      <span class="ap-k">${icon('check-circle')}${esc(kicker)}</span>
      <div class="ap-body"><span class="tile-ic">${icon(ic)}</span><span class="tx"><b id="ap-t" tabindex="-1" data-focus>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</span></div>
      ${note ? `<p class="ap-note">${note}</p>` : ''}
      <div class="ap-act"><button type="button" class="btn btn-quiet" data-a="no">${esc(no)}</button><button type="button" class="btn btn-accent" data-a="yes">${esc(yes)}</button></div></section>
      ${askBar('Albo napisz: tak, nie, albo inaczej')}`);
    let done = false;
    const finish = (yesPicked, label) => {
      if (done || !ok()) return;
      done = true;
      if (echo && c) addMsg('bot', `<div class="event"><span class="ev-ic">${icon(ic)}</span><span><b>${esc(title)}</b><span>${esc(sub || '')}</span></span></div>`, c);
      me(label);
      dockEl.innerHTML = '';
      res(yesPicked);
    };
    $$('[data-a]', dockEl).forEach((b) => { b.onclick = () => finish(b.dataset.a === 'yes', b.dataset.a === 'yes' ? yes : no); });
    const form = $('form', dockEl);
    form.onsubmit = (e) => {
      e.preventDefault();
      const v = form.elements.t.value.trim();
      if (!v || done) return;
      const pol = polarity(norm(v), true);
      if (pol === 'yes') finish(true, v);
      else if (pol === 'no' || pol === 'dk') finish(false, v);
      else {
        form.elements.t.value = '';
        me(v);
        if (c) notSure(c, `Wybierz „${yes}” albo „${no}”, albo napisz „tak” lub „nie”.`);
      }
    };
  });
}

// A dock panel with custom content; resolves with { value } of the data-pick button pressed, or with
// { value, typed } when read(text) finds the answer in the person's words.
function panel(html, read = null, c = null) {
  const ok = guard();
  return new Promise((res) => {
    showDock(`${html}${read ? askBar('Albo napisz własnymi słowami') : ''}`);
    let done = false;
    const finish = (r) => { if (done || !ok()) return; done = true; dockEl.innerHTML = ''; res(r); };
    $$('[data-pick]', dockEl).forEach((b) => { b.onclick = () => finish({ value: b.dataset.pick }); });
    const form = read && $('form', dockEl);
    if (form) form.onsubmit = (e) => {
      e.preventDefault();
      const v = form.elements.t.value.trim();
      if (!v || done) return;
      form.elements.t.value = '';
      me(v);
      const value = read(v);
      if (value) finish({ value, typed: v });
      else if (c) notSure(c, 'Wybierz jedną z możliwości powyżej albo napisz to inaczej.');
      else sys('Nie rozpoznaję tego. Wybierz jedną z możliwości powyżej.');
    };
  });
}

function runFlow(name, fn) {
  const id = ++FLOW, r = RUN;
  S.flow = name;
  return fn().catch((err) => { console.error(err); }).then(() => {
    if (id !== FLOW || r !== RUN) return;
    S.flow = null;
    drawStatus($('.status-slot'));
    idleDock();
  });
}

/* ── The slim live case bar above the chat while a plan is being built ────── */
let builderEl = null;
const BN = new Map();
function makeBuilder(c) {
  BN.clear();
  builderEl = h(`<button type="button" class="builder" aria-label="Twoja sprawa buduje się na żywo. Otwórz mapę">
    <span class="ring sm" aria-hidden="true"><svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="16" fill="none" stroke-width="4"/><circle class="fg" cx="20" cy="20" r="16" fill="none" stroke-width="4" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg><span>0%</span></span>
    <span class="b-main"><span class="b-title"><small>Tworzymy sprawę</small><b>${esc(c.title)}</b></span><span class="b-nodes"></span></span>
    ${icon('caret-right', 'b-go')}</button>`);
  builderEl.onclick = () => { const b = caseById(S.building) || c; openMapSheet(b); };
}
function updateBuilder(c, animate = true, changed = []) {
  if (!builderEl) return;
  const p = plan(c);
  const row = $('.b-nodes', builderEl);
  const seen = new Set();
  let k = 0;
  p.levels.forEach((l, i) => {
    seen.add(l.id);
    let el = BN.get(l.id);
    const isNew = !el;
    if (isNew) { el = h('<span class="bn"></span>'); BN.set(l.id, el); }
    if (row.children[i] !== el) row.insertBefore(el, row.children[i] || null);
    el.className = `bn ${l.state}${l.parallelWith.length ? ' par' : ''}`;
    el.innerHTML = `${icon(levelIcon(l))}<span class="sr">${esc(l.title.pl)}: ${esc(STATE[l.state])}</span>`;
    if (animate && isNew) { el.classList.add('is-new'); el.style.animationDelay = `${k++ * 90}ms`; }
    else if (animate && changed.includes(l.id)) el.classList.add('is-changed');
    later(1300, () => el.classList.remove('is-new', 'is-changed'));
  });
  for (const [id, el] of BN) if (!seen.has(id)) { el.remove(); BN.delete(id); }
  const prog = progressOf(c, p);
  // The bar appears with the first answer that builds the plan; before that it would only say 0%.
  builderEl.hidden = !c.state.approved && prog === 0 && !c.state.routeChoice;
  $('.ring .fg', builderEl).style.strokeDashoffset = String(1 - prog);
  $('.ring span', builderEl).textContent = `${Math.round(prog * 100)}%`;
}
function mountBuilder() {
  const slot = $('.builder-slot');
  if (!slot) return;
  const c = caseById(S.building);
  if (!c || !builderEl) { slot.innerHTML = ''; return; }
  if (builderEl.parentNode !== slot) slot.append(builderEl);
  updateBuilder(c, false);
}
// After each answer: update the bar and, when something changed, leave a note in the chat.
function noteChange(c, before) {
  const after = plan(c);
  const ch = mapChange(before, after);
  updateBuilder(c, true, ch.ids);
  if (ch.text) mapNote(ch.text);
}
