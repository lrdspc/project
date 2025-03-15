const CACHE_NAME = 'brasilit-cache-v1';
const RUNTIME_CACHE = 'runtime-cache';

// Lista de recursos que devem ser cacheados para funcionamento offline
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  // Adicione aqui outros arquivos essenciais (CSS, JS)
];

// Variáveis para monitoramento
let networkRequestCount = 0;
let cacheHitCount = 0;
let totalOfflineTime = 0;
let lastOfflineStart = null;
let isOnline = true;

// Instalação do service worker - pré-cachear recursos
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força a ativação imediata
  
  console.log('[ServiceWorker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[ServiceWorker] Instalação concluída');
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Ativando...');
  
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Se o nome do cache não estiver na whitelist, excluí-lo
            console.log('[ServiceWorker] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Ativação concluída');
      return self.clients.claim(); // Toma controle de clientes abertos
    })
  );
});

// Monitoramento de estado online/offline
self.addEventListener('online', () => {
  console.log('[ServiceWorker] Dispositivo está online');
  isOnline = true;
  
  if (lastOfflineStart) {
    const offlineDuration = Date.now() - lastOfflineStart;
    totalOfflineTime += offlineDuration;
    lastOfflineStart = null;
    
    console.log(`[ServiceWorker] Tempo offline: ${offlineDuration/1000}s, Total: ${totalOfflineTime/1000}s`);
  }
});

self.addEventListener('offline', () => {
  console.log('[ServiceWorker] Dispositivo está offline');
  isOnline = false;
  lastOfflineStart = Date.now();
});

// Interceptar requisições e servir do cache quando possível
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retornar resposta do cache
        if (response) {
          return response;
        }

        // Clonar a requisição porque é um stream que só pode ser consumido uma vez
        const fetchRequest = event.request.clone();

        // Tentar buscar o recurso da rede
        return fetch(fetchRequest)
          .then((response) => {
            // Verificar se recebemos uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar a resposta porque é um stream que só pode ser consumido uma vez
            const responseToCache = response.clone();

            // Abrir o cache e armazenar a resposta
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // Se falhar tudo, tente servir uma página offline
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Simplificando a interceptação de mensagens
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_STATS') {
    // Envia estatísticas básicas para o cliente
    event.ports[0].postMessage({
      networkRequests: networkRequestCount,
      cacheHits: cacheHitCount,
      isOnline: isOnline
    });
  }
});

// Auto-limpeza de cache periódica (a cada 7 dias)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        // Remove entradas mais antigas que 7 dias
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        
        return cache.keys().then((requests) => {
          return Promise.all(
            requests.map((request) => {
              return cache.match(request).then((response) => {
                if (response && response.headers.get('date')) {
                  const dateHeader = response.headers.get('date');
                  const responseDate = new Date(dateHeader).getTime();
                  
                  if (responseDate < oneWeekAgo) {
                    return cache.delete(request);
                  }
                }
              });
            })
          );
        });
      })
    );
  }
});