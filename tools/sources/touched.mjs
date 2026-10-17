// Lists, for each act that amended a Polish act after a given date, the articles of that act it changes, and flags
// the ones a source extract cites. Checking only the articles one expects missed changes before
// (docs/solutions/2026-10-17-amendments-checked-only-for-expected-articles.md).
// Usage: node tools/sources/touched.mjs DU/2004/2135 2025-09-26 --cite 2-4,12,50-53,66-69   (needs network and pdftotext)
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
export function touchedArticles(text, actTitle) {
  const flat = flatten(text);
  const m = /^Ustawa z dnia (.+? r\.) (\S+ \S+ \S+)/.exec(actTitle);
  if (!m) throw new Error(`not an act title: ${actTitle}`);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const open = new RegExp(`Art\\. (\\d+[a-z]*)\\. (?:\\d+\\. )?W ustawie z dnia ${esc(m[1])} ${esc(m[2])}`, 'g');
  const found = [];
  for (let hit; (hit = open.exec(flat)); ) {
    let depth = 0, plain = '', i = hit.index + hit[0].length;
    for (; i < flat.length; i++) {
      const ch = flat[i];
      if (ch === '„') depth++;
      else if (CLOSE.includes(ch) && depth > 0) depth--;
      else if (depth === 0 && /^ Art\. \d+[a-z]*\. /.test(flat.slice(i, i + 16))) break;
      else if (depth === 0) plain += ch;
    }
    const ids = [...plain.matchAll(/\bart\. (\d+[a-z]*(?:[–-]\d+[a-z]*)?)/g)].map((x) => x[1]);
    found.push({ article: `Art. ${hit[1]}`, changes: [...new Set(ids)] });
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
    if (!hits.length) { console.log(`- ${c.id} (in force ${c.date}): no "W ustawie z dnia …" article found; read it by hand`); flagged++; continue; }
    for (const h of hits) {
      const mark = cite ? h.changes.filter(cite) : [];
      flagged += mark.length;
      console.log(`- ${c.id} (in force ${c.date}) ${h.article}: art. ${h.changes.join(', ') || '(none named)'}${mark.length ? `  <- cited: ${mark.join(', ')}` : ''}`);
    }
  }
  if (cite) console.log(flagged ? '\nSome changes touch cited articles: read them and list them in the extract header.' : '\nNo change touches the cited articles.');
}
