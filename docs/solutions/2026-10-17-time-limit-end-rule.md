---
rule: Before computing a date from a time limit, apply the act's own rule on its end (a Saturday or day off moves it; the day a document counts) and say how days are counted.
kind: legal-source
files: [research/**, docs/formalka-next/maps/**, docs/formalka-next/19-DOMAIN-ROADMAP.md]
check: none: a research practice; the separate checking agent found it on 17.10 (the voters map); a candidate check is a per-map script that recomputes every stated margin
date: 2026-10-17
commits: []
---
**Problem.** The voters map said an EU citizen must apply at least 15 days before an election to reach the list even with a discrepancy (7 days to clear it, 5 to decide, the register's state on the 3rd day before), and proposed a 3-week margin. Electoral Code art. 9 § 2 moves a limit that ends on a Saturday or a statutory day off to the next working day, and § 1 counts a document on the day it is lodged at the office or court. With that, filing on the 15th day before a Sunday election is too late; the safe day is the 16th, and a refusal with a complaint needs 18 to 23 days, so the 3 weeks did not cover the complaint.

**Cause.** The limits were added up as plain days from the articles that set them. The act's general rule on how a limit ends sat in another chapter, which the extract did not quote.

**Fix.** Code art. 9 and the act on days off work are quoted; the README gives the margins computed with them for the 2026 elections, with the counting rule labelled an ASSUMPTION; the map proposes 4 weeks. The checking agent's prompt now asks it to count each limit with the act's own end rule.

**How it is caught now.** Only by reading: before stating any computed date, find the act's general rule on time limits (the Electoral Code art. 9, the KPA art. 57, the Civil Code art. 111–115 where it applies) and quote it with the limit.
