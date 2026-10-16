// Whose case it is: questions speak to the person ("Czy masz…"), or keep the registry's wording ("Czy ta
// osoba ma…") when the case is handled for someone else. Only the grammatical person may change.
import assert from "node:assert/strict";
import { test } from "node:test";
import { type FactDef, factsAsked, loadBlueprint, loadRegistry, voiced, YOU } from "../src/index.ts";

const ROOT = new URL("../../../", import.meta.url).pathname;
const reg = loadRegistry(`${ROOT}reference`, "formalka@04057ef");
const IDS = ["address-registration", "citizenship", "language-certificate", "pesel", "residence-card"];
const ASKED = [...new Set(IDS.flatMap((id) => factsAsked(loadBlueprint(`${ROOT}blueprints/${id}.yaml`), reg)))].sort();
const fact = (k: string) => reg.facts.get(k)!;
const texts = (f: FactDef) => [f.question.pl, f.whyWeAsk?.pl, f.unknownHelp?.pl, ...(f.options ?? []).map((o) => o.label.pl)].filter((t): t is string => !!t);
// Polish letters are not \w, so whole words are bounded by "not a letter".
const word = (w: string) => new RegExp(`(?<!\\p{L})(?:${w})(?!\\p{L})`, "iu");
// "jego" is left out: "o jego potwierdzenie" is about the citizenship, not the person.
const THIRD = word("ta osoba|tej osoby|tę osobę|tą osobą|tej osobie|jej|ona");
const GENDERED = /\p{L}+(?:łeś|łaś|łem|łam)(?!\p{L})/u;
const numbers = (t: string) => (t.match(/\d+/g) ?? []).sort().join(",");

test("voice: every question a blueprint can ask speaks to the person, with no third person left", () => {
  assert.ok(ASKED.length >= 14, `facts asked: ${ASKED.length}`);
  for (const k of ASKED) {
    for (const t of texts(voiced(fact(k), "you"))) assert.ok(!THIRD.test(t), `${k}: "${t}"`);
  }
});

test("voice: nothing in the person's voice needs their gender (no miałeś/miałaś)", () => {
  for (const k of ASKED) for (const t of texts(voiced(fact(k), "you"))) assert.ok(!GENDERED.test(t), `${k}: "${t}"`);
});

test("voice: same options, values and numbers as the registry; only known facts and values are reworded", () => {
  for (const k of ASKED) {
    const reg_ = fact(k), you = voiced(reg_, "you");
    assert.deepEqual(you.options?.map((o) => o.value), reg_.options?.map((o) => o.value), k);
    assert.equal(numbers(you.question.pl), numbers(reg_.question.pl), `${k}: numbers in the question`);
    for (const [i, o] of (you.options ?? []).entries()) assert.equal(numbers(o.label.pl), numbers(reg_.options![i].label.pl), `${k}.${o.value}: numbers`);
  }
  for (const [k, y] of Object.entries(YOU)) {
    assert.ok(ASKED.includes(k), `YOU has a fact no blueprint asks: ${k}`);
    for (const v of Object.keys(y.options ?? {})) assert.ok(fact(k).options?.some((o) => o.value === v), `${k}: unknown option ${v}`);
  }
});

test("voice: for someone else the registry's own wording is used, unchanged", () => {
  for (const k of ASKED) assert.equal(voiced(fact(k), "other"), fact(k));
  assert.match(voiced(fact("pesel.stay_over_30"), "other").question.pl, /^Czy ta osoba mieszka/);
  assert.equal(voiced(fact("pesel.stay_over_30"), "you").question.pl,
    "Czy mieszkasz albo zamieszkasz w Polsce pod konkretnym adresem, a cały Twój pobyt w Polsce potrwa dłużej niż 30 dni?");
});
