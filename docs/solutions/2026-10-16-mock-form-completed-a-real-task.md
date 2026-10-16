---
rule: Practice or a mock never completes a real task, and is never called a document to print or take to the office.
kind: content-safety
files: [prototype/src/js/40-case.js, prototype/src/js/45-guide.js]
check: prototype/test/e2e.mjs::B, the form step stays open after practice
date: 2026-10-16
commits: [28a55c5]
---
**Problem.** Filling the mock form with sample data ticked the task "Formularz" as done. The assistant offered to "zapisać szkic PDF w Teczce, żeby później go wydrukować". A person could go to the office without the official form.

**Cause.** The mock was built to demonstrate the flow (spike S3), and `openForm` called `setTask(..., 'done')` on submit.

**Fix.**
- The mock is practice only and never completes the task.
- The official blank is the primary action.
- The copy says the mock is not for the office.

**Caught now by** scenario B's assertion that the form level stays open after practice.
