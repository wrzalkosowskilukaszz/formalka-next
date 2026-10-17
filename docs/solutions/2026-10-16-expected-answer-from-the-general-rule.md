---
rule: Before stating what applies to a case, find the rule or page for that exact case (the city's card, the single permit's own article), not only the general rule.
kind: legal-source
files: [audit/**/reference/**, audit/*-residence/**, prototype/README.md, research/**, docs/formalka-next/maps/**]
check: none: a research practice; the separate checking agent (.claude/agents/official-fact-checker.md) caught it on 17.10, and the expert review is the final check
date: 2026-10-16
commits: [77d704d]
---
**Problem.** The session script scored "the office for the property's district" as the only right answer in Warsaw. The city's own cards say any district office accepts the filing. Correct answers would have been marked wrong.

**Cause.** The expected answer was derived from the act's general wording (the municipality where the property lies), and the open question (OPEN-5) was not looked up before the script was written.

**Fix.** The Warszawa 19115 cards were fetched. OPEN-5 is resolved for Warsaw, and the reference, the checklist, D8 and the script were corrected.

**Found again (17.10.2026, the independent checks of the work and residence maps).** The general rule was cited where a more specific one decides the case:
- the residence map gave the end-of-purpose notice of art. 113 for a lost job, while art. 121 and 123 of the act on foreigners set the written notice and a 30-day protection for the single permit;
- the work map said the regulation's cases need "a stay that allows work", while art. 3 ust. 6 of the work act needs only a legal stay.

Both were found by the separate checking agent, not by a tool.
