# ADR-N007: Slice 1 is address registration + PESEL

- **Status:** Proposed
- **Date:** 2026-10-15
- **Deciders:** Łukasz (owner), Claude

## Context
The candidate pilots were citizenship, address registration + PESEL, and the temporary residence permit (13 §1).

## Decision
- **Slice 1:** the template `arrive-register-address`:
  - structured intake;
  - the validated plan;
  - the official form filled on the device;
  - the office for the user's municipality;
  - `.ics` and Android reminders from the confirmed move-in date;
  - done and history.
- No AI in slice 1.
- **Slice 2** (temporary residence permit) only if H1 and H6 hold and the guide reaches the plannable bar.

## Consequences
- The address-registration guide must first clear D-01 (in PR #85) and the redesign's phase 0, and reach P1–P8 (06 §2).
- The PESEL procedure needs verified quotes in the case template; the spike's are placeholders.
- A5 must be checked first: if most people arrive after day 4, the slice leads with "registering late" rather than reminders.

## Alternatives considered
- **Citizenship:** few deadlines, discretionary, years long.
- **Residence permit first:** the highest stakes, the longest case, many open findings.

## Revisit when
Phase 1 interviews show another job dominates, or A5 fails.
