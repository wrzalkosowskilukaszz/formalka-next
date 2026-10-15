// The advisor's agenda: what Maciek does by himself, without being asked (owner, 2026-10-15: "doradca,
// który działa, a nie czeka"). Deterministic: computed from the active plan, the recorded events and
// the user's consent, then handed to the phone's own scheduler (Capacitor local notifications), so
// it works with the app closed and no server knows the case (ADR-N002).
//
// Rules: only an approved (active) plan acts; only dates from recorded events and registry rules;
// a deadline whose rule may not apply (unknown) never notifies; nothing between 20:00 and 08:00;
// at most one notification per case per day (the rest stay in the app's list), except what the
// user scheduled themselves; without consent everything stays in the app; the lock screen shows no
// topic unless the user turned that on; ids are stable, so rescheduling never duplicates.
import type { Blueprint } from "./blueprint.ts";
import { addDays, daysBetween, type Iso } from "./dates.ts";
import { dayPl, dueRangePl, msg } from "./messages.ts";
import type { CasePlan, CaseState, PlanLevel } from "./planner.ts";
import type { L10n } from "./registry.ts";

export type AgendaKind =
  | "deadline_warning" | "deadline_today" | "office_deadline_passed" | "visit_prep" | "visit_morning"
  | "follow_up" | "call_reminder" | "nudge" | "rule_change";
export interface AgendaItem {
  id: string; caseId: string; kind: AgendaKind;
  /** Local civil time in Europe/Warsaw, "YYYY-MM-DDTHH:MM". */
  fireAt: string;
  channel: "notification" | "in_app";
  lockScreen: string; message: L10n; basis: string[];
  answers?: { id: string; label: string }[];
}
export interface AdvisorPrefs {
  /** One consent per case, given when the plan is approved; revocable. */
  consent: boolean;
  lockScreenDetail: boolean;
  quiet: { from: string; to: string }; // e.g. 20:00 → 08:00
}
export const DEFAULT_PREFS: AdvisorPrefs = { consent: false, lockScreenDetail: false, quiet: { from: "20:00", to: "08:00" } };

const PRIORITY: Record<AgendaKind, number> = {
  deadline_today: 100, deadline_warning: 80, visit_morning: 70, call_reminder: 65, visit_prep: 60,
  follow_up: 50, rule_change: 45, office_deadline_passed: 40, nudge: 10,
};
/** Items the user asked for at a time they chose: never demoted by the one-a-day rule. */
const USER_TIMED: AgendaKind[] = ["call_reminder", "visit_morning", "visit_prep"];

export interface AgendaInput {
  caseId: string; bp: Blueprint; plan: CasePlan; state: CaseState; prefs: AdvisorPrefs;
  now: { date: Iso; time: string };
  /** Last day the user did anything in this case. */
  lastActivity?: Iso;
  /** Registry versions published since the plan was approved, for this case's procedures. */
  registryChanges?: { procedureTitle: string; publishedOn: Iso; ruleRef: string }[];
}

export function agenda(input: AgendaInput): AgendaItem[] {
  const { caseId, bp, plan, state, prefs, now } = input;
  if (plan.status !== "active") return [];
  const name = bp.caretaker.name;
  const items: Omit<AgendaItem, "channel" | "lockScreen">[] = [];
  const push = (kind: AgendaKind, date: Iso, time: string, text: string, basis: string[], key: string, answers?: AgendaItem["answers"]) =>
    items.push({ id: [caseId, kind, key, date].join("|"), caseId, kind, fireAt: `${date}T${time}`, message: { pl: text }, basis, ...(answers ? { answers } : {}) });

  const levels = plan.levels.filter((l) => l.order > 0);
  for (const l of levels) {
    for (const d of l.deadlines) {
      if (!d.due) continue;
      if (d.role === "office") {
        if (l.state === "waiting_office") push("office_deadline_passed", addDays(d.due.latest, 1), "09:00", msg.officeDeadlinePassed(d.description.pl), [d.ruleRef], d.id);
        continue;
      }
      if (d.outcome !== "applies" || l.state === "done") continue; // a deadline that may not apply never notifies
      const total = periodDays(d.amount, d.unit);
      const lead = total <= 7 ? 2 : total <= 30 ? 5 : total <= 90 ? 14 : 30;
      const warnOn = addDays(d.due.earliest, -lead);
      push("deadline_warning", warnOn, "09:00", msg.deadlineWarning(lead, l.title.pl, dueRangePl(d.due.earliest, d.due.latest), d.description.pl), [d.ruleRef], d.id);
      push("deadline_today", d.due.earliest, "09:00", msg.deadlineToday(l.title.pl, d.description.pl), [d.ruleRef], d.id);
    }
  }

  for (const e of state.events) {
    if (e.type !== "visit_planned" && e.type !== "call_planned") continue;
    const level = plan.levels.find((l) => l.id === e.level);
    if (!level || !e.time) continue;
    if (e.type === "call_planned") {
      push("call_reminder", e.date, e.time, msg.callReminder(level.title.pl), basisOf(level), `${level.id}@${e.time}`);
      continue;
    }
    const { bring, fees, basis } = visitPack(plan, level);
    push("visit_prep", addDays(e.date, -1), "18:00", msg.visitPrep(e.time, level.title.pl, bring, fees, officeLines(level, state)), basis, level.id);
    push("visit_morning", e.date, "08:00", msg.visitMorning(e.time, level.title.pl), basis, level.id);
    push("follow_up", e.date, plusHours(e.time, 3), msg.followUp(), basis, level.id, msg.followUpAnswers);
  }

  const next = levels.find((l) => l.state === "available" || l.state === "in_progress" || l.state === "returned");
  if (next && input.lastActivity && daysBetween(input.lastActivity, now.date) >= 7) {
    const week = Math.floor(daysBetween("2026-01-05", now.date) / 7); // one nudge per calendar week, at most
    const on = now.time < "10:00" ? now.date : addDays(now.date, 1); // the next 10:00
    push("nudge", on, "10:00", msg.nudge(bp.title.pl, next.title.pl), basisOf(next), `w${week}`);
  }
  for (const c of input.registryChanges ?? []) {
    push("rule_change", c.publishedOn, "09:00", msg.ruleChange(c.procedureTitle), [c.ruleRef], c.ruleRef);
  }

  // Quiet hours, the past, one notification a day, consent, lock screen.
  const out = items
    .map((it) => ({ ...it, fireAt: outOfQuiet(it.fireAt, prefs.quiet) }))
    .filter((it) => it.fireAt >= `${now.date}T${now.time}`)
    .sort((a, b) => (a.fireAt < b.fireAt ? -1 : a.fireAt > b.fireAt ? 1 : PRIORITY[b.kind] - PRIORITY[a.kind]));
  const notifiedOn = new Set<string>();
  const byPriority = [...out].sort((a, b) => PRIORITY[b.kind] - PRIORITY[a.kind]);
  const notify = new Set<string>();
  for (const it of byPriority) {
    const day = it.fireAt.slice(0, 10);
    if (!prefs.consent) continue;
    if (USER_TIMED.includes(it.kind) || it.kind === "deadline_today" || !notifiedOn.has(day)) {
      notify.add(it.id);
      notifiedOn.add(day);
    }
  }
  return out.map((it) => ({
    ...it,
    channel: notify.has(it.id) ? "notification" : "in_app",
    lockScreen: prefs.lockScreenDetail ? msg.lockDetailed(name, bp.title.pl, shortOf(it.kind)) : msg.lockGeneric(name),
  }));
}

