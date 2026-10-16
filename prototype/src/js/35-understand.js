/* ── Reading the person's own words (on the device; the prototype has no language model) ──
   Every answer can also be typed. This baseline reads a typed answer the way the product's model must:
   it says what it understood, asks back when the words only suggest an answer, offers the options that
   fit when several do, explains why it asks when the person asks, and admits when it doesn't follow.
   A guess never becomes a fact without the person's yes (rules 1 to 3). A model replaces the matcher
   later behind the same contract: proposals only, the person confirms. */

// Lower case, Polish letters folded (ł to l, ą to a); anything that is not a letter or digit becomes a space.
const norm = (s) => String(s ?? '').toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, ' ').trim();
// Grammatical gender of the case's assistant: gendered(c, 'pewien', 'pewna').
const gendered = (c, m, f) => (who(c.who).sam === 'sama' ? f : m);

// Everyday and first-person words mapped onto the words the official labels use.
const SYN = [
  [/\bmam\b|\bmamy\b|\bmasz\b/g, 'ma'], [/\bjestem\b|\bjestesmy\b|\bjestes\b/g, 'jest'], [/\bstraci/g, 'utraci'],
  [/\bpracuj\w*|\brobot\w*/g, 'praca'], [/\bstudiuj\w*|\buczelni\w*|\buniwersyte\w*/g, 'studia'],
  [/\bzon[aeyi]\b|\bzona\w*|\bmaz\b|\bmeza\b|\bmezem\b|\bdzieci\w*|\bdzieck\w*|\bcork\w*|\bsyn\w*/g, 'rodzina'],
  [/\bdzialalnos\w*|\bspolk\w*/g, 'firma'], [/\bna zawsze\b|\bna dobre\b/g, 'na stale'],
];
const STOP = new Set(('a albo ale bo by co czy do dla i ich jak je jego jej jest juz lub mi mnie na nie o od oraz po pod przez sa sie '
  + 'ta tak te tego tej ten to tu tym u w we z za ze zeby ktora ktory ktore osoba osoby przyklad').split(' '));
const stem = (w) => (/^\d+$/.test(w) ? w : w.slice(0, 4));
function wordsOf(s) {
  let n = ` ${norm(s)} `;
  for (const [re, to] of SYN) n = n.replace(re, to);
  const ws = n.split(' ').filter(Boolean);
  const out = [];
  for (let i = 0; i < ws.length; i++) {
    // "nie mam" is not "mam": a negated word becomes a word of its own.
    if (ws[i] === 'nie' && ws[i + 1]) { out.push(`nie${stem(ws[++i])}`); continue; }
    if ((ws[i].length > 1 || /^\d$/.test(ws[i])) && !STOP.has(ws[i])) out.push(stem(ws[i]));
  }
  return [...new Set(out)];
}
// A label's "(nie na wizie...)" says what the option is not; its words must not match it.
const labelCore = (label) => String(label).replace(/\(\s*nie\b[^)]*\)/gi, ' ');

// Yes, no or "Nie wiem" at the start of the answer ("chyba tak", "niestety nie", "nie mam pojęcia").
const DK_RE = /^(?:chyba |sam |sama |naprawde )?(?:nie wiem|nie jestem pewn\w*|nie pamietam|nie mam pojecia|trudno powiedziec|nie wiadomo|nie umiem powiedziec)\b/;
const YES_RE = /^(?:tak|jasne|owszem|oczywiscie|pewnie|zgadza|dokladnie|potwierdzam|zgoda|ok|okej|okay|dobrze|mam|jest|dodaj|zgadzam|chce|poprosze|zatwierdzam)\b/;
const NO_RE = /^(?:nie|nigdy|brak|zadn\w*)\b/;
// Consent with consequences (approval cards, the plan, a change) is taken only from a short, plain
// answer (audit F5). "Tak, nie zgadzam się", "chyba tak" and "tak, ale…" are not consent: the person is
// asked to use a button. Anything that starts with "nie" declines, which changes nothing.
const CONSENT = /^(?:(?:tak|ok|okej|okay|dobrze|jasne)(?: (?:dodaj|zapisz|zatwierdzam|zgadza sie|o to chodzi|tego|te|ta|ten))?|dodaj|zapisz|zatwierdzam(?: plan| zmiane)?|potwierdzam|zgadza sie|zgoda)(?: (?:prosze|poprosze))?$/;
const REFUSAL = /^(?:nie|nie teraz|nie dodawaj|nie zapisuj|nie dziekuje|nie trzeba|anuluj|pomin|zostaw|zostaw jak bylo|bez zmian)$|^nie /;
function polarity(n, strict = false) {
  if (DK_RE.test(n)) return 'dk';
  if (strict) return CONSENT.test(n) ? 'yes' : REFUSAL.test(n) ? 'no' : null;
  const s = n.replace(/^(?:chyba|raczej|no|hmm|wiec|niestety|na pewno|to)\s+/, '');
  if (NO_RE.test(s)) return 'no';
  if (YES_RE.test(s)) return 'yes';
  return null;
}
// A yes that hedges ("chyba", "raczej", "może") is never taken as said; a yes that also says "nie" later
// ("tak, nie zgadzam się") contradicts itself and is not read at all.
const HEDGE = /(?:^| )(?:chyba|raczej|moze|prawdopodobnie|nie jestem pewn\w*)(?= |$)/;
const contradicts = (n) => /^(?:tak|jasne|owszem|dobrze|ok)\b/.test(n) && / nie(?= |$)/.test(n);
const ASKS_WHY = /^(?:a )?(?:dlaczego|po co|czemu|co to znaczy|co to jest|nie rozumiem|o co chodzi|jak to)\b/;

