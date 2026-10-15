# ADR-N005: The companion is a persona over one stateless engine, not an agent per case

- **Status:** Proposed
- **Date:** 2026-10-15
- **Deciders:** Łukasz (owner), Claude

## Context
The R&D brief imagined a personal companion per case. 07 §1 compares two approaches:
- long-running agents per case;
- shared stateless orchestration with a case brief.

They are weighed on reliability, privacy, cost and observability.

## Decision
- **Shared stateless orchestration.** Each turn is built on the device from the case store as a minimal, masked brief. The LLM returns schema-checked JSON: answer, citations, proposals, uncertainty and handoff.
- Proposals need a user tap. Tools are levels 0–2 only; there is no level 3, so no external actions such as filing, paying or booking.
- A name and tone ("Maciek", "Asia") are optional presentation settings. They are never inferred from nationality or language, and the companion always discloses that it is AI.
- The companion is optional and capped (12 §3), and it is not part of slice 1 (14 §2).

## Consequences
- One truth (the case store), no server-side memory, pay per turn.
- Persona value is unproven (A8); test it before building.

## Alternatives considered
- **Autonomous agents per case:** memory drift, server-side personal data, more infrastructure.

## Revisit when
An official API for filing or booking appears (level 3 would need its own ADR and a security review).
