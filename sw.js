const CACHE_NAME = 'ploc-v14';
const ASSETS = [
  '/',
  '/index.html',
  '/css/theme.css',
  '/css/app.css',
  '/js/main.js',
  '/js/router.js'
];

// Instalação e Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e Limpeza de Cache Antigo
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estratégia: Network First para garantir que mudanças no JS apareçam
self.addEventListener('fetch', (event) => {
  // Se for uma navegação (URL sem extensão), servir o index.html (SPA logic)
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch('/index.html'));
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
