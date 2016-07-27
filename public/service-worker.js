importScripts('/js/cache-polyfill.js');

// Cache files on `install`
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('pad').then(function(cache) {
      return cache.addAll([
        '/',
        '/js/index.js',
        '/css/normalize.css',
        '/css/style.css'
      ]);
    })
  );
});

// Intercept requests and serve some from the cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});