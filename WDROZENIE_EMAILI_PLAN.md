# 🚀 Hiline — Wdrożenie nowych emaili + uruchomienie automatyzacji

**Data:** 2026-05-25
**Status:** ✅ Szablony przebudowane, ✅ Assety zoptymalizowane — pozostają 3 kroki manualne w Netlify + MailerLite.

---

## 📦 Co zostało zrobione (kod)

✅ Wygenerowano 7 nowych szablonów `EMAIL_*.html` — spójna identyfikacja, hero z tłem, brand colors (czerń + Hiline red `#C41E3A`), table-based layout dla Outlook/Gmail/Apple Mail, responsive.

✅ Zoptymalizowano assety w `assets/email/`:
- `hero-hiline.jpg` — 1200×800, **59 KB** (skompresowane z 3.9 MB)
- `logo-hiline-white.png` — 400×107, **8 KB**
- `logo-hiline.png` — 400×130, **10 KB**

✅ Każdy email zawiera:
- Preheader (preview text w skrzynce)
- Hero z logo na tle zdjęcia + akcent czerwony
- Personalizacja `{$name}` (zachowana)
- Bulletproof CTA button (działa nawet w Outlook 2007)
- WhatsApp + tel. CTA fallback
- Stopka z `{$unsubscribe}` (GDPR)
- Dane kontaktowe: `biuro@hiline.pl`, +48 505 008 288, Łady k. Warszawy

---

## 🔴 KROK 1 — Deploy assetów do Netlify (5 min)

Hero photo i logo muszą być dostępne publicznie pod URL `https://hiline-detailing.netlify.app/assets/email/...`, bo MailerLite pobiera obrazki z linku (nie hostuje samych plików).

**Co zrobić:**

```bash
cd "C:\Users\Hyperbook\Desktop\Hiline Panel Klienta"
git add assets/email/ EMAIL_*.html WDROZENIE_EMAILI_PLAN.md
git commit -m "Nowe szablony email + assety hero/logo"
git push
```

Netlify automatycznie zdeployuje (~30 sek). Po deployu sprawdź w przeglądarce:
- 👉 https://hiline-detailing.netlify.app/assets/email/hero-hiline.jpg — powinno otworzyć zdjęcie
- 👉 https://hiline-detailing.netlify.app/assets/email/logo-hiline-white.png — powinno otworzyć logo

Jeśli oba się wczytują — krok 1 zakończony.

---

## 🔴 KROK 2 — Sprawdź zmienną środowiskową w Netlify (2 min)

Funkcja `netlify/functions/subscribe.js` używa `process.env.MAILERLITE_TOKEN`. Jeśli zmienna nie jest ustawiona, formularz w panelu **nie doda nikogo do MailerLite**.

**Sprawdzenie:**

1. Wejdź: https://app.netlify.com/sites/hiline-detailing/settings/env
2. Sprawdź czy istnieje zmienna `MAILERLITE_TOKEN`
3. Jeśli **nie ma** — kliknij `Add a variable`, nazwa: `MAILERLITE_TOKEN`, wartość: **token z MailerLite** (Integracje → Developer API → wygeneruj nowy token).
4. Po dodaniu — **musisz zredeployować site**: Deploys → Trigger deploy → Deploy site.

> ⚠️ **WAŻNE:** Stary token jest hardkodowany w pliku `subscribe.js` w katalogu głównym (NIE w `netlify/functions/`). Ten stary plik nie jest używany przez Netlify, ale dla bezpieczeństwa **usuń go** lub przenieś token do zmiennej środowiskowej.

---

## 🔴 KROK 3 — Wgraj 7 nowych emaili do MailerLite (15-20 min)

Automation już istnieje: ID `188323759364506811`. Trzeba **podmienić zawartość HTML w każdym z 7 emaili**.

### Krok po kroku dla **każdego** z 7 emaili:

1. Otwórz: https://dashboard.mailerlite.com/automations/188323759364506811
2. Kliknij krok z emailem (np. "Email 1 - Darmowe mycie sprawdzające")
3. W edytorze emaila kliknij **`Edit content`**
4. Na pasku górnym wybierz **`HTML editor`** (zamiast Drag & drop) — jeśli MailerLite zapyta, czy chcesz przełączyć tryb, zaakceptuj
5. **Usuń całą obecną zawartość** i wklej kompletny HTML z pliku
6. Kliknij **`Save`** → wróć do automationu

### Mapowanie plików → kroków w automationie:

| Krok | Subject (Temat maila) | Plik HTML |
|------|----------------------|-----------|
| Dzień 14 | `Twoje bezpłatne mycie sprawdzające czeka 🎁` | `EMAIL_1_Darmowe_mycie.html` |
| Dzień 194 (6 mies.) | `6 miesięcy z powłoką — czas na kontrolę` | `EMAIL_2_6_miesiecy.html` |
| Dzień 374 (12 mies.) | `Roczny serwis powłoki ceramicznej` | `EMAIL_3_12_miesiecy.html` |
| Dzień 554 (18 mies.) | `Kontrola 18-miesięczna Twojej powłoki` | `EMAIL_4_18_miesiecy.html` |
| Dzień 734 (24 mies.) | `Serwis 2-letni — mid-life Twojej powłoki` | `EMAIL_5_24_miesiecy.html` |
| Dzień 914 (30 mies.) | `Zbliża się koniec gwarancji powłoki ⚠️` | `EMAIL_6_30_miesiecy.html` |
| Dzień 1094 (36 mies.) | `Koniec gwarancji — odbierz rabat -15% ⭐` | `EMAIL_7_36_miesiecy.html` |

