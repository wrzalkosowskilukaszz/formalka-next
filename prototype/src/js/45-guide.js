/* ── The active assistant: every reply ends with something it can do for the person ──
   What it proposes comes from the plan: official forms and their download links (registry
   `links`), the interactive mock form, offices from the registry with a map link, visits,
   call reminders, dates to record, the document list. No action only when nothing is left. */

// Official links for a task, from the procedure's step or document in the registry.
function taskLinks(t) {
  const [procId, kind, itemId] = t.id.split(':');
  const proc = E.procedure(procId);
  const item = (kind === 'step' ? proc?.steps : proc?.documents)?.find((x) => x.id === itemId);
  return (item?.links ?? []).map((l) => ({ url: l.url, label: l.title?.pl ?? 'Pobierz wzór' }));
}
const mapsUrl = (o) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.name.pl}, ${o.address.value}`)}`;

// Actions are kept in a table so a button carries only an id.
const ACTS = new Map();
let ACT_SEQ = 0;
function actHTML(c, a) {
  if (a.kind === 'link') return `<a class="chip chip-sm act" href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${icon(a.ic || 'arrow-square-out')} ${esc(a.label)}</a>`;
  const id = `a${++ACT_SEQ}`;
  ACTS.set(id, { ...a, cid: c.id });
  return `<button type="button" class="chip chip-sm act${a.primary ? ' act-primary' : ''}" data-do="${id}">${icon(a.ic || 'arrow-right')} ${esc(a.label)}</button>`;
}
const actsHTML = (c, actions) => (actions.length ? `<div class="acts">${actions.map((a) => actHTML(c, a)).join('')}</div>` : '');

function doAction(id) {
  const a = ACTS.get(id);
  const c = a && caseById(a.cid);
  if (!a || !c) return;
  S.active = c.id;
  switch (a.kind) {
    case 'form': openForm(c, a.taskId); break;
    case 'offices': openOffices(c, a.levelId); break;
    case 'place': pickPlace(c); break;
    case 'visit': case 'call': planTime(c, a.kind, a.levelId); break;
    case 'event': openEventSheet(c, a.type, a.label); break;
    case 'task': setTask(c, a.taskId, 'done'); toast('Odhaczone.'); afterChange(c); break;
    case 'fixed': recordEvent(c, 'fix_submitted', S.clock.date); afterChange(c); break;
    case 'teczka': go('teczka', 'tab'); break;
    case 'calendar': go('calendar', 'tab'); break;
    case 'map': S.view = 'map'; go('case', 'fwd'); break;
    case 'focus': c.focus = a.levelId || null; S.view = 'focus'; go('case', 'fwd'); break;
    case 'related': { const ex = S.cases.find((x) => x.bpId === a.bpId); if (ex) openCase(ex.id); else runFlow('case', () => startCase(a.bpId)); break; }
    case 'reminder': addReminder(S.clock.date); break;
    default: break;
  }
}
function openEventSheet(c, type, label) {
  sheet(label, `<article class="card">${eventForm(c, type, `${eventLabel(c, type)}: wpisz datę`)}</article><p class="meta">Data zostaje na Twoim telefonie. Na jej podstawie silnik liczy terminy i przypomnienia.</p>`, (sh) => wireActions(sh, c));
}

