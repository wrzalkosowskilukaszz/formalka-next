---
rule: The lab repository is public: pushing a branch publishes it; never push personal data, session notes or recordings, and say in the report that a push happened.
kind: process
files: [research/**, audit/**, docs/**]
check: tools/privacy/interview-data.mjs::the pre-commit hook fails on staged audio, video or raw-interview folders (tools/privacy/interview-data.test.mjs); personal data in an ordinary file and the report of a push are still on us; the repository's visibility is the owner's decision (ADR-N001)
date: 2026-10-16
commits: []
---
**Problem.** The owner asked that nothing be published, while work had to survive the container. Pushing the lab branch to a public repository is a form of publishing.

**Fix.** Each report says that a branch was pushed and that the repository is public. Interview notes and recordings never enter the repository (`research/2026-10-16-service/INTERVIEW-PLAN.md`).

**A guard (17.10.2026).** Before Phase 1, `tools/privacy/interview-data.mjs` and `.gitignore` refuse audio and video files and folders named for raw interview material (interview notes, consents, recordings, transcripts, contact lists, coding sheets); the pre-commit hook runs it on staged files. A note saved under another name still passes, so interview files stay outside the git working tree.
