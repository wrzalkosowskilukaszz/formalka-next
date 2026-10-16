# Production content: proposals from the external audit (2026-10-16)

**Status:** proposals for the owner. **Nothing is applied in production.**

The lab works around each one in its blueprints, only with words from the registry's own quotes (doc 16 §6c). The real fix belongs in Formalka's content, through the normal path:
- the quote gate;
- the content auditor;
- the owner's review;
- a PR the owner merges.

Snapshot: `reference/` at formalka@04057ef.

## P1. Citizenship by recognition: the court complaint starts from the wrong decision
- **Where:** `procedure-recognition`, deadline `court`.
- **Now:** `rule.value.from: decision_delivered`, the same start as the appeal.
- **Problem:** the rule's own quote (gov.pl/web/mswia/popros-o-uznanie-za-polskiego-obywatela) says the opposite: „Powinieneś to zrobić w ciągu 30 dni od otrzymania decyzji Ministra”. The appeal runs from the voivode's decision; the complaint runs from the Minister's decision on the appeal.
- **Proposal:** a separate start event for the second-instance decision. PPSA art. 53 § 1 and art. 83 (doc `verifications/DATES-2026-10-16.md` §3) are the basis for the counting.
- **Risk if left:** a person counts 30 days from the first refusal, while the Minister's decision may come months later. The date is wrong either way.

## P2. Address registration: the EU family member's card for every EU citizen
- **Where:** `procedure-zameldowanie`, document `family-card`.
- **Now:** the condition `zameldowanie.citizen_group = eu_efta`, the same as `identity-eu`.
- **Problem:** the `eu_efta` group joins EU/EFTA/Swiss citizens with their family members, but the card's own quote says it is for „członkiem rodziny obywatela UE”. A German citizen is shown a card they cannot have.
- **Proposal (owner decision):** either split the group into citizen and family member (one more option, or one follow-up question), or mark the card as conditional, with who it is for.

## P3. Address registration: filing waits for the owner's confirmation
- **Where:** `procedure-zameldowanie`, step `file` (`dependsOn: owner-confirms`).
- **Problem:** the guide's own pitfall `no-owner-confirmation` says „Jeśli masz problem z uzyskaniem tytułu prawnego do lokalu lub oświadczenia właściciela, nadal możesz złożyć formularz meldunkowy”.
- **Proposal:** filing depends on the filled-in form only. The owner's confirmation becomes the usual path, with the pitfall naming the alternative.

## P4. Temporary residence: an exemption without a rule
- **Where:** `procedure-pobyt-czasowy`, fee `stamp-duty`, exemption `temporary-protection-and-others`.
- **Now:** no `rule`.
- **Problem:** any consumer that reads a missing rule as "always" grants the exemption to everyone. The lab engine did, until the audit (F3).
- **Proposal:** give it a rule over the facts that exist (temporary protection), or mark it explicitly as "not modellable: check in the act". Check whether Formalka's own site shows it correctly today; the lab didn't check.

## P5. Copy: "Uwaga!" in a pitfall
- **Where:** `procedure-zameldowanie` (the online-registration pitfall).
- **Problem:** the text starts „Uwaga! …”, and UI-RULES V13 forbids exclamation marks.
- **Proposal:** „Uwaga: …”, or no prefix.
