/* ── Waiting for the office (owner, 16.10): "Potrzebuję przyspieszyć wydanie karty pobytu" ──────────
   The person has filed and wants it faster. That need is answered first, before any question about a
   new application, and only from the registry's own waiting content (procedure temporary-residence,
   notes `wait-*`, gated by the fact pobyt_czasowy.waiting_for):
   - the assistant cannot speed the office up;
   - the formal remedy for delay is a ponaglenie: the official template, where it goes, who rules on it,
     when it is too early;
   - a special provision (art. 100d) may limit it, quoted and attributed, with no conclusion of our own;
   - at the card stage our guides describe pickup, not a ponaglenie.
   It applies to any case whose plan carries these notes; today that is the residence card. */
const WAIT_FACT = 'pobyt_czasowy.waiting_for';
const WAITING_RE = /przyspiesz|ponagl|przewlek|bezczynn|zwlek|zwlok|opozni|(?:dlugo|wciaz|nadal|ciagle) (?:czekam|czeka|nie ma)|czekam na (?:decyzj|kart)|kiedy (?:bedzie|dostane|wydadza|wyda|przyjdzie) |nie ma (?:jeszcze )?decyzj|status (?:sprawy|wniosku)/;
const readWaiting = (text) => WAITING_RE.test(norm(text));
const WAIT_NOTES = {
  decision: {
    main: ['wait-ponaglenie-where', 'wait-ponaglenie-authority', 'wait-ponaglenie-too-early'],
    caveat: ['wait-remedies-statute', 'wait-ponaglenie-no-notice', 'wait-remedies-mswia-udsc', 'wait-remedies-mswia-courts', 'wait-remedies-rpo-nsa', 'wait-remedies-cjeu'],
  },
  card: { main: ['wait-card-ex-officio', 'wait-card-in-person', 'wait-card-pickup-mazowiecki'], caveat: [] },
  more: ['wait-mos-no-status', 'wait-udsc-line', 'wait-file-inspection'],
};
const waitNotes = (c) => plan(c).levels.flatMap((l) => l.notes).filter((n) => n.id.startsWith('wait-'));
const hasWaiting = (c) => !!E.fact(WAIT_FACT) && waitNotes(c).some((n) => n.id.startsWith('wait-ponaglenie'));

// A note in the registry's words. A statement that stops at a colon ("Ponaglenie wnosi się:") is never
// shown cut: its own quotes complete it (audit F8: a quote cut mid-condition is not an instruction).
function waitNoteHTML(n) {
  const s = n.statement.value.pl.trim();
  const rest = s.endsWith(':') ? n.statement.quotes.map((q) => q.text.trim()).filter((t) => t !== s) : [];
  return `<li><span>${esc([s, ...rest].join(' '))}${n.outcome === 'unknown' ? ' <em class="maybe">sprawdź, czy Cię dotyczy</em>' : ''}</span>
    ${n.statement.quotes?.length ? `<span class="src">${icon('info')} ${srcLink(n.statement.quotes)}</span>` : ''}</li>`;
}
const waitList = (c, ids) => {
  const ns = waitNotes(c);
  const shown = ids.map((id) => ns.find((n) => n.id === id)).filter(Boolean);
  return shown.length ? `<ul class="wait-notes">${shown.map(waitNoteHTML).join('')}</ul>` : '';
};
function waitActions(c, stage) {
  const A = [];
  const tpl = waitNotes(c).find((n) => n.id === 'wait-ponaglenie-template');
  if (stage !== 'card' && tpl?.statement.quotes?.[0]) A.push({ kind: 'link', url: tpl.statement.quotes[0].page, label: 'Oficjalny wzór ponaglenia', ic: 'file-text', primary: true });
  const aid = E.procedure(plan(c).route.candidates[0]?.procedureId || 'temporary-residence')?.handoff?.options?.find((o) => o.link?.url);
  if (aid) A.push({ kind: 'link', url: aid.link.url, label: aid.name?.pl ?? 'Nieodpłatna pomoc prawna' });
  return A;
}
function waitStageHTML(c, stage) {
  const notes = WAIT_NOTES[stage];
  if (stage === 'card') {
    return `<p>W naszych przewodnikach ponaglenie jest opisane dla etapu decyzji, nie dla odbioru karty. O karcie mówią:</p>${waitList(c, notes.main)}`;
  }
  const tpl = waitNotes(c).find((n) => n.id === 'wait-ponaglenie-template');
  return `<p>Na zwłokę urzędu przepisy przewidują ponaglenie. Oto, co mówią przepisy, w ich brzmieniu:</p>${waitList(c, notes.main)}
    ${tpl ? `<p class="meta">Wzór ponaglenia jest na ${srcLink(tpl.statement.quotes)}; strona podaje: „${esc(tpl.statement.quotes.find((q) => /bezpłatna/.test(q.text))?.text ?? '')}”</p>` : ''}
    <details class="wait-caveat"><summary>${icon('warning-circle')} Ważne: przepis szczególny (art. 100d) i jak czytają go urzędy i RPO</summary>${waitList(c, notes.caveat)}</details>
    <p class="meta">Nie oceniam, czy ponaglenie ma sens w Twojej sprawie. Pomoże w tym bezpłatna pomoc prawna.</p>`;
}

// Returns true when the person wants the rest of the plan next.
async function waitingFlow(c) {
  await say(c, '<p>Rozumiem, że wniosek już złożono i czekasz na urząd. Nie przyspieszę tego za Ciebie: decyzję i kartę wydaje urząd. Mogę pokazać, co na zwłokę urzędu mówią przepisy. To zależy od etapu sprawy.</p>', 300);
  const f = factOf(c, WAIT_FACT);
  const a = await ask({ c, q: f.question.pl, why: f.whyWeAsk?.pl, help: f.unknownHelp?.pl,
    options: f.options.map((o) => ({ label: o.label.pl, value: o.value })) });
  const stage = a.value === UNKNOWN_CHOICE ? null : a.value;
  c.state.facts[WAIT_FACT] = stage ?? E.UNKNOWN;
  if (stage) {
    remember(c, stage === 'card' ? 'Masz decyzję i czekasz na kartę pobytu.' : 'Czekasz na decyzję wojewody.');
    await say(c, `${waitStageHTML(c, stage)}${actsHTML(c, waitActions(c, stage))}`);
  } else {
    await say(c, `<p>${esc(f.unknownHelp?.pl ?? '')}</p>${waitList(c, ['wait-stage-decision-delivered'])}
      <details class="wait-caveat"><summary>Jeśli czekasz na decyzję wojewody</summary>${waitStageHTML(c, 'decision')}</details>
      <details class="wait-caveat"><summary>Jeśli masz decyzję i czekasz na kartę</summary>${waitStageHTML(c, 'card')}</details>
      ${actsHTML(c, waitActions(c, null))}`);
  }
  const more = waitList(c, WAIT_NOTES.more);
  if (more) await say(c, `<details class="wait-caveat"><summary>Warto wiedzieć, gdy czekasz</summary>${more}</details>`, 200);
  if (c.state.approved) return false;
  const next = await ask({ c, q: 'Ułożyć plan całej sprawy? Zapytam o cel pobytu.', dk: false,
    options: [{ label: 'Tak, ułóż plan', value: 'yes' }, { label: 'Nie teraz', value: 'no' }],
    words: null, hint: 'Napisz „tak” albo „nie teraz”.' });
  return next.value === 'yes';
}
