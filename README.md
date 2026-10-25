# Korzenie — nauka wzorców TCM

Polska mini gra **wzorzec → objawy** z białym tłem i tekstowymi kafelkami. Wybrany kafelek ciemnieje; po sprawdzeniu zielony oznacza trafienie, czerwony błędny wybór, żółty pominięty pasujący objaw.

## Uruchomienie

Node.js >=22; brak zależności npm i kluczy API.

```sh
cd /workspace/apka_tcm
npm start
```

Domyślny port 3000 można zmienić zmienną PORT. Serwer udostępnia wyłącznie katalog public. Wersja samodzielna `/workspace/korzenie-baza.html` zawiera skrypty i style; nie wymaga serwera ani dostępu do internetu do rozgrywki.

## Materiał

W katalogu są wszystkie **80 pozycji z tabel Kompendium** (okładka podaje 79), podzielone na działy i dostępne przez wyszukiwarkę. 65 pozycji ma odpowiadający opis Me & Qi; 9 tylko powiązany; 6 bez znalezionego dokładnego odpowiednika. Pięć rozbieżnych opisów jest dostępnych do czytania, poza punktowanym quizem. Nie użyto trzeciego źródła (skryptów), którego jeszcze nie dostarczono.

Na początku są trzy przyciski: Losuj wzorzec (jeden z 75 dostępnych), Sprawdź / ćwicz wzorzec (wybór z katalogu) i Ćwicz wzorce dla narządu (11 grup). W grupie można losować jeden wzorzec lub ćwiczyć wszystkie dostępne. Każdy wzorzec ma 12 propozycji objawów. Maksymalnie 100 pkt za wzorzec; proporcjonalnie za trafienia, z potrąceniem za błędne zaznaczenia, minimum 0. Powtórki dotyczą pomylonych wzorców i nie zwiększają rekordu pełnej sesji. Zapis tylko w tej przeglądarce, bez kont i synchronizacji; bieżący klucz postępów: korzenie-tcm-sources-v3.

**Robocze opracowanie edukacyjne**, bez klinicznej walidacji i bez zaleceń leczenia. Nazwy narządów oznaczają pojęcia TCM. Przed szerszym udostępnieniem materiał wymaga przeglądu przez nauczyciela. Szczegóły, adresy źródeł, numery stron i rozbieżności: [content/README.md](content/README.md).

## Rozwój i weryfikacja

Źródło opracowanej bazy: content/patterns.json. Logika losowania i punktacji: quiz-engine.js. Po świadomej zmianie kodu lub bazy:

```sh
npm run build
npm test
```

Build generuje public/questions.js i samodzielne pliki HTML w /workspace. Zależności ani narzędzia przeglądarkowe nie są wymagane do uruchomienia. Testy pokrywają kompletność wpisów, atrybucje, oddzielenie niejasnych pozycji, pule pytań i punktację; nie stanowią merytorycznej walidacji medycznej.

## Wdrożenie na Vercel

Projekt jest stroną statyczną. Konfiguracja vercel.json ustawia preset Other, instalację `npm ci --ignore-scripts --no-audit --no-fund`, build `npm run build -- --web-only` i katalog wyjściowy `public`. Nie uruchamia się server.js ani npm start na Vercel. Zmienne środowiskowe nie są wymagane.

Zaimportuj repozytorium `barykonkretnie-ship-it/apka_tcm` w Vercel, wybierz katalog główny repozytorium i Deploy. Przy połączeniu z GitHub kolejne wdrożenia mogą uruchamiać się po pushu.

Flaga --web-only nie tworzy pobieralnych plików w katalogu nadrzędnym. Katalogi źródłowych ekstrakcji nie są publicznymi zasobami witryny. Gra i katalog wzorców są publiczne po wdrożeniu; postępy nadal pozostają wyłącznie w przeglądarce użytkownika.
