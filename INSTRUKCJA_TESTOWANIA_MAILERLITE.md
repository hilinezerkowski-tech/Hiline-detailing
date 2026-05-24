# 🧪 Instrukcja testowania integracji CRM ↔ MailerLite

## Co się zmieniło

✅ **panel.html**
- `subscribeToMailerLite()` teraz wysyła: name, email, tel, car, usluga, service_type
- `addClientManual()` przesyła pełne dane z formularza
- Naprawiony bug w `bookVisitWhatsApp()` (używał niezdefiniowanej zmiennej)

✅ **subscribe.js**
- Lepszy error handling i walidacja JSON
- Lepszy logging (console.log pokazuje co się wysyła)
- Mapowanie service_type na powłokę
- Zwraca gruppy w response'ie

---

## 🚀 Jak wdrożyć

### Krok 1: Wrzucić zmianę na git (jeśli używasz)
```bash
cd C:\Users\Hyperbook\Desktop\Hiline Panel Klienta
git add panel.html netlify/functions/subscribe.js
git commit -m "Fix: Pełna synchronizacja danych z MailerLite + bug fix bookVisitWhatsApp"
git push origin main
```

> Netlify auto-deployuje przy push → czeka ~1-2 min

### Krok 2: Jeśli nie masz gita
- Zaloguj się na https://netlify.com
- Zvolij `hiline-detailing` projekt
- Wrzuć pliki przez dashboard (Deploys → Manual deploy)

---

## ✅ Jak testować

### Test 1: Dodać klienta przez panel
1. Otwórz https://hiline-detailing.netlify.app/panel.html
2. Hasło: `Hiline2025`
3. Kliknij **+ Dodaj klienta**
4. Wypełnij:
   - **Imię i Nazwisko:** `Jan Testowy`
   - **Telefon:** `+48 600 000 000`
   - **Email:** `jan.testowy@example.com`
   - **Pojazd:** `BMW X5 2021`
   - **Usługa:** `Powłoka ceramiczna`
   - **Typ Powłoki:** `Powłoka ceramiczna 3-letnia`
5. Kliknij **+ Dodaj klienta**

### Test 2: Sprawdzić console (Developer Tools)
1. Otwórz **F12** → **Console**
2. Szukaj logów:
   ```
   ✓ Dodano do MailerLite (ID: xxxxxx)
   ✓ Dane zsynchronizowane: jan.testowy@example.com
   ```

### Test 3: Sprawdzić Netlify Logs
1. https://app.netlify.com/ → hiline-detailing
2. Functions → subscribe → Logs
3. Szukaj:
   ```
   📤 Wysyłam do MailerLite: {email, name, tel, car, usluga, ...}
   ✅ Subscriber saved: [ID] Email: jan.testowy@example.com Grupy: [...]
   ```

### Test 4: Sprawdzić MailerLite
1. Zaloguj się na https://mailerlite.com → Dashboard
2. Subscribers → szukaj `jan.testowy@example.com`
3. Sprawdź czy:
   - ✅ Subscriber istnieje
   - ✅ Custom fields są wypełnione (Pojazd, Usługa, Data serwisu, Powłoka)
   - ✅ Subscriber jest w poprawnych grupach (np. "Powłoka 3-letnia", "Promocje", "Klienci Hiline")

---

## 🐛 Jeśli coś nie działa

### Subscriber nie pojawia się w MailerLite
**Sprawdzić w console (F12):**
```
✗ Błąd MailerLite: [komunikat błędu]
✗ Błąd wysyłki do MailerLite: [błąd sieci]
```

**Możliwe powody:**
- ❌ Token JWT wygasł - idź do subscribe.js, pobierz nowy token z MailerLite
- ❌ Grupy nie istnieją - idź do subscribe.js, zaktualizuj GROUP IDs
- ❌ CORS error - sprawdzić czy Netlify Function ma CORS headers

### Subscriber pojawia się ale bez danych
- ❌ Custom fields mogą być puste
- Rozwiązanie: Sprawdzić czy `ensureCustomFields()` pracuje (check Netlify logs)

### bookVisitWhatsApp() nie działa
- Teraz powinno działać - naprawiłem bug
- Przetestuj: otwórz klienta w panelu → kliknij "📅 Umów wizytę"

---

## 📊 Pełny flow po naprawie

```
Panel: Formularz dodaj klienta
   ↓
addClientManual() zbiera: name, tel, email, car, usluga, powloka
   ↓
Zapisz do localStorage (widoczne od razu w tabeli)
   ↓
subscribeToMailerLite(name, email, tel, car, usluga, serviceType)
   ↓
POST do /.netlify/functions/subscribe
   ↓
subscribe.js:
  - Upewnia się custom fields istnieją
  - Mapuje service_type → grupy MailerLite
  - Tworzy payload ze wszystkimi danymi
  - POST do https://connect.mailerlite.com/api/subscribers
   ↓
MailerLite:
  - Tworzy subscriber
  - Przypisuje do grup (3-letnia, 5-letnia, PPF, Promocje, Klienci Hiline)
  - Uruchamia automatyzacje (emaile o przypomnień)
   ↓
✅ Subscriber ma harmonogram emaili przez 36 miesięcy
```

---

## 🎯 Jeśli wszystko działa ✅

Możesz teraz:
1. ✅ Dodawać klientów normalnie
2. ✅ Dane się automatycznie synchronizują z MailerLite
3. ✅ Klienci dostają emaile przypomnienia z harmonogramu
4. ✅ WhatsApp integracja działa (przycisk "Umów wizytę")
5. ✅ CSV export zawiera wszystkie dane

---

**Pytania?** Sprawdź Netlify logs lub console w F12
