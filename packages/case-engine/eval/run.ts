// Runs eval/scenarios.yaml through the engine: checks every expectation, and renders each reference
// plan as plain Polish text (for blind scoring against general chatbots, docs 11 §5).
// CLI: node eval/run.ts --write   (writes eval/REPORT.md and eval/reference-plans/*.md)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "yaml";
import { type Blueprint, type CasePlan, type CaseState, dueRangePl, type FactCandidate, intake, loadBlueprint, loadRegistry, planCase, UNKNOWN, validatePlan } from "../src/index.ts";

const ROOT = new URL("../../../", import.meta.url).pathname;
const reg = loadRegistry(`${ROOT}reference`, "formalka@04057ef");

interface Scenario {
  id: string; blueprint: string; text: string; facts: CaseState["facts"]; routeChoice?: string;
  place?: CaseState["place"]; events?: CaseState["events"];
  expect: {
    route?: string; procedure?: string; levels?: Record<string, string>; levelIds?: string[];
    fees?: [string, number][]; noFees?: boolean; deadlines?: Record<string, string>; deadlineIds?: string[];
    notes?: Record<string, string[]>; offices?: Record<string, string[]>; officeCount?: Record<string, number>;
    tasks?: Record<string, string[]>; reasonIncludes?: Record<string, string>; unsure?: string[]; forbidden?: string[];
  };
}
export interface Result { id: string; ok: boolean; failures: string[]; plan: CasePlan; text: string }

export function runScenarios(file = `${ROOT}packages/case-engine/eval/scenarios.yaml`): Result[] {
  const scenarios = parse(readFileSync(file, "utf8")) as Scenario[];
  return scenarios.map((sc) => {
    const bp = loadBlueprint(`${ROOT}blueprints/${sc.blueprint}.yaml`);
    const state: CaseState = { facts: sc.facts ?? {}, tasks: {}, events: sc.events ?? [], routeChoice: sc.routeChoice, place: sc.place };
    const plan = planCase(bp, reg, state);
    const text = planText(sc, plan, bp);
    const f: string[] = [];
    const x = sc.expect;
    const lv = (id: string) => plan.levels.find((l) => l.id === id);
    const v = validatePlan(plan, reg, state);
    if (!v.ok) f.push(`validator: ${v.violations.map((y) => y.code).join(", ")}`);
    if (x.route && plan.route.status !== x.route) f.push(`route ${plan.route.status} ≠ ${x.route}`);
    if (x.procedure && plan.route.procedureId !== x.procedure) f.push(`procedure ${plan.route.procedureId} ≠ ${x.procedure}`);
    for (const [id, s] of Object.entries(x.levels ?? {})) if (lv(id)?.state !== s) f.push(`level ${id}: ${lv(id)?.state ?? "missing"} ≠ ${s}`);
    if (x.levelIds && plan.levels.map((l) => l.id).join() !== x.levelIds.join()) f.push(`levels ${plan.levels.map((l) => l.id).join()} ≠ ${x.levelIds.join()}`);
    // The effective amount the person is shown: 0 only when an exemption certainly applies.
    const fees = plan.levels.flatMap((l) => l.fees).filter((y) => !y.optional).map((y) => [y.id, y.exemption?.outcome === "applies" ? 0 : y.amountPln]);
    if (x.fees && JSON.stringify(fees) !== JSON.stringify(x.fees)) f.push(`fees ${JSON.stringify(fees)} ≠ ${JSON.stringify(x.fees)}`);
    if (x.noFees && fees.length) f.push(`fees present: ${JSON.stringify(fees)}`);
    const dls = plan.levels.flatMap((l) => l.deadlines);
    if (x.deadlineIds && dls.map((d) => d.id).sort().join() !== [...x.deadlineIds].sort().join()) f.push(`deadlines ${dls.map((d) => d.id).join()} ≠ ${x.deadlineIds.join()}`);
    for (const [id, latest] of Object.entries(x.deadlines ?? {})) {
      const d = dls.find((y) => y.id === id);
      if (d?.due?.latest !== latest) f.push(`deadline ${id}: ${d?.due?.latest ?? "no date"} ≠ ${latest}`);
    }
    for (const [id, ns] of Object.entries(x.notes ?? {})) for (const n of ns) if (!lv(id)?.notes.some((y) => y.id === n)) f.push(`note ${n} not on ${id}`);
    for (const [id, os] of Object.entries(x.offices ?? {})) for (const o of os) if (!lv(id)?.office?.offices.some((y) => y.id === o)) f.push(`office ${o} not on ${id}`);
    for (const [id, n] of Object.entries(x.officeCount ?? {})) if (lv(id)?.office?.offices.length !== n) f.push(`offices on ${id}: ${lv(id)?.office?.offices.length} ≠ ${n}`);
    for (const [id, ts] of Object.entries(x.tasks ?? {})) for (const t of ts) if (!lv(id)?.tasks.some((y) => y.id.endsWith(`:${t}`))) f.push(`task ${t} not on ${id}`);
    for (const [id, s] of Object.entries(x.reasonIncludes ?? {})) if (!lv(id)?.reason?.text.pl.includes(s)) f.push(`reason on ${id} lacks "${s}"`);
    if (x.unsure && plan.unsure.map((u) => u.fact).join() !== x.unsure.join()) f.push(`unsure ${plan.unsure.map((u) => u.fact).join()} ≠ ${x.unsure.join()}`);
    for (const w of x.forbidden ?? []) if (text.includes(w)) f.push(`forbidden "${w}" in the plan`);
    return { id: sc.id, ok: f.length === 0, failures: f, plan, text };
  });
}

