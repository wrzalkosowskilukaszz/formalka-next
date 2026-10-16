/* ── Starting a case: questions, the person's own words, route, place, plan approval ── */
async function startCase(bpId, text) {
  const c = newCase(bpId);
  S.active = c.id;
  S.building = c.id;
  makeBuilder(c);
  if (S.screen !== 'chat') go('chat', 'fwd'); else render();
  await sleep(380);
  if (S.cases.length > 1) addMsg('join', `${esc(c.who)} dołącza do rozmowy`, c);
  updateBuilder(c, true);
  mapNote(`Tworzymy Twoją sprawę: ${c.title}`);
  if (!S.disclosed) {
    S.disclosed = true;
    sys('Prototyp: asystent nie korzysta z modelu językowego. Plan liczy silnik z przewodników Formalki, a odpowiedzi pisane własnymi słowami czyta prosty czytnik na telefonie.');
  }
  await say(c, esc(E.msg.intro(personaOf(c), c.title)), 600);
  await askWhom(c, text);
  // "Potrzebuję przyspieszyć wydanie karty" is about a case already filed: that need comes first.
  if (text && readWaiting(text) && hasWaiting(c) && !(await waitingFlow(c))) { pauseIntake(c); return; }
  if (text) await readWords(c, text);
  await intakeLoop(c);
}
// The plan waits until the person asks for it; the case stays, and typing resumes the questions.
function pauseIntake(c) {
  S.building = null;
  mountBuilder();
  logAct(c, 'Plan sprawy odłożony na później');
}

// Whose case it is (owner, 2026-10-16): the questions speak to the person, or ask about someone else.
// The person's first words may already say it ("dla mamy", "abym złożył"); otherwise it is asked once.
async function askWhom(c, text) {
  const said = text ? readWhom(text) : null;
  if (said) {
    c.voice = said;
    heard(c, said === 'you' ? 'Twoja sprawa' : 'sprawa kogoś innego');
  } else {
    const a = await ask({ c, q: 'Załatwiasz to dla siebie czy dla kogoś innego?', dk: false,
      why: 'Żeby dobrze pytać: o Ciebie albo o tę osobę. Plan, źródła i przypomnienia są takie same; przypomnienia dostajesz Ty.',
      options: [{ label: 'Dla siebie', value: 'you' }, { label: 'Dla kogoś innego, na przykład z rodziny', value: 'other' }],
      words: (t) => !!readWhom(t), hint: 'Napisz na przykład „dla siebie” albo „dla mamy”.' });
    c.voice = a.value === '__text__' ? readWhom(a.text) : a.value;
    if (a.value === '__text__') heard(c, c.voice === 'you' ? 'Dla siebie' : 'Dla kogoś innego');
  }
  if (forOther(c)) {
    remember(c, 'Sprawa kogoś innego: pytania dotyczą tej osoby, przypomnienia dostajesz Ty.');
    await say(c, 'Dobrze. Będę pytać o tę osobę, a plan ułożymy dla niej. Kroki i przypomnienia trafią do Ciebie.', 300);
  }
}

// The next step until the plan can be approved: a question, the route choice, the city, or the plan.
async function intakeLoop(c) {
  for (;;) {
    const before = plan(c);
    const q = E.nextQuestion(c.bpId, c.state, c.asked, 12, c.voice);
    if (q) {
      const options = (q.options ?? []).map((o) => ({ label: o.label.pl, value: o.value }));
      const a = await ask({ c, q: q.question.pl, why: q.whyWeAsk?.pl, help: q.unknownHelp?.pl, options,
        long: options.some((o) => o.label.length > 34), prog: progressOf(c, before), words: (t) => hasWords(c, t) });
      touch(c);
      if (a.value === '__text__') { await readWords(c, a.text); continue; }
      const unknown = a.value === UNKNOWN_CHOICE;
      c.state.facts[q.key] = unknown ? E.UNKNOWN : a.value;
      c.asked++;
      if (unknown && q.unknownHelp?.pl) await say(c, esc(q.unknownHelp.pl), 300);
      noteChange(c, before);
      continue;
    }
    if (before.route.status === 'choice' && !c.state.routeChoice) { c.state.routeChoice = await chooseRoute(c, before); noteChange(c, before); continue; }
    if (before.route.status === 'unsure' || before.route.status === 'none') { await stuck(c, before); return; }
    if (!c.placeAsked && before.levels.some((l) => l.office?.needsPlace)) { await askPlace(c); noteChange(c, before); continue; }
    if (await planApproval(c)) return;
  }
}
// Whether the engine's intake finds facts (or the city) in the words: then each is confirmed on its own card.
const hasWords = (c, t) => E.intake(c.bpId, t, c.state).candidates.length > 0 || (!c.state.place && !!E.placeCandidate(t, PLACES));

