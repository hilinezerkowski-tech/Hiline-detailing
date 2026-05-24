const TOKEN = process.env.MAILERLITE_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYzE0NjQyMTc0OWNkMmU4Zjk4ZGFkMDYzOTkzYWU3NTYxMTFmODI1Yjc2ZTA4NWFiNmQ5MjYzZTE4NzA0MTdlNWJjOTQzMmUzMDA5OGVlZjUiLCJpYXQiOjE3Nzk2MDc0NTguNDIzMzMxLCJuYmYiOjE3Nzk2MDc0NTguNDIzMzM2LCJleHAiOjQ5MzUyODEwNTguNDE0OTUzLCJzdWIiOiIyMzUzMjM3Iiwic2NvcGVzIjpbXX0.gN1wBQed8W2HWO_vnUI2ArS01zt7DHsud5ye93bDFHVpkdUvB1SnNcu_Nx53lncmaFh66Mm0ymyex4AX8CAorUNAyyCZLPUA0e-B1npWav8KwonMYKbnaL1SaCXzXy5TisLr6vAPOUuehcy1lL5k0AYtSYsWZCU7xzGfQc44GlJHiVHQ2KnjGvTwAANo-RspSBzTHtaoC5UW6LiMt2HfqxJ36y7JDaZgX55PYzBqGwMKKioGEu9sU_Yxafyn_pzVP16MeaagAXmt0W93GBQZzsJj4bq3ElIIM8ON_ce4Ca5Sg-Ujn3Yi6UEocByZ_E44vGi_MM5xA0YTE421EbOPYq1ZKPE37Mad0AAmdusHUwXgxOyoud92tV0OMeWtvm9kihqpag8_b_NXolxevoU8is6EMSwiDNTYqhB4BUwjcIG6G0qd2OHteoD8PmFgY-DahzNNxErxNi62vr-j9LYK2uGdvD1-UPFkrhBCVLfHqD5FTSlX-wxXswWOZomKIPUgdt8rCk0Ff-oO_IO9YX5AWrzH7kWnY2yNrYfZHgUj16IByKh_wzKSBJTw5RQbSc-oEjeI_v-rr9dW7CUGToT7UW5zVT5kIO7eX7aVOOy0DC0NR-temQWL7iNZraSm-SQYlbEVA6QyCqTmGRE4QSLLZOBdrsu3WcZNFq8TNX5dm6M';
const API = 'https://connect.mailerlite.com/api';

// Mapowanie service_type → group IDs w MailerLite
const SERVICE_GROUPS = {
  'powloka_3letnia': { groups: ['188330160868558362', '188330186222077064', '187079609224791396'] }, // Powłoka 3-letnia + Promocje + Klienci Hiline
  'powloka_5letnia': { groups: ['188330170388580174', '188330186222077064', '187079609224791396'] }, // Powłoka 5-letnia + Promocje + Klienci Hiline
  'folia_ppf':       { groups: ['188330178207811581', '188330186222077064', '187079609224791396'] }, // Folia PPF + Promocje + Klienci Hiline
  'promocje':        { groups: ['188330186222077064', '187079609224791396'] }                         // Promocje + Klienci Hiline
};
const DEFAULT_GROUP_ID = '187079609224791396'; // Domyślna grupa

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Custom fields potrzebne w MailerLite
// Tworzone automatycznie przy pierwszym użyciu
const CUSTOM_FIELDS = [
  { name: 'Pojazd',       key: 'pojazd',       type: 'text' },
  { name: 'Usługa',       key: 'usluga',       type: 'text' },
  { name: 'Data serwisu', key: 'data_serwisu', type: 'date' },
  { name: 'Powłoka',      key: 'powloka',      type: 'text' },
];

async function mlFetch(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, opts);
  let data = null;
  try { data = await res.json(); } catch(e) {}
  return { ok: res.ok, status: res.status, data };
}

async function ensureCustomFields() {
  // Pobierz istniejące pola
  const { data } = await mlFetch('/fields?limit=100');
  const existing = (data?.data || []).map(f => f.key);

  for (const field of CUSTOM_FIELDS) {
    if (!existing.includes(field.key)) {
      await mlFetch('/fields', 'POST', { name: field.name, type: field.type });
    }
  }
}

exports.handler = async function(event) {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    let data = {};
    try {
      data = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Błąd parsowania JSON' })
      };
    }

    // Walidacja obowiązkowych pól
    if (!data.email) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Email jest wymagany' })
      };
    }

    // Upewnij się że custom fields istnieją w MailerLite
    await ensureCustomFields();

    const [first_name, ...rest] = (data.name || '').split(' ');
    const last_name = rest.join(' ');

    // Data serwisu — dziś jeśli nie podano
    const dataSerwisu = data.dataSerwisu || new Date().toISOString().split('T')[0];

    // Pobierz grupy na podstawie typu usługi
    const serviceType = data.service_type || 'promocje';
    const groupConfig = SERVICE_GROUPS[serviceType] || { groups: [DEFAULT_GROUP_ID] };
    const groupIds = groupConfig.groups.filter(id => id); // Usuń puste stringi

    // Mapowanie usługi na powłokę
    let powlokaValue = data.powloka || '';
    if (!powlokaValue && data.service_type) {
      const powlokaMap = {
        'powloka_3letnia': 'Powłoka ceramiczna 3-letnia',
        'powloka_5letnia': 'Powłoka ceramiczna 5-letnia',
        'folia_ppf': 'Folia PPF',
        'promocje': ''
      };
      powlokaValue = powlokaMap[data.service_type] || '';
    }

    const payload = {
      email: data.email,
      fields: {
        // Standardowe pola MailerLite
        name:      first_name || '',
        last_name: last_name  || '',
        phone:     data.tel   || '',
        // Custom fields Hiline
        pojazd:       data.car     || '',
        usluga:       data.usluga  || '',
        data_serwisu: dataSerwisu,
        powloka:      powlokaValue,
      },
      groups: groupIds,
      status: 'active'
    };

    console.log('📤 Wysyłam do MailerLite:', {
      email: data.email,
      name: first_name,
      tel: data.tel,
      car: data.car,
      usluga: data.usluga,
      service_type: serviceType,
      groups: groupIds
    });

    const { ok, status, data: result } = await mlFetch('/subscribers', 'POST', payload);

    if (!ok) {
      console.error('❌ MailerLite error:', result);
      return {
        statusCode: status,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: result?.message || 'Błąd MailerLite' })
      };
    }

    console.log('✅ Subscriber saved:', result?.data?.id, 'Email:', data.email, 'Grupy:', groupIds);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        id: result?.data?.id,
        email: data.email,
        groups: groupIds
      })
    };

  } catch (err) {
    console.error('❌ Function error:', err.message);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message })
    };
  }
};
