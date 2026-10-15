// Replanning diff by stable task id. Never deletes done work; proposals need the user's approval.
import type { Plan } from "./types.ts";

export type TaskStatus = "blocked" | "ready" | "in_progress" | "waiting_external" | "done" | "not_needed" | "cancelled";
export interface Diff {
  added: string[];
  notNeeded: { id: string; reason: string }[];
  keptAsHistory: string[];
  mayNoLongerBeNeeded: string[];
  changed: { id: string; field: string; from: unknown; to: unknown }[];
  documents: { added: string[]; removed: string[] };
}

export function diff(active: Plan, candidate: Plan, status: Record<string, TaskStatus>, reason: string): Diff {
  const a = new Map(active.tasks.map((t) => [t.id, t]));
  const c = new Map(candidate.tasks.map((t) => [t.id, t]));
  const d: Diff = { added: [], notNeeded: [], keptAsHistory: [], mayNoLongerBeNeeded: [], changed: [], documents: { added: [], removed: [] } };
  for (const id of c.keys()) if (!a.has(id)) d.added.push(id);
  for (const [id, t] of a) {
    const next = c.get(id);
    const st = status[id] ?? "ready";
    if (!next) {
      if (st === "done") d.keptAsHistory.push(id);
      else if (st === "in_progress" || st === "waiting_external") d.mayNoLongerBeNeeded.push(id);
      else d.notNeeded.push({ id, reason });
      continue;
    }
    if (t.officeRef !== next.officeRef) d.changed.push({ id, field: "office", from: t.officeRef, to: next.officeRef });
  }
  const ad = new Set(active.documents.map((x) => x.id));
  const cd = new Set(candidate.documents.map((x) => x.id));
  d.documents.added = [...cd].filter((x) => !ad.has(x));
  d.documents.removed = [...ad].filter((x) => !cd.has(x));
  return d;
}

/** Applying an approved diff to task states: done stays done, ever. */
export function applyApproved(status: Record<string, TaskStatus>, d: Diff): Record<string, TaskStatus> {
  const next = { ...status };
  for (const { id } of d.notNeeded) if (next[id] !== "done") next[id] = "not_needed";
  return next;
}
