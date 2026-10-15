// Builds the functional slice into one self-contained HTML file (no network at runtime).
// Usage: node slice/build.mjs   (after `node packages/case-engine/tools/build-browser.mjs --locales pl`)
// Reuses the prototype's vendored font and icons (licences in prototype/vendor) and Formalka's tokens.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const lab = join(root, '..');
const read = (p) => readFileSync(join(lab, p), 'utf8');
const safe = (js) => js.replace(/<\/script/gi, '<\\/script');

const font = readFileSync(join(lab, 'prototype/vendor/Geist-Variable.woff2')).toString('base64');
const dark = read('prototype/src/tokens-dark.css');
const css = [
  `@font-face { font-family: "Geist"; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 100 900; font-display: swap; }`,
  read('prototype/src/tokens.css'),
  `@media (prefers-color-scheme: dark) {\n:root:not([data-theme="light"]) {\n${dark}}\n}`,
  `:root[data-theme="dark"] {\n${dark}}`,
  read('slice/src/app.css'),
].join('\n');
const icons = {};
for (const f of readdirSync(join(lab, 'prototype/vendor/icons'))) icons[f.replace(/\.svg$/, '')] = read(`prototype/vendor/icons/${f}`).trim();
const engine = read('packages/case-engine/dist/case-engine.browser.js');
const js = read('slice/src/app.js').replace('/*__ICONS__*/ {}', JSON.stringify(icons));
const fragment = read('slice/src/index.html')
  .replace('/*__CSS__*/', () => css).replace('/*__ENGINE__*/', () => safe(engine)).replace('/*__JS__*/', () => safe(js));
const [headPart, bodyPart] = fragment.split('<div id="app">');
const standalone = `<!doctype html>\n<html lang="pl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${headPart}</head>\n<body>\n<div id="app">${bodyPart}</body>\n</html>\n`;
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/index.html'), standalone);
writeFileSync(join(root, 'dist/artifact.html'), fragment);
console.log(`built slice/dist/index.html ${(standalone.length / 1024).toFixed(0)} KB`);
