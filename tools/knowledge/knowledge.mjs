// The lab's fact base: one JSON file per matter in knowledge/facts/, each record tied to the source it
// comes from (knowledge/README.md). This module loads the files, checks them against what they cite and
// against the sources README they are made from, and writes the index. Run: node --test tools/knowledge/*.test.mjs
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const FACTS = join(ROOT, 'knowledge', 'facts');
export const INDEX = join(ROOT, 'knowledge', 'INDEX.md');
export const KINDS = ['fact', 'page', 'inference', 'open'];
export const MIN_QUOTE = 20;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const ELI = /^(DU|MP)\/\d{4}\/\d+$/;

// The text a quote may come from: the file without its "#" header lines, in two readings of a line break
// (a word broken with "-" joined again, or the hyphen kept), with whitespace collapsed.
export function readings(text) {
  const body = text.replace(/\r/g, '').split('\n').filter((l) => !l.startsWith('#')).join('\n').normalize('NFC');
  return [
    body.replace(/(\p{L})-\n[ \t]*(?=\p{Ll})/gu, '$1').replace(/\s+/g, ' '),
    body.replace(/-\n[ \t]*/g, '-').replace(/\s+/g, ' '),
  ];
}

// A quote is found when each of its parts (split at "…") occurs in one reading of the text, in order.
export function found(quote, text) {
  const parts = quote.normalize('NFC').split('…').map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  if (!parts.length) return false;
  return readings(text).some((r) => {
    let at = 0;
    for (const p of parts) {
      const i = r.indexOf(p, at);
      if (i < 0) return false;
      at = i + p.length;
    }
    return true;
  });
}

const plain = (s) => s.replace(/\*\*|`/g, '').trim();
const KIND_OF = [
  [/^What (they|the sources) say/, 'fact'],
  [/^What the pages add|^Where the pages? and the acts? differ/, 'page'],
  [/^Inferences/, 'inference'],
  [/^Open/, 'open'],
];

// The rows a sources README states, by kind: fact rows by their "###" section and topic, page rows,
// inference bullets by their bold lead, and OPEN ids.
export function readmeRows(md) {
  const out = { fact: [], page: [], inference: [], open: [] };
  let h2 = '', h3 = '', kind = null;
  for (const line of md.split('\n')) {
    if (line.startsWith('## ')) {
      h2 = plain(line.slice(3)); h3 = '';
      kind = KIND_OF.find(([re]) => re.test(h2))?.[1] ?? null;
      continue;
    }
    if (line.startsWith('### ')) { h3 = plain(line.slice(4)); continue; }
    if (!kind) continue;
    if (kind === 'inference') {
      const m = line.match(/^- \*\*(.+?)\*\*/);
      if (m) out.inference.push({ topic: plain(m[1]) });
      else if (line.startsWith('- ')) out.inference.push({ topic: plain(line.slice(2)).slice(0, 80) });
      continue;
    }
    if (!line.startsWith('|') || /^\|\s*-/.test(line)) continue;
    const first = plain(line.split('|')[1]);
    if (['Topic', 'Point', 'Id', 'Question'].includes(first)) continue;
    if (kind === 'open') { if (/^OPEN-/.test(first)) out.open.push({ topic: first }); continue; }
    out[kind].push(kind === 'fact' ? { section: h3 || h2, topic: first } : { topic: first });
  }
  return out;
}

const rel = (p) => join(ROOT, p);
const readCache = new Map();
function read(p) {
  if (!readCache.has(p)) readCache.set(p, readFileSync(rel(p), 'utf8'));
  return readCache.get(p);
}

// Every problem with one matter file, as text; an empty list means it passes.
export function checkMatter(m, file) {
  const bad = [];
  const at = (s) => bad.push(`${basename(file)}: ${s}`);
  const slug = basename(file, '.json');
  if (m.matter !== slug) at(`"matter" is "${m.matter}", the file name says "${slug}"`);
  for (const k of ['title', 'map', 'readme', 'asOf']) if (typeof m[k] !== 'string' || !m[k]) at(`"${k}" is missing`);
  if (m.doc19 !== null && !Number.isInteger(m.doc19)) at('"doc19" must be a matter number or null');
  if (m.asOf && !DAY.test(m.asOf)) at(`"asOf" ${m.asOf} is not a date`);
  for (const k of ['map', 'readme']) if (m[k] && !existsSync(rel(m[k]))) at(`${k} ${m[k]} does not exist`);
  const checkFile = m.readme ? join(dirname(m.readme), 'CHECK.md') : null;
  const checked = checkFile && existsSync(rel(checkFile));
  if (!m.check || !['checked', 'unchecked'].includes(m.check.status)) at('"check.status" must be "checked" or "unchecked"');
  else if (checked && (m.check.status !== 'checked' || m.check.file !== checkFile)) at(`${checkFile} exists: "check" must be {"status": "checked", "file": "${checkFile}"}`);
  else if (!checked && m.check.status !== 'unchecked') at(`no ${checkFile}: "check.status" must be "unchecked"`);
  const acts = m.acts && typeof m.acts === 'object' ? m.acts : {};
  if (!m.acts) at('"acts" is missing');
  for (const [k, a] of Object.entries(acts)) {
    if (!a.name) at(`act ${k} has no "name"`);
    if (!a.eli && !a.celex && !a.url) at(`act ${k} needs "eli", "celex" or "url"`);
    if (a.eli && !ELI.test(a.eli)) at(`act ${k}: "eli" ${a.eli} is not DU/<year>/<pos> or MP/<year>/<pos>`);
  }
  const records = Array.isArray(m.records) ? m.records : [];
  if (!Array.isArray(m.records)) at('"records" is missing');
  const ids = new Set();
  for (const r of records) {
    const who = r.id || `(a ${r.kind} record without an id)`;
    if (!r.id || !new RegExp(`^${slug}\\.[a-z0-9-]+(\\.[a-z0-9-]+)*$`).test(r.id)) at(`${who}: the id must be "${slug}.<words-with-hyphens>"`);
    if (ids.has(r.id)) at(`${who}: the id is used twice`);
    ids.add(r.id);
    if (!KINDS.includes(r.kind)) { at(`${who}: kind "${r.kind}" is not one of ${KINDS.join(', ')}`); continue; }
    if (!r.topic) at(`${who}: no "topic"`);
    if (!r.claim) at(`${who}: no "claim"`);
    if (r.kind === 'fact' && !r.section) at(`${who}: a fact needs its README "section"`);
    for (const k of ['from', 'until']) if (r[k] !== undefined && !DAY.test(r[k])) at(`${who}: "${k}" ${r[k]} is not a date`);
    const basis = Array.isArray(r.basis) ? r.basis : [];
    if ((r.kind === 'fact' || r.kind === 'inference') && !basis.length) at(`${who}: a ${r.kind} needs a "basis"`);
    for (const b of basis) if (!b.act || (b.act !== 'PAGES' && !acts[b.act])) at(`${who}: basis act "${b.act}" is not in "acts"`);
    const quotes = Array.isArray(r.quotes) ? r.quotes : [];
    if ((r.kind === 'fact' || r.kind === 'page') && !quotes.length) at(`${who}: a ${r.kind} needs at least one quote`);
    for (const q of quotes) {
      if (!q.file || !existsSync(rel(q.file))) { at(`${who}: quote file ${q.file} does not exist`); continue; }
      if (!q.text || q.text.replace(/[\s…]/g, '').length < MIN_QUOTE) { at(`${who}: a quote must hold at least ${MIN_QUOTE} characters`); continue; }
      if (!found(q.text, read(q.file))) at(`${who}: not found verbatim in ${q.file}: "${q.text.slice(0, 70)}"`);
    }
    if (r.kind === 'open' && !/^OPEN-[A-Z]+\d+$/.test(r.topic || '')) at(`${who}: an open record's topic is its OPEN id`);
  }
  if (m.coverage === false) {
    if (!m.coverageNote) at('"coverage": false needs a "coverageNote" saying why');
  } else if (m.readme && existsSync(rel(m.readme))) {
    const rows = readmeRows(read(m.readme));
    const has = (kind, row) => records.some((r) => r.kind === kind && r.topic === row.topic && (kind !== 'fact' || r.section === row.section));
    for (const kind of KINDS) for (const row of rows[kind]) if (!has(kind, row)) at(`the README's ${kind} row ${row.section ? `"${row.section}" / ` : ''}"${row.topic}" has no record`);
  }
  return bad;
}

