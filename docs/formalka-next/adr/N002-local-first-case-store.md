# ADR-N002: The case lives on the user's device

- **Status:** Proposed
- **Date:** 2026-10-15
- **Deciders:** Łukasz (owner), Claude

## Context
ADR-0009 (production) forbids accounts, stored conversations and uploads. A case (facts, plan, task states, personal details for forms) is personal data by nature. A server-side case store would need ADR-0009 superseded, plus a DPIA, retention, breach handling and authentication. That is a large, permanent burden for a two-person project.

## Decision
- Case state, history, personal details and filled forms are stored on the device only:
  - web: IndexedDB/OPFS;
  - native: Capacitor storage.
- The server serves:
  - the public registry and a version check, never knowing who asks about which case;
  - a stateless AI gateway that receives masked, minimal briefs.
- Continuity comes from an encrypted export/import file, not sync.

## Consequences
- ADR-0009 stays intact. A server breach exposes no case data.
- Device loss loses the case unless exported. Warn at plan approval; Safari's 7-day storage eviction makes the iOS web build risky for long cases (09 §3).
- Reminders must be scheduled on the device (Capacitor local notifications or `.ics`). A server doesn't know the dates.
- There is no cross-device use. Helpers who manage a parent's case do it on one device.

## Alternatives considered
- **Server store with accounts:** the best continuity, but it breaks ADR-0009 and adds the full personal-data burden.
- **End-to-end encrypted sync:** it keeps the server blind, but key recovery and implementation cost are high. A later option if H4 fails.

## Revisit when
H4 fails (most users refuse a case without sync), or the export is rarely used and data-loss complaints dominate.
