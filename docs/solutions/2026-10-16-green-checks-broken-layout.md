---
rule: A passing layout check is not a working layout; look at the screenshots at 320 px and at 200% text, and give each new kind of breakage its own check.
kind: testing
files: [prototype/src/app.css, prototype/test/e2e.mjs]
check: prototype/test/e2e.mjs::checkScreen clipped, scenarios Z1 and Z2
date: 2026-10-16
commits: [28a55c5]
---
**Problem.** The first zoom scenario passed. The screenshots showed a title cut off, a calendar clipped by its card, and a word broken letter by letter.

**Cause.** The check measured only scroll overflow, and `overflow: hidden` hides clipping from it.

**Fix.**
- A clipping check was added.
- The zoom checks were re-based on WCAG 1.4.10 (320 px) and 1.4.4 (200% text).
- The rows and the title wrap.

**Not caught yet:** elements overlapping one another.
