// ============================================================
// HILINE CRM — wspólna baza klientów (Supabase przez Netlify Function)
// Klucze trzymane WYŁĄCZNIE w zmiennych środowiskowych Netlify:
//   SUPABASE_URL          — adres projektu, np. https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY  — klucz service_role (Settings -> API)
//   PANEL_TOKEN           — hasło panelu (to samo, które wpisuje zespół)
// ============================================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const PANEL_TOKEN = process.env.PANEL_TOKEN;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-panel-token',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

// Wywołanie Supabase REST API (PostgREST) z kluczem serwisowym
async function sb(path, method, body, extraHeaders) {
  const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
    method: method || 'GET',
    headers: Object.assign({
      'apikey': SERVICE_KEY,
      'Authorization': 'Bearer ' + SERVICE_KEY,
      'Content-Type': 'application/json'
    }, extraHeaders || {}),
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + text);
  return text ? JSON.parse(text) : null;
}

exports.handler = async function (event) {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  // Czy funkcja jest skonfigurowana? (env vars ustawione w Netlify)
  if (!SUPABASE_URL || !SERVICE_KEY || !PANEL_TOKEN) {
    return { statusCode: 503, headers: CORS, body: JSON.stringify({ error: 'not_configured' }) };
  }

  // Autoryzacja: nagłówek x-panel-token musi zgadzać się z PANEL_TOKEN
  const token = event.headers['x-panel-token'] || event.headers['X-Panel-Token'];
  if (token !== PANEL_TOKEN) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'unauthorized' }) };
  }

  try {
    // GET — pobierz wszystkich klientów (najnowsi pierwsi)
    if (event.httpMethod === 'GET') {
      const rows = await sb('klienci?select=dane&order=updated_at.desc');
      return { statusCode: 200, headers: CORS, body: JSON.stringify(rows.map(r => r.dane)) };
    }

    // POST — upsert listy klientów (zapis pojedynczy i masowa migracja)
    if (event.httpMethod === 'POST') {
      const list = JSON.parse(event.body || '[]');
      if (!Array.isArray(list) || list.length === 0) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'empty_payload' }) };
      }
      const rows = list
        .filter(c => c && c.id)
        .map(c => ({ id: String(c.id), dane: c, updated_at: new Date().toISOString() }));
      await sb('klienci?on_conflict=id', 'POST', rows, { 'Prefer': 'resolution=merge-duplicates,return=minimal' });
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true, count: rows.length }) };
    }

    // DELETE — usuń klienta po id (RODO: prawo do bycia zapomnianym)
    if (event.httpMethod === 'DELETE') {
      const { id } = JSON.parse(event.body || '{}');
      if (!id) {
        return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'missing_id' }) };
      }
      await sb('klienci?id=eq.' + encodeURIComponent(id), 'DELETE', null, { 'Prefer': 'return=minimal' });
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'method_not_allowed' }) };
  } catch (err) {
    console.error('clients.js error:', err.message);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