// The person's own words, read on the device (FormalkaEngine.intake): proposals only, each confirmed
// on its own card. Returns how many were confirmed. After approval, the result is a proposal (ADR-N003).
async function readWords(c, text) {
  const cands = [...E.intake(c.bpId, text, c.state).candidates];
  const pc = c.state.place ? null : E.placeCandidate(text, PLACES);
  if (pc) cands.push({ fact: 'place', value: pc.place.teryt, evidence: pc.evidence, place: { teryt: pc.place.teryt, name: pc.place.name } });
  if (!cands.length) return 0;
  await say(c, `Z Twoich słów rozumiem ${cands.length} ${plural(cands.length, 'rzecz', 'rzeczy', 'rzeczy')}. Sprawdź każdą; do planu trafi tylko to, co potwierdzisz.`);
  const yes = [];
  let place = null;
  for (const x of cands) {
    const f = x.fact === 'place' ? null : factOf(c, x.fact);
    const ok = await approve({ c, kicker: 'Z Twojego opisu', ic: 'chat-circle-dots',
      title: f ? (f.options?.find((o) => o.value === x.value)?.label.pl ?? String(x.value)) : x.place.name,
      sub: f ? f.question.pl : 'Miejscowość, tylko po to, by wskazać urząd',
      note: `Twoje słowa: „${echoed(clause(text, x.evidence))}”`, yes: 'Tak, zgadza się', no: 'Nie' });
    if (ok) {
      if (x.fact === 'place') place = x.place; else yes.push(x.fact);
      remember(c, `Z Twoich słów: ${x.fact === 'place' ? x.place.name : f.options?.find((o) => o.value === x.value)?.label.pl ?? x.value}`);
    }
  }
  const before = plan(c);
  let next = E.confirmCandidates(c.state, cands.filter((x) => x.fact !== 'place'), yes);
  if (place) next = { ...next, place };
  const n = yes.length + (place ? 1 : 0);
  if (c.state.approved) {
    if (n) await proposeChange(c, next); else await say(c, 'Dobrze, plan zostaje bez zmian.');
    return n || 1;
  }
  c.state = next;
  if (place) c.placeAsked = true;
  await say(c, n ? `Dziękuję. Potwierdzone z Twojego opisu: ${n}. Zapytam tylko o resztę.` : 'Dobrze, zapytam o wszystko po kolei.', 300);
  noteChange(c, before);
  return n || 1;
}

