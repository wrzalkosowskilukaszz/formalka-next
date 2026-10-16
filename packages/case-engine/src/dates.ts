// Calendar arithmetic for deadlines and reminders. Calendar days only (ISO yyyy-mm-dd, Europe/Warsaw
// civil dates); no time of day, so DST never shifts a date.
//
// Counting rules used here (see docs/formalka-next/16-LIVING-CASE-ENGINE.md §4):
// - "kpa": a period in days does not count the day of the event; a period in months ends on the day
//   with the same number, or the month's last day (years: the same, so 29 February ends on 28 February);
//   an end on a Saturday or a day off work moves to the next working day. KPA art. 57 §1, §3, §3a, §4,
//   quoted from Dz.U. 2025 poz. 1691 on 2026-10-16 (docs/formalka-next/verifications/DATES-2026-10-16.md).
// - "ppsa": a complaint to an administrative court. PPSA art. 83 §1 counts by the civil code (KC art. 111
//   §2: the event day doesn't count; art. 112: months as above) and §2 moves an end on a Saturday or a day
//   off to the next day: the same arithmetic as "kpa", on its own legal basis (verified 2026-10-16).
// - "plain": a deadline whose counting rule we haven't verified: the plain count from the day after the
//   event (the general rule in both codes), never moved later. One date, so a reminder is never late.
// - "nth-day": "najpóźniej w N dniu od X" (address registration): whether day X is day 1 is open
//   (06 §7 Q3), so both readings are returned.
// The days off follow art. 1 of the act on days off work, quoted from Dz.U. 2025 poz. 296 on 2026-10-16;
// 24 December since 1 February 2025 (Dz.U. 2024 poz. 1965). Not modelled: art. 1a (an epidemic day off).

export type Iso = string;
export type Unit = "day" | "working_day" | "month" | "year";
export type Counting = "kpa" | "ppsa" | "plain" | "nth-day";
export interface Due { earliest: Iso; latest: Iso; counting: Counting; shifted?: boolean }

function parts(iso: Iso): [number, number, number] {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`not an ISO date: ${iso}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}
const fmt = (t: Date) => t.toISOString().slice(0, 10);

export function addDays(iso: Iso, days: number): Iso {
  const [y, m, d] = parts(iso);
  return fmt(new Date(Date.UTC(y, m - 1, d + days)));
}

/** Months: the same day number, or the last day of the target month when it has no such day. */
export function addMonths(iso: Iso, months: number): Iso {
  const [y, m, d] = parts(iso);
  const first = new Date(Date.UTC(y, m - 1 + months, 1));
  const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  return fmt(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(d, last))));
}

export function weekday(iso: Iso): number {
  const [y, m, d] = parts(iso);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 Sunday … 6 Saturday
}

/** Easter Sunday (Gregorian; Meeus/Jones/Butcher). */
export function easter(year: number): Iso {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function polishHolidays(year: number): Set<Iso> {
  const e = easter(year);
  const fixed = ["01-01", "01-06", "05-01", "05-03", "08-15", "11-01", "11-11", "12-25", "12-26"];
  if (year >= 2025) fixed.push("12-24");
  return new Set([
    ...fixed.map((md) => `${year}-${md}`),
    e, addDays(e, 1), addDays(e, 49), addDays(e, 60), // Easter Monday, Pentecost, Corpus Christi
  ]);
}

export function isWorkingDay(iso: Iso): boolean {
  const wd = weekday(iso);
  return wd !== 0 && wd !== 6 && !polishHolidays(parts(iso)[0]).has(iso);
}

/** KPA art. 57 §4: an end on a Saturday or a public holiday moves to the next working day. */
export function nextWorkingDayIfClosed(iso: Iso): Iso {
  let d = iso;
  while (weekday(d) === 6 || weekday(d) === 0 || polishHolidays(parts(d)[0]).has(d)) d = addDays(d, 1);
  return d;
}

export function addWorkingDays(iso: Iso, n: number): Iso {
  let d = iso;
  for (let left = n; left > 0; ) {
    d = addDays(d, 1);
    if (isWorkingDay(d)) left--;
  }
  return d;
}

/**
 * The due date of a relative deadline from a confirmed event date. `earliest` is the safe date for
 * reminders; `latest` is the last day under the more generous reading. They differ when the
 * reading is open (nth-day) or when the end moves past a weekend or holiday (kpa, ppsa: the legal date
 * is then `latest`).
 */
export function dueDate(from: Iso, amount: number, unit: Unit, counting: Counting): Due {
  if (counting === "nth-day") {
    if (unit !== "day") throw new Error("nth-day counting applies to days only");
    return { earliest: addDays(from, amount - 1), latest: addDays(from, amount), counting };
  }
  const base =
    unit === "day" ? addDays(from, amount)
    : unit === "working_day" ? addWorkingDays(from, amount)
    : unit === "month" ? addMonths(from, amount)
    : addMonths(from, 12 * amount);
  if (counting === "plain") return { earliest: base, latest: base, counting };
  const latest = nextWorkingDayIfClosed(base);
  return { earliest: base, latest, counting, ...(latest !== base ? { shifted: true } : {}) };
}

export function daysBetween(a: Iso, b: Iso): number {
  const [y1, m1, d1] = parts(a), [y2, m2, d2] = parts(b);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}
