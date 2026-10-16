// The lessons tooling: parsing, globs, slices, and the state of docs/solutions itself.
// Run: node --test tools/lessons/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { INDEX, INDEX_LIMIT, ROOT, checkPath, globRe, indexText, load, parse, slice, sliceText } from './lessons.mjs';

test('frontmatter: required keys, one-line rules, known kinds', () => {
  const ok = parse('---\nrule: Do X.\nkind: tooling\nfiles: [a/*.js, b/**]\ncheck: none: why\ndate: 2026-10-16\n---\nbody', 'x.md');
  assert.deepEqual(ok.files, ['a/*.js', 'b/**']);
  assert.throws(() => parse('---\nrule: Do X.\nkind: tooling\n---\n', 'x.md'), /missing "files"/);
  assert.throws(() => parse('---\nrule: Do X.\nkind: misc\nfiles: [a]\ncheck: none\ndate: d\n---\n', 'x.md'), /kind "misc"/);
  assert.throws(() => parse(`---\nrule: ${'x'.repeat(221)}\nkind: tooling\nfiles: [a]\ncheck: none\ndate: d\n---\n`, 'x.md'), /longer than one line/);
});

test('globs: ** spans folders, * stays in one', () => {
  assert.ok(globRe('prototype/src/**').test('prototype/src/js/40-case.js'));
  assert.ok(globRe('audit/**/COMPARISON.md').test('audit/2026-10-16-round2/reference/COMPARISON.md'));
  assert.ok(globRe('blueprints/*.yaml').test('blueprints/pesel.yaml'));
  assert.ok(!globRe('blueprints/*.yaml').test('blueprints/sub/pesel.yaml'));
  assert.ok(!globRe('prototype/src/app.css').test('prototype/src/app.css.bak'));
});

test('a slice holds only the rules for the files at hand', () => {
  const ls = load();
  const css = slice(ls, ['prototype/src/app.css']).map((l) => l.kind);
  assert.ok(css.includes('ui-design') && css.includes('accessibility'));
  assert.ok(!slice(ls, ['prototype/src/app.css']).some((l) => l.kind === 'engine'), 'no engine rules for a stylesheet');
  assert.equal(sliceText(slice(ls, ['nothing/matches.txt'])), '');
});

test('docs/solutions: the index is fresh, under its limit, and every named check exists', () => {
  const ls = load();
  assert.ok(ls.length >= 10);
  const text = indexText(ls);
  assert.ok(text.length <= INDEX_LIMIT, `index ${text.length} > ${INDEX_LIMIT}`);
  assert.equal(readFileSync(INDEX, 'utf8'), text, 'run node tools/lessons/index.mjs');
  for (const l of ls) { const p = checkPath(l); if (p) assert.ok(existsSync(join(ROOT, p)), `${l.path}: ${p}`); }
});
