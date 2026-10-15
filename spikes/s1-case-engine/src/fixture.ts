// Snapshot (simplified) of content/procedures/zameldowanie.yaml and content/facts/zameldowanie.yaml
// at formalka@504a210 (2026-10-15). Quotes are verbatim; ids match production. Reduced to what the
// spike exercises. Synthetic: the "zameldowanie.can_register" fact, the template's PESEL route and the
// pesel-application quotes are placeholders, NOT verified official wording.
import type { Registry } from "./types.ts";

const govpl = "https://www.gov.pl/web/gov/zamelduj-sie-na-pobyt-staly-dla-cudzoziemcow";
const act = "https://api.sejm.gov.pl/eli/acts/DU/2026/384/text.pdf";
const wwa = "https://warszawa19115.pl/-/zameldowanie-na-pobyt-czasowy-cudzoziemca";
const krk = "https://www.bip.krakow.pl/uslugi/SA-12&metka=1";
const q = (page: string, text: string) => [{ page, text }];
const G = "zameldowanie.citizen_group", S = "zameldowanie.stay";

export const registry: Registry = {
  facts: [
    { key: G, options: ["eu_efta", "uk_wa", "other"] },
    { key: S, options: ["temporary", "permanent"] },
    { key: "location", options: [] },
    { key: "zameldowanie.can_register", options: ["yes", "no"] },
    { key: "personal.surname", options: [], identifying: true },
  ],
  templates: [{
    id: "arrive-register-address",
    procedures: [
      { procedureId: "zameldowanie-foreigner", when: { not: { fact: "zameldowanie.can_register", eq: "no" } } },
      { procedureId: "pesel-application", when: { fact: "zameldowanie.can_register", eq: "no" } },
    ],
  }],
  procedures: [
    {
      id: "zameldowanie-foreigner", version: 10, status: "published",
      steps: [
        { id: "fill-in", kind: "fill_form", dependsOn: [], quotes: q(govpl, "pobierz i wypełnij w domu albo zrób to w swoim urzędzie gminy") },
        { id: "owner-confirms", kind: "prepare", dependsOn: ["fill-in"], quotes: q(govpl, "Na formularzu, który przyniesiesz do urzędu, właściciel lub inny podmiot, który ma tytuł prawny do mieszkania, musi potwierdzić, że przebywasz w tym lokalu.") },
        { id: "file", kind: "visit", dependsOn: ["owner-confirms"], quotes: q(govpl, "W urzędzie gminy, na terenie której mieszkasz.") },
        { id: "registered", kind: "wait", dependsOn: ["file"], quotes: q(govpl, "Urzędnik zamelduje cię od razu po otrzymaniu twojego zgłoszenia.") },
      ],
      documents: [
        { id: "form-temporary", condition: { fact: S, eq: "temporary" }, alternativeTo: ["form-permanent"], quotes: q(govpl, "formularz zgłoszenia pobytu czasowego") },
        { id: "form-permanent", condition: { fact: S, eq: "permanent" }, quotes: q(govpl, "formularz zgłoszenia pobytu stałego") },
        { id: "identity-eu", condition: { fact: G, eq: "eu_efta" }, quotes: q(govpl, "ważny dokument podróży lub inny ważny dokument, który potwierdzi twoją tożsamość i obywatelstwo,") },
        { id: "travel-document", condition: { not: { fact: G, eq: "eu_efta" } }, quotes: q(govpl, "- ważny dokument podróży,\n- wizę.") },
        { id: "uk-residence-document", condition: { fact: G, eq: "uk_wa" }, quotes: q(act, "przedstawia ważne zaświadczenie o zarejestrowaniu pobytu albo ważny dokument potwierdzający prawo stałego pobytu") },
        { id: "visa", condition: { all: [{ fact: G, eq: "other" }, { fact: S, eq: "temporary" }] }, alternativeTo: ["visa-free-or-waiting"], quotes: q(govpl, "- wizę.") },
        { id: "visa-free-or-waiting", disputed: true, condition: { all: [{ fact: G, eq: "other" }, { fact: S, eq: "temporary" }] }, quotes: q(govpl, "Jeśli jesteś w Polsce w ramach ruchu bezwizowego") },
        { id: "permanent-stay-document", condition: { all: [{ fact: G, eq: "other" }, { fact: S, eq: "permanent" }] }, quotes: q(govpl, "kartę pobytu wydaną w związku z udzieleniem zezwolenia na pobyt stały") },
        { id: "lease", alternativeTo: ["owner-title"], quotes: q(govpl, "umowę cywilnoprawną, na przykład umowę najmu,") },
        { id: "owner-title", quotes: q(govpl, "dokument, który potwierdza tytuł prawny do mieszkania właściciela lub innego podmiotu,") },
      ],
      fees: [
        { id: "free", amountPln: 0, quotes: q(govpl, "Usługa zameldowania jest bezpłatna.") },
        { id: "temporary-certificate", amountPln: 17, optional: true, condition: { all: [{ not: { fact: G, eq: "eu_efta" } }, { fact: S, eq: "temporary" }] }, quotes: q(govpl, "Zaświadczenie o zameldowaniu na pobyt czasowy – 17 zł.") },
      ],
      deadlines: [
        { id: "other-citizens", days: 4, from: "move_in_date_set", condition: { not: { fact: G, eq: "eu_efta" } }, quotes: q(govpl, "Najpóźniej w 4 dniu od zamieszkania w Polsce, w lokalu, w którym chcesz się zameldować.") },
        { id: "eu-efta", days: 30, from: "move_in_date_set", condition: { fact: G, eq: "eu_efta" }, quotes: q(govpl, "najpóźniej w 30 dniu od zamieszkania w Polsce, w lokalu, w którym chcesz się zameldować,") },
      ],
      variations: [
        { id: "warszawa", officeRef: "office:warszawa-any-delegatura", condition: { fact: "location", prefix: "1465" }, quotes: q(wwa, "Osobiście w dowolnej delegaturze Biura Administracji i Spraw Obywatelskich w Warszawie.") },
        { id: "krakow", officeRef: "office:krakow-by-district", condition: { fact: "location", prefix: "1261" }, quotes: q(krk, "Zabierz dokumenty i udaj się do lokalizacji Urzędu Miasta Krakowa właściwej ze względu na położenie nieruchomości.") },
      ],
      generalOffice: { id: "general", officeRef: "office:municipal-of-residence", quotes: q(govpl, "W urzędzie gminy, na terenie której mieszkasz.") },
      produces: [{ fact: "pesel.assigned_on_registration", value: "yes", quote: { page: govpl, text: "Dostaniesz numer PESEL z urzędu – jeśli zameldujesz się w Polsce na pobyt powyżej 30 dni." } }],
    },
    {
      id: "pesel-application", version: 8, status: "published",
      steps: [{ id: "apply", kind: "visit", dependsOn: [], quotes: q("https://www.gov.pl/web/gov/uzyskaj-numer-pesel", "wniosek o nadanie numeru PESEL") }],
      documents: [], fees: [], deadlines: [], variations: [],
      generalOffice: { id: "general", officeRef: "office:any-municipal", quotes: q("https://www.gov.pl/web/gov/uzyskaj-numer-pesel", "w dowolnym urzędzie gminy") },
    },
  ],
};
