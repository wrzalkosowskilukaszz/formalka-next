// Design rules held by tests (doc 18 §5.1). D1: every visual value in app.css comes from a token.
// Also: no text token below 12 px (legibility; the prototype had 9–11 px labels until 16.10).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { designViolations } from './design-rules.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('D1: app.css uses tokens only (colour, type, radius, motion, layers)', () => {
  assert.deepEqual(designViolations().map((v) => `app.css:${v.line} ${v.rule}: ${v.decl}`), []);
});

test('no text size token below 12 px', () => {
  const tokens = readFileSync(join(root, 'src/tokens.css'), 'utf8');
  const sizes = [...tokens.matchAll(/--t-[a-z0-9]+:\s*([\d.]+)rem/g)].map((m) => Number(m[1]) * 16);
  assert.ok(sizes.length >= 6);
  assert.deepEqual(sizes.filter((px) => px < 12), []);
});
