# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🎯 Project Overview

**Hiline Panel Klienta** is a custom CRM (Client Relationship Management) system built for Hiline Wrap & Detailing studio (auto detailing, PPF film application, ceramic coatings). The system solves the core problem: automatic client follow-up after service completion with zero monthly cost.

**Tech stack:** Static HTML/CSS/JS frontend + Netlify Functions serverless backend + MailerLite API for email automations + WhatsApp integration for messaging.

---

## 📁 Architecture & File Structure

### Frontend (Static)
- **`index.html`** — Landing page / public website (basic company info, services overview)
- **`panel.html`** — **Main CRM interface** (client management, service history, team dashboard)
  - Client form with fields: name, email, phone, vehicle info, service type
  - Service type dropdown triggers conditional MailerLite group assignment (powłoka 3-letnia, 5-letnia, PPF, promocje)
  - Client list with WhatsApp integration (`bookVisitWhatsApp()` function)
  - Password-protected access (hardcoded: `Hiline2025`)

### Backend (Netlify Functions)
- **`netlify/functions/subscribe.js`** — **Core API** (handles client registration → MailerLite subscriber sync)
  - Accepts POST from `panel.html` form with: name, email, tel, car, usluga, service_type
  - Maps service_type to MailerLite groups via `SERVICE_GROUPS` object
  - Creates subscribers in MailerLite with custom fields: pojazd, usluga, data_serwisu, powloka
  - CORS headers configured for cross-origin requests
  - Custom fields auto-created in MailerLite on first use (`ensureCustomFields()`)

### Email Templates (MailerLite)
- **`EMAIL_*.html`** (7 files: EMAIL_1 through EMAIL_7)
  - Automated service reminders sent via MailerLite workflows
  - Email 1: Free wash check-in (14 days after service)
  - Emails 2–7: Service reminders at 6, 12, 18, 24, 30, 36 months
  - **Key detail:** All footers updated to "Hiline Wrap & Detailing | Łady Warszawa" (not Ład, Radom)
  - Templates use `{$name}` personalization variable (auto-replaced by MailerLite)

### Configuration & Assets
- **`manifest.json`** — PWA manifest for web app icon (index.html)
- **`manifest-panel.json`** — PWA manifest for panel app icon (panel.html)
- **`icon-192.png`, `icon-512.png`** — App icons
- **`assets/`** — Subdirectory for additional images/resources

### Documentation
- **`MailerLite_Automation_COMPLETED.md`** — Complete automation setup (7 email workflow, 36-month timeline)
- **`mailerlite-automation-instrukcje.md`** — MailerLite workflow instructions
- **`AKTYWACJA_AUTOMATION.txt`** — Activation checklist

---

## 🔗 Key Integrations

### MailerLite API
- **Endpoint:** `https://connect.mailerlite.com/api`
- **Authentication:** Bearer token in `subscribe.js` (line 1)
- **Key functions:**
  - `mlFetch(path, method, body)` — Wrapper for API calls with auth headers
  - `ensureCustomFields()` — Ensures custom fields exist before subscriber creation
- **Custom fields** (auto-created):
  - `pojazd` (text) — vehicle type/brand
  - `usluga` (text) — service name
  - `data_serwisu` (date) — service date
  - `powloka` (text) — coating/guarantee type

### Conditional Group Assignment (SERVICE_GROUPS)
The system routes clients to different MailerLite groups based on service type selected in the panel:
```javascript
SERVICE_GROUPS = {
  'powloka_3letnia': { groups: [ID_3YEAR, ID_PROMO] },   // 3-year coating → 3-year workflow + promotions
  'powloka_5letnia': { groups: [ID_5YEAR, ID_PROMO] },   // 5-year coating → 5-year workflow + promotions
  'folia_ppf': { groups: [ID_PPF, ID_PROMO] },            // PPF film → PPF workflow + promotions
  'promocje': { groups: [ID_PROMO] }                       // Other service → promotions group only
};
```
**Current status:** Group IDs need to be populated from MailerLite dashboard (Settings → Groups).

### WhatsApp Integration
- **Function:** `bookVisitWhatsApp()` in panel.html
- **Mechanism:** Constructs WhatsApp URL with pre-filled message
- **Use case:** "Book a visit" button opens WhatsApp chat with client phone from the client record

### Netlify Deployment
- **Live site:** `hiline-detailing.netlify.app`
- **Panel URL:** `hiline-detailing.netlify.app/panel.html`
- **Serverless functions:** `/.netlify/functions/subscribe` (auto-deployed from `netlify/functions/` directory)

---

## 🛠️ Common Development Tasks