export function load() {
  if (!existsSync(FACTS)) return [];
  return readdirSync(FACTS).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const file = join(FACTS, f);
    return { file, m: JSON.parse(readFileSync(file, 'utf8')) };
  });
}

export function checkAll(files = load()) {
  const bad = files.flatMap(({ m, file }) => checkMatter(m, file));
  const seen = new Map();
  for (const { m, file } of files) for (const r of m.records || []) {
    if (r.id && seen.has(r.id) && seen.get(r.id) !== file) bad.push(`${basename(file)}: ${r.id} is also in ${basename(seen.get(r.id))}`);
    seen.set(r.id, file);
  }
  return bad;
}

const count = (m, kind) => (m.records || []).filter((r) => r.kind === kind).length;

export function indexText(files = load()) {
  const ms = files.map(({ m }) => m).sort((a, b) => (a.doc19 ?? 99) - (b.doc19 ?? 99) || a.matter.localeCompare(b.matter));
  const total = (kind) => ms.reduce((s, m) => s + count(m, kind), 0);
  const lines = [
    '# The lab\'s fact base: index',
    '',
    'Generated by `node tools/knowledge/index.mjs` from `knowledge/facts/*.json`; do not edit it by hand. The format and the rules are in `knowledge/README.md`.',
    '',
    `${ms.length} matters: ${total('fact')} facts, ${total('page')} page statements, ${total('inference')} inferences, ${total('open')} open questions. A matter marked "unchecked" has not been read by the separate checking agent: nothing in it is relied on yet.`,
    '',
    '| Doc 19 | Matter | Facts | Page statements | Inferences | Open | Check | As of | File |',
    '|---|---|---|---|---|---|---|---|---|',
    ...ms.map((m) => `| ${m.doc19 ?? '—'} | ${m.title} | ${count(m, 'fact')} | ${count(m, 'page')} | ${count(m, 'inference')} | ${count(m, 'open')} | ${m.check?.status === 'checked' ? `checked (\`${m.check.file}\`)` : '**unchecked**'} | ${m.asOf} | \`knowledge/facts/${m.matter}.json\` |`),
    '',
  ];
  return lines.join('\n');
}
