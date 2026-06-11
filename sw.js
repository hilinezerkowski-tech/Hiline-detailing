// Hiline CRM — Service Worker (offline mode + cache)
// Wersja cache — zmień przy każdym deployu żeby wymusić odświeżenie
const CACHE_VERSION = 'hiline-v4';
const CACHE_NAME = `hiline-cache-${CACHE_VERSION}`;

// Pliki które chcemy zachować w cache do działania offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/panel.html',
  '/qr-google-reviews.html',
  '/manifest.json',
  '/manifest-panel.json',
  '/icon-192.png',
  '/icon-512.png'
];

// INSTALL — załaduj wszystkie statyczne pliki do cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ACTIVATE — usuń stare wersje cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// FETCH — strategia: network-first dla API (MailerLite), cache-first dla statyki
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Pomiń requesty inne niż GET (np. POST do MailerLite Function)
  if (event.request.method !== 'GET') return;

  // Pomiń requesty do MailerLite / Netlify Functions (zawsze idą online)
  if (url.pathname.startsWith('/.netlify/') || url.host.includes('mailerlite')) {
    return;
  }

  const isHTML = event.request.mode === 'navigate' ||
    event.request.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    // HTML: network-first — zawsze świeża wersja, cache tylko jako fallback offline.
    // Dzięki temu zmiany w panelu są widoczne od razu po deployu (bez podbijania wersji).
    event.respondWith(
      fetch(event.request).then(resp => {
        if (resp.ok && url.origin === self.location.origin) {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, respClone));
        }
        return resp;
      }).catch(() =>
        caches.match(event.request).then(cached => cached || caches.match('/panel.html'))
      )
    );
    return;
  }

  // Statyka (ikony, obrazki, manifesty): cache-first, fallback do sieci
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(resp => {
        // Sklonuj odpowiedź i wrzuć do cache (tylko 200 same-origin)
        if (resp.ok && url.origin === self.location.origin) {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, respClone));
        }
        return resp;
      });
    })
  );
});
