const CACHE_NAME = 'ploc-cache-v2';
const ASSETS = [
  '/',
  '/login.html',
  '/dashboard.html',
  '/index.css',
  '/manifest.json',
  '/assets/icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache v2 aberto');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Força a ativação imediata
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Assume o controle das abas abertas imediatamente
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
