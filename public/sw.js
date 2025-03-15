const CACHE_NAME = 'brasilit-v2';
const RUNTIME_CACHE = 'runtime-cache';

// Arquivos para cache inicial
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Variáveis para monitoramento
let networkRequestCount = 0;
let cacheHitCount = 0;
let totalOfflineTime = 0;
let lastOfflineStart = null;
let isOnline = true;

// Instalação do Service Worker
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
  
  // Notifica o MCP Browser Tools que o service worker está ativo
  if ('serviceWorkerBrowserTools' in self) {
    self.serviceWorkerBrowserTools.ready();
  }
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
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

// Estratégia de cache: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não GET ou para outras origens (CORS)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  networkRequestCount++;
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Armazena a resposta no cache runtime
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(RUNTIME_CACHE)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.log('[ServiceWorker] Erro de fetch:', error);
            return null;
          });
          
        if (cachedResponse) {
          cacheHitCount++;
          console.log('[ServiceWorker] Cache hit for:', event.request.url);
          // Retorna cached response imediatamente, mas atualiza o cache em background
          return cachedResponse || fetchPromise;
        }
        
        return fetchPromise;
      })
  );
});

// Interceptação de mensagens (para comunicação com MCP Browser Tools)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_STATS') {
    // Envia estatísticas para o cliente
    event.ports[0].postMessage({
      networkRequests: networkRequestCount,
      cacheHits: cacheHitCount,
      offlineTime: totalOfflineTime,
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