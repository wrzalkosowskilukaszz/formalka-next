# ADR-N003: A versioned plan of tasks with dependencies (hybrid model)

- **Status:** Proposed
- **Date:** 2026-10-15
- **Deciders:** Łukasz (owner), Claude

## Context
04 compares four models for a case:
- A: a directed acyclic task graph;
- B: a rule-driven workflow or state machine;
- C: a versioned case plan with explicit dependencies;
- D: a hybrid of C, whose tasks form a DAG (A), with a small task state machine.

Cases change when facts change, rules change or the user acts. Completed work must never be lost or silently reset.

## Decision
- **Model D.** A plan version is computed from (template, confirmed facts, recorded events, registry versions).
- Tasks have stable ids `procedureId:stepId` and dependencies from the existing `dependsOn`. Each task has the states blocked / ready / in_progress / waiting_external / done / not_needed / cancelled.
- A new plan is a proposal with a diff. The user approves it.
- `done` is never changed by a replan. A tampered diff can't change it either: S1 tests this.
- Completion is typed: user_confirmed, system_confirmed or authority_evidence.

## Consequences
- History and "what changed" are explainable (S1: reg-03, reg-04, route change).
- Stable ids depend on stable step ids in the registry. Renaming a step is a breaking change and needs a mapping.
- Slice 1 needs only a linear plan with one branch. The DAG costs little because the data already has it (14 §2).

## Alternatives considered
- **A task graph alone (A):** it has no history, so a replan is a graph rewrite.
- **A workflow or state machine (B):** too rigid; real cases skip, repeat and branch.
- **A versioned plan alone (C):** it doesn't make "what's next" a query over dependencies.

## Revisit when
A real procedure needs loops (repeat until accepted) that a re-plan can't express.