export interface IntakeRow { id: string; text: string; candidates: FactCandidate[]; correct: string[]; wrong: string[]; extra: string[]; missed: string[] }
/**
 * The intake baseline against the facts a person would confirm in each scenario. A wrong value is the
 * failure that matters (the person might confirm it in a hurry); a missed fact is only asked as usual.
 * "Extra" is a fact the scenario doesn't record, judged by a person.
 */
export function runIntake(file = `${ROOT}packages/case-engine/eval/scenarios.yaml`) {
  const scenarios = parse(readFileSync(file, "utf8")) as Scenario[];
  const rows: IntakeRow[] = scenarios.map((sc) => {
    const r = intake(loadBlueprint(`${ROOT}blueprints/${sc.blueprint}.yaml`), reg, sc.text);
    const facts = sc.facts ?? {};
    const row: IntakeRow = { id: sc.id, text: sc.text, candidates: r.candidates, correct: [], wrong: [], extra: [], missed: [] };
    for (const c of r.candidates) {
      const want = facts[c.fact];
      (want === undefined ? row.extra : want === c.value ? row.correct : row.wrong).push(`${c.fact}=${c.value}`);
    }
    for (const [f, v] of Object.entries(facts)) if (v !== UNKNOWN && !r.candidates.some((c) => c.fact === f)) row.missed.push(f);
    return row;
  });
  const sum = (k: "correct" | "wrong" | "extra" | "missed") => rows.reduce((n, x) => n + x[k].length, 0);
  return { rows, correct: sum("correct"), wrong: sum("wrong"), extra: sum("extra"), missed: sum("missed") };
}

