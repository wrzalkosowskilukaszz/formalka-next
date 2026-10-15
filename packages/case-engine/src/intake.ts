// Intake from the person's own words: free text → fact candidates the person confirms (doc 16 §9a).
// An extractor only proposes. A candidate becomes a fact when the person confirms it, never before,
// and `checkCandidates` drops, whatever the extractor (this baseline today, an LLM later):
// - a fact this case doesn't ask, or one that is always asked (no topic below: compound options such
//   as citizenship.group, whose labels join several conditions a sentence rarely states);
// - a value outside the fact's options, or "Nie wiem" (that one is the person's to give);
// - evidence that isn't the person's own words, verbatim;
// - evidence off the fact's topic. Language and origin are not citizenship or status (rule 5): "piszę po
//   ukraińsku" or "jestem z Ukrainy" can never become a citizenship group or temporary protection,
//   because neither names citizenship ("obywatel") or protection ("ochrona czasowa").
// The extractor never sees the interface language or the person's location: only the text and the
// list of facts the case asks.
import type { Blueprint } from "./blueprint.ts";
import type { CaseState } from "./planner.ts";
import type { Registry } from "./registry.ts";
import { UNKNOWN } from "./rules.ts";

export interface FactCandidate { fact: string; value: string; evidence: string; by: string }
export interface Extractor { id: string; extract(text: string, facts: readonly string[]): FactCandidate[] }
export type RejectCode = "NOT_ASKED" | "ALWAYS_ASKED" | "ANSWERED" | "BAD_VALUE" | "NOT_VERBATIM" | "OFF_TOPIC" | "CONFLICT";
export interface IntakeResult { candidates: FactCandidate[]; rejected: { candidate: FactCandidate; code: RejectCode }[] }

/** What evidence must mention for each extractable fact. A fact missing here is always asked. */
export const TOPIC: Record<string, RegExp> = {
  "citizenship.ever_polish": /obywatelstw/i,
  "citizenship.where_lives": /mieszkam|przebywam|jestem w Polsce|za granic/i,
  "citizenship.permanent_title": /poby[tc]\w* stał|stałego pobytu|rezydent\w* długoterminow/i,
  "citizenship.language": /certyfikat|\b[BC][12]\b/i,
  "certyfikat.purpose": /obywatelstw|rezydent\w* długoterminow/i,
  "pobyt_czasowy.purpose": /prac|studi|żon|mąż|męż|rodzin|dzieck|dzieci|syn|córk/i,
  "zameldowanie.stay": /zameld|meldun/i,
  "zameldowanie.citizen_group": /obywatel/i,
  "pesel.citizen_group": /obywatel/i,
  "pesel.stay_over_30": /\b(?:rok|lat|lata|miesi\w*|tydzie\w*|tygodni\w*|dni)\b/i,
  "pesel.has_number": /PESEL/i,
  "pesel.temporary_protection": /ochron\w* czasow|\bC?UKR\b/i,
};

/** The facts this case can ask: every route procedure's required facts, in the content's order. */
export function factsAsked(bp: Blueprint, reg: Registry): string[] {
  return [...new Set(bp.routes.flatMap((r) => reg.procedures.get(r)?.requiredFacts ?? []))].filter((f) => reg.facts.has(f));
}

export function checkCandidates(text: string, raw: FactCandidate[], asked: readonly string[], reg: Registry, state?: CaseState): IntakeResult {
  const out: IntakeResult = { candidates: [], rejected: [] };
  const ok: FactCandidate[] = [];
  for (const c of raw) {
    const options = reg.facts.get(c.fact)?.options?.map((o) => o.value) ?? [];
    const code: RejectCode | null =
      !asked.includes(c.fact) ? "NOT_ASKED"
      : !TOPIC[c.fact] ? "ALWAYS_ASKED"
      : state?.facts[c.fact] !== undefined ? "ANSWERED"
      : c.value === UNKNOWN || !options.includes(c.value) ? "BAD_VALUE"
      : c.evidence.trim().length < 3 || !text.includes(c.evidence) ? "NOT_VERBATIM"
      : !TOPIC[c.fact].test(c.evidence) ? "OFF_TOPIC"
      : null;
    if (code) out.rejected.push({ candidate: c, code });
    else ok.push(c);
  }
  // Two different values for one fact: the text is ambiguous, so neither is proposed and the question is asked.
  for (const c of ok) {
    const clash = ok.some((d) => d.fact === c.fact && d.value !== c.value);
    if (clash) out.rejected.push({ candidate: c, code: "CONFLICT" });
    else if (!out.candidates.some((d) => d.fact === c.fact)) out.candidates.push(c);
  }
  return out;
}

/** Facts confirmed by the person go into the case; the rest are simply asked later. */
export function confirmCandidates(state: CaseState, candidates: FactCandidate[], confirmed: readonly string[]): CaseState {
  const facts = { ...state.facts };
  for (const c of candidates) if (confirmed.includes(c.fact) && facts[c.fact] === undefined) facts[c.fact] = c.value;
  return { ...state, facts };
}