// After approval a change is a proposal: what it would add, remove or make certain (ADR-N003).
// When the change opens a second route, the person picks the route first; when it leaves no route
// from the sources, the plan stays as it is and the assistant says so.
async function proposeChange(c, next) {
  let np = E.plan(c.bpId, next);
  if (np.route.status === 'choice' && !np.route.procedureId) {
    await say(c, 'Z tą zmianą pasuje więcej niż jedna droga. Najpierw wybierz drogę, potem pokażę, co się zmieni.');
    next = { ...next, routeChoice: await chooseRoute(c, np, false) };
    np = E.plan(c.bpId, next);
  }
  if (np.route.status === 'unsure' || np.route.status === 'none' || !np.route.procedureId) {
    const proc = E.procedure(plan(c).route.procedureId);
    const aid = proc?.handoff?.options?.find((o) => o.link?.url);
    await say(c, `<p>Z tą zmianą nie ustalę drogi z naszych źródeł, więc plan zostaje bez zmian.</p>${actsHTML(c, aid ? [{ kind: 'link', url: aid.link.url, label: aid.name?.pl ?? 'Nieodpłatna pomoc prawna' }] : guidance(c).actions.slice(0, 2))}`);
    return;
  }
  const diff = E.diffPlans(plan(c), np, c.state.tasks);
  if (diff.empty) { await say(c, 'To nic nie zmienia w Twoim planie.'); return; }
  const li = (label, xs, f = (x) => cap(x.title.pl)) => (xs?.length ? `<p class="meta">${label}</p><ul class="bul">${xs.map((x) => `<li>${esc(f(x))}</li>`).join('')}</ul>` : '');
  const proc = (id) => (id ? E.procedure(id)?.title.pl ?? id : 'brak');
  const r = await panel(`<section class="stack" style="padding-block:0;gap:var(--s3)">
    <p class="dock-q" tabindex="-1" data-focus>Ta zmiana zmieni Twój plan. Sprawdź, zanim zatwierdzisz</p>
    ${diff.route ? `<p class="meta">Droga: ${esc(proc(diff.route.from))} → <b>${esc(proc(diff.route.to))}</b></p>` : ''}
    ${li('Nowe w planie:', diff.tasks.added)}${li('Już wiadomo, że potrzebne:', diff.tasks.nowCertain)}${li('Nie będzie potrzebne:', diff.tasks.removed)}
    ${li('Zrobione, zostaje w historii:', diff.tasks.keptAsHistory)}
    ${li('Nowe opłaty:', diff.fees.added, (f) => `${f.title.pl}: ${f.amountPln} zł`)}${li('Opłaty, które odpadają:', diff.fees.removed, (f) => `${f.title.pl}: ${f.amountPln} zł`)}
    ${li('Zmienione opłaty:', diff.fees.changed, (f) => `${f.title.pl}: ${f.from} zł → ${f.to} zł`)}
    ${li('Nowe terminy:', diff.deadlines.added)}${li('Terminy, które odpadają:', diff.deadlines.removed)}
    ${li('Inny urząd:', diff.offices, (o) => o.title.pl)}
    ${li('Poziomy:', diff.levels.state, (l) => `${l.title.pl}: ${STATE[l.from]} → ${STATE[l.to]}`)}
    <div class="ap-act"><button type="button" class="btn btn-quiet" data-pick="no">Zostaw jak było</button><button type="button" class="btn btn-accent" data-pick="yes">Zatwierdzam zmianę</button></div></section>`,
  (t) => { const n = norm(t), pol = polarity(n, true); return pol === 'no' || pol === 'dk' ? 'no' : pol === 'yes' || /^(?:zmien|zmien plan)$/.test(n) ? 'yes' : null; }, c);
  if (r.value === 'yes') {
    c.state = { ...next, tasks: E.applyReplan(c.state.tasks, diff) };
    logAct(c, 'Plan zmieniony po Twojej zmianie sytuacji. Zrobione rzeczy zostają w historii');
    if (!r.typed) me('Zatwierdzam zmianę');
    await say(c, 'Plan zmieniony. Zrobione rzeczy zostają w historii.');
    postGuide(c, true);
  } else { if (!r.typed) me('Zostaw jak było'); await say(c, `<p>Plan bez zmian.</p>${actsHTML(c, guidance(c).actions)}`); }
}

// Several routes fit: the person picks, with the differences from the sources (the engine never picks).
// Returns the procedure id; the caller puts it into the state it is building.
async function chooseRoute(c, p, intro = true) {
  const cands = p.route.candidates.filter((x) => x.outcome === 'applies' || x.outcome === 'reachable');
  if (intro) await say(c, 'Pasuje więcej niż jedna droga. Wybór należy do Ciebie. Poniżej różnice z oficjalnych źródeł.');
  const card = (x) => {
    const proc = E.procedure(x.procedureId);
    const fees = proc.fees.map((f) => `${f.amountPln.value} zł: ${f.purpose.pl}`);
    const pits = (proc.pitfalls ?? []).filter((pt) => pt.important).slice(0, 2);
    const q = pits[0]?.statement.quotes ?? proc.fees[0]?.amountPln.quotes;
    return `<article class="route-card"><b>${esc(proc.title.pl)}</b>
      ${x.outcome === 'reachable' ? `<p class="meta">${icon('lock-simple')} ${esc(x.via?.[0]?.label.pl ?? '')}</p>` : ''}
      ${proc.summary?.pl ? `<p>${esc(proc.summary.pl)}</p>` : ''}
      ${fees.length ? `<p class="facts-line">${icon('coins')} ${esc(fees.join('; '))}</p>` : ''}
      ${pits.length ? `<ul class="bul">${pits.map((pt) => `<li>${esc(pt.statement.value.pl)}</li>`).join('')}</ul>` : ''}
      ${cite(q)}
      <button type="button" class="btn btn-accent btn-block" data-pick="${esc(x.procedureId)}">Wybieram tę drogę</button></article>`;
  };
  const asOptions = cands.map((x) => ({ label: E.procedure(x.procedureId).title.pl, value: x.procedureId }));
  for (;;) {
    const r = await panel(`<p class="dock-q" tabindex="-1" data-focus>Którą drogą idziemy?</p><div class="routes">${cands.map(card).join('')}</div>`,
      (t) => { const a = readAnswer(t, asOptions); return a.type === 'option' ? a.o.value : null; }, c);
    const t = E.procedure(r.value).title.pl;
    if (r.typed) {
      await think(c);
      if (!(await approve({ c, kicker: 'Dobrze rozumiem?', ic: 'signpost', title: t, sub: 'Droga, którą wybierasz', note: `Twoje słowa: „${echoed(r.typed)}”`, yes: 'Tak, tę', no: 'Nie', echo: false }))) continue;
    } else me(`Wybieram: ${t}`);
    logAct(c, `Wybrana droga: ${t}`);
    return r.value;
  }
}

