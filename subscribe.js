exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiYjYxMTQ3NmVlOTBiZDg2MzU1OTBkZDMxZjdkZTZhY2NkZjg3NjM4MWQ2ODA2ZGQ2YzVmZDE2ZWUxNTM1MzYyYmE1NTYwNmFhODIxMDExMzgiLCJpYXQiOjE3Nzg0MTExOTcuNzIzOTc3LCJuYmYiOjE3Nzg0MTExOTcuNzIzOTgsImV4cCI6NDkzNDA4NDc5Ny43MTQ0Niwic3ViIjoiMjM1MzIzNyIsInNjb3BlcyI6W119.lU_Jl0stg78SRPh2w_y2vbR43eX7HtuNpmEsyphANCzNifA4-g4frkVtqDo0yjbwxK-_HmvvIxLTCp_Et4EvgZJAeUJAx6OPWXJCx6hOdIK19wrtclS8ch7wPI2vUZo5aQQDxvgnmZ-VnmKL7QWWFyL4DagKfdE27DlnY45_LBHmSkiMluLf9lWef_4pYdDkH3rG4L6-7GbbYI3DcrbRlJNDBSEgvv0wR2KISR2B6iCsns_21H_iXzPxrJezEj4E8CyaIqwn7TwmYKL60Taox2W8e7m6S3LXb2iQvzjHfwZdsDeXSwyigQduyfoPNTmuv2p6cfuzh-U9eCYD6J44NdxTh70PE8gfh2ivRp_RoHJ6YBDGlecW_hT55G6NI5nG8DC_z8FLLhqA7Gj5_3ZbAFGSWaqDMgzUtj2eI3a1irOlMuNnLYvFhEn302NqyFm2Ii-Km9XaRlJemOdvXvyqsJnetNwKs8L278DiH2LN-4RKSMaOcdq9U2E1Im_9ZfygxFSfWq5OkS5d25Zbmrx1du2meW4DxJyMlPLrctR_Rq6PYYl2iVY7Cc4tpZMmZXXZJNzWCHi5iO5K6Ql4E1RbOs-DF69bWbLoRr8ExVcgImz_N3cMPOMEod_IFUnEtbPZhKoo7QjrJ1Ljpx-gjcdtlVTjmVH0Rj9FOIJHgZS67mk';
  const GROUP_ID = '187079609224791396';

  try {
    const data = JSON.parse(event.body);
    const [first_name, ...rest] = (data.name || '').split(' ');
    const last_name = rest.join(' ');

    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`
      },
      body: JSON.stringify({
        email: data.email,
        fields: {
          name: first_name,
          last_name: last_name,
          phone: data.tel || '',
          company: data.car || '',
          city: data.usluga || ''
        },
        groups: [GROUP_ID]
      })
    });

    const result = await response.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
