// Writes docs/solutions/INDEX.md from the lesson files. --check: exit 1 when the index is stale or over its
// size limit, or a lesson names a check file that does not exist. It also lists the lessons with no automatic
// check: each is a candidate to become a test or a lint, which an agent cannot skip.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { INDEX, INDEX_LIMIT, ROOT, checkPath, indexText, load } from './lessons.mjs';

const lessons = load();
const text = indexText(lessons);
const problems = [];
if (text.length > INDEX_LIMIT) problems.push(`the index has ${text.length} characters (limit ${INDEX_LIMIT}): merge similar lessons, or move old ones to docs/solutions/archive/`);
for (const l of lessons) { const p = checkPath(l); if (p && !existsSync(join(ROOT, p))) problems.push(`${l.path}: its check "${p}" does not exist`); }
const unchecked = lessons.filter((l) => !checkPath(l));
if (process.argv.includes('--check')) {
  if (!existsSync(INDEX) || readFileSync(INDEX, 'utf8') !== text) problems.push('docs/solutions/INDEX.md is stale: run node tools/lessons/index.mjs');
} else if (!problems.length) writeFileSync(INDEX, text);
for (const p of problems) console.error(`lessons: ${p}`);
console.log(`lessons: ${lessons.length}, index ${text.length}/${INDEX_LIMIT} characters, ${unchecked.length} without an automatic check${unchecked.length ? ` (candidates for a test or lint: ${unchecked.map((l) => l.path.split('/').pop()).join(', ')})` : ''}`);
process.exitCode = problems.length ? 1 : 0;
