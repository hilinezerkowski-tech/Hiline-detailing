const TOKEN = process.env.MAILERLITE_TOKEN;
const API = 'https://connect.mailerlite.com/api';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;
if (!TOKEN) { console.error('brak tokena'); }
const SERVICE_GROUPS = {
  'powloka_3letnia': { groups: ['188330160868558362', '188330186222077064', '187079609224791396'] },
  'powloka_5letnia': { groups: ['188330170388580174', '188330186222077064', '187079609224791396'] },
  'folia_ppf':       { groups: ['188330178207811581', '188330186222077064', '187079609224791396'] },
  'promocje':        { groups: ['188330186222077064', '187079609224791396'] }
};
const DEFAULT_GROUP_ID = '187079609224791396';
const CORS_HEADERS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Content-Type': 'application/json' };
const CUSTOM_FIELDS = [
  { name: 'Pojazd', key: 'pojazd', type: 'text' },
  { name: 'Usługa', key: 'usluga', type: 'text' },
  { name: 'Data serwisu', key: 'data_serwisu', type: 'date' },
  { name: 'Powłoka', key: 'powloka', type: 'text' },
];
async function mlFetch(path, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, opts);
  let data = null;
  try { data = await res.json(); } catch(e) {}
  return { ok: res.ok, status: res.status, data };
}
async function ensureCustomFields() {
  const { data } = await mlFetch('/fields?limit=100');
  const existing = (data?.data || []).map(f => f.key);
  for (const field of CUSTOM_FIELDS) {
    if (!existing.includes(field.key)) { await mlFetch('/fields', 'POST', { name: field.name, type: field.type }); }
  }
}
exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  try {
    let data = {};
    try { data = JSON.parse(event.body); } catch (e) { return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Błąd parsowania JSON' }) }; }
    if (!data.email) return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Email jest wymagany' }) };
    await ensureCustomFields();
    const [first_name, ...rest] = (data.name || '').split(' ');
    const last_name = rest.join(' ');
    const dataSerwisu = data.dataSerwisu || new Date().toISOString().split('T')[0];
    const serviceType = data.service_type || 'promocje';
    const groupConfig = SERVICE_GROUPS[serviceType] || { groups: [DEFAULT_GROUP_ID] };
    const groupIds = groupConfig.groups.filter(id => id);
    let powlokaValue = data.powloka || '';
    if (!powlokaValue && data.service_type) {
      const powlokaMap = { 'powloka_3letnia': 'Powłoka ceramiczna 3-letnia', 'powloka_5letnia': 'Powłoka ceramiczna 5-letnia', 'folia_ppf': 'Folia PPF', 'promocje': '' };
      powlokaValue = powlokaMap[data.service_type] || '';
    }
    const payload = { email: data.email, fields: { name: first_name || '', last_name: last_name || '', phone: data.tel || '', pojazd: data.car || '', usluga: data.usluga || '', data_serwisu: dataSerwisu, powloka: powlokaValue }, groups: groupIds, status: 'active' };
    const { ok, status, data: result } = await mlFetch('/subscribers', 'POST', payload);
    if (!ok) { console.error('ML error:', result); return { statusCode: status, headers: CORS_HEADERS, body: JSON.stringify({ error: result?.message || 'Błąd MailerLite' }) }; }
    if (SUPABASE_URL && SERVICE_KEY && data.source !== 'panel') {
      try {
        const clientId = 'pub_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
        const clientRecord = { id: clientId, name: data.name || '', email: data.email || '', tel: data.tel || '', car: data.car || '', usluga: data.usluga || '', service_type: serviceType, dataSerwisu: dataSerwisu, dataAdded: new Date().toISOString().split('T')[0], zrodlo: 'formularz_publiczny', addedAt: new Date().toISOString() };
        const sbRes = await fetch(SUPABASE_URL + '/rest/v1/klienci?on_conflict=id', { method: 'POST', headers: { 'apikey': SERVICE_KEY, 'Authorization': 'Bearer ' + SERVICE_KEY, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify([{ id: clientId, dane: clientRecord, updated_at: new Date().toISOString() }]) });
        if (sbRes.ok) { console.log('Supabase OK:', clientId); } else { console.error('Supabase error:', sbRes.status, await sbRes.text()); }
      } catch (sbEx) { console.error('Supabase exception:', sbEx.message); }
    }
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true, id: result?.data?.id, email: data.email, groups: groupIds }) };
  } catch (err) { console.error('Function error:', err.message); return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: err.message }) }; }
};
