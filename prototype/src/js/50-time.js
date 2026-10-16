/* ── Time: the tester moves the clock; the engine's agenda decides what the assistant does ── */
function travel(days) {
  if (!hasApproved()) { toast('Najpierw zatwierdź plan jakiejś sprawy.', 'info'); return; }
  $('#layer').innerHTML = '';
  const before = { ...S.clock };
  S.clock = { date: isoAdd(S.clock.date, days), time: S.clock.time };
  const until = stamp(S.clock);
  const notes = [];
  let delivered = 0;
  for (const c of S.cases.filter((x) => x.state.approved)) {
    const items = agendaFor(c, before).filter((it) => it.fireAt <= until && !c.delivered.has(it.id)).sort((a, b) => a.fireAt.localeCompare(b.fireAt));
    for (const it of items) {
      c.delivered.add(it.id);
      c.deliveredLog.push({ at: it.fireAt, title: AGENDA_TITLE[it.kind] || 'Przypomnienie', sub: `${c.who} przypomniał${who(c.who).sam === 'sama' ? 'a' : ''}`, ic: AGENDA_ICON[it.kind] || 'bell' });
      const t = fromStamp(it.fireAt);
      const answers = it.answers && !c.answered[it.id]
        ? `<div class="opts fu">${it.answers.map((a) => `<button type="button" class="chip chip-sm" data-fu="${esc(it.id)}" data-case="${c.id}" data-a="${esc(a.id)}">${esc(a.label)}</button>`).join('')}</div>` : '';
      if (answers) c.awaiting = it.id;
      addMsg('bot', `${textHtml(asCase(c, it.message.pl))}${answers || actsHTML(c, agendaActs(c, it))}<span class="meta when">${esc(dshort(t.date))}${it.channel === 'notification' ? ' · powiadomienie' : ' · w aplikacji'}</span>`, c, t.time);
      if (it.channel === 'notification') notes.push({ c, it });
      delivered++;
      if (it.answers) c.preview = asCase(c, it.message.pl);
    }
  }
  renderClock();
  if (notes.length) showLock(notes, before);
  else { render(); toast(delivered ? `Minęło ${days} ${plural(days, 'dzień', 'dni', 'dni')}. Nowe wiadomości są w czacie.` : `Minęło ${days} ${plural(days, 'dzień', 'dni', 'dni')}. Nic nowego: asystent pisze tylko, gdy jest powód.`, 'fast-forward'); }
}

// The simulated lock screen: generic text unless the person turned the topic on (per case).
function showLock(notes, before) {
  $('#toast').innerHTML = '';
  const layer = $('#layer');
  const text = ({ c, it }) => {
    if (!c.prefs.lockScreenDetail) return asCase(c, it.lockScreen);
    const again = agendaFor(c, before).find((x) => x.id === it.id);
    return asCase(c, again?.lockScreen || it.lockScreen);
  };
  const draw = () => {
    const anyDetail = notes.some((n) => n.c.prefs.lockScreenDetail);
    layer.innerHTML = `<div class="lock pad" role="dialog" aria-modal="true" aria-label="Symulowany ekran blokady telefonu"><div class="lock-in">
      <p class="lock-date">${esc(dlong(S.clock.date))}</p><p class="lock-time">${hm(S.clock.time)}</p>
      <div class="lock-notes">${notes.map((n, i) => `<button type="button" class="note" data-i="${i}" style="animation-delay:${i * 120}ms">
        <span class="app">${mark()}</span><span class="tx"><small><span>Formalka</span><span>${esc(dshort(n.it.fireAt.slice(0, 10)))} ${hm(n.it.fireAt.slice(11, 16))}</span></small>
        <b>${esc(text(n))}</b><span>Otwórz, żeby zobaczyć szczegóły.</span></span></button>`).join('')}</div>
      <p class="lock-meta">Temat sprawy na ekranie blokady: ${anyDetail ? 'widoczny' : 'ukryty (domyślnie)'}<br><button type="button" id="lock-topic">${anyDetail ? 'Ukryj temat' : 'Pokaż temat'}</button><br>
      Najwyżej jedno powiadomienie dziennie w sprawie, nic między 20:00 a 8:00. Symulacja: telefon nic nie dostaje.</p>
      <button type="button" class="btn btn-white" id="lock-open">Otwórz aplikację</button></div></div>`;
    $('#lock-topic', layer).onclick = () => { const v = !anyDetail; new Set(notes.map((n) => n.c)).forEach((c) => { c.prefs.lockScreenDetail = v; }); draw(); $('#lock-topic', layer).focus(); };
    $$('.note', layer).forEach((b) => { b.onclick = () => { S.active = notes[+b.dataset.i].c.id; unlock('chat'); }; });
    $('#lock-open', layer).onclick = () => unlock('world');
  };
  draw();
  $('.note:last-of-type', layer)?.focus();
}
function unlock(screen) {
  const lk = $('.lock');
  const then = () => { S.screen = screen; render(); };
  if (!lk || RM.matches) { $('#layer').innerHTML = ''; then(); return; }
  lk.classList.add('unlock');
  then();
  setTimeout(() => { if (lk.parentNode) lk.remove(); }, 520);
}

