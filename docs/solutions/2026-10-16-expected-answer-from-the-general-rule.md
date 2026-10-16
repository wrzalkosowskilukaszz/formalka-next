---
rule: Before fixing an expected answer for scoring or a test, find the official page for that exact case (the city's own card), not only the general rule.
kind: legal-source
files: [audit/**/reference/**, prototype/README.md, research/**]
check: none: a research practice; the reference review by an expert is the check
date: 2026-10-16
commits: [77d704d]
---
**Problem.** The session script scored "the office for the property's district" as the only right answer in Warsaw. The city's own cards say any district office accepts the filing. Correct answers would have been marked wrong.

**Cause.** The expected answer was derived from the act's general wording (the municipality where the property lies), and the open question (OPEN-5) was not looked up before the script was written.

**Fix.** The Warszawa 19115 cards were fetched. OPEN-5 is resolved for Warsaw, and the reference, the checklist, D8 and the script were corrected.
