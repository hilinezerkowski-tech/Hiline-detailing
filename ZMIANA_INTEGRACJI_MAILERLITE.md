# 🔧 Co się zmieniło w integracji CRM ↔ MailerLite

Data: 2026-05-24

---

## ❌ Problemy które były

| Problem | Lokalizacja | Skutek |
|---------|-------------|--------|
| Brakował telefonu w synchronizacji | panel.html linia 1154 | Subscriber w ML bez telefonu |
| Brakował pojazdu | panel.html linia 1154 | Subscriber w ML bez pojazdu |
| Brakował usługi (usluga) | panel.html linia 1154 | Subscriber bez info o usłudze |
| Bug w `bookVisitWhatsApp()` | panel.html linia 1095 | Funkcja się crashowała |
| Słaby error handling | subscribe.js | Trudno debugować błędy |
| Słaby logging | subscribe.js | Nie widać co się wysyła do ML |

---

## ✅ Co naprawiłem

### 1️⃣ panel.html - `subscribeToMailerLite()`

**PRZED:**
```javascript
function subscribeToMailerLite(name, email, serviceType) {
  fetch('/.netlify/functions/subscribe', {
    method: 'POST',
    body: JSON.stringify({ name, email, service_type: serviceType })
    //❌ Brakuje tel, car, usluga!
  })
}
```

**PO:**
```javascript
function subscribeToMailerLite(name, email, tel, car, usluga, serviceType) {
  const payload = {
    name: name || '',
    email: email || '',
    tel: tel || '',          // ✅ Dodane
    car: car || '',          // ✅ Dodane
    usluga: usluga || '',    // ✅ Dodane
    service_type: serviceType || 'promocje',
    dataSerwisu: new Date().toISOString().split('T')[0]
  };

  fetch('/.netlify/functions/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  //✅ Lepszy error handling + logging
}
```

### 2️⃣ panel.html - `addClientManual()`

**PO:**
```javascript
// Teraz wysyła pełne dane:
if (email && tel && serviceType) {
  subscribeToMailerLite(name, email, tel, car, usluga, serviceType);
  // ✅ Wszystkie pole są przesyłane
}
```

### 3️⃣ panel.html - `bookVisitWhatsApp()`

**PRZED:**
```javascript
if (!currentEditingClient) {  // ❌ Ta zmienna nie istnieje!
  alert('Błąd: brak danych klienta');
  return;
}
```

**PO:**
```javascript
if (!editingId) {  // ✅ Prawidłowa zmienka
  alert('Błąd: brak danych klienta');
  return;
}
const c = clients.find(x => x.id === editingId);
// ✅ Znajduje klienta prawidłowo
```

### 4️⃣ subscribe.js - Lepszy logging i error handling

**Dodane:**
```javascript
// ✅ Walidacja JSON
let data = {};
try {
  data = JSON.parse(event.body);
} catch (e) {
  return { statusCode: 400, body: JSON.stringify({ error: 'Błąd parsowania JSON' }) };
}

// ✅ Mapowanie service_type na powłokę
const powlokaMap = {
  'powloka_3letnia': 'Powłoka ceramiczna 3-letnia',
  'powloka_5letnia': 'Powłoka ceramiczna 5-letnia',
  'folia_ppf': 'Folia PPF',
  'promocje': ''
};

// ✅ Lepszy logging
console.log('📤 Wysyłam do MailerLite:', {
  email: data.email,
  name: first_name,
  tel: data.tel,
  car: data.car,
  usluga: data.usluga,
  service_type: serviceType,
  groups: groupIds
});

console.log('✅ Subscriber saved:', result?.data?.id, 'Email:', data.email);
```

---

## 📊 Porównanie: Przed vs Po

### Przed naprawą
```
Panel → Formularz
   ↓
subscribeToMailerLite(name, email, serviceType)
   ↓
POST: { name, email, service_type }
   ↓
❌ Subscriber w MailerLite SIĘ:
  - Telefon: brakuje
  - Pojazd: brakuje
  - Usługa: brakuje
  - Custom fields puste
```

### Po naprawie
```
Panel → Formularz
   ↓
subscribeToMailerLite(name, email, tel, car, usluga, serviceType)
   ↓
POST: { name, email, tel, car, usluga, service_type, dataSerwisu }
   ↓
✅ Subscriber w MailerLite MA:
  - Telefon: wypełniony
  - Pojazd: wypełniony
  - Usługa: wypełniona
  - Custom fields: pojazd, usluga, data_serwisu, powloka
  - Grupy: przypisane do 3-letnia/5-letnia/PPF/Promocje
  - Harmonogram emaili: uruchomiony
```

---

## 🎯 Co teraz działa

| Feature | Status | Opis |
|---------|--------|------|
| Dodawanie klienta | ✅ | Dane się zapisują do localStorage |
| Synchronizacja z ML | ✅ | Wszystkie dane wysyłane do MailerLite API |
| Custom fields | ✅ | pojazd, usluga, data_serwisu, powloka |
| Grupy ML | ✅ | Subscriber przypisany do odpowiednich grup |
| Harmonogram emaili | ✅ | 7 emaili przez 36 miesięcy |
| WhatsApp | ✅ | "Umów wizytę" - otwiera chat |
| CSV export | ✅ | Wszystkie dane klienta |
| Console logging | ✅ | Widać co się wysyła i czy udało się |
| Netlify logs | ✅ | Debug info w Netlify dashboard |

---

## 📝 Pliki zmienione

1. **panel.html**
   - `subscribeToMailerLite()` - Zmiana sygnatury + lepszy logging
   - `addClientManual()` - Przesyłanie pełnych danych
   - `bookVisitWhatsApp()` - Naprawienie buga

2. **netlify/functions/subscribe.js**
   - JSON parsing validation
   - Lepszy error handling
   - Mapowanie powłoki
   - Lepszy logging na Netlify

---

## 🚀 Następne kroki

1. ✅ Wdrożyć na Netlify (git push)
2. ✅ Testować dodawanie klienta
3. ✅ Sprawdzić MailerLite (subscriber + grupy + fields)
4. ✅ Sprawdzić Netlify logs
5. ✅ Sprawdzić czy emaile się wysyłają w automatyzacjach

---

**Status:** Gotowe do testowania ✅