// "Jak poszło?" answers become events the plan understands (or an honest next step with actions).
async function followUp(c, itemId, answerId, typed = false) {
  if (c.answered[itemId]) return;
  c.answered[itemId] = true;
  if (c.awaiting === itemId) c.awaiting = null;
  $$(`[data-fu="${CSS.escape(itemId)}"]`, logEl).forEach((b) => { b.disabled = true; });
  c.preview = '';
  const label = E.msg.followUpAnswers.find((a) => a.id === answerId)?.label ?? answerId;
  if (!typed) me(label);
  touch(c);
  const p = plan(c);
  const levelId = itemId.split('|')[2]?.split('@')[0];
  const visit = [...c.state.events].reverse().find((e) => e.type === 'visit_planned');
  const lv = p.levels.find((l) => l.id === levelId) || p.levels.find((l) => l.id === visit?.level) || currentLevel(p);
  logAct(c, `Jak poszło w urzędzie: ${label}`);
  if (answerId === 'filed') {
    if (lv.completesWith) {
      const before = plan(c);
      recordEvent(c, lv.completesWith, S.clock.date);
      S.highlight = mapChange(before, plan(c)).ids;
      await say(c, `Zapisane: ${esc(eventLabel(c, lv.completesWith))}, ${esc(dlong(S.clock.date))}. To Twoja informacja, nie potwierdzenie z urzędu.`);
    } else await say(c, 'Dziękuję, zapisane w historii sprawy. To Twoja informacja, nie potwierdzenie z urzędu.');
    postGuide(c, true);
    return;
  }
  const A = [];
  if (answerId === 'missing') A.push({ kind: 'teczka', label: 'Sprawdź listę dokumentów', ic: 'folder-simple', primary: true });
  A.push({ kind: 'visit', levelId: lv.id, label: 'Mam nowy termin', ic: 'calendar-check', primary: answerId !== 'missing' }, { kind: 'call', levelId: lv.id, label: 'Przypomnij o telefonie', ic: 'phone' });
  if (lv.office?.offices?.length) A.push({ kind: 'offices', levelId: lv.id, label: 'Urzędy i mapa', ic: 'map-pin' });
  await say(c, `<p>${answerId === 'missing' ? 'Rozumiem. Sprawdźmy, czego brakowało: lista dokumentów z przewodnika jest w Teczce. Gdy umówisz nowy termin, wpisz go, a przypomnę dzień wcześniej.' : 'Trudno, to się zdarza. Gdy umówisz nowy termin, wpisz go, a przypomnę o nim.'}</p>${actsHTML(c, A)}`);
}

// Three-layer status under the chat header (after Muse): now, the process, the detail.
function drawStatus(slot) {
  const c = C();
  if (!slot) return;
  if (!c || !c.state.approved || S.building) { slot.innerHTML = ''; return; }
  const p = plan(c);
  const cur = currentLevel(p);
  const [i, n] = stepOf(p);
  const next = entries().find((e) => !e.past && e.at >= stamp(S.clock) && e.c === c);
  const v = E.validate(p, c.state);
  const lvl = S.statusL;
  slot.innerHTML = `<section class="status" data-l="${lvl}" aria-label="Status sprawy">
    <button type="button" id="st-t" aria-expanded="${lvl > 1}"><span class="live" aria-hidden="true"></span><span class="tx">${cur.title.pl === c.title ? `<b>Teraz:</b> ${esc(cur.title.pl)}` : `<b>${esc(c.title)}:</b> ${esc(cur.title.pl)}`}</span>${icon('caret-down')}</button>
    ${lvl > 1 ? `<ul class="lay">
      <li>${icon('map-trifold')}<span>Poziom ${i} z ${n}: ${esc(levelLine(cur))}.</span></li>
      <li>${icon('calendar-dots')}<span>${next ? `Następne: ${esc(next.title)}, ${esc(dshort(next.at.slice(0, 10)))} ${hm(next.at.slice(11, 16))}` : 'Brak wpisów w kalendarzu.'}</span></li>
      <li>${icon('bell')}<span>Pomoc z wyprzedzeniem: ${c.prefs.consent ? 'włączona' : `wyłączona, ${esc(c.who)} nie wysyła powiadomień`}.</span></li>
      ${lvl < 3 ? '<li><button type="button" class="more" id="st-more">Pokaż szczegóły i źródła</button></li>' : ''}</ul>` : ''}
    ${lvl > 2 ? `<ul class="lay">
      <li>${icon('signpost')}<span>Droga: ${esc(routeTitle(p) || c.title)}${c.state.place ? `, ${esc(c.state.place.name)}` : ''}.</span></li>
      <li>${icon(v.ok ? 'seal-check' : 'warning-circle')}<span>${v.ok ? 'Plan sprawdzony: każdy element ma źródło' : `Plan nie przeszedł kontroli (${v.violations.length})`}. Treści Formalki ${esc(E.registryVersion)}, stan na 15.10.2026.</span></li>
      <li>${icon('clock-counter-clockwise')}<span>Pełny dziennik działań: dotknij awatara u góry.</span></li></ul>` : ''}
  </section>`;
  $('#st-t', slot).onclick = () => { S.statusL = lvl > 1 ? 1 : 2; drawStatus(slot); };
  const m = $('#st-more', slot); if (m) m.onclick = () => { S.statusL = 3; drawStatus(slot); };
}
