// Case blueprints: how a verified procedure (or a choice between procedures) becomes a map of levels.
// A blueprint adds no facts. It only places the registry's own steps, documents, fees and deadlines
// on levels, names the levels, declares which events the user can record, and links related cases.
// The static check below proves that nothing of a procedure is lost or invented on the way.
import type { Counting } from "./dates.ts";
import type { L10n, Registry } from "./registry.ts";

export interface LevelDef {
  id: string;
  title: L10n;
  /**
   * Per route procedure: the step this level stands for, or alternative steps of which the
   * procedure's own conditions pick one (e.g. online in MOS or on paper). A level without steps
   * holds documents or deadlines only.
   */
  steps?: Record<string, string | string[]>;
  /** This level collects the route procedure's documents as its tasks. */
  documents?: boolean;
  /** This level shows the route procedure's fees. */
  fees?: boolean;
  /** The office decides; the user can't finish this level by effort. */
  waiting?: boolean;
  /** Submitting the application happens here: every route condition must hold by then. */
  submits?: boolean;
  /** Marking the level done records this event, with its date. */
  completesWith?: string;
  /** The level exists only after this event (and outcome) is recorded. */
  when?: { event: string; outcome?: string };
  /**
   * The level is reachable only with this outcome (a card only after a positive decision): locked until
   * the event is recorded with it, and gone when the event comes with another outcome (audit F2).
   */
  requires?: { event: string; outcome: string };
  /** Other cases this level can open, e.g. the language exam for the language proof. */
  crossCase?: { document: string; procedure: string; blueprint?: string; label: L10n }[];
  /** Editorial short titles for tasks (owner-checked wording; the official name stays visible). */
  taskTitles?: Record<string, L10n>;
}
export interface DeadlinePlacement {
  level: string;
  counting: Counting;
  /** "user": something the user must do by then. "office": what the office has (no "you must"). */
  role: "user" | "office";
  /** Recording this deadline's start event sends the level back ("returned"). */
  returns?: boolean;
  /**
   * The start event, when the registry's rule names a wrong one. Allowed only with `fromBasis`: words
   * that appear verbatim in the rule's own quote (checkBlueprint proves it), e.g. "od otrzymania decyzji
   * Ministra" for a court complaint the registry starts from the first decision (audit F2, 2026-10-16).
   */
  from?: string;
  fromBasis?: string;
}
/** Something that happens in the case, recorded by the person. A decision names its instance (1, 2). */
export interface EventDef { label: L10n; outcomes?: string[]; instance?: number }
export interface Blueprint {
  id: string;
  title: L10n;
  /** The case's assistant: its name, and whether words about it are feminine ("asystentka AI"). */
  caretaker: { name: string; feminine?: boolean };
  /** Alternative procedures; their own applicability rules decide which apply. */
  routes: string[];
  routeLevel: { id: string; title: L10n };
  levels: LevelDef[];
  /**
   * Route conditions a person can still meet through another case, e.g. the language proof for
   * recognition through the language-certificate case. Such a route is "reachable", never "applies".
   */
  fulfillable?: Record<string, Record<string, { blueprint: string; title: L10n; label: L10n }>>;
  deadlines: Record<string, DeadlinePlacement>;
  events: Record<string, EventDef>;
  /**
   * A document whose registry condition covers more people than need it (the EU family member's card for
   * everyone in the EU group): the facts can't tell, so it shows as "check if it applies" with `label`.
   * `basis` must appear verbatim in the document's own quote (audit F4, 2026-10-16).
   */
  onlyIf?: Record<string, { label: L10n; basis: string }>;
  /**
   * A step order the procedure's own text relaxes ("nadal możesz złożyć formularz meldunkowy" without the
   * owner's confirmation): `level` doesn't wait for `on`. `basis` must appear verbatim in one of the
   * procedure's quotes (audit F4).
   */
  optionalAfter?: { level: string; on: string; basis: string }[];
  /** Where a procedure's warnings appear (pitfall id -> level id); the rest go on the route level. */
  notes?: Record<string, string>;
  /** Cases to offer when this one doesn't fit, e.g. address registration instead of a PESEL application. */
  related?: { blueprint: string; label: L10n }[];
}

