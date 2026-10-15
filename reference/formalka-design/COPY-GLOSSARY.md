# Copy glossary

The words Formalka uses for the same thing on every screen and in every language. It comes from the copywriter's site audit (COPY-01, 2026-10-02). The copywriter checks new copy against it, and new guides (content labels included) follow it. Change a row only together with every key that uses it.

| Concept | PL | UK | EN | (keys that must use it) |
|---|---|---|---|---|
| guide | przewodnik | путівник | guide | guides.*, plan.openGuide, notices.aiTitle, levelShort.* |
| topic | temat | тема | topic | search.topic, home.topicsTitle, topic.* |
| office (generic) | urząd | установа | office | topic.*, procedure.*, place.* |
| municipal office | urząd gminy | управління гміни (urząd gminy) | municipal office (gmina) | place.find*, procedure.where.municipal_office |
| gmina | gmina | гміна | gmina | place.findChange, findLabel, findWhat |
| your plan / done | Twój plan / załatwione | Ваш план / зроблено | Your plan / done | plan.*, privacy.noAccounts |
| Your situation | Twoja sytuacja | Ваша ситуація | Your situation | guide.situation, procedure.documentsFilter, feesDepend, place.routeDiffers |
| residence status (journey) | podstawa pobytu | підстава перебування | residence status | journey.stay, privacy.noAccounts |
| temporary residence permit | zezwolenie na pobyt czasowy | дозвіл на тимчасове перебування | temporary residence permit | guides.pobyt-czasowy.*, guides.cukr.description |
| free legal aid | bezpłatna pomoc prawna (the guide keeps the official name "Nieodpłatna pomoc prawna") | безоплатна правова допомога | free legal aid | topics.help, topic.handoffLink, guides.pomoc-prawna, notices.advice |
| editor check | sprawdzone przez naszą redakcję | перевірено нашою редакцією | checked by our editor (never "reviewed") | procedure.verification.*, levelShort.*, place.officeLevel |
| I don't know / rather not say | Nie wiem / Wolę nie odpowiadać | Не знаю / Не хочу відповідати | I don't know / I'd rather not say | intake.dontKnow, journey.*Options, check.unknownAnswer, summaryUnknown |
| Ty-form capitals (PL) | Twój, Ciebie, Twoje (capitalised) | lowercase "ви/ваш" | you | all PL keys |
| official sources disagree | źródła urzędowe się różnią | офіційні джерела розходяться | official sources disagree | procedure.verification.sources_disagree, check.unsettled, check.summaryUnsettled |
| the foreigner still abroad (temporary residence, family abroad) | osoba za granicą | особа за кордоном | the person abroad | paper-* steps and documents (pobyt-czasowy) |
| the one who files, in Poland | członek rodziny w Polsce (never "składający") | член сім'ї в Польщі (never "заявник") | the family member in Poland | paper-* steps and documents (pobyt-czasowy) |
| written request to complete | pismo, wezwanie | лист, вимога (never "виклик": a summons in person) | letter, request | paper-missing |

| file through (*za pośrednictwem*) | składać przez wojewodę / konsula | подавати через воєводу / консула | file through the voivode / a consul | citizenship guides: steps, where_lives question |
| residence card | karta pobytu | карта побиту (never "карта перебування") | residence card | all guides |
| visa-free | ruch bezwizowy | безвізовий режим | visa-free | citizenship grant guide |
| sworn or consular translation | tłumaczenie przysięgłe albo konsularne | присяжний або консульський переклад | sworn or consular translation | both citizenship guides |
| refusal document (grant) | zaświadczenie o odmowie | довідка про відмову | certificate of refusal | citizenship grant guide |

### Added 2026-10-03 (copy review of the permanent residence and certificate guides)

