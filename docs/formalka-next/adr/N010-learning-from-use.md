# ADR-N010: The assistant learns from use without collecting cases

- **Status:** Proposed (owner's request of 2026-10-16). The external audit of 2026-10-16 proposed a decision for each level; it waits for the owner (section "Audit")
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
Learning happens at three levels. Only level 1 exists today, as session memory in the prototype. The audit's names for the levels are clearer than "learning":
- level 1: the person's memory on the device, which is not model learning;
- level 2: a controlled improvement of the reader's phrase list;
- level 3: a signal to re-check content.

1. **On the device (session memory in the prototype).** The assistant keeps what the person confirmed and uses it:
   - facts from their own words, each confirmed on a card;
   - the city;
   - the hour they last picked, offered first next time.

   The case history shows it ("Co … pamięta w tej sesji").
   - In the prototype it lasts until a reload or reset, and the last hour is shared by all cases in the session.
   - The prototype's code does not send it anywhere.
   - Lasting memory in the product needs the verified store first (ADR-N002): keys, backups, deletion and device loss. Deleting a case must delete its memory, with a test of that contract.
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
- **O-L0:** Adopt the audit's three decisions (section "Audit")? Claude recommends yes.
- **O-L1:** Build level 2 at all? If so, in the private alpha (Phase 5) or later?
- **O-L2:** The retention for unreviewed phrases, and who reviews them.
- **O-L3:** Level 3 counters: worth the privacy cost for the content team's signal?

## Audit (2026-10-16)
The external audit proposed one decision per level (`audit/2026-10-16/RESPONSE.md` §5.6). Claude recommends adopting them as written. **OPEN:** the owner's confirmation.

| Level | Decision | Conditions |
|---|---|---|
| 1. The person's memory on the device | **GO in a limited Phase 1** | Called session memory in v4. The person can correct and reset it. No real identifying data. Lasting product memory needs its own check of the store, keys, backups, deletion and device loss |
| 2. Sending phrases the reader missed | **NO-GO for collection in Phase 1; deferred** | First: manual research and synthetic regressions. Before any launch:<br>• a preview of the exact payload after masking;<br>• editing;<br>• a content limit;<br>• a documented recipient and retention for every copy and log;<br>• disclosure tests;<br>• no automatic rollout of phrases |
| 3. Outcome counters | **NO-GO for now** | First name the editorial decision each counter would change. No text, no rare combinations, no exact times. Check the metadata and the real aggregation: k ≥ 20 at publication does not protect the raw events on the way |

Points from the audit that change this ADR's reasoning:
- **Masking does not prove anonymisation.** A record without a name can still identify a person through its content, metadata or a combination of events (EDPB on anonymisation and pseudonymisation).
- **"30 days", "k ≥ 20" and "1 hour a week" are assumptions**, not results. Before level 2 or 3, the ADR must name:
  - access;
  - logs and backups;
  - deletion;
  - abuse control;
  - how a wrong phrase-list change is withdrawn.
- **Learning is not banned by rule 1.** Improving extraction is not the same as using answers as a source of law. The ban on using conversations stays as an architecture and privacy choice. Formalka's value can be tested without any model learning.

## Revisit when
- The alpha shows the reader misses more than about 1 in 5 typed answers (measure "Nie jestem pewien" replies on the device, locally).
- A language model takes over the extraction (Phase 4): its prompts and evaluation still follow this ADR.
