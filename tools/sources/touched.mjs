// Lists, for each act that amended a Polish act or regulation after a given date, the articles (for a regulation, the
// paragraphs: §) it changes, and flags the ones a source extract cites. Checking only the articles one expects missed
// changes before (docs/solutions/2026-10-17-amendments-checked-only-for-expected-articles.md).
// Usage: node tools/sources/touched.mjs DU/2004/2135 2025-09-26 --cite 2-4,12,50-53,66-69   (needs network and pdftotext)
// A regulation: node tools/sources/touched.mjs DU/2025/1073 2025-08-20 --cite 5,14   (the numbers are its paragraphs)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

// "2-4,12,50a" -> a predicate on an article id such as "3", "50a" or a range "23c–23i" (either end counts).
export function citedBy(list) {
  const set = new Set();
  for (const part of list.split(',').map((s) => s.trim()).filter(Boolean)) {
    const r = /^(\d+)-(\d+)$/.exec(part);
    if (r) for (let n = +r[1]; n <= +r[2]; n++) set.add(String(n));
    else set.add(part);
  }
  return (id) => id.split(/[–-]/).some((end) => set.has(end));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const [eli, since] = args;
  const cite = args.includes('--cite') ? citedBy(args[args.indexOf('--cite') + 1] ?? '') : null;
  if (!eli || !since) { console.error('usage: node tools/sources/touched.mjs <ELI> <YYYY-MM-DD> [--cite 2-4,12,50]'); process.exit(2); }
  const get = async (id) => (await fetch(`https://api.sejm.gov.pl/eli/acts/${id}`)).json();
  const act = await get(eli);
  const changes = (act.references?.['Akty zmieniające'] ?? []).filter((x) => (x.date ?? '') >= since).sort((a, b) => a.date.localeCompare(b.date));
  console.log(`${eli}: ${act.title}`);
  console.log(`${changes.length} amending act(s) in force from ${since}:`);
  let flagged = 0;
  for (const c of changes) {
    const pdf = Buffer.from(await (await fetch(`https://api.sejm.gov.pl/eli/acts/${c.id}/text.pdf`)).arrayBuffer());
    const dir = mkdtempSync(join(tmpdir(), 'touched-'));
    writeFileSync(join(dir, 'act.pdf'), pdf);
    execFileSync('pdftotext', ['-layout', join(dir, 'act.pdf'), join(dir, 'act.txt')]);
    const hits = touchedArticles(readFileSync(join(dir, 'act.txt'), 'utf8'), act.title);
    if (!hits.length) { console.log(`- ${c.id} (in force ${c.date}): no "W ustawie z dnia …" or "W rozporządzeniu …" opening found; read it by hand`); flagged++; continue; }
    for (const h of hits) {
      const mark = cite ? h.changes.filter(cite) : [];
      flagged += mark.length + (cite ? h.annex.length : 0);
      const annex = h.annex.length ? `; ${h.annex.join(', ')}${cite ? '  <- annex: compare with the cited parts by hand' : ''}` : '';
      console.log(`- ${c.id} (in force ${c.date}) ${h.article}: ${h.unit} ${h.changes.join(', ') || '(none named)'}${mark.length ? `  <- cited: ${mark.join(', ')}` : ''}${annex}`);
    }
  }
  if (cite) console.log(flagged ? '\nSome changes touch cited articles: read them and list them in the extract header.' : '\nNo change touches the cited articles.');
}
