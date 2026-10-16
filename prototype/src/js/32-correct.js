/* ── Correcting a confirmed answer after the plan is approved (owner, round 2 correction) ──────────
   A person can confirm a wrong answer. After approval it can still be corrected, but never silently:
   - the corrected answer makes a proposed plan, and the diff shows what would change;
   - the person approves the change or keeps the plan (ADR-N003);
   - the history keeps the old answer, the new one and the decision.
   Until the person decides, every level the correction would change is marked "Do ponownego
   sprawdzenia": the assistant offers no step there, and the case's reminders wait. When the corrected
   answer leaves no route in the sources, the whole plan is marked and nothing is guessed. */

const answerLabel = (c, key, value) => (value === E.UNKNOWN ? 'Nie wiem'
  : factOf(c, key)?.options?.find((o) => o.value === value)?.label.pl ?? String(value));
// The answers the person can correct: every fact of the case with a question in the registry.
const answeredFacts = (c) => Object.keys(c.state.facts).filter((k) => factOf(c, k)?.options?.length);

// Every level a plan diff touches; a route change touches them all.
function affectedBy(diff, levels) {
  if (diff.route) return new Set(levels.map((l) => l.id));
  const ids = new Set();
  for (const group of [diff.levels, diff.tasks, diff.fees, diff.deadlines]) for (const xs of Object.values(group)) for (const x of xs) ids.add(x.levelId);
  for (const o of diff.offices) ids.add(o.levelId);
  return ids;
}
const needsRecheck = (c, l) => !!c.pendingFix && (c.pendingFix.all || c.pendingFix.levels.includes(l.id));
const recheckChip = () => `<span class="state-chip recheck">${icon('warning-circle')}Do ponownego sprawdzenia</span>`;

// Words that give another value for an answered fact ("chcę się zameldować na pobyt czasowy"). The
// reader proposes only what passes all of intake's checks with that fact taken out (verbatim, on topic,
// a valid option), never a guess.
function correctionIn(c, text) {
  const r = E.intake(c.bpId, text, c.state);
  for (const x of r.rejected) {
    if (x.code !== 'ANSWERED' || x.candidate.value === c.state.facts[x.candidate.fact]) continue;
    const facts = { ...c.state.facts };
    delete facts[x.candidate.fact];
    const ok = E.intake(c.bpId, text, { ...c.state, facts }).candidates.find((y) => y.fact === x.candidate.fact && y.value === x.candidate.value);
    if (ok) return ok;
  }
  return null;
}
const ASKS_FIX = /(?:^| )(?:pomylil\w*|pomylk\w*|popraw\w* odpowiedz\w*|zmien\w* odpowiedz\w*|zle odpowiedzial\w*|blednie odpowiedzial\w*|blad w odpowiedzi)/;

// The answers as a list with "Popraw" on each (the case's Teraz view).
function answersHTML(c) {
  const keys = answeredFacts(c);
  if (!c.state.approved || !keys.length) return '';
  return `<section class="sec answers-sec"><h2 class="sec-h">Twoje odpowiedzi</h2>
    <p class="meta">Jeśli któraś jest błędna, popraw ją. Pokażę, co zmieni się w planie, i nic nie zmienię bez Twojej zgody.</p>
    <ul class="list">${keys.map((k) => `<li class="row"><span class="tx"><span class="meta">${esc(factOf(c, k).question.pl)}</span><b>${esc(answerLabel(c, k, c.state.facts[k]))}</b></span>
      <button type="button" class="btn btn-quiet btn-sm" data-fix="${esc(k)}" ${c.pendingFix ? 'disabled' : ''}>Popraw</button></li>`).join('')}</ul></section>`;
}
function pendingBanner(c) {
  const f = c.pendingFix;
  if (!f) return '';
  const q = factOf(c, f.key)?.question.pl ?? f.key;
  return `<p class="mock-note recheck">${icon('warning-circle')}<span><b>Poprawka czeka na Twoją decyzję.</b> „${esc(q)}”: ${esc(answerLabel(c, f.key, f.from))} → ${esc(answerLabel(c, f.key, f.to))}.
    ${f.all ? 'Cały plan wymaga ponownego sprawdzenia.' : 'Kroki oznaczone „Do ponownego sprawdzenia” mogą się zmienić.'} Do decyzji nie proponuję w nich żadnych działań, a przypomnienia czekają.</span></p>
    <div class="ap-act">${f.open ? `<button type="button" class="btn btn-accent btn-sm" data-tochat="" data-case="${c.id}">Wróć do decyzji</button>` : `<button type="button" class="btn btn-quiet btn-sm" data-unfix="" data-case="${c.id}">Wycofaj poprawkę</button>`}</div>`;
}

