// The advisor's words, in Polish, filled from the plan. Templates, not a model: no cost, no
// hallucination, and every sentence can be reviewed once. Rules (brief 15 §3.7, product rule 10):
// never claim a booking, sending or filing that did not happen; never "wszystko już wiem"; neutral
// grammatical gender towards the person (no "złożyłeś/złożyłaś"); no topic on the lock screen unless
// the user wants it.
import { weekday, type Iso } from "./dates.ts";

const MONTHS = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
const DAYS = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
/** The weekday after "do" ("do środy, 18 listopada"); the month is already in the genitive. */
const DAYS_GEN = ["niedzieli", "poniedziałku", "wtorku", "środy", "czwartku", "piątku", "soboty"];

export function dayPl(iso: Iso, withWeekday = true): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${withWeekday ? `${DAYS[weekday(iso)]}, ` : ""}${d} ${MONTHS[m - 1]}`;
}

/** "środy, 18 listopada": a date after "do". */
export function dayPlGen(iso: Iso): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${DAYS_GEN[weekday(iso)]}, ${d} ${MONTHS[m - 1]}`;
}

export function dueRangePl(earliest: Iso, latest: Iso): string {
  return earliest === latest
    ? `do ${dayPlGen(earliest)}`
    : `do ${dayPlGen(earliest)} (najpóźniej do ${dayPlGen(latest)}, zależnie od tego, jak liczyć dni)`;
}

/**
 * The case's assistant as the person sees it: one model, with its own name in each case. The words
 * about the assistant agree with it ("asystentka AI", "sama"); the words to the person stay neutral.
 */
export interface Persona { name: string; feminine?: boolean }
const asPersona = (p: Persona | string): Persona => (typeof p === "string" ? { name: p } : p);
export const rolePl = (p: Persona | string) => (asPersona(p).feminine ? "asystentka AI" : "asystent AI");
export const selfPl = (p: Persona | string) => (asPersona(p).feminine ? "sama" : "sam");

export const PHRASES_NEVER = [
  "umówiłem", "umówiłam", "umówiłe", "zarezerwowałem", "zarezerwowałam", "wysłałem", "wysłałam",
  "złożyłem", "złożyłam", "wszystko już wiem", "wizyta jest umówiona", "masz umówioną wizytę",
  "wizyta zarezerwowana", "jestem prawnikiem", "jestem urzędnikiem",
];

export const msg = {
  intro: (who: Persona | string, caseTitle: string) =>
    `Dzień dobry, jestem ${asPersona(who).name}, ${rolePl(who)} Formalki. Pomogę Ci poprowadzić sprawę: ${caseTitle}. Korzystam tylko z oficjalnych źródeł i przy każdej informacji pokażę, skąd ją mam.`,
  planReady: (unsureCount: number) =>
    unsureCount === 0
      ? "Mam wystarczająco dużo informacji, żeby przygotować pierwszy plan. Sprawdź założenia, zanim zaczniemy."
      : `Mam wystarczająco dużo informacji, żeby przygotować pierwszy plan. ${unsureCount === 1 ? "Jedna kwestia wymaga" : `${unsureCount} kwestie wymagają`} jeszcze potwierdzenia. Są zaznaczone na mapie.`,
  deadlineWarning: (days: number, levelTitle: string, range: string, description: string) =>
    `Zostało ${days} ${days === 1 ? "dzień" : "dni"} na krok „${levelTitle}”: termin ${range}. ${description}`,
  deadlineToday: (levelTitle: string, description: string) =>
    `Dziś mija bezpieczny termin na krok „${levelTitle}”. ${description}`,
  officeDeadlinePassed: (description: string) =>
    `Minął czas, jaki według przepisów ma urząd: ${description} Jeśli nie masz jeszcze odpowiedzi, możesz zapytać w urzędzie, na jakim etapie jest sprawa.`,
  visitPrep: (time: string, levelTitle: string, bring: string[], fees: string[], office: string[] = []) =>
    [`Jutro o ${time}: ${levelTitle}. Weź ze sobą:`, ...bring.map((b) => `• ${b}`),
      ...(fees.length ? ["Opłaty:", ...fees.map((f) => `• ${f}`)] : []),
      ...office,
      "Każda pozycja ma w planie swoje źródło."].join("\n"),
  officeOne: (name: string, address: string, hours?: string) =>
    `Urząd: ${name}, ${address}${hours ? `. Godziny: ${hours}` : ""}.`,
  officeMany: (n: number, place: string) => `Urzędy dla miejscowości ${place}: ${n}. Adresy i godziny są w planie.`,
  officeWebsite: (name: string, url: string) => `Urząd: ${name}. Adres i godziny przyjęć sprawdź na jego stronie: ${url}`,
  booking: (url: string) => `Rezerwacja wizyty: ${url}`,
  officeUnknown: () => "Nie mamy w naszych źródłach adresu urzędu dla Twojej miejscowości. Sprawdź go na stronie urzędu.",
  visitMorning: (time: string, levelTitle: string) =>
    `Dziś o ${time}: ${levelTitle}. Lista rzeczy do zabrania jest w planie. Powodzenia.`,
  followUp: () => "Jak poszło w urzędzie? Daj znać, a zaktualizuję plan.",
  followUpAnswers: [
    { id: "filed", label: "Wniosek złożony" },
    { id: "missing", label: "Czegoś brakowało" },
    { id: "not_went", label: "Nie udało się" },
  ],
  callReminder: (levelTitle: string) =>
    `Pora zadzwonić do urzędu w sprawie kroku „${levelTitle}”. Numeru telefonu urzędu nie mamy w naszych źródłach; znajdziesz go na stronie urzędu. Adres i godziny pracy, jeśli je mamy, są w karcie urzędu.`,
  nudge: (caseTitle: string, next: string) =>
    `Dawno nic się nie działo w sprawie „${caseTitle}”. Następny krok: ${next}. Zajrzysz?`,
  ruleChange: (procedureTitle: string) =>
    `Zmieniły się oficjalne informacje, na których opiera się Twój plan (${procedureTitle}). Sprawdźmy razem, co to zmienia.`,
  reminderAdded: (date: Iso, time: string, what: "call" | "visit") =>
    what === "call"
      ? `Przypomnienie dodane: ${dayPl(date)}, ${time}, żeby zadzwonić do urzędu. Wizyta nie jest jeszcze zarezerwowana.`
      : `Przypomnienie dodane: ${dayPl(date)}, ${time}. To przypomnienie o wizycie, którą masz umówioną w urzędzie.`,
  cannotBook: () =>
    "Nie mogę zarezerwować wizyty za Ciebie. Mogę dodać przypomnienie, żeby zadzwonić do urzędu. Dodać?",
  lockGeneric: (name: string) => `${name}: mam dla Ciebie przypomnienie`,
  lockDetailed: (name: string, caseTitle: string, short: string) => `${name} · ${caseTitle}: ${short}`,
};
