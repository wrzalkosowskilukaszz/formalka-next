---
rule: No raw colour, font size, radius, duration or z-index in app.css; add or reuse a token in src/tokens*.css, and no text below 12 px.
kind: ui-design
files: [prototype/src/app.css, prototype/src/tokens.css, prototype/src/tokens-dark.css]
check: prototype/test/design.test.mjs
date: 2026-10-16
commits: [28a55c5]
---
**Problem.** 103 raw values had accumulated in `app.css`, including text at 9–11 px.

**Fix.** A radius, motion, elevation and type scale in the tokens.

**Caught now by** `design.test.mjs`. `node prototype/test/design-rules.mjs` lists violations with lines.
