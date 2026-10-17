// Lists what an extract leaves out of the act where exceptions often sit: the paragraphs of each quoted article that the
// extract does not quote, and the other articles that name a quoted article. The unemployment map quoted art. 65,
// 219 ust. 1 and 225 ust. 1 and missed art. 66, 219 ust. 2 and 225 ust. 3 (its check, 17.10.2026); quoting a whole
// article was not enough either (docs/solutions/2026-10-16-read-the-whole-article.md). It prints what to read by hand.
// Usage: node tools/sources/omitted.mjs DU/2025/620 research/2026-10-17-unemployment/sources/rynek-pracy-2025-620-extract.txt [--all]
//        (needs network and pdftotext; a local pdftotext -layout output may be given instead of the ELI)
// A regulation's units are paragraphs (§) and their ust.; it is read the same way.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Page headers dropped, words broken at a line end joined, whitespace collapsed: the same for the act and the extract,
// which keeps the act's line breaks.
export const norm = (text) => text.replace(/\n[^\S\n]*Dziennik Ustaw[^\n]*/g, '\n').replace(/-\n\s*/g, '').replace(/\s+/g, ' ').trim();

// Words that open an exception or a special rule. A paragraph or a referring article with one is marked.
export const EXCEPTION = /nie stosuje się|z wyjątkiem|chyba że|nie może|nie mogą|nie przysługuje|nie dotyczy|ulega (?:skróceniu|przedłużeniu)|liczy się od|w brzmieniu dotychczasowym|przepisy dotychczasowe|nie wlicza się|z wyłączeniem/i;

// The act's articles (or a regulation's paragraphs), each with its numbered paragraphs, from pdftotext -layout output.
// A unit opens at a line that starts with "Art. 66." (or "§ 5."); new wording quoted in an amendment opens with „ and
// is not a unit. A paragraph opens at a line start with the next number ("2.", "2a.", or "§ 2." in a code), so a
// number that happens to start a wrapped line is not taken for one.
export function units(text) {
  const lines = text.split('\n');
  const heads = { art: 0, par: 0 };
  for (const l of lines) { if (/^\s*Art\. \d+[a-z]*\.\s/.test(l)) heads.art++; else if (/^\s*§ \d+[a-z]*\.\s/.test(l)) heads.par++; }
  const unit = heads.par > heads.art ? '§' : 'Art.';
  const head = unit === '§' ? /^\s*§ (\d+[a-z]*)\.\s+(.*)$/ : /^\s*Art\. (\d+[a-z]*)\.\s+(.*)$/;
  const para = unit === '§' ? /^\s*(\d+[a-z]*)\.\s+(?=\S)/ : /^\s*(?:§ )?(\d+[a-z]*)\.\s+(?=\S)/;
  const out = [];
  let cur = null;
  const start = (id, rest) => {
    cur = { id, paras: [] };
    out.push(cur);
    const first = para.exec(rest);
    cur.paras.push({ n: first ? first[1] : '', raw: first ? rest.slice(first[0].length) : rest });
  };
  const num = (n) => parseInt(n, 10);
  for (const l of lines) {
    const h = head.exec(l);
    if (h) { start(h[1], h[2]); continue; }
    if (!cur) continue;
    const p = para.exec(l);
    const last = cur.paras[cur.paras.length - 1];
    if (p && last.n && (num(p[1]) === num(last.n) + 1 || (num(p[1]) === num(last.n) && p[1] !== last.n))) {
      cur.paras.push({ n: p[1], raw: l.slice(p[0].length) });
    } else last.raw += '\n' + l;
  }
  for (const u of out) for (const p of u.paras) p.text = norm(p.raw);
  return { unit, units: out };
}

// A paragraph counts as quoted when the extract holds its first 200 characters (all of it, if shorter): a shorter
// opening ("Minister właściwy do spraw wewnętrznych określi, w drodze rozporządzenia:") recurs in other articles and
// marked an unquoted article as quoted (the Karta Polaka act's art. 24d, 17.10.2026). The first 60 are shown.
const keyOf = (t) => t.slice(0, 200);
const headOf = (t) => t.slice(0, 60);
const isRepealed = (t) => /^\((?:uchylony|uchylona|pominięty|pominięta)\)/.test(t);

