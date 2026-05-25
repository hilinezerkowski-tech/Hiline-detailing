// DEPRECATED - nie uzywaj. Aktualna funkcja: netlify/functions/subscribe.js
// Stara wersja zawierala zahardkodowany token (security). Wygeneruj nowy token w MailerLite.
module.exports = {
  handler: async function() {
    return {
      statusCode: 410,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Deprecated. Use /.netlify/functions/subscribe instead.' })
    };
  }
};