export function blueprintFromData(data: unknown, where = "blueprint"): Blueprint {
  const bp = data as Blueprint;
  if (!bp?.id || !Array.isArray(bp.routes) || !Array.isArray(bp.levels)) throw new Error(`${where}: not a blueprint`);
  bp.deadlines ??= {};
  bp.events ??= {};
  return bp;
}

export interface BlueprintIssue { code: string; detail: string }

/**
 * Static check of a blueprint against the registry. Every step, document, fee and deadline of every
 * route must land on exactly one level; every reference must exist; every event a deadline starts
 * from must be recordable. An empty list means the map loses and invents nothing.
 */
export function checkBlueprint(bp: Blueprint, reg: Registry): BlueprintIssue[] {
  const issues: BlueprintIssue[] = [];
  const add = (code: string, detail: string) => issues.push({ code, detail });
  const levelIds = new Set(bp.levels.map((l) => l.id));
  if (levelIds.has(bp.routeLevel.id)) add("DUPLICATE_LEVEL", bp.routeLevel.id);
  for (const routeId of bp.routes) {
    const p = reg.procedures.get(routeId);
    if (!p) { add("UNKNOWN_PROCEDURE", routeId); continue; }
    const stepUse = new Map<string, number>();
    for (const l of bp.levels) {
      for (const stepId of stepsOf(l, routeId)) {
        if (!p.steps.some((s) => s.id === stepId)) add("UNKNOWN_STEP", `${routeId}:${stepId} (level ${l.id})`);
        stepUse.set(stepId, (stepUse.get(stepId) ?? 0) + 1);
      }
    }
    for (const s of p.steps) {
      const n = stepUse.get(s.id) ?? 0;
      if (n !== 1) add(n ? "STEP_ON_SEVERAL_LEVELS" : "STEP_NOT_PLACED", `${routeId}:${s.id}`);
    }
    const holds = (l: LevelDef) => !l.steps || stepsOf(l, routeId).length > 0;
    const docLevels = bp.levels.filter((l) => l.documents && holds(l));
    if (p.documents.length && docLevels.length !== 1) add("DOCUMENTS_NOT_PLACED_ONCE", `${routeId}: ${docLevels.length} levels`);
    const feeLevels = bp.levels.filter((l) => l.fees && holds(l));
    if (p.fees.length && feeLevels.length !== 1) add("FEES_NOT_PLACED_ONCE", `${routeId}: ${feeLevels.length} levels`);
    for (const d of p.deadlines) {
      const place = bp.deadlines[d.id];
      if (!place) { add("DEADLINE_NOT_PLACED", `${routeId}:${d.id}`); continue; }
      if (!levelIds.has(place.level)) add("UNKNOWN_LEVEL", `deadline ${d.id} -> ${place.level}`);
      const r = d.rule.value;
      if (place.from !== undefined) {
        const basis = place.fromBasis ?? "";
        if (!basis || !d.rule.quotes.some((q) => q.text.includes(basis))) add("FROM_WITHOUT_BASIS", `${routeId}:${d.id}`);
      }
      if (r.kind === "relative") {
        const from = place.from ?? r.from;
        if (!bp.events[from]) add("EVENT_NOT_RECORDABLE", `${routeId}:${d.id} starts from "${from}"`);
        if (place.counting === "nth-day" && r.unit !== "day") add("BAD_COUNTING", `${routeId}:${d.id}`);
      }
    }
  }
  // Corrections to the registry's mapping need words from its own quotes.
  for (const routeId of bp.routes) {
    const p = reg.procedures.get(routeId);
    if (!p) continue;
    const allQuotes = [...p.steps.flatMap((x) => x.quotes), ...p.documents.flatMap((x) => x.namePl.quotes),
      ...(p.pitfalls ?? []).flatMap((x) => x.statement.quotes)].map((q) => q.text);
    for (const [docId, o] of Object.entries(bp.onlyIf ?? {})) {
      const d = p.documents.find((x) => x.id === docId);
      if (d && !(o.basis && d.namePl.quotes.some((q) => q.text.includes(o.basis)))) add("ONLY_IF_WITHOUT_BASIS", `${routeId}:${docId}`);
    }
    for (const o of bp.optionalAfter ?? []) {
      if (!o.basis || !allQuotes.some((t) => t.includes(o.basis))) add("OPTIONAL_WITHOUT_BASIS", `${routeId}:${o.level}<-${o.on}`);
    }
  }
  // Every translated text has only language keys: an unquoted comma in YAML flow style silently cuts
  // a title and adds a stray key ("{ pl: A, B }" -> pl: "A", "B": null).
  const texts: unknown[] = [bp.title, bp.routeLevel.title, ...bp.levels.flatMap((l) => [l.title, ...Object.values(l.taskTitles ?? {}), ...(l.crossCase ?? []).map((x) => x.label)]),
    ...Object.values(bp.events).map((e) => e.label), ...(bp.related ?? []).map((r) => r.label), ...Object.values(bp.fulfillable ?? {}).flatMap((c) => Object.values(c).flatMap((x) => [x.title, x.label]))];
  for (const t of texts) {
    const keys = t && typeof t === "object" ? Object.keys(t) : [];
    if (!keys.includes("pl") || keys.some((k) => !["pl", "en", "uk", "ru"].includes(k))) add("BAD_TEXT", JSON.stringify(t));
  }
  for (const [pitfallId, levelId] of Object.entries(bp.notes ?? {})) {
    if (!levelIds.has(levelId) && levelId !== bp.routeLevel.id) add("UNKNOWN_LEVEL", `note ${pitfallId} -> ${levelId}`);
    if (!bp.routes.some((r) => reg.procedures.get(r)?.pitfalls?.some((x) => x.id === pitfallId))) add("UNKNOWN_PITFALL", pitfallId);
  }
  for (const [routeId, conds] of Object.entries(bp.fulfillable ?? {})) {
    const p = reg.procedures.get(routeId);
    if (!bp.routes.includes(routeId) || !p) { add("UNKNOWN_PROCEDURE", `fulfillable ${routeId}`); continue; }
    for (const condId of Object.keys(conds)) {
      if (!p.applicability.conditions?.some((c) => c.id === condId)) add("UNKNOWN_CONDITION", `${routeId}:${condId}`);
    }
  }
  for (const l of bp.levels) {
    if (l.when && !bp.events[l.when.event]) add("EVENT_NOT_RECORDABLE", `level ${l.id} when ${l.when.event}`);
    if (l.requires && !bp.events[l.requires.event]?.outcomes?.includes(l.requires.outcome)) add("EVENT_NOT_RECORDABLE", `level ${l.id} requires ${l.requires.event}=${l.requires.outcome}`);
    if (l.completesWith && !bp.events[l.completesWith]) add("EVENT_NOT_RECORDABLE", `level ${l.id} completes with ${l.completesWith}`);
    for (const x of l.crossCase ?? []) {
      if (!reg.procedures.has(x.procedure)) add("UNKNOWN_PROCEDURE", `cross-case ${x.procedure}`);
      if (!bp.routes.some((r) => reg.procedures.get(r)?.documents.some((d) => d.id === x.document))) {
        add("UNKNOWN_DOCUMENT", `cross-case document ${x.document}`);
      }
    }
    if (!l.steps || Object.keys(l.steps).length === 0) {
      const holds = l.documents || l.fees || Object.values(bp.deadlines).some((d) => d.level === l.id);
      if (!holds) add("EMPTY_LEVEL", l.id);
    }
  }
  return issues;
}

/** The step ids a level stands for on a route (one, several alternatives, or none). */
export function stepsOf(l: LevelDef, routeId: string): string[] {
  const s = l.steps?.[routeId];
  return s === undefined ? [] : Array.isArray(s) ? s : [s];
}