> 💡 **Tip:** Zaktualizuj też **subjecty** według tabeli powyżej — są lepsze marketingowo niż obecne.

### Sprawdzenie po wklejeniu:

Po wklejeniu HTML do każdego emaila kliknij **`Preview`** → powinno wyświetlić:
- Hero photo z auta (jeśli się nie wczytuje — sprawdź krok 1, czy `hero-hiline.jpg` jest na Netlify)
- Białe logo Hiline na środku hero
- Czarno-biały content z czerwonym przyciskiem CTA "ZAREZERWUJ..."
- Stopka z linkiem "Wypisz się"

---

## 🔴 KROK 4 — Aktywuj automation (30 sek)

1. Wróć na: https://dashboard.mailerlite.com/automations/188323759364506811
2. Prawy górny róg → kliknij **`Enable`** (zielony toggle)
3. Potwierdź w popup'ie

✅ Od tej chwili każdy nowy klient dodany przez panel → MailerLite → grupa "Klienci Hiline" → automatycznie dostaje email po 14 dniach i kolejne w cyklu 6-miesięcznym przez 3 lata.

---

## 🧪 KROK 5 — Test end-to-end (5 min)

Pełny test integracji formularz → MailerLite → email:

1. Otwórz: https://hiline-detailing.netlify.app/panel.html (hasło: `Hiline2025`)
2. Kliknij **"+ Dodaj klienta"**
3. Wpisz:
   - Imię: `Test Wojtek`
   - Email: **twój prywatny email** (nie hiline.zerkowski@gmail.com — żeby nie zaśmiecić skrzynki firmowej)
   - Telefon: `+48 500 000 000`
   - Pojazd: `Test Audi A4`
   - Typ usługi: `Powłoka 3-letnia`
4. Kliknij **Dodaj**

**Co się powinno wydarzyć:**

✅ W konsoli przeglądarki (F12 → Console) zobaczysz: `✓ Dodano do MailerLite (ID: xxxxx)`
✅ W MailerLite (Subscribers) pojawi się nowy subscriber z polami: pojazd, usluga, data_serwisu, powloka
✅ Subscriber zostanie przypisany do 3 grup: `Klienci Hiline` + `Powłoka 3-letnia` + `Promocje`
✅ Automation się odpali — pierwszy email dotrze za 14 dni (możesz to zmienić w MailerLite na `1 minute` dla testu, a potem przywrócić)

> ⚠️ Jeśli w konsoli zobaczysz `✗ Błąd MailerLite: ...` — najczęstsze przyczyny: brak `MAILERLITE_TOKEN` w Netlify (krok 2), token wygasł, albo grupa nie istnieje.

---

## 🎯 Co dalej (po uruchomieniu)

Po udanym teście — system jest **w pełni produkcyjny**. Lista rzeczy do dorobienia z czasem:

### Krótkoterminowo (kolejna sesja)
1. **Hasło panelu w env** — obecnie `Hiline2025` jest w kodzie. Zaszyfruj lub przenieś do Netlify Identity.
2. **Link do Google Reviews** w EMAIL_1 (sekcja "Po wizycie poproszę o opinię").
3. **Własna domena** — `hiline.pl` zamiast `netlify.app` (~50 zł/rok w OVH/nazwa.pl). MailerLite SPF/DKIM łatwiej skonfigurować na własnej domenie.

### Średnioterminowo
4. **Druga automatyzacja** — przypomnienia dla klientów PPF (inna grupa, inne timingi — PPF ma serwis raz/rok, nie co 6 mies.).
5. **Newsletter promocyjny** — grupa `Promocje` na razie nic nie robi. Stwórz w MailerLite kampanię typu "ostatnie miejsca w tym tygodniu", "promocja sezonowa".
6. **WhatsApp Business API** zamiast `wa.me/` linków — pozwala wysyłać szablony z poziomu CRM.

### Długoterminowo
7. **Migracja z localStorage do Supabase** — obecnie baza klientów w panelu siedzi w localStorage przeglądarki. Stracisz wszystko jak wyczyścisz cache. Supabase Free Tier = baza + autoryzacja + 50k MAU za 0 zł.
8. **Pole "data ostatniej wizyty"** + osobne automatyzacje — zamiast "od daty pierwszej powłoki", lepiej liczyć od ostatniego serwisu.

---

## 📋 Checklist wdrożenia

- [ ] **Krok 1:** `git push` z nowymi szablonami + assetami
- [ ] **Krok 1:** Sprawdzono że hero-hiline.jpg otwiera się pod URL Netlify
- [ ] **Krok 2:** `MAILERLITE_TOKEN` ustawiony w Netlify env
- [ ] **Krok 2:** Site zredeployowany po dodaniu env
- [ ] **Krok 3:** Wgrano EMAIL_1 → preview działa
- [ ] **Krok 3:** Wgrano EMAIL_2 → preview działa
- [ ] **Krok 3:** Wgrano EMAIL_3 → preview działa
- [ ] **Krok 3:** Wgrano EMAIL_4 → preview działa
- [ ] **Krok 3:** Wgrano EMAIL_5 → preview działa
- [ ] **Krok 3:** Wgrano EMAIL_6 → preview działa
- [ ] **Krok 3:** Wgrano EMAIL_7 → preview działa
- [ ] **Krok 4:** Automation `188323759364506811` → status `Active` ✅
- [ ] **Krok 5:** Test klient dodany → pojawił się w MailerLite

---

**Maintained by:** Wojtek (hiline.zerkowski@gmail.com)