// What the assistant proposes for the case right now: lines of text and actions.
function guidance(c) {
  const p = plan(c);
  if (p.levels.every(settled)) return { lines: ['Wszystkie kroki z planu są zrobione. Jeśli coś się zmieni, napisz, a sprawdzę, co to zmienia w planie.'], actions: [] };
  const l = currentLevel(p);
  const lines = [], A = [];
  if (l.state === 'returned') {
    const due = l.deadlines.find((d) => d.role === 'user' && d.due);
    lines.push(`Krok „${l.title.pl}”. ${l.reason?.text.pl ?? STATE.returned}${due ? ` Masz czas ${dueRange(due.due)}.` : ''}`);
    A.push({ kind: 'fixed', label: 'Uzupełnione i wysłane', ic: 'check', primary: true }, { kind: 'teczka', label: 'Lista dokumentów', ic: 'folder-simple' });
  } else if (l.state === 'waiting_office') {
    const d = l.deadlines.find((x) => x.role === 'office' && x.due);
    lines.push(`Teraz czekasz na urząd${d ? `: według przepisów ma czas ${dueRange(d.due)}` : ''}. Nic nie musisz robić. ${c.prefs.consent ? 'Dam znać, gdy ten czas minie.' : 'W kalendarzu zobaczysz, kiedy ten czas mija.'}`);
    if (l.completesWith) A.push({ kind: 'event', type: l.completesWith, label: `Zapisz: ${eventLabel(c, l.completesWith)}`, ic: 'calendar-check', primary: true });
    if (canReturn(c, p)) A.push({ kind: 'event', type: 'request_delivered', label: 'Urząd prosi o uzupełnienie', ic: 'arrow-u-up-left' });
    A.push({ kind: 'calendar', label: 'Kalendarz', ic: 'calendar-dots' }, { kind: 'map', label: 'Mapa sprawy', ic: 'map-trifold' });
  } else {
    lines.push(`Teraz: „${l.title.pl}”. ${levelLine(l)}.`);
    const open = l.tasks.filter((t) => !isDone(t));
    const form = open.find((t) => isFormable(t) || taskLinks(t).length);
    if (form) {
      const links = taskLinks(form);
      const name = form.officialName || form.title.pl;
      const here = 'wypełnić go tutaj i zapisać szkic PDF w Teczce, żeby później go wydrukować';
      lines.push(`${form.officialName ? `Na tym etapie wypełniasz dokument: ${name}.` : `Na tym etapie: ${name.charAt(0).toLowerCase()}${name.slice(1)}.`} ${links.length
        ? `Możesz pobrać wzór z oficjalnej strony, wydrukować go i wypełnić ręcznie${isFormable(form) ? `, albo ${here}` : ''}.`
        : `Wzoru nie mamy jako pliku: jest na oficjalnej stronie.${isFormable(form) ? ` Możesz też ${here}.` : ''}`}`);
      if (isFormable(form)) A.push({ kind: 'form', taskId: form.id, label: 'Wypełnij tutaj', ic: 'file-text', primary: true });
      links.slice(0, 2).forEach((x) => A.push({ kind: 'link', url: x.url, label: x.label.replace(/^Pobierz /, 'Pobierz '), ic: 'arrow-square-out' }));
      if (!links.length && form.quotes?.length) A.push({ kind: 'link', url: form.quotes[0].page, label: `Strona ze wzorem (${host(form.quotes[0].page)})` });
    }
    const docs = open.filter((t) => t.kind === 'document' && t !== form);
    if (docs.length) {
      lines.push(`Do zebrania: ${docs.length} ${plural(docs.length, 'dokument', 'dokumenty', 'dokumentów')}. W Teczce odhaczysz, co już masz.`);
      A.push({ kind: 'teczka', label: 'Lista dokumentów', ic: 'folder-simple', primary: !form });
    }
    const steps = open.filter((t) => t.kind === 'step' && t !== form);
    if (steps.length && !l.completesWith) {
      lines.push(`Do zrobienia: ${steps.map((t) => cap(t.title.pl)).join('; ')}.`);
      if (steps.length === 1) A.push({ kind: 'task', taskId: steps[0].id, label: 'Oznacz jako zrobione', ic: 'check', primary: !form && !docs.length });
    }
    const fees = l.fees.filter((f) => !f.optional && f.outcome === 'applies' && f.exemption?.outcome !== 'applies');
    if (fees.length) lines.push(`Opłata: ${fees.map((f) => `${f.amountPln} zł`).join(' + ')} (przykład z przewodnika; sposób zapłaty jest w źródle).`);
    if (l.office) {
      const o = l.office;
      if (o.needsPlace) { lines.push('Podaj miejscowość, a pokażę urzędy z naszych źródeł.'); A.push({ kind: 'place', label: 'Podaj miejscowość', ic: 'map-pin' }); }
      else if (o.offices?.length) {
        const withAddr = o.offices.filter((x) => x.address);
        lines.push(withAddr.length > 1
          ? `W naszych źródłach ${plural(withAddr.length, 'jest', 'są', 'jest')} ${withAddr.length} ${plural(withAddr.length, 'urząd', 'urzędy', 'urzędów')} dla miejscowości ${c.state.place?.name ?? ''}, z podziałem na dzielnice, z adresami i godzinami.`
          : `Urząd: ${o.offices[0].name.pl}${o.offices[0].address ? `, ${o.offices[0].address.value}` : '. Adres i godziny są na jego stronie'}.`);
        A.push({ kind: 'offices', levelId: l.id, label: withAddr.length > 1 ? 'Urzędy i mapa' : 'Urząd', ic: 'map-pin' });
      } else lines.push(E.msg.officeUnknown());
    }
    // No office on this level: say where the paper goes next, so the person sees the whole errand.
    const ahead = !l.office && p.levels.find((x) => x.order > l.order && x.office && x.state !== 'done');
    if (ahead) {
      const o = ahead.office;
      if (o.needsPlace) { lines.push(`Potem: „${ahead.title.pl}”. Podaj miejscowość, a pokażę urzędy z naszych źródeł.`); A.push({ kind: 'place', label: 'Podaj miejscowość', ic: 'map-pin' }); }
      else if (o.offices?.length) {
        const n = o.offices.length;
        lines.push(n > 1 ? `Potem: „${ahead.title.pl}”. W Twojej miejscowości ${plural(n, 'jest', 'są', 'jest')} ${n} ${plural(n, 'urząd', 'urzędy', 'urzędów')}, z podziałem na dzielnice, z adresami i godzinami.` : `Potem: „${ahead.title.pl}” w urzędzie: ${o.offices[0].name.pl}.`);
        A.push({ kind: 'offices', levelId: ahead.id, label: n > 1 ? 'Urzędy i mapa' : 'Urząd', ic: 'map-pin' });
      }
    }
    if ((l.office || l.completesWith) && c.state.approved && l.state !== 'locked') {
      const visit = c.state.events.find((e) => e.type === 'visit_planned' && e.level === l.id);
      if (!visit) A.push({ kind: 'call', levelId: l.id, label: 'Przypomnij o telefonie', ic: 'phone' }, { kind: 'visit', levelId: l.id, label: 'Mam umówioną wizytę', ic: 'calendar-check' });
      if (l.completesWith) A.push({ kind: 'event', type: l.completesWith, label: `Zapisz: ${eventLabel(c, l.completesWith)}`, ic: 'calendar-check' });
    }
    const dl = l.deadlines.find((d) => !d.due && d.outcome === 'applies' && d.role === 'user' && !isReturnsDeadline(c, d));
    if (dl) { lines.push(`Termin liczy się od: ${eventLabel(c, dl.from)}. Zapisz tę datę, a wyliczę termin i przypomnę o nim.`); A.push({ kind: 'event', type: dl.from, label: 'Zapisz datę', ic: 'calendar-plus' }); }
    const cross = open.find((t) => t.crossCase?.blueprint && !S.cases.some((x) => x.bpId === t.crossCase.blueprint));
    if (cross) A.push({ kind: 'related', bpId: cross.crossCase.blueprint, label: cross.crossCase.label.pl, ic: 'arrow-square-out' });
  }
  const stale = staleOf(p);
  if (stale) { lines.push(stale.text); A.push({ kind: 'link', url: stale.url, label: stale.label, ic: 'warning-circle' }); }
  const par = l.parallelWith.map((id) => p.levels.find((x) => x.id === id)).filter((x) => x && ACTIVE.includes(x.state));
  if (par.length) { lines.push(`Równolegle możesz zająć się: ${par.map((x) => x.title.pl).join(', ')}.`); A.push({ kind: 'focus', levelId: par[0].id, label: par[0].title.pl, ic: 'arrows-split' }); }
  if (!A.length) A.push({ kind: 'focus', label: 'Pokaż, co teraz', ic: 'list-checks' });
  return { lines, actions: A.slice(0, 5) };
}
// What a reminder from the agenda offers to do next (the engine says when; the plan says what).
function agendaActs(c, it) {
  const p = plan(c);
  const l = p.levels.find((x) => x.id === it.id.split('|')[2]?.split('@')[0]) || currentLevel(p);
  const offices = l.office?.offices?.length ? [{ kind: 'offices', levelId: l.id, label: 'Urzędy i mapa', ic: 'map-pin' }] : [];
  switch (it.kind) {
    case 'call_reminder': return [...offices, { kind: 'visit', levelId: l.id, label: 'Mam umówioną wizytę', ic: 'calendar-check' }];
    case 'visit_prep': return [{ kind: 'teczka', label: 'Co zabrać: Teczka', ic: 'folder-simple', primary: true }, ...offices];
    case 'visit_morning': return offices.length ? offices : [{ kind: 'teczka', label: 'Teczka', ic: 'folder-simple' }];
    case 'office_deadline_passed': return l.completesWith ? [{ kind: 'event', type: l.completesWith, label: `Zapisz: ${eventLabel(c, l.completesWith)}`, ic: 'calendar-check', primary: true }] : [{ kind: 'focus', levelId: l.id, label: 'Pokaż ten krok', ic: 'list-checks' }];
    case 'rule_change': return [{ kind: 'map', label: 'Mapa sprawy', ic: 'map-trifold' }];
    default: return [{ kind: 'focus', levelId: l.id, label: 'Pokaż, co teraz', ic: 'list-checks', primary: true }];
  }
}
const guidanceHTML = (c, g = guidance(c)) => `${g.lines.map((x) => `<p>${esc(x)}</p>`).join('')}${actsHTML(c, g.actions)}`;

