# Hiline — Automation MailerLite: Instrukcje dla Claude in Chrome

## Co masz zrobić
Skonfiguruj automation "Prosta wiadomość powitalna 2" w MailerLite dla studia Hiline Wrap & Detailing.
Automation jest już częściowo zbudowana. Musisz skonfigurować każdy email i upewnić się że opóźnienia są poprawne.

---

## Struktura automation (sprawdź i popraw jeśli trzeba)

```
TRIGGER: Dołączono do grupy "Klienci Hiline"
  ↓
OPÓŹNIENIE: 14 dni
  ↓
EMAIL 1: Darmowe mycie sprawdzające
  ↓
OPÓŹNIENIE: 5 miesięcy i 2 tygodnie (razem z pierwszym = 6 miesięcy od startu)
  ↓
EMAIL 2: Przypomnienie 6 miesięcy
  ↓
OPÓŹNIENIE: 6 miesięcy
  ↓
EMAIL 3: Przypomnienie 12 miesięcy (roczny serwis)
  ↓
OPÓŹNIENIE: 6 miesięcy
  ↓
EMAIL 4: Przypomnienie 18 miesięcy
  ↓
OPÓŹNIENIE: 6 miesięcy
  ↓
EMAIL 5: Przypomnienie 24 miesiące (2 lata)
  ↓
OPÓŹNIENIE: 6 miesięcy
  ↓
EMAIL 6: Przypomnienie 30 miesięcy
  ↓
OPÓŹNIENIE: 6 miesięcy
  ↓
EMAIL 7: Koniec gwarancji — propozycja nowej powłoki (36 miesięcy)
```

---

## Treści emaili

### EMAIL 1 — Darmowe mycie sprawdzające (14 dni)
**Temat:** 🎁 Twoje bezpłatne mycie sprawdzające czeka — Hiline
**Treść:**
```
Cześć {$name}!

Dziękujemy za zaufanie i wybór Hiline Wrap & Detailing.

Pamiętaj, że w ciągu 2 tygodni od aplikacji powłoki przysługuje Ci bezpłatne mycie sprawdzające — sprawdzamy stan powłoki i dbamy o to, żeby wszystko było perfekcyjne.

📞 Zadzwoń lub napisz żeby umówić termin.

Do zobaczenia!
Zespół Hiline
```

---

### EMAIL 2 — 6 miesięcy
**Temat:** ⏰ Minęło 6 miesięcy — czas na serwis powłoki
**Treść:**
```
Cześć {$name}!

Minęło już 6 miesięcy od aplikacji powłoki w Twoim pojeździe.

To idealny moment na kontrolne mycie detailingowe, które:
✅ Usuwa zanieczyszczenia chemiczne
✅ Sprawdza stan powłoki
✅ Przedłuża jej żywotność

Umów się na wizytę — zadbamy o Twoje auto!

Zespół Hiline Wrap & Detailing
```

---

### EMAIL 3 — 12 miesięcy (roczny serwis)
**Temat:** 🗓️ Roczny serwis powłoki — Hiline
**Treść:**
```
Cześć {$name}!

Rok za Wami — czas na roczny przegląd powłoki ceramicznej!

Regularna konserwacja to klucz do zachowania efektu "świeżej powłoki" przez kolejne lata. Nasz serwis roczny obejmuje dokładne mycie, kontrolę stanu powłoki i aplikację top coatu.

📞 Zadzwoń i umów termin.

Zespół Hiline
```

---

### EMAIL 4 — 18 miesięcy
**Temat:** Sprawdzenie stanu powłoki — 18 miesięcy
**Treść:**
```
Cześć {$name}!

Minęło 1,5 roku od aplikacji powłoki w Twoim pojeździe.

Warto umówić się na kontrolne mycie i ocenę stanu powłoki. Dzięki temu mamy pewność, że powłoka pracuje prawidłowo i chroni lakier.

Zapraszamy!
Zespół Hiline Wrap & Detailing
```

---

### EMAIL 5 — 24 miesiące (2 lata)
**Temat:** 2 lata minęły — serwis powłoki ceramicznej
**Treść:**
```
Cześć {$name}!

Już 2 lata Twoja powłoka ceramiczna chroni lakier pojazdu. 

Gratulujemy dbałości o auto! Czas na serwis "mid-life" — kompleksowe mycie detailingowe z oceną stanu powłoki i ewentualnym uzupełnieniem ochrony.

📞 Umów się już dziś.

Zespół Hiline
```

---

### EMAIL 6 — 30 miesięcy
**Temat:** Zbliżamy się do końca gwarancji — Hiline
**Treść:**
```
Cześć {$name}!

Za pół roku kończy się okres gwarancji Twojej powłoki ceramicznej.

To dobry moment na ocenę stanu i decyzję o odnowieniu powłoki. Chętnie doradzimy — zadzwoń lub napisz, a przygotujemy ofertę dopasowaną do Twojego pojazdu.

Zespół Hiline Wrap & Detailing
```

---

### EMAIL 7 — 36 miesięcy (koniec gwarancji)
**Temat:** ⭐ Koniec gwarancji — propozycja nowej powłoki ceramicznej
**Treść:**
```
Cześć {$name}!

Twoja 3-letnia powłoka ceramiczna właśnie kończy okres gwarancji.

Dla lojalnych klientów Hiline mamy specjalną ofertę na odnowienie powłoki — zapytaj nas o aktualny rabat!

Nowa powłoka to:
✅ Kolejne 3 lub 5 lat ochrony lakieru
✅ Efekt "mokrego" wyglądu
✅ Łatwość utrzymania czystości

📞 Zadzwoń: [NUMER TELEFONU]
✉️ Napisz: hiline.zerkowski@gmail.com

Do zobaczenia w Hiline!
Zespół Hiline Wrap & Detailing
```

---

## Kroki do wykonania w MailerLite

1. Kliknij **E-mail 1** → skonfiguruj temat i treść z EMAIL 1 powyżej
2. Kliknij **E-mail 2** → skonfiguruj z EMAIL 2
3. Kontynuuj dla każdego emaila
4. Sprawdź opóźnienia:
   - Opóźnienie 1: **14 dni**
   - Opóźnienie 2: **6 miesięcy** (od EMAIL 1)
   - Opóźnienie 3: **6 miesięcy**
   - Opóźnienie 4: **6 miesięcy**
   - Opóźnienie 5: **6 miesięcy**
   - Opóźnienie 6: **6 miesięcy**
   - Opóźnienie 7: **6 miesięcy**
5. Nazwij automation: **"Hiline — Przypomnienia serwisowe ceramika"**
6. Kliknij **Zapisz**
7. Kliknij **Aktywuj**

---

## Ważne
- Użyj `{$name}` jako personalizacja imienia
- Grupą triggerującą jest: **Klienci Hiline**
- Po aktywacji automation będzie działać dla NOWYCH klientów (tych co się dopiero zarejestrują)