function periodDays(amount: number, unit: string): number {
  return unit === "month" ? amount * 30 : unit === "year" ? amount * 365 : amount;
}

function basisOf(l: PlanLevel): string[] {
  return [l.stepRef, ...l.tasks.map((t) => t.ruleRef)].filter((x): x is string => !!x);
}

/** What to bring to a visit: the documents still in the plan, and the fees, each with its source. */
function visitPack(plan: CasePlan, level: PlanLevel) {
  const docs = plan.levels.flatMap((l) => l.tasks).filter((t) => t.kind === "document" && t.status !== "not_needed");
  const fees = plan.levels.flatMap((l) => l.fees).filter((f) => !f.optional && f.outcome === "applies");
  return {
    bring: docs.map((t) => (t.outcome === "unknown" ? `${t.title.pl} (sprawdź, czy Cię dotyczy)` : t.title.pl)),
    fees: fees.map((f) => (f.exemption?.outcome === "applies" ? `${f.purpose.pl}: zwolnienie (szczegóły w planie)` : `${f.purpose.pl}: ${f.amountPln} zł`)),
    basis: [...basisOf(level), ...docs.map((t) => t.ruleRef), ...fees.map((f) => f.ruleRef)],
  };
}

/** The office part of a visit message: only what the registry holds, with its links. */
function officeLines(level: PlanLevel, state: CaseState): string[] {
  const o = level.office;
  if (!o || o.needsPlace) return [];
  if (o.noneForPlace) return [msg.officeUnknown()];
  const lines: string[] = [];
  if (o.offices.length === 1) {
    const x = o.offices[0];
    lines.push(x.address ? msg.officeOne(x.name.pl, x.address.value, x.openingHours?.value)
      : x.website ? msg.officeWebsite(x.name.pl, x.website) : `Urząd: ${x.name.pl}.`);
  } else {
    lines.push(msg.officeMany(o.offices.length, state.place?.name ?? ""));
  }
  const bookings = [...new Set(o.offices.map((x) => x.booking).filter((u): u is string => !!u))];
  if (bookings.length === 1) lines.push(msg.booking(bookings[0]));
  return lines;
}

function plusHours(time: string, h: number): string {
  const [hh, mm] = time.split(":").map(Number);
  const t = Math.min(hh + h, 23);
  return `${String(t).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/** Moves a time inside the quiet window to its end (08:00 the same or next morning). */
export function outOfQuiet(fireAt: string, quiet: { from: string; to: string }): string {
  const date = fireAt.slice(0, 10), time = fireAt.slice(11, 16);
  if (time >= quiet.from) return `${addDays(date, 1)}T${quiet.to}`;
  if (time < quiet.to) return `${date}T${quiet.to}`;
  return fireAt;
}

function shortOf(kind: AgendaKind): string {
  return {
    deadline_warning: "zbliża się termin", deadline_today: "dziś mija termin", office_deadline_passed: "minął czas urzędu",
    visit_prep: "jutro wizyta", visit_morning: "dziś wizyta", follow_up: "jak poszło?", call_reminder: "pora zadzwonić",
    nudge: "następny krok", rule_change: "zmiana w źródłach",
  }[kind];
}

export { dayPl };
