# CLAUDE.md — Formalka Next lab

This is the R&D lab for **Formalka Next** (a "Living Case" app: a personal virtual office with a proactive AI advisor). It is **not** Formalka production (`wrzalkosowskilukaszz/formalka`) and must never become it. The owner is Łukasz: he decides, Claude writes. Talk to him in Polish; write code, comments, commits and docs in English.

**Start here:** `docs/formalka-next/00-EXECUTIVE-DECISIONS.md`. For the current task, read `docs/formalka-next/15-PROTOTYPE-BRIEF.md`.

## Isolation rules (ADR-N001; owner, 2026-10-15)
- Push only to `wrzalkosowskilukaszz/formalka-next`. A `pre-push` hook enforces it; enable it with `git config core.hooksPath .githooks`.
- Never write to the production repository, its database, its Vercel project, its secrets, its workers or its DNS.
- Use no production credentials. Spikes and prototypes use synthetic data only.
- No public deployments. A prototype is shared as a private link (for example a private Artifact) that the owner chooses to share.
- No paid APIs or paid infrastructure without the owner's explicit approval.
- `reference/` holds read-only snapshots from production, each with its source commit. Never edit them; never copy anything back.

## Product rules that apply here too (from Formalka's CLAUDE.md)
1. No invented facts: fees, deadlines, documents, conditions, offices and URLs come from the verified registry (here: `reference/`), never from model memory. A prototype labels them as examples.
2. The plan comes from verified, mapped procedures. The AI chooses and explains; it never invents a requirement or a date.
3. "Nie wiem" is always a valid answer.
4. Language is not citizenship; the persona is never chosen by nationality or language.
5. No personal data on any server (ADR-0009): the case lives on the device.
6. Honest identity: the advisor says it is an AI assistant. No government look-alike branding. Never claim an action (booking, sending, filing) that did not happen.
7. Visual values come from `reference/formalka-design/tokens.css`. The UI must never look like generic AI output (`reference/formalka-design/DESIGN-BRIEF.md` §6). Respect `prefers-reduced-motion`.

## Conventions
- Conventional Commits.
- Stage files by name.
- Mark every claim as FACT (with source and date), INFERENCE, HYPOTHESIS, OPEN or ASSUMPTION.
- Spikes: `spikes/<id>/` with a README that gives the hypothesis, input, expected behaviour, test, result, limitations and the decision consequence.
- Spike S1 runs with `npm test` in `spikes/s1-case-engine` (Node 22.18+).
