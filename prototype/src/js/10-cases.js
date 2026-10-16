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
const PERSONAS = [
  { name: 'Maciek', gen: 'Maćka', role: 'asystent AI', sam: 'sam', av: 'av-1' },
  { name: 'Asia', gen: 'Asi', role: 'asystentka AI', sam: 'sama', av: 'av-2' },
  { name: 'Ola', gen: 'Oli', role: 'asystentka AI', sam: 'sama', av: 'av-3' },
  { name: 'Kuba', gen: 'Kuby', role: 'asystent AI', sam: 'sam', av: 'av-4' },
  { name: 'Ewa', gen: 'Ewy', role: 'asystentka AI', sam: 'sama', av: 'av-5' },
  { name: 'Tomek', gen: 'Tomka', role: 'asystent AI', sam: 'sam', av: 'av-6' },
];
const who = (name) => PERSONAS.find((x) => x.name === name) || { name, gen: name, role: 'asystent AI', sam: 'sam', av: 'av-1' };
function assignPersona(preferred) {
  const taken = new Set(S.cases.map((c) => c.who));
  return (!taken.has(preferred) && PERSONAS.find((x) => x.name === preferred)) || PERSONAS.find((x) => !taken.has(x.name)) || PERSONAS[S.cases.length % PERSONAS.length];
}
const avatar = (name, size = '', ai = false) => `<span class="avatar ${who(name).av} ${size}" aria-hidden="true">${esc(name[0])}${ai ? '<span class="ai">AI</span>' : ''}</span>`;
// Engine text as the case's assistant says it: the engine writes with the blueprint's caretaker, and its
// dates after "do" are in the nominative ("do środa"), which Polish puts in the genitive ("do środy").
const DAY_GEN = Object.fromEntries(DAYS.map((d, i) => [d, DAYS_GEN[i]]));
const asCase = (c, text) => {
  const bpName = E.blueprint(c.bpId).caretaker.name;
  const named = bpName === c.who ? String(text) : String(text).replace(new RegExp(`\\b${bpName}\\b`, 'g'), c.who);
  return named.replace(new RegExp(`\\b(do|najpóźniej) (${DAYS.join('|')}),`, 'g'), (m, w, d) => `${w === 'do' ? 'do' : 'najpóźniej do'} ${DAY_GEN[d]},`);
};

/* ── App state (in memory; "Reset" clears it) ─────────────────────────────── */
const START_CLOCK = { date: '2026-10-19', time: '18:40' }; // Monday; three days on is Thursday
let S;
function freshState() {
  return { screen: 'splash', clock: { ...START_CLOCK }, cases: [], active: null, building: null, flow: null,
    view: 'focus', highlight: null, calSel: null, calMonth: null, custom: [], lockOpen: false, statusL: 1, seq: 0, learned: { hour: null } };
}
const C = () => S.cases.find((c) => c.id === S.active) || null;
const caseById = (id) => S.cases.find((c) => c.id === id) || null;

function newCase(bpId) {
  const bp = E.blueprint(bpId);
  const c = {
    id: `c${++S.seq}`, bpId, title: bp.title.pl, who: assignPersona(bp.caretaker.name).name, icon: typeOf(bpId)?.ic || 'files',
    state: { facts: {}, tasks: {}, events: [], approved: false }, asked: 0, placeAsked: false,
    prefs: { ...E.DEFAULT_PREFS }, history: [], files: [], delivered: new Set(), deliveredLog: [], answered: {},
    lastActivity: S.clock.date, preview: '', pending: null, stuck: false, memory: [], awaiting: null, guided: null,
  };
  S.cases.push(c);
  return c;
}
const plan = (c) => E.plan(c.bpId, c.state);
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
  remember(c, `Ostatnio wybrana godzina: ${hm(time)}. Podpowiem ją następnym razem.`);
}
// Hour chips with the person's last hour added when it is not among them.
const hours = (list) => (S.learned.hour && !list.includes(S.learned.hour) ? [...list, S.learned.hour].sort() : list);

/* ── Levels as the UI shows them ───────────────────────────────────────────── */
const STATE = {
  unconfirmed: 'Zależy od odpowiedzi', locked: 'Zablokowany', available: 'Możesz zacząć', in_progress: 'W toku',
  waiting_office: 'Czekasz na urząd', returned: 'Urząd prosi o uzupełnienie', done: 'Zrobione',
};
const ST_ICON = { locked: 'lock-simple', waiting_office: 'hourglass-simple', returned: 'arrow-u-up-left', done: 'check', unconfirmed: 'question', in_progress: 'clock-counter-clockwise' };
const chip = (state, text) => `<span class="state-chip ${state}">${ST_ICON[state] ? icon(ST_ICON[state]) : ''}${esc(text || STATE[state] || state)}</span>`;
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
  if (l.state === 'locked' || l.state === 'returned') return l.reason?.text.pl || STATE[l.state];
  const office = l.deadlines.find((d) => d.role === 'office' && d.due);
  if (l.state === 'waiting_office') return office ? `Urząd ma czas ${dueRange(office.due)}` : 'Czekasz na urząd';
  if (l.state === 'unconfirmed') return 'Zależy od Twoich odpowiedzi';
  if (l.state === 'done') return 'Zrobione';
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
  const done = Object.keys(c.state.facts).length + (c.state.routeChoice ? 1 : 0);
  return open === 0 ? 0.95 : Math.min(0.9, done / (done + open));
}

// Which cases the words name. A case that is part of another named case's map gives way to it.
const partsOf = (id) => Object.values(E.blueprint(id).fulfillable ?? {}).flatMap((f) => Object.values(f).map((x) => x.blueprint));
function intentsIn(text) {
  const t = text.toLowerCase();
  const ids = CASE_TYPES.filter((x) => x.words.some((w) => t.includes(w))).map((x) => x.id);
  return ids.filter((id) => !ids.some((other) => other !== id && partsOf(other).includes(id)));
}

// A source link: the first quote's page, labelled as an example from Formalka's guides.
const srcLink = (quotes) => (quotes?.length ? `<a href="${esc(quotes[0].page)}" target="_blank" rel="noopener noreferrer">${esc(host(quotes[0].page))}</a>` : '');
const cite = (quotes, prefix = 'Przykład z przewodnika Formalki, stan na 15.10.2026.') => (quotes?.length
  ? `<p class="cite">${icon('info')}<span>${prefix} Źródło: ${srcLink(quotes)}</span></p>` : '');
