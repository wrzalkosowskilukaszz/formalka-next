// Whose case it is (owner, 2026-10-16): the app speaks to the person ("Czy masz…"). When they handle a
// case for someone else, it uses the registry's own wording ("Czy ta osoba ma…").
// The registry stays the source of meaning:
// - only the grammatical person changes;
// - every condition, number and option stays;
// - nothing needs the person's gender ("miałeś/miałaś" is avoided);
// - quotes from official sources are never reworded.
// Texts that say nothing about the person keep the registry's wording (no entry below).
// Polish only; other languages keep the registry's wording. Owner review: pending.
import type { FactDef } from "./registry.ts";

export type Voice = "you" | "other";
interface YouText { question?: string; whyWeAsk?: string; unknownHelp?: string; options?: Record<string, string> }

export const YOU: Record<string, YouText> = {
  "certyfikat.purpose": {
    question: "Do czego potrzebujesz certyfikatu?",
  },
  "certyfikat.school_in_polish": {
    question: "Czy masz świadectwo ukończenia szkoły w Polsce albo szkoły za granicą z polskim językiem wykładowym (szkoły, nie uczelni ani szkoły policealnej)?",
  },
  "citizenship.ever_polish": {
    question: "Czy kiedykolwiek przysługiwało Ci obywatelstwo polskie?",
    whyWeAsk: "Prezydent nadaje obywatelstwo cudzoziemcom, czyli osobom bez obywatelstwa polskiego. Wniosek pyta też o obywatelstwo polskie w przeszłości. Jeśli masz już obywatelstwo polskie, możesz zamiast tego poprosić wojewodę o jego potwierdzenie.",
    unknownHelp: "Pokażemy wszystko, co może Cię dotyczyć, także to, że można poprosić wojewodę o potwierdzenie, czy masz obywatelstwo polskie.",
    options: { lost: "Tak, ale je utracono", yes: "Tak, mam je teraz" },
  },
  "citizenship.group": {
    question: "Która sytuacja najlepiej Cię opisuje?",
    options: {
      three_years: "Mieszkasz w Polsce na tym tytule nieprzerwanie od co najmniej 3 lat i masz tu stabilne i regularne źródło dochodu oraz tytuł prawny do mieszkania",
      married_or_stateless: "Mieszkasz w Polsce na tym tytule nieprzerwanie od co najmniej 2 lat i od co najmniej 3 lat jesteś w małżeństwie z obywatelem polskim albo nie masz żadnego obywatelstwa",
      refugee: "Mieszkasz w Polsce nieprzerwanie od co najmniej 2 lat na pobycie stałym uzyskanym w związku ze statusem uchodźcy nadanym w Polsce",
      polish_origin: "Mieszkasz w Polsce nieprzerwanie od co najmniej roku na pobycie stałym uzyskanym w związku z polskim pochodzeniem albo Kartą Polaka",
      ten_years: "Mieszkasz w Polsce nieprzerwanie i legalnie od co najmniej 10 lat, masz jeden z tych tytułów, stabilne i regularne źródło dochodu oraz tytuł prawny do mieszkania",
      minor_child: "Jesteś osobą małoletnią, której jedno z rodziców jest obywatelem polskim albo któremu przywrócono obywatelstwo polskie, a drugie z rodziców (bez obywatelstwa polskiego) zgadza się na uznanie",
    },
  },
  "citizenship.language": {
    question: "Czy masz urzędowe poświadczenie znajomości polskiego co najmniej na poziomie B1 albo świadectwo szkoły w Polsce lub szkoły z polskim językiem wykładowym (świadectwo szkoły policealnej się nie liczy)?",
  },
  "citizenship.permanent_title": {
    question: "Czy masz zezwolenie na pobyt stały, zezwolenie na pobyt rezydenta długoterminowego UE albo prawo stałego pobytu?",
  },
  "citizenship.where_lives": {
    question: "Gdzie mieszkasz i na jakiej podstawie jesteś w Polsce?",
  },
  "pesel.citizen_group": {
    question: "Czy masz obywatelstwo państwa UE, EFTA lub Szwajcarii, albo obywatelstwo Wielkiej Brytanii i obejmuje Cię umowa o wystąpieniu z UE, albo jesteś członkiem rodziny takiej osoby?",
  },
  "pesel.has_number": {
    question: "Czy masz już numer PESEL?",
    whyWeAsk: "Numer PESEL bywa nadawany automatycznie, na przykład przy zameldowaniu, więc możesz go już mieć. Wtedy warto najpierw sprawdzić dane w rejestrze PESEL, zanim złożysz wniosek.",
    unknownHelp: "Pokażemy oficjalne sposoby sprawdzenia danych w rejestrze PESEL. Są opisane dla osoby, która zna swój numer. Żeby się dowiedzieć, czy masz numer, zapytaj w urzędzie gminy.",
  },
  "pesel.stay_over_30": {
    question: "Czy mieszkasz albo zamieszkasz w Polsce pod konkretnym adresem, a cały Twój pobyt w Polsce potrwa dłużej niż 30 dni?",
  },
  "pesel.temporary_protection": {
    question: "Czy korzystasz albo chcesz korzystać w Polsce z ochrony czasowej w związku z przyjazdem z Ukrainy z powodu wojny albo dlatego, że Twoim miejscem urodzenia jest Polska, a Twój rodzic ma ochronę czasową?",
    unknownHelp: "Pokażemy oficjalne zasady wniosku o PESEL ze statusem UKR, żeby można było sprawdzić, czy Cię dotyczą.",
  },
  "pobyt_czasowy.purpose": {
    question: "W jakim celu chcesz mieszkać w Polsce?",
    options: {
      family: "Rodzina (połączenie z rodziną), a Ty jesteś już w Polsce",
      family_abroad: "Rodzina, a Ty jesteś jeszcze za granicą (połączenie z cudzoziemcem mieszkającym w Polsce; też niektórzy członkowie rodziny obywatela Polski, UE lub Wielkiej Brytanii)",
    },
  },
  "zameldowanie.citizen_group": {
    question: "Która grupa Cię dotyczy?",
    whyWeAsk: "Od odpowiedzi zależą dokumenty, termin i możliwość zameldowania przez internet. Jeśli jesteś członkiem rodziny obywatela polskiego i nie masz obywatelstwa innego państwa UE, wybierz „Żadna z tych grup” albo „Nie wiem” i sprawdź w sekcji „Terminy”, który termin Cię dotyczy.",
  },
  "zameldowanie.stay": {
    question: "Na jaki pobyt chcesz się zameldować?",
    options: { permanent: "Stały (pod tym adresem mieszkasz na stałe)", temporary: "Czasowy (mieszkasz pod tym adresem przez jakiś czas)" },
  },
};

/** The fact in the person's voice: "you" (their own case, the default) or "other" (the registry's wording). */
export function voiced(f: FactDef, voice: Voice = "you"): FactDef {
  const y = voice === "you" ? YOU[f.key] : undefined;
  if (!y) return f;
  const pl = <T extends { pl?: string }>(l: T | undefined, text: string | undefined): T | undefined => (l && text ? { ...l, pl: text } : l);
  return {
    ...f,
    question: pl(f.question, y.question)!,
    whyWeAsk: pl(f.whyWeAsk, y.whyWeAsk),
    unknownHelp: pl(f.unknownHelp, y.unknownHelp),
    options: f.options?.map((o) => (y.options?.[o.value] ? { ...o, label: { ...o.label, pl: y.options[o.value] } } : o)),
  };
}