/** The reference plan in plain Polish, with the source of every value (for blind scoring). */
function planText(sc: Scenario, p: CasePlan, bp: Blueprint): string {
  const host = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
  const src = (q?: { page: string }[]) => (q?.length ? ` [${host(q[0].page)}]` : "");
  const out = [`# ${sc.id}`, "", `Sytuacja (szkic, do przepisania przez native writers): „${sc.text}”`, "", `Rejestr: ${reg.version}. Droga: ${p.route.status}${p.route.procedureId ? ` (${reg.procedures.get(p.route.procedureId)?.title.pl})` : ""}.`];
  if (p.route.status === "choice") out.push("Pasuje więcej niż jedna droga; wybór należy do osoby: " + p.route.candidates.filter((c) => c.outcome !== "does_not_apply" && c.outcome !== "unknown").map((c) => `${c.title.pl}${c.outcome === "reachable" ? " (po spełnieniu warunku)" : ""}`).join("; ") + ".");
  for (const l of p.levels) {
    out.push("", `## ${l.title.pl} (${l.state})${l.reason ? ` — ${l.reason.text.pl}` : ""}`);
    for (const t of l.tasks) out.push(`- ${t.title.pl}${t.outcome === "unknown" ? " (jeśli dotyczy)" : ""}${src(t.quotes)}`);
    for (const f of l.fees) out.push(`- Opłata: ${f.purpose.pl}: ${f.exemption?.outcome === "applies" ? "zwolnienie" : `${f.amountPln} zł`}${f.optional ? " (opcjonalnie)" : ""}${src(f.quotes)}`);
    const UNIT: Record<string, string> = { day: "dni", working_day: "dni roboczych", month: "mies.", year: "lat" };
    for (const d of l.deadlines) out.push(`- Termin${d.role === "office" ? " urzędu" : ""}: ${d.amount} ${UNIT[d.unit] ?? d.unit} od „${bp.events[d.from]?.label.pl ?? d.from}”${d.due ? `, ${dueRangePl(d.due.earliest, d.due.latest, d.due.counting)}` : ""}${d.outcome === "unknown" ? " (jeśli dotyczy)" : ""}${src(d.quotes)}`);
    for (const o of l.office?.offices.slice(0, 3) ?? []) out.push(`- Urząd: ${o.name.pl}${o.address ? `, ${o.address.value}` : ""}`);
    for (const n of l.notes.filter((y) => y.important)) out.push(`- Uwaga: ${n.statement.value.pl.split("\n")[0]}${src(n.statement.quotes)}`);
  }
  return out.join("\n") + "\n";
}

if (process.argv.includes("--write")) {
  const results = runScenarios();
  const dir = `${ROOT}packages/case-engine/eval`;
  mkdirSync(`${dir}/reference-plans`, { recursive: true });
  for (const r of results) writeFileSync(`${dir}/reference-plans/${r.id}.md`, r.text);
  const pass = results.filter((r) => r.ok).length;
  const it = runIntake();
  writeFileSync(`${dir}/REPORT.md`, [
    `# Evaluation report`, "", `Registry ${reg.version}. ${pass}/${results.length} scenarios pass. Generated by \`node eval/run.ts --write\`.`, "",
    "| Scenario | Result | Route | Failures |", "|---|---|---|---|",
    ...results.map((r) => `| ${r.id} | ${r.ok ? "pass" : "FAIL"} | ${r.plan.route.status}${r.plan.route.procedureId ? ` ${r.plan.route.procedureId}` : ""} | ${r.failures.join("; ")} |`),
    "", "Reference plans for blind scoring: `reference-plans/`. Each must be reviewed by a person before the H1 benchmark.", "",
    "## Intake (free text → fact candidates)", "",
    `Extractor \`baseline-pl-1\` (Polish phrases, no AI). Correct ${it.correct}, wrong ${it.wrong}, extra ${it.extra}, missed ${it.missed} (asked as usual).`,
    `Recall ${Math.round((100 * it.correct) / (it.correct + it.wrong + it.missed))}%. Precision on the recorded facts ${it.correct + it.wrong ? Math.round((100 * it.correct) / (it.correct + it.wrong)) : 100}%.`, "",
    "| Scenario | Proposed (confirmed by the person before use) | Wrong | Missed |", "|---|---|---|---|",
    ...it.rows.map((r) => `| ${r.id} | ${[...r.correct, ...r.extra.map((e) => `${e} (extra)`)].join(", ") || "—"} | ${r.wrong.join(", ")} | ${r.missed.join(", ")} |`),
    "",
  ].join("\n"));
  console.log(`${pass}/${results.length} pass`);
  for (const r of results.filter((y) => !y.ok)) console.log(r.id, r.failures);
}
