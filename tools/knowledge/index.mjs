// Writes knowledge/INDEX.md from the matter files. --check: exit 1 when the index is stale or a matter file fails.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { INDEX, checkAll, indexText, load } from './knowledge.mjs';

const files = load();
const text = indexText(files);
const problems = checkAll(files);
if (process.argv.includes('--check')) {
  if (!existsSync(INDEX) || readFileSync(INDEX, 'utf8') !== text) problems.push('knowledge/INDEX.md is stale: run node tools/knowledge/index.mjs');
} else if (!problems.length) {
  mkdirSync(dirname(INDEX), { recursive: true });
  writeFileSync(INDEX, text);
}
for (const p of problems) console.error(`knowledge: ${p}`);
console.log(`knowledge: ${files.length} matter file(s); index ${problems.length ? 'not written' : 'current'}`);
process.exitCode = problems.length ? 1 : 0;
