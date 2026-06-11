# 🚀 Wgrywanie maili HTML do MailerLite (plan Advanced)

Masz teraz odblokowany **edytor Custom HTML**. To jedyny moment, żeby wgrać wszystkie 26 maili w brandingu Hiline. Po zejściu z Advanced maile **zostaną i będą wysyłane**, ale nie da się ich już edytować — więc wgraj wszystko teraz.

## Jak wgrać jeden mail (~30 s)

1. Wejdź w automatyzację → kliknij krok e-mail → **Edytuj zawartość**.
2. Przy wyborze edytora wybierz **„Niestandardowy edytor HTML"** (Custom HTML).
3. Otwórz odpowiedni plik `.html` w przeglądarce → kliknij prawym → *Pokaż źródło strony* (albo otwórz w Notatniku) → zaznacz **wszystko** (Ctrl+A) → kopiuj (Ctrl+C).
4. Wklej cały kod do edytora HTML (Ctrl+V) → **Zapisz**.
5. Temat e-maila jest już ustawiony przez API — nie musisz go zmieniać.

> `{$name}` i `{$unsubscribe}` zostaw nietknięte — MailerLite podstawia je sam.

## Mapa: który plik do którego maila (zachowaj kolejność!)

### 1) Mail powitalny — `187079518464246980` (AKTYWNA)
- `POWITALNY_E01.html` — przy okazji poprawia temat na „Dziękujemy za wizytę" i dodaje czerwony przycisk **Oceń nas w Google**.

### 2) Ceramika 3-letnia — `188323759364506811`
Obecnie ma zielone przyciski (stary edytor blokowy). Podmień każdy mail na HTML z czerwienią:
1. `CERAMIKA_E01_14dni.html`  2. `CERAMIKA_E02_6mies.html`  3. `CERAMIKA_E03_12mies.html`
4. `CERAMIKA_E04_18mies.html`  5. `CERAMIKA_E05_24mies.html`  6. `CERAMIKA_E06_30mies.html`
7. `CERAMIKA_E07_36mies.html`

### 3) Powłoka 5-letnia — `189005604721788905` (wstrzymana)
1. `5L_E01_14dni`  2. `5L_E02_6mies`  3. `5L_E03_12mies`  4. `5L_E04_18mies`  5. `5L_E05_24mies`
6. `5L_E06_30mies`  7. `5L_E07_36mies`  8. `5L_E08_42mies`  9. `5L_E09_48mies`  10. `5L_E10_54mies`  11. `5L_E11_60mies`

### 4) Folia PPF — `189005678772225985` (wstrzymana)
1. `PPF_E01_14dni`  2. `PPF_E02_3mies`  3. `PPF_E03_6mies`  4. `PPF_E04_12mies`  5. `PPF_E05_24mies`
6. `PPF_E06_36mies`  7. `PPF_E07_60mies`

## Po wgraniu

1. **5-letnia i PPF** przestaną być „niekompletne" → kliknij **Aktywuj** w obu (teraz są wstrzymane).
2. **Ceramika** — jeśli jeszcze nieaktywna, też **Aktywuj**.
3. Wyślij sobie **test** każdej automatyzacji (przycisk testowy w MailerLite), żeby zobaczyć render w prawdziwej skrzynce.

## Podgląd

Otwórz **`PODGLAD_WSZYSTKICH_MAILI.html`** — zobaczysz wszystkie 26 maili obok siebie. Dobre do szybkiego QA przed wgraniem.

## Dane kontaktowe użyte we wszystkich mailach
- WhatsApp / tel: **+48 505 008 288**
- E-mail: **biuro@hiline.pl**
- Opinia Google: `https://g.page/r/CXj9sao2d1xQEBM/review`
- Lokalizacja w stopce: **Łady Warszawa**

Jeśli któraś z tych danych jest nieaktualna — powiedz, podmienię we wszystkich 26 naraz.
