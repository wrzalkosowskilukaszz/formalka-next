// The guard that keeps interview material out of the public repository. Run: node --test tools/privacy/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { offending } from './interview-data.mjs';

test('audio, video and raw-interview folders are refused; templates and plans pass', () => {
  assert.deepEqual(offending([
    'research/phase1/P03.m4a',
    'notes/interview-notes/P01.md',
    'research/phase1/consents/P02.pdf',
    'x/Recordings/a.txt',
    'research/2026-10-16-service/INTERVIEW-PLAN.md',
    'research/phase1/templates/consent-template.md',
    'research/phase1/templates/note-template.md',
  ]), ['research/phase1/P03.m4a', 'notes/interview-notes/P01.md', 'research/phase1/consents/P02.pdf', 'x/Recordings/a.txt']);
});

test('the repository holds no interview data now', () => {
  const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
  assert.deepEqual(offending(files), []);
});