// Pick an answer to correct (typed "pomyliłem się").
async function chooseCorrection(c) {
  const keys = answeredFacts(c);
  if (!keys.length) { await say(c, 'W tej sprawie nie ma jeszcze odpowiedzi do poprawienia.'); return; }
  const r = await panel(`<p class="dock-q" tabindex="-1" data-focus>Którą odpowiedź poprawiamy?</p>
    <div class="opts cards">${keys.map((k) => `<button type="button" class="chip chip-card" data-pick="${esc(k)}"><span><small class="meta">${esc(factOf(c, k).question.pl)}</small><br>${esc(answerLabel(c, k, c.state.facts[k]))}</span></button>`).join('')}</div>`,
  (t) => { const a = readAnswer(t, keys.map((k) => ({ label: factOf(c, k).question.pl, value: k }))); return a.type === 'option' ? a.o.value : null; }, c);
  await correctFact(c, r.value);
}

// Typed words that give another value: confirmed on a card first.
async function offerCorrection(c, x, text) {
  const f = factOf(c, x.fact);
  const yes = await approve({ c, kicker: 'Poprawka odpowiedzi', ic: 'chat-circle-dots', title: answerLabel(c, x.fact, x.value),
    sub: f.question.pl, note: `Teraz w planie: ${answerLabel(c, x.fact, c.state.facts[x.fact])}. Twoje słowa: „${echoed(clause(text, x.evidence))}”`,
    yes: 'Tak, popraw', no: 'Nie', echo: false });
  if (yes) await correctFact(c, x.fact, x.value);
  else await say(c, 'Dobrze, odpowiedź zostaje.');
}

// The correction itself: the question again (unless the value is known), then the proposal.
async function correctFact(c, key, value) {
  const f = factOf(c, key);
  const from = c.state.facts[key];
  if (value === undefined) {
    await say(c, `<p>Poprawiasz odpowiedź na pytanie: „${esc(f.question.pl)}”. Teraz w planie: <b>${esc(answerLabel(c, key, from))}</b>.</p>`);
    const a = await ask({ c, q: f.question.pl, why: f.whyWeAsk?.pl, help: f.unknownHelp?.pl,
      options: f.options.map((o) => ({ label: o.label.pl, value: o.value })), long: f.options.some((o) => o.label.pl.length > 34) });
    value = a.value === UNKNOWN_CHOICE ? E.UNKNOWN : a.value;
  }
  if (value === from) { await say(c, 'To ta sama odpowiedź, co w planie. Nic się nie zmienia.'); return; }
  const next = { ...c.state, facts: { ...c.state.facts, [key]: value } };
  const cur = plan(c);
  const np = E.plan(c.bpId, next);
  const routed = !!np.route.procedureId && np.route.status !== 'unsure' && np.route.status !== 'none';
  const diff = routed && np.route.status !== 'choice' ? E.diffPlans(cur, np, c.state.tasks) : null;
  const levels = diff ? [...affectedBy(diff, cur.levels)] : cur.levels.map((l) => l.id);
  // `open`: the decision card is on screen in the chat (the banner then leads back to it).
  c.pendingFix = { key, from, to: value, all: !diff || !!diff.route, levels, open: true };
  const line = `„${f.question.pl}”: ${answerLabel(c, key, from)} → ${answerLabel(c, key, value)}`;
  logAct(c, `Poprawka odpowiedzi czeka na decyzję: ${line}`);
  const decision = await proposeChange(c, next, { fix: line });
  if (decision === 'yes') logAct(c, `Poprawka zatwierdzona: ${line}. Poprzednia odpowiedź zostaje w historii`);
  else if (decision === 'no') logAct(c, `Poprawka odrzucona, plan bez zmian: ${line}`);
  if (decision === 'unrouted') {
    // The corrected answer leaves no route in the sources: the plan stood on the answer being
    // corrected, so it all needs a recheck. Nothing is guessed; the person withdraws or keeps it open.
    const r = await panel(`<p class="dock-q" tabindex="-1" data-focus>Co robimy z poprawką?</p>
      <p class="meta">Jeśli poprzednia odpowiedź jednak była dobra, wycofaj poprawkę. Jeśli nie, zostaw ją: cały plan pozostanie oznaczony do ponownego sprawdzenia, a pomoc prawna pomoże ustalić drogę.</p>
      <div class="ap-act"><button type="button" class="btn btn-quiet" data-pick="keep">Zostaw do sprawdzenia</button><button type="button" class="btn btn-accent" data-pick="withdraw">Wycofuję poprawkę</button></div>`,
    (t) => (/wycof/.test(norm(t)) ? 'withdraw' : /zostaw/.test(norm(t)) ? 'keep' : null), c);
    if (r.value === 'withdraw') { logAct(c, `Poprawka wycofana: ${line}`); c.pendingFix = null; await say(c, 'Poprawka wycofana. Plan bez zmian.'); }
    else { c.pendingFix.open = false; logAct(c, `Poprawka zostaje do sprawdzenia; plan wstrzymany: ${line}`); await say(c, 'Dobrze. Plan zostaje oznaczony do ponownego sprawdzenia. Wrócisz do poprawki w zakładce Teraz.'); }
    return;
  }
  c.pendingFix = null;
  if (decision === 'yes') remember(c, `Poprawiona odpowiedź: ${answerLabel(c, key, value)} (wcześniej: ${answerLabel(c, key, from)})`);
}
