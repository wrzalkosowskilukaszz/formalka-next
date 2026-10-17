// Lists, for each act that amended a Polish act or regulation after a given date, the articles (for a regulation, the
// paragraphs: §) it changes, and flags the ones a source extract cites. Checking only the articles one expects missed
// changes before (docs/solutions/2026-10-17-amendments-checked-only-for-expected-articles.md).
// Usage: node tools/sources/touched.mjs DU/2004/2135 2025-09-26 --cite 2-4,12,50-53,66-69 [--lookback 3]   (needs network and pdftotext)
// It also lists the acts whose general date falls in the 3 years (--lookback) before the date but whose points apply on
// or after it.
// A regulation: node tools/sources/touched.mjs DU/2025/1073 2025-08-20 --cite 5,14   (the numbers are its paragraphs)
// --header <extract>: fails (exit 1) when the extract's header (its "#" lines) does not name a flagged change.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { entryArticle } from './entry-dates.mjs';

const CLOSE = '”ˮ“';
const flatten = (text) => text.replace(/-\n\s*/g, '').replace(/\n\s*Dziennik Ustaw[^\n]*/g, ' ').replace(/\s+/g, ' ');

// The amending articles that open with "W ustawie z dnia <date> r. o <subject>" for the amended act's title
// ("Ustawa z dnia 27 sierpnia 2004 r. o świadczeniach ..."), each with the article numbers its instructions name.
// Quoted new wording („…”) is skipped, so an article quoted inside it is neither a change nor the next article.
// Some Dziennik Ustaw PDFs close a quote with U+02EE (ˮ) or U+201C (“) instead of ”.
// Changes to an annex ("w załączniku … w części III w ust. 44") are listed apart: they name no article.
// A regulation ("Rozporządzenie Ministra … z dnia 5 sierpnia 2025 r. w sprawie wydawania …") is amended by a paragraph
// opening "§ 1. W rozporządzeniu Ministra … z dnia 5 sierpnia 2025 r. w sprawie wydawania …", whose points name
// paragraphs ("w § 14 w ust. 4"); those are listed with unit "§". A regulation's extract header once missed that its
// amendment changed a quoted paragraph (research/2026-10-17-vehicles/sources/CHECK.md).
export function touchedArticles(text, actTitle) {
  const flat = flatten(text);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // The API writes "r. Prawo o …" or "r. - Kodeks …"; amending acts write "r. – Prawo o …". Match up to three subject words.
  const m = /^Ustawa z dnia (.+? r\.) (?:[–-] )?(\S+(?: \S+){0,2})/.exec(actTitle);
  const r = /^Rozporządzenie .+? z dnia (.+? r\.) w sprawie (\S+(?: \S+)?)/.exec(actTitle);
  if (!m && !r) throw new Error(`not an act or regulation title: ${actTitle}`);
  const unit = m ? 'art.' : '§';
  const open = m
    ? new RegExp(`Art\\. (\\d+[a-z]*)\\. (?:\\d+\\. )?W ustawie z dnia ${esc(m[1])} (?:[–-] )?${esc(m[2].replace(/\.$/, ''))}`, 'g')
    : new RegExp(`§ (\\d+[a-z]*)\\. (?:\\d+\\. )?W rozporządzeniu [^„§]{0,200}?z dnia ${esc(r[1])} w sprawie ${esc(r[2])}`, 'g');
  const next = m ? /^ Art\. \d+[a-z]*\. / : /^ § \d+[a-z]*\. /;
  const ids = m ? /\bart\. (\d+[a-z]*(?:[–-]\d+[a-z]*)?)/g : /§ (\d+[a-z]*(?:[–-]\d+[a-z]*)?)/g;
  const found = [];
  for (let hit; (hit = open.exec(flat)); ) {
    let depth = 0, plain = '', i = hit.index + hit[0].length;
    for (; i < flat.length; i++) {
      const ch = flat[i];
      if (ch === '„') depth++;
      else if (CLOSE.includes(ch) && depth > 0) depth--;
      else if (depth === 0 && next.test(flat.slice(i, i + 16))) break;
      else if (depth === 0) plain += ch;
    }
    const named = [...plain.matchAll(ids)].map((x) => x[1]);
    const annex = [...plain.matchAll(/w załączniku(?: nr (\d+))?(?: do (?:ustawy|rozporządzenia))?(?: w części ([IVX]+))?(?: w (?:kolumnie \S+ w )?(ust\.|pkt) (\d+[a-z]*))?/g)]
      .map((x) => ['załącznik', x[1], x[2] && `część ${x[2]}`, x[3] && `${x[3]} ${x[4]}`].filter(Boolean).join(' '));
    found.push({ article: m ? `Art. ${hit[1]}` : `§ ${hit[1]}`, unit, changes: [...new Set(named)], annex: [...new Set(annex)] });
  }
  return found;
}

