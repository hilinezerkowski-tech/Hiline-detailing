# Wdrożenie wspólnej bazy klientów (Supabase) — instrukcja krok po kroku

Czas: ~15 minut. Koszt: 0 zł/miesiąc (plan Free wystarczy na tysiące klientów).

Po wdrożeniu: wszyscy (Ty, wspólnicy, pracownicy) widzą **tę samą bazę klientów**
na swoich telefonach. Dane nie zginą po wyczyszczeniu przeglądarki.

---

## Krok 1 — Załóż projekt Supabase (5 min)

1. Wejdź na **https://supabase.com** → "Start your project" → zaloguj się (możesz przez GitHub — masz już konto do Netlify).
2. Kliknij **"New project"**:
   - Name: `hiline-crm`
   - Database Password: wygeneruj i **zapisz w bezpiecznym miejscu** (nie będzie potrzebne na co dzień)
   - Region: **Central EU (Frankfurt)** — najbliżej Polski
3. Poczekaj ~2 minuty aż projekt się utworzy.

## Krok 2 — Utwórz tabelę (2 min)

1. W menu po lewej kliknij **SQL Editor** → **New query**.
2. Otwórz plik `SUPABASE_SETUP.sql` z folderu projektu, skopiuj całość, wklej i kliknij **Run**.
3. Powinno pokazać "Success. No rows returned" — tabela gotowa.

## Krok 3 — Skopiuj klucze (2 min)

1. W menu po lewej: **Project Settings** (zębatka) → **API** (lub Data API).
2. Skopiuj dwie rzeczy:
   - **Project URL** — np. `https://abcdefgh.supabase.co`
   - **service_role key** (sekcja "Project API keys" — kliknij "Reveal") — długi klucz zaczynający się od `eyJ...`
   
   ⚠️ service_role daje pełny dostęp do bazy — nigdy nie wklejaj go do kodu strony ani nie wysyłaj nikomu. Trafi tylko do Netlify (serwer).

## Krok 4 — Dodaj zmienne w Netlify (3 min)

1. Wejdź na **https://app.netlify.com** → site **hiline-detailing** → **Site configuration** → **Environment variables**.
2. Dodaj 3 zmienne (Add a variable → Key + Value):

   | Key | Value |
   |---|---|
   | `SUPABASE_URL` | Project URL z kroku 3 |
   | `SUPABASE_SERVICE_KEY` | service_role key z kroku 3 |
   | `PANEL_TOKEN` | `Hiline2025` (hasło panelu — możesz tu ustawić nowe, mocniejsze) |

## Krok 5 — Deploy (1 min)

1. Dwuklik w `COMMIT-I-DEPLOY.bat`.
2. Po deployu otwórz panel, zaloguj się — w prawym górnym rogu powinno pokazać **☁️ online**.
3. Twoja dotychczasowa lokalna baza klientów **automatycznie przeniesie się do chmury** przy pierwszym otwarciu panelu.

## Krok 6 — Test z drugim urządzeniem

1. Dodaj testowego klienta na komputerze.
2. Otwórz panel na telefonie — klient powinien być widoczny (odśwież, jeśli panel był już otwarty).
3. Działa? Wysyłaj ekipie link z instrukcją instalacji ikonki.

---

## Jak to działa (w skrócie)

- Panel → Netlify Function (`clients.js`) → Supabase. Klucze do bazy żyją tylko na serwerze Netlify.
- Hasło panelu jest teraz sprawdzane **na serwerze** (zmienna `PANEL_TOKEN`) — chcesz zmienić hasło dla całej ekipy? Zmieniasz jedną zmienną w Netlify, bez ruszania kodu.
- Wskaźnik w panelu: **☁️ online** = wspólna baza działa - **📴 offline** = brak internetu, dane zapiszą się lokalnie i wyślą przy następnym otwarciu - **💾 lokalnie** = chmura jeszcze nieskonfigurowana.
- Usunięcie klienta w panelu usuwa go też z chmury (RODO).
- Backup JSON dalej działa — rób go co jakiś czas jako dodatkowe zabezpieczenie.

## Możliwe problemy

- **Po deployu wciąż "💾 lokalnie"** → sprawdź, czy 3 zmienne w Netlify są zapisane i zrób redeploy (Deploys → Trigger deploy → Deploy site). Zmienne działają dopiero od następnego deploya.
- **"📴 offline" mimo internetu** → Netlify → Functions → clients → logi błędów; najczęściej literówka w SUPABASE_URL lub kluczu.
- **401 przy logowaniu** → hasło wpisane w panelu musi być identyczne z `PANEL_TOKEN` w Netlify.
