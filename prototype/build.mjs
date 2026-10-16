// Builds the prototype into one self-contained HTML file (no network at runtime).
// Usage: node prototype/build.mjs   Output: prototype/dist/index.html (standalone page)
//   Inputs: src/index.html, src/tokens*.css, src/app.css, src/js/*.js (in name order), vendor/ (font,
//   icons) and the case engine bundle ../packages/case-engine/dist/case-engine.browser.js.
//                                           prototype/dist/artifact.html (body fragment for a private Artifact)
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(root, p), 'utf8');

const font = readFileSync(join(root, 'vendor/Geist-Variable.woff2')).toString('base64');
const dark = read('src/tokens-dark.css');
const css = [
  `@font-face { font-family: "Geist"; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 100 900; font-display: swap; }`,
  read('src/tokens.css'),
  `@media (prefers-color-scheme: dark) {\n:root:not([data-theme="light"]) {\n${dark}}\n}`,
  `:root[data-theme="dark"] {\n${dark}}`,
  read('src/app.css'),
].join('\n');

const icons = {};
for (const f of readdirSync(join(root, 'vendor/icons'))) {
  icons[f.replace(/\.svg$/, '')] = read(`vendor/icons/${f}`).trim();
}
// The app is split into ordered modules (src/js/00-*.js ... 90-*.js) that share one script scope.
const modules = readdirSync(join(root, 'src/js')).filter((f) => f.endsWith('.js')).sort();
const app = modules.map((f) => `/* ── src/js/${f} ── */\n${read(`src/js/${f}`)}`).join('\n');
if (!app.includes('/*__ICONS__*/ {}')) throw new Error('icon placeholder missing in src/js');
const js = app.replace('/*__ICONS__*/ {}', () => JSON.stringify(icons));
// The case engine (packages/case-engine, built and checked by its own tests) runs before the app.
const engine = read('../packages/case-engine/dist/case-engine.browser.js');
for (const [name, code] of [['engine', engine], ['app', js]]) {
  if (/<\/script/i.test(code)) throw new Error(`${name} contains a closing script tag`);
}
const fragment = read('src/index.html').replace('/*__CSS__*/', () => css).replace('/*__ENGINE__*/', () => engine).replace('/*__JS__*/', () => js);

const standalone = `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${fragment.split('<div id="app">')[0]}</head>
<body>
<div id="app">${fragment.split('<div id="app">')[1]}</body>
</html>
`;
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/index.html'), standalone);
writeFileSync(join(root, 'dist/artifact.html'), fragment);
console.log(`built: dist/index.html ${(standalone.length / 1024).toFixed(0)} KB`);