// No route from the sources fits, or "Nie wiem" leaves it open: say so and hand off.
async function stuck(c, p) {
  c.stuck = true;
  const proc = E.procedure(p.route.candidates[0]?.procedureId);
  const aid = proc?.handoff?.options?.find((o) => o.link?.url);
  const text = p.route.status === 'unsure'
    ? 'Bez tych odpowiedzi nie ustalę drogi z naszych źródeł, więc nie zgaduję.'
    : 'Żadna droga z naszych źródeł nie pasuje do Twoich odpowiedzi. Tego nie poprowadzę krok po kroku.';
  const when = proc?.handoff?.when?.pl;
  await say(c, `<p>${esc(text)}</p>${when ? `<p class="meta">Kiedy warto zapytać kogoś o pomoc, według przewodnika: ${esc(when)}</p>` : ''}
    ${aid ? actsHTML(c, [{ kind: 'link', url: aid.link.url, label: `Bezpłatna pomoc: ${aid.name?.pl ?? 'Nieodpłatna pomoc prawna'}` }]) : ''}<p>Co robimy dalej?</p>`);
  const related = E.blueprint(c.bpId).related ?? [];
  const a = await ask({ c, dk: false, options: [
    ...related.map((r) => ({ label: r.label.pl, value: `rel:${r.blueprint}` })),
    { label: 'Popraw odpowiedzi', value: 'redo' }, { label: 'Wróć do Startu', value: 'home' }] });
  if (a.value.startsWith('rel:')) { S.building = null; await startCase(a.value.slice(4)); return; }
  if (a.value === 'redo') { restartIntake(c); await intakeLoop(c); return; }
  S.building = null;
  go('world', 'back');
}
// Picks up a case's unfinished plan where it stopped (its answers stay); another case's open question waits.
async function resumeIntake(c, note = 'Wracamy do planu sprawy. Pytam tylko o to, czego jeszcze nie wiem.') {
  S.active = c.id;
  if (S.building !== c.id || !builderEl) { S.building = c.id; makeBuilder(c); mountBuilder(); }
  if (note) await say(c, esc(note));
  await intakeLoop(c);
}
function restartIntake(c) {
  c.state = { facts: {}, tasks: {}, events: [], approved: false };
  c.asked = 0; c.placeAsked = false; c.stuck = false;
  S.building = c.id;
  BN.clear();
  if (builderEl) $('.b-nodes', builderEl).innerHTML = '';
  updateBuilder(c, true);
  mapNote('Zaczynamy od nowa. Poprzednie odpowiedzi nie są zapisane.');
}

async function askPlace(c) {
  const a = await ask({ c, q: 'W jakiej miejscowości mieszkasz? Pokażę urząd z naszych źródeł.', why: 'Tylko po to, by wskazać urząd. Miejscowość zostaje na Twoim telefonie.',
    options: [...PLACES.map((x) => ({ label: x.name, value: x.teryt })), { label: 'Inna albo wolę nie podawać', value: '' }], dk: false,
    words: (t) => !!E.placeCandidate(t, PLACES),
    hint: `W prototypie znam urzędy dla miejscowości: ${PLACES.map((x) => x.name).join(', ')}. Dla innej wybierz „Inna albo wolę nie podawać”.` });
  c.placeAsked = true;
  // A city named in the words is the city's own name form ("w Krakowie"), so it is taken as said.
  const named = a.value === '__text__' ? E.placeCandidate(a.text, PLACES)?.place : null;
  if (named) heard(c, named.name);
  const pl = PLACES.find((x) => x.teryt === (named ? named.teryt : a.value));
  if (pl) { c.state.place = { teryt: pl.teryt, name: pl.name }; remember(c, `Miejscowość: ${pl.name}`); }
}