// References to the act's own articles (or paragraphs) in a paragraph. A reference that a phrase like "ustawy z dnia"
// closes before the next comma, semicolon or sentence names another act ("art. 55 ust. 1 … ustawy z dnia 25 czerwca
// 1999 r.") and is left out.
export function ownRefs(text, unit) {
  const re = unit === '§' ? /§ (\d+[a-z]*)/g : /\bart\. (\d+[a-z]*)/g;
  const refs = [];
  for (const m of text.matchAll(re)) {
    const tail = text.slice(m.index).split(/[;,]| (?=[A-ZŁŚŻŹĆ][a-ząćęłńóśźż]+ )/)[0];
    if (/ustaw\S* (?:z dnia|zmienian|uchylan)|Kodeks|rozporządzeni|umowy|Traktatu|dyrektywy/.test(tail)) continue;
    refs.push(m[1]);
  }
  return [...new Set(refs)];
}

// For an act's text and an extract: the quoted units with the paragraphs they leave out, and the units the extract does
// not quote that name a quoted one. Both say whether the paragraph carries an exception word.
export function omitted(actText, extractText) {
  const { unit, units: all } = units(actText);
  const ext = norm(extractText);
  const quoted = new Set();
  const partial = [];
  for (const u of all) {
    const inExtract = u.paras.map((p) => p.text.length > 0 && ext.includes(keyOf(p.text)));
    if (!inExtract.some(Boolean)) continue;
    quoted.add(u.id);
    const missing = u.paras.filter((p, i) => !inExtract[i] && p.text && !isRepealed(p.text))
      .map((p) => ({ n: p.n, exception: EXCEPTION.exec(p.text)?.[0] ?? null, head: headOf(p.text) }));
    if (missing.length) partial.push({ id: u.id, missing });
  }
  const referring = [];
  // An article that amends another act ("W ustawie z dnia … wprowadza się następujące zmiany") names that act's articles.
  const amends = (u) => /^W (?:ustawie|rozporządzeniu) /.test(u.paras[0]?.text ?? '');
  for (const u of all) {
    if (quoted.has(u.id) || amends(u)) continue;
    for (const p of u.paras) {
      const names = ownRefs(p.text, unit).filter((r) => quoted.has(r) && r !== u.id);
      if (names.length) referring.push({ id: u.id, n: p.n, names, exception: EXCEPTION.exec(p.text)?.[0] ?? null, head: headOf(p.text) });
    }
  }
  return { unit, quoted: [...quoted], partial, referring };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const [src, extract] = args.filter((a) => !a.startsWith('--'));
  if (!src || !extract) { console.error('usage: node tools/sources/omitted.mjs <ELI | act.txt> <extract.txt> [--all]'); process.exit(2); }
  let actText;
  if (existsSync(src)) actText = readFileSync(src, 'utf8');
  else {
    const pdf = Buffer.from(await (await fetch(`https://api.sejm.gov.pl/eli/acts/${src}/text.pdf`)).arrayBuffer());
    const dir = mkdtempSync(join(tmpdir(), 'omitted-'));
    writeFileSync(join(dir, 'act.pdf'), pdf);
    execFileSync('pdftotext', ['-layout', join(dir, 'act.pdf'), join(dir, 'act.txt')]);
    actText = readFileSync(join(dir, 'act.txt'), 'utf8');
  }
  const r = omitted(actText, readFileSync(extract, 'utf8'));
  const u = r.unit === '§' ? '§' : 'art.';
  const p = 'ust.';
  console.log(`${src}: the extract quotes ${r.quoted.length} ${u === '§' ? 'paragraph(s)' : 'article(s)'}: ${r.quoted.join(', ')}`);
  console.log('\nQuoted in part (the paragraphs left out; "!" marks an exception word):');
  for (const x of r.partial) {
    const shown = args.includes('--all') ? x.missing : x.missing.filter((m) => m.exception);
    if (!shown.length) continue;
    console.log(`- ${u} ${x.id}: ${shown.map((m) => `${p} ${m.n}${m.exception ? ` ! "${m.exception}"` : ''}`).join('; ')}`);
  }
  console.log('\nNot quoted, but naming a quoted one:');
  for (const x of r.referring.filter((y) => args.includes('--all') || y.exception)) {
    console.log(`- ${u} ${x.id}${x.n ? ` ${p} ${x.n}` : ''} names ${u} ${x.names.join(', ')}${x.exception ? ` ! "${x.exception}"` : ''}: ${x.head}…`);
  }
  if (!args.includes('--all')) console.log('\nOnly the marked ones are shown; --all lists every paragraph left out and every reference.');
  console.log('Read each one in the act before stating the rule, and quote it or say why it does not apply.');
}
