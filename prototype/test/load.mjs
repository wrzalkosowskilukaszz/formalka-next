// Loads the prototype's modules into a Node vm context with the case engine, for unit tests.
// Values from the context belong to another realm: copy arrays ([...x]) before deepEqual.
// Only what runs at load time is stubbed (matchMedia, document); screens are not exercised here.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export function loadApp(modules = ['00-base.js', '10-cases.js', '32-correct.js', '35-understand.js', '46-waiting.js']) {
  const ctx = { console, matchMedia: () => ({ matches: true }), document: {} };
  ctx.globalThis = ctx;
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(readFileSync(join(root, '../packages/case-engine/dist/case-engine.browser.js'), 'utf8'), ctx);
  const have = readdirSync(join(root, 'src/js'));
  const code = modules.map((m) => { if (!have.includes(m)) throw new Error(`missing module ${m}`); return readFileSync(join(root, 'src/js', m), 'utf8'); }).join('\n');
  vm.runInContext(`${code}\nS = freshState();\nglobalThis.app = { E, S, norm, polarity, readAnswer, readWhen, readFollowUp, readWhom, wordsOf, intentsIn, plural, isoAdd, maskPersonal, looksPersonal, reflect, keyWords, readWaiting, affectedBy, correctionIn, ASKS_FIX, dueRange, STUDY_SCOPE, RESIDENCE_SCOPE, noteText, feeSum };`, ctx);
  return ctx.app;
}