// The plan summary: assumptions, what is still open, the validator's verdict, the one consent per case.
// Resolves true once approved; false when the person's words changed the answers (the loop goes on).
async function planApproval(c) {
  const p = plan(c);
  const v = E.validate(p, c.state);
  await say(c, esc(E.msg.planReady(p.unsure.length)), 600);
  const ok = guard();
  const rows = p.assumptions.map((a) => {
    const f = factOf(c, a.fact);
    return `<li><span class="meta">${esc(f?.question.pl ?? a.fact)}</span><b>${esc(f?.options?.find((o) => o.value === a.value)?.label.pl ?? String(a.value))}</b></li>`;
  }).join('');
  const fees = p.levels.flatMap((l) => l.fees).filter((f) => !f.optional && f.outcome === 'applies' && f.exemption?.outcome !== 'applies');
  const total = fees.reduce((n, f) => n + f.amountPln, 0);
  const verdict = await new Promise((res) => {
    showDock(`<section aria-labelledby="plan-h" class="plan-card">
      <h2 id="plan-h" class="dock-q" tabindex="-1" data-focus>Twój pierwszy plan</h2>
      <ul class="list">
        <li class="row"><span class="sq">${icon(forOther(c) ? 'users' : 'user')}</span><span class="tx"><b>${forOther(c) ? 'Sprawa kogoś innego' : 'Twoja sprawa'}</b><span class="meta">${forOther(c) ? 'Pytania dotyczyły tej osoby' : 'Pytania dotyczyły Ciebie'}</span></span><button type="button" class="btn btn-ghost btn-sm" id="whom">Zmień</button></li>
        <li class="row"><span class="sq">${icon('signpost')}</span><span class="tx"><b>${esc(routeTitle(p) || c.title)}</b><span class="meta">${p.levels.length - 1} ${plural(p.levels.length - 1, 'poziom', 'poziomy', 'poziomów')} na mapie${c.state.place ? `. Miejscowość: ${esc(c.state.place.name)}` : ''}</span></span></li>
        ${p.unsure.length ? `<li class="row"><span class="sq">${icon('question')}</span><span class="tx"><b>Do potwierdzenia (${p.unsure.length})</b><span class="meta">${p.unsure.map((u) => esc(factOf(c, u.fact)?.question.pl ?? u.fact)).join('<br>')}</span></span></li>` : ''}
        ${staleOf(p) ? `<li class="row"><span class="sq">${icon('warning-circle')}</span><span class="tx"><b>Część dat może być nieaktualna</b><span class="meta">${esc(staleOf(p).text)}</span></span></li>` : ''}
        ${total ? `<li class="row"><span class="sq">${icon('coins')}</span><span class="tx"><b>Opłaty: ${total} zł</b><span class="meta">Przykład z przewodnika Formalki, stan na 15.10.2026</span></span></li>` : ''}
        <li class="row"><span class="sq">${icon(v.ok ? 'list-checks' : 'warning-circle')}</span><span class="tx"><b>${v.ok ? 'Plan zgodny z przewodnikami Formalki' : `Plan niezgodny z przewodnikami (${v.violations.length})`}</b><span class="meta">${v.ok ? 'Silnik sprawdza źródło każdego elementu oraz kwoty, terminy i urzędy względem przewodników. To nie jest weryfikacja prawna: przewodniki mogą być niepełne. Kwoty i terminy to przykłady.' : 'Nie pokażę planu, który nie przeszedł kontroli'}</span></span></li>
      </ul>
      ${rows ? `<details class="answers"><summary>Twoje odpowiedzi (${p.assumptions.length})</summary><ul>${rows}</ul></details>` : ''}
      <div class="switch-row"><button type="button" class="switch" role="switch" aria-checked="false" id="consent" aria-labelledby="consent-l"></button>
        <span class="switch-label" id="consent-l"><b>${esc(c.who)} może ${who(c.who).sam} dodawać przypomnienia i wpisy w kalendarzu do tej sprawy</b>
        Każde działanie zobaczysz w historii sprawy i możesz je cofnąć. Najwyżej jedno powiadomienie dziennie, nic między 20:00 a 8:00.</span></div>
      <button type="button" class="btn btn-accent btn-block btn-knob press" id="approve" ${v.ok ? '' : 'disabled'}><span class="knob">${icon('check')}</span>Zatwierdzam plan</button>
      <div class="plan-more"><button type="button" class="btn btn-ghost" id="planmap">${icon('map-trifold')} Zobacz mapę</button>
        <button type="button" class="btn btn-ghost" id="redo">Popraw odpowiedzi</button></div></section>
      ${askBar('Albo napisz, na przykład: zatwierdzam')}`);
    const sw = $('#consent', dockEl);
    let done = false, busy = false;
    const finish = (r) => { if (done || !ok()) return; done = true; dockEl.innerHTML = ''; res(r); };
    const setConsent = (on) => sw.setAttribute('aria-checked', String(on));
    const approveNow = (label) => {
      if (!v.ok) return;
      c.prefs.consent = sw.getAttribute('aria-checked') === 'true';
      if (label) me(label);
      else me(c.prefs.consent ? `Zatwierdzam plan. ${c.who} może ${who(c.who).sam} dodawać przypomnienia.` : 'Zatwierdzam plan.');
      finish('yes');
    };
    sw.onclick = () => setConsent(sw.getAttribute('aria-checked') !== 'true');
    $('#planmap', dockEl).onclick = () => openMapSheet(c);
    $('#whom', dockEl).onclick = () => { if (done || !ok()) return; me(forOther(c) ? 'To moja sprawa' : 'To sprawa kogoś innego'); finish('whom'); };
    $('#redo', dockEl).onclick = () => { if (done || !ok()) return; me('Popraw odpowiedzi'); finish('redo'); };
    $('#approve', dockEl).onclick = () => approveNow();
    $('form', dockEl).onsubmit = async (e) => {
      e.preventDefault();
      const input = e.target.elements.t;
      const t = input.value.trim();
      if (!t || busy || done) return;
      input.value = '';
      const n = norm(t);
      // Only a plain consent approves the plan (audit F5): "nie zatwierdzam" or "tak, ale…" never does.
      if (polarity(n, true) === 'yes' || /^(?:akceptuje|akceptuje plan|w porzadku)$/.test(n)) { approveNow(t); return; }
      if (!/^nie /.test(n) && /popraw|zmien|od nowa|jeszcze raz|cofnij/.test(n)) { me(t); finish('redo'); return; }
      busy = true;
      me(t);
      await think(c);
      busy = false;
      if (done || !ok()) return;
      if (/map/.test(n)) { openMapSheet(c); await say(c, `${gendered(c, 'Otworzyłem', 'Otworzyłam')} mapę sprawy. Gdy plan pasuje, zatwierdź go.`); return; }
      if (/przypomn|powiadom|kalendarz|zgod/.test(n)) {
        const off = /nie |bez |wylacz/.test(` ${n}`);
        setConsent(!off);
        await say(c, off ? 'Dobrze, przełącznik zostaje wyłączony: przypomnienia będą tylko w aplikacji.' : `Włączam przełącznik: ${who(c.who).sam} dodam przypomnienia do tej sprawy. Zatwierdź plan, gdy pasuje.`);
        return;
      }
      if (hasWords(c, t)) { finish({ words: t }); return; }
      await notSure(c, 'Możesz zatwierdzić plan, poprawić odpowiedzi albo zobaczyć mapę. Możesz też napisać, co się zmieniło.');
    };
  });
  if (verdict.words) { await readWords(c, verdict.words); return false; }
  if (verdict === 'redo') { restartIntake(c); return false; }
  if (verdict === 'whom') {
    c.voice = forOther(c) ? 'you' : 'other';
    await say(c, forOther(c) ? 'Dobrze, to sprawa kogoś innego. Odpowiedzi zostają, zmienia się tylko to, jak pytam.' : 'Dobrze, to Twoja sprawa. Odpowiedzi zostają, zmienia się tylko to, jak pytam.', 300);
    return false;
  }
  c.state.approved = true;
  S.building = null;
  logAct(c, `Plan zatwierdzony: ${routeTitle(p) || c.title}`);
  if (c.prefs.consent) logAct(c, `Zgoda: ${c.who} może ${who(c.who).sam} dodawać przypomnienia i wpisy w kalendarzu do tej sprawy`);
  updateBuilder(c, true, p.levels.map((l) => l.id));
  renderClock(); // the tester's time travel works once a plan is approved
  await sleep(700);
  mountBuilder();
  drawStatus($('.status-slot'));
  await say(c, `<p>Plan zatwierdzony, sprawa jest aktywna. Od teraz jestem przy każdym kroku: piszę, co dalej, i proponuję, co mogę zrobić.</p>
    <p><button type="button" class="btn btn-accent btn-sm" data-act="focus" data-case="${c.id}">${icon('arrow-right')} Otwórz sprawę</button></p>`);
  postGuide(c, true);
  return true;
}