| Concept | PL | UK | RU | EN | Keys |
|---|---|---|---|---|---|
| official wording | brzmienie urzędowe | офіційне формулювання | официальная формулировка | official wording | procedure.officialWording, check.readOnly, step descriptions that point to quotes |
| EU long-term resident permit | zezwolenie rezydenta długoterminowego UE (short: zezwolenie UE) | дозвіл довгострокового резидента ЄС | разрешение долгосрочного резидента ЕС | EU long-term resident permit (short: EU permit) | certyfikat.*, staly.ground, place.fromPermanent |
| recognition as a Polish citizen | uznanie za obywatela polskiego (the act's term) | визнання громадянином Польщі | признание гражданином Польши | recognition as a Polish citizen | certyfikat.*, citizenship guides |
| fee exemption | kto nie płaci / niektórzy nie płacą | хто не платить / дехто не платить | кто не платит / некоторые не платят | who doesn't pay / some people don't pay | procedure.feeExemptions, place.feeExemptNote |
| the page we send people to | przewodnik (never "procedura" in the UI) | путівник | путеводитель | guide | check.insteadLead, place.related |
| none of them (last answer) | Żadna z nich | Жодна з них | Ни одна из них | None of these | choice facts |

### Added 2026-10-04 (copy review of the matter pages, UXA-J1)

| Concept | PL | UK | RU | EN | Keys |
|---|---|---|---|---|---|
| matter (something handled at an office; on these screens, no guide yet) | sprawa | справа | дело | matter | matters.*, matter.* |
| topic | temat | тема | тема | topic | matter.topicPages*, procedure.backToTopic, topic.* |
| office (generic), RU column for the row above | urząd | установа | учреждение | office | matter.noOfficial, matter.sayAtOffice, matter.help |
| browser tab (closing it clears guide answers) | karta przeglądarki | вкладка браузера | вкладка браузера | browser tab | check.answersStay, privacy.noAccounts |
| reload (the page) | odświeżyć stronę | оновити сторінку | обновить страницу | reload the page | same |
| browser storage (only for the plan, never for guide answers) | pamięć przeglądarki / zapisywane w przeglądarce | пам'ять браузера | память браузера | the browser's storage | privacy.noAccounts, plan.* |
| match (answers vs a condition) | zgadza się / zgadzają się | збігається / збігаються | совпадает / совпадают | matches / match | check.matches, matchesPart, summaryAllMatch, summaryAskedMatch, summaryUnknown |
| what we ask about | to, o co pytamy / część, o którą pytamy | те, про що ми запитуємо | то, о чём мы спрашиваем | what we ask about / the part we ask about | check.matchesPart, summaryAskedMatch, summaryUnknown |
| Your situation (the guide part with the questions) | „Twoja sytuacja” | «Ваша ситуація» | «Ваша ситуация» | “Your situation” | guide.situation, privacy.noAccounts |
| address for service (adres do doręczeń) | adres do doręczeń | адреса для листування (adres do doręczeń) | адрес для корреспонденции (adres do doręczeń) | address for official letters (adres do doręczeń) | residence guides, step `decision`; pesel.yaml |
| proxy (pełnomocnik) | pełnomocnik | уповноважена особа | уполномоченное лицо | proxy | residence guides, pesel, zameldowanie; not "representative", which collides with a child's legal representative |

### Added 2026-10-10 (copy review of the dry-run fixes, DRF)

| Concept | PL | UK | RU | EN | Keys |
|---|---|---|---|---|---|
| questions answered "I don't know" | pytania z taką odpowiedzią (never "punkty") | такі запитання (never "пункти") | такие вопросы (never "пункты") | the questions with that answer (never "points") | check.summaryUnknown |
| the rest of the answers | reszta Twoich odpowiedzi (zgadza się) | решта ваших відповідей (збігається) | в остальном ваши ответы | the rest of your answers | check.summaryUnknown |
| PESEL with UKR status | numer PESEL ze statusem UKR (later in the text: PESEL ze statusem UKR) | номер PESEL зі статусом UKR | номер PESEL со статусом UKR | PESEL number with UKR status (later: PESEL with UKR status) | check.ukrFirst*, check.ukrUnknown*, guides.pesel-ukr.title, pesel.temporary_protection.* |
| attachment (MOS) | załącznik | додаток | приложение | attachment | pobyt-czasowy step ask-for-attachment, the three *-attachment explanations |

### Added 2026-10-13 (copy review of smart search)

| Concept | PL | UK | RU | EN | Keys |
|---|---|---|---|---|---|
| search by description (the smart search feature) | wyszukiwanie po opisie | пошук за описом | поиск по описанию | search by description | smartSearch.fallback, privacy.smartSearch |
| send your question (the moment the text leaves the browser) | wysłać pytanie | надіслати запитання | отправить вопрос | send your question | smartSearch.sent, privacy.smartSearch, privacy.smartSearchPurpose |
