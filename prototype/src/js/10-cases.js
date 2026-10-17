/* ── Case types, caretakers and the case model over the engine ─────────────── */

// The five blueprints the engine ships (E.blueprintIds). Words are what the home pill and the chat
// listen for; the example is the text a home card puts in the pill.
const CASE_TYPES = [
  { id: 'citizenship', short: 'Obywatelstwo', d: 'Uznanie albo nadanie', ic: 'seal-check',
    words: ['obywatelstw', 'obywatelem', 'polski paszport', 'paszport polski', 'papiery na obywatel'],
    example: 'przyszedł czas, abym złożył papiery na obywatelstwo polskie' },
  { id: 'residence-card', short: 'Karta pobytu', d: 'Zezwolenie na pobyt czasowy', ic: 'identification-card',
    words: ['karta pobytu', 'karty pobytu', 'kartę pobytu', 'karte pobytu', 'pobyt czasowy', 'zezwolenie na pobyt'],
    example: 'Ogarnij mi temat karty pobytu' },
  { id: 'address-registration', short: 'Zameldowanie', d: 'Pobyt pod nowym adresem', ic: 'house',
    words: ['zameld', 'meldun', 'meldow'], example: 'Muszę się zameldować w nowym mieszkaniu' },
  { id: 'pesel', short: 'PESEL', d: 'Numer dla cudzoziemca', ic: 'user', words: ['pesel'], example: 'Potrzebuję numeru PESEL' },
  { id: 'language-certificate', short: 'Certyfikat B1', d: 'Egzamin z polskiego', ic: 'student',
    words: ['certyfikat', 'egzamin z polskiego', 'znajomości polskiego'], example: 'Chcę zdać egzamin z polskiego na certyfikat' },
].filter((t) => E.blueprintIds.includes(t.id));
const typeOf = (bpId) => CASE_TYPES.find((t) => t.id === bpId);
// Study mode (audit, 16.10): moderated sessions test one path only, address registration, on fictional
// data. The tester turns it on in the tester panel or with "#badanie" in the address; reset keeps it.
let STUDY = false;
const STUDY_TYPES = ['address-registration'];
const caseTypes = () => (STUDY ? CASE_TYPES.filter((t) => STUDY_TYPES.includes(t.id)) : CASE_TYPES);
// The groups the study covers (round 2 reference, COMPARISON.md D1-D6): where the engine and the draft
// reference disagree, the situation is left out of the study instead of guessed.
// Wave 2 (doc 19): the residence card is not verified yet (audit/2026-10-16-residence/COMPARISON.md).
// Where the engine is silent and a person could be harmed, the case says what it does not cover; it states
// no rule of its own.
const RESIDENCE_SCOPE = [
  'Ta część makiety nie jest jeszcze niezależnie sprawdzona: szkic wzorca czeka na prawnika od spraw cudzoziemców. Nie opieraj się na niej w prawdziwej sprawie.',
  'Makieta nie zna ostatniego dnia Twojego legalnego pobytu ani terminów z pism urzędu, więc o nich nie przypomni. Zapisz je w swoim kalendarzu.',
  'Jak założyć konto w MOS i czego do niego potrzeba, makieta jeszcze nie opisuje. Sprawdź to wcześnie, a nie w ostatnim dniu legalnego pobytu.',
  'Po decyzji odmownej makieta nie prowadzi dalej: odwołania jeszcze nie opisuje. Nie zwlekaj, skorzystaj z pomocy prawnej.',
];
const STUDY_SCOPE = 'Badanie obejmuje tylko obywatela UE, EFTA lub Szwajcarii oraz obywatela innego państwa z wizą krajową, na pobyt czasowy. Dla członków rodziny, obywateli Wielkiej Brytanii, wjazdu bez wizy i pobytu stałego osób spoza UE informacje w aplikacji nie są jeszcze sprawdzone: nie opieraj się na nich.';

