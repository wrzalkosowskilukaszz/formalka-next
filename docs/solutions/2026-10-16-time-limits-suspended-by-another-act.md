---
rule: Before stating a decision limit, notice duty or delay remedy, search the other acts that bind the same office for a suspension ("bieg terminów"); for residence, the special act art. 100d.
kind: legal-source
files: [audit/*-residence/**, audit/**/reference/**, research/**, docs/formalka-next/19-DOMAIN-ROADMAP.md]
check: audit/2026-10-16-residence/engine-output.mjs::prints every registry note, where decision-time-suspended showed the gap
date: 2026-10-16
commits: []
---
**Problem.** The residence draft reference gave the 60-day decision limit (art. 112a), the office's duty to explain a delay (KPA art. 36) and the ponaglenie (KPA art. 37) as available. Until 4.03.2027 none of them works as written: the special act on aid to Ukrainian citizens, art. 100d (consolidated Dz.U. 2026 poz. 1293), stops the voivode's time limits in every foreigner's residence case and switches off the inactivity provisions. The registry had it as an important note; the draft did not.

**Cause.** The sources were collected per procedure (the act on foreigners, KPA). The special act was filed under wave 3 (Ukrainian citizens), although this article applies to everyone.

**Fix.**
- The reference now gives art. 100d in §3, §4 and RC8, with the extract in its sources.
- The prototype's waiting answer leads with it while the registry carries the note (COMPARISON D8).
- The comparison prints every note, which is how this was found.
