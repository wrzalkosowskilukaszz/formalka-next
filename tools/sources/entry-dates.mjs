// Prints an act's own entry-into-force article from its text (api.sejm.gov.pl, ELI), because the API's
// `entryIntoForce` field gives only the general date, while points of an amending act often take effect on
// other dates or on a date an announcement sets (docs/solutions/2026-10-16-amendment-points-with-their-own-dates.md).
// Usage: node tools/sources/entry-dates.mjs DU/2025/1794   (needs network and pdftotext)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Joins wrapped lines and returns the last article whose first sentence says the act enters into force,
// with the exceptions it lists; null when there is none.
export function entryArticle(text) {
  const flat = text.replace(/-\n\s*/g, '').replace(/\n\s*Dziennik Ustaw[^\n]*/g, ' ').replace(/\s+/g, ' ');
  // A regulation's entry into force is a paragraph ("§ 2. Rozporządzenie wchodzi w życie po upływie 14 dni"), which
  // the reader missed (Dz.U. 2026 poz. 1139; the school map's check, 17.10.2026).
  const re = /(?:Art\.|§) \d+[a-z]*\. (?:\d+\. )?(?:Ustawa|Rozporządzenie|Obwieszczenie) wchodzi w życie/g;
  let last = null;
  for (let m; (m = re.exec(flat)); ) last = m.index;
  if (last === null) return null;
  const rest = flat.slice(last);
  const end = rest.search(/ (?:Prezydent Rzeczypospolitej Polskiej|Prezes Rady Ministrów|Minister [^:]{0,80}:)/);
  const article = (end > 0 ? rest.slice(0, end) : rest.slice(0, 3000)).trim();
  return { article, exceptions: /z wyjątkiem/.test(article), announcement: /komunika/.test(article) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [eli] = process.argv.slice(2);
  if (!eli) { console.error('usage: node tools/sources/entry-dates.mjs <ELI, e.g. DU/2025/1794>'); process.exit(2); }
  const act = await (await fetch(`https://api.sejm.gov.pl/eli/acts/${eli}`)).json();
  const pdf = Buffer.from(await (await fetch(`https://api.sejm.gov.pl/eli/acts/${eli}/text.pdf`)).arrayBuffer());
  const dir = mkdtempSync(join(tmpdir(), 'entry-'));
  writeFileSync(join(dir, 'act.pdf'), pdf);
  execFileSync('pdftotext', ['-layout', join(dir, 'act.pdf'), join(dir, 'act.txt')]);
  const found = entryArticle(readFileSync(join(dir, 'act.txt'), 'utf8'));
  console.log(`${eli}: ${act.title}`);
  console.log(`API entryIntoForce: ${act.entryIntoForce ?? 'none'} (the general date only)`);
  if (!found) { console.log('No entry-into-force article found: read the final provisions by hand.'); process.exit(1); }
  console.log(found.article);
  if (found.exceptions) console.log('\nThis act has points with their own dates: quote the date of the point you rely on.');
  if (found.announcement) console.log('Some dates are set by an announcement (komunikat): find it in Monitor Polski.');
}