// Cities for the office lookup. TERYT codes [ASSUMPTION: standard GUS codes]. The registry has
// municipal offices for Warsaw and Kraków and the 16 voivodeship offices (name and website).
const PLACES = [
  { teryt: '1465011', name: 'Warszawa', forms: ['Warszawa', 'Warszawie', 'Warszawy', 'Warszawę', 'Warszawą'] },
  { teryt: '1261011', name: 'Kraków', forms: ['Kraków', 'Krakowie', 'Krakowa', 'Krakowem'] },
  { teryt: '0264011', name: 'Wrocław', forms: ['Wrocław', 'Wrocławiu', 'Wrocławia', 'Wrocławiem'] },
  { teryt: '2261011', name: 'Gdańsk', forms: ['Gdańsk', 'Gdańsku', 'Gdańska', 'Gdańskiem'] },
];

// Every case gets its own assistant: one model, a different name and avatar colour per case
// (owner, 2026-10-16). The blueprint suggests a name; when another open case already has it, the next
// free one from the pool is used. Never chosen by the person's nationality or language (rule 4).
// The engine's Persona ({ name, feminine }) gives the words that agree with it: "asystentka AI", "sama".
const PERSONAS = [
  { name: 'Maciek', gen: 'Maćka', feminine: false, av: 'av-1' },
  { name: 'Asia', gen: 'Asi', feminine: true, av: 'av-2' },
  { name: 'Ola', gen: 'Oli', feminine: true, av: 'av-3' },
  { name: 'Kuba', gen: 'Kuby', feminine: false, av: 'av-4' },
  { name: 'Ewa', gen: 'Ewy', feminine: true, av: 'av-5' },
  { name: 'Tomek', gen: 'Tomka', feminine: false, av: 'av-6' },
].map((p) => ({ ...p, role: E.rolePl(p), sam: E.selfPl(p) }));
const who = (name) => PERSONAS.find((x) => x.name === name) || { name, gen: name, feminine: false, role: E.rolePl(name), sam: E.selfPl(name), av: 'av-1' };
const personaOf = (c) => ({ name: c.who, feminine: who(c.who).feminine });
function assignPersona(preferred) {
  const taken = new Set(S.cases.map((c) => c.who));
  return (!taken.has(preferred) && PERSONAS.find((x) => x.name === preferred)) || PERSONAS.find((x) => !taken.has(x.name)) || PERSONAS[S.cases.length % PERSONAS.length];
}
const avatar = (name, size = '', ai = false) => `<span class="avatar ${who(name).av} ${size}" aria-hidden="true">${esc(name[0])}${ai ? '<span class="ai">AI</span>' : ''}</span>`;

/* ── App state (in memory; "Reset" clears it) ─────────────────────────────── */
const START_CLOCK = { date: '2026-10-19', time: '18:40' }; // Monday; three days on is Thursday
let S;
function freshState() {
  return { screen: 'splash', clock: { ...START_CLOCK }, cases: [], active: null, building: null, flow: null,
    view: 'focus', highlight: null, calSel: null, calMonth: null, custom: [], lockOpen: false, statusL: 1, seq: 0, learned: { hour: null }, disclosed: false };
}
const C = () => S.cases.find((c) => c.id === S.active) || null;
const caseById = (id) => S.cases.find((c) => c.id === id) || null;

function newCase(bpId) {
  const bp = E.blueprint(bpId);
  const c = {
    id: `c${++S.seq}`, bpId, title: bp.title.pl, who: assignPersona(bp.caretaker.name).name, icon: typeOf(bpId)?.ic || 'files',
    state: { facts: {}, tasks: {}, events: [], approved: false }, asked: 0, placeAsked: false,
    prefs: { ...E.DEFAULT_PREFS }, history: [], files: [], delivered: new Set(), deliveredLog: [], answered: {},
    lastActivity: S.clock.date, preview: '', pending: null, pendingFix: null, stuck: false, memory: [], awaiting: null, guided: null,
    voice: 'you', // whose case: "you" (the person's own) or "other" (handled for someone else)
  };
  S.cases.push(c);
  return c;
}
const plan = (c) => E.plan(c.bpId, c.state);
// A fact's question and option labels as this case speaks: to the person, or about someone else.
const factOf = (c, key) => { const f = E.fact(key); return f ? E.voiced(f, c.voice) : null; };
const forOther = (c) => c.voice === 'other';
const touch = (c) => { c.lastActivity = S.clock.date; };
const logAct = (c, text, extra = {}) => c.history.unshift({ at: stamp(S.clock), text, by: 'you', ...extra });