/* ── The open conversation: the person writes, the assistant reads it, answers from the plan and
   proposes what it can do. Every reply ends with an action, unless nothing is left to do. ── */
function suggestions() {
  const c = C();
  const s = [];
  if (c && c.state.approved) s.push('Co mam teraz zrobić?', 'Jakie dokumenty są potrzebne?', 'Ile to kosztuje?', 'Gdzie jest urząd?');
  for (const t of caseTypes()) if (!S.cases.some((x) => x.bpId === t.id) && s.length < 4) s.push(t.example);
  return s;
}
function idleDock() {
  if (!dockEl || S.flow) return;
  const c = C();
  dockEl.innerHTML = `<div class="opts row-x" aria-label="Podpowiedzi">${suggestions().map((t, i) => `<button type="button" class="chip chip-sm chip-q" style="animation-delay:${i * 40}ms" data-s="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    ${askBar(c ? `Napisz do ${who(c.who).gen}` : 'Napisz, co masz do załatwienia')}`;
  $$('[data-s]', dockEl).forEach((b) => { b.onclick = () => free(b.dataset.s); });
  $('form', dockEl).onsubmit = (e) => { e.preventDefault(); const v = e.target.elements.t.value.trim(); if (v) free(v); };
}
function free(text) {
  me(text);
  // "Mój PESEL to ..." is data, not a request for the PESEL case.
  const personal = looksPersonal(text);
  const named = personal ? [] : intentsIn(text);
  const fresh = named.filter((id) => !S.cases.some((c) => c.bpId === id));
  const c = C();
  // Words that answer this case's questions ("mam certyfikat B1") update this case, not start another.
  const own = !!c && !personal && hasWords(c, text);
  if (!own && fresh.length === 1 && !(c && named.includes(c.bpId))) return runFlow('case', () => startCase(fresh[0], text));
  if (!own && fresh.length > 1) return runFlow('pick', () => pickCase(fresh, text));
  if (!c) { sys(`Tej sprawy nie prowadzimy jeszcze krok po kroku. ${STUDY ? 'W tym badaniu prowadzimy tylko zameldowanie.' : `W prototypie są: ${CASE_TYPES.map((x) => x.short).join(', ')}.`}`); return null; }
  return runFlow('free', async () => {
    await think(c);
    if (personal) {
      await say(c, `Widzę coś, co wygląda na numer dokumentu, PESEL albo dane kontaktowe, więc ${gendered(c, 'zakryłem', 'zakryłam')} to na ekranie. Nie zapisuję tego w sprawie i nie musisz mi tego podawać: plan nie potrzebuje danych osobowych.`);
      if (!c.state.approved) return resumeIntake(c, null);
      return;
    }
    const fu = c.awaiting && !c.answered[c.awaiting] ? c.awaiting : null;
    const said = fu && readFollowUp(text);
    if (said) {
      const label = E.msg.followUpAnswers.find((a) => a.id === said)?.label ?? said;
      const yes = await approve({ c, kicker: 'Dobrze rozumiem?', ic: 'chat-circle-dots', title: label, sub: 'Twoja odpowiedź na pytanie, jak poszło w urzędzie', note: `Twoje słowa: „${echoed(text)}”`, yes: 'Tak, zapisz', no: 'Nie', echo: false });
      if (yes) return followUp(c, fu, said, true);
      await say(c, '<p>Dobrze. Odpowiedz przyciskiem przy pytaniu albo napisz to inaczej.</p>');
      return;
    }
    // About the visit, but not clear how it went ("nie przyjęli wniosku"): ask, with the three answers.
    if (fu && /urzad|wniosek|wniosk|wizyt|poszlo|przyjel|bylem|bylam|bylo/.test(norm(text))) {
      await say(c, `<p>Nie jestem ${gendered(c, 'pewien', 'pewna')}, jak poszło. Wybierz jedną odpowiedź:</p><div class="opts fu">${E.msg.followUpAnswers.map((a) => `<button type="button" class="chip chip-sm" data-fu="${esc(fu)}" data-case="${c.id}" data-a="${esc(a.id)}">${esc(a.label)}</button>`).join('')}</div>`);
      return;
    }
    if (readWaiting(text) && hasWaiting(c)) {
      const more = await waitingFlow(c);
      if (!c.state.approved) { if (more) return resumeIntake(c, null); return pauseIntake(c); }
      return;
    }
    // "Ułóż plan", after the plan was put off: back to the questions.
    if (!c.state.approved && S.building !== c.id && /(?:^| )(?:uloz\w*|zaplanuj\w*|plan\w*|dalej|wracamy|kontynuuj\w*)(?= |$)/.test(norm(text))) return resumeIntake(c);
    if (!c.state.approved) {
      if (!(await readWords(c, text))) await notSure(c, 'Wróćmy do planu: odpowiedz na pytanie poniżej, przyciskiem albo własnymi słowami.');
      return resumeIntake(c, null);
    }
    const n = norm(text);
    const route = [
      [/tlumacz|adwokat|prawnik|cena uslug/, answerUnknown],
      [/koszt|oplat|ile (?:to )?(?:kosztuje|place|zaplac)|zaplac|cena|\bzl\b/, answerFees],
      [/do kiedy|ile czasu|jak dlugo|termin|deadline|kiedy urzad/, answerDates],
      [/wizyt|umow|rezerw/, answerVisit],
      [/przypomn|powiadom/, answerReminder],
      [/dokument|zabrac|papier|zalacznik|teczk|potrzebn/, answerDocs],
      [/formularz|wniosek|wniosku|wzor|pobra|druk|pdf|wypelni/, answerForm],
      [/urzad|adres|gdzie|godzin|otwar|dzielnic|lokalizac|telefon|numer|infolin/, answerOffice],
      [/co (?:mam )?teraz|co dalej|nastepn|co robic|od czego|pomoz|pomoc|co zrobic/, answerNow],
      [/mapa|etap|poziom|postep|gdzie jestem/, answerMap],
    ].find(([re]) => re.test(n));
    if (route) return route[1](c);
    if (hasWords(c, text)) { await readWords(c, text); return; }
    await notSure(c, 'Mogę pomóc z tym, co jest w planie: co teraz, dokumenty, opłaty, terminy, urzędy i przypomnienia. Napisz to inaczej albo wybierz podpowiedź poniżej.');
  });
}
// A number that looks like a PESEL or a document number (rule 8: no personal data needed).

