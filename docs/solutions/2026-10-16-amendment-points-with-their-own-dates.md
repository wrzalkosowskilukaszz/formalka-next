---
rule: Before giving an amendment's date for a provision, read the amendment's own entry-into-force article (node tools/sources/entry-dates.mjs <ELI>) and quote the date of that point, not the act's general date.
kind: legal-source
files: [audit/**/reference/**, audit/*-residence/**, research/**, docs/formalka-next/19-DOMAIN-ROADMAP.md]
check: tools/sources/entry-dates.mjs::prints the entry-into-force article and flags points with their own dates
date: 2026-10-16
commits: []
---
**Problem.** Two residence source headers said that Dz.U. 2025 poz. 1794 changed the card articles (art. 226–248) "from 27.04.2026". By its art. 19, points 42–46 (art. 226–229, including "Pierwszą kartę pobytu … wydaje się z urzędu") took effect on 1.04.2026; only points 44 lit. b and 47–50 (art. 228 pkt 2, 244, 246, 248) waited for the announcement of 27.04.2026 (M.P. 2026 poz. 370). api.sejm.gov.pl gives the act's `entryIntoForce` as 1.01.2026, which is right for neither.

**Cause.** The date of the MOS announcement was applied to the whole amendment, and the API's single date looked authoritative.

**Fix.**
- The headers and the sources README now give the date per point.
- The residence reference cites art. 229 ust. 2 from 1.04.2026 and art. 248 from 27.04.2026.
- `tools/sources/entry-dates.mjs` prints the act's entry-into-force article from its text and says when points have their own dates or an announcement sets them. Its parser has a test.
