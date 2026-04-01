// Service Worker para FeiraMini
const CACHE_NAME = 'feiramini-v1';
const urlsToCache = [
  '/FeiraMini/',
  '/FeiraMini/index.html',
  '/FeiraMini/css/style.css',
  '/FeiraMini/js/script.js',
  '/FeiraMini/manifest.json'
];

// Instalação
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('[Service Worker] Erro ao cachear:', err))
  );
});

// Ativação
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercepta requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
