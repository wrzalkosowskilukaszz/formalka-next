---
rule: When an amendment rewrites one paragraph, read the whole article in the consolidated text before stating the rule; the exceptions often sit in a later paragraph.
kind: legal-source
files: [audit/*-residence/**, audit/**/reference/**, research/**]
check: none: a reading practice; the engine comparison caught it first, and the separate fact-checking agent (.claude/agents/official-fact-checker.md, its step 4) caught it again on 17.10
date: 2026-10-16
commits: []
---
**Problem.** The residence draft said the first residence card is always issued ex officio (art. 229 ust. 2, which the amendment Dz.U. 2025 poz. 1794 rewrote). Art. 229 ust. 4, unchanged and already in the draft's own extract, says that after family reunification from abroad (and in some other cases) the first card is issued on the person's application. The registry had it right.

**Cause.** The draft followed the amendment's text, which quotes only the paragraph it changes.

**Fix.** The reference cites art. 229 ust. 2 and 4 together, and RC4 says the card is on application (correction K4).

**Found again (17.10.2026, the health and civil status maps).** The separate checking agent found the same gap in other articles, though each extract already held the whole article: the municipality's decision gives the right for 90 days only (health act art. 54 ust. 7), primary care is not billed after a statement made without the right (art. 50 ust. 16, the closing words), and a child with a severe disability is family with no age limit (art. 5 pkt 3 lit. a). A condition inside the cited paragraph itself was also missed: transcription is mandatory only with an earlier Polish record (civil status records act art. 104 ust. 5). So quoting the whole article is not enough: each claim has to be read against the rest of its article. The agent is now run on every map before it is relied on (`research/*/sources/CHECK.md`); it is not an automatic check.
