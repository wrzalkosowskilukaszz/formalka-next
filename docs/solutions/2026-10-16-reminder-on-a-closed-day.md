---
rule: A date a person must act on never falls silently on a day off; say so, remind on the last working day before, and never move a legal date to fix it.
kind: legal-source
files: [packages/case-engine/src/advisor.ts, packages/case-engine/src/dates.ts, packages/case-engine/src/messages.ts, prototype/src/js/00-base.js]
check: packages/case-engine/tools/mutations.mjs::advisor-reminder-on-closed-day, messages-closed-day-unsaid
date: 2026-10-16
commits: [22183f2, 4fa95e3]
---
**Problem.** The 4th day after a Thursday arrival is a Sunday. The app showed the date with no warning, and the reminder "Dziś mija bezpieczny termin" fired on that Saturday or Sunday.

**Cause.** Open-reading (`nth-day`) deadlines had no closed-day handling. Whether the date moves is not settled in the sources (OPEN-2).

**Fix.**
- The due text names the day off.
- The last reminder (`deadline_last_workday`) comes on the last working day before.
- The date stays.

**Caught now by** engine tests and two mutations.
