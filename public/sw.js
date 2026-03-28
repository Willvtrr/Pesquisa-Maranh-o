const CACHE_NAME = 'focco-analytics-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  'https://picsum.photos/seed/focco-icon-192/192/192',
  'https://picsum.photos/seed/focco-icon-512/512/512'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});