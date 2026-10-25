# Baza wzorców: Kompendium + Me & Qi

Stan opracowania: 25.10.2026. To robocza baza edukacyjna, bez zaleceń leczenia i bez zatwierdzenia klinicznego.

## Zakres

- PDF użytkownika: „Kompendium TCM (1).pdf”, tytuł na okładce „Zintegrowane Kompendium. Diagnostyka i terapia TCM”, 2026.
- Okładka podaje 79 wzorów; faktycznie tabele zawierają **80 wierszy**. Zachowano każdy, w tym warianty mikcji i powtórzenia w różnych działach.
- 65 pozycji ma odpowiadający opis Me & Qi. Odczytano 70 różnych stron; niektóre dotyczą jedynie pojęć powiązanych.
- 9 pozycji ma tylko powiązany opis: nie włączono jego objawów automatycznie do klucza.
- 6 pozycji nie ma znalezionego dokładnego odpowiednika w przejrzanej bazie. Brak dopasowania nie oznacza, że opis nigdzie nie istnieje.
- Pięć niejasnych pozycji (19, 35, 44, 59, 79) pozostaje w katalogu do czytania i nie uczestniczy w punktowanym quizie.
- Dodatkowe skrypty nie zostały dostarczone; nie oznaczano ich jako użytego trzeciego źródła.

## Zasady opracowania

Objawy w języku polskim to krótkie parafrazy i wybór cech do nauki, nie kompletny przekład wszystkich wariantów z Me & Qi. Przy każdym objawie zapisano źródło. Dokładnie zbieżne nazwy scalono, dodając obie atrybucje. Szerszych i węższych pojęć nie uznano za automatycznie identyczne. Język i puls przepisano z osobnych kolumn PDF do obserwacji; dodatkowe opisy mają oddzielną atrybucję.

`content/patterns.json` jest źródłem danych aplikacji. `kompendium-extracted.json` to ekstrakcja tabel z numerami stron PDF (licząc okładkę jako stronę 1). `meandqi-facts.json` zawiera fakty z sekcji objawów i adresy odczytanych stron. `source-mapping.json` rejestruje dopasowania i ich ograniczenia. Samo dopasowanie źródeł nie stanowi przeglądu przez nauczyciela TCM.

Quiz ma trzy wejścia: pojedynczy losowy wzorzec, wybór konkretnego wzorca z katalogu oraz ćwiczenia dla wybranego narządu. Grupa pozwala losować jeden lub ćwiczyć wszystkie jej wzorce. Dostępnych jest 75 pozycji; każdy wzorzec ma 12 propozycji, z 3–6 pasującymi objawami zależnie od materiału. Poprawność dotyczy opracowanego zestawu źródłowego, nie diagnozy. Liczba objawów nie jest stałym kryterium diagnostycznym.

Propozycje rozpraszające pochodzą z innych obrazów. Przed losowaniem wyklucza się całe rodziny cech, jeśli występują w pełnym zapisie objawów PDF lub odczytanym zestawie Me & Qi. To ogranicza fałszywe odpowiedzi negatywne; nie dowodzi, że objaw nie może klinicznie współwystępować. Nietypowych objawów i poważnych objawów alarmowych nie utożsamiono z zachodnimi rozpoznaniami chorób.

## Rozbieżności wymagające uwagi

- **19. Yin Wątroby z pustym ogniem:** brak dokładnego odpowiednika oraz nietypowe w tym ujęciu objawy neurologiczne i krwawienia. Poza quizem.
- **35. Stagnacja / Niepokój Qi Serca:** PDF akcentuje owrzodzenia i mikcję, Me & Qi ucisk klatki i emocjonalne wycofanie. Puls w Me & Qi wymaga czytania wraz z różnicowaniem. Poza quizem.
- **44. Stagnacja Qi Śledziony:** PDF wymienia głównie objawy miesiączkowe. Brak jednoznacznego odpowiednika. Poza quizem.
- **59. Płynna flegma w Płucach:** różna konsystencja plwociny i zakres terminów w obu opisach. Poza quizem.
- **79. Ogólna Stagnacja / Nadmiar Qi:** nazwa sugeruje zastój, natomiast PDF wymienia osłabienie i opadanie; Me & Qi akcentuje rozpieranie i wędrujący ból. Poza quizem.
- **26. Wilgoć-Ciepło Pęcherzyka:** kwaśny smak w PDF i gorzki w Me & Qi zapisano osobno; nie służą jako wzajemne dystraktory.
- **80. Załamanie Qi:** nie zastąpiono opadaniem Qi z powiązanej strony Me & Qi.

## Wykaz wszystkich pozycji

