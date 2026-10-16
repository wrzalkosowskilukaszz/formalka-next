---
rule: The lab repository is public: pushing a branch publishes it; never push personal data, session notes or recordings, and say in the report that a push happened.
kind: process
files: [research/**, audit/**, docs/**]
check: none: the pre-push hook checks only the remote; the repository's visibility is the owner's decision (ADR-N001)
date: 2026-10-16
commits: []
---
**Problem.** The owner asked that nothing be published, while work had to survive the container. Pushing the lab branch to a public repository is a form of publishing.

**Fix.** Each report says that a branch was pushed and that the repository is public. Interview notes and recordings never enter the repository (`research/2026-10-16-service/INTERVIEW-PLAN.md`).