// Posts the guidance when the current level changed (or when asked), and marks it unread.
function postGuide(c, force = false) {
  if (!c?.state.approved) return;
  const cur = currentLevel(plan(c));
  const key = `${cur.id}:${cur.state}`;
  if (!force && c.guided === key) return;
  c.guided = key;
  const g = guidance(c);
  addMsg('bot', guidanceHTML(c, g), c);
  // On Teraz the assistant's card already says it; elsewhere a dot and a banner point to the chat.
  if (S.screen !== 'chat' && S.screen !== 'case') c.preview = g.lines[0];
}

// Offices from the registry: address, hours, a map link, booking and the website; filter by district.
function openOffices(c, levelId) {
  const l = plan(c).levels.find((x) => x.id === levelId);
  const o = l?.office;
  if (!o || !o.offices?.length) { toast(E.msg.officeUnknown(), 'info'); return; }
  const item = (x) => `<li class="office" data-q="${esc(`${x.name.pl} ${x.address?.value ?? ''}`.toLowerCase())}"><b>${esc(x.name.pl)}</b>
    ${x.address ? `<span>${icon('map-pin')} ${esc(x.address.value)}</span>` : ''}${x.openingHours ? `<span>${icon('clock')} ${esc(x.openingHours.value)}</span>` : ''}
    <div class="acts">${x.address ? `<a class="chip chip-sm act act-primary" href="${esc(mapsUrl(x))}" target="_blank" rel="noopener noreferrer">${icon('map-trifold')} Mapa</a>` : ''}
      ${x.booking ? `<a class="chip chip-sm act" href="${esc(x.booking)}" target="_blank" rel="noopener noreferrer">${icon('calendar-check')} Rezerwacja wizyty</a>` : ''}
      ${x.website ? `<a class="chip chip-sm act" href="${esc(x.website)}" target="_blank" rel="noopener noreferrer">${icon('arrow-square-out')} Strona urzędu</a>` : ''}</div>
    ${x.address?.quotes?.length ? `<span class="cite">${icon('info')}<span>Adres i godziny ze źródła: ${srcLink(x.address.quotes)}</span></span>` : ''}</li>`;
  const list = [...o.offices].sort((a, b) => a.name.pl.localeCompare(b.name.pl, 'pl'));
  sheet(list.length > 1 ? `Urzędy: ${c.state.place?.name ?? ''}` : 'Urząd', `<p class="meta">${esc(l.title.pl)}. Numerów telefonów nie mamy w naszych źródłach, więc ich nie podajemy. Mapa otwiera się w Mapach Google, poza aplikacją.</p>
    ${list.length > 5 ? `<div class="field"><label for="of-q">Szukaj dzielnicy albo ulicy</label><input id="of-q" type="search" placeholder="Na przykład: Mokotów" autocomplete="off"></div>` : ''}
    <ul class="offices-list">${list.map(item).join('')}</ul>`, (sh) => {
    const q = $('#of-q', sh);
    if (q) q.oninput = () => { const v = q.value.trim().toLowerCase(); $$('.office', sh).forEach((li) => { li.hidden = !!v && !li.dataset.q.includes(v); }); };
  });
}

