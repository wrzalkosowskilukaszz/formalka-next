# Sweep: what the extracts leave out, 17.10.2026

**What:** the new check `tools/sources/omitted.mjs` was run on 41 of the 55 extracts in `research/*/sources/`: each one whose header names its act. Skipped: the "other acts" extracts, which quote several acts, and the extracts of amending acts (Dz.U. 2025 poz. 1794, 1676, 1734), which quote amendments, not articles. It lists two things, and marks those that carry an exception word ("nie stosuje się", "z wyjątkiem", "chyba że", "nie może"…):
- the paragraphs of each quoted article that the extract does not quote;
- the articles that name a quoted article.

**Why:** missed exceptions in later paragraphs were found three times by the checking agent (`docs/solutions/2026-10-16-read-the-whole-article.md`), last in the unemployment map. Run on that map's first extract, the tool lists six of the agent's findings.

**Who:** Claude, in the lab. It is not an independent check.

**How it was read:**
- Every marked line was looked at, by its opening.
- Those whose opening could bear on a rule a map states were read in full in the act, and the map's claim was looked up.
- The rest name a quoted article only in passing: data registers, fees for other procedures, purpose-specific refusal grounds that the residence reference already hands to a lawyer, the act's own entry-into-force article, and the like.

## Result

**No marked provision contradicts a rule an older map states.** Where one bears on a rule, the map already has it:
- the 30-day protection after a lost job and "once per permit" (act on foreigners art. 123 ust. 1–2) are in the residence reference;
- the loan-for-use rule for the EU long-term resident's flat is in the permanent residence map (art. 219a ust. 2);
- the exceptions to e-delivery (e-delivery act art. 6) are in the e-government sources.

**Three possible additions**, none correcting a stated rule:

| Map | Provision | What it adds |
|---|---|---|
| School | Prawo oświatowe art. 37 ust. 3, 5 | Two of the conditions for education outside school do not apply to a child with a special-education certificate for a moderate or severe intellectual disability |
| School | Prawo oświatowe art. 156 ust. 1 | A recruitment application names at most three public preschools or schools, unless the running body allows more |
| Work | The work act art. 58 ust. 4 | Work on a seasonal permit is legal while a complete extension application is pending, until the decision is final |

**The unemployment and Karta Polaka maps:** see their own folders. For the unemployment map the tool found art. 72 and 225 ust. 2 after the agent's check (`research/2026-10-17-unemployment/sources/CHECK.md`). For the Karta Polaka map it found nothing marked; its README cites art. 24b–24c, which the extract does not quote (handled with that map's check).

## The tool's own errors found by the sweep

Each changed in the lab, with a test (`tools/sources/omitted.test.mjs`):
- a 60-character opening that recurs in other articles made an unquoted article count as quoted: now 200 characters;
- "(uchylony)" is found anywhere, so 107 articles of the health care act counted as quoted: repealed and short paragraphs no longer count;
- in the KPA, whose articles hold paragraphs "§ 1.", the paragraphs were taken for units: § is now the unit only when there are hardly any articles;
- an article quoted in another extract of the same folder was listed as left out: the tool now takes several extracts.

## Limits

- The tool sees only references by number. A rule that names no quoted article (the labour market act's art. 246 and 436) is not listed, so the checking agent's reading stays.
- Its exception words are a short list; a paragraph without one is shown only with `--all`.
- References to another act are filtered by its title ("ustawy z dnia"); a few slip through, and some of the act's own are dropped.
- The three additions above are not yet in the maps. They are small, and the owner decides whether the older maps are reopened.
