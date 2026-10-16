// Design rules that a test can hold (doc 18 §5.1). Shared by the unit test and by anyone who wants the
// list: node prototype/test/design-rules.mjs prints every violation with its line.
// D1: every visual value in app.css comes from a token (src/tokens*.css): no raw colour, font size,
// weight, radius, shadow colour, duration or z-index. Custom properties are defined only in tokens*.css.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEYWORDS = /^(?:inherit|initial|unset|none|0|auto|normal|transparent|currentcolor)$/i;
const RULES = [
  // A mask's colour is never seen, only its alpha, so masks are exempt.
  { id: 'colour', test: (p, v) => !/mask/.test(p) && /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|lab|lch)\(/i.test(v) },
  { id: 'font-size', test: (p, v) => p === 'font-size' && !/^var\(--t-/.test(v) && !KEYWORDS.test(v) },
  { id: 'font-weight', test: (p, v) => p === 'font-weight' && !/^var\(--w-/.test(v) && !KEYWORDS.test(v) },
  { id: 'radius', test: (p, v) => /^border(?:-[a-z]+)*-radius$/.test(p) && !v.split(/\s+/).every((x) => /^var\(--r-/.test(x) || /^(?:0|50%|inherit)$/.test(x)) },
  { id: 'duration', test: (p, v) => /^(?:transition|animation)(?:-duration|-delay)?$/.test(p) && /(?:^|[\s,])\d*\.?\d+m?s\b/.test(v.replace(/var\([^)]*\)/g, '')) && !/^0m?s$/.test(v) },
  { id: 'z-index', test: (p, v) => p === 'z-index' && !/^var\(--z-/.test(v) && !/^(?:auto|0|-?1|calc\(var\(--z-)/.test(v) },
  { id: 'custom-property', test: (p) => p.startsWith('--') },
];

export function designViolations(file = join(root, 'src/app.css')) {
  const css = readFileSync(file, 'utf8');
  const out = [];
  // Strip comments but keep line numbers.
  const text = css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const re = /([a-z-]+)\s*:\s*([^;{}]+?)\s*(?:;|(?=\}))/gi;
  for (let m; (m = re.exec(text));) {
    const [, p, raw] = m;
    const v = raw.replace(/\s*!important$/, '');
    if (text.slice(0, m.index).lastIndexOf('{') < text.slice(0, m.index).lastIndexOf('}')) continue; // a selector, not a declaration
    const line = text.slice(0, m.index).split('\n').length;
    for (const r of RULES) if (r.test(p.toLowerCase(), v.trim())) out.push({ rule: r.id, line, decl: `${p}: ${v.trim()}`.slice(0, 120) });
  }
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const v = designViolations();
  for (const x of v) console.log(`app.css:${x.line}  ${x.rule.padEnd(15)} ${x.decl}`);
  console.log(`${v.length} violation(s)`);
  process.exitCode = v.length ? 1 : 0;
}
