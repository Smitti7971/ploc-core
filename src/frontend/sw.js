const CACHE_NAME = 'ploc-pwa-v12'; // Versão SPA
// Lista completa de arquivos vitais para o funcionamento offline
const ASSETS_TO_PRECACHE = [
    './',
    './index.html',
    './css/theme.css',
    './css/app.css',
    './css/landing.css',
    './css/login.css',
    './css/dashboard.css',
    './js/main.js',
    './js/ui.js',
    './js/api/client.js',
    './js/api/auth.js',
    './js/components/Avatar.js',
    './js/components/LandingView.js',
    './js/components/LoginView.js',
    './js/components/RegisterView.js',
    './js/components/DashboardView.js',
    './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache v10 - Pré-carregando sistema completo');
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
