# ADR-N010: The assistant learns from use without collecting cases

- **Status:** Proposed (owner's request of 2026-10-16; the on-device part is built in the prototype)
- **Date:** 2026-10-16
- **Deciders:** Łukasz (owner), Claude. An auditor's review is requested before any part beyond the device is built.

## Context
The owner wants the assistant to "think" about every answer, including answers in the person's own words. He also wants the model to learn from answers and get better with every question from every user (owner, 2026-10-16).

Three standing rules limit how that can work:
- **Rule 1 (no invented facts) and ADR-N004.** Fees, deadlines, documents and offices come only from the verified registry. What users say is never a source of facts for other users.
- **ADR-0009 and ADR-N002.** No personal data on a server; the case lives on the device.
- **Doc 10.** No content logs at the AI gateway.

So "learning" cannot mean training a model on people's conversations, or moving facts from one person's case into another person's plan.

## Decision
Learning happens at three levels. Only level 1 exists today.

1. **On the device (built in the prototype).** The assistant keeps what the person confirmed and uses it:
   - facts from their own words, each confirmed on a card;
   - the city;
   - the hour they last picked, offered first next time.

   The case history shows it ("Co … pamięta"). It never leaves the phone, and deleting the case deletes it.
2. **Better understanding, by people, with consent (proposed).** When the assistant does not understand a phrase, the phone can offer: "Wyślij ten zwrot, żeby asystent rozumiał go następnym razem". Rules:
   - one tap per phrase, never a standing setting;
   - the phrase is masked on the device first (`packages/domain/privacy`), with no case, no city and no identifiers;
   - a person reviews it and adds it to the reader's phrase list and to the evaluation set (doc 11). It ships with the next registry or app update.
   - Nothing is learned automatically, and nothing is stored unreviewed beyond 30 days (ASSUMPTION: the retention figure is for the owner to set).
3. **Better content from outcomes (proposed).** The phone may send anonymous counters, opt-in, with no case content. An example: "Czegoś brakowało" at the level "Wizyta w urzędzie gminy" of procedure X. Rules:
   - counters are published to the content team only above a k-anonymity threshold (k ≥ 20, ASSUMPTION);
   - they trigger a check of the guide against the official sources;
   - the registry changes only through the normal verified path (rule 1).

**Never:**
- fine-tuning or prompting a model with users' conversations;
- a fact learned from one user shown to another;
- a server-side case profile.

## Consequences
- The product improves through reviewed phrase lists, evaluation scenarios and registry fixes, not through opaque model updates. Every improvement can be traced and reverted.
- Levels 2 and 3 need:
  - a privacy notice and a DPIA screening (doc 10);
  - the gateway's no-content-logs rule extended to the phrase inbox;
  - a review routine of about 1 h a week for the owner or an editor (HYPOTHESIS: the volume is unknown until the alpha).
- Level 1 adds no cost and no risk beyond what the device already holds.

## Open (owner and auditor)
- **O-L1:** Build level 2 at all? If so, in the private alpha (Phase 5) or later?
- **O-L2:** The retention for unreviewed phrases, and who reviews them.
- **O-L3:** Level 3 counters: worth the privacy cost for the content team's signal?

## Revisit when
- The alpha shows the reader misses more than about 1 in 5 typed answers (measure "Nie jestem pewien" replies on the device, locally).
- A language model takes over the extraction (Phase 4): its prompts and evaluation still follow this ADR.