// ——— The baseline extractor: Polish phrases mapped only to words in the option's own label ———
// Deliberately narrow: it proposes only what a sentence states outright ("mam pobyt stały"), never what
// it suggests ("potrzebuję PESEL" doesn't say the person has none; "jestem Niemką" doesn't say which
// citizenship). A phrase preceded by "nie" is skipped unless the rule is the negative one.
interface Rule { fact: string; value: string; re: RegExp; negative?: boolean }
const RULES: Rule[] = [
  { fact: "citizenship.ever_polish", value: "lost", re: /miał\w* polskie obywatelstwo[^.]{0,30}straci\w*/i },
  { fact: "citizenship.ever_polish", value: "no", re: /nigdy nie miał\w* (?:polskiego obywatelstwa|obywatelstwa polskiego)/i, negative: true },
  { fact: "citizenship.where_lives", value: "poland_visa", re: /(?:jestem|przebywam|mieszkam) w Polsce na wiz\w*/i },
  { fact: "citizenship.where_lives", value: "poland_legal", re: /mieszkam w Polsce[^.]{0,40}na (?:pobycie|karcie pobytu)/i },
  { fact: "citizenship.where_lives", value: "abroad", re: /mieszkam za granicą/i },
  // "na pobycie stałym" (living on it), not "na pobyt stały" (what one registers for: zameldowanie).
  { fact: "citizenship.permanent_title", value: "yes", re: /mam (?:pobyt\w* stał\w*|zezwolenie na pobyt stały|prawo stałego pobytu|kartę stałego pobytu)|na pobycie stałym/i },
  { fact: "citizenship.permanent_title", value: "no", re: /nie mam (?:jeszcze )?(?:pobytu stałego|zezwolenia na pobyt stały)/i, negative: true },
  { fact: "citizenship.language", value: "yes", re: /mam (?:już )?(?:certyfikat\w*(?: z polskiego)?(?: (?:na poziomie )?[BC][12])?|[BC][12])\b/i },
  { fact: "citizenship.language", value: "yes", re: /mam [^.]{0,40}? i (?:certyfikat\w*(?: z polskiego)?(?: [BC][12])?|[BC][12])\b/i },
  { fact: "citizenship.language", value: "no", re: /nie mam (?:jeszcze )?certyfikat\w*/i, negative: true },
  { fact: "certyfikat.purpose", value: "citizenship", re: /certyfikat\w*[^.]{0,20} do obywatelstwa/i },
  { fact: "pobyt_czasowy.purpose", value: "seasonal", re: /prac\w* sezonow\w*/i },
  { fact: "pobyt_czasowy.purpose", value: "work", re: /(?:dostał\w*|mam|znalazł\w*) pracę|pracuję(?! sezonowo)/i },
  { fact: "pobyt_czasowy.purpose", value: "study", re: /studiuję|(?:na|dostał\w* się na) studia/i },
  { fact: "pobyt_czasowy.purpose", value: "family_abroad", re: /(?:żona|mąż|córka|syn|dziecko|dzieci) (?:jest|są|mieszka|mieszkają|został\w*) (?:jeszcze |nadal |wciąż )?(?:za granicą|poza Polską|na Ukrainie|w Ukrainie|na Białorusi|w Indiach)/i },
  { fact: "zameldowanie.stay", value: "permanent", re: /zameld\w*[^.]{0,20} na pobyt stały/i },
  { fact: "zameldowanie.stay", value: "temporary", re: /zameld\w*[^.]{0,20} na pobyt czasowy/i },
  { fact: "zameldowanie.citizen_group", value: "eu_efta", re: /jestem obywatel\w* (?:UE|Unii Europejskiej|państwa UE|EFTA|Szwajcarii)/i },
  { fact: "pesel.citizen_group", value: "eu_efta_ch_uk", re: /jestem obywatel\w* (?:UE|Unii Europejskiej|państwa UE|EFTA|Szwajcarii)/i },
  { fact: "pesel.stay_over_30", value: "yes", re: /na (?:rok|(?:dwa|trzy|kilka) lata|\d+ lat|(?:kilka|\d+) miesięcy|pół roku)\b/i },
  { fact: "pesel.stay_over_30", value: "no", re: /na (?:kilka dni|tydzień|dwa tygodnie|\d+ dni)\b/i },
  { fact: "pesel.has_number", value: "no", re: /nie mam (?:jeszcze )?(?:numeru )?PESEL/i, negative: true },
  { fact: "pesel.has_number", value: "yes", re: /mam (?:już )?(?:numer )?PESEL/i },
  { fact: "pesel.temporary_protection", value: "yes", re: /(?:mam|korzystam z) (?:status\w* )?(?:ochron\w* czasow\w*|C?UKR)\b/i },
  { fact: "pesel.temporary_protection", value: "no", re: /nie (?:mam|korzystam z) (?:status\w* )?(?:ochron\w* czasow\w*|C?UKR)\b/i, negative: true },
];

export const baselineExtractor: Extractor = {
  id: "baseline-pl-1",
  extract(text, facts) {
    const out: FactCandidate[] = [];
    for (const r of RULES) {
      if (!facts.includes(r.fact)) continue;
      for (const m of text.matchAll(new RegExp(r.re.source, `${r.re.flags}g`))) {
        // "nie" as its own word right before the phrase ("mieszkanie na rok" is not a negation).
        const before = text.slice(Math.max(0, (m.index ?? 0) - 8), m.index);
        if (!r.negative && /(?:^|[^\p{L}])nie\s+$/iu.test(before)) continue;
        out.push({ fact: r.fact, value: r.value, evidence: m[0], by: this.id });
      }
    }
    return out;
  },
};

export function intake(bp: Blueprint, reg: Registry, text: string, state?: CaseState, extractor: Extractor = baselineExtractor): IntakeResult {
  const asked = factsAsked(bp, reg);
  return checkCandidates(text, extractor.extract(text, asked), asked, reg, state);
}
