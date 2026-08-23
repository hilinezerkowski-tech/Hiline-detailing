# Ebooki w mailach powitalnych — instrukcja wdrożenia

Stan: 4 gotowe PDF-y leżą w folderze `ebooki/` strony. Zostały 2 kroki: **deploy** i **przyciski w MailerLite**.

---

## Krok 1 — Deploy na Netlify (2 minuty)

PDF-y są już w folderze `Hiline Panel Klienta\ebooki\`. Żeby linki zaczęły działać:

1. Uruchom `COMMIT-I-DEPLOY.bat` (tak jak przy każdej zmianie na stronie).
2. Po deployu sprawdź w przeglądarce pierwszy link z tabeli poniżej — PDF powinien się otworzyć.

## Linki do ebooków (po deployu)

| Grupa klienta | Link do wklejenia w mailu |
|---|---|
| Powłoka 3-letnia | `https://hiline-detailing.netlify.app/ebooki/hiline-poradnik-powloka-3letnia.pdf` |
| Powłoka 5-letnia | `https://hiline-detailing.netlify.app/ebooki/hiline-poradnik-powloka-5letnia.pdf` |
| Folia PPF | `https://hiline-detailing.netlify.app/ebooki/hiline-poradnik-ppf.pdf` |
| Detailing / pozostali | `https://hiline-detailing.netlify.app/ebooki/hiline-poradnik-detailing.pdf` |

---

## Krok 2 — Przycisk w MailerLite (ok. 3 min na mail)

Do którego maila dodać przycisk:

| Automatyzacja | Mail | Ebook |
|---|---|---|
| Powłoka 3-letnia (serwisowa) | Mail powitalny (EMAIL_0_Powitalny) | powloka-3letnia |
| Powłoka 5-letnia (ID 189005604721788905) | E-mail 1 — „Twoje bezpłatne mycie sprawdzające czeka” (14 dni) | powloka-5letnia |
| Folia PPF (ID 189005678772225985) | E-mail 1 — „Twoja folia PPF po aplikacji” (14 dni) | ppf |
| Mail powitalny „Klienci Hiline” (MailerLite) | Mail powitalny | detailing |

W edytorze blokowym (Drag & Drop), dla każdego maila:

1. Otwórz automatyzację → krok z mailem → **Edytuj wiadomość**.
2. Z panelu bloków przeciągnij **Przycisk (Button)** pod główny tekst (nad przycisk WhatsApp).
3. Ustawienia przycisku:
   - Tekst: `POBIERZ PORADNIK PIELĘGNACJI (PDF)`
   - Link: odpowiedni adres z tabeli wyżej
   - Kolor tła: `#C41E3A`, tekst: biały, wersaliki — spójnie z resztą maila
4. Nad przyciskiem możesz dodać krótki blok tekstu:
   > **Prezent na start:** przygotowaliśmy dla Ciebie poradnik, jak dbać o Twoje zabezpieczenie — konkretnie i bez lania wody. Pobierz i zajrzyj przed pierwszym myciem.
5. Zapisz. Gotowe — nowi klienci z tej grupy dostają ebooka automatycznie.

---

## Snippet HTML (do plików EMAIL_*.html w folderze)

Jeśli będziesz aktualizować źródłowe pliki HTML maili, wklej ten blok przed sekcją CTA WhatsApp (podmień `LINK`):

```html
<tr>
  <td align="center" class="px" style="padding: 8px 40px 8px 40px;">
    <p style="margin:0 0 12px 0; font-size:15px; line-height:24px; color:#2C2C2C;">
      <strong>Prezent na start:</strong> poradnik, jak dbać o Twoje zabezpieczenie.
    </p>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="btn">
      <tr>
        <td align="center" bgcolor="#C41E3A" style="border-radius:4px;">
          <a href="LINK" target="_blank"
             style="display:inline-block; padding:14px 30px; font-family:'Helvetica Neue', Arial, sans-serif; font-size:14px; font-weight:700; color:#FFFFFF; text-decoration:none; letter-spacing:0.5px; border-radius:4px; text-transform:uppercase;">
            Pobierz poradnik (PDF)
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>
```

---

## Uwagi

- MailerLite **nie obsługuje załączników** — link do PDF-a na Twoim Netlify to standardowe i lepsze rozwiązanie (mail lżejszy, nie wpada do spamu, PDF możesz podmienić bez ruszania maila).
- Chcesz coś zmienić w treści ebooka? Generator (`generate.py`) jest zachowany — jedna poprawka i nowe PDF-y w minutę, linki zostają te same.
