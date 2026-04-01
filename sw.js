// Service Worker para FeiraMini
const CACHE_NAME = 'feiramini-v1';

// Lista de arquivos que queremos cachear (apenas os que existem)
const urlsToCache = [
  '/FeiraMini/',
  '/FeiraMini/index.html',
  '/FeiraMini/css/style.css',
  '/FeiraMini/js/script.js',
  '/FeiraMini/manifest.json'
];

// Instalação - cacheia os arquivos
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cacheando arquivos');
        // Cacheia cada arquivo individualmente para evitar erros
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.log(`[Service Worker] Falha ao cachear: ${url}`, err);
            });
          })
        );
      })
  );
});

// Ativação - limpa caches antigos
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
        // Cache hit - retorna do cache
        if (response) {
          return response;
        }
        // Se não está no cache, busca da rede
        return fetch(event.request).catch(err => {
          console.log('[Service Worker] Falha ao buscar:', event.request.url);
          // Pode retornar uma página offline aqui se quiser
          return new Response('Offline - FeiraMini', {
            status: 200,
            headers: new Headers({ 'Content-Type': 'text/html' })
          });
        });
      })
  );
});