### Adding a New Client (Via Panel)
1. Panel.html form captures: name, email, phone, car, service type, vehicle info
2. `addClientManual()` function sends POST to `/.netlify/functions/subscribe`
3. `subscribe.js` receives data → creates MailerLite subscriber → assigns groups → triggers workflows

### Updating Email Templates
1. Edit `EMAIL_*.html` files (standard HTML email format)
2. Ensure `{$name}` placeholder remains for personalization
3. Footer should always be: `<p>Hiline Wrap & Detailing | Łady Warszawa</p>`
4. Re-upload to MailerLite dashboard (Automations → select workflow → edit email)

### Modifying the Panel Interface
- Edit `panel.html` directly (no build process)
- Key sections:
  - **Client form** (lines ~720–800): Update input fields or validation
  - **Service type dropdown** (lines ~745–751): Add/remove service options here
  - **Client list display** (lines ~900+): Update how clients are rendered
  - **JavaScript functions**: `addClientManual()`, `subscribeToMailerLite()`, `bookVisitWhatsApp()`

### Updating MailerLite Group Mappings
1. Get group IDs from MailerLite: Settings → Groups → copy each group ID
2. Edit `netlify/functions/subscribe.js` lines 6–11 (SERVICE_GROUPS object)
3. Fill in the group IDs for each service type
4. Deploy (Netlify auto-deploys on file change in the repo)

### Testing the Subscribe Function Locally
```bash
# The function is serverless and runs on Netlify
# To test: POST to the deployed endpoint with curl or Postman
curl -X POST https://hiline-detailing.netlify.app/.netlify/functions/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "tel": "+48123456789",
    "car": "Audi A4",
    "usluga": "Ceramic Coating",
    "service_type": "powloka_3letnia"
  }'
```

---

## 🔐 Security & Credentials

- **Panel password:** Hardcoded in `panel.html` (line ~740) as `Hiline2025`
  - ⚠️ **Not production-secure.** For public use, implement proper authentication (e.g., OAuth, JWT).
  
- **MailerLite API token:** Stored in `subscribe.js` line 1
  - ⚠️ **Exposed in front-end code.** For production, move to environment variables (`process.env.MAILERLITE_TOKEN`).
  - Currently used with Netlify Functions (server-side execution) so limited exposure, but refactor recommended.

- **WhatsApp integration:** Uses unencrypted URL scheme (`wa.me/`). Messages are not encrypted end-to-end outside of WhatsApp app.

---

## 📊 MailerLite Workflow Details

**Current setup:** 7-email automation triggered when client joins the "Klienci Hiline" group (ID: `187079609224791396`).

**Timeline:**
- Day 0: Client added to group
- Day 14: Email 1 (free wash check-in)
- Day 194: Email 2 (6-month service reminder)
- Day 374: Email 3 (12-month service reminder)
- Day 554: Email 4 (18-month check)
- Day 734: Email 5 (24-month service)
- Day 914: Email 6 (30-month warning — warranty ending soon)
- Day 1094: Email 7 (36-month — warranty ended, upsell new coating)

**Status:** Automation created and awaiting activation in MailerLite dashboard.

---

## 🚀 Deployment Workflow

1. **Local development:** Edit `.html` and `.js` files directly
2. **Test changes:** Use browser dev tools or deploy to a staging branch
3. **Deploy to production:**
   - Push changes to the connected Netlify repo (auto-deploy enabled)
   - Netlify Functions auto-deploy from `netlify/functions/` directory
   - Static files auto-deploy from root directory
   - Live at: `hiline-detailing.netlify.app`

4. **Monitor function:** Check Netlify dashboard → Functions → subscribe → logs for errors

---

## 📝 Important Notes

- **No build system:** Project uses vanilla HTML/CSS/JS. No npm, webpack, or build step required.
- **CORS handling:** Netlify Functions automatically handle CORS for API calls from `panel.html`.
- **Timezone:** Email automation timing uses MailerLite's default timezone (verify in MailerLite Settings → Timezone).
- **Custom field types:** MailerLite supports text, number, date. All Hiline custom fields are text except `data_serwisu` (date).
- **Unsubscribe link:** MailerLite requires `{$unsubscribe}` link in email footer (GDPR compliance). Already configured in email templates.

---

## 🔄 Common Git Workflows

```bash
# View file history (to understand what changed)
git log -p netlify/functions/subscribe.js

# Check deployment status
git log --oneline -10  # Last 10 commits (helps confirm Netlify deployed the right version)
```

---

**Last updated:** 2026-05-24  
**Maintained by:** Wojtek (hiline.zerkowski@gmail.com)
