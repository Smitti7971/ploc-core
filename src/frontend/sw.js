const CACHE_NAME = 'ploc-cache-v9';
// Removemos dashboard.html do pré-cache para evitar 401 na tela de login
const ASSETS_TO_PRECACHE = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/screenshot-mobile.png',
  '/assets/screenshot-desktop.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache v5 - Pré-carregando apenas arquivos públicos');
      return Promise.allSettled(
        ASSETS_TO_PRECACHE.map(url => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Cache First para estáticos, Network First para o resto
self.addEventListener('fetch', (event) => {
  // Não interceptamos chamadas de API do backend aqui para evitar confusão com tokens
  if (event.request.url.includes('/api/')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchRes) => {
        // Se for uma navegação para o dashboard, cacheamos agora que o usuário acessou
        if (event.request.url.includes('dashboard.html')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        }
        return fetchRes;
      });
    }).catch(() => {
      // Silenciar erros de rede no console do usuário
    })
  );
});
