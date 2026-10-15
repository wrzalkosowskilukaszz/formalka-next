# ADR-N001: An isolated R&D lab, outside the production repository

- **Status:** Proposed (owner chose "new private repo" on 2026-10-15; the repository itself is not created yet)
- **Date:** 2026-10-15
- **Deciders:** Łukasz (owner), Claude

## Context
Formalka Next is research. Production (`wrzalkosowskilukaszz/formalka`) is read-only for this work. Leaking into it is the main risk:
- `main` deploys to Vercel and runs the worker;
- every push to the working branch makes a preview deployment;
- the repository holds production secrets in GitHub Actions.

## Decision
- A separate git repository, `formalka-next`, private.
- It has:
  - no hosting integration;
  - no Actions secrets;
  - no scheduled workflows;
  - a `pre-push` hook that refuses any remote but `formalka-next`.
- Code or content copied from Formalka is a snapshot with its source commit noted. Spikes use synthetic data only.
- Nothing from the lab merges into Formalka. Accepted designs move as normal Formalka pull requests under its rules (13 §6).

## Consequences
- No risk of preview deployments or secret exposure from research commits.
- Copied snapshots go stale; each one names its source commit.
- The owner must create the repository. Claude's GitHub access can't create repositories, and the app must be granted access to it.

## Alternatives considered
- **A branch in the production repo:** every push makes a Vercel preview, and the branch shares the repo's secrets. Rejected.
- **A folder on the working branch:** it would ride into production pull requests. Rejected.

## Revisit when
The owner accepts Phase 2. The lab then becomes an archive, and work moves to Formalka pull requests.