/* ── What the assistant learns, on this phone only: what the person confirmed from their own words,
   the city, the hour they last picked (offered first next time). Nothing leaves the device (ADR-0009);
   learning across people is a separate, open decision (docs). ── */
const remember = (c, text) => { if (!c.memory.includes(text)) c.memory.push(text); };
function learnHour(c, time) {
  if (!/^\d\d:\d\d$/.test(time || '')) return;
  S.learned.hour = time;
  c.memory = c.memory.filter((m) => !m.startsWith('Ostatnio wybrana godzina'));
  remember(c, `Ostatnio wybrana godzina: ${hm(time)}. Podpowiem ją przy następnym terminie.`);
}
// Hour chips with the person's last hour added when it is not among them.
const hours = (list) => (S.learned.hour && !list.includes(S.learned.hour) ? [...list, S.learned.hour].sort() : list);

// Content the snapshot itself marks as possibly outdated (reference/README.md): the app says so wherever
// the plan shows it, with the official page to check.
const STALE = {
  'polish-language-certificate': { text: 'Terminy sesji egzaminacyjnych w tym przewodniku mogą być nieaktualne: oficjalna strona zmieniła się 15.10.2026. Sprawdź je na stronie Państwowej Komisji.', url: 'https://certyfikatpolski.pl/', label: 'Terminy sesji (certyfikatpolski.pl)' },
};
const staleOf = (p) => STALE[p.route.procedureId] || null;

/* ── Levels as the UI shows them ───────────────────────────────────────────── */
const STATE = {
  unconfirmed: 'Zależy od odpowiedzi', locked: 'Zablokowany', available: 'Możesz zacząć', in_progress: 'W toku',
  waiting_office: 'Czekasz na urząd', returned: 'Urząd prosi o uzupełnienie', done: 'Zrobione',
  // A step the guide lets the person skip, once the later step happened without it (engine 4ff614e). Not done.
  skipped: 'Pominięte',
};
const ST_ICON = { locked: 'lock-simple', waiting_office: 'hourglass-simple', returned: 'arrow-u-up-left', done: 'check', unconfirmed: 'question', in_progress: 'clock-counter-clockwise', skipped: 'fast-forward' };
// Done or skipped: nothing is left to do on the level.
const settled = (l) => l.state === 'done' || l.state === 'skipped';
// A level done only by inference (a later step was recorded, nothing proves this one) is not shown as
// proven: the engine marks it `implied` (audit F2 follow-up), and the app says "zakładamy".
const stateText = (l) => (l.implied ? 'Zakładamy, że zrobione' : STATE[l.state]);
const chip = (state, text) => `<span class="state-chip ${state}">${ST_ICON[state] ? icon(ST_ICON[state]) : ''}${esc(text || STATE[state] || state)}</span>`;
// An assumed level gets its own look (dashed, no tick), so it never reads as proven.
const stateChip = (l) => (l.implied ? chip('implied', stateText(l)) : chip(l.state));
const LEVEL_ICON = {
  route: 'signpost', documents: 'files', 'fill-in': 'file-text', 'owner-confirms': 'user', payment: 'coins', pay: 'coins',
  filing: 'stamp', file: 'stamp', decision: 'seal-check', confirmation: 'check-circle', summons: 'bell', card: 'identification-card',
  registered: 'house', attachment: 'buildings', 'pick-session': 'calendar-dots', register: 'list-checks', exam: 'student', result: 'seal-check',
};
const levelIcon = (l) => LEVEL_ICON[l.id] || 'list-checks';
const ACTIVE = ['returned', 'in_progress', 'available'];
const isDone = (t) => t.status === 'done' || t.status === 'not_needed';