| Nr | Wzorzec w Kompendium | Strona PDF | Me & Qi / relacja | Quiz |
|---|---|---:|---|---|
| 1 | Niedobór Qi Nerek (Ogólny) | 3 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/kidney-qi-deficiency) | tak |
| 2 | Niedobór Yang Nerek | 3 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/kidney-yang-deficiency) | tak |
| 3 | Niedobór Yin Nerek | 3 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/kidney-yin-deficiency) | tak |
| 4 | Niedobór Esencji Nerek (Jing) | 3 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/kidney-essence-deficiency) | tak |
| 5 | Niedobór Yin Nerek z Ogniem | 3 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/kidney-yin-deficiency-with-empty-heat-blazing) | tak |
| 6 | Dysharmonia między Nerkami a Sercem | 3 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-and-kidney-yin-deficiency) | tak |
| 7 | Zbuntowane Qi Nerek (Brak kotwiczenia Qi / Qi Ni) | 3 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/kidneys-failing-to-receive-qi) | tak |
| 8 | Nadmiar / Wilgotne Gorąco w Pęcherzu Moczowym | 5 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/damp-heat-in-the-bladder) | tak |
| 9 | Wilgoć – Żar w Pęcherzu Moczowym (Inwazja Patogenów) | 5 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/damp-heat-in-the-bladder) | tak |
| 10 | Ogień Serca schodzący do Jelita Cienkiego (Mikcja) | 5 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-fire-transmitting-to-the-small-intestine) | tak |
| 11 | Żar w Żołądku i Jelicie Grubym (Mikcja) | 5 | [tylko powiązany — nie scalono](https://www.meandqi.com/knowledge-base/patterns/bright-yang-fire-in-stomach-and-intestines) | tak |
| 12 | Ogień Wątroby (Mikcja) | 5 | [tylko powiązany — nie scalono](https://www.meandqi.com/knowledge-base/patterns/liver-fire-blazing) | tak |
| 13 | Stagnacja Qi Wątroby (Ogólna) | 7 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/liver-qi-stagnation) | tak |
| 14 | Wzrastające Yang Wątroby | 7 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/liver-yang-rising) | tak |
| 15 | Ogień w Wątrobie | 7 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/liver-fire-blazing) | tak |
| 16 | Wilgoć – Ciepło w Wątrobie | 7 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/damp-heat-in-the-liver-channel) | tak |
| 17 | Niedobór Qi Wątroby | 7 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/liver-qi-deficiency) | tak |
| 18 | Niedobór Yin Wątroby | 7 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/liver-yin-deficiency) | tak |
| 19 | Niedobór Yin Wątroby z pustym ogniem | 7 | [tylko powiązany — nie scalono](https://www.meandqi.com/knowledge-base/patterns/empty-fire-caused-by-yin-deficiency) | do wyjaśnienia |
| 20 | Zbuntowane Qi Wątroby (Qi Ni) | 7 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/rebellious-liver-qi) | tak |
| 21 | Niedobór Krwi w Wątrobie | 8 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/liver-blood-deficiency) | tak |
| 22 | Zastój Krwi w Wątrobie | 8 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/liver-blood-stagnation) | tak |
| 23 | Wątroba obraża (atakuje) Płuca | 8 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/liver-fire-insulting-the-lungs) | tak |
| 24 | Yang Wątroby tworzy Wiatr | 8 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/liver-wind-agitating-internally-due-to-liver-yang-rising) | tak |
| 25 | Niedobór Qi Pęcherzyka Żółciowego | 10 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/gallbladder-deficiency) | tak |
| 26 | Wilgoć – Ciepło w Pęcherzyku Żółciowym | 10 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/damp-heat-in-the-gallbladder) | tak |
| 27 | Niedobór Qi Serca | 12 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-qi-deficiency) | tak |
| 28 | Niedobór Yang Serca | 12 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-yang-deficiency) | tak |
| 29 | Niedobór Krwi w Sercu | 12 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-blood-deficiency) | tak |
| 30 | Niedobór Yin Serca | 12 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-yin-deficiency) | tak |
| 31 | Załamanie Yang Serca | 12 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-yang-collapsing) | tak |
| 32 | Flegma-Ogień w Sercu | 12 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/phlegm-fire-harassing-the-heart) | tak |
| 33 | Zastój krwi w Sercu | 12 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-blood-stagnation) | tak |
| 34 | Ogień w Sercu | 13 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-fire-blazing) | tak |
| 35 | Stagnacja / Niepokój Qi Serca | 13 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-qi-stagnation) | do wyjaśnienia |
| 36 | Zbuntowane Qi Serca (Qi Ni) | 13 | brak dokładnego odpowiednika | tak |
| 37 | Nadmiar i ogień w Jelicie Cienkim / Ogień Serca schodzący w dół | 15 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heart-fire-transmitting-to-the-small-intestine) | tak |
| 38 | Niedobór Qi Jelita Cienkiego | 15 | [tylko powiązany — nie scalono](https://www.meandqi.com/knowledge-base/patterns/small-intestine-deficient-and-cold) | tak |
| 39 | Niedobór Qi Śledziony | 17 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/spleen-qi-deficiency) | tak |
| 40 | Niedobór Yang Śledziony | 17 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/spleen-yang-deficiency) | tak |
| 41 | Śledziona nie kontroluje Krwi | 17 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/spleen-not-controlling-blood) | tak |
| 42 | Niedobór Qi Śledziony z Wilgocią | 17 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/spleen-deficiency-with-dampness) | tak |
| 43 | Zimno – Wilgotno w Śledzionie | 17 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/cold-damp-invading-the-spleen) | tak |
| 44 | Stagnacja Qi Śledziony | 17 | brak dokładnego odpowiednika | do wyjaśnienia |
| 45 | Zbuntowane Qi Śledziony (Opadanie Qi / Qi Ni) | 17 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/spleen-qi-sinking) | tak |
| 46 | Zimno w Żołądku | 19 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/cold-invading-the-stomach) | tak |
| 47 | Ogień / Żar w Żołądku | 19 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/stomach-heat-stomach-fire) | tak |
| 48 | Zatrzymanie Żywności w Żołądku | 19 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/food-stagnation-in-the-stomach) | tak |
| 49 | Zastój Krwi w Żołądku | 19 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/stomach-blood-stagnation) | tak |
| 50 | Niedobór Qi Żołądka | 19 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/stomach-qi-deficiency) | tak |
| 51 | Niedobór Yang Żołądka | 19 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/stomach-yang-deficient-and-cold) | tak |
| 52 | Stagnacja Qi Żołądka | 19 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/stomach-qi-stagnation) | tak |
| 53 | Zbuntowane Qi Żołądka (Qi Ni) | 19 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/rebellious-stomach-qi) | tak |
| 54 | Niedobór Yin Żołądka | 19 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/stomach-yin-deficiency) | tak |
| 55 | Zimny Wiatr atakuje Płuca | 21 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/wind-cold-invading-the-lungs) | tak |
| 56 | Gorący Wiatr atakuje Płuca | 21 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/wind-heat-invading-the-lungs) | tak |
| 57 | Wiatr i Wilgoć atakuje Płuca | 21 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/wind-cold-water-invading-the-lungs) | tak |
| 58 | Gorąca flegma w Płucach | 21 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/phlegm-heat-in-the-lungs) | tak |
| 59 | Płynna flegma w Płucach | 21 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/phlegm-fluids-in-the-lungs) | do wyjaśnienia |
| 60 | Niedobór Yin Płuc | 21 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/lung-yin-deficiency) | tak |
| 61 | Niedobór płynów w Płucach | 21 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/lung-dryness) | tak |
| 62 | Niedobór Qi Płuc (Ogólny) | 22 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/lung-qi-deficiency) | tak |
| 63 | Stagnacja / Nadmiar Qi Płuc | 22 | [tylko powiązany — nie scalono](https://www.meandqi.com/knowledge-base/patterns/phlegm-clogging-the-lungs-with-qi-stagnation) | tak |
| 64 | Zbuntowane Qi Płuc (Qi Ni) | 22 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/rebellious-lung-qi) | tak |
| 65 | Ciepło w Jelicie Grubym | 24 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/heat-in-the-large-intestine) | tak |
| 66 | Wilgoć – Ciepło w Jelicie Grubym | 24 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/damp-heat-in-the-large-intestine) | tak |
| 67 | Zastój krwi w Jelicie Grubym | 24 | brak dokładnego odpowiednika | tak |
| 68 | Zimno w Jelicie Grubym | 24 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/cold-invading-the-large-intestine) | tak |
| 69 | Sucho w Jelicie Grubym | 24 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/large-intestine-dryness) | tak |
| 70 | Niedobór Yang Śledziony i Jelita Grubego | 24 | [tylko powiązany — nie scalono](https://www.meandqi.com/knowledge-base/patterns/large-intestine-cold) | tak |
| 71 | Stagnacja Qi Jelita Grubego | 24 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/large-intestine-qi-stagnation) | tak |
| 72 | Niedobór Qi Jelita Grubego | 24 | [tylko powiązany — nie scalono](https://www.meandqi.com/knowledge-base/patterns/large-intestine-collapse) | tak |
| 73 | Niedobór Yang Jelita Grubego | 24 | [tylko powiązany — nie scalono](https://www.meandqi.com/knowledge-base/patterns/large-intestine-cold) | tak |
| 74 | Ogólny Niedobór Qi (Qi Xu) | 26 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/qi-deficiency) | tak |
| 75 | Niedobór Qi Pierwotnego (Yuan Qi) | 26 | brak dokładnego odpowiednika | tak |
| 76 | Niedobór Qi Pokarmowego (Gu Qi) | 26 | brak dokładnego odpowiednika | tak |
| 77 | Niedobór Qi Obronnego (Wei Qi) | 26 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/protective-qi-deficiency) | tak |
| 78 | Niedobór Qi Nerek, Śledziony i Płuc | 26 | brak dokładnego odpowiednika | tak |
| 79 | Ogólna Stagnacja / Nadmiar Qi | 26 | [odpowiadający opis](https://www.meandqi.com/knowledge-base/patterns/qi-stagnation) | do wyjaśnienia |
| 80 | Załamanie Qi (Qi Tuo) | 26 | [tylko powiązany — nie scalono](https://www.meandqi.com/knowledge-base/patterns/qi-collapsing-or-qi-sinking) | tak |
