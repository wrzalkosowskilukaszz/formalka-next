---
rule: Every control is at least 44 by 44 px; links inside running text and the tester's controls are the only exceptions.
kind: accessibility
files: [prototype/src/app.css, prototype/src/js/**]
check: prototype/test/e2e.mjs::checkScreen, D3
date: 2026-10-16
commits: [28a55c5]
---
**Problem.** Many controls were under 44 px: chips, small buttons, the consent switch (32 px), calendar days and the avatar.

**Fix.** They were raised to `var(--target)`. The switch draws its 32 px track inside a 44 px hit box.

**Caught now by** the e2e screen check on every step.