// Days and hours in the person's words: "jutro", "w czwartek", "22.10", "22 października", "o 10", "10:30".
const WD_STEM = ['niedziel', 'poniedzial', 'wtor', 'srod', 'czwart', 'piat', 'sobot'];
const MON_STEM = MON_G.map((m) => norm(m).slice(0, 4));
// One clause: a day and an hour. An explicit year is kept as written ("22.10.2028"), never moved to this year.
function whenIn(raw) {
  const n = norm(raw);
  let time = null, date = null;
  // An hour: "10:30", "o 10", "o 10.30", "godz. 9", or "10.30" (a date's month is never above 12).
  let tm = raw.match(/\b(\d{1,2}):(\d{2})\b/) || raw.match(/(?:^|\s)(?:o|godz\.?|godzina|godzinie)\s*(\d{1,2})(?:[.:](\d{2}))?\b/);
  if (!tm) { const m = raw.match(/\b(\d{1,2})\.(\d{2})\b(?!\.\d)/); if (m && Number(m[2]) > 12) tm = m; }
  if (tm && Number(tm[1]) < 24 && Number(tm[2] ?? 0) < 60) time = `${pad(Number(tm[1]))}:${tm[2] ?? '00'}`;
  else if (/\bpoludni/.test(n)) time = '12:00';
  // A day: "dziś", "jutro", "pojutrze", a weekday, "22.10", "22.10.2028", "22 października (2028)".
  if (/\bdzis\b|\bdzisiaj\b/.test(n)) date = S.clock.date;
  else if (/\bpojutrze\b/.test(n)) date = isoAdd(S.clock.date, 2);
  else if (/\bjutro\b/.test(n)) date = isoAdd(S.clock.date, 1);
  else {
    const k = WD_STEM.findIndex((w) => new RegExp(`\\b${w}`).test(n));
    if (k >= 0) { let d = isoAdd(S.clock.date, 1); while (wd(d) !== k) d = isoAdd(d, 1); date = d; }
    let day = 0, mon = 0, year = 0;
    const dm = raw.match(/\b(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?\b/);
    const dn = n.match(/\b(\d{1,2}) ([a-z]{4,})(?: (\d{4}))?/);
    if (dm && Number(dm[2]) >= 1 && Number(dm[2]) <= 12 && !(tm && tm[0].includes(dm[0]))) { day = Number(dm[1]); mon = Number(dm[2]); year = Number(dm[3] ?? 0); }
    else if (dn && MON_STEM.includes(dn[2].slice(0, 4))) { day = Number(dn[1]); mon = MON_STEM.indexOf(dn[2].slice(0, 4)) + 1; year = Number(dn[3] ?? 0); }
    if (day >= 1 && day <= 31 && mon) {
      let y = year || Number(S.clock.date.slice(0, 4));
      if (!year && isoOf(y, mon - 1, day) < S.clock.date) y++;
      const iso = isoOf(y, mon - 1, day);
      if (isoAdd(iso, 0) === iso) date = iso; // 31.11 rolls over to 1.12, so it is dropped
    }
  }
  return { date, time };
}
// Days and hours in a whole answer. A clause with "nie" rules its day out ("jutro nie mogę, w piątek o 10"
// means Friday); two days or two hours left over are ambiguous and are asked back, never picked.
function readWhen(text) {
  const parts = String(text).toLowerCase().split(/[,;]|\s(?:ale|albo|lub|a)\s/);
  const found = parts.map((p) => ({ ...whenIn(p), neg: /(?:^| )nie(?= )|odpada|nie pasuje/.test(` ${norm(p)} `) }));
  const days = [...new Set(found.filter((f) => f.date && !f.neg).map((f) => f.date))];
  const times = [...new Set(found.filter((f) => f.time && !f.neg).map((f) => f.time))];
  if (days.length > 1 || times.length > 1) return { date: null, time: null, ambiguous: true };
  return { date: days[0] ?? null, time: times[0] ?? null };
}

/* Reads a typed answer against the options of the open question. Result types:
   option (with sure: whether to take it without asking back), some (several fit), dk, why, when-miss, none. */
function readAnswer(text, options) {
  const n = norm(text);
  if (!n) return { type: 'none' };
  const real = options.filter((o) => !o.dk && !o.tester);
  const exact = real.find((o) => norm(o.label) === n || norm(labelCore(o.label)) === n);
  if (exact) return { type: 'option', o: exact, sure: true };
  if (ASKS_WHY.test(n)) return { type: 'why' };
  const pol = polarity(n);
  if (pol === 'dk') return { type: 'dk' };
  if (contradicts(n)) return { type: 'none' };
  const hedged = HEDGE.test(n);
  if (real.some((o) => o.day || o.time)) {
    const w = readWhen(text);
    const byDay = w.date && real.find((o) => o.day && o.value === w.date);
    const byTime = w.time && real.find((o) => o.time && o.value === w.time);
    if (byDay || byTime) return { type: 'option', o: byDay || byTime, sure: true };
    if (w.ambiguous) return { type: 'when-ambiguous' };
    if (w.date || w.time) return { type: 'when-miss', when: w };
  }
  const tn = (o) => { if (o.yes) return 'yes'; if (o.no) return 'no'; const l = norm(o.label); return /^tak\b/.test(l) ? 'yes' : /^nie\b/.test(l) ? 'no' : null; };
  const pool = pol && real.some((o) => tn(o) === pol) ? real.filter((o) => tn(o) === pol) : real;
  const tw = wordsOf(text);
  const scored = pool.map((o) => ({ o, s: wordsOf(labelCore(o.label)).filter((w) => tw.includes(w)).length }));
  const best = Math.max(0, ...scored.map((x) => x.s));
  if (best > 0) {
    const top = scored.filter((x) => x.s === best).map((x) => x.o);
    // Taken as said only when one or two words all match one option ("nigdy", "na stałe"); a sentence is asked back.
    return top.length === 1 ? { type: 'option', o: top[0], sure: tw.length <= 2 && best === tw.length && !hedged } : { type: 'some', os: top };
  }
  if (pool !== real && pool.length === 1) return { type: 'option', o: pool[0], sure: tw.length <= 1 && !hedged };
  if (pool !== real) return { type: 'some', os: pool };
  return { type: 'none' };
}

// Whose case, in the person's words: "dla mamy", "moja żona", "dla kogoś" (someone else) or "dla siebie",
// "abym złożył" (their own). Someone else is checked first: "chcę pomóc mamie" names the mother.
const OTHER_RE = /(?:^| )(?:mam(?:a|y|ie|e|o)|tat(?:a|y|e|o)|tacie|ojc\w*|matk\w*|zon[aeyio]|zonie|maz|meza|mezowi|syn\w*|cork\w*|dzieck\w*|dzieci\w*|brat\w*|siostr\w*|babci\w*|babcia|dziad\w*|rodzic\w*|partner\w*|kolezank\w*|koleg\w*|znajom\w*|sasiad\w*|klient\w*|kogos|innej osoby|inna osoba|czyims)(?= |$)/;
const SELF_RE = /(?:^| )(?:dla siebie|siebie|dla mnie|ja|sam|sama|moja sprawa|osobiscie|chce|musze|potrzebuje|mieszkam|jestem|abym|zebym|moge|planuje|przeprowadzilem|przeprowadzilam|przyjechalem|przyjechalam)(?= |$)/;
function readWhom(text) {
  const n = norm(text);
  if (OTHER_RE.test(n)) return 'other';
  if (SELF_RE.test(n)) return 'you';
  return null;
}

// "Jak poszło?" in the person's words. Order matters: "nie udało się, brakowało..." is "missing".
function readFollowUp(text) {
  // "nie złożyłem" is not "złożyłem": a negated verb is joined to its "nie" before anything is matched.
  const n = norm(text).replace(/(?:^|(?<= ))nie (?=\S)/g, 'nie_');
  if (/brak|zabrakl|uzupel|donies|nie_mial\w* (?:wszystkich |jednego )?dokument/.test(n)) return 'missing';
  if (/nie_udalo|nie_poszl|nie_poszed|nie_bylo mnie|nie_dotarl|nie_zloz|nie_oddal|nie_zdazyl|odwolal|przeloz|spozni|zamkniet/.test(n)) return 'not_went';
  if (/nie_przyjel|nie_chcieli/.test(n)) return null; // refused at the desk: why is not said, so it is asked
  if (/(?:^| )(?:zloz|oddal|przyjel|przyjeli|zalatwion)|(?:^| )udalo sie|poszlo dobrze|wszystko ok/.test(n)) return 'filed';
  return null;
}

/* ── How the assistant shows that it read the answer ───────────────────────── */
async function think(c, ms = 520) {
  if (lastSpeaker !== speakerKey(c)) logEl.append(h(nameRow(c)));
  lastSpeaker = speakerKey(c);
  const t = h(`<div class="typing reading" role="status"><i></i><i></i><i></i><span>${esc(c.who)} czyta Twoją odpowiedź</span></div>`);
  logEl.append(t); scrollLog();
  await sleep(ms);
  t.remove();
}
function heard(c, label) {
  logEl.append(h(`<p class="heard enter">${icon('check')}<span>${esc(c.who)} ${gendered(c, 'zrozumiał', 'zrozumiała')}: <b>${esc(label)}</b></span></p>`));
  lastSpeaker = 'note';
  scrollLog();
}
async function notSure(c, hint) {
  await say(c, `<p>Nie jestem ${gendered(c, 'pewien', 'pewna')}, co masz na myśli.</p>${hint.startsWith('<') ? hint : `<p>${esc(hint)}</p>`}`);
}

// The typed answer to an open question: an answer, or null when the question should be asked again.
async function understand(o, text) {
  const { c, q, why, options, dk } = o;
  await think(c);
  if (o.words && o.words(text)) return { value: '__text__', label: text, text };
  const r = readAnswer(text, options);
  if (r.type === 'option') {
    if (r.sure) { heard(c, r.o.day ? dayFull(r.o.value) : r.o.label); return { value: r.o.value, label: r.o.label, text }; }
    const yes = await approve({ c, kicker: 'Dobrze rozumiem?', ic: 'chat-circle-dots', title: r.o.label, sub: q || '', note: `Twoje słowa: „${echoed(text)}”`, yes: 'Tak, o to chodzi', no: 'Nie', echo: false });
    if (yes) return { value: r.o.value, label: r.o.label, text };
    await say(c, 'Dobrze. Wybierz odpowiedź albo napisz to inaczej.');
    return null;
  }
  if (r.type === 'some') {
    await say(c, `Twoje słowa pasują do ${r.os.length} odpowiedzi. Która jest bliższa?`);
    const b = await askOnce({ c, options: [...r.os, { label: 'Żadna z nich', value: '__none__', small: true }], text: true, dk: false, long: r.os.some((x) => x.label.length > 34) });
    if (b.typed) return understand({ ...o, options: r.os, words: null }, b.typed);
    return b.value === '__none__' ? null : b;
  }
  if (r.type === 'dk' && dk) { heard(c, 'Nie wiem'); return { value: UNKNOWN_CHOICE, label: 'Nie wiem', text }; }
  if (r.type === 'why') { await say(c, esc(why || 'Pytam, bo od tej odpowiedzi zależy, co trafi do planu. Niczego nie zgaduję.')); return null; }
  if (r.type === 'when-ambiguous') { await say(c, 'Widzę więcej niż jeden termin. Który wybierasz? Wybierz poniżej albo napisz jeden.'); return null; }
  if (r.type === 'when-miss') {
    // A question about an hour or a day takes any sensible one, not only the chips shown.
    const w = r.when;
    if (o.anyWhen === 'time' && w.time) { heard(c, hm(w.time)); return { value: w.time, label: hm(w.time), text }; }
    if (o.anyWhen === 'day' && w.date && w.date > S.clock.date && w.date <= isoAdd(S.clock.date, 60)) { heard(c, dayFull(w.date)); return { value: w.date, label: dayFull(w.date), text }; }
    await say(c, o.anyWhen === 'day' ? 'Wybierz dzień w ciągu najbliższych dwóch miesięcy, od jutra.' : 'Tego terminu nie ma wśród możliwości. Wybierz jeden z podanych dni albo godzin.');
    return null;
  }
  await notSure(c, o.hint || (options.length ? 'Wybierz odpowiedź poniżej albo napisz to inaczej, na przykład krócej.' : 'Napisz to inaczej, na przykład krócej.'));
  return null;
}