// Articles of the amending act that do not change the act but apply it: transitional rules naming "ustawy zmienianej
// w art. 19" (or "rozporządzenia zmienianego w § 1"). Dz.U. 2026 poz. 203 art. 41 extends the work act's art. 3 ust. 1
// pkt 12 and art. 5a to Ukrainians without temporary protection for 3 years; the reader listed only art. 19's changes,
// so the work map missed it (research/2026-10-17-work/sources/CHECK.md). Each hit is listed with the articles it names.
export function appliedBy(text, amending) {
  const flat = flatten(text);
  const ids = new Set(amending.map((a) => a.replace(/^(Art\.|§) /, '')));
  const heads = [...flat.matchAll(/(?:^| )(Art\.|§) (\d+[a-z]*)\. (?=[A-ZŁŚŻŹĆ0-9„(])/g)];
  const out = new Map();
  // "w ustawach zmienianych niniejszą ustawą" covers every amended act (Dz.U. 2025 poz. 1794 art. 12).
  for (const ref of flat.matchAll(/(?:ustaw\S* zmienian\S* w art\.|rozporządzeni\S* zmienian\S* w §) (\d+[a-z]*)\b|ustaw\S* zmienian\S* niniejszą ustawą/g)) {
    if (ref[1] && !ids.has(ref[1])) continue;
    const at = heads.filter((h) => h.index < ref.index).pop();
    if (!at || ids.has(at[2])) continue;
    const end = heads.find((h) => h.index > at.index && h[1] === at[1])?.index ?? flat.length;
    const body = flat.slice(at.index, end);
    const named = [...body.matchAll(at[1] === '§' ? /§ (\d+[a-z]*)/g : /\bart\. (\d+[a-z]*)/g)].map((x) => x[1]).filter((n) => n !== at[2] && !ids.has(n));
    out.set(`${at[1]} ${at[2]}`, [...new Set([...(out.get(`${at[1]} ${at[2]}`) ?? []), ...named])]);
  }
  return [...out].map(([article, names]) => ({ article, names }));
}

// "2-4,12,50a,93-93h" -> a predicate on an article id such as "3", "50a" or a range "23c–23i" (either end counts).
// A lettered range ("93-93h") once matched nothing, silently, so a change to art. 93 went unflagged
// (the recognition map, 17.10.2026); it now covers 93, 93a … 93h, and an unreadable part throws.
const key = (id) => { const m = /^(\d+)([a-z]*)$/.exec(id); return m && [+m[1], m[2]]; };
const before = (a, b) => a[0] < b[0] || (a[0] === b[0] && (a[1].length < b[1].length || (a[1].length === b[1].length && a[1] <= b[1])));
export function citedBy(list) {
  const ranges = [];
  for (const part of list.split(',').map((s) => s.trim()).filter(Boolean)) {
    const [lo, hi = lo] = part.split('-').map(key);
    if (!lo || !hi || part.split('-').length > 2) throw new Error(`--cite: cannot read "${part}" (use 3, 3a, 2-4 or 93-93h)`);
    ranges.push([lo, hi]);
  }
  return (id) => id.split(/[–-]/).map(key).filter(Boolean).some((k) => ranges.some(([lo, hi]) => before(lo, k) && before(k, hi)));
}

// The flagged changes an extract's header does not name. Each item is an amending act's ELI and its article ("Art. 14",
// "§ 2", or null when the act's opening was not found). An item counts as named when the header has "poz. <its
// position>" followed, before the next "poz. <number>", by "art." or "§" with that number in a list or range ("art. 12
// and 14", "art. 12 (a note) and 14", "art. 40-42 and 46"). A parenthesis that opens with "art." lists the amended act's articles, not the
// amending act's, so it is skipped. The tool's output said "read it by hand" for Dz.U. 2025 poz. 1794 art. 12 and 14,
// and the header named neither (research/2026-10-17-business/sources/CHECK.md).
export function notInHeader(header, items) {
  const named = (pos, art) => {
    const at = [...header.matchAll(new RegExp(`poz\\.\\s*${pos}(?!\\d)`, 'g'))];
    if (!art) return at.length > 0;
    const [unit, num] = art.startsWith('§') ? ['§', art.replace(/^§\s*/, '')] : ['art.', art.replace(/^Art\.\s*/i, '')];
    return at.some((m) => {
      let w = header.slice(m.index + m[0].length);
      const next = w.search(/poz\.\s*\d/);
      w = (next < 0 ? w : w.slice(0, next)).replace(/\(\s*art\.[^()]*\)/gi, ' ');
      const lists = unit === '§' ? w.matchAll(/§\s*([\d\s,a-z–-]+(?:\s*(?:and|i|oraz|or)\s*[\d]+[a-z]*)*)/g)
        : w.matchAll(/\bart\.\s*(\d+[a-z]*(?:\s*\([^()]*\))?(?:\s*(?:[-–,]|and|i|oraz|or)\s*\d+[a-z]*(?:\s*\([^()]*\))?)*)/gi);
      return [...lists].some((l) => {
        const list = l[1].replace(/\([^()]*\)/g, ' ').replace(/\s*(?:and|i|oraz|or)\s*/g, ',').replace(/\s*[–-]\s*/g, '-').replace(/\s+/g, '').replace(/[^\da-z,-]/g, '');
        try { return citedBy(list.split(',').filter((x) => /^\d/.test(x)).join(','))(num); } catch { return false; }
      });
    });
  };
  return items.filter((x) => !named(x.id.split('/')[2], x.article));
}

// The date to print for an amending act: the API's date is only its general date. Dz.U. 2026 poz. 1123 is "in force
// 2028-01-01", yet the point that adds Prawo oświatowe art. 31 ust. 3b takes effect on 1.01.2027 and ust. 3a on
// 1.09.2028; an extract header quoted the general date (research/2026-10-17-school/sources/README.md).
// The API's date may be the act's general date or the date of the changing point (Dz.U. 2026 poz. 982: its art. 6 from
// 6.08.2026, the act from 21.09.2026; the school map's check, 17.10.2026), so the label does not say which.
export function dateLabel(date, entry) {
  if (!entry?.exceptions && !entry?.announcement) return `in force ${date}`;
  return `in force ${date} by the API; the act's points have different dates${entry.announcement ? ', some set by an announcement' : ''}`;
}

// The acts that amended an act after a date, from its api.sejm.gov.pl metadata, oldest first.
export function amendingAfter(meta, since) {
  return (meta.references?.['Akty zmieniające'] ?? []).filter((x) => (x.date ?? '') >= since).sort((a, b) => a.date.localeCompare(b.date));
}
// The acts whose general date falls in the `years` before `since`: their own points may still take effect later.
// Dz.U. 2025 poz. 1006 (general date 9.08.2025) changes UEL art. 49a, 53 and 56 from 30.06.2026, and Dz.U. 2024
// poz. 854 (1.07.2024) changes UEL art. 8 from a date an announcement set at 4.05.2026; amendingAfter dropped both
// for a legal state of 10.03.2026 (research/2026-10-17-moving/sources/CHECK.md). The caller reads each one's
// entry-into-force article with laterPoints.
export function amendingBefore(meta, since, years = 3) {
  const from = `${Number(since.slice(0, 4)) - years}${since.slice(4)}`;
  return (meta.references?.['Akty zmieniające'] ?? []).filter((x) => (x.date ?? '') < since && (x.date ?? '') >= from).sort((a, b) => a.date.localeCompare(b.date));
}

const MONTHS = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
// The dates on or after `since` that an entry-into-force article names ("z dniem 30 czerwca 2026 r."), and whether
// some point waits for an announcement (its date is not in the act). Null when neither, so the act can be skipped.
export function laterPoints(entry, since) {
  if (!entry) return null;
  const dates = [...entry.article.matchAll(/(\d{1,2}) (stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia) (\d{4}) r\./g)]
    .map((m) => `${m[3]}-${String(MONTHS.indexOf(m[2]) + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`)
    .filter((d) => d >= since);
  const later = [...new Set(dates)].sort();
  return later.length || entry.announcement ? { dates: later, announcement: entry.announcement } : null;
}

// A consolidated text (an obwieszczenie, such as DU/2025/734 for the Petty Offences Code) has no "Akty zmieniające"
// of its own: they are on the act it consolidates ("Tekst jednolity dla aktu"). Given one, both tools printed
// "0 amending act(s)" with no warning (correctness audit, 17.10.2026); they now list the base act's amendments.
export async function actWithAmendments(eli, get) {
  const meta = await get(eli);
  const base = meta.references?.['Tekst jednolity dla aktu']?.[0]?.id;
  if (base) {
    const act = await get(base);
    const latest = latestConsolidated(act);
    const newer = latest && latest !== eli
      ? ` WARNING: ${eli} is not the newest consolidated text (its status: ${meta.status ?? 'unknown'}); ${latest} is. Quote ${latest} and list the amendments from its own legal-state date.`
      : '';
    return { eli: base, act, note: `${eli} is a consolidated text of ${base}; listing the amendments of ${base}.${newer}` };
  }
  if (meta.type === 'Obwieszczenie') throw new Error(`${eli} is an obwieszczenie that names no base act; give the base act's ELI`);
  const latest = latestConsolidated(meta);
  return { eli, act: meta, note: latest ? `${eli}: its newest consolidated text is ${latest}.` : null };
}

// The newest consolidated text of an act, from its "Inf. o tekście jednolitym" list, by year and then position.
// The e-government map quoted two consolidated texts that newer ones had replaced (DU/2025/1703 by DU/2026/1241,
// DU/2024/1045 by DU/2026/3), and the tools did not say so (its check, 17.10.2026).
export function latestConsolidated(meta) {
  const key = (id) => id.split('/').slice(1).map(Number);
  const ids = (meta.references?.['Inf. o tekście jednolitym'] ?? []).map((x) => x.id);
  return ids.sort((a, b) => key(b)[0] - key(a)[0] || key(b)[1] - key(a)[1])[0] ?? null;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const [eli, since] = args;
  const cite = args.includes('--cite') ? citedBy(args[args.indexOf('--cite') + 1] ?? '') : null;
  if (!eli || !since) { console.error('usage: node tools/sources/touched.mjs <ELI> <YYYY-MM-DD> [--cite 2-4,12,50] [--lookback 3] [--header <extract>]'); process.exit(2); }
  const get = async (id) => (await fetch(`https://api.sejm.gov.pl/eli/acts/${id}`)).json();
  const { eli: base, act, note } = await actWithAmendments(eli, get);
  if (note) console.log(note);
  const changes = amendingAfter(act, since);
  console.log(`${base}: ${act.title}`);
  console.log(`${changes.length} amending act(s) in force from ${since}:`);
  const textOf = async (id) => {
    const pdf = Buffer.from(await (await fetch(`https://api.sejm.gov.pl/eli/acts/${id}/text.pdf`)).arrayBuffer());
    const dir = mkdtempSync(join(tmpdir(), 'touched-'));
    writeFileSync(join(dir, 'act.pdf'), pdf);
    execFileSync('pdftotext', ['-layout', join(dir, 'act.pdf'), join(dir, 'act.txt')]);
    return readFileSync(join(dir, 'act.txt'), 'utf8');
  };
  const years = args.includes('--lookback') ? Number(args[args.indexOf('--lookback') + 1]) : 3;
  const earlier = [];
  for (const c of amendingBefore(act, since, years)) {
    const text = await textOf(c.id);
    const later = laterPoints(entryArticle(text), since);
    if (later) earlier.push({ ...c, text, later });
  }
  if (earlier.length) console.log(`${earlier.length} more with a general date in the ${years} years before ${since} but points on or after it:`);
  let flagged = 0;
  const items = [];
  for (const c of [...earlier, ...changes]) {
    const text = c.text ?? await textOf(c.id);
    const hits = touchedArticles(text, act.title);
    const entry = entryArticle(text);
    if (c.later) c.date = `${c.date}, points ${[...c.later.dates, ...(c.later.announcement ? ['a date set by an announcement'] : [])].join(', ')}`;
    if (!hits.length) { console.log(`- ${c.id} (in force ${c.date}): no "W ustawie z dnia …" or "W rozporządzeniu …" opening found; read it by hand`); flagged++; items.push({ id: c.id, article: null }); continue; }
    // For --header: an act's transitional rules count when one names a cited article, or when the act changes one.
    const touchesCited = cite && hits.some((h) => h.changes.some(cite) || h.annex.length);
    for (const t of appliedBy(text, hits.map((h) => h.article))) {
      const mark = cite ? t.names.filter(cite) : [];
      flagged += cite ? 1 : 0;
      if (mark.length || touchesCited) items.push({ id: c.id, article: t.article });
      console.log(`- ${c.id} ${t.article} applies the amended act (a transitional rule; its own date may differ): names ${t.names.join(', ') || 'no article'}${mark.length ? `  <- cited: ${mark.join(', ')}` : ''}  <- read it by hand`);
    }
    for (const h of hits) {
      const mark = cite ? h.changes.filter(cite) : [];
      flagged += mark.length + (cite ? h.annex.length : 0);
      if (mark.length || (cite && h.annex.length)) items.push({ id: c.id, article: h.article });
      const annex = h.annex.length ? `; ${h.annex.join(', ')}${cite ? '  <- annex: compare with the cited parts by hand' : ''}` : '';
      const own = mark.length && (entry?.exceptions || entry?.announcement) ? `  <- quote the cited point's own date: node tools/sources/entry-dates.mjs ${c.id}` : '';
      console.log(`- ${c.id} (${dateLabel(c.date, entry)}) ${h.article}: ${h.unit} ${h.changes.join(', ') || '(none named)'}${mark.length ? `  <- cited: ${mark.join(', ')}` : ''}${annex}${own}`);
    }
  }
  if (cite) console.log(flagged ? '\nSome changes touch cited articles: read them and list them in the extract header.' : '\nNo change touches the cited articles.');
  if (args.includes('--header')) {
    const file = args[args.indexOf('--header') + 1];
    const header = readFileSync(file, 'utf8').split('\n').filter((l) => l.startsWith('#')).join('\n');
    const missing = notInHeader(header, items);
    for (const m of missing) console.log(`NOT IN THE HEADER of ${file}: ${m.id}${m.article ? ` ${m.article}` : ''}`);
    if (missing.length) process.exitCode = 1;
    else console.log(`The header of ${file} names every flagged change.`);
  }
}
