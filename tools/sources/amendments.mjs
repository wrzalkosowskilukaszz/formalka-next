// Lists the acts that amended a Polish act after a given date, from api.sejm.gov.pl (ELI), so a consolidated
// text is never quoted as the law in force without its later amendments
// (docs/solutions/2026-10-16-consolidated-text-without-later-amendments.md).
// Usage: node tools/sources/amendments.mjs DU/2013/1650 2025-07-25 [--lookback 3]   (needs network and pdftotext)
// A consolidated text's ELI (DU/2025/1079) is resolved to the act it consolidates (DU/2013/1650): see touched.mjs.
// It also lists the acts whose general date falls in the 3 years (--lookback) before the date but whose points apply
// on or after it (Dz.U. 2025 poz. 1006 for UEL; research/2026-10-17-moving/sources/CHECK.md).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { actWithAmendments, amendingAfter, amendingBefore, laterPoints } from './touched.mjs';
import { entryArticle } from './entry-dates.mjs';

const args = process.argv.slice(2);
const [eli, since] = args;
if (!eli || !since) { console.error('usage: node tools/sources/amendments.mjs <ELI, e.g. DU/2013/1650> <YYYY-MM-DD> [--lookback 3]'); process.exit(2); }
const years = args.includes('--lookback') ? Number(args[args.indexOf('--lookback') + 1]) : 3;
const get = async (id) => (await fetch(`https://api.sejm.gov.pl/eli/acts/${id}`)).json();
const textOf = async (id) => {
  const pdf = Buffer.from(await (await fetch(`https://api.sejm.gov.pl/eli/acts/${id}/text.pdf`)).arrayBuffer());
  const dir = mkdtempSync(join(tmpdir(), 'amend-'));
  writeFileSync(join(dir, 'act.pdf'), pdf);
  execFileSync('pdftotext', ['-layout', join(dir, 'act.pdf'), join(dir, 'act.txt')]);
  return readFileSync(join(dir, 'act.txt'), 'utf8');
};
const { eli: base, act, note } = await actWithAmendments(eli, get);
if (note) console.log(note);
const changes = amendingAfter(act, since);
console.log(`${base}: ${act.title}`);
console.log(`${changes.length} amending act(s) in force from ${since}:`);
for (const c of changes) {
  const a = await get(c.id);
  console.log(`- ${c.id} (in force ${c.date}): ${a.title}`);
}
const earlier = [];
for (const c of amendingBefore(act, since, years)) {
  const later = laterPoints(entryArticle(await textOf(c.id)), since);
  if (later) earlier.push({ ...c, later });
}
console.log(`${earlier.length} more with a general date in the ${years} years before ${since} but points on or after it:`);
for (const c of earlier) {
  const a = await get(c.id);
  const when = [...c.later.dates, ...(c.later.announcement ? ['a date set by an announcement (find it in Monitor Polski)'] : [])].join(', ');
  console.log(`- ${c.id} (in force ${c.date}; points ${when}): ${a.title}`);
}
