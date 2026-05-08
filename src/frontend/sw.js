const CACHE_NAME = 'ploc-v0.2.0';
const ASSETS = [
  '/',
  '/index.html',
  '/css/theme.css',
  '/css/app.css',
  '/js/main.js',
  '/js/router.js',
  '/js/components/LandingPage.js',
  '/js/components/DashboardPage.js',
  '/js/components/CalendarPage.js',
  '/js/components/KanbanPage.js',
  '/js/components/SettingsPage.js',
  '/icon-192.png',
  '/icon-512.png',
  '/screenshot.png'
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

// Estratégia Fetch
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch('/index.html').catch(() => caches.match('/index.html')));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