// The level the person should look at now (Focus): the first actionable level, else the office's wait.
function currentLevel(p) {
  return p.levels.find((l) => l.order > 0 && ACTIVE.includes(l.state))
    || p.levels.find((l) => l.state === 'waiting_office') || p.levels[p.levels.length - 1];
}
// Levels grouped into rows: a level whose parallel partner already has a row joins it as a side level.
function levelGroups(p) {
  const groups = [];
  for (const l of p.levels) {
    const g = groups.find((x) => [x.main, ...x.side].some((y) => l.parallelWith.includes(y.id)));
    if (g) g.side.push(l); else groups.push({ main: l, side: [] });
  }
  return groups;
}
// One line that says where the level stands.
function levelLine(l) {
  if (l.state === 'locked' || l.state === 'returned' || l.state === 'skipped') return l.reason?.text.pl || STATE[l.state];
  const office = l.deadlines.find((d) => d.role === 'office' && d.due);
  if (l.state === 'waiting_office') return office ? `Urząd ma czas ${dueRange(office.due)}` : 'Czekasz na urząd';
  if (l.state === 'unconfirmed') return 'Zależy od Twoich odpowiedzi';
  if (l.state === 'done') return l.implied ? 'Zapisano późniejszy krok, więc zakładamy, że ten też jest zrobiony' : 'Zrobione';
  const user = l.deadlines.find((d) => d.role === 'user' && d.due);
  if (user) return `Termin ${dueRange(user.due)}`;
  if (l.tasks.length) return `${l.tasks.filter(isDone).length} z ${l.tasks.length} gotowe`;
  return STATE[l.state];
}
function stepOf(p) {
  const cur = currentLevel(p);
  return [p.levels.findIndex((l) => l.id === cur.id) + 1, p.levels.length];
}
const routeTitle = (p) => (p.route.procedureId ? E.procedure(p.route.procedureId)?.title.pl : '') || '';

// What changed on the map between two plans, in plain words (the live builder's notes).
function mapChange(before, after) {
  const ids = new Set(before.levels.map((l) => l.id));
  const added = after.levels.filter((l) => !ids.has(l.id));
  const changed = after.levels.filter((l) => { const b = before.levels.find((x) => x.id === l.id); return b && b.state !== l.state; });
  const parts = [];
  if (before.route.status !== after.route.status || before.route.procedureId !== after.route.procedureId) {
    if (after.route.status === 'choice') parts.push('Pasuje więcej niż jedna droga. Wybór należy do Ciebie');
    else if (after.route.status === 'decided') parts.push(`Droga: ${routeTitle(after)}`);
    else if (after.route.status === 'none') parts.push('Żadna droga z naszych źródeł nie pasuje');
  }
  if (added.length) parts.push(`Nowe na mapie: ${added.map((l) => l.title.pl).join(', ')}`);
  const removed = before.levels.filter((l) => !after.levels.some((x) => x.id === l.id));
  if (removed.length) parts.push(`Znika z mapy: ${removed.map((l) => l.title.pl).join(', ')}`);
  const sure = changed.filter((l) => before.levels.find((x) => x.id === l.id).state === 'unconfirmed');
  if (sure.length && !added.length) parts.push(`Już wiadomo: ${sure.map((l) => l.title.pl).join(', ')}`);
  return { text: parts.join('. '), ids: [...added, ...changed].map((l) => l.id) };
}

// How far the plan is: answered facts against those still open; 1 once the plan can be approved.
function progressOf(c, p = plan(c)) {
  if (c.state.approved) return 1;
  const open = p.openFacts.length + (p.route.status === 'choice' && !c.state.routeChoice ? 1 : 0);
  // Facts the plan never asks for (where the person is in a waiting case) are not progress on the plan.
  const done = Object.keys(c.state.facts).filter((k) => k !== 'pobyt_czasowy.waiting_for').length + (c.state.routeChoice ? 1 : 0);
  return open === 0 ? 0.95 : Math.min(0.9, done / (done + open));
}