/* ── Answers to the person's own questions: only what the plan says, with sources, and an action ── */
const applyingFees = (p) => p.levels.flatMap((l) => l.fees.map((f) => ({ f, l }))).filter(({ f }) => !f.optional && f.outcome === 'applies' && f.exemption?.outcome !== 'applies');
const openLevels = (p) => p.levels.filter((l) => l.order > 0 && l.state !== 'done' && l.state !== 'unconfirmed');

async function answerNow(c) { postGuide(c, true); }
async function answerMap(c) {
  const p = plan(c);
  const [i, n] = stepOf(p);
  await say(c, `<p>Jesteś na poziomie ${i} z ${n}: „${esc(currentLevel(p).title.pl)}”. Zrobione: ${p.levels.filter((l) => l.state === 'done').length}.</p>
    ${actsHTML(c, [{ kind: 'map', label: 'Mapa sprawy', ic: 'map-trifold', primary: true }, { kind: 'focus', label: 'Pokaż, co teraz', ic: 'list-checks' }])}`);
}
// The honest limit (brief §4.10): what the sources don't say, we don't say.
async function answerUnknown(c) {
  const p = plan(c);
  const proc = E.procedure(p.route.procedureId || p.route.candidates[0]?.procedureId);
  const q = p.levels.flatMap((l) => l.tasks).find((t) => t.quotes?.length)?.quotes;
  const aid = proc?.handoff?.options?.find((o) => o.link?.url);
  const A = [];
  if (q) A.push({ kind: 'link', url: q[0].page, label: `Oficjalna strona (${host(q[0].page)})` });
  if (aid) A.push({ kind: 'link', url: aid.link.url, label: aid.name?.pl ?? 'Nieodpłatna pomoc prawna' });
  await say(c, `<p>Tego nie wiem z naszych źródeł, więc nie zgaduję kwot ani cen usług. W planie są tylko opłaty urzędowe z przewodnika.</p>${actsHTML(c, A.length ? A : guidance(c).actions.slice(0, 2))}`);
}
async function answerFees(c) {
  const p = plan(c);
  const fees = applyingFees(p);
  const exempt = p.levels.flatMap((l) => l.fees).filter((f) => f.exemption?.outcome === 'applies');
  if (!fees.length) {
    await say(c, `<p>${exempt.length ? 'Z Twoich odpowiedzi wynika zwolnienie z opłaty.' : 'W tym planie nie ma opłat urzędowych.'} Opłaty za usługi, na przykład tłumacza, nie są w naszych źródłach.</p>${actsHTML(c, guidance(c).actions.slice(0, 2))}`);
    return;
  }
  const total = fees.reduce((s, x) => s + x.f.amountPln, 0);
  await say(c, `<p>Opłaty urzędowe w tym planie: <b>${total} zł</b>. To przykład z przewodnika Formalki, stan na 15.10.2026.</p>
    <ul>${fees.map(({ f, l }) => `<li>${f.amountPln} zł: ${esc(f.purpose.pl)} (${esc(l.title.pl)})</li>`).join('')}</ul>
    ${fees.filter(({ f }) => f.exemption?.outcome === 'unknown').map(({ f }) => `<p class="meta">${esc(maybeExempt(f))}</p>`).join('')}
    ${cite(fees[0].f.quotes, 'Jak i gdzie zapłacić, jest w źródle.')}
    ${actsHTML(c, [{ kind: 'focus', levelId: fees[0].l.id, label: 'Pokaż ten krok', ic: 'coins', primary: true }, { kind: 'map', label: 'Mapa sprawy', ic: 'map-trifold' }])}`);
}
async function answerDates(c) {
  const p = plan(c);
  const lines = [], A = [];
  for (const l of openLevels(p)) {
    for (const d of shownDeadlines(c, l)) {
      if (d.due) lines.push(`${esc(l.title.pl)}: ${d.role === 'office' ? 'urząd ma czas' : 'termin'} ${esc(dueRange(d.due))}`);
      else if (d.role === 'user' && !A.some((a) => a.type === d.from)) A.push({ kind: 'event', type: d.from, label: `Zapisz: ${eventLabel(c, d.from)}`, ic: 'calendar-plus', primary: !A.length });
    }
  }
  A.push({ kind: 'calendar', label: 'Kalendarz', ic: 'calendar-dots' });
  await say(c, `${lines.length ? `<p>Terminy z planu:</p><ul>${lines.map((x) => `<li>${x}</li>`).join('')}</ul>` : '<p>W planie nie ma jeszcze terminu z datą.</p>'}
    ${A.length > 1 ? '<p>Część terminów liczy się od daty, którą znasz tylko Ty. Zapisz ją, a wyliczę termin i przypomnę o nim.</p>' : ''}${actsHTML(c, A)}`);
}
async function answerVisit(c) {
  const p = plan(c);
  const l = openLevels(p).find((x) => x.office || x.completesWith);
  if (!l) { await say(c, `<p>Na tym etapie plan nie przewiduje wizyty w urzędzie.</p>${actsHTML(c, guidance(c).actions.slice(0, 2))}`); return; }
  const booking = l.office?.offices?.find((o) => o.booking)?.booking;
  const A = [{ kind: 'visit', levelId: l.id, label: 'Mam umówioną wizytę', ic: 'calendar-check', primary: true }, { kind: 'call', levelId: l.id, label: 'Przypomnij o telefonie', ic: 'phone' }];
  if (booking) A.push({ kind: 'link', url: booking, label: 'Rezerwacja wizyty' });
  if (l.office?.offices?.length) A.push({ kind: 'offices', levelId: l.id, label: 'Urzędy i mapa', ic: 'map-pin' });
  await say(c, `<p>${esc(E.msg.cannotBook())}</p><p>Gdy umówisz wizytę, wpisz mi jej termin: przypomnę dzień wcześniej, co zabrać.</p>${actsHTML(c, A)}`);
}
async function answerReminder(c) {
  const l = currentLevel(plan(c));
  const A = [{ kind: 'reminder', label: 'Dodaj przypomnienie', ic: 'bell', primary: true }];
  if (l.office || l.completesWith) A.push({ kind: 'call', levelId: l.id, label: 'Przypomnij o telefonie', ic: 'phone' });
  await say(c, `<p>Dodaj własne przypomnienie: wybierasz, o czym, dzień i godzinę. ${c.prefs.consent ? `Przypomnienia z planu dodaję ${who(c.who).sam}, bo masz to włączone.` : `Przypomnienia z planu mogę dodawać ${who(c.who).sam}, jeśli włączysz to w historii sprawy.`}</p>${actsHTML(c, A)}`);
}
async function answerDocs(c) {
  const p = plan(c);
  const docs = openLevels(p).flatMap((l) => l.tasks.filter((t) => t.kind === 'document' && !isDone(t)));
  if (!docs.length) { await say(c, `<p>Na otwartych poziomach nie ma dokumentów do zebrania.</p>${actsHTML(c, guidance(c).actions.slice(0, 2))}`); return; }
  const shown = docs.slice(0, 6);
  const form = docs.find((t) => isFormable(t) || taskLinks(t).length);
  const A = [{ kind: 'teczka', label: 'Teczka: odhacz, co masz', ic: 'folder-simple', primary: true }];
  if (form && isFormable(form)) A.push({ kind: 'form', taskId: form.id, label: 'Wypełnij wniosek tutaj', ic: 'file-text' });
  if (form) taskLinks(form).slice(0, 1).forEach((x) => A.push({ kind: 'link', url: x.url, label: x.label }));
  await say(c, `<p>Do zebrania: ${docs.length} ${plural(docs.length, 'dokument', 'dokumenty', 'dokumentów')}${docs.length > shown.length ? `, pierwsze ${shown.length}` : ''}:</p>
    <ul>${shown.map((t) => `<li>${esc(cap(t.title.pl))}${t.alternatives ? ' (albo dokument zamienny)' : ''}${t.outcome === 'unknown' ? ' (sprawdź, czy Cię dotyczy)' : ''}</li>`).join('')}</ul>
    ${cite(shown[0].quotes, 'Lista z przewodnika Formalki, stan na 15.10.2026.')}${actsHTML(c, A)}`);
}
async function answerForm(c) {
  const p = plan(c);
  const t = openLevels(p).flatMap((l) => l.tasks).find((x) => !isDone(x) && (isFormable(x) || taskLinks(x).length));
  if (!t) { await say(c, `<p>Na otwartych poziomach nie ma formularza do wypełnienia.</p>${actsHTML(c, guidance(c).actions.slice(0, 2))}`); return; }
  const links = taskLinks(t);
  const A = [];
  if (isFormable(t)) A.push({ kind: 'form', taskId: t.id, label: 'Wypełnij tutaj', ic: 'file-text', primary: true });
  links.slice(0, 2).forEach((x) => A.push({ kind: 'link', url: x.url, label: x.label }));
  if (!links.length && t.quotes?.length) A.push({ kind: 'link', url: t.quotes[0].page, label: `Strona ze wzorem (${host(t.quotes[0].page)})` });
  await say(c, `<p>Dokument: <b>${esc(t.officialName || cap(t.title.pl))}</b>. ${links.length ? 'Wzór pobierzesz z oficjalnej strony, wydrukujesz i wypełnisz ręcznie.' : 'Wzoru nie mamy jako pliku: jest na oficjalnej stronie.'}${isFormable(t) ? ' Możesz też wypełnić go tutaj: szkic PDF zapiszę w Teczce, żeby można go było później wydrukować.' : ''}</p>${actsHTML(c, A)}`);
}
async function answerOffice(c) {
  const p = plan(c);
  const l = openLevels(p).find((x) => x.office) || p.levels.find((x) => x.office);
  if (!l) { await say(c, `<p>W tej sprawie plan nie wskazuje urzędu.</p>${actsHTML(c, guidance(c).actions.slice(0, 2))}`); return; }
  const o = l.office;
  if (o.needsPlace) { await say(c, `<p>Podaj miejscowość, a pokażę urzędy z naszych źródeł, z adresami i godzinami.</p>${actsHTML(c, [{ kind: 'place', label: 'Podaj miejscowość', ic: 'map-pin', primary: true }])}`); return; }
  if (!o.offices?.length) { await say(c, `<p>${esc(E.msg.officeUnknown())}</p>${actsHTML(c, guidance(c).actions.slice(0, 2))}`); return; }
  const many = o.offices.length > 1;
  const first = o.offices[0];
  await say(c, `<p>${many ? `Dla miejscowości ${esc(c.state.place?.name ?? '')} mam ${o.offices.length} ${plural(o.offices.length, 'urząd', 'urzędy', 'urzędów')} z adresami i godzinami. Wybierz najbliższy według dzielnicy.` : `Urząd: <b>${esc(first.name.pl)}</b>${first.address ? `, ${esc(first.address.value)}` : ''}.`}</p>
    <p class="meta">Numerów telefonów urzędów nie mamy w naszych źródłach, więc ich nie podaję.</p>
    ${actsHTML(c, [{ kind: 'offices', levelId: l.id, label: many ? 'Urzędy i mapa' : 'Adres i mapa', ic: 'map-pin', primary: true }, ...(first.website && !many ? [{ kind: 'link', url: first.website, label: 'Strona urzędu' }] : [])])}`);
}
