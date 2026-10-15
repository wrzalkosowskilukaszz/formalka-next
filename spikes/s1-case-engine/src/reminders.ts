// Reminders from confirmed dates only. Content-free by default (lock-screen privacy).
import { addDays } from "./planner.ts";
import type { Plan } from "./types.ts";

export interface Reminder { id: string; fireAt: string; text: string; basis: { deadline: string; ruleRef: string; from: string } }

export function reminders(caseId: string, plan: Plan, detailed = false): Reminder[] {
  const out: Reminder[] = [];
  for (const d of plan.deadlines) {
    if (!d.due || d.outcome !== "applies") continue; // unknown branch: no reminder for a date that may not apply
    const fireDay = addDays(d.due.earliest, -1); // the day before the earliest reading
    out.push({
      id: stableId(caseId, d.id, d.due.earliest),
      fireAt: `${fireDay}T09:00:00 Europe/Warsaw`,
      text: detailed ? `Termin: ${d.id} (${d.due.earliest})` : "Formalka: masz jutro jedno zadanie",
      basis: { deadline: d.id, ruleRef: d.ruleRef, from: d.from },
    });
  }
  return out;
}
const stableId = (...parts: string[]) => parts.join("|");
