const CACHE_NAME = 'ploc-v0.1.3-RECOVERY';
const ASSETS = [
  './',
  'index.html',
  'css/theme.css',
  'css/app.css',
  'app/main.js',
  'app/router.js',
  'shared/config/config.js',
  'shared/api/client.js',
  'icon-192.png',
  'icon-512.png',
  'screenshot.png'
];

// Instalação Robusta
self.addEventListener('install', (event) => {
  console.log('SW: Instalando Versão', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Tenta baixar um por um para não quebrar se um falhar
      return Promise.allSettled(
        ASSETS.map(url => {
          return cache.add(url).catch(err => console.error('SW: Erro ao cachear:', url, err));
        })
      );
    })
  );
  self.skipWaiting();
});

// Ativação e Limpeza
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
  console.log('SW: Ativo e Pronto');
});

// Estratégia Fetch: Stale-While-Revalidate (Cache primeiro, mas atualiza em background)
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch('index.html').catch(() => caches.match('index.html')));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});
