// Lints the app modules as the browser runs them: one script, one scope (src/js/*.js in name order).
// Usage: node prototype/test/lint.mjs   Needs ESLint 9 (a global install is fine: npm i -g eslint).
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { ESLint } = (() => { try { return require('eslint'); } catch { return require(join(execSync('npm root -g').toString().trim(), 'eslint')); } })();
const dir = join(dirname(fileURLToPath(import.meta.url)), '../src/js');
const files = readdirSync(dir).filter((f) => f.endsWith('.js')).sort();
const code = files.map((f) => readFileSync(join(dir, f), 'utf8')).join('\n');
// Line numbers in the joined text map back to a module and a line.
const starts = [];
let line = 1;
for (const f of files) { starts.push([line, f]); line += readFileSync(join(dir, f), 'utf8').split('\n').length; }
const where = (n) => { const [s, f] = starts.filter(([l]) => l <= n).pop(); return `src/js/${f}:${n - s + 1}`; };

const browser = Object.fromEntries(['window', 'document', 'matchMedia', 'setTimeout', 'clearTimeout', 'requestAnimationFrame', 'console', 'URL', 'CSS'].map((g) => [g, 'readonly']));
const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: {
    languageOptions: { ecmaVersion: 'latest', sourceType: 'script', globals: browser },
    rules: {
      'no-unused-vars': ['error', { args: 'after-used', caughtErrors: 'none' }], 'no-undef': 'error', 'no-redeclare': 'error',
      'no-shadow': 'error', 'no-dupe-keys': 'error', 'no-unreachable': 'error', eqeqeq: ['error', 'smart'], 'no-self-compare': 'error',
      'no-fallthrough': 'error', 'no-empty': ['error', { allowEmptyCatch: true }], 'prefer-const': 'error', 'no-var': 'error',
    },
  },
});
const [res] = await eslint.lintText(code, { filePath: 'app.js' });
for (const m of res.messages) console.log(`${where(m.line)}  ${m.message} (${m.ruleId})`);
console.log(res.messages.length ? `${res.messages.length} problem(s)` : `lint clean: ${files.length} modules`);
process.exit(res.messages.length ? 1 : 0);
