# 10 — Privacy, security and trust

This is a design threat model by the main agent. It is **not** legal advice and **not** a substitute for the security-reviewer role or a privacy professional. A DPIA is likely appropriate before any public release (§4).

## 1. Data inventory (local-first design)

| Data | Example | Where | Leaves the device? |
|---|---|---|---|
| Goal text | "Chcę ubiegać się o obywatelstwo" | Device | Masked, in an AI brief, only when the user uses AI intake/companion |
| Decision facts (non-identifying) | citizenship group, stay type, city | Device | In AI briefs (needed for answers); never with an identifier |
| Personal details | name, PESEL, birth date, address | Device only, encrypted | **Never** (form filling is on the device) |
| Artifacts | filled official form | Device | Only when the user exports, prints or shares |
| Uploads (later phase) | photo of a letter | Device | Never by default; masked text only on explicit consent |
| Registry requests | "procedure zameldowanie-foreigner v10" | Server logs (IP) | Yes; public data, but request patterns reveal interest. Minimise: fetch template bundles, not per-fact queries |
| AI requests | masked brief | Gateway → provider | Yes; zero-retention terms required; no content logs at the gateway |

Special categories:
- immigration status is not a GDPR art. 9 special category as such, but it is highly sensitive in context [INFERENCE];
- health data would be art. 9 if the primary-care guide becomes a case [FACT: GDPR art. 9 lists data concerning health].

Keep health cases out of AI briefs or exclude them from the pilot.

## 2. Threats and controls

| Threat | Likelihood × impact | Control |
|---|---|---|
| Hallucinated requirement or deadline | High × high | Deterministic planner + independent validator; LLM cannot create tasks/dates (06) |
| Wrong reminder date | Medium × high | Dates only from confirmed events + rules; property tests; release-blocking metric (11) |
| Prompt injection via a letter or page | Medium × medium | Proposals need a user tap; tool policy outside prompts; schema enums; adversarial tests (07 §4) |
| Unauthorised external action | Low (none exist) × high | No Level 3 tools |
| Device theft / shared phone | Medium × high | OS storage encryption; optional app lock (biometric/PIN); generic lock-screen notifications; "wipe" |
| Data loss (device change, Safari eviction) | High × medium | Export/import encrypted backup; warning at plan approval; Capacitor storage on iOS |
| Cross-case leakage (a helper with several people's cases on one phone) | Medium × medium | Facts are per case; reuse across cases only with a visible confirmation ("use the same city as in X?") |
| AI provider retains or trains on data | Low–medium × high | ZDR terms (ADR-0009); masking twice; minimal brief |
| Gateway logs content | Medium × high | No request-body logging (same rule as smart search); code review + test |
| Server compromise | Low × low–medium | Server holds no personal data; impact = public registry tampering → the validator rejects unpublished/unsigned content [HYPOTHESIS: sign registry bundles, Phase 3] |
| Supply chain (npm, Capacitor plugins) | Medium × high | Pinned versions, minimal plugins, review per plugin |
| Misleading trust (looks official) | Medium × high | Rule 10: no state look-alike branding, AI disclosure, "independent" in the stores (ADR-0010) |
| Disclaimers substituting for correctness | — | Disclaimers never compensate; quality gates (11) block release |

## 3. Defaults

- No account; no server-side case data; no analytics on case content (aggregate, cookieless only, ADR-0017).
- AI features off until the user starts the AI intake. Structured intake works without AI.
- Personal details are requested only inside the "fill the form" action and kept by default only until export [HYPOTHESIS, to test against convenience].
- Notifications are generic on the lock screen; detail is opt-in.
- Reusing facts across cases needs a confirmation each time.
- One-tap "wipe everything on this device" and per-case delete; export as an encrypted file.

## 4. Compliance work before public release (owner decisions; no lawyer budget, ADR-0008)

1. **DPIA screening:** processing of sensitive situational data of vulnerable people, plus new technology (AI). A DPIA is likely required or at least prudent [INFERENCE from GDPR art. 35 criteria]. The local-first design reduces its scope but does not remove it: AI briefs still contain facts.
2. **Privacy notice update:** what AI receives, which provider, retention terms, the region.
3. **AI Act:**
   - **Article 50 transparency** (disclose the chatbot) applies from 2 August 2026 [FACT per multiple secondary sources on the Digital Omnibus; the Official Journal text not read first-hand].
   - **Annex III point 7** (migration, asylum, border control) targets systems used by or for competent public authorities. A private self-help assistant is likely outside it [INFERENCE; legal confirmation OPEN]. Annex III obligations moved to 2 December 2027 [same source caveat].
4. **App store rules** for apps presenting government information: state independence and link official sources in the app and the listing (ADR-0010).
5. **Consumer law** if a paid pass is sold: merchant of record (ADR-0015).

## 5. Trust requirements vs. marketing disclaimers

Trust comes from verifiable behaviour, not text:
- every item shows its source and check date;
- uncertainty is visible;
- the history shows what changed and why;
- "done" says who marked it;
- the app works without AI;
- personal details never leave the phone.

Testable statements, part of the evaluation:
- "We don't know" appears where the registry has no answer;
- no screen claims office acceptance without evidence.
