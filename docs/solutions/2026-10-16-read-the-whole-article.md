---
rule: Before stating a rule from an article, read the whole article, the articles naming it and those it applies (node tools/sources/omitted.mjs <ELI> <extract>); exceptions often sit elsewhere.
kind: legal-source
files: [audit/*-residence/**, audit/**/reference/**, research/**, docs/formalka-next/maps/**]
check: tools/sources/omitted.mjs::lists the paragraphs a quoted article leaves out, the articles that name a quoted one, and the articles a quoted paragraph names that the extract leaves out, marking exception words and "stosuje się" (tools/sources/omitted.test.mjs); the separate checking agent still reads each claim
date: 2026-10-16
commits: []
---
**Problem.** The residence draft said the first residence card is always issued ex officio (art. 229 ust. 2, which the amendment Dz.U. 2025 poz. 1794 rewrote). Art. 229 ust. 4, unchanged and already in the draft's own extract, says that after family reunification from abroad (and in some other cases) the first card is issued on the person's application. The registry had it right.

**Cause.** The draft followed the amendment's text, which quotes only the paragraph it changes.

**Fix.** The reference cites art. 229 ust. 2 and 4 together, and RC4 says the card is on application (correction K4).

**Found again (17.10.2026, the health and civil status maps).** The separate checking agent found the same gap in other articles, though each extract already held the whole article: the municipality's decision gives the right for 90 days only (health act art. 54 ust. 7), primary care is not billed after a statement made without the right (art. 50 ust. 16, the closing words), and a child with a severe disability is family with no age limit (art. 5 pkt 3 lit. a). A condition inside the cited paragraph itself was also missed: transcription is mandatory only with an earlier Polish record (civil status records act art. 104 ust. 5). So quoting the whole article is not enough: each claim has to be read against the rest of its article. The agent is now run on every map before it is relied on (`research/*/sources/CHECK.md`); it is not an automatic check.

**Found again (17.10.2026, the unemployment map).** The map quoted art. 65, 219 ust. 1 and 225 ust. 1 of the labour market act and missed art. 66 (no removal for a pregnancy-related illness), 219 ust. 2 (the notice rule does not apply when the last job is not the basis of the right), 225 ust. 3 (a shorter benefit period) and 433 ust. 7. The checking agent found them. A third time is a pattern, so there is now a check: `node tools/sources/omitted.mjs <ELI> <extract>` lists the paragraphs a quoted article leaves out and the articles that name a quoted one, marking those with an exception word. Run on the extract as first committed (213ea9a), it lists art. 218 ust. 5, 219 ust. 2, 225 ust. 2–3, 35 ust. 1, 66 ust. 1 and 433 ust. 7. It does not see a rule that names no quoted article (art. 246, 436), so the agent's reading stays.

**Found again (17.10.2026, the invitation map).** UoC art. 49 ust. 3 says "stosuje się przepis art. 195 ust. 4" for the inviter's unbroken 5 years. The extract quoted art. 49 ust. 3 and not art. 195 ust. 4, so the map never stated the break rule (no break over 6 months, at most 10 in all, four exceptions) and judged the 5 years by the age of a residence card. `omitted.mjs` listed only articles that name a quoted one, not the ones a quoted one applies. It now also lists the articles a quoted paragraph names that the extract leaves out, marking those it applies ("stosuje się", "zgodnie z"); run on the extract as first committed (288ebd1), it prints art. 49 ust. 3 naming art. 195. It still does not see art. 336–337 (the costs of a return decision), which name no quoted article; the checking agent found them.
