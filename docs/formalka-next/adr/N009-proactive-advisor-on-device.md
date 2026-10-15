# ADR-N009: The advisor acts by itself, on the device, with one consent per case

- **Status:** Proposed (built and tested in the lab, 2026-10-16)
- **Date:** 2026-10-16
- **Deciders:** Łukasz (owner: "doradca, który działa, a nie czeka"), Claude

## Context
The owner's main differentiator is that Maciek acts without being asked. He plans reminders before deadlines, prepares a visit, reminds to call, and asks afterwards how it went, so the user needn't open the app to know what's next.

Two constraints shape it:
- ADR-0009 and ADR-N002: no server knows the case;
- web platforms cannot schedule notifications without a server (09 §3).

## Decision
- **Computed on the phone.** The agenda is computed deterministically on the phone from the approved plan, the recorded events and the consent. It is handed to the OS scheduler (Capacitor local notifications; `.ics` on the web).
- **No AI in the scheduling.** Templates give the wording.
- **One consent per case**, given at plan approval. After that the advisor acts without asking each time. Every action shows in the case history and can be revoked.
- **Guards:**
  - only approved plans;
  - only dates from recorded events;
  - never for a deadline that may not apply;
  - quiet hours 20:00–08:00;
  - one notification per case per day, except what the user timed and the deadline day;
  - a generic lock screen by default;
  - stable ids;
  - no claim of an action that didn't happen.

## Consequences
- **Works offline.** Proactivity works with the app closed and offline, at no AI cost.
- **Mobile apps first.** Reliable timing needs the native shells (ADR-N006 amendment: Android and iOS).
- **The advisor can't know** what happened at the office unless told. That is why it asks "jak poszło?" with three answers that update the plan.

## Revisit when
Users find one a day too few or too many (measure opt-outs in the alpha). Another case: a content-free server push becomes necessary, which needs an ADR amending ADR-0009.
