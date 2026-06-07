# 📊 Hiline — Status wdrożenia mailingu

**Aktualizacja:** 2026-06-06 (sesja Claude: wgranie treści emaili 5-letnia + PPF, weryfikacja maila powitalnego)

---

## ✅ Co działa / jest gotowe

| Element | Status | Szczegóły |
|---|---|---|
| Deploy Netlify | ✅ | hiline-detailing.netlify.app |
| Funkcja subscribe | ✅ | `netlify/functions/subscribe.js`, token w env |
| Mapowanie usługa → grupy | ✅ zweryfikowane | ID grup w kodzie = triggery automatyzacji |
| **Automatyzacja CERAMIKA** (3-letnia) | ✅ gotowa | 7 maili zaprojektowanych, test OK — **czeka na Twoje kliknięcie „Aktywuj"** |
| **Mail powitalny** | ✅ działa | Wysłany 12× — ma przycisk „WYSTAW OPINIĘ W GOOGLE" ✓ |
| **Google Reviews link** | ✅ znaleziony | `https://g.page/r/CXj9sao2d1xQEBM/review` |
| **5-letnia: 11 emaili** | ✅ treść wgrana | Tematy + plain text ustawione przez API |
| **PPF: 7 emaili** | ✅ treść wgrana | Tematy + plain text ustawione przez API |

---

## ⏳ Do zrobienia przez CIEBIE (ręcznie w dashboardzie)

### KROK 1 — Aktywuj ceramikę ⭐ priorytet (2 min)
1. Wejdź: https://dashboard.mailerlite.com/automations/188323759364506811
2. Prawy górny róg → **„Aktywuj"** → potwierdź

### KROK 2 — Zaprojektuj emaile 5-letniej (11 emaili, ~25 min)
Teksty są wgrane przez API (tematy + treść). Musisz je „zaprojektować" w edytorze blokowym.

**Dla każdego emaila w automatyzacji:**
1. Wejdź: https://dashboard.mailerlite.com/automations/189005604721788905/edit
2. Kliknij email step → „Edytuj zawartość"
3. W edytorze blokowym dodaj blok tekstowy → wklej treść z pliku `MAILE_5letnia_i_PPF.md`
4. Zapisz

> 💡 **Skrót:** Skopiuj layout z ceramiki (gotowy email) → podmień tylko tekst. 5× szybciej.

### KROK 3 — Zaprojektuj emaile PPF (7 emaili, ~15 min)
Tak samo jak wyżej.
1. Wejdź: https://dashboard.mailerlite.com/automations/189005678772225985/edit

### KROK 4 — Popraw temat maila powitalnego (2 min)
Temat jest nadal "Welcome email" zamiast "Dziękujemy za wizytę w Hiline! 🚗"
1. Wejdź: https://dashboard.mailerlite.com/automations/187079518464246980/edit
2. Kliknij „Wstrzymaj" (żeby wyjść z trybu podglądu)
3. Kliknij email → edytuj temat → wpisz: `Dziękujemy za wizytę w Hiline! 🚗`
4. Zapisz → „Aktywuj" ponownie

---

## 📌 Mapowanie grup (do wglądu)

| Usługa (`service_type`) | Grupa MailerLite | Automatyzacja |
|---|---|---|
| `powloka_3letnia` | 188330160868558362 „Powłoka 3-letnia" | Ceramika (188323759364506811) |
| `powloka_5letnia` | 188330170388580174 „Powłoka 5-letnia" | 5-letnia (189005604721788905) |
| `folia_ppf` | 188330178207811581 „Folia PPF" | PPF (189005678772225985) |
| wszystkie | 188330186222077064 „Promocje" + 187079609224791396 „Klienci Hiline" | — |

---

## 🔗 Ważne linki

- Panel: https://hiline-detailing.netlify.app/panel.html (hasło: `Hiline2025`)
- Google Reviews: `https://g.page/r/CXj9sao2d1xQEBM/review`
- MailerLite dashboard: https://dashboard.mailerlite.com/automations

---

**Maintained by:** Wojtek (hiline.zerkowski@gmail.com)
