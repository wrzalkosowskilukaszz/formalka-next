// Lists the acts that amended a Polish act after a given date, from api.sejm.gov.pl (ELI), so a consolidated
// text is never quoted as the law in force without its later amendments
// (docs/solutions/2026-10-16-consolidated-text-without-later-amendments.md).
// Usage: node tools/sources/amendments.mjs DU/2013/1650 2025-07-25
// A consolidated text's ELI (DU/2025/1079) is resolved to the act it consolidates (DU/2013/1650): see touched.mjs.
import { actWithAmendments, amendingAfter } from './touched.mjs';

const [eli, since] = process.argv.slice(2);
if (!eli || !since) { console.error('usage: node tools/sources/amendments.mjs <ELI, e.g. DU/2013/1650> <YYYY-MM-DD>'); process.exit(2); }
const get = async (id) => (await fetch(`https://api.sejm.gov.pl/eli/acts/${id}`)).json();
const { eli: base, act, note } = await actWithAmendments(eli, get);
if (note) console.log(note);
const changes = amendingAfter(act, since);
console.log(`${base}: ${act.title}`);
console.log(`${changes.length} amending act(s) in force from ${since}:`);
for (const c of changes) {
  const a = await get(c.id);
  console.log(`- ${c.id} (in force ${c.date}): ${a.title}`);
}