async function pickCase(ids, text) {
  sys('Twój opis pasuje do kilku spraw. Którą zaczynamy?');
  const r = await panel(`<p class="dock-q" tabindex="-1" data-focus>Którą sprawę zaczynamy?</p><div class="opts cards">${ids.map((x) => `<button type="button" class="chip chip-card" data-pick="${x}">${icon(typeOf(x)?.ic || 'files')}<span>${esc(E.blueprint(x).title.pl)}</span></button>`).join('')}</div>`,
    (t) => { const m = intentsIn(t).filter((x) => ids.includes(x)); return m.length === 1 ? m[0] : null; });
  if (!r.typed) me(E.blueprint(r.value).title.pl);
  await startCase(r.value, text);
}

function onLogClick(e) {
  const b = e.target.closest('[data-do], [data-act], [data-fu], [data-cross]');
  if (!b) return;
  if (b.dataset.do) { doAction(b.dataset.do); return; }
  if (b.dataset.fu) { const c = caseById(b.dataset.case); if (c) runFlow('followup', () => followUp(c, b.dataset.fu, b.dataset.a)); return; }
  if (b.dataset.cross) { runFlow('case', () => startCase(b.dataset.cross)); return; }
  const c = caseById(b.dataset.case) || caseById(S.building) || C();
  if (!c) return;
  if (b.dataset.act === 'mapsheet') { openMapSheet(c); return; }
  S.active = c.id;
  S.view = b.dataset.act === 'map' ? 'map' : 'focus';
  go('case', 'fwd');
}
