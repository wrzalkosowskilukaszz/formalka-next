// Checks the fact base (knowledge/facts/*.json): every quote is found verbatim in its source file, every
// basis names a listed act, every row of the sources README has a record, the check status matches CHECK.md,
// and ids are unique. Exit 1 on any problem.
// Usage: node tools/knowledge/check.mjs [knowledge/facts/<matter>.json ...]
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { checkAll, load } from './knowledge.mjs';

const args = process.argv.slice(2);
const files = args.length ? args.map((f) => ({ file: resolve(f), m: JSON.parse(readFileSync(resolve(f), 'utf8')) })) : load();
const bad = checkAll(files);
for (const b of bad) console.error(`knowledge: ${b}`);
const records = files.reduce((s, { m }) => s + (m.records || []).length, 0);
console.log(`knowledge: ${files.length} matter file(s), ${records} records, ${bad.length} problem(s)`);
process.exitCode = bad.length ? 1 : 0;
