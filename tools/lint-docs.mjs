// Docs lint (docs/solutions/2026-10-16-status-labels-read-as-approval.md): in audit/ and docs/, a table cell
// that is only a status word ("Fixed", "Verified", "Approved", "Done", "Passed") reads as an independent verdict.
// Our own changes are "changed in the lab; not independently verified", with who checked.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT } from './lessons/lessons.mjs';

const STATUS = /^(?:Fixed|Verified|Approved|Done|Passed|Resolved)\.?$/;
const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.md')) files.push(p); } };
for (const d of ['audit', 'docs']) walk(join(ROOT, d));
const bad = [];
for (const f of files) {
  // Only a table's "Status" column counts: elsewhere "Done" can name a state the product shows.
  const lines = readFileSync(f, 'utf8').split('\n');
  let col = -1;
  lines.forEach((line, i) => {
    if (!line.trimStart().startsWith('|')) { col = -1; return; }
    const cells = line.split('|').slice(1, -1).map((c) => c.trim().replace(/\*\*/g, ''));
    if (/^\|\s*:?-{3,}/.test(lines[i + 1]?.trimStart() ?? '')) { col = cells.findIndex((c) => /^status$/i.test(c)); return; }
    if (col >= 0 && STATUS.test(cells[col] ?? '')) bad.push(`${relative(ROOT, f)}:${i + 1}: a bare status "${cells[col]}"`);
  });
}
for (const b of bad) console.error(b);
console.log(`docs lint: ${files.length} files, ${bad.length} bare status cell(s)`);
process.exitCode = bad.length ? 1 : 0;