// Which cases the words name. A case that is part of another named case's map gives way to it.
const partsOf = (id) => Object.values(E.blueprint(id).fulfillable ?? {}).flatMap((f) => Object.values(f).map((x) => x.blueprint));
function intentsIn(text) {
  const t = text.toLowerCase();
  const ids = caseTypes().filter((x) => x.words.some((w) => t.includes(w))).map((x) => x.id);
  return ids.filter((id) => !ids.some((other) => other !== id && partsOf(other).includes(id)));
}

// A source link: the first quote's page, labelled as an example from Formalka's guides.
const srcLink = (quotes) => (quotes?.length ? `<a href="${esc(quotes[0].page)}" target="_blank" rel="noopener noreferrer">${esc(host(quotes[0].page))}</a>` : '');
const cite = (quotes, prefix = 'Przykład z przewodnika Formalki, stan na 15.10.2026.') => (quotes?.length
  ? `<p class="cite">${icon('info')}<span>${prefix} Źródło: ${srcLink(quotes)}</span></p>` : '');
// The fees a plan asks for, summed only when the sum is one amount the person pays. Two stamp duties for one
// permit are the registry's alternatives for different reasons (residence "short": 85 or 340 zł), so they are
// listed, never added up (residence COMPARISON D21).
const isDuty = (f) => /^Opłata skarbowa/.test(f.purpose.pl);
function feeSum(fees) {
  return fees.filter(isDuty).length > 1 ? null : fees.reduce((s, f) => s + f.amountPln, 0);
}
// A step's fees in one line: amounts the person pays together are joined with "+", alternative duties with
// "albo" (the guide's payment step said "340 zł + 85 zł + 100 zł" for a short stay; correctness audit K5).
function feeLine(fees) {
  const amounts = (list) => list.map((f) => `${f.amountPln} zł`);
  if (feeSum(fees) !== null) return `Opłata: ${amounts(fees).join(' + ')}`;
  const other = fees.filter((f) => !isDuty(f));
  return `Opłata skarbowa: ${amounts(fees.filter(isDuty)).join(' albo ')}, zależnie od powodu pobytu; która Cię dotyczy, jest w opisie kroku${other.length ? `. Do tego: ${amounts(other).join(' + ')}` : ''}`;
}
// The registry's "Nie wiem" help says what the plan will show ("Pokażemy obie drogi …"). When "Nie wiem" to this
// question ends the intake with no route, there is no plan to show it in, so the help is not given: the person
// hears what happens instead (correctness audit K2).
function stopsOnUnknown(c, key) {
  const next = { ...c.state, facts: { ...c.state.facts, [key]: E.UNKNOWN } };
  return !E.nextQuestion(c.bpId, next, c.asked + 1, 12, c.voice) && ['unsure', 'none'].includes(E.plan(c.bpId, next).route.status);
}
const STOP_HELP = 'Bez tej odpowiedzi nie ustalę drogi z naszych źródeł; powiem wtedy, kto może pomóc.';
// A registry note in its own words. A Polish statement that is only a fragment of a provision (it stops
// at a colon, starts mid-sentence, or points to another paragraph) is never shown alone: when it is one
// of the note's quotes, all the quotes are shown in the registry's order; when it is not, a statement
// ending in a colon gets the quotes after it (audit F8; residence COMPARISON D5: art. 108 without its
// conditions, art. 237 without whom the relief is for).
const FRAGMENT_RE = /:\s*$|^[a-ząćęłńóśźż0-9]|o (?:której|którym|których) mowa w ust\./;
function noteText(n) {
  const s = n.statement.value.pl.trim();
  const qs = (n.statement.quotes ?? []).map((q) => q.text.trim().replace(/\s*\n\s*/g, ' '));
  if (!FRAGMENT_RE.test(s) || !qs.length) return s;
  if (qs.includes(s)) return qs.join(' ');
  return s.endsWith(':') ? [s, ...qs].join(' ') : s;
}
