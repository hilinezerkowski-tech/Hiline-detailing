# 📊 Hiline — Status wdrożenia mailingu

**Aktualizacja:** 2026-05-25, ostatni audyt przez Claude

---

## ✅ Co już działa (sprawdzone bezpośrednio)

| # | Element | Status | Jak sprawdzone |
|---|---------|--------|---------------|
| 1 | **Deploy na Netlify** | ✅ Działa | Hero photo `hero-hiline.jpg` ładuje się pod publicznym URL |
| 2 | **MAILERLITE_TOKEN w env** | ✅ Skonfigurowany | Testowy POST do `/.netlify/functions/subscribe` zwrócił 200 + sukces |
| 3 | **Funkcja subscribe** | ✅ Działa end-to-end | Testowy subscriber utworzony (i potem usunięty) — ID: `188414042505742286` |
| 4 | **Mapowanie service_type → grupy** | ✅ Działa | Test wpadł do `Promocje` + `Klienci Hiline` |
| 5 | **Custom fields w MailerLite** | ✅ Auto-tworzą się | pojazd, usluga, data_serwisu, powloka |
| 6 | **Automation 188323759364506811** | ✅ Istnieje, 14 kroków | Posprzątane z duplikatów |
| 7 | **Subjecty 7 emaili** | ✅ Zaktualizowane | Przez MailerLite API, z emoji |
| 8 | **Szablony EMAIL_*.html** | ✅ Gotowe | 7 plików, table-based, hero z URL z Netlify |

---

## ⏳ Co zostało do zrobienia (po Twojej stronie, ~15 min)

### KROK A — Wgranie HTML do 7 emaili w MailerLite

👉 https://dashboard.mailerlite.com/automations/188323759364506811/edit

Dla **każdego z 7 emaili** (Email 1 → Email 7):

1. Kliknij blok email-a w workflow → otworzy się panel z prawej
2. Kliknij **„Stwórz wiadomość"** (przycisk pod "Treść wiadomości")
3. **WAŻNE:** Na ekranie wyboru edytora wybierz **„Niestandardowy edytor HTML"** (prawa kolumna, ikona z kodem `<>`) — **NIE** „Prosty edytor" ani „Edytor Drag & Drop"
4. Otwórz w drugiej zakładce odpowiedni plik `EMAIL_X_*.html` z folderu projektu, Ctrl+A, Ctrl+C
5. Wklej HTML w edytor MailerLite (Ctrl+V)
6. Kliknij **„Dalej"** (prawy górny) → MailerLite zrobi preview
7. Kliknij **„Zapisz i wyjdź"**
8. Wróć do workflow, kliknij następny email-step

#### Mapowanie plik → krok automationu:

| Krok | Subject (już zaktualizowany) | Plik HTML |
|------|------------------------------|-----------|
| Email 1 | 🎁 Twoje bezpłatne mycie sprawdzające czeka | `EMAIL_1_Darmowe_mycie.html` |
| Email 2 | 6 miesięcy z powłoką — czas na kontrolę | `EMAIL_2_6_miesiecy.html` |
| Email 3 | Roczny serwis powłoki ceramicznej | `EMAIL_3_12_miesiecy.html` |
| Email 4 | Kontrola 18-miesięczna Twojej powłoki | `EMAIL_4_18_miesiecy.html` |
| Email 5 | Serwis 2-letni — mid-life Twojej powłoki | `EMAIL_5_24_miesiecy.html` |
| Email 6 | ⚠️ Zbliża się koniec gwarancji powłoki | `EMAIL_6_30_miesiecy.html` |
| Email 7 | ⭐ Koniec gwarancji — odbierz rabat -15% | `EMAIL_7_36_miesiecy.html` |

> ⚠️ **Uwaga dla Emaila 1:** Próbowałem wgrać HTML przez bota i niechcący wybrałem **Prosty Edytor** zamiast HTML. W MailerLite zobaczysz pusty Simple Editor. Trzeba:
> - W Simple Editorze poszukać opcji „Zmień edytor" w menu (3 kropki w prawym górnym)
> - **LUB** jeśli się nie da: usuń całe pole „Treść wiadomości" przyciskiem kosza w prawym górnym panelu emaila, kliknij ponownie „Stwórz wiadomość" i tym razem wybierz **Niestandardowy edytor HTML**

### KROK B — Aktywacja automationu

1. Po wgraniu wszystkich 7 HTML — czerwone wykrzykniki przy emailach znikną
2. W prawym górnym rogu workflow kliknij zielony przycisk **„Aktywuj"**
3. Potwierdź w popupie

### KROK C — Test end-to-end (5 min)

1. Otwórz https://hiline-detailing.netlify.app/panel.html (hasło: `Hiline2025`)
2. Dodaj klienta:
   - Imię: `Test Wojtek`
   - Email: **Twój prywatny email** (nie biuro@hiline.pl)
   - Telefon: `+48 500 000 000`
   - Pojazd: `Test Audi A4`
   - Typ usługi: `Powłoka ceramiczna 3-letnia`
3. Otwórz F12 → Console — powinno być `✓ Dodano do MailerLite (ID: xxxxx)`
4. Zaloguj się do MailerLite → Subscribers → znajdź swój testowy email
5. ✅ Sprawdź czy ma 3 grupy: `Klienci Hiline` + `Powłoka 3-letnia` + `Promocje`
6. ✅ Sprawdź czy ma custom fields: `pojazd=Test Audi A4`, `usluga=Powłoka...`, itd.
7. Email 1 dotrze za 14 dni — jeśli chcesz testowo wcześniej, w MailerLite zmień Opóźnienie czasowe 1 z `14 dni` na `1 minutę`, dodaj klienta i przywróć potem na 14

---

## 🛡️ Ważne — bezpieczeństwo

W pliku `subscribe.js` w katalogu głównym projektu jest hardkodowany stary token MailerLite. **Plik ten nie jest używany przez Netlify** (używany jest `netlify/functions/subscribe.js`), ale dla porządku/bezpieczeństwa warto:

```bash
cd "C:\Users\Hyperbook\Desktop\Hiline Panel Klienta"
git rm subscribe.js
git commit -m "Usuń stary subscribe.js z tokenem"
git push
```

Stary token i tak należałoby wycofać w MailerLite → Developer API → Manage tokens.

---

## 📞 Co dalej (poza tym wdrożeniem)

1. **Druga automatyzacja dla PPF** — folia PPF ma inny cykl serwisu niż ceramika
2. **Newsletter promocyjny** — grupa „Promocje" na razie pusta workflow-wo
3. **Własna domena `hiline.pl`** — pozwala na łatwiejszą konfigurację SPF/DKIM (lepsza dostarczalność)
4. **Migracja z localStorage** — baza klientów w panelu siedzi w localStorage przeglądarki, znika przy czyszczeniu cache. Rozwiązanie: Supabase Free Tier

---

**Maintained by:** Wojtek (hiline.zerkowski@gmail.com)
